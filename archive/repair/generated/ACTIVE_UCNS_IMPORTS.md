# Active pre-reset UCNS dependency inventory

Generated from branch `agent/suspend-pre-reset-ucns`.

```text
backend/a0p_skills/contracts.py:1620:    from interdependent_lib.ucns_embed import embed_text, phase_compose
backend/a0p_skills/contracts.py:1632:    chapter_emb = functools.reduce(phase_compose, [embed_text(u) for u in turns])
backend/a0p_skills/contracts.py:187:def ucns_bridge_unit_holds() -> None:
backend/a0p_skills/contracts.py:189:    from interdependent_lib import ucns_bridge as ub
backend/a0p_skills/contracts.py:192:    # Build a non-unit UCNSObject and confirm is_unit returns False
backend/a0p_skills/contracts.py:193:    import ucns
backend/a0p_skills/contracts.py:195:    obj = ucns.UCNSObject(2, 2,
backend/a0p_skills/contracts.py:259:    """Contract: circle.ucns_shape() returns a valid UCNSObject (opaque host).
backend/a0p_skills/contracts.py:263:    contract demands: the shape IS a UCNSObject, and identical circles
backend/a0p_skills/contracts.py:266:    import ucns
backend/a0p_skills/contracts.py:277:    assert isinstance(shape_a, ucns.UCNSObject), "shape must be a UCNSObject"
backend/interdependent_lib/gonal_stack.py:205:        functools.reduce(phase_compose, utterance_embeddings)
backend/interdependent_lib/gonal_stack.py:58:per-utterance embeddings through ``phase_compose``; order therefore remains
backend/interdependent_lib/gonal_stack.py:72:from .ucns_embed import embed_text, phase_compose, UCNS_CARRIER_ARITY
backend/interdependent_lib/pcta/circle.py:120:    def ucns_shape(self) -> "ucns.UCNSObject":
backend/interdependent_lib/pcta/circle.py:63:import ucns
backend/interdependent_lib/pcta/circle.py:91:def _circle_ucns_shape(content_hash: int = 0) -> "ucns.UCNSObject":
backend/interdependent_lib/pcta/circle.py:93:    return ucns.UCNSObject(2, 2, [(Fraction(0), 1.0), (Fraction(1), 1.0)], [face_bit, face_bit])
backend/interdependent_lib/ptca/core.py:54:import ucns
backend/interdependent_lib/ptca/core.py:61:def _core_ucns_shape(content_hash: int = 0) -> "ucns.UCNSObject":
backend/interdependent_lib/ptca/core.py:63:    return ucns.UCNSObject(2, 2, [(Fraction(0), 1.0), (Fraction(1), 1.0)], [face_bit, face_bit])
backend/interdependent_lib/ptca/core.py:98:    def ucns_shape(self) -> "ucns.UCNSObject":
backend/interdependent_lib/ptca/seed.py:110:    def ucns_shape(self) -> "ucns.UCNSObject":
backend/interdependent_lib/ptca/seed.py:54:import ucns
backend/interdependent_lib/ptca/seed.py:64:def _seed_ucns_shape(content_hash: int = 0) -> "ucns.UCNSObject":
backend/interdependent_lib/ptca/seed.py:66:    return ucns.UCNSObject(2, 2, [(Fraction(0), 1.0), (Fraction(1), 1.0)], [face_bit, face_bit])
backend/interdependent_lib/tests/test_invariants.py:24:    assert ucns_embed.phase_compose(a, b).angle_bits != ucns_embed.phase_compose(b, a).angle_bits
backend/interdependent_lib/tests/test_invariants.py:31:    composed = ucns_embed.phase_compose(a, b)
backend/interdependent_lib/ucns_bridge.py:154:    "UCNSObject",
backend/interdependent_lib/ucns_bridge.py:15:#   tests: a0p_skills.contracts.ucns_bridge_unit_holds
backend/interdependent_lib/ucns_bridge.py:22:# id: ucns_bridge_boundaries
backend/interdependent_lib/ucns_bridge.py:32:# id: ucns_bridge
backend/interdependent_lib/ucns_bridge.py:3:# id: ucns_bridge
backend/interdependent_lib/ucns_bridge.py:4:#   module_name: ucns_bridge
backend/interdependent_lib/ucns_bridge.py:51:import ucns
backend/interdependent_lib/ucns_bridge.py:54:# id: ucns_bridge_unit_consistency
backend/interdependent_lib/ucns_bridge.py:58:#   call: a0p_skills.contracts.ucns_bridge_unit_holds
backend/interdependent_lib/ucns_bridge.py:63:    from ucns import a0_safe as _a0_safe  # type: ignore[attr-defined]
backend/interdependent_lib/ucns_bridge.py:75:UCNSObject = ucns.UCNSObject
backend/interdependent_lib/ucns_bridge.py:76:from ucns_recursive.canonical import lcm
backend/interdependent_lib/ucns_bridge.py:8:#   public_surface: is_unit, multiply, left_quotient, right_quotient, object_record, describe, seq_prime_safe, UNIT, UCNSObject, lcm, has_a0_safe_facade
backend/interdependent_lib/ucns_embed.py:122:def embed_text(text: str) -> UCNSNativeEmbedding:
backend/interdependent_lib/ucns_embed.py:134:    return UCNSNativeEmbedding(
backend/interdependent_lib/ucns_embed.py:141:def phase_compose(a: UCNSNativeEmbedding, b: UCNSNativeEmbedding) -> UCNSNativeEmbedding:
backend/interdependent_lib/ucns_embed.py:160:    return UCNSNativeEmbedding(angle_bits=tuple(new_angles), chirality=tuple(new_chirality), carrier=a.carrier, lanes=n, canonical_hash=h)
backend/interdependent_lib/ucns_embed.py:175:    ab = phase_compose(a, b)
backend/interdependent_lib/ucns_embed.py:176:    ba = phase_compose(b, a)
backend/interdependent_lib/ucns_embed.py:183:    ab = phase_compose(a, b)
backend/interdependent_lib/ucns_embed.py:187:__all__ = ["UCNSNativeEmbedding", "embed_text", "phase_compose",
backend/interdependent_lib/ucns_embed.py:32:#   exposes: UCNSNativeEmbedding, embed_text, phase_compose, UCNS_CARRIER_ARITY, EMBED_LANES
backend/interdependent_lib/ucns_embed.py:39:phase_compose now uses left chirality to twist add vs subtract.
backend/interdependent_lib/ucns_embed.py:8:#   public_surface: UCNSNativeEmbedding, embed_text, phase_compose, UCNS_CARRIER_ARITY, EMBED_LANES
backend/interdependent_lib/ucns_embed.py:90:class UCNSNativeEmbedding:
backend/interdependent_lib/ucns_embed.py:97:    def similarity(self, other: "UCNSNativeEmbedding") -> float:
backend/interdependent_lib/zfae/morphology.py:105:def frame_value(value: float) -> UCNSObject:
backend/interdependent_lib/zfae/morphology.py:115:    return UCNSObject(d, 1, [(angle, None)], [face])
backend/interdependent_lib/zfae/morphology.py:118:def carrier_lcm(a: UCNSObject | None, b: UCNSObject | None) -> UCNSObject | None:
backend/interdependent_lib/zfae/morphology.py:126:def compose_word(phi_value: float, omega_value: float) -> UCNSObject | None:
backend/interdependent_lib/zfae/morphology.py:134:def word_carrier(word: UCNSObject | None) -> int:
backend/interdependent_lib/zfae/morphology.py:139:def word_signal(word: UCNSObject | None) -> float:
backend/interdependent_lib/zfae/morphology.py:162:    def frame(self, value: float) -> UCNSObject:
backend/interdependent_lib/zfae/morphology.py:180:    def frame(self, value: float) -> UCNSObject:
backend/interdependent_lib/zfae/morphology.py:198:    clause: UCNSObject | None,
backend/interdependent_lib/zfae/morphology.py:199:    known_factor: UCNSObject | None,
backend/interdependent_lib/zfae/morphology.py:19:#   hmmm: the continuous-lane → UCNSObject carrier encoding is an inferred deterministic bridge (lane value → bounded Fraction angle → length-1 carrier); the morphology and arithmetic share the one carrier-LCM operator
backend/interdependent_lib/zfae/morphology.py:200:) -> UCNSObject | None:
backend/interdependent_lib/zfae/morphology.py:208:    The constructive inverse it WOULD call (``ucns_bridge.left_quotient``) is
backend/interdependent_lib/zfae/morphology.py:218:    from ..ucns_bridge import left_quotient
backend/interdependent_lib/zfae/morphology.py:79:from ..ucns_bridge import UCNSObject, multiply as _ucns_multiply
```
