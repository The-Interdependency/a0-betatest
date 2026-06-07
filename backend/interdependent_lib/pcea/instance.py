# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 16:42
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 1:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 7:5
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: pcea_instance
#   module_name: instance
#   module_kind: engine
#   summary: stateful PCEA instance — auto-advances last_state per call
#   owner: a0p maintainer
#   public_surface: PCEAInstance
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: a0p_skills.contracts.pcea_round_trip_53
#   rollout: default_enabled
#   rollback: revert file from git
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: pcea_instance_boundaries
#   summary: stateful PCEA instance — auto-advances last_state per call
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: pcea_instance
#   summary: stateful PCEA instance — auto-advances last_state per call
#   exposes: PCEAInstance
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: pcea_round_trip_53
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.pcea_round_trip_53
# === END CONTRACTS ===
"""Stateful PCEA instance — advances last_state automatically after each call."""
from .cipher import encrypt_state, decrypt_state


class PCEAInstance:
    def __init__(self, seed: list[int]):
        if not seed:
            raise ValueError("seed must be non-empty")
        self.last = list(seed)

    def encrypt(self, state: list[int]) -> list[int]:
        enc = encrypt_state(state, self.last)
        self.last = list(state)
        return enc

    def decrypt(self, enc: list[int]) -> list[int]:
        dec = decrypt_state(enc, self.last)
        self.last = list(dec)
        return dec

    def reset(self, seed: list[int] | None = None):
        self.last = list(seed) if seed else [1]
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 16:42
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 1:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 7:5
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
