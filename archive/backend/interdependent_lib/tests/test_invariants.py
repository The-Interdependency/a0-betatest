# === CHECKS ===
# id: check_a0_phase_embedding_deterministic
#   proves: a0_phase_embedding_deterministic
#   call: self::test_phase_embedding_deterministic
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_a0_phase_composition_ordered
#   proves: a0_phase_composition_ordered
#   call: self::test_phase_embedding_order_sensitive
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_a0_layered_structure
#   proves: pcta_circle_seven_tensor_structure, ptca_seed_seven_circle_structure, ptca_core_structure
#   call: self::test_layered_structure
#   requires: python3
#   timeout: 60
#   mutates: none
#   cleanup: none
# id: check_a0_disk_stack_ordered
#   proves: a0_disk_stack_ordered, a0_disk_stack_no_ucns_claim
#   call: self::test_disk_stack_order_sensitive
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# === END CHECKS ===
"""Regression tests for the A0-local layered substrate after UCNS suspension."""
from __future__ import annotations

import backend.interdependent_lib.pcna.tensor as pcna_tensor
import backend.interdependent_lib.pcta.circle as pcta_circle
import backend.interdependent_lib.ptca.constants as canon
import backend.interdependent_lib.ptca.core as ptca_core
import backend.interdependent_lib.ptca.seed as ptca_seed
from backend.interdependent_lib.phase_embedding import (
    EMBED_LANES,
    SOURCE_CARRIER_ARITY,
    embed_text,
    ordered_phase_compose,
)


def test_phase_embedding_deterministic():
    first = embed_text("hello world")
    second = embed_text("hello world")
    assert first.phase_bits == second.phase_bits
    assert first.orientation == second.orientation
    assert first.content_identity == second.content_identity
    assert first.geometry_status == "a0-phase:experimental"
    assert first.double_cover_claim is False


def test_phase_embedding_order_sensitive():
    first = embed_text("first cats")
    second = embed_text("second dogs")
    forward = ordered_phase_compose(first, second)
    reverse = ordered_phase_compose(second, first)
    assert forward.phase_bits != reverse.phase_bits
    assert forward.source_carrier_arity == SOURCE_CARRIER_ARITY
    assert forward.lanes == EMBED_LANES
    assert len(forward.phase_bits) == EMBED_LANES
    assert len(forward.orientation) == EMBED_LANES


def test_pcna_tensor_shape_and_roundtrip():
    tensor = pcna_tensor.from_scalar(0.42)
    assert len(tensor.payload) == canon.TENSOR_DIM == 53
    assert abs(pcna_tensor.to_scalar(tensor) - 0.42) < 1e-6


def test_layered_structure():
    tensors = [pcna_tensor.from_scalar(float(i)) for i in range(7)]
    circle = pcta_circle.from_tensors(tensors)
    assert len(circle.tensors) == 7
    assert circle.structural_shape().ucns_state == "NA"
    assert pcta_circle.heptagram_walk_7_2() == (0, 2, 4, 6, 1, 3, 5)

    seed = ptca_seed.from_circles(
        [pcta_circle.circle_identity() for _ in range(7)]
    )
    assert len(seed.circles) == 7
    assert seed.structural_shape().ucns_state == "NA"
    assert ptca_seed.heptagram_walk_7_3() == (0, 3, 6, 2, 5, 1, 4)

    core = ptca_core.with_n(157, label="test")
    assert core.n == 157
    assert core.param_count() == 157 * 7 * 7 * 53
    assert core.structural_shape().ucns_state == "NA"


def test_canon_public_shape():
    assert canon.SEED_COUNT == 157
    assert canon.CIRCLES_PER_SEED == 7
    assert canon.TENSORS_PER_CIRCLE == 7
    assert canon.TENSOR_DIM == 53


def test_disk_stack_order_sensitive():
    from backend.interdependent_lib.gonal_stack import (
        GEOMETRY_STATUS,
        GRAIN_LADDER,
        build_disk_stack,
    )

    forward = build_disk_stack(["turn one", "turn two", "turn three"])
    reverse = build_disk_stack(["turn three", "turn two", "turn one"])
    assert tuple(disk.grain for disk in forward.disks) == GRAIN_LADDER
    assert len(forward.disks) == 5
    assert forward.disks[-1].content_identity != reverse.disks[-1].content_identity
    assert forward.geometry_status == GEOMETRY_STATUS == "a0-g:experimental"
    assert forward.ucns_state == "NA"
    assert forward.theorem_status_transfer is False


def test_network_topology_canon():
    from backend.interdependent_lib.network.topology import (
        RING_TOPOLOGY,
        unique_heptagram_slots,
    )

    assert RING_TOPOLOGY["phi"].n_seeds == 157
    assert RING_TOPOLOGY["psi"].n_seeds == 157
    assert RING_TOPOLOGY["omega"].n_seeds == 157
    assert unique_heptagram_slots()
