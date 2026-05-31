"""PCEA core cipher."""
from .primes import PRIME_CIRCLE
from .codec import to_bijective, from_bijective, key_digits


def _shift(digits: list[int], keys: list[int], p: int, sign: int) -> list[int]:
    out = []
    for j, d in enumerate(digits):
        k = keys[j] if j < len(keys) else 1
        # shift in {1..p} space: ((d - 1 + sign*(k-1)) mod p) + 1
        out.append(((d - 1 + sign * (k - 1)) % p) + 1)
    return out


def encrypt_state(state: list[int], last_state: list[int]) -> list[int]:
    """Encrypt state[i] using last_state[i % L] as the keying material."""
    if not last_state:
        last_state = [1]
    L = len(last_state)
    enc: list[int] = []
    for i, v in enumerate(state):
        p = PRIME_CIRCLE[i % 53]
        digits = to_bijective(int(v), p)
        keys = key_digits(int(last_state[i % L]), p, len(digits))
        shifted = _shift(digits, keys, p, sign=+1)
        enc.append(from_bijective(shifted, p))
    return enc


def decrypt_state(enc: list[int], last_state: list[int]) -> list[int]:
    if not last_state:
        last_state = [1]
    L = len(last_state)
    out: list[int] = []
    for i, v in enumerate(enc):
        p = PRIME_CIRCLE[i % 53]
        digits = to_bijective(int(v), p)
        keys = key_digits(int(last_state[i % L]), p, len(digits))
        unshifted = _shift(digits, keys, p, sign=-1)
        out.append(from_bijective(unshifted, p))
    return out
