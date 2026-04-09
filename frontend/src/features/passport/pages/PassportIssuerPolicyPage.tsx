import { Copy, ExternalLink, RefreshCw, ShieldCheck, Tags } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import ModalDialog from '../../../components/ModalDialog';
import { TARGET_CHAIN } from "../../../config/network";
import {
  isPassportAddress,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import CidComposer from "../components/CidComposer";
import PassportShell from "../components/PassportShell";
import PassportTransactionSuccessNotice from "../components/PassportTransactionSuccessNotice";
import {
  type IssuerPolicyRecord,
  type IssuerPolicyScope,
  usePassportIssuerPolicyAdmin,
} from "../hooks/usePassportIssuerPolicyAdmin";
import { usePassportIssuerPolicyList } from "../hooks/usePassportIssuerPolicyList";
import { usePassportTransactionSuccessNotice } from "../hooks/usePassportTransactionSuccessNotice";
import { usePassportLocale } from "../i18n";
import { CID_PRESET_BY_KEY } from "../utils/cidPresets";
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

const buildIssuerPolicyContextKey = (query: {
  issuerAddress: string;
  passportId?: bigint;
  scope: IssuerPolicyScope;
  stampTypeId?: bigint;
}) =>
  [
    query.scope,
    query.issuerAddress.toLowerCase(),
    query.stampTypeId?.toString() ?? "na",
    query.passportId?.toString() ?? "na",
  ].join(":");


const policyDocumentPreset = CID_PRESET_BY_KEY.policy;
export default function PassportIssuerPolicyPage(props: PassportIssuerPolicyPageProps) {
  const { connectedAddress, ensureSupportedChain, hasCorrectChain, isConnected } = props;
  const { t } = usePassportLocale();
  const [searchParams] = useSearchParams();
  const initialScopeParam = searchParams.get("scope");
  const hasInitialContextSearch = Boolean(
    initialScopeParam ||
      searchParams.get("issuer") ||
      searchParams.get("stampTypeId") ||
      searchParams.get("passportId"),
  );
  const initialScope: IssuerPolicyScope =
    initialScopeParam === "type" || initialScopeParam === "passport" ? initialScopeParam : "global";
  const initialContextAutoloadedRef = useRef(false);
  const [scope, setScope] = useState<IssuerPolicyScope>(initialScope);
  const [policyDirectoryScope, setPolicyDirectoryScope] = useState<IssuerPolicyScope>(initialScope);
  const [issuerAddress, setIssuerAddress] = useState(searchParams.get("issuer") || "");
  const [stampTypeId, setStampTypeId] = useState(searchParams.get("stampTypeId") || "");
  const [passportId, setPassportId] = useState(searchParams.get("passportId") || "");
  const [enabled, setEnabled] = useState(false);
  const [restrictToExplicitPassportList, setRestrictToExplicitPassportList] = useState(false);
  const [validAfter, setValidAfter] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [policyCID, setPolicyCID] = useState("");
  const [allowlistModeInput, setAllowlistModeInput] = useState(false);
  const [isSaveFeedbackOpen, setIsSaveFeedbackOpen] = useState(false);
  const {
    authorityOwner,
    currentPolicy,
    error,
    isAuthorityOwner,
    isConfigured,
    isLoadingAuthorityOwner,
    isLoadingPolicy,
    isSubmitting,
    lastLoadedQuery,
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
  const { clearSuccessNotice, successNoticeMessage } = usePassportTransactionSuccessNotice({
    error,
    isSubmitting,
    statusMessage,
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
  const currentDraftQuery = useMemo(
    () =>
      canLoadContext
        ? {
            issuerAddress: normalizedIssuer,
            passportId: scope === "passport" ? parsedPassportId ?? undefined : undefined,
            scope,
            stampTypeId: scope === "type" ? parsedStampTypeId ?? undefined : undefined,
          }
        : null,
    [canLoadContext, normalizedIssuer, parsedPassportId, parsedStampTypeId, scope],
  );
  const draftContextKey = currentDraftQuery ? buildIssuerPolicyContextKey(currentDraftQuery) : "";
  const loadedContextKey = lastLoadedQuery ? buildIssuerPolicyContextKey(lastLoadedQuery) : "";
  const isCurrentContextLoaded =
    Boolean(currentDraftQuery) && Boolean(lastLoadedQuery) && draftContextKey === loadedContextKey;
  const displayedPolicy = isCurrentContextLoaded ? currentPolicy : null;
  const displayedAllowlistMode = isCurrentContextLoaded ? passportAllowlistMode : null;
  const hasInvalidValidityWindow =
    parsedValidAfter !== null &&
    parsedValidUntil !== null &&
    parsedValidAfter !== 0n &&
    parsedValidUntil !== 0n &&
    parsedValidUntil < parsedValidAfter;

  const saveValidationIssues = useMemo(() => {
    const issues: string[] = [];

    if (!isConfigured) {
      issues.push(
        t(
          '前端环境未配置 Passport 合约。',
          'Passport contracts are not configured in the frontend environment.',
        ),
      );
    }

    if (!isConnected) {
      issues.push(
        t(
          '保存授权前请先连接钱包。',
          'Connect a wallet before saving authorization changes.',
        ),
      );
    } else if (isLoadingAuthorityOwner && !authorityOwner) {
      issues.push(
        t(
          '正在加载 PassportAuthority owner 权限，请稍候。',
          'Wait for PassportAuthority owner access to finish loading.',
        ),
      );
    } else if (!isAuthorityOwner) {
      issues.push(
        t(
          '只有 PassportAuthority owner 可以提交授权变更。',
          'Only the PassportAuthority owner can submit authorization changes.',
        ),
      );
    }

    if (!normalizedIssuer) {
      issues.push(t('请输入 issuer 地址。', 'Enter an issuer address.'));
    } else if (!hasValidIssuer) {
      issues.push(t('请输入有效的 issuer 地址。', 'Enter a valid issuer address.'));
    }

    if (scope === 'type') {
      if (!stampTypeId.trim()) {
        issues.push(
          t(
            'Type 范围需要填写 Stamp Type ID。',
            'Enter a stamp type ID for Type scope.',
          ),
        );
      } else if (parsedStampTypeId === null) {
        issues.push(
          t(
            'Stamp Type ID 必须是数字。',
            'Stamp Type ID must be a numeric value.',
          ),
        );
      }
    }

    if (scope === 'passport') {
      if (!passportId.trim()) {
        issues.push(
          t(
            'Passport 范围需要填写 Passport ID。',
            'Enter a passport ID for Passport scope.',
          ),
        );
      } else if (parsedPassportId === null) {
        issues.push(
          t(
            'Passport ID 必须是数字。',
            'Passport ID must be a numeric value.',
          ),
        );
      }
    }

    if (parsedValidAfter === null) {
      issues.push(
        t(
          'Valid After 必须是有效时间。',
          'Valid After must be a valid date and time.',
        ),
      );
    }

    if (parsedValidUntil === null) {
      issues.push(
        t(
          'Valid Until 必须是有效时间。',
          'Valid Until must be a valid date and time.',
        ),
      );
    }

    if (currentDraftQuery && !isCurrentContextLoaded) {
      issues.push(
        t(
          '请先加载授权，确保你编辑的是最新链上记录。',
          'Load Authorization first so you are editing the latest on-chain record.',
        ),
      );
    }

    if (hasInvalidValidityWindow) {
      issues.push(
        t(
          'Valid Until 必须晚于 Valid After。',
          'Valid Until must be later than Valid After.',
        ),
      );
    }

    return issues;
  }, [
    authorityOwner,
    currentDraftQuery,
    hasInvalidValidityWindow,
    hasValidIssuer,
    isAuthorityOwner,
    isConfigured,
    isConnected,
    isCurrentContextLoaded,
    isLoadingAuthorityOwner,
    normalizedIssuer,
    parsedPassportId,
    parsedValidAfter,
    parsedValidUntil,
    parsedStampTypeId,
    passportId,
    scope,
    stampTypeId,
    t,
  ]);

  const canSubmitPolicy = saveValidationIssues.length === 0;

  useEffect(() => {
    if (!currentPolicy || !isCurrentContextLoaded) {
      return;
    }

    setEnabled(currentPolicy.enabled);
    setRestrictToExplicitPassportList(currentPolicy.restrictToExplicitPassportList);
    setValidAfter(toDateTimeLocalValue(currentPolicy.validAfter));
    setValidUntil(toDateTimeLocalValue(currentPolicy.validUntil));
    setPolicyCID(currentPolicy.policyCID);
  }, [currentPolicy, isCurrentContextLoaded]);

  useEffect(() => {
    if (passportAllowlistMode === null || !isCurrentContextLoaded) {
      return;
    }

    setAllowlistModeInput(passportAllowlistMode);
  }, [isCurrentContextLoaded, passportAllowlistMode]);

  useEffect(() => {
    if (!lastConfirmedTxHash) {
      return;
    }

    void refreshPolicyList();
  }, [lastConfirmedTxHash, refreshPolicyList]);

  useEffect(() => {
    if (!hasInitialContextSearch || !currentDraftQuery || initialContextAutoloadedRef.current) {
      return;
    }

    initialContextAutoloadedRef.current = true;
    void loadPolicyContext(currentDraftQuery);
  }, [
    currentDraftQuery,
    hasInitialContextSearch,
    loadPolicyContext,
  ]);

  useEffect(() => {
    if (isCurrentContextLoaded) {
      return;
    }

    setEnabled(false);
    setRestrictToExplicitPassportList(false);
    setValidAfter("");
    setValidUntil("");
    setPolicyCID("");
    setAllowlistModeInput(false);
  }, [draftContextKey, isCurrentContextLoaded]);

  useEffect(() => {
    if (saveValidationIssues.length > 0) {
      return;
    }

    setIsSaveFeedbackOpen(false);
  }, [saveValidationIssues.length]);

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
  const isPassportScope = scope === "passport";
  const effectiveRestrictToExplicitPassportList = isPassportScope
    ? false
    : restrictToExplicitPassportList;
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
        "This wallet can manage issuer access.",
        "This wallet can manage issuer access.",
      )
      : t(
        "Only the authority owner can manage issuer access.",
        "Only the authority owner can manage issuer access.",
      );
  const accessToneClass = isAccessPending
    ? "text-slate-500"
    : isAuthorityOwner
      ? "text-emerald-700"
      : "text-amber-700";
  const scopeOptions: Array<{
    description: string;
    label: string;
    value: IssuerPolicyScope;
  }> = [
    {
      description: t(
        "Authorize this issuer across all passports and stamp types.",
        "Authorize this issuer across all passports and stamp types.",
      ),
      label: t("Global", "Global"),
      value: "global",
    },
    {
      description: t(
        "Limit authorization to one specific stamp type.",
        "Limit authorization to one specific stamp type.",
      ),
      label: t("Type", "Type"),
      value: "type",
    },
    {
      description: t(
        "Restrict authorization to a single passport record.",
        "Restrict authorization to a single passport record.",
      ),
      label: t("Passport", "Passport"),
      value: "passport",
    },
  ];
  const selectedScopeDescription =
    scopeOptions.find((option) => option.value === scope)?.description || "";
  const policyDirectoryOptions: Record<
    IssuerPolicyScope,
    {
      description: string;
      items: IssuerPolicySnapshot[];
      title: string;
    }
  > = {
    global: {
      description: t(
        "These addresses currently have active global issuer access.",
        "These addresses currently have active global issuer access.",
      ),
      items: policies.global,
      title: t('全局范围', 'Global Scope'),
    },
    type: {
      description: t(
        "These addresses are currently authorized for one or more stamp types.",
        "These addresses are currently authorized for one or more stamp types.",
      ),
      items: policies.type,
      title: t('类型范围', 'Type Scope'),
    },
    passport: {
      description: t(
        "These addresses are currently authorized for one or more passports.",
        "These addresses are currently authorized for one or more passports.",
      ),
      items: policies.passport,
      title: t('Passport 范围', 'Passport Scope'),
    },
  };
  const policyDirectoryButtons = scopeOptions.map((option) => ({
    label: option.label,
    value: option.value,
  }));
  const currentPolicyDirectory = policyDirectoryOptions[policyDirectoryScope];
  const contextStatusTitle = isLoadingPolicy
    ? t("Loading authorization snapshot", "Loading authorization snapshot")
    : isCurrentContextLoaded
      ? t("Snapshot loaded", "Snapshot loaded")
      : currentDraftQuery
        ? t("Context ready to load", "Context ready to load")
        : t("Context incomplete", "Context incomplete");
  const contextStatusDescription = !normalizedIssuer
    ? t(
        "Enter an issuer address, then complete the scope-specific identifier before loading chain state.",
        "Enter an issuer address, then complete the scope-specific identifier before loading chain state.",
      )
    : !hasValidIssuer
      ? t(
          "The issuer address is not a valid EVM address.",
          "The issuer address is not a valid EVM address.",
        )
      : scope === "type" && parsedStampTypeId === null
        ? t(
            "Type scope requires a numeric stamp type ID.",
            "Type scope requires a numeric stamp type ID.",
          )
        : scope === "passport" && parsedPassportId === null
          ? t(
              "Passport scope requires a numeric passport ID.",
              "Passport scope requires a numeric passport ID.",
            )
          : isLoadingPolicy
            ? t(
                "Fetching the latest on-chain authorization snapshot for this exact context.",
                "Fetching the latest on-chain authorization snapshot for this exact context.",
              )
            : isCurrentContextLoaded
              ? t(
                  "Chain data is loaded. You can edit status, validity, CID, and allowlist settings from this snapshot.",
                  "Chain data is loaded. You can edit status, validity, CID, and allowlist settings from this snapshot.",
                )
              : t(
                  "This context is valid, but the form stays empty until you click Load Authorization.",
                  "This context is valid, but the form stays empty until you click Load Authorization.",
                );
  const contextStatusClassName = isLoadingPolicy
    ? "border-sky-200 bg-sky-50 text-sky-900"
    : isCurrentContextLoaded
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : normalizedIssuer && !hasValidIssuer
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : currentDraftQuery
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : "border-slate-200 bg-slate-50 text-slate-700";
  const saveHint = canSubmitPolicy
    ? t(
        '当前上下文已加载，可以提交到链上。',
        'The current context is loaded and ready to be submitted on-chain.',
      )
    : saveValidationIssues[0] ||
      t(
        '提交前请先解决剩余校验项。',
        'Resolve the remaining save requirements before submitting.',
      );

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Ignore clipboard failures so the list remains usable.
    }
  };

  const loadPolicyIntoForm = (policy: IssuerPolicySnapshot) => {
    const nextQuery = {
      issuerAddress: policy.address,
      passportId: policy.scope === "passport" ? policy.passportId ?? undefined : undefined,
      scope: policy.scope,
      stampTypeId: policy.scope === "type" ? policy.stampTypeId ?? undefined : undefined,
    };

    setScope(policy.scope);
    setIssuerAddress(policy.address);
    setStampTypeId(policy.scope === "type" && policy.stampTypeId !== null ? policy.stampTypeId.toString() : "");
    setPassportId(
      policy.scope === "passport" && policy.passportId !== null ? policy.passportId.toString() : "",
    );
    void loadPolicyContext(nextQuery);
  };

  const handleSaveAuthorization = () => {
    if (isSubmitting) {
      return;
    }

    if (saveValidationIssues.length > 0) {
      setIsSaveFeedbackOpen(true);
      return;
    }

    if (!currentDraftQuery) {
      return;
    }

    void setIssuerPolicy(currentDraftQuery, {
      enabled,
      policyCID,
      restrictToExplicitPassportList: effectiveRestrictToExplicitPassportList,
      validAfter: parsedValidAfter ?? 0n,
      validUntil: parsedValidUntil ?? 0n,
    });
  };

  const renderPolicyGroup = (
    groupScope: IssuerPolicyScope,
    title: string,
    description: string,
    items: IssuerPolicySnapshot[],
  ) => (
    <div className="panel-soft passport-issuer-policy-group p-5">
      <div className="passport-issuer-policy-group__head flex items-start justify-between gap-4">
        <div className="passport-issuer-policy-group__intro">
          <p className="meta-label">{title}</p>
          <p className="passport-issuer-policy-group__description">{description}</p>
        </div>
        <span className="inline-flex min-w-14 items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-700">
          {String(items.length).padStart(2, "0")}
        </span>
      </div>

      <div className="passport-issuer-policy-group__body">
        {items.length > 0 ? (
          <div className="passport-dashboard-address-list">
            {items.map((policy, index) => {
              const addressHref = blockExplorerBaseUrl
                ? `${blockExplorerBaseUrl}/address/${policy.address}`
                : "";
              const contextBadge =
                groupScope === "global"
                  ? t("闂佺绻堥崝宀勬儑椤掑嫬绠抽柛顐ゅ枑缂嶁偓", "Global Authorization")
                  : groupScope === "type"
                    ? t(
                        `缂備緡鍋夐褔鎮?#${policy.stampTypeId?.toString() ?? "--"}`,
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
                      {t("Authorized Address", "Authorized Address")}{" "}
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
                              "No block explorer is configured for the current chain.",
                              "No block explorer is configured for the current chain.",
                            )}
                          >
                            <ExternalLink size={12} />
                            {t("Explorer", "Explorer")}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="passport-dashboard-address-item__meta">
                      <span className="passport-dashboard-address-item__meta-label">
                        {t("闂佸搫鐗冮崑鎾绘煛閸屾粌顣奸柡瀣暙椤?CID", "Latest document CID")}
                      </span>
                      {policy.policyCID ? (
                        <span className="passport-dashboard-address-item__meta-value">
                          {policy.policyCID}
                        </span>
                      ) : (
                        <span className="passport-dashboard-address-item__meta-empty">
                          {t(
                            "Latest authorization snapshot has no CID set.",
                            "Latest authorization snapshot has no CID set.",
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="passport-issuer-policy-group__empty rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-600">
            {groupScope === "global"
              ? t(
                  "No active global issuer access is currently indexed.",
                  "No active global issuer access is currently indexed.",
                )
              : groupScope === "type"
                ? t(
                    "No active type-level issuer access is currently indexed.",
                    "No active type-level issuer access is currently indexed.",
                  )
                : t(
                    "No active passport-level issuer access is currently indexed.",
                    "No active passport-level issuer access is currently indexed.",
                  )}
          </div>
        )}
      </div>
    </div>
  );

  const renderPolicyDirectory = (
    groupScope: IssuerPolicyScope,
    title: string,
    description: string,
    items: IssuerPolicySnapshot[],
  ) => (
    <section className="panel-soft passport-issuer-policy-directory p-5">
      <div className="passport-issuer-policy-directory__header">
        <div className="passport-issuer-policy-directory__heading">
          <p className="meta-label">{title}</p>
          <p className="passport-issuer-policy-directory__description">{description}</p>
        </div>
        <span className="passport-issuer-policy-directory__count">
          {String(items.length).padStart(2, "0")}
        </span>
      </div>

      <div className="passport-issuer-policy-directory__body">
        {items.length > 0 ? (
          <div className="passport-issuer-policy-directory__list">
            {items.map((policy, index) => {
              const addressHref = blockExplorerBaseUrl
                ? `${blockExplorerBaseUrl}/address/${policy.address}`
                : "";
              const contextBadge =
                groupScope === "global"
                  ? t("闂佺绻堥崝宀勬儑椤掑嫬绠抽柛顐ゅ枑缂嶁偓", "Global Authorization")
                  : groupScope === "type"
                    ? t(
                        `缂備緡鍋夐褔鎮?#${policy.stampTypeId?.toString() ?? "--"}`,
                        `Type #${policy.stampTypeId?.toString() ?? "--"}`,
                      )
                    : t(
                        `Passport #${policy.passportId?.toString() ?? "--"}`,
                        `Passport #${policy.passportId?.toString() ?? "--"}`,
                      );

              return (
                <article
                  key={`${policy.scope}:${policy.address.toLowerCase()}:${policy.stampTypeId?.toString() ?? "na"}:${policy.passportId?.toString() ?? "na"}`}
                  className="passport-issuer-policy-directory__row"
                >
                  <div className="passport-issuer-policy-directory__row-main">
                    <div className="passport-issuer-policy-directory__row-head">
                      <span className="passport-issuer-policy-directory__row-title">
                        {t('已授权地址', 'Authorized Address')} {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="passport-issuer-policy-directory__scope-badge">
                        {contextBadge}
                      </span>
                    </div>

                    <p className="passport-issuer-policy-directory__address">{policy.address}</p>

                    <div className="passport-issuer-policy-directory__meta">
                      <span className="passport-issuer-policy-directory__meta-label">
                        {t("闂佸搫鐗冮崑鎾绘煛閸屾粌顣奸柡瀣暙椤?CID", "Latest document CID")}
                      </span>
                      {policy.policyCID ? (
                        <span className="passport-issuer-policy-directory__meta-value">
                          {policy.policyCID}
                        </span>
                      ) : (
                        <span className="passport-issuer-policy-directory__meta-empty">
                          {t(
                            "Latest authorization snapshot has no CID set.",
                            "Latest authorization snapshot has no CID set.",
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="passport-issuer-policy-directory__actions">
                    <button
                      type="button"
                      onClick={() => loadPolicyIntoForm(policy)}
                      className="passport-issuer-policy-directory__action"
                    >
                      {t('载入', 'Load')}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleCopyAddress(policy.address)}
                      className="passport-issuer-policy-directory__action"
                    >
                      <Copy size={12} />
                      {t('复制', 'Copy')}
                    </button>
                    {addressHref ? (
                      <a
                        href={addressHref}
                        target="_blank"
                        rel="noreferrer"
                        className="passport-issuer-policy-directory__action"
                      >
                        <ExternalLink size={12} />
                        {t("Explorer", "Explorer")}
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="passport-issuer-policy-directory__action is-disabled"
                        title={t(
                          "No block explorer is configured for the current chain.",
                          "No block explorer is configured for the current chain.",
                        )}
                      >
                        <ExternalLink size={12} />
                        {t("Explorer", "Explorer")}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="passport-issuer-policy-directory__empty">
            {groupScope === "global"
              ? t(
                  "No active global issuer access is currently indexed.",
                  "No active global issuer access is currently indexed.",
                )
              : groupScope === "type"
                ? t(
                    "No active type-level issuer access is currently indexed.",
                    "No active type-level issuer access is currently indexed.",
                  )
                : t(
                    "No active passport-level issuer access is currently indexed.",
                    "No active passport-level issuer access is currently indexed.",
                  )}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <PassportShell currentKey="policies">
      <PassportTransactionSuccessNotice
        message={successNoticeMessage}
        onClose={clearSuccessNotice}
      />
      <ModalDialog
        open={isSaveFeedbackOpen}
        onClose={() => setIsSaveFeedbackOpen(false)}
        tone='warning'
        title={t('保存条件未满足', 'Save requirements not met')}
        description={t(
          '请先解决下面这些问题，再提交本次授权更新。',
          'Resolve the following items before submitting this authorization update.',
        )}
        closeAriaLabel={t('关闭保存条件提示', 'Close save requirements dialog')}
        footer={
          <div className='flex justify-end'>
            <button
              type='button'
              onClick={() => setIsSaveFeedbackOpen(false)}
              className='passport-action-button passport-action-button--secondary'
            >
              {t('我知道了', 'I Understand')}
            </button>
          </div>
        }
      >
        <ul className='space-y-3'>
          {saveValidationIssues.map((issue, index) => (
            <li
              key={`${index}-${issue}`}
              className='flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3'
            >
              <span className='inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-900 text-xs font-black text-amber-100'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className='pt-0.5 text-sm font-semibold leading-6 text-amber-950'>{issue}</p>
            </li>
          ))}
        </ul>
      </ModalDialog>
      <div className="passport-dashboard-body">
        <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
          <div className="passport-dashboard-primary__grid relative">
            <div className="passport-dashboard-primary__content space-y-5">
              <span className="passport-dashboard-primary__header">
                {t('发章授权', 'Issuer Access')}
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                  {t(
                    "Manage stamp access for one issuer wallet across global, type, and passport scope.",
                    "Manage stamp access for one issuer wallet across global, type, and passport scope.",
                  )}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "Load one issuer context and update authorization settings.",
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
                      "Indexed from latest issuer access events across global, type, and passport scope.",
                      "Indexed from latest issuer access events across global, type, and passport scope.",
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
                  {t("闂備焦婢樼粔鍫曟偪閸℃稑绠抽柛顐ゅ枑缂嶁偓", "Configure Authorization")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "Select a scope, load the issuer context, then update status, validity, and document CID.",
                    "Select a scope, load the issuer context, then update status, validity, and document CID.",
                  )}
                </p>
              </div>
            </div>

            <div className="passport-issuer-policy-config mt-8 space-y-5">
              <div className="grid gap-4 xl:grid-cols-2">
                <div className="panel-soft passport-issuer-policy-scope p-5">
                  <p className="meta-label">{t("Authorization Scope", "Authorization Scope")}</p>
                  <div
                    className="passport-issuer-policy-scope__options"
                    role="group"
                    aria-label={t("Authorization Scope", "Authorization Scope")}
                  >
                    {scopeOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => setScope(option.value)}
                        aria-pressed={scope === option.value}
                        className={`passport-issuer-policy-scope__option ${
                          scope === option.value ? "is-active" : ""
                        }`}
                      >
                        <span className="passport-issuer-policy-scope__option-label">{option.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="passport-issuer-policy-scope__selected">{selectedScopeDescription}</p>
                </div>

                <div className={`rounded-3xl border px-5 py-5 ${contextStatusClassName}`}>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] opacity-70">
                    {t("Editor Status", "Editor Status")}
                  </p>
                  <p className="mt-3 text-lg font-black tracking-tight">{contextStatusTitle}</p>
                  <p className="mt-2 text-sm font-medium leading-6 opacity-85">
                    {contextStatusDescription}
                  </p>

                  {currentDraftQuery ? (
                    <div className="mt-4 rounded-2xl border border-black/10 bg-white/75 px-4 py-4 text-slate-900">
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                        {t("Current Context", "Current Context")}
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            {t("Issuer", "Issuer")}
                          </p>
                          <p className="break-all font-mono text-sm font-semibold text-slate-900">
                            {currentDraftQuery.issuerAddress}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                            {t("Scope", "Scope")}
                          </p>
                          <p className="text-sm font-semibold text-slate-900">{scopeLabel}</p>
                        </div>
                        {scope === "type" ? (
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                              {t("Stamp Type ID", "Stamp Type ID")}
                            </p>
                            <p className="font-mono text-sm font-semibold text-slate-900">
                              {parsedStampTypeId?.toString()}
                            </p>
                          </div>
                        ) : null}
                        {scope === "passport" ? (
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                              {t("Passport ID", "Passport ID")}
                            </p>
                            <p className="font-mono text-sm font-semibold text-slate-900">
                              {parsedPassportId?.toString()}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="panel-soft p-5">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="meta-label">{t("Authorization Context", "Authorization Context")}</p>
                    <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                      {t(
                        "Start with the issuer address and the exact record you want to inspect on-chain.",
                        "Start with the issuer address and the exact record you want to inspect on-chain.",
                      )}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (!currentDraftQuery) {
                        return;
                      }

                      void loadPolicyContext(currentDraftQuery);
                    }}
                    disabled={!currentDraftQuery || isLoadingPolicy}
                    className="passport-action-button passport-action-button--secondary"
                  >
                    <RefreshCw size={16} className={isLoadingPolicy ? "animate-spin" : ""} />
                    {t("闂佸憡姊绘慨鎯归崶顒€绠抽柛顐ゅ枑缂嶁偓", "Load Authorization")}
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
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
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
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
                  ) : scope === "passport" ? (
                    <div className="rounded-2xl border border-slate-200 bg-white/80 p-5">
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
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/90 p-5">
                      <p className="meta-label">{t("Global Scope Note", "Global Scope Note")}</p>
                      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                        {t(
                          "Global scope only needs the issuer address. No stamp type ID or passport ID is required.",
                          "Global scope only needs the issuer address. No stamp type ID or passport ID is required.",
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(event) => setEnabled(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {t("闂佸憡鍑归崹鎶藉极閵堝绠抽柛顐ゅ枑缂嶁偓", "Enable Authorization")}
                </label>
                {!isPassportScope ? (
                  <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={restrictToExplicitPassportList}
                      onChange={(event) => setRestrictToExplicitPassportList(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    {t(
                      "Require Passport-Level Authorization",
                      "Require Passport-Level Authorization",
                    )}
                  </label>
                ) : null}
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
                  {t("闂佺懓鎼悧濠傤焽閸儱妫橀柛銉ｅ妸閳?CID", "Authorization Document CID")}
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
              <div className="panel-soft p-5">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <p className="meta-label">{t("Authorization Document Preparation", "Authorization Document Preparation")}</p>
                    <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                      {t(
                        "Generate the policy document CID here. The resulting value fills back into the Authorization Document CID field above.",
                        "Generate the policy document CID here. The resulting value fills back into the Authorization Document CID field above.",
                      )}
                    </p>
                  </div>

                  <Link
                    to="/passport/cid-studio"
                    className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-sky-600 transition-colors hover:text-sky-700"
                  >
                    <ExternalLink size={16} />
                    {t("Open CID Studio", "Open CID Studio")}
                  </Link>
                </div>

                <div className="mt-5">
                  <CidComposer
                    accent={policyDocumentPreset.accent}
                    defaultPayload={policyDocumentPreset.defaultPayload}
                    description={policyDocumentPreset.description}
                    fieldKey={policyDocumentPreset.fieldKey}
                    formFields={policyDocumentPreset.formFields}
                    framed={false}
                    suggestedFileName={policyDocumentPreset.fileName}
                    value={policyCID}
                    onChange={setPolicyCID}
                  />
                </div>
              </div>


              <div className="panel-soft p-5">
                <p className="meta-label">{t("Submit Changes", "Submit Changes")}</p>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">{saveHint}</p>
                <div className="passport-dashboard-primary__actions mt-4">
                  <button
                    type='button'
                    onClick={handleSaveAuthorization}
                    disabled={isSubmitting}
                    className='passport-action-button passport-action-button--primary'
                  >
                    <ShieldCheck size={16} />
                    {isSubmitting ? t("闂佸湱绮崝鎺戭潩閿旂晫鈻?..", "Submitting...") : t("婵烇絽娲︾换鍌炴偤閵娾晛绠抽柛顐ゅ枑缂嶁偓", "Save Authorization")}
                  </button>
                </div>
              </div>

              {scope === "passport" && parsedPassportId !== null ? (
                <div id="passport-allowlist" className="panel-soft p-5">
                  <p className="meta-label">{t("Passport Allowlist Enforcement", "Passport Allowlist Enforcement")}</p>
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    {t(
                      "When enabled, this passport only accepts explicit passport-level authorization.",
                      "When enabled, this passport only accepts explicit passport-level authorization.",
                    )}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-500">
                    {t(
                      "This switch is bound to the passportId itself. You can update it directly here without loading one issuer record first.",
                      "This switch is bound to the passportId itself. You can update it directly here without loading one issuer record first.",
                    )}
                  </p>
                  <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={allowlistModeInput}
                      onChange={(event) => setAllowlistModeInput(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    {t("Enable Allowlist Enforcement", "Enable Allowlist Enforcement")}
                  </label>
                  <div className="passport-dashboard-primary__actions mt-4">
                    <button
                      onClick={() => void setPassportAllowlistMode(parsedPassportId, allowlistModeInput)}
                      disabled={!isAuthorityOwner || isSubmitting}
                      className="passport-action-button passport-action-button--secondary"
                    >
                      <Tags size={16} />
                      {t("Update Allowlist Enforcement", "Update Allowlist Enforcement")}
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
                  {t("Authorization Snapshot", "Authorization Snapshot")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "Review the currently loaded authorization before making changes.",
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
                  <p className="meta-label">{t("Current Authorization Status", "Current Authorization Status")}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    {currentPolicyStateLabel(displayedPolicy)}
                  </p>
                </div>
              </div>

              {displayedPolicy ? (
                <>
                  <div className="panel-soft p-5">
                    <p className="meta-label">{t("Validity Window", "Validity Window")}</p>
                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      {displayedPolicy.validAfter === 0n
                        ? t("No start limit", "No start limit")
                        : t(
                          `Starts at ${new Date(Number(displayedPolicy.validAfter) * 1000).toLocaleString()}`,
                          `Starts at ${new Date(Number(displayedPolicy.validAfter) * 1000).toLocaleString()}`,
                        )}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {displayedPolicy.validUntil === 0n
                        ? t("No expiration", "No expiration")
                        : t(
                          `Expires at ${new Date(Number(displayedPolicy.validUntil) * 1000).toLocaleString()}`,
                          `Expires at ${new Date(Number(displayedPolicy.validUntil) * 1000).toLocaleString()}`,
                        )}
                    </p>
                  </div>

                  <div className="panel-soft p-5">
                    <p className="meta-label">{t("闂佺懓鎼悧濠傤焽閸儱妫橀柛銉ｅ妸閳?CID", "Authorization Document CID")}</p>
                    <p className="mt-3 break-all font-mono text-sm text-slate-700">
                      {displayedPolicy.policyCID || t("Not set", "Not set")}
                    </p>
                  </div>
                </>
              ) : null}

              {scope === "passport" ? (
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("Allowlist Enforcement", "Allowlist Enforcement")}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    {displayedAllowlistMode === null
                      ? t("Not loaded", "Not loaded")
                      : displayedAllowlistMode
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
                  {t("Authorized Addresses", "Authorized Addresses")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "Browse authorized addresses by scope, then load any entry into the editor.",
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
                    "Because PassportAuthority does not expose enumerable issuer access mappings, this list is rebuilt from the latest GlobalIssuerPolicySet, TypeIssuerPolicySet, and PassportIssuerPolicySet events. It reflects enabled states by scope; exact validity windows still need the snapshot panel.",
                    "Because PassportAuthority does not expose enumerable issuer access mappings, this list is rebuilt from the latest GlobalIssuerPolicySet, TypeIssuerPolicySet, and PassportIssuerPolicySet events. It reflects enabled states by scope; exact validity windows still need the snapshot panel.",
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
                    "濠殿喗绻愮徊钘夛耿椤忓懐顩?PassportAuthority 婵炲瓨绮岄鍕枎閵忥紕鈻旀い鎾跺仜椤綁寮堕悙鑸殿棄闁告埊绻濋獮鎺楀醇閻斿摜绉梺闈╅檮濠㈡ê顭囬崘顔肩婵°倕瀚ㄩ埀?..",
                    "Loading authorized address lists from PassportAuthority events...",
                  )}
                </div>
              ) : (
                <div className="space-y-4">                  <div
                    className="passport-issuer-policy-directory-switcher panel-soft p-4"
                    role="group"
                    aria-label={t("Authorized address scope", "Authorized address scope")}
                  >
                    {policyDirectoryButtons.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => setPolicyDirectoryScope(option.value)}
                        aria-pressed={policyDirectoryScope === option.value}
                        className={`passport-action-button ${
                          policyDirectoryScope === option.value
                            ? "passport-action-button--primary"
                            : "passport-action-button--secondary"
                        } passport-issuer-policy-directory-switcher__control`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {renderPolicyDirectory(
                    policyDirectoryScope,
                    currentPolicyDirectory.title,
                    currentPolicyDirectory.description,
                    currentPolicyDirectory.items,
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




