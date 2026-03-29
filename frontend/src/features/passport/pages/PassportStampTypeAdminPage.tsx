import { Layers3, Link2, Network, RefreshCw, ShieldCheck, ShieldX, Tags } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CHRONICLE_STAMP_ADDRESS } from "../../../config/passport";
import CidComposer from "../components/CidComposer";
import PassportShell from "../components/PassportShell";
import { usePassportStampTypeAdmin } from "../hooks/usePassportStampTypeAdmin";
import { usePassportLocale } from "../i18n";

type PassportStampTypeAdminPageProps = {
  connectedAddress: string;
  currentChainName: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
  targetChainName: string;
};

export default function PassportStampTypeAdminPage(props: PassportStampTypeAdminPageProps) {
  const {
    connectedAddress,
    currentChainName,
    ensureSupportedChain,
    hasCorrectChain,
    isConnected,
    targetChainName,
  } = props;
  const { t } = usePassportLocale();
  const [stampTypeId, setStampTypeId] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [schemaCID, setSchemaCID] = useState("");
  const [active, setActive] = useState(true);
  const [singleton, setSingleton] = useState(false);
  const {
    availableStampTypes,
    canManageStampType,
    chronicleOwner,
    currentConfig,
    error,
    isConfigured,
    isLoadingAvailableStampTypes,
    isLoadingChronicleOwner,
    isLoadingStampType,
    isSubmitting,
    isStampTypeAdmin,
    loadAvailableStampTypes,
    loadStampTypeContext,
    statusMessage,
    submitConfigureStampType,
  } = usePassportStampTypeAdmin({
    address: connectedAddress,
    ensureSupportedChain,
    hasCorrectChain,
    isConnected,
  });

  const parsedStampTypeId = useMemo(
    () => (/^\d+$/.test(stampTypeId.trim()) ? BigInt(stampTypeId.trim()) : null),
    [stampTypeId],
  );
  const trimmedSchemaCID = schemaCID.trim();
  const configuredTypesEmptyState = useMemo(() => {
    if (isLoadingAvailableStampTypes || availableStampTypes.length > 0) {
      return "";
    }

    if (!isConfigured) {
      return t(
        "当前前端还没有完整配置 Passport 合约地址，因此无法读取 ChronicleStamp 上已经存在的印章类型。",
        "The frontend does not have a complete Passport contract configuration yet, so it cannot read configured stamp types from ChronicleStamp.",
      );
    }

    if (isConnected && !hasCorrectChain) {
      return t(
        `当前钱包网络是 ${currentChainName}，目标网络是 ${targetChainName}。请先切换到目标网络，再查看当前链上的印章类型列表。`,
        `Your wallet is connected to ${currentChainName}, but the target network is ${targetChainName}. Switch networks before checking the configured stamp type list.`,
      );
    }

    return t(
      "当前链上还没有任何 StampTypeConfigured 记录。先在左侧填好一个类型并提交，成功后这里会自动出现列表。",
      "No StampTypeConfigured records were found on the current chain. Configure a stamp type from the form on the left, and it will then appear here automatically.",
    );
  }, [
    availableStampTypes.length,
    currentChainName,
    hasCorrectChain,
    isConfigured,
    isConnected,
    isLoadingAvailableStampTypes,
    t,
    targetChainName,
  ]);

  useEffect(() => {
    if (parsedStampTypeId === null) {
      return;
    }

    void loadStampTypeContext(parsedStampTypeId);
  }, [loadStampTypeContext, parsedStampTypeId]);

  useEffect(() => {
    if (!currentConfig) {
      return;
    }

    setCode(currentConfig.code);
    setName(currentConfig.name);
    setSchemaCID(currentConfig.schemaCID);
    setActive(currentConfig.active);
    setSingleton(currentConfig.singleton);
  }, [currentConfig]);

  const isChronicleOwner =
    Boolean(connectedAddress) &&
    Boolean(chronicleOwner) &&
    connectedAddress.toLowerCase() === chronicleOwner.toLowerCase();

  return (
    <PassportShell currentKey="stamp-types">
      <div className="space-y-8">
        <section className="rounded-[2.5rem] bg-[linear-gradient(135deg,_rgba(240,249,255,1),_rgba(255,255,255,1)_45%,_rgba(255,247,237,0.92))] p-10 shadow-[0_24px_60px_-28px_rgba(14,165,233,0.22)]">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-sky-600 shadow-sm">
                {t("印章类型管理", "Stamp Type Admin")}
              </span>
              <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-[-0.04em] text-slate-950">
                  {t("配置履历印章类型。", "Configure chronicle stamp types.")}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-600">
                  {t(
                    "这个页面调用 `ChronicleStamp.configureStampType(...)`，面向 ChronicleStamp owner 或印章类型管理员。",
                    "This page calls `ChronicleStamp.configureStampType(...)` and is intended for the ChronicleStamp owner or stamp type admins.",
                  )}
                </p>
              </div>
            </div>

            <div className="glass-card space-y-4 p-6">
              <div className="space-y-1">
                <p className="meta-label">{t("权限快照", "Authority Snapshot")}</p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {t("Chronicle 所有权", "Chronicle Ownership")}
                </h2>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">ChronicleStamp</p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {CHRONICLE_STAMP_ADDRESS || t("未配置", "Not configured")}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">{t("目标网络 / 当前网络", "Target / Current Network")}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {targetChainName} / {isConnected ? currentChainName : t("未连接", "Disconnected")}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">Owner</p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {isLoadingChronicleOwner ? t("加载中...", "Loading...") : chronicleOwner || t("不可用", "Unavailable")}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] ${
                    canManageStampType
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {canManageStampType ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
                  {isChronicleOwner
                    ? t("Chronicle 所有者", "Chronicle Owner")
                    : isStampTypeAdmin
                      ? t("印章类型管理员", "Stamp Type Admin")
                      : t("需要权限", "Permission Required")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="space-y-2">
              <p className="meta-label">{t("印章类型配置", "Stamp Type Config")}</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {t("配置印章类型", "Configure Stamp Type")}
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="meta-label" htmlFor="stamp-type-id">
                    {t("印章类型 ID", "Stamp Type ID")}
                  </label>
                  <button
                    type="button"
                    onClick={() => void loadAvailableStampTypes()}
                    disabled={isLoadingAvailableStampTypes}
                    className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 transition-colors hover:text-sky-600 disabled:opacity-50"
                  >
                    {isLoadingAvailableStampTypes
                      ? t("加载中...", "Loading...")
                      : t("刷新列表", "Refresh List")}
                  </button>
                </div>
                <div className="mt-3 flex gap-3">
                  <input
                    id="stamp-type-id"
                    type="text"
                    value={stampTypeId}
                    onChange={(event) => setStampTypeId(event.target.value)}
                    placeholder="1"
                    className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                  <button
                    onClick={() => {
                      if (parsedStampTypeId === null) {
                        return;
                      }

                      void loadStampTypeContext(parsedStampTypeId);
                    }}
                    disabled={parsedStampTypeId === null || isLoadingStampType}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:border-sky-200 hover:text-sky-600 disabled:opacity-50"
                  >
                    <RefreshCw size={16} className={isLoadingStampType ? "animate-spin" : ""} />
                    {t("加载", "Load")}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <label className="meta-label" htmlFor="stamp-type-code">
                    Code
                  </label>
                  <input
                    id="stamp-type-code"
                    type="text"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="AUTHENTIC"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <label className="meta-label" htmlFor="stamp-type-name">
                    {t("名称", "Name")}
                  </label>
                  <input
                    id="stamp-type-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t("官方认证", "Official Authentication")}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="meta-label">{t("Schema 配置", "Schema Config")}</p>
                    <h3 className="mt-2 text-lg font-black tracking-tight text-slate-900">
                      {t("绑定 Schema CID", "Bind Schema CID")}
                    </h3>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-600 shadow-sm">
                    StampTypeConfig.schemaCID
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                  {t(
                    "这里填写该印章类型对应的数据结构说明地址，推荐使用 `ipfs://...` 或 `ar://...`。链上只保存这个 CID，具体 schema 文件仍放在链下存储。",
                    "Enter the data-schema reference for this stamp type here, typically `ipfs://...` or `ar://...`. Only this CID is stored on-chain while the schema document stays off-chain.",
                  )}
                </p>
                <textarea
                  id="stamp-type-schema"
                  value={schemaCID}
                  onChange={(event) => setSchemaCID(event.target.value)}
                  placeholder="ipfs://bafy.../stamp-schema.json"
                  rows={3}
                  className="mt-4 w-full resize-y rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSchemaCID(currentConfig?.schemaCID || "")}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-700 transition-all hover:border-sky-200 hover:text-sky-600"
                  >
                    <RefreshCw size={14} />
                    {t("使用已加载值", "Use Loaded Value")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchemaCID("")}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-700 transition-all hover:border-slate-300 hover:text-slate-900"
                  >
                    {t("清空", "Clear")}
                  </button>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">{t("当前待提交的 Schema CID", "Schema CID To Submit")}</p>
                  <div className="mt-3 flex items-start gap-3">
                    <div className="mt-0.5 text-sky-600">
                      <Link2 size={16} />
                    </div>
                    <p className="min-w-0 break-all font-mono text-sm text-slate-700">
                      {trimmedSchemaCID || t("未填写，提交后会写入空字符串。", "Empty. Submitting now will write an empty string.")}
                    </p>
                  </div>
                </div>
                <CidComposer
                  accent="sky"
                  defaultText={`{\n  "$schema": "https://json-schema.org/draft/2020-12/schema",\n  "title": "",\n  "type": "object",\n  "properties": {},\n  "required": []\n}`}
                  description={t(
                    "为印章类型的数据结构说明生成 CID，推荐直接上传 JSON Schema 文档。",
                    "Generate the CID for the stamp type schema definition. A JSON Schema document is recommended here.",
                  )}
                  fieldKey="stamp_type_schema"
                  suggestedFileName="stamp-type-schema.json"
                  value={schemaCID}
                  onChange={setSchemaCID}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(event) => setActive(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {t("启用", "Active")}
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={singleton}
                    onChange={(event) => setSingleton(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {t("单例", "Singleton")}
                </label>
              </div>

              <button
                onClick={() => {
                  if (parsedStampTypeId === null) {
                    return;
                  }

                  void submitConfigureStampType(parsedStampTypeId, {
                    active,
                    code,
                    name,
                    schemaCID,
                    singleton,
                  });
                }}
                disabled={parsedStampTypeId === null || !canManageStampType || isSubmitting}
                className="mt-2 inline-flex items-center justify-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-sky-700 transition-all hover:bg-sky-100 disabled:opacity-50"
              >
                <Layers3 size={18} />
                {isSubmitting ? t("提交中...", "Submitting...") : t("配置印章类型", "Configure Stamp Type")}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="meta-label">{t("链上列表", "On-chain List")}</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    {t("已配置印章类型", "Configured Stamp Types")}
                  </h2>
                </div>
                <button
                  onClick={() => void loadAvailableStampTypes()}
                  disabled={isLoadingAvailableStampTypes}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:border-sky-200 hover:text-sky-600 disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={isLoadingAvailableStampTypes ? "animate-spin" : ""}
                  />
                  {t("刷新", "Refresh")}
                </button>
              </div>
              <div className="mt-6 space-y-3">
                {availableStampTypes.length > 0 ? (
                  availableStampTypes.map((typeOption) => {
                    const isSelected = stampTypeId.trim() === typeOption.stampTypeId.toString();

                    return (
                      <button
                        key={typeOption.stampTypeId.toString()}
                        onClick={() => setStampTypeId(typeOption.stampTypeId.toString())}
                        className={`w-full rounded-2xl border px-5 py-4 text-left transition-all ${
                          isSelected
                            ? "border-sky-200 bg-sky-50"
                            : "border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-black tracking-tight text-slate-900">
                              {`#${typeOption.stampTypeId.toString()} · ${
                                typeOption.name || t("未命名", "Unnamed")
                              }`}
                            </p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                              {typeOption.code || "NO_CODE"}
                            </p>
                          </div>
                          <div className="text-right text-xs font-semibold text-slate-600">
                            <div>
                              {typeOption.active
                                ? t("启用", "Active")
                                : t("停用", "Inactive")}
                            </div>
                            <div className="mt-1">
                              {typeOption.singleton
                                ? t("单例", "Singleton")
                                : t("可重复", "Repeatable")}
                            </div>
                          </div>
                        </div>
                        {typeOption.schemaCID ? (
                          <p className="mt-3 break-all font-mono text-xs text-slate-500">
                            {typeOption.schemaCID}
                          </p>
                        ) : null}
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-800">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-amber-600">
                        <Network size={16} />
                      </div>
                      <p>{configuredTypesEmptyState}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
              <p className="meta-label">{t("当前配置", "Current Config")}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {t("已加载印章类型", "Loaded Stamp Type")}
              </h2>
              <div className="mt-6 space-y-4">
                {currentConfig ? (
                  <>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                      <p className="meta-label">{t("编码 / 名称", "Code / Name")}</p>
                      <p className="mt-2 font-semibold text-slate-900">
                        {currentConfig.code || "NO_CODE"} / {currentConfig.name || t("未命名", "Unnamed")}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                      <p className="meta-label">{t("状态", "State")}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {currentConfig.active ? t("启用", "Active") : t("停用", "Inactive")} /{" "}
                        {currentConfig.singleton ? t("单例", "Singleton") : t("可重复", "Repeatable")}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                      <p className="meta-label">Schema CID</p>
                      <p className="mt-2 break-all font-mono text-sm text-slate-700">
                        {currentConfig.schemaCID || t("未设置", "Not set")}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4 text-sm font-semibold text-slate-600">
                    {t("先加载一个印章类型 ID，再查看并修改当前配置。", "Load a stamp type ID to inspect the current config before updating it.")}
                  </div>
                )}
                {statusMessage ? (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-700">
                    {statusMessage}
                  </div>
                ) : null}
                {error ? (
                  <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
                    {error}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
              <p className="meta-label">{t("业务说明", "Operational Notes")}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {t("管理规则", "Management Rules")}
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-sky-50 px-5 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                    <Tags size={20} />
                  </div>
                  <p className="mt-4 font-black text-slate-900">{t("权限模型", "Permission Model")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {t(
                      "`ChronicleStamp.owner` 可以配置任意印章类型；授权的类型管理员只能管理自己负责的那一种类型。",
                      "`ChronicleStamp.owner` can configure any stamp type. Authorized stamp type admins can configure the specific type they manage.",
                    )}
                  </p>
                </div>
                {!isConfigured ? (
                  <div className="rounded-2xl border border-rose-100 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-700">
                    {t("前端环境中尚未配置 Passport 合约。", "Passport contracts are not configured in the frontend environment.")}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PassportShell>
  );
}
