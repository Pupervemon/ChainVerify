import {
  Clock3,
  FileBadge2,
  PenSquare,
  ShieldAlert,
  ShieldBan,
  ShieldCheck,
  Tags,
  Waypoints,
} from "lucide-react";
import { Link } from "react-router-dom";

import type { StampRecord } from "../../../types/passport";
import { usePassportLocale } from "../i18n";

type StampTimelineProps = {
  stamps: StampRecord[];
};

const formatDateTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const truncateHash = (value: string, left = 10, right = 8) =>
  value.length > left + right ? `${value.slice(0, left)}...${value.slice(-right)}` : value;

export default function StampTimeline({ stamps }: StampTimelineProps) {
  const { t } = usePassportLocale();

  if (stamps.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/50 px-8 py-14 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
          <FileBadge2 size={28} />
        </div>
        <h3 className="mt-5 text-xl font-black tracking-tight text-slate-900">
          {t("暂无履历印章", "No Chronicle Stamps")}
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-500">
          {t(
            "当前护照还没有任何印章记录。认证、维修、展览等事件在链上签发后会展示在这里。",
            "No stamp history has been recorded for this passport yet. Authentication, repair, and exhibition events will appear here once they are issued on-chain.",
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stamps.map((stamp) => (
        <article
          key={stamp.stampId.toString()}
          className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-orange-100 hover:shadow-[0_16px_40px_-24px_rgba(251,146,60,0.55)]"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                  {stamp.revoked ? <ShieldAlert size={20} /> : <ShieldCheck size={20} />}
                </span>
                <div>
                  <p className="text-lg font-black tracking-tight text-slate-900">
                    {stamp.type?.name || t(`印章类型 #${stamp.stampTypeId.toString()}`, `Stamp Type #${stamp.stampTypeId.toString()}`)}
                  </p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    {stamp.type?.code || t("未配置", "UNCONFIGURED")} / {t("印章", "Stamp")} #{stamp.stampId.toString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${
                    stamp.revoked
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {stamp.revoked ? t("已撤销", "Revoked") : t("生效中", "Effective")}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="meta-label">{t("发行方", "Issuer")}</p>
                  <p className="mt-1 break-all font-mono text-sm text-slate-700">{stamp.issuer}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="meta-label">{t("元数据 CID", "Metadata CID")}</p>
                  <p className="mt-1 break-all font-mono text-sm text-slate-700">
                    {stamp.metadataCID}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/passport/issue?passportId=${stamp.passportId.toString()}&stampTypeId=${stamp.stampTypeId.toString()}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:border-orange-200 hover:text-orange-600"
                >
                  <PenSquare size={14} />
                  {t("签发同类型", "Issue Same Type")}
                </Link>
                <Link
                  to={`/passport/policies?scope=passport&passportId=${stamp.passportId.toString()}&issuer=${stamp.issuer}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-700 transition-all hover:border-sky-200 hover:text-sky-600"
                >
                  <Tags size={14} />
                  {t("查看策略", "View Policy")}
                </Link>
                {!stamp.revoked ? (
                  <Link
                    to={`/passport/revoke?stampId=${stamp.stampId.toString()}`}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-rose-700 transition-all hover:bg-rose-100"
                  >
                    <ShieldBan size={14} />
                    {t("撤销印章", "Revoke Stamp")}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px] lg:max-w-[360px] lg:grid-cols-1">
              <div className="rounded-2xl border border-slate-100 px-4 py-3">
                <p className="meta-label">{t("发生时间", "Occurred At")}</p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock3 size={16} className="text-slate-400" />
                  {formatDateTime(stamp.occurredAt)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 px-4 py-3">
                <p className="meta-label">{t("签发时间", "Issued At")}</p>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock3 size={16} className="text-slate-400" />
                  {formatDateTime(stamp.issuedAt)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 px-4 py-3">
                <p className="meta-label">{t("链路关系", "Lineage")}</p>
                <div className="mt-2 space-y-2 text-sm font-semibold text-slate-700">
                  <p className="inline-flex items-center gap-2">
                    <Waypoints size={16} className="text-slate-400" />
                    {t("替代", "Supersedes")}{" "}
                    {stamp.supersedesStampId === 0n ? t("无", "None") : `#${stamp.supersedesStampId.toString()}`}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Waypoints size={16} className="text-slate-400" />
                    {t("被撤销关联印章", "Revoked By")}{" "}
                    {stamp.revokedByStampId === 0n ? t("无", "None") : `#${stamp.revokedByStampId.toString()}`}
                  </p>
                </div>
              </div>
              {stamp.type?.schemaCID ? (
                <div className="rounded-2xl border border-slate-100 px-4 py-3">
                  <p className="meta-label">{t("类型 Schema CID", "Type Schema CID")}</p>
                  <p className="mt-2 break-all font-mono text-sm text-slate-700">
                    {truncateHash(stamp.type.schemaCID, 18, 12)}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
