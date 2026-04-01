import { RefreshCw, ShieldCheck, ShieldX } from "lucide-react";
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
  const isAccessPending = isLoadingAuthorityOwner && !authorityOwner;
  const authorityOwnerLabel = isLoadingAuthorityOwner
    ? t("Loading...", "Loading...")
    : authorityOwner || t("Unavailable", "Unavailable");
  const connectedWalletLabel = connectedAddress || t("Not connected", "Not connected");
  const accessLabel = isAccessPending
    ? t("Checking", "Checking")
    : isAuthorityOwner
      ? t("Owner Access", "Owner Access")
      : t("Read Only", "Read Only");
  const accessHint = isAccessPending
    ? t(
      "Loading authority ownership for this wallet.",
      "Loading authority ownership for this wallet.",
    )
    : isAuthorityOwner
      ? t(
        "This wallet can update stamp type admins.",
        "This wallet can update stamp type admins.",
      )
      : t(
        "Only the authority owner can update stamp type admins.",
        "Only the authority owner can update stamp type admins.",
      );
  const accessToneClass = isAccessPending
    ? "text-slate-500"
    : isAuthorityOwner
      ? "text-emerald-700"
      : "text-amber-700";

  return (
    <PassportShell currentKey="stamp-type-admins">
      <div className="passport-workbench-body passport-type-admins-page">
        <section className="passport-workbench-panel passport-type-admins-panel panel-surface">
          <div className="passport-workbench-panel__stack">
            <div className="passport-type-admins-panel__header">
              <span className="passport-type-admins-panel__eyebrow">
                {t("Type Admins", "Type Admins")}
              </span>
              <h1 className="font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                {t("Manage Type Admin", "Manage Type Admin")}
              </h1>
            </div>

            <div className="passport-type-admins-summary grid gap-4 md:grid-cols-3">
              <div className="passport-workbench-cell panel-soft passport-type-admins-summary__card">
                <p className="passport-dashboard-card-label">{t("Access", "Access")}</p>
                <p
                  className={`mt-3 font-nav text-3xl font-bold tracking-tight ${accessToneClass}`}
                >
                  {accessLabel}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-600">{accessHint}</p>
              </div>

              <div className="passport-workbench-cell panel-soft passport-type-admins-summary__card">
                <p className="passport-dashboard-card-label">Owner</p>
                <p className="mt-3 break-all font-mono text-sm font-semibold text-slate-900">
                  {authorityOwnerLabel}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-600">PassportAuthority</p>
              </div>

              <div className="passport-workbench-cell panel-soft passport-type-admins-summary__card">
                <p className="passport-dashboard-card-label">
                  {t("Connected Wallet", "Connected Wallet")}
                </p>
                <p className="mt-3 break-all font-mono text-sm font-semibold text-slate-900">
                  {connectedWalletLabel}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  {PASSPORT_AUTHORITY_ADDRESS || t("Not configured", "Not configured")}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="passport-workbench-panel passport-type-admins-business panel-surface">
          <div className="passport-workbench-panel__stack">
            <div className="passport-workbench-panel__head">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {t("Admin Operation", "Admin Operation")}
              </h2>
            </div>

            <div className="passport-type-admins-form">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="panel-soft p-5">
                  <label className="meta-label" htmlFor="stamp-type-id">
                    {t("Stamp Type ID", "Stamp Type ID")}
                  </label>
                  <input
                    id="stamp-type-id"
                    type="text"
                    value={stampTypeId}
                    onChange={(event) => setStampTypeId(event.target.value)}
                    placeholder="1"
                    className="passport-dashboard-query__input mt-3 h-12 font-mono"
                  />
                </div>

                <div className="panel-soft p-5">
                  <label className="meta-label" htmlFor="stamp-type-admin-address">
                    {t("Admin Address", "Admin Address")}
                  </label>
                  <input
                    id="stamp-type-admin-address"
                    type="text"
                    value={adminAddress}
                    onChange={(event) => setAdminAddress(event.target.value)}
                    placeholder="0x..."
                    className="passport-dashboard-query__input mt-3 h-12 font-mono"
                  />
                </div>
              </div>

              <div className="passport-dashboard-primary__actions passport-type-admins-form__actions">
                <button
                  onClick={() => {
                    if (parsedStampTypeId === null) {
                      return;
                    }

                    void loadStampTypeAdminStatus(parsedStampTypeId, normalizedAdmin);
                  }}
                  disabled={parsedStampTypeId === null || !hasValidAdmin || isCheckingAdmin}
                  className="passport-action-button passport-action-button--secondary"
                >
                  <RefreshCw size={16} className={isCheckingAdmin ? "animate-spin" : ""} />
                  {t("Check Status", "Check Status")}
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
                  className="passport-action-button passport-action-button--primary"
                >
                  <ShieldCheck size={16} />
                  {t("Grant", "Grant")}
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
                  className="passport-action-button passport-action-button--secondary hover:border-rose-300/60 hover:text-rose-700"
                >
                  <ShieldX size={16} />
                  {t("Revoke", "Revoke")}
                </button>
              </div>

              {adminStatus !== null && parsedStampTypeId !== null ? (
                <div className="panel-soft p-5 text-center">
                  <p className="meta-label">{t("Current Status", "Current Status")}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    {adminStatus
                      ? t(
                        `This address is an admin for stamp type #${parsedStampTypeId.toString()}.`,
                        `This address is an admin for stamp type #${parsedStampTypeId.toString()}.`,
                      )
                      : t(
                        `This address is not an admin for stamp type #${parsedStampTypeId.toString()}.`,
                        `This address is not an admin for stamp type #${parsedStampTypeId.toString()}.`,
                      )}
                  </p>
                </div>
              ) : null}

              {statusMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
                  {statusMessage}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-700">
                  {error}
                </div>
              ) : null}

              {!isConfigured ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-700">
                  {t(
                    "Passport contracts are not configured in the frontend environment.",
                    "Passport contracts are not configured in the frontend environment.",
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </PassportShell>
  );
}
