# 245:52
import logging
import contextvars
import json
import os
logger = logging.getLogger(__name__)

from pathlib import Path
from typing import Optional

# Provider catalog and per-provider optimizer presets live as JSON data, not
# code literals (doctrine: no executable-data string literals — model slugs,
# provider IDs, and capability flags must be edit-without-deploy values).
# Source of truth: python/config/providers.json. Loaded once on import.
_PROVIDERS_JSON_PATH = Path(__file__).parent.parent / "config" / "providers.json"
with open(_PROVIDERS_JSON_PATH, "r", encoding="utf-8") as _fh:
    _PROVIDERS_DOC = json.load(_fh)

BUILTIN_PROVIDERS: dict = _PROVIDERS_DOC["providers"]
_PROVIDER_PRESETS: dict[str, dict] = _PROVIDERS_DOC["presets"]
_PROVIDER_PRICING_URLS: dict[str, str] = {
    pid: spec.get("pricing_url", "")
    for pid, spec in BUILTIN_PROVIDERS.items()
    if spec.get("pricing_url")
}

# Per-model pricing manifest — source of truth for input/output/cached rates
# per individual model id. Used on boot and on POST /api/energy/refresh-pricing/{provider_id}.
_PRICING_JSON_PATH = Path(__file__).parent.parent / "config" / "pricing.json"


def _load_pricing_doc() -> dict:
    with open(_PRICING_JSON_PATH, "r", encoding="utf-8") as fh:
        return json.load(fh)


_PRICING_DOC: dict = _load_pricing_doc()


def get_pricing_models(provider_id: str) -> list[dict]:
    """Return the per-model pricing list for a provider, or [] if unknown.
    Each entry: {id, context_window, input_per_1m, output_per_1m,
    cached_input_per_1m?, cache_write_per_1m?, supports_vision?, ...}.
    """
    return list(
        _PRICING_DOC.get("providers", {}).get(provider_id, {}).get("models", [])
    )


def get_model_pricing(provider_id: str, model_id: str) -> dict | None:
    """Look up the pricing entry for a specific model. Returns None if either
    the provider or the model is not in pricing.json."""
    for entry in get_pricing_models(provider_id):
        if entry.get("id") == model_id:
            return entry
    return None


def reload_pricing_doc() -> dict:
    """Re-read pricing.json from disk. Returns the full doc."""
    global _PRICING_DOC
    _PRICING_DOC = _load_pricing_doc()
    return _PRICING_DOC


# Mutable runtime caches populated by auto-discovery and per-seed route_config.
_PROVIDER_DEFAULT_ASSIGNMENTS: dict[str, dict] = {}
_PROVIDER_AVAILABLE_MODELS: dict[str, list] = {}
_PROVIDER_CAPABILITIES: dict[str, dict] = {}
_PROVIDER_ENABLED_TOOLS: dict[str, list] = {}


def default_provider() -> str | None:
    """Return the first provider in BUILTIN_PROVIDERS whose API key env var is set.

    Environment-driven only — no DB, no admin setting. Callers that need a
    specific provider should pass it explicitly; this is the fallback of last
    resort when no model is pinned at the call site.
    """
    for pid, info in BUILTIN_PROVIDERS.items():
        env_key = info.get("env_key", "")
        if env_key and os.environ.get(env_key):
            return pid
    return None


def estimate_cost(
    provider_id: str,
    prompt_tokens: int,
    completion_tokens: int,
    cache_read_tokens: int = 0,
    cache_write_tokens: int = 0,
    model: str | None = None,
) -> float:
    """Cost in USD. Cache-aware: read tokens at cached rate, write tokens at
    cache_write rate, fresh input at full rate. prompt_tokens should be the
    uncached fresh input count.

    When `model` is supplied and found in pricing.json, uses per-1M model
    rates. Falls back to the provider flagship's per-1K rates from
    providers.json."""
    per_model = get_model_pricing(provider_id, model) if model else None
    if per_model:
        in_rate_1m = float(per_model.get("input_per_1m", 0.0))
        out_rate_1m = float(per_model.get("output_per_1m", 0.0))
        cache_read_rate_1m = float(
            per_model.get("cached_input_per_1m", in_rate_1m)
        )
        cache_write_rate_1m = float(
            per_model.get("cache_write_per_1m", in_rate_1m)
        )
        return (
            (prompt_tokens / 1_000_000) * in_rate_1m
            + (cache_read_tokens / 1_000_000) * cache_read_rate_1m
            + (cache_write_tokens / 1_000_000) * cache_write_rate_1m
            + (completion_tokens / 1_000_000) * out_rate_1m
        )
    # Flagship fallback (legacy per-1K shape from providers.json).
    info = BUILTIN_PROVIDERS.get(provider_id)
    if not info:
        return 0.0
    in_rate = info["cost_per_1k_input"]
    out_rate = info["cost_per_1k_output"]
    cache_read_rate = info.get("cache_read_per_1k_input", in_rate)
    cache_write_rate = info.get("cache_write_per_1k_input", in_rate)
    return (
        (prompt_tokens / 1000) * in_rate
        + (cache_read_tokens / 1000) * cache_read_rate
        + (cache_write_tokens / 1000) * cache_write_rate
        + (completion_tokens / 1000) * out_rate
    )


