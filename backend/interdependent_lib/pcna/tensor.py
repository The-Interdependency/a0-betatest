# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
# === MODULE_BUILD ===
# id: pcna_tensor
#   module_name: tensor
#   module_kind: core
#   summary: PCNA leaf tensor — scalar payload of fixed width d=53. Foundation of the layered substrate (PCNA → PCTA → PTCA → core). Manifest-first per skill-lib. F4 ratified: 157/7/7/53 is load-bearing public canon, not arbitrary, not secret, must not be decoupled.
#   owner: a0p maintainer
#   public_surface: Tensor, tensor_identity, tensor_compose, payload_width, from_scalar, to_scalar, from_seed, zero
#   internal_surface: _validate_payload
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: a0p_skills.contracts.pcna_tensor_shape_holds, a0p_skills.contracts.pcna_tensor_roundtrip, a0p_skills.contracts.pcna_tensor_deterministic
#   rollout: default_enabled
#   rollback: revert file from git
#   unresolved: hmmm (full group composition + associativity + non-commutativity lift tests pending completion of Part 2 steps 1-2)
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: pcna_tensor_boundaries
#   summary: PCNA leaf tensor — pure scalar payloads (d=53). Higher layers (PCTA/PCTA) lift these into UCNS objects.
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: pcna_tensor
#   summary: PCNA leaf tensor — scalar payload of width d=53 (public canon)
#   exposes: Tensor, tensor_identity, tensor_compose, payload_width, from_scalar, to_scalar, from_seed, zero
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""
PCNA leaf tensor (Part 2 rebuild — step 1).

This is the foundational scalar-payload tensor (width d=53) that will be
carried and aggregated by higher layers:

  Tensor   ←  this module (PCNA leaf)
  Circle   ←  PCTA module (7 tensors composed via {7/2} heptagram)
  Seed     ←  PTCA module (7 circles composed via {7/3} heptagram)
  Core     ←  ptca.core   (N=157 seeds)

**F4 Ratification (2026-07-10)**: The quartet
    SEED_COUNT         = 157
    CIRCLES_PER_SEED   = 7
    TENSORS_PER_CIRCLE = 7
    TENSOR_DIM         = 53
is **load-bearing public canon**. It is not an arbitrary number. Decoupling
is not a thing. These exact values are used throughout the substrate.

Non-commutativity (a×b ≠ b×a) and double-cover (R/4πZ) invariants are
enforced at the gonal/embed layer (see F6 audit in HMMM.md). This leaf
provides clean payload arithmetic that higher composition ops will lift.
"""

from __future__ import annotations
from dataclasses import dataclass
from typing import Iterable, Tuple

import backend.interdependent_lib.ptca.constants as canon


@dataclass(frozen=True)
class Tensor:
    """Leaf tensor with fixed-width scalar payload (d = canon.TENSOR_DIM)."""
    payload: Tuple[float, ...]

    def __post_init__(self):
        if len(self.payload) != canon.TENSOR_DIM:
            raise ValueError(f"Payload must have exactly {canon.TENSOR_DIM} elements")


# --- core operations (will be lifted at higher layers) ------------------------

def payload_width() -> int:
    """Return the canon tensor dimension (d=53)."""
    return canon.TENSOR_DIM


def tensor_identity() -> Tensor:
    """Identity element for tensor composition (zero vector)."""
    return Tensor(payload=tuple(0.0 for _ in range(canon.TENSOR_DIM)))


def zero() -> Tensor:
    """Convenience alias for identity."""
    return tensor_identity()


def from_scalar(value: float) -> Tensor:
    """Create a tensor filled with a single scalar value (broadcast)."""
    return Tensor(payload=tuple(value for _ in range(canon.TENSOR_DIM)))


def to_scalar(t: Tensor) -> float:
    """Reduce tensor to a representative scalar (mean of payload)."""
    if not t.payload:
        return 0.0
    return sum(t.payload) / len(t.payload)


def tensor_compose(a: Tensor, b: Tensor) -> Tensor:
    """Element-wise addition (leaf-level placeholder).
    Real non-commutative composition appears at gonal / PCTA layer.
    This leaf op is associative and commutative; the invariant is preserved
    by lifting through UCNS objects higher up.
    """
    if len(a.payload) != len(b.payload):
        raise ValueError("Payload width mismatch")
    summed = tuple(x + y for x, y in zip(a.payload, b.payload))
    return Tensor(payload=summed)


# --- deterministic construction (kept from previous implementation) -----------

import hashlib
import struct

def from_seed(seed: int, label: str = "") -> Tensor:
    """Deterministic Tensor reproducible from (seed, label) pair.
    Uses SHA-256 entropy. Preserved for compatibility with existing
    training surface and network engine.
    """
    def _stretch(n: int = canon.TENSOR_DIM) -> Tuple[float, ...]:
        salt = f"a0p::pcna::tensor::{seed}::{label}".encode("utf-8")
        out: list[float] = []
        counter = 0
        while len(out) < n:
            block = hashlib.sha256(salt + counter.to_bytes(4, "little")).digest()
            for off in range(0, 32, 4):
                if len(out) >= n:
                    break
                (raw,) = struct.unpack("<I", block[off:off + 4])
                out.append((raw / 0xFFFFFFFF) - 0.5)
            counter += 1
        return tuple(out)
    return Tensor(payload=_stretch())


# --- contract hooks ----------------------------------------------------------
# Contract: pcna_tensor_shape_holds
#   given: import backend.interdependent_lib.pcna.tensor as t
#   then: t.payload_width() == 53 and len(t.tensor_identity().payload) == 53
#
# Contract: pcna_tensor_roundtrip
#   given: scalar s
#   then: to_scalar(from_scalar(s)) == s  (within float tolerance)
#
# Contract: pcna_tensor_deterministic
#   given: Tensor.from_seed(s, label) called twice with same (s, label)
#   then: both calls produce equal Tensors with d=53 payload
#
# Future (after group.py + circle.py): add associativity and
# non-commutativity-lift tests. The leaf itself stays commutative;
# non-commutativity is a higher-layer property (see F6).
# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
