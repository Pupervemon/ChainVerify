import { Copy, ExternalLink, RefreshCw, ShieldCheck, Tags } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { TARGET_CHAIN } from "../../../config/network";
import {
  isPassportAddress,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import PassportShell from "../components/PassportShell";
import {
  type IssuerPolicyRecord,
  type IssuerPolicyScope,
  usePassportIssuerPolicyAdmin,
} from "../hooks/usePassportIssuerPolicyAdmin";
import { usePassportIssuerPolicyList } from "../hooks/usePassportIssuerPolicyList";
import { usePassportLocale } from "../i18n";
import type { IssuerPolicySnapshot } from "../utils/passportIssuerPolicyIndex";

type PassportIssuerPolicyPageProps = {
  connectedAddress: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

const toUnixSeconds = (value: string) => {
  if (!value.trim()) {
    return 0n;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : BigInt(Math.floor(timestamp / 1000));
};

const toDateTimeLocalValue = (value: bigint) => {
  if (value === 0n) {
    return "";
  }

  const date = new Date(Number(value) * 1000);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const pad = (segment: number) => segment.toString().padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};

export default function PassportIssuerPolicyPage(props: PassportIssuerPolicyPageProps) {
  const { connectedAddress, ensureSupportedChain, hasCorrectChain, isConnected } = props;
  const { t } = usePassportLocale();
  const [searchParams] = useSearchParams();
  const initialScopeParam = searchParams.get("scope");
  const initialScope: IssuerPolicyScope =
    initialScopeParam === "type" || initialScopeParam === "passport" ? initialScopeParam : "global";
  const [scope, setScope] = useState<IssuerPolicyScope>(initialScope);
  const [issuerAddress, setIssuerAddress] = useState(searchParams.get("issuer") || "");
  const [stampTypeId, setStampTypeId] = useState(searchParams.get("stampTypeId") || "");
  const [passportId, setPassportId] = useState(searchParams.get("passportId") || "");
  const [enabled, setEnabled] = useState(false);
  const [restrictToExplicitPassportList, setRestrictToExplicitPassportList] = useState(false);
  const [validAfter, setValidAfter] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [policyCID, setPolicyCID] = useState("");
  const [allowlistModeInput, setAllowlistModeInput] = useState(false);
  const {
    authorityOwner,
    currentPolicy,
    error,
    isAuthorityOwner,
    isConfigured,
    isLoadingAuthorityOwner,
    isLoadingPolicy,
    isSubmitting,
    lastConfirmedTxHash,
    loadPolicyContext,
    passportAllowlistMode,
    setIssuerPolicy,
    setPassportAllowlistMode,
    statusMessage,
  } = usePassportIssuerPolicyAdmin({
    address: connectedAddress,
    ensureSupportedChain,
    hasCorrectChain,
    isConnected,
  });
  const {
    activePolicyCount,
    error: policyListError,
    isConfigured: isPolicyListConfigured,
    isLoading: isLoadingPolicyList,
    policies,
    refreshPolicyList,
  } = usePassportIssuerPolicyList();

  const normalizedIssuer = issuerAddress.trim();
  const blockExplorerBaseUrl = TARGET_CHAIN.blockExplorers?.default.url?.replace(/\/$/, "") || "";
  const hasValidIssuer = useMemo(() => isPassportAddress(normalizedIssuer), [normalizedIssuer]);
  const parsedStampTypeId = useMemo(
    () => (/^\d+$/.test(stampTypeId.trim()) ? BigInt(stampTypeId.trim()) : null),
    [stampTypeId],
  );
  const parsedPassportId = useMemo(
    () => (/^\d+$/.test(passportId.trim()) ? BigInt(passportId.trim()) : null),
    [passportId],
  );
  const parsedValidAfter = useMemo(() => toUnixSeconds(validAfter), [validAfter]);
  const parsedValidUntil = useMemo(() => toUnixSeconds(validUntil), [validUntil]);
  const activePolicyCountLabel = isLoadingPolicyList
    ? "--"
    : activePolicyCount.toString().padStart(2, "0");

  const canLoadContext =
    hasValidIssuer &&
    (scope === "global" ||
      (scope === "type" && parsedStampTypeId !== null) ||
      (scope === "passport" && parsedPassportId !== null));

  const canSubmitPolicy =
    isAuthorityOwner &&
    canLoadContext &&
    parsedValidAfter !== null &&
    parsedValidUntil !== null &&
    (parsedValidUntil === 0n || parsedValidAfter === 0n || parsedValidUntil >= parsedValidAfter);

  useEffect(() => {
    if (!currentPolicy) {
      return;
    }

    setEnabled(currentPolicy.enabled);
    setRestrictToExplicitPassportList(currentPolicy.restrictToExplicitPassportList);
    setValidAfter(toDateTimeLocalValue(currentPolicy.validAfter));
    setValidUntil(toDateTimeLocalValue(currentPolicy.validUntil));
    setPolicyCID(currentPolicy.policyCID);
  }, [currentPolicy]);

  useEffect(() => {
    if (passportAllowlistMode === null) {
      return;
    }

    setAllowlistModeInput(passportAllowlistMode);
  }, [passportAllowlistMode]);

  useEffect(() => {
    if (!lastConfirmedTxHash) {
      return;
    }

    void refreshPolicyList();
  }, [lastConfirmedTxHash, refreshPolicyList]);

  useEffect(() => {
    if (!canLoadContext) {
      return;
    }

    void loadPolicyContext({
      issuerAddress: normalizedIssuer,
      passportId: parsedPassportId ?? undefined,
      scope,
      stampTypeId: parsedStampTypeId ?? undefined,
    });
  }, [
    canLoadContext,
    loadPolicyContext,
    normalizedIssuer,
    parsedPassportId,
    parsedStampTypeId,
    scope,
  ]);

  const currentPolicyStateLabel = (policy: IssuerPolicyRecord | null) => {
    if (!policy) {
      return t("Not loaded", "Not loaded");
    }

    return policy.enabled ? t("Enabled", "Enabled") : t("Disabled", "Disabled");
  };

  const scopeLabel =
    scope === "global"
      ? t("Global", "Global")
      : scope === "type"
        ? t("Type", "Type")
        : t("Passport", "Passport");
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
        "当前钱包可以管理发章授权。",
        "This wallet can manage issuer authorization.",
      )
      : t(
        "只有 authority owner 可以管理发章授权。",
        "Only the authority owner can manage issuer authorization.",
      );
  const accessToneClass = isAccessPending
    ? "text-slate-500"
    : isAuthorityOwner
      ? "text-emerald-700"
      : "text-amber-700";

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Ignore clipboard failures so the list remains usable.
    }
  };

  const loadPolicyIntoForm = (policy: IssuerPolicySnapshot) => {
    setScope(policy.scope);
    setIssuerAddress(policy.address);
    setStampTypeId(policy.scope === "type" && policy.stampTypeId !== null ? policy.stampTypeId.toString() : "");
    setPassportId(
      policy.scope === "passport" && policy.passportId !== null ? policy.passportId.toString() : "",
    );
  };

  const renderPolicyGroup = (
    groupScope: IssuerPolicyScope,
    title: string,
    description: string,
    items: IssuerPolicySnapshot[],
  ) => (
    <div className="panel-soft p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="meta-label">{title}</p>
          <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">{description}</p>
        </div>
        <span className="inline-flex min-w-14 items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-700">
          {String(items.length).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-5">
        {items.length > 0 ? (
          <div className="passport-dashboard-address-list">
            {items.map((policy, index) => {
              const addressHref = blockExplorerBaseUrl
                ? `${blockExplorerBaseUrl}/address/${policy.address}`
                : "";
              const contextBadge =
                groupScope === "global"
                  ? t("全局授权", "Global Authorization")
                  : groupScope === "type"
                    ? t(
                        `类型 #${policy.stampTypeId?.toString() ?? "--"}`,
                        `Type #${policy.stampTypeId?.toString() ?? "--"}`,
                      )
                    : t(
                        `Passport #${policy.passportId?.toString() ?? "--"}`,
                        `Passport #${policy.passportId?.toString() ?? "--"}`,
                      );

              return (
                <div
                  key={`${policy.scope}:${policy.address.toLowerCase()}:${policy.stampTypeId?.toString() ?? "na"}:${policy.passportId?.toString() ?? "na"}`}
                  className="passport-dashboard-address-item"
                >
                  <div className="passport-dashboard-address-item__header">
                    <span className="passport-dashboard-address-item__label">
                      {t("已授权地址", "Authorized Address")}{" "}
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                      {contextBadge}
                    </span>
                  </div>

                  <div className="passport-dashboard-address-item__value">
                    <div className="passport-dashboard-address-item__row">
                      <span className="passport-dashboard-address-item__link is-static">
                        {policy.address}
                      </span>
                      <div className="passport-dashboard-address-item__actions">
                        <button
                          type="button"
                          onClick={() => loadPolicyIntoForm(policy)}
                          className="passport-dashboard-address-item__action"
                        >
                          {t("Load", "Load")}
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleCopyAddress(policy.address)}
                          className="passport-dashboard-address-item__action"
                        >
                          <Copy size={12} />
                          {t("Copy", "Copy")}
                        </button>
                        {addressHref ? (
                          <a
                            href={addressHref}
                            target="_blank"
                            rel="noreferrer"
                            className="passport-dashboard-address-item__action"
                          >
                            <ExternalLink size={12} />
                            {t("Explorer", "Explorer")}
                          </a>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="passport-dashboard-address-item__action is-disabled"
                            title={t(
                              "当前链没有配置区块浏览器。",
                              "No block explorer is configured for the current chain.",
                            )}
                          >
                            <ExternalLink size={12} />
                            {t("Explorer", "Explorer")}
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-xs font-medium text-slate-500">
                      {policy.policyCID
                        ? t(
                            `最新文档 CID: ${policy.policyCID}`,
                            `Latest document CID: ${policy.policyCID}`,
                          )
                        : t(
                            "最新授权快照未设置 CID。",
                            "Latest authorization snapshot has no CID set.",
                          )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600">
            {groupScope === "global"
              ? t(
                  "当前没有已索引的全局发章授权。",
                  "No active global issuer authorization is currently indexed.",
                )
              : groupScope === "type"
                ? t(
                    "当前没有已索引的类型级发章授权。",
                    "No active type-level issuer authorization is currently indexed.",
                  )
                : t(
                    "当前没有已索引的 Passport 级发章授权。",
                    "No active passport-level issuer authorization is currently indexed.",
                  )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <PassportShell currentKey="policies">
      <div className="passport-dashboard-body">
        <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
          <div className="passport-dashboard-primary__grid relative">
            <div className="passport-dashboard-primary__content space-y-5">
              <span className="passport-dashboard-primary__header">
                {t("发章授权", "Issuer Authorization")}
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                  {t(
                    "按全局、类型和 Passport 范围管理发章授权。",
                    "Manage issuer authorization across global, type, and passport scope.",
                  )}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "加载一个 issuer 上下文并更新授权设置。",
                    "Load one issuer context and update authorization settings.",
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
                      {t("Current Scope", "Current Scope")}
                    </p>
                    <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-cyan-700">
                      {scopeLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {connectedWalletLabel}
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">
                      {t("Authorized Entries", "Authorized Entries")}
                    </p>
                    <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-cyan-700">
                      {activePolicyCountLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {t(
                      "Indexed from latest issuer policy events across global, type, and passport scope.",
                      "Indexed from latest issuer policy events across global, type, and passport scope.",
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
                  {t("配置授权", "Configure Authorization")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "选择范围并加载 issuer 上下文，然后更新状态、有效期和文档 CID。",
                    "Select a scope, load the issuer context, then update status, validity, and document CID.",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="panel-soft p-5">
                <p className="meta-label">{t("授权范围", "Authorization Scope")}</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {(["global", "type", "passport"] as const).map((candidateScope) => (
                    <button
                      key={candidateScope}
                      onClick={() => setScope(candidateScope)}
                      className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] transition-all ${
                        scope === candidateScope
                          ? "border border-sky-200 bg-sky-50 text-sky-700"
                          : "border border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:text-sky-600"
                      }`}
                    >
                      {candidateScope === "global"
                        ? t("Global", "Global")
                        : candidateScope === "type"
                          ? t("Type", "Type")
                          : t("Passport", "Passport")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="issuer-address">
                  {t("Issuer Address", "Issuer Address")}
                </label>
                <input
                  id="issuer-address"
                  type="text"
                  value={issuerAddress}
                  onChange={(event) => setIssuerAddress(event.target.value)}
                  placeholder="0x..."
                  className="passport-dashboard-query__input mt-3 h-12 font-mono"
                />
              </div>

              {scope === "type" ? (
                <div className="panel-soft p-5">
                  <label className="meta-label" htmlFor="type-stamp-type-id">
                    {t("Stamp Type ID", "Stamp Type ID")}
                  </label>
                  <input
                    id="type-stamp-type-id"
                    type="text"
                    value={stampTypeId}
                    onChange={(event) => setStampTypeId(event.target.value)}
                    placeholder="1"
                    className="passport-dashboard-query__input mt-3 h-12 font-mono"
                  />
                </div>
              ) : null}

              {scope === "passport" ? (
                <div className="panel-soft p-5">
                  <label className="meta-label" htmlFor="type-passport-id">
                    {t("Passport ID", "Passport ID")}
                  </label>
                  <input
                    id="type-passport-id"
                    type="text"
                    value={passportId}
                    onChange={(event) => setPassportId(event.target.value)}
                    placeholder="1"
                    className="passport-dashboard-query__input mt-3 h-12 font-mono"
                  />
                </div>
              ) : null}

              <div className="passport-dashboard-primary__actions">
                <button
                  onClick={() => {
                    if (!canLoadContext) {
                      return;
                    }

                    void loadPolicyContext({
                      issuerAddress: normalizedIssuer,
                      passportId: parsedPassportId ?? undefined,
                      scope,
                      stampTypeId: parsedStampTypeId ?? undefined,
                    });
                  }}
                  disabled={!canLoadContext || isLoadingPolicy}
                  className="passport-action-button passport-action-button--secondary"
                >
                  <RefreshCw size={16} className={isLoadingPolicy ? "animate-spin" : ""} />
                  {t("加载授权", "Load Authorization")}
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(event) => setEnabled(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {t("启用授权", "Enable Authorization")}
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={restrictToExplicitPassportList}
                    onChange={(event) => setRestrictToExplicitPassportList(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {t(
                    "要求 Passport 级授权",
                    "Require Passport-Level Authorization",
                  )}
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="panel-soft p-5">
                  <label className="meta-label" htmlFor="valid-after">
                    {t("Valid After", "Valid After")}
                  </label>
                  <input
                    id="valid-after"
                    type="datetime-local"
                    value={validAfter}
                    onChange={(event) => setValidAfter(event.target.value)}
                    className="passport-dashboard-query__input mt-3 h-12"
                  />
                </div>
                <div className="panel-soft p-5">
                  <label className="meta-label" htmlFor="valid-until">
                    {t("Valid Until", "Valid Until")}
                  </label>
                  <input
                    id="valid-until"
                    type="datetime-local"
                    value={validUntil}
                    onChange={(event) => setValidUntil(event.target.value)}
                    className="passport-dashboard-query__input mt-3 h-12"
                  />
                </div>
              </div>

              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="policy-cid">
                  {t("授权文档 CID", "Authorization Document CID")}
                </label>
                <input
                  id="policy-cid"
                  type="text"
                  value={policyCID}
                  onChange={(event) => setPolicyCID(event.target.value)}
                  placeholder="ipfs://..."
                  className="passport-dashboard-query__input mt-3 h-12"
                />
              </div>

              <div className="passport-dashboard-primary__actions">
                <button
                  onClick={() => {
                    if (!canSubmitPolicy) {
                      return;
                    }

                    void setIssuerPolicy(
                      {
                        issuerAddress: normalizedIssuer,
                        passportId: parsedPassportId ?? undefined,
                        scope,
                        stampTypeId: parsedStampTypeId ?? undefined,
                      },
                      {
                        enabled,
                        policyCID,
                        restrictToExplicitPassportList,
                        validAfter: parsedValidAfter ?? 0n,
                        validUntil: parsedValidUntil ?? 0n,
                      },
                    );
                  }}
                  disabled={!canSubmitPolicy || isSubmitting}
                  className="passport-action-button passport-action-button--primary"
                >
                  <ShieldCheck size={16} />
                  {isSubmitting ? t("提交中...", "Submitting...") : t("保存授权", "Save Authorization")}
                </button>
              </div>

              {scope === "passport" && parsedPassportId !== null ? (
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("Passport 白名单强制模式", "Passport Allowlist Enforcement")}</p>
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    {t(
                      "开启后，该 Passport 仅接受显式的 Passport 级授权。",
                      "When enabled, this passport only accepts explicit passport-level authorization.",
                    )}
                  </p>
                  <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={allowlistModeInput}
                      onChange={(event) => setAllowlistModeInput(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    {t("启用白名单强制模式", "Enable Allowlist Enforcement")}
                  </label>
                  <div className="passport-dashboard-primary__actions mt-4">
                    <button
                      onClick={() => void setPassportAllowlistMode(parsedPassportId, allowlistModeInput)}
                      disabled={!isAuthorityOwner || isSubmitting}
                      className="passport-action-button passport-action-button--secondary"
                    >
                      <Tags size={16} />
                      {t("更新白名单强制模式", "Update Allowlist Enforcement")}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("授权快照", "Authorization Snapshot")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "查看当前已加载的授权状态。",
                    "Review the currently loaded authorization before making changes.",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("Scope", "Scope")}</p>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                    {scopeLabel}
                  </p>
                </div>
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("当前授权状态", "Current Authorization Status")}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    {currentPolicyStateLabel(currentPolicy)}
                  </p>
                </div>
              </div>

              {currentPolicy ? (
                <>
                  <div className="panel-soft p-5">
                    <p className="meta-label">{t("Validity Window", "Validity Window")}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      {currentPolicy.validAfter === 0n
                        ? t("No start limit", "No start limit")
                        : t(
                          `Starts at ${new Date(Number(currentPolicy.validAfter) * 1000).toLocaleString()}`,
                          `Starts at ${new Date(Number(currentPolicy.validAfter) * 1000).toLocaleString()}`,
                        )}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {currentPolicy.validUntil === 0n
                        ? t("No expiration", "No expiration")
                        : t(
                          `Expires at ${new Date(Number(currentPolicy.validUntil) * 1000).toLocaleString()}`,
                          `Expires at ${new Date(Number(currentPolicy.validUntil) * 1000).toLocaleString()}`,
                        )}
                    </p>
                  </div>

                  <div className="panel-soft p-5">
                    <p className="meta-label">{t("授权文档 CID", "Authorization Document CID")}</p>
                    <p className="mt-3 break-all font-mono text-sm text-slate-700">
                      {currentPolicy.policyCID || t("Not set", "Not set")}
                    </p>
                  </div>
                </>
              ) : null}

              {scope === "passport" ? (
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("白名单强制模式", "Allowlist Enforcement")}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    {passportAllowlistMode === null
                      ? t("Not loaded", "Not loaded")
                      : passportAllowlistMode
                        ? t("Enabled", "Enabled")
                        : t("Disabled", "Disabled")}
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

              <div className="panel-soft p-5">
                <p className="meta-label">{t("Authority Contract", "Authority Contract")}</p>
                <p className="mt-3 break-all font-mono text-sm text-slate-700">
                  {PASSPORT_AUTHORITY_ADDRESS || t("Not configured", "Not configured")}
                </p>
              </div>
            </div>
          </div>

          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start justify-between gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("已授权地址", "Authorized Addresses")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "按范围查看已授权地址，并一键载入编辑器。",
                    "Browse authorized addresses by scope, then load any entry into the editor.",
                  )}
                </p>
              </div>

              <button
                onClick={() => void refreshPolicyList()}
                disabled={!isPolicyListConfigured || isLoadingPolicyList}
                className="passport-action-button passport-action-button--secondary"
              >
                <RefreshCw size={16} className={isLoadingPolicyList ? "animate-spin" : ""} />
                {t("Refresh List", "Refresh List")}
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900">
                <p className="font-semibold">{t("On-chain Source", "On-chain Source")}</p>
                <p className="mt-2">
                  {t(
                    "由于 PassportAuthority 不暴露可枚举的 issuer 授权映射，这个列表会根据最新的 GlobalIssuerPolicySet、TypeIssuerPolicySet 和 PassportIssuerPolicySet 事件重建。它只反映各范围的启用状态；精确时间窗口仍需查看快照面板。",
                    "Because PassportAuthority does not expose enumerable issuer authorization mappings, this list is rebuilt from the latest GlobalIssuerPolicySet, TypeIssuerPolicySet, and PassportIssuerPolicySet events. It reflects enabled states by scope; exact validity windows still need the snapshot panel.",
                  )}
                </p>
              </div>

              {policyListError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {policyListError}
                </div>
              ) : null}

              {!isPolicyListConfigured ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {t(
                    "Passport contracts are not configured in the frontend environment.",
                    "Passport contracts are not configured in the frontend environment.",
                  )}
                </div>
              ) : isLoadingPolicyList ? (
                <div className="panel-soft p-5 text-sm font-semibold text-slate-700">
                  {t(
                    "正在从 PassportAuthority 事件加载已授权地址列表...",
                    "Loading authorized address lists from PassportAuthority events...",
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {renderPolicyGroup(
                    "global",
                    t("Global Scope", "Global Scope"),
                    t(
                      "这些地址当前具有全局发章授权。",
                      "These addresses currently have active global issuer authorization.",
                    ),
                    policies.global,
                  )}
                  {renderPolicyGroup(
                    "type",
                    t("Type Scope", "Type Scope"),
                    t(
                      "这些地址当前被授权为一个或多个指定类型发章。",
                      "These addresses are currently authorized for one or more stamp types.",
                    ),
                    policies.type,
                  )}
                  {renderPolicyGroup(
                    "passport",
                    t("Passport Scope", "Passport Scope"),
                    t(
                      "这些地址当前被授权为一个或多个指定 Passport 发章。",
                      "These addresses are currently authorized for one or more passports.",
                    ),
                    policies.passport,
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </PassportShell>
  );
}
