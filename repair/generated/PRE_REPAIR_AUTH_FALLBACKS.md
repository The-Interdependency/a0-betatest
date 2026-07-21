# Pre-repair shared-auth fallback inventory

Snapshot taken before Repair 01 changes.

```text
backend/a0p_skills/contracts.py:1092:        user_id="local",
backend/a0p_skills/contracts.py:1115:        user_id="local",
backend/a0p_skills/contracts.py:1300:    assert inst.id and inst.user_id == "local" and inst.archived is False
backend/agents/routes.py:103:    user_id: str = "local"
backend/agents/routes.py:109:    user_id: str = "local"
backend/agents/routes.py:123:    user_id: str = "local"
backend/agents/routes.py:135:    user_id: str = "local"
backend/agents/routes.py:150:async def list_instances(request: Request, user_id: str = "local", include_archived: bool = False):
backend/agents/routes.py:166:async def get_instance(agent_id: str, request: Request, user_id: str = "local"):
backend/agents/routes.py:193:async def delete_instance(agent_id: str, request: Request, user_id: str = "local", purge: bool = False):
backend/agents/routes.py:205:async def archive_instance(agent_id: str, request: Request, user_id: str = "local"):
backend/agents/routes.py:221:    ``user_id`` field is ignored). Legacy ``user_id='local'`` agents were migrated
backend/agents/routes.py:73:async def _resolve_user_id(request: Request, fallback: str = "local") -> str:
backend/agents/schema.py:213:    user_id: str = "local"
backend/agents/store.py:108:    async def list(self, user_id: str = "local", include_archived: bool = False) -> list[AgentInstance]:
backend/agents/store.py:118:    async def get(self, agent_id: str, user_id: str = "local") -> Optional[AgentInstance]:
backend/agents/store.py:140:    async def create(self, sheet: CharacterSheet, user_id: str = "local",
backend/agents/store.py:163:        user_id: str = "local",
backend/agents/store.py:177:    async def archive(self, agent_id: str, user_id: str = "local") -> bool:
backend/agents/store.py:184:    async def delete(self, agent_id: str, user_id: str = "local") -> bool:
backend/agents/store.py:208:    async def refresh_metrics(self, agent_id: str, user_id: str = "local") -> Optional[dict]:
backend/auth/__init__.py:17:#   rollback: revert; multi-tenancy collapses to user_id='local' anonymous mode
backend/auth/__init__.py:192:async def get_current_user_or_demo(request: Request) -> dict:
backend/auth/__init__.py:193:    """Return current user OR a synthetic 'demo' user (user_id='local').
backend/auth/__init__.py:32:#   exposes: router, get_current_user, get_current_user_or_demo, init_auth, seed_admin
backend/auth/__init__.py:505:    "get_current_user", "get_current_user_or_demo",
backend/auth/__init__.py:8:#   public_surface: router, get_current_user, get_current_user_or_demo, init_auth, seed_admin
backend/interdependent_lib/zfae/fiq_emit.py:83:    user_id: str = "local",
backend/interdependent_lib/zfae/overrides.py:163:async def list_pending(col, user_id: str = "local", limit: int = 100) -> list[PendingOverride]:
backend/interdependent_lib/zfae/runtime.py:688:        user_id: str = "local",
backend/models.py:121:    user_id: str = Field(default="local")
backend/models.py:138:    user_id: str = Field(default="local")
backend/models.py:146:    user_id: str = Field(default="local")
backend/models.py:155:    user_id: str = Field(default="local")
backend/models.py:56:    user_id: str = Field(default="local")
backend/models.py:75:    user_id: str = Field(default="local")
backend/models.py:92:    user_id: str = Field(default="local")
backend/server.py:1008:    user_id: str = "local"
backend/server.py:1014:    uid = await _auth_uid(request)
backend/server.py:1022:    user_id: str = "local"
backend/server.py:1028:    uid = await _auth_uid(request)
backend/server.py:1068:    # Migrate legacy user_id='local' agents to the admin user (idempotent).
backend/server.py:1072:            {"user_id": "local"}, {"$set": {"user_id": admin["_id"]}},
backend/server.py:1077:        # Migrate legacy user_id='local' BYOK keys + env vault to admin so the
backend/server.py:1082:            async for _doc in _col.find({"user_id": "local"}):
backend/server.py:1097:        # user_id='local'). These rows are id-keyed with no uniqueness
backend/server.py:1104:                {"user_id": "local"}, {"$set": {"user_id": admin["_id"]}},
backend/server.py:147:async def _auth_uid(request: Request) -> str:
backend/server.py:154:    ``get_current_user_or_demo``) — never a caller-supplied value, so a request
backend/server.py:157:    from auth import get_current_user_or_demo
backend/server.py:158:    user = await get_current_user_or_demo(request)
backend/server.py:163:async def list_keys(request: Request, user_id: str = "local"):
backend/server.py:164:    user_id = await _auth_uid(request)
backend/server.py:187:    uid = await _auth_uid(request)
backend/server.py:217:async def delete_key(key_id: str, request: Request, user_id: str = "local"):
backend/server.py:218:    user_id = await _auth_uid(request)
backend/server.py:235:async def list_vault(request: Request, user_id: str = "local"):
backend/server.py:236:    user_id = await _auth_uid(request)
backend/server.py:255:    uid = await _auth_uid(request)
backend/server.py:282:    user_id: str = "local"
backend/server.py:289:    uid = await _auth_uid(request)
backend/server.py:298:async def delete_vault(vault_id: str, request: Request, user_id: str = "local"):
backend/server.py:299:    user_id = await _auth_uid(request)
backend/server.py:306:async def model_inventory(request: Request, user_id: str = "local"):
backend/server.py:308:    user_id = await _auth_uid(request)
backend/server.py:333:async def list_sessions(request: Request, user_id: str = "local"):
backend/server.py:334:    user_id = await _auth_uid(request)
backend/server.py:353:    uid = await _auth_uid(request)
backend/server.py:373:async def get_session(session_id: str, request: Request, user_id: str = "local"):
backend/server.py:374:    uid = await _auth_uid(request)
backend/server.py:383:    uid = await _auth_uid(request)
backend/server.py:404:async def delete_session(session_id: str, request: Request, user_id: str = "local"):
backend/server.py:405:    user_id = await _auth_uid(request)
backend/server.py:412:async def list_drafts(request: Request, user_id: str = "local"):
backend/server.py:413:    user_id = await _auth_uid(request)
backend/server.py:422:    uid = await _auth_uid(request)
backend/server.py:440:    uid = await _auth_uid(request)
backend/server.py:454:async def delete_draft(draft_id: str, request: Request, user_id: str = "local"):
backend/server.py:455:    user_id = await _auth_uid(request)
backend/server.py:513:    user_id: str = "local"
backend/server.py:522:    uid = await _auth_uid(request)
backend/server.py:548:    uid = await _auth_uid(request)
backend/server.py:601:    uid = await _auth_uid(request)
backend/server.py:653:    uid = await _auth_uid(request)
backend/server.py:736:async def list_usage(request: Request, user_id: str = "local", limit: int = 100):
backend/server.py:737:    user_id = await _auth_uid(request)
backend/server.py:822:from auth import init_auth as _init_auth, get_current_user_or_demo
backend/server.py:886:async def get_sentinel_modes(agent_id: str, request: Request, user_id: str = "local"):
backend/server.py:887:    user_id = await _auth_uid(request)
backend/server.py:901:    user_id: str = "local"
backend/server.py:907:    uid = await _auth_uid(request)
backend/server.py:922:    user_id: str = "local"
backend/server.py:928:    uid = await _auth_uid(request)
backend/server.py:944:async def get_sentinel_weights(agent_id: str, request: Request, user_id: str = "local"):
backend/server.py:945:    user_id = await _auth_uid(request)
backend/server.py:963:    user_id: str = "local"
backend/server.py:969:    uid = await _auth_uid(request)
backend/server.py:985:async def list_overrides(request: Request, user_id: str = "local", status: str = "pending", limit: int = 100):
backend/server.py:986:    user_id = await _auth_uid(request)
backend/tests/test_auth_and_extensions.py:287:        r = requests.get(f"{API}/instances/", params={"user_id": "local"}, timeout=30)
```
