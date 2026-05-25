# 53:10 0:0 0:0
# DOC module: tests.test_a0_package
# DOC label: a0 package import + CLI smoke
# DOC description: Imports every module under the a0/ package to catch
# import-time breaks (e.g. an unguarded optional dependency), verifies the
# subagent registry is populated without the optional claude_agent_sdk, and
# runs the a0.a0 CLI end-to-end through stdin/stdout.
import importlib
import json
import pkgutil
import subprocess
import sys

import pytest

import a0


A0_MODULES = sorted(
    m.name for m in pkgutil.walk_packages(a0.__path__, prefix="a0.")
)


def test_module_discovery_nonempty():
    # Guards against the walk silently finding nothing (which would make the
    # parametrized import test below vacuously pass).
    assert len(A0_MODULES) > 20, f"only discovered {len(A0_MODULES)} a0 modules"


@pytest.mark.parametrize("modname", A0_MODULES)
def test_a0_submodule_imports_clean(modname):
    importlib.import_module(modname)


def test_subagent_registry_populated_without_sdk():
    # claude_agent_sdk is an optional dependency; the definitions must still
    # load and carry their data when it is absent.
    from a0.adapters import ALL_SUBAGENTS, MODE_SUBAGENTS

    assert set(ALL_SUBAGENTS) == {"phi", "psi", "omega", "jury", "bandit"}
    for mode in ("analyze", "route", "act"):
        assert mode in MODE_SUBAGENTS
        assert len(MODE_SUBAGENTS[mode]) > 0
    bandit = ALL_SUBAGENTS["bandit"]
    assert bandit.tools and bandit.model


def test_handle_round_trips_in_process():
    from a0.contract import A0Request, normalize_hmmm
    from a0.router import handle

    req = A0Request(
        task_id="unit-1",
        input={"text": "hello", "files": [], "metadata": {}},
        tools_allowed=["none"],
        mode="analyze",
        hmmm=normalize_hmmm(["hmm"]),
    )
    resp = handle(req)
    assert resp.task_id == "unit-1"
    assert resp.result is not None


def test_a0_cli_smoke():
    payload = {
        "task_id": "smoke1",
        "input": {"text": "hello a0", "files": [], "metadata": {}},
        "tools_allowed": ["none"],
        "mode": "analyze",
        "hmmm": ["hmm"],
    }
    proc = subprocess.run(
        [sys.executable, "-m", "a0.a0"],
        input=json.dumps(payload).encode("utf-8"),
        stdout=subprocess.PIPE,
        check=True,
    )
    out = json.loads(proc.stdout.decode("utf-8"))
    assert out["task_id"] == "smoke1"
    assert "result" in out
# 53:10 0:0 0:0
