"""Bijective base-p codec — digits in {1..p}, not {0..p-1}."""


def to_bijective(n: int, p: int) -> list[int]:
    """Decompose non-negative int n into bijective base-p digits (lsb first)."""
    if n < 0:
        raise ValueError("bijective codec requires non-negative input")
    if n == 0:
        return [1]  # empty representation collapses to a single 1
    digits: list[int] = []
    x = n
    while x > 0:
        x, r = divmod(x - 1, p)
        digits.append(r + 1)
    return digits


def from_bijective(digits: list[int], p: int) -> int:
    """Reconstruct an int from bijective base-p digits (lsb first)."""
    n = 0
    mult = 1
    for d in digits:
        if d < 1 or d > p:
            raise ValueError(f"digit {d} out of range for bijective base {p}")
        n += d * mult
        mult *= p
    return n


def key_digits(value: int, p: int, length: int) -> list[int]:
    """Standard base-p digits of value as a key stream of `length` digits (lsb first)."""
    out = []
    v = max(value, 0)
    for _ in range(length):
        out.append((v % p) + 1)  # shifted into {1..p} for additive use
        v //= p
    return out
