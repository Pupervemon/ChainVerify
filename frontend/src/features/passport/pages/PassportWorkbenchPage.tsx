import {
  ArrowRight,
  FilePlus2,
  KeyRound,
  Layers3,
  PenSquare,
  ShieldBan,
  ShieldCheck,
  ShieldUser,
  Tags,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { arePassportContractsConfigured, PASSPORT_CONTRACTS } from "../../../config/passport";
import PassportShell from "../components/PassportShell";
import { usePassportLocale } from "../i18n";

type WorkbenchAction = {
  description: string;
  icon: LucideIcon;
  label: string;
  path: string;
  tone: string;
};

function ActionGrid(props: {
  actions: WorkbenchAction[];
  onOpen: (path: string) => void;
  subtitle: string;
  title: string;
}) {
  const { actions, onOpen, subtitle, title } = props;

  return (
    <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
      <div className="space-y-2">
        <p className="meta-label">{subtitle}</p>
        <h2 className="text-3xl font-black tracking-tight text-slate-900">{title}</h2>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.path}
              onClick={() => onOpen(action.path)}
              className="group rounded-[2rem] border border-slate-100 bg-slate-50/60 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${action.tone}`}
              >
                <Icon size={20} />
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-black tracking-tight text-slate-900">{action.label}</p>
                  <ArrowRight
                    size={16}
                    className="text-slate-400 transition-all group-hover:translate-x-0.5 group-hover:text-slate-700"
                  />
                </div>
                <p className="text-sm font-medium leading-6 text-slate-900">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function PassportWorkbenchPage() {
  const navigate = useNavigate();
  const { t } = usePassportLocale();
  const isConfigured = arePassportContractsConfigured();

  const authorityActions: WorkbenchAction[] = [
    {
      label: t("创建权限", "Creator Access"),
      description: t(
        "授予或撤销可创建护照的机构钱包。",
        "Grant or revoke institution wallets that can create passports.",
      ),
      path: "/passport/admin",
      icon: ShieldUser,
      tone: "bg-sky-50 text-sky-600",
    },
    {
      label: t("发行策略", "Issuer Policies"),
      description: t(
        "配置全局、类型级和护照级签发规则。",
        "Configure global, stamp type, and passport-level issuance rules.",
      ),
      path: "/passport/policies",
      icon: Tags,
      tone: "bg-orange-50 text-orange-600",
    },
    {
      label: t("类型管理员", "Type Admins"),
      description: t(
        "委派印章类型管理员，管理每种类型的配置与撤销权限。",
        "Delegate stamp type admins for per-type configuration and revocation scope.",
      ),
      path: "/passport/stamp-type-admins",
      icon: KeyRound,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: t("撤销操作员", "Revocation Ops"),
      description: t(
        "分配全局撤销操作员，支持应急或合规流程。",
        "Assign global revocation operators for emergency or compliance workflows.",
      ),
      path: "/passport/revocation-operators",
      icon: Undo2,
      tone: "bg-rose-50 text-rose-600",
    },
  ];

  const institutionActions: WorkbenchAction[] = [
    {
      label: t("创建护照", "Create Passport"),
      description: t(
        "作为授权机构通过工厂合约铸造新护照。",
        "Mint a new passport through the factory as an authorized institution.",
      ),
      path: "/passport/create",
      icon: FilePlus2,
      tone: "bg-slate-100 text-slate-700",
    },
    {
      label: t("印章类型", "Stamp Types"),
      description: t(
        "配置每种印章的编码、名称、Schema 与生命周期模式。",
        "Configure the code, name, schema, and lifecycle mode of each stamp type.",
      ),
      path: "/passport/stamp-types",
      icon: Layers3,
      tone: "bg-sky-50 text-sky-600",
    },
    {
      label: t("签发印章", "Issue Stamp"),
      description: t(
        "直接使用机构钱包签发履历印章。",
        "Issue a chronicle stamp directly from the institution wallet.",
      ),
      path: "/passport/issue",
      icon: PenSquare,
      tone: "bg-orange-50 text-orange-600",
    },
    {
      label: t("撤销印章", "Revoke Stamp"),
      description: t(
        "携带原因 CID 与审计记录撤销已签发印章。",
        "Revoke an issued stamp with a reason CID and audit trail.",
      ),
      path: "/passport/revoke",
      icon: ShieldBan,
      tone: "bg-rose-50 text-rose-600",
    },
  ];

  const contractLabels = [
    ["AssetPassport", PASSPORT_CONTRACTS.assetPassport],
    ["ChronicleStamp", PASSPORT_CONTRACTS.chronicleStamp],
    ["PassportAuthority", PASSPORT_CONTRACTS.passportAuthority],
    ["PassportFactory", PASSPORT_CONTRACTS.passportFactory],
  ] as const;

  return (
    <PassportShell currentKey="workbench">
      <div className="space-y-8">
        <section className="rounded-[2.75rem] bg-[linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.98)_50%,_rgba(15,118,110,0.92)_100%)] p-10 text-white shadow-[0_28px_80px_-36px_rgba(15,23,42,0.65)]">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-5">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-emerald-200">
                {t("Passport 工作台", "Passport Workbench")}
              </span>
              <div className="space-y-3">
                <h1 className="max-w-3xl text-5xl font-black tracking-[-0.04em] text-white">
                  {t(
                    "在一个入口完成治理管理与机构操作。",
                    "Run authority governance and institution operations from one place.",
                  )}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "这个控制台是创建权限、发行策略、印章类型治理、护照创建与印章生命周期操作的统一入口。",
                    "Use this console as the operational center for creator permissions, issuer policy management, stamp type governance, passport creation, and stamp lifecycle actions.",
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => navigate("/passport/create")}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-950 transition-all hover:bg-slate-100"
                >
                  <FilePlus2 size={16} />
                  {t("创建护照", "Create Passport")}
                </button>
                <button
                  onClick={() => navigate("/passport/issue")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition-all hover:bg-white/15"
                >
                  <PenSquare size={16} />
                  {t("签发印章", "Issue Stamp")}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-200">
                  {t("治理侧", "Authority")}
                </p>
                <p className="mt-3 text-2xl font-black tracking-tight text-white">
                  {t("4 个控制项", "4 Controls")}
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
                  {t(
                    "包括创建权限、发行策略、类型管理员与撤销操作员。",
                    "Creator access, issuer policies, type admins, and revocation operators.",
                  )}
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-200">
                  {t("机构侧", "Institution")}
                </p>
                <p className="mt-3 text-2xl font-black tracking-tight text-white">
                  {t("4 个动作", "4 Actions")}
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
                  {t(
                    "包括创建护照、管理类型、签发印章和撤销印章。",
                    "Create passport, manage types, issue stamps, and revoke stamps.",
                  )}
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 backdrop-blur-sm sm:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-200">
                      {t("合约", "Contracts")}
                    </p>
                    <p className="mt-3 text-2xl font-black tracking-tight text-white">
                      {isConfigured ? t("已配置", "Configured") : t("缺少环境变量", "Missing Env")}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] ${
                      isConfigured ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {isConfigured ? <ShieldCheck size={14} /> : <ShieldBan size={14} />}
                    {isConfigured ? t("可用", "Ready") : t("检查环境", "Review Env")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <ActionGrid
            title={t("治理控制", "Authority Owner Controls")}
            subtitle={t("治理", "Governance")}
            actions={authorityActions}
            onOpen={(path) => navigate(path)}
          />

          <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="space-y-2">
              <p className="meta-label">{t("配置顺序", "Setup Sequence")}</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {t("推荐流程", "Recommended Flow")}
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-50 px-5 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                  {t("第一步", "Step 1")}
                </p>
                <p className="mt-3 font-black text-slate-900">
                  {t("先配置创建与治理权限", "Grant creator and governance roles")}
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
                  {t(
                    "先完成创建权限、发行策略、类型管理员和撤销操作员的设置。",
                    "Start with creator access, issuer policies, type admins, and revocation operators.",
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                  {t("第二步", "Step 2")}
                </p>
                <p className="mt-3 font-black text-slate-900">
                  {t("配置印章类型定义", "Configure stamp type definitions")}
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
                  {t(
                    "在签发前先定义印章编码、名称、Schema 以及是否单例。",
                    "Define stamp codes, names, schemas, and singleton behavior before issuance.",
                  )}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">
                  {t("第三步", "Step 3")}
                </p>
                <p className="mt-3 font-black text-slate-900">
                  {t("创建护照并执行生命周期操作", "Create passports and operate lifecycle")}
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-900">
                  {t(
                    "由授权机构创建护照、签发印章，并在需要时执行撤销。",
                    "Authorized institutions create passports, issue stamps, and revoke when needed.",
                  )}
                </p>
              </div>
            </div>
          </section>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <ActionGrid
            title={t("机构操作", "Institution Operations")}
            subtitle={t("执行", "Execution")}
            actions={institutionActions}
            onOpen={(path) => navigate(path)}
          />

          <section className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="space-y-2">
              <p className="meta-label">{t("部署快照", "Deployment Snapshot")}</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {t("已连接合约", "Connected Contracts")}
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {contractLabels.map(([label, address]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4"
                >
                  <p className="meta-label">{label}</p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-900">
                    {address || t("未配置", "Not configured")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </section>
      </div>
    </PassportShell>
  );
}
