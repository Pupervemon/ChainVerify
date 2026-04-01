import { Link2, Undo2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

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
  const parsedStampId = useMemo(
    () => (/^\d+$/.test(stampId.trim()) ? BigInt(stampId.trim()) : null),
    [stampId],
  );
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
    initialStampId: parsedStampId,
    isConnected,
  });

  useEffect(() => {
    if (parsedStampId === null) {
      return;
    }

    void loadContext(parsedStampId);
  }, [loadContext, parsedStampId]);

  const connectedWalletLabel = connectedAddress || t("Not connected", "Not connected");
  const accessLabel = isLoadingContext
    ? t("Checking", "Checking")
    : canRevoke
      ? t("Authorized Revoker", "Authorized Revoker")
      : t("Permission Required", "Permission Required");
  const accessToneClass = isLoadingContext
    ? "text-slate-500"
    : canRevoke
      ? "text-emerald-700"
      : "text-amber-700";

  return (
    <PassportShell currentKey="revoke">
      <div className="passport-dashboard-body">
        <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
          <div className="passport-dashboard-primary__grid relative">
            <div className="passport-dashboard-primary__content space-y-5">
              <span className="passport-dashboard-primary__header">
                {t("Revoke Stamp", "Revoke Stamp")}
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                  {t(
                    "Revoke an issued stamp with a single reason reference.",
                    "Revoke an issued stamp with a single reason reference.",
                  )}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "Load one stamp, review its current state, then submit revocation through ChronicleStamp.revokeStamp(...).",
                    "Load one stamp, review its current state, then submit revocation through ChronicleStamp.revokeStamp(...).",
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
                    {connectedWalletLabel}
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">{t("Passport ID", "Passport ID")}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {stampRecord ? `#${stampRecord.passportId.toString()}` : "--"}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {stampRecord
                      ? `Stamp #${stampRecord.stampId.toString()}`
                      : t("No stamp loaded", "No stamp loaded")}
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">{t("Current State", "Current State")}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {stampRecord
                        ? stampRecord.revoked
                          ? t("Already revoked", "Already revoked")
                          : t("Effective / revocable", "Effective / revocable")
                        : "--"}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    Reason CID required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="passport-dashboard-secondary space-y-6">
          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("Revocation Input", "Revocation Input")}
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="revoke-stamp-id">
                  {t("Stamp ID", "Stamp ID")}
                </label>
                <input
                  id="revoke-stamp-id"
                  type="text"
                  value={stampId}
                  onChange={(event) => setStampId(event.target.value)}
                  placeholder="1"
                  className="passport-dashboard-query__input mt-3 h-12 font-mono"
                />
              </div>

              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="revoke-reason-cid">
                  {t("Reason CID", "Reason CID")}
                </label>
                <input
                  id="revoke-reason-cid"
                  type="text"
                  value={reasonCID}
                  onChange={(event) => setReasonCID(event.target.value)}
                  placeholder="ipfs://..."
                  className="passport-dashboard-query__input mt-3 h-12"
                />
              </div>

              <div className="passport-dashboard-primary__actions">
                <button
                  onClick={() => {
                    if (parsedStampId === null) {
                      return;
                    }

                    void submitRevokeStamp(parsedStampId, reasonCID);
                  }}
                  disabled={parsedStampId === null || !canRevoke || isSubmitting}
                  className="passport-action-button passport-action-button--primary"
                >
                  <Undo2 size={16} />
                  {isSubmitting
                    ? t("Submitting...", "Submitting...")
                    : t("Revoke Stamp", "Revoke Stamp")}
                </button>
              </div>
            </div>
          </div>

          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("Stamp Context", "Stamp Context")}
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {stampRecord ? (
                <>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="panel-soft p-5">
                      <p className="meta-label">{t("Passport ID", "Passport ID")}</p>
                      <p className="mt-3 text-lg font-black text-slate-900">
                        #{stampRecord.passportId.toString()}
                      </p>
                    </div>

                    <div className="panel-soft p-5">
                      <p className="meta-label">{t("Stamp Type ID", "Stamp Type ID")}</p>
                      <p className="mt-3 text-lg font-black text-slate-900">
                        #{stampRecord.stampTypeId.toString()}
                      </p>
                    </div>
                  </div>

                  <div className="panel-soft p-5">
                    <p className="meta-label">{t("Current State", "Current State")}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      {stampRecord.revoked
                        ? t("Already revoked", "Already revoked")
                        : t("Effective / revocable", "Effective / revocable")}
                    </p>
                  </div>
                </>
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

              {revokedStampId !== null && stampRecord ? (
                <Link
                  to={`/passport/${stampRecord.passportId.toString()}`}
                  className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-rose-600 transition-colors hover:text-rose-700"
                >
                  <Link2 size={16} />
                  {t("Open Passport Detail", "Open Passport Detail")}
                </Link>
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
