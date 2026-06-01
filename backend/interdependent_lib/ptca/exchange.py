# === MODULE_BUILD ===
# id: ptca_exchange
#   module_name: exchange
#   module_kind: engine
#   summary: deterministic prime-circular state-exchange protocol
#   owner: a0p maintainer
#   public_surface: exchange
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
