"""xAI Grok adapter — OpenAI-compatible at https://api.x.ai/v1."""
from __future__ import annotations
import httpx
from .base import ChatResult


class XAIProvider:
    name = "xai"
    base = "https://api.x.ai/v1"

    async def list_models(self, api_key: str) -> list[dict]:
        async with httpx.AsyncClient(timeout=30.0) as c:
            r = await c.get(
                f"{self.base}/models",
                headers={"Authorization": f"Bearer {api_key}"},
            )
            if r.status_code >= 400:
                return [
                    {"id": "grok-4-fast", "provider": "xai", "label": "Grok 4 Fast"},
                    {"id": "grok-beta",   "provider": "xai", "label": "Grok Beta"},
                ]
            data = r.json().get("data", [])
            return [{"id": m.get("id"), "provider": "xai", "label": m.get("id")}
                    for m in data if "grok" in (m.get("id", "").lower())]

    async def chat(
        self,
        api_key: str,
        model: str,
        messages: list[dict],
        system: str | None = None,
        max_tokens: int = 1024,
        temperature: float = 0.7,
    ) -> ChatResult:
        msgs = []
        if system:
            msgs.append({"role": "system", "content": system})
        msgs.extend(messages)
        payload = {
            "model": model,
            "messages": msgs,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }
        async with httpx.AsyncClient(timeout=120.0) as c:
            r = await c.post(
                f"{self.base}/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
            if r.status_code >= 400:
                return ChatResult(
                    content="", error=f"xai {r.status_code}: {r.text[:400]}",
                    model_id=model, provider="xai",
                )
            j = r.json()
            choice = (j.get("choices") or [{}])[0]
            content = (choice.get("message") or {}).get("content", "") or ""
            usage = j.get("usage") or {}
            return ChatResult(
                content=content,
                usage={
                    "prompt": usage.get("prompt_tokens", 0),
                    "completion": usage.get("completion_tokens", 0),
                    "total": usage.get("total_tokens", 0),
                },
                model_id=model,
                provider="xai",
            )
