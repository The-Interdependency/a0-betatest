# === MODULE_BUILD ===
# id: il_gonal_stack
#   module_name: gonal_stack
#   module_kind: engine
#   summary: A0-local ordered phase disk stack for training sessions over the exact source-gonol arity
#   owner: Erin Spencer
#   public_surface: DiskState, CylindricalDiskStack, single_disk, build_disk_stack, GRAIN_LADDER, GEOMETRY_STATUS
#   internal_surface: _grain_texts, _grain_state, _orientation_counts, _mean_phase
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: revert
#   since: 2026-07-21
#   unresolved: no current UCNS geometry or decomposition projection
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: il_gonal_stack_boundaries
#   summary: A0 visualization shape only; no UCNS-G, multiplyFuel, theorem, or double-cover claim
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: il_gonal_stack
#   summary: assembles an inspectable ordered phase stack from a session
#   exposes: DiskState, CylindricalDiskStack, single_disk, build_disk_stack
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: a0_disk_stack_ordered
#   given: a session of utterances
#   then: build_disk_stack returns one state per grain and a left-to-right ordered phase composition
#   class: correctness
# id: a0_disk_stack_no_ucns_claim
#   given: a disk stack
#   then: geometry_status is a0-g:experimental and theorem_status_transfer is false
#   class: provenance
# === END CONTRACTS ===
"""A0-local ordered phase disk stack.

This is a visualization and training-inspection shape. It is not UCNS geometry,
``multiplyFuel``, or evidence of a Möbius double cover.
"""
from __future__ import annotations

import functools
import re
from dataclasses import dataclass

from .phase_embedding import (
    SOURCE_CARRIER_ARITY,
    embed_text,
    ordered_phase_compose,
)
from .zfae.closed_tokens import strip_affixes
from .zfae.morphology import BoneGonal

GRAIN_LADDER = ("leaf", "circle", "seed", "core", "chapter")
GEOMETRY_STATUS = "a0-g:experimental"
_TOKEN_RE = re.compile(r"[a-z0-9']+")
_BONES = frozenset(BoneGonal().bones)


def _tokens(text: str) -> list[str]:
    return _TOKEN_RE.findall((text or "").lower())


def _bone_density(text: str) -> float:
    tokens = _tokens(text)
    if not tokens:
        return 0.0
    structural = sum(
        1 for token in tokens if token in _BONES or strip_affixes(token) != token
    )
    return structural / len(tokens)


def _grain_texts(turns: list[str]) -> dict[str, str]:
    full = "\n".join(turns)
    words = " ".join(dict.fromkeys(_tokens(full)))
    clauses = " | ".join(
        piece.strip()
        for piece in re.split(r"[.!?;:]", full)
        if piece.strip()
    )
    return {
        "leaf": full,
        "circle": words,
        "seed": clauses,
        "core": turns[-1] if turns else "",
        "chapter": full,
    }


def _mean_phase(embedding) -> float:
    return (
        sum(embedding.phase_bits) / (len(embedding.phase_bits) * 65536)
        if embedding.phase_bits
        else 0.0
    )


def _grain_state(text: str):
    embedding = embed_text(text)
    return _mean_phase(embedding), _bone_density(text), embedding.coherence(), embedding


def _orientation_counts(orientation: tuple[int, ...]) -> tuple[int, int]:
    plus = sum(1 for value in orientation if value > 0)
    return plus, len(orientation) - plus


@dataclass(frozen=True)
class DiskState:
    grain: str
    depth: int
    source_carrier_arity: int
    phi: float
    omega: float
    psi: float
    orientation_plus: int
    orientation_minus: int
    content_identity: str

    def as_dict(self) -> dict:
        return {
            "grain": self.grain,
            "depth": self.depth,
            "source_carrier_arity": self.source_carrier_arity,
            "phi": round(self.phi, 6),
            "omega": round(self.omega, 6),
            "psi": round(self.psi, 6),
            "orientation_plus": self.orientation_plus,
            "orientation_minus": self.orientation_minus,
            "content_identity": self.content_identity,
        }


@dataclass(frozen=True)
class CylindricalDiskStack:
    agent_id: str
    disks: tuple[DiskState, ...]
    session_turns: int
    chapter_psi: float
    source_carrier_arity: int
    geometry_status: str = GEOMETRY_STATUS
    recompose_only: bool = True
    ucns_state: str = "NA"
    theorem_status_transfer: bool = False
    double_cover_claim: bool = False

    def as_dict(self) -> dict:
        return {
            "agent_id": self.agent_id,
            "session_turns": self.session_turns,
            "chapter_psi": round(self.chapter_psi, 6),
            "source_carrier_arity": self.source_carrier_arity,
            "geometry_status": self.geometry_status,
            "recompose_only": self.recompose_only,
            "ucns_state": self.ucns_state,
            "theorem_status_transfer": self.theorem_status_transfer,
            "double_cover_claim": self.double_cover_claim,
            "disks": [disk.as_dict() for disk in self.disks],
        }


def single_disk(text: str, grain: str = "turn", depth: int = 0) -> DiskState:
    phi, omega, psi, embedding = _grain_state(text)
    plus, minus = _orientation_counts(embedding.orientation)
    return DiskState(
        grain=grain,
        depth=depth,
        source_carrier_arity=SOURCE_CARRIER_ARITY,
        phi=phi,
        omega=omega,
        psi=psi,
        orientation_plus=plus,
        orientation_minus=minus,
        content_identity=embedding.content_identity,
    )


def build_disk_stack(
    turns: list[str],
    agent_id: str = "local",
) -> CylindricalDiskStack:
    turns = [turn for turn in (turns or []) if (turn or "").strip()]
    embeddings = [embed_text(turn) for turn in turns]
    chapter = (
        functools.reduce(ordered_phase_compose, embeddings)
        if embeddings
        else embed_text("")
    )
    chapter_psi = chapter.coherence()
    texts = _grain_texts(turns)
    disks: list[DiskState] = []
    for depth, grain in enumerate(GRAIN_LADDER):
        if grain == "chapter":
            embedding = chapter
            phi = _mean_phase(embedding)
            omega = _bone_density(texts[grain])
            psi = chapter_psi
        else:
            phi, omega, psi, embedding = _grain_state(texts[grain])
        plus, minus = _orientation_counts(embedding.orientation)
        disks.append(
            DiskState(
                grain=grain,
                depth=depth,
                source_carrier_arity=SOURCE_CARRIER_ARITY,
                phi=phi,
                omega=omega,
                psi=psi,
                orientation_plus=plus,
                orientation_minus=minus,
                content_identity=embedding.content_identity,
            )
        )
    return CylindricalDiskStack(
        agent_id=agent_id,
        disks=tuple(disks),
        session_turns=len(turns),
        chapter_psi=chapter_psi,
        source_carrier_arity=SOURCE_CARRIER_ARITY,
    )


__all__ = [
    "DiskState", "CylindricalDiskStack", "single_disk", "build_disk_stack",
    "GRAIN_LADDER", "GEOMETRY_STATUS",
]
