# === MODULE_BUILD ===
# id: a0_phase_embedding
#   module_name: phase_embedding
#   module_kind: adapter
#   summary: deterministic A0 text phase embedding with explicitly local ordered composition
#   owner: a0p maintainer
#   public_surface: A0PhaseEmbedding, embed_text, ordered_phase_compose, SOURCE_CARRIER_ARITY, EMBED_LANES
#   internal_surface: _lane_values, _bone_skeleton
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: revert
#   since: 2026-07-21
#   unresolved: no current UCNS embedding claim
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: a0_phase_embedding_boundaries
#   summary: application-local hash-derived phase lanes; no UCNS object, double-cover, or theorem claim
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: a0_phase_embedding
#   summary: deterministic local phase representation and ordered noncommutative application composition
#   exposes: A0PhaseEmbedding, embed_text, ordered_phase_compose
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: a0p maintainer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: a0_phase_embedding_deterministic
#   given: identical text
#   then: embed_text returns identical lanes and content identity
#   class: correctness
# id: a0_phase_composition_ordered
#   given: two phase embeddings
#   then: ordered_phase_compose preserves order and makes no double-cover claim
#   class: correctness
# === END CONTRACTS ===
"""A0-local text phase embedding.

This is a hash-derived application representation. It is not UCNS-native and
its orientation array is not evidence of a Möbius double cover.
"""
from __future__ import annotations

import hashlib
import math
import re
from dataclasses import dataclass

from .zfae.closed_tokens import strip_affixes
from .zfae.morphology import (
    BoneGonal,
    OMEGA_WEIGHT,
    PHI_WEIGHT,
    PSI_WEIGHT,
    compose_word,
    word_signal,
)

SOURCE_CARRIER_ARITY = 157
EMBED_LANES = 53
_TWO16 = 65536
_TOKEN_RE = re.compile(r"[a-z0-9']+")
_BONES = frozenset(BoneGonal().bones)


def _lane_values(seed: bytes) -> tuple[float, ...]:
    return tuple(
        value / 256.0
        for value in hashlib.blake2b(seed, digest_size=EMBED_LANES).digest()
    )


def _bone_skeleton(text: str) -> str:
    units: list[str] = []
    for token in _TOKEN_RE.findall((text or "").lower()):
        if token in _BONES:
            units.append(token)
            continue
        root = strip_affixes(token)
        if root and root != token:
            index = token.find(root)
            if index >= 0:
                units.extend(x for x in (token[:index], token[index + len(root):]) if x)
            else:
                units.append("aff")
    return " ".join(units)


@dataclass(frozen=True)
class A0PhaseEmbedding:
    phase_bits: tuple[int, ...]
    orientation: tuple[int, ...]
    source_carrier_arity: int
    lanes: int
    content_identity: str
    geometry_status: str = "a0-phase:experimental"
    double_cover_claim: bool = False
    theorem_status_transfer: bool = False

    def similarity(self, other: "A0PhaseEmbedding") -> float:
        if self.lanes != other.lanes or not self.lanes:
            return 0.0
        return sum(
            math.cos(2.0 * math.pi * (a - b) / _TWO16)
            for a, b in zip(self.phase_bits, other.phase_bits)
        ) / self.lanes

    def coherence(self) -> float:
        if not self.lanes:
            return 0.0
        c = sum(math.cos(2.0 * math.pi * x / _TWO16) for x in self.phase_bits)
        s = sum(math.sin(2.0 * math.pi * x / _TWO16) for x in self.phase_bits)
        return math.hypot(c / self.lanes, s / self.lanes)

    def as_dict(self) -> dict:
        return {
            "source_carrier_arity": self.source_carrier_arity,
            "lanes": self.lanes,
            "content_identity": self.content_identity,
            "phase_bits": list(self.phase_bits),
            "orientation": list(self.orientation),
            "geometry_status": self.geometry_status,
            "double_cover_claim": self.double_cover_claim,
            "theorem_status_transfer": self.theorem_status_transfer,
        }


def embed_text(text: str) -> A0PhaseEmbedding:
    text = text or ""
    phi = _lane_values(text.encode("utf-8"))
    omega = _lane_values(_bone_skeleton(text).encode("utf-8"))
    phases: list[int] = []
    orientation: list[int] = []
    for i in range(EMBED_LANES):
        psi = word_signal(compose_word(phi[i], omega[i]))
        frac = (
            PHI_WEIGHT * phi[i]
            + OMEGA_WEIGHT * omega[i]
            + PSI_WEIGHT * psi
        ) % 1.0
        angle = 2.0 * math.pi * frac
        phases.append(int(round(frac * _TWO16)) & 0xFFFF)
        orientation.append(1 if math.sin(angle) >= 0.0 else -1)
    return A0PhaseEmbedding(
        phase_bits=tuple(phases),
        orientation=tuple(orientation),
        source_carrier_arity=SOURCE_CARRIER_ARITY,
        lanes=EMBED_LANES,
        content_identity=hashlib.blake2b(
            text.encode("utf-8"), digest_size=16
        ).hexdigest(),
    )


def ordered_phase_compose(
    left: A0PhaseEmbedding,
    right: A0PhaseEmbedding,
) -> A0PhaseEmbedding:
    n = min(left.lanes, right.lanes)
    phases: list[int] = []
    orientation: list[int] = []
    for i in range(n):
        if left.orientation[i] > 0:
            phase = (left.phase_bits[i] + right.phase_bits[i]) & 0xFFFF
            sign = 1 if left.orientation[i] + right.orientation[i] >= 0 else -1
        else:
            phase = (left.phase_bits[i] - right.phase_bits[i]) & 0xFFFF
            sign = -1 if left.orientation[i] + right.orientation[i] <= 0 else 1
        phases.append(phase)
        orientation.append(sign)
    identity = hashlib.blake2b(
        (left.content_identity + "\x00" + right.content_identity).encode("utf-8"),
        digest_size=16,
    ).hexdigest()
    return A0PhaseEmbedding(
        phase_bits=tuple(phases),
        orientation=tuple(orientation),
        source_carrier_arity=left.source_carrier_arity,
        lanes=n,
        content_identity=identity,
    )


__all__ = [
    "A0PhaseEmbedding", "embed_text", "ordered_phase_compose",
    "SOURCE_CARRIER_ARITY", "EMBED_LANES",
]
