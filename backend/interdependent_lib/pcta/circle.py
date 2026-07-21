# === MODULE_BUILD ===
# id: pcta_circle
#   module_name: circle
#   module_kind: core
#   summary: PCTA circle containing exactly seven PCNA tensors with structural heptagram routing and A0-local identity
#   owner: a0p maintainer
#   public_surface: Circle, circle_identity, circle_compose, heptagram_compose, tensor_count, from_tensors, from_seed, aggregate, structural_shape, heptagram_order
#   internal_surface: _circle_structural_shape
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
# id: pcta_circle_boundaries
#   summary: seven-tensor A0 structure; no current UCNS geometry or theorem claim
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: pcta_circle
#   summary: validates, aggregates, and heptagram-orders seven PCNA tensors
#   exposes: Circle, circle_identity, circle_compose, heptagram_compose, structural_shape
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: pcta_circle_seven_tensor_structure
#   given: a PCTA Circle
#   then: it holds exactly seven PCNA tensors and its aggregate is deterministic
#   class: correctness
# id: pcta_circle_ucns_absent
#   given: structural_shape is requested
#   then: the returned identity declares ucns_state=NA and no theorem transfer
#   class: provenance
# === END CONTRACTS ===
"""PCTA circle layer.

The seven-tensor and {7/2} routing structure remains A0 canon. The former
``ucns_shape`` construction created a pre-reset twistless object; it is replaced
with an A0-local identity envelope until a lawful producer exists.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import List, Tuple

import backend.interdependent_lib.pcna.tensor as pcna
import backend.interdependent_lib.ptca.constants as canon
from backend.interdependent_lib.structural_shape import A0StructuralShape, shape_from_content

CIRCLE_SIZE = canon.TENSORS_PER_CIRCLE
HEPTAGRAM_STEP_CIRCLE = canon.CIRCLE_ROUTING_STEP


def heptagram_walk(start: int, step: int, n: int = CIRCLE_SIZE) -> tuple[int, ...]:
    if n <= 0:
        raise ValueError("n must be positive")
    return tuple((start + i * step) % n for i in range(n))


def heptagram_walk_7_2(start: int = 0) -> tuple[int, ...]:
    return heptagram_walk(start, 2, CIRCLE_SIZE)


def heptagram_walk_7_3(start: int = 0) -> tuple[int, ...]:
    return heptagram_walk(start, 3, CIRCLE_SIZE)


def _circle_structural_shape(content) -> A0StructuralShape:
    return shape_from_content("pcta.circle", content)


@dataclass(frozen=True)
class Circle:
    tensors: Tuple[pcna.Tensor, ...]
    step: int = HEPTAGRAM_STEP_CIRCLE

    def __post_init__(self):
        if len(self.tensors) != CIRCLE_SIZE:
            raise ValueError(f"Circle must contain exactly {CIRCLE_SIZE} tensors")

    @property
    def aggregate(self) -> pcna.Tensor:
        sums = [0.0] * canon.TENSOR_DIM
        for tensor in self.tensors:
            for i, value in enumerate(tensor.payload):
                sums[i] += value
        return pcna.Tensor(payload=tuple(value / CIRCLE_SIZE for value in sums))

    def heptagram_order(self, start: int = 0) -> Tuple[pcna.Tensor, ...]:
        return tuple(self.tensors[i] for i in heptagram_walk(start, self.step))

    def structural_shape(self) -> A0StructuralShape:
        return _circle_structural_shape([tuple(t.payload) for t in self.tensors])


def tensor_count() -> int:
    return CIRCLE_SIZE


def circle_identity() -> Circle:
    return Circle(tuple(pcna.tensor_identity() for _ in range(CIRCLE_SIZE)))


def from_tensors(tensors: List[pcna.Tensor]) -> Circle:
    return Circle(tuple(tensors))


def from_seed(seed: int, label: str = "") -> Circle:
    base = seed * CIRCLE_SIZE
    return Circle(tuple(pcna.from_seed(base + i, f"{label}::pos{i}") for i in range(CIRCLE_SIZE)))


def heptagram_compose(a: Circle, b: Circle) -> Circle:
    if len(a.tensors) != len(b.tensors):
        raise ValueError("Tensor count mismatch")
    return Circle(
        tuple(pcna.tensor_compose(ta, tb) for ta, tb in zip(a.tensors, b.tensors)),
        step=a.step,
    )


def circle_compose(a: Circle, b: Circle) -> Circle:
    return heptagram_compose(a, b)


__all__ = [
    "Circle", "CIRCLE_SIZE", "HEPTAGRAM_STEP_CIRCLE",
    "heptagram_walk", "heptagram_walk_7_2", "heptagram_walk_7_3",
    "tensor_count", "circle_identity", "from_tensors", "from_seed",
    "heptagram_compose", "circle_compose",
]
