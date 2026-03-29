import { CalendarDays, Link2, Network, PenSquare, ShieldCheck, ShieldX, Tags } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { CHRONICLE_STAMP_ADDRESS } from "../../../config/passport";
import CidComposer from "../components/CidComposer";
import PassportShell from "../components/PassportShell";
import { usePassportIssueStamp } from "../hooks/usePassportIssueStamp";
import { usePassportLocale } from "../i18n";

type PassportIssueStampPageProps = {
  connectedAddress: string;
  currentChainName: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
  targetChainName: string;
};

const toUnixSeconds = (value: string) => {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : Math.floor(timestamp / 1000);
};

export default function PassportIssueStampPage(props: PassportIssueStampPageProps) {
  const {
    connectedAddress,
    currentChainName,
    ensureSupportedChain,
    hasCorrectChain,
    isConnected,
    targetChainName,
  } = props;
  const { t } = usePassportLocale();
  const [searchParams] = useSearchParams();
  const [passportId, setPassportId] = useState(searchParams.get("passportId") || "");
  const [stampTypeId, setStampTypeId] = useState(searchParams.get("stampTypeId") || "");
  const [metadataCID, setMetadataCID] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [supersedesStampId, setSupersedesStampId] = useState("");
  const {
    availableStampTypes,
    canIssue,
    error,
    isConfigured,
    isLoadingAvailableStampTypes,
    isLoadingPermission,
    isSubmitting,
    issuedStampId,
    latestEffectiveStampId,
    loadAvailableStampTypes,
    loadPermission,
    stampType,
    statusMessage,
    submitIssueStamp,
  } = usePassportIssueStamp({
    address: connectedAddress,
    ensureSupportedChain,
    hasCorrectChain,
    isConnected,
  });

  const parsedPassportId = useMemo(
    () => (/^\d+$/.test(passportId.trim()) ? BigInt(passportId.trim()) : null),
    [passportId],
  );
  const parsedStampTypeId = useMemo(
    () => (/^\d+$/.test(stampTypeId.trim()) ? BigInt(stampTypeId.trim()) : null),
    [stampTypeId],
  );
  const parsedSupersedesStampId = useMemo(
    () => (/^\d+$/.test(supersedesStampId.trim()) ? BigInt(supersedesStampId.trim()) : 0n),
    [supersedesStampId],
  );
  const configuredTypeEmptyState = useMemo(() => {
    if (isLoadingAvailableStampTypes || availableStampTypes.length > 0) {
      return "";
    }

    if (!isConfigured) {
      return t(
        "当前前端还没有完整配置 Passport 合约地址，因此无法从链上加载已配置的印章类型。",
        "The frontend does not have a complete Passport contract configuration yet, so it cannot load configured stamp types from chain.",
      );
    }

    if (isConnected && !hasCorrectChain) {
      return t(
        `当前钱包网络是 ${currentChainName}，目标网络是 ${targetChainName}。请先切换到目标网络，再读取印章类型列表。`,
        `Your wallet is connected to ${currentChainName}, but the target network is ${targetChainName}. Switch networks before loading configured stamp types.`,
      );
    }

    return t(
      "当前链上还没有任何已配置的印章类型。请先到“印章类型管理”页面执行一次配置，成功后这里就会出现下拉选项。",
      "No configured stamp types were found on the current chain. Configure at least one stamp type in Stamp Type Admin first, and it will then appear in this dropdown.",
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
    if (parsedPassportId === null || parsedStampTypeId === null) {
      return;
    }

    void loadPermission(parsedPassportId, parsedStampTypeId);
  }, [loadPermission, parsedPassportId, parsedStampTypeId]);

  return (
    <PassportShell currentKey="issue">
      <div className="space-y-8">
        <section className="rounded-[2.5rem] bg-[linear-gradient(135deg,_rgba(255,247,237,1),_rgba(255,255,255,1)_45%,_rgba(239,246,255,0.92))] p-10 shadow-[0_24px_60px_-28px_rgba(251,146,60,0.28)]">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-orange-500 shadow-sm">
                {t("履历签发", "Chronicle Issuance")}
              </span>
              <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-[-0.04em] text-slate-950">
                  {t("为护照签发一条履历印章。", "Issue a chronicle stamp to a passport.")}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-600">
                  {t(
                    "这个流程会直接使用机构钱包调用 `ChronicleStamp.issueStamp(...)`。",
                    "This flow calls `ChronicleStamp.issueStamp(...)` directly from the institution wallet.",
                  )}
                </p>
              </div>
            </div>

            <div className="glass-card space-y-4 p-6">
              <div className="space-y-1">
                <p className="meta-label">{t("权限快照", "Permission Snapshot")}</p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">{t("发行权限", "Issuer Access")}</h2>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">{t("当前钱包", "Connected Wallet")}</p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {connectedAddress || t("未连接", "Not connected")}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">{t("目标网络 / 当前网络", "Target / Current Network")}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {targetChainName} / {isConnected ? currentChainName : t("未连接", "Disconnected")}
                  </p>
                  <p className="mt-1 break-all font-mono text-xs text-slate-500">
                    ChronicleStamp: {CHRONICLE_STAMP_ADDRESS || t("未配置", "Not configured")}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] ${
                    canIssue ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {canIssue ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
                  {isLoadingPermission
                    ? t("检查中", "Checking")
                    : canIssue
                      ? t("已授权发行方", "Authorized Issuer")
                      : t("需要权限", "Permission Required")}
                </div>
                {stampType ? (
                  <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                    <p className="meta-label">{t("印章类型", "Stamp Type")}</p>
                    <p className="mt-2 font-semibold text-slate-900">
                      {stampType.name || t("未配置", "Unconfigured")} ({stampType.code || "NO_CODE"})
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {stampType.active ? t("启用", "Active") : t("停用", "Inactive")} /{" "}
                      {stampType.singleton ? t("单例", "Singleton") : t("可重复", "Repeatable")}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="space-y-2">
              <p className="meta-label">{t("印章输入", "Stamp Input")}</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">{t("签发印章", "Issue Stamp")}</h2>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <label className="meta-label" htmlFor="issue-passport-id">
                    {t("护照 ID", "Passport ID")}
                  </label>
                  <input
                    id="issue-passport-id"
                    type="text"
                    value={passportId}
                    onChange={(event) => setPassportId(event.target.value)}
                    placeholder="1"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <label className="meta-label" htmlFor="issue-stamp-type-id">
                      {t("印章类型", "Stamp Type")}
                    </label>
                    <button
                      type="button"
                      onClick={() => void loadAvailableStampTypes()}
                      disabled={isLoadingAvailableStampTypes}
                      className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 transition-colors hover:text-orange-600 disabled:opacity-50"
                    >
                      {isLoadingAvailableStampTypes
                        ? t("加载中...", "Loading...")
                        : t("刷新类型", "Refresh Types")}
                    </button>
                  </div>
                  <select
                    id="issue-stamp-type-id"
                    value={stampTypeId}
                    onChange={(event) => setStampTypeId(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="">
                      {availableStampTypes.length > 0
                        ? t("请选择已配置印章类型", "Select a configured stamp type")
                        : t("暂无已配置类型，可手动输入 ID", "No configured types found yet")}
                    </option>
                    {availableStampTypes.map((typeOption) => (
                      <option
                        key={typeOption.stampTypeId.toString()}
                        value={typeOption.stampTypeId.toString()}
                      >
                        {`#${typeOption.stampTypeId.toString()} · ${
                          typeOption.name || t("未命名", "Unnamed")
                        } · ${typeOption.code || "NO_CODE"}${
                          typeOption.active ? "" : ` · ${t("停用", "Inactive")}`
                        }`}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={stampTypeId}
                    onChange={(event) => setStampTypeId(event.target.value)}
                    placeholder={t("或手动输入印章类型 ID，例如 1", "Or enter a stamp type ID manually, e.g. 1")}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  />
                  {configuredTypeEmptyState ? (
                    <div className="mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm font-medium text-amber-800">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-amber-600">
                          <Network size={16} />
                        </div>
                        <div className="space-y-2">
                          <p>{configuredTypeEmptyState}</p>
                          <Link
                            to="/passport/stamp-types"
                            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-amber-700 transition-colors hover:text-amber-800"
                          >
                            <Link2 size={14} />
                            {t("前往印章类型管理", "Open Stamp Type Admin")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="issue-occurred-at">
                  {t("发生时间", "Occurred At")}
                </label>
                <input
                  id="issue-occurred-at"
                  type="datetime-local"
                  value={occurredAt}
                  onChange={(event) => setOccurredAt(event.target.value)}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="issue-metadata-cid">
                  {t("元数据 CID", "Metadata CID")}
                </label>
                <input
                  id="issue-metadata-cid"
                  type="text"
                  value={metadataCID}
                  onChange={(event) => setMetadataCID(event.target.value)}
                  placeholder="ipfs://..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
                <CidComposer
                  accent="orange"
                  defaultText={`{\n  "summary": "",\n  "details": "",\n  "attachments": [],\n  "operator": ""\n}`}
                  description={t(
                    "为这次印章签发的业务详情生成 CID，例如维修记录、认证附件或展览说明。",
                    "Generate the CID for this stamp issuance payload, such as maintenance records, authentication attachments, or exhibition notes.",
                  )}
                  fieldKey="issue_stamp_metadata"
                  suggestedFileName="stamp-metadata.json"
                  value={metadataCID}
                  onChange={setMetadataCID}
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="issue-supersedes">
                  {t("替代印章 ID", "Supersedes Stamp ID")}
                </label>
                <input
                  id="issue-supersedes"
                  type="text"
                  value={supersedesStampId}
                  onChange={(event) => setSupersedesStampId(event.target.value)}
                  placeholder={latestEffectiveStampId?.toString() || "0"}
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <button
                onClick={() => {
                  if (parsedPassportId === null || parsedStampTypeId === null) {
                    return;
                  }

                  void submitIssueStamp({
                    metadataCID,
                    occurredAt: toUnixSeconds(occurredAt),
                    passportId: parsedPassportId,
                    stampTypeId: parsedStampTypeId,
                    supersedesStampId: parsedSupersedesStampId,
                  });
                }}
                disabled={
                  parsedPassportId === null || parsedStampTypeId === null || !canIssue || isSubmitting
                }
                className="mt-2 inline-flex items-center justify-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-orange-700 transition-all hover:bg-orange-100 disabled:opacity-50"
              >
                <PenSquare size={18} />
                {isSubmitting ? t("提交中...", "Submitting...") : t("签发印章", "Issue Stamp")}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
              <p className="meta-label">{t("结果", "Result")}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{t("交易结果", "Transaction Outcome")}</h2>
              <div className="mt-6 space-y-4">
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
                {issuedStampId !== null ? (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                    <p className="meta-label">{t("已签发印章", "Issued Stamp")}</p>
                    <p className="mt-2 text-lg font-black text-slate-900">
                      #{issuedStampId.toString()}
                    </p>
                    {parsedPassportId !== null ? (
                      <Link
                        to={`/passport/${parsedPassportId.toString()}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-orange-600 transition-colors hover:text-orange-700"
                      >
                        <Link2 size={16} />
                        {t("打开护照详情", "Open Passport Detail")}
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
              <p className="meta-label">{t("业务说明", "Operational Notes")}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{t("签发上下文", "Issuance Context")}</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-orange-50 px-5 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
                    <Tags size={20} />
                  </div>
                  <p className="mt-4 font-black text-slate-900">{t("最新生效印章", "Latest Effective Stamp")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {latestEffectiveStampId !== null
                      ? t(`当前最新生效印章：#${latestEffectiveStampId.toString()}`, `Current latest effective stamp: #${latestEffectiveStampId.toString()}`)
                      : t("这本护照在该印章类型下还没有生效中的记录。", "No effective stamp exists yet for this passport and stamp type.")}
                  </p>
                </div>
                <div className="rounded-2xl bg-sky-50 px-5 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                    <CalendarDays size={20} />
                  </div>
                  <p className="mt-4 font-black text-slate-900">{t("发生时间", "Occurred Time")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {t("`occurredAt` 必须是过去或当前时间戳，未来时间会触发回滚。", "`occurredAt` must be a past or current timestamp. Future timestamps will revert.")}
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
