"""
PCEA — Prime Circular Encryption Algorithm.

Built from spec at github.com/The-Interdependency/PCEA.
Pure-Python, zero-dependency. Bijective base-p encoding cycling over
the first 53 primes, additive shift keyed by the previous state.

# === CAPABILITIES ===
# id: pcea_pkg
#   summary: prime-circular bijective base encryption over first 53 primes
#   exposes: encrypt_state, decrypt_state, PCEAInstance, PRIME_CIRCLE
#   stability: experimental
# === END CAPABILITIES ===
"""
from .primes import PRIME_CIRCLE
from .cipher import encrypt_state, decrypt_state
from .instance import PCEAInstance

__all__ = ["PRIME_CIRCLE", "encrypt_state", "decrypt_state", "PCEAInstance"]
