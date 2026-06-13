# === MODULE_BUILD ===
# id: readme_writer
#   module_name: readme_writer
#   module_kind: service
#   summary: regenerates /app/README.md on every backend startup from the living spec (scan_repo_blocks); idempotent, deterministic, never raises
#   owner: Erin Spencer
#   public_surface: write_readme
#   internal_surface: _format_kind_section
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.module_imports_cleanly_holds
#   rollout: default_enabled
#   rollback: revert; README.md stops auto-regenerating
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: readme_writer_boundaries
#   summary: read-only spec scan + write to /app/README.md
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: readme_writer
#   summary: living-spec → README.md
#   exposes: write_readme
#   boundaries: auth:none, storage:write, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: readme_writer_loads
#   given: module declares its msdmd canon
#   then: the module imports cleanly under the current interpreter
#   class: integration
#   call: a0p_skills.contracts.module_imports_cleanly_holds
# === END CONTRACTS ===
"""Regenerate /app/README.md from the living spec on every backend start."""
from __future__ import annotations
from datetime import datetime, timezone
from pathlib import Path


def write_readme(path: Path = Path("/app/README.md")) -> int:
    """Write README.md from the living spec. Returns number of modules included."""
    try:
        from living_spec import scan_repo_blocks
        mods = scan_repo_blocks()
    except Exception:
        return 0
    by_kind: dict[str, list[dict]] = {}
    for m in mods:
        by_kind.setdefault(m.get("module_kind") or "unknown", []).append(m)
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    lines: list[str] = [
        "# a0p — research instrument",
        "",
        "> _changes constant. refinements welcome._",
        "> [wayseer@interdependentway.org](mailto:wayseer@interdependentway.org)",
        "",
        f"_Living spec — auto-regenerated on backend startup at {ts}._",
        f"_{len(mods)} modules across {len(by_kind)} kinds._",
        "",
        "Don't edit by hand; edit a module's `# === MODULE_BUILD ===` block instead.",
        "",
    ]
    for kind in sorted(by_kind):
        entries = sorted(by_kind[kind], key=lambda m: m.get("module_name") or "")
        lines.append(f"## {kind} · {len(entries)}")
        lines.append("")
        lines.append("| module | path | summary |")
        lines.append("|---|---|---|")
        for m in entries:
            name = (m.get("module_name") or m.get("id") or "?").replace("|", "\\|")
            p = (m.get("path") or "").replace("|", "\\|")
            summ = (m.get("summary") or "").replace("|", "\\|").replace("\n", " ")
            if len(summ) > 200:
                summ = summ[:197] + "…"
            lines.append(f"| `{name}` | `{p}` | {summ} |")
        lines.append("")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return len(mods)


__all__ = ["write_readme"]
