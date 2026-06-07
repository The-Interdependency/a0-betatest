# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 6:40
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 1:2
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 3:2
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: pcna_sigma
#   module_name: sigma
#   module_kind: engine
#   summary: substrate signature encoder — deterministic blake2b digest + band mapping (canon Σ is N=41 observer ring; current impl is scalar shim)
#   owner: a0p maintainer
#   public_surface: sigma_encode, sigma_band
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: revert file from git
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: pcna_sigma_boundaries
#   summary: substrate signature encoder — deterministic blake2b digest + band mapping (canon Σ is N=41 observer ring; current impl is scalar shim)
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: pcna_sigma
#   summary: substrate signature encoder — deterministic blake2b digest + band mapping (canon Σ is N=41 observer ring; current impl is scalar shim)
#   exposes: sigma_encode, sigma_band
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""Sigma — filesystem substrate encoder, companion to the Ψ ring.

Encodes any path-like string into a deterministic 32-byte signature
that other rings can reference without keeping the raw path in memory.
"""
import hashlib


def sigma_encode(path: str) -> str:
    """Stable hex digest for any path-like substrate identifier."""
    return hashlib.blake2b(path.encode("utf-8"), digest_size=16).hexdigest()


def sigma_band(value: str, bands: int = 7) -> int:
    """Map a sigma-encoded value to one of `bands` discrete bands."""
    h = hashlib.blake2b(value.encode("utf-8"), digest_size=2).digest()
    return int.from_bytes(h, "big") % bands
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 6:40
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 1:2
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 3:2
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
