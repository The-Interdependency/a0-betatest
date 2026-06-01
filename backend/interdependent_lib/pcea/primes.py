# === MODULE_BUILD ===
# id: pcea_primes
#   module_name: primes
#   module_kind: schema
#   summary: first 53 primes — the prime circle used by PCEA
#   owner: a0p maintainer
#   public_surface: PRIME_CIRCLE
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: constant table; no runtime effect to roll back
# === END MODULE_BUILD ===
"""First 53 primes — the prime circle used by PCEA."""
PRIME_CIRCLE = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
    31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
    127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
    179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
    233, 239, 241,
]
assert len(PRIME_CIRCLE) == 53
