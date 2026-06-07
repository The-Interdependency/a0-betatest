# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 28:52
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 6:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 0:0
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: network_pkg
#   module_name: network
#   module_kind: engine
#   summary: canonical PCNA inference engine — 5 rings (Φ Ψ Ω Θ Σ) + 2 memory rings on the layered substrate, with PCEA cross-cut and Σ host-integrity observer
#   owner: a0p maintainer
#   public_surface: NetworkEngine, EngineState, Ring, build_ring, build_all_rings, Tick, TickResult, RingTickResult, CoherenceScore, TamperReport, TamperWatcher, RING_TOPOLOGY, RING_WEIGHTS, RING_ORDER, gather_host_digest, sigma_tensors
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: read
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.network_engine_heartbeat_holds
#   rollout: default_enabled
#   rollback: remove imports from server.py and zfae
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: network_pkg_boundaries
#   summary: canonical PCNA inference engine — 5 rings (Φ Ψ Ω Θ Σ) + 2 memory rings on the layered substrate, with PCEA cross-cut and Σ host-integrity observer
#   auth_boundary: none
#   storage_boundary: read
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: network_pkg
#   summary: canonical PCNA inference engine — 5 rings (Φ Ψ Ω Θ Σ) + 2 memory rings on the layered substrate, with PCEA cross-cut and Σ host-integrity observer
#   exposes: NetworkEngine, EngineState, Ring, build_ring, build_all_rings, Tick, TickResult, RingTickResult, CoherenceScore, TamperReport, TamperWatcher, RING_TOPOLOGY, RING_WEIGHTS, RING_ORDER, gather_host_digest, sigma_tensors
#   boundaries: auth:none, storage:read, network:none, user_data:read
#   owner: a0p maintainer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: network_engine_heartbeat
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.network_engine_heartbeat_holds
# === END CONTRACTS ===
"""canonical PCNA inference engine (network/ package).

Layout — built on top of the layered substrate (PCNA tensor → PCTA
circle → PTCA seed → PTCA core), with the PCEA `kernel_step` cross-cut
applied at every heartbeat tick.
"""
from .topology import (
    RingSpec, RING_TOPOLOGY, RING_WEIGHTS, RING_ORDER,
    SCORED_RING_NAMES, OBSERVER_RING_NAMES, MEMORY_RING_NAMES,
    unique_heptagram_slots,
)
from .sigma_source import (
    HostDigest, gather_host_digest, sigma_tensors,
    SIGMA_WATCHED_PATHS, SIGMA_PKG_COMMANDS,
)
from .rings import Ring, build_ring, build_all_rings, heptagram_order
from .propagate import Tick, TickResult, RingTickResult
from .coherence import (
    CoherenceScore, TamperReport, TamperWatcher,
    ring_energy, score_tick, evaluate_tamper,
)
from .engine import NetworkEngine, EngineState

__all__ = [
    # Topology
    "RingSpec", "RING_TOPOLOGY", "RING_WEIGHTS", "RING_ORDER",
    "SCORED_RING_NAMES", "OBSERVER_RING_NAMES", "MEMORY_RING_NAMES",
    "unique_heptagram_slots",
    # Σ source
    "HostDigest", "gather_host_digest", "sigma_tensors",
    "SIGMA_WATCHED_PATHS", "SIGMA_PKG_COMMANDS",
    # Rings
    "Ring", "build_ring", "build_all_rings", "heptagram_order",
    # Tick
    "Tick", "TickResult", "RingTickResult",
    # Coherence + tamper
    "CoherenceScore", "TamperReport", "TamperWatcher",
    "ring_energy", "score_tick", "evaluate_tamper",
    # Engine
    "NetworkEngine", "EngineState",
]
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 28:52
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 6:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 0:0
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
