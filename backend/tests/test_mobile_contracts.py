"""Usage: PYTHONPATH=backend pytest backend/tests/test_mobile_contracts.py.
HTTP witnesses use an isolated in-memory Mongo stand-in and mocked providers;
no account credentials, external OAuth calls, or persistent test writes.
"""
# === CHECKS ===
# id: check_native_oauth_proof_once
#   proves: native_oauth_proof_once
#   call: self::test_proof_expiry_and_replay
#   mutates: none
#   cleanup: none
# id: check_native_oauth_callback_boundary
#   proves: native_oauth_callback_boundary
#   call: self::test_native_provider_round_trip
#   mutates: none
#   cleanup: none
# === END CHECKS ===
import copy
from datetime import datetime, timedelta, timezone
from urllib.parse import parse_qs, urlsplit
from unittest.mock import AsyncMock

import httpx
import pytest
from cryptography.fernet import Fernet


class Records:
    def __init__(self):
        self.rows = {}

    def match(self, query):
        for row in self.rows.values():
            if all((row.get(k) > v['$gt'] if isinstance(v, dict) and '$gt' in v else row.get(k) == v) for k, v in query.items()):
                return row

    async def insert_one(self, row):
        self.rows[row['_id']] = copy.deepcopy(row)

    async def find_one_and_update(self, query, update):
        row = self.match(query)
        if row is None:
            return None
        before = copy.deepcopy(row)
        row.update(update['$set'])
        return before

    async def update_one(self, query, update):
        row = self.match(query)
        if row is not None:
            row.update(update['$set'])

    async def find_one_and_delete(self, query):
        row = self.match(query)
        return self.rows.pop(row['_id']) if row else None

    async def delete_one(self, query):
        await self.find_one_and_delete(query)


@pytest.fixture
def runtime(monkeypatch, tmp_path):
    for key, value in {
        'MONGO_URL': 'mongodb://localhost:27017', 'DB_NAME': 'mobile_test',
        'JWT_SECRET': 'test-only-mobile-secret-at-least-32-bytes', 'CORS_ORIGINS': 'https://web.example',
        'PUBLIC_BACKEND_URL': 'https://vm.example', 'GITHUB_CLIENT_ID': 'test-client',
        'GITHUB_CLIENT_SECRET': 'test-provider-secret',
        'A0P_KEY_VAULT_SECRET': Fernet.generate_key().decode(),
        'A0P_AGENTS_ROOT': str(tmp_path / 'agents'), 'A0P_AUDIT_STORAGE_ROOT': str(tmp_path / 'audit'),
        'A0P_TRAFFIC_LOG': str(tmp_path / 'traffic.log'),
    }.items():
        monkeypatch.setenv(key, value)
    import server, auth, db
    from auth import mobile
    records = Records()
    monkeypatch.setattr(db, 'mobile_oauth_col', records)
    user = {'_id': 'owner', 'email': 'owner@example.org', 'username': 'owner'}
    monkeypatch.setattr(db, 'users_col', type('Users', (), {'find_one': AsyncMock(side_effect=lambda q: copy.deepcopy(user) if q.get('_id') == 'owner' else None)})())
    provider = AsyncMock(return_value={'user': {'id': 'owner'}, 'access_token': 'must-not-leak'})
    monkeypatch.setattr(auth, 'oauth_google', provider)
    monkeypatch.setattr(auth, 'oauth_github_callback', provider)
    return server.app, mobile, records, provider


@pytest.mark.asyncio
async def test_mobile_cors_and_bearer_are_real_http_contracts(runtime):
    app, _, _, _ = runtime
    import auth
    token, _ = auth._make_tokens('owner', 'owner@example.org')
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='https://vm.example') as cli:
        preflight = await cli.options('/api/auth/login', headers={'Origin': 'https://localhost', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'authorization,content-type'})
        assert preflight.status_code == 200
        assert preflight.headers['access-control-allow-origin'] == 'https://localhost'
        assert preflight.headers['access-control-allow-credentials'] == 'true'
        denied = await cli.options('/api/auth/login', headers={'Origin': 'https://attacker.example', 'Access-Control-Request-Method': 'POST'})
        assert denied.status_code == 400
        assert 'access-control-allow-origin' not in denied.headers
        health = await cli.get('/api/health', headers={'Origin': 'https://localhost'})
        assert health.json()['service'] == 'a0p'
        assert (await cli.get('/api/auth/me')).status_code == 401
        me = await cli.get('/api/auth/me', headers={'Authorization': f'Bearer {token}'})
        assert me.status_code == 200 and me.json()['user']['id'] == 'owner'
        assert (await cli.get('/api/auth/me', headers={'Authorization': 'Bearer invalid'})).status_code == 401


