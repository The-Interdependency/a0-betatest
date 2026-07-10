# hmmm — a0p open boundary

## Full Test Suite Added (2026-07-10)

Created `backend/interdependent_lib/tests/test_invariants.py` with comprehensive coverage:

- Non-commutativity (`phase_compose(a,b) != phase_compose(b,a)`)
- Double-cover / sheet-twist behavior
- PCNA tensor shape + roundtrip
- PCTA circle (exactly 7 tensors + aggregate)
- PTCA seed (exactly 7 circles)
- PTCA core (N=157, param count = 407729)
- Public canon shape (F4: 157/7/7/53 exact values)
- Gonal stack chapter recompose (non-commutative)
- Network topology arity (157)

Self-contained `*_holds()` functions remain in `ucns_embed.py` for the skill-lib runner.

All tests are importable and runnable:
    python -m pytest backend/interdependent_lib/tests/test_invariants.py -q
    # or via skill-lib test-build

## Status Summary

- F6 non-commutativity + double-cover: **implemented + tested**
- Core substrate (PCNA/PCTA/PTCA): **complete + tested**
- F4 public canon (157): **enforced + tested**
- gonal_stack: **aligned to non-commutative compose**
- Network topology: **spec aligned + basic tests**
- Full test suite: **delivered**

Everything is manifest-first and skill-lib compliant.
