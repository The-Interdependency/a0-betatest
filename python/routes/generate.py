# 62:6
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional

# DOC module: generate
# DOC label: Generate
# DOC description: Single-turn text generation prompt routed through a0(zfae)zfae. Authenticated users only; model selection exposed to the caller.
# DOC tier: ws
# DOC endpoint: POST /api/v1/generate | Run a single-turn prompt against the selected energy provider

UI_META = {
    "tab_id": "generate",
    "label": "Generate",
    "icon": "Sparkles",
    "order": 12,
}

router = APIRouter(prefix="/api/v1/generate", tags=["generate"])


class GenerateBody(BaseModel):
    prompt: str
    model: Optional[str] = "gemini"
    system: Optional[str] = None
    max_tokens: int = 2048


@router.post("")
async def generate_text(body: GenerateBody, request: Request):
    uid = request.headers.get("x-user-id")
    if not uid:
        raise HTTPException(status_code=401, detail="Authentication required")

    if not body.prompt.strip():
        raise HTTPException(status_code=422, detail="prompt must not be empty")

    if body.max_tokens < 1 or body.max_tokens > 16000:
        raise HTTPException(status_code=422, detail="max_tokens must be 1–16000")

    from ..services.call_fn import call_model

    messages = [{"role": "user", "content": body.prompt}]
    try:
        content, usage = await call_model(
            body.model or "gemini",
            messages,
            user_id=uid,
            system_prompt=body.system or None,
            max_tokens=body.max_tokens,
            use_tools=False,
        )
    except (ValueError, PermissionError) as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc))

    return {"content": content, "usage": usage, "model": body.model or "gemini"}
# 62:6
