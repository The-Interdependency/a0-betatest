# === MODULE_BUILD ===
# id: pcna_pkg
#   module_name: pcna
#   module_kind: engine
#   summary: six-ring inference engine (Φ Ψ Ω Θ Σ Ε) — current impl is simplified; canon topology (61 seeds, six scored rings + Σ observer) rebuild pending
#   owner: a0p maintainer
#   public_surface: PCNAEngine, EDCM, EDCMScores, MemoryCore, zeta_inject, sigma_encode, theta_modulate
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: revert subpackage from git
#   unresolved: canon PCNA topology rebuild pending
# === END MODULE_BUILD ===
"""
PCNA — Prime Circled Neural Architecture.

Modular inference engine — six rings:
    Φ (phi)   — primary intent / surface ring
    Ψ (psi)   — substrate / filesystem-aligned ring (via sigma)
    Ω (omega) — outward broadcast / consensus ring
    Θ (theta) — modulation / phase ring
    Memory-L  — long-term memory (N=19 prime ring)
    Memory-S  — short-term memory (N=17 prime ring)

Three 157-seed PTCA cores (phi, psi, omega) drive the principal rings;
theta / sigma / epsilon are supporting modulators wired to the cores.

"""
from .pcna import PCNAEngine
from .edcm import EDCM, EDCMScores
from .zeta import zeta_inject
from .sigma import sigma_encode
from .theta import theta_modulate
from .memory_core import MemoryCore

__all__ = [
    "PCNAEngine",
    "EDCM",
    "EDCMScores",
    "zeta_inject",
    "sigma_encode",
    "theta_modulate",
    "MemoryCore",
]
