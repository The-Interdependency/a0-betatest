# === MODULE_BUILD ===
# id: pcea_pkg
#   module_name: pcea
#   module_kind: engine
#   summary: prime-circular bijective base encryption over first 53 primes (this state / last state)
#   owner: a0p maintainer
#   public_surface: encrypt_state, decrypt_state, PCEAInstance, PRIME_CIRCLE
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: a0p_skills.contracts.pcea_round_trip_53
#   rollout: default_enabled
#   rollback: remove subpackage; no API surface impact
# === END MODULE_BUILD ===
"""
PCEA — Prime Circular Encryption Algorithm.

Built from spec at github.com/The-Interdependency/PCEA.
Pure-Python, zero-dependency. Bijective base-p encoding cycling over
the first 53 primes, additive shift keyed by the previous state.

"""
from .primes import PRIME_CIRCLE
from .cipher import encrypt_state, decrypt_state
from .instance import PCEAInstance

__all__ = ["PRIME_CIRCLE", "encrypt_state", "decrypt_state", "PCEAInstance"]
