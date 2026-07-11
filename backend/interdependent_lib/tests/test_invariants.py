"""Regression tests for the repaired layered substrate and gonal composition."""

from __future__ import annotations

import backend.interdependent_lib.ucns_embed as ucns_embed
import backend.interdependent_lib.pcna.tensor as pcna_tensor
import backend.interdependent_lib.pcta.circle as pcta_circle
import backend.interdependent_lib.ptca.seed as ptca_seed
import backend.interdependent_lib.ptca.core as ptca_core
import backend.interdependent_lib.ptca.constants as canon


def test_ucns_embed_deterministic():
    first = ucns_embed.embed_text("hello world")
    second = ucns_embed.embed_text("hello world")
    assert first.angle_bits == second.angle_bits
    assert first.chirality == second.chirality
    assert first.canonical_hash == second.canonical_hash


def test_ucns_embed_noncommutative_for_fixture_pair():
    a = ucns_embed.embed_text("first cats")
    b = ucns_embed.embed_text("second dogs")
    assert ucns_embed.phase_compose(a, b).angle_bits != ucns_embed.phase_compose(b, a).angle_bits


def test_ucns_embed_composition_preserves_shape():
    """This is a shape regression, not proof of an R/4πZ double cover."""
    a = ucns_embed.embed_text("sheet test A")
    b = ucns_embed.embed_text("sheet test B")
    composed = ucns_embed.phase_compose(a, b)
    assert composed.carrier == ucns_embed.UCNS_CARRIER_ARITY
    assert composed.lanes == ucns_embed.EMBED_LANES
    assert len(composed.angle_bits) == ucns_embed.EMBED_LANES
    assert len(composed.chirality) == ucns_embed.EMBED_LANES


def test_pcna_tensor_shape():
    tensor = pcna_tensor.from_scalar(0.5)
    assert len(tensor.payload) == canon.TENSOR_DIM == 53


def test_pcna_tensor_roundtrip():
    tensor = pcna_tensor.from_scalar(0.42)
    assert abs(pcna_tensor.to_scalar(tensor) - 0.42) < 1e-6


def test_pcta_circle_of_seven():
    tensors = [pcna_tensor.from_scalar(float(i)) for i in range(7)]
    circle = pcta_circle.from_tensors(tensors)
    assert len(circle.tensors) == 7
    assert circle.aggregate is not None
    assert pcta_circle.heptagram_walk_7_2() == (0, 2, 4, 6, 1, 3, 5)


def test_ptca_seed_of_seven():
    circles = [pcta_circle.circle_identity() for _ in range(7)]
    seed = ptca_seed.from_circles(circles)
    assert len(seed.circles) == 7
    assert ptca_seed.heptagram_walk_7_3() == (0, 3, 6, 2, 5, 1, 4)


def test_ptca_core_157():
    core = ptca_core.with_n(157, label="test")
    assert core.n == 157
    assert core.param_count() == 157 * 7 * 7 * 53


def test_canon_public_shape():
    assert canon.SEED_COUNT == 157
    assert canon.CIRCLES_PER_SEED == 7
    assert canon.TENSORS_PER_CIRCLE == 7
    assert canon.TENSOR_DIM == 53


def test_gonal_stack_restored_and_order_sensitive():
    from backend.interdependent_lib.gonal_stack import GRAIN_LADDER, build_disk_stack

    forward = build_disk_stack(["turn one", "turn two", "turn three"])
    reverse = build_disk_stack(["turn three", "turn two", "turn one"])

    assert tuple(disk.grain for disk in forward.disks) == GRAIN_LADDER
    assert len(forward.disks) == 5
    assert forward.disks[-1].grain == "chapter"
    assert forward.disks[-1].embedding_hash != reverse.disks[-1].embedding_hash


def test_network_topology_canon():
    from backend.interdependent_lib.network.topology import RING_TOPOLOGY, unique_heptagram_slots

    assert RING_TOPOLOGY["phi"].n_seeds == 157
    assert RING_TOPOLOGY["psi"].n_seeds == 157
    assert RING_TOPOLOGY["omega"].n_seeds == 157
    assert unique_heptagram_slots()
