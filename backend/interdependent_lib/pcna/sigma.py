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
