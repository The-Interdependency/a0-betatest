# Public gonol canon migration to UCNS

**Canon source:** `The-Interdependency/a0-betatest@7af8debf6ef3905f01baff02b43d8c3bee16ccbc`

**Canonical package home after promotion:** `The-Interdependency/ucns`

## Decision

The public gonol implemented in this repository is canon for all UCNS. The exact
implementation is promoted into the UCNS public package; A0 becomes a strict
consumer and source-provenance repository rather than a second authority.

The canon remains exactly:

```text
ARITY = 157
position 0 = SPACE = ZERO
position 0 = Möbius twist point = seam = origin
position 0 = only always-known character
private phase/permutation act only on positions 1..156
perm[0] == 0
public faces/chirality/adjacency/mirror
lossless lifted traversal
repeated glyph = full 157-step revolution
SPACE = emitted seam event
digit "0" = ordinary nonzero glyph
```

No angle formula, quotient reinterpretation, removable-gauge model, or alternate
origin is introduced by the migration.

## A0 compatibility surfaces

These historical imports now delegate to UCNS and contain no second canon
implementation:

```text
interdependent_lib.gonal.gonal
interdependent_lib.gonal.faces
interdependent_lib.gonal.mirror
interdependent_lib.gonal.lifted_path
interdependent_lib.zfae.gonal_inscription.PrivateGonal
```

`interdependent_lib.gonal.registry` resolves its default and mirror from UCNS.
An optional JSON private-spec arrangement remains A0 application configuration;
it is not the canonical public gonol and is not used to redefine the universal
157-character leaf.

ZFAE retains application behavior only:

```text
field whitening
lane selection
morphology composition
continuous-field inscription
glyph emission
```

The fixed-origin `PrivateGonal` is imported from UCNS.

## Dependency and merge order

1. Review and merge the UCNS public-gonol promotion.
2. Repin A0 to the merged UCNS commit.
3. Merge this compatibility migration.
4. Remove any later copied carrier implementations rather than reconciling them
   as peers.

## Nonclaims

This migration does not prove the UCNS factorization frontier, validate A0
inference, establish linguistic meaning, or authorize a new continuous bridge.
A0's continuous ZFAE inscription remains an application of the public gonol,
not the definition of its origin.

## hmmm

The source canon remains attributable to A0. Canonical package ownership moves
to UCNS so every downstream application imports one exact origin.
