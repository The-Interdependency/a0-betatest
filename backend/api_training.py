# === MODULE_BUILD ===
# id: api_training_routes
#   module_name: training
#   module_kind: route
#   summary: authenticated training-inspection endpoints for A0 phase embedding, local interaction heuristics, and A0 experimental disk stacks
#   owner: Erin Spencer
#   public_surface: router
#   internal_surface: ReadoutBody, DiskStackBody
#   auth_boundary: bearer
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: backend.tests.test_reset_boundaries
#   rollout: default_enabled
#   rollback: revert and unmount
#   since: 2026-07-21
#   unresolved: maintained EDCM and current UCNS producers are not attached
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: api_training_routes_boundaries
#   summary: pure authenticated A0-local readouts; no EDCM validity or UCNS geometry claim
#   auth_boundary: bearer
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: api_training_routes
#   summary: exposes inspectable A0-local training readouts
#   exposes: router
#   boundaries: auth:bearer, storage:none, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: api_training_local_authority
#   given: an authenticated training readout request
#   then: the response labels phase, heuristic, and disk authorities explicitly and reports ucns_state=NA
#   class: provenance
# === END CONTRACTS ===
"""Training inspection endpoints.

These endpoints expose A0-local phase and text heuristics. They do not present
the results as UCNS-native or maintained EDCM measurement.
"""
from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict, Field, field_validator

from auth import get_current_user
from interdependent_lib.gonal_stack import GEOMETRY_STATUS, build_disk_stack, single_disk
from interdependent_lib.interaction_heuristics import interaction_readout
from interdependent_lib.phase_embedding import embed_text

router = APIRouter(prefix="/api/training", tags=["training"])
_MAX_TURNS = 200
_MAX_CHARS = 20_000
_MAX_SESSION_CHARS = 200_000


class ReadoutBody(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=False)
    text: str = Field(..., min_length=1, max_length=_MAX_CHARS)
    prev_text: Optional[str] = Field(None, max_length=_MAX_CHARS)
    grain: str = Field("turn", max_length=32)


class DiskStackBody(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=False)
    turns: list[str] = Field(..., min_length=1, max_length=_MAX_TURNS)
    agent_id: str = Field("local", min_length=1, max_length=64)

    @field_validator("turns")
    @classmethod
    def _bound_turn_text(cls, turns: list[str]) -> list[str]:
        total = 0
        for text in turns:
            if len(text) > _MAX_CHARS:
                raise ValueError(f"each turn must be <= {_MAX_CHARS} chars")
            total += len(text)
        if total > _MAX_SESSION_CHARS:
            raise ValueError(
                f"aggregate session text must be <= {_MAX_SESSION_CHARS} chars"
            )
        return turns


@router.post("/readout")
async def training_readout(body: ReadoutBody, user=Depends(get_current_user)):
    embedding = embed_text(body.text)
    heuristics = interaction_readout(
        body.text, body.prev_text, grain=body.grain
    )
    disk = single_disk(body.text, grain=body.grain)
    return {
        "grain": body.grain,
        "phase_embedding": embedding.as_dict(),
        "coherence": round(embedding.coherence(), 6),
        "interaction_heuristics": heuristics.as_dict(),
        "disk": disk.as_dict(),
        "geometry_status": GEOMETRY_STATUS,
        "ucns_state": "NA",
        "edcm_measurement_attached": False,
        "theorem_status_transfer": False,
    }


@router.post("/disk-stack")
async def training_disk_stack(body: DiskStackBody, user=Depends(get_current_user)):
    stack = build_disk_stack(body.turns, agent_id=body.agent_id)
    return stack.as_dict()


__all__ = ["router"]
