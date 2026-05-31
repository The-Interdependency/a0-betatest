"""Theta — phase modulation ring. Maps a signal x in [0,1] to a phase-shifted output."""
import math


def theta_modulate(x: float, phase: float = 0.0, depth: int = 7) -> float:
    """Bounded theta modulation across 7 phase bands."""
    band = (phase * depth) % depth
    return round(0.5 + 0.5 * math.sin(2 * math.pi * (x + band / depth)), 6)
