# === MODULE_BUILD ===
# id: zfae_gonal_inscription
#   module_name: gonal_inscription
#   module_kind: engine
#   summary: deterministic A0 field-to-glyph projection over the exact fixed-origin source gonol
#   owner: Erin Spencer
#   public_surface: PrivateGonal, inscribe_text, whiten_payload, whitened_indices, BRIDGE_IN_WIDTH, BRIDGE_OUT_WIDTH, DEFAULT_INSCRIBE_LENGTH
#   internal_surface: _WHITEN_SCALE, _project_field_scalar_to_vertex
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: disable projection if it is confused with UCNS geometry
#   no_llm_assertion: pure deterministic application projection
#   since: 2026-07-21
#   unresolved: the continuous twist-bearing UCNS bridge remains hmmm
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_gonal_inscription_boundaries
#   summary: A0 dimensionless scalar projection only; it defines no angular rotation, orientation return, or UCNS theorem
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_gonal_inscription
#   summary: whitens A0 field lanes and deterministically emits source-gonol glyphs while preserving position zero
#   exposes: PrivateGonal, inscribe_text, whiten_payload, whitened_indices
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: a0_projection_preserves_origin
#   given: a PrivateGonal derived from any seed
#   then: position zero remains fixed and no inscribe angular method exists
#   class: provenance
# id: a0_projection_deterministic
#   given: identical source fixture, field values, and digest
#   then: inscribe_text emits identical text and metadata
#   class: correctness
# === END CONTRACTS ===
"""A0 Route A application projection.

The carrier arrangement is the exact A0 source fixture. ``PrivateGonal`` fixes
position zero and transforms only the nonzero ring. The scalar projection is
not a UCNS angular rotation and does not define 360/720-degree return semantics.
"""
from __future__ import annotations

import hashlib
import math
import struct
from dataclasses import dataclass

from ..gonal.gonal import PUBLIC_GONOL_157
from .morphology import (
    OMEGA_WEIGHT,
    PHI_WEIGHT,
    PSI_WEIGHT,
    compose_word,
    word_carrier,
    word_signal,
)

BRIDGE_IN_WIDTH = 53
BRIDGE_OUT_WIDTH = 32
DEFAULT_INSCRIBE_LENGTH = 48
ORIGIN = 0
_WHITEN_SCALE = 1 << 20


def whiten_payload(payload: list[float], digest_seed: bytes) -> bytes:
    buf = bytearray()
    for i in range(BRIDGE_IN_WIDTH):
        value = float(payload[i]) if i < len(payload) else 0.0
        if not math.isfinite(value):
            raise ValueError("field values must be finite")
        buf += struct.pack("<i", int(round(value * _WHITEN_SCALE)))
    buf += digest_seed
    return hashlib.blake2b(bytes(buf), digest_size=BRIDGE_OUT_WIDTH).digest()


def whitened_indices(whitened: bytes, n: int, count: int) -> list[int]:
    if n <= 0 or count < 0:
        raise ValueError("n must be positive and count nonnegative")
    out: list[int] = []
    counter = 0
    while len(out) < count:
        block = (
            whitened
            if counter == 0
            else hashlib.blake2b(
                whitened + counter.to_bytes(2, "little"),
                digest_size=BRIDGE_OUT_WIDTH,
            ).digest()
        )
        for offset in range(0, BRIDGE_OUT_WIDTH, 4):
            if len(out) >= count:
                break
            out.append(struct.unpack("<I", block[offset : offset + 4])[0] % n)
        counter += 1
    return out


