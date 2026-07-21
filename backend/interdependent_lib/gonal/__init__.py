# === MODULE_BUILD ===
# id: carrier_pkg
#   module_name: carrier
#   module_kind: package
#   summary: A0 source-gonol fixture, public structural helpers, and separately scoped private application material
#   owner: Erin Spencer
#   public_surface: PUBLIC_GONOL_157, PUBLIC_GONOL_SHA256, face, chirality, n_plus, n_minus, ClassTag, CarrierDisk, CarrierDiskUnavailable, hard_invariant_holds, face_crossing, build_public_fixture_disk
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: revert
#   since: 2026-07-21
#   unresolved: source fixture is not a current UCNS object
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: carrier_pkg_boundaries
#   summary: the exact glyph frame is public provenance; agent secrets and private specs remain separate
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: carrier_pkg
#   summary: exposes the exact source fixture and A0-local carrier helpers
#   exposes: PUBLIC_GONOL_157, face, chirality, ClassTag, CarrierDisk
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: carrier_pkg_public_private_separation
#   given: the carrier package is imported
#   then: the exact public glyph fixture is available while private agent material is not enumerated
#   class: provenance
# === END CONTRACTS ===
"""A0 source-gonol and carrier helpers.

The exact 157-glyph frame is public source provenance. Secret per-agent phase,
permutation, key, and private-spec material remains private. Neither surface is
presented as a current UCNS object.
"""
from .adjacency import hard_invariant_holds, find_L_L_violations, find_N_N_violations
from .bones import face_crossing
from .classes import ClassTag, FACE_MINUS_CLASSES, FACE_PLUS_CLASSES
from .disk_protocol import CarrierDisk, CarrierDiskUnavailable
from .faces import ARITY, ORIGIN, chirality, face, n_minus, n_plus
from .gonal import PUBLIC_GONOL_157, PUBLIC_GONOL_SHA256, public_gonol_sha256
from .public_fixture import build_public_fixture_disk

__all__ = [
    "PUBLIC_GONOL_157", "PUBLIC_GONOL_SHA256", "public_gonol_sha256",
    "face", "chirality", "n_plus", "n_minus", "ARITY", "ORIGIN",
    "ClassTag", "FACE_PLUS_CLASSES", "FACE_MINUS_CLASSES",
    "CarrierDisk", "CarrierDiskUnavailable",
    "hard_invariant_holds", "find_L_L_violations", "find_N_N_violations",
    "face_crossing", "build_public_fixture_disk",
]
