import { RefreshCw, ShieldCheck, ShieldX, Tags, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  isPassportAddress,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import CidComposer from "../components/CidComposer";
import PassportShell from "../components/PassportShell";
import {
  type IssuerPolicyRecord,
  type IssuerPolicyScope,
  usePassportIssuerPolicyAdmin,
} from "../hooks/usePassportIssuerPolicyAdmin";
import { usePassportLocale } from "../i18n";

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

  const normalizedIssuer = issuerAddress.trim();
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
      return t("未加载", "Not loaded");
    }

    return policy.enabled ? t("启用", "Enabled") : t("停用", "Disabled");
  };

  return (
    <PassportShell currentKey="policies">
      <div className="space-y-8">
        <section className="rounded-[2.5rem] bg-[linear-gradient(135deg,_rgba(255,247,237,1),_rgba(255,255,255,1)_45%,_rgba(239,246,255,0.94))] p-10 shadow-[0_24px_60px_-28px_rgba(14,165,233,0.24)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-sky-600 shadow-sm">
                {t("发行策略", "Issuer Policies")}
              </span>
              <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-[-0.04em] text-slate-950">
                  {t("管理三种作用域下的发行方权限规则。", "Manage issuer permission rules across all three scopes.")}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-600">
                  {t(
                    "这个面板用于维护 `PassportAuthority` 中全局、印章类型级、护照级的发行策略规则。",
                    "This panel updates `PassportAuthority` issuer policy rules at the global, stamp type, and passport levels.",
                  )}
                </p>
              </div>
            </div>

            <div className="glass-card space-y-4 p-6">
              <div className="space-y-1">
                <p className="meta-label">{t("治理合约", "Governance Contract")}</p>
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
                    {isLoadingAuthorityOwner
                      ? t("加载中...", "Loading...")
                      : authorityOwner || t("不可用", "Unavailable")}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">{t("当前钱包", "Current Wallet")}</p>
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
                  {isAuthorityOwner ? t("Owner 权限", "Owner access") : t("只读", "Read only")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="space-y-2">
              <p className="meta-label">{t("策略编辑器", "Policy Editor")}</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {t("配置发行策略", "Configure Issuer Policy")}
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <p className="meta-label">{t("策略作用域", "Policy Scope")}</p>
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
                        ? t("全局", "Global")
                        : candidateScope === "type"
                          ? t("类型级", "Type")
                          : t("护照级", "Passport")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="issuer-address">
                  {t("发行方地址", "Issuer Address")}
                </label>
                <input
                  id="issuer-address"
                  type="text"
                  value={issuerAddress}
                  onChange={(event) => setIssuerAddress(event.target.value)}
                  placeholder="0x..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              {scope === "type" ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <label className="meta-label" htmlFor="type-stamp-type-id">
                    {t("印章类型 ID", "Stamp Type ID")}
                  </label>
                  <input
                    id="type-stamp-type-id"
                    type="text"
                    value={stampTypeId}
                    onChange={(event) => setStampTypeId(event.target.value)}
                    placeholder="1"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              ) : null}

              {scope === "passport" ? (
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <label className="meta-label" htmlFor="type-passport-id">
                    {t("护照 ID", "Passport ID")}
                  </label>
                  <input
                    id="type-passport-id"
                    type="text"
                    value={passportId}
                    onChange={(event) => setPassportId(event.target.value)}
                    placeholder="1"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              ) : null}

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
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:border-sky-200 hover:text-sky-600 disabled:opacity-50"
              >
                <RefreshCw size={16} className={isLoadingPolicy ? "animate-spin" : ""} />
                {t("加载策略", "Load Policy")}
              </button>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(event) => setEnabled(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {t("启用策略", "Enable policy")}
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4 text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={restrictToExplicitPassportList}
                    onChange={(event) => setRestrictToExplicitPassportList(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {t("限制为显式护照名单", "Require explicit passport allowlist")}
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <label className="meta-label" htmlFor="valid-after">
                    {t("生效起始时间", "Valid After")}
                  </label>
                  <input
                    id="valid-after"
                    type="datetime-local"
                    value={validAfter}
                    onChange={(event) => setValidAfter(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <label className="meta-label" htmlFor="valid-until">
                    {t("失效时间", "Valid Until")}
                  </label>
                  <input
                    id="valid-until"
                    type="datetime-local"
                    value={validUntil}
                    onChange={(event) => setValidUntil(event.target.value)}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="policy-cid">
                  {t("策略 CID", "Policy CID")}
                </label>
                <input
                  id="policy-cid"
                  type="text"
                  value={policyCID}
                  onChange={(event) => setPolicyCID(event.target.value)}
                  placeholder="ipfs://..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                />
                <CidComposer
                  accent="sky"
                  defaultText={`{\n  "summary": "",\n  "rules": [],\n  "references": [],\n  "owner": ""\n}`}
                  description={t(
                    "为发行策略说明文档生成 CID，适合记录规则摘要、适用范围和链下附件。",
                    "Generate the CID for issuer-policy documentation, including rule summaries, scope, and off-chain references.",
                  )}
                  fieldKey="issuer_policy"
                  suggestedFileName="issuer-policy.json"
                  value={policyCID}
                  onChange={setPolicyCID}
                />
              </div>

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
                className="inline-flex items-center justify-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-sky-700 transition-all hover:bg-sky-100 disabled:opacity-50"
              >
                <ShieldCheck size={18} />
                {isSubmitting ? t("提交中...", "Submitting...") : t("保存策略", "Save Policy")}
              </button>

              {scope === "passport" && parsedPassportId !== null ? (
                <div className="space-y-4 rounded-[2rem] border border-slate-100 bg-slate-50/60 px-5 py-5">
                  <div>
                    <p className="meta-label">{t("护照白名单模式", "Passport Allowlist Mode")}</p>
                    <p className="mt-2 text-sm font-medium text-slate-600">
                      {t(
                        "启用后，这本护照必须依赖护照级显式授权才允许对应发行行为。",
                        "When enabled, issuance for this passport requires explicit passport-level authorization.",
                      )}
                    </p>
                  </div>
                  <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={allowlistModeInput}
                      onChange={(event) => setAllowlistModeInput(event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    {t("启用白名单模式", "Enable allowlist mode")}
                  </label>
                  <button
                    onClick={() => void setPassportAllowlistMode(parsedPassportId, allowlistModeInput)}
                    disabled={!isAuthorityOwner || isSubmitting}
                    className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:border-sky-200 hover:text-sky-600 disabled:opacity-50"
                  >
                    <Tags size={18} />
                    {t("更新白名单模式", "Update Allowlist Mode")}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
              <p className="meta-label">{t("已加载上下文", "Loaded Context")}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {t("策略快照", "Policy Snapshot")}
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <p className="meta-label">{t("作用域", "Scope")}</p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700">
                    {scope === "global"
                      ? t("全局", "Global")
                      : scope === "type"
                        ? t("类型级", "Type")
                        : t("护照级", "Passport")}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                  <p className="meta-label">{t("当前策略状态", "Current Policy Status")}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {currentPolicyStateLabel(currentPolicy)}
                  </p>
                </div>
                {currentPolicy ? (
                  <>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                      <p className="meta-label">{t("有效时间窗", "Validity Window")}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-700">
                        {currentPolicy.validAfter === 0n
                          ? t("无起始限制", "No start limit")
                          : t(
                              `起始于 ${new Date(Number(currentPolicy.validAfter) * 1000).toLocaleString()}`,
                              `Starts at ${new Date(Number(currentPolicy.validAfter) * 1000).toLocaleString()}`,
                            )}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {currentPolicy.validUntil === 0n
                          ? t("不过期", "No expiration")
                          : t(
                              `截止于 ${new Date(Number(currentPolicy.validUntil) * 1000).toLocaleString()}`,
                              `Expires at ${new Date(Number(currentPolicy.validUntil) * 1000).toLocaleString()}`,
                            )}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                      <p className="meta-label">{t("策略 CID", "Policy CID")}</p>
                      <p className="mt-2 break-all font-mono text-sm text-slate-700">
                        {currentPolicy.policyCID || t("未设置", "Not set")}
                      </p>
                    </div>
                  </>
                ) : null}
                {scope === "passport" ? (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                    <p className="meta-label">{t("白名单模式", "Allowlist Mode")}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {passportAllowlistMode === null
                        ? t("未加载", "Not loaded")
                        : passportAllowlistMode
                          ? t("启用", "Enabled")
                          : t("停用", "Disabled")}
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
              <p className="meta-label">{t("业务说明", "Business Notes")}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {t("判定顺序", "Decision Order")}
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-sky-50 px-5 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-sky-600 shadow-sm">
                    <Tags size={20} />
                  </div>
                  <p className="mt-4 font-black text-slate-900">{t("策略优先级", "Policy Priority")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {t(
                      "先检查 `passport` 策略，再检查 `type`，最后检查 `global`。第一个命中的有效授权决定是否允许签发。",
                      "Check `passport` first, then `type`, and finally `global`. The first matching valid rule decides whether issuance is allowed.",
                    )}
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50 px-5 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
                    <Wallet size={20} />
                  </div>
                  <p className="mt-4 font-black text-slate-900">{t("限制标记", "Restriction Flag")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {t(
                      "`restrictToExplicitPassportList` 表示该策略只有在发行方同时拥有护照级显式授权时才会生效。",
                      "`restrictToExplicitPassportList` means the rule only applies when the issuer also has explicit passport-level authorization.",
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
          </div>
        </section>
      </div>
    </PassportShell>
  );
}
