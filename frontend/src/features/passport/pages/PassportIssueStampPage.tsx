import { Link2, Network, PenSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { CHRONICLE_STAMP_ADDRESS } from "../../../config/passport";
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
    initialPassportId: parsedPassportId,
    initialStampTypeId: parsedStampTypeId,
    isConnected,
  });
  const configuredTypeEmptyState = useMemo(() => {
    if (isLoadingAvailableStampTypes || availableStampTypes.length > 0) {
      return "";
    }

    if (!isConfigured) {
      return t(
        "The frontend does not have a complete Passport contract configuration yet, so it cannot load configured stamp types from chain.",
        "The frontend does not have a complete Passport contract configuration yet, so it cannot load configured stamp types from chain.",
      );
    }

    if (isConnected && !hasCorrectChain) {
      return t(
        `Your wallet is connected to ${currentChainName}, but the target network is ${targetChainName}. Switch networks before loading configured stamp types.`,
        `Your wallet is connected to ${currentChainName}, but the target network is ${targetChainName}. Switch networks before loading configured stamp types.`,
      );
    }

    return t(
      "No configured stamp types were found on the current chain. Configure at least one stamp type in Stamp Type Admin first, and it will then appear in this dropdown.",
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

  const connectedWalletLabel = connectedAddress || t("Not connected", "Not connected");
  const accessLabel = isLoadingPermission
    ? t("Checking", "Checking")
    : canIssue
      ? t("Authorized Issuer", "Authorized Issuer")
      : t("Permission Required", "Permission Required");
  const accessToneClass = isLoadingPermission
    ? "text-slate-500"
    : canIssue
      ? "text-emerald-700"
      : "text-amber-700";

  return (
    <PassportShell currentKey="issue">
      <div className="passport-dashboard-body">
        <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
          <div className="passport-dashboard-primary__grid relative">
            <div className="passport-dashboard-primary__content space-y-5">
              <span className="passport-dashboard-primary__header">
                {t("Issue Stamp", "Issue Stamp")}
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                  {t(
                    "Issue a chronicle stamp with a focused set of operational inputs.",
                    "Issue a chronicle stamp with a focused set of operational inputs.",
                  )}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "Select the passport and stamp type, add occurred time and metadata, then submit directly through ChronicleStamp.issueStamp(...).",
                    "Select the passport and stamp type, add occurred time and metadata, then submit directly through ChronicleStamp.issueStamp(...).",
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
                    <p className="passport-dashboard-card-label">
                      {t("Target / Current Network", "Target / Current Network")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {targetChainName} /{" "}
                      {isConnected ? currentChainName : t("Disconnected", "Disconnected")}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    ChronicleStamp
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">{t("Stamp Type", "Stamp Type")}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {stampType
                        ? `${stampType.name || "Unconfigured"} (${stampType.code || "NO_CODE"})`
                        : "--"}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {CHRONICLE_STAMP_ADDRESS || t("Not configured", "Not configured")}
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
                  {t("Stamp Input", "Stamp Input")}
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="panel-soft p-5">
                  <label className="meta-label" htmlFor="issue-passport-id">
                    {t("Passport ID", "Passport ID")}
                  </label>
                  <input
                    id="issue-passport-id"
                    type="text"
                    value={passportId}
                    onChange={(event) => setPassportId(event.target.value)}
                    placeholder="1"
                    className="passport-dashboard-query__input mt-3 h-12 font-mono"
                  />
                </div>

                <div className="panel-soft p-5">
                  <div className="flex items-center justify-between gap-3">
                    <label className="meta-label" htmlFor="issue-stamp-type-id">
                      {t("Stamp Type", "Stamp Type")}
                    </label>
                    <button
                      type="button"
                      onClick={() => void loadAvailableStampTypes()}
                      disabled={isLoadingAvailableStampTypes}
                      className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500 transition-colors hover:text-orange-600 disabled:opacity-50"
                    >
                      {isLoadingAvailableStampTypes
                        ? t("Loading...", "Loading...")
                        : t("Refresh Types", "Refresh Types")}
                    </button>
                  </div>
                  <select
                    id="issue-stamp-type-id"
                    value={stampTypeId}
                    onChange={(event) => setStampTypeId(event.target.value)}
                    className="passport-dashboard-query__input mt-3 h-12"
                  >
                    <option value="">
                      {availableStampTypes.length > 0
                        ? t("Select a configured stamp type", "Select a configured stamp type")
                        : t("No configured types found yet", "No configured types found yet")}
                    </option>
                    {availableStampTypes.map((typeOption) => (
                      <option
                        key={typeOption.stampTypeId.toString()}
                        value={typeOption.stampTypeId.toString()}
                      >
                        {`#${typeOption.stampTypeId.toString()} | ${
                          typeOption.name || t("Unnamed", "Unnamed")
                        } | ${typeOption.code || "NO_CODE"}${
                          typeOption.active ? "" : ` | ${t("Inactive", "Inactive")}`
                        }`}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={stampTypeId}
                    onChange={(event) => setStampTypeId(event.target.value)}
                    placeholder={t(
                      "Or enter a stamp type ID manually, e.g. 1",
                      "Or enter a stamp type ID manually, e.g. 1",
                    )}
                    className="passport-dashboard-query__input mt-3 h-12 font-mono"
                  />
                  {configuredTypeEmptyState ? (
                    <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-4 text-sm font-medium text-amber-800">
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
                            {t("Open Stamp Type Admin", "Open Stamp Type Admin")}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="issue-occurred-at">
                  {t("Occurred At", "Occurred At")}
                </label>
                <input
                  id="issue-occurred-at"
                  type="datetime-local"
                  value={occurredAt}
                  onChange={(event) => setOccurredAt(event.target.value)}
                  className="passport-dashboard-query__input mt-3 h-12"
                />
              </div>

              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="issue-metadata-cid">
                  {t("Metadata CID", "Metadata CID")}
                </label>
                <input
                  id="issue-metadata-cid"
                  type="text"
                  value={metadataCID}
                  onChange={(event) => setMetadataCID(event.target.value)}
                  placeholder="ipfs://..."
                  className="passport-dashboard-query__input mt-3 h-12"
                />
              </div>

              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="issue-supersedes">
                  {t("Supersedes Stamp ID", "Supersedes Stamp ID")}
                </label>
                <input
                  id="issue-supersedes"
                  type="text"
                  value={supersedesStampId}
                  onChange={(event) => setSupersedesStampId(event.target.value)}
                  placeholder={latestEffectiveStampId?.toString() || "0"}
                  className="passport-dashboard-query__input mt-3 h-12 font-mono"
                />
              </div>

              <div className="passport-dashboard-primary__actions">
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
                    parsedPassportId === null ||
                    parsedStampTypeId === null ||
                    !canIssue ||
                    isSubmitting
                  }
                  className="passport-action-button passport-action-button--primary"
                >
                  <PenSquare size={16} />
                  {isSubmitting
                    ? t("Submitting...", "Submitting...")
                    : t("Issue Stamp", "Issue Stamp")}
                </button>
              </div>
            </div>
          </div>

          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("Transaction Outcome", "Transaction Outcome")}
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
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

              {issuedStampId !== null ? (
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("Issued Stamp", "Issued Stamp")}</p>
                  <p className="mt-3 text-lg font-black text-slate-900">
                    #{issuedStampId.toString()}
                  </p>
                  {parsedPassportId !== null ? (
                    <Link
                      to={`/passport/${parsedPassportId.toString()}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-orange-600 transition-colors hover:text-orange-700"
                    >
                      <Link2 size={16} />
                      {t("Open Passport Detail", "Open Passport Detail")}
                    </Link>
                  ) : null}
                </div>
              ) : null}

              <div className="panel-soft p-5">
                <p className="meta-label">{t("Latest Effective Stamp", "Latest Effective Stamp")}</p>
                <p className="mt-3 text-sm font-semibold text-slate-700">
                  {latestEffectiveStampId !== null
                    ? t(
                      `Current latest effective stamp: #${latestEffectiveStampId.toString()}`,
                      `Current latest effective stamp: #${latestEffectiveStampId.toString()}`,
                    )
                    : t(
                      "No effective stamp exists yet for this passport and stamp type.",
                      "No effective stamp exists yet for this passport and stamp type.",
                    )}
                </p>
              </div>

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
