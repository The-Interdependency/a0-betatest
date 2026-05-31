"""
PTCA — Prime Tensor Circular Architecture.

Sentinel channels, prime-node tensors, provenance hashing, exchange mechanics.
Pure Python (uses python list-of-lists for tensor shape [N, 4, 7, 7]).

# === MODULE_BUILD ===
# id: ptca_core
#   summary: prime-tensor circular core with sentinel channels and provenance
#   exposes: PTCAInstance, PrimeTensor, SentinelChannel
#   tensor_shape: [N_primes, 4_dims, 7_phases, 7_heptagram]
# === END MODULE_BUILD ===
"""
from .primes import PRIMES_FIRST_N, first_n_primes
from .tensor import PrimeTensor
from .sentinels import SentinelChannel
from .provenance import hash_state
from .exchange import exchange
from .instance import PTCAInstance

__all__ = [
    "PRIMES_FIRST_N",
    "first_n_primes",
    "PrimeTensor",
    "SentinelChannel",
    "hash_state",
    "exchange",
    "PTCAInstance",
]
