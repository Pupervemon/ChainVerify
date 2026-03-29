import { Link2, PlusCircle, ShieldCheck, ShieldX, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { PASSPORT_FACTORY_ADDRESS } from "../../../config/passport";
import CidComposer from "../components/CidComposer";
import PassportShell from "../components/PassportShell";
import { usePassportCreatePassport } from "../hooks/usePassportCreatePassport";
import { usePassportLocale } from "../i18n";

type PassportCreatePageProps = {
  connectedAddress: string;
  ensureSupportedChain: () => Promise<boolean>;
  hasCorrectChain: boolean;
  isConnected: boolean;
};

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

  return (
    <PassportShell currentKey="create">
      <div className="space-y-8">
        <section className="rounded-[2.5rem] bg-[linear-gradient(135deg,_rgba(255,247,237,1),_rgba(255,255,255,1)_52%,_rgba(236,253,245,0.9))] p-10 shadow-[0_24px_60px_-28px_rgba(34,197,94,0.25)]">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-emerald-600 shadow-sm">
                {t("机构铸造", "Institution Minting")}
              </span>
              <div className="space-y-3">
                <h1 className="text-5xl font-black tracking-[-0.04em] text-slate-950">
                  {t("通过工厂合约创建资产护照。", "Create an asset passport through the factory.")}
                </h1>
                <p className="max-w-2xl text-base font-medium text-slate-600">
                  {t(
                    "这个流程调用 `PassportFactory.createPassport(...)`。如果工厂已配置 ERC-6551 基础设施，则会在同一笔交易里创建并绑定 subject account。",
                    "This flow calls `PassportFactory.createPassport(...)`. If the factory is configured with ERC-6551 infrastructure, the subject account is created and bound in the same transaction.",
                  )}
                </p>
              </div>
            </div>

            <div className="glass-card space-y-4 p-6">
              <div className="space-y-1">
                <p className="meta-label">{t("权限快照", "Permission Snapshot")}</p>
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  {t("创建权限", "Creator Access")}
                </h2>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">{t("当前钱包", "Connected Wallet")}</p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {connectedAddress || t("未连接", "Not connected")}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white px-5 py-4">
                  <p className="meta-label">PassportFactory</p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {PASSPORT_FACTORY_ADDRESS || t("未配置", "Not configured")}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] ${
                    canCreatePassport
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {canCreatePassport ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
                  {isLoadingPermission
                    ? t("检查中", "Checking")
                    : canCreatePassport
                      ? t("已授权创建者", "Authorized Creator")
                      : t("未授权", "Not Authorized")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
            <div className="space-y-2">
              <p className="meta-label">{t("护照初始化数据", "Passport Init Data")}</p>
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                {t("创建护照", "Create Passport")}
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="passport-holder">
                  {t("初始持有人", "Initial Holder")}
                </label>
                <input
                  id="passport-holder"
                  type="text"
                  value={initialHolder}
                  onChange={(event) => setInitialHolder(event.target.value)}
                  placeholder="0x..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="passport-fingerprint">
                  {t("资产指纹（bytes32）", "Asset Fingerprint (bytes32)")}
                </label>
                <input
                  id="passport-fingerprint"
                  type="text"
                  value={assetFingerprint}
                  onChange={(event) => setAssetFingerprint(event.target.value)}
                  placeholder="0x..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 font-mono text-sm text-slate-900 outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="passport-metadata-cid">
                  {t("护照元数据 CID", "Passport Metadata CID")}
                </label>
                <input
                  id="passport-metadata-cid"
                  type="text"
                  value={passportMetadataCID}
                  onChange={(event) => setPassportMetadataCID(event.target.value)}
                  placeholder="ipfs://..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                />
                <CidComposer
                  accent="emerald"
                  defaultText={`{\n  "name": "",\n  "description": "",\n  "issuer": "",\n  "image": ""\n}`}
                  description={t(
                    "为护照主元数据生成 CID，适合放展示信息、说明和图片引用。",
                    "Generate the CID for passport-level metadata such as display info, descriptions, and image references.",
                  )}
                  fieldKey="passport_metadata"
                  suggestedFileName="passport-metadata.json"
                  value={passportMetadataCID}
                  onChange={setPassportMetadataCID}
                />
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                <label className="meta-label" htmlFor="asset-metadata-cid">
                  {t("资产元数据 CID", "Asset Metadata CID")}
                </label>
                <input
                  id="asset-metadata-cid"
                  type="text"
                  value={assetMetadataCID}
                  onChange={(event) => setAssetMetadataCID(event.target.value)}
                  placeholder="ipfs://..."
                  className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
                />
                <CidComposer
                  accent="emerald"
                  defaultText={`{\n  "serialNumber": "",\n  "category": "",\n  "manufacturer": "",\n  "attachments": []\n}`}
                  description={t(
                    "为资产详情元数据生成 CID，适合放参数、附件、图像和序列号信息。",
                    "Generate the CID for asset-level metadata such as specs, attachments, images, and serial number information.",
                  )}
                  fieldKey="asset_metadata"
                  suggestedFileName="asset-metadata.json"
                  value={assetMetadataCID}
                  onChange={setAssetMetadataCID}
                />
              </div>

              <button
                onClick={() =>
                  void submitCreatePassport({
                    assetFingerprint: assetFingerprint.trim() as `0x${string}`,
                    assetMetadataCID: assetMetadataCID.trim(),
                    initialHolder: initialHolder.trim() as `0x${string}`,
                    passportMetadataCID: passportMetadataCID.trim(),
                  })
                }
                disabled={!canCreatePassport || isSubmitting}
                className="mt-2 inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-emerald-700 transition-all hover:bg-emerald-100 disabled:opacity-50"
              >
                <PlusCircle size={18} />
                {isSubmitting ? t("提交中...", "Submitting...") : t("创建护照", "Create Passport")}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
              <p className="meta-label">{t("结果", "Result")}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {t("交易结果", "Transaction Outcome")}
              </h2>

              <div className="mt-6 space-y-4">
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
                {createdPassportId !== null ? (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                    <p className="meta-label">{t("已创建护照", "Created Passport")}</p>
                    <p className="mt-2 text-lg font-black text-slate-900">
                      #{createdPassportId.toString()}
                    </p>
                    <Link
                      to={`/passport/${createdPassportId.toString()}`}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-600 transition-colors hover:text-emerald-700"
                    >
                      <Link2 size={16} />
                      {t("打开详情", "Open Detail")}
                    </Link>
                  </div>
                ) : null}
                {createdSubjectAccount ? (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 px-5 py-4">
                    <p className="meta-label">{t("Subject Account", "Subject Account")}</p>
                    <p className="mt-2 break-all font-mono text-sm text-slate-700">
                      {createdSubjectAccount}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
              <p className="meta-label">{t("业务说明", "Operational Notes")}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                {t("输入要求", "Input Expectations")}
              </h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-emerald-50 px-5 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
                    <Wallet size={20} />
                  </div>
                <p className="mt-4 font-black text-slate-900">{t("机构控制", "Institution Controlled")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                  {t(
                    "当前连接的钱包必须先在 `PassportAuthority` 中被授权为 passport creator。",
                    "The connected wallet must be authorized as a passport creator in `PassportAuthority`.",
                  )}
                  </p>
                </div>
                <div className="rounded-2xl bg-orange-50 px-5 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm">
                    <PlusCircle size={20} />
                  </div>
                <p className="mt-4 font-black text-slate-900">{t("指纹格式", "Fingerprint Format")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                  {t(
                    "`assetFingerprint` 当前直接输入原始 `bytes32` 十六进制值，后续可以再抽象哈希规则。",
                    "`assetFingerprint` is currently entered as a raw `bytes32` hex string. The hashing rule can be abstracted later.",
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
