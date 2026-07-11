# ratios: loc_comments=112:87 imports_exports=9:5 calls_definitions=34:12
# === MODULE_BUILD ===
# id: il_gonal_stack
#   module_name: gonal_stack
#   module_kind: engine
#   summary: assemble a cylindrical disk stack of chapter-scale gonols from a training session — one 157-gonal carrier disk per depth-rung (leaf/157-char, circle/word, seed/phrase-clause, core/utterance, chapter/session), each disk a UCNS-native embedding (ucns_embed) plus the three-core gonal scalars (phi content-phase, omega bone-density, psi unit-circle phase-coherence), stacked along the depth/Z axis (the edcmbone GrainTensor shape). CHAPTER is the new top rung = the unit-circle phase-product (⊠ = multiplyFuel) recomposition of the session's per-utterance embeddings into one gonol. Recompose-only (decomposition stays proof-gated); built on the PUBLIC-FIXTURE carrier disk (the canonical 157-gonal disk is non-committable private key material); the cylinder geometry is UCNS-G / non-absolute and inherits NO theorem/proof status from the proven UCNS-A composition algebra.
#   owner: Erin Spencer
#   public_surface: DiskState, CylindricalDiskStack, single_disk, build_disk_stack, GRAIN_LADDER, GEOMETRY_STATUS
#   internal_surface: _grain_texts, _grain_gonal, _face_counts, _mean_phase
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.gonal_stack_recompose_holds
#   rollout: default_enabled
#   rollback: revert; the training flow loses its cylindrical disk-stack output
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: il_gonal_stack_boundaries
#   summary: pure session-transcript -> disk stack; public-fixture disk only, no io/network
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: il_gonal_stack
#   summary: cylindrical disk stack of chapter-scale gonols (UCNS-native embeddings)
#   exposes: DiskState, CylindricalDiskStack, single_disk, build_disk_stack, GRAIN_LADDER, GEOMETRY_STATUS
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: gonal_stack_recompose
#   given: a training session of several utterances
#   then: build_disk_stack returns one disk per grain rung (leaf..chapter) each
#         carrying a UCNS-native embedding + phi/omega/psi, the chapter psi equals
#         the phase-product (⊠) recomposition of the per-utterance embeddings, and
#         stack is flagged recompose-only + UCNS-G non-absolute + carrier 157
#   class: correctness
#   call: a0p_skills.contracts.gonal_stack_recompose_holds
# === END CONTRACTS ===
"""Cylindrical disk stack of chapter-scale gonols (UCNS-native embeddings).

A training session (a list of utterance texts) is lifted to a stack of 157-gonal
carrier disks, one per depth-rung of the morphology ladder:

    leaf(157-char) -> circle(word) -> seed(phrase/clause) -> core(utterance)
                                                          -> chapter(session)

Each disk is a UCNS-native embedding (``ucns_embed.embed_text``) plus the three
gonal cores (phi content-phase / omega bone-density / psi unit-circle coherence),
stacked along the depth/Z axis — the same shape as edcmbone's UCNS-G
``GrainTensor``. The CHAPTER rung is a left-to-right fold of the session's
per-utterance embeddings through ``phase_compose``; order therefore remains
load-bearing when composition is non-commutative.

Firewalls:
  * RECOMPOSE-ONLY. No inverse is exposed.
  * PUBLIC-FIXTURE DISK ONLY. Private carrier material is never loaded here.
  * UCNS-G / NON-ABSOLUTE. No theorem status transfers from UCNS-A.
"""
from __future__ import annotations

import functools
import re
from dataclasses import dataclass

from .ucns_embed import embed_text, phase_compose, UCNS_CARRIER_ARITY
from .zfae.morphology import BoneGonal
from .zfae.closed_tokens import strip_affixes

try:
    from .gonal import build_public_fixture_disk
    _PUBLIC_DISK_OK = True
except Exception:  # pragma: no cover
    _PUBLIC_DISK_OK = False

GRAIN_LADDER = ("leaf", "circle", "seed", "core", "chapter")
GEOMETRY_STATUS = "ucns-g:non-absolute"
_TOKEN_RE = re.compile(r"[a-z0-9']+")
_BONES = frozenset(BoneGonal().bones)


def _tokens(text: str) -> list[str]:
    return _TOKEN_RE.findall((text or "").lower())


def _bone_density(text: str) -> float:
    tokens = _tokens(text)
    if not tokens:
        return 0.0
    structural = sum(1 for token in tokens if token in _BONES or strip_affixes(token) != token)
    return structural / len(tokens)


