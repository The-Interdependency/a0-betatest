# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 16:41
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 1:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 0:0
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: aimmh_pkg
#   module_name: aimmh
#   module_kind: engine
#   summary: async multi-model orchestration patterns over a call_fn(model_id, messages)
#   owner: a0p maintainer
#   public_surface: fan_out, daisy_chain, room_all, room_synthesized, council, ModelResult
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: remove imports from server.py
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: aimmh_pkg_boundaries
#   summary: async multi-model orchestration patterns over a call_fn(model_id, messages)
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: none
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: aimmh_pkg
#   summary: async multi-model orchestration patterns over a call_fn(model_id, messages)
#   exposes: fan_out, daisy_chain, room_all, room_synthesized, council, ModelResult
#   boundaries: auth:none, storage:none, network:none, user_data:none
#   owner: a0p maintainer
# === END CAPABILITIES ===
"""
AIMMH — AI Multimodel Multimodal Hub.

Async multi-model conversation orchestration. Built from spec:
six interaction patterns — fan_out, daisy_chain, room_all, room_synthesized,
council, roleplay. The runtime gives `call_fn` async function and a list of
model_ids; the patterns decide who-sees-what.

"""
from .patterns import (
    ModelResult,
    fan_out,
    daisy_chain,
    room_all,
    room_synthesized,
    council,
)

__all__ = [
    "ModelResult",
    "fan_out",
    "daisy_chain",
    "room_all",
    "room_synthesized",
    "council",
]

# === CONTRACTS ===
# id: aimmh_pkg_loads
#   given: module declares its msdmd canon
#   then: the module imports cleanly under the current interpreter
#   class: integration
#   call: a0p_skills.contracts.module_imports_cleanly_holds
# === END CONTRACTS ===
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 16:41
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 1:1
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 0:0
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
