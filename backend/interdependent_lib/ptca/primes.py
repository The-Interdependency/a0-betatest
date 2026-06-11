# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 22:36
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 0:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 4:2
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: ptca_primes
#   module_name: primes
#   module_kind: schema
#   summary: prime generator + first-N prime cache (default capacity 200, supports PTCA N=157)
#   owner: a0p maintainer
#   public_surface: first_n_primes, PRIMES_FIRST_N
#   internal_surface: _is_prime
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: revert file from git
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: ptca_primes_boundaries
#   summary: prime generator + first-N prime cache (default capacity 200, supports PTCA N=157)
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: ptca_primes
#   summary: prime generator + first-N prime cache (default capacity 200, supports PTCA N=157)
#   exposes: first_n_primes, PRIMES_FIRST_N
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
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

# === CONTRACTS ===
# id: ptca_primes_loads
#   given: module declares its msdmd canon
#   then: the module imports cleanly under the current interpreter
#   class: integration
#   call: a0p_skills.contracts.module_imports_cleanly_holds
# === END CONTRACTS ===
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 22:36
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 0:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 4:2
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
