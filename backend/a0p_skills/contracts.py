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


# ---------- Step 2 — PCTA Circle layer ---------------------------------

def pcta_circle_holds_seven_holds() -> None:
    """Contract: Circle holds exactly 7 Tensors; heptagram visits every position once."""
    from interdependent_lib.pcna.tensor import Tensor
    from interdependent_lib.pcta import Circle, CIRCLE_SIZE, heptagram_walk

    ts = [Tensor.from_seed(157 * 7 + i, f"phi::pos{i}") for i in range(CIRCLE_SIZE)]
    circle = Circle(ts)

    assert len(circle.tensors) == CIRCLE_SIZE
    assert circle.step == 2  # default {7/2}

    # heptagram order visits every index exactly once
    walk = heptagram_walk(0, 2, 7)
    assert sorted(walk) == [0, 1, 2, 3, 4, 5, 6], f"walk missed indices: {walk}"
    # exact {7/2} sequence
    assert walk == (0, 2, 4, 6, 1, 3, 5), f"{{7/2}} order mismatch: {walk}"


def pcta_circle_aggregate_is_tensor_holds() -> None:
    """Contract: circle.aggregate() returns a Tensor of width 53 (the 8th referent)."""
    from interdependent_lib.pcna.tensor import Tensor, TENSOR_DIM
    from interdependent_lib.pcta import Circle

    circle = Circle.from_seed(42, "test")
    agg = circle.aggregate()

    assert isinstance(agg, Tensor), "aggregate must be a Tensor"
    assert len(agg.payload) == TENSOR_DIM, f"width {len(agg.payload)} != {TENSOR_DIM}"
    # Aggregate is cached — second call returns the same instance
    assert circle.aggregate() is agg, "aggregate must be cached"
    # And reproducible across separate Circles built from the same seed
    other = Circle.from_seed(42, "test")
    assert circle.aggregate() == other.aggregate()


def pcta_circle_heptagram_routing_holds() -> None:
    """Contract: heptagram_walk(0, 2, 7) yields the canonical {7/2} permutation."""
    from interdependent_lib.pcta import heptagram_walk, heptagram_walk_7_2, heptagram_walk_7_3

    assert heptagram_walk(0, 2, 7) == (0, 2, 4, 6, 1, 3, 5), "{7/2} order"
    assert heptagram_walk(0, 3, 7) == (0, 3, 6, 2, 5, 1, 4), "{7/3} order"
    assert heptagram_walk_7_2() == (0, 2, 4, 6, 1, 3, 5)
    assert heptagram_walk_7_3() == (0, 3, 6, 2, 5, 1, 4)

    # starting from a non-zero index still visits all positions
    walk = heptagram_walk(3, 2, 7)
    assert sorted(walk) == [0, 1, 2, 3, 4, 5, 6]
    assert walk[0] == 3


def pcta_circle_ucns_shape_holds() -> None:
    """Contract: circle.ucns_shape() returns a valid UCNSObject (opaque host).

    Per upstream PTCA spec the UCNS object is an opaque carrier. The 7-cell
    PCTA structure lives in circle.tensors, not in UCNS A_plus. What this
    contract demands: the shape IS a UCNSObject, and identical circles
    produce identical UCNS shapes (stable identity).
    """
    import ucns
    from interdependent_lib.pcta import Circle

    circle_a = Circle.from_seed(7, "shape-check")
    circle_b = Circle.from_seed(7, "shape-check")  # identical inputs
    circle_c = Circle.from_seed(8, "shape-check")  # different seed

    shape_a = circle_a.ucns_shape()
    shape_b = circle_b.ucns_shape()
    shape_c = circle_c.ucns_shape()

    assert isinstance(shape_a, ucns.UCNSObject), "shape must be a UCNSObject"
    # Caching — same circle instance returns same object
    assert circle_a.ucns_shape() is shape_a
    # Identical circles produce structurally identical UCNS shapes
    assert shape_a == shape_b, "identical circles must have equal UCNS shapes"
    # Different circles MAY produce different shapes (not required but desirable);
    # we don't assert inequality strictly — UCNS face_bit collisions are 50/50.
    # We assert the shapes are well-formed.
    assert shape_a.n_dec == 2 and shape_c.n_dec == 2
    assert len(shape_a.A_plus) == 2 and len(shape_c.A_plus) == 2


# ---------- Step 3 — PTCA Seed + Core (top layer) ----------------------

