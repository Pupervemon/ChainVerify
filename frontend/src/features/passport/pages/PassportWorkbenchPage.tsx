import {
  ArrowRight,
  Building2,
  FileJson2,
  FilePlus2,
  ShieldCheck,
  ShieldX,
  Tags,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import PassportShell from "../components/PassportShell";
import { usePassportLocale } from "../i18n";

type WorkbenchAction = {
  description: string;
  icon: LucideIcon;
  label: string;
  path: string;
};

function SurfaceOverviewSection(props: {
  actions: WorkbenchAction[];
  title: string;
  translate: (zh: string, en: string) => string;
}) {
  const { actions, title, translate } = props;

  return (
    <section className="passport-dashboard-notes-row">
      <div className="passport-dashboard-notes-head">
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{title}</h2>
      </div>

      <div className="passport-dashboard-notes-grid passport-workbench-surfaces-grid mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, index) => {
          const orderLabel = String(index + 1).padStart(2, "0");

          return (
            <Link
              key={action.path}
              to={action.path}
              className="passport-dashboard-cell passport-dashboard-notes-card group"
            >
              <div className="passport-dashboard-notes-card__content">
                <div className="passport-dashboard-notes-card__head">
                  <div className="passport-dashboard-notes-card__copy">
                    <p className="passport-dashboard-notes-card__title">{action.label}</p>
                    <p className="passport-dashboard-notes-card__description">
                      {action.description}
                    </p>
                  </div>
                  <span className="passport-dashboard-notes-card__metric">{orderLabel}</span>
                </div>
                <span className="passport-action-link passport-dashboard-notes-card__link mt-4">
                  {translate("Open Surface", "Open Surface")}
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
  );
}

export default function PassportWorkbenchPage() {
  const navigate = useNavigate();
  const { t } = usePassportLocale();

  const governanceActions: WorkbenchAction[] = [
    {
      description: t(
        "Authorize or remove factory contracts that AssetPassport trusts to mint passports.",
        "Authorize or remove factory contracts that AssetPassport trusts to mint passports.",
      ),
      icon: Building2,
      label: t("Trusted Factories", "Trusted Factories"),
      path: "/passport/factories",
    },
    {
      description: t(
        "Grant or revoke institution wallets that can create passports before downstream flows start.",
        "Grant or revoke institution wallets that can create passports before downstream flows start.",
      ),
      icon: ShieldCheck,
      label: t("Creator Access", "Creator Access"),
      path: "/passport/admin",
    },
    {
      description: t(
        "Manage one issuer wallet's stamp access across global, type, and passport scope.",
        "Manage one issuer wallet's stamp access across global, type, and passport scope.",
      ),
      icon: Tags,
      label: t("发章授权", "Issuer Access"),
      path: "/passport/policies",
    },
    {
      description: t(
        "Delegate stamp type admins so type definition and governance can be managed per domain.",
        "Delegate stamp type admins so type definition and governance can be managed per domain.",
      ),
      icon: ShieldCheck,
      label: t("Type Admins", "Type Admins"),
      path: "/passport/stamp-type-admins",
    },
    {
      description: t(
        "Assign global revocation operators for emergency response and correction workflows.",
        "Assign global revocation operators for emergency response and correction workflows.",
      ),
      icon: ShieldX,
      label: t("Revocation Ops", "Revocation Ops"),
      path: "/passport/revocation-operators",
    },
  ];

  const executionActions: WorkbenchAction[] = [
    {
      description: t(
        "Prepare reusable metadata and policy documents before any passport or stamp write.",
        "Prepare reusable metadata and policy documents before any passport or stamp write.",
      ),
      icon: FileJson2,
      label: t("CID Studio", "CID Studio"),
      path: "/passport/cid-studio",
    },
    {
      description: t(
        "Mint a new passport through the factory with the subject account and initial metadata CIDs.",
        "Mint a new passport through the factory with the subject account and initial metadata CIDs.",
      ),
      icon: FilePlus2,
      label: t("Create Passport", "Create Passport"),
      path: "/passport/create",
    },
    {
      description: t(
        "Define codes, names, schemas, and lifecycle modes before issuance begins.",
        "Define codes, names, schemas, and lifecycle modes before issuance begins.",
      ),
      icon: Tags,
      label: t("Stamp Types", "Stamp Types"),
      path: "/passport/stamp-types",
    },
    {
      description: t(
        "Issue chronicle stamps with prepared metadata into the auditable timeline.",
        "Issue chronicle stamps with prepared metadata into the auditable timeline.",
      ),
      icon: ShieldCheck,
      label: t("Issue Stamp", "Issue Stamp"),
      path: "/passport/issue",
    },
    {
      description: t(
        "Revoke an issued stamp with a reason CID while preserving a traceable history.",
        "Revoke an issued stamp with a reason CID while preserving a traceable history.",
      ),
      icon: ShieldX,
      label: t("Revoke Stamp", "Revoke Stamp"),
      path: "/passport/revoke",
    },
  ];

  const executionFlow = [
    {
      description: t(
        "Start with trusted factories and creator access so institutions can only mint through approved entry points.",
        "Start with trusted factories and creator access so institutions can only mint through approved entry points.",
      ),
      step: t("Step 1", "Step 1"),
      title: t("Lock governance first", "Lock governance first"),
    },
    {
      description: t(
        "Set issuer access, type admins, and revocation operators before any operational write happens.",
        "Set issuer access, type admins, and revocation operators before any operational write happens.",
      ),
      step: t("Step 2", "Step 2"),
      title: t("Define who can act", "Define who can act"),
    },
    {
      description: t(
        "Prepare passport, asset, stamp, reason, and policy CIDs before opening create, issue, or revoke flows.",
        "Prepare passport, asset, stamp, reason, and policy CIDs before opening create, issue, or revoke flows.",
      ),
      step: t("Step 3", "Step 3"),
      title: t("Prepare documents and schemas", "Prepare documents and schemas"),
    },
    {
      description: t(
        "Create the passport record, then issue or revoke stamps within the configured policy context.",
        "Create the passport record, then issue or revoke stamps within the configured policy context.",
      ),
      step: t("Step 4", "Step 4"),
      title: t("Execute institution writes", "Execute institution writes"),
    },
  ];

  const governanceCountLabel = governanceActions.length.toString().padStart(2, "0");
  const executionCountLabel = executionActions.length.toString().padStart(2, "0");
  const flowCountLabel = executionFlow.length.toString().padStart(2, "0");

  return (
    <PassportShell currentKey="workbench">
      <div className="passport-dashboard-page space-y-10">
        <section className="passport-dashboard-hero-shell">
          <div className="passport-dashboard-hero">
            <div className="passport-dashboard-hero__glow" />
            <div className="passport-dashboard-hero__container">
              <div className="passport-dashboard-hero__content">
                <div className="passport-dashboard-hero__lead">
                  <span className="passport-dashboard-hero__eyebrow">
                    {t("Passport Workbench", "Passport Workbench")}
                  </span>

                  <p className="passport-dashboard-hero__description">
                    {t(
                      "Prepare CID documents, configure authority, and move directly into create, issue, and revoke flows without losing context.",
                      "Prepare CID documents, configure authority, and move directly into create, issue, and revoke flows without losing context.",
                    )}
                  </p>
                  <div className="passport-dashboard-hero__query">
                    <p className="passport-dashboard-hero__subcopy">
                      {t(
                        "Governance and execution surfaces are organized below so setup decisions and write paths stay easy to scan.",
                        "Governance and execution surfaces are organized below so setup decisions and write paths stay easy to scan.",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="passport-dashboard-body">
          <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
            <div className="passport-dashboard-primary__grid relative">
              <div className="passport-dashboard-primary__content space-y-5">
                <span className="passport-dashboard-primary__header">
                  {t("Passport Workbench", "Passport Workbench")}
                </span>

                <div className="space-y-3">
                  <h2 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                    {t(
                      "Run the full passport business flow from governance setup to institution execution.",
                      "Run the full passport business flow from governance setup to institution execution.",
                    )}
                  </h2>
                  <p className="max-w-2xl text-base font-medium text-slate-900">
                    {t(
                      "This surface keeps the write path tight: configure access, prepare CID documents, then move directly into create, issue, and revoke operations.",
                      "This surface keeps the write path tight: configure access, prepare CID documents, then move directly into create, issue, and revoke operations.",
                    )}
                  </p>
                </div>

                <div className="passport-dashboard-stats-grid grid gap-3">
                  <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                    <div className="passport-dashboard-stat-card__body">
                      <p className="passport-dashboard-card-label">Governance</p>
                      <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-slate-900">
                        {governanceCountLabel}
                      </p>
                    </div>
                    <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                      {t(
                        "Trusted factories, creator access, issuer access, type admins, and revocation operators.",
                        "Trusted factories, creator access, issuer access, type admins, and revocation operators.",
                      )}
                    </p>
                  </div>

                  <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                    <div className="passport-dashboard-stat-card__body">
                      <p className="passport-dashboard-card-label">Execution</p>
                      <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-cyan-700">
                        {executionCountLabel}
                      </p>
                    </div>
                    <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                      {t(
                        "CID Studio, passport creation, stamp type setup, issuance, and revocation.",
                        "CID Studio, passport creation, stamp type setup, issuance, and revocation.",
                      )}
                    </p>
                  </div>

                  <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                    <div className="passport-dashboard-stat-card__body">
                      <p className="passport-dashboard-card-label">Recommended Flow</p>
                      <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-emerald-700">
                        {flowCountLabel}
                      </p>
                    </div>
                    <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                      {t(
                        "CID preparation is now an explicit step before any create, issue, or revoke write.",
                        "CID preparation is now an explicit step before any create, issue, or revoke write.",
                      )}
                    </p>
                  </div>

                  <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                    <div className="passport-dashboard-stat-card__body">
                      <p className="passport-dashboard-card-label">Quick Launch</p>
                      <p className="passport-dashboard-stat-card__value mt-2 font-nav font-bold tracking-tight text-slate-900">
                        {t("CID First", "CID First")}
                      </p>
                    </div>
                    <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                      {t(
                        "Use CID Studio first if the next flow needs metadata, policy, schema, or revocation reason payloads.",
                        "Use CID Studio first if the next flow needs metadata, policy, schema, or revocation reason payloads.",
                      )}
                    </p>
                  </div>
                </div>

                <div className="passport-dashboard-primary__actions">
                  <button
                    type="button"
                    onClick={() => navigate("/passport/cid-studio")}
                    className="passport-action-button passport-action-button--secondary"
                  >
                    <FileJson2 size={16} />
                    {t("Open CID Studio", "Open CID Studio")}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/passport/create")}
                    className="passport-action-button passport-action-button--primary"
                  >
                    <FilePlus2 size={16} />
                    {t("Create Passport", "Create Passport")}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/passport")}
                    className="passport-action-button passport-action-button--secondary"
                  >
                    <ArrowRight size={16} />
                    {t("Open Dashboard", "Open Dashboard")}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="passport-dashboard-secondary space-y-6">
            <SurfaceOverviewSection
              actions={governanceActions}
              title={t("Governance Surfaces", "Governance Surfaces")}
              translate={t}
            />

            <SurfaceOverviewSection
              actions={executionActions}
              title={t("Execution Surfaces", "Execution Surfaces")}
              translate={t}
            />

            <div className="passport-dashboard-status panel-surface p-8">
              <div className="passport-dashboard-panel-head flex items-start gap-4 border-b border-white/8 pb-6">
                <div className="passport-dashboard-status__intro">
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    {t("Recommended Flow", "Recommended Flow")}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                    {t(
                      "Follow this order to avoid failed writes caused by missing access, missing CIDs, or undefined policy context.",
                      "Follow this order to avoid failed writes caused by missing access, missing CIDs, or undefined policy context.",
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-2">
                {executionFlow.map((item) => (
                  <div key={item.step} className="panel-soft p-5">
                    <p className="meta-label">{item.step}</p>
                    <p className="mt-3 text-lg font-black tracking-tight text-slate-900">{item.title}</p>
                    <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </PassportShell>
  );
}
