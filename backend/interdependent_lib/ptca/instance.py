"""PTCAInstance — the main engine class binding tensor + sentinels + provenance.

The instance carries N prime nodes; the standard research seed is N=157
(used by the three PTCA cores configured by PCNA: phi / psi / omega).
"""
from __future__ import annotations
from .tensor import PrimeTensor
from .sentinels import SentinelChannel
from .provenance import hash_state


class PTCAInstance:
    def __init__(self, n_primes: int = 157, label: str = "phi", seed: int = 0):
        self.label = label
        self.tensor = PrimeTensor(n_primes)
        if seed:
            self.tensor.seed_from_int(seed)
        self.channels: dict[str, SentinelChannel] = {}
        self.lineage: list[str] = []

    def register(self, channel: SentinelChannel) -> None:
        self.channels[channel.name] = channel

    def push(self, channel_name: str, payload: dict) -> str:
        if channel_name not in self.channels:
            self.channels[channel_name] = SentinelChannel(name=channel_name)
        msg = self.channels[channel_name].push(payload)
        h = hash_state({"ch": channel_name, "seq": msg.seq, "p": payload},
                       op="push", parents=self.lineage[-1:])
        self.lineage.append(h)
        return h

    def snapshot(self) -> dict:
        return {
            "label": self.label,
            "tensor": self.tensor.summary(),
            "channels": {k: len(v) for k, v in self.channels.items()},
            "lineage_head": self.lineage[-1] if self.lineage else None,
            "lineage_depth": len(self.lineage),
        }
