# hmmm — a0p open boundary

## Non-commutativity + Double-cover (F6) — COMPLETE + TESTS

`ucns_embed.py` now has:
- Full non-commutative `phase_compose` (left chirality twists add/subtract)
- Self-contained contract test functions:
  - `ucns_embed_noncommutative_holds()`
  - `ucns_embed_double_cover_holds()`
  - `ucns_embed_deterministic_holds()`

`gonal_stack.py` aligned: chapter recompose now uses the new non-commutative
`phase_compose` via `reduce`. Order of utterances now matters in a handedness-
aware way.

## Network layer port — STARTED

`backend/interdependent_lib/network/` directory created with initial
`topology.py` skeleton (will use new non-commutative embed + canon 157/7/7/53).

## Core substrate + F4 — COMPLETE

PCNA/PCTA/PTCA layers built manifest-first with public 157 canon.

All changes pushed. Tests are now real and runnable.
