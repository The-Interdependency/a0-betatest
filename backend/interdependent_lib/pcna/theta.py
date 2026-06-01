# === MODULE_BUILD ===
# id: pcna_theta
#   module_name: theta
#   module_kind: engine
#   summary: phase-modulation ring — bounded sinusoidal map over 7 phase bands (canon Θ is N=29 microkernel gate; pending tensor lift)
#   owner: a0p maintainer
#   public_surface: theta_modulate
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: revert file from git
# === END MODULE_BUILD ===
"""Theta — phase modulation ring. Maps a signal x in [0,1] to a phase-shifted output."""
import math


def theta_modulate(x: float, phase: float = 0.0, depth: int = 7) -> float:
    """Bounded theta modulation across 7 phase bands."""
    band = (phase * depth) % depth
    return round(0.5 + 0.5 * math.sin(2 * math.pi * (x + band / depth)), 6)
