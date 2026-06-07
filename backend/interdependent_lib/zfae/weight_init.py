# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 22:56
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 3:2
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 5:3
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: zfae_weight_init
#   module_name: weight_init
#   module_kind: engine
#   summary: deterministic seed init for fresh ZFAE weights; shape (157, 53, 7, 7); per-agent reproducible
#   owner: Erin Spencer
#   public_surface: seed_initial_weights, WEIGHT_SHAPE, WEIGHT_COUNT, default_metadata
#   internal_surface: _seeded_rng
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.zfae_weight_init_deterministic_holds
#   rollout: default_enabled
#   rollback: revert file
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_weight_init_boundaries
#   summary: deterministic seed init for fresh ZFAE weights; shape (157, 53, 7, 7); per-agent reproducible
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_weight_init
#   summary: deterministic seed init for fresh ZFAE weights; shape (157, 53, 7, 7); per-agent reproducible
#   exposes: seed_initial_weights, WEIGHT_SHAPE, WEIGHT_COUNT, default_metadata
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: zfae_weight_init_deterministic
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.zfae_weight_init_deterministic_holds
# === END CONTRACTS ===
"""Deterministic ZFAE weight initialization.

Per user spec:
  ZFAE_WEIGHT_SHAPE = [157, 53, 7, 7]
  ZFAE_WEIGHT_COUNT = 407729

The shape is axis-permuted from PTCA's structural (157, 7, 7, 53):
storage order (seeds, payload_width, circles, tensors_per_circle).
"""
from __future__ import annotations
import hashlib
import numpy as np

WEIGHT_SHAPE: tuple[int, int, int, int] = (157, 53, 7, 7)
WEIGHT_COUNT: int = 157 * 53 * 7 * 7   # 407_729


def _seeded_rng(agent_id: str, salt: str = "zfae_seed_init") -> np.random.Generator:
    """Deterministic numpy Generator keyed on agent_id."""
    seed_bytes = hashlib.blake2b(f"{salt}::{agent_id}".encode(), digest_size=8).digest()
    seed_int = int.from_bytes(seed_bytes, "big")
    return np.random.default_rng(seed_int)


def seed_initial_weights(agent_id: str) -> np.ndarray:
    """Produce a deterministic (157, 53, 7, 7) ndarray seeded from `agent_id`.

    Values in roughly [-0.5, +0.5]; small magnitude so the untrained weight
    bank is closer to identity than to chaos. Same `agent_id` always
    produces the same weights.
    """
    rng = _seeded_rng(agent_id)
    # uniform [-0.5, 0.5] float32; small enough to be near-identity
    return rng.uniform(-0.5, 0.5, size=WEIGHT_SHAPE).astype(np.float32)


def default_metadata(agent_id: str, training_step: int = 0) -> dict[str, str]:
    """Canonical safetensors metadata dict (str-valued per format requirement)."""
    return {
        "architecture": "a0_zfae",
        "weight_shape": str(list(WEIGHT_SHAPE)),
        "weight_count": str(WEIGHT_COUNT),
        "training_step": str(training_step),
        "agent_id": agent_id,
        "created_from": "seed_init_then_teacher_distillation",
        "teacher_models_seen": "[]",
    }
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 22:56
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 3:2
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 5:3
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
