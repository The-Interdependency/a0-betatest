# === MODULE_BUILD ===
# id: ptca_core
#   module_name: core
#   module_kind: core
#   summary: PTCA core containing N seeds with deterministic aggregate and A0-local structural identity
#   owner: a0p maintainer
#   public_surface: Core, with_n, from_seeds, aggregate, param_count, structural_shape, n, label
#   internal_surface: _core_structural_shape
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
# id: ptca_core_boundaries
#   summary: N-seed A0 structure; no current UCNS geometry or theorem claim
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: ptca_core
#   summary: aggregates N seeds and emits an A0-local identity envelope
#   exposes: Core, with_n, from_seeds, structural_shape
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: ptca_core_structure
#   given: a PTCA Core
#   then: it contains one or more seeds and has the declared parameter count
#   class: correctness
# id: ptca_core_ucns_absent
#   given: structural_shape is requested
#   then: the returned identity declares ucns_state=NA and no theorem transfer
#   class: provenance
# === END CONTRACTS ===
"""PTCA core layer with current UCNS explicitly absent."""
from __future__ import annotations

from dataclasses import dataclass
from typing import List, Sequence, Tuple

import backend.interdependent_lib.ptca.constants as canon
from backend.interdependent_lib.structural_shape import A0StructuralShape, shape_from_content

DEFAULT_N = canon.SEED_COUNT


def _core_structural_shape(content) -> A0StructuralShape:
    return shape_from_content("ptca.core", content)


def core_aggregate(tensors: Sequence):
    from backend.interdependent_lib.pcna.tensor import Tensor, tensor_identity
    if not tensors:
        return tensor_identity()
    sums = [0.0] * canon.TENSOR_DIM
    for tensor in tensors:
        for i, value in enumerate(tensor.payload):
            sums[i] += value
    return Tensor(payload=tuple(value / len(tensors) for value in sums))


@dataclass(frozen=True)
class Core:
    seeds: Tuple[object, ...]
    label: str = "phi"

    def __post_init__(self):
        if not self.seeds:
            raise ValueError("Core requires at least one Seed")

    @property
    def n(self) -> int:
        return len(self.seeds)

    @property
    def aggregate(self):
        return core_aggregate([seed.aggregate for seed in self.seeds])

    def param_count(self) -> int:
        return self.n * canon.CIRCLES_PER_SEED * canon.TENSORS_PER_CIRCLE * canon.TENSOR_DIM

    def structural_shape(self) -> A0StructuralShape:
        return _core_structural_shape(
            [seed.structural_shape().content_digest for seed in self.seeds]
        )


def with_n(n: int = DEFAULT_N, label: str = "phi") -> Core:
    if n <= 0:
        raise ValueError("n must be positive")
    from backend.interdependent_lib.ptca.seed import from_seed as seed_from_seed
    return Core(tuple(seed_from_seed(i, f"{label}::seed{i}") for i in range(n)), label=label)


def from_seeds(seeds: List[object], label: str = "phi") -> Core:
    return Core(tuple(seeds), label=label)


__all__ = ["Core", "DEFAULT_N", "core_aggregate", "with_n", "from_seeds"]
