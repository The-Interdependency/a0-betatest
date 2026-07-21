# === CHECKS ===
# id: check_zfae_route_a_projection
#   proves: a0_projection_preserves_origin, a0_projection_deterministic
#   call: self::test_private_gonal_is_deterministic_bijection
#   requires: python3
#   timeout: 30
#   mutates: temporary_files
#   cleanup: tempfile_context
# === END CHECKS ===
"""Regression tests for the A0-local Route A field-to-glyph projection."""
from __future__ import annotations

import os
import tempfile

from interdependent_lib.zfae.gonal_inscription import (
    BRIDGE_OUT_WIDTH,
    PrivateGonal,
    inscribe_text,
    whiten_payload,
    whitened_indices,
)
from interdependent_lib.zfae.inference import A0ZFAEInferenceEngine
from interdependent_lib.zfae.weights import A0ZFAEWeightBank


def test_private_gonal_is_deterministic_bijection():
    first = PrivateGonal.from_seed(b"seed-A")
    second = PrivateGonal.from_seed(b"seed-A")
    assert first.phase == second.phase
    assert first.perm == second.perm
    assert sorted(first.perm) == list(range(first.n))
    assert first.perm[0] == 0
    assert first.arrangement[0] == " "
    assert not hasattr(first, "inscribe")
    assert PrivateGonal.from_seed(b"seed-B").perm != first.perm


def test_advance_changes_phase_deterministically():
    gonal = PrivateGonal.from_seed(b"seed-A")
    first = gonal.advance(1, "deadbeef")
    second = gonal.advance(1, "deadbeef")
    assert first.phase == second.phase
    assert first.perm == gonal.perm
    assert first.perm[0] == 0


def test_whitening_bridge_53_to_32():
    payload = [0.01 * index for index in range(53)]
    whitened = whiten_payload(payload, b"seed")
    assert isinstance(whitened, bytes)
    assert len(whitened) == BRIDGE_OUT_WIDTH
    indices = whitened_indices(whitened, 53, 100)
    assert len(indices) == 100
    assert all(0 <= index < 53 for index in indices)


def test_inscribe_text_is_deterministic_and_explicitly_local():
    gonal = PrivateGonal.from_seed(b"seed-A")
    phi = [0.1 * ((index % 7) - 3) for index in range(53)]
    omega = [0.02 * ((index % 3) - 1) for index in range(53)]
    first, metadata = inscribe_text(gonal, phi, [0.0] * 53, omega, "abc123")
    second, second_metadata = inscribe_text(gonal, phi, [0.9] * 53, omega, "abc123")
    assert first == second
    assert metadata == second_metadata
    assert first
    assert metadata["projection"] == "a0-dimensionless-field-scalar/1.0.0"
    assert metadata["ucns_state"] == "NA"
    assert metadata["angular_return_claim"] is False
    assert {"vertex_idx", "phase", "pcea_digest_prefix"} <= set(metadata)
    assert inscribe_text(gonal, phi, [0.0] * 53, omega, "zzz999")[0] != first


def test_spaces_are_preserved_as_origin_events():
    gonal = PrivateGonal.from_seed(b"origin-emit")
    phi = [0.0] * 53
    omega = [0.0] * 53
    text, metadata = inscribe_text(gonal, phi, [0.0] * 53, omega, "0000", length=40)
    if metadata["seam_emissions"] > 0:
        assert " " in text
    assert inscribe_text(gonal, phi, [0.0] * 53, omega, "0000", length=40)[0] == text


def test_engine_route_a_and_route_b_remain_distinct():
    bank = A0ZFAEWeightBank.fresh("route-a-agent")
    engine = A0ZFAEInferenceEngine()
    route_a = engine.infer(rawPrompt="describe the state", gonal_seed=bank.gonal_seed_bytes)
    assert route_a["trace"]["decoder"] == "gonal_inscription_v1"
    assert route_a["trace"]["zfae_decode"]["ucns_state"] == "NA"
    assert route_a["trace"]["pcea_ciphertext_digest_prefix"]
    assert len(route_a["nextSnapshot"]["phi"]) == 53

    route_b = engine.infer(rawPrompt="describe the state")
    assert route_b["trace"]["decoder"] == "template_grammar_v1"
    assert route_b["assistantText"]


def test_gonal_seed_persists_through_safetensors():
    bank = A0ZFAEWeightBank.fresh("persist-agent")
    seed = bank.gonal_seed_bytes
    with tempfile.TemporaryDirectory() as directory:
        path = os.path.join(directory, "checkpoint.safetensors")
        bank.save(path)
        loaded = A0ZFAEWeightBank.load(path, "persist-agent")
        assert loaded.gonal_seed_bytes == seed
        assert loaded.zfae_weight_count == 1_223_187
