import { Ban, RefreshCw, ShieldCheck, ShieldX, Undo2, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import {
  isPassportAddress,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import PassportShell from "../components/PassportShell";
import { usePassportRevocationOperatorAdmin } from "../hooks/usePassportRevocationOperatorAdmin";
import { usePassportLocale } from "../i18n";

type PassportRevocationOperatorPageProps = {
  connectedAddress: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

export default function PassportRevocationOperatorPage(
  props: PassportRevocationOperatorPageProps,
) {
  const { connectedAddress, ensureSupportedChain, hasCorrectChain, isConnected } = props;
  const { t } = usePassportLocale();
  const [operatorAddress, setOperatorAddress] = useState("");
  const {
    authorityOwner,
    error,
    isAuthorityOwner,
    isCheckingOperator,
    isConfigured,
    isLoadingAuthorityOwner,
    isSubmitting,
    loadRevocationOperatorStatus,
    operatorStatus,
    setRevocationOperator,
    statusMessage,
  } = usePassportRevocationOperatorAdmin({
    address: connectedAddress,
    ensureSupportedChain,
    hasCorrectChain,
    isConnected,
  });

  const normalizedOperator = operatorAddress.trim();
  const hasValidOperator = useMemo(
    () => isPassportAddress(normalizedOperator),
    [normalizedOperator],
  );

  return (
    <PassportShell currentKey="revocation-operators">
      <div className="space-y-8">
        <section className="rounded-[2.5rem] bg-[linear-gradient(135deg,_rgba(255,241,242,1),_rgba(255,255,255,1)_55%,_rgba(239,246,255,0.92))] p-10 shadow-[0_24px_60px_-28px_rgba(244,63,94,0.22)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-rose-600 shadow-sm">
                {t("撤销操作员", "Revocation Operators")}
              </span>
              <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-[-0.04em] text-slate-950">
                  {t("授予或撤销专用撤销操作员。", "Grant or revoke dedicated revocation operators.")}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-600">
                  {t(
                    "这个面板对应 `PassportAuthority.setRevocationOperator(...)`，仅供 authority owner 使用。",
                    "This panel updates `PassportAuthority.setRevocationOperator(...)`. It is intended for the authority owner only.",
                  )}
                </p>
              </div>
            </div>

            <div className="glass-card space-y-4 p-6">
              <div className="space-y-1">
                <p className="meta-label">{t("治理合约", "Authority Contract")}</p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {t("所有权快照", "Ownership Snapshot")}
                </h2>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">PassportAuthority</p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {PASSPORT_AUTHORITY_ADDRESS || t("未配置", "Not configured")}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">Owner</p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {isLoadingAuthorityOwner ? t("加载中...", "Loading...") : authorityOwner || t("不可用", "Unavailable")}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">{t("当前钱包", "Connected Wallet")}</p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {connectedAddress || t("未连接", "Not connected")}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] ${
                    isAuthorityOwner
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {isAuthorityOwner ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
                  {isAuthorityOwner ? t("Owner 权限", "Owner Access") : t("只读", "Read Only")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="space-y-2">
              <p className="meta-label">{t("撤销权限", "Revocation Access")}</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {t("管理撤销操作员", "Manage Revocation Operator")}
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="revocation-operator-address">
                  {t("操作员地址", "Operator Address")}
                </label>
                <input
                  id="revocation-operator-address"
                  type="text"
                  value={operatorAddress}
                  onChange={(event) => setOperatorAddress(event.target.value)}
                  placeholder="0x..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => void loadRevocationOperatorStatus(normalizedOperator)}
                  disabled={!hasValidOperator || isCheckingOperator}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:border-rose-200 hover:text-rose-600 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isCheckingOperator ? "animate-spin" : ""} />
                  {t("检查状态", "Check Status")}
                </button>
                <button
                  onClick={() => void setRevocationOperator(normalizedOperator, true)}
                  disabled={!isAuthorityOwner || !hasValidOperator || isSubmitting}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-50"
                >
                  <ShieldCheck size={16} />
                  {t("授权", "Grant")}
                </button>
                <button
                  onClick={() => void setRevocationOperator(normalizedOperator, false)}
                  disabled={!isAuthorityOwner || !hasValidOperator || isSubmitting}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-50"
                >
                  <ShieldX size={16} />
                  {t("撤销", "Revoke")}
                </button>
              </div>

              {operatorStatus !== null ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <p className="meta-label">{t("当前状态", "Current Status")}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {operatorStatus
                      ? t("该操作员可以通过 PassportAuthority.canRevoke(...) 撤销任意印章。", "This operator can revoke any stamp through PassportAuthority.canRevoke(...).")
                      : t("该操作员当前不是全局撤销操作员。", "This operator is not authorized as a global revocation operator.")}
                  </p>
                </div>
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
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <p className="meta-label">{t("业务说明", "Operational Notes")}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {t("撤销委派如何工作", "How Revocation Delegation Works")}
            </h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-rose-50 px-5 py-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
                  <Ban size={20} />
                </div>
                <p className="mt-4 font-black text-slate-900">{t("全局覆盖权限", "Global Override")}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {t(
                    "被配置的撤销操作员可以直接撤销任意印章，不需要是原始发行方或类型管理员。",
                    "A configured revocation operator can revoke any stamp without needing to be the original issuer or a stamp type admin.",
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-orange-50 px-5 py-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
                  <Undo2 size={20} />
                </div>
                <p className="mt-4 font-black text-slate-900">{t("业务场景", "Operational Use Case")}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {t(
                    "适合合规、争议处理等需要跨全部印章类型执行紧急撤销的团队。",
                    "This is useful for compliance or dispute teams that need emergency revocation rights across all stamp types.",
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-sky-50 px-5 py-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                  <Wallet size={20} />
                </div>
                <p className="mt-4 font-black text-slate-900">{t("与签发权限分离", "Separate From Issuance")}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {t(
                    "撤销操作员权限不会自动获得 `issueStamp(...)` 权限。签发与撤销仍然独立控制。",
                    "Revocation operator permission does not grant `issueStamp(...)` access. Issuance and revocation remain independently controlled.",
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
        </section>
      </div>
    </PassportShell>
  );
}
