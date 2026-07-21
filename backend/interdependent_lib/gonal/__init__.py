# ratios: loc_comments=22:43 imports_exports=6:1 calls_definitions=0:0
# === MODULE_BUILD ===
# id: carrier_pkg
#   module_name: carrier
#   module_kind: adapter
#   summary: A0 compatibility package over the UCNS-owned public gonol plus A0 application-specific classes, disk protocol, adjacency, and bones
#   owner: Erin Spencer
#   public_surface: face, chirality, n_plus, n_minus, ClassTag, CarrierDisk, CarrierDiskUnavailable, hard_invariant_holds, face_crossing, build_public_fixture_disk
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: a0p_skills.contracts.carrier_pkg_exports_holds, backend.tests.test_public_gonol_ucns_parity
#   rollout: default_enabled
#   rollback: revert only with a coordinated UCNS canon-ownership migration
#   requires: ucns public gonol canon
#   since: 2026-07-16
#   unresolved: A0 private disk material remains application-specific and is not public-gonol canon
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: carrier_pkg_boundaries
#   summary: public arrangement, origin, face, chirality, mirror, and lifted traversal come from UCNS; A0 retains application-specific disk and bone surfaces
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: carrier_pkg
#   summary: exposes UCNS-owned public-gonol invariants alongside A0-specific disk and bone helpers
#   exposes: face, chirality, n_plus, n_minus, ClassTag, CarrierDisk, CarrierDiskUnavailable, hard_invariant_holds, face_crossing, build_public_fixture_disk
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: Erin Spencer
# === END CAPABILITIES ===
"""A0 compatibility package over the UCNS-owned public gonol.

The public arrangement, fixed SPACE/ZERO twist origin, faces, chirality,
adjacency, mirror, lifted traversal, and fixed-origin private transformation are
canonically owned by UCNS. A0 retains only its application-specific class,
disk-protocol, adjacency-audit, and bone surfaces.
"""
from .faces import ARITY, ORIGIN, chirality, face, n_minus, n_plus
from .classes import ClassTag, FACE_MINUS_CLASSES, FACE_PLUS_CLASSES
from .disk_protocol import CarrierDisk, CarrierDiskUnavailable
from .adjacency import find_L_L_violations, find_N_N_violations, hard_invariant_holds
from .bones import face_crossing
from .public_fixture import build_public_fixture_disk

__all__ = [
    "face",
    "chirality",
    "n_plus",
    "n_minus",
    "ARITY",
    "ORIGIN",
    "ClassTag",
    "FACE_PLUS_CLASSES",
    "FACE_MINUS_CLASSES",
    "CarrierDisk",
    "CarrierDiskUnavailable",
    "hard_invariant_holds",
    "find_L_L_violations",
    "find_N_N_violations",
    "face_crossing",
    "build_public_fixture_disk",
]
# ratios: loc_comments=22:43 imports_exports=6:1 calls_definitions=0:0
