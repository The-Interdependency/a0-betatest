# === MODULE_BUILD ===
# id: carrier_gonal
#   module_name: gonal
#   module_kind: fixture
#   summary: exact A0 source-provenance public 157-gonal plus an independent constructor for private application arrangements
#   owner: Erin Spencer
#   public_surface: GonalSpec, build_gonal, validate_gonal, print_gonal, PUBLIC_GONOL_157, PUBLIC_GONOL_SHA256, EXAMPLE_157, make_example_157, get_default, public_gonol_sha256
#   internal_surface: UPPERCASE, LOWERCASE, DIGITS_ODD, DIGITS_EVEN, PAIRED_OPEN, PAIRED_CLOSE, UNPAIRED_ALL
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: restore only from the recorded source commit and digest
#   since: 2026-07-21
#   unresolved: lawful projection into the restarted twist-bearing UCNS object remains hmmm
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: carrier_gonal_boundaries
#   summary: the exact source fixture is immutable; build_gonal is application-local and cannot redefine the fixture
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: carrier_gonal
#   summary: preserves the exact public gonol source fixture and constructs separately named private application arrangements
#   exposes: PUBLIC_GONOL_157, public_gonol_sha256, build_gonal, validate_gonal
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: public_gonol_source_fixture_exact
#   given: the public gonol source fixture
#   then: arity is 157, position zero is SPACE, digit zero is nonzero, every glyph is unique, and its canonical digest matches the recorded digest
#   class: correctness
# id: private_gonal_constructor_cannot_replace_fixture
#   given: an arbitrary GonalSpec passed to build_gonal
#   then: PUBLIC_GONOL_157 remains unchanged
#   class: provenance
# id: public_gonol_validation_counts_available
#   given: validate_gonal is called on the source fixture
#   then: the response includes stable category counts required by the public gonals endpoint
#   class: compatibility
# === END CONTRACTS ===
"""Exact A0 source-provenance public gonol.

This repository is the source record for the public 157-position arrangement
specified by Erin and present at commit
``7af8debf6ef3905f01baff02b43d8c3bee16ccbc``.

The tuple below is immutable provenance. It is not a current UCNS object and it
does not claim to implement the restarted twist-bearing UCNS algebra. The
separate ``build_gonal`` function remains available for A0-private application
arrangements and cannot redefine the source fixture.
"""
from __future__ import annotations

import hashlib
import json
import string
from dataclasses import dataclass, field
from typing import Optional

PUBLIC_GONOL_SOURCE_REPOSITORY = "The-Interdependency/a0-betatest"
PUBLIC_GONOL_SOURCE_COMMIT = "7af8debf6ef3905f01baff02b43d8c3bee16ccbc"
PUBLIC_GONOL_SOURCE_PATH = "backend/interdependent_lib/gonal/gonal.py"
PUBLIC_GONOL_SHA256 = "55d10c84529a4d7bc7714786357e977b68d9df2ac3f73d20e229580b552c2ef5"

PUBLIC_GONOL_157: tuple[str, ...] = (
    " ", "A", "!", '"', "B", "#", "$", "C", "%", "(", "D", "&", "'", "E", "1", "*",
    "F", "+", "[", "G", ",", "-", "H", ".", "/", "I", "3", "{", "J", ":", ";", "K",
    "=", "?", "L", "<", "@", "M", "5", "\\", "N", "^", "_", "O", "‘", "`", "P", "|",
    "~", "Q", "7", "…", "R", "“", "—", "S", "–", "·", "T", "°", "«", "U", "9", "±",
    "V", "×", "÷", "W", "√", "∂", "X", "∫", "∑", "Y", "∏", "∇", "Z", "∞", "≈", "≠",
    "a", "≤", "≥", "b", "→", "←", "c", ")", "↑", "d", "↓", "2", "e", "↔", "⊕", "f",
    "]", "⊗", "g", "⊙", "⊘", "h", "∈", "4", "i", "}", "∉", "j", "⊂", "⊃", "k", "⊆",
    ">", "l", "⊇", "6", "m", "∩", "∪", "n", "∧", "’", "o", "∨", "¬", "p", "∀", "8",
    "q", "∃", "”", "r", "⊢", "⊨", "s", "∴", "∵", "t", "»", "0", "u", "≡", "ψ", "v",
    "φ", "ω", "w", "α", "β", "x", "γ", "δ", "y", "λ", "π", "z", "σ",
)

