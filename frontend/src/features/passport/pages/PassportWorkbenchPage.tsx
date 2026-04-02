import { ArrowRight, FilePlus2, PenSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

import PassportShell from "../components/PassportShell";
import { usePassportLocale } from "../i18n";

type WorkbenchAction = {
  description: string;
  label: string;
  path: string;
};

function ActionCard(props: {
  action: WorkbenchAction;
  index: number;
  onOpen: (path: string) => void;
}) {
  const { action, index, onOpen } = props;

  return (
    <button
      key={action.path}
      onClick={() => onOpen(action.path)}
      className="passport-workbench-cell passport-workbench-action passport-workbench-action-card panel-soft group px-5 py-5 text-left transition-all hover:bg-slate-50"
    >
      <div className="passport-workbench-action-card__content">
        <div className="passport-workbench-action-card__copy">
          <div className="flex items-start justify-between gap-4">
            <p className="passport-workbench-action-card__title">{action.label}</p>
            <span className="passport-workbench-action-card__metric">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <p className="passport-workbench-action-card__description">{action.description}</p>
        </div>
        <span className="passport-action-link passport-workbench-action-card__link">
          Open Surface
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-700"
          />
        </span>
      </div>
    </button>
  );
}

export default function PassportWorkbenchPage() {
  const navigate = useNavigate();
  const { t } = usePassportLocale();

  const authorityActions: WorkbenchAction[] = [
    {
      label: t("可信工厂", "Trusted Factories"),
      description: t(
        "Authorize or remove factory contracts that AssetPassport trusts to mint passports.",
        "Authorize or remove factory contracts that AssetPassport trusts to mint passports.",
      ),
      path: "/passport/factories",
    },
    {
      label: t("閸掓稑缂撻弶鍐�?, "Creator Access"),
      description: t(
        "Grant or revoke institution wallets that can create passports before opening downstream flows.",
        "Grant or revoke institution wallets that can create passports before opening downstream flows.",
      ),
      path: "/passport/admin",
    },
    {
      label: t("发章授权", "Issuer Authorization"),
      description: t(
        "按全局、类型和 Passport 范围管理发章授权�?,
        "Manage issuer authorization across global, type, and passport scope.",
      ),
      path: "/passport/policies",
    },
    {
      label: t("Type Admins", "Type Admins"),
      description: t(
        "Delegate stamp type admins so type definition and governance can be managed per domain.",
        "Delegate stamp type admins so type definition and governance can be managed per domain.",
      ),
      path: "/passport/stamp-type-admins",
    },
    {
      label: t("Revocation Ops", "Revocation Ops"),
      description: t(
        "Assign global revocation operators for emergency response, compliance, and correction workflows.",
        "Assign global revocation operators for emergency response, compliance, and correction workflows.",
      ),
      path: "/passport/revocation-operators",
    },
  ];

  const institutionActions: WorkbenchAction[] = [
    {
      label: t("閸掓稑缂撻幎銈囧�?, "Create Passport"),
      description: t(
        "Mint a new passport through the factory with the subject account and initial CID.",
        "Mint a new passport through the factory with the subject account and initial CID.",
      ),
      path: "/passport/create",
    },
    {
      label: t("Stamp Types", "Stamp Types"),
      description: t(
        "Maintain codes, names, schemas, and lifecycle modes before any issuance flow starts.",
        "Maintain codes, names, schemas, and lifecycle modes before any issuance flow starts.",
      ),
      path: "/passport/stamp-types",
    },
    {
      label: t("缁涙儳褰傞崡鎵�?, "Issue Stamp"),
      description: t(
        "Issue a chronicle stamp directly from the institution wallet into the auditable timeline.",
        "Issue a chronicle stamp directly from the institution wallet into the auditable timeline.",
      ),
      path: "/passport/issue",
    },
    {
      label: t("閹俱倝鏀㈤崡鎵�?, "Revoke Stamp"),
      description: t(
        "Revoke an issued stamp with a reason CID while preserving a traceable change record.",
        "Revoke an issued stamp with a reason CID while preserving a traceable change record.",
      ),
      path: "/passport/revoke",
    },
  ];

  const executionFlow = [
    {
      step: t("Step 1", "Step 1"),
      title: t("Complete governance and access setup first", "Complete governance and access setup first"),
      description: t(
        "先完成可信工厂、创建权限、发章授权、类型管理员和撤销操作员设置，再进入机构执行流程�?,
        "Start with trusted factories, creator access, issuer authorization, type admins, and revocation operators so institution flows never start in an undefined authorization state.",
      ),
    },
    {
      step: t("Step 2", "Step 2"),
      title: t("Define stamp types before issuance", "Define stamp types before issuance"),
      description: t(
        "Lock in stamp codes, schemas, and singleton rules before issuance to avoid semantic drift on-chain.",
        "Lock in stamp codes, schemas, and singleton rules before issuance to avoid semantic drift on-chain.",
      ),
    },
    {
      step: t("Step 3", "Step 3"),
      title: t("Move into institution execution last", "Move into institution execution last"),
      description: t(
        "Create passports first, then issue or revoke stamps so every write happens within a clear identity and policy context.",
        "Create passports first, then issue or revoke stamps so every write happens within a clear identity and policy context.",
      ),
    },
  ];

  return (
    <PassportShell currentKey="workbench">
      <div className="passport-workbench-page space-y-10">
        <section className="passport-dashboard-hero-shell">
          <div className="passport-dashboard-hero passport-workbench-hero-banner">
            <div className="passport-dashboard-hero__glow" />
            <div className="passport-dashboard-hero__container">
              <div className="passport-dashboard-hero__content">
                <div className="passport-dashboard-hero__lead">
                  <span className="passport-dashboard-hero__eyebrow">
                    {t("Passport Workbench", "Passport Workbench")}
                  </span>
                  <p className="passport-dashboard-hero__subcopy">
                    {t(
                      "Consolidate passport governance, issuance setup, and institution execution into one operator-facing workbench.",
                      "Consolidate passport governance, issuance setup, and institution execution into one operator-facing workbench.",
      )}
                  </p>
                  <div className="passport-dashboard-hero__query">
                    <p className="passport-dashboard-query__description">
                      {t(
                        "This surface avoids repeating dashboard lookup and runtime overview, and instead sends operators directly into role setup, passport creation, stamp issuance, and revocation flows.",
                        "This surface avoids repeating dashboard lookup and runtime overview, and instead sends operators directly into role setup, passport creation, stamp issuance, and revocation flows.",
      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="passport-workbench-body">
          <section className="passport-workbench-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />

            <div className="passport-workbench-primary__grid relative">
              <div className="passport-workbench-primary__content space-y-5">
                <span className="passport-workbench-primary__header">
                  {t("Passport Workbench", "Passport Workbench")}
                </span>

                <div className="space-y-3">
                  <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                    {t(
                      "Centralize write flows into one workbench that takes users straight into governance and institution execution.",
                      "Centralize write flows into one workbench that takes users straight into governance and institution execution.",
      )}
                  </h1>
                  <p className="max-w-2xl text-base font-medium text-slate-900">
                    {t(
                      "This page avoids repeating dashboard overview, network, and contract snapshots, and stays focused on the actions users actually need to launch.",
                      "This page avoids repeating dashboard overview, network, and contract snapshots, and stays focused on the actions users actually need to launch.",
      )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => navigate("/passport/create")}
                    className="passport-action-button passport-action-button--primary"
                  >
                    <FilePlus2 size={16} />
                    {t("閸掓稑缂撻幎銈囧�?, "Create Passport")}
                  </button>
                  <button
                    onClick={() => navigate("/passport/issue")}
                    className="passport-action-button passport-action-button--secondary hover:border-blue-300/40 hover:text-blue-700"
                  >
                    <PenSquare size={16} />
                    {t("缁涙儳褰傞崡鎵�?, "Issue Stamp")}
                  </button>
                  <button
                    onClick={() => navigate("/passport")}
                    className="passport-action-button passport-action-button--secondary hover:border-amber-300/40 hover:text-amber-700"
                  >
                    <ArrowRight size={16} />
                    {t("鏉╂柨娲?Dashboard", "Open Dashboard")}
                  </button>
                </div>

              </div>
            </div>
          </section>

          <section className="passport-workbench-secondary grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="passport-workbench-secondary__column space-y-6">
              <div className="passport-workbench-panel panel-surface p-8">
                <div className="passport-workbench-panel__stack">
                  <div className="passport-workbench-panel__head">
                    <h2 className="text-3xl font-black tracking-tight text-slate-900">
                      {t("Governance Setup", "Governance Setup")}
                    </h2>
                  </div>

                  <div className="passport-workbench-action-grid grid gap-4">
                    {authorityActions.map((action, index) => (
                      <ActionCard
                        key={action.path}
                        action={action}
                        index={index}
                        onOpen={(path) => navigate(path)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="passport-workbench-panel panel-surface p-8">
              <div className="passport-workbench-panel__stack">
                <div className="passport-workbench-panel__head">
                  <h2 className="text-3xl font-black tracking-tight text-slate-900">
                    {t("Institution Workflow", "Institution Workflow")}
                  </h2>
                </div>

                <div className="passport-workbench-action-grid grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {institutionActions.map((action, index) => (
                    <ActionCard
                      key={action.path}
                      action={action}
                      index={index}
                      onOpen={(path) => navigate(path)}
                    />
                  ))}
                </div>
              </div>

              <div className="passport-workbench-sequence mt-6">
                <div className="passport-workbench-sequence__header">
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">
                    {t("閹恒劏宕樺ù浣衡柤", "Recommended Flow")}
                  </h3>
                </div>

                <div className="passport-workbench-sequence__grid mt-6 grid gap-4">
                  {executionFlow.map((item) => (
                    <div key={item.step} className="passport-workbench-cell panel-soft px-5 py-5">
                      <p className="passport-workbench-sequence__step">
                        {item.step}
                      </p>
                      <p className="mt-3 font-black text-slate-900">{item.title}</p>
                      <p className="passport-workbench-sequence__description">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PassportShell>
  );
}


