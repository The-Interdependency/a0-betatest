# === MODULE_BUILD ===
# id: a0p_db_motor
#   module_name: db
#   module_kind: service
#   summary: Motor async client + collection accessors + index ensurance
#   owner: a0p maintainer
#   public_surface: db, keys_col, vault_col, sessions_col, drafts_col, fanout_col, chain_col, agents_col, usage_col, ensure_indexes
#   internal_surface: _client, _MONGO_URL, _DB_NAME
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: internal
#   user_data_boundary: write
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: drop mongo collections; revert server.py import
# === END MODULE_BUILD ===
"""MongoDB Motor client + collection accessors."""
import os
from motor.motor_asyncio import AsyncIOMotorClient

_MONGO_URL = os.environ.get("MONGO_URL")
_DB_NAME = os.environ.get("DB_NAME")
if not _MONGO_URL or not _DB_NAME:
    raise RuntimeError("MONGO_URL / DB_NAME missing")

_client = AsyncIOMotorClient(_MONGO_URL)
db = _client[_DB_NAME]

# Collections
keys_col       = db["byok_keys"]         # one per provider per user
vault_col      = db["site_vault"]        # multi-account .env per site
sessions_col   = db["chat_sessions"]     # editable context + transcript
drafts_col     = db["prompt_drafts"]     # autosaved user drafts
fanout_col     = db["fanout_runs"]       # multi-model run outputs
chain_col      = db["daisy_chain_runs"]  # daisy-chain run outputs
agents_col     = db["detachable_agents"] # exportable agent manifests
usage_col      = db["usage_records"]     # token / compute records


async def ensure_indexes():
    await keys_col.create_index([("user_id", 1), ("provider", 1)])
    await vault_col.create_index([("user_id", 1), ("site", 1), ("account_label", 1)])
    await sessions_col.create_index([("user_id", 1), ("updated_at", -1)])
    await drafts_col.create_index([("user_id", 1), ("updated_at", -1)])
    await fanout_col.create_index([("user_id", 1), ("created_at", -1)])
    await chain_col.create_index([("user_id", 1), ("created_at", -1)])
    await agents_col.create_index([("slug", 1)])
    await usage_col.create_index([("user_id", 1), ("created_at", -1)])
