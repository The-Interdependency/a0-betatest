# === MODULE_BUILD ===
# id: zfae_pkg
#   module_name: zfae
#   module_kind: engine
#   summary: persistent agent identity wrapping PCNA + memory
#   owner: a0p maintainer
#   public_surface: ZFAEAgent
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: revert subpackage from git
# === END MODULE_BUILD ===
"""
ZFAE — Zeta Function Alpha Echo.

The single persistent agent identity. LLMs are *energy providers*; ZFAE
is the agent persona that wraps the PCNA engine and exposes a stable
identity across heartbeats.

"""
from __future__ import annotations
import time
import uuid
from ..pcna import PCNAEngine


class ZFAEAgent:
    """Zeta-function alpha-echo persistent agent. Wraps a PCNAEngine."""

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
