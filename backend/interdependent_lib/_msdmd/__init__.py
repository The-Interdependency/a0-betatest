# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 3:34
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 2:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 0:0
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: msdmd_pkg
#   module_name: _msdmd
#   module_kind: skill
#   summary: this project's msdmd application — parser + back-compat runner (canonical executors live in a0p_skills)
#   owner: a0p maintainer
#   public_surface: parse, walk, report, walk_tree, parse_text, parse_file
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: read
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: remove imports from server.py and a0p_skills
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: msdmd_pkg_boundaries
#   summary: this project's msdmd application — parser + back-compat runner (canonical executors live in a0p_skills)
#   auth_boundary: none
#   storage_boundary: read
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
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
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 3:34
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 2:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 0:0
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
