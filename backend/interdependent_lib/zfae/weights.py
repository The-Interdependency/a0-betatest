# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 105:55
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 8:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 40:15
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: zfae_weight_bank
#   module_name: weights
#   module_kind: engine
#   summary: A0ZFAEWeightBank — safetensors load/save, checkpoint digest, training-step counter; exposes the required canonical metrics
#   owner: Erin Spencer
#   public_surface: A0ZFAEWeightBank, WEIGHT_SHAPE, WEIGHT_COUNT
#   internal_surface: _compute_digest, _coerce_metadata
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: none
#   user_data_boundary: write
#   admin_only: false
#   tests: a0p_skills.contracts.zfae_weight_bank_loads_407729_holds
#   rollout: default_enabled
#   rollback: rebuild from seed_init; lose training progress
#   canon_metrics: zfae_weight_count, zfae_checkpoint_digest, zfae_training_step, zfae_last_loss
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_weight_bank_boundaries
#   summary: A0ZFAEWeightBank — safetensors load/save, checkpoint digest, training-step counter; exposes the required canonical metrics
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: none
#   user_data_boundary: write
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_weight_bank
#   summary: A0ZFAEWeightBank — safetensors load/save, checkpoint digest, training-step counter; exposes the required canonical metrics
#   exposes: A0ZFAEWeightBank, WEIGHT_SHAPE, WEIGHT_COUNT
#   boundaries: auth:none, storage:write, network:none, user_data:write
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: zfae_weight_bank_loads_407729
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.zfae_weight_bank_loads_407729_holds
# === END CONTRACTS ===
"""A0ZFAEWeightBank — the persistent (157, 53, 7, 7) weight tensor."""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
from typing import Optional

import numpy as np
from safetensors.numpy import load_file, save_file

from .weight_init import WEIGHT_SHAPE, WEIGHT_COUNT, seed_initial_weights, default_metadata


def _compute_digest(weights: np.ndarray) -> str:
    """blake2b digest of weight bytes — checkpoint integrity."""
    return hashlib.blake2b(weights.tobytes(), digest_size=16).hexdigest()


def _coerce_metadata(meta: dict | None, agent_id: str) -> dict[str, str]:
    """safetensors metadata must be str→str; coerce all values."""
    m = dict(meta or default_metadata(agent_id))
    return {str(k): str(v) for k, v in m.items()}


class A0ZFAEWeightBank:
    """Per-agent ZFAE weight bank with safetensors persistence."""

    def __init__(
        self,
        agent_id: str,
        weights: np.ndarray | None = None,
        metadata: dict[str, str] | None = None,
        last_loss: float | None = None,
    ):
        self.agent_id = agent_id
        if weights is None:
            weights = seed_initial_weights(agent_id)
        if weights.shape != WEIGHT_SHAPE:
            raise ValueError(
                f"weights shape {weights.shape} != canon {WEIGHT_SHAPE}"
            )
        if weights.size != WEIGHT_COUNT:
            raise ValueError(
                f"weights size {weights.size} != canon {WEIGHT_COUNT}"
            )
        self._weights: np.ndarray = weights.astype(np.float32, copy=False)
        self._metadata: dict[str, str] = _coerce_metadata(metadata, agent_id)
        # None = never trained; otherwise the finite loss of the last training step.
        self._last_loss: float | None = (
            None if last_loss is None or not (last_loss == last_loss and last_loss != float("inf") and last_loss != float("-inf"))
            else float(last_loss)
        )

    # ---- canonical metric accessors -----------------------------------------
    @property
    def zfae_weight_count(self) -> int:
        return int(self._weights.size)

    @property
    def zfae_checkpoint_digest(self) -> str:
        return _compute_digest(self._weights)

    @property
    def zfae_training_step(self) -> int:
        return int(self._metadata.get("training_step", "0"))

    @property
    def zfae_last_loss(self) -> float | None:
        return self._last_loss

    @property
    def weights(self) -> np.ndarray:
        return self._weights

    @property
    def metadata(self) -> dict[str, str]:
        return dict(self._metadata)

    # ---- mutation ----------------------------------------------------------
    def apply_update(self, delta: np.ndarray, loss: float) -> str:
        """Add `delta` to weights, bump training_step, update last_loss; return new digest."""
        if delta.shape != WEIGHT_SHAPE:
            raise ValueError(f"delta shape {delta.shape} != {WEIGHT_SHAPE}")
        self._weights = (self._weights + delta.astype(np.float32, copy=False)).astype(np.float32)
        step = self.zfae_training_step + 1
        self._metadata["training_step"] = str(step)
        self._last_loss = float(loss)
        return self.zfae_checkpoint_digest

    def record_teacher(self, teacher_model_id: str) -> None:
        """Append a teacher_model_id to the metadata's `teacher_models_seen` list."""
        try:
            seen = json.loads(self._metadata.get("teacher_models_seen", "[]"))
        except json.JSONDecodeError:
            seen = []
        if teacher_model_id not in seen:
            seen.append(teacher_model_id)
            self._metadata["teacher_models_seen"] = json.dumps(seen)

    # ---- persistence -------------------------------------------------------
    @classmethod
    def load(cls, path: str | Path, agent_id: str) -> "A0ZFAEWeightBank":
        """Load weight bank from a safetensors file. Raises FileNotFoundError if absent."""
        path = Path(path)
        if not path.is_file():
            raise FileNotFoundError(f"ZFAE checkpoint not found: {path}")
        tensors = load_file(str(path))
        if "weights" not in tensors:
            raise ValueError(f"checkpoint missing 'weights' tensor: {path}")
        sidecar = path.with_suffix(".meta.json")
        meta: dict[str, str] = {}
        last_loss: float | None = None
        if sidecar.is_file():
            try:
                d = json.loads(sidecar.read_text(encoding="utf-8"))
                meta = {str(k): str(v) for k, v in (d.get("metadata") or {}).items()}
                ll = d.get("last_loss")
                last_loss = float(ll) if isinstance(ll, (int, float)) else None
            except (json.JSONDecodeError, ValueError):
                pass
        return cls(agent_id, weights=tensors["weights"], metadata=meta, last_loss=last_loss)

    def save(self, path: str | Path) -> str:
        """Save weight bank to safetensors + sidecar metadata JSON. Returns checkpoint digest."""
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        save_file({"weights": self._weights}, str(path), metadata=self._metadata)
        sidecar = path.with_suffix(".meta.json")
        sidecar.write_text(
            json.dumps({"metadata": self._metadata, "last_loss": self._last_loss}, indent=2),
            encoding="utf-8",
        )
        return self.zfae_checkpoint_digest

    @classmethod
    def fresh(cls, agent_id: str) -> "A0ZFAEWeightBank":
        """Fresh weight bank — deterministic seed init, training_step=0."""
        return cls(agent_id)
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 105:55
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 8:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 40:15
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
