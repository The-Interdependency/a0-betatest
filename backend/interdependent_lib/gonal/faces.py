# === MODULE_BUILD ===
# id: carrier_faces
#   module_name: faces
#   module_kind: schema
#   summary: A0 source-frame face, orientation-label, and adjacency helpers over 157 positions
#   owner: Erin Spencer
#   public_surface: face, chirality, n_plus, n_minus, ARITY, ORIGIN, UPPER_ARC_RANGE, LOWER_ARC_RANGE
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
#   unresolved: these source-frame labels are not current UCNS seam-crossing parity
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: carrier_faces_boundaries
#   summary: A0 source-frame indexing only; no Möbius return or theorem claim
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: carrier_faces
#   summary: returns deterministic source-frame labels and neighbors
#   exposes: face, chirality, n_plus, n_minus
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: source_frame_adjacency
#   given: a position and valid direction
#   then: chirality returns the adjacent source-frame index modulo 157
#   class: correctness
# === END CONTRACTS ===
"""A0 source-frame indexing helpers.

The ``face`` value is a local upper/lower source-frame label. It is not the
lawful seam-crossing parity of a current twist-bearing UCNS object.
"""
from __future__ import annotations

ARITY = 157
ORIGIN = 0
UPPER_ARC_RANGE = (1, 78)
LOWER_ARC_RANGE = (79, 156)


def face(k: int) -> int:
    k %= ARITY
    return 1 if k == ORIGIN or UPPER_ARC_RANGE[0] <= k <= UPPER_ARC_RANGE[1] else -1


def chirality(k: int, direction: int) -> int:
    if direction not in (1, -1):
        raise ValueError(f"direction must be +1 or -1; got {direction}")
    return (int(k) + direction) % ARITY


def n_plus(k: int) -> int:
    return chirality(k, 1)


def n_minus(k: int) -> int:
    return chirality(k, -1)


__all__ = [
    "face", "chirality", "n_plus", "n_minus",
    "ARITY", "ORIGIN", "UPPER_ARC_RANGE", "LOWER_ARC_RANGE",
]
