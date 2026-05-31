# === CAPABILITIES ===
# id: msdmd_pkg
#   summary: this project's msdmd application — parser, runner, coverage report
#   exposes: parse, walk, report
#   stability: stable
# === END CAPABILITIES ===
"""msdmd — Module Self-Declared Metadata in Markdown (this project's app)."""
from .parser import parse
from .runner import walk, report

__all__ = ["parse", "walk", "report"]
