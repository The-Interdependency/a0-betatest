// === MODULE_BUILD ===
// id: fe_component_character_sheet_form
//   module_name: CharacterSheetForm
//   module_kind: ui_component
//   summary: editable character-sheet form for an Agent — name, mode (5-lattice), models, system_prompt, persona, tools allow-list, native-readiness thresholds, gonal assignment; emits onSubmit(sheet)
//   owner: Erin Spencer
//   public_surface: CharacterSheetForm
//   internal_surface: Field, ModelField, useSheet
//   auth_boundary: none
//   storage_boundary: none
//   network_boundary: none
//   user_data_boundary: write
//   admin_only: false
//   tests: manual_browser_smoke
//   rollout: default_enabled
//   rollback: revert; agent creation requires raw POST
// === END MODULE_BUILD ===
// === BOUNDARIES ===
// id: fe_component_character_sheet_form_boundaries
//   summary: form ui only; submit is delegated via onSubmit prop
//   auth_boundary: none
//   storage_boundary: none
//   network_boundary: none
//   user_data_boundary: write
//   admin_only: false
//   owner: Erin Spencer
// === END BOUNDARIES ===
// === CAPABILITIES ===
// id: fe_component_character_sheet_form
//   summary: form ui only; submit is delegated via onSubmit prop
//   exposes: CharacterSheetForm
//   boundaries: auth:none, storage:none, network:none, user_data:write
//   owner: Erin Spencer
// === END CAPABILITIES ===

import React, { useMemo, useState } from "react";
import { MODE_OPTIONS } from "../lib/sentinels";

const MODEL_HINT = "openai/gpt-4o-mini · anthropic/claude-3-5-sonnet · gemini/gemini-1.5-pro · xai/grok-2";

const Field = ({ label, hint, children, testid }) => (
  <label className="block space-y-1" data-testid={testid}>
    <span className="block text-[0.6rem] font-mono uppercase tracking-ultra text-neutral-400">{label}</span>
    {children}
    {hint && <span className="block text-[0.6rem] font-mono text-neutral-600">{hint}</span>}
  </label>
);

