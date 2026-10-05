"""Native OAuth bridge. See frontend/ANDROID_APK.md for deployment and use.

The browser completes OAuth at A0's HTTPS origin. Only an opaque transaction ID
returns via the custom scheme; an S256 proof held by the initiating app is
required to obtain an access JWT. Transactions expire in ten minutes and can be
consumed once. Provider credentials and A0 JWTs never enter a deep link or Mongo.
"""
# === MODULE_BUILD ===
# id: native_oauth_bridge
#   module_name: auth.mobile
#   module_kind: route
#   summary: proof-bound one-use browser-to-Capacitor authentication bridge
#   owner: a0p maintainer
#   public_surface: /api/auth/oauth/mobile/{start,callback,complete,exchange}
#   internal_surface: challenge, github_verifier
#   auth_boundary: write
#   storage_boundary: write
#   network_boundary: external
#   user_data_boundary: write
#   admin_only: false
#   tests: backend/tests/test_mobile_contracts.py
#   rollout: configure PUBLIC_BACKEND_URL and OAuth providers then deploy backend and APK together
#   rollback: revert bridge and native OAuth caller together; password bearer login remains available
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: native_oauth_exchange_boundary
#   summary: expiring Mongo transactions bind provider result and native proof; no credentials in deep links
#   auth_boundary: write
#   storage_boundary: write
#   network_boundary: external
#   user_data_boundary: write
#   admin_only: false
# === END BOUNDARIES ===
# === CONTRACTS ===
# id: native_oauth_proof_once
#   given: a completed native OAuth transaction and a submitted verifier
#   then: only the matching proof can consume an unexpired transaction once
#   class: security
# id: native_oauth_callback_boundary
#   given: a browser completes native OAuth
#   then: redirect carries only an opaque transaction ID and callback destination is fixed
#   class: security
# === END CONTRACTS ===
import base64
import hashlib
import hmac
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Literal
from urllib.parse import urlencode, urlsplit

from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/auth/oauth/mobile")
CALLBACK_SCHEME = "org.interdependentway.a0://oauth/callback"


def collection():
    from db import mobile_oauth_col
    return mobile_oauth_col


def challenge(verifier: str) -> str:
    return base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).decode().rstrip("=")


def github_verifier(state: str) -> str:
    # Server-held GitHub PKCE proof; native app uses a separate S256 proof.
    return hmac.new(os.environ["JWT_SECRET"].encode(), ("native-oauth:" + state).encode(), hashlib.sha256).hexdigest()


def callback_origin() -> str:
    value = os.environ.get("PUBLIC_BACKEND_URL", "").rstrip("/")
    url = urlsplit(value)
    if url.scheme != "https" or not url.hostname or url.username or url.password or url.path or url.query or url.fragment:
        raise HTTPException(503, "PUBLIC_BACKEND_URL must be the public HTTPS backend origin")
    return value


class StartBody(BaseModel):
    provider: Literal["github", "google"]
    code_challenge: str = Field(pattern=r"^[A-Za-z0-9_-]{43}$")


class CompleteBody(BaseModel):
    state: str = Field(pattern=r"^[A-Za-z0-9_-]{43}$")
    code: str | None = Field(default=None, max_length=2048)
    session_id: str | None = Field(default=None, max_length=2048)


class ExchangeBody(BaseModel):
    state: str = Field(pattern=r"^[A-Za-z0-9_-]{43}$")
    code_verifier: str = Field(pattern=r"^[A-Za-z0-9_-]{43,128}$")


@router.post("/start")
async def start(body: StartBody):
    origin = callback_origin()
    state = secrets.token_urlsafe(32)
    redirect = origin + "/api/auth/oauth/mobile/callback"
    if body.provider == "github":
        cid = os.environ.get("GITHUB_CLIENT_ID")
        if not cid or not os.environ.get("GITHUB_CLIENT_SECRET"):
            raise HTTPException(503, "GitHub OAuth not configured")
        url = "https://github.com/login/oauth/authorize?" + urlencode({
            "client_id": cid, "scope": "read:user user:email", "redirect_uri": redirect,
            "state": state, "code_challenge": challenge(github_verifier(state)), "code_challenge_method": "S256",
        })
    else:
        url = "https://auth.emergentagent.com/?" + urlencode({"redirect": redirect + "?" + urlencode({"state": state})})
    await collection().insert_one({
        "_id": state, "provider": body.provider, "challenge": body.code_challenge,
        "redirect_uri": redirect, "status": "pending",
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=10),
    })
    return {"state": state, "url": url}


