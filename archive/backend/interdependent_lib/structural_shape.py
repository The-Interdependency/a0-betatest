# === MODULE_BUILD ===
# id: a0_structural_shape
#   module_name: structural_shape
#   module_kind: schema
#   summary: A0-local content-addressed structural identity for PCTA/PTCA aggregates while current UCNS geometry is unavailable
#   owner: Erin Spencer
#   public_surface: A0StructuralShape, shape_from_content
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: remove only after a versioned twist-bearing UCNS producer contract exists
#   since: 2026-07-21
#   unresolved: no current UCNS object projection
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: a0_structural_shape_boundaries
#   summary: identity record only; no UCNS algebra, theorem status, quotient, unit, or geometry claim
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: a0_structural_shape
#   summary: deterministic local identity envelope for A0 aggregate layers
#   exposes: A0StructuralShape, shape_from_content
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: a0_structural_shape_not_ucns
#   given: an A0 aggregate content value
#   then: shape_from_content returns a deterministic A0-local identity explicitly carrying ucns_state=NA
#   class: provenance
# === END CONTRACTS ===
"""A0-local structural identity.

This replaces the former construction of twistless pre-reset ``UCNSObject``
instances inside PCTA and PTCA. It is deliberately not algebraic.
"""
from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass
from typing import Any


@dataclass(frozen=True)
class A0StructuralShape:
    schema_id: str
    layer: str
    content_digest: str
    face_hint: int
    ucns_state: str = "NA"
    theorem_status_transfer: bool = False
    geometry_claim: bool = False

    def as_dict(self) -> dict[str, Any]:
        return asdict(self)


def shape_from_content(layer: str, content: Any) -> A0StructuralShape:
    raw = json.dumps(content, sort_keys=True, default=repr, separators=(",", ":"))
    digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
    return A0StructuralShape(
        schema_id="a0.structural-shape/1.0.0",
        layer=str(layer),
        content_digest=digest,
        face_hint=int(digest[-1], 16) & 1,
    )


__all__ = ["A0StructuralShape", "shape_from_content"]
