import { RefreshCw, ShieldCheck, ShieldX } from "lucide-react";
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
        "This wallet can update revocation operators.",
        "This wallet can update revocation operators.",
      )
      : t(
        "Only the authority owner can update revocation operators.",
        "Only the authority owner can update revocation operators.",
      );
  const accessToneClass = isAccessPending
    ? "text-slate-500"
    : isAuthorityOwner
      ? "text-emerald-700"
      : "text-amber-700";

  return (
    <PassportShell currentKey="revocation-operators">
      <div className="passport-dashboard-body">
        <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
          <div className="passport-dashboard-primary__grid relative">
            <div className="passport-dashboard-primary__content space-y-5">
              <span className="passport-dashboard-primary__header">
                {t("Revocation Operators", "Revocation Operators")}
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                  {t(
                    "Manage which wallets can revoke stamps globally.",
                    "Manage which wallets can revoke stamps globally.",
                  )}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "Use this page to check one operator address and grant or revoke revocation access in PassportAuthority.",
                    "Use this page to check one operator address and grant or revoke revocation access in PassportAuthority.",
                  )}
                </p>
              </div>

              <div className="passport-dashboard-stats-grid grid gap-3">
                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">{t("Access", "Access")}</p>
                    <p
                      className={`passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight ${accessToneClass}`}
                    >
                      {accessLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {accessHint}
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">Owner</p>
                    <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900">
                      {authorityOwnerLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    PassportAuthority
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">
                      {t("Connected Wallet", "Connected Wallet")}
                    </p>
                    <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900">
                      {connectedWalletLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {PASSPORT_AUTHORITY_ADDRESS || t("Not configured", "Not configured")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="passport-dashboard-secondary">
          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("Manage Operator", "Manage Operator")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "Enter an operator wallet, check its current revocation status, then update access if you are the authority owner.",
                    "Enter an operator wallet, check its current revocation status, then update access if you are the authority owner.",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="revocation-operator-address">
                  {t("Operator Address", "Operator Address")}
                </label>
                <input
                  id="revocation-operator-address"
                  type="text"
                  value={operatorAddress}
                  onChange={(event) => setOperatorAddress(event.target.value)}
                  placeholder="0x..."
                  className="passport-dashboard-query__input mt-3 h-12 font-mono"
                />
              </div>

              <div className="passport-dashboard-primary__actions">
                <button
                  onClick={() => void loadRevocationOperatorStatus(normalizedOperator)}
                  disabled={!hasValidOperator || isCheckingOperator}
                  className="passport-action-button passport-action-button--secondary"
                >
                  <RefreshCw size={16} className={isCheckingOperator ? "animate-spin" : ""} />
                  {t("Check Status", "Check Status")}
                </button>
                <button
                  onClick={() => void setRevocationOperator(normalizedOperator, true)}
                  disabled={!isAuthorityOwner || !hasValidOperator || isSubmitting}
                  className="passport-action-button passport-action-button--primary"
                >
                  <ShieldCheck size={16} />
                  {t("Grant", "Grant")}
                </button>
                <button
                  onClick={() => void setRevocationOperator(normalizedOperator, false)}
                  disabled={!isAuthorityOwner || !hasValidOperator || isSubmitting}
                  className="passport-action-button passport-action-button--secondary hover:border-rose-300/60 hover:text-rose-700"
                >
                  <ShieldX size={16} />
                  {t("Revoke", "Revoke")}
                </button>
              </div>

              {operatorStatus !== null ? (
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("Current Status", "Current Status")}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    {operatorStatus
                      ? t(
                        "This operator can revoke any stamp through PassportAuthority.canRevoke(...).",
                        "This operator can revoke any stamp through PassportAuthority.canRevoke(...).",
                      )
                      : t(
                        "This operator is not authorized as a global revocation operator.",
                        "This operator is not authorized as a global revocation operator.",
                      )}
                  </p>
                </div>
              ) : null}

              {statusMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {statusMessage}
                </div>
              ) : null}

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {error}
                </div>
              ) : null}

              {!isConfigured ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
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
