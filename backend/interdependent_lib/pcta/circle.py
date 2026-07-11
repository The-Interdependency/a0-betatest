# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
# === MODULE_BUILD ===
# id: pcta_circle
#   module_name: circle
#   module_kind: core
#   summary: PCTA circle — UCNS object carrying exactly 7 PCNA leaf tensors. {7/2} heptagram composition. Manifest-first. F4: 157/7/7/53 is public load-bearing canon (no decoupling).
#   owner: a0p maintainer
#   public_surface: Circle, circle_identity, circle_compose, heptagram_compose, tensor_count, from_tensors, from_seed, aggregate, ucns_shape, heptagram_order
#   internal_surface: _validate_seven, _circle_ucns_shape
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: a0p_skills.contracts.pcta_circle_shape_holds, a0p_skills.contracts.pcta_circle_heptagram, a0p_skills.contracts.pcta_circle_holds_seven_holds, a0p_skills.contracts.pcta_circle_aggregate_is_tensor_holds
#   rollout: default_enabled
#   rollback: revert file from git
#   unresolved: hmmm (full non-commutativity + R/4πZ double-cover enforcement pending gonal remediation; current heptagram is structural)
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: pcta_circle_boundaries
#   summary: PCTA circle — exactly 7 PCNA tensors per circle; circle itself acts as a tensor at this layer (recursive)
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: pcta_circle
#   summary: PCTA circle layer — 7-tensor UCNS aggregate with {7/2} heptagram routing
#   exposes: Circle, circle_identity, circle_compose, heptagram_compose, tensor_count, from_tensors, from_seed, aggregate, ucns_shape, heptagram_order
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""
PCTA circle layer (Part 2 rebuild — step 2, aligned).

A Circle is the first UCNS-aware aggregate in the layered model:
  - Holds exactly 7 PCNA leaf Tensors (d=53 each)
  - The circle itself is a tensor at this level (recursive fractal)
  - Composition via {7/2} heptagram (CIRCLE_ROUTING_STEP = 2)

**F4 Ratification (2026-07-10)**: The quartet
    SEED_COUNT         = 157
    CIRCLES_PER_SEED   = 7
    TENSORS_PER_CIRCLE = 7
    TENSOR_DIM         = 53
is **load-bearing public canon**. Not arbitrary. Decoupling is not a thing.
These exact values are used here and in all higher layers.

Non-commutativity (a×b ≠ b×a) and R/4πZ double-cover invariants are
enforced at the gonal/embed layer (F6 audit). This module provides the
structural heptagram lift and UCNS mirror; full invariant wiring will
happen when the training-surface remediation completes.
"""
from __future__ import annotations
from dataclasses import dataclass
from fractions import Fraction
from typing import List, Tuple

import ucns

import backend.interdependent_lib.pcna.tensor as pcna
import backend.interdependent_lib.ptca.constants as canon

CIRCLE_SIZE: int = canon.TENSORS_PER_CIRCLE
HEPTAGRAM_STEP_CIRCLE: int = canon.CIRCLE_ROUTING_STEP


def heptagram_walk(start: int, step: int, n: int = CIRCLE_SIZE) -> tuple[int, ...]:
    if n <= 0:
        raise ValueError("n must be positive")
    out: list[int] = []
    cur = start % n
    for _ in range(n):
        out.append(cur)
        cur = (cur + step) % n
    return tuple(out)


def heptagram_walk_7_2(start: int = 0) -> tuple[int, ...]:
    return heptagram_walk(start, 2, CIRCLE_SIZE)


def heptagram_walk_7_3(start: int = 0) -> tuple[int, ...]:
    return heptagram_walk(start, 3, CIRCLE_SIZE)


def _circle_ucns_shape(content_hash: int = 0) -> "ucns.UCNSObject":
    face_bit = int(content_hash) & 1
    return ucns.UCNSObject(2, 2, [(Fraction(0), 1.0), (Fraction(1), 1.0)], [face_bit, face_bit])


@dataclass(frozen=True)
class Circle:
    """Circle = UCNS object carrying exactly 7 PCNA leaf tensors."""
    tensors: Tuple[pcna.Tensor, ...]
    step: int = HEPTAGRAM_STEP_CIRCLE

    def __post_init__(self):
        if len(self.tensors) != CIRCLE_SIZE:
            raise ValueError(f"Circle must contain exactly {CIRCLE_SIZE} tensors")

    @property
    def aggregate(self) -> pcna.Tensor:
        if not self.tensors:
            return pcna.tensor_identity()
        sums = [0.0] * canon.TENSOR_DIM
        for tensor in self.tensors:
            for i, value in enumerate(tensor.payload):
                sums[i] += value
        return pcna.Tensor(payload=tuple(value / len(self.tensors) for value in sums))

    def heptagram_order(self, start: int = 0) -> Tuple[pcna.Tensor, ...]:
        walk = heptagram_walk(start, self.step, CIRCLE_SIZE)
        return tuple(self.tensors[i] for i in walk)

    def ucns_shape(self) -> "ucns.UCNSObject":
        return _circle_ucns_shape(hash(tuple(t.payload for t in self.tensors)))


def tensor_count() -> int:
    return CIRCLE_SIZE


def circle_identity() -> Circle:
    return Circle(tensors=tuple(pcna.tensor_identity() for _ in range(CIRCLE_SIZE)))


def from_tensors(tensors: List[pcna.Tensor]) -> Circle:
    if len(tensors) != CIRCLE_SIZE:
        raise ValueError(f"Exactly {CIRCLE_SIZE} tensors required")
    return Circle(tensors=tuple(tensors))


def from_seed(seed: int, label: str = "") -> Circle:
    base = seed * CIRCLE_SIZE
    return Circle(tensors=tuple(pcna.from_seed(base + i, f"{label}::pos{i}") for i in range(CIRCLE_SIZE)))


def heptagram_compose(a: Circle, b: Circle) -> Circle:
    """Structural {7/2} composition; non-commutative lift remains at the gonal layer."""
    if len(a.tensors) != len(b.tensors):
        raise ValueError("Tensor count mismatch")
    return Circle(tensors=tuple(pcna.tensor_compose(ta, tb) for ta, tb in zip(a.tensors, b.tensors)), step=a.step)


def circle_compose(a: Circle, b: Circle) -> Circle:
    return heptagram_compose(a, b)

# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
