# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 30:39
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 4:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 6:5
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: ptca_instance
#   module_name: instance
#   module_kind: engine
#   summary: current PTCA engine — tensor + sentinel channels + lineage hashing (pre-stratified)
#   owner: a0p maintainer
#   public_surface: PTCAInstance
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: revert file from git
#   unresolved: replace with stratified Fiq→Circle→Seed model from canon prime_core
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: ptca_instance_boundaries
#   summary: current PTCA engine — tensor + sentinel channels + lineage hashing (pre-stratified)
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: ptca_instance
#   summary: current PTCA engine — tensor + sentinel channels + lineage hashing (pre-stratified)
#   exposes: PTCAInstance
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""PTCAInstance — the main engine class binding tensor + sentinels + provenance.

The instance carries N prime nodes; the standard research seed is N=157
(used by the three PTCA cores configured by PCNA: phi / psi / omega).
"""
from __future__ import annotations
from .tensor import PrimeTensor
from .sentinels import SentinelChannel
from .provenance import hash_state


class PTCAInstance:
    def __init__(self, n_primes: int = 157, label: str = "phi", seed: int = 0):
        self.label = label
        self.tensor = PrimeTensor(n_primes)
        if seed:
            self.tensor.seed_from_int(seed)
        self.channels: dict[str, SentinelChannel] = {}
        self.lineage: list[str] = []

    def register(self, channel: SentinelChannel) -> None:
        self.channels[channel.name] = channel

    def push(self, channel_name: str, payload: dict) -> str:
        if channel_name not in self.channels:
            self.channels[channel_name] = SentinelChannel(name=channel_name)
        msg = self.channels[channel_name].push(payload)
        h = hash_state({"ch": channel_name, "seq": msg.seq, "p": payload},
                       op="push", parents=self.lineage[-1:])
        self.lineage.append(h)
        return h

    def snapshot(self) -> dict:
        return {
            "label": self.label,
            "tensor": self.tensor.summary(),
            "channels": {k: len(v) for k, v in self.channels.items()},
            "lineage_head": self.lineage[-1] if self.lineage else None,
            "lineage_depth": len(self.lineage),
        }
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 30:39
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 4:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 6:5
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
