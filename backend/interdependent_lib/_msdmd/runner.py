# === CAPABILITIES ===
# id: msdmd_runner
#   summary: walks a source tree, parses msdmd blocks, emits coverage + gap report
#   exposes: walk, report, main
#   stability: stable
# === END CAPABILITIES ===
"""msdmd runner — walks a tree, reports per-file entries + gap list."""
from __future__ import annotations
import sys
from pathlib import Path
from typing import Iterator
from .parser import parse, COMMENT_MARKER_BY_EXT


SKIP_DIRS = {
    "__pycache__", "node_modules", ".git", ".venv", "venv", "env",
    "build", "dist", ".next", ".cache", "tests",
}


def walk(
    root: Path,
    block_name: str,
    exts: tuple[str, ...] = (".py",),
) -> Iterator[tuple[Path, list[dict]]]:
    """Yield (path, entries) for every source file under `root`."""
    for p in sorted(root.rglob("*")):
        if p.is_dir():
            continue
        if any(part in SKIP_DIRS for part in p.parts):
            continue
        if p.suffix not in exts:
            continue
        try:
            text = p.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        yield p, parse(text, block_name)


def report(
    root: Path,
    block_name: str = "CAPABILITIES",
    exts: tuple[str, ...] = (".py",),
) -> dict:
    """Aggregate coverage + gap list for `block_name` under `root`."""
    by_file: dict[str, list[dict]] = {}
    gaps: list[str] = []
    scanned = 0
    for p, entries in walk(root, block_name, exts):
        scanned += 1
        rel = str(p.relative_to(root))
        by_file[rel] = entries
        if not entries:
            gaps.append(rel)
    return {
        "block_name": block_name,
        "root": str(root),
        "scanned": scanned,
        "covered": scanned - len(gaps),
        "gaps_count": len(gaps),
        "gaps": gaps,
        "by_file": by_file,
    }


def _format_human(r: dict) -> str:
    lines: list[str] = []
    lines.append(f"msdmd · {r['block_name']} · root={r['root']}")
    lines.append(f"scanned={r['scanned']}  covered={r['covered']}  gaps={r['gaps_count']}")
    lines.append("")
    if r["gaps"]:
        lines.append("GAPS (missing block):")
        for g in r["gaps"]:
            lines.append(f"  · {g}")
        lines.append("")
    lines.append("ENTRIES:")
    for f, entries in r["by_file"].items():
        if not entries:
            continue
        lines.append(f"  {f}")
        for e in entries:
            extras = [f"{k}={v}" for k, v in e.items() if k != "id"]
            lines.append(f"    - {e['id']}" + (("  " + " · ".join(extras)) if extras else ""))
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    argv = list(argv if argv is not None else sys.argv[1:])
    block = "CAPABILITIES"
    root = Path("/app/backend")
    as_json = False
    i = 0
    while i < len(argv):
        a = argv[i]
        if a in ("-b", "--block"):
            block = argv[i + 1]
            i += 2
            continue
        if a in ("-r", "--root"):
            root = Path(argv[i + 1])
            i += 2
            continue
        if a == "--json":
            as_json = True
            i += 1
            continue
        i += 1
    r = report(root, block)
    if as_json:
        import json
        print(json.dumps(r, indent=2))
    else:
        print(_format_human(r))
    return 1 if r["gaps_count"] else 0


if __name__ == "__main__":
    sys.exit(main())