export default function CharacterSheetForm({ initial, onSubmit, onCancel, submitLabel = "Create agent", busy }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [mode, setMode] = useState(initial?.mode ?? "a0(zfae)");
  const [baseModel, setBaseModel] = useState(initial?.base_model ?? "");
  const [outerModel, setOuterModel] = useState(initial?.outer_model ?? "");
  const [systemPrompt, setSystemPrompt] = useState(initial?.system_prompt ?? "");
  const [persona, setPersona] = useState(initial?.persona ?? "");
  const [toolsAllowed, setToolsAllowed] = useState((initial?.tools_allowed ?? []).join(", "));
  const [minSteps, setMinSteps] = useState(initial?.min_steps_for_native ?? 16);
  const [maxLoss, setMaxLoss] = useState(initial?.max_loss_for_native ?? 0.1);
  const [phi, setPhi] = useState(initial?.gonal_assignment?.phi ?? "default");
  const [psi, setPsi] = useState(initial?.gonal_assignment?.psi ?? "mirror");
  const [omega, setOmega] = useState(initial?.gonal_assignment?.omega ?? "private");
  const [privateSpecPath, setPrivateSpecPath] = useState(initial?.private_gonal_spec_path ?? "");

  const needsBase = useMemo(() => /<model>/.test(mode), [mode]);
  const needsOuter = useMemo(() => /a0\(<model>\)<model>|a0\(zfae\)<model>/.test(mode), [mode]);

  const ready = name.trim().length >= 2 && (!needsBase || baseModel.trim().length > 0);

  return (
    <form
      data-testid="character-sheet-form"
      onSubmit={e => {
        e.preventDefault();
        if (!ready || busy) return;
        onSubmit?.({
          name: name.trim(),
          mode,
          base_model: baseModel.trim() || null,
          outer_model: outerModel.trim() || null,
          system_prompt: systemPrompt,
          persona: persona,
          tools_allowed: toolsAllowed.split(",").map(s => s.trim()).filter(Boolean),
          min_steps_for_native: Number(minSteps),
          max_loss_for_native: Number(maxLoss),
          gonal_assignment: { phi, psi, omega },
          private_gonal_spec_path: privateSpecPath.trim() || null,
        });
      }}
      className="space-y-4"
    >
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="agent name" testid="csf-name">
          <input
            data-testid="csf-name-input"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-bg-surface border border-white/10 px-2 py-1.5 font-mono text-sm text-white"
            placeholder="Ada-zfae-01"
          />
        </Field>
        <Field label="lattice mode" hint="The 5-mode lattice — controls who teaches and who answers." testid="csf-mode">
          <select
            data-testid="csf-mode-select"
            value={mode}
            onChange={e => setMode(e.target.value)}
            className="w-full bg-bg-surface border border-white/10 px-2 py-1.5 font-mono text-xs text-white"
          >
            {MODE_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </Field>

        {needsBase && (
          <Field label="base model (inner <model>)" hint={MODEL_HINT} testid="csf-base">
            <input
              data-testid="csf-base-input"
              value={baseModel}
              onChange={e => setBaseModel(e.target.value)}
              className="w-full bg-bg-surface border border-white/10 px-2 py-1.5 font-mono text-xs text-white"
              placeholder="openai/gpt-4o-mini"
            />
          </Field>
        )}
        {needsOuter && (
          <Field label="outer model" hint="critic / second teacher" testid="csf-outer">
            <input
              data-testid="csf-outer-input"
              value={outerModel}
              onChange={e => setOuterModel(e.target.value)}
              className="w-full bg-bg-surface border border-white/10 px-2 py-1.5 font-mono text-xs text-white"
              placeholder="anthropic/claude-3-5-sonnet"
            />
          </Field>
        )}
      </div>

      <Field label="system prompt" testid="csf-system">
        <textarea
          data-testid="csf-system-textarea"
          value={systemPrompt}
          onChange={e => setSystemPrompt(e.target.value)}
          rows={3}
          className="w-full bg-bg-surface border border-white/10 px-2 py-1.5 font-mono text-xs text-white"
        />
      </Field>

      <Field label="persona" testid="csf-persona">
        <textarea
          data-testid="csf-persona-textarea"
          value={persona}
          onChange={e => setPersona(e.target.value)}
          rows={2}
          className="w-full bg-bg-surface border border-white/10 px-2 py-1.5 font-mono text-xs text-white"
        />
      </Field>

      <div className="grid md:grid-cols-3 gap-4">
        <Field label="tools allowed (comma sep)" hint="provider/model whitelist" testid="csf-tools">
          <input
            data-testid="csf-tools-input"
            value={toolsAllowed}
            onChange={e => setToolsAllowed(e.target.value)}
            className="w-full bg-bg-surface border border-white/10 px-2 py-1.5 font-mono text-xs text-white"
            placeholder="openai/gpt-4o-mini, anthropic/claude-3-5-sonnet"
          />
        </Field>
        <Field label="min steps for native" testid="csf-minsteps">
          <input
            data-testid="csf-minsteps-input" type="number" min={1}
            value={minSteps} onChange={e => setMinSteps(e.target.value)}
            className="w-full bg-bg-surface border border-white/10 px-2 py-1.5 font-mono text-xs text-white"
          />
        </Field>
        <Field label="max loss for native" testid="csf-maxloss">
          <input
            data-testid="csf-maxloss-input" type="number" step="0.01" min={0} max={1}
            value={maxLoss} onChange={e => setMaxLoss(e.target.value)}
            className="w-full bg-bg-surface border border-white/10 px-2 py-1.5 font-mono text-xs text-white"
          />
        </Field>
      </div>

      <div className="border border-white/10 p-3 space-y-2">
        <div className="text-[0.6rem] font-mono uppercase tracking-ultra text-neutral-400">three-core gonal binding</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { core: "Φ phi (default)", v: phi, set: setPhi, tid: "csf-gonal-phi" },
            { core: "Ψ psi (mirror)",  v: psi, set: setPsi, tid: "csf-gonal-psi" },
            { core: "Ω omega (private)", v: omega, set: setOmega, tid: "csf-gonal-omega" },
          ].map(({ core, v, set, tid }) => (
            <label key={core} className="block text-[0.7rem] font-mono">
              <span className="block text-neutral-500 mb-1">{core}</span>
              <select
                data-testid={tid}
                value={v} onChange={e => set(e.target.value)}
                className="w-full bg-bg-surface border border-white/10 px-2 py-1 text-xs text-white"
              >
                <option value="default">default</option>
                <option value="mirror">mirror</option>
                <option value="private">private</option>
              </select>
            </label>
          ))}
        </div>
        <Field label="private gonal spec path (optional)" testid="csf-private-spec">
          <input
            data-testid="csf-private-spec-input"
            value={privateSpecPath}
            onChange={e => setPrivateSpecPath(e.target.value)}
            className="w-full bg-bg-surface border border-white/10 px-2 py-1.5 font-mono text-xs text-white"
            placeholder="/app/storage/private_gonals/agent-x.yaml"
          />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} data-testid="csf-cancel-btn"
                  className="px-3 py-1.5 border border-white/10 font-mono text-xs uppercase tracking-wider text-neutral-300 hover:bg-bg-surface">
            cancel
          </button>
        )}
        <button type="submit" data-testid="csf-submit-btn" disabled={!ready || busy}
                className="px-3 py-1.5 border border-accent-cyan/40 text-accent-cyan font-mono text-xs uppercase tracking-wider hover:bg-accent-cyan/10 disabled:opacity-40">
          {busy ? "saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
