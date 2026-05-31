"""Emergent Universal Key adapter — uses emergentintegrations.LlmChat.

Used for testing/dev when the user has not yet plugged in their own keys.
Supported model namespace: openai / anthropic / gemini.
"""
from __future__ import annotations
import os
from emergentintegrations.llm.chat import LlmChat, UserMessage
from .base import ChatResult


# Curated inventory — emergent key only supports these providers.
_INVENTORY = [
    # OpenAI
    {"id": "openai:gpt-5",          "provider": "emergent", "label": "GPT-5 (via Emergent)",          "via": "openai"},
    {"id": "openai:gpt-5-mini",     "provider": "emergent", "label": "GPT-5 mini (via Emergent)",     "via": "openai"},
    {"id": "openai:gpt-5.1",        "provider": "emergent", "label": "GPT-5.1 (via Emergent)",        "via": "openai"},
    {"id": "openai:gpt-4o",         "provider": "emergent", "label": "GPT-4o (via Emergent)",         "via": "openai"},
    {"id": "openai:gpt-4o-mini",    "provider": "emergent", "label": "GPT-4o mini (via Emergent)",    "via": "openai"},
    {"id": "openai:o3-mini",        "provider": "emergent", "label": "o3-mini (via Emergent)",        "via": "openai"},
    # Anthropic
    {"id": "anthropic:claude-sonnet-4-5",         "provider": "emergent", "label": "Claude Sonnet 4.5 (via Emergent)", "via": "anthropic"},
    {"id": "anthropic:claude-haiku-4-5-20251001", "provider": "emergent", "label": "Claude Haiku 4.5 (via Emergent)",  "via": "anthropic"},
    {"id": "anthropic:claude-opus-4-5-20251101",  "provider": "emergent", "label": "Claude Opus 4.5 (via Emergent)",   "via": "anthropic"},
    # Gemini
    {"id": "gemini:gemini-3-flash-preview", "provider": "emergent", "label": "Gemini 3 Flash (via Emergent)", "via": "gemini"},
    {"id": "gemini:gemini-2.5-flash",       "provider": "emergent", "label": "Gemini 2.5 Flash (via Emergent)", "via": "gemini"},
    {"id": "gemini:gemini-2.5-pro",         "provider": "emergent", "label": "Gemini 2.5 Pro (via Emergent)",   "via": "gemini"},
]


class EmergentProvider:
    name = "emergent"

    async def list_models(self, api_key: str | None = None) -> list[dict]:
        return list(_INVENTORY)

    async def chat(
        self,
        api_key: str | None,
        model: str,
        messages: list[dict],
        system: str | None = None,
        max_tokens: int = 1024,
        temperature: float = 0.7,
    ) -> ChatResult:
        key = api_key or os.environ.get("EMERGENT_LLM_KEY", "")
        if not key:
            return ChatResult(content="", error="missing emergent key", model_id=model, provider="emergent")

        # model formatted as "provider:name"
        if ":" not in model:
            return ChatResult(content="", error=f"emergent model must be 'provider:name', got {model!r}",
                              model_id=model, provider="emergent")
        prov_name, real = model.split(":", 1)

        # Build a stable session_id from message content for short caches
        session_id = "a0p-" + str(abs(hash((real, len(messages)))))[:10]
        sys_buf = system or ""
        # any system messages embedded
        for m in messages:
            if m["role"] == "system":
                sys_buf = (sys_buf + "\n" + m["content"]).strip()

        chat = (
            LlmChat(
                api_key=key,
                session_id=session_id,
                system_message=sys_buf or "You are a helpful research assistant.",
            )
            .with_model(prov_name, real)
        )

        # send the last user message; emergentintegrations manages internal turns by session
        last_user = next(
            (m["content"] for m in reversed(messages) if m["role"] == "user"),
            "",
        )
        try:
            resp = await chat.send_message(UserMessage(text=last_user))
            content = str(resp) if resp is not None else ""
            return ChatResult(
                content=content,
                usage={"prompt": 0, "completion": 0, "total": 0, "via": prov_name},
                model_id=model,
                provider="emergent",
            )
        except Exception as e:
            return ChatResult(content="", error=f"emergent: {e}", model_id=model, provider="emergent")
