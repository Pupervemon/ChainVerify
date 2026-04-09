import {
  ArrowRight,
  Copy,
  ExternalLink,
  FileBadge2,
  FileSearch,
  Link2,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  arePassportContractsConfigured,
  isPassportAddress,
  PASSPORT_CONTRACTS,
} from "../../../config/passport";
import { TARGET_CHAIN } from "../../../config/network";
import { usePassportDashboardOverview } from "../hooks/usePassportDashboardOverview";
import { useTargetChainHealth } from "../hooks/useTargetChainHealth";
import { useWalletSession } from "../../../hooks/useWalletSession";
import PassportShell from "../components/PassportShell";
import { usePassportLocale } from "../i18n";

const contractLabels = [
  ["AssetPassport", PASSPORT_CONTRACTS.assetPassport],
  ["ChronicleStamp", PASSPORT_CONTRACTS.chronicleStamp],
  ["PassportAuthority", PASSPORT_CONTRACTS.passportAuthority],
  ["PassportFactory", PASSPORT_CONTRACTS.passportFactory],
] as const;

const blockExplorerBaseUrl = TARGET_CHAIN.blockExplorers?.default.url?.replace(/\/$/, "") || "";

export default function PassportDashboardPage() {
  const navigate = useNavigate();
  const [passportIdInput, setPassportIdInput] = useState("");
  const [localError, setLocalError] = useState("");
  const isConfigured = arePassportContractsConfigured();
  const { t } = usePassportLocale();
  const { overview } = usePassportDashboardOverview();
  const {
    blockNumber: targetBlockNumber,
    isReachable: isTargetChainReachable,
  } = useTargetChainHealth();

  const { currentChainName, hasCorrectChain, isConnected, targetChainName } =
    useWalletSession();
  const configuredContractCount = contractLabels.filter(([, address]) => Boolean(address)).length;
  const offlineMetric = t("Offline", "Offline");
  const getMetricValue = (onlineValue: string) =>
    isTargetChainReachable ? onlineValue : offlineMetric;
  const walletStatusLabel = !isConnected
    ? t("Wallet disconnected", "Wallet disconnected")
    : hasCorrectChain
      ? t(`Wallet on ${currentChainName}`, `Wallet on ${currentChainName}`)
      : t(`Wallet on ${currentChainName}`, `Wallet on ${currentChainName}`);
  const networkStatusValue = isTargetChainReachable
    ? t("Online", "Online")
    : t("Offline", "Offline");
  const networkStatusHint = isTargetChainReachable
    ? t(
      `${targetChainName} network is reachable. ${walletStatusLabel}.`,
      `${targetChainName} network is reachable. ${walletStatusLabel}.`,
    )
    : t(
      `${targetChainName} network is currently unavailable. ${walletStatusLabel}.`,
      `${targetChainName} network is currently unavailable. ${walletStatusLabel}.`,
    );
  const contractStatusHint = isConfigured
    ? t("All passport contract addresses are configured.", "All passport contract addresses are configured.")
    : t("Some passport contract addresses are missing from the frontend environment.", "Some passport contract addresses are missing from the frontend environment.");
  const latestBlockHint = isTargetChainReachable
    ? t(
      `Latest synchronized block from ${targetChainName}.`,
      `Latest synchronized block from ${targetChainName}.`,
    )
    : t(
      `Block height is unavailable until ${targetChainName} is reachable.`,
      `Block height is unavailable until ${targetChainName} is reachable.`,
    );

  const handleOpenPassport = () => {
    const trimmed = passportIdInput.trim();

    if (!/^\d+$/.test(trimmed) || trimmed === "0") {
      setLocalError(t("Enter a valid positive Passport ID.", "Enter a valid positive Passport ID."));
      return;
    }

    setLocalError("");
    navigate(`/passport/${trimmed}`);
  };

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      // Ignore clipboard failures to avoid blocking the dashboard UI.
    }
  };

  const operationalStats = [
    {
      hint: contractStatusHint,
      label: t("Contracts", "Contracts"),
      tone: "cyan",
      value: configuredContractCount.toString().padStart(2, "0"),
    },
    {
      hint: networkStatusHint,
      label: t("Network", "Network"),
      tone: isTargetChainReachable ? "emerald" : "amber",
      value: networkStatusValue,
    },
    {
      hint: latestBlockHint,
      label: t("Latest Block", "Latest Block"),
      tone: "slate",
      value: targetBlockNumber ? `#${targetBlockNumber}` : "--",
    },
  ];

  const systemDataSurfaces = [
    {
      description: t(
        "Passport identity, ownership, and lifecycle status.",
        "Passport identity, ownership, and lifecycle status.",
      ),
      href: "/passport",
      icon: ScanSearch,
      metric: getMetricValue(
        overview?.passportCount !== null && overview?.passportCount !== undefined
          ? overview.passportCount.toString().padStart(2, "0")
          : "--",
      ),
      title: t("Passport Core", "Passport Core"),
      tone: "cyan",
    },
    {
      description: t(
        "Metadata CIDs and linked asset context.",
        "Metadata CIDs and linked asset context.",
      ),
      href: "/passport/cid-studio",
      icon: FileSearch,
      metric: getMetricValue(t("CID", "CID")),
      title: t("Metadata Layer", "Metadata Layer"),
      tone: "slate",
    },
    {
      description: t(
        "Issued, revoked, and superseded stamp activity.",
        "Issued, revoked, and superseded stamp activity.",
      ),
      href: "/passport/issue",
      icon: Link2,
      metric: getMetricValue(
        overview
          ? `${overview.stampIssueCount}/${overview.stampRevocationCount}`
          : "--",
      ),
      title: t("Stamp Activity", "Stamp Activity"),
      tone: "sky",
    },
    {
      description: t(
        "Type definitions, schemas, and active status.",
        "Type definitions, schemas, and active status.",
      ),
      href: "/passport/stamp-types",
      icon: FileBadge2,
      metric: getMetricValue(
        overview
          ? `${overview.activeStampTypeCount}/${overview.stampTypeCount}`
          : "--",
      ),
      title: t("Stamp Types", "Stamp Types"),
      tone: "emerald",
    },
    {
      description: t(
        "全局、类型和 Passport 范围内的发章授权。",
        "Issuer access across global, type, and passport scope.",
      ),
      href: "/passport/policies",
      icon: ShieldCheck,
      metric: getMetricValue(
        overview
          ? overview.enabledPolicyCount.toString().padStart(2, "0")
          : "--",
      ),
      title: t("发章授权", "Issuer Access"),
      tone: "amber",
    },
    {
      description: t(
        "Operator roles and authority-level control paths.",
        "Operator roles and authority-level control paths.",
      ),
      href: "/passport/admin",
      icon: ShieldCheck,
      metric: getMetricValue(
        overview
          ? `${overview.activeCreatorCount + overview.activeRevocationOperatorCount + overview.activeStampTypeAdminCount}`
          : "--",
      ),
      title: t("Access Control", "Access Control"),
      tone: "cyan",
    },
  ];

  return (
    <PassportShell currentKey="dashboard">
      <div className="passport-dashboard-page space-y-10">
        <section className="passport-dashboard-hero-shell">
          <div className="passport-dashboard-hero">
            <div className="passport-dashboard-hero__glow" />
            <div className="passport-dashboard-hero__container">
              <div className="passport-dashboard-hero__content">
                <div className="passport-dashboard-hero__lead">
                  <span className="passport-dashboard-hero__eyebrow">
                    {t("Dashboard", "Dashboard")}
                  </span>
                  <p className="passport-dashboard-hero__subcopy">
                    {t(
                      "Monitor passport lookup, contract status, and runtime posture from a single operational surface.",
                      "Monitor passport lookup, contract status, and runtime posture from a single operational surface.",
                    )}
                  </p>
                  <div className="passport-dashboard-hero__query">
                    <p className="passport-dashboard-query__description">
                      {t("Search by Passport ID to open the detailed record directly.", "Search by Passport ID to open the detailed record directly.")}
                    </p>
                    <div className="passport-dashboard-query__body">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder={t("For example 1", "For example 1")}
                        value={passportIdInput}
                        onChange={(event) => {
                          setPassportIdInput(event.target.value);
                          if (localError) {
                            setLocalError("");
                          }
                        }}
                        className="passport-dashboard-query__input"
                      />
                      <button
                        onClick={handleOpenPassport}
                        className="passport-action-button passport-action-button--primary passport-dashboard-query__button"
                      >
                        {t("Open Passport", "Open Passport")}
                        <ArrowRight size={18} />
                      </button>
                      {localError ? (
                        <p className="passport-dashboard-query__message text-rose-400">{localError}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        <div className="passport-dashboard-body">
          <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
            <div className="absolute -right-24 top-10 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-12 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />

            <div className="passport-dashboard-primary__grid relative">
              <div className="passport-dashboard-primary__content space-y-5">
                <span className="passport-dashboard-primary__header">
                  {t("Institution Passport Overview", "Institution Passport Overview")}
                </span>

                <div className="space-y-3">
                  <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                    {t(
                      "A focused dashboard for passport lookup, network status, and operator access.",
                      "A focused dashboard for passport lookup, network status, and operator access.",
                    )}
                  </h1>
                  <p className="max-w-2xl text-base font-medium text-slate-900">
                    {t(
                      "Use this page to check runtime status, review key contract data, and jump into the Workbench when needed.",
                      "Use this page to check runtime status, review key contract data, and jump into the Workbench when needed.",
                    )}
                  </p>
                </div>

                <div className="passport-dashboard-primary__actions">
                  <button
                    onClick={() => navigate("/passport/workbench")}
                    className="passport-action-button passport-action-button--primary"
                  >
                    {t("Open Workbench", "Open Workbench")}
                  </button>
                  <button
                    onClick={() => navigate("/passport/create")}
                    className="passport-action-button passport-action-button--secondary hover:border-blue-300/40 hover:text-blue-700"
                  >
                    {t("Create Passport", "Create Passport")}
                  </button>
                  <button
                    onClick={() => navigate("/passport/issue")}
                    className="passport-action-button passport-action-button--secondary hover:border-amber-300/40 hover:text-amber-700"
                  >
                    {t("Issue Stamp", "Issue Stamp")}
                  </button>
                </div>

                <div className="passport-dashboard-stats-grid grid gap-3">
                  {operationalStats.map((stat) => {
                    const toneClassName =
                      stat.tone === "emerald"
                        ? "text-emerald-700"
                        : stat.tone === "amber"
                          ? "text-amber-700"
                          : stat.tone === "cyan"
                            ? "text-cyan-700"
                            : "text-slate-900";

                    return (
                      <div
                        key={stat.label}
                        className="passport-dashboard-cell passport-dashboard-stat-card panel-soft"
                      >
                        <div className="passport-dashboard-stat-card__body">
                          <p className="passport-dashboard-card-label">{stat.label}</p>
                          <p className={`passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight ${toneClassName}`}>
                            {stat.value}
                          </p>
                        </div>
                        {stat.hint ? (
                          <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                            {stat.hint}
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          </section>

          <section className="passport-dashboard-secondary">
            <div className="passport-dashboard-status panel-surface p-8">
              <div className="passport-dashboard-panel-head flex items-start gap-4 border-b border-white/8 pb-6">
                <div className="passport-dashboard-status__intro">
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    {t("Contract Addresses", "Contract Addresses")}
                  </h2>
                </div>
              </div>

              <div className="passport-dashboard-addresses">
                <div className="passport-dashboard-address-list mt-8">
                  {contractLabels.map(([label, address]) => {
                    const hasValidAddress = isPassportAddress(address);
                    const addressHref =
                      hasValidAddress && blockExplorerBaseUrl
                        ? `${blockExplorerBaseUrl}/address/${address}`
                        : "";

                    return (
                      <div
                        key={label}
                        className="passport-dashboard-address-item"
                      >
                        <div className="passport-dashboard-address-item__header">
                          <span className="passport-dashboard-address-item__label">
                            {label}
                          </span>
                        </div>
                        <div className="passport-dashboard-address-item__value">
                          {hasValidAddress ? (
                            <div className="passport-dashboard-address-item__row">
                              <span className="passport-dashboard-address-item__link is-static">
                                {address}
                              </span>
                              <div className="passport-dashboard-address-item__actions">
                                <button
                                  type="button"
                                  onClick={() => void handleCopyAddress(address)}
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
                                      "No block explorer is configured for the current chain.",
                                      "No block explorer is configured for the current chain.",
                                    )}
                                  >
                                    <ExternalLink size={12} />
                                    {t("Etherscan", "Etherscan")}
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            address || t("Not Configured", "Not Configured")
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="passport-dashboard-notes-row">
            <div className="passport-dashboard-notes-head">
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {t("Passport Data Overview", "Passport Data Overview")}
              </h2>
            </div>

            <div className="passport-dashboard-notes-grid mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {systemDataSurfaces.map((lane) => {
                return (
                  <Link
                    key={lane.title}
                    to={lane.href}
                    className="passport-dashboard-cell passport-dashboard-notes-card group"
                  >
                    <div className="passport-dashboard-notes-card__content">
                      <div className="passport-dashboard-notes-card__head">
                        <div className="passport-dashboard-notes-card__copy">
                          <p className="passport-dashboard-notes-card__title">{lane.title}</p>
                          <p className="passport-dashboard-notes-card__description">
                            {lane.description}
                          </p>
                        </div>
                        <span className="passport-dashboard-notes-card__metric">
                          {lane.metric}
                        </span>
                      </div>
                      <span className="passport-action-link passport-dashboard-notes-card__link mt-4">
                        {t("Open Surface", "Open Surface")}
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-700"
                        />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </PassportShell>
  );
}
