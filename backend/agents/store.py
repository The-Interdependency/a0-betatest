# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 109:46
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 8:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 41:16
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: agents_store
#   module_name: store
#   module_kind: service
#   summary: full CRUD over MongoDB metadata + filesystem per-agent checkpoint dir; agents treated as users (persistent semi-permanent instances)
#   owner: Erin Spencer
#   public_surface: AgentStore
#   internal_surface: _agent_dir, _ensure_dir
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: internal
#   user_data_boundary: write
#   admin_only: false
#   tests: a0p_skills.contracts.agent_instance_full_crud_holds
#   rollout: default_enabled
#   rollback: drop agents collection; filesystem dirs preserved
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: agents_store_boundaries
#   summary: full CRUD over MongoDB metadata + filesystem per-agent checkpoint dir; agents treated as users (persistent semi-permanent instances)
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: internal
#   user_data_boundary: write
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: agents_store
#   summary: full CRUD over MongoDB metadata + filesystem per-agent checkpoint dir; agents treated as users (persistent semi-permanent instances)
#   exposes: AgentStore
#   boundaries: auth:none, storage:write, network:internal, user_data:write
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: agent_instance_full_crud
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.agent_instance_full_crud_holds
# === END CONTRACTS ===
"""AgentStore — agents CRUD with per-agent filesystem checkpoint directories."""
from __future__ import annotations
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from interdependent_lib.zfae.weights import A0ZFAEWeightBank

from .schema import AgentInstance, CharacterSheet, new_agent_id


_AGENTS_ROOT_ENV: str = "A0P_AGENTS_ROOT"
_DEFAULT_ROOT: str = "/app/storage/agents"


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _ensure_dir(p: Path) -> Path:
    p.mkdir(parents=True, exist_ok=True)
    return p


def _safe_finite(x):
    """Return x if it's a finite float, else None. Guards against inf/NaN in JSON."""
    import math
    if x is None:
        return None
    try:
        f = float(x)
    except (TypeError, ValueError):
        return None
    return f if math.isfinite(f) else None


def _metrics_from_bank(bank: A0ZFAEWeightBank, digest: str) -> dict:
    """JSON-safe canonical metrics dict from a weight bank."""
    return {
        "zfae_weight_count": bank.zfae_weight_count,
        "zfae_weight_count_per_core": bank.zfae_weight_count_per_core,
        "zfae_weight_count_total": bank.zfae_weight_count_total,
        "zfae_checkpoint_digest": digest,
        "zfae_training_step": int(bank.zfae_training_step),
        "zfae_last_loss": _safe_finite(bank.zfae_last_loss),
        "zfae_total_seeds_touched": int(bank.total_seeds_touched),
        "zfae_all_seeds_touched": bool(bank.all_seeds_touched),
    }


class AgentStore:
    """CRUD over MongoDB metadata + filesystem checkpoint dir per agent."""

    def __init__(self, mongo_collection, fs_root: Optional[str] = None):
        self._col = mongo_collection
        self._root = Path(fs_root or os.environ.get(_AGENTS_ROOT_ENV, _DEFAULT_ROOT))
        _ensure_dir(self._root)

    def _agent_dir(self, agent_id: str) -> Path:
        return _ensure_dir(self._root / agent_id)

    def checkpoint_path(self, agent_id: str) -> Path:
        return self._agent_dir(agent_id) / "zfae_core.safetensors"

    async def list(self, user_id: str = "local", include_archived: bool = False) -> list[AgentInstance]:
        query: dict = {"user_id": user_id}
        if not include_archived:
            query["archived"] = {"$ne": True}
        out: list[AgentInstance] = []
        async for doc in self._col.find(query).sort("updated_at", -1).limit(200):
            doc.setdefault("id", doc.pop("_id", new_agent_id()))
            out.append(AgentInstance.model_validate(doc))
        return out

    async def get(self, agent_id: str, user_id: str = "local") -> Optional[AgentInstance]:
        doc = await self._col.find_one({"_id": agent_id, "user_id": user_id})
        if not doc:
            return None
        doc["id"] = doc.pop("_id")
        return AgentInstance.model_validate(doc)

    async def create(self, sheet: CharacterSheet, user_id: str = "local") -> AgentInstance:
        agent = AgentInstance(user_id=user_id, sheet=sheet)
        # Fresh ZFAE weight bank — saved to per-agent checkpoint
        bank = A0ZFAEWeightBank.fresh(agent.id)
        cp = self.checkpoint_path(agent.id)
        digest = bank.save(str(cp))
        agent.zfae_metrics = _metrics_from_bank(bank, digest)
        doc = agent.model_dump()
        doc["_id"] = doc.pop("id")
        await self._col.insert_one(doc)
        return agent

    async def update_sheet(
        self,
        agent_id: str,
        patch: dict,
        user_id: str = "local",
    ) -> Optional[AgentInstance]:
        existing = await self.get(agent_id, user_id)
        if not existing:
            return None
        sheet_data = existing.sheet.model_dump()
        sheet_data.update(patch)
        existing.sheet = CharacterSheet.model_validate(sheet_data)
        existing.updated_at = _utc_now_iso()
        doc = existing.model_dump()
        doc["_id"] = doc.pop("id")
        await self._col.replace_one({"_id": agent_id, "user_id": user_id}, doc)
        return existing

    async def archive(self, agent_id: str, user_id: str = "local") -> bool:
        r = await self._col.update_one(
            {"_id": agent_id, "user_id": user_id},
            {"$set": {"archived": True, "updated_at": _utc_now_iso()}},
        )
        return r.modified_count > 0

    async def delete(self, agent_id: str, user_id: str = "local") -> bool:
        r = await self._col.delete_one({"_id": agent_id, "user_id": user_id})
        # Filesystem checkpoint dir preserved by default for forensics; explicit purge needed.
        return r.deleted_count > 0

    async def purge_filesystem(self, agent_id: str) -> bool:
        """Destructively remove the agent's filesystem checkpoint dir. Use sparingly."""
        import shutil
        d = self._agent_dir(agent_id)
        if not d.is_dir():
            return False
        shutil.rmtree(d)
        return True

    def load_weight_bank(self, agent_id: str) -> Optional[A0ZFAEWeightBank]:
        cp = self.checkpoint_path(agent_id)
        if not cp.is_file():
            return None
        return A0ZFAEWeightBank.load(str(cp), agent_id)

    def save_weight_bank(self, agent_id: str, bank: A0ZFAEWeightBank) -> str:
        cp = self.checkpoint_path(agent_id)
        return bank.save(str(cp))

    async def refresh_metrics(self, agent_id: str, user_id: str = "local") -> Optional[dict]:
        bank = self.load_weight_bank(agent_id)
        if not bank:
            return None
        metrics = _metrics_from_bank(bank, bank.zfae_checkpoint_digest)
        await self._col.update_one(
            {"_id": agent_id, "user_id": user_id},
            {"$set": {"zfae_metrics": metrics, "updated_at": _utc_now_iso()}},
        )
        return metrics
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 109:46
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 8:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 41:16
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
