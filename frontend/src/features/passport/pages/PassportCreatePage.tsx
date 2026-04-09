import { Link2, PlusCircle, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { PASSPORT_FACTORY_ADDRESS } from "../../../config/passport";
import CidComposer from "../components/CidComposer";
import PassportShell from "../components/PassportShell";
import PassportTransactionSuccessNotice from "../components/PassportTransactionSuccessNotice";
import { usePassportCreatePassport } from "../hooks/usePassportCreatePassport";
import { usePassportTransactionSuccessNotice } from "../hooks/usePassportTransactionSuccessNotice";
import { usePassportLocale } from "../i18n";
import { deriveAssetFingerprint, normalizeAssetIdentifier } from "../utils/assetFingerprint";
import { CID_PRESET_BY_KEY } from "../utils/cidPresets";

type PassportCreatePageProps = {
  connectedAddress: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

const passportMetadataPreset = CID_PRESET_BY_KEY.passport;
const assetMetadataPreset = CID_PRESET_BY_KEY.asset;
const passportInputMetaLabelClass = "meta-label !normal-case !tracking-[0.08em] !text-slate-700";
type PostCreatePolicyMode = "allowlist" | "open";

export default function PassportCreatePage(props: PassportCreatePageProps) {
  const { connectedAddress, ensureSupportedChain, hasCorrectChain, isConnected } = props;
  const navigate = useNavigate();
  const { t } = usePassportLocale();
  const [initialHolder, setInitialHolder] = useState("");
  const [assetIdentifier, setAssetIdentifier] = useState("");
  const [passportMetadataCID, setPassportMetadataCID] = useState("");
  const [assetMetadataCID, setAssetMetadataCID] = useState("");
  const [postCreatePolicyMode, setPostCreatePolicyMode] = useState<PostCreatePolicyMode>("open");
  const [continueWithPolicyInitialization, setContinueWithPolicyInitialization] = useState(false);
  const lastAutoRedirectedPassportIdRef = useRef<string | null>(null);
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
  const { clearSuccessNotice, successNoticeMessage } = usePassportTransactionSuccessNotice({
    error,
    isSubmitting,
    statusMessage,
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
  const normalizedAssetIdentifier = normalizeAssetIdentifier(assetIdentifier);
  const derivedAssetFingerprint = normalizedAssetIdentifier
    ? deriveAssetFingerprint(normalizedAssetIdentifier)
    : "";
  const postCreatePolicyOptions: Array<{
    description: string;
    label: string;
    value: PostCreatePolicyMode;
  }> = [
    {
      description: t(
        "Create the passport only. Do not change issuer access or allowlist behavior in this step.",
        "Create the passport only. Do not change issuer access or allowlist behavior in this step.",
      ),
      label: t("不限制", "No Restriction"),
      value: "open",
    },
    {
      description: t(
        "Create the passport first, then continue to passport-level access setup and enable allowlist enforcement there.",
        "Create the passport first, then continue to passport-level access setup and enable allowlist enforcement there.",
      ),
      label: t("创建后去设置白名单", "Set Allowlist After Creation"),
      value: "allowlist",
    },
  ];
  const selectedPostCreatePolicyLabel =
    postCreatePolicyOptions.find((option) => option.value === postCreatePolicyMode)?.label ||
    postCreatePolicyOptions[0].label;
  const selectedPostCreatePolicySummary =
    postCreatePolicyMode === "allowlist"
      ? t(
          "This create step still only writes the passport itself. Allowlist enforcement must be enabled separately after creation succeeds.",
          "This create step still only writes the passport itself. Allowlist enforcement must be enabled separately after creation succeeds.",
        )
      : t(
          "This flow only creates the passport. No extra issuer access or allowlist write will be submitted.",
          "This flow only creates the passport. No extra issuer access or allowlist write will be submitted.",
        );
  const createdPassportPolicyPath =
    createdPassportId !== null
      ? `/passport/policies?scope=passport&passportId=${createdPassportId.toString()}`
      : "/passport/policies?scope=passport";
  const createdPassportAllowlistPath =
    createdPassportId !== null
      ? `/passport/policies?scope=passport&passportId=${createdPassportId.toString()}#passport-allowlist`
      : "/passport/policies?scope=passport#passport-allowlist";
  const postCreateInitializationPath =
    postCreatePolicyMode === "allowlist"
      ? createdPassportAllowlistPath
      : createdPassportPolicyPath;

  useEffect(() => {
    if (createdPassportId === null) {
      lastAutoRedirectedPassportIdRef.current = null;
      return;
    }

    if (!continueWithPolicyInitialization) {
      return;
    }

    const passportId = createdPassportId.toString();

    if (lastAutoRedirectedPassportIdRef.current === passportId) {
      return;
    }

    lastAutoRedirectedPassportIdRef.current = passportId;
    navigate(postCreateInitializationPath);
  }, [
    continueWithPolicyInitialization,
    createdPassportId,
    navigate,
    postCreateInitializationPath,
  ]);

  return (
    <PassportShell currentKey="create">
      <PassportTransactionSuccessNotice
        message={successNoticeMessage}
        onClose={clearSuccessNotice}
      />
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
                    "This flow writes holder, a frontend-derived fingerprint, and metadata references through PassportFactory.createPassport(...).",
                    "This flow writes holder, a frontend-derived fingerprint, and metadata references through PassportFactory.createPassport(...).",
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
                <label className={passportInputMetaLabelClass} htmlFor="passport-holder">
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
                <label className={passportInputMetaLabelClass} htmlFor="passport-asset-identifier">
                  {t("Asset Unique Identifier", "Asset Unique Identifier")}
                </label>
                <input
                  id="passport-asset-identifier"
                  type="text"
                  value={assetIdentifier}
                  onChange={(event) => setAssetIdentifier(event.target.value)}
                  placeholder={t(
                    "Serial number / chip ID / registry ID",
                    "Serial number / chip ID / registry ID",
                  )}
                  className="passport-dashboard-query__input mt-3 h-12"
                />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  {t(
                    "Enter the stable business identifier for this asset. The frontend hashes it into the on-chain bytes32 fingerprint.",
                    "Enter the stable business identifier for this asset. The frontend hashes it into the on-chain bytes32 fingerprint.",
                  )}
                </p>
              </div>

              <div className="panel-soft p-5">
                <label className={passportInputMetaLabelClass} htmlFor="passport-fingerprint">
                  {t("Derived Asset Fingerprint (bytes32)", "Derived Asset Fingerprint (bytes32)")}
                </label>
                <input
                  id="passport-fingerprint"
                  type="text"
                  value={derivedAssetFingerprint}
                  readOnly
                  placeholder="0x..."
                  className="passport-dashboard-query__input mt-3 h-12 font-mono"
                />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  {normalizedAssetIdentifier
                    ? t(
                      "This keccak256 hash is what will be submitted to the contract.",
                      "This keccak256 hash is what will be submitted to the contract.",
                    )
                    : t(
                      "Provide an asset identifier above to preview the fingerprint that will be written on-chain.",
                      "Provide an asset identifier above to preview the fingerprint that will be written on-chain.",
                    )}
                </p>
              </div>

              <div className="panel-soft p-5">
                <label className={passportInputMetaLabelClass} htmlFor="passport-metadata-cid">
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
                <label className={passportInputMetaLabelClass} htmlFor="asset-metadata-cid">
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

              <div className="panel-soft p-5">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-slate-900">
                      {t("创建后策略", "Post-Create Policy")}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm font-medium text-slate-600">
                      {t(
                        "Choose what you plan to do after the passport is created. This selection is for flow planning only and does not submit an extra on-chain permission write.",
                        "Choose what you plan to do after the passport is created. This selection is for flow planning only and does not submit an extra on-chain permission write.",
                      )}
                    </p>
                  </div>
                  <span className="inline-flex min-w-28 items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600">
                    {t("仅规划", "Planning Only")}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 xl:grid-cols-2">
                  {postCreatePolicyOptions.map((option) => {
                    const isSelected = postCreatePolicyMode === option.value;

                    return (
                      <label
                        key={option.value}
                        className={`cursor-pointer rounded-2xl border px-5 py-4 transition-all ${
                          isSelected
                            ? "border-sky-300 bg-sky-50/80 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="post-create-policy"
                            value={option.value}
                            checked={isSelected}
                            onChange={() => setPostCreatePolicyMode(option.value)}
                            className="mt-1 h-4 w-4 border-slate-300 text-sky-600 focus:ring-sky-500"
                          />
                          <span className="block">
                            <span className="block text-sm font-black text-slate-900">
                              {option.label}
                            </span>
                            <span className="mt-2 block text-sm font-medium leading-6 text-slate-600">
                              {option.description}
                            </span>
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div
                  className={`mt-5 rounded-xl border px-4 py-3 text-sm font-medium ${
                    postCreatePolicyMode === "allowlist"
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : "border-sky-200 bg-sky-50 text-sky-900"
                  }`}
                >
                  <p className="font-semibold">
                    {t("当前选择", "Current Selection")}: {selectedPostCreatePolicyLabel}
                  </p>
                  <p className="mt-2">{selectedPostCreatePolicySummary}</p>
                </div>

                <label className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={continueWithPolicyInitialization}
                    onChange={(event) => setContinueWithPolicyInitialization(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="block">
                    <span className="block font-semibold text-slate-900">
                      {t(
                        "创建后继续做权限初始化",
                        "Continue Permission Setup After Creation",
                      )}
                    </span>
                    <span className="mt-2 block font-medium leading-6 text-slate-600">
                      {continueWithPolicyInitialization
                        ? postCreatePolicyMode === "allowlist"
                          ? t(
                              "After success, this page will automatically open the passport access page and jump to the allowlist section with the new passportId.",
                              "After success, this page will automatically open the passport access page and jump to the allowlist section with the new passportId.",
                            )
                          : t(
                              "After success, this page will automatically open the passport access page with the new passportId.",
                              "After success, this page will automatically open the passport access page with the new passportId.",
                            )
                        : t(
                            "Leave this off if you want to stay on the success panel and choose the next step manually.",
                            "Leave this off if you want to stay on the success panel and choose the next step manually.",
                          )}
                    </span>
                  </span>
                </label>
              </div>

              <div className="passport-dashboard-primary__actions">
                <button
                  onClick={() =>
                    void submitCreatePassport({
                      assetIdentifier: assetIdentifier.trim(),
                      assetMetadataCID: assetMetadataCID.trim(),
                      initialHolder: initialHolder.trim() as `0x${string}`,
                      passportMetadataCID: passportMetadataCID.trim(),
                    })
                  }
                  disabled={
                    !canCreatePassport ||
                    isSubmitting ||
                    !hasRequiredMetadata ||
                    !normalizedAssetIdentifier
                  }
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
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={`/passport/${createdPassportId.toString()}`}
                      className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-600 transition-colors hover:text-emerald-700"
                    >
                      <Link2 size={16} />
                      {t("Open Detail", "Open Detail")}
                    </Link>
                    <Link
                      to={createdPassportPolicyPath}
                      className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-sky-600 transition-colors hover:text-sky-700"
                    >
                      <Link2 size={16} />
                      {t("Open Passport Policy", "Open Passport Policy")}
                    </Link>
                  </div>
                </div>
              ) : null}

              {createdPassportId !== null ? (
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("下一步", "Next Step")}</p>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    {postCreatePolicyMode === "allowlist"
                      ? t(
                          "Passport creation is complete. The recommended next step is to enable passport-level allowlist enforcement, or authorize one issuer wallet for this passport first.",
                          "Passport creation is complete. The recommended next step is to enable passport-level allowlist enforcement, or authorize one issuer wallet for this passport first.",
                        )
                      : t(
                          "Passport creation is complete. Continue with passport-level issuer setup if this passport needs a dedicated issuer wallet or a stricter allowlist policy.",
                          "Passport creation is complete. Continue with passport-level issuer setup if this passport needs a dedicated issuer wallet or a stricter allowlist policy.",
                        )}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to={createdPassportPolicyPath}
                      className="passport-action-button passport-action-button--secondary"
                    >
                      <UserRound size={16} />
                      {t("授权单个地址", "Authorize Single Address")}
                    </Link>
                    <Link
                      to={createdPassportAllowlistPath}
                      className={`passport-action-button ${
                        postCreatePolicyMode === "allowlist"
                          ? "passport-action-button--primary"
                          : "passport-action-button--secondary"
                      }`}
                    >
                      <ShieldCheck size={16} />
                      {t("开启 Passport 白名单", "Enable Passport Allowlist")}
                    </Link>
                  </div>
                </div>
              ) : null}

              {createdPassportId !== null ? (
                <div className="panel-soft p-5">
                  <p className="meta-label">{t("创建后策略", "Post-Create Policy")}</p>
                  <p className="mt-3 text-lg font-black text-slate-900">
                    {selectedPostCreatePolicyLabel}
                  </p>
                  <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                    {postCreatePolicyMode === "allowlist"
                      ? t(
                          `Passport #${createdPassportId.toString()} has been created. The next policy step is still a separate action: enable allowlist enforcement for this passport in the access page.`,
                          `Passport #${createdPassportId.toString()} has been created. The next policy step is still a separate action: enable allowlist enforcement for this passport in the access page.`,
                        )
                      : t(
                          `Passport #${createdPassportId.toString()} has been created with no extra policy action selected in this flow.`,
                          `Passport #${createdPassportId.toString()} has been created with no extra policy action selected in this flow.`,
                        )}
                  </p>
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