def _grain_texts(turns: list[str]) -> dict[str, str]:
    full = "\n".join(turns)
    words = " ".join(dict.fromkeys(_tokens(full)))
    clauses = " | ".join(piece.strip() for piece in re.split(r"[.!?;:]", full) if piece.strip())
    return {
        "leaf": full,
        "circle": words,
        "seed": clauses,
        "core": turns[-1] if turns else "",
        "chapter": full,
    }


def _mean_phase(embedding) -> float:
    if not embedding.angle_bits:
        return 0.0
    return sum(embedding.angle_bits) / (len(embedding.angle_bits) * 65536)


def _grain_gonal(text: str):
    embedding = embed_text(text)
    return _mean_phase(embedding), _bone_density(text), embedding.coherence(), embedding


def _face_counts(chirality: tuple[int, ...]) -> tuple[int, int]:
    plus = sum(1 for value in chirality if value > 0)
    return plus, len(chirality) - plus


@dataclass(frozen=True)
class DiskState:
    grain: str
    depth: int
    carrier: int
    phi: float
    omega: float
    psi: float
    face_plus: int
    face_minus: int
    embedding_hash: str

    def as_dict(self) -> dict:
        return {
            "grain": self.grain,
            "depth": self.depth,
            "carrier": self.carrier,
            "phi": round(self.phi, 6),
            "omega": round(self.omega, 6),
            "psi": round(self.psi, 6),
            "face_plus": self.face_plus,
            "face_minus": self.face_minus,
            "embedding_hash": self.embedding_hash,
        }


@dataclass(frozen=True)
class CylindricalDiskStack:
    agent_id: str
    disks: tuple[DiskState, ...]
    session_turns: int
    chapter_psi: float
    carrier_arity: int
    geometry_status: str
    recompose_only: bool
    public_fixture_carrier: bool

    def as_dict(self) -> dict:
        return {
            "agent_id": self.agent_id,
            "session_turns": self.session_turns,
            "chapter_psi": round(self.chapter_psi, 6),
            "carrier_arity": self.carrier_arity,
            "geometry_status": self.geometry_status,
            "recompose_only": self.recompose_only,
            "public_fixture_carrier": self.public_fixture_carrier,
            "disks": [disk.as_dict() for disk in self.disks],
        }


def single_disk(text: str, grain: str = "turn", depth: int = 0) -> DiskState:
    phi, omega, psi, embedding = _grain_gonal(text)
    face_plus, face_minus = _face_counts(embedding.chirality)
    return DiskState(
        grain=grain,
        depth=depth,
        carrier=UCNS_CARRIER_ARITY,
        phi=phi,
        omega=omega,
        psi=psi,
        face_plus=face_plus,
        face_minus=face_minus,
        embedding_hash=embedding.canonical_hash,
    )


def build_disk_stack(turns: list[str], agent_id: str = "local") -> CylindricalDiskStack:
    turns = [turn for turn in (turns or []) if (turn or "").strip()]
    if _PUBLIC_DISK_OK:
        try:
            build_public_fixture_disk()
        except Exception:
            pass

    utterance_embeddings = [embed_text(turn) for turn in turns]
    chapter_embedding = (
        functools.reduce(phase_compose, utterance_embeddings)
        if utterance_embeddings
        else embed_text("")
    )
    chapter_psi = chapter_embedding.coherence()
    texts = _grain_texts(turns)

    disks: list[DiskState] = []
    for depth, grain in enumerate(GRAIN_LADDER):
        if grain == "chapter":
            embedding = chapter_embedding
            phi = _mean_phase(embedding)
            omega = _bone_density(texts[grain])
            psi = chapter_psi
        else:
            phi, omega, psi, embedding = _grain_gonal(texts[grain])
        face_plus, face_minus = _face_counts(embedding.chirality)
        disks.append(
            DiskState(
                grain=grain,
                depth=depth,
                carrier=UCNS_CARRIER_ARITY,
                phi=phi,
                omega=omega,
                psi=psi,
                face_plus=face_plus,
                face_minus=face_minus,
                embedding_hash=embedding.canonical_hash,
            )
        )

    return CylindricalDiskStack(
        agent_id=agent_id,
        disks=tuple(disks),
        session_turns=len(turns),
        chapter_psi=chapter_psi,
        carrier_arity=UCNS_CARRIER_ARITY,
        geometry_status=GEOMETRY_STATUS,
        recompose_only=True,
        public_fixture_carrier=_PUBLIC_DISK_OK,
    )


__all__ = [
    "DiskState",
    "CylindricalDiskStack",
    "single_disk",
    "build_disk_stack",
    "GRAIN_LADDER",
    "GEOMETRY_STATUS",
]
# ratios: loc_comments=112:87 imports_exports=9:5 calls_definitions=34:12