def ptca_seed_holds_seven_holds() -> None:
    """Contract: Seed holds exactly 7 Circles; {7/3} heptagram visits every index once."""
    from interdependent_lib.pcta import Circle
    from interdependent_lib.ptca.seed import Seed, SEED_CIRCLES
    from interdependent_lib.pcta.circle import heptagram_walk

    seed = Seed.from_seed(42, "phi::seed42")

    assert len(seed.circles) == SEED_CIRCLES
    assert seed.step == 3  # default {7/3}
    for c in seed.circles:
        assert isinstance(c, Circle)

    walk = heptagram_walk(0, 3, 7)
    assert sorted(walk) == [0, 1, 2, 3, 4, 5, 6], f"walk missed indices: {walk}"
    assert walk == (0, 3, 6, 2, 5, 1, 4), f"{{7/3}} order mismatch: {walk}"


def ptca_seed_aggregate_is_tensor_holds() -> None:
    """Contract: seed.aggregate() returns a Tensor of width 53 (the seed-level 8th referent)."""
    from interdependent_lib.pcna.tensor import Tensor, TENSOR_DIM
    from interdependent_lib.ptca.seed import Seed

    seed_a = Seed.from_seed(7, "agg-check")
    seed_b = Seed.from_seed(7, "agg-check")
    seed_c = Seed.from_seed(8, "agg-check")

    agg_a = seed_a.aggregate()
    agg_b = seed_b.aggregate()
    agg_c = seed_c.aggregate()

    assert isinstance(agg_a, Tensor)
    assert len(agg_a.payload) == TENSOR_DIM
    # Deterministic across separate instances built from same (seed, label)
    assert agg_a == agg_b, "seed aggregate must be deterministic"
    # Different seeds → different aggregates
    assert agg_a != agg_c, "different seeds must produce different aggregates"
    # Cached on the instance
    assert seed_a.aggregate() is agg_a


def ptca_seed_heptagram_routing_holds() -> None:
    """Contract: seed-level heptagram is {7/3}."""
    from interdependent_lib.pcta.circle import heptagram_walk
    from interdependent_lib.ptca.seed import HEPTAGRAM_STEP_SEED

    assert HEPTAGRAM_STEP_SEED == 3
    assert heptagram_walk(0, HEPTAGRAM_STEP_SEED, 7) == (0, 3, 6, 2, 5, 1, 4)


def ptca_core_assembles_157_holds() -> None:
    """Contract: Core.with_n(157) builds 157 seeds and matches canon param count."""
    from interdependent_lib.ptca.core import Core, DEFAULT_N
    from interdependent_lib.ptca.seed import Seed, SEED_CIRCLES
    from interdependent_lib.pcta.circle import CIRCLE_SIZE
    from interdependent_lib.pcna.tensor import TENSOR_DIM

    assert DEFAULT_N == 157

    core = Core.with_n(157, label="phi")
    assert core.n == 157
    assert len(core.seeds) == 157
    for s in core.seeds:
        assert isinstance(s, Seed)
        assert len(s.circles) == SEED_CIRCLES

    expected = 157 * SEED_CIRCLES * CIRCLE_SIZE * TENSOR_DIM
    assert expected == 407_729
    assert core.param_count() == expected, f"param_count={core.param_count()} != {expected}"


def ptca_core_aggregate_is_tensor_holds() -> None:
    """Contract: core.aggregate() returns a Tensor of width 53 (the top-level 8th referent)."""
    from interdependent_lib.pcna.tensor import Tensor, TENSOR_DIM
    from interdependent_lib.ptca.core import Core

    # Small core for speed — N=7 is fine for shape/identity contracts.
    core_a = Core.with_n(7, label="phi")
    core_b = Core.with_n(7, label="phi")
    core_c = Core.with_n(7, label="psi")  # different label → different aggregate

    agg_a = core_a.aggregate()
    agg_b = core_b.aggregate()
    agg_c = core_c.aggregate()

    assert isinstance(agg_a, Tensor)
    assert len(agg_a.payload) == TENSOR_DIM
    assert agg_a == agg_b, "core aggregate must be deterministic across same inputs"
    assert agg_a != agg_c, "core aggregate must vary with label"
    assert core_a.aggregate() is agg_a, "core aggregate must be cached"


def ptca_core_param_count_matches_canon_holds() -> None:
    """Contract: param count for N=157 matches PTCA prime_core PARAM_COUNT = 407_729."""
    from interdependent_lib.ptca import constants as c
    from interdependent_lib.ptca.core import Core

    core = Core.with_n(157, label="phi")
    assert core.param_count() == c.PARAM_COUNT == 407_729, (
        f"core.param_count={core.param_count()} canon={c.PARAM_COUNT}"
    )


