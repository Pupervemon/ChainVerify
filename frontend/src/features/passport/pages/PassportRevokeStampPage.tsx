import { Ban, Link2, ShieldCheck, ShieldX, Undo2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import CidComposer from "../components/CidComposer";
import PassportShell from "../components/PassportShell";
import { usePassportRevokeStamp } from "../hooks/usePassportRevokeStamp";
import { usePassportLocale } from "../i18n";

type PassportRevokeStampPageProps = {
  connectedAddress: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

export default function PassportRevokeStampPage(props: PassportRevokeStampPageProps) {
  const { connectedAddress, ensureSupportedChain, hasCorrectChain, isConnected } = props;
  const { t } = usePassportLocale();
  const [searchParams] = useSearchParams();
  const [stampId, setStampId] = useState(searchParams.get("stampId") || "");
  const [reasonCID, setReasonCID] = useState("");
  const {
    canRevoke,
    error,
    isConfigured,
    isLoadingContext,
    isSubmitting,
    loadContext,
    revokedStampId,
    stampRecord,
    statusMessage,
    submitRevokeStamp,
  } = usePassportRevokeStamp({
    address: connectedAddress,
    ensureSupportedChain,
    hasCorrectChain,
    isConnected,
  });

  const parsedStampId = useMemo(
    () => (/^\d+$/.test(stampId.trim()) ? BigInt(stampId.trim()) : null),
    [stampId],
  );

  useEffect(() => {
    if (parsedStampId === null) {
      return;
    }

    void loadContext(parsedStampId);
  }, [loadContext, parsedStampId]);

  return (
    <PassportShell currentKey="revoke">
      <div className="space-y-8">
        <section className="rounded-[2.5rem] bg-[linear-gradient(135deg,_rgba(255,241,242,1),_rgba(255,255,255,1)_45%,_rgba(255,247,237,0.92))] p-10 shadow-[0_24px_60px_-28px_rgba(244,63,94,0.22)]">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-rose-600 shadow-sm">
                {t("履历撤销", "Chronicle Revocation")}
              </span>
              <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-[-0.04em] text-slate-950">
                  {t("撤销已签发的履历印章。", "Revoke an issued chronicle stamp.")}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-600">
                  {t(
                    "这个流程会直接使用机构钱包或授权操作员钱包调用 `ChronicleStamp.revokeStamp(...)`。",
                    "This flow calls `ChronicleStamp.revokeStamp(...)` directly from the institution or authorized operator wallet.",
                  )}
                </p>
              </div>
            </div>

            <div className="glass-card space-y-4 p-6">
              <div className="space-y-1">
                <p className="meta-label">{t("权限快照", "Permission Snapshot")}</p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {t("撤销权限", "Revocation Access")}
                </h2>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">{t("当前钱包", "Connected Wallet")}</p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {connectedAddress || t("未连接", "Not connected")}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] ${
                    canRevoke ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {canRevoke ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
                  {isLoadingContext
                    ? t("检查中", "Checking")
                    : canRevoke
                      ? t("已授权撤销方", "Authorized Revoker")
                      : t("需要权限", "Permission Required")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="space-y-2">
              <p className="meta-label">{t("撤销输入", "Revocation Input")}</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {t("撤销印章", "Revoke Stamp")}
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="revoke-stamp-id">
                  {t("印章 ID", "Stamp ID")}
                </label>
                <input
                  id="revoke-stamp-id"
                  type="text"
                  value={stampId}
                  onChange={(event) => setStampId(event.target.value)}
                  placeholder="1"
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="revoke-reason-cid">
                  {t("原因 CID", "Reason CID")}
                </label>
                <input
                  id="revoke-reason-cid"
                  type="text"
                  value={reasonCID}
                  onChange={(event) => setReasonCID(event.target.value)}
                  placeholder="ipfs://..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                />
                <CidComposer
                  accent="rose"
                  defaultText={`{\n  "reason": "",\n  "evidence": [],\n  "operator": "",\n  "notes": ""\n}`}
                  description={t(
                    "为撤销原因生成 CID，适合记录审计说明、争议材料和证据附件。",
                    "Generate the CID for revocation reasons, audit notes, dispute material, and evidence attachments.",
                  )}
                  fieldKey="revoke_reason"
                  suggestedFileName="revocation-reason.json"
                  value={reasonCID}
                  onChange={setReasonCID}
                />
              </div>

              <button
                onClick={() => {
                  if (parsedStampId === null) {
                    return;
                  }

                  void submitRevokeStamp(parsedStampId, reasonCID);
                }}
                disabled={parsedStampId === null || !canRevoke || isSubmitting}
                className="mt-2 inline-flex items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-50"
              >
                <Undo2 size={18} />
                {isSubmitting ? t("提交中...", "Submitting...") : t("撤销印章", "Revoke Stamp")}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
              <p className="meta-label">{t("印章上下文", "Stamp Context")}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {t("当前印章", "Selected Stamp")}
              </h2>
              <div className="mt-6 space-y-4">
                {stampRecord ? (
                  <>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                      <p className="meta-label">{t("护照 ID", "Passport ID")}</p>
                      <p className="mt-2 text-lg font-black text-slate-900">
                        #{stampRecord.passportId.toString()}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                      <p className="meta-label">{t("印章类型 ID", "Stamp Type ID")}</p>
                      <p className="mt-2 text-lg font-black text-slate-900">
                        #{stampRecord.stampTypeId.toString()}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                      <p className="meta-label">{t("当前状态", "Current State")}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {stampRecord.revoked ? t("已撤销", "Already revoked") : t("生效中 / 可撤销", "Effective / revocable")}
                      </p>
                    </div>
                  </>
                ) : null}
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
                {revokedStampId !== null && stampRecord ? (
                  <Link
                    to={`/passport/${stampRecord.passportId.toString()}`}
                    className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-rose-600 transition-colors hover:text-rose-700"
                  >
                    <Link2 size={16} />
                    {t("打开护照详情", "Open Passport Detail")}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
              <p className="meta-label">{t("业务说明", "Operational Notes")}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {t("撤销规则", "Revocation Rules")}
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-rose-50 px-5 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
                    <Ban size={20} />
                  </div>
                  <p className="mt-4 font-black text-slate-900">{t("必须提供原因 CID", "Reason CID Required")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {t(
                      "执行撤销必须提供非空 `reasonCID`，通常指向审计或争议处理记录。",
                      "Revocation requires a non-empty `reasonCID`, typically pointing to an audit or dispute record.",
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
