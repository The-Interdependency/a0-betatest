# === CHECKS ===
# id: check_a0_morphology_local_composition
#   proves: a0_morphology_local_composition
#   call: self::test_compose_word_is_local_and_deterministic
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_a0_morphology_decomposition_unavailable
#   proves: a0_morphology_decomposition_unavailable
#   call: self::test_decomposition_fails_closed
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# === END CHECKS ===
"""Tests for A0-local morphological framing."""
from __future__ import annotations

import math

import pytest

from interdependent_lib.zfae import closed_tokens as ct
from interdependent_lib.zfae import morphology as m
from interdependent_lib.zfae.gonal_inscription import PrivateGonal, inscribe_text


def test_ruled_weights():
    assert m.OMEGA_WEIGHT == 0.8
    assert m.PHI_WEIGHT == 0.4
    assert m.PSI_WEIGHT == 1.0


def test_bone_root_partition():
    assert ct.is_closed_class("the")
    assert ct.is_affix("ing")
    assert ct.is_open_class("planet")
    assert not ct.is_open_class("the")
    assert not ct.is_open_class("ing")


def test_frame_value_deterministic():
    first = m.frame_value(0.42)
    second = m.frame_value(0.42)
    assert first == second
    assert first.carrier in (2, 3, 5, 7, 11, 13)
    assert first.face == 1


def test_compose_word_is_local_and_deterministic():
    first = m.compose_word(0.2, -0.5)
    second = m.compose_word(0.2, -0.5)
    assert first == second
    assert first.carrier == math.lcm(first.root.carrier, first.bone.carrier)
    assert first.ucns_state == "NA"
    assert first.algebra_claim is False
    assert 0.0 <= m.word_signal(first) < 1.0


def test_decomposition_fails_closed():
    word = m.compose_word(0.3, 0.7)
    with pytest.raises(m.DecompositionUnavailableError):
        m.decompose_clause(word, word.root)


def test_inscribe_text_uses_local_word_frame():
    gonal = PrivateGonal.from_seed(b"morphology-test-seed")
    phi = [0.1 * ((i % 7) - 3) for i in range(53)]
    omega = [0.05 * ((i % 5) - 2) for i in range(53)]
    first = inscribe_text(gonal, phi, [0.0] * 53, omega, "deadbeefcafe", length=24)
    second = inscribe_text(gonal, phi, [0.0] * 53, omega, "deadbeefcafe", length=24)
    assert first == second
    assert first[1]["word_carrier"] >= 1
    assert first[1]["ucns_state"] == "NA"


def test_passed_psi_does_not_change_projection():
    gonal = PrivateGonal.from_seed(b"psi-independence-seed")
    phi = [0.2] * 53
    omega = [0.3] * 53
    first, _ = inscribe_text(gonal, phi, [0.0] * 53, omega, "feedface", length=16)
    second, _ = inscribe_text(gonal, phi, [0.9] * 53, omega, "feedface", length=16)
    assert first == second
