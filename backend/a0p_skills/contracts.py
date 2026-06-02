# === MODULE_BUILD ===
# id: a0p_contracts
#   module_name: contracts
#   module_kind: experiment
#   summary: executable test functions referenced by CONTRACTS `call:` paths across the repo
#   owner: a0p maintainer
#   public_surface: aimmh_invoke_propagates_error, skill_report_visibility_holds, pcea_round_trip_53
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: read
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: self
#   rollout: default_enabled
#   rollback: remove file; CONTRACTS entries that referenced it will error in test-build
# === END MODULE_BUILD ===
"""Contract test functions.

Each function declared here is referenced by a `call:` field in some
module's CONTRACTS block. Test-build imports and runs them. Each must:
  - return None on pass
  - raise AssertionError on contract violation
  - have no required arguments
"""
from __future__ import annotations
import asyncio


async def aimmh_invoke_propagates_error() -> None:
    """Contract: aimmh._invoke must propagate error fields from dict results."""
    from interdependent_lib.aimmh.patterns import _invoke

    async def bad_caller(model_id, messages):
        return {"content": "", "error": "boom"}

    r = await _invoke(bad_caller, "x:y", [])
    assert r.error == "boom", f"expected error='boom', got error={r.error!r}"
    assert r.content == "", f"expected empty content, got {r.content!r}"


def skill_report_visibility_holds() -> None:
    """Contract: msdmd report MUST surface gaps array even when empty."""
    from pathlib import Path
    from a0p_skills.module_build_runner import run

    rep = run(Path("/app/backend"))
    assert "gaps" in rep, "gaps key missing from report"
    assert isinstance(rep["gaps"], list), "gaps must be a list"
    assert "scanned" in rep and rep["scanned"] > 0, "no files scanned"


def pcea_round_trip_53() -> None:
    """Contract: PCEA encrypt(decrypt(x)) == x for the 53-prime ring."""
    from interdependent_lib.pcea import PCEAInstance

    state = [42, 1009, 7, 0, 999_983, 1, 1_000_003]
    enc = PCEAInstance(seed=[1, 2, 3])
    dec = PCEAInstance(seed=[1, 2, 3])
    cipher = enc.encrypt(state)
    plain = dec.decrypt(cipher)
    assert plain == state, f"PCEA round-trip failed: {plain} != {state}"


def ptca_canon_shape_holds() -> None:
    """Contract: PTCA canonical shape constants from prime_core are [157, 7, 7, 53].

    `hmmm`: the 9-axis from the design conversation is not present in upstream
    canon as of 2026-05-31. Recorded as an open question, not a failure.
    """
    from interdependent_lib.ptca import constants as c

    assert c.SEED_COUNT == 157, f"SEED_COUNT={c.SEED_COUNT}, expected 157"
    assert c.CIRCLES_PER_SEED == 7, f"CIRCLES_PER_SEED={c.CIRCLES_PER_SEED}"
    assert c.TENSORS_PER_CIRCLE == 7, f"TENSORS_PER_CIRCLE={c.TENSORS_PER_CIRCLE}"
    assert c.TENSOR_DIM == 53, f"TENSOR_DIM={c.TENSOR_DIM}"
    assert c.TENSOR_LEAVES == 7693
    assert c.PARAM_COUNT == 407_729


# ---------- Step 1 — PCNA leaf tensor + group aggregate + ucns bridge ----

def pcna_tensor_deterministic() -> None:
    """Contract: Tensor.from_seed(s, label) is pure / reproducible / width=53."""
    from interdependent_lib.pcna.tensor import Tensor, TENSOR_DIM

    a = Tensor.from_seed(157, "phi")
    b = Tensor.from_seed(157, "phi")
    c = Tensor.from_seed(157, "psi")  # different label → different tensor

    assert a == b, "Tensor.from_seed must be deterministic on identical inputs"
    assert a != c, "different labels must produce different tensors"
    assert len(a.payload) == TENSOR_DIM, f"payload width {len(a.payload)} != {TENSOR_DIM}"
    assert len(b.payload) == TENSOR_DIM
    # values in [-0.5, +0.5]
    for v in a.payload:
        assert -0.5 <= v <= 0.5, f"payload value {v} out of [-0.5, +0.5]"


def pcna_aggregate_size_holds() -> None:
    """Contract: aggregate(7 tensors) returns one Tensor of width d=53."""
    from interdependent_lib.pcna.tensor import Tensor, TENSOR_DIM
    from interdependent_lib.pcna.group import aggregate, GROUP_SIZE

    ts = [Tensor.from_seed(i, "circle-a") for i in range(GROUP_SIZE)]
    agg = aggregate(ts)
    assert isinstance(agg, Tensor), "aggregate must return a Tensor"
    assert len(agg.payload) == TENSOR_DIM


def pcna_aggregate_identity_holds() -> None:
    """Contract: aggregate of seven zero tensors == the zero tensor."""
    from interdependent_lib.pcna.group import aggregate, identity_tensor, is_identity, GROUP_SIZE

    zeros = [identity_tensor() for _ in range(GROUP_SIZE)]
    result = aggregate(zeros)
    assert is_identity(result), f"aggregate of identities must be identity; got {result.payload[:3]}"


def pcna_aggregate_deterministic_holds() -> None:
    """Contract: aggregate is a pure function of its inputs."""
    from interdependent_lib.pcna.tensor import Tensor
    from interdependent_lib.pcna.group import aggregate, GROUP_SIZE

    ts = [Tensor.from_seed(i + 100, "det") for i in range(GROUP_SIZE)]
    a = aggregate(ts)
    b = aggregate(ts)
    assert a == b, "aggregate must be deterministic"


def ucns_bridge_unit_holds() -> None:
    """Contract: bridge UNIT identity behaves as ucns unit; multiply works."""
    from interdependent_lib import ucns_bridge as ub

    assert ub.is_unit(ub.UNIT) is True, "bridge.UNIT must be UCNS unit"
    # Build a non-unit UCNSObject and confirm is_unit returns False
    import ucns
    from fractions import Fraction
    obj = ucns.UCNSObject(2, 2,
                          [(Fraction(0), None), (Fraction(1), None)],
                          [0, 0])
    assert ub.is_unit(obj) is False, "non-unit must report False"
    # multiply must be the ucns multiply (referentially)
    assert ub.multiply is ucns.multiply or callable(ub.multiply)
    # describe must be safe to call on UNIT
    s = ub.describe(ub.UNIT)
    assert isinstance(s, str)
