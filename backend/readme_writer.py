# === MODULE_BUILD ===
# id: readme_writer
#   module_name: readme_writer
#   module_kind: service
#   summary: explicit living-spec to README generator; runtime startup calls are read-only unless A0P_ALLOW_DOC_WRITE=1 is deliberately set
#   owner: Erin Spencer
#   public_surface: write_readme
#   internal_surface: _subsystem, _render_modules
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: revert
#   since: 2026-07-21
#   unresolved: generated documentation still depends on source metadata quality
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: readme_writer_boundaries
#   summary: writes only when called explicitly or A0P_ALLOW_DOC_WRITE=1; application startup does not mutate the repository by default
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: readme_writer
#   summary: renders current MODULE_BUILD declarations into a human-readable repository overview
#   exposes: write_readme
#   boundaries: auth:none, storage:write, network:none, user_data:none
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: readme_runtime_does_not_write
#   given: write_readme is called during ordinary application startup
#   then: no repository file changes unless explicit=True or A0P_ALLOW_DOC_WRITE=1
#   class: provenance
# === END CONTRACTS ===
"""Explicit README generator from living MODULE_BUILD declarations.

Documentation generation belongs to development and release workflows, not to
ordinary application startup. The server may still call ``write_readme`` for
backward compatibility, but the call is a no-op unless writing is explicitly
authorized.
"""
from __future__ import annotations

import os
from pathlib import Path

_SUBSYSTEM_TITLES = {
    "core": "Core service and API surface",
    "auth": "Authentication",
    "providers": "BYOK provider adapters",
    "agents": "Agent instances",
    "zfae": "a0(zfae) native inference",
    "pcea": "PCEA",
    "ptca": "PTCA",
    "pcta": "PCTA",
    "pcna": "PCNA",
    "network": "Network",
    "fiq": "FIQ motion and sentinels",
    "gonal": "A0 source gonol",
    "aimmh": "AIMMH orchestration",
    "tools": "Tools and MCP",
    "skills": "Skills",
    "a0p_skills": "Repository metadata runners",
    "msdmd": "msdmd parser",
    "interdependent_lib": "Interdependent library",
    "pages": "Frontend pages",
    "components": "Frontend components",
    "lib": "Frontend libraries",
    "app": "Frontend root",
    "tests": "Tests",
}
_SUBSYSTEM_ORDER = {name: index for index, name in enumerate(_SUBSYSTEM_TITLES)}
_ILIB_SUBPACKAGES = {
    "zfae", "pcea", "ptca", "pcta", "pcna", "network", "fiq", "gonal",
    "aimmh", "_msdmd",
}


def _repository_root() -> Path:
    return Path(__file__).resolve().parent.parent


def _subsystem(path: str) -> str:
    normalized = path.replace("\\", "/")
    if "frontend/src/pages/" in normalized:
        return "pages"
    if "frontend/src/components/" in normalized:
        return "components"
    if "frontend/src/lib/" in normalized:
        return "lib"
    if "frontend/src/App" in normalized:
        return "app"
    if "interdependent_lib/" in normalized:
        tail = normalized.split("interdependent_lib/", 1)[1]
        segment = tail.split("/", 1)[0]
        if segment.endswith(".py"):
            return "interdependent_lib"
        if segment == "_msdmd":
            return "msdmd"
        if segment in _ILIB_SUBPACKAGES:
            return segment
        return "interdependent_lib"
    for marker, key in (
        ("backend/providers/", "providers"),
        ("backend/auth/", "auth"),
        ("backend/agents/", "agents"),
        ("backend/tools/", "tools"),
        ("backend/skills/", "skills"),
        ("backend/a0p_skills/", "a0p_skills"),
        ("backend/tests/", "tests"),
    ):
        if marker in normalized:
            return key
    return "core"


