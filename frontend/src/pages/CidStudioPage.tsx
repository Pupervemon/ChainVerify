import { CheckCircle2, FileJson2, Library, Link2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import CidComposer from "../features/passport/components/CidComposer";
import PassportShell from "../features/passport/components/PassportShell";
import { usePassportLocale } from "../features/passport/i18n";
import { CID_PRESETS, type CidPresetKey } from "../features/passport/utils/cidPresets";

export default function CidStudioPage() {
  const { t } = usePassportLocale();
  const [activePresetKey, setActivePresetKey] = useState<CidPresetKey>(CID_PRESETS[0].key);
  const [cidValue, setCidValue] = useState("");

  const activePreset = useMemo(
    () => CID_PRESETS.find((preset) => preset.key === activePresetKey) ?? CID_PRESETS[0],
    [activePresetKey],
  );
  const hasCidValue = cidValue.trim().length > 0;
  const presetCountLabel = CID_PRESETS.length.toString().padStart(2, "0");
  const outputStatusLabel = hasCidValue
    ? t("Ready", "Ready")
    : t("Pending", "Pending");
  const outputStatusToneClass = hasCidValue ? "text-emerald-700" : "text-slate-500";

  return (
    <PassportShell currentKey="cid-studio">
      <div className="passport-dashboard-body">
        <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
          <div className="passport-dashboard-primary__grid relative">
            <div className="passport-dashboard-primary__content space-y-5">
              <span className="passport-dashboard-primary__header">CID Studio</span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                  {t(
                    "Prepare reusable CID payloads before passport writes.",
                    "Prepare reusable CID payloads before passport writes.",
                  )}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "Choose a preset, generate the payload, and reuse the resulting CID in create, issue, revoke, or policy flows.",
                    "Choose a preset, generate the payload, and reuse the resulting CID in create, issue, revoke, or policy flows.",
                  )}
                </p>
              </div>

              <div className="passport-dashboard-stats-grid grid gap-3">
                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">Active Preset</p>
                    <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-slate-900">
                      {activePreset.label}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {activePreset.description}
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">Target Field</p>
                    <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900">
                      {activePreset.targetLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {activePreset.usage}
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">Templates</p>
                    <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-cyan-700">
                      {presetCountLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {t(
                      "Passport, asset, stamp, revocation, policy, and schema presets share one library.",
                      "Passport, asset, stamp, revocation, policy, and schema presets share one library.",
                    )}
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">Output</p>
                    <p
                      className={`passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight ${outputStatusToneClass}`}
                    >
                      {outputStatusLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {hasCidValue
                      ? t(
                          "The current CID is ready to paste into the next write form.",
                          "The current CID is ready to paste into the next write form.",
                        )
                      : t(
                          "Generate a CID here before moving into the next write form.",
                          "Generate a CID here before moving into the next write form.",
                        )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="passport-dashboard-secondary space-y-6">
          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("Compose CID", "Compose CID")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "Select a preset on the left and generate the payload on the right.",
                    "Select a preset on the left and generate the payload on the right.",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="panel-soft h-auto min-h-0 justify-start p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="meta-label">Preset Library</p>
                    <span className="inline-flex min-w-12 items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-700">
                      {presetCountLabel}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {CID_PRESETS.map((preset) => {
                      const isActive = preset.key === activePreset.key;

                      return (
                        <button
                          key={preset.key}
                          type="button"
                          onClick={() => setActivePresetKey(preset.key)}
                          className={`w-full rounded-xl border px-4 py-4 text-left transition-all ${
                            isActive
                              ? "border-slate-900 bg-slate-100"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-black tracking-tight text-slate-900">
                                {preset.label}
                              </p>
                              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                                {preset.targetLabel}
                              </p>
                            </div>
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700">
                                <CheckCircle2 size={12} />
                                Active
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="panel-soft h-auto min-h-0 justify-start p-5">
                  <p className="meta-label">Current Output</p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Target Field
                      </p>
                      <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900">
                        {activePreset.targetLabel}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        Suggested File
                      </p>
                      <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900">
                        {activePreset.fileName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                        CID Value
                      </p>
                      <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-700">
                        {cidValue || t("No CID generated yet.", "No CID generated yet.")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <CidComposer
                  accent={activePreset.accent}
                  defaultPayload={activePreset.defaultPayload}
                  fieldKey={activePreset.fieldKey}
                  framed={false}
                  formFields={activePreset.formFields}
                  suggestedFileName={activePreset.fileName}
                  value={cidValue}
                  onChange={setCidValue}
                />

                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="panel-soft h-auto min-h-0 justify-start p-5">
                    <p className="meta-label">Preset</p>
                    <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Library size={14} />
                      {activePreset.label}
                    </p>
                  </div>
                  <div className="panel-soft h-auto min-h-0 justify-start p-5">
                    <p className="meta-label">Use Case</p>
                    <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Sparkles size={14} />
                      {activePreset.usage}
                    </p>
                  </div>
                  <div className="panel-soft h-auto min-h-0 justify-start p-5">
                    <p className="meta-label">Current Field</p>
                    <p className="mt-3 inline-flex items-center gap-2 break-all text-sm font-semibold text-slate-700">
                      <Link2 size={14} />
                      {activePreset.fieldKey}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PassportShell>
  );
}
