# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 19:35
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 2:3
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 8:3
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: a0p_crypto_vault
#   module_name: crypto_vault
#   module_kind: service
#   summary: Fernet encrypt/decrypt + mask for at-rest BYOK credentials
#   owner: a0p maintainer
#   public_surface: encrypt, decrypt, mask
#   internal_surface: _fernet, _SECRET
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: remove imports from server.py; user re-enters BYOK keys
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: a0p_crypto_vault_boundaries
#   summary: Fernet encrypt/decrypt + mask for at-rest BYOK credentials
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: a0p_crypto_vault
#   summary: Fernet encrypt/decrypt + mask for at-rest BYOK credentials
#   exposes: encrypt, decrypt, mask
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""Fernet-encrypted at-rest storage for BYOK keys."""
import os
from cryptography.fernet import Fernet, InvalidToken

_SECRET = os.environ.get("A0P_KEY_VAULT_SECRET")
if not _SECRET:
    raise RuntimeError("A0P_KEY_VAULT_SECRET missing from environment")

_fernet = Fernet(_SECRET.encode("utf-8"))


def encrypt(plain: str) -> str:
    return _fernet.encrypt(plain.encode("utf-8")).decode("utf-8")


def decrypt(cipher: str) -> str:
    try:
        return _fernet.decrypt(cipher.encode("utf-8")).decode("utf-8")
    except InvalidToken as e:
        raise ValueError("invalid encrypted token") from e


def mask(plain: str) -> str:
    if not plain:
        return ""
    if len(plain) <= 8:
        return "*" * len(plain)
    return f"{plain[:4]}...{plain[-4:]}"
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 19:35
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 2:3
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 8:3
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
