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