@dataclass(frozen=True)
class PrivateGonal:
    arrangement: tuple[str, ...]
    phase: int
    perm: tuple[int, ...]

    @property
    def n(self) -> int:
        return len(self.arrangement)

    @classmethod
    def from_seed(
        cls,
        seed_bytes: bytes,
        arrangement: list[str] | tuple[str, ...] | None = None,
    ) -> "PrivateGonal":
        arr = tuple(arrangement) if arrangement is not None else PUBLIC_GONOL_157
        if len(arr) < 2 or arr[ORIGIN] != " ":
            raise ValueError("arrangement must preserve SPACE at position zero")
        n = len(arr)
        phase = int.from_bytes(
            hashlib.blake2b(seed_bytes + b"::phase", digest_size=8).digest(), "big"
        ) % (n - 1)
        perm = list(range(n))
        state = hashlib.blake2b(seed_bytes + b"::perm", digest_size=8).digest()
        for i in range(n - 1, 1, -1):
            state = hashlib.blake2b(state, digest_size=8).digest()
            j = 1 + int.from_bytes(state, "big") % i
            perm[i], perm[j] = perm[j], perm[i]
        if perm[ORIGIN] != ORIGIN:
            raise RuntimeError("origin displacement")
        return cls(arrangement=arr, phase=phase, perm=tuple(perm))

    def advance(self, public: int, pcea_digest: str) -> "PrivateGonal":
        digest = hashlib.blake2b(
            f"{self.phase}:{int(public)}:{pcea_digest}".encode("utf-8"),
            digest_size=8,
        ).digest()
        phase = (self.phase + int.from_bytes(digest, "big")) % (self.n - 1)
        return PrivateGonal(self.arrangement, phase, self.perm)

    def char_at(self, vertex_idx: int) -> str:
        return self.arrangement[int(vertex_idx) % self.n]


def _project_field_scalar_to_vertex(gonal: PrivateGonal, scalar: float) -> int:
    value = float(scalar)
    if not math.isfinite(value):
        raise ValueError("application field scalar must be finite")
    base = int((value % 1.0) * gonal.n) % gonal.n
    if base == ORIGIN:
        return ORIGIN
    shifted = ((base - 1 + gonal.phase) % (gonal.n - 1)) + 1
    return gonal.perm[shifted]


def inscribe_text(
    gonal: PrivateGonal,
    phi53: list[float],
    psi53: list[float],
    omega53: list[float],
    pcea_digest: str,
    *,
    canon_digest: str = "",
    length: int = DEFAULT_INSCRIBE_LENGTH,
) -> tuple[str, dict]:
    seed = (pcea_digest + canon_digest).encode("utf-8")
    # psi is derived from phi + omega by compose_word; caller-supplied psi is
    # accepted for API compatibility but cannot alter the projection.
    combined = [
        (phi53[i] if i < len(phi53) else 0.0)
        + (omega53[i] if i < len(omega53) else 0.0)
        for i in range(BRIDGE_IN_WIDTH)
    ]
    lanes = whitened_indices(
        whiten_payload(combined, seed), BRIDGE_IN_WIDTH, length
    )

    chars: list[str] = []
    current = gonal
    first_vertex: int | None = None
    first_word_carrier: int | None = None
    origin_emissions = 0
    for i, lane in enumerate(lanes):
        phi_value = phi53[lane] if lane < len(phi53) else 0.0
        omega_value = omega53[lane] if lane < len(omega53) else 0.0
        word = compose_word(phi_value, omega_value)
        first_word_carrier = first_word_carrier or word_carrier(word)
        scalar = (
            PHI_WEIGHT * phi_value
            + OMEGA_WEIGHT * omega_value
            + PSI_WEIGHT * word_signal(word)
        )
        current = current.advance(i, pcea_digest)
        vertex = _project_field_scalar_to_vertex(current, scalar)
        first_vertex = vertex if first_vertex is None else first_vertex
        glyph = current.char_at(vertex)
        if vertex == ORIGIN:
            origin_emissions += 1
            chars.append(" ")
        elif glyph and not glyph.startswith("\x00"):
            chars.append(glyph)

    text = "".join(chars) or "·"
    return text, {
        "vertex_idx": first_vertex if first_vertex is not None else -1,
        "phase": current.phase,
        "pcea_digest_prefix": pcea_digest[:8],
        "glyph_count": len(chars),
        "word_carrier": first_word_carrier or 1,
        "origin_emissions": origin_emissions,
        # Compatibility alias; this is an origin event, not a current UCNS seam proof.
        "seam_emissions": origin_emissions,
        "projection": "a0-dimensionless-field-scalar/1.0.0",
        "ucns_state": "NA",
        "angular_return_claim": False,
    }


__all__ = [
    "PrivateGonal", "inscribe_text", "whiten_payload", "whitened_indices",
    "BRIDGE_IN_WIDTH", "BRIDGE_OUT_WIDTH", "DEFAULT_INSCRIBE_LENGTH",
]
