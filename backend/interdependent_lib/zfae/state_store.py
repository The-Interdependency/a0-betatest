# === MODULE_BUILD ===
# id: zfae_state_store
#   module_name: state_store
#   module_kind: service
#   summary: owner-keyed ephemeral ZFAEAgent state with per-state async serialization and explicit eviction
#   owner: Erin Spencer
#   public_surface: AgentStateStore, AgentStateKey
#   internal_surface: _states, _locks, _guard, _seed_for, _agent_id_for
#   auth_boundary: owner_id
#   storage_boundary: ephemeral
#   network_boundary: none
#   user_data_boundary: write
#   admin_only: false
#   tests: backend.tests.test_agent_state_isolation
#   rollout: default_enabled
#   rollback: remove legacy chat/inspector state rather than restore a process-global agent
#   since: 2026-07-21
#   unresolved: restart persistence is intentionally unavailable until an atomic versioned state schema exists
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_state_store_boundaries
#   summary: each mutable legacy state is keyed by authenticated owner plus state id and serialized by one asyncio lock
#   auth_boundary: owner_id
#   storage_boundary: ephemeral
#   network_boundary: none
#   user_data_boundary: write
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_state_store
#   summary: creates, reads, mutates, and evicts isolated in-process ZFAEAgent states
#   exposes: AgentStateStore, AgentStateKey
#   boundaries: auth:owner_id, storage:ephemeral, network:none, user_data:write
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: zfae_state_owner_isolation
#   given: two owners use the same state id
#   then: each receives a distinct agent and neither snapshot contains the other's memory marker
#   class: security
# id: zfae_state_updates_serialized
#   given: concurrent mutations target one owner/state key
#   then: one per-key lock serializes updates without lost ticks
#   class: concurrency
# id: zfae_state_lifecycle_explicit
#   given: a state is evicted or the process restarts
#   then: its in-memory state is gone; no persistence is implied
#   class: provenance
# === END CONTRACTS ===
"""Owner-keyed ephemeral state for the legacy ZFAE inspector/chat surface.

The store deliberately does not persist state. That prevents cross-user leakage
without pretending that an atomic durable state schema already exists. Persistent
character-sheet agents and weight banks remain under ``backend/agents``.
"""
from __future__ import annotations

import asyncio
import hashlib
from contextlib import asynccontextmanager
from dataclasses import dataclass
from typing import AsyncIterator

from . import ZFAEAgent


@dataclass(frozen=True, order=True)
class AgentStateKey:
    owner_id: str
    state_id: str

    def __post_init__(self) -> None:
        if not self.owner_id or not self.state_id:
            raise ValueError("owner_id and state_id are required")


class AgentStateStore:
    """In-process state map with one lock per authenticated owner/state pair."""

    def __init__(self) -> None:
        self._states: dict[AgentStateKey, ZFAEAgent] = {}
        self._locks: dict[AgentStateKey, asyncio.Lock] = {}
        self._guard = asyncio.Lock()

    @staticmethod
    def _seed_for(key: AgentStateKey) -> int:
        digest = hashlib.blake2b(
            f"{key.owner_id}\x00{key.state_id}".encode("utf-8"), digest_size=8
        ).digest()
        return max(1, int.from_bytes(digest, "big") % 2_147_483_647)

    @staticmethod
    def _agent_id_for(key: AgentStateKey) -> str:
        return hashlib.blake2b(
            f"a0-state\x00{key.owner_id}\x00{key.state_id}".encode("utf-8"),
            digest_size=16,
        ).hexdigest()

    async def _lock_for(self, key: AgentStateKey) -> asyncio.Lock:
        async with self._guard:
            return self._locks.setdefault(key, asyncio.Lock())

    def _get_or_create_unlocked(self, key: AgentStateKey) -> ZFAEAgent:
        agent = self._states.get(key)
        if agent is None:
            agent = ZFAEAgent(
                name=f"a0(zfae):{key.state_id}",
                base_seed=self._seed_for(key),
            )
            agent.id = self._agent_id_for(key)
            self._states[key] = agent
        return agent

    @asynccontextmanager
    async def locked(
        self,
        owner_id: str,
        state_id: str = "default",
    ) -> AsyncIterator[ZFAEAgent]:
        key = AgentStateKey(str(owner_id), str(state_id))
        lock = await self._lock_for(key)
        async with lock:
            yield self._get_or_create_unlocked(key)

    async def snapshot(self, owner_id: str, state_id: str = "default") -> dict:
        async with self.locked(owner_id, state_id) as agent:
            return agent.card()

    async def heartbeat(
        self,
        owner_id: str,
        state_id: str = "default",
        intent: str | None = None,
    ) -> dict:
        async with self.locked(owner_id, state_id) as agent:
            return agent.engine.heartbeat(intent=intent)

    async def evict(self, owner_id: str, state_id: str = "default") -> bool:
        key = AgentStateKey(str(owner_id), str(state_id))
        lock = await self._lock_for(key)
        async with lock:
            existed = self._states.pop(key, None) is not None
        async with self._guard:
            if not lock.locked():
                self._locks.pop(key, None)
        return existed

    async def evict_owner(self, owner_id: str) -> int:
        async with self._guard:
            keys = [key for key in self._states if key.owner_id == str(owner_id)]
        removed = 0
        for key in keys:
            removed += int(await self.evict(key.owner_id, key.state_id))
        return removed

    def state_count(self) -> int:
        return len(self._states)


__all__ = ["AgentStateKey", "AgentStateStore"]
