# === CAPABILITIES ===
# id: ptca_sentinels
#   summary: tagged signal lanes with priority ordering — SentinelChannel + SentinelMessage
#   exposes: SentinelChannel, SentinelMessage
#   stability: stable
# === END CAPABILITIES ===

"""Sentinel channels — tagged signal lanes with priority ordering."""
from __future__ import annotations
from dataclasses import dataclass, field
from collections import deque


@dataclass(order=True)
class SentinelMessage:
    priority: int
    seq: int
    payload: dict = field(compare=False)


@dataclass
class SentinelChannel:
    name: str
    priority: int = 0
    queue: deque = field(default_factory=deque)
    _seq: int = 0

    def push(self, payload: dict) -> SentinelMessage:
        self._seq += 1
        msg = SentinelMessage(priority=self.priority, seq=self._seq, payload=payload)
        self.queue.append(msg)
        return msg

    def drain(self) -> list[SentinelMessage]:
        out = list(self.queue)
        self.queue.clear()
        return out

    def __len__(self) -> int:
        return len(self.queue)