def _render_modules(entries: list[dict], lines: list[str]) -> None:
    for module in sorted(entries, key=lambda item: item.get("module_name") or ""):
        name = module.get("module_name") or module.get("id") or "?"
        summary = (module.get("summary") or "hmmm: no summary declared").replace(
            "\n", " "
        ).strip()
        path = module.get("path") or ""
        lines.append(f"- **`{name}`** — {summary}  ")
        lines.append(f"  `{path}`")
    lines.append("")


def write_readme(
    path: Path | None = None,
    *,
    explicit: bool = False,
) -> int:
    """Render README from the living spec.

    Returns the discovered module count. Unless ``explicit`` is true or
    ``A0P_ALLOW_DOC_WRITE=1``, discovery runs but no file is written.
    """
    try:
        from living_spec import scan_repo_blocks

        modules = scan_repo_blocks()
    except Exception:
        return 0

    if not explicit and os.environ.get("A0P_ALLOW_DOC_WRITE") != "1":
        return len(modules)

    target = path or (_repository_root() / "README.md")
    by_subsystem: dict[str, list[dict]] = {}
    by_kind: dict[str, list[dict]] = {}
    for module in modules:
        by_subsystem.setdefault(_subsystem(module.get("path") or ""), []).append(module)
        by_kind.setdefault(module.get("module_kind") or "unknown", []).append(module)

    lines = [
        "# a0p — research instrument",
        "",
        "> _changes constant. refinements welcome._  ",
        "> [wayseer@interdependentway.org](mailto:wayseer@interdependentway.org)",
        "",
        "_Generated explicitly from current module declarations. Runtime startup does not rewrite this file._",
        "",
        "## Status boundary",
        "",
        "a0p is an alpha research instrument. It preserves the exact A0 public 157-glyph gonol as source provenance, while current UCNS runtime geometry is typed `NA` until an intrinsically twist-bearing producer contract exists. Local phase embeddings, structural identities, morphology frames, and interaction heuristics are A0 application surfaces—not UCNS theorem objects or maintained EDCM measurement.",
        "",
        "The application must be treated as single-user research infrastructure until the P0 authentication, agent-state, audit-confidentiality, tool-tenant, and outbound-network repairs are complete.",
        "",
        "## Overview",
        "",
        "a0p is a BYOK multi-model workspace wrapped around the deterministic a0(zfae) state engine. Teacher-assisted and native replies remain explicitly distinguished; agent state, provenance, tools, training, and sentinel decisions are inspectable rather than silently substituted.",
        "",
        "## Architecture",
        "",
    ]

    for key in sorted(
        by_subsystem,
        key=lambda item: (_SUBSYSTEM_ORDER.get(item, len(_SUBSYSTEM_ORDER)), item),
    ):
        entries = by_subsystem[key]
        lines.append(f"### {_SUBSYSTEM_TITLES.get(key, key)} · {len(entries)}")
        lines.append("")
        _render_modules(entries, lines)

    lines.extend([
        "## Module index by kind",
        "",
        "| kind | count | modules |",
        "|---|---:|---|",
    ])
    for kind in sorted(by_kind):
        names = ", ".join(
            f"`{module.get('module_name') or module.get('id') or '?'}`"
            for module in sorted(
                by_kind[kind], key=lambda item: item.get("module_name") or ""
            )
        ).replace("|", "\\|")
        lines.append(f"| {kind} | {len(by_kind[kind])} | {names} |")
    lines.extend([
        "",
        "## Regeneration",
        "",
        "```bash",
        "cd backend",
        "A0P_ALLOW_DOC_WRITE=1 python -c 'from readme_writer import write_readme; write_readme(explicit=True)'",
        "```",
        "",
        "## hmmm",
        "",
        "The exact source fixture is present. The lawful projection into the restarted UCNS object remains unresolved.",
        "",
    ])
    target.write_text("\n".join(lines), encoding="utf-8")
    return len(modules)


if __name__ == "__main__":
    raise SystemExit(0 if write_readme(explicit=True) else 1)


__all__ = ["write_readme"]