def cache_breakdown(usage: dict) -> dict:
    """Normalize cache fields across providers into a single shape.
    Returns: {fresh_input, cache_read, cache_write, output, hit_ratio}.

    Anthropic: input_tokens (fresh), cache_read_input_tokens, cache_creation_input_tokens
    OpenAI Responses: input_tokens + input_tokens_details.cached_tokens
    OpenAI Chat: prompt_tokens + prompt_tokens_details.cached_tokens
    """
    cache_read = int(usage.get("cache_read_input_tokens") or 0)
    cache_write = int(usage.get("cache_creation_input_tokens") or 0)
    if not cache_read:
        details = (
            usage.get("input_tokens_details")
            or usage.get("prompt_tokens_details")
            or {}
        )
        cache_read = int(details.get("cached_tokens") or 0)
    fresh_input = int(usage.get("input_tokens") or usage.get("prompt_tokens") or 0)
    # Anthropic reports input_tokens as fresh-only; OpenAI reports total (fresh+cached).
    # Normalize to fresh-only by subtracting cached when total >= cached.
    if fresh_input >= cache_read and "cache_read_input_tokens" not in usage:
        fresh_input = fresh_input - cache_read
    output = int(usage.get("output_tokens") or usage.get("completion_tokens") or 0)
    total_input = fresh_input + cache_read + cache_write
    hit_ratio = (cache_read / total_input) if total_input > 0 else 0.0
    return {
        "fresh_input": fresh_input,
        "cache_read": cache_read,
        "cache_write": cache_write,
        "output": output,
        "hit_ratio": round(hit_ratio, 3),
    }


# --- aimmh-lib bridge -------------------------------------------------------
#
# aimmh-lib's MultiModelHub accepts a single CallFn and orchestrates fan_out /
# council / daisy_chain / room_all / room_synthesized over it. Our CallFn
# delegates to call_provider so all providers, doctrine prefix, retry,
# attachments, and approval gating keep working unchanged.
import time as _time


# Per-call usage capture for the multi-model path.
# aimmh-lib's CallFn contract is `(model_id, messages) -> str`, so the
# underlying provider's usage dict is discarded by the time the hub returns.
# _aimmh_call_fn writes each call's usage into a ContextVar-backed dict
# keyed by `(model_id, call_idx)` where call_idx is a per-model counter.
_per_call_usage_cv: contextvars.ContextVar[Optional[dict]] = contextvars.ContextVar(
    "a0p_aimmh_per_call_usage", default=None,
)


def reset_per_call_usage() -> dict:
    """Initialize per-call usage capture for the current async context."""
    state: dict = {"by_key": {}, "counters": {}}
    _per_call_usage_cv.set(state)
    return state


def get_per_call_usage() -> dict:
    return _per_call_usage_cv.get() or {"by_key": {}, "counters": {}}


