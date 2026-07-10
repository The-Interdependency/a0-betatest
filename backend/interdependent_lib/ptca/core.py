# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
# === MODULE_BUILD ===
# id: ptca_core
#   module_name: core
#   module_kind: core
#   summary: PTCA Core — N=157 seeds (public canon) + aggregate. F4 ratified: 157 is load-bearing public canon, no decoupling. Manifest-first.
#   owner: a0p maintainer
#   public_surface: Core, with_n, from_seeds, aggregate, param_count, ucns_shape, n, label
#   internal_surface: _core_ucns_shape
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: a0p_skills.contracts.ptca_core_assembles_157_holds, a0p_skills.contracts.ptca_core_aggregate_is_tensor_holds, a0p_skills.contracts.ptca_core_param_count_matches_canon_holds
#   rollout: default_enabled
#   rollback: revert file from git
#   unresolved: hmmm (network layer + full non-commutativity/double-cover tests pending)
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: ptca_core_boundaries
#   summary: PTCA Core — N seeds (157 canon for primary rings); core itself is a tensor
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: ptca_core
#   summary: PTCA Core layer — N-seed UCNS aggregate (N=157 public canon)
#   exposes: Core, with_n, from_seeds, aggregate, param_count, ucns_shape, n, label
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""
PTCA Core layer (Part 2 rebuild — step 3 complete).

**F4 Ratification (2026-07-10)**: N=157 (with 7/7/53) is **public load-bearing canon**.
Not arbitrary. Decoupling is not a thing. Used for Φ/Ψ/Ω rings.

The Core assembles N Seeds. The aggregate at this level is a single
Tensor of width 53 — "all N seeds together is one tensor".

Non-commutativity and double-cover invariants are enforced at the
gonal layer (F6). This completes the core substrate (PCNA → PCTA → PTCA).
"""

from __future__ import annotations
from fractions import Fraction
from typing import Sequence

import ucns

import backend.interdependent_lib.pcta.circle as pcta
import backend.interdependent_lib.ptca.constants as canon


DEFAULT_N: int = canon.SEED_COUNT  # 157 — public canon


def _core_ucns_shape(content_hash: int = 0) -> "ucns.UCNSObject":
    face_bit = int(content_hash) & 1
    return ucns.UCNSObject(2, 2, [(Fraction(0), 1.0), (Fraction(1), 1.0)], [face_bit, face_bit])


def core_aggregate(tensors: Sequence) -> "Tensor":
    from backend.interdependent_lib.pcna.tensor import Tensor, tensor_identity
    if not tensors:
        return tensor_identity()
    n = len(tensors)
    sums = [0.0] * canon.TENSOR_DIM
    for t in tensors:
        for i, v in enumerate(t.payload):
            sums[i] += v
    mean = tuple(s / n for s in sums)
    return Tensor(payload=mean)


@dataclass(frozen=True)
class Core:
    """Core = UCNS object carrying N PTCA seeds (N=157 canon)."""
    seeds: Tuple["Seed", ...]  # type: ignore[name-defined]
    label: str = "phi"

    def __post_init__(self):
        if not self.seeds:
            raise ValueError("Core requires at least one Seed")

    @property
    def n(self) -> int:
        return len(self.seeds)

    @property
    def aggregate(self) -> "Tensor":
        from backend.interdependent_lib.pcna.tensor import Tensor
        if not self.seeds:
            from backend.interdependent_lib.pcna.tensor import tensor_identity
            return tensor_identity()
        sums = [0.0] * canon.TENSOR_DIM
        for s in self.seeds:
            agg = s.aggregate
            for i, v in enumerate(agg.payload):
                sums[i] += v
        mean = tuple(s / len(self.seeds) for s in sums)
        return Tensor(payload=mean)

    def param_count(self) -> int:
        return self.n * canon.CIRCLES_PER_SEED * canon.TENSORS_PER_CIRCLE * canon.TENSOR_DIM

    def ucns_shape(self) -> "ucns.UCNSObject":
        content_hash = hash(tuple(hash(s.circles) for s in self.seeds))
        return _core_ucns_shape(content_hash)


def with_n(n: int = DEFAULT_N, label: str = "phi") -> Core:
    from backend.interdependent_lib.ptca.seed import from_seed as seed_from_seed
    seeds = tuple(seed_from_seed(i, f"{label}::seed{i}") for i in range(n))
    return Core(seeds=seeds, label=label)


def from_seeds(seeds: List) -> Core:
    return Core(seeds=tuple(seeds))

# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