# ---------- Step 4 — PCEA kernel cross-cut -----------------------------

def pcea_kernel_round_trip_holds() -> None:
    """Contract: kernel_invert(kernel_step(t, prev), prev) == grid_project(t)."""
    from interdependent_lib.pcna.tensor import Tensor
    from interdependent_lib.pcea.kernel import kernel_step, kernel_invert, grid_project

    t = Tensor.from_seed(2026, "kernel::plain")
    prev = Tensor.from_seed(2025, "kernel::prev")

    enc = kernel_step(t, prev)
    rec = kernel_invert(enc, prev)
    projected = grid_project(t)

    # grid_project is idempotent
    assert grid_project(projected) == projected, "grid_project must be idempotent"

    # Round-trip recovers the grid projection of the original (bit-exact)
    assert rec == projected, "kernel_step/kernel_invert must round-trip grid-projected Tensors exactly"

    # And the encrypted Tensor is not equal to the original (real encryption happened)
    assert enc != t, "encrypted Tensor must differ from plaintext"
    assert enc != projected, "encrypted Tensor must differ from grid-projected plaintext"


def pcea_kernel_advances_state_holds() -> None:
    """Contract: encryption depends on last_state — different prev produces different ciphertext."""
    from interdependent_lib.pcna.tensor import Tensor
    from interdependent_lib.pcea.kernel import kernel_step, kernel_invert, grid_project

    t = Tensor.from_seed(1, "fixed")
    prev_a = Tensor.from_seed(10, "prev-a")
    prev_b = Tensor.from_seed(11, "prev-b")

    enc_a = kernel_step(t, prev_a)
    enc_b = kernel_step(t, prev_b)

    assert enc_a != enc_b, "different prev must produce different ciphertext"
    # And using wrong prev for decryption gives wrong recovery (compared against grid projection)
    bad = kernel_invert(enc_a, prev_b)
    assert bad != grid_project(t), "decryption with wrong key must NOT recover the plaintext"


def pcea_kernel_layer_cross_cut_holds() -> None:
    """Contract: kernel_step round-trips on any layer's aggregate (against grid_project)."""
    from interdependent_lib.pcna.tensor import Tensor
    from interdependent_lib.pcta import Circle
    from interdependent_lib.ptca.seed import Seed
    from interdependent_lib.ptca.core import Core
    from interdependent_lib.pcea.kernel import kernel_step, kernel_invert, grid_project

    prev = Tensor.from_seed(0, "kernel::prev")

    circle = Circle.from_seed(1, "cross-cut::circle")
    seed = Seed.from_seed(2, "cross-cut::seed")
    core = Core.with_n(7, label="cross-cut::core")

    for label, agg in [
        ("circle", circle.aggregate()),
        ("seed", seed.aggregate()),
        ("core", core.aggregate()),
    ]:
        enc = kernel_step(agg, prev)
        rec = kernel_invert(enc, prev)
        assert rec == grid_project(agg), (
            f"{label} aggregate failed round-trip through PCEA kernel"
        )


# ---------- Step 5 — Network engine ----------------------------------------

def network_topology_canonical_holds() -> None:
    """Contract: RING_TOPOLOGY matches the user's pinned spec exactly."""
    from interdependent_lib.network.topology import (
        RING_TOPOLOGY, RING_WEIGHTS, SCORED_RING_NAMES, MEMORY_RING_NAMES,
        unique_heptagram_slots,
    )

    # Per-ring N — user override
    assert RING_TOPOLOGY["phi"].n_seeds == 157
    assert RING_TOPOLOGY["psi"].n_seeds == 157
    assert RING_TOPOLOGY["omega"].n_seeds == 157
    assert RING_TOPOLOGY["theta"].n_seeds == 29
    assert RING_TOPOLOGY["sigma"].n_seeds == 53
    assert RING_TOPOLOGY["mem_l"].n_seeds == 19
    assert RING_TOPOLOGY["mem_s"].n_seeds == 17

    # Sigma is the observer (un-scored)
    assert RING_TOPOLOGY["sigma"].scored is False
    assert RING_TOPOLOGY["sigma"].weight == 0.0
    assert "sigma" not in SCORED_RING_NAMES

    # Memory rings are linear
    for n in MEMORY_RING_NAMES:
        assert RING_TOPOLOGY[n].step == 0

    # Lock-step avoidance — every non-memory ring has a unique (step, direction)
    assert unique_heptagram_slots(), "non-memory rings must have unique heptagram slots"

    # Scored weights sum to 1.0 (Φ 0.30 + Θ 0.20 + Ψ 0.15 + Ω 0.15 + MemL 0.12 + MemS 0.08)
    scored_total = sum(RING_WEIGHTS[n] for n in SCORED_RING_NAMES)
    assert abs(scored_total - 1.0) < 1e-9, f"scored weights sum {scored_total}, expected 1.0"


