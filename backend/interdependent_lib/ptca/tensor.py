# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 42:44
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 2:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 7:8
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: ptca_tensor
#   module_name: tensor
#   module_kind: engine
#   summary: prime-indexed nested-list tensor — current shape [N,4,7,7]; canon prime_core target [157,7,7,53] pending stratified rebuild
#   owner: a0p maintainer
#   public_surface: PrimeTensor
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: revert file from git
#   unresolved: shape and stratification both pending canon prime_core rebuild
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: ptca_tensor_boundaries
#   summary: prime-indexed nested-list tensor — current shape [N,4,7,7]; canon prime_core target [157,7,7,53] pending stratified rebuild
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: ptca_tensor
#   summary: prime-indexed nested-list tensor — current shape [N,4,7,7]; canon prime_core target [157,7,7,53] pending stratified rebuild
#   exposes: PrimeTensor
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""PrimeTensor — pure-Python nested-list tensor [N, 4, 7, 7] indexed by prime nodes."""
from __future__ import annotations
from .primes import first_n_primes


class PrimeTensor:
    """Tensor whose first axis is indexed by the first N primes.

    Shape: (N, 4, 7, 7) — node × dim × phase × heptagram axes
    (per spec: PTCA core context is [N, 4, 7, 7]).
    """

    DIM = 4
    PHASE = 7
    HEPTA = 7

    def __init__(self, n_primes: int, fill: float = 0.0):
        self.n = n_primes
        self.primes = first_n_primes(n_primes)
        # nested list: [N][4][7][7]
        self.data = [
            [[[fill] * self.HEPTA for _ in range(self.PHASE)] for _ in range(self.DIM)]
            for _ in range(self.n)
        ]

    def set(self, i: int, d: int, p: int, h: int, v: float) -> None:
        self.data[i][d][p][h] = v

    def get(self, i: int, d: int, p: int, h: int) -> float:
        return self.data[i][d][p][h]

    def slice_node(self, i: int) -> list:
        return self.data[i]

    def energy(self) -> float:
        """L2-style energy across the tensor (no numpy)."""
        s = 0.0
        for n_block in self.data:
            for d_block in n_block:
                for p_row in d_block:
                    for v in p_row:
                        s += v * v
        return s ** 0.5

    def seed_from_int(self, seed: int) -> None:
        """Deterministic seed — fills tensor with values derived from primes and seed."""
        for i, prime in enumerate(self.primes):
            for d in range(self.DIM):
                for p in range(self.PHASE):
                    for h in range(self.HEPTA):
                        # bounded float derived from seed, prime, axis indices
                        v = ((seed * prime + d * 13 + p * 7 + h * 3) % 9973) / 9973.0
                        self.data[i][d][p][h] = v

    def summary(self) -> dict:
        return {
            "n_primes": self.n,
            "shape": [self.n, self.DIM, self.PHASE, self.HEPTA],
            "primes_head": self.primes[:8],
            "primes_tail": self.primes[-3:],
            "energy": round(self.energy(), 6),
        }

# === CONTRACTS ===
# id: ptca_tensor_loads
#   given: module declares its msdmd canon
#   then: the module imports cleanly under the current interpreter
#   class: integration
#   call: a0p_skills.contracts.module_imports_cleanly_holds
# === END CONTRACTS ===
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 42:44
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 2:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 7:8
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
