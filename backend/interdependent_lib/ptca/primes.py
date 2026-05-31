"""Prime generator and the first-N prime cache used by PTCA."""


def _is_prime(n: int) -> bool:
    if n < 2:
        return False
    if n < 4:
        return True
    if n % 2 == 0:
        return False
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True


def first_n_primes(n: int) -> list[int]:
    out: list[int] = []
    x = 2
    while len(out) < n:
        if _is_prime(x):
            out.append(x)
        x += 1
    return out


# Default capacity — supports N=157 (used by the PTCA seed cores).
PRIMES_FIRST_N = first_n_primes(200)
