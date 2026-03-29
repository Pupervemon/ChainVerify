import type { PassportStatus } from "../../../types/passport";
import { usePassportLocale } from "../i18n";

type PassportStatusBadgeProps = {
  status: PassportStatus;
};

const statusMap: Record<PassportStatus, { className: string }> = {
  uninitialized: {
    className: "bg-slate-100 text-slate-500",
  },
  active: {
    className: "bg-emerald-100 text-emerald-700",
  },
  frozen: {
    className: "bg-amber-100 text-amber-700",
  },
  retired: {
    className: "bg-rose-100 text-rose-700",
  },
};

export default function PassportStatusBadge({ status }: PassportStatusBadgeProps) {
  const { t } = usePassportLocale();
  const config = statusMap[status];
  const labelMap: Record<PassportStatus, string> = {
    uninitialized: t("未初始化", "Uninitialized"),
    active: t("生效中", "Active"),
    frozen: t("冻结", "Frozen"),
    retired: t("退役", "Retired"),
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] ${config.className}`}
    >
      {labelMap[status]}
    </span>
  );
}
