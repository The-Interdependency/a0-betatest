# === MODULE_BUILD ===
# id: a0_interaction_heuristics
#   module_name: interaction_heuristics
#   module_kind: adapter
#   summary: deterministic A0-local text interaction heuristics for the training view
#   owner: Erin Spencer
#   public_surface: InteractionHeuristicReadout, interaction_readout, HEURISTIC_NAMES, ALERT_HIGH, ALERT_LOW
#   internal_surface: _tokens, _jaccard, _bone_set, _neg_density, _ttr, _intensity, _band
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: revert
#   since: 2026-07-21
#   unresolved: no maintained EDCM metric authority is consumed here
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: a0_interaction_heuristics_boundaries
#   summary: local bounded text features only; no EDCM validity, diagnosis, intent, belief, or hidden-state claim
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: a0_interaction_heuristics
#   summary: computes six inspectable local text features for training feedback
#   exposes: InteractionHeuristicReadout, interaction_readout
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: a0_interaction_heuristics_bounded
#   given: current text and optional prior text
#   then: every heuristic is deterministic and bounded to [0,1]
#   class: correctness
# id: a0_interaction_heuristics_no_edcm_claim
#   given: a heuristic readout
#   then: authority is a0-local and edcm_validity_claim is false
#   class: provenance
# === END CONTRACTS ===
"""A0-local interaction heuristics.

These features were formerly presented under EDCM names. They remain useful
for UI feedback but are not the maintained EDCM measurement implementation.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Optional

from .zfae.morphology import BoneGonal

HEURISTIC_NAMES = (
    "structural_mismatch",
    "negation_density",
    "lexical_drift",
    "vocabulary_spread_delta",
    "surface_intensity",
    "turn_length_balance",
)
ALERT_HIGH = 0.80
ALERT_LOW = 0.20
_TOKEN_RE = re.compile(r"[a-z0-9']+")
_BONES = frozenset(BoneGonal().bones)
_NEG = frozenset(
    {"not", "no", "never", "none", "cannot", "cant", "without", "neither", "nor", "dont", "wont"}
)


def _tokens(text: str) -> list[str]:
    return _TOKEN_RE.findall((text or "").lower())


def _bone_set(text: str) -> set[str]:
    return {token for token in _tokens(text) if token in _BONES}


def _jaccard(left: set, right: set) -> float:
    union = left | right
    return len(left & right) / len(union) if union else 1.0


def _neg_density(text: str) -> float:
    tokens = _tokens(text)
    if not tokens:
        return 0.0
    count = sum(1 for token in tokens if token in _NEG or token.endswith("n't"))
    return min(1.0, count / len(tokens) * 4.0)


def _ttr(text: str) -> float:
    tokens = _tokens(text)
    return len(set(tokens)) / len(tokens) if tokens else 0.0


def _intensity(text: str) -> float:
    raw = text or ""
    n = max(1, len(raw))
    length = min(1.0, len(_tokens(raw)) / 60.0)
    caps = sum(1 for char in raw if char.isupper()) / n
    punctuation = raw.count("!") + raw.count("?")
    return min(
        1.0,
        0.5 * length
        + 0.3 * min(1.0, caps * 5.0)
        + 0.2 * min(1.0, punctuation / 5.0),
    )


def _band(value: float) -> str:
    return "high" if value >= ALERT_HIGH else "low" if value <= ALERT_LOW else "nominal"


@dataclass(frozen=True)
class InteractionHeuristicReadout:
    grain: str
    values: dict[str, float]
    bands: dict[str, str]
    structural_tokens_present: int
    authority: str = "a0-local"
    edcm_validity_claim: bool = False
    diagnosis_claim: bool = False

    def as_dict(self) -> dict:
        return {
            "grain": self.grain,
            "values": dict(self.values),
            "bands": dict(self.bands),
            "structural_tokens_present": self.structural_tokens_present,
            "authority": self.authority,
            "edcm_validity_claim": self.edcm_validity_claim,
            "diagnosis_claim": self.diagnosis_claim,
        }


def interaction_readout(
    current_text: str,
    previous_text: Optional[str] = None,
    grain: str = "turn",
) -> InteractionHeuristicReadout:
    current_tokens = set(_tokens(current_text))
    current_bones = _bone_set(current_text)
    raised = len(current_bones)
    if previous_text is not None:
        previous_tokens = set(_tokens(previous_text))
        previous_bones = _bone_set(previous_text)
        mismatch = 1.0 - _jaccard(current_bones, previous_bones)
        drift = 1.0 - _jaccard(current_tokens, previous_tokens)
        spread = abs(_ttr(current_text) - _ttr(previous_text))
        current_len = len(_tokens(current_text))
        previous_len = len(_tokens(previous_text))
        balance = (
            1.0 - abs(current_len - previous_len) / (current_len + previous_len)
            if current_len + previous_len
            else 0.5
        )
    else:
        mismatch = 1.0 - (raised / len(current_tokens)) if current_tokens else 0.0
        drift = 0.0
        spread = _ttr(current_text)
        balance = 0.5
    values = {
        "structural_mismatch": mismatch,
        "negation_density": _neg_density(current_text),
        "lexical_drift": drift,
        "vocabulary_spread_delta": spread,
        "surface_intensity": _intensity(current_text),
        "turn_length_balance": balance,
    }
    bounded = {
        name: round(min(1.0, max(0.0, value)), 6)
        for name, value in values.items()
    }
    return InteractionHeuristicReadout(
        grain=grain,
        values=bounded,
        bands={name: _band(value) for name, value in bounded.items()},
        structural_tokens_present=raised,
    )


__all__ = [
    "InteractionHeuristicReadout", "interaction_readout",
    "HEURISTIC_NAMES", "ALERT_HIGH", "ALERT_LOW",
]
