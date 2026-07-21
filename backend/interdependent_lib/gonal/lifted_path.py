# ratios: loc_comments=25:18 imports_exports=1:1 calls_definitions=0:0
# === MODULE_BUILD ===
# id: carrier_lifted_path
#   module_name: lifted_path
#   module_kind: adapter
#   summary: compatibility imports for the UCNS-owned lossless lifted public-gonol traversal
#   owner: Erin Spencer
#   public_surface: encode_text_path, decode_text_path, vertex_of_char, char_of_vertex, is_seam_event, path_vertices, CarrierCharError, ARITY, ORIGIN
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: backend.tests.test_lifted_path, backend.tests.test_public_gonol_ucns_parity
#   rollout: default_enabled
#   rollback: revert only with a coordinated UCNS canon-ownership migration
#   requires: ucns public gonol canon
#   since: 2026-07-16
#   unresolved: none
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: carrier_lifted_path_boundaries
#   summary: compatibility imports for the UCNS-owned lossless lifted public-gonol traversal
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: carrier_lifted_path
#   summary: compatibility imports for the UCNS-owned lossless lifted public-gonol traversal
#   exposes: encode_text_path, decode_text_path, vertex_of_char, char_of_vertex, is_seam_event, path_vertices, CarrierCharError, ARITY, ORIGIN
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: Erin Spencer
# === END CAPABILITIES ===
"""Compatibility imports for the UCNS-owned lossless lifted traversal.

The implementation originated in this repository and is now canonically owned
by UCNS. A0 retains the historical import path without maintaining a second
encoding law.
"""
from __future__ import annotations

from ucns.public_gonol_lifted_path import (
    ARITY,
    ORIGIN,
    CarrierCharError,
    char_of_vertex,
    decode_text_path,
    encode_text_path,
    is_seam_event,
    path_vertices,
    vertex_of_char,
)

__all__ = [
    "encode_text_path",
    "decode_text_path",
    "vertex_of_char",
    "char_of_vertex",
    "is_seam_event",
    "path_vertices",
    "CarrierCharError",
    "ARITY",
    "ORIGIN",
]
# ratios: loc_comments=25:18 imports_exports=1:1 calls_definitions=0:0
