"""
interdependent_lib — convergence of four/five-letter acronym modules.

Built from spec (see github.com/The-Interdependency/interdependent-lib).
Submodules:
    pcea   — Prime Circular Encryption Algorithm
    ptca   — Prime Tensor Circular Architecture
    pcna   — Prime Circled Neural Architecture
    zfae   — Zeta Function Alpha Echo (the agent itself)
    aimmh  — AI Multimodel Multimodal Hub
"""
__all__ = ["pcea", "ptca", "pcna", "zfae", "aimmh"]
__version__ = "0.1.0-research"


def available() -> dict:
    from . import pcea, ptca, pcna, zfae, aimmh  # noqa: F401
    return {
        "pcea": "Prime Circular Encryption Algorithm",
        "ptca": "Prime Tensor Circular Architecture",
        "pcna": "Prime Circled Neural Architecture",
        "zfae": "Zeta Function Alpha Echo",
        "aimmh": "AI Multimodel Multimodal Hub",
    }
