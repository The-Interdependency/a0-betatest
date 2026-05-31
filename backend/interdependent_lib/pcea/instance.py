# === CAPABILITIES ===
# id: pcea_instance
#   summary: stateful PCEA instance — auto-advances last_state per call
#   exposes: PCEAInstance
#   stability: stable
# === END CAPABILITIES ===

"""Stateful PCEA instance — advances last_state automatically after each call."""
from .cipher import encrypt_state, decrypt_state


class PCEAInstance:
    def __init__(self, seed: list[int]):
        if not seed:
            raise ValueError("seed must be non-empty")
        self.last = list(seed)

    def encrypt(self, state: list[int]) -> list[int]:
        enc = encrypt_state(state, self.last)
        self.last = list(state)
        return enc

    def decrypt(self, enc: list[int]) -> list[int]:
        dec = decrypt_state(enc, self.last)
        self.last = list(dec)
        return dec

    def reset(self, seed: list[int] | None = None):
        self.last = list(seed) if seed else [1]
