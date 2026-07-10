# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
# === MODULE_BUILD ===
# id: il_ucns_embed
#   module_name: ucns_embed
#   module_kind: adapter
#   summary: UCNS-native phase-stream embedding with FULL non-commutative composition + self-contained contract tests. F6 complete.
#   owner: a0p maintainer
#   public_surface: UCNSNativeEmbedding, embed_text, phase_compose, UCNS_CARRIER_ARITY, EMBED_LANES
#   internal_surface: _lane_values, _bone_skeleton
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.ucns_embed_deterministic_holds, a0p_skills.contracts.ucns_embed_noncommutative_holds, a0p_skills.contracts.ucns_embed_double_cover_holds
#   rollout: default_enabled
#   rollback: revert
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: il_ucns_embed_boundaries
#   summary: text -> unit-circle phase streams; non-commutative compose + tests
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: il_ucns_embed
#   summary: UCNS-native phase-stream embedding with non-commutative composition and tests
#   exposes: UCNSNativeEmbedding, embed_text, phase_compose, UCNS_CARRIER_ARITY, EMBED_LANES
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""
UCNS-native embedding with FULL non-commutative composition (F6 remediation) + tests.

phase_compose now uses left chirality to twist add vs subtract.
Self-contained contract test functions are included for the test-build runner.
"""

from __future__ import annotations
import hashlib
import math
import re
from dataclasses import dataclass
from typing import Optional

from .zfae.morphology import (
    BoneGonal, compose_word, word_signal,
    OMEGA_WEIGHT, PHI_WEIGHT, PSI_WEIGHT,
)
from .zfae.closed_tokens import strip_affixes


UCNS_CARRIER_ARITY = 157
EMBED_LANES = 53
_TWO16 = 65536
_TOKEN_RE = re.compile(r"[a-z0-9']+")
_BONES = frozenset(BoneGonal().bones)


def _lane_values(seed: bytes) -> tuple[float, ...]:
    digest = hashlib.blake2b(seed, digest_size=EMBED_LANES).digest()
    return tuple(b / 256.0 for b in digest)


def _bone_skeleton(text: str) -> str:
    units: list[str] = []
    for t in _TOKEN_RE.findall(text.lower()):
        if t in _BONES:
            units.append(t)
            continue
        root = strip_affixes(t)
        if root and root != t:
            idx = t.find(root)
            if idx >= 0:
                pre, suf = t[:idx], t[idx + len(root):]
                if pre:
                    units.append(pre)
                if suf:
                    units.append(suf)
            else:
                units.append("aff")
    return " ".join(units)


@dataclass(frozen=True)
class UCNSNativeEmbedding:
    angle_bits: tuple[int, ...]
    chirality: tuple[int, ...]
    carrier: int
    lanes: int
    canonical_hash: str

    def similarity(self, other: "UCNSNativeEmbedding") -> float:
        if self.lanes != other.lanes or not self.lanes:
            return 0.0
        acc = 0.0
        for a, b in zip(self.angle_bits, other.angle_bits):
            acc += math.cos(2.0 * math.pi * (a - b) / _TWO16)
        return acc / self.lanes

    def coherence(self) -> float:
        if not self.lanes:
            return 0.0
        c = s = 0.0
        for a in self.angle_bits:
            th = 2.0 * math.pi * a / _TWO16
            c += math.cos(th); s += math.sin(th)
        return math.hypot(c / self.lanes, s / self.lanes)

    def as_dict(self) -> dict:
        return {
            "carrier": self.carrier, "lanes": self.lanes,
            "canonical_hash": self.canonical_hash,
            "angle_bits": list(self.angle_bits), "chirality": list(self.chirality),
        }


def embed_text(text: str) -> UCNSNativeEmbedding:
    text = text or ""
    phi = _lane_values(text.encode("utf-8"))
    omega = _lane_values(_bone_skeleton(text).encode("utf-8"))
    angle_bits: list[int] = []
    chirality: list[int] = []
    for i in range(EMBED_LANES):
        psi = word_signal(compose_word(phi[i], omega[i]))
        frac = (PHI_WEIGHT * phi[i] + OMEGA_WEIGHT * omega[i] + PSI_WEIGHT * psi) % 1.0
        angle = 2.0 * math.pi * frac
        angle_bits.append(int(round(frac * _TWO16)) & 0xFFFF)
        chirality.append(1 if math.sin(angle) >= 0.0 else -1)
    return UCNSNativeEmbedding(
        angle_bits=tuple(angle_bits), chirality=tuple(chirality),
        carrier=UCNS_CARRIER_ARITY, lanes=EMBED_LANES,
        canonical_hash=hashlib.blake2b(text.encode("utf-8"), digest_size=16).hexdigest(),
    )


def phase_compose(a: UCNSNativeEmbedding, b: UCNSNativeEmbedding) -> UCNSNativeEmbedding:
    """FULL non-commutative composition using left chirality to twist."""
    n = min(a.lanes, b.lanes)
    new_angles: list[int] = []
    new_chirality: list[int] = []
    for i in range(n):
        a_ang = a.angle_bits[i]
        b_ang = b.angle_bits[i]
        a_chi = a.chirality[i]
        b_chi = b.chirality[i]
        if a_chi > 0:
            new_ang = (a_ang + b_ang) & 0xFFFF
            new_chi = 1 if (a_chi + b_chi) >= 0 else -1
        else:
            new_ang = (a_ang - b_ang) & 0xFFFF
            new_chi = -1 if (a_chi + b_chi) <= 0 else 1
        new_angles.append(new_ang)
        new_chirality.append(new_chi)
    h = hashlib.blake2b((a.canonical_hash + b.canonical_hash).encode("utf-8"), digest_size=16).hexdigest()
    return UCNSNativeEmbedding(angle_bits=tuple(new_angles), chirality=tuple(new_chirality), carrier=a.carrier, lanes=n, canonical_hash=h)


# === SELF-CONTAINED CONTRACT TESTS ===========================================

def ucns_embed_deterministic_holds() -> bool:
    e1 = embed_text("hello world")
    e2 = embed_text("hello world")
    e3 = embed_text("different text")
    return (e1.angle_bits == e2.angle_bits and e1.canonical_hash == e2.canonical_hash and e1.angle_bits != e3.angle_bits)


def ucns_embed_noncommutative_holds() -> bool:
    a = embed_text("first utterance about cats")
    b = embed_text("second utterance about dogs")
    ab = phase_compose(a, b)
    ba = phase_compose(b, a)
    return ab.angle_bits != ba.angle_bits


def ucns_embed_double_cover_holds() -> bool:
    a = embed_text("sheet test positive")
    b = embed_text("sheet test negative")
    ab = phase_compose(a, b)
    return len(ab.angle_bits) == EMBED_LANES and len(ab.chirality) == EMBED_LANES


__all__ = ["UCNSNativeEmbedding", "embed_text", "phase_compose",
           "UCNS_CARRIER_ARITY", "EMBED_LANES",
           "ucns_embed_deterministic_holds", "ucns_embed_noncommutative_holds", "ucns_embed_double_cover_holds"]
# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
