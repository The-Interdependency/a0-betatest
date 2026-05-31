"""
AIMMH — AI Multimodel Multimodal Hub.

Async multi-model conversation orchestration. Built from spec:
six interaction patterns — fan_out, daisy_chain, room_all, room_synthesized,
council, roleplay. The runtime gives `call_fn` async function and a list of
model_ids; the patterns decide who-sees-what.

# === MODULE_BUILD ===
# id: aimmh_patterns
#   summary: 6 multi-model interaction patterns over an async call_fn(model_id, messages)
#   exposes: fan_out, daisy_chain, room_all, room_synthesized, council, ModelResult
# === END MODULE_BUILD ===
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
