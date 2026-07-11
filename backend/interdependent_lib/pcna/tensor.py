# ratios: loc_comments=88:74 imports_exports=5:17 calls_definitions=35:20
# === MODULE_BUILD ===
# id: pcna_tensor
#   module_name: tensor
#   module_kind: core
#   summary: PCNA leaf tensor — fixed d=53 scalar payload with both the current layered-construction API and the pre-existing Tensor compatibility contract used by ZFAE, PCEA, and PCNA callers.
#   owner: a0p maintainer
#   public_surface: Tensor, TENSOR_DIM, tensor_identity, tensor_compose, payload_width, from_scalar, to_scalar, from_seed, zero, zero_tensor, tensors_equal
#   internal_surface: _stretch_payload
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: a0p_skills.contracts.pcna_tensor_shape_holds, a0p_skills.contracts.pcna_tensor_roundtrip, a0p_skills.contracts.pcna_tensor_deterministic
#   rollout: default_enabled
#   rollback: revert file from git
#   unresolved: hmmm (full higher-layer non-commutative composition and double-cover semantics remain separate from this commutative leaf)
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: pcna_tensor_boundaries
#   summary: pure deterministic fixed-width scalar payloads; no storage, network, authentication, or user-data side effects
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: pcna_tensor
#   summary: deterministic d=53 leaf tensors with compatibility constructors, identity, composition, energy, equality, and scalar conversion
#   exposes: Tensor, TENSOR_DIM, tensor_identity, tensor_compose, payload_width, from_scalar, to_scalar, from_seed, zero, zero_tensor, tensors_equal
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""PCNA leaf tensor.

The July 10 layered-substrate rewrite replaced the established ``Tensor`` API
with module-level helpers only.  Existing ZFAE/PCEA/PCNA modules still depend on
``Tensor.from_seed()``, ``Tensor.zero()``, ``energy()``, ``TENSOR_DIM``, and
``zero_tensor()``.  This module preserves the new layered helpers while
restoring that compatibility contract rather than forcing unrelated callers to
fork onto two tensor types.

The leaf operation remains element-wise addition.  Higher-layer
non-commutativity and any double-cover semantics are not claimed here.
"""
from __future__ import annotations

import hashlib
import struct
from dataclasses import dataclass
from typing import Iterable, Tuple

import backend.interdependent_lib.ptca.constants as canon


TENSOR_DIM: int = canon.TENSOR_DIM


def _stretch_payload(seed: int, label: str, n: int = TENSOR_DIM) -> tuple[float, ...]:
    """Deterministically produce ``n`` floats in [-0.5, 0.5]."""
    salt = f"a0p::pcna::tensor::{int(seed)}::{label}".encode("utf-8")
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


@dataclass(frozen=True)
class Tensor:
    """Fixed-width d=53 scalar payload tensor.

    ``seed`` and ``label`` retain provenance for deterministic constructions;
    callers that construct directly from a payload receive neutral defaults.
    """

    payload: Tuple[float, ...]
    seed: int = 0
    label: str = ""

    def __post_init__(self) -> None:
        payload = tuple(float(v) for v in self.payload)
        if len(payload) != TENSOR_DIM:
            raise ValueError(f"Tensor requires payload width d={TENSOR_DIM}, got {len(payload)}")
        object.__setattr__(self, "payload", payload)
        object.__setattr__(self, "seed", int(self.seed))
        object.__setattr__(self, "label", str(self.label))

    @classmethod
    def from_seed(cls, seed: int, label: str = "") -> "Tensor":
        """Deterministic Tensor reproducible from ``(seed, label)``."""
        return cls(_stretch_payload(seed, label), seed=seed, label=label)

    @classmethod
    def zero(cls) -> "Tensor":
        """Return the additive identity tensor."""
        return cls(tuple(0.0 for _ in range(TENSOR_DIM)))

    def width(self) -> int:
        return TENSOR_DIM

    def energy(self) -> float:
        """L2 norm of the payload."""
        return sum(v * v for v in self.payload) ** 0.5


def payload_width() -> int:
    return TENSOR_DIM


def tensor_identity() -> Tensor:
    return Tensor.zero()


def zero() -> Tensor:
    """Current layered API alias for the identity tensor."""
    return tensor_identity()


def zero_tensor() -> Tensor:
    """Compatibility alias retained for ZFAE/PCEA/PCNA callers."""
    return tensor_identity()


def from_scalar(value: float) -> Tensor:
    return Tensor(tuple(float(value) for _ in range(TENSOR_DIM)))


def to_scalar(tensor: Tensor) -> float:
    return sum(tensor.payload) / TENSOR_DIM


def from_seed(seed: int, label: str = "") -> Tensor:
    """Current layered API wrapper around ``Tensor.from_seed``."""
    return Tensor.from_seed(seed, label)


def tensor_compose(a: Tensor, b: Tensor) -> Tensor:
    """Element-wise additive leaf composition."""
    if a.width() != b.width():
        raise ValueError("Payload width mismatch")
    return Tensor(tuple(x + y for x, y in zip(a.payload, b.payload)))


def tensors_equal(a: Tensor, b: Tensor, tol: float = 0.0) -> bool:
    """Exact equality, or component-wise equality within ``tol``."""
    if not isinstance(a, Tensor) or not isinstance(b, Tensor):
        return False
    if tol <= 0.0:
        return a == b
    return all(abs(x - y) <= tol for x, y in zip(a.payload, b.payload))


__all__ = [
    "Tensor",
    "TENSOR_DIM",
    "tensor_identity",
    "tensor_compose",
    "payload_width",
    "from_scalar",
    "to_scalar",
    "from_seed",
    "zero",
    "zero_tensor",
    "tensors_equal",
]
# ratios: loc_comments=88:74 imports_exports=5:17 calls_definitions=35:20
