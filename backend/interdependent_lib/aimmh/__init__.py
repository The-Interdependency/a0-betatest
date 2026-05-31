"""
AIMMH — AI Multimodel Multimodal Hub.

Async multi-model conversation orchestration. Built from spec:
six interaction patterns — fan_out, daisy_chain, room_all, room_synthesized,
council, roleplay. The runtime gives `call_fn` async function and a list of
model_ids; the patterns decide who-sees-what.

# === CAPABILITIES ===
# id: aimmh_pkg
#   summary: async multi-model orchestration patterns over a call_fn(model_id, messages)
#   exposes: fan_out, daisy_chain, room_all, room_synthesized, council, ModelResult
#   stability: stable
# === END CAPABILITIES ===
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
