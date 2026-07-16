# ratios: loc_comments=31:24 imports_exports=1:1 calls_definitions=0:0
# === MODULE_BUILD ===
# id: carrier_gonal
#   module_name: gonal
#   module_kind: adapter
#   summary: compatibility imports for the UCNS-owned canonical public gonol promoted from this repository
#   owner: Erin Spencer
#   public_surface: GonalSpec, build_gonal, validate_gonal, print_gonal, EXAMPLE_157, PUBLIC_GONAL_157, make_example_157, get_default, public_gonol_sha256
#   internal_surface: UPPERCASE, LOWERCASE, DIGITS_ODD, DIGITS_EVEN, PAIRED_OPEN, PAIRED_CLOSE, UNPAIRED_ALL
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
"""Compatibility surface for the UCNS-owned public gonol.

The exact public gonol originated here at commit
``7af8debf6ef3905f01baff02b43d8c3bee16ccbc`` and is canon for all UCNS. UCNS is
now its canonical package home. This module contains no second arrangement law.
"""
from __future__ import annotations

from ucns.public_gonol import (
    DIGITS_EVEN,
    DIGITS_ODD,
    EXAMPLE_157,
    GonalSpec,
    LOWERCASE,
    PAIRED_CLOSE,
    PAIRED_OPEN,
    PUBLIC_GONAL_157,
    PUBLIC_GONAL_SHA256,
    PUBLIC_GONAL_SOURCE_COMMIT,
    PUBLIC_GONAL_SOURCE_PATH,
    PUBLIC_GONAL_SOURCE_REPOSITORY,
    UNPAIRED_ALL,
    UPPERCASE,
    build_gonal,
    get_default,
    make_example_157,
    print_gonal,
    public_gonol_sha256,
    validate_gonal,
)

if PUBLIC_GONAL_SOURCE_REPOSITORY != "The-Interdependency/a0-betatest":
    raise RuntimeError("UCNS public-gonol source repository drift")
if PUBLIC_GONAL_SOURCE_COMMIT != "7af8debf6ef3905f01baff02b43d8c3bee16ccbc":
    raise RuntimeError("UCNS public-gonol source commit drift")
if PUBLIC_GONAL_SOURCE_PATH != "backend/interdependent_lib/gonal/gonal.py":
    raise RuntimeError("UCNS public-gonol source path drift")
if public_gonol_sha256(tuple(PUBLIC_GONAL_157)) != PUBLIC_GONAL_SHA256:
    raise RuntimeError("UCNS public-gonol arrangement drift")

__all__ = [
    "GonalSpec",
    "build_gonal",
    "validate_gonal",
    "print_gonal",
    "EXAMPLE_157",
    "PUBLIC_GONAL_157",
    "make_example_157",
    "get_default",
    "public_gonol_sha256",
    "PUBLIC_GONAL_SHA256",
    "UPPERCASE",
    "LOWERCASE",
    "DIGITS_ODD",
    "DIGITS_EVEN",
    "PAIRED_OPEN",
    "PAIRED_CLOSE",
    "UNPAIRED_ALL",
]
# ratios: loc_comments=31:24 imports_exports=1:1 calls_definitions=0:0
