# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 37:56
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 5:2
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 7:5
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: zfae_pkg
#   module_name: zfae
#   module_kind: engine
#   summary: a0(ZFAE) — the inference provider, not an agent label. Exposes A0ZFAEInferenceEngine (native deterministic), plus the legacy ZFAEAgent persona for backward-compat with prior PCNAEngine wiring
#   owner: a0p maintainer
#   public_surface: A0ZFAEInferenceEngine, ENGINE, infer, InferenceResult, MISSING_NATIVE_MESSAGE, ZFAEAgent
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.zfae_engine_native_only_holds
#   rollout: default_enabled
#   rollback: remove imports from server.py /api/chat/zfae route
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_pkg_boundaries
#   summary: a0(ZFAE) — the inference provider, not an agent label. Exposes A0ZFAEInferenceEngine (native deterministic), plus the legacy ZFAEAgent persona for backward-compat with prior PCNAEngine wiring
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_pkg
#   summary: a0(ZFAE) — the inference provider, not an agent label. Exposes A0ZFAEInferenceEngine (native deterministic), plus the legacy ZFAEAgent persona for backward-compat with prior PCNAEngine wiring
#   exposes: A0ZFAEInferenceEngine, ENGINE, infer, InferenceResult, MISSING_NATIVE_MESSAGE, ZFAEAgent
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: a0p maintainer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: zfae_engine_native_only
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.zfae_engine_native_only_holds
# === END CONTRACTS ===
"""a0(ZFAE) — inference provider.

Per user spec 2026-06-02:
  • a0(zfae) is the inference PROVIDER, not an agent label.
  • A0ZFAEInferenceEngine produces all runtime replies natively, with
    no LLM dependency. If the native decoder is absent it returns the
    canonical missing-native message — never another model's output.

This package also retains the small ``ZFAEAgent`` persona class for
back-compat with the existing PCNA scaffold. The persona's job is
identity continuity; the engine's job is generating replies. The two
are distinct.
"""
from __future__ import annotations
import time
import uuid

from ..pcna import PCNAEngine
from .inference import (
    A0ZFAEInferenceEngine,
    InferenceResult,
    MISSING_NATIVE_MESSAGE,
    ENGINE,
    infer,
)


class ZFAEAgent:
    """Legacy persistent agent persona — wraps a PCNAEngine for the inspector.

    Kept for the existing /api/inspector/* routes. New runtime replies
    do NOT go through this class — they go through A0ZFAEInferenceEngine.
    """

    def __init__(self, name: str = "a0(zfae)", base_seed: int = 1):
        self.id = str(uuid.uuid4())
        self.name = name
        self.born_ms = int(time.time() * 1000)
        self.engine = PCNAEngine(n_primes=157, base_seed=base_seed)

    def receive(self, user_text: str) -> dict:
        self.engine.push_intent(user_text)
        return self.engine.heartbeat(intent=user_text)

    def absorb(self, model_id: str, text: str, usage: dict | None = None) -> None:
        self.engine.absorb_response(model_id, text, usage)

    def card(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "born_ms": self.born_ms,
            "snapshot": self.engine.snapshot(),
        }


__all__ = [
    "A0ZFAEInferenceEngine",
    "InferenceResult",
    "MISSING_NATIVE_MESSAGE",
    "ENGINE",
    "infer",
    "ZFAEAgent",
]
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 37:56
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 5:2
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 7:5
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
