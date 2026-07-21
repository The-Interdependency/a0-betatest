# ratios: loc_comments=13:11 imports_exports=1:1 calls_definitions=0:0
# === MODULE_BUILD ===
# id: carrier_mirror
#   module_name: mirror
#   module_kind: adapter
#   summary: compatibility import for the UCNS-owned origin-fixed public-gonol mirror
#   owner: Erin Spencer
#   public_surface: mirror_of
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: backend.tests.test_public_gonol_ucns_parity
#   rollout: default_enabled
#   rollback: revert only with a coordinated UCNS canon-ownership migration
#   requires: ucns public gonol canon
#   since: 2026-07-16
#   unresolved: none
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: carrier_mirror_boundaries
#   summary: compatibility import for the UCNS-owned origin-fixed public-gonol mirror
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: carrier_mirror
#   summary: compatibility import for the UCNS-owned origin-fixed public-gonol mirror
#   exposes: mirror_of
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: Erin Spencer
# === END CAPABILITIES ===
"""Compatibility import for the UCNS-owned origin-fixed public-gonol mirror."""
from __future__ import annotations

from ucns.public_gonol_mirror import mirror_of

__all__ = ["mirror_of"]
# ratios: loc_comments=13:11 imports_exports=1:1 calls_definitions=0:0
