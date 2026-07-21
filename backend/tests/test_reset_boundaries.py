# === CHECKS ===
# id: check_public_gonol_source_fixture_exact
#   proves: public_gonol_source_fixture_exact, private_gonal_constructor_cannot_replace_fixture
#   call: self::test_public_gonol_source_fixture
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_public_gonol_validation_counts_available
#   proves: public_gonol_validation_counts_available
#   call: self::test_public_gonol_validation_counts_are_available
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_pre_reset_ucns_fails_closed
#   proves: pre_reset_ucns_fails_closed, ucns_bridge_fails_closed
#   call: self::test_ucns_runtime_is_typed_absence
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_a0_projection_preserves_origin
#   proves: a0_projection_preserves_origin, a0_projection_deterministic
#   call: self::test_a0_projection_has_no_angular_inscribe
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_a0_interaction_heuristics_no_edcm_claim
#   proves: a0_interaction_heuristics_bounded, a0_interaction_heuristics_no_edcm_claim
#   call: self::test_interaction_heuristics_are_local
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# === END CHECKS ===
"""Reset-boundary regression tests."""
from __future__ import annotations

from pathlib import Path

import pytest


def test_public_gonol_source_fixture():
    from interdependent_lib.gonal.gonal import (
        GonalSpec,
        PUBLIC_GONOL_157,
        PUBLIC_GONOL_SHA256,
        build_gonal,
        public_gonol_sha256,
    )

    before = PUBLIC_GONOL_157
    assert len(before) == 157
    assert len(set(before)) == 157
    assert before[0] == " "
    assert before.index("0") != 0
    assert public_gonol_sha256(before) == PUBLIC_GONOL_SHA256
    build_gonal(GonalSpec())
    assert PUBLIC_GONOL_157 is before


def test_public_gonol_validation_counts_are_available():
    from interdependent_lib.gonal.gonal import (
        GonalSpec,
        PUBLIC_GONOL_157,
        validate_gonal,
    )

    report = validate_gonal(PUBLIC_GONOL_157, GonalSpec())
    assert report["valid"] is True
    assert report["warnings"] == []
    assert report["counts"]["origin"] == 1
    assert report["counts"]["uppercase"] == 26
    assert report["counts"]["lowercase"] == 26
    assert report["counts"]["digit"] == 10
    assert sum(report["counts"].values()) == 157


def test_ucns_runtime_is_typed_absence():
    import ucns
    from interdependent_lib import ucns_bridge

    assert ucns.STATUS["state"] == "NA"
    assert ucns.STATUS["pre_reset_packages_authoritative"] is False
    assert ucns_bridge.STATUS["state"] == "NA"
    assert ucns_bridge.has_a0_safe_facade() is False
    with pytest.raises(ucns.UCNSUnavailableError):
        ucns.require_current_ucns()
    with pytest.raises(ucns_bridge.UCNSUnavailableError):
        ucns_bridge.multiply(object(), object())


def test_a0_projection_has_no_angular_inscribe():
    from interdependent_lib.zfae.gonal_inscription import PrivateGonal, inscribe_text

    gonal = PrivateGonal.from_seed(b"fixture")
    assert gonal.perm[0] == 0
    assert not hasattr(gonal, "inscribe")
    args = (
        gonal,
        [0.1] * 53,
        [0.2] * 53,
        [0.3] * 53,
        "digest",
    )
    assert inscribe_text(*args) == inscribe_text(*args)
    assert inscribe_text(*args)[1]["ucns_state"] == "NA"
    assert inscribe_text(*args)[1]["angular_return_claim"] is False


def test_interaction_heuristics_are_local():
    from interdependent_lib.interaction_heuristics import interaction_readout

    result = interaction_readout("No, this does not follow.", "This follows.")
    assert result.authority == "a0-local"
    assert result.edcm_validity_claim is False
    assert result.diagnosis_claim is False
    assert all(0.0 <= value <= 1.0 for value in result.values.values())


def test_default_dependencies_do_not_install_archived_ucns():
    root = Path(__file__).resolve().parents[2]
    pyproject = (root / "backend" / "pyproject.toml").read_text(encoding="utf-8")
    requirements = (root / "backend" / "requirements.txt").read_text(encoding="utf-8")
    assert "ucns==" not in pyproject
    assert "git+https://github.com/The-Interdependency/ucns" not in pyproject
    assert "ucns==" not in requirements


def test_removed_inflated_modules_are_absent():
    root = Path(__file__).resolve().parents[2] / "backend" / "interdependent_lib"
    assert not (root / "ucns_embed.py").exists()
    assert not (root / "edcm_readout.py").exists()