async def _aimmh_call_fn(model_id, messages, system_context=None, max_history=30):
    """Bridge aimmh-lib's CallFn signature into call_provider."""
    from .inference import call_provider as _cep
    from . import orch_progress as _op
    state = _per_call_usage_cv.get()
    call_idx = None
    if state is not None:
        call_idx = state["counters"].get(model_id, 0)
        state["counters"][model_id] = call_idx + 1
    started_at = _time.perf_counter()
    _op.publish("call_start", {
        "model": model_id,
        "call_idx": call_idx if call_idx is not None else 0,
    })
    _ckey = (model_id, call_idx if call_idx is not None else 0)

    def _on_progress(cum_chars: int, cum_tokens_est: int) -> None:
        _op.publish("call_progress", {
            "model": _ckey[0],
            "call_idx": _ckey[1],
            "output_chars": cum_chars,
            "output_tokens_est": cum_tokens_est,
        })

    try:
        content, usage = await _cep(
            provider_id=model_id,
            messages=list(messages or []),
            system_prompt=system_context,
            use_tools=False,
            progress_callback=_on_progress,
        )
        out = content or ""
        elapsed_ms = int((_time.perf_counter() - started_at) * 1000)
        if state is not None:
            state["by_key"][(model_id, call_idx)] = {
                "model_id": model_id,
                "call_idx": call_idx,
                "content": out,
                "usage": dict(usage) if usage else None,
            }
        ev_payload: dict = {
            "model": model_id,
            "call_idx": call_idx if call_idx is not None else 0,
            "elapsed_ms": elapsed_ms,
            "content_len": len(out),
        }
        if usage:
            try:
                cb = cache_breakdown(usage)
                cost = estimate_cost(
                    model_id,
                    cb.get("fresh_input", 0),
                    cb.get("output", 0),
                    cb.get("cache_read", 0),
                    cb.get("cache_write", 0),
                )
                ev_payload["usage"] = {
                    "input_tokens": cb.get("fresh_input", 0),
                    "output_tokens": cb.get("output", 0),
                    "cache_read_input_tokens": cb.get("cache_read", 0),
                    "cache_creation_input_tokens": cb.get("cache_write", 0),
                    "total_tokens": (
                        cb.get("fresh_input", 0)
                        + cb.get("cache_read", 0)
                        + cb.get("cache_write", 0)
                        + cb.get("output", 0)
                    ),
                }
                ev_payload["cost_usd"] = round(float(cost), 6)
            except Exception:
                ev_payload["usage"] = None
                ev_payload["cost_usd"] = None
        else:
            ev_payload["usage"] = None
            ev_payload["cost_usd"] = None
        _op.publish("call_complete", ev_payload)
        return out
    except Exception as exc:
        out = f"[ERROR] {exc}"[:500]
        elapsed_ms = int((_time.perf_counter() - started_at) * 1000)
        if state is not None:
            state["by_key"][(model_id, call_idx)] = {
                "model_id": model_id,
                "call_idx": call_idx,
                "content": out,
                "usage": None,
            }
        _op.publish("call_error", {
            "model": model_id,
            "call_idx": call_idx if call_idx is not None else 0,
            "elapsed_ms": elapsed_ms,
            "error": str(exc)[:200],
        })
        return out


_HUB_CACHE: dict = {"hub": None}


def build_hub():
    """Return a MultiModelHub bound to our provider call function."""
    from aimmh_lib import MultiModelHub
    return MultiModelHub(_aimmh_call_fn)


def get_multi_model_hub():
    """Cached singleton MultiModelHub. Built on first access."""
    if _HUB_CACHE["hub"] is not None:
        return _HUB_CACHE["hub"]
    try:
        from aimmh_lib import MultiModelHub  # noqa: F401
    except ImportError as exc:
        raise RuntimeError(
            "aimmh_lib is not installed. Run: uv add aimmh-lib. "
            f"underlying ImportError: {exc!s}"
        ) from exc
    _HUB_CACHE["hub"] = build_hub()
    return _HUB_CACHE["hub"]


def build_model_instances() -> dict:
    """Construct one aimmh ModelInstance per BUILTIN_PROVIDERS entry with an active key."""
    from aimmh_lib import ModelInstance
    out: dict = {}
    for pid, info in BUILTIN_PROVIDERS.items():
        env_key = info.get("env_key", "")
        if env_key and not os.environ.get(env_key):
            continue
        out[pid] = ModelInstance(_aimmh_call_fn, pid)
    return out


def resolve_providers(providers: list[str] | None) -> list[str]:
    """Resolve ['active'] / [] / None into a concrete list of provider ids."""
    if not providers or providers == ["active"]:
        active = default_provider()
        return [active] if active else []
    out: list[str] = []
    for p in providers:
        if p == "active":
            a = default_provider()
            if a and a not in out:
                out.append(a)
        elif p in BUILTIN_PROVIDERS and p not in out:
            out.append(p)
    return out
# 245:52
