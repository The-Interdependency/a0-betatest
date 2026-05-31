# === CAPABILITIES ===
# id: msdmd_parser
#   summary: stdlib-only universal parser for msdmd fenced comment blocks
#   exposes: parse, strip_marker, COMMENT_MARKER_BY_EXT
#   stability: stable
# === END CAPABILITIES ===
"""Universal msdmd parser. Pure stdlib. Zero deps."""
from __future__ import annotations
import re
from typing import Iterator

# === REQUIRES ===
# id: msdmd_parser_stdlib
#   module: re
#   version: any
# === END REQUIRES ===


COMMENT_MARKER_BY_EXT: dict[str, str] = {
    ".py": "#", ".rb": "#", ".ex": "#", ".sh": "#", ".bash": "#",
    ".ts": "//", ".tsx": "//", ".js": "//", ".jsx": "//",
    ".rs": "//", ".go": "//", ".java": "//", ".c": "//", ".cpp": "//", ".swift": "//",
    ".sql": "--", ".lua": "--", ".hs": "--",
}


def strip_marker(line: str) -> str:
    """Strip the leading comment marker (#, //, --) and at most one space."""
    s = line
    # strip leading whitespace once, then a marker, then one space
    lstripped = s.lstrip()
    for marker in ("#", "//", "--"):
        if lstripped.startswith(marker):
            body = lstripped[len(marker):]
            return body[1:] if body.startswith(" ") else body
    return lstripped


def _iter_blocks(text: str, block_name: str) -> Iterator[str]:
    """Yield the body (text between fences, exclusive) of each matching block."""
    # The marker is greedy across `#`, `//`, `--`. We anchor the fence with
    # `===  BLOCK_NAME  ===` allowing any comment marker prefix.
    open_re = re.compile(
        r"^[ \t]*(?:#+|//+|--+)[ \t]*===[ \t]*"
        + re.escape(block_name)
        + r"[ \t]*===[ \t]*$",
        re.M,
    )
    close_re = re.compile(
        r"^[ \t]*(?:#+|//+|--+)[ \t]*===[ \t]*END[ \t]+"
        + re.escape(block_name)
        + r"[ \t]*===[ \t]*$",
        re.M,
    )
    pos = 0
    while True:
        m_open = open_re.search(text, pos)
        if not m_open:
            return
        m_close = close_re.search(text, m_open.end())
        if not m_close:
            return
        yield text[m_open.end():m_close.start()]
        pos = m_close.end()


def parse(text: str, block_name: str) -> list[dict]:
    """Parse all `block_name` blocks in `text`. Returns flat list of entries.

    Each entry is a dict with at minimum `id`, plus whatever fields were
    declared. No semantic validation — that's the application's job.
    """
    entries: list[dict] = []
    for body in _iter_blocks(text, block_name):
        current: dict[str, str] | None = None
        for raw in body.splitlines():
            line = strip_marker(raw).rstrip()
            if not line.strip():
                # blank entry separator — flush
                if current and "id" in current:
                    entries.append(current)
                    current = None
                continue
            if ":" not in line:
                continue
            key, _, value = line.partition(":")
            key = key.strip()
            value = value.strip()
            if not key:
                continue
            if key == "id":
                if current and "id" in current:
                    entries.append(current)
                current = {"id": value}
            else:
                if current is None:
                    # field before id — skip (invalid)
                    continue
                current[key] = value
        if current and "id" in current:
            entries.append(current)
    return entries
