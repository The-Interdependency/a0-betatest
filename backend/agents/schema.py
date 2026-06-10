# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 53:71
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 6:5
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 29:6
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: agents_schema
#   module_name: schema
#   module_kind: schema
#   summary: Pydantic models — AgentInstance, CharacterSheet, AgentMode (the 5-lattice modes), PXResolution; covers the full character sheet editable surface
#   owner: Erin Spencer
#   public_surface: AgentInstance, CharacterSheet, AgentMode, PXResolution, ALL_MODES, new_agent_id
#   internal_surface: _utc_now_iso
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.agent_character_sheet_shape_holds
#   rollout: default_enabled
#   rollback: revert file
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: agents_schema_boundaries
#   summary: Pydantic models — AgentInstance, CharacterSheet, AgentMode (the 5-lattice modes), PXResolution; covers the full character sheet editable surface
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: agents_schema
#   summary: Pydantic models — AgentInstance, CharacterSheet, AgentMode (the 5-lattice modes), PXResolution; covers the full character sheet editable surface
#   exposes: AgentInstance, CharacterSheet, AgentMode, PXResolution, ALL_MODES, new_agent_id
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: agent_character_sheet_shape
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.agent_character_sheet_shape_holds
# === END CONTRACTS ===
"""Agent + character sheet schemas."""
from __future__ import annotations
import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_agent_id() -> str:
    return str(uuid.uuid4())


class AgentMode(str, Enum):
    """The 5-mode lattice for a0:

    a0(zfae)              native only (zfae alone)
    a0(zfae)<model>       teacher_assisted (model assists zfae)
    a0(<model>)zfae       teacher_observes (model teaches; zfae watches/learns)
    a0(<model>)<model>    two external models, one as agent identity + one as critic
    <model>               bare external model, no a0 wrapping
    """
    ZFAE_NATIVE = "a0(zfae)"
    ZFAE_ASSISTED = "a0(zfae)<model>"
    MODEL_OBSERVED_BY_ZFAE = "a0(<model>)zfae"
    MODEL_PLUS_CRITIC = "a0(<model>)<model>"
    BARE_MODEL = "<model>"


ALL_MODES: tuple[AgentMode, ...] = tuple(AgentMode)


class PXResolution(BaseModel):
    """Per-agent resolution of P/X aggregate slots.

    P/X slots on the carrier are aggregate; each agent's character sheet
    fixes which specific operator/punctuation lives at each slot.
    Resolved at create + refined by training (per ratification).
    """
    model_config = ConfigDict(protected_namespaces=())

    p_slots: dict[int, str] = Field(default_factory=dict)   # position → punctuation char
    x_slots: dict[int, str] = Field(default_factory=dict)   # position → operator char
    resolution_mode: str = "create_plus_training"           # "create_only" | "create_plus_training" | "per_turn"


class CharacterSheet(BaseModel):
    """The editable context. ALL aspects are editable per user spec.

    Three context surfaces distinguished:
      • prompt_of_the_moment  — user input (NOT in the sheet; comes per turn)
      • zfae_internal_context — rings + memory state (NOT in the sheet; engine-owned)
      • teacher_curated_context — what gets sent to a teacher (built from this sheet)
    """
    model_config = ConfigDict(protected_namespaces=())

    name: str
    mode: AgentMode = AgentMode.ZFAE_NATIVE
    base_model: Optional[str] = None      # required when mode mentions <model>
    outer_model: Optional[str] = None     # required for a0((zfae)<model>)<model> + a0(<model>)<model>

    system_prompt: str = ""
    persona: str = ""

    # Per-agent ring overrides (canonical defaults if absent)
    ring_n_override: dict[str, int] = Field(default_factory=dict)
    heptagram_overrides: dict[str, tuple[int, str]] = Field(default_factory=dict)

    # Memory seeds (editable; pre-seed knowledge into MemL/MemS at agent creation)
    memory_seed: dict[str, list[str]] = Field(default_factory=lambda: {"long_term": [], "short_term": []})

    # EDCM tunables
    edcm: dict[str, Any] = Field(default_factory=dict)

    # P/X slot resolution (per-agent; shared L/N skeleton lives in Θ)
    px_resolution: PXResolution = Field(default_factory=PXResolution)

    # Teacher context template (free-form jinja-style placeholders allowed)
    teacher_context_template: Optional[str] = None

    # Provider/tool allow-list — which providers this agent may call as teacher
    tools_allowed: list[str] = Field(default_factory=list)

    # Boundary declarations
    boundaries: dict[str, str] = Field(default_factory=lambda: {
        "auth": "none", "storage": "write", "network": "external",
        "user_data": "write", "admin_only": "false",
    })

    # Native readiness thresholds (override defaults per-agent)
    min_steps_for_native: int = 16
    max_loss_for_native: float = 0.1

    # 13-sentinel mode + weight overrides (partial; missing = canonical defaults)
    sentinel_modes: dict[str, str] = Field(default_factory=dict)
    sentinel_weights: dict[str, float] = Field(default_factory=dict)

    # Three-gonal binding per core (locked: phi=default, psi=mirror, omega=private)
    # Encoded explicitly here for visibility; agents are not free to remap.
    gonal_assignment: dict[str, str] = Field(
        default_factory=lambda: {"phi": "default", "psi": "mirror", "omega": "private"}
    )

    # If gonal_assignment includes 'private', this path provides the spec
    private_gonal_spec_path: Optional[str] = None

    tags: list[str] = Field(default_factory=list)


class AgentInstance(BaseModel):
    """Full persistent agent entity."""
    model_config = ConfigDict(protected_namespaces=())

    id: str = Field(default_factory=new_agent_id)
    user_id: str = "local"
    sheet: CharacterSheet

    # Lifecycle metadata
    created_at: str = Field(default_factory=_utc_now_iso)
    updated_at: str = Field(default_factory=_utc_now_iso)
    archived: bool = False

    # Cached metrics from ZFAE weight bank (refreshed on read; canonical lives in safetensors)
    zfae_metrics: dict[str, Any] = Field(default_factory=dict)
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 53:71
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 6:5
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 29:6
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
