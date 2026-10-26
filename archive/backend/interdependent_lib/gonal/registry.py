# === MODULE_BUILD ===
# id: carrier_registry
#   module_name: registry
#   module_kind: service
#   summary: A0 source-gonol registry with immutable default fixture, local mirror, and separately constructed private application arrangement
#   owner: Erin Spencer
#   public_surface: GonalName, get_default, get_mirror, get_private, get_gonal, GONAL_NAMES, PRIVATE_GONAL_SPEC_ENV
#   internal_surface: _MIRROR_CACHE
#   auth_boundary: none
#   storage_boundary: read
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: revert
#   since: 2026-07-21
#   unresolved: no current UCNS object registry
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: carrier_registry_boundaries
#   summary: returns copies of the exact source fixture and mirror; private specs cannot replace the fixture
#   auth_boundary: none
#   storage_boundary: read
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: carrier_registry
#   summary: resolves default, mirror, and private A0 application arrangements
#   exposes: get_default, get_mirror, get_private, get_gonal
#   boundaries: auth:none, storage:read, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: carrier_registry_fixture_immutable
#   given: callers mutate a list returned by get_default or get_mirror
#   then: subsequent registry reads remain unchanged
#   class: correctness
# === END CONTRACTS ===
"""A0 source-gonol registry."""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Literal, Optional

from .gonal import GonalSpec, PUBLIC_GONOL_157, build_gonal, validate_gonal
from .mirror import mirror_of

GonalName = Literal["default", "mirror", "private"]
GONAL_NAMES: tuple[GonalName, ...] = ("default", "mirror", "private")
PRIVATE_GONAL_SPEC_ENV = "A0P_GONAL_SPEC_PATH"
_MIRROR_CACHE: tuple[str, ...] | None = None


def get_default() -> list[str]:
    return list(PUBLIC_GONOL_157)


def get_mirror() -> list[str]:
    global _MIRROR_CACHE
    if _MIRROR_CACHE is None:
        _MIRROR_CACHE = tuple(mirror_of(list(PUBLIC_GONOL_157)))
    return list(_MIRROR_CACHE)


def get_private(spec_path: Optional[str] = None) -> list[str]:
    path = spec_path or os.environ.get(PRIVATE_GONAL_SPEC_ENV)
    if not path:
        raise FileNotFoundError(
            f"private gonal requested but {PRIVATE_GONAL_SPEC_ENV} is not set"
        )
    candidate = Path(path).expanduser()
    if not candidate.is_file():
        raise FileNotFoundError(f"private gonal spec not found at {candidate}")
    data = json.loads(candidate.read_text(encoding="utf-8"))
    if isinstance(data.get("no_adjacent"), list):
        data["no_adjacent"] = tuple(data["no_adjacent"])
    if isinstance(data.get("extra_unpaired"), list):
        data["extra_unpaired"] = tuple(data["extra_unpaired"])
    spec = GonalSpec(**data)
    arrangement = build_gonal(spec)
    report = validate_gonal(arrangement, spec)
    if not report["valid"]:
        raise ValueError(f"private gonal spec invalid: {report['violations']}")
    return arrangement


def get_gonal(
    name: GonalName,
    private_spec_path: Optional[str] = None,
) -> list[str]:
    if name == "default":
        return get_default()
    if name == "mirror":
        return get_mirror()
    if name == "private":
        return get_private(private_spec_path)
    raise ValueError(f"unknown gonal name {name!r}; expected one of {GONAL_NAMES}")


__all__ = [
    "GonalName", "GONAL_NAMES", "PRIVATE_GONAL_SPEC_ENV",
    "get_default", "get_mirror", "get_private", "get_gonal",
]
