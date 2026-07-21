# === MODULE_BUILD ===
# id: gonal_lifted_path
#   module_name: lifted_path
#   module_kind: engine
#   summary: lossless forward lifted traversal over the exact A0 source-gonol alphabet
#   owner: Erin Spencer
#   public_surface: encode_text_path, decode_text_path, vertex_of_char, char_of_vertex, is_origin_event, path_vertices, CarrierCharError, ARITY, ORIGIN
#   internal_surface: _ARRANGEMENT, _VERTEX_OF_CHAR
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: revert
#   no_llm_assertion: pure deterministic source-frame traversal
#   since: 2026-07-21
#   unresolved: origin events are source-fixture events, not a current UCNS double-cover proof
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: gonal_lifted_path_boundaries
#   summary: source-frame text codec only; no current UCNS object or 720-degree theorem claim
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: gonal_lifted_path
#   summary: losslessly maps source-alphabet text to a strictly increasing integer path
#   exposes: encode_text_path, decode_text_path, vertex_of_char, char_of_vertex, is_origin_event
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: source_gonol_lifted_round_trip
#   given: text over the exact source-gonol alphabet
#   then: decode_text_path(encode_text_path(text)) equals text and repeated glyphs advance 157 positions
#   class: correctness
# === END CONTRACTS ===
"""Lossless lifted traversal over the exact A0 source-gonol alphabet."""
from __future__ import annotations

from .faces import ARITY, ORIGIN
from .gonal import PUBLIC_GONOL_157

_ARRANGEMENT = PUBLIC_GONOL_157
_VERTEX_OF_CHAR = {char: index for index, char in enumerate(_ARRANGEMENT)}


class CarrierCharError(ValueError):
    pass


def vertex_of_char(char: str) -> int:
    if not isinstance(char, str) or len(char) != 1:
        raise CarrierCharError(f"expected one character, got {char!r}")
    try:
        return _VERTEX_OF_CHAR[char]
    except KeyError as exc:
        raise CarrierCharError(
            f"character {char!r} is not on the source gonol"
        ) from exc


def char_of_vertex(vertex: int) -> str:
    return _ARRANGEMENT[int(vertex) % ARITY]


def is_origin_event(position: int) -> bool:
    return int(position) % ARITY == ORIGIN


def encode_text_path(text: str) -> list[int]:
    path: list[int] = []
    previous = ORIGIN
    for char in text:
        target = vertex_of_char(char)
        previous_vertex = previous % ARITY
        delta = ((target - previous_vertex - 1) % ARITY) + 1
        previous += delta
        path.append(previous)
    return path


def decode_text_path(path: list[int] | tuple[int, ...]) -> str:
    return "".join(char_of_vertex(position) for position in path)


def path_vertices(path: list[int] | tuple[int, ...]) -> list[int]:
    return [int(position) % ARITY for position in path]


__all__ = [
    "encode_text_path", "decode_text_path", "vertex_of_char",
    "char_of_vertex", "is_origin_event", "path_vertices",
    "CarrierCharError", "ARITY", "ORIGIN",
]
