# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 75:67
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 8:4
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 26:7
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: zfae_trainer
#   module_name: trainer
#   module_kind: engine
#   summary: ZFAELearner — text-distillation losses (intent-match + signature-MSE) for teacher-only; produces weight delta + loss + new checkpoint digest
#   owner: Erin Spencer
#   public_surface: ZFAELearner, distill_step, text_signature, TrainingResult
#   internal_surface: _intent_signature, _text_to_d53
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.zfae_learning_step_changes_digest_holds
#   rollout: default_enabled
#   rollback: revert weight bank to prior checkpoint
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_trainer_boundaries
#   summary: ZFAELearner — text-distillation losses (intent-match + signature-MSE) for teacher-only; produces weight delta + loss + new checkpoint digest
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_trainer
#   summary: ZFAELearner — text-distillation losses (intent-match + signature-MSE) for teacher-only; produces weight delta + loss + new checkpoint digest
#   exposes: ZFAELearner, distill_step, text_signature, TrainingResult
#   boundaries: auth:none, storage:write, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: zfae_learning_step_changes_digest
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.zfae_learning_step_changes_digest_holds
# === END CONTRACTS ===
"""ZFAELearner — text-only teacher distillation for ZFAE weights."""
from __future__ import annotations
import hashlib
import struct
from dataclasses import dataclass

import numpy as np

from .weights import A0ZFAEWeightBank, WEIGHT_SHAPE
from .weight_init import CORE_NAMES
from ._parser import parse_semantic
from ._intent import select_intent, INTENT_LABELS


def _text_to_d53(text: str, salt: str = "zfae_signature") -> np.ndarray:
    """Deterministic d=53 signature vector from text.

    blake2b max digest_size is 64 bytes; we need 53 floats = 212 bytes, so we
    cycle multiple blocks salted with the float index.
    """
    out: list[float] = []
    counter = 0
    while len(out) < 53:
        block = hashlib.blake2b(
            f"{salt}::{text}::{counter}".encode(),
            digest_size=32,
        ).digest()
        for off in range(0, 32, 4):
            if len(out) >= 53:
                break
            v = struct.unpack("<I", block[off:off + 4])[0]
            out.append(v / 0xFFFFFFFF - 0.5)
        counter += 1
    return np.array(out, dtype=np.float32)


def text_signature(text: str) -> np.ndarray:
    return _text_to_d53(text)


def _intent_signature(intent: str) -> int:
    """Index of `intent` in INTENT_LABELS; -1 if unknown."""
    try:
        return INTENT_LABELS.index(intent)
    except ValueError:
        return -1


@dataclass
class TrainingResult:
    """Outcome of one distillation step."""
    loss: float
    new_digest: str
    new_training_step: int
    weights_updated: bool
    intent_match: bool
    signature_mse: float
    core: str = "phi"
    seed_idx: int = 0
    total_seeds_touched: int = 0


class ZFAELearner:
    """Text-distillation trainer — intent-match + signature MSE.

    Loss = α · intent_loss + β · signature_mse
    Update: small-step SGD on a low-rank signature projection (157 seeds × 53 payload),
    round-robin across the three cores (phi → psi → omega → phi …) so all 471
    (157 × 3) seeds eventually become touched.
    """

    def __init__(self, learning_rate: float = 0.005, alpha: float = 1.0, beta: float = 1.0):
        self.lr = float(learning_rate)
        self.alpha = float(alpha)
        self.beta = float(beta)

    def distill_step(
        self,
        bank: A0ZFAEWeightBank,
        prompt: str,
        teacher_reply: str,
    ) -> TrainingResult:
        """One distillation step against a teacher text.

        - Compute the teacher's intent (via the same parser/selector as native infer).
        - Compute teacher reply signature (d=53).
        - Round-robin core selection by current training_step.
        - Prefer the next untouched seed in the selected core; fall back to a
          hash-keyed seed if all are touched.
        - Update only the selected core's weights at the selected seed toward
          the teacher's signature.
        """
        teacher_features = parse_semantic(teacher_reply)
        teacher_intent = select_intent(teacher_features)

        prompt_features = parse_semantic(prompt)
        student_intent = select_intent(prompt_features)
        intent_match = (teacher_intent == student_intent)
        intent_loss = 0.0 if intent_match else 1.0

        teacher_sig = _text_to_d53(teacher_reply)

        # ---- Round-robin core + next-untouched-seed selection -----------------
        core = CORE_NAMES[bank.zfae_training_step % len(CORE_NAMES)]
        touched = bank.seeds_touched(core)
        all_seeds = range(WEIGHT_SHAPE[0])
        untouched = [s for s in all_seeds if s not in touched]
        if untouched:
            # deterministic: pick by hash within the untouched set
            seed_idx = untouched[abs(hash(f"{core}::{prompt}")) % len(untouched)]
        else:
            seed_idx = abs(hash(f"{core}::{prompt}")) % WEIGHT_SHAPE[0]

        # Student signature on the chosen core+seed
        core_arr = bank.core(core)
        student_sig = core_arr[seed_idx].mean(axis=(1, 2))  # shape (53,)
        diff = teacher_sig - student_sig
        signature_mse = float(np.mean(diff * diff))

        total_loss = self.alpha * intent_loss + self.beta * signature_mse

        # Gradient: only update bank.core(core)[seed_idx] toward teacher_sig
        delta = np.zeros(WEIGHT_SHAPE, dtype=np.float32)
        delta[seed_idx] = (
            self.lr * diff[:, None, None].astype(np.float32) / (WEIGHT_SHAPE[2] * WEIGHT_SHAPE[3])
        )

        new_digest = bank.apply_update(delta, total_loss, core=core)

        return TrainingResult(
            loss=total_loss,
            new_digest=new_digest,
            new_training_step=bank.zfae_training_step,
            weights_updated=True,
            intent_match=intent_match,
            signature_mse=signature_mse,
            core=core,
            seed_idx=seed_idx,
            total_seeds_touched=bank.total_seeds_touched,
        )


# Avoid circular import — re-export at module level.
__all__ = ["ZFAELearner", "TrainingResult", "text_signature"]
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 75:67
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 8:4
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 26:7
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
