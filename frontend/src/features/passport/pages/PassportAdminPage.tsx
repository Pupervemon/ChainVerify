import { Copy, ExternalLink, RefreshCw, ShieldCheck, ShieldX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { TARGET_CHAIN } from "../../../config/network";
import {
  isPassportAddress,
  PASSPORT_AUTHORITY_ADDRESS,
} from "../../../config/passport";
import PassportShell from "../components/PassportShell";
import PassportTransactionSuccessNotice from "../components/PassportTransactionSuccessNotice";
import { usePassportCreatorAdmin } from "../hooks/usePassportCreatorAdmin";
import { usePassportCreatorList } from "../hooks/usePassportCreatorList";
import { usePassportTransactionSuccessNotice } from "../hooks/usePassportTransactionSuccessNotice";
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
  const blockExplorerBaseUrl = TARGET_CHAIN.blockExplorers?.default.url?.replace(/\/$/, "") || "";
  const {
    authorityOwner,
    creatorStatus,
    error,
    isAuthorityOwner,
    isCheckingCreator,
    isConfigured,
    isLoadingAuthorityOwner,
    isSubmitting,
    lastConfirmedTxHash,
    statusMessage,
    loadCreatorStatus,
    setPassportCreator,
  } = usePassportCreatorAdmin({
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
    creators,
    error: creatorListError,
    isLoading: isLoadingCreatorList,
    refreshCreatorList,
  } = usePassportCreatorList();

  const normalizedOperator = operatorAddress.trim();
  const hasValidOperator = useMemo(
    () => isPassportAddress(normalizedOperator),
    [normalizedOperator],
  );
  const activeCreatorCountLabel = isLoadingCreatorList
    ? "--"
    : creators.length.toString().padStart(2, "0");
  const isAccessPending = isLoadingAuthorityOwner && !authorityOwner;
  const authorityOwnerLabel = isLoadingAuthorityOwner
    ? t("鍔犺浇涓?..", "Loading...")
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
        "This wallet can grant or revoke creator permissions.",
        "This wallet can grant or revoke creator permissions.",
      )
      : t(
        "Only the authority owner can update creator permissions.",
        "Only the authority owner can update creator permissions.",
      );
  const accessToneClass = isAccessPending
    ? "text-slate-500"
    : isAuthorityOwner
      ? "text-emerald-700"
      : "text-amber-700";

  useEffect(() => {
    if (!lastConfirmedTxHash) {
      return;
    }

    void refreshCreatorList();
  }, [lastConfirmedTxHash, refreshCreatorList]);

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Ignore clipboard failures so the admin screen stays interactive.
    }
  };

  return (
    <PassportShell currentKey="admin">
      <PassportTransactionSuccessNotice
        message={successNoticeMessage}
        onClose={clearSuccessNotice}
      />
      <div className="passport-dashboard-body">
        <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
          <div className="passport-dashboard-primary__grid relative">
            <div className="passport-dashboard-primary__content space-y-5">
              <span className="passport-dashboard-primary__header">
                {t("Creator Access", "Creator Access")}
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                  {t(
                    "Manage which wallets can create passports.",
                    "Manage which wallets can create passports.",
                  )}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "Use this page to check one operator address and grant or revoke creator access in PassportAuthority.",
                    "Use this page to check one operator address and grant or revoke creator access in PassportAuthority.",
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

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">
                      {t("Active Creators", "Active Creators")}
                    </p>
                    <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-cyan-700">
                      {activeCreatorCountLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {t(
                      "Rebuilt from PassportCreatorSet full-chain scan results.",
                      "Rebuilt from PassportCreatorSet full-chain scan results.",
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
                  {t("Manage Operator", "Manage Operator")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "Enter an operator wallet, check its current creator status, then update access if you are the authority owner.",
                    "Enter an operator wallet, check its current creator status, then update access if you are the authority owner.",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="passport-creator-address">
                  {t("Operator Address", "Operator Address")}
                </label>
                <input
                  id="passport-creator-address"
                  type="text"
                  value={operatorAddress}
                  onChange={(event) => setOperatorAddress(event.target.value)}
                  placeholder="0x..."
                  className="passport-dashboard-query__input mt-3 h-12 font-mono"
                />
              </div>

              <div className="passport-dashboard-primary__actions">
                <button
                  onClick={() => void loadCreatorStatus(normalizedOperator)}
                  disabled={!hasValidOperator || isCheckingCreator}
                  className="passport-action-button passport-action-button--secondary"
                >
                  <RefreshCw size={16} className={isCheckingCreator ? "animate-spin" : ""} />
                  {t("Check Status", "Check Status")}
                </button>
                <button
                  onClick={() => void setPassportCreator(normalizedOperator, true)}
                  disabled={!isAuthorityOwner || !hasValidOperator || isSubmitting}
                  className="passport-action-button passport-action-button--primary"
                >
                  <ShieldCheck size={16} />
                  {t("Grant", "Grant")}
                </button>
                <button
                  onClick={() => void setPassportCreator(normalizedOperator, false)}
                  disabled={!isAuthorityOwner || !hasValidOperator || isSubmitting}
                  className="passport-action-button passport-action-button--secondary hover:border-rose-300/60 hover:text-rose-700"
                >
                  <ShieldX size={16} />
                  {t("Revoke", "Revoke")}
                </button>
              </div>

              {creatorStatus !== null ? (
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("Current Status", "Current Status")}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    {creatorStatus
                      ? t(
                        "This operator can create passports through the factory.",
                        "This operator can create passports through the factory.",
                      )
                      : t(
                        "This operator is not authorized to create passports.",
                        "This operator is not authorized to create passports.",
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

          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start justify-between gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("Authorized Wallets", "Authorized Wallets")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "Current creator wallets reconstructed from PassportCreatorSet logs on the target chain.",
                    "Current creator wallets reconstructed from PassportCreatorSet logs on the target chain.",
                  )}
                </p>
              </div>

              <button
                onClick={() => void refreshCreatorList()}
                disabled={!isConfigured || isLoadingCreatorList}
                className="passport-action-button passport-action-button--secondary"
              >
                <RefreshCw size={16} className={isLoadingCreatorList ? "animate-spin" : ""} />
                {t("Refresh List", "Refresh List")}
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900">
                <p className="font-semibold">
                  {t("前端全链扫描说明", "Frontend Full-Chain Scan Note")}
                </p>
                <p className="mt-2">
                  {t(
                    "当前列表由浏览器直接扫描 PassportAuthority 的 PassportCreatorSet 事件，从区块 0 回放到最新区块后重建结果。后续接入后端索引或 API 时，请优先替换这里的读取路径。",
                    "This list is currently rebuilt in the browser by replaying PassportAuthority PassportCreatorSet logs from block 0 to the latest block. When a backend indexer or API is introduced, replace this read path first.",
                  )}
                </p>
              </div>

              <div className="panel-soft p-5">
                <p className="meta-label">{t("Indexed Source", "Indexed Source")}</p>
                <p className="mt-3 break-all font-mono text-sm font-semibold text-slate-900">
                  {PASSPORT_AUTHORITY_ADDRESS || t("Not configured", "Not configured")}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  {t(
                    "以 PassportCreatorSet 事件为准重建当前已授权 creator 钱包列表。",
                    "The active creator wallet list is reconstructed from PassportCreatorSet logs.",
                  )}
                </p>
              </div>

              {creatorListError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {creatorListError}
                </div>
              ) : null}

              {isLoadingCreatorList ? (
                <div className="panel-soft p-5 text-sm font-semibold text-slate-700">
                  {t(
                    "正在从链上日志重建 creator 授权列表...",
                    "Rebuilding the creator authorization list from on-chain logs...",
                  )}
                </div>
              ) : creators.length > 0 ? (
                <div className="passport-dashboard-addresses">
                  <div className="passport-dashboard-address-list">
                    {creators.map((creator, index) => {
                      const addressHref = blockExplorerBaseUrl
                        ? `${blockExplorerBaseUrl}/address/${creator.address}`
                        : "";

                      return (
                        <div
                          key={creator.address.toLowerCase()}
                          className="passport-dashboard-address-item"
                        >
                          <div className="passport-dashboard-address-item__header">
                            <span className="passport-dashboard-address-item__label">
                              {t("Authorized Wallet", "Authorized Wallet")}{" "}
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                              {t("Active", "Active")}
                            </span>
                          </div>
                          <div className="passport-dashboard-address-item__value">
                            <div className="passport-dashboard-address-item__row">
                              <span className="passport-dashboard-address-item__link is-static">
                                {creator.address}
                              </span>
                              <div className="passport-dashboard-address-item__actions">
                                <button
                                  type="button"
                                  onClick={() => void handleCopyAddress(creator.address)}
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
                                    {t("Etherscan", "Etherscan")}
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    disabled
                                    className="passport-dashboard-address-item__action is-disabled"
                                    title={t(
                                      "当前链未配置区块浏览器。",
                                      "No block explorer is configured for the current chain.",
                                    )}
                                  >
                                    <ExternalLink size={12} />
                                    {t("Etherscan", "Etherscan")}
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="mt-3 text-xs font-medium text-slate-500">
                              {creator.blockNumber !== null
                                ? t(
                                  `最近索引更新区块 #${creator.blockNumber.toString()}。`,
                                  `Last indexed update block #${creator.blockNumber.toString()}.`,
                                )
                                : t(
                                  "最近索引更新区块不可用。",
                                  "The last indexed update block is unavailable.",
                                )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="panel-soft p-5 text-sm font-semibold text-slate-700">
                  {t(
                    "当前 PassportCreatorSet 扫描结果中没有处于授权状态的钱包。",
                    "No wallet is currently authorized in the latest PassportCreatorSet scan.",
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
