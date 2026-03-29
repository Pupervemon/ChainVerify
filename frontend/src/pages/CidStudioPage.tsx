import { DatabaseZap, FileJson2, Files, Link2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import CidComposer from "../features/passport/components/CidComposer";
import PassportShell from "../features/passport/components/PassportShell";

type TemplatePreset = {
  accent: "sky" | "orange" | "emerald" | "rose";
  description: string;
  fieldKey: string;
  fileName: string;
  key: string;
  label: string;
  template: string;
};

const presets: TemplatePreset[] = [
  {
    accent: "emerald",
    description: "适合护照封面、说明、展示图等主元数据。",
    fieldKey: "global_passport_metadata",
    fileName: "passport-metadata.json",
    key: "passport",
    label: "护照元数据",
    template: `{
  "name": "",
  "description": "",
  "issuer": "",
  "image": "",
  "attributes": []
}`,
  },
  {
    accent: "emerald",
    description: "适合资产参数、序列号、附件和图片引用。",
    fieldKey: "global_asset_metadata",
    fileName: "asset-metadata.json",
    key: "asset",
    label: "资产元数据",
    template: `{
  "serialNumber": "",
  "category": "",
  "manufacturer": "",
  "attachments": []
}`,
  },
  {
    accent: "orange",
    description: "适合维修、认证、参展等印章业务详情。",
    fieldKey: "global_stamp_metadata",
    fileName: "stamp-metadata.json",
    key: "stamp",
    label: "印章详情",
    template: `{
  "summary": "",
  "details": "",
  "attachments": [],
  "operator": ""
}`,
  },
  {
    accent: "sky",
    description: "适合策略文档、机构规则、链下说明附件。",
    fieldKey: "global_policy_metadata",
    fileName: "issuer-policy.json",
    key: "policy",
    label: "策略文档",
    template: `{
  "summary": "",
  "rules": [],
  "references": [],
  "owner": ""
}`,
  },
  {
    accent: "sky",
    description: "适合直接上传 JSON Schema 作为类型 schema。",
    fieldKey: "global_schema_metadata",
    fileName: "stamp-type-schema.json",
    key: "schema",
    label: "Schema 文档",
    template: `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "",
  "type": "object",
  "properties": {},
  "required": []
}`,
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
      <div className="flex w-full flex-col gap-8 py-2">
        <section className="overflow-hidden rounded-[2.75rem] bg-[radial-gradient(circle_at_top_left,_rgba(224,242,254,0.95),_rgba(255,255,255,1)_40%,_rgba(240,253,250,0.95)_100%)] p-10 shadow-[0_28px_80px_-36px_rgba(14,165,233,0.3)]">
        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-sky-600 shadow-sm">
              CID Studio
            </span>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-5xl font-black tracking-[-0.04em] text-slate-950">
                在页面里直接生成 IPFS CID，不再手动跳出项目处理
              </h1>
              <p className="max-w-2xl text-base font-medium leading-relaxed text-slate-600">
                这里是全站通用的 CID 工作台。你可以上传文件，也可以把 JSON / 文本内容直接转成文件上传，成功后拿到
                `ipfs://...` 地址，用于护照、印章、策略、Schema 或其他链下元数据场景。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Upload Path
                </p>
                <p className="mt-1 font-semibold text-slate-800">`/api/v1/ipfs/upload`</p>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Use Cases
                </p>
                <p className="mt-1 font-semibold text-slate-800">Passport / Stamp / Policy / Schema</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] border border-slate-100 bg-white/90 p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <DatabaseZap size={22} />
              </div>
              <p className="mt-5 text-lg font-black text-slate-900">链下内容入口统一化</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                不再要求运营或机构手工去外部工具生成 CID，表单里直接完成。
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-100 bg-white/90 p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <FileJson2 size={22} />
              </div>
              <p className="mt-5 text-lg font-black text-slate-900">JSON 模板可直接起草</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                常见业务元数据和 schema 模板已经预置，直接修改即可上传。
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-100 bg-white/90 p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                <Files size={22} />
              </div>
              <p className="mt-5 text-lg font-black text-slate-900">文件与文本双模式</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                可以上传图片、PDF、JSON，也可以直接输入纯文本说明后生成 CID。
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-100 bg-white/90 p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <ShieldCheck size={22} />
              </div>
              <p className="mt-5 text-lg font-black text-slate-900">适合所有 `...CID` 字段</p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                后续新增任何 CID 字段，都可以直接复用这套能力，不必再重复造轮子。
              </p>
            </div>
          </div>
        </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
              Presets
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              选择一个常用模板
            </h2>
            <div className="mt-6 grid gap-3">
              {presets.map((preset) => {
                const isActive = preset.key === activePreset.key;

                return (
                  <button
                    key={preset.key}
                    onClick={() => setActivePresetKey(preset.key)}
                    className={`rounded-2xl border px-5 py-4 text-left transition-all ${
                      isActive
                        ? "border-sky-200 bg-sky-50"
                        : "border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-white"
                    }`}
                  >
                    <p className="text-sm font-black tracking-tight text-slate-900">
                      {preset.label}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">
                      {preset.description}
                    </p>
                    <p className="mt-3 font-mono text-xs text-slate-500">{preset.fileName}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
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
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  CID Value
                </p>
                <p className="mt-2 break-all font-mono text-sm text-slate-700">
                  {cidValue || "尚未生成"}
                </p>
              </div>
              {cidValue ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Usage
                  </p>
                  <div className="mt-3 space-y-2 text-sm font-medium text-slate-600">
                    <p>可以直接粘贴到任意 `metadataCID`、`schemaCID`、`policyCID`、`reasonCID` 字段。</p>
                    <p>如果你的业务文档已经写好，也可以直接切到“上传文件”模式，把 JSON / PDF / 图片直接传上去。</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
                Studio
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                生成并回填 CID
              </h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              ipfs://
            </div>
          </div>

          <CidComposer
            accent={activePreset.accent}
            defaultText={activePreset.template}
            description={activePreset.description}
            fieldKey={activePreset.fieldKey}
            suggestedFileName={activePreset.fileName}
            value={cidValue}
            onChange={setCidValue}
          />

          <div className="mt-6 rounded-[2rem] bg-slate-50 px-6 py-6">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              Notes
            </p>
            <div className="mt-4 space-y-3 text-sm font-medium leading-relaxed text-slate-600">
              <p>这个页面依赖后端的 `PINATA_JWT` 配置。如果后端未配置，上传会直接报错。</p>
              <p>当前返回值会自动带上 `ipfs://` 前缀，便于直接粘贴到合约交互表单里。</p>
              <p className="inline-flex items-center gap-2 font-semibold text-slate-700">
                <Link2 size={14} />
                网关预览地址会在生成后自动显示在组件内。
              </p>
            </div>
          </div>
        </div>
        </section>
      </div>
    </PassportShell>
  );
}
