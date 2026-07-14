import { defineMsdmdCollection } from "./.agents/skills/msdmd/collection";

export default defineMsdmdCollection({
  "declarations": [
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.module_doctrine.test_route_doc_blocks_are_complete",
        "class": "correctness",
        "given": "every python/routes/*.py file (excluding __init__.py)",
        "then": "it declares # DOC module/label/description/tier/role exactly"
      },
      "file": "_legacy_a0/python/routes/__init__.py",
      "id": "routes_doc_blocks_complete"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.module_doctrine.test_route_files_are_annotated",
        "class": "correctness",
        "given": "every python/routes/*.py file (excluding __init__.py)",
        "then": "its first and last non-blank lines are # N:M annotation comments"
      },
      "file": "_legacy_a0/python/routes/__init__.py",
      "id": "routes_files_annotated"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.module_doctrine.test_router_defining_files_are_registered",
        "class": "correctness",
        "given": "every python/routes/*.py file that defines a module-level router",
        "then": "it is imported and added to ALL_ROUTERS in __init__.py"
      },
      "file": "_legacy_a0/python/routes/__init__.py",
      "id": "routes_routers_registered"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.route_gating.test_every_write_route_is_gated",
        "class": "security",
        "given": "every @router.{post,patch,delete,put} handler in",
        "then": "the handler body must reference at least one gating sentinel"
      },
      "file": "_legacy_a0/python/routes/__init__.py",
      "id": "routes_write_endpoints_gated"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.billing.test_webhook_replay_is_idempotent",
        "class": "idempotency",
        "given": "same Stripe event id POSTed twice to the webhook (via the",
        "then": "first call returns {received: True}; replay returns"
      },
      "file": "_legacy_a0/python/routes/billing.py",
      "id": "billing_webhook_replay_idempotent"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.chat.test_delete_other_owner_404",
        "class": "security",
        "given": "DELETE /api/v1/conversations/{id} with x-user-id != row.user_id",
        "then": "404; the row remains intact for the real owner"
      },
      "file": "_legacy_a0/python/routes/chat.py",
      "id": "chat_delete_other_owner_404"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.chat.test_get_other_owner_404",
        "class": "security",
        "given": "GET /api/v1/conversations/{id} with x-user-id != row.user_id",
        "then": "404 (existence non-disclosure, never 403 or 200)"
      },
      "file": "_legacy_a0/python/routes/chat.py",
      "id": "chat_get_other_owner_404"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.chat.test_unknown_body_model_400",
        "class": "correctness",
        "given": "POST /api/v1/conversations/{id}/messages with body.model that",
        "then": "400 with a detail naming the unknown id (no silent fallback to"
      },
      "file": "_legacy_a0/python/routes/chat.py",
      "id": "chat_unknown_body_model_400"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_count_live_for_parent_filters",
        "class": "correctness",
        "given": "two registry entries under different parent_run_ids",
        "then": "count_live_for_parent returns 1 for each parent and 0 for an"
      },
      "file": "_legacy_a0/python/services/agent_lifecycle.py",
      "id": "agent_lifecycle_count_live_for_parent_filters"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_registry_is_singleton",
        "class": "correctness",
        "given": "a fresh process boot",
        "then": "routes.agents._sub_agents is the SAME object as"
      },
      "file": "_legacy_a0/python/services/agent_lifecycle.py",
      "id": "agent_lifecycle_registry_is_singleton"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.transcripts_explainer.test_no_credits_returns_none",
        "class": "pricing",
        "given": "a user with free_remaining=0, paid_remaining=0",
        "then": "consume_explanation_credit returns None (route layer converts"
      },
      "file": "_legacy_a0/python/services/edcmbone_explainer.py",
      "id": "explainer_402_when_no_credits"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.transcripts_explainer.test_explainer_call_surfaces_in_learning_summary",
        "class": "correctness",
        "given": "an explainer_call event is emitted by the explainer service",
        "then": "it persists with event='explainer_call' (not silently rewritten"
      },
      "file": "_legacy_a0/python/services/edcmbone_explainer.py",
      "id": "explainer_call_surfaces_in_learning_summary"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.transcripts_explainer.test_decrements_free_then_paid",
        "class": "pricing",
        "given": "a user with free_remaining=1, paid_remaining=3",
        "then": "consume_explanation_credit returns 'free' and free_remaining"
      },
      "file": "_legacy_a0/python/services/edcmbone_explainer.py",
      "id": "explainer_decrements_free_first"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.transcripts_explainer.test_idempotent_no_double_charge",
        "class": "idempotency",
        "given": "an explanation already exists for (report_id, user_id)",
        "then": "a second explain_report() call returns the cached row, does NOT"
      },
      "file": "_legacy_a0/python/services/edcmbone_explainer.py",
      "id": "explainer_explanation_is_idempotent"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.transcripts_explainer.test_refund_after_failure",
        "class": "failure_recovery",
        "given": "a credit was consumed (bucket='paid'), then the model failed",
        "then": "refund_explanation_credit('paid') restores paid_remaining to"
      },
      "file": "_legacy_a0/python/services/edcmbone_explainer.py",
      "id": "explainer_refund_restores_balance"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.transcripts_explainer.test_rejects_fabricated_citations",
        "class": "correctness",
        "given": "model output contains citations whose quoted spans do not",
        "then": "_parse_explainer_output drops the fabricated quotes and, if"
      },
      "file": "_legacy_a0/python/services/edcmbone_explainer.py",
      "id": "explainer_rejects_fabricated_citations"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.gating.test_allowlist_entries_correspond_to_real_routes",
        "class": "security",
        "given": "every entry in OWNER_OR_PUBLIC_WRITES",
        "then": "the (file, method, path) corresponds to a real"
      },
      "file": "_legacy_a0/python/services/gating.py",
      "id": "gating_allowlist_entries_are_real_routes"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.gating.test_every_write_route_is_gated_or_allowlisted",
        "class": "security",
        "given": "every @router.{post,patch,put,delete} in python/routes/",
        "then": "the handler body within ~80 lines either calls a recognized"
      },
      "file": "_legacy_a0/python/services/gating.py",
      "id": "gating_every_write_route_is_admin_or_allowlisted"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.gating.test_instrument_mutation_files_have_all_writes_gated",
        "class": "security",
        "given": "every @router.{post,patch,put,delete} inside a",
        "then": "the handler body visibly calls require_admin (or another"
      },
      "file": "_legacy_a0/python/services/gating.py",
      "id": "gating_instrument_files_all_writes_gated"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.gating.test_instrument_mutation_files_are_never_allowlisted",
        "class": "security",
        "given": "FORBIDDEN_ALLOWLIST_FILES (agents.py, bandits.py, edcm.py,",
        "then": "no entry in OWNER_OR_PUBLIC_WRITES references any of these files"
      },
      "file": "_legacy_a0/python/services/gating.py",
      "id": "gating_instrument_files_never_allowlisted"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_claim_atomic",
        "class": "idempotency",
        "given": "a single 'running' agent_runs row exists",
        "then": "two concurrent _claim_one_pending() calls succeed once and"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_claim_atomic"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_concurrent_live_cap",
        "class": "security",
        "given": "20 live registry entries under a single parent_run_id",
        "then": "check_can_spawn raises SpawnCapExceeded with cap='concurrent_live'"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_concurrent_live_cap"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_heartbeat_advances",
        "class": "correctness",
        "given": "an 'executing' agent_runs row and the _heartbeat_loop running",
        "then": "last_heartbeat_at strictly advances after a few interval ticks"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_heartbeat_advances"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_marks_failed_on_exception",
        "class": "correctness",
        "given": "a claimed row whose providers list resolves to an unknown id",
        "then": "_execute_one raises no exception, the row's final status is"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_marks_failed_on_exception"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_merge_helpers_tolerate_no_pcna",
        "class": "correctness",
        "given": "a missing primary PCNA (cold-start or test bootstrap)",
        "then": "_try_get_primary_pcna returns None and _retire_fork_quietly"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_merge_helpers_tolerate_no_pcna"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_no_orphan_invariant",
        "class": "correctness",
        "given": "a registry entry whose run_id has no DB row, AND a DB",
        "then": "check_no_orphan_invariant flags both as orphans and reports ok=False"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_no_orphan_invariant"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_resolve_provider_rejects_empty",
        "class": "correctness",
        "given": "an empty list or malformed providers value",
        "then": "_resolve_provider raises ValueError (no silent default-to-active)"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_resolve_provider_rejects_empty"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_retry_default_none",
        "class": "correctness",
        "given": "retry_policy='none' OR a non-transient exception under",
        "then": "_maybe_schedule_retry returns False"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_retry_default_none"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_retry_once_on_transient",
        "class": "correctness",
        "given": "a row with retry_policy='once_on_transient', retry_count=0,",
        "then": "_maybe_schedule_retry returns True, row goes back to 'running'"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_retry_once_on_transient"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_skips_non_running",
        "class": "correctness",
        "given": "an agent_runs row with status='completed' (or 'failed', 'merged')",
        "then": "_claim_one_pending() does not return it"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_skips_non_running"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_snapshot_pcna_shape",
        "class": "correctness",
        "given": "a primary-shaped PCNAEngine instance",
        "then": "_snapshot_pcna returns the four delta-tracked floats/ints"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_snapshot_pcna_shape"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.spawn_executor.test_stale_sweep_marks_worker_lost",
        "class": "correctness",
        "given": "an 'executing' row with last_heartbeat_at older than 2\u00d7 the",
        "then": "_reap_stale_claims marks ONLY the stale row; fresh row untouched"
      },
      "file": "_legacy_a0/python/services/spawn_executor.py",
      "id": "spawn_executor_stale_sweep_marks_worker_lost"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.chat.test_create_anonymous_owner_null",
        "class": "security",
        "given": "POST /api/v1/conversations with no x-user-id header",
        "then": "row lands with user_id=NULL (owner_user_id kwarg defaults to"
      },
      "file": "_legacy_a0/python/storage/core.py",
      "id": "storage_anonymous_owner_null"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "python.tests.contracts.chat.test_create_owner_isolation",
        "class": "security",
        "given": "create_conversation called via POST /api/v1/conversations with",
        "then": "stored row.user_id == \"legit\"; smuggled value is dropped by"
      },
      "file": "_legacy_a0/python/storage/core.py",
      "id": "storage_create_owner_isolation"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "this project's three msdmd skill executors \u2014 msdmd / test-build / meta-module-build",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/__init__.py",
      "id": "a0p_skills_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "msdmd_runner, test_build_runner, module_build_runner, registry",
        "owner": "a0p maintainer",
        "summary": "this project's three msdmd skill executors \u2014 msdmd / test-build / meta-module-build"
      },
      "file": "backend/a0p_skills/__init__.py",
      "id": "a0p_skills_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/a0p_skills/__init__.py",
      "id": "a0p_skills_pkg_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "skill",
        "module_name": "a0p_skills",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "msdmd_runner, test_build_runner, module_build_runner, registry",
        "rollback": "remove package import from server.py and revert /api/skill routes",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "this project's three msdmd skill executors \u2014 msdmd / test-build / meta-module-build",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/__init__.py",
      "id": "a0p_skills_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "risk-boundary-build skill executor \u2014 validates BOUNDARIES blocks against canon schema; reports gaps + hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/boundaries_runner.py",
      "id": "boundaries_runner_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "run, validate_entry, REQUIRED_FIELDS, summary",
        "owner": "a0p maintainer",
        "summary": "risk-boundary-build skill executor \u2014 validates BOUNDARIES blocks against canon schema; reports gaps + hmmm"
      },
      "file": "backend/a0p_skills/boundaries_runner.py",
      "id": "boundaries_runner"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/a0p_skills/boundaries_runner.py",
      "id": "boundaries_runner_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "skill",
        "module_name": "boundaries_runner",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "run, validate_entry, REQUIRED_FIELDS, summary",
        "rollback": "remove /api/skill/boundaries route and this module",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "risk-boundary-build skill executor \u2014 validates BOUNDARIES blocks against canon schema; reports gaps + hmmm",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/boundaries_runner.py",
      "id": "boundaries_runner"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "cap-build skill executor \u2014 parses CAPABILITIES blocks, builds capability map, flags duplicates/hmmm/gaps",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/capabilities_runner.py",
      "id": "capabilities_runner_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "run, validate_entry, REQUIRED_FIELDS, summary",
        "owner": "a0p maintainer",
        "summary": "cap-build skill executor \u2014 parses CAPABILITIES blocks, builds capability map, flags duplicates/hmmm/gaps"
      },
      "file": "backend/a0p_skills/capabilities_runner.py",
      "id": "capabilities_runner"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/a0p_skills/capabilities_runner.py",
      "id": "capabilities_runner_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "skill",
        "module_name": "capabilities_runner",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "run, validate_entry, REQUIRED_FIELDS, summary",
        "rollback": "remove /api/skill/capabilities route and this module",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "cap-build skill executor \u2014 parses CAPABILITIES blocks, builds capability map, flags duplicates/hmmm/gaps",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/capabilities_runner.py",
      "id": "capabilities_runner"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "executable test functions referenced by CONTRACTS `call:` paths across the repo",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/contracts.py",
      "id": "a0p_contracts_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "aimmh_invoke_propagates_error, skill_report_visibility_holds, pcea_round_trip_53",
        "owner": "a0p maintainer",
        "summary": "executable test functions referenced by CONTRACTS `call:` paths across the repo"
      },
      "file": "backend/a0p_skills/contracts.py",
      "id": "a0p_contracts"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/a0p_skills/contracts.py",
      "id": "a0p_contracts_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "experiment",
        "module_name": "contracts",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "aimmh_invoke_propagates_error, skill_report_visibility_holds, pcea_round_trip_53",
        "rollback": "remove file; CONTRACTS entries that referenced it will error in test-build",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "executable test functions referenced by CONTRACTS `call:` paths across the repo",
        "tests": "self",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/contracts.py",
      "id": "a0p_contracts"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "read-only walk of the frontend source tree; emits a report to stdout/json",
        "user_data_boundary": "read"
      },
      "file": "backend/a0p_skills/frontend_module_build_runner.py",
      "id": "a0p_skills_frontend_module_build_runner_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "main, scan_frontend",
        "owner": "Erin Spencer",
        "summary": "read-only walk of the frontend source tree; emits a report to stdout/json"
      },
      "file": "backend/a0p_skills/frontend_module_build_runner.py",
      "id": "a0p_skills_frontend_module_build_runner"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.frontend_module_build_runner_smoke_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/a0p_skills/frontend_module_build_runner.py",
      "id": "frontend_module_build_runner_smoke"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_validate_block",
        "module_kind": "skill",
        "module_name": "frontend_module_build_runner",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "main, scan_frontend",
        "rollback": "revert; frontend modules become unvalidated",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "walks /app/frontend/src/**/*.{js,jsx,ts,tsx} and validates each module has a MODULE_BUILD block; reports COVERED / MISSING / INVALID per file",
        "tests": "a0p_skills.contracts.frontend_module_build_runner_smoke_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/a0p_skills/frontend_module_build_runner.py",
      "id": "a0p_skills_frontend_module_build_runner"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "meta-module-build skill executor \u2014 validates MODULE_BUILD schema + gap report",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/module_build_runner.py",
      "id": "module_build_runner_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "run, validate_entry, REQUIRED_FIELDS, BOUNDARY_FIELDS, summary",
        "owner": "a0p maintainer",
        "summary": "meta-module-build skill executor \u2014 validates MODULE_BUILD schema + gap report"
      },
      "file": "backend/a0p_skills/module_build_runner.py",
      "id": "module_build_runner"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "hmmm",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/a0p_skills/module_build_runner.py",
      "id": "test_module_build_runner"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_allowed_module_kinds",
        "module_kind": "skill",
        "module_name": "module_build_runner",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "run, validate_entry, REQUIRED_FIELDS, BOUNDARY_FIELDS, summary",
        "rollback": "remove /api/skill/module-build route and this module",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "meta-module-build skill executor \u2014 validates MODULE_BUILD schema + gap report",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/module_build_runner.py",
      "id": "module_build_runner"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "ratios skill executor \u2014 recomputes loc_comments/imports_exports/calls_definitions per file; fails on drift",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/ratios_runner.py",
      "id": "ratios_runner_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "run, COMPUTERS, compute_loc_comments, compute_imports_exports, compute_calls_definitions",
        "owner": "a0p maintainer",
        "summary": "ratios skill executor \u2014 recomputes loc_comments/imports_exports/calls_definitions per file; fails on drift"
      },
      "file": "backend/a0p_skills/ratios_runner.py",
      "id": "ratios_runner"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/a0p_skills/ratios_runner.py",
      "id": "ratios_runner_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_strip_ratios_lines, _iter_source, _DOCSTRING_OPEN",
        "module_kind": "skill",
        "module_name": "ratios_runner",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "run, COMPUTERS, compute_loc_comments, compute_imports_exports, compute_calls_definitions",
        "rollback": "remove /api/skill/ratios route and this module",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "ratios skill executor \u2014 recomputes loc_comments/imports_exports/calls_definitions and gates on drift + first/last-line placement of the single-line RATIOS declaration",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/a0p_skills/ratios_runner.py",
      "id": "ratios_runner"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "test-build skill executor \u2014 imports each CONTRACTS `call:` and runs it",
        "user_data_boundary": "read"
      },
      "file": "backend/a0p_skills/test_build_runner.py",
      "id": "test_build_runner_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:external, user_data:read",
        "exposes": "run, summary, run_async",
        "owner": "a0p maintainer",
        "summary": "test-build skill executor \u2014 imports each CONTRACTS `call:` and runs it"
      },
      "file": "backend/a0p_skills/test_build_runner.py",
      "id": "test_build_runner"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "hmmm",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/a0p_skills/test_build_runner.py",
      "id": "test_test_build_runner"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_import_callable, _run_one",
        "module_kind": "skill",
        "module_name": "test_build_runner",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "public_surface": "run, summary, run_async",
        "rollback": "remove /api/skill/test-build route and this module",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "test-build skill executor \u2014 imports each CONTRACTS `call:` and runs it",
        "tests": "hmmm",
        "user_data_boundary": "read"
      },
      "file": "backend/a0p_skills/test_build_runner.py",
      "id": "test_build_runner"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "internal",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "per-agent CRUD; semi-permanent character-sheet-bound instances; each owns \u03a6/\u03a8/\u03a9/MemL/MemS + per-instance ZFAE weight bank + archive",
        "user_data_boundary": "write"
      },
      "file": "backend/agents/__init__.py",
      "id": "agents_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:internal, user_data:write",
        "exposes": "AgentInstance, CharacterSheet, AgentMode, PXResolution, AgentStore, ALL_MODES",
        "owner": "Erin Spencer",
        "summary": "per-agent CRUD; semi-permanent character-sheet-bound instances; each owns \u03a6/\u03a8/\u03a9/MemL/MemS + per-instance ZFAE weight bank + archive"
      },
      "file": "backend/agents/__init__.py",
      "id": "agents_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.agent_instance_full_crud_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/agents/__init__.py",
      "id": "agent_instance_full_crud"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "service",
        "module_name": "agents",
        "network_boundary": "internal",
        "owner": "Erin Spencer",
        "public_surface": "AgentInstance, CharacterSheet, AgentMode, PXResolution, AgentStore, ALL_MODES",
        "rollback": "remove /api/instances/* routes; agents preserved on disk",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "per-agent CRUD; semi-permanent character-sheet-bound instances; each owns \u03a6/\u03a8/\u03a9/MemL/MemS + per-instance ZFAE weight bank + archive",
        "tests": "a0p_skills.contracts.agent_instance_full_crud_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/agents/__init__.py",
      "id": "agents_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "/api/instances/* CRUD + /api/chat/instance/{id} mode-aware; surface-3 teacher context preview endpoint",
        "user_data_boundary": "write"
      },
      "file": "backend/agents/routes.py",
      "id": "agents_routes_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:external, user_data:write",
        "exposes": "router, get_agent_store",
        "owner": "Erin Spencer",
        "summary": "/api/instances/* CRUD + /api/chat/instance/{id} mode-aware; surface-3 teacher context preview endpoint"
      },
      "file": "backend/agents/routes.py",
      "id": "agents_routes"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.chat_instance_mode_dispatch_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/agents/routes.py",
      "id": "chat_instance_mode_dispatch"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.teacher_curated_context_distinct_from_prompt_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/agents/routes.py",
      "id": "teacher_curated_context_distinct_from_prompt"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_AGENT_STORE, _runtime, _get_key",
        "module_kind": "route",
        "module_name": "routes",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "router, get_agent_store",
        "rollback": "detach router; existing agents preserved",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "/api/instances/* CRUD + /api/chat/instance/{id} mode-aware; surface-3 teacher context preview endpoint",
        "tests": "a0p_skills.contracts.chat_instance_mode_dispatch_holds, a0p_skills.contracts.teacher_curated_context_distinct_from_prompt_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/agents/routes.py",
      "id": "agents_routes"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "Pydantic models \u2014 AgentInstance, CharacterSheet, AgentMode (the 5-lattice modes), PXResolution; covers the full character sheet editable surface",
        "user_data_boundary": "read"
      },
      "file": "backend/agents/schema.py",
      "id": "agents_schema_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "AgentInstance, CharacterSheet, AgentMode, PXResolution, ALL_MODES, new_agent_id",
        "owner": "Erin Spencer",
        "summary": "Pydantic models \u2014 AgentInstance, CharacterSheet, AgentMode (the 5-lattice modes), PXResolution; covers the full character sheet editable surface"
      },
      "file": "backend/agents/schema.py",
      "id": "agents_schema"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.agent_character_sheet_shape_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/agents/schema.py",
      "id": "agent_character_sheet_shape"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_utc_now_iso",
        "module_kind": "schema",
        "module_name": "schema",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "AgentInstance, CharacterSheet, AgentMode, PXResolution, ALL_MODES, new_agent_id, compose_agent_name, compose_canonical_name",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "Pydantic models \u2014 AgentInstance, CharacterSheet, AgentMode (the 6-lattice modes incl. bare a0(<model>)), PXResolution; plus the canonical agent-name composer (a0(<energy>)<auditor>, owner-namespaced)",
        "tests": "a0p_skills.contracts.agent_character_sheet_shape_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/agents/schema.py",
      "id": "agents_schema"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "internal",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "full CRUD over MongoDB metadata + filesystem per-agent checkpoint dir; agents treated as users (persistent semi-permanent instances)",
        "user_data_boundary": "write"
      },
      "file": "backend/agents/store.py",
      "id": "agents_store_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:internal, user_data:write",
        "exposes": "AgentStore",
        "owner": "Erin Spencer",
        "summary": "full CRUD over MongoDB metadata + filesystem per-agent checkpoint dir; agents treated as users (persistent semi-permanent instances)"
      },
      "file": "backend/agents/store.py",
      "id": "agents_store"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.agent_instance_full_crud_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/agents/store.py",
      "id": "agent_instance_full_crud"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_agent_dir, _ensure_dir",
        "module_kind": "service",
        "module_name": "store",
        "network_boundary": "internal",
        "owner": "Erin Spencer",
        "public_surface": "AgentStore",
        "rollback": "drop agents collection; filesystem dirs preserved",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "full CRUD over MongoDB metadata + filesystem per-agent checkpoint dir; agents treated as users (persistent semi-permanent instances)",
        "tests": "a0p_skills.contracts.agent_instance_full_crud_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/agents/store.py",
      "id": "agents_store"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "catalogue + planner + identity preview + ephemeral MemoryCore sub demo; no persistence, no network, drives existing routes only",
        "user_data_boundary": "read"
      },
      "file": "backend/api_agent_lab.py",
      "id": "api_agent_lab_routes_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:none, network:none, user_data:read",
        "exposes": "router",
        "owner": "Erin Spencer",
        "summary": "agent-creation permutation catalogue + recipe planner + identity preview + volatile sub-memory demo"
      },
      "file": "backend/api_agent_lab.py",
      "id": "api_agent_lab_routes"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.agent_lab_plan_holds",
        "class": "correctness",
        "given": "the lab catalogue, an identity, a recipe mixing native + cross-repo stages, and a sub-memory demo",
        "then": "permutations lists every stage tagged native/cross-repo; identity-preview composes a0(<energy>)<auditor>; plan returns ordered steps mapped to real routes/primitives (cross-repo flagged plan-only, not executable_here) with precondition warnings; sub-memory folds spawn_sub items into the ST ring"
      },
      "file": "backend/api_agent_lab.py",
      "id": "agent_lab_plan"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "LabRecipe, IdentityBody, SubMemoryBody, STAGE_CATALOGUE, build_plan",
        "module_kind": "route",
        "module_name": "agent_lab",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "router",
        "rollback": "revert + unmount from server.py; the Agent Lab tab loses its catalogue/plan/sub-memory endpoints (instance create/train/sentinel routes are unaffected)",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "the Agent Creation Lab \u2014 a composer that lets a user assemble ANY permutation of the agent-creation logic explored across the a0 family and get back a validated, ordered execution plan. GET /api/agent-lab/permutations returns the full catalogue of creation stages (identity/mode from the 6-lattice, instance create + fresh three-core ZFAE weight bank, multi-teacher distill unlock, native-readiness gate, mode inference, sentinel/override config, volatile MemoryCore sub-instancing, safetensors checkpoint) plus the a0-canonical merge strategies (InstanceMerge fork/absorb/converge, sub_agent_spawn/executor) each tagged native vs cross-repo with its real entrypoint. POST /api/agent-lab/identity-preview composes the canonical a0(<energy>)<auditor> name. POST /api/agent-lab/plan validates a chosen recipe and returns the ordered steps, each mapped to the REAL route/primitive it executes against (or flagged plan-only for the _legacy_a0-only strategies) with preconditions + firewalls. POST /api/agent-lab/sub-memory actually runs the a0p-native volatile MemoryCore spawn_sub/merge_sub primitive (ephemeral, no persistence). The lab never re-implements create/train/sentinel logic \u2014 it plans permutations and drives the existing endpoints; cross-repo (a0-canonical) strategies are surfaced as doctrine, never falsely executed here.",
        "tests": "a0p_skills.contracts.agent_lab_plan_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/api_agent_lab.py",
      "id": "api_agent_lab_routes"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "REST endpoints for custom keys, demo quota, living spec",
        "user_data_boundary": "write"
      },
      "file": "backend/api_extensions.py",
      "id": "api_extensions_routes_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:none, user_data:write",
        "exposes": "router, record_demo_usage, check_demo_quota",
        "owner": "Erin Spencer",
        "summary": "REST endpoints for custom keys, demo quota, living spec"
      },
      "file": "backend/api_extensions.py",
      "id": "api_extensions_routes"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.api_extensions_living_spec_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/api_extensions.py",
      "id": "api_extensions_living_spec"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_quota_key, _today_utc, _scan_repo_blocks",
        "module_kind": "route",
        "module_name": "extensions",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "router, record_demo_usage, check_demo_quota",
        "rollback": "revert; loses custom-keys vault, demo quota, and living spec",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "post-auth API extensions \u2014 custom keys vault (user-defined GitHub/GCP/AWS-style keys), Emergent demo quota (per-user daily token budget), living spec endpoint (auto-parses MODULE_BUILD/BOUNDARIES/CAPABILITIES/CONTRACTS/RATIOS blocks from the repo and serves them as JSON), audit feed (hash-chained FIQ events for the Tool/CoT Tape)",
        "tests": "a0p_skills.contracts.api_extensions_living_spec_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/api_extensions.py",
      "id": "api_extensions_routes"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "REST endpoints for tools, mcp client, and skills",
        "user_data_boundary": "write"
      },
      "file": "backend/api_tools_mcp_skills.py",
      "id": "api_tools_mcp_skills_routes_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:external, user_data:write",
        "exposes": "router",
        "owner": "Erin Spencer",
        "summary": "tools/mcp/skills REST surface"
      },
      "file": "backend/api_tools_mcp_skills.py",
      "id": "api_tools_mcp_skills_routes"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/api_tools_mcp_skills.py",
      "id": "api_tools_mcp_skills_router_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_refresh_mcp_tools, _safe_mcp_tool_name, _migrate_allow_lists, _user_id",
        "module_kind": "route",
        "module_name": "api_tools_mcp_skills",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "router",
        "rollback": "revert; user cannot manage tools/mcp/skills from the UI",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "REST surface for the tools / MCP-client / Odysseus-client / skills layer \u2014 /api/tools (list, register user-webhook tool, invoke), /api/mcp/servers (CRUD external MCP servers, refresh their tools), /api/odysseus/servers (CRUD registered Odysseus workspaces, refresh their scoped /api/codex/* catalogue tools), /api/skills (list, register w/ overlap warning, delete, sync from skill-lib)",
        "tests": "a0p_skills.contracts.api_tools_mcp_skills_router_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/api_tools_mcp_skills.py",
      "id": "api_tools_mcp_skills_routes"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "REST endpoints computing embedding/EDCM/gonal readouts + disk stacks from request text",
        "user_data_boundary": "read"
      },
      "file": "backend/api_training.py",
      "id": "api_training_routes_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:none, network:none, user_data:read",
        "exposes": "router",
        "owner": "Erin Spencer",
        "summary": "UCNS-native embedding + EDCM projection + cylindrical gonal disk-stack readouts for the training tab"
      },
      "file": "backend/api_training.py",
      "id": "api_training_routes"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.api_training_readout_holds",
        "class": "correctness",
        "given": "the training router and a turn (with and without a prior)",
        "then": "/readout and /disk-stack handlers return the embedding + EDCM + gonal"
      },
      "file": "backend/api_training.py",
      "id": "api_training_readout"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "ReadoutBody, DiskStackBody",
        "module_kind": "route",
        "module_name": "training",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "router",
        "rollback": "revert + unmount from server.py; the Chat Training tab loses its readout/disk-stack endpoints",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "backend for the standalone Chat Training tab \u2014 turns the inference-engine chat-training loop into three inspectable readouts wired to the same primitives the ZFAE engine trains on. POST /api/training/readout lifts one turn (with optional prior) into its UCNS-native embedding (unit-circle phase streams on the 157-gonal carrier), its six-family EDCM projection (CM/DA/DRIFT/DVG/INT/TBF with 0.80/0.20 alert bands), and its three-core gonal disk (phi content-phase / omega bone-density / psi unit-circle coherence). POST /api/training/disk-stack folds a whole session of utterances into a cylindrical disk stack of chapter-scale gonols \u2014 one 157-gonal disk per depth-rung (leaf..chapter), the chapter rung being the \u22a0 (unit-circle phase-product) recomposition of the per-utterance embeddings. Pure read-only computation over the request text; actual weight training stays on the existing /api/instances/{id}/train route. Recompose-only, public-fixture carrier, UCNS-G / non-absolute (no theorem transfer).",
        "tests": "a0p_skills.contracts.api_training_readout_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/api_training.py",
      "id": "api_training_routes"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "true",
        "auth_boundary": "bearer",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "admin-editable URL settings",
        "user_data_boundary": "write"
      },
      "file": "backend/app_settings.py",
      "id": "app_settings_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:none, user_data:write, admin:true",
        "exposes": "router, get_setting",
        "owner": "Erin Spencer",
        "summary": "editable runtime settings"
      },
      "file": "backend/app_settings.py",
      "id": "app_settings"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/app_settings.py",
      "id": "app_settings_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "true",
        "auth_boundary": "bearer",
        "internal_surface": "_DEFAULTS, _admin_only",
        "module_kind": "route",
        "module_name": "app_settings",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "router, get_setting",
        "rollback": "revert; settings revert to env-defaults",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "admin-editable runtime settings \u2014 single Mongo doc with key/value overrides for non-secret URLs (Emergent Google OAuth widget URL, etc.); /api/settings GET for everyone, PATCH for admin only; values shadow env vars at runtime",
        "tests": "a0p_skills.contracts.module_imports_cleanly_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/app_settings.py",
      "id": "app_settings"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "auth endpoints + OAuth callbacks; reads/writes users, login_attempts, password_reset_tokens",
        "user_data_boundary": "write"
      },
      "file": "backend/auth/__init__.py",
      "id": "auth_routes_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:external, user_data:write",
        "exposes": "router, get_current_user, get_current_user_or_demo, init_auth, seed_admin",
        "owner": "Erin Spencer",
        "summary": "hybrid JWT + OAuth endpoints"
      },
      "file": "backend/auth/__init__.py",
      "id": "auth_routes"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.auth_register_login_round_trip_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/auth/__init__.py",
      "id": "auth_register_login_round_trip"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_hash_password, _verify_password, _make_tokens, _record_attempt, _is_locked, _link_oauth_user",
        "module_kind": "route",
        "module_name": "routes",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "router, get_current_user, get_current_user_or_demo, init_auth, seed_admin",
        "rollback": "revert; multi-tenancy collapses to user_id='local' anonymous mode",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "hybrid JWT auth + OAuth (Emergent Google, GitHub) \u2014 /api/auth/{register,login,logout,me,refresh,oauth/*}; username (unique) + email (unique) + \u226516-char passphrase; bcrypt; httpOnly cookies; brute-force lockout",
        "tests": "a0p_skills.contracts.auth_register_login_round_trip_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/auth/__init__.py",
      "id": "auth_routes"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "Fernet encrypt/decrypt + mask for at-rest BYOK credentials",
        "user_data_boundary": "read"
      },
      "file": "backend/crypto_vault.py",
      "id": "a0p_crypto_vault_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "encrypt, decrypt, mask",
        "owner": "a0p maintainer",
        "summary": "Fernet encrypt/decrypt + mask for at-rest BYOK credentials"
      },
      "file": "backend/crypto_vault.py",
      "id": "a0p_crypto_vault"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/crypto_vault.py",
      "id": "a0p_crypto_vault_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_fernet, _SECRET",
        "module_kind": "service",
        "module_name": "crypto_vault",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "encrypt, decrypt, mask",
        "rollback": "remove imports from server.py; user re-enters BYOK keys",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "Fernet encrypt/decrypt + mask for at-rest BYOK credentials",
        "tests": "hmmm",
        "user_data_boundary": "read"
      },
      "file": "backend/crypto_vault.py",
      "id": "a0p_crypto_vault"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "internal",
        "owner": "a0p maintainer",
        "storage_boundary": "write",
        "summary": "Motor async client + collection accessors + index ensurance",
        "user_data_boundary": "write"
      },
      "file": "backend/db.py",
      "id": "a0p_db_motor_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:internal, user_data:write",
        "exposes": "db, keys_col, vault_col, sessions_col, drafts_col, fanout_col, chain_col, agents_col, usage_col, ensure_indexes",
        "owner": "a0p maintainer",
        "summary": "Motor async client + collection accessors + index ensurance"
      },
      "file": "backend/db.py",
      "id": "a0p_db_motor"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/db.py",
      "id": "a0p_db_motor_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_client, _MONGO_URL, _DB_NAME",
        "module_kind": "service",
        "module_name": "db",
        "network_boundary": "internal",
        "owner": "a0p maintainer",
        "public_surface": "db, keys_col, vault_col, sessions_col, drafts_col, fanout_col, chain_col, agents_col, usage_col, ensure_indexes",
        "rollback": "drop mongo collections; revert server.py import",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "Motor async client + collection accessors + index ensurance",
        "tests": "hmmm",
        "user_data_boundary": "write"
      },
      "file": "backend/db.py",
      "id": "a0p_db_motor"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "meta-package exposing pcea, ptca, pcna, aimmh, zfae submodules",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/__init__.py",
      "id": "interdependent_lib_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "pcea, ptca, pcna, zfae, aimmh, available, __version__",
        "owner": "a0p maintainer",
        "summary": "meta-package exposing pcea, ptca, pcna, aimmh, zfae submodules"
      },
      "file": "backend/interdependent_lib/__init__.py",
      "id": "interdependent_lib_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/__init__.py",
      "id": "interdependent_lib_pkg_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "skill",
        "module_name": "interdependent_lib",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "pcea, ptca, pcna, zfae, aimmh, available, __version__",
        "rollback": "remove import from server.py",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "meta-package exposing pcea, ptca, pcna, aimmh, zfae submodules",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/__init__.py",
      "id": "interdependent_lib_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "this project's msdmd application \u2014 parser + back-compat runner (canonical executors live in a0p_skills)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/_msdmd/__init__.py",
      "id": "msdmd_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "exposes": "parse, walk, report",
        "stability": "stable",
        "summary": "this project's msdmd application \u2014 parser, runner, coverage report"
      },
      "file": "backend/interdependent_lib/_msdmd/__init__.py",
      "id": "msdmd_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/_msdmd/__init__.py",
      "id": "msdmd_pkg_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "skill",
        "module_name": "_msdmd",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "parse, walk, report, walk_tree, parse_text, parse_file",
        "rollback": "remove imports from server.py and a0p_skills",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "this project's msdmd application \u2014 parser + back-compat runner (canonical executors live in a0p_skills)",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/_msdmd/__init__.py",
      "id": "msdmd_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "canonical msdmd parser \u2014 line-for-line sync of skill-lib/msdmd/parsers/universal.py",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/_msdmd/parser.py",
      "id": "msdmd_parser_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "parse_text, parse_file, walk_tree, marker_for, parse_ratios, parse_ratios_file, ratios_placement",
        "owner": "a0p maintainer",
        "summary": "canonical msdmd block parser + single-line RATIOS reader"
      },
      "file": "backend/interdependent_lib/_msdmd/parser.py",
      "id": "msdmd_parser"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "hmmm",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/_msdmd/parser.py",
      "id": "test_parser"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_MARKERS, _DEFAULT_SKIP, _block_regex, _RATIOS_LINE_RE",
        "module_kind": "skill",
        "module_name": "parser",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "parse_text, parse_file, walk_tree, marker_for, parse_ratios, parse_ratios_file, ratios_placement, RATIO_IDS",
        "rollback": "revert to mine \u2014 last working sha in git history",
        "rollout": "default_enabled",
        "since": "2026-05-31",
        "storage_boundary": "read",
        "summary": "canonical msdmd block parser + single-line RATIOS reader (loc_comments/imports_exports/calls_definitions on first & last line)",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/_msdmd/parser.py",
      "id": "msdmd_parser"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "msdmd CAPABILITIES coverage runner (deprecated in favour of skills.module_build_runner)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/_msdmd/runner.py",
      "id": "msdmd_runner_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "walk, report, main",
        "owner": "a0p maintainer",
        "summary": "msdmd CAPABILITIES coverage runner (deprecated in favour of skills.module_build_runner)"
      },
      "file": "backend/interdependent_lib/_msdmd/runner.py",
      "id": "msdmd_runner"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/_msdmd/runner.py",
      "id": "msdmd_runner_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "deprecated": "prefer skills.module_build_runner for canonical MODULE_BUILD coverage",
        "internal_surface": "SKIP_DIRS, _format_human",
        "module_kind": "skill",
        "module_name": "runner",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "walk, report, main",
        "rollback": "remove module and call sites",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "msdmd CAPABILITIES coverage runner (deprecated in favour of skills.module_build_runner)",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/_msdmd/runner.py",
      "id": "msdmd_runner"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "async multi-model orchestration patterns over a call_fn(model_id, messages)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/aimmh/__init__.py",
      "id": "aimmh_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "fan_out, daisy_chain, room_all, room_synthesized, council, ModelResult",
        "owner": "a0p maintainer",
        "summary": "async multi-model orchestration patterns over a call_fn(model_id, messages)"
      },
      "file": "backend/interdependent_lib/aimmh/__init__.py",
      "id": "aimmh_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/aimmh/__init__.py",
      "id": "aimmh_pkg_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "aimmh",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "fan_out, daisy_chain, room_all, room_synthesized, council, ModelResult",
        "rollback": "remove imports from server.py",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "AIMMH \u2014 async multi-model orchestration over a single call_fn(model_id, messages) abstraction; the five patterns (single, fan-out, daisy-chain, synthesize, council) are what let the workspace compare or compose frontier models on one prompt without coupling to any vendor SDK",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/aimmh/__init__.py",
      "id": "aimmh_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "pure-async multi-model orchestration patterns over call_fn(model_id, messages)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/aimmh/patterns.py",
      "id": "aimmh_patterns_impl_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "ModelResult, fan_out, daisy_chain, room_all, room_synthesized, council",
        "owner": "a0p maintainer",
        "summary": "pure-async multi-model orchestration patterns over call_fn(model_id, messages)"
      },
      "file": "backend/interdependent_lib/aimmh/patterns.py",
      "id": "aimmh_patterns_impl"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.aimmh_invoke_propagates_error",
        "class": "orchestration",
        "given": "N model_ids and one prompt",
        "then": "all models called concurrently; one ModelResult per model returned in order"
      },
      "file": "backend/interdependent_lib/aimmh/patterns.py",
      "id": "aimmh_fan_out_parallel"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_invoke, CallFn",
        "module_kind": "engine",
        "module_name": "patterns",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "ModelResult, fan_out, daisy_chain, room_all, room_synthesized, council",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "pure-async multi-model orchestration patterns over call_fn(model_id, messages)",
        "tests": "a0p_skills.contracts.aimmh_invoke_propagates_error",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/aimmh/patterns.py",
      "id": "aimmh_patterns_impl"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure transcript -> six-family EDCM projection metrics; no io, no network",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/edcm_readout.py",
      "id": "il_edcm_readout_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "EDCMReadout, readout, EDCM_METRICS, ALERT_HIGH, ALERT_LOW",
        "owner": "Erin Spencer",
        "summary": "six-family EDCM projection readout over a transcript turn / turn-pair"
      },
      "file": "backend/interdependent_lib/edcm_readout.py",
      "id": "il_edcm_readout"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.edcm_readout_bounds_holds",
        "class": "correctness",
        "given": "a readout over a turn-pair, a first turn (no prior), and empty text",
        "then": "all six metrics are in [0,1], deterministic, alert bands agree with the"
      },
      "file": "backend/interdependent_lib/edcm_readout.py",
      "id": "edcm_readout_bounds"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_tokens, _jaccard, _bone_set, _neg_density, _ttr, _intensity, _band",
        "module_kind": "adapter",
        "module_name": "edcm_readout",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "EDCMReadout, readout, EDCM_METRICS, ALERT_HIGH, ALERT_LOW",
        "rollback": "revert; the training view loses its EDCM readout panel",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "self-contained EDCM readout for the training view \u2014 computes the six-family projection metrics (CM constraint-mismatch, DA dissonance-accumulation, DRIFT, DVG divergence, INT intensity, TBF turn-balance-fairness) deterministically from a transcript turn / turn-pair using measurable text features (operator/bone overlap, negation density, TTR delta, length balance), each bounded to [0,1] with 0.80/0.20 alert bands. Reports raised_field_count (bone operators present) and honors the EDCM empty-field intuition. This is a lightweight readout inspired by the edcmbone metrics/projection + pcna core/edcm families \u2014 NOT the full edcmbone stats engine, and it transfers no theorem/proof status.",
        "tests": "a0p_skills.contracts.edcm_readout_bounds_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/edcm_readout.py",
      "id": "il_edcm_readout"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "read",
        "summary": "fiq motion canon \u2014 boundary law for audited motion between PCNA/PCTA/PTCA strata; tick schedule (3/5/7); \u03c7 indicators; FIQ_TRANSFER/BUFFERED/BLOCKED events; sentinels S1-S9, R0, fiques_time",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/fiq/__init__.py",
      "id": "fiq_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "FiqGate, flux, chi_route, chi_audit, chi_support, chi_attention, ficks, FIQ_TRANSFER, FIQ_BUFFERED, FIQ_BLOCKED, AuditLog, TICK_SCHEDULE, PSI_MS, PHI_MS, OMEGA_MS, attention_fires",
        "owner": "Erin Spencer",
        "summary": "fiq motion canon \u2014 boundary law for audited motion between PCNA/PCTA/PTCA strata; tick schedule (3/5/7); \u03c7 indicators; FIQ_TRANSFER/BUFFERED/BLOCKED events; sentinels S1-S9, R0, fiques_time"
      },
      "file": "backend/interdependent_lib/fiq/__init__.py",
      "id": "fiq_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.fiq_pkg_exports_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/fiq/__init__.py",
      "id": "fiq_pkg_exports"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "fiq",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "FiqGate, flux, chi_route, chi_audit, chi_support, chi_attention, ficks, FIQ_TRANSFER, FIQ_BUFFERED, FIQ_BLOCKED, AuditLog, TICK_SCHEDULE, PSI_MS, PHI_MS, OMEGA_MS, attention_fires",
        "rollback": "detach Tier-2/Tier-1 emitters and revert imports",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "fiq motion canon \u2014 boundary law for audited motion between PCNA/PCTA/PTCA strata; tick schedule (3/5/7); \u03c7 indicators; FIQ_TRANSFER/BUFFERED/BLOCKED events; sentinels S1-S9, R0, fiques_time",
        "tests": "a0p_skills.contracts.fiq_pkg_exports_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/fiq/__init__.py",
      "id": "fiq_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "admin",
        "network_boundary": "internal",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "append-only JSONL fiq audit log at /app/storage/fiq_audit/YYYY-MM-DD.jsonl + MongoDB mirror; prev_hash chain verifiable end-to-end",
        "user_data_boundary": "write"
      },
      "file": "backend/interdependent_lib/fiq/audit.py",
      "id": "fiq_audit_log_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:admin, storage:write, network:internal, user_data:write",
        "exposes": "AuditLog, append, iter_today, verify, last_hash",
        "owner": "Erin Spencer",
        "summary": "append-only JSONL fiq audit log at /app/storage/fiq_audit/YYYY-MM-DD.jsonl + MongoDB mirror; prev_hash chain verifiable end-to-end"
      },
      "file": "backend/interdependent_lib/fiq/audit.py",
      "id": "fiq_audit_log"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.fiq_audit_filesystem_and_mongo_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/fiq/audit.py",
      "id": "fiq_audit_filesystem_and_mongo"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "admin",
        "internal_surface": "_path_for_day",
        "module_kind": "service",
        "module_name": "audit",
        "network_boundary": "internal",
        "owner": "Erin Spencer",
        "public_surface": "AuditLog, append, iter_today, verify, last_hash",
        "rollback": "stop appending; existing log preserved",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "storage_policy": "filesystem canonical + MongoDB read-optimized mirror",
        "summary": "append-only JSONL fiq audit log at /app/storage/fiq_audit/YYYY-MM-DD.jsonl + MongoDB mirror; prev_hash chain verifiable end-to-end",
        "tests": "a0p_skills.contracts.fiq_audit_filesystem_and_mongo_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/interdependent_lib/fiq/audit.py",
      "id": "fiq_audit_log"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "FIQ_TRANSFER / FIQ_BUFFERED / FIQ_BLOCKED event dataclasses; blake2b prev_hash chain",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/fiq/events.py",
      "id": "fiq_events_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "FIQ_TRANSFER, FIQ_BUFFERED, FIQ_BLOCKED, AuditEvent, chain_hash, verify_chain",
        "owner": "Erin Spencer",
        "summary": "FIQ_TRANSFER / FIQ_BUFFERED / FIQ_BLOCKED event dataclasses; blake2b prev_hash chain"
      },
      "file": "backend/interdependent_lib/fiq/events.py",
      "id": "fiq_events"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.fiq_audit_chain_appends_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/fiq/events.py",
      "id": "fiq_audit_chain_appends"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_digest",
        "module_kind": "schema",
        "module_name": "events",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "FIQ_TRANSFER, FIQ_BUFFERED, FIQ_BLOCKED, AuditEvent, chain_hash, verify_chain",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "FIQ_TRANSFER / FIQ_BUFFERED / FIQ_BLOCKED event dataclasses; blake2b prev_hash chain",
        "tests": "a0p_skills.contracts.fiq_audit_chain_appends_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/fiq/events.py",
      "id": "fiq_events"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "ficks \u2014 gradient term D_r(\u03a6_a \u2212 \u03a6_b) in the fiq flux equation; named after Fick's law of diffusion; resolves \"tics-per-tok\" framing as the gradient of fiq tics per LLM token",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/fiq/ficks.py",
      "id": "fiq_ficks_gradient_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "ficks, gradient_potential",
        "owner": "Erin Spencer",
        "summary": "ficks \u2014 gradient term D_r(\u03a6_a \u2212 \u03a6_b) in the fiq flux equation; named after Fick's law of diffusion; resolves \"tics-per-tok\" framing as the gradient of fiq tics per LLM token"
      },
      "file": "backend/interdependent_lib/fiq/ficks.py",
      "id": "fiq_ficks_gradient"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.ficks_gradient_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/fiq/ficks.py",
      "id": "ficks_gradient"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "ficks",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "ficks, gradient_potential",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "ficks \u2014 gradient term D_r(\u03a6_a \u2212 \u03a6_b) in the fiq flux equation; named after Fick's law of diffusion; resolves \"tics-per-tok\" framing as the gradient of fiq tics per LLM token",
        "tests": "a0p_skills.contracts.ficks_gradient_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/fiq/ficks.py",
      "id": "fiq_ficks_gradient"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "FiqGate \u2014 the smallest auditable boundary gate r = (a, b, S, mode); not motion, the law that permits/blocks/meters motion",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/fiq/gate.py",
      "id": "fiq_gate_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "FiqGate, GateMode",
        "owner": "Erin Spencer",
        "summary": "FiqGate \u2014 the smallest auditable boundary gate r = (a, b, S, mode); not motion, the law that permits/blocks/meters motion"
      },
      "file": "backend/interdependent_lib/fiq/gate.py",
      "id": "fiq_gate"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.fiq_gate_shape_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/fiq/gate.py",
      "id": "fiq_gate_shape"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "schema",
        "module_name": "gate",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "FiqGate, GateMode",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "FiqGate \u2014 the smallest auditable boundary gate r = (a, b, S, mode); not motion, the law that permits/blocks/meters motion",
        "tests": "a0p_skills.contracts.fiq_gate_shape_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/fiq/gate.py",
      "id": "fiq_gate"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "core fiq flux equation F = \u03c7_route \u00b7 \u03c7_audit \u00b7 \u03c7_support \u00b7 \u03c7_attention \u00b7 P_ab \u00b7 D_r(\u03a6_a \u2212 \u03a6_b); pure functions",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/fiq/motion.py",
      "id": "fiq_motion_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "chi_route, chi_audit, chi_support, chi_attention, permeability, potential, flux",
        "owner": "Erin Spencer",
        "summary": "core fiq flux equation F = \u03c7_route \u00b7 \u03c7_audit \u00b7 \u03c7_support \u00b7 \u03c7_attention \u00b7 P_ab \u00b7 D_r(\u03a6_a \u2212 \u03a6_b); pure functions"
      },
      "file": "backend/interdependent_lib/fiq/motion.py",
      "id": "fiq_motion"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.fiq_flux_equation_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/fiq/motion.py",
      "id": "fiq_flux_equation"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "canon_pinned": "\u03a6_a^(S)(t) = \u03c9_S^\u22a4 \u03a0_S z_a(t) \u2212 \u03c1 \u00b7 L_a(t)  (C1 minus; C2 \u03c9_S fixed at declaration)",
        "internal_surface": "_omega_S_lookup",
        "module_kind": "engine",
        "module_name": "motion",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "chi_route, chi_audit, chi_support, chi_attention, permeability, potential, flux",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "core fiq flux equation F = \u03c7_route \u00b7 \u03c7_audit \u00b7 \u03c7_support \u00b7 \u03c7_attention \u00b7 P_ab \u00b7 D_r(\u03a6_a \u2212 \u03a6_b); pure functions",
        "tests": "a0p_skills.contracts.fiq_flux_equation_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/fiq/motion.py",
      "id": "fiq_motion"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "admin",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "read",
        "summary": "9 sentinels (S1-S9) + R0 orchestration root + fiques_time probe; each enforces a \u03c7 indicator family or governs an outbound policy",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/fiq/sentinels.py",
      "id": "fiq_sentinels_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:admin, storage:read, network:none, user_data:read",
        "exposes": "Sentinel, SentinelRegistry, S1_AUDIT, S2_PARSER, S3_CONSTRAINT, S4_SAFETY, S5_DRIFT, S6_COHERENCE, S7_RECALL, S8_BUDGET, S9_OUTPUT, R0_ROOT, FIQUES_TIME, REGISTRY",
        "owner": "Erin Spencer",
        "summary": "9 sentinels (S1-S9) + R0 orchestration root + fiques_time probe; each enforces a \u03c7 indicator family or governs an outbound policy"
      },
      "file": "backend/interdependent_lib/fiq/sentinels.py",
      "id": "fiq_sentinels"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.sentinel_registry_complete_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/fiq/sentinels.py",
      "id": "sentinel_registry_complete"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "admin",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "sentinels",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "Sentinel, SentinelRegistry, S1_AUDIT, S2_PARSER, S3_CONSTRAINT, S4_SAFETY, S5_DRIFT, S6_COHERENCE, S7_RECALL, S8_BUDGET, S9_OUTPUT, R0_ROOT, FIQUES_TIME, REGISTRY",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "9 sentinels (S1-S9) + R0 orchestration root + fiques_time probe; each enforces a \u03c7 indicator family or governs an outbound policy",
        "tests": "a0p_skills.contracts.sentinel_registry_complete_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/fiq/sentinels.py",
      "id": "fiq_sentinels"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "\u03c8/\u03c6/\u03c9 consciousness-prime tick constants (3/5/7); orthogonal stratum + core attention axes; logical default with optional real-time toggle",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/fiq/tick_schedule.py",
      "id": "fiq_tick_schedule_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "PSI_MS, PHI_MS, OMEGA_MS, TICK_SCHEDULE, LCM_TABLE, attention_fires, fully_aligned, RealtimeToggle",
        "owner": "Erin Spencer",
        "summary": "\u03c8/\u03c6/\u03c9 consciousness-prime tick constants (3/5/7); orthogonal stratum + core attention axes; logical default with optional real-time toggle"
      },
      "file": "backend/interdependent_lib/fiq/tick_schedule.py",
      "id": "fiq_tick_schedule"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.fiq_tick_schedule_canon_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/fiq/tick_schedule.py",
      "id": "fiq_tick_schedule_canon"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_lcm",
        "module_kind": "schema",
        "module_name": "tick_schedule",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "PSI_MS, PHI_MS, OMEGA_MS, TICK_SCHEDULE, LCM_TABLE, attention_fires, fully_aligned, RealtimeToggle",
        "rollback": "revert to ad-hoc tick counter",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "\u03c8/\u03c6/\u03c9 consciousness-prime tick constants (3/5/7); orthogonal stratum + core attention axes; logical default with optional real-time toggle",
        "tests": "a0p_skills.contracts.fiq_tick_schedule_canon_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/fiq/tick_schedule.py",
      "id": "fiq_tick_schedule"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "157-gonal carrier \u2014 public structural invariants (face, chirality, class tags, adjacency, bones); private disk material loaded only via theta_microkernel",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/__init__.py",
      "id": "carrier_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "face, chirality, n_plus, n_minus, ClassTag, CarrierDisk, CarrierDiskUnavailable, hard_invariant_holds, face_crossing, build_public_fixture_disk",
        "owner": "Erin Spencer",
        "summary": "157-gonal carrier \u2014 public structural invariants (face, chirality, class tags, adjacency, bones); private disk material loaded only via theta_microkernel"
      },
      "file": "backend/interdependent_lib/gonal/__init__.py",
      "id": "carrier_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.carrier_pkg_exports_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/gonal/__init__.py",
      "id": "carrier_pkg_exports"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "carrier",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "face, chirality, n_plus, n_minus, ClassTag, CarrierDisk, CarrierDiskUnavailable, hard_invariant_holds, face_crossing, build_public_fixture_disk",
        "rollback": "revert subpackage from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "157-gonal carrier \u2014 public structural invariants (face, chirality, class tags, adjacency, bones); private disk material loaded only via theta_microkernel",
        "tests": "a0p_skills.contracts.carrier_pkg_exports_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/__init__.py",
      "id": "carrier_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "hard invariants on the carrier \u2014 no L-L adjacent, no N-N adjacent; works against any CarrierDisk implementation",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/adjacency.py",
      "id": "carrier_adjacency_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "hard_invariant_holds, find_L_L_violations, find_N_N_violations",
        "owner": "Erin Spencer",
        "summary": "hard invariants on the carrier \u2014 no L-L adjacent, no N-N adjacent; works against any CarrierDisk implementation"
      },
      "file": "backend/interdependent_lib/gonal/adjacency.py",
      "id": "carrier_adjacency"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.carrier_adjacency_hard_invariant_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/gonal/adjacency.py",
      "id": "carrier_adjacency_hard_invariant"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "adjacency",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "hard_invariant_holds, find_L_L_violations, find_N_N_violations",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "hard invariants on the carrier \u2014 no L-L adjacent, no N-N adjacent; works against any CarrierDisk implementation",
        "tests": "a0p_skills.contracts.carrier_adjacency_hard_invariant_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/adjacency.py",
      "id": "carrier_adjacency"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "face-crossing detection over a bone's constituent positions; measurable structural property, not a violation",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/bones.py",
      "id": "carrier_bones_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "face_crossing",
        "owner": "Erin Spencer",
        "summary": "face-crossing detection over a bone's constituent positions; measurable structural property, not a violation"
      },
      "file": "backend/interdependent_lib/gonal/bones.py",
      "id": "carrier_bones"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.carrier_face_crossing_bone_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/gonal/bones.py",
      "id": "carrier_face_crossing_bone"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "bones",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "face_crossing",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "face-crossing detection over a bone's constituent positions; measurable structural property, not a violation",
        "tests": "a0p_skills.contracts.carrier_face_crossing_bone_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/bones.py",
      "id": "carrier_bones"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "public type-class enumeration (L, N, P, X) for the carrier slots; literal-type vs aggregate-slot distinction",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/classes.py",
      "id": "carrier_classes_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "ClassTag, FACE_PLUS_CLASSES, FACE_MINUS_CLASSES, LITERAL_TYPES, AGGREGATE_SLOTS",
        "owner": "Erin Spencer",
        "summary": "public type-class enumeration (L, N, P, X) for the carrier slots; literal-type vs aggregate-slot distinction"
      },
      "file": "backend/interdependent_lib/gonal/classes.py",
      "id": "carrier_classes"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.carrier_class_tags_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/gonal/classes.py",
      "id": "carrier_class_tags"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "schema",
        "module_name": "classes",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "ClassTag, FACE_PLUS_CLASSES, FACE_MINUS_CLASSES, LITERAL_TYPES, AGGREGATE_SLOTS",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "public type-class enumeration (L literal, N aggregate, P, X) for the 157 carrier slots \u2014 the distinction between literal-type positions and aggregate-slot positions that the adjacency and face invariants are defined over",
        "tests": "a0p_skills.contracts.carrier_class_tags_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/classes.py",
      "id": "carrier_classes"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "CarrierDisk Protocol \u2014 what any disk implementation (public fixture or private canon) must provide; CarrierDiskUnavailable error type",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/disk_protocol.py",
      "id": "carrier_disk_protocol_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "CarrierDisk, CarrierDiskUnavailable, DiskSignature",
        "owner": "Erin Spencer",
        "summary": "CarrierDisk Protocol \u2014 what any disk implementation (public fixture or private canon) must provide; CarrierDiskUnavailable error type"
      },
      "file": "backend/interdependent_lib/gonal/disk_protocol.py",
      "id": "carrier_disk_protocol"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.carrier_disk_protocol_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/gonal/disk_protocol.py",
      "id": "carrier_disk_protocol"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "schema",
        "module_name": "disk_protocol",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "CarrierDisk, CarrierDiskUnavailable, DiskSignature",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "CarrierDisk Protocol \u2014 what any disk implementation (public fixture or private canon) must provide; CarrierDiskUnavailable error type",
        "tests": "a0p_skills.contracts.carrier_disk_protocol_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/disk_protocol.py",
      "id": "carrier_disk_protocol"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "face + chirality + adjacency formulas over the 157-gonal carrier; no disk material",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/faces.py",
      "id": "carrier_faces_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "face, chirality, n_plus, n_minus, ARITY, ORIGIN, UPPER_ARC_RANGE, LOWER_ARC_RANGE",
        "owner": "Erin Spencer",
        "summary": "face + chirality + adjacency formulas over the 157-gonal carrier; no disk material"
      },
      "file": "backend/interdependent_lib/gonal/faces.py",
      "id": "carrier_faces"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.carrier_face_chirality_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/gonal/faces.py",
      "id": "carrier_face_chirality"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "schema",
        "module_name": "faces",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "face, chirality, n_plus, n_minus, ARITY, ORIGIN, UPPER_ARC_RANGE, LOWER_ARC_RANGE",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "face + chirality + adjacency formulas over the 157-gonal carrier; no disk material",
        "tests": "a0p_skills.contracts.carrier_face_chirality_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/faces.py",
      "id": "carrier_faces"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure construction; no IO; EXAMPLE_157 is public",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/gonal.py",
      "id": "carrier_gonal_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "GonalSpec, build_gonal, validate_gonal, print_gonal, EXAMPLE_157",
        "owner": "Erin Spencer",
        "summary": "builds and validates a gonal character carrier arrangement from a declarative spec"
      },
      "file": "backend/interdependent_lib/gonal/gonal.py",
      "id": "carrier_gonal"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/gonal/gonal.py",
      "id": "carrier_gonal_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "UPPERCASE, LOWERCASE, DIGITS_ODD, DIGITS_EVEN, PAIRED_OPEN, PAIRED_CLOSE, UNPAIRED_ASCII, UNPAIRED_OPS, UNPAIRED_ALL",
        "module_kind": "engine",
        "module_name": "gonal",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "GonalSpec, build_gonal, validate_gonal, print_gonal, EXAMPLE_157, make_example_157",
        "rollback": "revert to placeholder fixture; arrangements built from this module are not secret",
        "rollout": "usable; EXAMPLE_157 is a public non-secret arrangement for testing only",
        "storage_boundary": "none",
        "summary": "builds and validates a gonal character carrier arrangement from a declarative spec (user-provided canonical module)",
        "tests": "a0p_skills.contracts.gonal_example_157_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/gonal.py",
      "id": "carrier_gonal"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure deterministic lifted traversal over the public carrier; no IO, no globals, no LLM",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/gonal/lifted_path.py",
      "id": "gonal_lifted_path_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "encode_text_path, decode_text_path, vertex_of_char, char_of_vertex, is_seam_event",
        "owner": "Erin Spencer",
        "summary": "lossless encode/decode of text as an ordered lifted traversal over the 157-gonal carrier"
      },
      "file": "backend/interdependent_lib/gonal/lifted_path.py",
      "id": "gonal_lifted_path"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.gonal_lifted_path_round_trip_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/gonal/lifted_path.py",
      "id": "gonal_lifted_path_round_trip"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "hmmm": "the carrier alphabet is the public default 157-gonal (EXAMPLE_157); characters outside it raise CarrierCharError \u2014 losslessness is over the carrier alphabet, not arbitrary Unicode",
        "internal_surface": "_ARRANGEMENT, _VERTEX_OF_CHAR",
        "module_kind": "engine",
        "module_name": "lifted_path",
        "network_boundary": "none",
        "no_llm_assertion": "pure deterministic carrier traversal; MUST NOT import any provider/LLM SDK",
        "owner": "Erin Spencer",
        "public_surface": "encode_text_path, decode_text_path, vertex_of_char, char_of_vertex, is_seam_event, path_vertices, CarrierCharError, ARITY, ORIGIN",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "lossless lifted text traversal over the 157-gonal carrier \u2014 encode_text_path lifts a string to an ordered, strictly-monotonic path on the universal cover (vertex = pos mod 157); a repeated character costs a full 157-step revolution; SPACE is the seam at ORIGIN (vertex 0); the digit \"0\" is an ordinary glyph vertex; decode_text_path is the exact inverse (decode(encode(text)) == text over the carrier alphabet)",
        "tests": "a0p_skills.contracts.gonal_lifted_path_round_trip_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/gonal/lifted_path.py",
      "id": "gonal_lifted_path"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure function",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/mirror.py",
      "id": "carrier_mirror_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "mirror_of",
        "owner": "Erin Spencer",
        "summary": "position-reflection across the diameter through position 0"
      },
      "file": "backend/interdependent_lib/gonal/mirror.py",
      "id": "carrier_mirror"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/gonal/mirror.py",
      "id": "carrier_mirror_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "mirror",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "mirror_of",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "position-reflection mirror of a gonal arrangement across the diameter through position 0 \u2014 an involution (mirror_of(mirror_of(x)) == x) that inverts upper and lower arcs while preserving every hard adjacency invariant (no L-L / N-N adjacency survives the reflection)",
        "tests": "a0p_skills.contracts.gonal_mirror_is_invariant_preserving_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/mirror.py",
      "id": "carrier_mirror"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "public fixture disk generator \u2014 binary-order rule per user spec; deterministic, committable, satisfies hard invariants, NOT the canon",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/public_fixture.py",
      "id": "carrier_public_fixture_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "build_public_fixture_disk, PublicFixtureDisk",
        "owner": "Erin Spencer",
        "summary": "public fixture disk generator \u2014 binary-order rule per user spec; deterministic, committable, satisfies hard invariants, NOT the canon"
      },
      "file": "backend/interdependent_lib/gonal/public_fixture.py",
      "id": "carrier_public_fixture"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.carrier_public_fixture_is_valid_and_distinct_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/gonal/public_fixture.py",
      "id": "carrier_public_fixture_is_valid_and_distinct"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_PUBLIC_L_STEP, _PUBLIC_N_STEP, _origin_class",
        "module_kind": "experiment",
        "module_name": "public_fixture",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "build_public_fixture_disk, PublicFixtureDisk",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "security_note": "this generator and its parameters are PUBLIC; they do NOT reproduce the canon disk",
        "storage_boundary": "none",
        "summary": "public fixture disk generator \u2014 binary-order rule per user spec; deterministic, committable, satisfies hard invariants, NOT the canon",
        "tests": "a0p_skills.contracts.carrier_public_fixture_is_valid_and_distinct_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/gonal/public_fixture.py",
      "id": "carrier_public_fixture"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "read",
        "summary": "reads gonal spec from env path for private; default and mirror are public",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/gonal/registry.py",
      "id": "carrier_registry_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:read",
        "exposes": "GonalName, get_default, get_mirror, get_private, get_gonal",
        "owner": "Erin Spencer",
        "summary": "per-agent three-gonal triplet resolver \u2014 phi/default, psi/mirror, omega/private"
      },
      "file": "backend/interdependent_lib/gonal/registry.py",
      "id": "carrier_registry"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/gonal/registry.py",
      "id": "carrier_registry_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_DEFAULT_CACHE, _MIRROR_CACHE",
        "module_kind": "service",
        "module_name": "registry",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "GonalName, get_default, get_mirror, get_private, get_gonal, GONAL_NAMES, PRIVATE_GONAL_SPEC_ENV",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "three-gonal registry \u2014 default (EXAMPLE_157), mirror (mirror_of default), private (per-agent built via build_gonal from spec); resolves an agent's per-core gonal triplet",
        "tests": "a0p_skills.contracts.carrier_registry_three_gonals_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/gonal/registry.py",
      "id": "carrier_registry"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure session-transcript -> disk stack; public-fixture disk only, no io/network",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/gonal_stack.py",
      "id": "il_gonal_stack_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "DiskState, CylindricalDiskStack, single_disk, build_disk_stack, GRAIN_LADDER, GEOMETRY_STATUS",
        "owner": "Erin Spencer",
        "summary": "cylindrical disk stack of chapter-scale gonols (UCNS-native embeddings)"
      },
      "file": "backend/interdependent_lib/gonal_stack.py",
      "id": "il_gonal_stack"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.gonal_stack_recompose_holds",
        "class": "correctness",
        "given": "a training session of several utterances",
        "then": "build_disk_stack returns one disk per grain rung (leaf..chapter) each"
      },
      "file": "backend/interdependent_lib/gonal_stack.py",
      "id": "gonal_stack_recompose"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_grain_texts, _grain_gonal, _face_counts, _mean_phase",
        "module_kind": "engine",
        "module_name": "gonal_stack",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "DiskState, CylindricalDiskStack, single_disk, build_disk_stack, GRAIN_LADDER, GEOMETRY_STATUS",
        "rollback": "revert; the training flow loses its cylindrical disk-stack output",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "assemble a cylindrical disk stack of chapter-scale gonols from a training session \u2014 one 157-gonal carrier disk per depth-rung (leaf/157-char, circle/word, seed/phrase-clause, core/utterance, chapter/session), each disk a UCNS-native embedding (ucns_embed) plus the three-core gonal scalars (phi content-phase, omega bone-density, psi unit-circle phase-coherence), stacked along the depth/Z axis (the edcmbone GrainTensor shape). CHAPTER is the new top rung = the unit-circle phase-product (\u22a0 = multiplyFuel) recomposition of the session's per-utterance embeddings into one gonol. Recompose-only (decomposition stays proof-gated); built on the PUBLIC-FIXTURE carrier disk (the canonical 157-gonal disk is non-committable private key material); the cylinder geometry is UCNS-G / non-absolute and inherits NO theorem/proof status from the proven UCNS-A composition algebra.",
        "tests": "a0p_skills.contracts.gonal_stack_recompose_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/gonal_stack.py",
      "id": "il_gonal_stack"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "canonical PCNA inference engine \u2014 5 rings (\u03a6 \u03a8 \u03a9 \u0398 \u03a3) + 2 memory rings on the layered substrate, with PCEA cross-cut and \u03a3 host-integrity observer",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/network/__init__.py",
      "id": "network_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:read",
        "exposes": "NetworkEngine, EngineState, Ring, build_ring, build_all_rings, Tick, TickResult, RingTickResult, CoherenceScore, TamperReport, TamperWatcher, RING_TOPOLOGY, RING_WEIGHTS, RING_ORDER, gather_host_digest, sigma_tensors",
        "owner": "a0p maintainer",
        "summary": "canonical PCNA inference engine \u2014 5 rings (\u03a6 \u03a8 \u03a9 \u0398 \u03a3) + 2 memory rings on the layered substrate, with PCEA cross-cut and \u03a3 host-integrity observer"
      },
      "file": "backend/interdependent_lib/network/__init__.py",
      "id": "network_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.network_engine_heartbeat_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/network/__init__.py",
      "id": "network_engine_heartbeat"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "network",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "NetworkEngine, EngineState, Ring, build_ring, build_all_rings, Tick, TickResult, RingTickResult, CoherenceScore, TamperReport, TamperWatcher, RING_TOPOLOGY, RING_WEIGHTS, RING_ORDER, gather_host_digest, sigma_tensors",
        "rollback": "remove imports from server.py and zfae",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "canonical PCNA inference engine \u2014 5 rings (\u03a6 \u03a8 \u03a9 \u0398 \u03a3) + 2 memory rings on the layered substrate, with PCEA cross-cut and \u03a3 host-integrity observer",
        "tests": "a0p_skills.contracts.network_engine_heartbeat_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/network/__init__.py",
      "id": "network_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "true",
        "auth_boundary": "admin",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "read",
        "summary": "loads the canon CarrierDisk from \u0398's private path; raises CarrierDiskUnavailable if not configured; NEVER falls back",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/network/_theta_private_loader.py",
      "id": "theta_private_loader_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:admin, storage:read, network:none, user_data:none",
        "exposes": "load_canon_disk, CANON_DISK_ENV",
        "owner": "Erin Spencer",
        "summary": "loads the canon CarrierDisk from \u0398's private path; raises CarrierDiskUnavailable if not configured; NEVER falls back"
      },
      "file": "backend/interdependent_lib/network/_theta_private_loader.py",
      "id": "theta_private_loader"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.theta_loader_refuses_no_disk_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/network/_theta_private_loader.py",
      "id": "theta_loader_refuses_no_disk"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "true",
        "auth_boundary": "admin",
        "internal_surface": "_decrypt_and_parse, _validate_canon_invariants",
        "module_kind": "adapter",
        "module_name": "_theta_private_loader",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "load_canon_disk, CANON_DISK_ENV",
        "rollback": "unset A0P_CARRIER_DISK_PATH; \u0398 degrades to public-fixture mode",
        "rollout": "default_enabled",
        "security_note": "this module NEVER holds canon position data inline; NEVER synthesises a fallback; NEVER logs disk contents",
        "storage_boundary": "read",
        "summary": "loads the canon CarrierDisk from \u0398's private path; raises CarrierDiskUnavailable if not configured; NEVER falls back",
        "tests": "a0p_skills.contracts.theta_loader_refuses_no_disk_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/network/_theta_private_loader.py",
      "id": "theta_private_loader"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "EDCM-style coherence scoring \u2014 weights each scored ring's aggregate energy, sums to a total; tracks \u03a3 digest drift as tamper signal (pen-test resistance)",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/network/coherence.py",
      "id": "network_coherence_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "CoherenceScore, TamperReport, score_tick, evaluate_tamper, ring_energy",
        "owner": "a0p maintainer",
        "summary": "EDCM-style coherence scoring \u2014 weights each scored ring's aggregate energy, sums to a total; tracks \u03a3 digest drift as tamper signal (pen-test resistance)"
      },
      "file": "backend/interdependent_lib/network/coherence.py",
      "id": "network_coherence"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.network_coherence_weights_sum_holds",
        "class": "correctness",
        "given": "score_tick(tick_result) applied to a heartbeat",
        "then": "coherence.total == sum(contributions); \u03a3 goes into observer_signal not contributions; every scored ring contributes"
      },
      "file": "backend/interdependent_lib/network/coherence.py",
      "id": "network_coherence_weights_sum"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_normalize",
        "module_kind": "engine",
        "module_name": "coherence",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "CoherenceScore, TamperReport, score_tick, evaluate_tamper, ring_energy",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "EDCM-style coherence scoring \u2014 weights each scored ring's aggregate energy, sums to a total; tracks \u03a3 digest drift as tamper signal (pen-test resistance)",
        "tests": "a0p_skills.contracts.network_coherence_weights_sum_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/network/coherence.py",
      "id": "network_coherence"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "NetworkEngine \u2014 top-level binder for the canonical PCNA inference engine; holds rings, tick state, tamper watcher; supports per-ring N override for tests",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/network/engine.py",
      "id": "network_engine_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "NetworkEngine, EngineState",
        "owner": "a0p maintainer",
        "summary": "NetworkEngine \u2014 top-level binder for the canonical PCNA inference engine; holds rings, tick state, tamper watcher; supports per-ring N override for tests"
      },
      "file": "backend/interdependent_lib/network/engine.py",
      "id": "network_engine"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.network_engine_heartbeat_holds",
        "class": "correctness",
        "given": "NetworkEngine() then heartbeat() twice",
        "then": "tick_count advances 0\u21921\u21922; baseline_digest_hex is 64-char hex; tamper.drifted False on tick with no host change; snapshot() is JSON-shaped"
      },
      "file": "backend/interdependent_lib/network/engine.py",
      "id": "network_engine_heartbeat"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "engine",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "NetworkEngine, EngineState",
        "rollback": "detach ZFAEAgent from NetworkEngine; revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "NetworkEngine \u2014 top-level binder for the canonical PCNA inference engine; holds rings, tick state, tamper watcher; supports per-ring N override for tests",
        "tests": "a0p_skills.contracts.network_engine_heartbeat_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/network/engine.py",
      "id": "network_engine"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "tick advancement \u2014 runs one heartbeat across all rings, applies PCEA `kernel_step` cross-cut between ticks, holds last-state keys",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/network/propagate.py",
      "id": "network_propagate_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "Tick, TickResult, RingTickResult",
        "owner": "a0p maintainer",
        "summary": "tick advancement \u2014 runs one heartbeat across all rings, applies PCEA `kernel_step` cross-cut between ticks, holds last-state keys"
      },
      "file": "backend/interdependent_lib/network/propagate.py",
      "id": "network_propagate"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.network_tick_is_deterministic_holds",
        "class": "correctness",
        "given": "NetworkEngine().heartbeat()",
        "then": "tick_number advances; rings dict has one entry per ring in RING_ORDER; encryption actually changed each ring's aggregate"
      },
      "file": "backend/interdependent_lib/network/propagate.py",
      "id": "network_tick_is_deterministic"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_initial_key",
        "module_kind": "engine",
        "module_name": "propagate",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "Tick, TickResult, RingTickResult",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "tick advancement \u2014 runs one heartbeat across all rings, applies PCEA `kernel_step` cross-cut between ticks, holds last-state keys",
        "tests": "a0p_skills.contracts.network_tick_is_deterministic_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/network/propagate.py",
      "id": "network_propagate"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "ring assembly \u2014 builds a PTCA Core per RingSpec; \u03a3 ring uses host-integrity-derived tensors; supports per-ring N override and lazy construction",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/network/rings.py",
      "id": "network_rings_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "Ring, build_ring, build_all_rings, heptagram_order",
        "owner": "a0p maintainer",
        "summary": "ring assembly \u2014 builds a PTCA Core per RingSpec; \u03a3 ring uses host-integrity-derived tensors; supports per-ring N override and lazy construction"
      },
      "file": "backend/interdependent_lib/network/rings.py",
      "id": "network_rings"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.network_rings_match_topology_holds",
        "class": "correctness",
        "given": "build_all_rings with small per-ring N overrides",
        "then": "every named ring in RING_TOPOLOGY is built, has the override N, exposes a width-53 Tensor aggregate"
      },
      "file": "backend/interdependent_lib/network/rings.py",
      "id": "network_rings_match_topology"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_seed_for_ring",
        "module_kind": "engine",
        "module_name": "rings",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "Ring, build_ring, build_all_rings, heptagram_order",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "ring assembly \u2014 builds a PTCA Core per RingSpec; \u03a3 ring uses host-integrity-derived tensors; supports per-ring N override and lazy construction",
        "tests": "a0p_skills.contracts.network_rings_match_topology_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/network/rings.py",
      "id": "network_rings"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "read",
        "summary": "\u03a3 ring data source \u2014 read-only host-integrity digest over OS files + installed program manifests; provides tamper-evidence baseline (pen-test resistance)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/network/sigma_source.py",
      "id": "network_sigma_source_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "gather_host_digest, sigma_tensors, SIGMA_WATCHED_PATHS, SIGMA_PKG_COMMANDS, HostDigest",
        "owner": "a0p maintainer",
        "summary": "\u03a3 ring data source \u2014 read-only host-integrity digest over OS files + installed program manifests; provides tamper-evidence baseline (pen-test resistance)"
      },
      "file": "backend/interdependent_lib/network/sigma_source.py",
      "id": "network_sigma_source"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.sigma_host_digest_stable_holds",
        "class": "correctness",
        "given": "two immediate calls to gather_host_digest()",
        "then": "the two HostDigest instances carry identical 32-byte digests; paths_scanned > 0"
      },
      "file": "backend/interdependent_lib/network/sigma_source.py",
      "id": "sigma_host_digest_stable"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_digest_path, _digest_command, _MAX_ENTRIES_PER_DIR",
        "module_kind": "adapter",
        "module_name": "sigma_source",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "pen_test_resistance": "drift in any watched file/package/binary changes the digest, advances \u03a3 ring state, surfaces in coherence as observer signal",
        "public_surface": "gather_host_digest, sigma_tensors, SIGMA_WATCHED_PATHS, SIGMA_PKG_COMMANDS, HostDigest",
        "rollback": "revert file; network falls back to deterministic-seed \u03a3",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "\u03a3 ring data source \u2014 read-only host-integrity digest over OS files + installed program manifests; provides tamper-evidence baseline (pen-test resistance)",
        "tests": "a0p_skills.contracts.sigma_host_digest_stable_holds",
        "unresolved": "cadence policy (per-tick vs hourly), watched-path tuning per host, pkg-manager set per distro",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/network/sigma_source.py",
      "id": "network_sigma_source"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "read",
        "summary": "\u0398 microkernel \u2014 hosts the canon carrier disk via private loader; public callers get CarrierDisk or CarrierDiskUnavailable, never inline canon material",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/network/theta_microkernel.py",
      "id": "theta_microkernel_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "ThetaMicrokernel, get_carrier_disk, carrier_disk_signature_only",
        "owner": "Erin Spencer",
        "summary": "\u0398 microkernel \u2014 hosts the canon carrier disk via private loader; public callers get CarrierDisk or CarrierDiskUnavailable, never inline canon material"
      },
      "file": "backend/interdependent_lib/network/theta_microkernel.py",
      "id": "theta_microkernel"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.theta_carrier_disk_access_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/network/theta_microkernel.py",
      "id": "theta_carrier_disk_access"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "doctrine": "per user spec \u2014 disk is canonical point zero; lives in \u0398; bounded drift via fiq motion canon",
        "internal_surface": "_CANON_DISK_CACHE, _PUBLIC_FALLBACK_ENABLED",
        "module_kind": "engine",
        "module_name": "theta_microkernel",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "ThetaMicrokernel, get_carrier_disk, carrier_disk_signature_only",
        "rollback": "detach callers",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "\u0398 microkernel \u2014 hosts the canon carrier disk via private loader; public callers get CarrierDisk or CarrierDiskUnavailable, never inline canon material",
        "tests": "a0p_skills.contracts.theta_carrier_disk_access_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/network/theta_microkernel.py",
      "id": "theta_microkernel"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "ring topology spec \u2014 names, per-ring N (\u03a6 \u03a8 \u03a9 157, \u0398 29, \u03a3 53, MemL 19, MemS 17), heptagram routing slots (lock-step avoidance via unique step+direction), ring weights for coherence scoring",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/network/topology.py",
      "id": "network_topology_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "RingSpec, RING_TOPOLOGY, RING_WEIGHTS, RING_ORDER, SCORED_RING_NAMES, OBSERVER_RING_NAMES, MEMORY_RING_NAMES",
        "owner": "a0p maintainer",
        "summary": "ring topology spec \u2014 names, per-ring N (\u03a6 \u03a8 \u03a9 157, \u0398 29, \u03a3 53, MemL 19, MemS 17), heptagram routing slots (lock-step avoidance via unique step+direction), ring weights for coherence scoring"
      },
      "file": "backend/interdependent_lib/network/topology.py",
      "id": "network_topology"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.network_topology_canonical_holds",
        "class": "provenance",
        "given": "import interdependent_lib.network.topology",
        "then": "per-ring N values match the user spec (\u03a6 \u03a8 \u03a9 157, \u0398 29, \u03a3 53, MemL 19, MemS 17); lock-step avoidance holds (unique heptagram slots); scored weights sum to 1.0"
      },
      "file": "backend/interdependent_lib/network/topology.py",
      "id": "network_topology_canonical"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "schema",
        "module_name": "topology",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "RingSpec, RING_TOPOLOGY, RING_WEIGHTS, RING_ORDER, SCORED_RING_NAMES, OBSERVER_RING_NAMES, MEMORY_RING_NAMES",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "ring topology spec \u2014 names, per-ring N (\u03a6 \u03a8 \u03a9 157, \u0398 29, \u03a3 53, MemL 19, MemS 17), heptagram routing slots (lock-step avoidance via unique step+direction), ring weights for coherence scoring",
        "tests": "a0p_skills.contracts.network_topology_canonical_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/network/topology.py",
      "id": "network_topology"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "prime-circular bijective base encryption over first 53 primes (this state / last state)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/__init__.py",
      "id": "pcea_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "encrypt_state, decrypt_state, PCEAInstance, PRIME_CIRCLE",
        "owner": "a0p maintainer",
        "summary": "prime-circular bijective base encryption over first 53 primes (this state / last state)"
      },
      "file": "backend/interdependent_lib/pcea/__init__.py",
      "id": "pcea_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.pcea_round_trip_53",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/pcea/__init__.py",
      "id": "pcea_round_trip_53"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "pcea",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "encrypt_state, decrypt_state, PCEAInstance, PRIME_CIRCLE",
        "rollback": "remove subpackage; no API surface impact",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "PCEA \u2014 prime-circular bijective base encryption over the first 53 primes, keyed by the previous state (the 'this-state / last-state' cross-cut); the substrate that binds one inference tick to the next and seeds the decoder's deterministic generation",
        "tests": "a0p_skills.contracts.pcea_round_trip_53",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/__init__.py",
      "id": "pcea_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "prime-circular bijective encrypt/decrypt over a previous-state key",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/cipher.py",
      "id": "pcea_cipher_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "encrypt_state, decrypt_state",
        "owner": "a0p maintainer",
        "summary": "prime-circular bijective encrypt/decrypt over a previous-state key"
      },
      "file": "backend/interdependent_lib/pcea/cipher.py",
      "id": "pcea_cipher"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.pcea_round_trip_53",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/pcea/cipher.py",
      "id": "pcea_round_trip_53"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_shift",
        "module_kind": "engine",
        "module_name": "cipher",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "encrypt_state, decrypt_state",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "PCEA core cipher \u2014 prime-circular bijective encrypt/decrypt where each state element is recoded in bijective base-p (p the i-th of the first 53 primes) and circularly shifted by key digits derived from the previous state, so the transform is keyed entirely by last_state and is exactly invertible",
        "tests": "a0p_skills.contracts.pcea_round_trip_53",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/cipher.py",
      "id": "pcea_cipher"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "bijective base-p codec \u2014 digits in {1..p}, plus standard key-digit stream",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/codec.py",
      "id": "pcea_codec_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "to_bijective, from_bijective, key_digits",
        "owner": "a0p maintainer",
        "summary": "bijective base-p codec \u2014 digits in {1..p}, plus standard key-digit stream"
      },
      "file": "backend/interdependent_lib/pcea/codec.py",
      "id": "pcea_codec"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.pcea_round_trip_53",
        "class": "correctness",
        "given": "state of arbitrary non-negative integers and a shared seed",
        "then": "decrypt(encrypt(state)) == state with the same last_state"
      },
      "file": "backend/interdependent_lib/pcea/codec.py",
      "id": "pcea_codec_round_trip"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "codec",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "to_bijective, from_bijective, key_digits",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "bijective base-p codec \u2014 encodes an integer into digits drawn from {1..p} (the bijective numeration that has no leading-zero ambiguity) and back, plus the key-digit stream PCEA shifts by; this is the reversible number representation the cipher operates on",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/codec.py",
      "id": "pcea_codec"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "stateful PCEA instance \u2014 auto-advances last_state per call",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/instance.py",
      "id": "pcea_instance_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "PCEAInstance",
        "owner": "a0p maintainer",
        "summary": "stateful PCEA instance \u2014 auto-advances last_state per call"
      },
      "file": "backend/interdependent_lib/pcea/instance.py",
      "id": "pcea_instance"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.pcea_round_trip_53",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/pcea/instance.py",
      "id": "pcea_round_trip_53"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "instance",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "PCEAInstance",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "stateful PCEA instance \u2014 auto-advances last_state per call",
        "tests": "a0p_skills.contracts.pcea_round_trip_53",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/instance.py",
      "id": "pcea_instance"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "PCEA cross-cut \u2014 \"this state, last state\" kernel runtime encryption operating on Tensor payloads at any layer of the layered model",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/kernel.py",
      "id": "pcea_kernel_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "kernel_step, kernel_invert, kernel_chain, QUANT_SCALE, QUANT_OFFSET",
        "owner": "a0p maintainer",
        "summary": "PCEA cross-cut \u2014 \"this state, last state\" kernel runtime encryption operating on Tensor payloads at any layer of the layered model"
      },
      "file": "backend/interdependent_lib/pcea/kernel.py",
      "id": "pcea_kernel"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.pcea_kernel_advances_state_holds",
        "class": "correctness",
        "given": "kernel_step(t, prev1) and kernel_step(t, prev2) for prev1 != prev2",
        "then": "the two encrypted Tensors differ \u2014 last_state keying is real"
      },
      "file": "backend/interdependent_lib/pcea/kernel.py",
      "id": "pcea_kernel_advances_state"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.pcea_kernel_layer_cross_cut_holds",
        "class": "correctness",
        "given": "kernel_step applied to aggregates from PCTA Circle, PTCA Seed, PTCA Core",
        "then": "each layer's aggregate round-trips through kernel_step / kernel_invert"
      },
      "file": "backend/interdependent_lib/pcea/kernel.py",
      "id": "pcea_kernel_layer_cross_cut"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.pcea_kernel_round_trip_holds",
        "class": "correctness",
        "given": "kernel_step(t, prev) then kernel_invert(enc, prev) using the same `prev`",
        "then": "the recovered Tensor equals the original t exactly"
      },
      "file": "backend/interdependent_lib/pcea/kernel.py",
      "id": "pcea_kernel_round_trip"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "boundary_contract": "PCEA inverts via keys (last_state), not via UCNS inverse operations \u2014 synced from upstream PCEA repo",
        "internal_surface": "_quantize, _dequantize",
        "module_kind": "engine",
        "module_name": "kernel",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "kernel_step, kernel_invert, kernel_chain, QUANT_SCALE, QUANT_OFFSET",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "PCEA cross-cut \u2014 \"this state, last state\" kernel runtime encryption operating on Tensor payloads at any layer of the layered model",
        "tests": "a0p_skills.contracts.pcea_kernel_round_trip_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/kernel.py",
      "id": "pcea_kernel"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "first 53 primes \u2014 the prime circle used by PCEA",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/primes.py",
      "id": "pcea_primes_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "PRIME_CIRCLE",
        "owner": "a0p maintainer",
        "summary": "first 53 primes \u2014 the prime circle used by PCEA"
      },
      "file": "backend/interdependent_lib/pcea/primes.py",
      "id": "pcea_primes"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/pcea/primes.py",
      "id": "pcea_primes_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "schema",
        "module_name": "primes",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "PRIME_CIRCLE",
        "rollback": "constant table; no runtime effect to roll back",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "the first 53 primes \u2014 the fixed prime circle PCEA indexes into, one prime per state position, defining the per-digit modulus for the bijective base-p codec",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcea/primes.py",
      "id": "pcea_primes"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "six-ring inference engine (\u03a6 \u03a8 \u03a9 \u0398 \u03a3 \u0395) \u2014 current impl is simplified; canon topology (61 seeds, six scored rings + \u03a3 observer) rebuild pending",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/__init__.py",
      "id": "pcna_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "PCNAEngine, EDCM, EDCMScores, MemoryCore, zeta_inject, sigma_encode, theta_modulate",
        "owner": "a0p maintainer",
        "summary": "six-ring inference engine (\u03a6 \u03a8 \u03a9 \u0398 \u03a3 \u0395) \u2014 current impl is simplified; canon topology (61 seeds, six scored rings + \u03a3 observer) rebuild pending"
      },
      "file": "backend/interdependent_lib/pcna/__init__.py",
      "id": "pcna_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/pcna/__init__.py",
      "id": "pcna_pkg_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "pcna",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "PCNAEngine, EDCM, EDCMScores, MemoryCore, zeta_inject, sigma_encode, theta_modulate",
        "rollback": "revert subpackage from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "six-ring inference engine (\u03a6 \u03a8 \u03a9 \u0398 \u03a3 \u0395) \u2014 current impl is simplified; canon topology (61 seeds, six scored rings + \u03a3 observer) rebuild pending",
        "tests": "hmmm",
        "unresolved": "canon PCNA topology rebuild pending",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/__init__.py",
      "id": "pcna_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "Energy Dissonance Circuit Model \u2014 CM/DA/DRIFT/DVG/INT/TBF per-tick scoring (canon directives pending wiring)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/edcm.py",
      "id": "pcna_edcm_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "EDCM, EDCMScores",
        "owner": "a0p maintainer",
        "summary": "Energy Dissonance Circuit Model \u2014 CM/DA/DRIFT/DVG/INT/TBF per-tick scoring (canon directives pending wiring)"
      },
      "file": "backend/interdependent_lib/pcna/edcm.py",
      "id": "pcna_edcm"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/pcna/edcm.py",
      "id": "pcna_edcm_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "edcm",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "EDCM, EDCMScores",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "Energy Dissonance Circuit Model \u2014 CM/DA/DRIFT/DVG/INT/TBF per-tick scoring (canon directives pending wiring)",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/edcm.py",
      "id": "pcna_edcm"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "\"all seven together is a tensor\" \u2014 aggregate composition op that lifts 7 Tensors to 1 Tensor (the 8th referent, the projection upward into the next layer)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/group.py",
      "id": "pcna_group_aggregate_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "GROUP_SIZE, aggregate, identity_tensor, is_identity",
        "owner": "a0p maintainer",
        "summary": "\"all seven together is a tensor\" \u2014 aggregate composition op that lifts 7 Tensors to 1 Tensor (the 8th referent, the projection upward into the next layer)"
      },
      "file": "backend/interdependent_lib/pcna/group.py",
      "id": "pcna_group_aggregate"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.pcna_aggregate_deterministic_holds",
        "class": "correctness",
        "given": "aggregate called twice on the same seven tensors",
        "then": "both calls return equal Tensors"
      },
      "file": "backend/interdependent_lib/pcna/group.py",
      "id": "pcna_aggregate_deterministic"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.pcna_aggregate_identity_holds",
        "class": "correctness",
        "given": "aggregate of seven identity (zero) tensors",
        "then": "returns the identity tensor (zero of width 53)"
      },
      "file": "backend/interdependent_lib/pcna/group.py",
      "id": "pcna_aggregate_identity"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.pcna_aggregate_size_holds",
        "class": "correctness",
        "given": "aggregate(7 tensors)",
        "then": "returns one Tensor of width d=53"
      },
      "file": "backend/interdependent_lib/pcna/group.py",
      "id": "pcna_aggregate_size"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "group_size": "7",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "group",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "GROUP_SIZE, aggregate, identity_tensor, is_identity",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "\"all seven together is a tensor\" \u2014 aggregate composition op that lifts 7 Tensors to 1 Tensor (the 8th referent, the projection upward into the next layer)",
        "tests": "a0p_skills.contracts.pcna_aggregate_identity_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/group.py",
      "id": "pcna_group_aggregate"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "dual prime-ring memory \u2014 LT N=19, ST N=17, plus volatile sub-agent caches",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/pcna/memory_core.py",
      "id": "pcna_memory_core_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "MemoryCore",
        "owner": "a0p maintainer",
        "summary": "dual prime-ring memory \u2014 LT N=19, ST N=17, plus volatile sub-agent caches"
      },
      "file": "backend/interdependent_lib/pcna/memory_core.py",
      "id": "pcna_memory_core"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/pcna/memory_core.py",
      "id": "pcna_memory_core_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "memory_core",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "MemoryCore",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "dual prime-ring memory \u2014 LT N=19, ST N=17, plus volatile sub-agent caches",
        "tests": "hmmm",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/pcna/memory_core.py",
      "id": "pcna_memory_core"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "current PCNAEngine impl \u2014 three 157-prime cores + six scalar ring signals (canon target is full 61-seed topology + tensor rings)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/pcna.py",
      "id": "pcna_engine_impl_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "PCNAEngine",
        "owner": "a0p maintainer",
        "summary": "current PCNAEngine impl \u2014 three 157-prime cores + six scalar ring signals (canon target is full 61-seed topology + tensor rings)"
      },
      "file": "backend/interdependent_lib/pcna/pcna.py",
      "id": "pcna_engine_impl"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/pcna/pcna.py",
      "id": "pcna_engine_impl_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "pcna",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "PCNAEngine",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "current PCNAEngine impl \u2014 three 157-prime cores + six scalar ring signals (canon target is full 61-seed topology + tensor rings)",
        "tests": "hmmm",
        "unresolved": "replace with canon 61-seed topology + tensor rings + canonical seed primes",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/pcna.py",
      "id": "pcna_engine_impl"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "substrate signature encoder \u2014 deterministic blake2b digest + band mapping (canon \u03a3 is N=41 observer ring; current impl is scalar shim)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/sigma.py",
      "id": "pcna_sigma_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "sigma_encode, sigma_band",
        "owner": "a0p maintainer",
        "summary": "substrate signature encoder \u2014 deterministic blake2b digest + band mapping (canon \u03a3 is N=41 observer ring; current impl is scalar shim)"
      },
      "file": "backend/interdependent_lib/pcna/sigma.py",
      "id": "pcna_sigma"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/pcna/sigma.py",
      "id": "pcna_sigma_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "sigma",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "sigma_encode, sigma_band",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "substrate signature encoder \u2014 deterministic blake2b digest + band mapping (canon \u03a3 is N=41 observer ring; current impl is scalar shim)",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/sigma.py",
      "id": "pcna_sigma"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "pure deterministic fixed-width scalar payloads; no storage, network, authentication, or user-data side effects",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/tensor.py",
      "id": "pcna_tensor_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "Tensor, TENSOR_DIM, tensor_identity, tensor_compose, payload_width, from_scalar, to_scalar, from_seed, zero, zero_tensor, tensors_equal",
        "owner": "a0p maintainer",
        "summary": "deterministic d=53 leaf tensors with compatibility constructors, identity, composition, energy, equality, and scalar conversion"
      },
      "file": "backend/interdependent_lib/pcna/tensor.py",
      "id": "pcna_tensor"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_stretch_payload",
        "module_kind": "core",
        "module_name": "tensor",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "Tensor, TENSOR_DIM, tensor_identity, tensor_compose, payload_width, from_scalar, to_scalar, from_seed, zero, zero_tensor, tensors_equal",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "PCNA leaf tensor \u2014 fixed d=53 scalar payload with both the current layered-construction API and the pre-existing Tensor compatibility contract used by ZFAE, PCEA, and PCNA callers.",
        "tests": "a0p_skills.contracts.pcna_tensor_shape_holds, a0p_skills.contracts.pcna_tensor_roundtrip, a0p_skills.contracts.pcna_tensor_deterministic",
        "unresolved": "hmmm (full higher-layer non-commutative composition and double-cover semantics remain separate from this commutative leaf)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/tensor.py",
      "id": "pcna_tensor"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "phase-modulation ring \u2014 bounded sinusoidal map over 7 phase bands (canon \u0398 is N=29 microkernel gate; pending tensor lift)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/theta.py",
      "id": "pcna_theta_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "theta_modulate",
        "owner": "a0p maintainer",
        "summary": "phase-modulation ring \u2014 bounded sinusoidal map over 7 phase bands (canon \u0398 is N=29 microkernel gate; pending tensor lift)"
      },
      "file": "backend/interdependent_lib/pcna/theta.py",
      "id": "pcna_theta"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/pcna/theta.py",
      "id": "pcna_theta_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "theta",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "theta_modulate",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "phase-modulation ring \u2014 bounded sinusoidal map over 7 phase bands (canon \u0398 is N=29 microkernel gate; pending tensor lift)",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/theta.py",
      "id": "pcna_theta"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "zeta-injection ring \u2014 harmonic LT/ST/SUB memory mix + alpha-echo resonance",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/zeta.py",
      "id": "pcna_zeta_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "zeta_inject, harmonic_resonance, echo",
        "owner": "a0p maintainer",
        "summary": "zeta-injection ring \u2014 harmonic LT/ST/SUB memory mix + alpha-echo resonance"
      },
      "file": "backend/interdependent_lib/pcna/zeta.py",
      "id": "pcna_zeta"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/pcna/zeta.py",
      "id": "pcna_zeta_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_harmonic_weight",
        "module_kind": "engine",
        "module_name": "zeta",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "zeta_inject, harmonic_resonance, echo",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "zeta-injection ring \u2014 harmonic LT/ST/SUB memory mix + alpha-echo resonance",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcna/zeta.py",
      "id": "pcna_zeta"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "PCTA \u2014 circle layer of the layered model; 7 PCNA tensors arranged on a {7/2} heptagram, wrapped in a UCNS structural mirror",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcta/__init__.py",
      "id": "pcta_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "Circle, CIRCLE_SIZE, HEPTAGRAM_STEP_CIRCLE, heptagram_walk, heptagram_walk_7_2, heptagram_walk_7_3",
        "owner": "a0p maintainer",
        "summary": "PCTA \u2014 circle layer of the layered model; 7 PCNA tensors arranged on a {7/2} heptagram, wrapped in a UCNS structural mirror"
      },
      "file": "backend/interdependent_lib/pcta/__init__.py",
      "id": "pcta_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.pcta_circle_holds_seven_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/pcta/__init__.py",
      "id": "pcta_circle_holds_seven"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "pcta",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "Circle, CIRCLE_SIZE, HEPTAGRAM_STEP_CIRCLE, heptagram_walk, heptagram_walk_7_2, heptagram_walk_7_3",
        "rollback": "revert subpackage from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "PCTA \u2014 circle layer of the layered model; 7 PCNA tensors arranged on a {7/2} heptagram, wrapped in a UCNS structural mirror",
        "tests": "a0p_skills.contracts.pcta_circle_holds_seven_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcta/__init__.py",
      "id": "pcta_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "PCTA circle \u2014 exactly 7 PCNA tensors per circle; circle itself acts as a tensor at this layer (recursive)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcta/circle.py",
      "id": "pcta_circle_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "Circle, circle_identity, circle_compose, heptagram_compose, tensor_count, from_tensors, from_seed, aggregate, ucns_shape, heptagram_order",
        "owner": "a0p maintainer",
        "summary": "PCTA circle layer \u2014 7-tensor UCNS aggregate with {7/2} heptagram routing"
      },
      "file": "backend/interdependent_lib/pcta/circle.py",
      "id": "pcta_circle"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_validate_seven, _circle_ucns_shape",
        "module_kind": "core",
        "module_name": "circle",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "Circle, circle_identity, circle_compose, heptagram_compose, tensor_count, from_tensors, from_seed, aggregate, ucns_shape, heptagram_order",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "PCTA circle \u2014 UCNS object carrying exactly 7 PCNA leaf tensors. {7/2} heptagram composition. Manifest-first. F4: 157/7/7/53 is public load-bearing canon (no decoupling).",
        "tests": "a0p_skills.contracts.pcta_circle_shape_holds, a0p_skills.contracts.pcta_circle_heptagram, a0p_skills.contracts.pcta_circle_holds_seven_holds, a0p_skills.contracts.pcta_circle_aggregate_is_tensor_holds",
        "unresolved": "hmmm (full non-commutativity + R/4\u03c0Z double-cover enforcement pending gonal remediation; current heptagram is structural)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/pcta/circle.py",
      "id": "pcta_circle"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "seeds-layer wrapper \u2014 re-exports current PTCAInstance plus prime utilities (canon stratified prime_core rebuild pending)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/__init__.py",
      "id": "ptca_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "PTCAInstance, PrimeTensor, SentinelChannel, hash_state, exchange, first_n_primes, PRIMES_FIRST_N",
        "owner": "a0p maintainer",
        "summary": "seeds-layer wrapper \u2014 re-exports current PTCAInstance plus prime utilities (canon stratified prime_core rebuild pending)"
      },
      "file": "backend/interdependent_lib/ptca/__init__.py",
      "id": "ptca_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.ptca_canon_shape_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/ptca/__init__.py",
      "id": "ptca_canon_shape"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "ptca",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "PTCAInstance, PrimeTensor, SentinelChannel, hash_state, exchange, first_n_primes, PRIMES_FIRST_N",
        "rollback": "revert subpackage from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "seeds-layer wrapper \u2014 re-exports current PTCAInstance plus prime utilities (canon stratified prime_core rebuild pending)",
        "tests": "a0p_skills.contracts.ptca_canon_shape_holds",
        "unresolved": "9-axis from design conversation not present in upstream prime_core; awaiting clarification",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/__init__.py",
      "id": "ptca_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "canon PTCA composition counts \u2014 synced from The-Interdependency/PTCA/prime_core/constants.py",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/constants.py",
      "id": "ptca_constants_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "SEED_COUNT, CIRCLES_PER_SEED, TENSORS_PER_CIRCLE, TENSOR_DIM, TENSOR_LEAVES, PARAM_COUNT, CIRCLE_ROUTING_STEP, SEED_ROUTING_STEP, COHERENCE_FACTOR_UNIVERSE, is_coherence_prime",
        "owner": "a0p maintainer",
        "summary": "canon PTCA composition counts \u2014 synced from The-Interdependency/PTCA/prime_core/constants.py"
      },
      "file": "backend/interdependent_lib/ptca/constants.py",
      "id": "ptca_constants"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.ptca_canon_shape_holds",
        "class": "provenance",
        "given": "import interdependent_lib.ptca.constants",
        "then": "SEED_COUNT=157, CIRCLES_PER_SEED=7, TENSORS_PER_CIRCLE=7, TENSOR_DIM=53, TENSOR_LEAVES=7693, PARAM_COUNT=407_729"
      },
      "file": "backend/interdependent_lib/ptca/constants.py",
      "id": "ptca_canon_shape"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_is_prime, _prime_factors",
        "module_kind": "schema",
        "module_name": "constants",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "SEED_COUNT, CIRCLES_PER_SEED, TENSORS_PER_CIRCLE, TENSOR_DIM, TENSOR_LEAVES, PARAM_COUNT, CIRCLE_ROUTING_STEP, SEED_ROUTING_STEP, COHERENCE_FACTOR_UNIVERSE, is_coherence_prime",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "canon PTCA composition counts \u2014 synced from The-Interdependency/PTCA/prime_core/constants.py",
        "tests": "a0p_skills.contracts.ptca_canon_shape_holds",
        "unresolved": "9-axis from design conversation; coherence-prime universe is provisional per upstream",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/constants.py",
      "id": "ptca_constants"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "PTCA Core \u2014 N seeds (157 canon for primary rings); core itself is a tensor",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/core.py",
      "id": "ptca_core_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "Core, with_n, from_seeds, aggregate, param_count, ucns_shape, n, label",
        "owner": "a0p maintainer",
        "summary": "PTCA Core layer \u2014 N-seed UCNS aggregate (N=157 public canon)"
      },
      "file": "backend/interdependent_lib/ptca/core.py",
      "id": "ptca_core"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_core_ucns_shape",
        "module_kind": "core",
        "module_name": "core",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "Core, with_n, from_seeds, aggregate, param_count, ucns_shape, n, label",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "PTCA Core \u2014 N=157 seeds (public canon) + aggregate. F4 ratified: 157 is load-bearing public canon, no decoupling. Manifest-first.",
        "tests": "a0p_skills.contracts.ptca_core_assembles_157_holds, a0p_skills.contracts.ptca_core_aggregate_is_tensor_holds, a0p_skills.contracts.ptca_core_param_count_matches_canon_holds",
        "unresolved": "hmmm (network layer + full non-commutativity/double-cover tests pending)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/core.py",
      "id": "ptca_core"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "deterministic prime-circular state-exchange protocol",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/exchange.py",
      "id": "ptca_exchange_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "exchange",
        "owner": "a0p maintainer",
        "summary": "deterministic prime-circular state-exchange protocol"
      },
      "file": "backend/interdependent_lib/ptca/exchange.py",
      "id": "ptca_exchange"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/ptca/exchange.py",
      "id": "ptca_exchange_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "exchange",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "exchange",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "deterministic prime-circular state-exchange protocol \u2014 advances a PTCA state against a counterpart using the prime circle so two engines can hand state back and forth reproducibly, with no randomness and a verifiable round-trip",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/exchange.py",
      "id": "ptca_exchange"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "PTCA engine \u2014 binds the canon stratified [N,7,7,53] PrimeTensor with sentinel channels + lineage hashing",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/instance.py",
      "id": "ptca_instance_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "PTCAInstance",
        "owner": "a0p maintainer",
        "summary": "PTCA engine \u2014 binds the canon stratified [N,7,7,53] PrimeTensor with sentinel channels + lineage hashing"
      },
      "file": "backend/interdependent_lib/ptca/instance.py",
      "id": "ptca_instance"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/ptca/instance.py",
      "id": "ptca_instance_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "instance",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "PTCAInstance",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "PTCA engine \u2014 binds the canon stratified [N,7,7,53] PrimeTensor with sentinel channels + lineage hashing",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/instance.py",
      "id": "ptca_instance"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "prime generator + first-N prime cache (default capacity 200, supports PTCA N=157)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/primes.py",
      "id": "ptca_primes_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "first_n_primes, PRIMES_FIRST_N",
        "owner": "a0p maintainer",
        "summary": "prime generator + first-N prime cache (default capacity 200, supports PTCA N=157)"
      },
      "file": "backend/interdependent_lib/ptca/primes.py",
      "id": "ptca_primes"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/ptca/primes.py",
      "id": "ptca_primes_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_is_prime",
        "module_kind": "schema",
        "module_name": "primes",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "first_n_primes, PRIMES_FIRST_N",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "prime generator + first-N prime cache (default capacity 200, supports PTCA N=157)",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/primes.py",
      "id": "ptca_primes"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "deterministic SHA-256 provenance hashing for tensor ops + lineage chains",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/provenance.py",
      "id": "ptca_provenance_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "hash_state",
        "owner": "a0p maintainer",
        "summary": "deterministic SHA-256 provenance hashing for tensor ops + lineage chains"
      },
      "file": "backend/interdependent_lib/ptca/provenance.py",
      "id": "ptca_provenance"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/ptca/provenance.py",
      "id": "ptca_provenance_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "provenance",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "hash_state",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "deterministic SHA-256 provenance hashing for tensor ops + lineage chains",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/provenance.py",
      "id": "ptca_provenance"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "PTCA Seed \u2014 7 circles per seed; seed itself is a tensor at this layer",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/seed.py",
      "id": "ptca_seed_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "Seed, seed_identity, seed_compose, from_circles, from_seed, aggregate, ucns_shape, heptagram_order, param_count",
        "owner": "a0p maintainer",
        "summary": "PTCA Seed layer \u2014 7-circle UCNS aggregate with {7/3} heptagram"
      },
      "file": "backend/interdependent_lib/ptca/seed.py",
      "id": "ptca_seed"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_seed_ucns_shape",
        "module_kind": "core",
        "module_name": "seed",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "Seed, seed_identity, seed_compose, from_circles, from_seed, aggregate, ucns_shape, heptagram_order, param_count",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "PTCA Seed \u2014 UCNS object carrying exactly 7 PCTA circles. {7/3} heptagram. F4: 157/7/7/53 public canon (no decoupling). Manifest-first.",
        "tests": "a0p_skills.contracts.ptca_seed_shape_holds, a0p_skills.contracts.ptca_seed_heptagram, a0p_skills.contracts.ptca_seed_holds_seven_holds, a0p_skills.contracts.ptca_seed_aggregate_is_tensor_holds",
        "unresolved": "hmmm (non-commutativity + double-cover lift pending gonal remediation)",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/seed.py",
      "id": "ptca_seed"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "tagged signal lanes with priority ordering \u2014 SentinelChannel + SentinelMessage",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/sentinels.py",
      "id": "ptca_sentinels_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "SentinelChannel, SentinelMessage",
        "owner": "a0p maintainer",
        "summary": "tagged signal lanes with priority ordering \u2014 SentinelChannel + SentinelMessage"
      },
      "file": "backend/interdependent_lib/ptca/sentinels.py",
      "id": "ptca_sentinels"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/ptca/sentinels.py",
      "id": "ptca_sentinels_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "sentinels",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "SentinelChannel, SentinelMessage",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "tagged signal lanes with priority ordering \u2014 SentinelChannel + SentinelMessage",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/sentinels.py",
      "id": "ptca_sentinels"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "canon stratified prime-indexed tensor \u2014 shape [N,7,7,53] (seed \u00d7 circle \u00d7 tensor \u00d7 payload), N\u00d77\u00d77\u00d753 leaves matching PTCA prime_core PARAM_COUNT",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/tensor.py",
      "id": "ptca_tensor_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "PrimeTensor",
        "owner": "a0p maintainer",
        "summary": "canon stratified prime-indexed tensor \u2014 shape [N,7,7,53] (seed \u00d7 circle \u00d7 tensor \u00d7 payload), N\u00d77\u00d77\u00d753 leaves matching PTCA prime_core PARAM_COUNT"
      },
      "file": "backend/interdependent_lib/ptca/tensor.py",
      "id": "ptca_tensor"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.ptca_tensor_canon_shape_holds",
        "class": "correctness",
        "given": "PrimeTensor(157) built on the canon stratification",
        "then": "shape == [157,7,7,53] and param_count == 407_729 (PTCA prime_core PARAM_COUNT); set/get round-trips"
      },
      "file": "backend/interdependent_lib/ptca/tensor.py",
      "id": "ptca_tensor_canon_shape"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/ptca/tensor.py",
      "id": "ptca_tensor_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "tensor",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "PrimeTensor",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "canon stratified prime-indexed tensor \u2014 shape [N,7,7,53] (seed \u00d7 circle \u00d7 tensor \u00d7 payload); the Fiq\u2192Circle\u2192Seed model from prime_core, N\u00d77\u00d77\u00d753 leaves (407,729 for N=157) matching PTCA prime_core PARAM_COUNT",
        "tests": "a0p_skills.contracts.ptca_tensor_canon_shape_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ptca/tensor.py",
      "id": "ptca_tensor"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "thin A0-safe wrapper around the ucns package \u2014 will route through ucns.a0_safe when v1.0 ships on PyPI",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ucns_bridge.py",
      "id": "ucns_bridge_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "is_unit, multiply, object_record, describe, seq_prime_safe, UNIT, has_a0_safe_facade",
        "owner": "a0p maintainer",
        "summary": "thin A0-safe wrapper around the ucns package \u2014 will route through ucns.a0_safe when v1.0 ships on PyPI"
      },
      "file": "backend/interdependent_lib/ucns_bridge.py",
      "id": "ucns_bridge"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.ucns_bridge_unit_holds",
        "class": "correctness",
        "given": "bridge.UNIT and bridge.is_unit",
        "then": "is_unit(UNIT) is True and the unit identity has the canonical ucns shape"
      },
      "file": "backend/interdependent_lib/ucns_bridge.py",
      "id": "ucns_bridge_unit_consistency"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_A0_SAFE_AVAILABLE",
        "module_kind": "adapter",
        "module_name": "ucns_bridge",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "is_unit, multiply, left_quotient, right_quotient, object_record, describe, seq_prime_safe, UNIT, UCNSObject, lcm, has_a0_safe_facade",
        "rollback": "remove module and call sites",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "thin A0-safe wrapper around the ucns package \u2014 will route through ucns.a0_safe when v1.0 ships on PyPI",
        "tests": "a0p_skills.contracts.ucns_bridge_unit_holds",
        "ucns_version_pin": "0.8.3",
        "unresolved": "switch to `from ucns import a0_safe` when PyPI publishes v1.0",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/ucns_bridge.py",
      "id": "ucns_bridge"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "text -> unit-circle phase streams; non-commutative compose + tests",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/ucns_embed.py",
      "id": "il_ucns_embed_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "UCNSNativeEmbedding, embed_text, phase_compose, UCNS_CARRIER_ARITY, EMBED_LANES",
        "owner": "a0p maintainer",
        "summary": "UCNS-native phase-stream embedding with non-commutative composition and tests"
      },
      "file": "backend/interdependent_lib/ucns_embed.py",
      "id": "il_ucns_embed"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_lane_values, _bone_skeleton",
        "module_kind": "adapter",
        "module_name": "ucns_embed",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "UCNSNativeEmbedding, embed_text, phase_compose, UCNS_CARRIER_ARITY, EMBED_LANES",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "UCNS-native phase-stream embedding with FULL non-commutative composition + self-contained contract tests. F6 complete.",
        "tests": "a0p_skills.contracts.ucns_embed_deterministic_holds, a0p_skills.contracts.ucns_embed_noncommutative_holds, a0p_skills.contracts.ucns_embed_double_cover_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/ucns_embed.py",
      "id": "il_ucns_embed"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "a0(ZFAE) \u2014 the inference provider, not an agent label. Exposes A0ZFAEInferenceEngine (native deterministic), plus the legacy ZFAEAgent persona for backward-compat with prior PCNAEngine wiring",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/__init__.py",
      "id": "zfae_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "A0ZFAEInferenceEngine, ENGINE, infer, InferenceResult, MISSING_NATIVE_MESSAGE, ZFAEAgent",
        "owner": "a0p maintainer",
        "summary": "a0(ZFAE) \u2014 the inference provider, not an agent label. Exposes A0ZFAEInferenceEngine (native deterministic), plus the legacy ZFAEAgent persona for backward-compat with prior PCNAEngine wiring"
      },
      "file": "backend/interdependent_lib/zfae/__init__.py",
      "id": "zfae_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_engine_native_only_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/__init__.py",
      "id": "zfae_engine_native_only"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "zfae",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "A0ZFAEInferenceEngine, ENGINE, infer, InferenceResult, MISSING_NATIVE_MESSAGE, ZFAEAgent",
        "rollback": "remove imports from server.py /api/chat/zfae route",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "a0(ZFAE) \u2014 the inference provider, not an agent label. Exposes A0ZFAEInferenceEngine (native deterministic), plus the legacy ZFAEAgent persona for backward-compat with prior PCNAEngine wiring",
        "tests": "a0p_skills.contracts.zfae_engine_native_only_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/__init__.py",
      "id": "zfae_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "native template/grammar decoder \u2014 emits assistantText from (intent, features, state) using a small fixed grammar; no LLM dependency",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/_decoder.py",
      "id": "zfae_template_decoder_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "TemplateGrammarDecoder, render, MISSING_DECODER_MESSAGE",
        "owner": "a0p maintainer",
        "summary": "native template/grammar decoder \u2014 emits assistantText from (intent, features, state) using a small fixed grammar; no LLM dependency"
      },
      "file": "backend/interdependent_lib/zfae/_decoder.py",
      "id": "zfae_template_decoder"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_decoder_native_only_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/_decoder.py",
      "id": "zfae_decoder_native_only"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_TEMPLATES, _format_keywords, _format_energy",
        "module_kind": "engine",
        "module_name": "_decoder",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "TemplateGrammarDecoder, decode, render, MISSING_DECODER_MESSAGE",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "native energy-conditioned decoder \u2014 composes assistantText as a deterministic function of (intent, features, \u03a6/\u03a8/\u03a9/\u03b8/\u03c3 energy state); RNG seeded from blake2b(state) so identical state \u2192 identical text; render() retained as named single-sentence fallback; no LLM dependency",
        "tests": "a0p_skills.contracts.zfae_decoder_native_only_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/_decoder.py",
      "id": "zfae_template_decoder"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "deterministic intent selector \u2014 maps (SemanticFeatures, ZFAE state) \u2192 one of a small fixed intent label set; pure function",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/zfae/_intent.py",
      "id": "zfae_intent_selector_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "select_intent, INTENT_LABELS, IntentLabel",
        "owner": "a0p maintainer",
        "summary": "deterministic intent selector \u2014 maps (SemanticFeatures, ZFAE state) \u2192 one of a small fixed intent label set; pure function"
      },
      "file": "backend/interdependent_lib/zfae/_intent.py",
      "id": "zfae_intent_selector"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_intent_dispatch_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/_intent.py",
      "id": "zfae_intent_dispatch"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "engine",
        "module_name": "_intent",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "select_intent, INTENT_LABELS, IntentLabel",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "deterministic intent selector \u2014 maps (SemanticFeatures, ZFAE state) \u2192 one of a small fixed intent label set; pure function",
        "tests": "a0p_skills.contracts.zfae_intent_dispatch_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/zfae/_intent.py",
      "id": "zfae_intent_selector"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "deterministic prompt parser \u2014 token stats, intent surfaces (question, greeting, command, reflection), semantic load",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/_parser.py",
      "id": "zfae_semantic_parser_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "parse_semantic, SemanticFeatures",
        "owner": "a0p maintainer",
        "summary": "deterministic prompt parser \u2014 token stats, intent surfaces (question, greeting, command, reflection), semantic load"
      },
      "file": "backend/interdependent_lib/zfae/_parser.py",
      "id": "zfae_semantic_parser"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_parser_deterministic_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/_parser.py",
      "id": "zfae_parser_deterministic"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_GREETING_TOKENS, _COMMAND_HEADS, _REFLECTION_WORDS, _NEGATION_WORDS",
        "module_kind": "engine",
        "module_name": "_parser",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "parse_semantic, SemanticFeatures",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "deterministic prompt parser \u2014 token stats, intent surfaces (question, greeting, command, reflection), semantic load",
        "tests": "a0p_skills.contracts.zfae_parser_deterministic_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/_parser.py",
      "id": "zfae_semantic_parser"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "ZFAE transition rules \u2014 folds semantic features into \u03a6/\u03a8/\u03a9 ring snapshots via PCEA kernel cross-cut; produces nextSnapshot",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/_transition.py",
      "id": "zfae_state_transition_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "bind_features_to_rings, advance_zfae_state, snapshot_after, ZFAE_RING_NAMES",
        "owner": "a0p maintainer",
        "summary": "ZFAE transition rules \u2014 folds semantic features into \u03a6/\u03a8/\u03a9 ring snapshots via PCEA kernel cross-cut; produces nextSnapshot"
      },
      "file": "backend/interdependent_lib/zfae/_transition.py",
      "id": "zfae_state_transition"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_transition_deterministic_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/_transition.py",
      "id": "zfae_transition_deterministic"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_feature_tensor_for, _intent_hash",
        "module_kind": "engine",
        "module_name": "_transition",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "bind_features_to_rings, advance_zfae_state, snapshot_after, ZFAE_RING_NAMES",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "ZFAE transition rules \u2014 folds semantic features into \u03a6/\u03a8/\u03a9 ring snapshots via PCEA kernel cross-cut; produces nextSnapshot",
        "tests": "a0p_skills.contracts.zfae_transition_deterministic_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/_transition.py",
      "id": "zfae_state_transition"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "ZFAE archive \u2014 per-agent training records JSONL + per-session ephemeral chat archive with char-compress output shape",
        "user_data_boundary": "write"
      },
      "file": "backend/interdependent_lib/zfae/archive.py",
      "id": "zfae_archive_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:none, user_data:write",
        "exposes": "append_training_record, iter_records, archive_session, archive_path_for, training_records_path_for",
        "owner": "Erin Spencer",
        "summary": "ZFAE archive \u2014 per-agent training records JSONL + per-session ephemeral chat archive with char-compress output shape"
      },
      "file": "backend/interdependent_lib/zfae/archive.py",
      "id": "zfae_archive"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_archive_appends_jsonl_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/archive.py",
      "id": "zfae_archive_appends_jsonl"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_ensure_dir",
        "module_kind": "service",
        "module_name": "archive",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "append_training_record, iter_records, archive_session, archive_path_for, training_records_path_for",
        "rollback": "stop appending; existing archive preserved",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "ZFAE archive \u2014 per-agent training records JSONL + per-session ephemeral chat archive with char-compress output shape",
        "tests": "a0p_skills.contracts.zfae_archive_appends_jsonl_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/interdependent_lib/zfae/archive.py",
      "id": "zfae_archive"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure data + predicates over morphological token classes; no IO, no globals, no LLM",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/closed_tokens.py",
      "id": "zfae_closed_tokens_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "CLOSED_CLASS, AFFIXES, is_closed_class, is_affix, is_open_class",
        "owner": "Erin Spencer",
        "summary": "closed-class + affix inventories and membership predicates for the morphological gonal stack"
      },
      "file": "backend/interdependent_lib/zfae/closed_tokens.py",
      "id": "zfae_closed_tokens"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_closed_tokens_partition_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/closed_tokens.py",
      "id": "zfae_closed_tokens_partition"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "hmmm": "the seed inventories below are an initial English bone/affix set \u2014 load-bearing as the structural (omega) vocabulary, owner-extendable; not exhaustive",
        "internal_surface": "_PREFIXES, _SUFFIXES",
        "module_kind": "schema",
        "module_name": "closed_tokens",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "CLOSED_CLASS, AFFIXES, is_closed_class, is_affix, is_open_class, strip_affixes",
        "rollback": "revert file from git",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "morphological bone inventory \u2014 the closed-class word set + bound-morpheme (affix) set the BoneGonal (omega) sources its structural vertices from; the open-class test is the complement used by the RootGonal (phi)",
        "tests": "a0p_skills.contracts.zfae_closed_tokens_partition_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/closed_tokens.py",
      "id": "zfae_closed_tokens"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "internal",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "writes hash-chained docs to fiq_audit_log; reads only the most recent prev_hash",
        "user_data_boundary": "write"
      },
      "file": "backend/interdependent_lib/zfae/fiq_emit.py",
      "id": "zfae_fiq_emit_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:internal, user_data:write",
        "exposes": "emit, ZFAE_EVENT_TYPES",
        "owner": "Erin Spencer",
        "summary": "append ZFAE provenance events with blake2b prev_hash chain"
      },
      "file": "backend/interdependent_lib/zfae/fiq_emit.py",
      "id": "zfae_fiq_emit"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_fiq_emit_chains_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/fiq_emit.py",
      "id": "zfae_fiq_emit_chains"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_chain_hash, _last_hash",
        "module_kind": "service",
        "module_name": "fiq_emit",
        "network_boundary": "internal",
        "owner": "Erin Spencer",
        "public_surface": "emit, ZFAE_EVENT_TYPES",
        "rollback": "drop calls; fiq_audit_log loses zfae provenance",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "ZFAE-level provenance emitter \u2014 appends hash-chained zfae_* events (training_step, chat_reply, sentinel_verdict, override_created, override_resolved) to fiq_audit_log",
        "tests": "a0p_skills.contracts.zfae_fiq_emit_chains_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/interdependent_lib/zfae/fiq_emit.py",
      "id": "zfae_fiq_emit"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure deterministic inscription; no IO, no globals, no LLM",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/zfae/gonal_inscription.py",
      "id": "zfae_gonal_inscription_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "PrivateGonal, inscribe_text, whiten_payload, whitened_indices",
        "owner": "Erin Spencer",
        "summary": "continuous-tensor \u2192 glyph inscription through a per-agent PrivateGonal"
      },
      "file": "backend/interdependent_lib/zfae/gonal_inscription.py",
      "id": "zfae_gonal_inscription"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_gonal_inscription_deterministic_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/gonal_inscription.py",
      "id": "zfae_gonal_inscription_deterministic"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_WHITEN_SCALE",
        "module_kind": "engine",
        "module_name": "gonal_inscription",
        "network_boundary": "none",
        "no_llm_assertion": "pure mathematical inscription; MUST NOT import any provider/LLM SDK",
        "owner": "Erin Spencer",
        "public_surface": "PrivateGonal, inscribe_text, whiten_payload, whitened_indices, BRIDGE_IN_WIDTH, BRIDGE_OUT_WIDTH, DEFAULT_INSCRIBE_LENGTH",
        "rollback": "decoder falls back to Route B (template compositor) when no PrivateGonal present",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "ZFAE Native Decoder Route A \u2014 Gonal Inscription. A per-agent PrivateGonal (secret phase + permutation, seeded at instantiation) inscribes the continuous \u03a6/\u03a8/\u03a9 tensor field onto polygon vertices to compose a deterministic glyph stream; includes the hash-whitened 53\u219232 bridge",
        "tests": "a0p_skills.contracts.zfae_gonal_inscription_deterministic_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/zfae/gonal_inscription.py",
      "id": "zfae_gonal_inscription"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "a0(ZFAE) inference engine \u2014 native deterministic symbolic/state engine; no LLM dependency; returns {assistantText, nextSnapshot, trace}",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/inference.py",
      "id": "zfae_inference_engine_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "A0ZFAEInferenceEngine, InferenceResult, MISSING_NATIVE_MESSAGE",
        "owner": "a0p maintainer",
        "summary": "a0(ZFAE) inference engine \u2014 native deterministic symbolic/state engine; no LLM dependency; returns {assistantText, nextSnapshot, trace}"
      },
      "file": "backend/interdependent_lib/zfae/inference.py",
      "id": "zfae_inference_engine"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_engine_native_only_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/inference.py",
      "id": "zfae_engine_native_only"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_engine_emits_pcea_digest_and_tensors_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/inference.py",
      "id": "zfae_engine_route_a_emits_decode"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_coerce_snapshot, _coerce_rings, _energy_or_none, _make_trace, _memory_count",
        "module_kind": "engine",
        "module_name": "inference",
        "network_boundary": "none",
        "no_llm_assertion": "this module MUST NOT import from interdependent_lib.providers or any LLM SDK; CONTRACTS pin the assertion",
        "owner": "a0p maintainer",
        "public_surface": "A0ZFAEInferenceEngine, InferenceResult, MISSING_NATIVE_MESSAGE",
        "rollback": "detach chat route from engine and revert",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "a0(ZFAE) inference engine \u2014 native deterministic symbolic/state engine; no LLM dependency; returns {assistantText, nextSnapshot, trace}",
        "tests": "a0p_skills.contracts.zfae_engine_native_only_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/inference.py",
      "id": "zfae_inference_engine"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "read",
        "summary": "reads the living spec once and caches a deterministic digest; no writes, no network",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/zfae/long_memory.py",
      "id": "zfae_long_memory_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:none",
        "exposes": "canon_summary, reset_cache",
        "owner": "Erin Spencer",
        "summary": "cached living-spec canon summary for ZFAE long-term memory"
      },
      "file": "backend/interdependent_lib/zfae/long_memory.py",
      "id": "zfae_long_memory"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/zfae/long_memory.py",
      "id": "zfae_long_memory_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_CANON_CACHE",
        "module_kind": "service",
        "module_name": "long_memory",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "canon_summary, reset_cache",
        "rollback": "revert file; engine carries an empty canon",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "a0 long-term memory canon \u2014 folds the repo's living spec (every MODULE_BUILD block) into a cached deterministic summary the ZFAE engine carries on every inference, so the agent \"queries itself\"",
        "tests": "a0p_skills.contracts.module_imports_cleanly_holds",
        "user_data_boundary": "none"
      },
      "file": "backend/interdependent_lib/zfae/long_memory.py",
      "id": "zfae_long_memory"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure deterministic morphology; reuses the UCNS carrier-LCM operator; no IO, no globals, no LLM",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/morphology.py",
      "id": "zfae_morphology_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "BoneGonal, RootGonal, carrier_lcm, compose_word, word_signal, decompose_clause",
        "owner": "Erin Spencer",
        "summary": "typed gonal primitives (bone/root) + carrier-LCM word composition + gated clause decomposition"
      },
      "file": "backend/interdependent_lib/zfae/morphology.py",
      "id": "zfae_morphology"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_morphology_carrier_lcm_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/morphology.py",
      "id": "zfae_morphology_carrier_lcm"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_morphology_decompose_gated_holds",
        "class": "correctness",
        "given": "PROOF_GREEN is False (multiply_left_cancellative not yet discharged)",
        "then": "decompose_clause refuses with DecompositionGatedError"
      },
      "file": "backend/interdependent_lib/zfae/morphology.py",
      "id": "zfae_morphology_decompose_gated"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "hmmm": "the continuous-lane \u2192 UCNSObject carrier encoding is an inferred deterministic bridge (lane value \u2192 bounded Fraction angle \u2192 length-1 carrier); the morphology and arithmetic share the one carrier-LCM operator",
        "internal_surface": "_FRAME_DENOMS, _denom_for, _num_for",
        "module_kind": "engine",
        "module_name": "morphology",
        "network_boundary": "none",
        "no_llm_assertion": "pure mathematical morphology; MUST NOT import any provider/LLM SDK",
        "owner": "Erin Spencer",
        "public_surface": "BoneGonal, RootGonal, OMEGA_WEIGHT, PHI_WEIGHT, PSI_WEIGHT, carrier_lcm, frame_value, compose_word, word_signal, word_carrier, decompose_clause, DecompositionGatedError, PROOF_GREEN",
        "rollback": "inscribe_text reverts to the flat-sum composition (git revert)",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "morphological depth-ladder for the ZFAE three-core gonal inscription \u2014 two typed primitive gonals (BoneGonal=omega/structural, RootGonal=phi/content) composed by the carrier-LCM operator (UCNS multiply) into the derived psi=word layer; psi is NOT stored, it is lcm(phi,omega) recomputed at every rung; decomposition is scaffolded but GATED behind the multiply_left_cancellative proof",
        "tests": "a0p_skills.contracts.zfae_morphology_carrier_lcm_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/morphology.py",
      "id": "zfae_morphology"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure deterministic tool selection from a raw prompt; no IO, no LLM",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/native_tools.py",
      "id": "zfae_native_tools_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "select_native_tool, summarize_tool_result, NATIVE_TOOL_NAMES",
        "owner": "Erin Spencer",
        "summary": "deterministic native tool selection + result summary"
      },
      "file": "backend/interdependent_lib/zfae/native_tools.py",
      "id": "zfae_native_tools"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_native_tool_selection_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/native_tools.py",
      "id": "zfae_native_tool_selection"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_URL_RE, _SEARCH_HEADS, _SPEC_WORDS",
        "module_kind": "engine",
        "module_name": "native_tools",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "select_native_tool, summarize_tool_result, NATIVE_TOOL_NAMES",
        "rollback": "revert; native engine never triggers tools",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "deterministic native tool-use \u2014 maps a raw prompt to at most one built-in tool call (fetch_url / web_search / living_spec_lookup) using pure rule-based detection so the a0(zfae) native engine can trigger a tool mid-thought without any LLM; the selection is reproducible and the result is summarised into a compact deterministic line folded back into the native reply",
        "tests": "a0p_skills.contracts.zfae_native_tool_selection_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/native_tools.py",
      "id": "zfae_native_tools"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "internal",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "per-user override records with timeout; mongo-persistent",
        "user_data_boundary": "write"
      },
      "file": "backend/interdependent_lib/zfae/overrides.py",
      "id": "zfae_overrides_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:internal, user_data:write",
        "exposes": "PendingOverride, create_override, approve, reject, expire, get, list_pending",
        "owner": "Erin Spencer",
        "summary": "sentinel halt-and-override pending records with approve/reject/expire lifecycle"
      },
      "file": "backend/interdependent_lib/zfae/overrides.py",
      "id": "zfae_overrides"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/zfae/overrides.py",
      "id": "zfae_overrides_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_utc_now_ms",
        "module_kind": "service",
        "module_name": "overrides",
        "network_boundary": "internal",
        "owner": "Erin Spencer",
        "public_surface": "PendingOverride, create_override, approve, reject, expire, get, list_pending, OVERRIDE_DEFAULT_TIMEOUT_MS",
        "rollback": "drop pending_overrides_col; halts become hard FIQ_BLOCKED with no resume",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "PendingOverride dataclass + lifecycle helpers for sentinel halt-and-override; backed by MongoDB pending_overrides_col",
        "tests": "a0p_skills.contracts.zfae_overrides_lifecycle_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/interdependent_lib/zfae/overrides.py",
      "id": "zfae_overrides"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "ZFAERuntime \u2014 dispatches teacher_assisted vs zfae_native; never silently substitutes teacher output as native inference; carries reply_source + teacher_called + zfae_weights_updated flags",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/runtime.py",
      "id": "zfae_runtime_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:external, user_data:read",
        "exposes": "ZFAERuntime, RuntimeMode, RuntimeReply, MISSING_NATIVE_MESSAGE",
        "owner": "Erin Spencer",
        "summary": "ZFAERuntime \u2014 dispatches teacher_assisted vs zfae_native; never silently substitutes teacher output as native inference; carries reply_source + teacher_called + zfae_weights_updated flags"
      },
      "file": "backend/interdependent_lib/zfae/runtime.py",
      "id": "zfae_runtime"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_native_refuses_when_untrained_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/runtime.py",
      "id": "zfae_native_refuses_when_untrained"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_runtime_reply_source_flag_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/runtime.py",
      "id": "zfae_runtime_reply_source_flag"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_is_trained_enough, _teacher_tool_loop, _native_tool_use, _fiq_emit_tool_trace",
        "module_kind": "engine",
        "module_name": "runtime",
        "network_boundary": "external",
        "no_silent_fallback": "native mode NEVER returns teacher output relabeled as native",
        "owner": "Erin Spencer",
        "public_surface": "ZFAERuntime, RuntimeMode, RuntimeReply, MISSING_NATIVE_MESSAGE",
        "rollback": "revert callers to A0ZFAEInferenceEngine.infer directly (mode-1 only)",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "ZFAERuntime \u2014 dispatches teacher_assisted vs zfae_native; never silently substitutes teacher output as native inference; carries reply_source + teacher_called + zfae_weights_updated flags",
        "tests": "a0p_skills.contracts.zfae_runtime_reply_source_flag_holds, a0p_skills.contracts.zfae_native_refuses_when_untrained_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/runtime.py",
      "id": "zfae_runtime"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure deterministic computation over an in-memory event context",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_eval.py",
      "id": "zfae_sentinel_eval_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "evaluate, EventContext",
        "owner": "Erin Spencer",
        "summary": "evaluates 13 sentinel signals + applies flag-mode thresholds"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_eval.py",
      "id": "zfae_sentinel_eval"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "interdependent_lib.zfae.sentinel_eval._cliff_markers_regression_holds",
        "class": "regression",
        "given": "each canonical S4 + S12 literal marker present in this module's",
        "then": "the corresponding cliff signal value is exactly 1.0 and the"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_eval.py",
      "id": "zfae_sentinel_eval_cliff_markers_regression"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_sentinel_eval_returns_verdict13_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_eval.py",
      "id": "zfae_sentinel_eval_returns_verdict13"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_evaluate_one, _budget_signal, _drift_signal, _rate_signal, _safety_signal, _reversibility_signal",
        "module_kind": "engine",
        "module_name": "sentinel_eval",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "evaluate, EventContext",
        "rollback": "revert file; runtime emits no per-turn verdicts; FIQ loses sentinel events",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "per-event evaluator for the 13 sentinels \u2014 returns a Verdict13 from agent character-sheet modes/weights + the raw event payload; pure, deterministic, never raises on user input. S4 (safety) and S12 (reversibility) cliffs are currently INTERIM string-match against an additive marker set \u2014 bypassable by paraphrase; semantic detection is deferred to the pen-test/classifier track. hmmm: cliff broadening is additive-only; do not shrink the marker set.",
        "tests": "a0p_skills.contracts.zfae_sentinel_eval_returns_verdict13_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_eval.py",
      "id": "zfae_sentinel_eval"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure validation + merge; no IO",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_modes.py",
      "id": "zfae_sentinel_modes_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "SENTINEL_MODES_DEFAULT, validate_modes, resolve_modes, bulk_set",
        "owner": "Erin Spencer",
        "summary": "defaults + per-agent override + bulk transitions for sentinel modes"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_modes.py",
      "id": "zfae_sentinel_modes"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_modes.py",
      "id": "zfae_sentinel_modes_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "schema",
        "module_name": "sentinel_modes",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "SENTINEL_MODES_DEFAULT, validate_modes, resolve_modes, bulk_set",
        "rollback": "revert file; all sentinels treated as flag",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "per-agent sentinel mode resolution \u2014 observe/flag/off \u2014 with canonical defaults (7 flag + 6 observe + 0 off; flags = S1 S2 S3 S4 S8 S9 S12)",
        "tests": "a0p_skills.contracts.sentinel_modes_default_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_modes.py",
      "id": "zfae_sentinel_modes"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure validation + merge",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_weights.py",
      "id": "zfae_sentinel_weights_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "SENTINEL_WEIGHTS_DEFAULT, validate_weights, resolve_weights, inference_channel",
        "owner": "Erin Spencer",
        "summary": "defaults + per-agent override + inference channel residual"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_weights.py",
      "id": "zfae_sentinel_weights"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_weights.py",
      "id": "zfae_sentinel_weights_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "schema",
        "module_name": "sentinel_weights",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "SENTINEL_WEIGHTS_DEFAULT, INFERENCE_CHANNEL_DEFAULT, validate_weights, resolve_weights, inference_channel",
        "rollback": "revert file; all sentinels equal-weighted",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "per-agent sentinel weight resolution \u2014 default 0.90 attention budget distributed across 13 sentinels; user-editable; under-budget reverts to inference channel",
        "tests": "a0p_skills.contracts.sentinel_weights_default_sum_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/sentinel_weights.py",
      "id": "zfae_sentinel_weights"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "read",
        "summary": "in-process; reads agent character-sheet mode/weight overrides; no network",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/sentinels.py",
      "id": "zfae_sentinels_13_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:none, user_data:read",
        "exposes": "Sentinel, SENTINELS, SentinelMode, SentinelVerdict, Verdict13",
        "owner": "Erin Spencer",
        "summary": "declares the 13-sentinel canonical set, modes (observe/flag/off), and verdict shape"
      },
      "file": "backend/interdependent_lib/zfae/sentinels.py",
      "id": "zfae_sentinels_13"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/interdependent_lib/zfae/sentinels.py",
      "id": "zfae_sentinels_13_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_CLIFF_NAMES, _STRUCTURAL_NAMES, _SLOPE_NAMES",
        "module_kind": "engine",
        "module_name": "sentinels",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "Sentinel, SENTINELS, SentinelMode, SentinelVerdict, Verdict13, MODE_OBSERVE, MODE_FLAG, MODE_OFF",
        "rollback": "revert file; runtime falls back to 11-sentinel set (architecturally non-coherence-prime \u2014 discouraged)",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "the 13 canonical sentinels per ZFAE core view \u2014 verbatim job descriptions; 6 cliff/structural flag + 7 slope observe by default; halt-and-override authority when in flag mode",
        "tests": "a0p_skills.contracts.zfae_sentinels_13_canon_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/sentinels.py",
      "id": "zfae_sentinels_13"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "read",
        "summary": "TeacherClient \u2014 invokes a configured teacher model via the BYOK provider REGISTRY; emits training records; never substitutes its output as native zfae inference",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/teacher.py",
      "id": "zfae_teacher_client_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:read, network:external, user_data:read",
        "exposes": "TeacherClient, TeacherInvocation, build_curated_context",
        "owner": "Erin Spencer",
        "summary": "TeacherClient \u2014 invokes a configured teacher model via the BYOK provider REGISTRY; emits training records; never substitutes its output as native zfae inference"
      },
      "file": "backend/interdependent_lib/zfae/teacher.py",
      "id": "zfae_teacher_client"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_teacher_call_writes_training_record_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/teacher.py",
      "id": "zfae_teacher_call_writes_training_record"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_coerce_history",
        "module_kind": "adapter",
        "module_name": "teacher",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "TeacherClient, TeacherInvocation, build_curated_context",
        "rollback": "remove teacher_assisted path; runtime falls back to zfae_native (with proper refusal)",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "TeacherClient \u2014 invokes a configured teacher model via the BYOK provider REGISTRY; emits training records; never substitutes its output as native zfae inference",
        "tests": "a0p_skills.contracts.zfae_teacher_call_writes_training_record_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/teacher.py",
      "id": "zfae_teacher_client"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "ZFAELearner \u2014 multi-seed (rank>1) teacher distillation; each step updates all 157 seeds of a round-robin core toward the teacher d=53 signature with per-seed modulation, producing a reducible post-update residual loss that lets training unlock native readiness",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/trainer.py",
      "id": "zfae_trainer_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:none, user_data:read",
        "exposes": "ZFAELearner, distill_step, text_signature, TrainingResult",
        "owner": "Erin Spencer",
        "summary": "ZFAELearner \u2014 multi-seed (rank>1) teacher distillation; each step updates all 157 seeds of a round-robin core toward the teacher d=53 signature with per-seed modulation, producing a reducible post-update residual loss that lets training unlock native readiness"
      },
      "file": "backend/interdependent_lib/zfae/trainer.py",
      "id": "zfae_trainer"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_learning_step_changes_digest_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/trainer.py",
      "id": "zfae_learning_step_changes_digest"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_intent_signature, _text_to_d53",
        "module_kind": "engine",
        "module_name": "trainer",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "ZFAELearner, distill_step, text_signature, TrainingResult",
        "rollback": "revert weight bank to prior checkpoint",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "ZFAELearner \u2014 multi-seed (rank>1) teacher distillation; each step updates all 157 seeds of a round-robin core toward the teacher d=53 signature with per-seed modulation, producing a reducible post-update residual loss that lets training unlock native readiness",
        "tests": "a0p_skills.contracts.zfae_learning_step_changes_digest_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/trainer.py",
      "id": "zfae_trainer"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "deterministic seed init for fresh ZFAE weights; three cores phi/psi/omega each shape (157, 53, 7, 7)",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/weight_init.py",
      "id": "zfae_weight_init_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "seed_initial_weights, seed_initial_three_core, CORE_NAMES, WEIGHT_SHAPE, WEIGHT_COUNT, WEIGHT_COUNT_PER_CORE, WEIGHT_COUNT_TOTAL, default_metadata",
        "owner": "Erin Spencer",
        "summary": "deterministic seed init for fresh ZFAE weights; three cores phi/psi/omega each shape (157, 53, 7, 7)"
      },
      "file": "backend/interdependent_lib/zfae/weight_init.py",
      "id": "zfae_weight_init"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_weight_init_deterministic_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/weight_init.py",
      "id": "zfae_weight_init_deterministic"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_seeded_rng",
        "module_kind": "engine",
        "module_name": "weight_init",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "seed_initial_weights, seed_initial_three_core, seed_initial_gonal, CORE_NAMES, WEIGHT_SHAPE, WEIGHT_COUNT, WEIGHT_COUNT_PER_CORE, WEIGHT_COUNT_TOTAL, GONAL_SEED_WIDTH, default_metadata",
        "rollback": "revert file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "deterministic seed init for fresh ZFAE weights; three cores phi/psi/omega each shape (157, 53, 7, 7); per-agent reproducible",
        "tests": "a0p_skills.contracts.zfae_weight_init_deterministic_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/interdependent_lib/zfae/weight_init.py",
      "id": "zfae_weight_init"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "three-core (phi, psi, omega) safetensors load/save with per-core checkpoint digest",
        "user_data_boundary": "write"
      },
      "file": "backend/interdependent_lib/zfae/weights.py",
      "id": "zfae_weight_bank_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:none, user_data:write",
        "exposes": "A0ZFAEWeightBank, WEIGHT_SHAPE, WEIGHT_COUNT, WEIGHT_COUNT_PER_CORE, WEIGHT_COUNT_TOTAL, CORE_NAMES",
        "owner": "Erin Spencer",
        "summary": "three-core (phi, psi, omega) safetensors load/save with per-core checkpoint digest"
      },
      "file": "backend/interdependent_lib/zfae/weights.py",
      "id": "zfae_weight_bank"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_weight_bank_loads_407729_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/weights.py",
      "id": "zfae_weight_bank_loads_407729"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_weight_bank_persists_gonal_seed_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/weights.py",
      "id": "zfae_weight_bank_persists_gonal_seed"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.zfae_weight_bank_three_core_total_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/interdependent_lib/zfae/weights.py",
      "id": "zfae_weight_bank_three_core_total"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "canon_metrics": "zfae_weight_count, zfae_weight_count_total, zfae_checkpoint_digest, zfae_training_step, zfae_last_loss, zfae_seeds_touched",
        "internal_surface": "_compute_digest, _coerce_metadata",
        "module_kind": "engine",
        "module_name": "weights",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "A0ZFAEWeightBank, WEIGHT_SHAPE, WEIGHT_COUNT, WEIGHT_COUNT_PER_CORE, WEIGHT_COUNT_TOTAL, CORE_NAMES",
        "rollback": "rebuild from seed_init; lose training progress",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "A0ZFAEWeightBank \u2014 three-core (phi, psi, omega) safetensors load/save, per-core checkpoint digest, training-step counter, seeds-touched tracking; exposes canonical 1_223_187 scalar count",
        "tests": "a0p_skills.contracts.zfae_weight_bank_loads_407729_holds, a0p_skills.contracts.zfae_weight_bank_three_core_total_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/interdependent_lib/zfae/weights.py",
      "id": "zfae_weight_bank"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "read-only filesystem scan",
        "user_data_boundary": "read"
      },
      "file": "backend/living_spec.py",
      "id": "living_spec_scanner_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "scan_repo_blocks, REPO_ROOTS",
        "owner": "Erin Spencer",
        "summary": "scan repo files and return msdmd block JSON"
      },
      "file": "backend/living_spec.py",
      "id": "living_spec_scanner"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/living_spec.py",
      "id": "living_spec_scanner_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_iter_repo_files",
        "module_kind": "service",
        "module_name": "living_spec",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "scan_repo_blocks, REPO_ROOTS",
        "rollback": "revert; /api/spec/living loses its source",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "pure scanner over the repo that returns every msdmd block as JSON; no DB / network dependencies; used by the /api/spec/living endpoint and by contract tests",
        "tests": "a0p_skills.contracts.api_extensions_living_spec_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/living_spec.py",
      "id": "living_spec_scanner"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "Pydantic surface for the public API (BYOK keys, vault, sessions, drafts, chat, agents)",
        "user_data_boundary": "read"
      },
      "file": "backend/models.py",
      "id": "a0p_models_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "KeyUpsert, KeyPublic, SiteAccountUpsert, SiteAccountPublic, SessionUpsert, SessionPublic, ChatTurn, DraftUpsert, DraftPublic, FanOutRequest, DaisyChainRequest, SynthesizeRequest, AgentExport, PROVIDERS, new_id",
        "owner": "a0p maintainer",
        "summary": "Pydantic surface for the public API (BYOK keys, vault, sessions, drafts, chat, agents)"
      },
      "file": "backend/models.py",
      "id": "a0p_models"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/models.py",
      "id": "a0p_models_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_utc_now_iso, _Base",
        "module_kind": "schema",
        "module_name": "models",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "KeyUpsert, KeyPublic, SiteAccountUpsert, SiteAccountPublic, SessionUpsert, SessionPublic, ChatTurn, DraftUpsert, DraftPublic, FanOutRequest, DaisyChainRequest, SynthesizeRequest, AgentExport, PROVIDERS, new_id",
        "rollback": "revert file; consumers break at import",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "Pydantic surface for the public API (BYOK keys, vault, sessions, drafts, chat, agents)",
        "tests": "hmmm",
        "user_data_boundary": "read"
      },
      "file": "backend/models.py",
      "id": "a0p_models"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "BYOK adapter registry \u2014 openai, anthropic, gemini, xai (Emergent removed; build is platform-free)",
        "user_data_boundary": "read"
      },
      "file": "backend/providers/__init__.py",
      "id": "providers_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:read",
        "exposes": "REGISTRY, ProviderAdapter, ChatResult",
        "owner": "a0p maintainer",
        "summary": "BYOK adapter registry \u2014 openai, anthropic, gemini, xai (Emergent removed; build is platform-free)"
      },
      "file": "backend/providers/__init__.py",
      "id": "providers_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/providers/__init__.py",
      "id": "providers_pkg_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "adapter",
        "module_name": "providers",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "public_surface": "REGISTRY, ProviderAdapter, ChatResult",
        "rollback": "remove provider imports from server.py",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "BYOK adapter registry \u2014 openai, anthropic, gemini, xai (Emergent removed; build is platform-free)",
        "tests": "hmmm",
        "user_data_boundary": "read"
      },
      "file": "backend/providers/__init__.py",
      "id": "providers_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "Anthropic BYOK adapter \u2014 list models, messages via httpx",
        "user_data_boundary": "read"
      },
      "file": "backend/providers/anthropic_provider.py",
      "id": "provider_anthropic_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:read",
        "exposes": "AnthropicProvider",
        "owner": "a0p maintainer",
        "summary": "Anthropic BYOK adapter \u2014 list models, messages via httpx"
      },
      "file": "backend/providers/anthropic_provider.py",
      "id": "provider_anthropic"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/providers/anthropic_provider.py",
      "id": "provider_anthropic_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "version",
        "module_kind": "adapter",
        "module_name": "anthropic_provider",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "public_surface": "AnthropicProvider",
        "rollback": "remove from providers.REGISTRY",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "Anthropic BYOK adapter \u2014 list models, messages via httpx",
        "tests": "hmmm",
        "user_data_boundary": "read"
      },
      "file": "backend/providers/anthropic_provider.py",
      "id": "provider_anthropic"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "common Protocol + TypedDict contract for BYOK LLM provider adapters",
        "user_data_boundary": "none"
      },
      "file": "backend/providers/base.py",
      "id": "provider_base_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:none",
        "exposes": "ProviderAdapter, ChatResult",
        "owner": "a0p maintainer",
        "summary": "common Protocol + TypedDict contract for BYOK LLM provider adapters"
      },
      "file": "backend/providers/base.py",
      "id": "provider_base"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/providers/base.py",
      "id": "provider_base_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "adapter",
        "module_name": "base",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "ProviderAdapter, ChatResult",
        "rollback": "revert file; all provider adapters break at import",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "common Protocol + TypedDict contract for BYOK LLM provider adapters",
        "tests": "hmmm",
        "user_data_boundary": "none"
      },
      "file": "backend/providers/base.py",
      "id": "provider_base"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "Google Gemini BYOK adapter \u2014 list models, generateContent via httpx",
        "user_data_boundary": "read"
      },
      "file": "backend/providers/gemini_provider.py",
      "id": "provider_gemini_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:read",
        "exposes": "GeminiProvider",
        "owner": "a0p maintainer",
        "summary": "Google Gemini BYOK adapter \u2014 list models, generateContent via httpx"
      },
      "file": "backend/providers/gemini_provider.py",
      "id": "provider_gemini"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/providers/gemini_provider.py",
      "id": "provider_gemini_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "adapter",
        "module_name": "gemini_provider",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "public_surface": "GeminiProvider",
        "rollback": "remove from providers.REGISTRY",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "Google Gemini BYOK adapter \u2014 list models, generateContent via httpx",
        "tests": "hmmm",
        "user_data_boundary": "read"
      },
      "file": "backend/providers/gemini_provider.py",
      "id": "provider_gemini"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "OpenAI BYOK adapter \u2014 list models, chat completion via httpx",
        "user_data_boundary": "read"
      },
      "file": "backend/providers/openai_provider.py",
      "id": "provider_openai_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:read",
        "exposes": "OpenAIProvider",
        "owner": "a0p maintainer",
        "summary": "OpenAI BYOK adapter \u2014 list models, chat completion via httpx"
      },
      "file": "backend/providers/openai_provider.py",
      "id": "provider_openai"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/providers/openai_provider.py",
      "id": "provider_openai_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "base, name",
        "module_kind": "adapter",
        "module_name": "openai_provider",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "public_surface": "OpenAIProvider",
        "rollback": "remove from providers.REGISTRY",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "OpenAI BYOK adapter \u2014 list models, chat completion via httpx",
        "tests": "hmmm",
        "user_data_boundary": "read"
      },
      "file": "backend/providers/openai_provider.py",
      "id": "provider_openai"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "storage_boundary": "none",
        "summary": "xAI Grok BYOK adapter \u2014 OpenAI-compatible /v1 via httpx",
        "user_data_boundary": "read"
      },
      "file": "backend/providers/xai_provider.py",
      "id": "provider_xai_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:read",
        "exposes": "XAIProvider",
        "owner": "a0p maintainer",
        "summary": "xAI Grok BYOK adapter \u2014 OpenAI-compatible /v1 via httpx"
      },
      "file": "backend/providers/xai_provider.py",
      "id": "provider_xai"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/providers/xai_provider.py",
      "id": "provider_xai_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "adapter",
        "module_name": "xai_provider",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "public_surface": "XAIProvider",
        "rollback": "remove from providers.REGISTRY",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "xAI Grok BYOK adapter \u2014 OpenAI-compatible /v1 via httpx",
        "tests": "hmmm",
        "user_data_boundary": "read"
      },
      "file": "backend/providers/xai_provider.py",
      "id": "provider_xai"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "read-only spec scan + write to /app/README.md",
        "user_data_boundary": "read"
      },
      "file": "backend/readme_writer.py",
      "id": "readme_writer_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:none, user_data:read",
        "exposes": "write_readme",
        "owner": "Erin Spencer",
        "summary": "living-spec \u2192 README.md"
      },
      "file": "backend/readme_writer.py",
      "id": "readme_writer"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/readme_writer.py",
      "id": "readme_writer_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_subsystem, _render_modules, _format_kind_index",
        "module_kind": "service",
        "module_name": "readme_writer",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "write_readme",
        "rollback": "revert; README.md stops auto-regenerating",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "regenerates /app/README.md on every backend startup from the living spec (scan_repo_blocks) as a narrative README \u2014 an Overview, a per-subsystem Architecture walkthrough (each subsystem gets a prose lead plus its modules' full narratives), and a by-kind module index; deterministic and never raises",
        "tests": "a0p_skills.contracts.module_imports_cleanly_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/readme_writer.py",
      "id": "readme_writer"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "storage_boundary": "write",
        "summary": "FastAPI app \u2014 keys, vault, inventory, sessions, drafts, chat (single/fanout/daisy/synth), inspector, agents, usage, skill report",
        "user_data_boundary": "write"
      },
      "file": "backend/server.py",
      "id": "a0p_server_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:external, user_data:write",
        "exposes": "app, api, AGENT",
        "owner": "a0p maintainer",
        "summary": "FastAPI app \u2014 keys, vault, inventory, sessions, drafts, chat (single/fanout/daisy/synth), inspector, agents, usage, skill report"
      },
      "file": "backend/server.py",
      "id": "a0p_server"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.skill_report_visibility_holds",
        "class": "observability",
        "given": "GET /api/skill/<name>/report for any of capabilities|contracts|module-build",
        "then": "returns scanned/covered/gaps_count plus the gaps array; gaps array MUST be present per msdmd doctrine"
      },
      "file": "backend/server.py",
      "id": "skill_report_visibility"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "api_surface": "/api/*",
        "auth_boundary": "bearer",
        "internal_surface": "_call_model, _split_model, _get_key, _record_usage, _utc_now_iso",
        "module_kind": "route",
        "module_name": "server",
        "network_boundary": "external",
        "owner": "a0p maintainer",
        "public_surface": "app, api, AGENT",
        "rollback": "supervisorctl stop backend; restore previous server.py from git",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "FastAPI app \u2014 keys, vault, inventory, sessions, drafts, chat (single/fanout/daisy/synth), inspector, agents, usage, skill report",
        "tests": "a0p_skills.contracts.skill_report_visibility_holds",
        "ui_surface": "all frontend pages",
        "user_data_boundary": "write"
      },
      "file": "backend/server.py",
      "id": "a0p_server"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "re-export shim",
        "user_data_boundary": "read"
      },
      "file": "backend/skills/__init__.py",
      "id": "skills_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "re-exports",
        "owner": "Erin Spencer",
        "summary": "package re-exports"
      },
      "file": "backend/skills/__init__.py",
      "id": "skills_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/skills/__init__.py",
      "id": "skills_pkg_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "service",
        "module_name": "skills",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "Skill, SkillExistsWarning, register_skill, list_skills, get_skill, delete_skill, check_overlap, pull_from_skill_lib",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "skills subpackage entry \u2014 re-exports registry + sync helpers",
        "tests": "a0p_skills.contracts.module_imports_cleanly_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/skills/__init__.py",
      "id": "skills_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "persists skill records to Mongo with overlap detection",
        "user_data_boundary": "write"
      },
      "file": "backend/skills/registry.py",
      "id": "skills_registry_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:none, user_data:write",
        "exposes": "Skill, register_skill, list_skills, get_skill, delete_skill, check_overlap, tokenize_scope, tokenize_logic, SkillExistsWarning",
        "owner": "Erin Spencer",
        "summary": "skill registry + overlap detection"
      },
      "file": "backend/skills/registry.py",
      "id": "skills_registry"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.skills_registry_overlap_warns_holds",
        "class": "correctness",
        "given": "two skill specs with overlapping scope_tokens and logic_set_tokens",
        "then": "check_overlap returns the higher-similarity match with score above"
      },
      "file": "backend/skills/registry.py",
      "id": "skills_registry_overlap_warns"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_jaccard",
        "module_kind": "engine",
        "module_name": "registry",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "Skill, SkillExistsWarning, register_skill, list_skills, get_skill, delete_skill, check_overlap, tokenize_scope, tokenize_logic",
        "rollback": "revert; skill catalog endpoint loses overlap detection",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "per-user + global skill catalog with overlap detection \u2014 Skill schema (name, description, prompt_template, tool_bindings[], sentinel_overrides{}, scope_tokens[], logic_set_tokens[], source); jaccard-similarity overlap check against existing skills warns the user when a candidate skill shares logic+scope with one already in the catalog",
        "tests": "a0p_skills.contracts.skills_registry_overlap_warns_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/skills/registry.py",
      "id": "skills_registry"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "true",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "GitHub pull-sync for global skill catalog",
        "user_data_boundary": "read"
      },
      "file": "backend/skills/sync.py",
      "id": "skills_sync_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:external, user_data:read",
        "exposes": "pull_from_skill_lib, push_to_skill_lib_stub",
        "owner": "Erin Spencer",
        "summary": "skill-lib repo sync"
      },
      "file": "backend/skills/sync.py",
      "id": "skills_sync"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.skills_sync_pull_holds",
        "class": "integration",
        "given": "a transient network error from GitHub",
        "then": "pull_from_skill_lib returns {ok:false, error:..., pulled:0} instead of raising"
      },
      "file": "backend/skills/sync.py",
      "id": "skills_sync_pull"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "true",
        "auth_boundary": "none",
        "internal_surface": "_fetch_index, _SKILL_LIB_URL",
        "module_kind": "service",
        "module_name": "sync",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "pull_from_skill_lib, push_to_skill_lib_stub",
        "rollback": "revert; the skill catalog stops auto-syncing",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "pulls canonical skills from The-Interdependency/skill-lib GitHub repo \u2014 fetches the index.json, validates each entry, upserts global skills (owner_user_id=None); reverse direction (publish-back) is reserved for skills marked as publishable=True",
        "tests": "a0p_skills.contracts.skills_sync_pull_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/skills/sync.py",
      "id": "skills_sync"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "end-to-end regression suite over REACT_APP_BACKEND_URL",
        "user_data_boundary": "read"
      },
      "file": "backend/tests/backend_test.py",
      "id": "tests_backend_test_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:read",
        "exposes": "test_*",
        "owner": "Erin Spencer",
        "summary": "e2e regression suite"
      },
      "file": "backend/tests/backend_test.py",
      "id": "tests_backend_test"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/tests/backend_test.py",
      "id": "tests_backend_test_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "test",
        "module_name": "backend_test",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "test_*",
        "rollback": "revert; lose e2e coverage",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "end-to-end backend regression suite \u2014 covers /api/health, BYOK keys CRUD with encryption-at-rest masking, and chat session flows; intended to be executed by the testing-agent harness against the live preview ingress",
        "tests": "pytest_runs_this_file",
        "user_data_boundary": "read"
      },
      "file": "backend/tests/backend_test.py",
      "id": "tests_backend_test"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pytest plugin loader",
        "user_data_boundary": "read"
      },
      "file": "backend/tests/conftest.py",
      "id": "tests_conftest_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "pytest_plugins",
        "owner": "Erin Spencer",
        "summary": "pytest async config"
      },
      "file": "backend/tests/conftest.py",
      "id": "tests_conftest"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/tests/conftest.py",
      "id": "tests_conftest_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "test",
        "module_name": "conftest",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "pytest_plugins",
        "rollback": "revert; async tests fail to collect",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "pytest configuration \u2014 enables pytest-asyncio plugin in auto mode for the backend test suite",
        "tests": "pytest_runs_this_file",
        "user_data_boundary": "read"
      },
      "file": "backend/tests/conftest.py",
      "id": "tests_conftest"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure in-process tests; no network, no storage",
        "user_data_boundary": "none"
      },
      "file": "backend/tests/test_lifted_path.py",
      "id": "test_lifted_path_boundaries"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "test",
        "module_name": "test_lifted_path",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "(pytest test functions)",
        "rollback": "delete file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "pytest round-trip coverage for the lossless lifted traversal over the",
        "tests": "self",
        "user_data_boundary": "none"
      },
      "file": "backend/tests/test_lifted_path.py",
      "id": "test_lifted_path"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure in-process tests; no network, no storage",
        "user_data_boundary": "none"
      },
      "file": "backend/tests/test_morphology_ladder.py",
      "id": "test_morphology_ladder_boundaries"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "test",
        "module_name": "test_morphology_ladder",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "(pytest test functions)",
        "rollback": "delete file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "pytest coverage for the morphological depth-ladder \u2014 typed gonal primitives",
        "tests": "self",
        "user_data_boundary": "none"
      },
      "file": "backend/tests/test_morphology_ladder.py",
      "id": "test_morphology_ladder"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure in-process security tests; seeds throwaway secrets; no network",
        "user_data_boundary": "none"
      },
      "file": "backend/tests/test_security.py",
      "id": "test_security_boundaries"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "test",
        "module_name": "test_security",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "(pytest test functions)",
        "rollback": "delete file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "security regression suite \u2014 Fernet at-rest encryption round-trip + masking,",
        "tests": "self",
        "user_data_boundary": "none"
      },
      "file": "backend/tests/test_security.py",
      "id": "test_security"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure in-process tests; no network, no storage",
        "user_data_boundary": "none"
      },
      "file": "backend/tests/test_tool_use_loop.py",
      "id": "test_tool_use_loop_boundaries"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "tests.test_tool_use_loop",
        "class": "correctness",
        "given": "the tool-use loop + native selector + runtime wiring",
        "then": "each named test asserts the documented behaviour without raising"
      },
      "file": "backend/tests/test_tool_use_loop.py",
      "id": "test_tool_use_loop_self"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_fake_poster, _bank_ready",
        "module_kind": "test",
        "module_name": "test_tool_use_loop",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "(pytest test functions)",
        "rollback": "delete file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "pytest coverage for the cross-provider tool-use loop (run_tool_loop), the",
        "tests": "self",
        "user_data_boundary": "none"
      },
      "file": "backend/tests/test_tool_use_loop.py",
      "id": "test_tool_use_loop"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure in-process; no network/storage",
        "user_data_boundary": "none"
      },
      "file": "backend/tests/test_training_room.py",
      "id": "test_training_room_boundaries"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "tests.test_training_room",
        "class": "correctness",
        "given": "ZFAERuntime.train_multi with a fake multi-model teacher",
        "then": "the bank accumulates one distill step per (prompt x model) and errors are per-step"
      },
      "file": "backend/tests/test_training_room.py",
      "id": "test_training_room_self"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "_FakeTeacher",
        "module_kind": "test",
        "module_name": "test_training_room",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "(pytest test functions)",
        "rollback": "delete file",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "pytest for ZFAERuntime.train_multi \u2014 multi-teacher distillation runs one",
        "tests": "self",
        "user_data_boundary": "none"
      },
      "file": "backend/tests/test_training_room.py",
      "id": "test_training_room"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "live api integration tests",
        "user_data_boundary": "read"
      },
      "file": "backend/tests/test_zfae_api_sentinels.py",
      "id": "tests_zfae_api_sentinels_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:read",
        "exposes": "test_*",
        "owner": "Erin Spencer",
        "summary": "api-level sentinel + 3-core test suite"
      },
      "file": "backend/tests/test_zfae_api_sentinels.py",
      "id": "tests_zfae_api_sentinels"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/tests/test_zfae_api_sentinels.py",
      "id": "tests_zfae_api_sentinels_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "test",
        "module_name": "test_zfae_api_sentinels",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "test_*",
        "rollback": "revert; lose api-level sentinel coverage",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "integration tests for the ZFAE three-core + sentinel halt-and-override pipeline, hitting the live FastAPI service via REACT_APP_BACKEND_URL \u2014 Tests 1..8 from the review batch",
        "tests": "pytest_runs_this_file",
        "user_data_boundary": "read"
      },
      "file": "backend/tests/test_zfae_api_sentinels.py",
      "id": "tests_zfae_api_sentinels"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/tests/test_zfae_gonal_inscription.py",
      "id": "test_zfae_gonal_inscription_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "experiment",
        "module_name": "test_zfae_gonal_inscription",
        "network_boundary": "none",
        "owner": "a0p maintainer",
        "public_surface": "none",
        "rollback": "delete file",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "regression for ZFAE Route A \u2014 PrivateGonal determinism, 53\u219232 whitening bridge, engine PCEA-digest + non-flat tensors, gonal-seed safetensors persistence",
        "tests": "self",
        "user_data_boundary": "none"
      },
      "file": "backend/tests/test_zfae_gonal_inscription.py",
      "id": "test_zfae_gonal_inscription"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure pytest regression suite",
        "user_data_boundary": "read"
      },
      "file": "backend/tests/test_zfae_three_core_sentinels.py",
      "id": "tests_zfae_three_core_sentinels_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "test_three_core_weight_bank_total_count, test_trainer_round_robin_across_cores, test_sentinel_eval_cliff_fires_on_unsafe_marker, test_native_refusal_requires_all_seeds_touched, test_fiq_emit_chain, test_pending_override_lifecycle",
        "owner": "Erin Spencer",
        "summary": "3-core / sentinel / FIQ / overrides regression suite"
      },
      "file": "backend/tests/test_zfae_three_core_sentinels.py",
      "id": "tests_zfae_three_core_sentinels"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.module_imports_cleanly_holds",
        "class": "integration",
        "given": "module declares its msdmd canon",
        "then": "the module imports cleanly under the current interpreter"
      },
      "file": "backend/tests/test_zfae_three_core_sentinels.py",
      "id": "tests_zfae_three_core_sentinels_loads"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "test",
        "module_name": "test_zfae_three_core_sentinels",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "test_three_core_weight_bank_total_count, test_trainer_round_robin_across_cores, test_sentinel_eval_cliff_fires_on_unsafe_marker, test_native_refusal_requires_all_seeds_touched, test_fiq_emit_chain, test_pending_override_lifecycle",
        "rollback": "revert; lose 3-core regression coverage",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "pytest regression suite for the 3-core (\u03a6/\u03a8/\u03a9) weight bank, trainer round-robin, sentinel evaluator cliffs/slopes, native readiness gate, FIQ hash-chain emit, and PendingOverride lifecycle",
        "tests": "pytest_runs_this_file",
        "user_data_boundary": "read"
      },
      "file": "backend/tests/test_zfae_three_core_sentinels.py",
      "id": "tests_zfae_three_core_sentinels"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure re-export shim",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/__init__.py",
      "id": "tools_pkg_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "re-exports",
        "owner": "Erin Spencer",
        "summary": "pkg entry point"
      },
      "file": "backend/tools/__init__.py",
      "id": "tools_pkg"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.tools_pkg_imports_holds",
        "class": "integration",
        "given": "the tools package is imported",
        "then": "register_builtins() has populated the registry with at least 4 native tools"
      },
      "file": "backend/tools/__init__.py",
      "id": "tools_pkg_imports"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "service",
        "module_name": "tools",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "Tool, ToolError, register, lookup, unregister, is_global, user_tool_names, list_tools, invoke, register_builtins, TOOL_KIND_NATIVE, TOOL_KIND_WEBHOOK, TOOL_KIND_MCP, TOOL_KIND_ODYSSEUS",
        "rollback": "revert; tools.* re-exports unavailable",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "tools subpackage entry \u2014 re-exports the registry public surface and triggers register_builtins() so native tools are available immediately on import",
        "tests": "a0p_skills.contracts.tools_pkg_imports_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/__init__.py",
      "id": "tools_pkg"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "provider-agnostic agentic tool-use loop over raw HTTP (BYOK)",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/agent_loop.py",
      "id": "tools_agent_loop_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:none, network:external, user_data:read",
        "exposes": "run_tool_loop, tool_to_schema, ToolLoopHalt",
        "owner": "Erin Spencer",
        "summary": "normalized cross-provider function-calling loop"
      },
      "file": "backend/tools/agent_loop.py",
      "id": "tools_agent_loop"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.tools_agent_loop_two_step_holds",
        "class": "correctness",
        "given": "a fake poster that returns a tool-call then a final answer for each provider",
        "then": "run_tool_loop executes the tool via the injected executor and returns the"
      },
      "file": "backend/tools/agent_loop.py",
      "id": "tools_agent_loop_two_step"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_split_system, _to_provider_messages, _build_payload, _parse, _append_tool_turn, _endpoint, _httpx_poster",
        "module_kind": "engine",
        "module_name": "agent_loop",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "run_tool_loop, tool_to_schema, ToolLoopHalt, MAX_ITERS_DEFAULT",
        "rollback": "revert; teacher path uses single-shot invoke (no tools)",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "provider-agnostic agentic tool-use loop over raw HTTP (BYOK) \u2014 normalizes OpenAI/xAI Chat Completions, Anthropic Messages, and Gemini generateContent function-calling into one multi-step loop; advertises tool JSON schema, detects model tool calls, runs an injected executor (sentinel-gated), threads tool results back, and loops until a final answer or max_iters; the network poster is injectable so the loop is fully unit-testable without live keys",
        "tests": "a0p_skills.contracts.tools_agent_loop_two_step_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/agent_loop.py",
      "id": "tools_agent_loop"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "read",
        "summary": "built-in native tools (read-only outward calls)",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/builtin.py",
      "id": "tools_builtin_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:read, network:external, user_data:read",
        "exposes": "register_builtins",
        "owner": "Erin Spencer",
        "summary": "built-in tool registration"
      },
      "file": "backend/tools/builtin.py",
      "id": "tools_builtin"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.tools_builtin_registers_holds",
        "class": "correctness",
        "given": "register_builtins() is called against an empty registry",
        "then": "at least the canonical four tools (living_spec_lookup, vault_get_key,"
      },
      "file": "backend/tools/builtin.py",
      "id": "tools_builtin_registers"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_living_spec_lookup, _vault_get_key, _fetch_url, _web_search",
        "module_kind": "engine",
        "module_name": "builtin",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "register_builtins",
        "rollback": "revert; built-in tools disappear",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "register the built-in native tools \u2014 living_spec_lookup, vault_get_key, fetch_url, web_search; each one declares its JSON Schema and is sentinel-gated automatically by the registry's invoke",
        "tests": "a0p_skills.contracts.tools_builtin_registers_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/builtin.py",
      "id": "tools_builtin"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "sentinel gate + dispatch for one tool call",
        "user_data_boundary": "write"
      },
      "file": "backend/tools/gated_invoke.py",
      "id": "tools_gated_invoke_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:external, user_data:write",
        "exposes": "gated_invoke",
        "owner": "Erin Spencer",
        "summary": "sentinel-gated tool invocation"
      },
      "file": "backend/tools/gated_invoke.py",
      "id": "tools_gated_invoke"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.tools_gated_invoke_halts_on_cliff_holds",
        "class": "correctness",
        "given": "a tool invocation whose params contain a canonical S4 cliff marker",
        "then": "gated_invoke raises ToolError(halt=True) with a pending override_id"
      },
      "file": "backend/tools/gated_invoke.py",
      "id": "tools_gated_invoke_halts_on_cliff"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_dispatch",
        "module_kind": "engine",
        "module_name": "gated_invoke",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "gated_invoke",
        "rollback": "revert; tools bypass the sentinel gate (UNSAFE)",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "per-tool-call sentinel gate \u2014 evaluates the 13 sentinels against the tool name + serialized params, halts on any flag (creates a PendingOverride and emits zfae_override_created), only proceeds when no flag (or when caller supplied an approved override_id); emits zfae_tool_call + zfae_tool_result FIQ events on every invocation",
        "tests": "a0p_skills.contracts.tools_gated_invoke_halts_on_cliff_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/tools/gated_invoke.py",
      "id": "tools_gated_invoke"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "read",
        "summary": "outbound JSON-RPC client to user-registered MCP servers",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/mcp_relay.py",
      "id": "tools_mcp_relay_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:read, network:external, user_data:read",
        "exposes": "invoke, list_remote_tools, ping_server",
        "owner": "Erin Spencer",
        "summary": "outbound MCP JSON-RPC client"
      },
      "file": "backend/tools/mcp_relay.py",
      "id": "tools_mcp_relay"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.tools_mcp_relay_request_holds",
        "class": "integration",
        "given": "a synthetic MCP server registration with a malformed URL",
        "then": "ping_server returns {ok:false, error:...} instead of raising"
      },
      "file": "backend/tools/mcp_relay.py",
      "id": "tools_mcp_relay_request"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_post_rpc",
        "module_kind": "adapter",
        "module_name": "mcp_relay",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "invoke, list_remote_tools, ping_server",
        "rollback": "revert; mcp-typed tools become invokable-but-unreachable",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "relay tool invocations to external MCP servers registered per user \u2014 Streamable HTTP JSON-RPC client (Model Context Protocol over HTTP) with bearer-token auth; outbound only, the server-side surface lives in tools.mcp_server",
        "tests": "a0p_skills.contracts.tools_mcp_relay_request_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/mcp_relay.py",
      "id": "tools_mcp_relay"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "inbound JSON-RPC 2.0 surface for external MCP clients",
        "user_data_boundary": "write"
      },
      "file": "backend/tools/mcp_server.py",
      "id": "tools_mcp_server_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:external, user_data:write",
        "exposes": "router, get_or_create_publish_token",
        "owner": "Erin Spencer",
        "summary": "a0p MCP server endpoint"
      },
      "file": "backend/tools/mcp_server.py",
      "id": "tools_mcp_server"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.tools_mcp_server_initialize_holds",
        "class": "integration",
        "given": "a JSON-RPC initialize call against the MCP server with no token",
        "then": "the response carries the MCP serverInfo and protocolVersion fields"
      },
      "file": "backend/tools/mcp_server.py",
      "id": "tools_mcp_server_initialize"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_rpc_ok, _rpc_err, _resolve_caller",
        "module_kind": "route",
        "module_name": "mcp_server",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "router, get_or_create_publish_token",
        "rollback": "revert; external MCP clients (Claude Desktop, Cursor, etc.) cannot connect",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "expose a0p AS an MCP server \u2014 JSON-RPC 2.0 over HTTP at /api/mcp; methods: initialize, tools/list, tools/call (sentinel-gated), resources/list (living-spec modules), resources/read; bearer-token authenticated against a per-user MCP_PUBLISH_TOKEN",
        "tests": "a0p_skills.contracts.tools_mcp_server_initialize_holds",
        "user_data_boundary": "write"
      },
      "file": "backend/tools/mcp_server.py",
      "id": "tools_mcp_server"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "read",
        "summary": "outbound scoped-REST client to a user-registered Odysseus workspace",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/odysseus_relay.py",
      "id": "tools_odysseus_relay_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:read, network:external, user_data:read",
        "exposes": "probe_capabilities, request, invoke, safe_tool_name, ODYSSEUS_CATALOGUE",
        "owner": "Erin Spencer",
        "summary": "outbound Odysseus /api/codex/* REST client"
      },
      "file": "backend/tools/odysseus_relay.py",
      "id": "tools_odysseus_relay"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.tools_odysseus_relay_request_holds",
        "class": "integration",
        "given": "an Odysseus /api/codex/* surface stubbed with an httpx MockTransport",
        "then": "request() round-trips a 200 JSON body with the Bearer token attached,"
      },
      "file": "backend/tools/odysseus_relay.py",
      "id": "tools_odysseus_relay_request"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_guard_path, _resolve_spec, _assert_allowed_host",
        "module_kind": "adapter",
        "module_name": "odysseus_relay",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "probe_capabilities, request, invoke, safe_tool_name, ODYSSEUS_CATALOGUE",
        "rollback": "revert; odysseus-typed tools become invokable-but-unreachable",
        "rollout": "default_enabled",
        "storage_boundary": "read",
        "summary": "relay a0p tool calls to a registered Odysseus workspace over its scoped /api/codex/* REST surface \u2014 outbound httpx client attaching the per-connection Bearer api_token; the destination host is the operator-registered base_url (never agent-supplied) and the path is pinned to the /api/codex/ prefix; an SSRF guard refuses non-global hosts unless the connection is explicitly allow_private (self-hosted/localhost opt-in), so Odysseus's own api_token scopes bound every capability while a0p sentinels gate each call",
        "tests": "a0p_skills.contracts.tools_odysseus_relay_request_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/odysseus_relay.py",
      "id": "tools_odysseus_relay"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure in-process registry; per-invocation sentinel gating delegated to gated_invoke",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/registry.py",
      "id": "tools_registry_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:none, network:none, user_data:read",
        "exposes": "Tool, ToolError, register, lookup, unregister, is_global, user_tool_names, list_tools, invoke, TOOL_KIND_*",
        "owner": "Erin Spencer",
        "summary": "tool spec + registry + invocation entry point"
      },
      "file": "backend/tools/registry.py",
      "id": "tools_registry"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.tools_registry_register_and_invoke_holds",
        "class": "correctness",
        "given": "a native Tool registered and invoked through gated_invoke",
        "then": "the registry returns the tool by name and a valid invocation returns"
      },
      "file": "backend/tools/registry.py",
      "id": "tools_registry_register_and_invoke"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_REG, _validate_input",
        "module_kind": "engine",
        "module_name": "registry",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "Tool, ToolError, register, lookup, unregister, is_global, user_tool_names, list_tools, invoke, TOOL_KIND_NATIVE, TOOL_KIND_WEBHOOK, TOOL_KIND_MCP, TOOL_KIND_ODYSSEUS",
        "rollback": "revert; agents lose tool-calling surface",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "in-process Tool registry + invocation surface \u2014 Tool, ToolError, register, lookup, list_tools, invoke; every invocation routes through the sentinel evaluator (gated_invoke) so cliff-mode S4/S12 etc. can halt before any side effect; tools may be native (python callable), webhook (user-registered URL with HMAC), or mcp (relayed to a registered MCP server)",
        "tests": "a0p_skills.contracts.tools_registry_register_and_invoke_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/registry.py",
      "id": "tools_registry"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "outbound HMAC-signed webhook calls",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/webhook.py",
      "id": "tools_webhook_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:none, network:external, user_data:read",
        "exposes": "invoke",
        "owner": "Erin Spencer",
        "summary": "hmac-signed webhook dispatcher"
      },
      "file": "backend/tools/webhook.py",
      "id": "tools_webhook"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.tools_webhook_signs_holds",
        "class": "correctness",
        "given": "a webhook Tool with a known secret and a known payload",
        "then": "_sign produces the expected HMAC-SHA256 hex digest"
      },
      "file": "backend/tools/webhook.py",
      "id": "tools_webhook_signs"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "_sign",
        "module_kind": "adapter",
        "module_name": "webhook",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "invoke",
        "rollback": "revert; webhook-typed tools fail to dispatch",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "invoke user-registered webhook tools \u2014 POSTs the JSON params to the user's URL with an HMAC-SHA256 signature header (X-A0P-Signature) so the user can verify the call came from a0p",
        "tests": "a0p_skills.contracts.tools_webhook_signs_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/tools/webhook.py",
      "id": "tools_webhook"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "append-only metadata logging of HTTP traffic; no bodies, headers, cookies, or secrets are ever written",
        "user_data_boundary": "read"
      },
      "file": "backend/traffic_log.py",
      "id": "traffic_log_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:none, user_data:read",
        "exposes": "traffic_middleware, log_path",
        "owner": "Erin Spencer",
        "summary": "ASGI middleware appending one JSONL metadata line per request to an append-only sink"
      },
      "file": "backend/traffic_log.py",
      "id": "traffic_log"
    },
    {
      "block": "CONTRACTS",
      "fields": {
        "call": "a0p_skills.contracts.traffic_log_append_only_holds",
        "class": "correctness",
        "given": "per the module's declared behaviour",
        "then": "the named callable returns without raising"
      },
      "file": "backend/traffic_log.py",
      "id": "traffic_log_append_only"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "hmmm": "the sink is an append-only JSONL file (open mode \"a\"); rotation/retention is left to the host/ops layer",
        "internal_surface": "_resolve_uid, _append, _ensure_dir",
        "module_kind": "worker",
        "module_name": "traffic_log",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "traffic_middleware, log_path, LOG_PATH_ENV",
        "rollback": "remove the app.middleware registration in server.py and this module",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "append-only traffic logger \u2014 an ASGI middleware that records one JSONL line of request METADATA per HTTP call (ts, method, path, status, latency_ms, client ip, user-agent, best-effort user id) to an append-only sink; never logs request/response bodies, headers, cookies, or any secret material",
        "tests": "a0p_skills.contracts.traffic_log_append_only_holds",
        "user_data_boundary": "read"
      },
      "file": "backend/traffic_log.py",
      "id": "traffic_log"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "routing shell + auth provider",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/App.js",
      "id": "fe_app_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:none, network:none, user_data:read",
        "exposes": "App",
        "owner": "Erin Spencer",
        "summary": "routing shell with auth gating"
      },
      "file": "frontend/src/App.js",
      "id": "fe_app"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "none",
        "module_kind": "ui_root",
        "module_name": "App",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "App",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "top-level router with AuthProvider \u2014 public routes (/, /login, /register, /spec) and protected routes (/workspace, /agents, /sentinels, /overrides, /inspector, /inventory, /keys, /custom-keys, /vault, /drafts)",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/App.js",
      "id": "fe_app"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "polling read-only viewer for /api/audit/feed",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/components/AuditTape.jsx",
      "id": "fe_component_audit_tape_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:none, network:external, user_data:read",
        "exposes": "AuditTape",
        "owner": "Erin Spencer",
        "summary": "live audit tape ui"
      },
      "file": "frontend/src/components/AuditTape.jsx",
      "id": "fe_component_audit_tape"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "TapeRow, useAuditFeed, formatPayload",
        "module_kind": "ui_component",
        "module_name": "AuditTape",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "AuditTape",
        "rollback": "revert; workspace loses the tape panel",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "live polling FIQ-chain tape for the active agent \u2014 surfaces tool_call, sentinel_verdict, chat_reply, override_created events with their hash chain (prev_hash \u2192 this_hash) so the user can watch chain-of-thought / tool invocations as they happen; collapsible; verifies chain integrity client-side",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/components/AuditTape.jsx",
      "id": "fe_component_audit_tape"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "form ui; reads /api/tools to populate the tools allow-list; submit delegated via onSubmit prop",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/components/CharacterSheetForm.jsx",
      "id": "fe_component_character_sheet_form_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:write",
        "exposes": "CharacterSheetForm",
        "owner": "Erin Spencer",
        "summary": "fully-editable agent character sheet form"
      },
      "file": "frontend/src/components/CharacterSheetForm.jsx",
      "id": "fe_component_character_sheet_form"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "Field, ChipToggle, useTools",
        "module_kind": "ui_component",
        "module_name": "CharacterSheetForm",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "CharacterSheetForm",
        "rollback": "revert; agent creation requires raw POST",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "fully-editable character-sheet form for an Agent \u2014 name, mode (5-lattice), models, system_prompt, persona, live tools_allowed multi-select (fetched from /api/tools with a custom-name fallback), memory seeds (long/short term), teacher_context_template, tags, boundary declarations, native-readiness thresholds, gonal assignment; structural engine dicts (edcm/ring_n_override/heptagram_overrides/px_resolution) are intentionally NOT exposed (engine-owned); emits onSubmit(sheet)",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/components/CharacterSheetForm.jsx",
      "id": "fe_component_character_sheet_form"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure renderer, no I/O",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/components/MarkdownView.jsx",
      "id": "fe_component_markdown_view_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "MarkdownView",
        "owner": "Erin Spencer",
        "summary": "pure renderer for markdown + math"
      },
      "file": "frontend/src/components/MarkdownView.jsx",
      "id": "fe_component_markdown_view"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "ui_component",
        "module_name": "MarkdownView",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "MarkdownView",
        "rollback": "revert; chat replies render as plain text",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "render Markdown + GFM tables + LaTeX (incl. arxiv \\\\(...\\\\) and \\\\[...\\\\] forms) via react-markdown + remark-math + rehype-katex",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/components/MarkdownView.jsx",
      "id": "fe_component_markdown_view"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "ui-only; calls /api/overrides/{id}/approve or reject through props",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/components/OverrideModal.jsx",
      "id": "fe_component_override_modal_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:write",
        "exposes": "OverrideModal",
        "owner": "Erin Spencer",
        "summary": "ui-only; calls approve/reject through props"
      },
      "file": "frontend/src/components/OverrideModal.jsx",
      "id": "fe_component_override_modal"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "ReasonField",
        "module_kind": "ui_component",
        "module_name": "OverrideModal",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "OverrideModal",
        "rollback": "revert; user must use OverridesPage for approval",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "modal that surfaces a pending sentinel-override and asks the user to approve (with justification) or reject (with reason); destructive cliff overrides require typed confirmation",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/components/OverrideModal.jsx",
      "id": "fe_component_override_modal"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "presentational only",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/components/Panel.jsx",
      "id": "fe_component_panel_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "Panel, Pill, Stat, AsciiLoader",
        "owner": "Erin Spencer",
        "summary": "presentational primitives for shells"
      },
      "file": "frontend/src/components/Panel.jsx",
      "id": "fe_component_panel"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "ui_component",
        "module_name": "Panel",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "Panel, Pill, Stat, AsciiLoader",
        "rollback": "revert; downstream pages lose Panel/Pill/Stat helpers",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "shared presentational primitives \u2014 Panel section, Pill badge, Stat metric tile, AsciiLoader progress indicator",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/components/Panel.jsx",
      "id": "fe_component_panel"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "presentational component over a sentinel Verdict13 dict",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/components/SentinelVerdictRibbon.jsx",
      "id": "fe_component_sentinel_ribbon_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "SentinelVerdictRibbon",
        "owner": "Erin Spencer",
        "summary": "presentational component over a sentinel Verdict13 dict"
      },
      "file": "frontend/src/components/SentinelVerdictRibbon.jsx",
      "id": "fe_component_sentinel_ribbon"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "Pill",
        "module_kind": "ui_component",
        "module_name": "SentinelVerdictRibbon",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "SentinelVerdictRibbon",
        "rollback": "revert; replace with text dump",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "render the 13-sentinel verdict as a horizontal pill ribbon; hover shows full verdict row; click toggles details panel",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/components/SentinelVerdictRibbon.jsx",
      "id": "fe_component_sentinel_ribbon"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "presentational navigation only",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/components/Shell.jsx",
      "id": "fe_component_shell_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "Shell",
        "owner": "Erin Spencer",
        "summary": "presentational navigation shell"
      },
      "file": "frontend/src/components/Shell.jsx",
      "id": "fe_component_shell"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "items",
        "module_kind": "ui_component",
        "module_name": "Shell",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "Shell",
        "rollback": "revert; navigation disappears",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "left-rail navigation shell with 9 routes (Workspace, Agents, Sentinels, Overrides, Inspector, Inventory, Key Vault, Env Vault, Drafts) and donation CTA",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/components/Shell.jsx",
      "id": "fe_component_shell"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "thin client over the REST surface; no caching, no I/O persistence",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/lib/api.js",
      "id": "fe_lib_api_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:write",
        "exposes": "api",
        "owner": "Erin Spencer",
        "summary": "REST client surface for every /api endpoint"
      },
      "file": "frontend/src/lib/api.js",
      "id": "fe_lib_api"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "client",
        "module_kind": "client",
        "module_name": "api",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "api",
        "rollback": "revert; every page loses its data layer",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "axios-based REST client for every /api endpoint \u2014 health, BYOK keys, env vault, inventory, sessions, drafts, skill reports, fanout/daisy/synthesize chat, inspector, agents+slugs, instances CRUD, chat/instance, sentinels canon+modes+weights, overrides queue, chat-training readout/disk-stack, agent-lab permutations/plan/identity/sub-memory, gonals, usage",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/lib/api.js",
      "id": "fe_lib_api"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "REST client for the new layer",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/lib/api_tools.js",
      "id": "fe_lib_api_tools_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:none, network:external, user_data:write",
        "exposes": "toolsApi, mcpClientApi, mcpPublishApi, skillsApi",
        "owner": "Erin Spencer",
        "summary": "tools/mcp/skills client"
      },
      "file": "frontend/src/lib/api_tools.js",
      "id": "fe_lib_api_tools"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "client",
        "module_kind": "client",
        "module_name": "api_tools",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "toolsApi, mcpClientApi, mcpPublishApi, skillsApi",
        "rollback": "revert; tools/mcp/skills pages lose their data layer",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "axios client for the tools / mcp servers / skills REST surface \u2014 list/register/invoke tools, MCP server CRUD with refresh, skills CRUD with overlap check, skill-lib sync, MCP publish token",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/lib/api_tools.js",
      "id": "fe_lib_api_tools"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "client-side auth state container + axios wrapper",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/lib/auth.jsx",
      "id": "fe_lib_auth_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:none, network:external, user_data:write",
        "exposes": "AuthProvider, useAuth, ProtectedRoute, formatApiErrorDetail",
        "owner": "Erin Spencer",
        "summary": "auth state + ProtectedRoute"
      },
      "file": "frontend/src/lib/auth.jsx",
      "id": "fe_lib_auth"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "AuthCtx",
        "module_kind": "ui_lib",
        "module_name": "auth",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "AuthProvider, useAuth, ProtectedRoute, formatApiErrorDetail",
        "rollback": "revert; app becomes single-user demo again",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "AuthContext + useAuth hook + ProtectedRoute \u2014 manages JWT-cookie session, exposes user/loading/login/register/logout/refresh, redirects unauthenticated traffic to /login while keeping the splash & login routes public",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/lib/auth.jsx",
      "id": "fe_lib_auth"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "pure constant helpers; no side effects",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/lib/sentinels.js",
      "id": "fe_lib_sentinels_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:none, user_data:read",
        "exposes": "SENTINEL_CANON, MODE_OPTIONS, MODE_LABELS, sentinelClass, modeBadgeClass",
        "owner": "Erin Spencer",
        "summary": "pure constant helpers; no side effects"
      },
      "file": "frontend/src/lib/sentinels.js",
      "id": "fe_lib_sentinels"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "ui_lib",
        "module_name": "sentinels",
        "network_boundary": "none",
        "owner": "Erin Spencer",
        "public_surface": "SENTINEL_CANON, MODE_OPTIONS, MODE_LABELS, sentinelClass, modeBadgeClass, canonicalAgentName, composeAgentName",
        "rollback": "revert; lose pretty colours",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "client-side helpers + canonical metadata for the 13 sentinels and the 6 lattice modes, plus the canonical agent-name composer (a0(<energy>)<auditor>, owner-namespaced); pure, no I/O",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/lib/sentinels.js",
      "id": "fe_lib_sentinels"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "cookie",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "reads the permutation catalogue + plans recipes + previews identity + runs the volatile sub-memory demo; the create action drives the existing /api/instances route",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/pages/AgentLabPage.jsx",
      "id": "fe_page_agent_lab_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:cookie, storage:none, network:external, user_data:read",
        "exposes": "AgentLabPage",
        "owner": "Erin Spencer",
        "summary": "agent-creation permutation composer + planner + native create + volatile sub-memory demo"
      },
      "file": "frontend/src/pages/AgentLabPage.jsx",
      "id": "fe_page_agent_lab"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "cookie",
        "internal_surface": "StageCard, PlanStep, KIND_TONE",
        "module_kind": "ui_page",
        "module_name": "AgentLabPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "AgentLabPage",
        "rollback": "revert; remove /agent-lab route + nav item",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "the Agent Creation Lab \u2014 compose ANY permutation of a0 agent-creation logic and run it. Loads the permutation catalogue (GET /api/agent-lab/permutations), lets the user pick the a0(<energy>)<auditor> mode from the 6-lattice with a live identity preview (POST /api/agent-lab/identity-preview), toggle the optional/plan-only stages (distill unlock, sentinel config, volatile sub-memory, and the cross-repo a0-canonical fork/absorb/converge), and compose a validated ordered plan (POST /api/agent-lab/plan) whose steps each show the real route/primitive they execute against \u2014 native stages badged executable, cross-repo stages badged plan-only. A \"create\" action actually mints the native agent (POST /api/instances) from the composed character sheet, and a sub-memory panel runs the real volatile MemoryCore spawn_sub/merge_sub primitive (POST /api/agent-lab/sub-memory). Surfaces the recompose-only / non-committable-checkpoint / no-theorem-transfer firewalls.",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/pages/AgentLabPage.jsx",
      "id": "fe_page_agent_lab"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "page-level CRUD over /api/instances",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/AgentsPage.jsx",
      "id": "fe_page_agents_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:write",
        "exposes": "AgentsPage",
        "owner": "Erin Spencer",
        "summary": "page-level CRUD over /api/instances"
      },
      "file": "frontend/src/pages/AgentsPage.jsx",
      "id": "fe_page_agents"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "Row, useAgents",
        "module_kind": "ui_page",
        "module_name": "AgentsPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "AgentsPage",
        "rollback": "revert; agent CRUD requires curl",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "agent CRUD \u2014 list every instance with zfae metrics, create via CharacterSheetForm, edit existing sheet, archive/delete",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/AgentsPage.jsx",
      "id": "fe_page_agents"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "cookie",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "reads embedding/EDCM/gonal readouts + disk stacks; no writes, no storage",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/pages/ChatTrainingPage.jsx",
      "id": "fe_page_chat_training_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:cookie, storage:none, network:external, user_data:read",
        "exposes": "ChatTrainingPage",
        "owner": "Erin Spencer",
        "summary": "UCNS-native embedding + EDCM + cylindrical gonal disk-stack inspector"
      },
      "file": "frontend/src/pages/ChatTrainingPage.jsx",
      "id": "fe_page_chat_training"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "cookie",
        "internal_surface": "PhaseDisk, EdcmBars, GonalCores, DiskRow",
        "module_kind": "ui_page",
        "module_name": "ChatTrainingPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "ChatTrainingPage",
        "rollback": "revert; remove /chat-training route + nav item",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "standalone Chat Training tab \u2014 inspect the substrate a training turn touches. A single-turn readout (POST /api/training/readout) renders the turn's UCNS-native embedding as a unit-circle phase disk (one dot per lane, placed by angle, colored by Mobius face) with its phase coherence, the six-family EDCM projection (CM/DA/DRIFT/DVG/INT/TBF) with 0.80/0.20 alert bands, and the three-core gonal disk (phi content-phase / omega bone-density / psi coherence). A session builder (POST /api/training/disk-stack) folds a batch of utterances into a cylindrical disk stack of chapter-scale gonols \u2014 one 157-gonal disk per depth-rung (leaf..chapter), the chapter rung being the phase-product (\u22a0) recomposition. Read-only inspection; weight training stays on the Training Room. Surfaces the recompose-only + UCNS-G/non-absolute firewalls on every result.",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/pages/ChatTrainingPage.jsx",
      "id": "fe_page_chat_training"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "CRUD over /api/custom-keys",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/CustomKeysPage.jsx",
      "id": "fe_page_custom_keys_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:external, user_data:write",
        "exposes": "CustomKeysPage",
        "owner": "Erin Spencer",
        "summary": "developer keys ui"
      },
      "file": "frontend/src/pages/CustomKeysPage.jsx",
      "id": "fe_page_custom_keys"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "Row, AddForm",
        "module_kind": "ui_page",
        "module_name": "CustomKeysPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "CustomKeysPage",
        "rollback": "revert; custom keys vault unreachable from UI",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "user-owned developer key vault \u2014 name + value (Fernet-encrypted at rest) + kind + label; supports rotation (PUT same name) and reveal (decrypt on demand); for GitHub PATs, GCP service accounts, AWS access keys, anything non-LLM",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/CustomKeysPage.jsx",
      "id": "fe_page_custom_keys"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "CRUD over /api/drafts",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/DraftsPage.jsx",
      "id": "fe_page_drafts_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:write",
        "exposes": "DraftsPage",
        "owner": "Erin Spencer",
        "summary": "drafts CRUD ui"
      },
      "file": "frontend/src/pages/DraftsPage.jsx",
      "id": "fe_page_drafts"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "ui_page",
        "module_name": "DraftsPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "DraftsPage",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "local prompt drafts \u2014 list / create / edit / delete; persists via /api/drafts",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/DraftsPage.jsx",
      "id": "fe_page_drafts"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "read-only inspector",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/pages/InspectorPage.jsx",
      "id": "fe_page_inspector_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:read",
        "exposes": "InspectorPage",
        "owner": "Erin Spencer",
        "summary": "inspector dashboard ui"
      },
      "file": "frontend/src/pages/InspectorPage.jsx",
      "id": "fe_page_inspector"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "ui_page",
        "module_name": "InspectorPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "InspectorPage",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "live inspector for PCNA/PTCA/PCEA skills + msdmd compliance reports (capabilities / module-build / contracts coverage); heartbeat ping",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/pages/InspectorPage.jsx",
      "id": "fe_page_inspector"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "inventory viewer + per-model \"create agent\" action",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/InventoryPage.jsx",
      "id": "fe_page_inventory_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:write",
        "exposes": "InventoryPage",
        "owner": "Erin Spencer",
        "summary": "model inventory ui + agent instantiation"
      },
      "file": "frontend/src/pages/InventoryPage.jsx",
      "id": "fe_page_inventory"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "createAgentFor",
        "module_kind": "ui_page",
        "module_name": "InventoryPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "InventoryPage",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "discovered model inventory across providers (openai, anthropic, gemini, xai) \u2014 populated from /api/models/inventory; each row has a \"create agent\" action that instantiates a teacher-assisted a0(zfae) agent bound to that model and opens it in the workspace",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/InventoryPage.jsx",
      "id": "fe_page_inventory"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "BYOK key crud",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/KeyVaultPage.jsx",
      "id": "fe_page_keyvault_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:external, user_data:write",
        "exposes": "KeyVaultPage",
        "owner": "Erin Spencer",
        "summary": "BYOK keys management ui"
      },
      "file": "frontend/src/pages/KeyVaultPage.jsx",
      "id": "fe_page_keyvault"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "ui_page",
        "module_name": "KeyVaultPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "KeyVaultPage",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "BYOK key vault \u2014 list, upsert (Fernet-encrypted), delete BYOK provider keys (OpenAI/Anthropic/Gemini/XAI)",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/KeyVaultPage.jsx",
      "id": "fe_page_keyvault"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "read-only viewer for /api/spec/living",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/pages/LivingSpecPage.jsx",
      "id": "fe_page_living_spec_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:read",
        "exposes": "LivingSpecPage",
        "owner": "Erin Spencer",
        "summary": "living spec viewer"
      },
      "file": "frontend/src/pages/LivingSpecPage.jsx",
      "id": "fe_page_living_spec"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "ModuleCard, BlockTable",
        "module_kind": "ui_page",
        "module_name": "LivingSpecPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "LivingSpecPage",
        "rollback": "revert; living spec view disappears",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "renders every msdmd block parsed live from the repo \u2014 grouped by module_kind, searchable, expandable per module to show MODULE_BUILD / BOUNDARIES / CAPABILITIES / CONTRACTS / RATIOS in full",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/pages/LivingSpecPage.jsx",
      "id": "fe_page_living_spec"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "sign-in / sign-up form",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/LoginPage.jsx",
      "id": "fe_page_login_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:none, network:external, user_data:write",
        "exposes": "LoginPage",
        "owner": "Erin Spencer",
        "summary": "sign-in / sign-up form"
      },
      "file": "frontend/src/pages/LoginPage.jsx",
      "id": "fe_page_login"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "PassphraseField, SocialRow",
        "module_kind": "ui_page",
        "module_name": "LoginPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "LoginPage",
        "rollback": "revert; user cannot sign in via UI",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "tabbed sign-in / sign-up screen \u2014 username or email + \u226516-char passphrase (show/hide toggle) + Emergent Google + GitHub OAuth; auto-resumes the user's intended route after auth",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/LoginPage.jsx",
      "id": "fe_page_login"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "MCP server + client management ui",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/MCPPage.jsx",
      "id": "fe_page_mcp_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:external, user_data:write",
        "exposes": "MCPPage",
        "owner": "Erin Spencer",
        "summary": "MCP server + client ui"
      },
      "file": "frontend/src/pages/MCPPage.jsx",
      "id": "fe_page_mcp"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "ServerRow, AddServerForm, PublishCard",
        "module_kind": "ui_page",
        "module_name": "MCPPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "MCPPage",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "Model Context Protocol surface \u2014 (a) inbound: shows the user's publish token + URL so external Claude Desktop / Cursor / etc. can connect to a0p as an MCP server; (b) outbound: lets the user register external MCP servers (GitHub MCP, Slack MCP, Postgres MCP, ...) and refreshes their tool catalogs into the user's tool registry",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/MCPPage.jsx",
      "id": "fe_page_mcp"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "page-level approve/reject of pending overrides",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/OverridesPage.jsx",
      "id": "fe_page_overrides_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:write",
        "exposes": "OverridesPage",
        "owner": "Erin Spencer",
        "summary": "page-level approve/reject of pending overrides"
      },
      "file": "frontend/src/pages/OverridesPage.jsx",
      "id": "fe_page_overrides"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "OverrideRow, useOverrides",
        "module_kind": "ui_page",
        "module_name": "OverridesPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "OverridesPage",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "queue of pending sentinel overrides; approve (with justification) or reject; expired overrides housekeeping; shows flagged sentinels + raw request snippet",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/OverridesPage.jsx",
      "id": "fe_page_overrides"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "page-level CRUD over sentinel modes/weights for one agent",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/SentinelsPage.jsx",
      "id": "fe_page_sentinels_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:write",
        "exposes": "SentinelsPage",
        "owner": "Erin Spencer",
        "summary": "page-level CRUD over sentinel modes/weights for one agent"
      },
      "file": "frontend/src/pages/SentinelsPage.jsx",
      "id": "fe_page_sentinels"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "CanonTable, ModeRow, useSentinelState",
        "module_kind": "ui_page",
        "module_name": "SentinelsPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "SentinelsPage",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "view the 13-sentinel canon + edit per-agent sentinel modes (observe/flag/off) and weights for a selected agent",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/SentinelsPage.jsx",
      "id": "fe_page_sentinels"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "skill CRUD ui with overlap detection",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/SkillsPage.jsx",
      "id": "fe_page_skills_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:external, user_data:write",
        "exposes": "SkillsPage",
        "owner": "Erin Spencer",
        "summary": "skills ui"
      },
      "file": "frontend/src/pages/SkillsPage.jsx",
      "id": "fe_page_skills"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "SkillCard, ComposeForm, OverlapList",
        "module_kind": "ui_page",
        "module_name": "SkillsPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "SkillsPage",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "skill catalog browser + authoring form with live overlap warning before save (jaccard \u22650.6 over scope \u222a logic tokens against existing user+global skills); admin-style sync button pulls global skills from The-Interdependency/skill-lib",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/SkillsPage.jsx",
      "id": "fe_page_skills"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "presentational landing page",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/pages/SplashPage.jsx",
      "id": "fe_page_splash_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:none, network:external, user_data:read",
        "exposes": "SplashPage",
        "owner": "Erin Spencer",
        "summary": "public landing page"
      },
      "file": "frontend/src/pages/SplashPage.jsx",
      "id": "fe_page_splash"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "ui_page",
        "module_name": "SplashPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "SplashPage",
        "rollback": "revert; '/' renders the Workspace directly",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "public landing \u2014 \"changes constant. refinements welcome.\" manifesto + Sign in / Sign up CTAs + email-of-record (wayseer@interdependentway.org); shows demo-mode notice for unauthenticated visitors",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "read"
      },
      "file": "frontend/src/pages/SplashPage.jsx",
      "id": "fe_page_splash"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "tools CRUD + invocation ui",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/ToolsPage.jsx",
      "id": "fe_page_tools_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:bearer, storage:write, network:external, user_data:write",
        "exposes": "ToolsPage",
        "owner": "Erin Spencer",
        "summary": "tools ui"
      },
      "file": "frontend/src/pages/ToolsPage.jsx",
      "id": "fe_page_tools"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "bearer",
        "internal_surface": "ToolRow, AddWebhookForm, InvokeModal",
        "module_kind": "ui_page",
        "module_name": "ToolsPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "ToolsPage",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "lists every native + user-webhook + MCP-relay tool the current user can invoke; allows registering new user-webhook tools and invoking any tool with arbitrary JSON params; surfaces sentinel halts as override prompts",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/ToolsPage.jsx",
      "id": "fe_page_tools"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "cookie",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "none",
        "summary": "drives multi-teacher distillation; reads inventory + instances; writes via /train",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/TrainingRoom.jsx",
      "id": "fe_page_training_room_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:cookie, storage:none, network:external, user_data:write",
        "exposes": "TrainingRoom",
        "owner": "Erin Spencer",
        "summary": "multi-teacher zfae distillation ui"
      },
      "file": "frontend/src/pages/TrainingRoom.jsx",
      "id": "fe_page_training_room"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "cookie",
        "internal_surface": "ModelChips",
        "module_kind": "ui_page",
        "module_name": "TrainingRoom",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "TrainingRoom",
        "rollback": "revert; remove /training route + nav item",
        "rollout": "default_enabled",
        "storage_boundary": "none",
        "summary": "multi-teacher distillation room \u2014 pick an agent, select TWO OR MORE teacher models (from the live inventory or custom ids), enter a batch of prompts (one per line), and run POST /api/instances/{id}/train so the a0(zfae) echo learns one distill step per (prompt \u00d7 model); renders a live metrics ribbon + per-step results table",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/TrainingRoom.jsx",
      "id": "fe_page_training_room"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "env vault CRUD ui",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/VaultPage.jsx",
      "id": "fe_page_vault_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:external, user_data:write",
        "exposes": "VaultPage",
        "owner": "Erin Spencer",
        "summary": "env vault ui"
      },
      "file": "frontend/src/pages/VaultPage.jsx",
      "id": "fe_page_vault"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "none",
        "module_kind": "ui_page",
        "module_name": "VaultPage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "VaultPage",
        "rollback": "revert",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "per-site multi-account env vault \u2014 list, reveal (decrypts on demand), upsert, delete",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/VaultPage.jsx",
      "id": "fe_page_vault"
    },
    {
      "block": "BOUNDARIES",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "storage_boundary": "write",
        "summary": "page-level chat workspace bound to one agent instance",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/WorkspacePage.jsx",
      "id": "fe_page_workspace_boundaries"
    },
    {
      "block": "CAPABILITIES",
      "fields": {
        "boundaries": "auth:none, storage:write, network:external, user_data:write",
        "exposes": "WorkspacePage",
        "owner": "Erin Spencer",
        "summary": "page-level chat workspace bound to one agent instance"
      },
      "file": "frontend/src/pages/WorkspacePage.jsx",
      "id": "fe_page_workspace"
    },
    {
      "block": "MODULE_BUILD",
      "fields": {
        "admin_only": "false",
        "auth_boundary": "none",
        "internal_surface": "useQueryAgentId, Turn, AgentBar, ModeBar",
        "module_kind": "ui_page",
        "module_name": "WorkspacePage",
        "network_boundary": "external",
        "owner": "Erin Spencer",
        "public_surface": "WorkspacePage",
        "rollback": "revert; chat requires curl",
        "rollout": "default_enabled",
        "storage_boundary": "write",
        "summary": "chat workspace bound to one agent instance; sends prompts through /api/chat/instance/{id}; renders per-turn sentinel verdict ribbon; intercepts HTTP 202 sentinel-halts and opens an OverrideModal that resumes the same prompt with override_id on approval",
        "tests": "manual_browser_smoke",
        "user_data_boundary": "write"
      },
      "file": "frontend/src/pages/WorkspacePage.jsx",
      "id": "fe_page_workspace"
    }
  ],
  "edges": [
    {
      "from": "a0p_contracts_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "a0p_contracts_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_crypto_vault_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "a0p_crypto_vault_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_db_motor_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "a0p_db_motor_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_models_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "a0p_models_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_server_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "a0p_server_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_skills_frontend_module_build_runner_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "a0p_skills_frontend_module_build_runner_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "a0p_skills_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "a0p_skills_pkg_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "agents_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "agents_pkg_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "agents_routes_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "agents_routes_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "agents_schema_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "agents_schema_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "agents_store_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "agents_store_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "aimmh_patterns_impl_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "aimmh_patterns_impl_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "aimmh_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "aimmh_pkg_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "api_agent_lab_routes_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "api_agent_lab_routes_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "api_extensions_routes_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "api_extensions_routes_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "api_tools_mcp_skills_routes_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "api_tools_mcp_skills_routes_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "api_training_routes_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "api_training_routes_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "app_settings_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "app_settings_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "auth_routes_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "auth_routes_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "boundaries_runner_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "boundaries_runner_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "capabilities_runner_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "capabilities_runner_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "carrier_adjacency_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "carrier_adjacency_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_bones_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "carrier_bones_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_classes_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "carrier_classes_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_disk_protocol_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "carrier_disk_protocol_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_faces_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "carrier_faces_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_gonal_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "carrier_gonal_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_mirror_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "carrier_mirror_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "carrier_pkg_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_public_fixture_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "carrier_public_fixture_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_registry_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "carrier_registry_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_app_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_app_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_audit_tape_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_component_audit_tape_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_character_sheet_form_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_component_character_sheet_form_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_markdown_view_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_component_markdown_view_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_override_modal_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_component_override_modal_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_panel_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_component_panel_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_sentinel_ribbon_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_component_sentinel_ribbon_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_shell_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_component_shell_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_api_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_lib_api_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_api_tools_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_lib_api_tools_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_auth_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_lib_auth_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_sentinels_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_lib_sentinels_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_agent_lab_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_agent_lab_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_agents_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_agents_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_chat_training_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_chat_training_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_custom_keys_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_custom_keys_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_drafts_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_drafts_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_inspector_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_inspector_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_inventory_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_inventory_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_keyvault_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_keyvault_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_living_spec_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_living_spec_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_login_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_login_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_mcp_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_mcp_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_overrides_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_overrides_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_sentinels_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_sentinels_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_skills_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_skills_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_splash_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_splash_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_tools_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_tools_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_training_room_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_training_room_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_vault_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_vault_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_workspace_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fe_page_workspace_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_audit_log_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fiq_audit_log_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_events_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fiq_events_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_ficks_gradient_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fiq_ficks_gradient_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_gate_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fiq_gate_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_motion_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fiq_motion_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fiq_pkg_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_sentinels_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fiq_sentinels_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_tick_schedule_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "fiq_tick_schedule_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "gonal_lifted_path_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "gonal_lifted_path_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "il_edcm_readout_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "il_edcm_readout_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "il_gonal_stack_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "il_gonal_stack_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "il_ucns_embed_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "il_ucns_embed_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "interdependent_lib_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "interdependent_lib_pkg_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "living_spec_scanner_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "living_spec_scanner_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "module_build_runner_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "module_build_runner_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "msdmd_parser_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "msdmd_parser_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "msdmd_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "msdmd_pkg_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "msdmd_runner_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "msdmd_runner_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "network_coherence_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "network_coherence_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "network_engine_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "network_engine_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "network_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "network_pkg_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "network_propagate_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "network_propagate_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "network_rings_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "network_rings_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "network_sigma_source_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "network_sigma_source_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "network_topology_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "network_topology_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_cipher_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcea_cipher_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_codec_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcea_codec_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_instance_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcea_instance_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_kernel_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcea_kernel_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcea_pkg_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_primes_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcea_primes_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_edcm_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcna_edcm_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_engine_impl_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcna_engine_impl_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_group_aggregate_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcna_group_aggregate_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_memory_core_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcna_memory_core_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcna_pkg_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_sigma_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcna_sigma_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_tensor_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcna_tensor_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_theta_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcna_theta_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_zeta_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcna_zeta_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcta_circle_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcta_circle_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "pcta_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "pcta_pkg_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_anthropic_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "provider_anthropic_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_base_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "provider_base_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_gemini_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "provider_gemini_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_openai_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "provider_openai_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_xai_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "provider_xai_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "providers_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "providers_pkg_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_constants_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ptca_constants_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_core_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ptca_core_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_exchange_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ptca_exchange_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_instance_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ptca_instance_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ptca_pkg_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_primes_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ptca_primes_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_provenance_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ptca_provenance_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_seed_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ptca_seed_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_sentinels_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ptca_sentinels_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_tensor_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ptca_tensor_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "ratios_runner_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ratios_runner_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "readme_writer_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "readme_writer_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "skills_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "skills_pkg_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "skills_registry_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "skills_registry_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "skills_sync_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "skills_sync_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "test_build_runner_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "test_build_runner_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "test_lifted_path_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "test_lifted_path_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "test_morphology_ladder_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "test_morphology_ladder_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "test_security_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "test_security_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "test_tool_use_loop_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "test_tool_use_loop_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "test_training_room_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "test_training_room_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tests_backend_test_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tests_backend_test_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tests_conftest_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tests_conftest_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tests_zfae_api_sentinels_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tests_zfae_api_sentinels_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tests_zfae_three_core_sentinels_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tests_zfae_three_core_sentinels_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "theta_microkernel_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "theta_microkernel_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "theta_private_loader_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "theta_private_loader_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_agent_loop_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tools_agent_loop_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_builtin_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tools_builtin_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_gated_invoke_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tools_gated_invoke_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_mcp_relay_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tools_mcp_relay_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_mcp_server_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tools_mcp_server_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_odysseus_relay_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tools_odysseus_relay_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tools_pkg_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_registry_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tools_registry_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_webhook_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "tools_webhook_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "traffic_log_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "traffic_log_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "ucns_bridge_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "ucns_bridge_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_archive_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_archive_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_closed_tokens_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_closed_tokens_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_fiq_emit_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_fiq_emit_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_gonal_inscription_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_gonal_inscription_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_inference_engine_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_inference_engine_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_intent_selector_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_intent_selector_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_long_memory_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_long_memory_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_morphology_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_morphology_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_native_tools_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_native_tools_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_overrides_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_overrides_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_pkg_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_pkg_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_runtime_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_runtime_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_semantic_parser_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_semantic_parser_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_sentinel_eval_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_sentinel_eval_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_sentinel_modes_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_sentinel_modes_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_sentinel_weights_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_sentinel_weights_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_sentinels_13_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_sentinels_13_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_state_transition_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_state_transition_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_teacher_client_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_teacher_client_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_template_decoder_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_template_decoder_boundaries",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_trainer_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_trainer_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_weight_bank_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_weight_bank_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_weight_init_boundaries",
      "kind": "owns",
      "source_block": "BOUNDARIES",
      "source_id": "zfae_weight_init_boundaries",
      "to": "Erin Spencer"
    },
    {
      "from": "a0p_contracts",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_contracts",
      "to": "aimmh_invoke_propagates_error"
    },
    {
      "from": "a0p_contracts",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_contracts",
      "to": "pcea_round_trip_53"
    },
    {
      "from": "a0p_contracts",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_contracts",
      "to": "skill_report_visibility_holds"
    },
    {
      "from": "a0p_contracts",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_contracts",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_contracts",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_contracts",
      "to": "auth:none"
    },
    {
      "from": "a0p_contracts",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_contracts",
      "to": "network:none"
    },
    {
      "from": "a0p_contracts",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_contracts",
      "to": "storage:read"
    },
    {
      "from": "a0p_contracts",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_contracts",
      "to": "user_data:none"
    },
    {
      "from": "a0p_crypto_vault",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_crypto_vault",
      "to": "decrypt"
    },
    {
      "from": "a0p_crypto_vault",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_crypto_vault",
      "to": "encrypt"
    },
    {
      "from": "a0p_crypto_vault",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_crypto_vault",
      "to": "mask"
    },
    {
      "from": "a0p_crypto_vault",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_crypto_vault",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_crypto_vault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_crypto_vault",
      "to": "auth:none"
    },
    {
      "from": "a0p_crypto_vault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_crypto_vault",
      "to": "network:none"
    },
    {
      "from": "a0p_crypto_vault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_crypto_vault",
      "to": "storage:none"
    },
    {
      "from": "a0p_crypto_vault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_crypto_vault",
      "to": "user_data:read"
    },
    {
      "from": "a0p_db_motor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "agents_col"
    },
    {
      "from": "a0p_db_motor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "chain_col"
    },
    {
      "from": "a0p_db_motor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "db"
    },
    {
      "from": "a0p_db_motor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "drafts_col"
    },
    {
      "from": "a0p_db_motor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "ensure_indexes"
    },
    {
      "from": "a0p_db_motor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "fanout_col"
    },
    {
      "from": "a0p_db_motor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "keys_col"
    },
    {
      "from": "a0p_db_motor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "sessions_col"
    },
    {
      "from": "a0p_db_motor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "usage_col"
    },
    {
      "from": "a0p_db_motor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "vault_col"
    },
    {
      "from": "a0p_db_motor",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_db_motor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "auth:none"
    },
    {
      "from": "a0p_db_motor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "network:internal"
    },
    {
      "from": "a0p_db_motor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "storage:write"
    },
    {
      "from": "a0p_db_motor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_db_motor",
      "to": "user_data:write"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "AgentExport"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "ChatTurn"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "DaisyChainRequest"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "DraftPublic"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "DraftUpsert"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "FanOutRequest"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "KeyPublic"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "KeyUpsert"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "PROVIDERS"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "SessionPublic"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "SessionUpsert"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "SiteAccountPublic"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "SiteAccountUpsert"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "SynthesizeRequest"
    },
    {
      "from": "a0p_models",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "new_id"
    },
    {
      "from": "a0p_models",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_models",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "auth:none"
    },
    {
      "from": "a0p_models",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "network:none"
    },
    {
      "from": "a0p_models",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "storage:none"
    },
    {
      "from": "a0p_models",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_models",
      "to": "user_data:read"
    },
    {
      "from": "a0p_server",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_server",
      "to": "AGENT"
    },
    {
      "from": "a0p_server",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_server",
      "to": "api"
    },
    {
      "from": "a0p_server",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_server",
      "to": "app"
    },
    {
      "from": "a0p_server",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_server",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_server",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_server",
      "to": "auth:bearer"
    },
    {
      "from": "a0p_server",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_server",
      "to": "network:external"
    },
    {
      "from": "a0p_server",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_server",
      "to": "storage:write"
    },
    {
      "from": "a0p_server",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_server",
      "to": "user_data:write"
    },
    {
      "from": "a0p_skills_frontend_module_build_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_frontend_module_build_runner",
      "to": "main"
    },
    {
      "from": "a0p_skills_frontend_module_build_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_frontend_module_build_runner",
      "to": "scan_frontend"
    },
    {
      "from": "a0p_skills_frontend_module_build_runner",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_frontend_module_build_runner",
      "to": "Erin Spencer"
    },
    {
      "from": "a0p_skills_frontend_module_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_frontend_module_build_runner",
      "to": "auth:none"
    },
    {
      "from": "a0p_skills_frontend_module_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_frontend_module_build_runner",
      "to": "network:none"
    },
    {
      "from": "a0p_skills_frontend_module_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_frontend_module_build_runner",
      "to": "storage:none"
    },
    {
      "from": "a0p_skills_frontend_module_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_frontend_module_build_runner",
      "to": "user_data:read"
    },
    {
      "from": "a0p_skills_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_pkg",
      "to": "module_build_runner"
    },
    {
      "from": "a0p_skills_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_pkg",
      "to": "msdmd_runner"
    },
    {
      "from": "a0p_skills_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_pkg",
      "to": "registry"
    },
    {
      "from": "a0p_skills_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_pkg",
      "to": "test_build_runner"
    },
    {
      "from": "a0p_skills_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_skills_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_pkg",
      "to": "auth:none"
    },
    {
      "from": "a0p_skills_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_pkg",
      "to": "network:none"
    },
    {
      "from": "a0p_skills_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_pkg",
      "to": "storage:read"
    },
    {
      "from": "a0p_skills_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "a0p_skills_pkg",
      "to": "user_data:none"
    },
    {
      "from": "agents_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_pkg",
      "to": "ALL_MODES"
    },
    {
      "from": "agents_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_pkg",
      "to": "AgentInstance"
    },
    {
      "from": "agents_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_pkg",
      "to": "AgentMode"
    },
    {
      "from": "agents_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_pkg",
      "to": "AgentStore"
    },
    {
      "from": "agents_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_pkg",
      "to": "CharacterSheet"
    },
    {
      "from": "agents_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_pkg",
      "to": "PXResolution"
    },
    {
      "from": "agents_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "agents_pkg",
      "to": "Erin Spencer"
    },
    {
      "from": "agents_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_pkg",
      "to": "auth:none"
    },
    {
      "from": "agents_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_pkg",
      "to": "network:internal"
    },
    {
      "from": "agents_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_pkg",
      "to": "storage:write"
    },
    {
      "from": "agents_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_pkg",
      "to": "user_data:write"
    },
    {
      "from": "agents_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_routes",
      "to": "get_agent_store"
    },
    {
      "from": "agents_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_routes",
      "to": "router"
    },
    {
      "from": "agents_routes",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "agents_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "agents_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_routes",
      "to": "auth:none"
    },
    {
      "from": "agents_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_routes",
      "to": "network:external"
    },
    {
      "from": "agents_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_routes",
      "to": "storage:write"
    },
    {
      "from": "agents_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_routes",
      "to": "user_data:write"
    },
    {
      "from": "agents_schema",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_schema",
      "to": "ALL_MODES"
    },
    {
      "from": "agents_schema",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_schema",
      "to": "AgentInstance"
    },
    {
      "from": "agents_schema",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_schema",
      "to": "AgentMode"
    },
    {
      "from": "agents_schema",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_schema",
      "to": "CharacterSheet"
    },
    {
      "from": "agents_schema",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_schema",
      "to": "PXResolution"
    },
    {
      "from": "agents_schema",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_schema",
      "to": "new_agent_id"
    },
    {
      "from": "agents_schema",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "agents_schema",
      "to": "Erin Spencer"
    },
    {
      "from": "agents_schema",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_schema",
      "to": "auth:none"
    },
    {
      "from": "agents_schema",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_schema",
      "to": "network:none"
    },
    {
      "from": "agents_schema",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_schema",
      "to": "storage:none"
    },
    {
      "from": "agents_schema",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_schema",
      "to": "user_data:read"
    },
    {
      "from": "agents_store",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "agents_store",
      "to": "AgentStore"
    },
    {
      "from": "agents_store",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "agents_store",
      "to": "Erin Spencer"
    },
    {
      "from": "agents_store",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_store",
      "to": "auth:none"
    },
    {
      "from": "agents_store",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_store",
      "to": "network:internal"
    },
    {
      "from": "agents_store",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_store",
      "to": "storage:write"
    },
    {
      "from": "agents_store",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "agents_store",
      "to": "user_data:write"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_patterns_impl",
      "to": "ModelResult"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_patterns_impl",
      "to": "council"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_patterns_impl",
      "to": "daisy_chain"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_patterns_impl",
      "to": "fan_out"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_patterns_impl",
      "to": "room_all"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_patterns_impl",
      "to": "room_synthesized"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_patterns_impl",
      "to": "a0p maintainer"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_patterns_impl",
      "to": "auth:none"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_patterns_impl",
      "to": "network:none"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_patterns_impl",
      "to": "storage:none"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_patterns_impl",
      "to": "user_data:none"
    },
    {
      "from": "aimmh_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_pkg",
      "to": "ModelResult"
    },
    {
      "from": "aimmh_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_pkg",
      "to": "council"
    },
    {
      "from": "aimmh_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_pkg",
      "to": "daisy_chain"
    },
    {
      "from": "aimmh_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_pkg",
      "to": "fan_out"
    },
    {
      "from": "aimmh_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_pkg",
      "to": "room_all"
    },
    {
      "from": "aimmh_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_pkg",
      "to": "room_synthesized"
    },
    {
      "from": "aimmh_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "aimmh_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_pkg",
      "to": "auth:none"
    },
    {
      "from": "aimmh_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_pkg",
      "to": "network:none"
    },
    {
      "from": "aimmh_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_pkg",
      "to": "storage:none"
    },
    {
      "from": "aimmh_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "aimmh_pkg",
      "to": "user_data:none"
    },
    {
      "from": "api_agent_lab_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "api_agent_lab_routes",
      "to": "router"
    },
    {
      "from": "api_agent_lab_routes",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "api_agent_lab_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "api_agent_lab_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_agent_lab_routes",
      "to": "auth:bearer"
    },
    {
      "from": "api_agent_lab_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_agent_lab_routes",
      "to": "network:none"
    },
    {
      "from": "api_agent_lab_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_agent_lab_routes",
      "to": "storage:none"
    },
    {
      "from": "api_agent_lab_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_agent_lab_routes",
      "to": "user_data:read"
    },
    {
      "from": "api_extensions_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "api_extensions_routes",
      "to": "check_demo_quota"
    },
    {
      "from": "api_extensions_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "api_extensions_routes",
      "to": "record_demo_usage"
    },
    {
      "from": "api_extensions_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "api_extensions_routes",
      "to": "router"
    },
    {
      "from": "api_extensions_routes",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "api_extensions_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "api_extensions_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_extensions_routes",
      "to": "auth:bearer"
    },
    {
      "from": "api_extensions_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_extensions_routes",
      "to": "network:none"
    },
    {
      "from": "api_extensions_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_extensions_routes",
      "to": "storage:write"
    },
    {
      "from": "api_extensions_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_extensions_routes",
      "to": "user_data:write"
    },
    {
      "from": "api_tools_mcp_skills_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "api_tools_mcp_skills_routes",
      "to": "router"
    },
    {
      "from": "api_tools_mcp_skills_routes",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "api_tools_mcp_skills_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "api_tools_mcp_skills_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_tools_mcp_skills_routes",
      "to": "auth:bearer"
    },
    {
      "from": "api_tools_mcp_skills_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_tools_mcp_skills_routes",
      "to": "network:external"
    },
    {
      "from": "api_tools_mcp_skills_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_tools_mcp_skills_routes",
      "to": "storage:write"
    },
    {
      "from": "api_tools_mcp_skills_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_tools_mcp_skills_routes",
      "to": "user_data:write"
    },
    {
      "from": "api_training_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "api_training_routes",
      "to": "router"
    },
    {
      "from": "api_training_routes",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "api_training_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "api_training_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_training_routes",
      "to": "auth:bearer"
    },
    {
      "from": "api_training_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_training_routes",
      "to": "network:none"
    },
    {
      "from": "api_training_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_training_routes",
      "to": "storage:none"
    },
    {
      "from": "api_training_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "api_training_routes",
      "to": "user_data:read"
    },
    {
      "from": "app_settings",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "app_settings",
      "to": "get_setting"
    },
    {
      "from": "app_settings",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "app_settings",
      "to": "router"
    },
    {
      "from": "app_settings",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "app_settings",
      "to": "Erin Spencer"
    },
    {
      "from": "app_settings",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "app_settings",
      "to": "admin:true"
    },
    {
      "from": "app_settings",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "app_settings",
      "to": "auth:bearer"
    },
    {
      "from": "app_settings",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "app_settings",
      "to": "network:none"
    },
    {
      "from": "app_settings",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "app_settings",
      "to": "storage:write"
    },
    {
      "from": "app_settings",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "app_settings",
      "to": "user_data:write"
    },
    {
      "from": "auth_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "auth_routes",
      "to": "get_current_user"
    },
    {
      "from": "auth_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "auth_routes",
      "to": "get_current_user_or_demo"
    },
    {
      "from": "auth_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "auth_routes",
      "to": "init_auth"
    },
    {
      "from": "auth_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "auth_routes",
      "to": "router"
    },
    {
      "from": "auth_routes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "auth_routes",
      "to": "seed_admin"
    },
    {
      "from": "auth_routes",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "auth_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "auth_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "auth_routes",
      "to": "auth:bearer"
    },
    {
      "from": "auth_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "auth_routes",
      "to": "network:external"
    },
    {
      "from": "auth_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "auth_routes",
      "to": "storage:write"
    },
    {
      "from": "auth_routes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "auth_routes",
      "to": "user_data:write"
    },
    {
      "from": "boundaries_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "boundaries_runner",
      "to": "REQUIRED_FIELDS"
    },
    {
      "from": "boundaries_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "boundaries_runner",
      "to": "run"
    },
    {
      "from": "boundaries_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "boundaries_runner",
      "to": "summary"
    },
    {
      "from": "boundaries_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "boundaries_runner",
      "to": "validate_entry"
    },
    {
      "from": "boundaries_runner",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "boundaries_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "boundaries_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "boundaries_runner",
      "to": "auth:none"
    },
    {
      "from": "boundaries_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "boundaries_runner",
      "to": "network:none"
    },
    {
      "from": "boundaries_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "boundaries_runner",
      "to": "storage:read"
    },
    {
      "from": "boundaries_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "boundaries_runner",
      "to": "user_data:none"
    },
    {
      "from": "capabilities_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "capabilities_runner",
      "to": "REQUIRED_FIELDS"
    },
    {
      "from": "capabilities_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "capabilities_runner",
      "to": "run"
    },
    {
      "from": "capabilities_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "capabilities_runner",
      "to": "summary"
    },
    {
      "from": "capabilities_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "capabilities_runner",
      "to": "validate_entry"
    },
    {
      "from": "capabilities_runner",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "capabilities_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "capabilities_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "capabilities_runner",
      "to": "auth:none"
    },
    {
      "from": "capabilities_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "capabilities_runner",
      "to": "network:none"
    },
    {
      "from": "capabilities_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "capabilities_runner",
      "to": "storage:read"
    },
    {
      "from": "capabilities_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "capabilities_runner",
      "to": "user_data:none"
    },
    {
      "from": "carrier_adjacency",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_adjacency",
      "to": "find_L_L_violations"
    },
    {
      "from": "carrier_adjacency",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_adjacency",
      "to": "find_N_N_violations"
    },
    {
      "from": "carrier_adjacency",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_adjacency",
      "to": "hard_invariant_holds"
    },
    {
      "from": "carrier_adjacency",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_adjacency",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_adjacency",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_adjacency",
      "to": "auth:none"
    },
    {
      "from": "carrier_adjacency",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_adjacency",
      "to": "network:none"
    },
    {
      "from": "carrier_adjacency",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_adjacency",
      "to": "storage:none"
    },
    {
      "from": "carrier_adjacency",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_adjacency",
      "to": "user_data:none"
    },
    {
      "from": "carrier_bones",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_bones",
      "to": "face_crossing"
    },
    {
      "from": "carrier_bones",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_bones",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_bones",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_bones",
      "to": "auth:none"
    },
    {
      "from": "carrier_bones",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_bones",
      "to": "network:none"
    },
    {
      "from": "carrier_bones",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_bones",
      "to": "storage:none"
    },
    {
      "from": "carrier_bones",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_bones",
      "to": "user_data:none"
    },
    {
      "from": "carrier_classes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_classes",
      "to": "AGGREGATE_SLOTS"
    },
    {
      "from": "carrier_classes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_classes",
      "to": "ClassTag"
    },
    {
      "from": "carrier_classes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_classes",
      "to": "FACE_MINUS_CLASSES"
    },
    {
      "from": "carrier_classes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_classes",
      "to": "FACE_PLUS_CLASSES"
    },
    {
      "from": "carrier_classes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_classes",
      "to": "LITERAL_TYPES"
    },
    {
      "from": "carrier_classes",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_classes",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_classes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_classes",
      "to": "auth:none"
    },
    {
      "from": "carrier_classes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_classes",
      "to": "network:none"
    },
    {
      "from": "carrier_classes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_classes",
      "to": "storage:none"
    },
    {
      "from": "carrier_classes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_classes",
      "to": "user_data:none"
    },
    {
      "from": "carrier_disk_protocol",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_disk_protocol",
      "to": "CarrierDisk"
    },
    {
      "from": "carrier_disk_protocol",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_disk_protocol",
      "to": "CarrierDiskUnavailable"
    },
    {
      "from": "carrier_disk_protocol",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_disk_protocol",
      "to": "DiskSignature"
    },
    {
      "from": "carrier_disk_protocol",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_disk_protocol",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_disk_protocol",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_disk_protocol",
      "to": "auth:none"
    },
    {
      "from": "carrier_disk_protocol",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_disk_protocol",
      "to": "network:none"
    },
    {
      "from": "carrier_disk_protocol",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_disk_protocol",
      "to": "storage:none"
    },
    {
      "from": "carrier_disk_protocol",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_disk_protocol",
      "to": "user_data:none"
    },
    {
      "from": "carrier_faces",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "ARITY"
    },
    {
      "from": "carrier_faces",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "LOWER_ARC_RANGE"
    },
    {
      "from": "carrier_faces",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "ORIGIN"
    },
    {
      "from": "carrier_faces",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "UPPER_ARC_RANGE"
    },
    {
      "from": "carrier_faces",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "chirality"
    },
    {
      "from": "carrier_faces",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "face"
    },
    {
      "from": "carrier_faces",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "n_minus"
    },
    {
      "from": "carrier_faces",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "n_plus"
    },
    {
      "from": "carrier_faces",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_faces",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "auth:none"
    },
    {
      "from": "carrier_faces",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "network:none"
    },
    {
      "from": "carrier_faces",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "storage:none"
    },
    {
      "from": "carrier_faces",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_faces",
      "to": "user_data:none"
    },
    {
      "from": "carrier_gonal",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_gonal",
      "to": "EXAMPLE_157"
    },
    {
      "from": "carrier_gonal",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_gonal",
      "to": "GonalSpec"
    },
    {
      "from": "carrier_gonal",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_gonal",
      "to": "build_gonal"
    },
    {
      "from": "carrier_gonal",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_gonal",
      "to": "print_gonal"
    },
    {
      "from": "carrier_gonal",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_gonal",
      "to": "validate_gonal"
    },
    {
      "from": "carrier_gonal",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_gonal",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_gonal",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_gonal",
      "to": "auth:none"
    },
    {
      "from": "carrier_gonal",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_gonal",
      "to": "network:none"
    },
    {
      "from": "carrier_gonal",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_gonal",
      "to": "storage:none"
    },
    {
      "from": "carrier_gonal",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_gonal",
      "to": "user_data:none"
    },
    {
      "from": "carrier_mirror",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_mirror",
      "to": "mirror_of"
    },
    {
      "from": "carrier_mirror",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_mirror",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_mirror",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_mirror",
      "to": "auth:none"
    },
    {
      "from": "carrier_mirror",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_mirror",
      "to": "network:none"
    },
    {
      "from": "carrier_mirror",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_mirror",
      "to": "storage:none"
    },
    {
      "from": "carrier_mirror",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_mirror",
      "to": "user_data:none"
    },
    {
      "from": "carrier_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "CarrierDisk"
    },
    {
      "from": "carrier_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "CarrierDiskUnavailable"
    },
    {
      "from": "carrier_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "ClassTag"
    },
    {
      "from": "carrier_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "build_public_fixture_disk"
    },
    {
      "from": "carrier_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "chirality"
    },
    {
      "from": "carrier_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "face"
    },
    {
      "from": "carrier_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "face_crossing"
    },
    {
      "from": "carrier_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "hard_invariant_holds"
    },
    {
      "from": "carrier_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "n_minus"
    },
    {
      "from": "carrier_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "n_plus"
    },
    {
      "from": "carrier_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "auth:none"
    },
    {
      "from": "carrier_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "network:none"
    },
    {
      "from": "carrier_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "storage:none"
    },
    {
      "from": "carrier_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_pkg",
      "to": "user_data:none"
    },
    {
      "from": "carrier_public_fixture",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_public_fixture",
      "to": "PublicFixtureDisk"
    },
    {
      "from": "carrier_public_fixture",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_public_fixture",
      "to": "build_public_fixture_disk"
    },
    {
      "from": "carrier_public_fixture",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_public_fixture",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_public_fixture",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_public_fixture",
      "to": "auth:none"
    },
    {
      "from": "carrier_public_fixture",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_public_fixture",
      "to": "network:none"
    },
    {
      "from": "carrier_public_fixture",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_public_fixture",
      "to": "storage:none"
    },
    {
      "from": "carrier_public_fixture",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_public_fixture",
      "to": "user_data:none"
    },
    {
      "from": "carrier_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_registry",
      "to": "GonalName"
    },
    {
      "from": "carrier_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_registry",
      "to": "get_default"
    },
    {
      "from": "carrier_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_registry",
      "to": "get_gonal"
    },
    {
      "from": "carrier_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_registry",
      "to": "get_mirror"
    },
    {
      "from": "carrier_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_registry",
      "to": "get_private"
    },
    {
      "from": "carrier_registry",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_registry",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_registry",
      "to": "auth:none"
    },
    {
      "from": "carrier_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_registry",
      "to": "network:none"
    },
    {
      "from": "carrier_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_registry",
      "to": "storage:read"
    },
    {
      "from": "carrier_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "carrier_registry",
      "to": "user_data:read"
    },
    {
      "from": "fe_app",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_app",
      "to": "App"
    },
    {
      "from": "fe_app",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_app",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_app",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_app",
      "to": "auth:bearer"
    },
    {
      "from": "fe_app",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_app",
      "to": "network:none"
    },
    {
      "from": "fe_app",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_app",
      "to": "storage:none"
    },
    {
      "from": "fe_app",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_app",
      "to": "user_data:read"
    },
    {
      "from": "fe_component_audit_tape",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_audit_tape",
      "to": "AuditTape"
    },
    {
      "from": "fe_component_audit_tape",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_audit_tape",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_audit_tape",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_audit_tape",
      "to": "auth:bearer"
    },
    {
      "from": "fe_component_audit_tape",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_audit_tape",
      "to": "network:external"
    },
    {
      "from": "fe_component_audit_tape",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_audit_tape",
      "to": "storage:none"
    },
    {
      "from": "fe_component_audit_tape",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_audit_tape",
      "to": "user_data:read"
    },
    {
      "from": "fe_component_character_sheet_form",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_character_sheet_form",
      "to": "CharacterSheetForm"
    },
    {
      "from": "fe_component_character_sheet_form",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_character_sheet_form",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_character_sheet_form",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_character_sheet_form",
      "to": "auth:none"
    },
    {
      "from": "fe_component_character_sheet_form",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_character_sheet_form",
      "to": "network:external"
    },
    {
      "from": "fe_component_character_sheet_form",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_character_sheet_form",
      "to": "storage:none"
    },
    {
      "from": "fe_component_character_sheet_form",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_character_sheet_form",
      "to": "user_data:write"
    },
    {
      "from": "fe_component_markdown_view",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_markdown_view",
      "to": "MarkdownView"
    },
    {
      "from": "fe_component_markdown_view",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_markdown_view",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_markdown_view",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_markdown_view",
      "to": "auth:none"
    },
    {
      "from": "fe_component_markdown_view",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_markdown_view",
      "to": "network:none"
    },
    {
      "from": "fe_component_markdown_view",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_markdown_view",
      "to": "storage:none"
    },
    {
      "from": "fe_component_markdown_view",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_markdown_view",
      "to": "user_data:read"
    },
    {
      "from": "fe_component_override_modal",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_override_modal",
      "to": "OverrideModal"
    },
    {
      "from": "fe_component_override_modal",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_override_modal",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_override_modal",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_override_modal",
      "to": "auth:none"
    },
    {
      "from": "fe_component_override_modal",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_override_modal",
      "to": "network:external"
    },
    {
      "from": "fe_component_override_modal",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_override_modal",
      "to": "storage:none"
    },
    {
      "from": "fe_component_override_modal",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_override_modal",
      "to": "user_data:write"
    },
    {
      "from": "fe_component_panel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_panel",
      "to": "AsciiLoader"
    },
    {
      "from": "fe_component_panel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_panel",
      "to": "Panel"
    },
    {
      "from": "fe_component_panel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_panel",
      "to": "Pill"
    },
    {
      "from": "fe_component_panel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_panel",
      "to": "Stat"
    },
    {
      "from": "fe_component_panel",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_panel",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_panel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_panel",
      "to": "auth:none"
    },
    {
      "from": "fe_component_panel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_panel",
      "to": "network:none"
    },
    {
      "from": "fe_component_panel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_panel",
      "to": "storage:none"
    },
    {
      "from": "fe_component_panel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_panel",
      "to": "user_data:read"
    },
    {
      "from": "fe_component_sentinel_ribbon",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_sentinel_ribbon",
      "to": "SentinelVerdictRibbon"
    },
    {
      "from": "fe_component_sentinel_ribbon",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_sentinel_ribbon",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_sentinel_ribbon",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_sentinel_ribbon",
      "to": "auth:none"
    },
    {
      "from": "fe_component_sentinel_ribbon",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_sentinel_ribbon",
      "to": "network:none"
    },
    {
      "from": "fe_component_sentinel_ribbon",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_sentinel_ribbon",
      "to": "storage:none"
    },
    {
      "from": "fe_component_sentinel_ribbon",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_sentinel_ribbon",
      "to": "user_data:read"
    },
    {
      "from": "fe_component_shell",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_shell",
      "to": "Shell"
    },
    {
      "from": "fe_component_shell",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_shell",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_shell",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_shell",
      "to": "auth:none"
    },
    {
      "from": "fe_component_shell",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_shell",
      "to": "network:none"
    },
    {
      "from": "fe_component_shell",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_shell",
      "to": "storage:none"
    },
    {
      "from": "fe_component_shell",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_component_shell",
      "to": "user_data:read"
    },
    {
      "from": "fe_lib_api",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api",
      "to": "api"
    },
    {
      "from": "fe_lib_api",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_api",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api",
      "to": "auth:none"
    },
    {
      "from": "fe_lib_api",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api",
      "to": "network:external"
    },
    {
      "from": "fe_lib_api",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api",
      "to": "storage:none"
    },
    {
      "from": "fe_lib_api",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api",
      "to": "user_data:write"
    },
    {
      "from": "fe_lib_api_tools",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api_tools",
      "to": "mcpClientApi"
    },
    {
      "from": "fe_lib_api_tools",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api_tools",
      "to": "mcpPublishApi"
    },
    {
      "from": "fe_lib_api_tools",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api_tools",
      "to": "skillsApi"
    },
    {
      "from": "fe_lib_api_tools",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api_tools",
      "to": "toolsApi"
    },
    {
      "from": "fe_lib_api_tools",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api_tools",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_api_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api_tools",
      "to": "auth:bearer"
    },
    {
      "from": "fe_lib_api_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api_tools",
      "to": "network:external"
    },
    {
      "from": "fe_lib_api_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api_tools",
      "to": "storage:none"
    },
    {
      "from": "fe_lib_api_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_api_tools",
      "to": "user_data:write"
    },
    {
      "from": "fe_lib_auth",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_auth",
      "to": "AuthProvider"
    },
    {
      "from": "fe_lib_auth",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_auth",
      "to": "ProtectedRoute"
    },
    {
      "from": "fe_lib_auth",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_auth",
      "to": "formatApiErrorDetail"
    },
    {
      "from": "fe_lib_auth",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_auth",
      "to": "useAuth"
    },
    {
      "from": "fe_lib_auth",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_auth",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_auth",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_auth",
      "to": "auth:bearer"
    },
    {
      "from": "fe_lib_auth",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_auth",
      "to": "network:external"
    },
    {
      "from": "fe_lib_auth",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_auth",
      "to": "storage:none"
    },
    {
      "from": "fe_lib_auth",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_auth",
      "to": "user_data:write"
    },
    {
      "from": "fe_lib_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_sentinels",
      "to": "MODE_LABELS"
    },
    {
      "from": "fe_lib_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_sentinels",
      "to": "MODE_OPTIONS"
    },
    {
      "from": "fe_lib_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_sentinels",
      "to": "SENTINEL_CANON"
    },
    {
      "from": "fe_lib_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_sentinels",
      "to": "modeBadgeClass"
    },
    {
      "from": "fe_lib_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_sentinels",
      "to": "sentinelClass"
    },
    {
      "from": "fe_lib_sentinels",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_sentinels",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_sentinels",
      "to": "auth:none"
    },
    {
      "from": "fe_lib_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_sentinels",
      "to": "network:none"
    },
    {
      "from": "fe_lib_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_sentinels",
      "to": "storage:none"
    },
    {
      "from": "fe_lib_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_lib_sentinels",
      "to": "user_data:read"
    },
    {
      "from": "fe_page_agent_lab",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agent_lab",
      "to": "AgentLabPage"
    },
    {
      "from": "fe_page_agent_lab",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agent_lab",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_agent_lab",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agent_lab",
      "to": "auth:cookie"
    },
    {
      "from": "fe_page_agent_lab",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agent_lab",
      "to": "network:external"
    },
    {
      "from": "fe_page_agent_lab",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agent_lab",
      "to": "storage:none"
    },
    {
      "from": "fe_page_agent_lab",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agent_lab",
      "to": "user_data:read"
    },
    {
      "from": "fe_page_agents",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agents",
      "to": "AgentsPage"
    },
    {
      "from": "fe_page_agents",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agents",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_agents",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agents",
      "to": "auth:none"
    },
    {
      "from": "fe_page_agents",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agents",
      "to": "network:external"
    },
    {
      "from": "fe_page_agents",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agents",
      "to": "storage:none"
    },
    {
      "from": "fe_page_agents",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_agents",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_chat_training",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_chat_training",
      "to": "ChatTrainingPage"
    },
    {
      "from": "fe_page_chat_training",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_chat_training",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_chat_training",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_chat_training",
      "to": "auth:cookie"
    },
    {
      "from": "fe_page_chat_training",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_chat_training",
      "to": "network:external"
    },
    {
      "from": "fe_page_chat_training",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_chat_training",
      "to": "storage:none"
    },
    {
      "from": "fe_page_chat_training",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_chat_training",
      "to": "user_data:read"
    },
    {
      "from": "fe_page_custom_keys",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_custom_keys",
      "to": "CustomKeysPage"
    },
    {
      "from": "fe_page_custom_keys",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_custom_keys",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_custom_keys",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_custom_keys",
      "to": "auth:bearer"
    },
    {
      "from": "fe_page_custom_keys",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_custom_keys",
      "to": "network:external"
    },
    {
      "from": "fe_page_custom_keys",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_custom_keys",
      "to": "storage:write"
    },
    {
      "from": "fe_page_custom_keys",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_custom_keys",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_drafts",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_drafts",
      "to": "DraftsPage"
    },
    {
      "from": "fe_page_drafts",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_drafts",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_drafts",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_drafts",
      "to": "auth:none"
    },
    {
      "from": "fe_page_drafts",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_drafts",
      "to": "network:external"
    },
    {
      "from": "fe_page_drafts",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_drafts",
      "to": "storage:none"
    },
    {
      "from": "fe_page_drafts",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_drafts",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_inspector",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inspector",
      "to": "InspectorPage"
    },
    {
      "from": "fe_page_inspector",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inspector",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_inspector",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inspector",
      "to": "auth:none"
    },
    {
      "from": "fe_page_inspector",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inspector",
      "to": "network:external"
    },
    {
      "from": "fe_page_inspector",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inspector",
      "to": "storage:none"
    },
    {
      "from": "fe_page_inspector",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inspector",
      "to": "user_data:read"
    },
    {
      "from": "fe_page_inventory",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inventory",
      "to": "InventoryPage"
    },
    {
      "from": "fe_page_inventory",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inventory",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_inventory",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inventory",
      "to": "auth:none"
    },
    {
      "from": "fe_page_inventory",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inventory",
      "to": "network:external"
    },
    {
      "from": "fe_page_inventory",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inventory",
      "to": "storage:none"
    },
    {
      "from": "fe_page_inventory",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_inventory",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_keyvault",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_keyvault",
      "to": "KeyVaultPage"
    },
    {
      "from": "fe_page_keyvault",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_keyvault",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_keyvault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_keyvault",
      "to": "auth:none"
    },
    {
      "from": "fe_page_keyvault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_keyvault",
      "to": "network:external"
    },
    {
      "from": "fe_page_keyvault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_keyvault",
      "to": "storage:write"
    },
    {
      "from": "fe_page_keyvault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_keyvault",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_living_spec",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_living_spec",
      "to": "LivingSpecPage"
    },
    {
      "from": "fe_page_living_spec",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_living_spec",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_living_spec",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_living_spec",
      "to": "auth:none"
    },
    {
      "from": "fe_page_living_spec",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_living_spec",
      "to": "network:external"
    },
    {
      "from": "fe_page_living_spec",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_living_spec",
      "to": "storage:none"
    },
    {
      "from": "fe_page_living_spec",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_living_spec",
      "to": "user_data:read"
    },
    {
      "from": "fe_page_login",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_login",
      "to": "LoginPage"
    },
    {
      "from": "fe_page_login",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_login",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_login",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_login",
      "to": "auth:bearer"
    },
    {
      "from": "fe_page_login",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_login",
      "to": "network:external"
    },
    {
      "from": "fe_page_login",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_login",
      "to": "storage:none"
    },
    {
      "from": "fe_page_login",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_login",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_mcp",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_mcp",
      "to": "MCPPage"
    },
    {
      "from": "fe_page_mcp",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_mcp",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_mcp",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_mcp",
      "to": "auth:bearer"
    },
    {
      "from": "fe_page_mcp",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_mcp",
      "to": "network:external"
    },
    {
      "from": "fe_page_mcp",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_mcp",
      "to": "storage:write"
    },
    {
      "from": "fe_page_mcp",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_mcp",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_overrides",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_overrides",
      "to": "OverridesPage"
    },
    {
      "from": "fe_page_overrides",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_overrides",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_overrides",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_overrides",
      "to": "auth:none"
    },
    {
      "from": "fe_page_overrides",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_overrides",
      "to": "network:external"
    },
    {
      "from": "fe_page_overrides",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_overrides",
      "to": "storage:none"
    },
    {
      "from": "fe_page_overrides",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_overrides",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_sentinels",
      "to": "SentinelsPage"
    },
    {
      "from": "fe_page_sentinels",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_sentinels",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_sentinels",
      "to": "auth:none"
    },
    {
      "from": "fe_page_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_sentinels",
      "to": "network:external"
    },
    {
      "from": "fe_page_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_sentinels",
      "to": "storage:none"
    },
    {
      "from": "fe_page_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_sentinels",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_skills",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_skills",
      "to": "SkillsPage"
    },
    {
      "from": "fe_page_skills",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_skills",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_skills",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_skills",
      "to": "auth:bearer"
    },
    {
      "from": "fe_page_skills",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_skills",
      "to": "network:external"
    },
    {
      "from": "fe_page_skills",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_skills",
      "to": "storage:write"
    },
    {
      "from": "fe_page_skills",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_skills",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_splash",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_splash",
      "to": "SplashPage"
    },
    {
      "from": "fe_page_splash",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_splash",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_splash",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_splash",
      "to": "auth:none"
    },
    {
      "from": "fe_page_splash",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_splash",
      "to": "network:external"
    },
    {
      "from": "fe_page_splash",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_splash",
      "to": "storage:none"
    },
    {
      "from": "fe_page_splash",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_splash",
      "to": "user_data:read"
    },
    {
      "from": "fe_page_tools",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_tools",
      "to": "ToolsPage"
    },
    {
      "from": "fe_page_tools",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_tools",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_tools",
      "to": "auth:bearer"
    },
    {
      "from": "fe_page_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_tools",
      "to": "network:external"
    },
    {
      "from": "fe_page_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_tools",
      "to": "storage:write"
    },
    {
      "from": "fe_page_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_tools",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_training_room",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_training_room",
      "to": "TrainingRoom"
    },
    {
      "from": "fe_page_training_room",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_training_room",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_training_room",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_training_room",
      "to": "auth:cookie"
    },
    {
      "from": "fe_page_training_room",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_training_room",
      "to": "network:external"
    },
    {
      "from": "fe_page_training_room",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_training_room",
      "to": "storage:none"
    },
    {
      "from": "fe_page_training_room",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_training_room",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_vault",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_vault",
      "to": "VaultPage"
    },
    {
      "from": "fe_page_vault",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_vault",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_vault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_vault",
      "to": "auth:none"
    },
    {
      "from": "fe_page_vault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_vault",
      "to": "network:external"
    },
    {
      "from": "fe_page_vault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_vault",
      "to": "storage:write"
    },
    {
      "from": "fe_page_vault",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_vault",
      "to": "user_data:write"
    },
    {
      "from": "fe_page_workspace",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_workspace",
      "to": "WorkspacePage"
    },
    {
      "from": "fe_page_workspace",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_workspace",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_workspace",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_workspace",
      "to": "auth:none"
    },
    {
      "from": "fe_page_workspace",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_workspace",
      "to": "network:external"
    },
    {
      "from": "fe_page_workspace",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_workspace",
      "to": "storage:write"
    },
    {
      "from": "fe_page_workspace",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fe_page_workspace",
      "to": "user_data:write"
    },
    {
      "from": "fiq_audit_log",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_audit_log",
      "to": "AuditLog"
    },
    {
      "from": "fiq_audit_log",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_audit_log",
      "to": "append"
    },
    {
      "from": "fiq_audit_log",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_audit_log",
      "to": "iter_today"
    },
    {
      "from": "fiq_audit_log",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_audit_log",
      "to": "last_hash"
    },
    {
      "from": "fiq_audit_log",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_audit_log",
      "to": "verify"
    },
    {
      "from": "fiq_audit_log",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_audit_log",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_audit_log",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_audit_log",
      "to": "auth:admin"
    },
    {
      "from": "fiq_audit_log",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_audit_log",
      "to": "network:internal"
    },
    {
      "from": "fiq_audit_log",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_audit_log",
      "to": "storage:write"
    },
    {
      "from": "fiq_audit_log",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_audit_log",
      "to": "user_data:write"
    },
    {
      "from": "fiq_events",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_events",
      "to": "AuditEvent"
    },
    {
      "from": "fiq_events",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_events",
      "to": "FIQ_BLOCKED"
    },
    {
      "from": "fiq_events",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_events",
      "to": "FIQ_BUFFERED"
    },
    {
      "from": "fiq_events",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_events",
      "to": "FIQ_TRANSFER"
    },
    {
      "from": "fiq_events",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_events",
      "to": "chain_hash"
    },
    {
      "from": "fiq_events",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_events",
      "to": "verify_chain"
    },
    {
      "from": "fiq_events",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_events",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_events",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_events",
      "to": "auth:none"
    },
    {
      "from": "fiq_events",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_events",
      "to": "network:none"
    },
    {
      "from": "fiq_events",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_events",
      "to": "storage:none"
    },
    {
      "from": "fiq_events",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_events",
      "to": "user_data:read"
    },
    {
      "from": "fiq_ficks_gradient",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_ficks_gradient",
      "to": "ficks"
    },
    {
      "from": "fiq_ficks_gradient",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_ficks_gradient",
      "to": "gradient_potential"
    },
    {
      "from": "fiq_ficks_gradient",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_ficks_gradient",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_ficks_gradient",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_ficks_gradient",
      "to": "auth:none"
    },
    {
      "from": "fiq_ficks_gradient",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_ficks_gradient",
      "to": "network:none"
    },
    {
      "from": "fiq_ficks_gradient",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_ficks_gradient",
      "to": "storage:none"
    },
    {
      "from": "fiq_ficks_gradient",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_ficks_gradient",
      "to": "user_data:none"
    },
    {
      "from": "fiq_gate",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_gate",
      "to": "FiqGate"
    },
    {
      "from": "fiq_gate",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_gate",
      "to": "GateMode"
    },
    {
      "from": "fiq_gate",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_gate",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_gate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_gate",
      "to": "auth:none"
    },
    {
      "from": "fiq_gate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_gate",
      "to": "network:none"
    },
    {
      "from": "fiq_gate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_gate",
      "to": "storage:none"
    },
    {
      "from": "fiq_gate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_gate",
      "to": "user_data:none"
    },
    {
      "from": "fiq_motion",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "chi_attention"
    },
    {
      "from": "fiq_motion",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "chi_audit"
    },
    {
      "from": "fiq_motion",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "chi_route"
    },
    {
      "from": "fiq_motion",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "chi_support"
    },
    {
      "from": "fiq_motion",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "flux"
    },
    {
      "from": "fiq_motion",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "permeability"
    },
    {
      "from": "fiq_motion",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "potential"
    },
    {
      "from": "fiq_motion",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_motion",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "auth:none"
    },
    {
      "from": "fiq_motion",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "network:none"
    },
    {
      "from": "fiq_motion",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "storage:none"
    },
    {
      "from": "fiq_motion",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_motion",
      "to": "user_data:none"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "AuditLog"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "FIQ_BLOCKED"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "FIQ_BUFFERED"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "FIQ_TRANSFER"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "FiqGate"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "OMEGA_MS"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "PHI_MS"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "PSI_MS"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "TICK_SCHEDULE"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "attention_fires"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "chi_attention"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "chi_audit"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "chi_route"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "chi_support"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "ficks"
    },
    {
      "from": "fiq_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "flux"
    },
    {
      "from": "fiq_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "auth:none"
    },
    {
      "from": "fiq_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "network:none"
    },
    {
      "from": "fiq_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "storage:read"
    },
    {
      "from": "fiq_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_pkg",
      "to": "user_data:none"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "FIQUES_TIME"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "R0_ROOT"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "REGISTRY"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "S1_AUDIT"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "S2_PARSER"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "S3_CONSTRAINT"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "S4_SAFETY"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "S5_DRIFT"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "S6_COHERENCE"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "S7_RECALL"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "S8_BUDGET"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "S9_OUTPUT"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "Sentinel"
    },
    {
      "from": "fiq_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "SentinelRegistry"
    },
    {
      "from": "fiq_sentinels",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "auth:admin"
    },
    {
      "from": "fiq_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "network:none"
    },
    {
      "from": "fiq_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "storage:read"
    },
    {
      "from": "fiq_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_sentinels",
      "to": "user_data:read"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "LCM_TABLE"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "OMEGA_MS"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "PHI_MS"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "PSI_MS"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "RealtimeToggle"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "TICK_SCHEDULE"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "attention_fires"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "fully_aligned"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "auth:none"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "network:none"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "storage:none"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "fiq_tick_schedule",
      "to": "user_data:none"
    },
    {
      "from": "gonal_lifted_path",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "gonal_lifted_path",
      "to": "char_of_vertex"
    },
    {
      "from": "gonal_lifted_path",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "gonal_lifted_path",
      "to": "decode_text_path"
    },
    {
      "from": "gonal_lifted_path",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "gonal_lifted_path",
      "to": "encode_text_path"
    },
    {
      "from": "gonal_lifted_path",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "gonal_lifted_path",
      "to": "is_seam_event"
    },
    {
      "from": "gonal_lifted_path",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "gonal_lifted_path",
      "to": "vertex_of_char"
    },
    {
      "from": "gonal_lifted_path",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "gonal_lifted_path",
      "to": "Erin Spencer"
    },
    {
      "from": "gonal_lifted_path",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "gonal_lifted_path",
      "to": "auth:none"
    },
    {
      "from": "gonal_lifted_path",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "gonal_lifted_path",
      "to": "network:none"
    },
    {
      "from": "gonal_lifted_path",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "gonal_lifted_path",
      "to": "storage:none"
    },
    {
      "from": "gonal_lifted_path",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "gonal_lifted_path",
      "to": "user_data:read"
    },
    {
      "from": "il_edcm_readout",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_edcm_readout",
      "to": "ALERT_HIGH"
    },
    {
      "from": "il_edcm_readout",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_edcm_readout",
      "to": "ALERT_LOW"
    },
    {
      "from": "il_edcm_readout",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_edcm_readout",
      "to": "EDCMReadout"
    },
    {
      "from": "il_edcm_readout",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_edcm_readout",
      "to": "EDCM_METRICS"
    },
    {
      "from": "il_edcm_readout",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_edcm_readout",
      "to": "readout"
    },
    {
      "from": "il_edcm_readout",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "il_edcm_readout",
      "to": "Erin Spencer"
    },
    {
      "from": "il_edcm_readout",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_edcm_readout",
      "to": "auth:none"
    },
    {
      "from": "il_edcm_readout",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_edcm_readout",
      "to": "network:none"
    },
    {
      "from": "il_edcm_readout",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_edcm_readout",
      "to": "storage:none"
    },
    {
      "from": "il_edcm_readout",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_edcm_readout",
      "to": "user_data:read"
    },
    {
      "from": "il_gonal_stack",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_gonal_stack",
      "to": "CylindricalDiskStack"
    },
    {
      "from": "il_gonal_stack",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_gonal_stack",
      "to": "DiskState"
    },
    {
      "from": "il_gonal_stack",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_gonal_stack",
      "to": "GEOMETRY_STATUS"
    },
    {
      "from": "il_gonal_stack",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_gonal_stack",
      "to": "GRAIN_LADDER"
    },
    {
      "from": "il_gonal_stack",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_gonal_stack",
      "to": "build_disk_stack"
    },
    {
      "from": "il_gonal_stack",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_gonal_stack",
      "to": "single_disk"
    },
    {
      "from": "il_gonal_stack",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "il_gonal_stack",
      "to": "Erin Spencer"
    },
    {
      "from": "il_gonal_stack",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_gonal_stack",
      "to": "auth:none"
    },
    {
      "from": "il_gonal_stack",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_gonal_stack",
      "to": "network:none"
    },
    {
      "from": "il_gonal_stack",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_gonal_stack",
      "to": "storage:none"
    },
    {
      "from": "il_gonal_stack",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_gonal_stack",
      "to": "user_data:read"
    },
    {
      "from": "il_ucns_embed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_ucns_embed",
      "to": "EMBED_LANES"
    },
    {
      "from": "il_ucns_embed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_ucns_embed",
      "to": "UCNSNativeEmbedding"
    },
    {
      "from": "il_ucns_embed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_ucns_embed",
      "to": "UCNS_CARRIER_ARITY"
    },
    {
      "from": "il_ucns_embed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_ucns_embed",
      "to": "embed_text"
    },
    {
      "from": "il_ucns_embed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "il_ucns_embed",
      "to": "phase_compose"
    },
    {
      "from": "il_ucns_embed",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "il_ucns_embed",
      "to": "a0p maintainer"
    },
    {
      "from": "il_ucns_embed",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_ucns_embed",
      "to": "auth:none"
    },
    {
      "from": "il_ucns_embed",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_ucns_embed",
      "to": "network:none"
    },
    {
      "from": "il_ucns_embed",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_ucns_embed",
      "to": "storage:none"
    },
    {
      "from": "il_ucns_embed",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "il_ucns_embed",
      "to": "user_data:read"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "__version__"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "aimmh"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "available"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "pcea"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "pcna"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "ptca"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "zfae"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "auth:none"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "network:none"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "storage:none"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "interdependent_lib_pkg",
      "to": "user_data:none"
    },
    {
      "from": "living_spec_scanner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "living_spec_scanner",
      "to": "REPO_ROOTS"
    },
    {
      "from": "living_spec_scanner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "living_spec_scanner",
      "to": "scan_repo_blocks"
    },
    {
      "from": "living_spec_scanner",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "living_spec_scanner",
      "to": "Erin Spencer"
    },
    {
      "from": "living_spec_scanner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "living_spec_scanner",
      "to": "auth:none"
    },
    {
      "from": "living_spec_scanner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "living_spec_scanner",
      "to": "network:none"
    },
    {
      "from": "living_spec_scanner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "living_spec_scanner",
      "to": "storage:none"
    },
    {
      "from": "living_spec_scanner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "living_spec_scanner",
      "to": "user_data:read"
    },
    {
      "from": "module_build_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "module_build_runner",
      "to": "BOUNDARY_FIELDS"
    },
    {
      "from": "module_build_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "module_build_runner",
      "to": "REQUIRED_FIELDS"
    },
    {
      "from": "module_build_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "module_build_runner",
      "to": "run"
    },
    {
      "from": "module_build_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "module_build_runner",
      "to": "summary"
    },
    {
      "from": "module_build_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "module_build_runner",
      "to": "validate_entry"
    },
    {
      "from": "module_build_runner",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "module_build_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "module_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "module_build_runner",
      "to": "auth:none"
    },
    {
      "from": "module_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "module_build_runner",
      "to": "network:none"
    },
    {
      "from": "module_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "module_build_runner",
      "to": "storage:read"
    },
    {
      "from": "module_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "module_build_runner",
      "to": "user_data:none"
    },
    {
      "from": "msdmd_parser",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "marker_for"
    },
    {
      "from": "msdmd_parser",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "parse_file"
    },
    {
      "from": "msdmd_parser",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "parse_ratios"
    },
    {
      "from": "msdmd_parser",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "parse_ratios_file"
    },
    {
      "from": "msdmd_parser",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "parse_text"
    },
    {
      "from": "msdmd_parser",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "ratios_placement"
    },
    {
      "from": "msdmd_parser",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "walk_tree"
    },
    {
      "from": "msdmd_parser",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "a0p maintainer"
    },
    {
      "from": "msdmd_parser",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "auth:none"
    },
    {
      "from": "msdmd_parser",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "network:none"
    },
    {
      "from": "msdmd_parser",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "storage:read"
    },
    {
      "from": "msdmd_parser",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_parser",
      "to": "user_data:none"
    },
    {
      "from": "msdmd_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_pkg",
      "to": "parse"
    },
    {
      "from": "msdmd_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_pkg",
      "to": "report"
    },
    {
      "from": "msdmd_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_pkg",
      "to": "walk"
    },
    {
      "from": "msdmd_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_runner",
      "to": "main"
    },
    {
      "from": "msdmd_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_runner",
      "to": "report"
    },
    {
      "from": "msdmd_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_runner",
      "to": "walk"
    },
    {
      "from": "msdmd_runner",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "msdmd_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_runner",
      "to": "auth:none"
    },
    {
      "from": "msdmd_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_runner",
      "to": "network:none"
    },
    {
      "from": "msdmd_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_runner",
      "to": "storage:read"
    },
    {
      "from": "msdmd_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "msdmd_runner",
      "to": "user_data:none"
    },
    {
      "from": "network_coherence",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_coherence",
      "to": "CoherenceScore"
    },
    {
      "from": "network_coherence",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_coherence",
      "to": "TamperReport"
    },
    {
      "from": "network_coherence",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_coherence",
      "to": "evaluate_tamper"
    },
    {
      "from": "network_coherence",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_coherence",
      "to": "ring_energy"
    },
    {
      "from": "network_coherence",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_coherence",
      "to": "score_tick"
    },
    {
      "from": "network_coherence",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "network_coherence",
      "to": "a0p maintainer"
    },
    {
      "from": "network_coherence",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_coherence",
      "to": "auth:none"
    },
    {
      "from": "network_coherence",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_coherence",
      "to": "network:none"
    },
    {
      "from": "network_coherence",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_coherence",
      "to": "storage:none"
    },
    {
      "from": "network_coherence",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_coherence",
      "to": "user_data:read"
    },
    {
      "from": "network_engine",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_engine",
      "to": "EngineState"
    },
    {
      "from": "network_engine",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_engine",
      "to": "NetworkEngine"
    },
    {
      "from": "network_engine",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "network_engine",
      "to": "a0p maintainer"
    },
    {
      "from": "network_engine",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_engine",
      "to": "auth:none"
    },
    {
      "from": "network_engine",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_engine",
      "to": "network:none"
    },
    {
      "from": "network_engine",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_engine",
      "to": "storage:none"
    },
    {
      "from": "network_engine",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_engine",
      "to": "user_data:read"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "CoherenceScore"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "EngineState"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "NetworkEngine"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "RING_ORDER"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "RING_TOPOLOGY"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "RING_WEIGHTS"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "Ring"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "RingTickResult"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "TamperReport"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "TamperWatcher"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "Tick"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "TickResult"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "build_all_rings"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "build_ring"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "gather_host_digest"
    },
    {
      "from": "network_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "sigma_tensors"
    },
    {
      "from": "network_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "network_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "auth:none"
    },
    {
      "from": "network_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "network:none"
    },
    {
      "from": "network_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "storage:read"
    },
    {
      "from": "network_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_pkg",
      "to": "user_data:read"
    },
    {
      "from": "network_propagate",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_propagate",
      "to": "RingTickResult"
    },
    {
      "from": "network_propagate",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_propagate",
      "to": "Tick"
    },
    {
      "from": "network_propagate",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_propagate",
      "to": "TickResult"
    },
    {
      "from": "network_propagate",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "network_propagate",
      "to": "a0p maintainer"
    },
    {
      "from": "network_propagate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_propagate",
      "to": "auth:none"
    },
    {
      "from": "network_propagate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_propagate",
      "to": "network:none"
    },
    {
      "from": "network_propagate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_propagate",
      "to": "storage:none"
    },
    {
      "from": "network_propagate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_propagate",
      "to": "user_data:read"
    },
    {
      "from": "network_rings",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_rings",
      "to": "Ring"
    },
    {
      "from": "network_rings",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_rings",
      "to": "build_all_rings"
    },
    {
      "from": "network_rings",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_rings",
      "to": "build_ring"
    },
    {
      "from": "network_rings",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_rings",
      "to": "heptagram_order"
    },
    {
      "from": "network_rings",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "network_rings",
      "to": "a0p maintainer"
    },
    {
      "from": "network_rings",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_rings",
      "to": "auth:none"
    },
    {
      "from": "network_rings",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_rings",
      "to": "network:none"
    },
    {
      "from": "network_rings",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_rings",
      "to": "storage:none"
    },
    {
      "from": "network_rings",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_rings",
      "to": "user_data:none"
    },
    {
      "from": "network_sigma_source",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_sigma_source",
      "to": "HostDigest"
    },
    {
      "from": "network_sigma_source",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_sigma_source",
      "to": "SIGMA_PKG_COMMANDS"
    },
    {
      "from": "network_sigma_source",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_sigma_source",
      "to": "SIGMA_WATCHED_PATHS"
    },
    {
      "from": "network_sigma_source",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_sigma_source",
      "to": "gather_host_digest"
    },
    {
      "from": "network_sigma_source",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_sigma_source",
      "to": "sigma_tensors"
    },
    {
      "from": "network_sigma_source",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "network_sigma_source",
      "to": "a0p maintainer"
    },
    {
      "from": "network_sigma_source",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_sigma_source",
      "to": "auth:none"
    },
    {
      "from": "network_sigma_source",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_sigma_source",
      "to": "network:none"
    },
    {
      "from": "network_sigma_source",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_sigma_source",
      "to": "storage:read"
    },
    {
      "from": "network_sigma_source",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_sigma_source",
      "to": "user_data:none"
    },
    {
      "from": "network_topology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "MEMORY_RING_NAMES"
    },
    {
      "from": "network_topology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "OBSERVER_RING_NAMES"
    },
    {
      "from": "network_topology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "RING_ORDER"
    },
    {
      "from": "network_topology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "RING_TOPOLOGY"
    },
    {
      "from": "network_topology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "RING_WEIGHTS"
    },
    {
      "from": "network_topology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "RingSpec"
    },
    {
      "from": "network_topology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "SCORED_RING_NAMES"
    },
    {
      "from": "network_topology",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "a0p maintainer"
    },
    {
      "from": "network_topology",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "auth:none"
    },
    {
      "from": "network_topology",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "network:none"
    },
    {
      "from": "network_topology",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "storage:none"
    },
    {
      "from": "network_topology",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "network_topology",
      "to": "user_data:none"
    },
    {
      "from": "pcea_cipher",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_cipher",
      "to": "decrypt_state"
    },
    {
      "from": "pcea_cipher",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_cipher",
      "to": "encrypt_state"
    },
    {
      "from": "pcea_cipher",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_cipher",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_cipher",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_cipher",
      "to": "auth:none"
    },
    {
      "from": "pcea_cipher",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_cipher",
      "to": "network:none"
    },
    {
      "from": "pcea_cipher",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_cipher",
      "to": "storage:none"
    },
    {
      "from": "pcea_cipher",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_cipher",
      "to": "user_data:none"
    },
    {
      "from": "pcea_codec",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_codec",
      "to": "from_bijective"
    },
    {
      "from": "pcea_codec",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_codec",
      "to": "key_digits"
    },
    {
      "from": "pcea_codec",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_codec",
      "to": "to_bijective"
    },
    {
      "from": "pcea_codec",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_codec",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_codec",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_codec",
      "to": "auth:none"
    },
    {
      "from": "pcea_codec",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_codec",
      "to": "network:none"
    },
    {
      "from": "pcea_codec",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_codec",
      "to": "storage:none"
    },
    {
      "from": "pcea_codec",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_codec",
      "to": "user_data:none"
    },
    {
      "from": "pcea_instance",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_instance",
      "to": "PCEAInstance"
    },
    {
      "from": "pcea_instance",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_instance",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_instance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_instance",
      "to": "auth:none"
    },
    {
      "from": "pcea_instance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_instance",
      "to": "network:none"
    },
    {
      "from": "pcea_instance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_instance",
      "to": "storage:none"
    },
    {
      "from": "pcea_instance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_instance",
      "to": "user_data:none"
    },
    {
      "from": "pcea_kernel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_kernel",
      "to": "QUANT_OFFSET"
    },
    {
      "from": "pcea_kernel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_kernel",
      "to": "QUANT_SCALE"
    },
    {
      "from": "pcea_kernel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_kernel",
      "to": "kernel_chain"
    },
    {
      "from": "pcea_kernel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_kernel",
      "to": "kernel_invert"
    },
    {
      "from": "pcea_kernel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_kernel",
      "to": "kernel_step"
    },
    {
      "from": "pcea_kernel",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_kernel",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_kernel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_kernel",
      "to": "auth:none"
    },
    {
      "from": "pcea_kernel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_kernel",
      "to": "network:none"
    },
    {
      "from": "pcea_kernel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_kernel",
      "to": "storage:none"
    },
    {
      "from": "pcea_kernel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_kernel",
      "to": "user_data:none"
    },
    {
      "from": "pcea_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_pkg",
      "to": "PCEAInstance"
    },
    {
      "from": "pcea_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_pkg",
      "to": "PRIME_CIRCLE"
    },
    {
      "from": "pcea_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_pkg",
      "to": "decrypt_state"
    },
    {
      "from": "pcea_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_pkg",
      "to": "encrypt_state"
    },
    {
      "from": "pcea_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_pkg",
      "to": "auth:none"
    },
    {
      "from": "pcea_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_pkg",
      "to": "network:none"
    },
    {
      "from": "pcea_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_pkg",
      "to": "storage:none"
    },
    {
      "from": "pcea_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_pkg",
      "to": "user_data:none"
    },
    {
      "from": "pcea_primes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_primes",
      "to": "PRIME_CIRCLE"
    },
    {
      "from": "pcea_primes",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_primes",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_primes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_primes",
      "to": "auth:none"
    },
    {
      "from": "pcea_primes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_primes",
      "to": "network:none"
    },
    {
      "from": "pcea_primes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_primes",
      "to": "storage:none"
    },
    {
      "from": "pcea_primes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcea_primes",
      "to": "user_data:none"
    },
    {
      "from": "pcna_edcm",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_edcm",
      "to": "EDCM"
    },
    {
      "from": "pcna_edcm",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_edcm",
      "to": "EDCMScores"
    },
    {
      "from": "pcna_edcm",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_edcm",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_edcm",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_edcm",
      "to": "auth:none"
    },
    {
      "from": "pcna_edcm",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_edcm",
      "to": "network:none"
    },
    {
      "from": "pcna_edcm",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_edcm",
      "to": "storage:none"
    },
    {
      "from": "pcna_edcm",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_edcm",
      "to": "user_data:none"
    },
    {
      "from": "pcna_engine_impl",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_engine_impl",
      "to": "PCNAEngine"
    },
    {
      "from": "pcna_engine_impl",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_engine_impl",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_engine_impl",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_engine_impl",
      "to": "auth:none"
    },
    {
      "from": "pcna_engine_impl",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_engine_impl",
      "to": "network:none"
    },
    {
      "from": "pcna_engine_impl",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_engine_impl",
      "to": "storage:none"
    },
    {
      "from": "pcna_engine_impl",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_engine_impl",
      "to": "user_data:none"
    },
    {
      "from": "pcna_group_aggregate",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_group_aggregate",
      "to": "GROUP_SIZE"
    },
    {
      "from": "pcna_group_aggregate",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_group_aggregate",
      "to": "aggregate"
    },
    {
      "from": "pcna_group_aggregate",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_group_aggregate",
      "to": "identity_tensor"
    },
    {
      "from": "pcna_group_aggregate",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_group_aggregate",
      "to": "is_identity"
    },
    {
      "from": "pcna_group_aggregate",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_group_aggregate",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_group_aggregate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_group_aggregate",
      "to": "auth:none"
    },
    {
      "from": "pcna_group_aggregate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_group_aggregate",
      "to": "network:none"
    },
    {
      "from": "pcna_group_aggregate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_group_aggregate",
      "to": "storage:none"
    },
    {
      "from": "pcna_group_aggregate",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_group_aggregate",
      "to": "user_data:none"
    },
    {
      "from": "pcna_memory_core",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_memory_core",
      "to": "MemoryCore"
    },
    {
      "from": "pcna_memory_core",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_memory_core",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_memory_core",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_memory_core",
      "to": "auth:none"
    },
    {
      "from": "pcna_memory_core",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_memory_core",
      "to": "network:none"
    },
    {
      "from": "pcna_memory_core",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_memory_core",
      "to": "storage:none"
    },
    {
      "from": "pcna_memory_core",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_memory_core",
      "to": "user_data:read"
    },
    {
      "from": "pcna_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "EDCM"
    },
    {
      "from": "pcna_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "EDCMScores"
    },
    {
      "from": "pcna_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "MemoryCore"
    },
    {
      "from": "pcna_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "PCNAEngine"
    },
    {
      "from": "pcna_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "sigma_encode"
    },
    {
      "from": "pcna_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "theta_modulate"
    },
    {
      "from": "pcna_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "zeta_inject"
    },
    {
      "from": "pcna_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "auth:none"
    },
    {
      "from": "pcna_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "network:none"
    },
    {
      "from": "pcna_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "storage:none"
    },
    {
      "from": "pcna_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_pkg",
      "to": "user_data:none"
    },
    {
      "from": "pcna_sigma",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_sigma",
      "to": "sigma_band"
    },
    {
      "from": "pcna_sigma",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_sigma",
      "to": "sigma_encode"
    },
    {
      "from": "pcna_sigma",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_sigma",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_sigma",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_sigma",
      "to": "auth:none"
    },
    {
      "from": "pcna_sigma",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_sigma",
      "to": "network:none"
    },
    {
      "from": "pcna_sigma",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_sigma",
      "to": "storage:none"
    },
    {
      "from": "pcna_sigma",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_sigma",
      "to": "user_data:none"
    },
    {
      "from": "pcna_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "TENSOR_DIM"
    },
    {
      "from": "pcna_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "Tensor"
    },
    {
      "from": "pcna_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "from_scalar"
    },
    {
      "from": "pcna_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "from_seed"
    },
    {
      "from": "pcna_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "payload_width"
    },
    {
      "from": "pcna_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "tensor_compose"
    },
    {
      "from": "pcna_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "tensor_identity"
    },
    {
      "from": "pcna_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "tensors_equal"
    },
    {
      "from": "pcna_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "to_scalar"
    },
    {
      "from": "pcna_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "zero"
    },
    {
      "from": "pcna_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "zero_tensor"
    },
    {
      "from": "pcna_tensor",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_tensor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "auth:none"
    },
    {
      "from": "pcna_tensor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "network:none"
    },
    {
      "from": "pcna_tensor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "storage:none"
    },
    {
      "from": "pcna_tensor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_tensor",
      "to": "user_data:none"
    },
    {
      "from": "pcna_theta",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_theta",
      "to": "theta_modulate"
    },
    {
      "from": "pcna_theta",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_theta",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_theta",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_theta",
      "to": "auth:none"
    },
    {
      "from": "pcna_theta",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_theta",
      "to": "network:none"
    },
    {
      "from": "pcna_theta",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_theta",
      "to": "storage:none"
    },
    {
      "from": "pcna_theta",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_theta",
      "to": "user_data:none"
    },
    {
      "from": "pcna_zeta",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_zeta",
      "to": "echo"
    },
    {
      "from": "pcna_zeta",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_zeta",
      "to": "harmonic_resonance"
    },
    {
      "from": "pcna_zeta",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_zeta",
      "to": "zeta_inject"
    },
    {
      "from": "pcna_zeta",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_zeta",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_zeta",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_zeta",
      "to": "auth:none"
    },
    {
      "from": "pcna_zeta",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_zeta",
      "to": "network:none"
    },
    {
      "from": "pcna_zeta",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_zeta",
      "to": "storage:none"
    },
    {
      "from": "pcna_zeta",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcna_zeta",
      "to": "user_data:none"
    },
    {
      "from": "pcta_circle",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "Circle"
    },
    {
      "from": "pcta_circle",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "aggregate"
    },
    {
      "from": "pcta_circle",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "circle_compose"
    },
    {
      "from": "pcta_circle",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "circle_identity"
    },
    {
      "from": "pcta_circle",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "from_seed"
    },
    {
      "from": "pcta_circle",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "from_tensors"
    },
    {
      "from": "pcta_circle",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "heptagram_compose"
    },
    {
      "from": "pcta_circle",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "heptagram_order"
    },
    {
      "from": "pcta_circle",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "tensor_count"
    },
    {
      "from": "pcta_circle",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "ucns_shape"
    },
    {
      "from": "pcta_circle",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "a0p maintainer"
    },
    {
      "from": "pcta_circle",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "auth:none"
    },
    {
      "from": "pcta_circle",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "network:none"
    },
    {
      "from": "pcta_circle",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "storage:none"
    },
    {
      "from": "pcta_circle",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_circle",
      "to": "user_data:none"
    },
    {
      "from": "pcta_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_pkg",
      "to": "CIRCLE_SIZE"
    },
    {
      "from": "pcta_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_pkg",
      "to": "Circle"
    },
    {
      "from": "pcta_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_pkg",
      "to": "HEPTAGRAM_STEP_CIRCLE"
    },
    {
      "from": "pcta_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_pkg",
      "to": "heptagram_walk"
    },
    {
      "from": "pcta_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_pkg",
      "to": "heptagram_walk_7_2"
    },
    {
      "from": "pcta_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_pkg",
      "to": "heptagram_walk_7_3"
    },
    {
      "from": "pcta_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "pcta_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_pkg",
      "to": "auth:none"
    },
    {
      "from": "pcta_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_pkg",
      "to": "network:none"
    },
    {
      "from": "pcta_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_pkg",
      "to": "storage:none"
    },
    {
      "from": "pcta_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "pcta_pkg",
      "to": "user_data:none"
    },
    {
      "from": "provider_anthropic",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "provider_anthropic",
      "to": "AnthropicProvider"
    },
    {
      "from": "provider_anthropic",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "provider_anthropic",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_anthropic",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_anthropic",
      "to": "auth:none"
    },
    {
      "from": "provider_anthropic",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_anthropic",
      "to": "network:external"
    },
    {
      "from": "provider_anthropic",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_anthropic",
      "to": "storage:none"
    },
    {
      "from": "provider_anthropic",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_anthropic",
      "to": "user_data:read"
    },
    {
      "from": "provider_base",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "provider_base",
      "to": "ChatResult"
    },
    {
      "from": "provider_base",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "provider_base",
      "to": "ProviderAdapter"
    },
    {
      "from": "provider_base",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "provider_base",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_base",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_base",
      "to": "auth:none"
    },
    {
      "from": "provider_base",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_base",
      "to": "network:none"
    },
    {
      "from": "provider_base",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_base",
      "to": "storage:none"
    },
    {
      "from": "provider_base",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_base",
      "to": "user_data:none"
    },
    {
      "from": "provider_gemini",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "provider_gemini",
      "to": "GeminiProvider"
    },
    {
      "from": "provider_gemini",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "provider_gemini",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_gemini",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_gemini",
      "to": "auth:none"
    },
    {
      "from": "provider_gemini",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_gemini",
      "to": "network:external"
    },
    {
      "from": "provider_gemini",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_gemini",
      "to": "storage:none"
    },
    {
      "from": "provider_gemini",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_gemini",
      "to": "user_data:read"
    },
    {
      "from": "provider_openai",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "provider_openai",
      "to": "OpenAIProvider"
    },
    {
      "from": "provider_openai",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "provider_openai",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_openai",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_openai",
      "to": "auth:none"
    },
    {
      "from": "provider_openai",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_openai",
      "to": "network:external"
    },
    {
      "from": "provider_openai",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_openai",
      "to": "storage:none"
    },
    {
      "from": "provider_openai",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_openai",
      "to": "user_data:read"
    },
    {
      "from": "provider_xai",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "provider_xai",
      "to": "XAIProvider"
    },
    {
      "from": "provider_xai",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "provider_xai",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_xai",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_xai",
      "to": "auth:none"
    },
    {
      "from": "provider_xai",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_xai",
      "to": "network:external"
    },
    {
      "from": "provider_xai",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_xai",
      "to": "storage:none"
    },
    {
      "from": "provider_xai",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "provider_xai",
      "to": "user_data:read"
    },
    {
      "from": "providers_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "providers_pkg",
      "to": "ChatResult"
    },
    {
      "from": "providers_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "providers_pkg",
      "to": "ProviderAdapter"
    },
    {
      "from": "providers_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "providers_pkg",
      "to": "REGISTRY"
    },
    {
      "from": "providers_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "providers_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "providers_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "providers_pkg",
      "to": "auth:none"
    },
    {
      "from": "providers_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "providers_pkg",
      "to": "network:external"
    },
    {
      "from": "providers_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "providers_pkg",
      "to": "storage:none"
    },
    {
      "from": "providers_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "providers_pkg",
      "to": "user_data:read"
    },
    {
      "from": "ptca_constants",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "CIRCLES_PER_SEED"
    },
    {
      "from": "ptca_constants",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "CIRCLE_ROUTING_STEP"
    },
    {
      "from": "ptca_constants",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "COHERENCE_FACTOR_UNIVERSE"
    },
    {
      "from": "ptca_constants",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "PARAM_COUNT"
    },
    {
      "from": "ptca_constants",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "SEED_COUNT"
    },
    {
      "from": "ptca_constants",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "SEED_ROUTING_STEP"
    },
    {
      "from": "ptca_constants",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "TENSORS_PER_CIRCLE"
    },
    {
      "from": "ptca_constants",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "TENSOR_DIM"
    },
    {
      "from": "ptca_constants",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "TENSOR_LEAVES"
    },
    {
      "from": "ptca_constants",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "is_coherence_prime"
    },
    {
      "from": "ptca_constants",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_constants",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "auth:none"
    },
    {
      "from": "ptca_constants",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "network:none"
    },
    {
      "from": "ptca_constants",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "storage:none"
    },
    {
      "from": "ptca_constants",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_constants",
      "to": "user_data:none"
    },
    {
      "from": "ptca_core",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "Core"
    },
    {
      "from": "ptca_core",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "aggregate"
    },
    {
      "from": "ptca_core",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "from_seeds"
    },
    {
      "from": "ptca_core",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "label"
    },
    {
      "from": "ptca_core",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "n"
    },
    {
      "from": "ptca_core",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "param_count"
    },
    {
      "from": "ptca_core",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "ucns_shape"
    },
    {
      "from": "ptca_core",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "with_n"
    },
    {
      "from": "ptca_core",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_core",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "auth:none"
    },
    {
      "from": "ptca_core",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "network:none"
    },
    {
      "from": "ptca_core",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "storage:none"
    },
    {
      "from": "ptca_core",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_core",
      "to": "user_data:none"
    },
    {
      "from": "ptca_exchange",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_exchange",
      "to": "exchange"
    },
    {
      "from": "ptca_exchange",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_exchange",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_exchange",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_exchange",
      "to": "auth:none"
    },
    {
      "from": "ptca_exchange",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_exchange",
      "to": "network:none"
    },
    {
      "from": "ptca_exchange",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_exchange",
      "to": "storage:none"
    },
    {
      "from": "ptca_exchange",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_exchange",
      "to": "user_data:none"
    },
    {
      "from": "ptca_instance",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_instance",
      "to": "PTCAInstance"
    },
    {
      "from": "ptca_instance",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_instance",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_instance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_instance",
      "to": "auth:none"
    },
    {
      "from": "ptca_instance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_instance",
      "to": "network:none"
    },
    {
      "from": "ptca_instance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_instance",
      "to": "storage:none"
    },
    {
      "from": "ptca_instance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_instance",
      "to": "user_data:none"
    },
    {
      "from": "ptca_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "PRIMES_FIRST_N"
    },
    {
      "from": "ptca_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "PTCAInstance"
    },
    {
      "from": "ptca_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "PrimeTensor"
    },
    {
      "from": "ptca_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "SentinelChannel"
    },
    {
      "from": "ptca_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "exchange"
    },
    {
      "from": "ptca_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "first_n_primes"
    },
    {
      "from": "ptca_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "hash_state"
    },
    {
      "from": "ptca_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "auth:none"
    },
    {
      "from": "ptca_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "network:none"
    },
    {
      "from": "ptca_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "storage:none"
    },
    {
      "from": "ptca_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_pkg",
      "to": "user_data:none"
    },
    {
      "from": "ptca_primes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_primes",
      "to": "PRIMES_FIRST_N"
    },
    {
      "from": "ptca_primes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_primes",
      "to": "first_n_primes"
    },
    {
      "from": "ptca_primes",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_primes",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_primes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_primes",
      "to": "auth:none"
    },
    {
      "from": "ptca_primes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_primes",
      "to": "network:none"
    },
    {
      "from": "ptca_primes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_primes",
      "to": "storage:none"
    },
    {
      "from": "ptca_primes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_primes",
      "to": "user_data:none"
    },
    {
      "from": "ptca_provenance",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_provenance",
      "to": "hash_state"
    },
    {
      "from": "ptca_provenance",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_provenance",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_provenance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_provenance",
      "to": "auth:none"
    },
    {
      "from": "ptca_provenance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_provenance",
      "to": "network:none"
    },
    {
      "from": "ptca_provenance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_provenance",
      "to": "storage:none"
    },
    {
      "from": "ptca_provenance",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_provenance",
      "to": "user_data:none"
    },
    {
      "from": "ptca_seed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "Seed"
    },
    {
      "from": "ptca_seed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "aggregate"
    },
    {
      "from": "ptca_seed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "from_circles"
    },
    {
      "from": "ptca_seed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "from_seed"
    },
    {
      "from": "ptca_seed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "heptagram_order"
    },
    {
      "from": "ptca_seed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "param_count"
    },
    {
      "from": "ptca_seed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "seed_compose"
    },
    {
      "from": "ptca_seed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "seed_identity"
    },
    {
      "from": "ptca_seed",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "ucns_shape"
    },
    {
      "from": "ptca_seed",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_seed",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "auth:none"
    },
    {
      "from": "ptca_seed",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "network:none"
    },
    {
      "from": "ptca_seed",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "storage:none"
    },
    {
      "from": "ptca_seed",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_seed",
      "to": "user_data:none"
    },
    {
      "from": "ptca_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_sentinels",
      "to": "SentinelChannel"
    },
    {
      "from": "ptca_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_sentinels",
      "to": "SentinelMessage"
    },
    {
      "from": "ptca_sentinels",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_sentinels",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_sentinels",
      "to": "auth:none"
    },
    {
      "from": "ptca_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_sentinels",
      "to": "network:none"
    },
    {
      "from": "ptca_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_sentinels",
      "to": "storage:none"
    },
    {
      "from": "ptca_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_sentinels",
      "to": "user_data:none"
    },
    {
      "from": "ptca_tensor",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_tensor",
      "to": "PrimeTensor"
    },
    {
      "from": "ptca_tensor",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_tensor",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_tensor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_tensor",
      "to": "auth:none"
    },
    {
      "from": "ptca_tensor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_tensor",
      "to": "network:none"
    },
    {
      "from": "ptca_tensor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_tensor",
      "to": "storage:none"
    },
    {
      "from": "ptca_tensor",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ptca_tensor",
      "to": "user_data:none"
    },
    {
      "from": "ratios_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ratios_runner",
      "to": "COMPUTERS"
    },
    {
      "from": "ratios_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ratios_runner",
      "to": "compute_calls_definitions"
    },
    {
      "from": "ratios_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ratios_runner",
      "to": "compute_imports_exports"
    },
    {
      "from": "ratios_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ratios_runner",
      "to": "compute_loc_comments"
    },
    {
      "from": "ratios_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ratios_runner",
      "to": "run"
    },
    {
      "from": "ratios_runner",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ratios_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "ratios_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ratios_runner",
      "to": "auth:none"
    },
    {
      "from": "ratios_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ratios_runner",
      "to": "network:none"
    },
    {
      "from": "ratios_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ratios_runner",
      "to": "storage:read"
    },
    {
      "from": "ratios_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ratios_runner",
      "to": "user_data:none"
    },
    {
      "from": "readme_writer",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "readme_writer",
      "to": "write_readme"
    },
    {
      "from": "readme_writer",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "readme_writer",
      "to": "Erin Spencer"
    },
    {
      "from": "readme_writer",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "readme_writer",
      "to": "auth:none"
    },
    {
      "from": "readme_writer",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "readme_writer",
      "to": "network:none"
    },
    {
      "from": "readme_writer",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "readme_writer",
      "to": "storage:write"
    },
    {
      "from": "readme_writer",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "readme_writer",
      "to": "user_data:read"
    },
    {
      "from": "skills_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_pkg",
      "to": "re-exports"
    },
    {
      "from": "skills_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "skills_pkg",
      "to": "Erin Spencer"
    },
    {
      "from": "skills_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_pkg",
      "to": "auth:none"
    },
    {
      "from": "skills_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_pkg",
      "to": "network:none"
    },
    {
      "from": "skills_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_pkg",
      "to": "storage:none"
    },
    {
      "from": "skills_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_pkg",
      "to": "user_data:read"
    },
    {
      "from": "skills_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "Skill"
    },
    {
      "from": "skills_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "SkillExistsWarning"
    },
    {
      "from": "skills_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "check_overlap"
    },
    {
      "from": "skills_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "delete_skill"
    },
    {
      "from": "skills_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "get_skill"
    },
    {
      "from": "skills_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "list_skills"
    },
    {
      "from": "skills_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "register_skill"
    },
    {
      "from": "skills_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "tokenize_logic"
    },
    {
      "from": "skills_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "tokenize_scope"
    },
    {
      "from": "skills_registry",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "Erin Spencer"
    },
    {
      "from": "skills_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "auth:bearer"
    },
    {
      "from": "skills_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "network:none"
    },
    {
      "from": "skills_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "storage:write"
    },
    {
      "from": "skills_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_registry",
      "to": "user_data:write"
    },
    {
      "from": "skills_sync",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_sync",
      "to": "pull_from_skill_lib"
    },
    {
      "from": "skills_sync",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "skills_sync",
      "to": "push_to_skill_lib_stub"
    },
    {
      "from": "skills_sync",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "skills_sync",
      "to": "Erin Spencer"
    },
    {
      "from": "skills_sync",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_sync",
      "to": "auth:none"
    },
    {
      "from": "skills_sync",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_sync",
      "to": "network:external"
    },
    {
      "from": "skills_sync",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_sync",
      "to": "storage:write"
    },
    {
      "from": "skills_sync",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "skills_sync",
      "to": "user_data:read"
    },
    {
      "from": "test_build_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "test_build_runner",
      "to": "run"
    },
    {
      "from": "test_build_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "test_build_runner",
      "to": "run_async"
    },
    {
      "from": "test_build_runner",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "test_build_runner",
      "to": "summary"
    },
    {
      "from": "test_build_runner",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "test_build_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "test_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "test_build_runner",
      "to": "auth:none"
    },
    {
      "from": "test_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "test_build_runner",
      "to": "network:external"
    },
    {
      "from": "test_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "test_build_runner",
      "to": "storage:read"
    },
    {
      "from": "test_build_runner",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "test_build_runner",
      "to": "user_data:read"
    },
    {
      "from": "tests_backend_test",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tests_backend_test",
      "to": "test_*"
    },
    {
      "from": "tests_backend_test",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tests_backend_test",
      "to": "Erin Spencer"
    },
    {
      "from": "tests_backend_test",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_backend_test",
      "to": "auth:none"
    },
    {
      "from": "tests_backend_test",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_backend_test",
      "to": "network:external"
    },
    {
      "from": "tests_backend_test",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_backend_test",
      "to": "storage:none"
    },
    {
      "from": "tests_backend_test",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_backend_test",
      "to": "user_data:read"
    },
    {
      "from": "tests_conftest",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tests_conftest",
      "to": "pytest_plugins"
    },
    {
      "from": "tests_conftest",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tests_conftest",
      "to": "Erin Spencer"
    },
    {
      "from": "tests_conftest",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_conftest",
      "to": "auth:none"
    },
    {
      "from": "tests_conftest",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_conftest",
      "to": "network:none"
    },
    {
      "from": "tests_conftest",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_conftest",
      "to": "storage:none"
    },
    {
      "from": "tests_conftest",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_conftest",
      "to": "user_data:read"
    },
    {
      "from": "tests_zfae_api_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_api_sentinels",
      "to": "test_*"
    },
    {
      "from": "tests_zfae_api_sentinels",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_api_sentinels",
      "to": "Erin Spencer"
    },
    {
      "from": "tests_zfae_api_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_api_sentinels",
      "to": "auth:none"
    },
    {
      "from": "tests_zfae_api_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_api_sentinels",
      "to": "network:external"
    },
    {
      "from": "tests_zfae_api_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_api_sentinels",
      "to": "storage:none"
    },
    {
      "from": "tests_zfae_api_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_api_sentinels",
      "to": "user_data:read"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "test_fiq_emit_chain"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "test_native_refusal_requires_all_seeds_touched"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "test_pending_override_lifecycle"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "test_sentinel_eval_cliff_fires_on_unsafe_marker"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "test_three_core_weight_bank_total_count"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "test_trainer_round_robin_across_cores"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "Erin Spencer"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "auth:none"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "network:none"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "storage:none"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "user_data:read"
    },
    {
      "from": "theta_microkernel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "theta_microkernel",
      "to": "ThetaMicrokernel"
    },
    {
      "from": "theta_microkernel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "theta_microkernel",
      "to": "carrier_disk_signature_only"
    },
    {
      "from": "theta_microkernel",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "theta_microkernel",
      "to": "get_carrier_disk"
    },
    {
      "from": "theta_microkernel",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "theta_microkernel",
      "to": "Erin Spencer"
    },
    {
      "from": "theta_microkernel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "theta_microkernel",
      "to": "auth:none"
    },
    {
      "from": "theta_microkernel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "theta_microkernel",
      "to": "network:none"
    },
    {
      "from": "theta_microkernel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "theta_microkernel",
      "to": "storage:read"
    },
    {
      "from": "theta_microkernel",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "theta_microkernel",
      "to": "user_data:none"
    },
    {
      "from": "theta_private_loader",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "theta_private_loader",
      "to": "CANON_DISK_ENV"
    },
    {
      "from": "theta_private_loader",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "theta_private_loader",
      "to": "load_canon_disk"
    },
    {
      "from": "theta_private_loader",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "theta_private_loader",
      "to": "Erin Spencer"
    },
    {
      "from": "theta_private_loader",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "theta_private_loader",
      "to": "auth:admin"
    },
    {
      "from": "theta_private_loader",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "theta_private_loader",
      "to": "network:none"
    },
    {
      "from": "theta_private_loader",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "theta_private_loader",
      "to": "storage:read"
    },
    {
      "from": "theta_private_loader",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "theta_private_loader",
      "to": "user_data:none"
    },
    {
      "from": "tools_agent_loop",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_agent_loop",
      "to": "ToolLoopHalt"
    },
    {
      "from": "tools_agent_loop",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_agent_loop",
      "to": "run_tool_loop"
    },
    {
      "from": "tools_agent_loop",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_agent_loop",
      "to": "tool_to_schema"
    },
    {
      "from": "tools_agent_loop",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tools_agent_loop",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_agent_loop",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_agent_loop",
      "to": "auth:bearer"
    },
    {
      "from": "tools_agent_loop",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_agent_loop",
      "to": "network:external"
    },
    {
      "from": "tools_agent_loop",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_agent_loop",
      "to": "storage:none"
    },
    {
      "from": "tools_agent_loop",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_agent_loop",
      "to": "user_data:read"
    },
    {
      "from": "tools_builtin",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_builtin",
      "to": "register_builtins"
    },
    {
      "from": "tools_builtin",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tools_builtin",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_builtin",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_builtin",
      "to": "auth:bearer"
    },
    {
      "from": "tools_builtin",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_builtin",
      "to": "network:external"
    },
    {
      "from": "tools_builtin",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_builtin",
      "to": "storage:read"
    },
    {
      "from": "tools_builtin",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_builtin",
      "to": "user_data:read"
    },
    {
      "from": "tools_gated_invoke",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_gated_invoke",
      "to": "gated_invoke"
    },
    {
      "from": "tools_gated_invoke",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tools_gated_invoke",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_gated_invoke",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_gated_invoke",
      "to": "auth:bearer"
    },
    {
      "from": "tools_gated_invoke",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_gated_invoke",
      "to": "network:external"
    },
    {
      "from": "tools_gated_invoke",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_gated_invoke",
      "to": "storage:write"
    },
    {
      "from": "tools_gated_invoke",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_gated_invoke",
      "to": "user_data:write"
    },
    {
      "from": "tools_mcp_relay",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_relay",
      "to": "invoke"
    },
    {
      "from": "tools_mcp_relay",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_relay",
      "to": "list_remote_tools"
    },
    {
      "from": "tools_mcp_relay",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_relay",
      "to": "ping_server"
    },
    {
      "from": "tools_mcp_relay",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_relay",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_mcp_relay",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_relay",
      "to": "auth:bearer"
    },
    {
      "from": "tools_mcp_relay",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_relay",
      "to": "network:external"
    },
    {
      "from": "tools_mcp_relay",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_relay",
      "to": "storage:read"
    },
    {
      "from": "tools_mcp_relay",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_relay",
      "to": "user_data:read"
    },
    {
      "from": "tools_mcp_server",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_server",
      "to": "get_or_create_publish_token"
    },
    {
      "from": "tools_mcp_server",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_server",
      "to": "router"
    },
    {
      "from": "tools_mcp_server",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_server",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_mcp_server",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_server",
      "to": "auth:bearer"
    },
    {
      "from": "tools_mcp_server",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_server",
      "to": "network:external"
    },
    {
      "from": "tools_mcp_server",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_server",
      "to": "storage:write"
    },
    {
      "from": "tools_mcp_server",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_mcp_server",
      "to": "user_data:write"
    },
    {
      "from": "tools_odysseus_relay",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_odysseus_relay",
      "to": "ODYSSEUS_CATALOGUE"
    },
    {
      "from": "tools_odysseus_relay",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_odysseus_relay",
      "to": "invoke"
    },
    {
      "from": "tools_odysseus_relay",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_odysseus_relay",
      "to": "probe_capabilities"
    },
    {
      "from": "tools_odysseus_relay",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_odysseus_relay",
      "to": "request"
    },
    {
      "from": "tools_odysseus_relay",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_odysseus_relay",
      "to": "safe_tool_name"
    },
    {
      "from": "tools_odysseus_relay",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tools_odysseus_relay",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_odysseus_relay",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_odysseus_relay",
      "to": "auth:bearer"
    },
    {
      "from": "tools_odysseus_relay",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_odysseus_relay",
      "to": "network:external"
    },
    {
      "from": "tools_odysseus_relay",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_odysseus_relay",
      "to": "storage:read"
    },
    {
      "from": "tools_odysseus_relay",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_odysseus_relay",
      "to": "user_data:read"
    },
    {
      "from": "tools_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_pkg",
      "to": "re-exports"
    },
    {
      "from": "tools_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tools_pkg",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_pkg",
      "to": "auth:none"
    },
    {
      "from": "tools_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_pkg",
      "to": "network:none"
    },
    {
      "from": "tools_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_pkg",
      "to": "storage:none"
    },
    {
      "from": "tools_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_pkg",
      "to": "user_data:read"
    },
    {
      "from": "tools_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "TOOL_KIND_*"
    },
    {
      "from": "tools_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "Tool"
    },
    {
      "from": "tools_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "ToolError"
    },
    {
      "from": "tools_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "invoke"
    },
    {
      "from": "tools_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "is_global"
    },
    {
      "from": "tools_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "list_tools"
    },
    {
      "from": "tools_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "lookup"
    },
    {
      "from": "tools_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "register"
    },
    {
      "from": "tools_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "unregister"
    },
    {
      "from": "tools_registry",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "user_tool_names"
    },
    {
      "from": "tools_registry",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "auth:bearer"
    },
    {
      "from": "tools_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "network:none"
    },
    {
      "from": "tools_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "storage:none"
    },
    {
      "from": "tools_registry",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_registry",
      "to": "user_data:read"
    },
    {
      "from": "tools_webhook",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "tools_webhook",
      "to": "invoke"
    },
    {
      "from": "tools_webhook",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "tools_webhook",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_webhook",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_webhook",
      "to": "auth:bearer"
    },
    {
      "from": "tools_webhook",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_webhook",
      "to": "network:external"
    },
    {
      "from": "tools_webhook",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_webhook",
      "to": "storage:none"
    },
    {
      "from": "tools_webhook",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "tools_webhook",
      "to": "user_data:read"
    },
    {
      "from": "traffic_log",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "traffic_log",
      "to": "log_path"
    },
    {
      "from": "traffic_log",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "traffic_log",
      "to": "traffic_middleware"
    },
    {
      "from": "traffic_log",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "traffic_log",
      "to": "Erin Spencer"
    },
    {
      "from": "traffic_log",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "traffic_log",
      "to": "auth:none"
    },
    {
      "from": "traffic_log",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "traffic_log",
      "to": "network:none"
    },
    {
      "from": "traffic_log",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "traffic_log",
      "to": "storage:write"
    },
    {
      "from": "traffic_log",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "traffic_log",
      "to": "user_data:read"
    },
    {
      "from": "ucns_bridge",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "UNIT"
    },
    {
      "from": "ucns_bridge",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "describe"
    },
    {
      "from": "ucns_bridge",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "has_a0_safe_facade"
    },
    {
      "from": "ucns_bridge",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "is_unit"
    },
    {
      "from": "ucns_bridge",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "multiply"
    },
    {
      "from": "ucns_bridge",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "object_record"
    },
    {
      "from": "ucns_bridge",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "seq_prime_safe"
    },
    {
      "from": "ucns_bridge",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "a0p maintainer"
    },
    {
      "from": "ucns_bridge",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "auth:none"
    },
    {
      "from": "ucns_bridge",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "network:none"
    },
    {
      "from": "ucns_bridge",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "storage:none"
    },
    {
      "from": "ucns_bridge",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "ucns_bridge",
      "to": "user_data:none"
    },
    {
      "from": "zfae_archive",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_archive",
      "to": "append_training_record"
    },
    {
      "from": "zfae_archive",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_archive",
      "to": "archive_path_for"
    },
    {
      "from": "zfae_archive",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_archive",
      "to": "archive_session"
    },
    {
      "from": "zfae_archive",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_archive",
      "to": "iter_records"
    },
    {
      "from": "zfae_archive",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_archive",
      "to": "training_records_path_for"
    },
    {
      "from": "zfae_archive",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_archive",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_archive",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_archive",
      "to": "auth:none"
    },
    {
      "from": "zfae_archive",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_archive",
      "to": "network:none"
    },
    {
      "from": "zfae_archive",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_archive",
      "to": "storage:write"
    },
    {
      "from": "zfae_archive",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_archive",
      "to": "user_data:write"
    },
    {
      "from": "zfae_closed_tokens",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_closed_tokens",
      "to": "AFFIXES"
    },
    {
      "from": "zfae_closed_tokens",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_closed_tokens",
      "to": "CLOSED_CLASS"
    },
    {
      "from": "zfae_closed_tokens",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_closed_tokens",
      "to": "is_affix"
    },
    {
      "from": "zfae_closed_tokens",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_closed_tokens",
      "to": "is_closed_class"
    },
    {
      "from": "zfae_closed_tokens",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_closed_tokens",
      "to": "is_open_class"
    },
    {
      "from": "zfae_closed_tokens",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_closed_tokens",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_closed_tokens",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_closed_tokens",
      "to": "auth:none"
    },
    {
      "from": "zfae_closed_tokens",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_closed_tokens",
      "to": "network:none"
    },
    {
      "from": "zfae_closed_tokens",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_closed_tokens",
      "to": "storage:none"
    },
    {
      "from": "zfae_closed_tokens",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_closed_tokens",
      "to": "user_data:read"
    },
    {
      "from": "zfae_fiq_emit",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_fiq_emit",
      "to": "ZFAE_EVENT_TYPES"
    },
    {
      "from": "zfae_fiq_emit",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_fiq_emit",
      "to": "emit"
    },
    {
      "from": "zfae_fiq_emit",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_fiq_emit",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_fiq_emit",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_fiq_emit",
      "to": "auth:none"
    },
    {
      "from": "zfae_fiq_emit",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_fiq_emit",
      "to": "network:internal"
    },
    {
      "from": "zfae_fiq_emit",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_fiq_emit",
      "to": "storage:write"
    },
    {
      "from": "zfae_fiq_emit",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_fiq_emit",
      "to": "user_data:write"
    },
    {
      "from": "zfae_gonal_inscription",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_gonal_inscription",
      "to": "PrivateGonal"
    },
    {
      "from": "zfae_gonal_inscription",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_gonal_inscription",
      "to": "inscribe_text"
    },
    {
      "from": "zfae_gonal_inscription",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_gonal_inscription",
      "to": "whiten_payload"
    },
    {
      "from": "zfae_gonal_inscription",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_gonal_inscription",
      "to": "whitened_indices"
    },
    {
      "from": "zfae_gonal_inscription",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_gonal_inscription",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_gonal_inscription",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_gonal_inscription",
      "to": "auth:none"
    },
    {
      "from": "zfae_gonal_inscription",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_gonal_inscription",
      "to": "network:none"
    },
    {
      "from": "zfae_gonal_inscription",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_gonal_inscription",
      "to": "storage:none"
    },
    {
      "from": "zfae_gonal_inscription",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_gonal_inscription",
      "to": "user_data:none"
    },
    {
      "from": "zfae_inference_engine",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_inference_engine",
      "to": "A0ZFAEInferenceEngine"
    },
    {
      "from": "zfae_inference_engine",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_inference_engine",
      "to": "InferenceResult"
    },
    {
      "from": "zfae_inference_engine",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_inference_engine",
      "to": "MISSING_NATIVE_MESSAGE"
    },
    {
      "from": "zfae_inference_engine",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_inference_engine",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_inference_engine",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_inference_engine",
      "to": "auth:none"
    },
    {
      "from": "zfae_inference_engine",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_inference_engine",
      "to": "network:none"
    },
    {
      "from": "zfae_inference_engine",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_inference_engine",
      "to": "storage:none"
    },
    {
      "from": "zfae_inference_engine",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_inference_engine",
      "to": "user_data:read"
    },
    {
      "from": "zfae_intent_selector",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_intent_selector",
      "to": "INTENT_LABELS"
    },
    {
      "from": "zfae_intent_selector",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_intent_selector",
      "to": "IntentLabel"
    },
    {
      "from": "zfae_intent_selector",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_intent_selector",
      "to": "select_intent"
    },
    {
      "from": "zfae_intent_selector",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_intent_selector",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_intent_selector",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_intent_selector",
      "to": "auth:none"
    },
    {
      "from": "zfae_intent_selector",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_intent_selector",
      "to": "network:none"
    },
    {
      "from": "zfae_intent_selector",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_intent_selector",
      "to": "storage:none"
    },
    {
      "from": "zfae_intent_selector",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_intent_selector",
      "to": "user_data:none"
    },
    {
      "from": "zfae_long_memory",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_long_memory",
      "to": "canon_summary"
    },
    {
      "from": "zfae_long_memory",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_long_memory",
      "to": "reset_cache"
    },
    {
      "from": "zfae_long_memory",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_long_memory",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_long_memory",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_long_memory",
      "to": "auth:none"
    },
    {
      "from": "zfae_long_memory",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_long_memory",
      "to": "network:none"
    },
    {
      "from": "zfae_long_memory",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_long_memory",
      "to": "storage:read"
    },
    {
      "from": "zfae_long_memory",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_long_memory",
      "to": "user_data:none"
    },
    {
      "from": "zfae_morphology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_morphology",
      "to": "BoneGonal"
    },
    {
      "from": "zfae_morphology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_morphology",
      "to": "RootGonal"
    },
    {
      "from": "zfae_morphology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_morphology",
      "to": "carrier_lcm"
    },
    {
      "from": "zfae_morphology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_morphology",
      "to": "compose_word"
    },
    {
      "from": "zfae_morphology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_morphology",
      "to": "decompose_clause"
    },
    {
      "from": "zfae_morphology",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_morphology",
      "to": "word_signal"
    },
    {
      "from": "zfae_morphology",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_morphology",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_morphology",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_morphology",
      "to": "auth:none"
    },
    {
      "from": "zfae_morphology",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_morphology",
      "to": "network:none"
    },
    {
      "from": "zfae_morphology",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_morphology",
      "to": "storage:none"
    },
    {
      "from": "zfae_morphology",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_morphology",
      "to": "user_data:read"
    },
    {
      "from": "zfae_native_tools",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_native_tools",
      "to": "NATIVE_TOOL_NAMES"
    },
    {
      "from": "zfae_native_tools",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_native_tools",
      "to": "select_native_tool"
    },
    {
      "from": "zfae_native_tools",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_native_tools",
      "to": "summarize_tool_result"
    },
    {
      "from": "zfae_native_tools",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_native_tools",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_native_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_native_tools",
      "to": "auth:none"
    },
    {
      "from": "zfae_native_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_native_tools",
      "to": "network:none"
    },
    {
      "from": "zfae_native_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_native_tools",
      "to": "storage:none"
    },
    {
      "from": "zfae_native_tools",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_native_tools",
      "to": "user_data:read"
    },
    {
      "from": "zfae_overrides",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "PendingOverride"
    },
    {
      "from": "zfae_overrides",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "approve"
    },
    {
      "from": "zfae_overrides",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "create_override"
    },
    {
      "from": "zfae_overrides",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "expire"
    },
    {
      "from": "zfae_overrides",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "get"
    },
    {
      "from": "zfae_overrides",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "list_pending"
    },
    {
      "from": "zfae_overrides",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "reject"
    },
    {
      "from": "zfae_overrides",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_overrides",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "auth:none"
    },
    {
      "from": "zfae_overrides",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "network:internal"
    },
    {
      "from": "zfae_overrides",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "storage:write"
    },
    {
      "from": "zfae_overrides",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_overrides",
      "to": "user_data:write"
    },
    {
      "from": "zfae_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_pkg",
      "to": "A0ZFAEInferenceEngine"
    },
    {
      "from": "zfae_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_pkg",
      "to": "ENGINE"
    },
    {
      "from": "zfae_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_pkg",
      "to": "InferenceResult"
    },
    {
      "from": "zfae_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_pkg",
      "to": "MISSING_NATIVE_MESSAGE"
    },
    {
      "from": "zfae_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_pkg",
      "to": "ZFAEAgent"
    },
    {
      "from": "zfae_pkg",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_pkg",
      "to": "infer"
    },
    {
      "from": "zfae_pkg",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_pkg",
      "to": "auth:none"
    },
    {
      "from": "zfae_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_pkg",
      "to": "network:none"
    },
    {
      "from": "zfae_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_pkg",
      "to": "storage:none"
    },
    {
      "from": "zfae_pkg",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_pkg",
      "to": "user_data:read"
    },
    {
      "from": "zfae_runtime",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_runtime",
      "to": "MISSING_NATIVE_MESSAGE"
    },
    {
      "from": "zfae_runtime",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_runtime",
      "to": "RuntimeMode"
    },
    {
      "from": "zfae_runtime",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_runtime",
      "to": "RuntimeReply"
    },
    {
      "from": "zfae_runtime",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_runtime",
      "to": "ZFAERuntime"
    },
    {
      "from": "zfae_runtime",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_runtime",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_runtime",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_runtime",
      "to": "auth:none"
    },
    {
      "from": "zfae_runtime",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_runtime",
      "to": "network:external"
    },
    {
      "from": "zfae_runtime",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_runtime",
      "to": "storage:write"
    },
    {
      "from": "zfae_runtime",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_runtime",
      "to": "user_data:read"
    },
    {
      "from": "zfae_semantic_parser",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_semantic_parser",
      "to": "SemanticFeatures"
    },
    {
      "from": "zfae_semantic_parser",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_semantic_parser",
      "to": "parse_semantic"
    },
    {
      "from": "zfae_semantic_parser",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_semantic_parser",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_semantic_parser",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_semantic_parser",
      "to": "auth:none"
    },
    {
      "from": "zfae_semantic_parser",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_semantic_parser",
      "to": "network:none"
    },
    {
      "from": "zfae_semantic_parser",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_semantic_parser",
      "to": "storage:none"
    },
    {
      "from": "zfae_semantic_parser",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_semantic_parser",
      "to": "user_data:read"
    },
    {
      "from": "zfae_sentinel_eval",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_eval",
      "to": "EventContext"
    },
    {
      "from": "zfae_sentinel_eval",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_eval",
      "to": "evaluate"
    },
    {
      "from": "zfae_sentinel_eval",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_eval",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_sentinel_eval",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_eval",
      "to": "auth:none"
    },
    {
      "from": "zfae_sentinel_eval",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_eval",
      "to": "network:none"
    },
    {
      "from": "zfae_sentinel_eval",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_eval",
      "to": "storage:none"
    },
    {
      "from": "zfae_sentinel_eval",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_eval",
      "to": "user_data:read"
    },
    {
      "from": "zfae_sentinel_modes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_modes",
      "to": "SENTINEL_MODES_DEFAULT"
    },
    {
      "from": "zfae_sentinel_modes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_modes",
      "to": "bulk_set"
    },
    {
      "from": "zfae_sentinel_modes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_modes",
      "to": "resolve_modes"
    },
    {
      "from": "zfae_sentinel_modes",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_modes",
      "to": "validate_modes"
    },
    {
      "from": "zfae_sentinel_modes",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_modes",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_sentinel_modes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_modes",
      "to": "auth:none"
    },
    {
      "from": "zfae_sentinel_modes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_modes",
      "to": "network:none"
    },
    {
      "from": "zfae_sentinel_modes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_modes",
      "to": "storage:none"
    },
    {
      "from": "zfae_sentinel_modes",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_modes",
      "to": "user_data:read"
    },
    {
      "from": "zfae_sentinel_weights",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_weights",
      "to": "SENTINEL_WEIGHTS_DEFAULT"
    },
    {
      "from": "zfae_sentinel_weights",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_weights",
      "to": "inference_channel"
    },
    {
      "from": "zfae_sentinel_weights",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_weights",
      "to": "resolve_weights"
    },
    {
      "from": "zfae_sentinel_weights",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_weights",
      "to": "validate_weights"
    },
    {
      "from": "zfae_sentinel_weights",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_weights",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_sentinel_weights",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_weights",
      "to": "auth:none"
    },
    {
      "from": "zfae_sentinel_weights",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_weights",
      "to": "network:none"
    },
    {
      "from": "zfae_sentinel_weights",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_weights",
      "to": "storage:none"
    },
    {
      "from": "zfae_sentinel_weights",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinel_weights",
      "to": "user_data:read"
    },
    {
      "from": "zfae_sentinels_13",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinels_13",
      "to": "SENTINELS"
    },
    {
      "from": "zfae_sentinels_13",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinels_13",
      "to": "Sentinel"
    },
    {
      "from": "zfae_sentinels_13",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinels_13",
      "to": "SentinelMode"
    },
    {
      "from": "zfae_sentinels_13",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinels_13",
      "to": "SentinelVerdict"
    },
    {
      "from": "zfae_sentinels_13",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinels_13",
      "to": "Verdict13"
    },
    {
      "from": "zfae_sentinels_13",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinels_13",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_sentinels_13",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinels_13",
      "to": "auth:none"
    },
    {
      "from": "zfae_sentinels_13",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinels_13",
      "to": "network:none"
    },
    {
      "from": "zfae_sentinels_13",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinels_13",
      "to": "storage:read"
    },
    {
      "from": "zfae_sentinels_13",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_sentinels_13",
      "to": "user_data:read"
    },
    {
      "from": "zfae_state_transition",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_state_transition",
      "to": "ZFAE_RING_NAMES"
    },
    {
      "from": "zfae_state_transition",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_state_transition",
      "to": "advance_zfae_state"
    },
    {
      "from": "zfae_state_transition",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_state_transition",
      "to": "bind_features_to_rings"
    },
    {
      "from": "zfae_state_transition",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_state_transition",
      "to": "snapshot_after"
    },
    {
      "from": "zfae_state_transition",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_state_transition",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_state_transition",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_state_transition",
      "to": "auth:none"
    },
    {
      "from": "zfae_state_transition",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_state_transition",
      "to": "network:none"
    },
    {
      "from": "zfae_state_transition",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_state_transition",
      "to": "storage:none"
    },
    {
      "from": "zfae_state_transition",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_state_transition",
      "to": "user_data:read"
    },
    {
      "from": "zfae_teacher_client",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_teacher_client",
      "to": "TeacherClient"
    },
    {
      "from": "zfae_teacher_client",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_teacher_client",
      "to": "TeacherInvocation"
    },
    {
      "from": "zfae_teacher_client",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_teacher_client",
      "to": "build_curated_context"
    },
    {
      "from": "zfae_teacher_client",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_teacher_client",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_teacher_client",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_teacher_client",
      "to": "auth:none"
    },
    {
      "from": "zfae_teacher_client",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_teacher_client",
      "to": "network:external"
    },
    {
      "from": "zfae_teacher_client",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_teacher_client",
      "to": "storage:read"
    },
    {
      "from": "zfae_teacher_client",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_teacher_client",
      "to": "user_data:read"
    },
    {
      "from": "zfae_template_decoder",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_template_decoder",
      "to": "MISSING_DECODER_MESSAGE"
    },
    {
      "from": "zfae_template_decoder",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_template_decoder",
      "to": "TemplateGrammarDecoder"
    },
    {
      "from": "zfae_template_decoder",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_template_decoder",
      "to": "render"
    },
    {
      "from": "zfae_template_decoder",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_template_decoder",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_template_decoder",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_template_decoder",
      "to": "auth:none"
    },
    {
      "from": "zfae_template_decoder",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_template_decoder",
      "to": "network:none"
    },
    {
      "from": "zfae_template_decoder",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_template_decoder",
      "to": "storage:none"
    },
    {
      "from": "zfae_template_decoder",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_template_decoder",
      "to": "user_data:read"
    },
    {
      "from": "zfae_trainer",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_trainer",
      "to": "TrainingResult"
    },
    {
      "from": "zfae_trainer",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_trainer",
      "to": "ZFAELearner"
    },
    {
      "from": "zfae_trainer",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_trainer",
      "to": "distill_step"
    },
    {
      "from": "zfae_trainer",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_trainer",
      "to": "text_signature"
    },
    {
      "from": "zfae_trainer",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_trainer",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_trainer",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_trainer",
      "to": "auth:none"
    },
    {
      "from": "zfae_trainer",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_trainer",
      "to": "network:none"
    },
    {
      "from": "zfae_trainer",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_trainer",
      "to": "storage:write"
    },
    {
      "from": "zfae_trainer",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_trainer",
      "to": "user_data:read"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_bank",
      "to": "A0ZFAEWeightBank"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_bank",
      "to": "CORE_NAMES"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_bank",
      "to": "WEIGHT_COUNT"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_bank",
      "to": "WEIGHT_COUNT_PER_CORE"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_bank",
      "to": "WEIGHT_COUNT_TOTAL"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_bank",
      "to": "WEIGHT_SHAPE"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_bank",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_bank",
      "to": "auth:none"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_bank",
      "to": "network:none"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_bank",
      "to": "storage:write"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_bank",
      "to": "user_data:write"
    },
    {
      "from": "zfae_weight_init",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "CORE_NAMES"
    },
    {
      "from": "zfae_weight_init",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "WEIGHT_COUNT"
    },
    {
      "from": "zfae_weight_init",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "WEIGHT_COUNT_PER_CORE"
    },
    {
      "from": "zfae_weight_init",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "WEIGHT_COUNT_TOTAL"
    },
    {
      "from": "zfae_weight_init",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "WEIGHT_SHAPE"
    },
    {
      "from": "zfae_weight_init",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "default_metadata"
    },
    {
      "from": "zfae_weight_init",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "seed_initial_three_core"
    },
    {
      "from": "zfae_weight_init",
      "kind": "exposes",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "seed_initial_weights"
    },
    {
      "from": "zfae_weight_init",
      "kind": "owns",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_weight_init",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "auth:none"
    },
    {
      "from": "zfae_weight_init",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "network:none"
    },
    {
      "from": "zfae_weight_init",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "storage:none"
    },
    {
      "from": "zfae_weight_init",
      "kind": "risk",
      "source_block": "CAPABILITIES",
      "source_id": "zfae_weight_init",
      "to": "user_data:read"
    },
    {
      "from": "a0p_contracts_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "a0p_contracts_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "a0p_crypto_vault_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "a0p_crypto_vault_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "a0p_db_motor_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "a0p_db_motor_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "a0p_models_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "a0p_models_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "a0p_skills_pkg_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "a0p_skills_pkg_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "agent_character_sheet_shape",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "agent_character_sheet_shape",
      "to": "a0p_skills.contracts.agent_character_sheet_shape_holds"
    },
    {
      "from": "agent_instance_full_crud",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "agent_instance_full_crud",
      "to": "a0p_skills.contracts.agent_instance_full_crud_holds"
    },
    {
      "from": "agent_instance_full_crud",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "agent_instance_full_crud",
      "to": "a0p_skills.contracts.agent_instance_full_crud_holds"
    },
    {
      "from": "agent_lab_plan",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "agent_lab_plan",
      "to": "a0p_skills.contracts.agent_lab_plan_holds"
    },
    {
      "from": "agent_lifecycle_count_live_for_parent_filters",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "agent_lifecycle_count_live_for_parent_filters",
      "to": "python.tests.contracts.spawn_executor.test_count_live_for_parent_filters"
    },
    {
      "from": "agent_lifecycle_registry_is_singleton",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "agent_lifecycle_registry_is_singleton",
      "to": "python.tests.contracts.spawn_executor.test_registry_is_singleton"
    },
    {
      "from": "aimmh_fan_out_parallel",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "aimmh_fan_out_parallel",
      "to": "a0p_skills.contracts.aimmh_invoke_propagates_error"
    },
    {
      "from": "aimmh_pkg_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "aimmh_pkg_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "api_extensions_living_spec",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "api_extensions_living_spec",
      "to": "a0p_skills.contracts.api_extensions_living_spec_holds"
    },
    {
      "from": "api_tools_mcp_skills_router_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "api_tools_mcp_skills_router_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "api_training_readout",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "api_training_readout",
      "to": "a0p_skills.contracts.api_training_readout_holds"
    },
    {
      "from": "app_settings_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "app_settings_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "auth_register_login_round_trip",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "auth_register_login_round_trip",
      "to": "a0p_skills.contracts.auth_register_login_round_trip_holds"
    },
    {
      "from": "billing_webhook_replay_idempotent",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "billing_webhook_replay_idempotent",
      "to": "python.tests.contracts.billing.test_webhook_replay_is_idempotent"
    },
    {
      "from": "boundaries_runner_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "boundaries_runner_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "capabilities_runner_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "capabilities_runner_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "carrier_adjacency_hard_invariant",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "carrier_adjacency_hard_invariant",
      "to": "a0p_skills.contracts.carrier_adjacency_hard_invariant_holds"
    },
    {
      "from": "carrier_class_tags",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "carrier_class_tags",
      "to": "a0p_skills.contracts.carrier_class_tags_holds"
    },
    {
      "from": "carrier_disk_protocol",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "carrier_disk_protocol",
      "to": "a0p_skills.contracts.carrier_disk_protocol_holds"
    },
    {
      "from": "carrier_face_chirality",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "carrier_face_chirality",
      "to": "a0p_skills.contracts.carrier_face_chirality_holds"
    },
    {
      "from": "carrier_face_crossing_bone",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "carrier_face_crossing_bone",
      "to": "a0p_skills.contracts.carrier_face_crossing_bone_holds"
    },
    {
      "from": "carrier_gonal_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "carrier_gonal_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "carrier_mirror_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "carrier_mirror_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "carrier_pkg_exports",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "carrier_pkg_exports",
      "to": "a0p_skills.contracts.carrier_pkg_exports_holds"
    },
    {
      "from": "carrier_public_fixture_is_valid_and_distinct",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "carrier_public_fixture_is_valid_and_distinct",
      "to": "a0p_skills.contracts.carrier_public_fixture_is_valid_and_distinct_holds"
    },
    {
      "from": "carrier_registry_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "carrier_registry_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "chat_delete_other_owner_404",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "chat_delete_other_owner_404",
      "to": "python.tests.contracts.chat.test_delete_other_owner_404"
    },
    {
      "from": "chat_get_other_owner_404",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "chat_get_other_owner_404",
      "to": "python.tests.contracts.chat.test_get_other_owner_404"
    },
    {
      "from": "chat_instance_mode_dispatch",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "chat_instance_mode_dispatch",
      "to": "a0p_skills.contracts.chat_instance_mode_dispatch_holds"
    },
    {
      "from": "chat_unknown_body_model_400",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "chat_unknown_body_model_400",
      "to": "python.tests.contracts.chat.test_unknown_body_model_400"
    },
    {
      "from": "edcm_readout_bounds",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "edcm_readout_bounds",
      "to": "a0p_skills.contracts.edcm_readout_bounds_holds"
    },
    {
      "from": "explainer_402_when_no_credits",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "explainer_402_when_no_credits",
      "to": "python.tests.contracts.transcripts_explainer.test_no_credits_returns_none"
    },
    {
      "from": "explainer_call_surfaces_in_learning_summary",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "explainer_call_surfaces_in_learning_summary",
      "to": "python.tests.contracts.transcripts_explainer.test_explainer_call_surfaces_in_learning_summary"
    },
    {
      "from": "explainer_decrements_free_first",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "explainer_decrements_free_first",
      "to": "python.tests.contracts.transcripts_explainer.test_decrements_free_then_paid"
    },
    {
      "from": "explainer_explanation_is_idempotent",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "explainer_explanation_is_idempotent",
      "to": "python.tests.contracts.transcripts_explainer.test_idempotent_no_double_charge"
    },
    {
      "from": "explainer_refund_restores_balance",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "explainer_refund_restores_balance",
      "to": "python.tests.contracts.transcripts_explainer.test_refund_after_failure"
    },
    {
      "from": "explainer_rejects_fabricated_citations",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "explainer_rejects_fabricated_citations",
      "to": "python.tests.contracts.transcripts_explainer.test_rejects_fabricated_citations"
    },
    {
      "from": "ficks_gradient",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ficks_gradient",
      "to": "a0p_skills.contracts.ficks_gradient_holds"
    },
    {
      "from": "fiq_audit_chain_appends",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "fiq_audit_chain_appends",
      "to": "a0p_skills.contracts.fiq_audit_chain_appends_holds"
    },
    {
      "from": "fiq_audit_filesystem_and_mongo",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "fiq_audit_filesystem_and_mongo",
      "to": "a0p_skills.contracts.fiq_audit_filesystem_and_mongo_holds"
    },
    {
      "from": "fiq_flux_equation",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "fiq_flux_equation",
      "to": "a0p_skills.contracts.fiq_flux_equation_holds"
    },
    {
      "from": "fiq_gate_shape",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "fiq_gate_shape",
      "to": "a0p_skills.contracts.fiq_gate_shape_holds"
    },
    {
      "from": "fiq_pkg_exports",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "fiq_pkg_exports",
      "to": "a0p_skills.contracts.fiq_pkg_exports_holds"
    },
    {
      "from": "fiq_tick_schedule_canon",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "fiq_tick_schedule_canon",
      "to": "a0p_skills.contracts.fiq_tick_schedule_canon_holds"
    },
    {
      "from": "frontend_module_build_runner_smoke",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "frontend_module_build_runner_smoke",
      "to": "a0p_skills.contracts.frontend_module_build_runner_smoke_holds"
    },
    {
      "from": "gating_allowlist_entries_are_real_routes",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "gating_allowlist_entries_are_real_routes",
      "to": "python.tests.contracts.gating.test_allowlist_entries_correspond_to_real_routes"
    },
    {
      "from": "gating_every_write_route_is_admin_or_allowlisted",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "gating_every_write_route_is_admin_or_allowlisted",
      "to": "python.tests.contracts.gating.test_every_write_route_is_gated_or_allowlisted"
    },
    {
      "from": "gating_instrument_files_all_writes_gated",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "gating_instrument_files_all_writes_gated",
      "to": "python.tests.contracts.gating.test_instrument_mutation_files_have_all_writes_gated"
    },
    {
      "from": "gating_instrument_files_never_allowlisted",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "gating_instrument_files_never_allowlisted",
      "to": "python.tests.contracts.gating.test_instrument_mutation_files_are_never_allowlisted"
    },
    {
      "from": "gonal_lifted_path_round_trip",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "gonal_lifted_path_round_trip",
      "to": "a0p_skills.contracts.gonal_lifted_path_round_trip_holds"
    },
    {
      "from": "gonal_stack_recompose",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "gonal_stack_recompose",
      "to": "a0p_skills.contracts.gonal_stack_recompose_holds"
    },
    {
      "from": "interdependent_lib_pkg_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "interdependent_lib_pkg_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "living_spec_scanner_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "living_spec_scanner_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "msdmd_pkg_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "msdmd_pkg_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "msdmd_runner_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "msdmd_runner_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "network_coherence_weights_sum",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "network_coherence_weights_sum",
      "to": "a0p_skills.contracts.network_coherence_weights_sum_holds"
    },
    {
      "from": "network_engine_heartbeat",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "network_engine_heartbeat",
      "to": "a0p_skills.contracts.network_engine_heartbeat_holds"
    },
    {
      "from": "network_engine_heartbeat",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "network_engine_heartbeat",
      "to": "a0p_skills.contracts.network_engine_heartbeat_holds"
    },
    {
      "from": "network_rings_match_topology",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "network_rings_match_topology",
      "to": "a0p_skills.contracts.network_rings_match_topology_holds"
    },
    {
      "from": "network_tick_is_deterministic",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "network_tick_is_deterministic",
      "to": "a0p_skills.contracts.network_tick_is_deterministic_holds"
    },
    {
      "from": "network_topology_canonical",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "network_topology_canonical",
      "to": "a0p_skills.contracts.network_topology_canonical_holds"
    },
    {
      "from": "pcea_codec_round_trip",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcea_codec_round_trip",
      "to": "a0p_skills.contracts.pcea_round_trip_53"
    },
    {
      "from": "pcea_kernel_advances_state",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcea_kernel_advances_state",
      "to": "a0p_skills.contracts.pcea_kernel_advances_state_holds"
    },
    {
      "from": "pcea_kernel_layer_cross_cut",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcea_kernel_layer_cross_cut",
      "to": "a0p_skills.contracts.pcea_kernel_layer_cross_cut_holds"
    },
    {
      "from": "pcea_kernel_round_trip",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcea_kernel_round_trip",
      "to": "a0p_skills.contracts.pcea_kernel_round_trip_holds"
    },
    {
      "from": "pcea_primes_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcea_primes_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "pcea_round_trip_53",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcea_round_trip_53",
      "to": "a0p_skills.contracts.pcea_round_trip_53"
    },
    {
      "from": "pcea_round_trip_53",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcea_round_trip_53",
      "to": "a0p_skills.contracts.pcea_round_trip_53"
    },
    {
      "from": "pcea_round_trip_53",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcea_round_trip_53",
      "to": "a0p_skills.contracts.pcea_round_trip_53"
    },
    {
      "from": "pcna_aggregate_deterministic",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcna_aggregate_deterministic",
      "to": "a0p_skills.contracts.pcna_aggregate_deterministic_holds"
    },
    {
      "from": "pcna_aggregate_identity",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcna_aggregate_identity",
      "to": "a0p_skills.contracts.pcna_aggregate_identity_holds"
    },
    {
      "from": "pcna_aggregate_size",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcna_aggregate_size",
      "to": "a0p_skills.contracts.pcna_aggregate_size_holds"
    },
    {
      "from": "pcna_edcm_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcna_edcm_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "pcna_engine_impl_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcna_engine_impl_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "pcna_memory_core_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcna_memory_core_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "pcna_pkg_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcna_pkg_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "pcna_sigma_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcna_sigma_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "pcna_theta_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcna_theta_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "pcna_zeta_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcna_zeta_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "pcta_circle_holds_seven",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "pcta_circle_holds_seven",
      "to": "a0p_skills.contracts.pcta_circle_holds_seven_holds"
    },
    {
      "from": "provider_anthropic_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "provider_anthropic_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "provider_base_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "provider_base_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "provider_gemini_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "provider_gemini_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "provider_openai_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "provider_openai_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "provider_xai_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "provider_xai_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "providers_pkg_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "providers_pkg_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "ptca_canon_shape",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ptca_canon_shape",
      "to": "a0p_skills.contracts.ptca_canon_shape_holds"
    },
    {
      "from": "ptca_canon_shape",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ptca_canon_shape",
      "to": "a0p_skills.contracts.ptca_canon_shape_holds"
    },
    {
      "from": "ptca_exchange_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ptca_exchange_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "ptca_instance_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ptca_instance_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "ptca_primes_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ptca_primes_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "ptca_provenance_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ptca_provenance_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "ptca_sentinels_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ptca_sentinels_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "ptca_tensor_canon_shape",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ptca_tensor_canon_shape",
      "to": "a0p_skills.contracts.ptca_tensor_canon_shape_holds"
    },
    {
      "from": "ptca_tensor_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ptca_tensor_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "ratios_runner_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ratios_runner_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "readme_writer_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "readme_writer_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "routes_doc_blocks_complete",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "routes_doc_blocks_complete",
      "to": "python.tests.contracts.module_doctrine.test_route_doc_blocks_are_complete"
    },
    {
      "from": "routes_files_annotated",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "routes_files_annotated",
      "to": "python.tests.contracts.module_doctrine.test_route_files_are_annotated"
    },
    {
      "from": "routes_routers_registered",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "routes_routers_registered",
      "to": "python.tests.contracts.module_doctrine.test_router_defining_files_are_registered"
    },
    {
      "from": "routes_write_endpoints_gated",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "routes_write_endpoints_gated",
      "to": "python.tests.contracts.route_gating.test_every_write_route_is_gated"
    },
    {
      "from": "sentinel_registry_complete",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "sentinel_registry_complete",
      "to": "a0p_skills.contracts.sentinel_registry_complete_holds"
    },
    {
      "from": "sigma_host_digest_stable",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "sigma_host_digest_stable",
      "to": "a0p_skills.contracts.sigma_host_digest_stable_holds"
    },
    {
      "from": "skill_report_visibility",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "skill_report_visibility",
      "to": "a0p_skills.contracts.skill_report_visibility_holds"
    },
    {
      "from": "skills_pkg_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "skills_pkg_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "skills_registry_overlap_warns",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "skills_registry_overlap_warns",
      "to": "a0p_skills.contracts.skills_registry_overlap_warns_holds"
    },
    {
      "from": "skills_sync_pull",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "skills_sync_pull",
      "to": "a0p_skills.contracts.skills_sync_pull_holds"
    },
    {
      "from": "spawn_executor_claim_atomic",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_claim_atomic",
      "to": "python.tests.contracts.spawn_executor.test_claim_atomic"
    },
    {
      "from": "spawn_executor_concurrent_live_cap",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_concurrent_live_cap",
      "to": "python.tests.contracts.spawn_executor.test_concurrent_live_cap"
    },
    {
      "from": "spawn_executor_heartbeat_advances",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_heartbeat_advances",
      "to": "python.tests.contracts.spawn_executor.test_heartbeat_advances"
    },
    {
      "from": "spawn_executor_marks_failed_on_exception",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_marks_failed_on_exception",
      "to": "python.tests.contracts.spawn_executor.test_marks_failed_on_exception"
    },
    {
      "from": "spawn_executor_merge_helpers_tolerate_no_pcna",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_merge_helpers_tolerate_no_pcna",
      "to": "python.tests.contracts.spawn_executor.test_merge_helpers_tolerate_no_pcna"
    },
    {
      "from": "spawn_executor_no_orphan_invariant",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_no_orphan_invariant",
      "to": "python.tests.contracts.spawn_executor.test_no_orphan_invariant"
    },
    {
      "from": "spawn_executor_resolve_provider_rejects_empty",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_resolve_provider_rejects_empty",
      "to": "python.tests.contracts.spawn_executor.test_resolve_provider_rejects_empty"
    },
    {
      "from": "spawn_executor_retry_default_none",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_retry_default_none",
      "to": "python.tests.contracts.spawn_executor.test_retry_default_none"
    },
    {
      "from": "spawn_executor_retry_once_on_transient",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_retry_once_on_transient",
      "to": "python.tests.contracts.spawn_executor.test_retry_once_on_transient"
    },
    {
      "from": "spawn_executor_skips_non_running",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_skips_non_running",
      "to": "python.tests.contracts.spawn_executor.test_skips_non_running"
    },
    {
      "from": "spawn_executor_snapshot_pcna_shape",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_snapshot_pcna_shape",
      "to": "python.tests.contracts.spawn_executor.test_snapshot_pcna_shape"
    },
    {
      "from": "spawn_executor_stale_sweep_marks_worker_lost",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "spawn_executor_stale_sweep_marks_worker_lost",
      "to": "python.tests.contracts.spawn_executor.test_stale_sweep_marks_worker_lost"
    },
    {
      "from": "storage_anonymous_owner_null",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "storage_anonymous_owner_null",
      "to": "python.tests.contracts.chat.test_create_anonymous_owner_null"
    },
    {
      "from": "storage_create_owner_isolation",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "storage_create_owner_isolation",
      "to": "python.tests.contracts.chat.test_create_owner_isolation"
    },
    {
      "from": "teacher_curated_context_distinct_from_prompt",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "teacher_curated_context_distinct_from_prompt",
      "to": "a0p_skills.contracts.teacher_curated_context_distinct_from_prompt_holds"
    },
    {
      "from": "test_tool_use_loop_self",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "test_tool_use_loop_self",
      "to": "tests.test_tool_use_loop"
    },
    {
      "from": "test_training_room_self",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "test_training_room_self",
      "to": "tests.test_training_room"
    },
    {
      "from": "test_zfae_gonal_inscription_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "test_zfae_gonal_inscription_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "tests_backend_test_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tests_backend_test_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "tests_conftest_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tests_conftest_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "tests_zfae_api_sentinels_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tests_zfae_api_sentinels_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "tests_zfae_three_core_sentinels_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tests_zfae_three_core_sentinels_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "theta_carrier_disk_access",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "theta_carrier_disk_access",
      "to": "a0p_skills.contracts.theta_carrier_disk_access_holds"
    },
    {
      "from": "theta_loader_refuses_no_disk",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "theta_loader_refuses_no_disk",
      "to": "a0p_skills.contracts.theta_loader_refuses_no_disk_holds"
    },
    {
      "from": "tools_agent_loop_two_step",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tools_agent_loop_two_step",
      "to": "a0p_skills.contracts.tools_agent_loop_two_step_holds"
    },
    {
      "from": "tools_builtin_registers",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tools_builtin_registers",
      "to": "a0p_skills.contracts.tools_builtin_registers_holds"
    },
    {
      "from": "tools_gated_invoke_halts_on_cliff",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tools_gated_invoke_halts_on_cliff",
      "to": "a0p_skills.contracts.tools_gated_invoke_halts_on_cliff_holds"
    },
    {
      "from": "tools_mcp_relay_request",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tools_mcp_relay_request",
      "to": "a0p_skills.contracts.tools_mcp_relay_request_holds"
    },
    {
      "from": "tools_mcp_server_initialize",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tools_mcp_server_initialize",
      "to": "a0p_skills.contracts.tools_mcp_server_initialize_holds"
    },
    {
      "from": "tools_odysseus_relay_request",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tools_odysseus_relay_request",
      "to": "a0p_skills.contracts.tools_odysseus_relay_request_holds"
    },
    {
      "from": "tools_pkg_imports",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tools_pkg_imports",
      "to": "a0p_skills.contracts.tools_pkg_imports_holds"
    },
    {
      "from": "tools_registry_register_and_invoke",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tools_registry_register_and_invoke",
      "to": "a0p_skills.contracts.tools_registry_register_and_invoke_holds"
    },
    {
      "from": "tools_webhook_signs",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "tools_webhook_signs",
      "to": "a0p_skills.contracts.tools_webhook_signs_holds"
    },
    {
      "from": "traffic_log_append_only",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "traffic_log_append_only",
      "to": "a0p_skills.contracts.traffic_log_append_only_holds"
    },
    {
      "from": "ucns_bridge_unit_consistency",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "ucns_bridge_unit_consistency",
      "to": "a0p_skills.contracts.ucns_bridge_unit_holds"
    },
    {
      "from": "zfae_archive_appends_jsonl",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_archive_appends_jsonl",
      "to": "a0p_skills.contracts.zfae_archive_appends_jsonl_holds"
    },
    {
      "from": "zfae_closed_tokens_partition",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_closed_tokens_partition",
      "to": "a0p_skills.contracts.zfae_closed_tokens_partition_holds"
    },
    {
      "from": "zfae_decoder_native_only",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_decoder_native_only",
      "to": "a0p_skills.contracts.zfae_decoder_native_only_holds"
    },
    {
      "from": "zfae_engine_native_only",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_engine_native_only",
      "to": "a0p_skills.contracts.zfae_engine_native_only_holds"
    },
    {
      "from": "zfae_engine_native_only",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_engine_native_only",
      "to": "a0p_skills.contracts.zfae_engine_native_only_holds"
    },
    {
      "from": "zfae_engine_route_a_emits_decode",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_engine_route_a_emits_decode",
      "to": "a0p_skills.contracts.zfae_engine_emits_pcea_digest_and_tensors_holds"
    },
    {
      "from": "zfae_fiq_emit_chains",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_fiq_emit_chains",
      "to": "a0p_skills.contracts.zfae_fiq_emit_chains_holds"
    },
    {
      "from": "zfae_gonal_inscription_deterministic",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_gonal_inscription_deterministic",
      "to": "a0p_skills.contracts.zfae_gonal_inscription_deterministic_holds"
    },
    {
      "from": "zfae_intent_dispatch",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_intent_dispatch",
      "to": "a0p_skills.contracts.zfae_intent_dispatch_holds"
    },
    {
      "from": "zfae_learning_step_changes_digest",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_learning_step_changes_digest",
      "to": "a0p_skills.contracts.zfae_learning_step_changes_digest_holds"
    },
    {
      "from": "zfae_long_memory_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_long_memory_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "zfae_morphology_carrier_lcm",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_morphology_carrier_lcm",
      "to": "a0p_skills.contracts.zfae_morphology_carrier_lcm_holds"
    },
    {
      "from": "zfae_morphology_decompose_gated",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_morphology_decompose_gated",
      "to": "a0p_skills.contracts.zfae_morphology_decompose_gated_holds"
    },
    {
      "from": "zfae_native_refuses_when_untrained",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_native_refuses_when_untrained",
      "to": "a0p_skills.contracts.zfae_native_refuses_when_untrained_holds"
    },
    {
      "from": "zfae_native_tool_selection",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_native_tool_selection",
      "to": "a0p_skills.contracts.zfae_native_tool_selection_holds"
    },
    {
      "from": "zfae_overrides_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_overrides_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "zfae_parser_deterministic",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_parser_deterministic",
      "to": "a0p_skills.contracts.zfae_parser_deterministic_holds"
    },
    {
      "from": "zfae_runtime_reply_source_flag",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_runtime_reply_source_flag",
      "to": "a0p_skills.contracts.zfae_runtime_reply_source_flag_holds"
    },
    {
      "from": "zfae_sentinel_eval_cliff_markers_regression",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_sentinel_eval_cliff_markers_regression",
      "to": "interdependent_lib.zfae.sentinel_eval._cliff_markers_regression_holds"
    },
    {
      "from": "zfae_sentinel_eval_returns_verdict13",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_sentinel_eval_returns_verdict13",
      "to": "a0p_skills.contracts.zfae_sentinel_eval_returns_verdict13_holds"
    },
    {
      "from": "zfae_sentinel_modes_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_sentinel_modes_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "zfae_sentinel_weights_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_sentinel_weights_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "zfae_sentinels_13_loads",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_sentinels_13_loads",
      "to": "a0p_skills.contracts.module_imports_cleanly_holds"
    },
    {
      "from": "zfae_teacher_call_writes_training_record",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_teacher_call_writes_training_record",
      "to": "a0p_skills.contracts.zfae_teacher_call_writes_training_record_holds"
    },
    {
      "from": "zfae_transition_deterministic",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_transition_deterministic",
      "to": "a0p_skills.contracts.zfae_transition_deterministic_holds"
    },
    {
      "from": "zfae_weight_bank_loads_407729",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_weight_bank_loads_407729",
      "to": "a0p_skills.contracts.zfae_weight_bank_loads_407729_holds"
    },
    {
      "from": "zfae_weight_bank_persists_gonal_seed",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_weight_bank_persists_gonal_seed",
      "to": "a0p_skills.contracts.zfae_weight_bank_persists_gonal_seed_holds"
    },
    {
      "from": "zfae_weight_bank_three_core_total",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_weight_bank_three_core_total",
      "to": "a0p_skills.contracts.zfae_weight_bank_three_core_total_holds"
    },
    {
      "from": "zfae_weight_init_deterministic",
      "kind": "calls",
      "source_block": "CONTRACTS",
      "source_id": "zfae_weight_init_deterministic",
      "to": "a0p_skills.contracts.zfae_weight_init_deterministic_holds"
    },
    {
      "from": "a0p_contracts",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "a0p_contracts",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_crypto_vault",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "a0p_crypto_vault",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_db_motor",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "a0p_db_motor",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_models",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "a0p_models",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_server",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "a0p_server",
      "to": "a0p maintainer"
    },
    {
      "from": "a0p_skills_frontend_module_build_runner",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "a0p_skills_frontend_module_build_runner",
      "to": "Erin Spencer"
    },
    {
      "from": "a0p_skills_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "a0p_skills_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "agents_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "agents_pkg",
      "to": "Erin Spencer"
    },
    {
      "from": "agents_routes",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "agents_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "agents_schema",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "agents_schema",
      "to": "Erin Spencer"
    },
    {
      "from": "agents_store",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "agents_store",
      "to": "Erin Spencer"
    },
    {
      "from": "aimmh_patterns_impl",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "aimmh_patterns_impl",
      "to": "a0p maintainer"
    },
    {
      "from": "aimmh_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "aimmh_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "api_agent_lab_routes",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "api_agent_lab_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "api_extensions_routes",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "api_extensions_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "api_tools_mcp_skills_routes",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "api_tools_mcp_skills_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "api_training_routes",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "api_training_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "app_settings",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "app_settings",
      "to": "Erin Spencer"
    },
    {
      "from": "auth_routes",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "auth_routes",
      "to": "Erin Spencer"
    },
    {
      "from": "boundaries_runner",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "boundaries_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "capabilities_runner",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "capabilities_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "carrier_adjacency",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "carrier_adjacency",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_bones",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "carrier_bones",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_classes",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "carrier_classes",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_disk_protocol",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "carrier_disk_protocol",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_faces",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "carrier_faces",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_gonal",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "carrier_gonal",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_mirror",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "carrier_mirror",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "carrier_pkg",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_public_fixture",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "carrier_public_fixture",
      "to": "Erin Spencer"
    },
    {
      "from": "carrier_registry",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "carrier_registry",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_app",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_app",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_audit_tape",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_component_audit_tape",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_character_sheet_form",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_component_character_sheet_form",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_markdown_view",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_component_markdown_view",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_override_modal",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_component_override_modal",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_panel",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_component_panel",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_sentinel_ribbon",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_component_sentinel_ribbon",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_component_shell",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_component_shell",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_api",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_lib_api",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_api_tools",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_lib_api_tools",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_auth",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_lib_auth",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_lib_sentinels",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_lib_sentinels",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_agent_lab",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_agent_lab",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_agents",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_agents",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_chat_training",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_chat_training",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_custom_keys",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_custom_keys",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_drafts",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_drafts",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_inspector",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_inspector",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_inventory",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_inventory",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_keyvault",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_keyvault",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_living_spec",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_living_spec",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_login",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_login",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_mcp",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_mcp",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_overrides",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_overrides",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_sentinels",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_sentinels",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_skills",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_skills",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_splash",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_splash",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_tools",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_tools",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_training_room",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_training_room",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_vault",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_vault",
      "to": "Erin Spencer"
    },
    {
      "from": "fe_page_workspace",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fe_page_workspace",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_audit_log",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fiq_audit_log",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_events",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fiq_events",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_ficks_gradient",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fiq_ficks_gradient",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_gate",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fiq_gate",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_motion",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fiq_motion",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fiq_pkg",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_sentinels",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fiq_sentinels",
      "to": "Erin Spencer"
    },
    {
      "from": "fiq_tick_schedule",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "fiq_tick_schedule",
      "to": "Erin Spencer"
    },
    {
      "from": "gonal_lifted_path",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "gonal_lifted_path",
      "to": "Erin Spencer"
    },
    {
      "from": "il_edcm_readout",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "il_edcm_readout",
      "to": "Erin Spencer"
    },
    {
      "from": "il_gonal_stack",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "il_gonal_stack",
      "to": "Erin Spencer"
    },
    {
      "from": "il_ucns_embed",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "il_ucns_embed",
      "to": "a0p maintainer"
    },
    {
      "from": "interdependent_lib_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "interdependent_lib_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "living_spec_scanner",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "living_spec_scanner",
      "to": "Erin Spencer"
    },
    {
      "from": "module_build_runner",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "module_build_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "msdmd_parser",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "msdmd_parser",
      "to": "a0p maintainer"
    },
    {
      "from": "msdmd_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "msdmd_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "msdmd_runner",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "msdmd_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "network_coherence",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "network_coherence",
      "to": "a0p maintainer"
    },
    {
      "from": "network_engine",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "network_engine",
      "to": "a0p maintainer"
    },
    {
      "from": "network_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "network_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "network_propagate",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "network_propagate",
      "to": "a0p maintainer"
    },
    {
      "from": "network_rings",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "network_rings",
      "to": "a0p maintainer"
    },
    {
      "from": "network_sigma_source",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "network_sigma_source",
      "to": "a0p maintainer"
    },
    {
      "from": "network_topology",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "network_topology",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_cipher",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcea_cipher",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_codec",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcea_codec",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_instance",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcea_instance",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_kernel",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcea_kernel",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcea_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "pcea_primes",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcea_primes",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_edcm",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcna_edcm",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_engine_impl",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcna_engine_impl",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_group_aggregate",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcna_group_aggregate",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_memory_core",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcna_memory_core",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcna_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_sigma",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcna_sigma",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_tensor",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcna_tensor",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_theta",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcna_theta",
      "to": "a0p maintainer"
    },
    {
      "from": "pcna_zeta",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcna_zeta",
      "to": "a0p maintainer"
    },
    {
      "from": "pcta_circle",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcta_circle",
      "to": "a0p maintainer"
    },
    {
      "from": "pcta_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "pcta_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_anthropic",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "provider_anthropic",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_base",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "provider_base",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_gemini",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "provider_gemini",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_openai",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "provider_openai",
      "to": "a0p maintainer"
    },
    {
      "from": "provider_xai",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "provider_xai",
      "to": "a0p maintainer"
    },
    {
      "from": "providers_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "providers_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_constants",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ptca_constants",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_core",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ptca_core",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_exchange",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ptca_exchange",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_instance",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ptca_instance",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ptca_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_primes",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ptca_primes",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_provenance",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ptca_provenance",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_seed",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ptca_seed",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_sentinels",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ptca_sentinels",
      "to": "a0p maintainer"
    },
    {
      "from": "ptca_tensor",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ptca_tensor",
      "to": "a0p maintainer"
    },
    {
      "from": "ratios_runner",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ratios_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "readme_writer",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "readme_writer",
      "to": "Erin Spencer"
    },
    {
      "from": "skills_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "skills_pkg",
      "to": "Erin Spencer"
    },
    {
      "from": "skills_registry",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "skills_registry",
      "to": "Erin Spencer"
    },
    {
      "from": "skills_sync",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "skills_sync",
      "to": "Erin Spencer"
    },
    {
      "from": "test_build_runner",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "test_build_runner",
      "to": "a0p maintainer"
    },
    {
      "from": "test_lifted_path",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "test_lifted_path",
      "to": "Erin Spencer"
    },
    {
      "from": "test_morphology_ladder",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "test_morphology_ladder",
      "to": "Erin Spencer"
    },
    {
      "from": "test_security",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "test_security",
      "to": "Erin Spencer"
    },
    {
      "from": "test_tool_use_loop",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "test_tool_use_loop",
      "to": "Erin Spencer"
    },
    {
      "from": "test_training_room",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "test_training_room",
      "to": "Erin Spencer"
    },
    {
      "from": "test_zfae_gonal_inscription",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "test_zfae_gonal_inscription",
      "to": "a0p maintainer"
    },
    {
      "from": "tests_backend_test",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tests_backend_test",
      "to": "Erin Spencer"
    },
    {
      "from": "tests_conftest",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tests_conftest",
      "to": "Erin Spencer"
    },
    {
      "from": "tests_zfae_api_sentinels",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tests_zfae_api_sentinels",
      "to": "Erin Spencer"
    },
    {
      "from": "tests_zfae_three_core_sentinels",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tests_zfae_three_core_sentinels",
      "to": "Erin Spencer"
    },
    {
      "from": "theta_microkernel",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "theta_microkernel",
      "to": "Erin Spencer"
    },
    {
      "from": "theta_private_loader",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "theta_private_loader",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_agent_loop",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tools_agent_loop",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_builtin",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tools_builtin",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_gated_invoke",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tools_gated_invoke",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_mcp_relay",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tools_mcp_relay",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_mcp_server",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tools_mcp_server",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_odysseus_relay",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tools_odysseus_relay",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tools_pkg",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_registry",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tools_registry",
      "to": "Erin Spencer"
    },
    {
      "from": "tools_webhook",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "tools_webhook",
      "to": "Erin Spencer"
    },
    {
      "from": "traffic_log",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "traffic_log",
      "to": "Erin Spencer"
    },
    {
      "from": "ucns_bridge",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "ucns_bridge",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_archive",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_archive",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_closed_tokens",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_closed_tokens",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_fiq_emit",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_fiq_emit",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_gonal_inscription",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_gonal_inscription",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_inference_engine",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_inference_engine",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_intent_selector",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_intent_selector",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_long_memory",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_long_memory",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_morphology",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_morphology",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_native_tools",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_native_tools",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_overrides",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_overrides",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_pkg",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_pkg",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_runtime",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_runtime",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_semantic_parser",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_semantic_parser",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_sentinel_eval",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_sentinel_eval",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_sentinel_modes",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_sentinel_modes",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_sentinel_weights",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_sentinel_weights",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_sentinels_13",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_sentinels_13",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_state_transition",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_state_transition",
      "to": "a0p maintainer"
    },
    {
      "from": "zfae_teacher_client",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_teacher_client",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_template_decoder",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_template_decoder",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_trainer",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_trainer",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_weight_bank",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_weight_bank",
      "to": "Erin Spencer"
    },
    {
      "from": "zfae_weight_init",
      "kind": "owns",
      "source_block": "MODULE_BUILD",
      "source_id": "zfae_weight_init",
      "to": "Erin Spencer"
    }
  ],
  "gaps": [],
  "repo": "a0-betatest",
  "source_commit": "dcadcdf"
});
