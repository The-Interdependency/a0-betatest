# === MODULE_BUILD ===
# id: ptca_seed
#   module_name: seed
#   module_kind: core
#   summary: PTCA seed containing exactly seven PCTA circles with {7/3} routing and A0-local structural identity
#   owner: a0p maintainer
#   public_surface: Seed, seed_identity, seed_compose, from_circles, from_seed, aggregate, structural_shape, heptagram_order, param_count
#   internal_surface: _seed_structural_shape
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: backend.interdependent_lib.tests.test_invariants, backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: revert only with explicit object-epoch migration
#   since: 2026-07-21
#   unresolved: lawful projection into current UCNS remains hmmm
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: ptca_seed_boundaries
#   summary: seven-circle A0 structure; no current UCNS geometry or theorem claim
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: ptca_seed
#   summary: validates, aggregates, and heptagram-orders seven PCTA circles
#   exposes: Seed, seed_identity, seed_compose, structural_shape
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: ptca_seed_seven_circle_structure
#   given: a PTCA Seed
#   then: it holds exactly seven PCTA circles and its aggregate is deterministic
#   class: correctness
# id: ptca_seed_ucns_absent
#   given: structural_shape is requested
#   then: the returned identity declares ucns_state=NA and no theorem transfer
#   class: provenance
# === END CONTRACTS ===
"""PTCA seed layer with current UCNS explicitly absent."""
from __future__ import annotations

from dataclasses import dataclass
from typing import List, Tuple

import backend.interdependent_lib.pcta.circle as pcta
import backend.interdependent_lib.ptca.constants as canon
from backend.interdependent_lib.structural_shape import A0StructuralShape, shape_from_content

SEED_CIRCLES = canon.CIRCLES_PER_SEED
HEPTAGRAM_STEP_SEED = canon.SEED_ROUTING_STEP


def _seed_structural_shape(content) -> A0StructuralShape:
    return shape_from_content("ptca.seed", content)


def heptagram_walk(start: int, step: int, n: int = SEED_CIRCLES) -> tuple[int, ...]:
    if n <= 0:
        raise ValueError("n must be positive")
    return tuple((start + i * step) % n for i in range(n))


def heptagram_walk_7_3(start: int = 0) -> tuple[int, ...]:
    return heptagram_walk(start, 3, SEED_CIRCLES)


@dataclass(frozen=True)
class Seed:
    circles: Tuple[pcta.Circle, ...]
    step: int = HEPTAGRAM_STEP_SEED

    def __post_init__(self):
        if len(self.circles) != SEED_CIRCLES:
            raise ValueError(f"Seed must contain exactly {SEED_CIRCLES} circles")

    @property
    def aggregate(self) -> pcta.pcna.Tensor:  # type: ignore[attr-defined]
        sums = [0.0] * canon.TENSOR_DIM
        for circle in self.circles:
            for i, value in enumerate(circle.aggregate.payload):
                sums[i] += value
        return pcta.pcna.Tensor(payload=tuple(value / SEED_CIRCLES for value in sums))

    def heptagram_order(self, start: int = 0) -> Tuple[pcta.Circle, ...]:
        return tuple(self.circles[i] for i in heptagram_walk(start, self.step))

    def structural_shape(self) -> A0StructuralShape:
        return _seed_structural_shape(
            [circle.structural_shape().content_digest for circle in self.circles]
        )

    def param_count(self) -> int:
        return SEED_CIRCLES * canon.TENSORS_PER_CIRCLE * canon.TENSOR_DIM


def seed_identity() -> Seed:
    return Seed(tuple(pcta.circle_identity() for _ in range(SEED_CIRCLES)))


def from_circles(circles: List[pcta.Circle]) -> Seed:
    return Seed(tuple(circles))


def from_seed(seed: int, label: str = "") -> Seed:
    base = seed * SEED_CIRCLES
    return Seed(tuple(pcta.from_seed(base + i, f"{label}::circle{i}") for i in range(SEED_CIRCLES)))


def seed_compose(a: Seed, b: Seed) -> Seed:
    if len(a.circles) != len(b.circles):
        raise ValueError("Circle count mismatch")
    return Seed(
        tuple(pcta.heptagram_compose(ca, cb) for ca, cb in zip(a.circles, b.circles)),
        step=a.step,
    )


__all__ = [
    "Seed", "SEED_CIRCLES", "HEPTAGRAM_STEP_SEED",
    "heptagram_walk", "heptagram_walk_7_3",
    "seed_identity", "from_circles", "from_seed", "seed_compose",
]
