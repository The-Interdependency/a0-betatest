# === MODULE_BUILD ===
# id: zfae_morphology
#   module_name: morphology
#   module_kind: engine
#   summary: A0-local morphological framing of root and bone lane values into a derived word frame without claiming current UCNS algebra
#   owner: Erin Spencer
#   public_surface: A0LaneFrame, A0WordFrame, BoneGonal, RootGonal, OMEGA_WEIGHT, PHI_WEIGHT, PSI_WEIGHT, frame_value, compose_word, word_signal, word_carrier, decompose_clause, DecompositionUnavailableError
#   internal_surface: _FRAME_DENOMS, _denom_for, _num_for
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: restore only after a versioned UCNS projection exists
#   no_llm_assertion: pure deterministic application framing
#   since: 2026-07-21
#   unresolved: no lawful current UCNS composition or inverse projection
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_morphology_boundaries
#   summary: application-local frames only; no UCNS object, multiply, quotient, unit, or theorem claim
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_morphology
#   summary: deterministic local root/bone framing and word-signal derivation
#   exposes: A0LaneFrame, A0WordFrame, compose_word, word_signal, word_carrier
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: a0_morphology_local_composition
#   given: phi and omega lane values
#   then: compose_word returns a deterministic A0WordFrame with integer carrier lcm and no UCNS claim
#   class: correctness
# id: a0_morphology_decomposition_unavailable
#   given: decompose_clause is called
#   then: it fails closed because no lawful inverse projection exists
#   class: provenance
# === END CONTRACTS ===
"""A0-local morphology.

The former implementation constructed pre-reset UCNS objects and called their
multiplication. The useful application behavior is retained as explicit local
framing: root and bone values select small integer carrier labels, and the
derived word frame records their integer least common multiple. This is not
UCNS multiplication.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

from .closed_tokens import AFFIXES, CLOSED_CLASS

OMEGA_WEIGHT = 0.8
PHI_WEIGHT = 0.4
PSI_WEIGHT = 1.0
_FRAME_DENOMS = (2, 3, 5, 7, 11, 13)


@dataclass(frozen=True)
class A0LaneFrame:
    carrier: int
    vertex: int
    face: int
    value: float


@dataclass(frozen=True)
class A0WordFrame:
    root: A0LaneFrame
    bone: A0LaneFrame
    carrier: int
    signal: float
    ucns_state: str = "NA"
    algebra_claim: bool = False


def _denom_for(value: float) -> int:
    return _FRAME_DENOMS[int(abs(float(value)) * 1000.0) % len(_FRAME_DENOMS)]


def _num_for(value: float, denom: int) -> int:
    return int(abs(float(value)) * denom * 7.0) % denom


def frame_value(value: float) -> A0LaneFrame:
    value = float(value)
    carrier = _denom_for(value)
    return A0LaneFrame(
        carrier=carrier,
        vertex=_num_for(value, carrier),
        face=-1 if value < 0.0 else 1,
        value=value,
    )


def compose_word(phi_value: float, omega_value: float) -> A0WordFrame:
    root = frame_value(phi_value)
    bone = frame_value(omega_value)
    carrier = math.lcm(root.carrier, bone.carrier)
    phase = (
        (root.vertex / root.carrier)
        + (bone.face * bone.vertex / bone.carrier)
    ) % 1.0
    return A0WordFrame(root=root, bone=bone, carrier=carrier, signal=phase)


def word_carrier(word: A0WordFrame | None) -> int:
    return word.carrier if word is not None else 1


def word_signal(word: A0WordFrame | None) -> float:
    return word.signal if word is not None else 0.0


@dataclass(frozen=True)
class RootGonal:
    stems: tuple[str, ...] = field(default_factory=tuple)
    weight: float = PHI_WEIGHT

    def frame(self, value: float) -> A0LaneFrame:
        return frame_value(value)


@dataclass(frozen=True)
class BoneGonal:
    bones: tuple[str, ...] = field(
        default_factory=lambda: tuple(sorted(CLOSED_CLASS | AFFIXES))
    )
    weight: float = OMEGA_WEIGHT

    def frame(self, value: float) -> A0LaneFrame:
        return frame_value(value)


class DecompositionUnavailableError(RuntimeError):
    pass


def decompose_clause(clause, known_factor):
    raise DecompositionUnavailableError(
        "A0 morphology decomposition is unavailable: no current twist-bearing "
        "UCNS producer or lawful inverse projection exists"
    )


__all__ = [
    "A0LaneFrame", "A0WordFrame", "BoneGonal", "RootGonal",
    "OMEGA_WEIGHT", "PHI_WEIGHT", "PSI_WEIGHT",
    "frame_value", "compose_word", "word_signal", "word_carrier",
    "decompose_clause", "DecompositionUnavailableError",
]