UPPERCASE = list(string.ascii_uppercase)
LOWERCASE = list(string.ascii_lowercase)
DIGITS_ODD = ["1", "3", "5", "7", "9"]
DIGITS_EVEN = ["2", "4", "6", "8", "0"]
DIGITS_ALL = DIGITS_ODD + DIGITS_EVEN
PAIRED_OPEN = ["(", "[", "{", "<", "‘", "“", "«"]
PAIRED_CLOSE = [")", "]", "}", ">", "’", "”", "»"]
UNPAIRED_ASCII = [
    chr(i)
    for i in range(33, 127)
    if chr(i)
    not in (
        set(UPPERCASE)
        | set(LOWERCASE)
        | set(string.digits)
        | set(PAIRED_OPEN)
        | set(PAIRED_CLOSE)
        | {" "}
    )
]
UNPAIRED_OPS = [
    "…", "—", "–", "·", "°", "±", "×", "÷", "√",
    "∂", "∫", "∑", "∏", "∇", "∞", "≈", "≠", "≤", "≥",
    "→", "←", "↑", "↓", "↔", "⊕", "⊗", "⊙", "⊘",
    "∈", "∉", "⊂", "⊃", "⊆", "⊇", "∩", "∪",
    "∧", "∨", "¬", "∀", "∃", "⊢", "⊨", "∴", "∵", "≡",
    "ψ", "φ", "ω", "α", "β", "γ", "δ", "λ", "π", "σ", "τ", "θ",
    "∅", "ℕ", "ℤ", "ℚ", "ℝ", "ℂ", "ℵ",
]
UNPAIRED_ALL = UNPAIRED_ASCII + UNPAIRED_OPS


def public_gonol_sha256(arrangement: tuple[str, ...] = PUBLIC_GONOL_157) -> str:
    payload = json.dumps(
        tuple(arrangement), ensure_ascii=False, separators=(",", ":")
    ).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


if public_gonol_sha256() != PUBLIC_GONOL_SHA256:
    raise RuntimeError("public gonol source fixture digest mismatch")
if len(PUBLIC_GONOL_157) != 157 or len(set(PUBLIC_GONOL_157)) != 157:
    raise RuntimeError("public gonol source fixture shape mismatch")
if PUBLIC_GONOL_157[0] != " " or PUBLIC_GONOL_157.index("0") == 0:
    raise RuntimeError("public gonol origin/glyph boundary mismatch")


@dataclass(frozen=True)
class GonalSpec:
    n: int = 157
    no_adjacent: tuple[str, ...] = ("letter", "digit")
    letter_sides: str = "opposite"
    digit_alternation: bool = True
    paired_alignment: str = "opposite"
    horizontal_symmetry: str = "forbidden"
    origin: str = " "
    extra_unpaired: tuple[str, ...] = field(default_factory=tuple)
    seed: Optional[int] = None


