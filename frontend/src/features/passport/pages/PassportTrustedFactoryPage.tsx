import { Building2, Copy, ExternalLink, RefreshCw, ShieldCheck, ShieldX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { TARGET_CHAIN } from "../../../config/network";
import {
  ASSET_PASSPORT_ADDRESS,
  isPassportAddress,
} from "../../../config/passport";
import PassportShell from "../components/PassportShell";
import { usePassportTrustedFactoryAdmin } from "../hooks/usePassportTrustedFactoryAdmin";
import { usePassportTrustedFactoryList } from "../hooks/usePassportTrustedFactoryList";
import { usePassportLocale } from "../i18n";

type PassportTrustedFactoryPageProps = {
  connectedAddress: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

export default function PassportTrustedFactoryPage(
  props: PassportTrustedFactoryPageProps,
) {
  const { connectedAddress, ensureSupportedChain, hasCorrectChain, isConnected } = props;
  const { t } = usePassportLocale();
  const [factoryAddress, setFactoryAddress] = useState("");
  const blockExplorerBaseUrl = TARGET_CHAIN.blockExplorers?.default.url?.replace(/\/$/, "") || "";
  const {
    assetPassportOwner,
    error,
    factoryStatus,
    isAssetPassportOwner,
    isCheckingFactory,
    isConfigured,
    isLoadingAssetPassportOwner,
    isSubmitting,
    lastConfirmedTxHash,
    loadFactoryStatus,
    setTrustedFactory,
    statusMessage,
  } = usePassportTrustedFactoryAdmin({
    address: connectedAddress,
    ensureSupportedChain,
    hasCorrectChain,
    isConnected,
  });
  const {
    error: factoryListError,
    factories,
    isLoading: isLoadingFactoryList,
    refreshFactoryList,
  } = usePassportTrustedFactoryList();

  const normalizedFactory = factoryAddress.trim();
  const hasValidFactory = useMemo(
    () => isPassportAddress(normalizedFactory),
    [normalizedFactory],
  );
  const activeFactoryCountLabel = isLoadingFactoryList
    ? "--"
    : factories.length.toString().padStart(2, "0");
  const isAccessPending = isLoadingAssetPassportOwner && !assetPassportOwner;
  const assetPassportOwnerLabel = isLoadingAssetPassportOwner
    ? t("Loading...", "Loading...")
    : assetPassportOwner || t("Unavailable", "Unavailable");
  const connectedWalletLabel = connectedAddress || t("Not connected", "Not connected");
  const accessLabel = isAccessPending
    ? t("Checking", "Checking")
    : isAssetPassportOwner
      ? t("Owner Access", "Owner Access")
      : t("Read Only", "Read Only");
  const accessHint = isAccessPending
    ? t(
        "Loading AssetPassport ownership for this wallet.",
        "Loading AssetPassport ownership for this wallet.",
      )
    : isAssetPassportOwner
      ? t(
          "This wallet can add or remove trusted factory contracts.",
          "This wallet can add or remove trusted factory contracts.",
        )
      : t(
          "Only the AssetPassport owner can update the trusted factory allowlist.",
          "Only the AssetPassport owner can update the trusted factory allowlist.",
        );
  const accessToneClass = isAccessPending
    ? "text-slate-500"
    : isAssetPassportOwner
      ? "text-emerald-700"
      : "text-amber-700";

  useEffect(() => {
    if (!lastConfirmedTxHash) {
      return;
    }

    void refreshFactoryList();
  }, [lastConfirmedTxHash, refreshFactoryList]);

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Ignore clipboard failures so the control surface remains usable.
    }
  };

  return (
    <PassportShell currentKey="factories">
      <div className="passport-dashboard-body">
        <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
          <div className="passport-dashboard-primary__grid relative">
            <div className="passport-dashboard-primary__content space-y-5">
              <span className="passport-dashboard-primary__header">
                {t("Trusted Factories", "Trusted Factories")}
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                  {t(
                    "Manage which factory contracts can mint passports.",
                    "Manage which factory contracts can mint passports.",
                  )}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "Use this page to check one factory contract, then add or remove it from AssetPassport trusted factories.",
                    "Use this page to check one factory contract, then add or remove it from AssetPassport trusted factories.",
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
                      {assetPassportOwnerLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    AssetPassport
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
                    {ASSET_PASSPORT_ADDRESS || t("Not configured", "Not configured")}
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">
                      {t("Trusted Factories", "Trusted Factories")}
                    </p>
                    <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-cyan-700">
                      {activeFactoryCountLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    {t(
                      "Read directly from AssetPassport.factoryCount() and factoryAt().",
                      "Read directly from AssetPassport.factoryCount() and factoryAt().",
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
                  {t("Manage Factory", "Manage Factory")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "Enter a factory contract address, check its current trust status, then update the allowlist if you are the AssetPassport owner.",
                    "Enter a factory contract address, check its current trust status, then update the allowlist if you are the AssetPassport owner.",
                  )}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="passport-trusted-factory-address">
                  {t("Factory Contract", "Factory Contract")}
                </label>
                <input
                  id="passport-trusted-factory-address"
                  type="text"
                  value={factoryAddress}
                  onChange={(event) => setFactoryAddress(event.target.value)}
                  placeholder="0x..."
                  className="passport-dashboard-query__input mt-3 h-12 font-mono"
                />
              </div>

              <div className="passport-dashboard-primary__actions">
                <button
                  onClick={() => void loadFactoryStatus(normalizedFactory)}
                  disabled={!hasValidFactory || isCheckingFactory}
                  className="passport-action-button passport-action-button--secondary"
                >
                  <RefreshCw size={16} className={isCheckingFactory ? "animate-spin" : ""} />
                  {t("Check Status", "Check Status")}
                </button>
                <button
                  onClick={() => void setTrustedFactory(normalizedFactory, true)}
                  disabled={!isAssetPassportOwner || !hasValidFactory || isSubmitting}
                  className="passport-action-button passport-action-button--primary"
                >
                  <ShieldCheck size={16} />
                  {t("Trust", "Trust")}
                </button>
                <button
                  onClick={() => void setTrustedFactory(normalizedFactory, false)}
                  disabled={!isAssetPassportOwner || !hasValidFactory || isSubmitting}
                  className="passport-action-button passport-action-button--secondary hover:border-rose-300/60 hover:text-rose-700"
                >
                  <ShieldX size={16} />
                  {t("Remove", "Remove")}
                </button>
              </div>

              {factoryStatus !== null ? (
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("Current Status", "Current Status")}</p>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    {factoryStatus
                      ? t(
                          "This factory can call AssetPassport.mintPassport(...) and set subject accounts.",
                          "This factory can call AssetPassport.mintPassport(...) and set subject accounts.",
                        )
                      : t(
                          "This factory is not trusted by AssetPassport.",
                          "This factory is not trusted by AssetPassport.",
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
                    "AssetPassport is not configured in the frontend environment.",
                    "AssetPassport is not configured in the frontend environment.",
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start justify-between gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("Current Allowlist", "Current Allowlist")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "These are the factory contracts currently trusted by AssetPassport.",
                    "These are the factory contracts currently trusted by AssetPassport.",
                  )}
                </p>
              </div>

              <button
                onClick={() => void refreshFactoryList()}
                disabled={!isConfigured || isLoadingFactoryList}
                className="passport-action-button passport-action-button--secondary"
              >
                <RefreshCw size={16} className={isLoadingFactoryList ? "animate-spin" : ""} />
                {t("Refresh List", "Refresh List")}
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-900">
                <p className="font-semibold">{t("On-chain Source", "On-chain Source")}</p>
                <p className="mt-2">
                  {t(
                    "Unlike creator access, trusted factories are enumerable on-chain. The frontend reads AssetPassport.factoryCount() and AssetPassport.factoryAt(index) directly instead of rebuilding from events.",
                    "Unlike creator access, trusted factories are enumerable on-chain. The frontend reads AssetPassport.factoryCount() and AssetPassport.factoryAt(index) directly instead of rebuilding from events.",
                  )}
                </p>
              </div>

              <div className="panel-soft p-5">
                <p className="meta-label">{t("Indexed Source", "Indexed Source")}</p>
                <p className="mt-3 break-all font-mono text-sm font-semibold text-slate-900">
                  {ASSET_PASSPORT_ADDRESS || t("Not configured", "Not configured")}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  {t(
                    "List order follows the current on-chain factory array and may change after removals because AssetPassport compacts the list.",
                    "List order follows the current on-chain factory array and may change after removals because AssetPassport compacts the list.",
                  )}
                </p>
              </div>

              {factoryListError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {factoryListError}
                </div>
              ) : null}

              {isLoadingFactoryList ? (
                <div className="panel-soft p-5 text-sm font-semibold text-slate-700">
                  {t(
                    "Loading the trusted factory allowlist from AssetPassport...",
                    "Loading the trusted factory allowlist from AssetPassport...",
                  )}
                </div>
              ) : factories.length > 0 ? (
                <div className="passport-dashboard-addresses">
                  <div className="passport-dashboard-address-list">
                    {factories.map((factory) => {
                      const addressHref = blockExplorerBaseUrl
                        ? `${blockExplorerBaseUrl}/address/${factory.address}`
                        : "";

                      return (
                        <div
                          key={factory.address.toLowerCase()}
                          className="passport-dashboard-address-item"
                        >
                          <div className="passport-dashboard-address-item__header">
                            <span className="passport-dashboard-address-item__label">
                              {t("Trusted Factory", "Trusted Factory")}{" "}
                              {String(factory.index + 1).padStart(2, "0")}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                              <Building2 size={12} />
                              {t("Active", "Active")}
                            </span>
                          </div>
                          <div className="passport-dashboard-address-item__value">
                            <div className="passport-dashboard-address-item__row">
                              <span className="passport-dashboard-address-item__link is-static">
                                {factory.address}
                              </span>
                              <div className="passport-dashboard-address-item__actions">
                                <button
                                  type="button"
                                  onClick={() => void handleCopyAddress(factory.address)}
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
                                      "当前链未配置区块浏览器。",
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
                              {t(
                                `当前位于可信工厂数组槽位 #${factory.index + 1}。`,
                                `Currently stored at trusted-factory array slot #${factory.index + 1}.`,
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
                    "当前 AssetPassport 工厂白名单中还没有可信工厂。",
                    "No trusted factory is currently present in AssetPassport.",
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
