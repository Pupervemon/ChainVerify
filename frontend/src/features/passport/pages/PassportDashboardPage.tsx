import {
  Activity,
  ArrowRight,
  Blocks,
  Cpu,
  FileBadge2,
  FilePlus2,
  FileSearch,
  Link2,
  Network,
  PanelsTopLeft,
  PenSquare,
  ScanSearch,
  ShieldCheck,
  ShieldX,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { arePassportContractsConfigured, PASSPORT_CONTRACTS } from "../../../config/passport";
import { useWalletSession } from "../../../hooks/useWalletSession";
import PassportShell from "../components/PassportShell";
import { usePassportLocale } from "../i18n";

const contractLabels = [
  ["AssetPassport", PASSPORT_CONTRACTS.assetPassport],
  ["ChronicleStamp", PASSPORT_CONTRACTS.chronicleStamp],
  ["PassportAuthority", PASSPORT_CONTRACTS.passportAuthority],
  ["PassportFactory", PASSPORT_CONTRACTS.passportFactory],
] as const;

const toneStyles: Record<string, string> = {
  amber: "border-amber-300/20 bg-amber-400/10 text-amber-200",
  cyan: "border-cyan-300/20 bg-cyan-400/10 text-cyan-200",
  emerald: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  sky: "border-sky-300/20 bg-sky-400/10 text-sky-200",
  slate: "border-white/10 bg-white/[0.05] text-slate-200",
};

export default function PassportDashboardPage() {
  const navigate = useNavigate();
  const [passportIdInput, setPassportIdInput] = useState("");
  const [localError, setLocalError] = useState("");
  const isConfigured = arePassportContractsConfigured();
  const { t } = usePassportLocale();

  const { blockNumber, currentChainName, hasCorrectChain, isConnected, targetChainName } =
    useWalletSession();

  const handleOpenPassport = () => {
    const trimmed = passportIdInput.trim();

    if (!/^\d+$/.test(trimmed) || trimmed === "0") {
      setLocalError(t("请输入有效的正整数 Passport ID。", "Enter a valid positive Passport ID."));
      return;
    }

    setLocalError("");
    navigate(`/passport/${trimmed}`);
  };

  const operationalStats = [
    {
      hint: t("核心模块地址已注入", "Core modules injected"),
      icon: Blocks,
      label: t("合约部署", "Contracts"),
      tone: "cyan",
      value: contractLabels.filter(([, address]) => Boolean(address)).length.toString().padStart(2, "0"),
    },
    {
      hint: !isConnected
        ? t("等待钱包接入", "Waiting for wallet")
        : hasCorrectChain
          ? currentChainName
          : `${currentChainName} -> ${targetChainName}`,
      icon: Activity,
      label: t("网络同步", "Network Sync"),
      tone: hasCorrectChain ? "emerald" : "amber",
      value: !isConnected ? "--" : hasCorrectChain ? "OK" : "WARN",
    },
    {
      hint: t("用于运营确认链上活跃度", "Operational heartbeat"),
      icon: Cpu,
      label: t("最新区块", "Latest Block"),
      tone: "slate",
      value: blockNumber ? `#${blockNumber}` : "--",
    },
  ];

  const operatingLanes = [
    {
      description: t(
        "按 Passport ID 快速进入详情页，查看 owner、subject account、CID 与状态。",
        "Open detail views by Passport ID to inspect owner, subject account, CID, and state.",
      ),
      icon: ScanSearch,
      title: t("护照读取", "Passport Read"),
      tone: "cyan",
    },
    {
      description: t(
        "沿时间线查看印章签发、替代和撤销关系，适合审计与追溯。",
        "Review issuance, supersession, and revocation in a timeline for audit and traceability.",
      ),
      icon: Link2,
      title: t("履历链路", "Chronicle Lineage"),
      tone: "sky",
    },
    {
      description: t(
        "创建、签发、撤销等写操作已经拆入 Workbench，避免在总览页形成噪音。",
        "Create, issue, and revoke flows live in the Workbench so the dashboard stays operationally clean.",
      ),
      icon: FileBadge2,
      title: t("写入操作分流", "Write Separation"),
      tone: "amber",
    },
  ];

  return (
    <PassportShell currentKey="dashboard">
      <div className="space-y-10">
        <section className="passport-dashboard-hero-shell">
          <div className="passport-dashboard-hero">
            <div className="passport-dashboard-hero__glow" />
            <div className="passport-dashboard-hero__content">
              <span className="passport-dashboard-hero__eyebrow">
                {t("鎶ょ収浠〃鐩樺紩瀵?, "Passport Dashboard Introduction")}
              </span>
              <div className="space-y-4">
                <h1 className="passport-dashboard-hero__title">
                  {t(
                    "鍦?dashboard 椤甸《閮ㄦ瀯寤轰竴涓洿娓呮櫚鐨勫叆鍙ｏ紝鐢ㄤ簬鎵胯浇 passport 鐨勬牳蹇冧环鍊间笌浣跨敤鏂瑰紡銆?,
                    "Create a clearer top-level entry on the dashboard for the core value and usage model of the passport system.",
                  )}
                </h1>
                <p className="passport-dashboard-hero__description">
                  {t(
                    "杩欎釜鍖哄煙鐜板湪浣滀负椤堕儴鏂囧瓧灞曠ず鍖猴紝鍚庣画鍙互缁х画鎵╁睍涓烘満鏋勪粙缁嶃€佷骇鍝佸畾浣嶃€佹祦绋嬫瑙堟垨鍙鍖栨暟鎹彁绀恒€?,
                    "This block now serves as the top text-introduction surface and can later expand into institutional messaging, product positioning, flow summaries, or visual data highlights.",
                  )}
                </p>
              </div>

              <div className="passport-dashboard-hero__meta">
                <div className="passport-dashboard-hero__meta-card">
                  <span className="passport-dashboard-hero__meta-label">
                    {t("鍖哄煙楂樺害", "Section Height")}
                  </span>
                  <span className="passport-dashboard-hero__meta-value">432px</span>
                </div>
                <div className="passport-dashboard-hero__meta-card">
                  <span className="passport-dashboard-hero__meta-label">
                    {t("鍐呭瀹藉害", "Content Width")}
                  </span>
                  <span className="passport-dashboard-hero__meta-value">1900.8px</span>
                </div>
                <div className="passport-dashboard-hero__meta-card">
                  <span className="passport-dashboard-hero__meta-label">
                    {t("瑙嗚璇█", "Visual Tone")}
                  </span>
                  <span className="passport-dashboard-hero__meta-value">
                    {t("姗欒壊娓愬彉", "Orange Gradient")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
          <div className="absolute -right-24 top-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute bottom-0 left-12 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-cyan-200">
                {t("机构护照总览", "Institution Passport Overview")}
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-white lg:text-5xl">
                  {t(
                    "把护照检索、网络状态与运营入口收敛到一个适合机构协作的控制台。",
                    "Unify passport lookup, network posture, and operator entry points into a dashboard built for institutional workflows.",
                  )}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "总览页优先服务查询、审计与环境确认。写入型操作被折叠到 Workbench，保证主界面保持克制、稳定、可追踪。",
                    "The overview prioritizes lookup, audit, and environment confirmation. Write flows stay in the Workbench so the main surface remains calm, stable, and traceable.",
                  )}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {operationalStats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div key={stat.label} className="panel-soft px-4 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="meta-label">{stat.label}</p>
                          <p className="mt-2 font-nav text-2xl font-bold tracking-tight text-white">
                            {stat.value}
                          </p>
                        </div>
                        <span
                          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${toneStyles[stat.tone]}`}
                        >
                          <Icon size={20} />
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium text-slate-900">{stat.hint}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="panel-soft px-4 py-3">
                  <p className="meta-label">{t("当前范围", "Current Scope")}</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {t("查询与审计优先", "Lookup-first operations")}
                  </p>
                </div>
                <div className="panel-soft px-4 py-3">
                  <p className="meta-label">{t("操作控制台", "Control Surface")}</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {t("统一收敛至 Passport Workbench", "Routed through Passport Workbench")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => navigate("/passport/workbench")}
                  className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-950 transition-all hover:bg-cyan-200"
                >
                  <PanelsTopLeft size={16} />
                  {t("打开工作台", "Open Workbench")}
                </button>
                <button
                  onClick={() => navigate("/passport/create")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-100 transition-all hover:border-cyan-300/30 hover:text-cyan-200"
                >
                  <FilePlus2 size={16} />
                  {t("创建护照", "Create Passport")}
                </button>
                <button
                  onClick={() => navigate("/passport/issue")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-100 transition-all hover:border-amber-300/30 hover:text-amber-200"
                >
                  <PenSquare size={16} />
                  {t("签发印章", "Issue Stamp")}
                </button>
              </div>
            </div>

            <div className="glass-card relative space-y-4 p-6">
              <div className="space-y-1">
                <p className="meta-label">{t("护照检索", "Passport Query")}</p>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  {t("按 Passport ID 打开记录", "Open by Passport ID")}
                </h2>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={t("例如 1", "For example 1")}
                  value={passportIdInput}
                  onChange={(event) => {
                    setPassportIdInput(event.target.value);
                    if (localError) {
                      setLocalError("");
                    }
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-base font-semibold text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/30 focus:ring-4 focus:ring-cyan-300/10"
                />
                <button
                  onClick={handleOpenPassport}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition-all hover:bg-cyan-50 active:scale-[0.99]"
                >
                  {t("打开护照", "Open Passport")}
                  <ArrowRight size={18} />
                </button>
                {localError ? (
                  <p className="text-sm font-medium text-rose-400">{localError}</p>
                ) : (
                  <p className="text-sm font-medium text-slate-900">
                    {t(
                      "“我的护照”自动列表暂未接入，因为当前合约尚未暴露 owner 到 passport 的枚举能力。",
                      "\"My Passports\" is not wired yet because the current contracts do not expose owner-to-passport enumeration.",
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="panel-surface p-8">
              <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-6">
                <div>
                  <p className="meta-label">{t("环境状态", "Environment Status")}</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                    {t("运行姿态", "Runtime Posture")}
                  </h2>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] ${
                      isConfigured
                        ? "bg-emerald-400/12 text-emerald-300"
                        : "bg-rose-400/12 text-rose-300"
                    }`}
                  >
                    {isConfigured ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
                    {t("合约配置", "Contracts")}: {isConfigured ? t("已对齐", "Aligned") : t("未对齐", "Missing")}
                  </span>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] ${
                      !isConnected
                        ? "bg-white/[0.08] text-slate-300"
                        : hasCorrectChain
                          ? "bg-emerald-400/12 text-emerald-300"
                          : "bg-amber-400/12 text-amber-300"
                    }`}
                  >
                    <Network size={14} />
                    {t("网络连接", "Network")}: {!isConnected ? t("未连接", "Offline") : hasCorrectChain ? t("已对齐", "Aligned") : t("需要切换", "Switch Required")}
                  </span>
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="panel-soft flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.06] shadow-sm transition-all duration-300 ${
                        isConnected
                          ? hasCorrectChain
                            ? "text-emerald-300"
                            : "text-amber-300"
                          : "text-slate-400"
                      }`}
                    >
                      <Wallet size={20} />
                    </div>
                    <div>
                      <p className="meta-label">{t("当前网络", "Current Network")}</p>
                      <p className="mt-1 font-black text-white">
                        {isConnected ? currentChainName : t("钱包未连接", "Wallet Disconnected")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-2 w-2">
                      {!isConnected ? (
                        <span className="h-full w-full rounded-full bg-slate-400" />
                      ) : hasCorrectChain ? (
                        <>
                          <span className="animate-status-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        </>
                      ) : (
                        <>
                          <span className="animate-status-pulse-amber absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {isConnected && (
                  <div className="panel-soft flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/8 bg-white/[0.06] text-cyan-300 shadow-sm">
                        <Cpu size={20} />
                      </div>
                      <div>
                        <p className="meta-label">{t("目标网络", "Target Network")}</p>
                        <p className="mt-1 font-black text-white">{targetChainName}</p>
                      </div>
                    </div>
                    {blockNumber && (
                      <div className="rounded-lg border border-white/8 bg-white/[0.06] px-3 py-1.5 text-[11px] font-black text-slate-300 shadow-sm">
                        # {blockNumber}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="panel-surface p-8">
              <h3 className="meta-label">{t("合约地址详情", "Contract Address Snapshot")}</h3>
              <div className="mt-4 space-y-3">
                {contractLabels.map(([label, address]) => (
                  <div key={label} className="panel-soft flex items-center justify-between px-5 py-3.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                      {label}
                    </span>
                    <span className="font-mono text-[11px] font-medium text-slate-300">
                      {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : t("未配置", "Not Configured")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel-surface p-8">
            <p className="meta-label">{t("业务说明", "Operational Notes")}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              {t("当前前端边界", "Current Frontend Boundary")}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {operatingLanes.map((lane) => {
                const Icon = lane.icon;

                return (
                  <div key={lane.title} className="panel-soft px-5 py-5">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${toneStyles[lane.tone]}`}
                    >
                      <Icon size={20} />
                    </div>
                    <p className="mt-4 font-black text-white">{lane.title}</p>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-900">
                      {lane.description}
                    </p>
                  </div>
                );
              })}

              <div className="panel-soft px-5 py-5 md:col-span-2 lg:col-span-1 xl:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-200">
                    <FileSearch size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white">{t("机构使用建议", "Operational Guidance")}</p>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-900">
                      {t(
                        "如果后续增加 owner 维度的索引能力，可以在总览页继续增加“我的护照”和批量检索；在那之前，保持 ID 驱动检索更符合当前合约能力边界。",
                        "If owner-level indexing is added later, this dashboard can expand into 'My Passports' and batch lookup. Until then, ID-driven lookup is the cleanest match for current contract capabilities.",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PassportShell>
  );
}
