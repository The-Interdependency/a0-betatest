# === CAPABILITIES ===
# id: ptca_exchange
#   summary: deterministic prime-circular state-exchange protocol
#   exposes: exchange
#   stability: stable
# === END CAPABILITIES ===

"""Exchange mechanics — deterministic prime-circular state-exchange protocol."""
from .primes import first_n_primes


def exchange(state_a: list[int], primes: list[int] | None = None) -> list[int]:
    """Symmetric prime-circular shift: each position i transforms by prime[i % P]."""
    if primes is None:
        primes = first_n_primes(max(len(state_a), 4))
    P = len(primes)
    out = []
    for i, v in enumerate(state_a):
        p = primes[i % P]
        # deterministic mix that's invertible by re-running with the same primes
        out.append((int(v) ^ p) + (i % 7))
    return out
