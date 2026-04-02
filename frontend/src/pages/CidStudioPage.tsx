import { useMemo, useState } from "react";

import CidComposer, {
  type CidComposerFormField,
} from "../features/passport/components/CidComposer";
import PassportShell from "../features/passport/components/PassportShell";

type TemplatePreset = {
  accent: "sky" | "orange" | "emerald" | "rose";
  defaultPayload: Record<string, unknown>;
  description: string;
  fieldKey: string;
  fileName: string;
  formFields: CidComposerFormField[];
  key: string;
  label: string;
  targetLabel: string;
  usage: string;
};

const presets: TemplatePreset[] = [
  {
    accent: "emerald",
    defaultPayload: {
      name: "",
      description: "",
      issuer: "",
      image: "",
      attributes: [],
    },
    description: "适合护照封面、简介、发行方信息和展示图片。",
    fieldKey: "global_passport_metadata",
    fileName: "passport-metadata.json",
    formFields: [
      { key: "name", label: "名称", placeholder: "例如：Digital Product Passport" },
      {
        key: "description",
        label: "描述",
        placeholder: "简要说明这个 passport 的用途和展示信息",
        type: "textarea",
      },
      { key: "issuer", label: "发行方", placeholder: "例如：DeProof Lab" },
      { key: "image", label: "封面图链接", placeholder: "https://... 或 ipfs://..." },
      {
        helper: "每行一个属性，例如：material: recycled aluminum",
        key: "attributes",
        label: "属性列表",
        placeholder: "material: recycled aluminum\norigin: Shenzhen",
        type: "list",
      },
    ],
    key: "passport",
    label: "护照元数据",
    targetLabel: "passportMetadataCID",
    usage: "通常用于 passportMetadataCID。",
  },
  {
    accent: "emerald",
    defaultPayload: {
      serialNumber: "",
      category: "",
      manufacturer: "",
      attachments: [],
    },
    description: "适合设备参数、序列号、制造商和附件引用。",
    fieldKey: "global_asset_metadata",
    fileName: "asset-metadata.json",
    formFields: [
      { key: "serialNumber", label: "序列号", placeholder: "例如：SN-2026-0001" },
      { key: "category", label: "类别", placeholder: "例如：Battery Pack" },
      { key: "manufacturer", label: "制造商", placeholder: "例如：ACME Manufacturing" },
      {
        helper: "每行一个附件链接，可填 PDF、图片、IPFS 地址。",
        key: "attachments",
        label: "附件列表",
        placeholder: "ipfs://...\nhttps://...",
        type: "list",
      },
    ],
    key: "asset",
    label: "资产元数据",
    targetLabel: "assetMetadataCID",
    usage: "通常用于 assetMetadataCID。",
  },
  {
    accent: "orange",
    defaultPayload: {
      summary: "",
      details: "",
      attachments: [],
      operator: "",
    },
    description: "适合维修、认证、巡检等 stamp 业务详情。",
    fieldKey: "global_stamp_metadata",
    fileName: "stamp-metadata.json",
    formFields: [
      { key: "summary", label: "摘要", placeholder: "一句话描述这次记录" },
      {
        key: "details",
        label: "详细说明",
        placeholder: "补充过程、结果、证明材料等",
        type: "textarea",
      },
      { key: "operator", label: "操作方", placeholder: "例如：Inspector Team A" },
      {
        helper: "每行一个附件地址或参考链接。",
        key: "attachments",
        label: "附件列表",
        placeholder: "ipfs://...\nhttps://...",
        type: "list",
      },
    ],
    key: "stamp",
    label: "Stamp 详情",
    targetLabel: "metadataCID",
    usage: "通常用于 metadataCID 或 issuance/revocation 场景。",
  },
  {
    accent: "sky",
    defaultPayload: {
      summary: "",
      rules: [],
      references: [],
      owner: "",
    },
    description: "适合机构规则、发放策略和补充政策说明。",
    fieldKey: "global_policy_metadata",
    fileName: "issuer-policy.json",
    formFields: [
      { key: "summary", label: "策略摘要", placeholder: "一句话概括策略内容" },
      {
        helper: "每行一条规则，例如：passportType must be vehicle",
        key: "rules",
        label: "规则列表",
        placeholder: "passportType must be vehicle\nissuer must be verified",
        type: "list",
      },
      {
        helper: "每行一个参考文件或链接。",
        key: "references",
        label: "参考资料",
        placeholder: "ipfs://...\nhttps://...",
        type: "list",
      },
      { key: "owner", label: "负责人", placeholder: "例如：Policy Committee" },
    ],
    key: "policy",
    label: "策略文档",
    targetLabel: "policyCID",
    usage: "通常用于 policyCID。",
  },
  {
    accent: "sky",
    defaultPayload: {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      title: "",
      type: "object",
      properties: {},
      required: [],
    },
    description: "适合定义 stamp type schema 或其他结构校验规则。",
    fieldKey: "global_schema_metadata",
    fileName: "stamp-type-schema.json",
    formFields: [
      { key: "$schema", label: "$schema", placeholder: "https://json-schema.org/..." },
      { key: "title", label: "Schema 标题", placeholder: "例如：Inspection Stamp Schema" },
      { key: "type", label: "根类型", placeholder: "object" },
      {
        key: "properties",
        label: "properties",
        placeholder: "建议切到 JSON 模式编辑完整 properties",
        type: "textarea",
      },
      {
        helper: "每行一个 required 字段名。",
        key: "required",
        label: "required",
        placeholder: "fieldA\nfieldB",
        type: "list",
      },
    ],
    key: "schema",
    label: "Schema 文档",
    targetLabel: "schemaCID",
    usage: "简单字段可用表单，复杂 schema 建议切到 JSON 模式。",
  },
];

export default function CidStudioPage() {
  const [activePresetKey, setActivePresetKey] = useState(presets[0].key);
  const [cidValue, setCidValue] = useState("");

  const activePreset = useMemo(
    () => presets.find((preset) => preset.key === activePresetKey) ?? presets[0],
    [activePresetKey],
  );
  const hasCidValue = cidValue.trim().length > 0;
  const presetCountLabel = presets.length.toString().padStart(2, "0");
  const outputStatusLabel = hasCidValue ? "已就绪" : "待生成";
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
                  按模板组织内容，再生成可直接复用的 CID。
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  这个页面把 Passport 常见的 metadata、policy 和 schema 场景整理成结构化模板，
                  生成后直接回填 `ipfs://...` 值。
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
                    表单、JSON、文件上传三种生成方式都可用。
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
                    {hasCidValue ? "当前值已经可以直接粘贴到业务表单。" : "生成后会自动回填到当前字段值。"}
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
                  Compose CID
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  左侧选模板并确认输出目标，右侧直接填写内容或切换到 JSON / 文件模式生成。
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="panel-soft h-auto min-h-0 justify-start p-5">
                  <p className="meta-label">Preset Library</p>
                  <div className="mt-4 grid gap-3">
                    {presets.map((preset) => {
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
                                {preset.description}
                              </p>
                            </div>
                            {isActive ? (
                              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700">
                                当前
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-3 space-y-1">
                            <p className="font-mono text-xs text-slate-500">{preset.fileName}</p>
                            <p className="font-mono text-xs text-slate-500">{preset.targetLabel}</p>
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
                        File Name
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
                        {cidValue || "尚未生成"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

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
            </div>
          </div>
        </section>
      </div>
    </PassportShell>
  );
}