def build_gonal(spec: GonalSpec) -> list[str]:
    """Build an A0-private application arrangement.

    This constructor does not define or mutate ``PUBLIC_GONOL_157``.
    """
    n = int(spec.n)
    if n < 3:
        raise ValueError("n must be at least 3")
    slot = [""] * n
    slot[0] = spec.origin
    upper_arc = list(range(1, (n // 2) + 1))
    lower_arc = list(range((n // 2) + 1, n))

    if spec.letter_sides == "opposite":
        upper_l = list(range(1, upper_arc[-1], 3))[: len(UPPERCASE)]
        lower_l = list(range(lower_arc[1], lower_arc[-1], 3))[: len(LOWERCASE)]
        if len(upper_l) < len(UPPERCASE) or len(lower_l) < len(LOWERCASE):
            raise ValueError("carrier is too small for opposite-side letters")
        for pos, ch in zip(upper_l, UPPERCASE):
            slot[pos] = ch
        for pos, ch in zip(lower_l, LOWERCASE):
            slot[pos] = ch
    elif spec.letter_sides == "same":
        letters = [ch for pair in zip(UPPERCASE, LOWERCASE) for ch in pair]
        positions = list(range(1, upper_arc[-1], 2))[: len(letters)]
        if len(positions) < len(letters):
            raise ValueError("carrier is too small for same-side letters")
        for pos, ch in zip(positions, letters):
            slot[pos] = ch
    else:
        raise ValueError("letter_sides must be 'opposite' or 'same'")

    digits = DIGITS_ALL
    gaps = [p for p in range(1, n) if not slot[p]]
    if len(gaps) < len(digits):
        raise ValueError("carrier is too small for digits")
    stride = max(1, len(gaps) // (len(digits) + 1))
    for i, ch in enumerate(digits, 1):
        idx = min(i * stride, len(gaps) - 1)
        while slot[gaps[idx]]:
            idx = (idx + 1) % len(gaps)
        slot[gaps[idx]] = ch

    pairs = list(zip(PAIRED_OPEN, PAIRED_CLOSE))
    gaps = [p for p in range(1, n) if not slot[p]]
    if len(gaps) < 2 * len(pairs):
        raise ValueError("carrier is too small for paired punctuation")
    for op, close in pairs:
        op_pos = gaps.pop(0)
        close_pos = gaps.pop(len(gaps) // 2)
        slot[op_pos] = op
        slot[close_pos] = close

    unpaired = list(UNPAIRED_ALL) + list(spec.extra_unpaired)
    for i, pos in enumerate(p for p in range(n) if not slot[p]):
        slot[pos] = unpaired[i] if i < len(unpaired) else f"\x00{i}"
    return slot


def validate_gonal(slot: list[str] | tuple[str, ...], spec: GonalSpec) -> dict:
    violations: list[str] = []
    n = len(slot)
    if n != spec.n:
        violations.append(f"length {n} != spec.n {spec.n}")
    if not slot or slot[0] != spec.origin:
        violations.append("origin mismatch")
    if len(set(slot)) != len(slot):
        violations.append("glyphs must be unique")
    overflow = [i for i, ch in enumerate(slot) if str(ch).startswith("\x00")]
    if overflow:
        violations.append(f"overflow positions: {overflow}")
    for k in range(n):
        cur, nxt = slot[k], slot[(k + 1) % n]
        if "letter" in spec.no_adjacent and cur in string.ascii_letters and nxt in string.ascii_letters:
            violations.append(f"letter-letter at {k}-{(k + 1) % n}")
        if "digit" in spec.no_adjacent and cur in string.digits and nxt in string.digits:
            violations.append(f"digit-digit at {k}-{(k + 1) % n}")

    def category(ch: str) -> str:
        if ch in UPPERCASE:
            return "uppercase"
        if ch in LOWERCASE:
            return "lowercase"
        if ch in string.digits:
            return "digit"
        if ch in PAIRED_OPEN:
            return "paired_open"
        if ch in PAIRED_CLOSE:
            return "paired_close"
        if ch == spec.origin:
            return "origin"
        return "unpaired"

    counts = {
        name: sum(1 for ch in slot if category(ch) == name)
        for name in (
            "uppercase", "lowercase", "digit", "paired_open",
            "paired_close", "unpaired", "origin",
        )
    }
    return {
        "valid": not violations,
        "violations": violations,
        "warnings": [],
        "counts": counts,
        "n": n,
    }


def print_gonal(slot: list[str] | tuple[str, ...], width: int = 10) -> None:
    print(f"{len(slot)}-GONAL ARRANGEMENT")
    for start in range(0, len(slot), width):
        print("  ".join(f"{i:3}:{slot[i]!r}" for i in range(start, min(start + width, len(slot)))))


def make_example_157() -> list[str]:
    """Compatibility accessor for the exact source fixture."""
    return list(PUBLIC_GONOL_157)


def get_default() -> list[str]:
    return list(PUBLIC_GONOL_157)


EXAMPLE_157 = list(PUBLIC_GONOL_157)

__all__ = [
    "GonalSpec", "build_gonal", "validate_gonal", "print_gonal",
    "PUBLIC_GONOL_157", "PUBLIC_GONOL_SHA256",
    "PUBLIC_GONOL_SOURCE_REPOSITORY", "PUBLIC_GONOL_SOURCE_COMMIT",
    "PUBLIC_GONOL_SOURCE_PATH", "public_gonol_sha256",
    "EXAMPLE_157", "make_example_157", "get_default",
    "UPPERCASE", "LOWERCASE", "DIGITS_ODD", "DIGITS_EVEN",
    "PAIRED_OPEN", "PAIRED_CLOSE", "UNPAIRED_ALL",
]