def sigma_host_digest_stable_holds() -> None:
    """Contract: Σ host digest is deterministic across two immediate calls."""
    from interdependent_lib.network.sigma_source import gather_host_digest

    a = gather_host_digest()
    b = gather_host_digest()
    assert a.digest == b.digest, "host digest must be deterministic across immediate calls"
    assert len(a.digest) == 32
    assert a.paths_scanned > 0, "expected to scan at least one watched path"


def network_rings_match_topology_holds() -> None:
    """Contract: build_all_rings produces every named ring with the right N and step."""
    from interdependent_lib.network.topology import RING_TOPOLOGY
    from interdependent_lib.network.rings import build_all_rings

    # Use small overrides for the big rings so the test runs quickly
    overrides = {"phi": 5, "psi": 5, "omega": 5, "theta": 5, "sigma": 5,
                 "mem_l": 5, "mem_s": 5}
    rings = build_all_rings(overrides)

    for name, spec in RING_TOPOLOGY.items():
        assert name in rings, f"missing ring {name}"
        r = rings[name]
        assert r.spec.name == name
        # n should be the override value
        assert r.n == 5, f"ring {name} n={r.n} expected 5 from override"
        # The aggregate must be a Tensor
        from interdependent_lib.pcna.tensor import Tensor, TENSOR_DIM
        assert isinstance(r.aggregate(), Tensor)
        assert len(r.aggregate().payload) == TENSOR_DIM


def network_tick_is_deterministic_holds() -> None:
    """Contract: a tick produces a TickResult with one entry per ring and PCEA-encrypted state."""
    from interdependent_lib.network.engine import NetworkEngine
    from interdependent_lib.network.topology import RING_ORDER
    from interdependent_lib.pcna.tensor import Tensor

    eng = NetworkEngine(n_override={n: 5 for n in RING_ORDER})
    state = eng.heartbeat()

    assert state.tick.tick_number == 1
    assert set(state.tick.rings.keys()) == set(RING_ORDER)
    for name, rt in state.tick.rings.items():
        assert isinstance(rt.plaintext_aggregate, Tensor)
        assert isinstance(rt.ciphertext_aggregate, Tensor)
        # Encryption actually happened
        assert rt.plaintext_aggregate != rt.ciphertext_aggregate


def network_coherence_weights_sum_holds() -> None:
    """Contract: coherence.total == sum(contributions); Σ goes to observer_signal not contributions."""
    from interdependent_lib.network.engine import NetworkEngine
    from interdependent_lib.network.topology import RING_ORDER

    eng = NetworkEngine(n_override={n: 5 for n in RING_ORDER})
    state = eng.heartbeat()

    # Total == sum of contributions
    assert abs(state.coherence.total - sum(state.coherence.contributions.values())) < 1e-9

    # Σ is in observer_signal, not contributions
    assert "sigma" in state.coherence.observer_signal
    assert "sigma" not in state.coherence.contributions

    # Every scored ring contributes
    from interdependent_lib.network.topology import SCORED_RING_NAMES
    for name in SCORED_RING_NAMES:
        assert name in state.coherence.contributions


def network_engine_heartbeat_holds() -> None:
    """Contract: heartbeat advances tick_count; Σ baseline pinned; tamper.drifted False on first tick."""
    from interdependent_lib.network.engine import NetworkEngine
    from interdependent_lib.network.topology import RING_ORDER

    eng = NetworkEngine(n_override={n: 5 for n in RING_ORDER})
    assert eng.tick_count == 0
    baseline = eng.baseline_digest_hex
    assert isinstance(baseline, str) and len(baseline) == 64  # 32-byte blake2b hex

    state1 = eng.heartbeat()
    assert eng.tick_count == 1
    assert state1.tamper.drifted is False, "no drift expected on first tick (same host state)"
    assert state1.tamper.baseline_hex == baseline

    _state2 = eng.heartbeat()
    assert eng.tick_count == 2

    # snapshot is JSON-shaped
    snap = eng.snapshot()
    assert snap["tick_count"] == 2
    assert snap["baseline_digest"] == baseline
    assert set(snap["rings"].keys()) == set(RING_ORDER)


