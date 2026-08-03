# ratios: loc_comments=91:56 imports_exports=5:2 calls_definitions=38:2
# === MODULE_BUILD ===
# id: a0p_db_motor
#   module_name: db
#   module_kind: service
#   summary: Motor async client, collection accessors, index ensurance, and bounded legacy audit migration
#   owner: a0p maintainer
#   public_surface: db, keys_col, vault_col, sessions_col, drafts_col, fanout_col, chain_col, agents_col, usage_col, fiq_audit_col, pending_overrides_col, ensure_indexes, backfill_legacy_audit_expiry
#   internal_surface: _client, _MONGO_URL, _DB_NAME
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: internal
#   user_data_boundary: write
#   admin_only: false
#   tests: backend.tests.test_audit_override_confidentiality
#   rollout: default_enabled
#   rollback: drop mongo collections; revert server.py import
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: a0p_db_motor_boundaries
#   summary: Motor async client, collection accessors, index ensurance, and bounded legacy audit migration
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: internal
#   user_data_boundary: write
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: a0p_db_motor
#   summary: Motor async client, collection accessors, index ensurance, and bounded legacy audit migration
#   exposes: db, keys_col, vault_col, sessions_col, drafts_col, fanout_col, chain_col, agents_col, usage_col, fiq_audit_col, pending_overrides_col, ensure_indexes, backfill_legacy_audit_expiry
#   boundaries: auth:none, storage:write, network:internal, user_data:write
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""MongoDB Motor client + collection accessors."""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import UpdateOne

_MONGO_URL = os.environ.get("MONGO_URL")
_DB_NAME = os.environ.get("DB_NAME")
if not _MONGO_URL or not _DB_NAME:
    raise RuntimeError("MONGO_URL / DB_NAME missing")

_client = AsyncIOMotorClient(_MONGO_URL)
db = _client[_DB_NAME]

# Collections
keys_col       = db["byok_keys"]
vault_col      = db["site_vault"]
sessions_col   = db["chat_sessions"]
drafts_col     = db["prompt_drafts"]
fanout_col     = db["fanout_runs"]
chain_col      = db["daisy_chain_runs"]
agents_col     = db["detachable_agents"]
agent_instances_col = db["agent_instances"]
usage_col      = db["usage_records"]
fiq_audit_col  = db["fiq_audit_log"]
pending_overrides_col = db["pending_overrides"]
users_col      = db["users"]
login_attempts_col = db["login_attempts"]
password_reset_tokens_col = db["password_reset_tokens"]
demo_quota_col = db["demo_quota"]
custom_keys_col = db["custom_keys"]
user_tools_col = db["user_tools"]
mcp_servers_col = db["mcp_servers"]
odysseus_servers_col = db["odysseus_servers"]
skills_col = db["skills"]


async def backfill_legacy_audit_expiry(col=None, batch_size: int = 500) -> int:
    """Backfill TTL dates in bounded batches without delaying readiness."""
    if batch_size <= 0:
        raise ValueError("batch_size must be positive")
    from interdependent_lib.zfae.fiq_emit import audit_expiry

    target = fiq_audit_col if col is None else col
    migrated = 0
    batch = []
    async for doc in target.find({"expires_at": {"$exists": False}}, {"timestamp_ms": 1}):
        batch.append(UpdateOne(
            {"_id": doc["_id"], "expires_at": {"$exists": False}},
            {"$set": {"expires_at": audit_expiry(doc.get("timestamp_ms"))}},
        ))
        if len(batch) >= batch_size:
            result = await target.bulk_write(batch, ordered=False)
            migrated += int(getattr(result, "modified_count", 0))
            batch = []
    if batch:
        result = await target.bulk_write(batch, ordered=False)
        migrated += int(getattr(result, "modified_count", 0))
    return migrated


async def ensure_indexes():
    from interdependent_lib.zfae.overrides import scrub_legacy_raw_requests

    # Raw held bodies are scrubbed before serving because defensive read
    # redaction cannot provide the same zero-retention guarantee at rest.
    await scrub_legacy_raw_requests(pending_overrides_col)

    await keys_col.create_index([("user_id", 1), ("provider", 1)])
    await vault_col.create_index([("user_id", 1), ("site", 1), ("account_label", 1)])
    await sessions_col.create_index([("user_id", 1), ("updated_at", -1)])
    await drafts_col.create_index([("user_id", 1), ("updated_at", -1)])
    await fanout_col.create_index([("user_id", 1), ("created_at", -1)])
    await chain_col.create_index([("user_id", 1), ("created_at", -1)])
    await agents_col.create_index(
    [("user_id", 1), ("slug", 1)],
    unique=True,
    name="agent_owner_slug_unique",
)
    await agent_instances_col.create_index([("user_id", 1), ("updated_at", -1)])
    await usage_col.create_index([("user_id", 1), ("created_at", -1)])
    await fiq_audit_col.create_index(
        [("user_id", 1), ("timestamp_ms", -1)],
        name="fiq_audit_owner_timestamp",
    )
    await fiq_audit_col.create_index(
        "expires_at", expireAfterSeconds=0, name="fiq_audit_retention_ttl",
    )
    await pending_overrides_col.create_index(
        [("user_id", 1), ("status", 1), ("created_ms", -1)],
        name="pending_override_owner_status_created",
    )
    await pending_overrides_col.create_index(
        [("status", 1), ("expires_ms", 1)],
        name="pending_override_expiry",
    )
    await users_col.create_index("email", unique=True)
    await users_col.create_index("username", unique=True)
    await login_attempts_col.create_index("identifier")
    await password_reset_tokens_col.create_index("expires_at", expireAfterSeconds=0)
    await demo_quota_col.create_index([("user_id", 1), ("day", 1)], unique=True)
    await custom_keys_col.create_index([("user_id", 1), ("name", 1)], unique=True)
    await user_tools_col.create_index([("user_id", 1), ("name", 1)], unique=True)
    await mcp_servers_col.create_index([("user_id", 1), ("name", 1)], unique=True)
    await odysseus_servers_col.create_index([("user_id", 1), ("name", 1)], unique=True)
    await skills_col.create_index([("name", 1)])
    await skills_col.create_index([("owner_user_id", 1)])

# === CONTRACTS ===
# id: a0p_db_motor_loads
#   given: module declares its msdmd canon
#   then: the module imports cleanly under the current interpreter
#   class: integration
#   call: a0p_skills.contracts.module_imports_cleanly_holds
# === END CONTRACTS ===
# === CONTRACTS ===
# id: audit_override_indexes_present
#   given: database startup completes
#   then: owner-time, owner-status-created, expiry-query, and audit TTL indexes exist
#   class: retention
# id: audit_legacy_expiry_backfill_bounded
#   given: legacy audit rows lack expires_at when the service becomes ready
#   then: a background migration assigns bounded expiry using finite unordered bulk batches
#   class: retention
# === END CONTRACTS ===
# ratios: loc_comments=91:56 imports_exports=5:2 calls_definitions=38:2
