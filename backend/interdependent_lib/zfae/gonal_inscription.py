# ratios: loc_comments=93:76 imports_exports=6:5 calls_definitions=37:6
# === MODULE_BUILD ===
# id: zfae_gonal_inscription
#   module_name: gonal_inscription
#   module_kind: engine
#   summary: ZFAE Route A inscription using the UCNS-owned fixed-origin PrivateGonal and A0's continuous tensor-to-glyph application
#   owner: Erin Spencer
#   public_surface: PrivateGonal, inscribe_text, whiten_payload, whitened_indices, BRIDGE_IN_WIDTH, BRIDGE_OUT_WIDTH, DEFAULT_INSCRIBE_LENGTH
#   internal_surface: _WHITEN_SCALE
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: package_import_only
#   user_data_boundary: none
#   admin_only: false
#   tests: a0p_skills.contracts.zfae_gonal_inscription_deterministic_holds, backend.tests.test_public_gonol_ucns_parity
#   rollout: default_enabled
#   rollback: revert only with a coordinated UCNS canon-ownership migration
#   no_llm_assertion: pure mathematical inscription; MUST NOT import any provider/LLM SDK
#   requires: ucns public gonol canon, zfae_morphology
#   since: 2026-07-16
#   unresolved: UCNS-native 53-to-32 whitening remains open research
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_gonal_inscription_boundaries
#   summary: deterministic A0 inscription over the UCNS-owned public gonol; no IO and no LLM
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: package_import_only
#   user_data_boundary: none
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_gonal_inscription
#   summary: continuous-tensor to glyph inscription through the UCNS-owned fixed-origin PrivateGonal
#   exposes: PrivateGonal, inscribe_text, whiten_payload, whitened_indices
#   boundaries: auth:none, storage:none, network:package_import_only, user_data:none
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: zfae_gonal_inscription_deterministic
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.zfae_gonal_inscription_deterministic_holds
# === END CONTRACTS ===
"""ZFAE Native Decoder — Route A (Gonal Inscription).

The canonical public gonol and its fixed-origin private phase/permutation law
are owned by UCNS. This module retains only A0's application-specific field
whitening, lane selection, morphology composition, and glyph emission.

Position zero remains the UCNS SPACE/ZERO Möbius twist seam. It is emitted as a
space and is never removed by A0 inscription.
"""
from __future__ import annotations

import hashlib
import math
import struct

from ucns.public_gonol_private import PrivateGonal

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

_WHITEN_SCALE = 1 << 20


def whiten_payload(payload: list[float], digest_seed: bytes) -> bytes:
    """Hash-whitened 53-to-32 A0 application bridge.

    BLAKE2b remains an explicit stand-in for a future UCNS-native whitening of
    the continuous field. This function is not part of the public-gonol canon.
    """

    buf = bytearray()
    for i in range(BRIDGE_IN_WIDTH):
        value = float(payload[i]) if i < len(payload) else 0.0
        buf += struct.pack("<i", int(round(value * _WHITEN_SCALE)))
    buf += digest_seed
    return hashlib.blake2b(bytes(buf), digest_size=BRIDGE_OUT_WIDTH).digest()


def whitened_indices(whitened: bytes, n: int, count: int) -> list[int]:
    """Expand a 32-byte whitened digest into application lane indices."""

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
            (raw,) = struct.unpack("<I", block[offset : offset + 4])
            out.append(raw % n)
        counter += 1
    return out


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
    """Compose a deterministic A0 glyph stream over the UCNS public gonol."""

    seed = (pcea_digest + canon_digest).encode("utf-8")
    combined = [
        (phi53[i] if i < len(phi53) else 0.0)
        + (psi53[i] if i < len(psi53) else 0.0)
        + (omega53[i] if i < len(omega53) else 0.0)
        for i in range(BRIDGE_IN_WIDTH)
    ]
    whitened = whiten_payload(combined, seed)
    lanes = whitened_indices(whitened, BRIDGE_IN_WIDTH, length)

    chars: list[str] = []
    current = gonal
    first_vertex: int | None = None
    first_word_carrier: int | None = None
    seam_emissions = 0
    for i in range(length):
        lane = lanes[i]
        phi_value = phi53[lane] if lane < len(phi53) else 0.0
        omega_value = omega53[lane] if lane < len(omega53) else 0.0
        word = compose_word(phi_value, omega_value)
        if first_word_carrier is None:
            first_word_carrier = word_carrier(word)
        psi_signal = word_signal(word)
        angle = 2.0 * math.pi * (
            PHI_WEIGHT * phi_value
            + OMEGA_WEIGHT * omega_value
            + PSI_WEIGHT * psi_signal
        )
        current = current.advance(i, pcea_digest)
        vertex = current.inscribe(angle)
        if first_vertex is None:
            first_vertex = vertex
        glyph = current.char_at(vertex)
        if vertex == 0:
            seam_emissions += 1
            chars.append(" ")
        elif glyph and glyph != "\x00" and not glyph.startswith("\x00"):
            chars.append(glyph)

    text = "".join(chars)
    if not text:
        text = "·"
    meta = {
        "vertex_idx": first_vertex if first_vertex is not None else -1,
        "rotation": current.phase,
        "pcea_digest_prefix": pcea_digest[:8],
        "glyph_count": len(chars),
        "word_carrier": first_word_carrier if first_word_carrier is not None else 1,
        "seam_emissions": seam_emissions,
    }
    return text, meta


__all__ = [
    "PrivateGonal",
    "inscribe_text",
    "whiten_payload",
    "whitened_indices",
    "BRIDGE_IN_WIDTH",
    "BRIDGE_OUT_WIDTH",
    "DEFAULT_INSCRIBE_LENGTH",
]
# ratios: loc_comments=93:76 imports_exports=6:5 calls_definitions=37:6
