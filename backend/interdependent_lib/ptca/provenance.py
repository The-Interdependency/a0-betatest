# === CAPABILITIES ===
# id: ptca_provenance
#   summary: deterministic SHA-256 provenance hashing for tensor ops + lineage chains
#   exposes: hash_state
#   stability: stable
# === END CAPABILITIES ===

"""Provenance hashing — deterministic SHA-256 over tensor state + op metadata."""
import hashlib
import json


def hash_state(state, op: str = "", parents: list[str] | None = None) -> str:
    """Return a hex digest binding the state (any json-serializable) to an op + parents."""
    payload = {
        "op": op,
        "parents": parents or [],
        "state": state,
    }
    blob = json.dumps(payload, sort_keys=True, default=str).encode("utf-8")
    return hashlib.sha256(blob).hexdigest()
