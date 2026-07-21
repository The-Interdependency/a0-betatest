# ratios: loc_comments=49:51 imports_exports=7:5 calls_definitions=19:4
# === MODULE_BUILD ===
# id: carrier_registry
#   module_name: registry
#   module_kind: service
#   summary: resolves A0 default, mirror, and optional private-spec arrangements through the UCNS-owned public-gonol implementation
#   owner: Erin Spencer
#   public_surface: GonalName, get_default, get_mirror, get_private, get_gonal, GONAL_NAMES, PRIVATE_GONAL_SPEC_ENV
#   internal_surface: _DEFAULT_CACHE, _MIRROR_CACHE
#   auth_boundary: none
#   storage_boundary: read
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.carrier_registry_three_gonals_holds, backend.tests.test_public_gonol_ucns_parity
#   rollout: default_enabled
#   rollback: revert only with a coordinated UCNS canon-ownership migration
#   requires: ucns public gonol canon
#   since: 2026-07-16
#   unresolved: private-spec arrangements are A0 application configuration, not competing public canon
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: carrier_registry_boundaries
#   summary: reads optional A0 private-spec configuration; default and mirror are supplied by the UCNS public canon
#   auth_boundary: none
#   storage_boundary: read
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: carrier_registry
#   summary: resolves A0 compatibility arrangements while deferring public canon to UCNS
#   exposes: GonalName, get_default, get_mirror, get_private, get_gonal
#   boundaries: auth:none, storage:read, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
"""A0 compatibility registry over the UCNS-owned public gonol.

The default arrangement and origin-fixed mirror come from UCNS. An optional
private JSON spec remains A0 application configuration and is not public canon.
The canonical 157-character leaf used by inscription is the UCNS default.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Literal, Optional

from .gonal import EXAMPLE_157, GonalSpec, build_gonal, validate_gonal
from .mirror import mirror_of

GonalName = Literal["default", "mirror", "private"]
GONAL_NAMES: tuple[GonalName, ...] = ("default", "mirror", "private")

PRIVATE_GONAL_SPEC_ENV = "A0P_GONAL_SPEC_PATH"

_DEFAULT_CACHE: Optional[list[str]] = None
_MIRROR_CACHE: Optional[list[str]] = None


def get_default() -> list[str]:
    """Return a caller-owned copy of the UCNS canonical public arrangement."""

    global _DEFAULT_CACHE
    if _DEFAULT_CACHE is None:
        _DEFAULT_CACHE = list(EXAMPLE_157)
    return list(_DEFAULT_CACHE)


def get_mirror() -> list[str]:
    """Return the UCNS origin-fixed public mirror."""

    global _MIRROR_CACHE
    if _MIRROR_CACHE is None:
        _MIRROR_CACHE = mirror_of(get_default())
    return list(_MIRROR_CACHE)


def get_private(spec_path: Optional[str] = None) -> list[str]:
    """Build an A0 private-spec arrangement; this is not public gonol canon."""

    path = spec_path or os.environ.get(PRIVATE_GONAL_SPEC_ENV)
    if not path:
        raise FileNotFoundError(
            "private A0 arrangement requested but {} not set".format(PRIVATE_GONAL_SPEC_ENV)
        )
    source = Path(path).expanduser()
    if not source.is_file():
        raise FileNotFoundError("private A0 arrangement spec not found at {}".format(source))
    spec_data = json.loads(source.read_text(encoding="utf-8"))
    spec = GonalSpec(**spec_data)
    arrangement = build_gonal(spec)
    report = validate_gonal(arrangement, spec)
    if not report["valid"]:
        raise ValueError("private A0 arrangement spec invalid: {}".format(report["violations"]))
    return arrangement


def get_gonal(name: GonalName, private_spec_path: Optional[str] = None) -> list[str]:
    """Resolve a compatibility arrangement by name."""

    if name == "default":
        return get_default()
    if name == "mirror":
        return get_mirror()
    if name == "private":
        return get_private(private_spec_path)
    raise ValueError("unknown gonal name {!r}; expected one of {}".format(name, GONAL_NAMES))


__all__ = [
    "GonalName",
    "GONAL_NAMES",
    "PRIVATE_GONAL_SPEC_ENV",
    "get_default",
    "get_mirror",
    "get_private",
    "get_gonal",
]

# === CONTRACTS ===
# id: carrier_registry_loads
#   given: module declares its msdmd canon
#   then: the module imports cleanly under the current interpreter
#   class: integration
#   call: a0p_skills.contracts.module_imports_cleanly_holds
# === END CONTRACTS ===
# ratios: loc_comments=49:51 imports_exports=7:5 calls_definitions=19:4
