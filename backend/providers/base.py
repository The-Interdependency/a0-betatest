# === CAPABILITIES ===
# id: provider_base
#   summary: common Protocol + TypedDict contract for BYOK LLM provider adapters
#   exposes: ProviderAdapter, ChatResult
#   stability: stable
# === END CAPABILITIES ===

"""Common interface for BYOK LLM providers."""
from __future__ import annotations
from typing import Any, Protocol, TypedDict


class ChatResult(TypedDict, total=False):
    content: str
    usage: dict
    model_id: str
    provider: str
    raw: Any
    error: str


class ProviderAdapter(Protocol):
    name: str
    async def list_models(self, api_key: str) -> list[dict]: ...
    async def chat(
        self,
        api_key: str,
        model: str,
        messages: list[dict],
        system: str | None = None,
        max_tokens: int = 1024,
        temperature: float = 0.7,
    ) -> ChatResult: ...
