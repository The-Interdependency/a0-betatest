# === MODULE_BUILD ===
# id: zfae_state_store
#   module_name: state_store
#   module_kind: service
#   summary: request-owner-bound ephemeral ZFAEAgent proxy with per-owner reentrant update locks and explicit eviction
#   owner: Erin Spencer
#   public_surface: OwnerScopedAgentProxy
#   internal_surface: _owner_context, _states, _locks, _guard, _EngineView
#   auth_boundary: owner_id
#   storage_boundary: ephemeral
#   network_boundary: none
#   user_data_boundary: write
#   admin_only: false
#   tests: backend.tests.test_agent_state_isolation
#   rollout: default_enabled
#   rollback: remove legacy chat/inspector state rather than restore one process-global agent
#   since: 2026-07-21
#   unresolved: restart persistence is intentionally unavailable until an atomic versioned state schema exists
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_state_store_boundaries
#   summary: each mutable legacy state is keyed by the authenticated request owner and every state mutation is protected by that owner's lock
#   auth_boundary: owner_id
#   storage_boundary: ephemeral
#   network_boundary: none
#   user_data_boundary: write
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_state_store
#   summary: preserves the legacy AGENT call surface while resolving every call to isolated owner state
#   exposes: OwnerScopedAgentProxy
#   boundaries: auth:owner_id, storage:ephemeral, network:none, user_data:write
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: zfae_state_owner_isolation
#   given: two authenticated owners use the legacy agent surface
#   then: each resolves to a distinct state and neither snapshot contains the other's memory marker
#   class: security
# id: zfae_state_updates_serialized
#   given: concurrent mutations target one owner
#   then: each receive, absorb, snapshot, and heartbeat operation is protected by one per-owner lock with no lost ticks
#   class: concurrency
# id: zfae_state_lifecycle_explicit
#   given: a state is evicted or the process restarts
#   then: its in-memory state is gone; no persistence is implied
#   class: provenance
# === END CONTRACTS ===
"""Owner-scoped compatibility proxy for the legacy mutable ZFAE agent.

The proxy keeps existing ``AGENT.receive()``, ``AGENT.absorb()``, ``AGENT.card()``,
and ``AGENT.engine`` call sites working while binding each request to a distinct
owner state. State is explicitly ephemeral; persistent character-sheet agents
and weight banks remain under ``backend/agents``.
"""
from __future__ import annotations

import hashlib
import threading
from contextvars import ContextVar, Token

from . import ZFAEAgent


class _EngineView:
    def __init__(self, proxy: "OwnerScopedAgentProxy", owner_id: str) -> None:
        self._proxy = proxy
        self._owner_id = owner_id

    @property
    def tick_count(self) -> int:
        with self._proxy._lock_for(self._owner_id):
            return self._proxy._agent_for(self._owner_id).engine.tick_count

    def heartbeat(self, intent: str | None = None) -> dict:
        return self._proxy.heartbeat(intent=intent, owner_id=self._owner_id)

    def snapshot(self) -> dict:
        with self._proxy._lock_for(self._owner_id):
            return self._proxy._agent_for(self._owner_id).engine.snapshot()


class OwnerScopedAgentProxy:
    """Bind the legacy agent API to one authenticated owner per request context."""

    def __init__(self) -> None:
        self._owner_context: ContextVar[str | None] = ContextVar(
            "a0p_agent_owner", default=None
        )
        self._states: dict[str, ZFAEAgent] = {}
        self._locks: dict[str, threading.RLock] = {}
        self._guard = threading.RLock()

    @staticmethod
    def _seed_for(owner_id: str) -> int:
        digest = hashlib.blake2b(
            f"a0-state\x00{owner_id}".encode("utf-8"), digest_size=8
        ).digest()
        return max(1, int.from_bytes(digest, "big") % 2_147_483_647)

    @staticmethod
    def _agent_id_for(owner_id: str) -> str:
        return hashlib.blake2b(
            f"a0-agent\x00{owner_id}".encode("utf-8"), digest_size=16
        ).hexdigest()

    def bind_owner(self, owner_id: str) -> Token:
        owner = str(owner_id).strip()
        if not owner:
            raise ValueError("owner_id is required")
        return self._owner_context.set(owner)

    def reset_owner(self, token: Token) -> None:
        self._owner_context.reset(token)

    def current_owner(self) -> str:
        owner = self._owner_context.get()
        if owner is None:
            raise RuntimeError("no authenticated agent owner is bound to this request")
        return owner

    def _lock_for(self, owner_id: str) -> threading.RLock:
        with self._guard:
            return self._locks.setdefault(owner_id, threading.RLock())

    def _agent_for(self, owner_id: str) -> ZFAEAgent:
        with self._guard:
            agent = self._states.get(owner_id)
            if agent is None:
                agent = ZFAEAgent(
                    name="a0(zfae)",
                    base_seed=self._seed_for(owner_id),
                )
                agent.id = self._agent_id_for(owner_id)
                self._states[owner_id] = agent
            return agent

    @property
    def id(self) -> str:
        owner = self.current_owner()
        with self._lock_for(owner):
            return self._agent_for(owner).id

    @property
    def name(self) -> str:
        owner = self.current_owner()
        with self._lock_for(owner):
            return self._agent_for(owner).name

    @property
    def born_ms(self) -> int:
        owner = self.current_owner()
        with self._lock_for(owner):
            return self._agent_for(owner).born_ms

    @property
    def engine(self) -> _EngineView:
        return _EngineView(self, self.current_owner())

    def receive(self, user_text: str, *, owner_id: str | None = None) -> dict:
        owner = owner_id or self.current_owner()
        with self._lock_for(owner):
            return self._agent_for(owner).receive(user_text)

    def absorb(
        self,
        model_id: str,
        text: str,
        usage: dict | None = None,
        *,
        owner_id: str | None = None,
    ) -> None:
        owner = owner_id or self.current_owner()
        with self._lock_for(owner):
            self._agent_for(owner).absorb(model_id, text, usage)

    def card(self, *, owner_id: str | None = None) -> dict:
        owner = owner_id or self.current_owner()
        with self._lock_for(owner):
            card = self._agent_for(owner).card()
            card["state_owner"] = owner
            card["persistence"] = "ephemeral"
            return card

    def heartbeat(
        self,
        intent: str | None = None,
        *,
        owner_id: str | None = None,
    ) -> dict:
        owner = owner_id or self.current_owner()
        with self._lock_for(owner):
            result = self._agent_for(owner).engine.heartbeat(intent=intent)
            result["state_owner"] = owner
            result["persistence"] = "ephemeral"
            return result

    def evict(self, owner_id: str | None = None) -> bool:
        owner = owner_id or self.current_owner()
        with self._lock_for(owner):
            existed = self._states.pop(owner, None) is not None
        with self._guard:
            self._locks.pop(owner, None)
        return existed

    def state_count(self) -> int:
        with self._guard:
            return len(self._states)


__all__ = ["OwnerScopedAgentProxy"]
