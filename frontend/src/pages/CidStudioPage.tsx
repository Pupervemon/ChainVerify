import { DatabaseZap, Files, Link2, ShieldCheck, Sparkles } from "lucide-react";
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

  return (
    <PassportShell currentKey="cid-studio">
      <div className="flex w-full flex-col gap-6 py-2">
        <section className="overflow-hidden rounded-[2.5rem] bg-[radial-gradient(circle_at_top_left,_rgba(224,242,254,0.96),_rgba(255,255,255,1)_42%,_rgba(236,253,245,0.92)_100%)] p-8 shadow-[0_24px_72px_-40px_rgba(14,165,233,0.35)] lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-5">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-sky-600 shadow-sm">
                CID Studio
              </span>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-4xl font-black tracking-[-0.04em] text-slate-950 lg:text-5xl">
                  用表单创建 IPFS 内容，不再让用户从一整段 JSON 开始。
                </h1>
                <p className="max-w-2xl text-base font-medium leading-relaxed text-slate-600">
                  先选模板，再按字段填写内容。普通用户默认使用表单模式，高级用户可以随时切到 JSON
                  或文件上传模式，最后直接拿到 `ipfs://...` 地址用于各类 CID 字段。
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Main Flow
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">选模板 / 填内容 / 生成 CID</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Output
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">`ipfs://...` + Gateway 预览</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] border border-slate-100 bg-white/90 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                  <Sparkles size={22} />
                </div>
                <p className="mt-5 text-lg font-black text-slate-900">表单优先</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                  用业务字段代替原始 JSON，减少输入门槛和格式错误。
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-100 bg-white/90 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <DatabaseZap size={22} />
                </div>
                <p className="mt-5 text-lg font-black text-slate-900">自动生成</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                  表单内容会自动整理成 JSON，再上传到 IPFS 并回填 CID。
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-100 bg-white/90 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Files size={22} />
                </div>
                <p className="mt-5 text-lg font-black text-slate-900">保留高级模式</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                  需要时可以切回 JSON 编辑，或直接上传图片、PDF、现成文件。
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-100 bg-white/90 p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <ShieldCheck size={22} />
                </div>
                <p className="mt-5 text-lg font-black text-slate-900">适配所有 CID 字段</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                  可复用于 metadataCID、schemaCID、policyCID、reasonCID 等场景。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Presets
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                先选一个适合的模板
              </h2>
              <div className="mt-6 grid gap-3">
                {presets.map((preset) => {
                  const isActive = preset.key === activePreset.key;

                  return (
                    <button
                      key={preset.key}
                      onClick={() => setActivePresetKey(preset.key)}
                      className={`rounded-[1.5rem] border px-5 py-4 text-left transition-all ${
                        isActive
                          ? "border-sky-200 bg-sky-50 shadow-[0_12px_24px_-20px_rgba(14,165,233,0.6)]"
                          : "border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black tracking-tight text-slate-900">{preset.label}</p>
                          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                            {preset.description}
                          </p>
                        </div>
                        {isActive ? (
                          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-sky-600">
                            当前
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-3 font-mono text-xs text-slate-500">{preset.fileName}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Current
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                当前输出
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Active Preset
                  </p>
                  <p className="mt-2 text-lg font-black text-slate-900">{activePreset.label}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">{activePreset.usage}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    CID Value
                  </p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {cidValue || "尚未生成"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    推荐方式
                  </p>
                  <div className="mt-3 space-y-2 text-sm font-medium leading-relaxed text-slate-600">
                    <p>普通用户优先用表单模式，字段更清晰，也更不容易输错。</p>
                    <p>复杂 schema 或已有现成 metadata 时，再切换到 JSON 或文件模式。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-100 bg-white p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                  Studio
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  填好内容后直接生成 CID
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-slate-600">
                  当前模板会先展示结构化表单。如果你已经准备好原始 JSON，或者想上传一个现成文件，也可以直接切换模式。
                </p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                ipfs://
              </div>
            </div>

            <CidComposer
              accent={activePreset.accent}
              defaultPayload={activePreset.defaultPayload}
              description={activePreset.description}
              fieldKey={activePreset.fieldKey}
              formFields={activePreset.formFields}
              suggestedFileName={activePreset.fileName}
              value={cidValue}
              onChange={setCidValue}
            />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.5rem] bg-slate-50 px-5 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  1. 填写
                </p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                  用表单整理 metadata，避免先和 JSON 结构搏斗。
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 px-5 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  2. 生成
                </p>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                  组件会自动打包文件并上传到 `/api/v1/ipfs/upload`。
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 px-5 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  3. 使用
                </p>
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Link2 size={14} />
                  生成后可直接粘贴到任何需要 CID 的表单字段中。
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PassportShell>
  );
}