# Constant HTML: input is read as data, never interpolated into markup. The
# fragment is scrubbed before network I/O. CSP forbids third-party resources.
CALLBACK_HTML = '''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>A0 sign-in</title></head>
<body><p id="status">Completing A0 sign-in…</p><a id="return" hidden>Return to A0</a><script>
(async () => {
  const query = new URLSearchParams(location.search), hash = new URLSearchParams(location.hash.slice(1));
  const state = query.get('state');
  const body = {state, code: query.get('code'), session_id: hash.get('session_id')};
  history.replaceState(null, '', location.pathname);
  try {
    if (query.get('error')) throw new Error('Sign-in was cancelled. Return to A0 and try again.');
    const response = await fetch('./complete', {method:'POST', credentials:'omit',
      headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
    if (!response.ok) throw new Error('Sign-in failed or expired. Return to A0 and try again.');
    const result = await response.json();
    const link = document.getElementById('return');
    link.href = result.url; link.hidden = false;
    document.getElementById('status').textContent = 'Sign-in complete. Return to A0.';
    location.href = result.url;
  } catch (error) { document.getElementById('status').textContent = error.message; }
})();
</script></body></html>'''


@router.get("/callback", response_class=HTMLResponse)
async def callback():
    return HTMLResponse(CALLBACK_HTML, headers={
        "Cache-Control": "no-store", "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": "default-src 'none'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'",
    })


@router.post("/complete")
async def complete(body: CompleteBody):
    from auth import OAuthGoogleBody, OAuthGithubCodeBody, oauth_google, oauth_github_callback
    record = await collection().find_one_and_update(
        {"_id": body.state, "status": "pending", "expires_at": {"$gt": datetime.now(timezone.utc)}},
        {"$set": {"status": "processing"}},
    )
    if not record:
        raise HTTPException(400, "invalid or expired OAuth transaction")
    try:
        if record["provider"] == "google" and body.session_id and not body.code:
            data = await oauth_google(OAuthGoogleBody(session_id=body.session_id), Response())
        elif record["provider"] == "github" and body.code and not body.session_id:
            data = await oauth_github_callback(OAuthGithubCodeBody(
                code=body.code, code_verifier=github_verifier(body.state), redirect_uri=record["redirect_uri"],
            ), Response())
        else:
            raise HTTPException(400, "OAuth provider callback mismatch")
        await collection().update_one({"_id": body.state}, {"$set": {"status": "complete", "user_id": data["user"]["id"]}})
    except Exception:
        await collection().delete_one({"_id": body.state})
        raise
    return {"url": CALLBACK_SCHEME + "?" + urlencode({"state": body.state})}


@router.post("/exchange")
async def exchange(body: ExchangeBody, response: Response):
    from auth import _make_tokens, _public
    from db import users_col
    # Proof participates in the atomic consume filter: a wrong verifier cannot
    # burn another client's valid transaction. TTL is enforced even before GC.
    record = await collection().find_one_and_delete({
        "_id": body.state, "status": "complete", "challenge": challenge(body.code_verifier),
        "expires_at": {"$gt": datetime.now(timezone.utc)},
    })
    if not record:
        raise HTTPException(400, "invalid, expired, or consumed OAuth transaction")
    user = await users_col.find_one({"_id": record["user_id"]})
    if not user:
        raise HTTPException(401, "user no longer exists")
    access, _ = _make_tokens(user["_id"], user["email"])
    response.headers["Cache-Control"] = "no-store"
    return {"user": _public(user), "access_token": access}
