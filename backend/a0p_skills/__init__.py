# === MODULE_BUILD ===
# id: a0p_skills_pkg
#   module_name: a0p_skills
#   module_kind: skill
#   summary: this project's three msdmd skill executors — msdmd / test-build / meta-module-build
#   owner: a0p maintainer
#   public_surface: msdmd_runner, test_build_runner, module_build_runner, registry
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: read
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: remove package import from server.py and revert /api/skill routes
# === END MODULE_BUILD ===
"""a0p_skills — three msdmd-derived skill executors.

  msdmd_runner          → CAPABILITIES coverage (deprecated, kept for migration)
  test_build_runner     → CONTRACTS — imports `call:` paths and runs them
  module_build_runner   → MODULE_BUILD — validates required schema + gap report
"""
from . import test_build_runner, module_build_runner

__all__ = ["test_build_runner", "module_build_runner"]
