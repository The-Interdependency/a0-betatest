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
