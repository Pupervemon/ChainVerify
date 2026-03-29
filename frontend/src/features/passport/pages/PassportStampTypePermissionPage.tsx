import { KeyRound, RefreshCw, ShieldCheck, ShieldX, Tags, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import {
  isPassportAddress,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import PassportShell from "../components/PassportShell";
import { usePassportStampTypePermissionAdmin } from "../hooks/usePassportStampTypePermissionAdmin";
import { usePassportLocale } from "../i18n";

type PassportStampTypePermissionPageProps = {
  connectedAddress: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

export default function PassportStampTypePermissionPage(
  props: PassportStampTypePermissionPageProps,
) {
  const { connectedAddress, ensureSupportedChain, hasCorrectChain, isConnected } = props;
  const { t } = usePassportLocale();
  const [stampTypeId, setStampTypeId] = useState("");
  const [adminAddress, setAdminAddress] = useState("");
  const {
    adminStatus,
    authorityOwner,
    error,
    isAuthorityOwner,
    isCheckingAdmin,
    isConfigured,
    isLoadingAuthorityOwner,
    isSubmitting,
    loadStampTypeAdminStatus,
    setStampTypeAdmin,
    statusMessage,
  } = usePassportStampTypePermissionAdmin({
    address: connectedAddress,
    ensureSupportedChain,
    hasCorrectChain,
    isConnected,
  });

  const normalizedAdmin = adminAddress.trim();
  const hasValidAdmin = useMemo(() => isPassportAddress(normalizedAdmin), [normalizedAdmin]);
  const parsedStampTypeId = useMemo(
    () => (/^\d+$/.test(stampTypeId.trim()) ? BigInt(stampTypeId.trim()) : null),
    [stampTypeId],
  );

  return (
    <PassportShell currentKey="stamp-type-admins">
      <div className="space-y-8">
        <section className="rounded-[2.5rem] bg-[linear-gradient(135deg,_rgba(239,246,255,1),_rgba(255,255,255,1)_55%,_rgba(255,247,237,0.92))] p-10 shadow-[0_24px_60px_-28px_rgba(14,165,233,0.3)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-sky-600 shadow-sm">
                {t("印章类型权限", "Stamp Type Permissions")}
              </span>
              <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-[-0.04em] text-slate-950">
                  {t("授予或撤销按类型划分的管理员权限。", "Grant or revoke per-type admin permissions.")}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-600">
                  {t(
                    "这个面板对应 `PassportAuthority.setStampTypeAdmin(...)`，仅供 authority owner 使用。",
                    "This panel updates `PassportAuthority.setStampTypeAdmin(...)`. It is intended for the authority owner only.",
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
              <p className="meta-label">{t("类型权限", "Type Access")}</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {t("管理印章类型管理员", "Manage Stamp Type Admin")}
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <label className="meta-label" htmlFor="stamp-type-id">
                    {t("印章类型 ID", "Stamp Type ID")}
                  </label>
                  <input
                    id="stamp-type-id"
                    type="text"
                    value={stampTypeId}
                    onChange={(event) => setStampTypeId(event.target.value)}
                    placeholder="1"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <label className="meta-label" htmlFor="stamp-type-admin-address">
                    {t("管理员地址", "Admin Address")}
                  </label>
                  <input
                    id="stamp-type-admin-address"
                    type="text"
                    value={adminAddress}
                    onChange={(event) => setAdminAddress(event.target.value)}
                    placeholder="0x..."
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    if (parsedStampTypeId === null) {
                      return;
                    }

                    void loadStampTypeAdminStatus(parsedStampTypeId, normalizedAdmin);
                  }}
                  disabled={parsedStampTypeId === null || !hasValidAdmin || isCheckingAdmin}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:border-sky-200 hover:text-sky-600 disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isCheckingAdmin ? "animate-spin" : ""} />
                  {t("检查状态", "Check Status")}
                </button>
                <button
                  onClick={() => {
                    if (parsedStampTypeId === null) {
                      return;
                    }

                    void setStampTypeAdmin(parsedStampTypeId, normalizedAdmin, true);
                  }}
                  disabled={
                    !isAuthorityOwner || parsedStampTypeId === null || !hasValidAdmin || isSubmitting
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-sky-700 transition-all hover:bg-sky-100 disabled:opacity-50"
                >
                  <ShieldCheck size={16} />
                  {t("授权", "Grant")}
                </button>
                <button
                  onClick={() => {
                    if (parsedStampTypeId === null) {
                      return;
                    }

                    void setStampTypeAdmin(parsedStampTypeId, normalizedAdmin, false);
                  }}
                  disabled={
                    !isAuthorityOwner || parsedStampTypeId === null || !hasValidAdmin || isSubmitting
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-rose-700 transition-all hover:bg-rose-100 disabled:opacity-50"
                >
                  <ShieldX size={16} />
                  {t("撤销", "Revoke")}
                </button>
              </div>

              {adminStatus !== null && parsedStampTypeId !== null ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <p className="meta-label">{t("当前状态", "Current Status")}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {adminStatus
                      ? t(`该地址是印章类型 #${parsedStampTypeId.toString()} 的管理员。`, `This address is an admin for stamp type #${parsedStampTypeId.toString()}.`)
                      : t(`该地址不是印章类型 #${parsedStampTypeId.toString()} 的管理员。`, `This address is not an admin for stamp type #${parsedStampTypeId.toString()}.`)}
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
              {t("这个权限能做什么", "What This Permission Enables")}
            </h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-sky-50 px-5 py-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                  <Tags size={20} />
                </div>
                <p className="mt-4 font-black text-slate-900">{t("按类型委派", "Per-Type Delegation")}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {t(
                    "印章类型管理员可以在类型配置页管理自己负责的那一种类型。",
                    "A stamp type admin can manage configuration for the specific type on the stamp type page.",
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-orange-50 px-5 py-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
                  <KeyRound size={20} />
                </div>
                <p className="mt-4 font-black text-slate-900">{t("撤销范围", "Revocation Scope")}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {t(
                    "这个权限同时允许通过 `PassportAuthority.canRevoke(...)` 撤销同类型印章。",
                    "This permission also allows revoking stamps of the same type through `PassportAuthority.canRevoke(...)`.",
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-5 py-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                  <Wallet size={20} />
                </div>
                <p className="mt-4 font-black text-slate-900">{t("不等于发行授权", "Not An Issuer Grant")}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {t(
                    "是否能签发印章仍取决于 issuer policy。仅有类型管理员权限并不会自动获得 `issueStamp(...)` 权限。",
                    "Issuing stamps still depends on issuer policy. Stamp type admin alone does not grant `issueStamp(...)` permission.",
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