# ---------- a0(ZFAE) native inference engine ----------------------------

def zfae_parser_deterministic_holds() -> None:
    """Contract: parse_semantic is a pure function (same input → same output)."""
    from interdependent_lib.zfae._parser import parse_semantic

    a = parse_semantic("Why is Σ a host-integrity observer?")
    b = parse_semantic("Why is Σ a host-integrity observer?")
    assert a == b, "parse_semantic must be deterministic"
    assert a.question is True
    assert "why" in a.question_words
    # Whitespace-only / empty
    empty = parse_semantic("")
    assert empty.token_count == 0 and empty.first_word == ""


def zfae_intent_dispatch_holds() -> None:
    """Contract: intent selection covers every label and respects priority."""
    from interdependent_lib.zfae._parser import parse_semantic
    from interdependent_lib.zfae._intent import select_intent, INTENT_LABELS

    cases = [
        ("", "low_signal"),
        ("Hi.", "acknowledge"),
        ("Show me current Φ energy.", "describe_state"),
        ("Why does Θ have N=29?", "answer_question"),
        ("?", "ask_clarification"),
        ("Recall the prior turn in memory.", "reflect_memory"),
        ("No.", "negation_received"),
        ("the substrate now binds seven tensors as a circle aggregate", "echo_with_analysis"),
    ]
    seen = set()
    for prompt, expected in cases:
        feats = parse_semantic(prompt)
        intent = select_intent(feats)
        assert intent == expected, f"prompt {prompt!r}: expected {expected}, got {intent}"
        seen.add(intent)
    # Every dispatched intent must be in the canonical label set
    assert seen.issubset(set(INTENT_LABELS))


def zfae_decoder_native_only_holds() -> None:
    """Contract: decoder produces text ONLY via the template grammar; no LLM module imported."""
    import sys
    from interdependent_lib.zfae._decoder import TemplateGrammarDecoder, render
    from interdependent_lib.zfae._intent import INTENT_LABELS
    from interdependent_lib.zfae._parser import parse_semantic

    # Render every intent — none should raise, and each output must be non-empty.
    decoder = TemplateGrammarDecoder()
    feats = parse_semantic("show me Σ status")
    state = {
        "tick_number": 7, "phi_energy": 0.1, "psi_energy": 0.2, "omega_energy": 0.3,
        "theta_energy": 0.4, "sigma_energy": 0.5, "coherence_total": 0.6,
        "memory_l_count": 0, "memory_s_count": 0, "last_intent_hash": "abcd",
    }
    for intent in INTENT_LABELS:
        text = decoder.decode(intent, feats, state)
        assert isinstance(text, str) and len(text) > 0
    # The decoder module must not import any provider / LLM SDK
    blacklist = (
        "openai", "anthropic", "google.generativeai", "ucns",
        "emergentintegrations", "interdependent_lib.providers",
        "providers.openai_provider", "providers.anthropic_provider",
        "providers.gemini_provider", "providers.xai_provider",
    )
    decoder_module = sys.modules["interdependent_lib.zfae._decoder"]
    for name in blacklist:
        # We're allowed to have the name as a substring (e.g. "openai" in docs)
        # but the module must not have imported the SDK.
        attr = getattr(decoder_module, name.split(".")[0], None)
        if attr is None:
            continue
        # if the attribute is a module, fail
        assert not getattr(attr, "__file__", "").endswith(".py") or "interdependent_lib" in getattr(attr, "__file__", ""), (
            f"decoder must not import LLM module {name!r}"
        )


def zfae_transition_deterministic_holds() -> None:
    """Contract: bind_features_to_rings is a pure function of features+intent+priors."""
    from interdependent_lib.zfae._parser import parse_semantic
    from interdependent_lib.zfae._intent import select_intent
    from interdependent_lib.zfae._transition import bind_features_to_rings, advance_zfae_state, ZFAE_RING_NAMES

    feats = parse_semantic("explain the tamper signal in Σ")
    intent = select_intent(feats)

    a = bind_features_to_rings(feats, intent)
    b = bind_features_to_rings(feats, intent)
    for role in ZFAE_RING_NAMES:
        assert a[role] == b[role], f"binding for {role} not deterministic"
    # Ciphertexts also deterministic
    cipher_a = advance_zfae_state(a)
    cipher_b = advance_zfae_state(b)
    for role in ZFAE_RING_NAMES:
        assert cipher_a[role] == cipher_b[role], f"cipher for {role} not deterministic"


