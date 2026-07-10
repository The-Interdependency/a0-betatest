# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
# === MODULE_BUILD ===
# id: ptca_seed
#   module_name: seed
#   module_kind: core
#   summary: PTCA Seed — UCNS object carrying exactly 7 PCTA circles. {7/3} heptagram. F4: 157/7/7/53 public canon (no decoupling). Manifest-first.
#   owner: a0p maintainer
#   public_surface: Seed, seed_identity, seed_compose, from_circles, from_seed, aggregate, ucns_shape, heptagram_order, param_count
#   internal_surface: _seed_ucns_shape
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: a0p_skills.contracts.ptca_seed_shape_holds, a0p_skills.contracts.ptca_seed_heptagram, a0p_skills.contracts.ptca_seed_holds_seven_holds, a0p_skills.contracts.ptca_seed_aggregate_is_tensor_holds
#   rollout: default_enabled
#   rollback: revert file from git
#   unresolved: hmmm (non-commutativity + double-cover lift pending gonal remediation)
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: ptca_seed_boundaries
#   summary: PTCA Seed — 7 circles per seed; seed itself is a tensor at this layer
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: ptca_seed
#   summary: PTCA Seed layer — 7-circle UCNS aggregate with {7/3} heptagram
#   exposes: Seed, seed_identity, seed_compose, from_circles, from_seed, aggregate, ucns_shape, heptagram_order, param_count
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""
PTCA Seed layer (Part 2 rebuild — step 3).

A Seed carries exactly 7 PCTA Circles.
The seed itself is a tensor at this level (recursive).
Composition via {7/3} heptagram (SEED_ROUTING_STEP = 3).

**F4 Ratification**: SEED_COUNT=157, CIRCLES_PER_SEED=7, TENSORS_PER_CIRCLE=7,
TENSOR_DIM=53 is public load-bearing canon. Not arbitrary. Decoupling forbidden.

Non-commutativity and R/4πZ invariants enforced at gonal layer (F6).
"""

from __future__ import annotations
from fractions import Fraction
from typing import Sequence

import ucns

import backend.interdependent_lib.pcta.circle as pcta
 import backend.interdependent_lib.ptca.constants as canon


SEED_CIRCLES: int = canon.CIRCLES_PER_SEED          # 7
HEPTAGRAM_STEP_SEED: int = canon.SEED_ROUTING_STEP    # 3


def _seed_ucns_shape(content_hash: int = 0) -> "ucns.UCNSObject":
    face_bit = int(content_hash) & 1
    return ucns.UCNSObject(2, 2, [(Fraction(0), 1.0), (Fraction(1), 1.0)], [face_bit, face_bit])


def heptagram_walk(start: int, step: int, n: int = SEED_CIRCLES) -> tuple[int, ...]:
    if n <= 0:
        raise ValueError("n must be positive")
    out: list[int] = []
    cur = start % n
    for _ in range(n):
        out.append(cur)
        cur = (cur + step) % n
    return tuple(out)


def heptagram_walk_7_3(start: int = 0) -> tuple[int, ...]:
    return heptagram_walk(start, 3, SEED_CIRCLES)


@dataclass(frozen=True)
class Seed:
    """Seed = UCNS object carrying exactly 7 PCTA circles."""
    circles: Tuple[pcta.Circle, ...]
    step: int = HEPTAGRAM_STEP_SEED

    def __post_init__(self):
        if len(self.circles) != SEED_CIRCLES:
            raise ValueError(f"Seed must contain exactly {SEED_CIRCLES} circles")

    @property
    def aggregate(self) -> pcta.pcna.Tensor:  # type: ignore[attr-defined]
        # Aggregate of the 7 circle aggregates
        if not self.circles:
            return pcta.pcna.tensor_identity()
        sums = [0.0] * canon.TENSOR_DIM
        for c in self.circles:
            agg = c.aggregate
            for i, v in enumerate(agg.payload):
                sums[i] += v
        mean = tuple(s / len(self.circles) for s in sums)
        return pcta.pcna.Tensor(payload=mean)

    def heptagram_order(self, start: int = 0) -> Tuple[pcta.Circle, ...]:
        walk = heptagram_walk(start, self.step, SEED_CIRCLES)
        return tuple(self.circles[i] for i in walk)

    def ucns_shape(self) -> "ucns.UCNSObject":
        content_hash = hash(tuple(hash(c.tensors) for c in self.circles))
        return _seed_ucns_shape(content_hash)

    def param_count(self) -> int:
        return SEED_CIRCLES * canon.TENSORS_PER_CIRCLE * canon.TENSOR_DIM


def seed_identity() -> Seed:
    return Seed(circles=tuple(pcta.circle_identity() for _ in range(SEED_CIRCLES)))


def from_circles(circles: List[pcta.Circle]) -> Seed:
    if len(circles) != SEED_CIRCLES:
        raise ValueError(f"Exactly {SEED_CIRCLES} circles required")
    return Seed(circles=tuple(circles))


def from_seed(seed: int, label: str = "") -> Seed:
    base = seed * SEED_CIRCLES
    circles = [pcta.from_seed(base + i, f"{label}::circle{i}") for i in range(SEED_CIRCLES)]
    return Seed(circles=tuple(circles))


def seed_compose(a: Seed, b: Seed) -> Seed:
    """Placeholder compose until gonal invariants wired."""
    if len(a.circles) != len(b.circles):
        raise ValueError("Circle count mismatch")
    composed = tuple(
        pcta.heptagram_compose(ca, cb) for ca, cb in zip(a.circles, b.circles)
    )
    return Seed(circles=composed, step=a.step)

# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
