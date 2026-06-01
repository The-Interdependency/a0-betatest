# === MODULE_BUILD ===
# id: providers_pkg
#   module_name: providers
#   module_kind: adapter
#   summary: BYOK adapter registry — openai, anthropic, gemini, xai, emergent
#   owner: a0p maintainer
#   public_surface: REGISTRY, ProviderAdapter, ChatResult
#   internal_surface: none
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: external
#   user_data_boundary: read
#   admin_only: false
#   tests: hmmm
#   rollout: default_enabled
#   rollback: remove provider imports from server.py
# === END MODULE_BUILD ===
"""LLM provider adapters — BYOK pass-through via httpx.

Each adapter exposes:
    list_models(api_key) -> list[dict]
    chat(api_key, model, messages, **opts) -> {"content": str, "usage": dict, "raw": ...}
"""
from .base import ProviderAdapter, ChatResult
from .openai_provider import OpenAIProvider
from .anthropic_provider import AnthropicProvider
from .gemini_provider import GeminiProvider
from .xai_provider import XAIProvider
from .emergent_provider import EmergentProvider

REGISTRY: dict[str, ProviderAdapter] = {
    "openai":    OpenAIProvider(),
    "anthropic": AnthropicProvider(),
    "gemini":    GeminiProvider(),
    "xai":       XAIProvider(),
    "emergent":  EmergentProvider(),
}

__all__ = ["REGISTRY", "ProviderAdapter", "ChatResult"]
