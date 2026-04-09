import { Layers3, Link2, Network, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { CHRONICLE_STAMP_ADDRESS } from "../../../config/passport";
import CidComposer from "../components/CidComposer";
import PassportShell from "../components/PassportShell";
import PassportTransactionSuccessNotice from "../components/PassportTransactionSuccessNotice";
import { usePassportStampTypeAdmin } from "../hooks/usePassportStampTypeAdmin";
import { usePassportTransactionSuccessNotice } from "../hooks/usePassportTransactionSuccessNotice";
import { usePassportLocale } from "../i18n";

type PassportStampTypeAdminPageProps = {
  connectedAddress: string;
  currentChainName: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
  targetChainName: string;
};

const hasMeaningfulStampTypeConfig = (config: {
  active: boolean;
  code: string;
  name: string;
  schemaCID: string;
  singleton: boolean;
}) =>
  Boolean(
    config.code.trim() ||
      config.name.trim() ||
      config.schemaCID.trim() ||
      config.active ||
      config.singleton,
  );

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
    clearStampTypeContext,
    currentConfig,
    error,
    isConfigured,
    isLoadingAvailableStampTypes,
    isLoadingChronicleOwner,
    isLoadingStampType,
    isSubmitting,
    isStampTypeAdmin,
    loadedStampTypeId,
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
  const { clearSuccessNotice, successNoticeMessage } = usePassportTransactionSuccessNotice({
    error,
    isSubmitting,
    statusMessage,
  });

  const parsedStampTypeId = useMemo(
    () => (/^\d+$/.test(stampTypeId.trim()) ? BigInt(stampTypeId.trim()) : null),
    [stampTypeId],
  );
  const trimmedSchemaCID = schemaCID.trim();
  const hasLoadedCurrentStampType =
    parsedStampTypeId !== null && loadedStampTypeId === parsedStampTypeId;
  const hasSelectedTypeOnChain =
    parsedStampTypeId !== null &&
    availableStampTypes.some((typeOption) => typeOption.stampTypeId === parsedStampTypeId);
  const hasRenderableCurrentConfig =
    currentConfig !== null &&
    hasLoadedCurrentStampType &&
    (hasSelectedTypeOnChain || hasMeaningfulStampTypeConfig(currentConfig));
  const canSubmitStampType =
    parsedStampTypeId !== null &&
    hasLoadedCurrentStampType &&
    canManageStampType &&
    !isLoadingStampType &&
    !isSubmitting;

  const configuredTypesEmptyState = useMemo(() => {
    if (isLoadingAvailableStampTypes || availableStampTypes.length > 0) {
      return "";
    }

    if (!isConfigured) {
      return t(
        "Passport contracts are not configured in the frontend environment.",
        "Passport contracts are not configured in the frontend environment.",
      );
    }

    return t(
      "No configured stamp types found.",
      "No configured stamp types found.",
    );
  }, [availableStampTypes.length, isConfigured, isLoadingAvailableStampTypes, t]);

  useEffect(() => {
    clearStampTypeContext();

    if (parsedStampTypeId === null) {
      return;
    }

    void loadStampTypeContext(parsedStampTypeId);
  }, [clearStampTypeContext, loadStampTypeContext, parsedStampTypeId]);

  useEffect(() => {
    if (parsedStampTypeId !== null && hasLoadedCurrentStampType) {
      return;
    }

    setCode("");
    setName("");
    setSchemaCID("");
    setActive(true);
    setSingleton(false);
  }, [hasLoadedCurrentStampType, parsedStampTypeId]);

  useEffect(() => {
    if (!currentConfig || !hasRenderableCurrentConfig) {
      return;
    }

    setCode(currentConfig.code);
    setName(currentConfig.name);
    setSchemaCID(currentConfig.schemaCID);
    setActive(currentConfig.active);
    setSingleton(currentConfig.singleton);
  }, [currentConfig, hasRenderableCurrentConfig]);

  const isChronicleOwner =
    Boolean(connectedAddress) &&
    Boolean(chronicleOwner) &&
    connectedAddress.toLowerCase() === chronicleOwner.toLowerCase();
  const ownerLabel = isLoadingChronicleOwner
    ? t("Loading...", "Loading...")
    : chronicleOwner || t("Unavailable", "Unavailable");
  const connectedWalletLabel = connectedAddress || t("Not connected", "Not connected");
  const networkLabel = `${targetChainName} / ${
    isConnected ? currentChainName : t("Disconnected", "Disconnected")
  }`;
  const accessLabel = isLoadingChronicleOwner
    ? t("Checking", "Checking")
    : isChronicleOwner
      ? t("Owner Access", "Owner Access")
      : hasLoadedCurrentStampType
        ? isStampTypeAdmin
          ? t("Type Admin Access", "Type Admin Access")
          : t("Read Only", "Read Only")
        : t("Load Type", "Load Type");
  const accessHint = isLoadingChronicleOwner
    ? t(
        "Loading chronicle ownership for this wallet.",
        "Loading chronicle ownership for this wallet.",
      )
    : isChronicleOwner
      ? t(
          "This wallet can configure any stamp type.",
          "This wallet can configure any stamp type.",
        )
      : hasLoadedCurrentStampType
        ? isStampTypeAdmin
          ? t(
              "This wallet can configure the loaded stamp type.",
              "This wallet can configure the loaded stamp type.",
            )
          : t(
              "This wallet cannot configure the loaded stamp type.",
              "This wallet cannot configure the loaded stamp type.",
            )
        : t(
            "Load a stamp type to resolve access for this editor.",
            "Load a stamp type to resolve access for this editor.",
          );
  const accessToneClass = isLoadingChronicleOwner
    ? "text-slate-500"
    : isChronicleOwner || isStampTypeAdmin
      ? "text-emerald-700"
      : hasLoadedCurrentStampType
        ? "text-amber-700"
        : "text-slate-700";
  const configuredTypeCountLabel = isLoadingAvailableStampTypes
    ? t("Loading...", "Loading...")
    : availableStampTypes.length.toString();
  const editorStatusClassName = isLoadingStampType
    ? "border-sky-200 bg-sky-50 text-sky-900"
    : hasRenderableCurrentConfig
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : parsedStampTypeId !== null && hasLoadedCurrentStampType
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-slate-200 bg-slate-50 text-slate-700";
  const editorStatusTitle = isLoadingStampType
    ? t("Loading", "Loading")
    : hasRenderableCurrentConfig
      ? t("Loaded", "Loaded")
      : parsedStampTypeId !== null && hasLoadedCurrentStampType
        ? t("Unconfigured", "Unconfigured")
        : t("No Type Selected", "No Type Selected");
  const editorStatusDescription = isLoadingStampType
    ? t(
        "Reading the current stamp type config and access state.",
        "Reading the current stamp type config and access state.",
      )
    : hasRenderableCurrentConfig
      ? t(
          "The current on-chain config is ready for editing.",
          "The current on-chain config is ready for editing.",
        )
      : parsedStampTypeId !== null && hasLoadedCurrentStampType
        ? t(
            "No on-chain config exists yet for this stamp type.",
            "No on-chain config exists yet for this stamp type.",
          )
        : t(
            "Enter a stamp type ID to start editing.",
            "Enter a stamp type ID to start editing.",
          );
  const currentRoleLabel = isChronicleOwner
    ? t("Chronicle Owner", "Chronicle Owner")
    : isStampTypeAdmin
      ? t("Stamp Type Admin", "Stamp Type Admin")
      : t("No Type Access", "No Type Access");

  return (
    <PassportShell currentKey="stamp-types">
      <PassportTransactionSuccessNotice
        message={successNoticeMessage}
        onClose={clearSuccessNotice}
      />
      <div className="passport-dashboard-body">
        <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
          <div className="passport-dashboard-primary__grid relative">
            <div className="passport-dashboard-primary__content space-y-5">
              <span className="passport-dashboard-primary__header">
                {t("Stamp Type Admin", "Stamp Type Admin")}
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                  {t("Configure chronicle stamp types.", "Configure chronicle stamp types.")}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "Load one stamp type and update its on-chain config.",
                    "Load one stamp type and update its on-chain config.",
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
                      {ownerLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    ChronicleStamp
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">
                      {t("Target / Current Network", "Target / Current Network")}
                    </p>
                    <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-cyan-700">
                      {networkLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 break-all font-medium text-slate-900">
                    {connectedWalletLabel}
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">
                      {t("Configured Types", "Configured Types")}
                    </p>
                    <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-cyan-700">
                      {configuredTypeCountLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {t(
                      "Indexed from latest StampTypeConfigured events.",
                      "Indexed from latest StampTypeConfigured events.",
                    )}
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
                  {t("Configure Stamp Type", "Configure Stamp Type")}
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-5">
              <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="panel-soft p-5">
                  <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="meta-label">{t("Stamp Type Context", "Stamp Type Context")}</p>
                    </div>

                    <div className="passport-dashboard-primary__actions">
                      <button
                        type="button"
                        onClick={() => void loadAvailableStampTypes()}
                        disabled={isLoadingAvailableStampTypes}
                        className="passport-action-button passport-action-button--secondary"
                      >
                        <RefreshCw
                          size={16}
                          className={isLoadingAvailableStampTypes ? "animate-spin" : ""}
                        />
                        {t("Refresh List", "Refresh List")}
                      </button>
                      <button
                        onClick={() => {
                          if (parsedStampTypeId === null) {
                            return;
                          }

                          void loadStampTypeContext(parsedStampTypeId);
                        }}
                        disabled={parsedStampTypeId === null || isLoadingStampType}
                        className="passport-action-button passport-action-button--secondary"
                      >
                        <RefreshCw size={16} className={isLoadingStampType ? "animate-spin" : ""} />
                        {t("Load", "Load")}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white/80 p-5">
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
                </div>

                <div className={`rounded-3xl border px-5 py-5 ${editorStatusClassName}`}>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] opacity-70">
                    {t("Editor Status", "Editor Status")}
                  </p>
                  <p className="mt-3 text-lg font-black tracking-tight">{editorStatusTitle}</p>
                  <p className="mt-2 text-sm font-medium leading-6 opacity-85">
                    {editorStatusDescription}
                  </p>

                  <div className="mt-4 rounded-2xl border border-black/10 bg-white/75 px-4 py-4 text-slate-900">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                      {t("Current Context", "Current Context")}
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          {t("Stamp Type ID", "Stamp Type ID")}
                        </p>
                        <p className="font-mono text-sm font-semibold text-slate-900">
                          {parsedStampTypeId?.toString() || "--"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                          {t("Role", "Role")}
                        </p>
                        <p className="text-sm font-semibold text-slate-900">{currentRoleLabel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="panel-soft p-5">
                  <label className="meta-label" htmlFor="stamp-type-code">
                    Code
                  </label>
                  <input
                    id="stamp-type-code"
                    type="text"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="AUTHENTIC"
                    className="passport-dashboard-query__input mt-3 h-12"
                  />
                </div>

                <div className="panel-soft p-5">
                  <label className="meta-label" htmlFor="stamp-type-name">
                    {t("Name", "Name")}
                  </label>
                  <input
                    id="stamp-type-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={t("Official Authentication", "Official Authentication")}
                    className="passport-dashboard-query__input mt-3 h-12"
                  />
                </div>
              </div>

              <div className="panel-soft p-5">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <p className="meta-label">{t("Schema Config", "Schema Config")}</p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                      {t("Bind Schema CID", "Bind Schema CID")}
                    </h3>
                  </div>

                  <div className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-600 shadow-sm">
                    StampTypeConfig.schemaCID
                  </div>
                </div>

                <textarea
                  id="stamp-type-schema"
                  value={schemaCID}
                  onChange={(event) => setSchemaCID(event.target.value)}
                  placeholder="ipfs://bafy.../stamp-schema.json"
                  rows={3}
                  className="mt-5 w-full resize-y rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />

                <div className="passport-dashboard-primary__actions mt-4">
                  <button
                    type="button"
                    onClick={() =>
                      setSchemaCID(hasRenderableCurrentConfig ? currentConfig?.schemaCID || "" : "")
                    }
                    className="passport-action-button passport-action-button--secondary"
                  >
                    <RefreshCw size={16} />
                    {t("Use Loaded Value", "Use Loaded Value")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSchemaCID("")}
                    className="passport-action-button passport-action-button--secondary"
                  >
                    {t("Clear", "Clear")}
                  </button>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 px-5 py-4">
                  <p className="meta-label">{t("Schema CID To Submit", "Schema CID To Submit")}</p>
                  <div className="mt-3 flex items-start gap-3">
                    <div className="mt-0.5 text-sky-600">
                      <Link2 size={16} />
                    </div>
                    <p className="min-w-0 break-all font-mono text-sm text-slate-700">
                      {trimmedSchemaCID ||
                        t(
                          "Empty. Submitting now will write an empty string.",
                          "Empty. Submitting now will write an empty string.",
                        )}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <CidComposer
                    accent="sky"
                    defaultText={`{\n  "$schema": "https://json-schema.org/draft/2020-12/schema",\n  "title": "",\n  "type": "object",\n  "properties": {},\n  "required": []\n}`}
                    fieldKey="stamp_type_schema"
                    framed={false}
                    suggestedFileName="stamp-type-schema.json"
                    value={schemaCID}
                    onChange={setSchemaCID}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(event) => setActive(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {t("Active", "Active")}
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={singleton}
                    onChange={(event) => setSingleton(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {t("Singleton", "Singleton")}
                </label>
              </div>

              <div className="panel-soft p-5">
                <p className="meta-label">{t("Submit Changes", "Submit Changes")}</p>
                <div className="passport-dashboard-primary__actions mt-4">
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
                    disabled={!canSubmitStampType}
                    className="passport-action-button passport-action-button--primary"
                  >
                    <Layers3 size={16} />
                    {isSubmitting
                      ? t("Submitting...", "Submitting...")
                      : t("Configure Stamp Type", "Configure Stamp Type")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("Stamp Type Snapshot", "Stamp Type Snapshot")}
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("Loaded Type", "Loaded Type")}</p>
                  <p className="mt-3 font-mono text-sm font-semibold text-slate-900">
                    {hasLoadedCurrentStampType && parsedStampTypeId !== null
                      ? `#${parsedStampTypeId.toString()}`
                      : t("Not loaded", "Not loaded")}
                  </p>
                </div>

                <div className="panel-soft p-5">
                  <p className="meta-label">{t("Current Role", "Current Role")}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">{currentRoleLabel}</p>
                </div>
              </div>

              {hasRenderableCurrentConfig ? (
                <>
                  <div className="panel-soft p-5">
                    <p className="meta-label">{t("Code / Name", "Code / Name")}</p>
                    <p className="mt-3 font-semibold text-slate-900">
                      {currentConfig?.code || "NO_CODE"} /{" "}
                      {currentConfig?.name || t("Unnamed", "Unnamed")}
                    </p>
                  </div>
                  <div className="panel-soft p-5">
                    <p className="meta-label">{t("State", "State")}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      {currentConfig?.active ? t("Active", "Active") : t("Inactive", "Inactive")} /{" "}
                      {currentConfig?.singleton
                        ? t("Singleton", "Singleton")
                        : t("Repeatable", "Repeatable")}
                    </p>
                  </div>
                  <div className="panel-soft p-5">
                    <p className="meta-label">Schema CID</p>
                    <p className="mt-3 break-all font-mono text-sm text-slate-700">
                      {currentConfig?.schemaCID || t("Not set", "Not set")}
                    </p>
                  </div>
                </>
              ) : parsedStampTypeId !== null && hasLoadedCurrentStampType ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                  {t("No on-chain config yet.", "No on-chain config yet.")}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                  {t("Load a stamp type ID.", "Load a stamp type ID.")}
                </div>
              )}

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

              <div className="panel-soft p-5">
                <p className="meta-label">{t("Chronicle Contract", "Chronicle Contract")}</p>
                <p className="mt-3 break-all font-mono text-sm text-slate-700">
                  {CHRONICLE_STAMP_ADDRESS || t("Not configured", "Not configured")}
                </p>
              </div>
            </div>
          </div>

          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start justify-between gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("Configured Stamp Types", "Configured Stamp Types")}
                </h2>
              </div>

              <button
                onClick={() => void loadAvailableStampTypes()}
                disabled={isLoadingAvailableStampTypes}
                className="passport-action-button passport-action-button--secondary"
              >
                <RefreshCw
                  size={16}
                  className={isLoadingAvailableStampTypes ? "animate-spin" : ""}
                />
                {t("Refresh List", "Refresh List")}
              </button>
            </div>

            <div className="mt-8 space-y-4">
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
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-black tracking-tight text-slate-900">
                            {`#${typeOption.stampTypeId.toString()} / ${
                              typeOption.name || t("Unnamed", "Unnamed")
                            }`}
                          </p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {typeOption.code || "NO_CODE"}
                          </p>
                        </div>
                        <div className="text-right text-xs font-semibold text-slate-600">
                          <div>
                            {typeOption.active ? t("Active", "Active") : t("Inactive", "Inactive")}
                          </div>
                          <div className="mt-1">
                            {typeOption.singleton
                              ? t("Singleton", "Singleton")
                              : t("Repeatable", "Repeatable")}
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
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
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
        </section>
      </div>
    </PassportShell>
  );
}
