import {
  AlertCircle,
  ArrowLeft,
  Fingerprint,
  Funnel,
  Link2,
  PanelsTopLeft,
  PenSquare,
  RefreshCw,
  ScrollText,
  ShieldBan,
  Tags,
  UserRound,
  Wallet,
} from "lucide-react";
import { useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { PASSPORT_CONTRACTS } from "../../../config/passport";
import PassportShell from "../components/PassportShell";
import PassportStatusBadge from "../components/PassportStatusBadge";
import StampTimeline from "../components/StampTimeline";
import { usePassportDetail } from "../hooks/usePassportDetail";
import { usePassportLocale } from "../i18n";

const truncateAddress = (value: string) =>
  value ? `${value.slice(0, 8)}...${value.slice(-6)}` : "";

const formatPassportId = (value: bigint) => `#${value.toString()}`;

export default function PassportDetailPage() {
  const { t } = usePassportLocale();
  const { passportId: passportIdParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isValidPassportId = Boolean(passportIdParam && /^\d+$/.test(passportIdParam));
  const passportId = isValidPassportId ? BigInt(passportIdParam as string) : undefined;
  const { detail, error, isConfigured, isLoading, notFound, refresh } =
    usePassportDetail(passportId);
  const latestStamp = detail?.stamps[0] ?? null;
  const latestActiveStamp = detail?.stamps.find((stamp) => !stamp.revoked) ?? null;
  const issuerFilter = searchParams.get("issuer") || "all";
  const stampTypeFilter = searchParams.get("stampType") || "all";
  const revocationFilterParam = searchParams.get("state");
  const revocationFilter: "all" | "effective" | "revoked" =
    revocationFilterParam === "effective" || revocationFilterParam === "revoked"
      ? revocationFilterParam
      : "all";

  const updateTimelineFilter = (key: "issuer" | "stampType" | "state", value: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      nextSearchParams.delete(key);
    } else {
      nextSearchParams.set(key, value);
    }

    setSearchParams(nextSearchParams, { replace: true });
  };

  const resetTimelineFilters = () => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("issuer");
    nextSearchParams.delete("stampType");
    nextSearchParams.delete("state");
    setSearchParams(nextSearchParams, { replace: true });
  };
  const issuerOptions = useMemo(
    () =>
      detail
        ? Array.from(new Set(detail.stamps.map((stamp) => stamp.issuer))).sort((left, right) =>
            left.localeCompare(right),
          )
        : [],
    [detail],
  );
  const stampTypeOptions = useMemo(
    () =>
      detail
        ? Array.from(
            new Map(
              detail.stamps.map((stamp) => [
                stamp.stampTypeId.toString(),
                {
                  id: stamp.stampTypeId.toString(),
                  label:
                    stamp.type?.name ||
                    stamp.type?.code ||
                    t(`印章类型 #${stamp.stampTypeId.toString()}`, `Stamp Type #${stamp.stampTypeId.toString()}`),
                },
              ]),
            ).values(),
          )
        : [],
    [detail],
  );
  const filteredStamps = useMemo(() => {
    if (!detail) {
      return [];
    }

    return detail.stamps.filter((stamp) => {
      if (issuerFilter !== "all" && stamp.issuer !== issuerFilter) {
        return false;
      }

      if (stampTypeFilter !== "all" && stamp.stampTypeId.toString() !== stampTypeFilter) {
        return false;
      }

      if (revocationFilter === "effective" && stamp.revoked) {
        return false;
      }

      if (revocationFilter === "revoked" && !stamp.revoked) {
        return false;
      }

      return true;
    });
  }, [detail, issuerFilter, revocationFilter, stampTypeFilter]);

  if (!isValidPassportId) {
    return (
      <PassportShell currentKey="detail">
        <div className="rounded-[2.5rem] border border-rose-100 bg-rose-50/70 p-10">
          <p className="meta-label text-rose-500">{t("无效路由参数", "Invalid Route Param")}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">
            {t("passportId 无效", "Invalid passportId")}
          </h1>
          <p className="mt-4 text-base font-medium text-slate-600">
            {t("路由参数必须是正整数，例如 `/passport/1`。", "The route parameter must be a positive integer such as `/passport/1`.")}
          </p>
          <Link
            to="/passport"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-orange-700 transition-all hover:bg-orange-100"
          >
            <ArrowLeft size={14} />
            {t("返回资产护照", "Back to Passport")}
          </Link>
        </div>
      </PassportShell>
    );
  }

  return (
    <PassportShell currentKey="detail">
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Link
              to="/passport"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-orange-500"
            >
              <ArrowLeft size={14} />
              {t("护照仪表盘", "Passport Dashboard")}
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight text-slate-950">
                {t("护照", "Passport")} {passportId ? formatPassportId(passportId) : ""}
              </h1>
              {detail ? <PassportStatusBadge status={detail.passport.status} /> : null}
            </div>
          </div>

          <button
            onClick={() => void refresh()}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:border-orange-200 hover:text-orange-500 disabled:opacity-60"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            {t("刷新", "Refresh")}
          </button>
          {passportId ? (
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/passport/issue?passportId=${passportId.toString()}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-orange-700 transition-all hover:bg-orange-100"
              >
                <PenSquare size={16} />
                {t("签发印章", "Issue Stamp")}
              </Link>
              <Link
                to={
                  latestActiveStamp
                    ? `/passport/revoke?stampId=${latestActiveStamp.stampId.toString()}`
                    : "/passport/revoke"
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-rose-700 transition-all hover:bg-rose-100"
              >
                <ShieldBan size={16} />
                {t("撤销印章", "Revoke Stamp")}
              </Link>
            </div>
          ) : null}
        </div>

        {!isConfigured ? (
          <section className="rounded-[2.5rem] border border-rose-100 bg-rose-50/70 p-8">
            <p className="meta-label text-rose-500">{t("缺少环境配置", "Missing Environment")}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
              {t("资产护照合约尚未配置", "Passport contracts are not configured")}
            </h2>
            <p className="mt-3 max-w-2xl text-base font-medium text-slate-600">
              {t("需要先在前端环境中配置 Passport 合约地址，之后才能加载护照详情。", "Configure the Passport contract addresses in the frontend environment before loading passport details.")}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4">
                <p className="meta-label">AssetPassport</p>
                <p className="mt-2 break-all font-mono text-sm text-slate-700">
                  {PASSPORT_CONTRACTS.assetPassport || t("未配置", "Not configured")}
                </p>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 px-5 py-4">
                <p className="meta-label">ChronicleStamp</p>
                <p className="mt-2 break-all font-mono text-sm text-slate-700">
                  {PASSPORT_CONTRACTS.chronicleStamp || t("未配置", "Not configured")}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {error ? (
          <section className="rounded-[2.5rem] border border-rose-100 bg-rose-50/70 p-8">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm">
                <AlertCircle size={20} />
              </span>
              <div>
                <p className="meta-label text-rose-500">{t("读取错误", "Read Error")}</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                  {t("护照详情加载失败", "Failed to load passport detail")}
                </h2>
                <p className="mt-3 break-words text-sm font-medium text-slate-600">{error}</p>
              </div>
            </div>
          </section>
        ) : null}

        {notFound ? (
          <section className="rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
              <ScrollText size={30} />
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-slate-900">
              {t("未找到护照", "Passport not found")}
            </h2>
            <p className="mt-3 text-base font-medium text-slate-500">
              {t("链上不存在 passportId 为", "No on-chain passport record exists for passportId")} {passportIdParam} {t("的护照记录。", ".")}
            </p>
          </section>
        ) : null}

        {detail ? (
          <>
            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/70 px-8 py-6">
                  <p className="meta-label">{t("护照摘要", "Passport Summary")}</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    {t("资产身份层", "Asset Identity Layer")}
                  </h2>
                </div>

                <div className="grid gap-4 p-8 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 px-5 py-4 md:col-span-2">
                    <p className="meta-label">{t("资产指纹", "Asset Fingerprint")}</p>
                    <p className="mt-2 break-all font-mono text-sm text-slate-700">
                      {detail.passport.assetFingerprint}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-5 py-4">
                    <p className="meta-label">{t("持有人", "Owner")}</p>
                    <p className="mt-2 inline-flex items-center gap-2 break-all text-sm font-semibold text-slate-700">
                      <Wallet size={16} className="text-slate-400" />
                      {detail.passport.owner}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-5 py-4">
                    <p className="meta-label">Subject Account</p>
                    <p className="mt-2 inline-flex items-center gap-2 break-all text-sm font-semibold text-slate-700">
                      <UserRound size={16} className="text-slate-400" />
                      {detail.passport.subjectAccount ===
                      "0x0000000000000000000000000000000000000000"
                        ? t("未绑定", "Unbound")
                        : detail.passport.subjectAccount}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-5 py-4">
                    <p className="meta-label">{t("护照元数据 CID", "Passport Metadata CID")}</p>
                    <p className="mt-2 break-all font-mono text-sm text-slate-700">
                      {detail.passport.passportMetadataCID || t("未设置", "Not set")}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-5 py-4">
                    <p className="meta-label">{t("资产元数据 CID", "Asset Metadata CID")}</p>
                    <p className="mt-2 break-all font-mono text-sm text-slate-700">
                      {detail.passport.assetMetadataCID || t("未设置", "Not set")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                  <p className="meta-label">{t("身份快照", "Identity Snapshot")}</p>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl border border-slate-100 px-5 py-4">
                      <p className="meta-label">{t("护照 ID", "Passport ID")}</p>
                      <p className="mt-2 text-lg font-black text-slate-900">
                        {formatPassportId(detail.passport.passportId)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 px-5 py-4">
                      <p className="meta-label">{t("状态", "Status")}</p>
                      <div className="mt-2">
                        <PassportStatusBadge status={detail.passport.status} />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-100 px-5 py-4">
                      <p className="meta-label">{t("持有人预览", "Owner Preview")}</p>
                      <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Wallet size={16} className="text-slate-400" />
                        {truncateAddress(detail.passport.owner)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 px-5 py-4">
                      <p className="meta-label">{t("Subject 预览", "Subject Preview")}</p>
                      <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Fingerprint size={16} className="text-slate-400" />
                        {detail.passport.subjectAccount ===
                        "0x0000000000000000000000000000000000000000"
                          ? t("未绑定", "Unbound")
                          : truncateAddress(detail.passport.subjectAccount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                  <p className="meta-label">{t("履历统计", "Chronicle Stats")}</p>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-orange-50 px-5 py-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-500">
                        {t("印章总数", "Total Stamps")}
                      </p>
                      <p className="mt-3 text-3xl font-black text-slate-900">
                        {detail.stamps.length}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-rose-50 px-5 py-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500">
                        {t("已撤销", "Revoked")}
                      </p>
                      <p className="mt-3 text-3xl font-black text-slate-900">
                        {detail.stamps.filter((stamp) => stamp.revoked).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm">
                  <p className="meta-label">{t("上下文操作", "Context Actions")}</p>
                  <div className="mt-5 space-y-3">
                    <Link
                      to={`/passport/issue?passportId=${detail.passport.passportId.toString()}`}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-4 transition-all hover:border-orange-200 hover:bg-orange-50/40"
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                          <PenSquare size={18} />
                        </span>
                        <span>
                          <span className="block text-sm font-black text-slate-900">
                            {t("为此护照签发印章", "Issue stamp for this passport")}
                          </span>
                          <span className="mt-1 block text-xs font-medium text-slate-500">
                            {t("打开签发页，并自动带入当前 passportId。", "Opens issuance with the current passportId prefilled.")}
                          </span>
                        </span>
                      </span>
                      <Link2 size={16} className="text-slate-400" />
                    </Link>

                    <Link
                      to={
                        latestStamp
                          ? `/passport/policies?scope=passport&passportId=${detail.passport.passportId.toString()}&issuer=${latestStamp.issuer}`
                          : `/passport/policies?scope=passport&passportId=${detail.passport.passportId.toString()}`
                      }
                      className="flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-4 transition-all hover:border-sky-200 hover:bg-sky-50/40"
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                          <Tags size={18} />
                        </span>
                        <span>
                          <span className="block text-sm font-black text-slate-900">
                            {t("查看护照级策略", "Inspect passport-level policy")}
                          </span>
                          <span className="mt-1 block text-xs font-medium text-slate-500">
                            {t("如果当前护照已有记录，则自动使用最近一次的 issuer。", "Uses the latest issuer on this passport when one exists.")}
                          </span>
                        </span>
                      </span>
                      <Link2 size={16} className="text-slate-400" />
                    </Link>

                    {latestActiveStamp ? (
                      <Link
                        to={`/passport/revoke?stampId=${latestActiveStamp.stampId.toString()}`}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-4 transition-all hover:border-rose-200 hover:bg-rose-50/40"
                      >
                        <span className="inline-flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                            <ShieldBan size={18} />
                          </span>
                          <span>
                            <span className="block text-sm font-black text-slate-900">
                              {t("撤销最近一条生效印章", "Revoke latest active stamp")}
                            </span>
                            <span className="mt-1 block text-xs font-medium text-slate-500">
                              {t("自动带入待撤销印章", "Prefills stamp")} #{latestActiveStamp.stampId.toString()} {t("。", " for revocation.")}
                            </span>
                          </span>
                        </span>
                        <Link2 size={16} className="text-slate-400" />
                      </Link>
                    ) : null}

                    <a
                      href="#passport-timeline"
                      className="flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-4 transition-all hover:border-slate-200 hover:bg-slate-50"
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                          <ScrollText size={18} />
                        </span>
                        <span>
                          <span className="block text-sm font-black text-slate-900">
                            {t("跳转到印章时间线", "Jump to stamp timeline")}
                          </span>
                          <span className="mt-1 block text-xs font-medium text-slate-500">
                            {t("查看该护照相关履历记录及链路关系。", "Review related chronicle records and lineage for this passport.")}
                          </span>
                        </span>
                      </span>
                      <Link2 size={16} className="text-slate-400" />
                    </a>

                    <Link
                      to="/passport/workbench"
                      className="flex items-center justify-between rounded-2xl border border-slate-100 px-5 py-4 transition-all hover:border-emerald-200 hover:bg-emerald-50/40"
                    >
                      <span className="inline-flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                          <PanelsTopLeft size={18} />
                        </span>
                        <span>
                          <span className="block text-sm font-black text-slate-900">
                            {t("打开护照工作台", "Open passport workbench")}
                          </span>
                          <span className="mt-1 block text-xs font-medium text-slate-500">
                            {t("返回模块控制中心，继续治理与业务操作。", "Return to the module control center for governance and operations.")}
                          </span>
                        </span>
                      </span>
                      <Link2 size={16} className="text-slate-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="passport-timeline" className="space-y-5">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="meta-label">{t("履历", "Chronicle")}</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                    {t("印章时间线", "Stamp Timeline")}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600">
                    <Funnel size={14} />
                    {t(
                      `显示 ${filteredStamps.length} / ${detail.stamps.length}`,
                      `${filteredStamps.length} / ${detail.stamps.length} visible`,
                    )}
                  </span>
                  <p className="text-sm font-medium text-slate-500">
                    {t("优先按 `occurredAt` 排序，缺失时回退到 `issuedAt`。", "Ordered by `occurredAt` first, with `issuedAt` as fallback.")}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:grid-cols-[1fr_1fr_0.9fr_auto]">
                <label className="space-y-2">
                  <span className="meta-label">{t("印章类型", "Stamp Type")}</span>
                  <select
                    value={stampTypeFilter}
                    onChange={(event) => updateTimelineFilter("stampType", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="all">{t("全部类型", "All stamp types")}</option>
                    {stampTypeOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="meta-label">{t("发行方", "Issuer")}</span>
                  <select
                    value={issuerFilter}
                    onChange={(event) => updateTimelineFilter("issuer", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="all">{t("全部发行方", "All issuers")}</option>
                    {issuerOptions.map((issuer) => (
                      <option key={issuer} value={issuer}>
                        {issuer}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="meta-label">{t("状态", "State")}</span>
                  <select
                    value={revocationFilter}
                    onChange={(event) => updateTimelineFilter("state", event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                  >
                    <option value="all">{t("全部状态", "All states")}</option>
                    <option value="effective">{t("仅生效", "Effective only")}</option>
                    <option value="revoked">{t("仅已撤销", "Revoked only")}</option>
                  </select>
                </label>

                <div className="flex items-end">
                  <button
                    onClick={resetTimelineFilters}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50"
                  >
                    {t("重置", "Reset")}
                  </button>
                </div>
              </div>
              <StampTimeline stamps={filteredStamps} />
            </section>
          </>
        ) : null}
      </div>
    </PassportShell>
  );
}