@pytest.mark.asyncio
@pytest.mark.parametrize('provider', ['github', 'google'])
async def test_native_provider_round_trip(runtime, provider):
    app, mobile, records, mock = runtime
    verifier = 'v' * 43
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='https://vm.example') as cli:
        start = (await cli.post('/api/auth/oauth/mobile/start', json={'provider': provider, 'code_challenge': mobile.challenge(verifier)})).json()
        state = start['state']
        params = parse_qs(urlsplit(start['url']).query)
        if provider == 'github':
            assert params['state'] == [state]
            assert params['code_challenge'] == [mobile.challenge(mobile.github_verifier(state))]
            assert params['redirect_uri'] == ['https://vm.example/api/auth/oauth/mobile/callback']
        else:
            assert params['redirect'][0].startswith('https://vm.example/api/auth/oauth/mobile/callback?state=')
        key = 'code' if provider == 'github' else 'session_id'
        complete = await cli.post('/api/auth/oauth/mobile/complete', json={'state': state, key: 'provider-credential'})
        assert complete.status_code == 200
        assert complete.json() == {'url': f'org.interdependentway.a0://oauth/callback?state={state}'}
        assert 'must-not-leak' not in str(records.rows)
        assert 'provider-credential' not in str(records.rows)
        if provider == 'github':
            assert mock.call_args.args[0].code_verifier == mobile.github_verifier(state)
        response = await cli.post('/api/auth/oauth/mobile/exchange', json={'state': state, 'code_verifier': verifier})
        assert response.status_code == 200 and response.json()['user']['id'] == 'owner'
        assert 'set-cookie' not in response.headers
        assert response.headers['cache-control'] == 'no-store'
        replay = await cli.post('/api/auth/oauth/mobile/exchange', json={'state': state, 'code_verifier': verifier})
        assert replay.status_code == 400


@pytest.mark.asyncio
async def test_proof_expiry_and_replay(runtime):
    app, mobile, records, _ = runtime
    verifier, state = 'v' * 43, 's' * 43
    row = {'_id': state, 'challenge': mobile.challenge(verifier), 'status': 'complete', 'user_id': 'owner', 'expires_at': datetime.now(timezone.utc) + timedelta(minutes=1)}
    records.rows[state] = row
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='https://vm.example') as cli:
        wrong = await cli.post('/api/auth/oauth/mobile/exchange', json={'state': state, 'code_verifier': 'wrong' * 10})
        assert wrong.status_code == 400 and state in records.rows
        row['expires_at'] = datetime.now(timezone.utc) - timedelta(seconds=1)
        assert (await cli.post('/api/auth/oauth/mobile/exchange', json={'state': state, 'code_verifier': verifier})).status_code == 400
        row['expires_at'] = datetime.now(timezone.utc) + timedelta(minutes=1)
        row['status'] = 'pending'
        assert (await cli.post('/api/auth/oauth/mobile/exchange', json={'state': state, 'code_verifier': verifier})).status_code == 400


@pytest.mark.asyncio
async def test_callback_headers_and_provider_mismatch(runtime, monkeypatch):
    app, mobile, records, provider = runtime
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url='https://vm.example') as cli:
        page = await cli.get('/api/auth/oauth/mobile/callback?state=untrusted')
        assert 'untrusted' not in page.text
        assert page.headers['referrer-policy'] == 'no-referrer'
        assert "frame-ancestors 'none'" in page.headers['content-security-policy']
        state = (await cli.post('/api/auth/oauth/mobile/start', json={'provider': 'github', 'code_challenge': mobile.challenge('v'*43)})).json()['state']
        result = await cli.post('/api/auth/oauth/mobile/complete', json={'state': state, 'session_id': 'wrong-provider'})
        assert result.status_code == 400 and state not in records.rows
        provider.assert_not_called()
        monkeypatch.setenv('PUBLIC_BACKEND_URL', 'https://vm.example/arbitrary-path')
        assert (await cli.post('/api/auth/oauth/mobile/start', json={'provider': 'github', 'code_challenge': mobile.challenge('v'*43)})).status_code == 503
