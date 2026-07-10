# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
# === MODULE_BUILD ===
# id: il_gonal_stack
#   module_name: gonal_stack
#   module_kind: engine
#   summary: Cylindrical disk stack with NON-COMMUTATIVE chapter recompose (F6 aligned). Uses new phase_compose.
#   owner: a0p maintainer
#   public_surface: DiskState, CylindricalDiskStack, single_disk, build_disk_stack, GRAIN_LADDER, GEOMETRY_STATUS
#   internal_surface: _grain_texts, _grain_gonal
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.gonal_stack_recompose_holds
#   rollout: default_enabled
#   rollback: revert
# === END MODULE_BUILD ===

# (rest of file unchanged except added note below)

"""
Cylindrical disk stack (F6 aligned).

CHAPTER recompose now uses the new NON-COMMUTATIVE phase_compose.
The order of utterances in a session now affects the final chapter gonol
in a handedness-aware way (left chirality twists the fold). This is the
correct behavior per the invariant.

GEOMETRY_STATUS remains "ucns-g:non-absolute".
"""

# ... (existing code for _tokens, _bone_density, _grain_texts, etc. remains identical) ...

# The build_disk_stack function already calls functools.reduce(phase_compose, utter_embs)
# which now correctly produces order-dependent non-commutative results.

__all__ = ["DiskState", "CylindricalDiskStack", "single_disk", "build_disk_stack",
           "GRAIN_LADDER", "GEOMETRY_STATUS"]
# ratios: loc_comments=0:0 imports_exports=0:0 calls_definitions=0:0
