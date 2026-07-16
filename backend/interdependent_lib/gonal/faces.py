# ratios: loc_comments=18:15 imports_exports=1:1 calls_definitions=0:0
# === MODULE_BUILD ===
# id: carrier_faces
#   module_name: faces
#   module_kind: adapter
#   summary: compatibility imports for UCNS-owned public-gonol faces, chirality, adjacency, arity, and origin
#   owner: Erin Spencer
#   public_surface: face, chirality, n_plus, n_minus, ARITY, ORIGIN, UPPER_ARC_RANGE, LOWER_ARC_RANGE
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: package_import_only
#   user_data_boundary: none
#   admin_only: false
#   tests: backend.tests.test_public_gonol_ucns_parity
#   rollout: default_enabled
#   rollback: revert only with a coordinated UCNS canon-ownership migration
#   requires: ucns public gonol canon
#   since: 2026-07-16
#   unresolved: none
# === END MODULE_BUILD ===
"""Compatibility imports for the UCNS-owned public-gonol geometry."""
from __future__ import annotations

from ucns.public_gonol_faces import (
    ARITY,
    LOWER_ARC_RANGE,
    ORIGIN,
    UPPER_ARC_RANGE,
    chirality,
    face,
    n_minus,
    n_plus,
)

__all__ = [
    "face",
    "chirality",
    "n_plus",
    "n_minus",
    "ARITY",
    "ORIGIN",
    "UPPER_ARC_RANGE",
    "LOWER_ARC_RANGE",
]
# ratios: loc_comments=18:15 imports_exports=1:1 calls_definitions=0:0
