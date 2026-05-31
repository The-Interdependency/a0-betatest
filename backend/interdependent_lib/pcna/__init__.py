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

# === MODULE_BUILD ===
# id: pcna_engine
#   summary: six-ring inference engine with 3x PTCA(157) cores
#   exposes: PCNAEngine
#   tick: phi -> psi -> omega -> theta -> mem_l -> mem_s
# === END MODULE_BUILD ===
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
