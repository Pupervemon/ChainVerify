import { RefreshCw, ShieldCheck, ShieldX, UserCog, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import {
  isPassportAddress,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import PassportShell from "../components/PassportShell";
import { usePassportCreatorAdmin } from "../hooks/usePassportCreatorAdmin";
import { usePassportLocale } from "../i18n";

type PassportAdminPageProps = {
  connectedAddress: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

export default function PassportAdminPage(props: PassportAdminPageProps) {
  const { connectedAddress, ensureSupportedChain, hasCorrectChain, isConnected } = props;
  const { t } = usePassportLocale();
  const [operatorAddress, setOperatorAddress] = useState("");
  const {
    authorityOwner,
    creatorStatus,
    error,
    isAuthorityOwner,
    isCheckingCreator,
    isConfigured,
    isLoadingAuthorityOwner,
    isSubmitting,
    statusMessage,
    loadCreatorStatus,
    setPassportCreator,
  } = usePassportCreatorAdmin({
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
    <PassportShell currentKey="admin">
      <div className="space-y-8">
        <section className="rounded-[2.5rem] bg-[linear-gradient(135deg,_rgba(255,247,237,1),_rgba(255,255,255,1)_60%,_rgba(239,246,255,0.9))] p-10 shadow-[0_24px_60px_-28px_rgba(14,165,233,0.3)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-sky-600 shadow-sm">
                {t("护照治理", "Passport Admin")}
              </span>
              <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-[-0.04em] text-slate-950">
                  {t("授予或撤销护照创建权限。", "Grant or revoke passport creation rights.")}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-600">
                  {t(
                    "这个面板对应 `PassportAuthority.setPassportCreator(...)`，仅供 authority owner 使用。",
                    "This panel updates `PassportAuthority.setPassportCreator(...)`. It is intended for the authority owner only.",
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
              <p className="meta-label">{t("创建权限", "Creator Access")}</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {t("管理机构操作员", "Manage Institution Operator")}
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="passport-creator-address">
                  {t("操作员地址", "Operator Address")}
                </label>
                <input
                  id="passport-creator-address"
                  type="text"
                  value={operatorAddress}
                  onChange={(event) => setOperatorAddress(event.target.value)}
                  placeholder="0x..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => void loadCreatorStatus(normalizedOperator)}
                  disabled={!hasValidOperator || isCheckingCreator}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:border-sky-200 hover:text-sky-600 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isCheckingCreator ? "animate-spin" : ""} />
                  {t("检查状态", "Check Status")}
                </button>
                <button
                  onClick={() => void setPassportCreator(normalizedOperator, true)}
                  disabled={!isAuthorityOwner || !hasValidOperator || isSubmitting}
                  className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-sky-700 transition-all hover:bg-sky-100 disabled:opacity-50"
                >
                  <ShieldCheck size={16} />
                  {t("授权", "Grant")}
                </button>
                <button
                  onClick={() => void setPassportCreator(normalizedOperator, false)}
                  disabled={!isAuthorityOwner || !hasValidOperator || isSubmitting}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-50"
                >
                  <ShieldX size={16} />
                  {t("撤销", "Revoke")}
                </button>
              </div>

              {creatorStatus !== null ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <p className="meta-label">{t("当前状态", "Current Status")}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {creatorStatus
                      ? t("该操作员可以通过工厂合约创建护照。", "This operator can create passports through the factory.")
                      : t("该操作员当前没有创建护照权限。", "This operator is not authorized to create passports.")}
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
              {t("这个流程如何工作", "How This Flow Works")}
            </h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-sky-50 px-5 py-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                  <UserCog size={20} />
                </div>
                <p className="mt-4 font-black text-slate-900">{t("由 Authority 控制", "Authority Controlled")}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {t(
                    "`PassportAuthority` 决定哪些机构钱包可以调用 `PassportFactory.createPassport(...)`。",
                    "`PassportAuthority` decides which institution wallets are allowed to call `PassportFactory.createPassport(...)`.",
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-orange-50 px-5 py-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
                  <Wallet size={20} />
                </div>
                <p className="mt-4 font-black text-slate-900">{t("机构钱包", "Institution Wallets")}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {t(
                    "授权操作员直接使用自己的钱包发起交易，这样链上的发行主体归属更清晰。",
                    "Authorized operators use their own wallets directly. This keeps on-chain issuer attribution clear.",
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