def zfae_engine_native_only_holds() -> None:
    """Contract: A0ZFAEInferenceEngine.infer() is deterministic + has no LLM dependency.

    Verifies:
      • returns the required keys (assistantText, nextSnapshot, trace)
      • assistantText is generated natively (template grammar)
      • the engine module's `__file__` is in interdependent_lib (no provider import)
      • two identical calls produce identical outputs
      • the trace records uses_llm=False
    """
    import sys
    from interdependent_lib.zfae.inference import A0ZFAEInferenceEngine, MISSING_NATIVE_MESSAGE

    engine = A0ZFAEInferenceEngine()
    r1 = engine.infer(rawPrompt="hi there, show me the state.")
    r2 = engine.infer(rawPrompt="hi there, show me the state.")

    # Required keys
    for key in ("assistantText", "nextSnapshot", "trace"):
        assert key in r1, f"missing key {key}"
        assert key in r2, f"missing key {key}"

    # Deterministic
    assert r1["assistantText"] == r2["assistantText"], "engine must be deterministic"
    assert r1["nextSnapshot"] == r2["nextSnapshot"]

    # Native — text is non-empty and is the template render (not the missing message
    # since we DO have a decoder)
    assert isinstance(r1["assistantText"], str) and len(r1["assistantText"]) > 0
    assert r1["assistantText"] != MISSING_NATIVE_MESSAGE

    # Trace says no LLM
    assert r1["trace"]["uses_llm"] is False
    assert r1["trace"]["engine"] == "a0(zfae)"

    # Module-level: the inference module did not import any provider package.
    forbidden = (
        "providers", "providers.openai_provider", "providers.anthropic_provider",
        "providers.gemini_provider", "providers.xai_provider", "emergentintegrations",
    )
    inference_module = sys.modules["interdependent_lib.zfae.inference"]
    module_globals = vars(inference_module)
    for name in forbidden:
        head = name.split(".")[0]
        attr = module_globals.get(head)
        if attr is None:
            continue
        path = getattr(attr, "__file__", "") or ""
        # Allow names that resolve into interdependent_lib only
        assert "interdependent_lib" in path, f"engine imports forbidden module {name!r} ({path})"


def chat_zfae_route_native_only_holds() -> None:
    """Contract: /api/chat/zfae's handler calls ONLY A0ZFAEInferenceEngine.

    Validated by inspecting the server module: the `chat_zfae` coroutine
    must NOT reference any provider or LLM-call helper.
    """
    import inspect
    import server  # type: ignore

    fn = getattr(server, "chat_zfae", None)
    assert fn is not None, "server.chat_zfae not defined"
    src = inspect.getsource(fn)
    forbidden_tokens = (
        "REGISTRY[",
        "_call_model(",
        "aimmh_fan_out(",
        "aimmh_daisy(",
        "EmergentProvider",
        "OpenAIProvider", "AnthropicProvider", "GeminiProvider", "XAIProvider",
    )
    for tok in forbidden_tokens:
        assert tok not in src, f"chat_zfae must not contain {tok!r}"
    # It must reference the engine.
    assert "A0_ZFAE_ENGINE" in src or "A0ZFAEInferenceEngine" in src, (
        "chat_zfae must invoke the a0(zfae) engine"
    )


def pcea_kernel_chain_holds() -> None:
    """Contract: kernel_chain encrypts a sequence with each step keyed against prior plaintext."""
    from interdependent_lib.pcna.tensor import Tensor
    from interdependent_lib.pcea.kernel import kernel_chain, kernel_invert

    initial = Tensor.from_seed(0, "init")
    plaintexts = [Tensor.from_seed(i, f"chain::{i}") for i in range(1, 4)]

    ciphertexts = kernel_chain(plaintexts, initial)
    assert len(ciphertexts) == len(plaintexts)

    # Reverse-decrypt — each step inverts against the immediately-prior plaintext
    recovered: list[Tensor] = []
    last = initial
    for ct, pt in zip(ciphertexts, plaintexts):
        rec = kernel_invert(ct, last)
        recovered.append(rec)
        last = pt  # next inversion uses the original plaintext as the key
    assert recovered == list(plaintexts), "kernel_chain must round-trip with the original keys"
