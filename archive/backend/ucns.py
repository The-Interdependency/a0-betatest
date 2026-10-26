# === MODULE_BUILD ===
# id: suspended_ucns_module
#   module_name: ucns
#   module_kind: adapter
#   summary: fail-closed compatibility module declaring current UCNS runtime geometry unavailable after the 2026-07-19 object reset
#   owner: Erin Spencer
#   public_surface: UCNSUnavailableError, STATUS, require_current_ucns
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: replace only with a versioned intrinsically twist-bearing producer contract
#   since: 2026-07-21
#   unresolved: current producer epoch and schema do not yet exist
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: suspended_ucns_module_boundaries
#   summary: importable diagnostics only; all former object, multiplication, quotient, and proof surfaces fail closed
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: suspended_ucns_module
#   summary: reports typed UCNS absence and prevents accidental activation of pre-reset APIs
#   exposes: UCNSUnavailableError, STATUS, require_current_ucns
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: pre_reset_ucns_fails_closed
#   given: code attempts to use a former UCNS object or algebra surface
#   then: a typed UCNSUnavailableError explains the reset boundary
#   class: provenance
# === END CONTRACTS ===
"""Typed UCNS absence for A0.

The former external ``ucns==0.8.3`` package is pre-reset archive evidence. A0
must remain importable without treating that package as current authority.
"""
from __future__ import annotations


class UCNSUnavailableError(RuntimeError):
    pass


STATUS = {
    "state": "NA",
    "reason": "UCNS reset on 2026-07-19; no current twist-bearing producer contract exists",
    "pre_reset_packages_authoritative": False,
    "theorem_status_transfer": False,
    "measurement_validity_claim": False,
}


def require_current_ucns() -> None:
    raise UCNSUnavailableError(STATUS["reason"])


def __getattr__(name: str):
    if name.startswith("__"):
        raise AttributeError(name)
    require_current_ucns()


__all__ = ["UCNSUnavailableError", "STATUS", "require_current_ucns"]
