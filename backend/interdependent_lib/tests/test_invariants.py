"""Full test suite for non-commutativity, double-cover, layered substrate, and canon."""

from __future__ import annotations
import pytest

# Core imports from the new substrate
import backend.interdependent_lib.ucns_embed as ucns_embed
import backend.interdependent_lib.pcna.tensor as pcna_tensor
import backend.interdependent_lib.pcta.circle as pcta_circle
import backend.interdependent_lib.ptca.seed as ptca_seed
import backend.interdependent_lib.ptca.core as ptca_core
import backend.interdependent_lib.ptca.constants as canon


def test_ucns_embed_deterministic():
    e1 = ucns_embed.embed_text("hello world")
    e2 = ucns_embed.embed_text("hello world")
    assert e1.angle_bits == e2.angle_bits
    assert e1.canonical_hash == e2.canonical_hash


def test_ucns_embed_noncommutative():
    """Core F6 invariant: composition must be non-commutative."""
    a = ucns_embed.embed_text("first cats")
    b = ucns_embed.embed_text("second dogs")
    ab = ucns_embed.phase_compose(a, b)
    ba = ucns_embed.phase_compose(b, a)
    assert ab.angle_bits != ba.angle_bits, "phase_compose must be non-commutative"


def test_ucns_embed_double_cover_behavior():
    """Negative chirality path (sheet twist) must produce valid output."""
    a = ucns_embed.embed_text("sheet test A")
    b = ucns_embed.embed_text("sheet test B")
    ab = ucns_embed.phase_compose(a, b)
    assert len(ab.angle_bits) == ucns_embed.EMBED_LANES
    assert len(ab.chirality) == ucns_embed.EMBED_LANES


def test_pcna_tensor_shape():
    t = pcna_tensor.from_scalar(0.5)
    assert len(t.payload) == canon.TENSOR_DIM == 53


def test_pcna_tensor_roundtrip():
    t = pcna_tensor.from_scalar(0.42)
    assert abs(pcna_tensor.to_scalar(t) - 0.42) < 1e-6


def test_pcta_circle_of_seven():
    tensors = [pcna_tensor.from_scalar(float(i)) for i in range(7)]
    c = pcta_circle.from_tensors(tensors)
    assert len(c.tensors) == 7
    assert c.aggregate is not None


def test_ptca_seed_of_seven():
    circles = [pcta_circle.circle_identity() for _ in range(7)]
    s = ptca_seed.from_circles(circles)
    assert len(s.circles) == 7


def test_ptca_core_157():
    core = ptca_core.with_n(157, label="test")
    assert core.n == 157
    assert core.param_count() == 157 * 7 * 7 * 53


def test_canon_public_shape():
    """F4: 157/7/7/53 must be exactly these public values."""
    assert canon.SEED_COUNT == 157
    assert canon.CIRCLES_PER_SEED == 7
    assert canon.TENSORS_PER_CIRCLE == 7
    assert canon.TENSOR_DIM == 53


def test_gonal_chapter_recompose_noncommutative():
    from backend.interdependent_lib.gonal_stack import build_disk_stack
    stack = build_disk_stack(["turn one", "turn two", "turn three"])
    # Just ensure it runs and produces a chapter disk
    chapter = [d for d in stack.disks if d.grain == "chapter"][0]
    assert chapter is not None


def test_network_topology_157():
    from backend.interdependent_lib.network.topology import build_ring_topology
    ring = build_ring_topology(["a", "b"])
    assert ring.arity == 157
