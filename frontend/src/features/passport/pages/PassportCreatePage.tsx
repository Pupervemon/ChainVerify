import { Link2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PASSPORT_FACTORY_ADDRESS } from "../../../config/passport";
import CidComposer from "../components/CidComposer";
import PassportShell from "../components/PassportShell";
import { usePassportCreatePassport } from "../hooks/usePassportCreatePassport";
import { usePassportLocale } from "../i18n";
import { CID_PRESET_BY_KEY } from "../utils/cidPresets";

type PassportCreatePageProps = {
  connectedAddress: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

const passportMetadataPreset = CID_PRESET_BY_KEY.passport;
const assetMetadataPreset = CID_PRESET_BY_KEY.asset;

export default function PassportCreatePage(props: PassportCreatePageProps) {
  const { connectedAddress, ensureSupportedChain, hasCorrectChain, isConnected } = props;
  const { t } = usePassportLocale();
  const [initialHolder, setInitialHolder] = useState("");
  const [assetFingerprint, setAssetFingerprint] = useState("");
  const [passportMetadataCID, setPassportMetadataCID] = useState("");
  const [assetMetadataCID, setAssetMetadataCID] = useState("");
  const {
    canCreatePassport,
    createdPassportId,
    createdSubjectAccount,
    error,
    isConfigured,
    isLoadingPermission,
    isSubmitting,
    statusMessage,
    submitCreatePassport,
  } = usePassportCreatePassport({
    address: connectedAddress,
    ensureSupportedChain,
    hasCorrectChain,
    isConnected,
  });

  useEffect(() => {
    if (!initialHolder && connectedAddress) {
      setInitialHolder(connectedAddress);
    }
  }, [connectedAddress, initialHolder]);

  const connectedWalletLabel = connectedAddress || t("Not connected", "Not connected");
  const accessLabel = isLoadingPermission
    ? t("Checking", "Checking")
    : canCreatePassport
      ? t("Authorized Creator", "Authorized Creator")
      : t("Not Authorized", "Not Authorized");
  const accessToneClass = isLoadingPermission
    ? "text-slate-500"
    : canCreatePassport
      ? "text-emerald-700"
      : "text-amber-700";
  const accessHint = isLoadingPermission
    ? t(
      "Loading creator permission for the connected wallet.",
      "Loading creator permission for the connected wallet.",
    )
    : canCreatePassport
      ? t(
        "This wallet can create passports through the factory.",
        "This wallet can create passports through the factory.",
      )
      : t(
        "Creator access must be granted before minting a passport.",
        "Creator access must be granted before minting a passport.",
      );
  const hasRequiredMetadata =
    passportMetadataCID.trim().length > 0 && assetMetadataCID.trim().length > 0;

  return (
    <PassportShell currentKey="create">
      <div className="passport-dashboard-body">
        <section className="passport-dashboard-primary panel-surface accent-grid relative overflow-hidden p-8 lg:p-10">
          <div className="passport-dashboard-primary__grid relative">
            <div className="passport-dashboard-primary__content space-y-5">
              <span className="passport-dashboard-primary__header">
                {t("Create Passport", "Create Passport")}
              </span>

              <div className="space-y-3">
                <h1 className="max-w-3xl font-nav text-4xl font-bold tracking-[-0.04em] text-slate-900 lg:text-5xl">
                  {t(
                    "Create an asset passport with the minimum required initialization data.",
                    "Create an asset passport with the minimum required initialization data.",
                  )}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-900">
                  {t(
                    "This flow writes holder, fingerprint, and metadata references through PassportFactory.createPassport(...).",
                    "This flow writes holder, fingerprint, and metadata references through PassportFactory.createPassport(...).",
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
                    <p className="passport-dashboard-card-label">
                      {t("Connected Wallet", "Connected Wallet")}
                    </p>
                    <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900">
                      {connectedWalletLabel}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    PassportFactory
                  </p>
                </div>

                <div className="passport-dashboard-cell passport-dashboard-stat-card panel-soft">
                  <div className="passport-dashboard-stat-card__body">
                    <p className="passport-dashboard-card-label">Factory</p>
                    <p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900">
                      {PASSPORT_FACTORY_ADDRESS || t("Not configured", "Not configured")}
                    </p>
                  </div>
                  <p className="passport-dashboard-stat-card__hint mt-3 font-medium text-slate-900">
                    AssetPassport mint path
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
                  {t("Passport Input", "Passport Input")}
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="passport-holder">
                  {t("Initial Holder", "Initial Holder")}
                </label>
                <input
                  id="passport-holder"
                  type="text"
                  value={initialHolder}
                  onChange={(event) => setInitialHolder(event.target.value)}
                  placeholder="0x..."
                  className="passport-dashboard-query__input mt-3 h-12 font-mono"
                />
              </div>

              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="passport-fingerprint">
                  {t("Asset Fingerprint (bytes32)", "Asset Fingerprint (bytes32)")}
                </label>
                <input
                  id="passport-fingerprint"
                  type="text"
                  value={assetFingerprint}
                  onChange={(event) => setAssetFingerprint(event.target.value)}
                  placeholder="0x..."
                  className="passport-dashboard-query__input mt-3 h-12 font-mono"
                />
              </div>

              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="passport-metadata-cid">
                  {t("Passport Metadata CID", "Passport Metadata CID")}
                </label>
                <input
                  id="passport-metadata-cid"
                  type="text"
                  value={passportMetadataCID}
                  onChange={(event) => setPassportMetadataCID(event.target.value)}
                  placeholder="ipfs://..."
                  className="passport-dashboard-query__input mt-3 h-12"
                />
              </div>

              <div className="panel-soft p-5">
                <label className="meta-label" htmlFor="asset-metadata-cid">
                  {t("Asset Metadata CID", "Asset Metadata CID")}
                </label>
                <input
                  id="asset-metadata-cid"
                  type="text"
                  value={assetMetadataCID}
                  onChange={(event) => setAssetMetadataCID(event.target.value)}
                  placeholder="ipfs://..."
                  className="passport-dashboard-query__input mt-3 h-12"
                />
              </div>

              {!hasRequiredMetadata ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
                  {t(
                    "Passport Metadata CID and Asset Metadata CID are required. Generate them in the metadata preparation section below or paste existing ipfs:// values.",
                    "Passport Metadata CID and Asset Metadata CID are required. Generate them in the metadata preparation section below or paste existing ipfs:// values.",
                  )}
                </div>
              ) : null}

              <div className="passport-dashboard-primary__actions">
                <button
                  onClick={() =>
                    void submitCreatePassport({
                      assetFingerprint: assetFingerprint.trim() as `0x${string}`,
                      assetMetadataCID: assetMetadataCID.trim(),
                      initialHolder: initialHolder.trim() as `0x${string}`,
                      passportMetadataCID: passportMetadataCID.trim(),
                    })
                  }
                  disabled={!canCreatePassport || isSubmitting || !hasRequiredMetadata}
                  className="passport-action-button passport-action-button--primary"
                >
                  <PlusCircle size={16} />
                  {isSubmitting
                    ? t("Submitting...", "Submitting...")
                    : t("Create Passport", "Create Passport")}
                </button>
              </div>
            </div>
          </div>

          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start justify-between gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("Metadata Preparation", "Metadata Preparation")}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                  {t(
                    "Generate the passport and asset metadata CIDs here. The resulting values fill back into the form above and are required before creation.",
                    "Generate the passport and asset metadata CIDs here. The resulting values fill back into the form above and are required before creation.",
                  )}
                </p>
              </div>

              <Link
                to="/passport/cid-studio"
                className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-600 transition-colors hover:text-emerald-700"
              >
                <Link2 size={16} />
                {t("Open CID Studio", "Open CID Studio")}
              </Link>
            </div>

            <div className="mt-8 grid gap-4 xl:grid-cols-2">
              <div className="panel-soft p-5">
                <CidComposer
                  accent={passportMetadataPreset.accent}
                  defaultPayload={passportMetadataPreset.defaultPayload}
                  description={passportMetadataPreset.description}
                  fieldKey={passportMetadataPreset.fieldKey}
                  formFields={passportMetadataPreset.formFields}
                  framed={false}
                  suggestedFileName={passportMetadataPreset.fileName}
                  value={passportMetadataCID}
                  onChange={setPassportMetadataCID}
                />
              </div>

              <div className="panel-soft p-5">
                <CidComposer
                  accent={assetMetadataPreset.accent}
                  defaultPayload={assetMetadataPreset.defaultPayload}
                  description={assetMetadataPreset.description}
                  fieldKey={assetMetadataPreset.fieldKey}
                  formFields={assetMetadataPreset.formFields}
                  framed={false}
                  suggestedFileName={assetMetadataPreset.fileName}
                  value={assetMetadataCID}
                  onChange={setAssetMetadataCID}
                />
              </div>
            </div>
          </div>

          <div className="passport-dashboard-status panel-surface p-8">
            <div className="passport-dashboard-panel-head flex items-start gap-4 border-b border-white/8 pb-6">
              <div className="passport-dashboard-status__intro">
                <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                  {t("Transaction Outcome", "Transaction Outcome")}
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">
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

              {createdPassportId !== null ? (
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("Created Passport", "Created Passport")}</p>
                  <p className="mt-3 text-lg font-black text-slate-900">
                    #{createdPassportId.toString()}
                  </p>
                  <Link
                    to={`/passport/${createdPassportId.toString()}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-600 transition-colors hover:text-emerald-700"
                  >
                    <Link2 size={16} />
                    {t("Open Detail", "Open Detail")}
                  </Link>
                </div>
              ) : null}

              {createdSubjectAccount ? (
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("Subject Account", "Subject Account")}</p>
                  <p className="mt-3 break-all font-mono text-sm text-slate-700">
                    {createdSubjectAccount}
                  </p>
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
        </section>
      </div>
    </PassportShell>
  );
}
