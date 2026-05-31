"""OpenAI adapter — /v1/models + /v1/chat/completions via httpx."""
from __future__ import annotations
import httpx
from .base import ChatResult


class OpenAIProvider:
    name = "openai"
    base = "https://api.openai.com/v1"

    async def list_models(self, api_key: str) -> list[dict]:
        async with httpx.AsyncClient(timeout=30.0) as c:
            r = await c.get(
                f"{self.base}/models",
                headers={"Authorization": f"Bearer {api_key}"},
            )
            r.raise_for_status()
            data = r.json().get("data", [])
            # Filter to chat-capable / common families
            out = []
            for m in data:
                mid = m.get("id", "")
                if any(k in mid for k in ("gpt-", "o1", "o3", "o4")):
                    out.append({
                        "id": mid,
                        "provider": "openai",
                        "label": mid,
                        "context_window": None,
                        "modality": "text",
                        "created": m.get("created"),
                    })
            return out

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
                    content="", error=f"openai {r.status_code}: {r.text[:400]}",
                    model_id=model, provider="openai",
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
                provider="openai",
            )
