"""MemoryCore — persistent activation state, two prime rings (N=19 LT, N=17 ST)."""
from __future__ import annotations
from collections import deque
from ..ptca.primes import first_n_primes


class MemoryCore:
    def __init__(self):
        self.lt_primes = first_n_primes(19)  # long-term ring
        self.st_primes = first_n_primes(17)  # short-term ring
        self.lt: deque = deque(maxlen=19)
        self.st: deque = deque(maxlen=17)
        self.sub: dict[str, list[str]] = {}

    def push_lt(self, item: str) -> None:
        self.lt.append(item)

    def push_st(self, item: str) -> None:
        self.st.append(item)

    def spawn_sub(self, sub_id: str) -> None:
        self.sub[sub_id] = []

    def push_sub(self, sub_id: str, item: str) -> None:
        if sub_id not in self.sub:
            self.spawn_sub(sub_id)
        self.sub[sub_id].append(item)

    def merge_sub(self, sub_id: str) -> list[str]:
        items = self.sub.pop(sub_id, [])
        for it in items:
            self.push_st(it)
        return items

    def snapshot(self) -> dict:
        return {
            "lt": list(self.lt),
            "st": list(self.st),
            "sub_keys": list(self.sub.keys()),
            "lt_capacity": self.lt.maxlen,
            "st_capacity": self.st.maxlen,
        }
