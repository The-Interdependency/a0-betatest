# === MODULE_BUILD ===
# id: ucns_bridge
#   module_name: ucns_bridge
#   module_kind: adapter
#   summary: typed A0 boundary reporting current UCNS runtime geometry unavailable after the object reset
#   owner: a0p maintainer
#   public_surface: UCNSUnavailableError, STATUS, require_current_ucns, object_record, describe, seq_prime_safe, has_a0_safe_facade
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
#   unresolved: current producer epoch and migration schema remain hmmm
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: ucns_bridge_boundaries
#   summary: diagnostic absence only; former object, unit, multiply, quotient, factorization, and theorem surfaces are unavailable
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: ucns_bridge
#   summary: provides typed UCNS absence without importing a pre-reset package
#   exposes: STATUS, require_current_ucns, describe, seq_prime_safe
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: ucns_bridge_fails_closed
#   given: A0 requests a current UCNS algebraic operation
#   then: UCNSUnavailableError is raised and no archived package is imported
#   class: provenance
# === END CONTRACTS ===
"""A0's current UCNS boundary.

The former ``ucns==0.8.3`` and later pre-reset package lineage are archive
evidence, not a current producer. A0 therefore exposes typed absence rather
than silently continuing the old object, multiplication, quotient, or theorem
contract.
"""
from __future__ import annotations

from typing import Any


class UCNSUnavailableError(RuntimeError):
    pass


STATUS = {
    "state": "NA",
    "producer_authoritative": False,
    "adapter_active": False,
    "reason": "UCNS reset on 2026-07-19; no current intrinsically twist-bearing producer contract exists",
    "theorem_status_transfer": False,
    "measurement_validity_claim": False,
}


def require_current_ucns() -> None:
    raise UCNSUnavailableError(STATUS["reason"])


def has_a0_safe_facade() -> bool:
    return False


def object_record(obj: Any) -> None:
    return None


def describe(obj: Any) -> str:
    return f"UCNS unavailable: {STATUS['reason']}"


def seq_prime_safe(obj: Any, domain_label: str) -> None:
    return None


def is_unit(obj: Any) -> bool:
    require_current_ucns()


def multiply(a: Any, b: Any):
    require_current_ucns()


def left_quotient(p: Any, a: Any):
    require_current_ucns()


def right_quotient(p: Any, b: Any):
    require_current_ucns()


__all__ = [
    "UCNSUnavailableError", "STATUS", "require_current_ucns",
    "has_a0_safe_facade", "object_record", "describe", "seq_prime_safe",
    "is_unit", "multiply", "left_quotient", "right_quotient",
]
