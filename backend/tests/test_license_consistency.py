"""Keep the approved project grant discoverable without rewriting license history."""
# === CHECKS ===
# id: check_readme_preserves_license_grant
#   proves: readme_preserves_license_grant
#   call: self::test_generated_readme_preserves_scoped_license_notice
#   mutates: tempdir
#   cleanup: tempdir_teardown
# === END CHECKS ===
from __future__ import annotations

import hashlib
import tomllib
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
SPDX = "AGPL-3.0-or-later"


def _license_section(text: str) -> str:
    return text.split("## License\n", 1)[1].split("\n## ", 1)[0].strip()


def test_metadata_and_summaries_match_approved_grant():
    project = tomllib.loads((ROOT / "backend/pyproject.toml").read_text())["project"]
    assert project["license"] == {"text": SPDX}
    assert [item for item in project["classifiers"] if item.startswith("License ::")] == [
        "License :: OSI Approved :: GNU Affero General Public License v3 or later (AGPLv3+)"
    ]
    notice = (ROOT / "LICENSE_NOTICE.md").read_text()
    assert f"SPDX license identifier: `{SPDX}`" in notice
    assert "either version 3 of the License, or (at your option) any later version" in notice
    assert "## Approval on 2026-10-11 (UTC)" in notice
    assert "does not withdraw permissions granted in earlier releases" in notice
    assert "relicense code owned by other contributors without their permission" in notice
    for name in ("README.md", "CLAUDE.md", "HMMM.md"):
        text = (ROOT / name).read_text()
        assert SPDX in text
        assert "[LICENSE_NOTICE.md](LICENSE_NOTICE.md)" in text or "[grant and approval record](LICENSE_NOTICE.md)" in text


def test_stock_license_text_is_preserved():
    # SHA-256 of LICENSE on main d4cc65f2, before the explicit version decision.
    # The grant belongs to LICENSE_NOTICE.md, not edits to the stock AGPL text.
    assert hashlib.sha256((ROOT / "LICENSE").read_bytes()).hexdigest() == (
        "289ba2d1344d78b36c571be3b98aeacc883b053124fa3004f489d591a55ff30f"
    )


def test_generated_readme_preserves_scoped_license_notice():
    from readme_writer import write_readme

    original = (ROOT / "README.md").read_bytes()
    with TemporaryDirectory() as tmp, patch("living_spec.scan_repo_blocks", return_value=[]):
        target = Path(tmp) / "README.md"
        write_readme(target, explicit=True)
        first = target.read_text()
        assert _license_section(first) == _license_section(original.decode())
        assert "Third-party code retains its own terms; earlier grants are not withdrawn." in first
        write_readme(target, explicit=True)
        assert target.read_text() == first
    assert (ROOT / "README.md").read_bytes() == original
