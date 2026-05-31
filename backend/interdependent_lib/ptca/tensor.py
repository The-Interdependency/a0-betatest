# === CAPABILITIES ===
# id: ptca_tensor
#   summary: prime-indexed nested-list tensor — current shape [N,4,7,7] (spec-target [N,9,7,7]+4 sentinels pending)
#   exposes: PrimeTensor
#   stability: experimental
# === END CAPABILITIES ===

"""PrimeTensor — pure-Python nested-list tensor [N, 4, 7, 7] indexed by prime nodes."""
from __future__ import annotations
from .primes import first_n_primes


class PrimeTensor:
    """Tensor whose first axis is indexed by the first N primes.

    Shape: (N, 4, 7, 7) — node × dim × phase × heptagram axes
    (per spec: PTCA core context is [N, 4, 7, 7]).
    """

    DIM = 4
    PHASE = 7
    HEPTA = 7

    def __init__(self, n_primes: int, fill: float = 0.0):
        self.n = n_primes
        self.primes = first_n_primes(n_primes)
        # nested list: [N][4][7][7]
        self.data = [
            [[[fill] * self.HEPTA for _ in range(self.PHASE)] for _ in range(self.DIM)]
            for _ in range(self.n)
        ]

    def set(self, i: int, d: int, p: int, h: int, v: float) -> None:
        self.data[i][d][p][h] = v

    def get(self, i: int, d: int, p: int, h: int) -> float:
        return self.data[i][d][p][h]

    def slice_node(self, i: int) -> list:
        return self.data[i]

    def energy(self) -> float:
        """L2-style energy across the tensor (no numpy)."""
        s = 0.0
        for n_block in self.data:
            for d_block in n_block:
                for p_row in d_block:
                    for v in p_row:
                        s += v * v
        return s ** 0.5

    def seed_from_int(self, seed: int) -> None:
        """Deterministic seed — fills tensor with values derived from primes and seed."""
        for i, prime in enumerate(self.primes):
            for d in range(self.DIM):
                for p in range(self.PHASE):
                    for h in range(self.HEPTA):
                        # bounded float derived from seed, prime, axis indices
                        v = ((seed * prime + d * 13 + p * 7 + h * 3) % 9973) / 9973.0
                        self.data[i][d][p][h] = v

    def summary(self) -> dict:
        return {
            "n_primes": self.n,
            "shape": [self.n, self.DIM, self.PHASE, self.HEPTA],
            "primes_head": self.primes[:8],
            "primes_tail": self.primes[-3:],
            "energy": round(self.energy(), 6),
        }
