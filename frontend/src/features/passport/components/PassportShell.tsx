import {
  ChevronLeft,
  ChevronRight,
  DatabaseZap,
  FilePlus2,
  KeyRound,
  LayoutDashboard,
  Layers3,
  PanelsTopLeft,
  PenSquare,
  Search,
  ShieldBan,
  ShieldUser,
  Tags,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

const PASSPORT_SIDEBAR_COLLAPSED_STORAGE_KEY = "passport-sidebar-collapsed";


type PassportShellKey =
  | "dashboard"
  | "workbench"
  | "admin"
  | "create"
  | "policies"
  | "issue"
  | "revoke"
  | "revocation-operators"
  | "stamp-types"
  | "stamp-type-admins"
  | "cid-studio"
  | "detail";

type PassportShellProps = {
  children: ReactNode;
  currentKey: PassportShellKey;
};

type PassportNavItem = {
  description: string;
  icon: LucideIcon;
  key: PassportShellKey;
  label: string;
  path: string;
};

export default function PassportShell(props: PassportShellProps) {
  const { children, currentKey } = props;
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(PASSPORT_SIDEBAR_COLLAPSED_STORAGE_KEY) === "true";
  });
  const [searchQuery, setSearchQuery] = useState("");

  const sections: Array<{ items: PassportNavItem[]; title: string }> = [
    {
      title: "Overview",
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          path: "/passport",
          icon: LayoutDashboard,
          description: "Search and inspect passport records.",
        },
        {
          key: "workbench",
          label: "Workbench",
          path: "/passport/workbench",
          icon: PanelsTopLeft,
          description: "Open the operator control center.",
        },
      ],
    },
    {
      title: "Governance",
      items: [
        {
          key: "admin",
          label: "Creator Access",
          path: "/passport/admin",
          icon: ShieldUser,
          description: "Manage passport creation wallets.",
        },
        {
          key: "policies",
          label: "Issuer Policies",
          path: "/passport/policies",
          icon: Tags,
          description: "Set issuance rules and allowlists.",
        },
        {
          key: "stamp-type-admins",
          label: "Type Admins",
          path: "/passport/stamp-type-admins",
          icon: KeyRound,
          description: "Delegate per-type governance.",
        },
        {
          key: "revocation-operators",
          label: "Revocation Ops",
          path: "/passport/revocation-operators",
          icon: Undo2,
          description: "Assign global revocation operators.",
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          key: "create",
          label: "Create Passport",
          path: "/passport/create",
          icon: FilePlus2,
          description: "Mint a new passport through the factory.",
        },
        {
          key: "stamp-types",
          label: "Stamp Types",
          path: "/passport/stamp-types",
          icon: Layers3,
          description: "Configure type metadata and lifecycle mode.",
        },
        {
          key: "cid-studio",
          label: "CID Studio",
          path: "/passport/cid-studio",
          icon: DatabaseZap,
          description: "Generate and upload CID payloads.",
        },
        {
          key: "issue",
          label: "Issue Stamp",
          path: "/passport/issue",
          icon: PenSquare,
          description: "Issue a chronicle stamp.",
        },
        {
          key: "revoke",
          label: "Revoke Stamp",
          path: "/passport/revoke",
          icon: ShieldBan,
          description: "Revoke a stamp with reason CID.",
        },
      ],
    },
  ];

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredSections = sections
    .map((section) => ({
      ...section,
      items: normalizedSearchQuery
        ? section.items.filter((item) => item.label.toLowerCase().includes(normalizedSearchQuery))
        : section.items,
    }))
    .filter((section) => section.items.length > 0);

  useEffect(() => {
    window.localStorage.setItem(
      PASSPORT_SIDEBAR_COLLAPSED_STORAGE_KEY,
      String(isCollapsed),
    );
  }, [isCollapsed]);

  return (
    <main className={`passport-layout ${isCollapsed ? "is-collapsed" : ""}`}>
      <aside className={`passport-sidebar ${isCollapsed ? "is-collapsed" : ""}`}>
        <div className="flex min-h-[calc(100vh-104px)] flex-col justify-between">
          <div className="space-y-6">
            {!isCollapsed ? (
              <label className="relative block">
                <Search
                  size={15}
                  strokeWidth={2.25}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search"
                  className="h-[38px] w-full rounded-xl border border-[#E5E7EB] bg-white pl-10 pr-3 text-[14px] font-medium text-[#111827] outline-none transition-all placeholder:text-[#9CA3AF] focus:border-[#BFDBFE] focus:bg-[#F8FBFF]"
                  style={{
                    fontFamily:
                      'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                    fontFeatureSettings: "normal",
                    fontVariationSettings: "normal",
                    WebkitFontSmoothing: "antialiased",
                  }}
                />
              </label>
            ) : (
              <div className="group relative">
                <button
                  type="button"
                  aria-label="Search"
                  className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#374151] transition-all hover:bg-[#EFF6FF] hover:text-[#111827]"
                >
                  <Search size={15} strokeWidth={2.25} />
                </button>
                <div
                  className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-20 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  style={{
                    fontFamily:
                      'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                    color: "#111827",
                    fontFeatureSettings: "normal",
                    fontSize: "13px",
                    fontVariationSettings: "normal",
                    fontWeight: 500,
                    letterSpacing: "-0.005em",
                  }}
                >
                  Search
                </div>
              </div>
            )}

            {filteredSections.map((section, index) => (
              <div
                key={section.title}
                className={`space-y-3 ${
                  index === 0 ? "" : "border-t border-[#F3F4F6] pt-4"
                }`}
              >
                {!isCollapsed ? (
                  <p
                    className="overflow-hidden whitespace-nowrap pl-3 tracking-[0.08em]"
                    style={{
                      fontFamily:
                        'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                      color: "#9CA3AF",
                      fontFeatureSettings: "normal",
                      fontSize: "11px",
                      fontVariationSettings: "normal",
                      fontWeight: 600,
                    }}
                  >
                    {section.title}
                  </p>
                ) : null}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentKey === item.key;

                    return (
                      <div className="group relative">
                        <Link
                          key={item.key}
                          to={item.path}
                          className={`flex h-[38px] w-full items-center text-left transition-all ${
                            isActive
                              ? "bg-[#EFF6FF] text-slate-900"
                              : "text-[#374151] hover:bg-[#EFF6FF] hover:text-[#111827]"
                          } ${isCollapsed ? "justify-center rounded-lg px-0" : "rounded-xl px-3"}`}
                        >
                          <span
                            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center ${
                              isActive ? "text-[#111827]" : "text-[#374151]"
                            }`}
                          >
                            <Icon size={17} strokeWidth={2.25} />
                          </span>
                          {!isCollapsed ? (
                            <span className="min-w-0 flex-1 overflow-hidden">
                              <span
                                className="block truncate whitespace-nowrap"
                                style={{
                                  fontFamily:
                                    'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                                  color: isActive ? "#111827" : "#374151",
                                  fontFeatureSettings: "normal",
                                  fontSize: "14px",
                                  fontVariationSettings: "normal",
                                  fontWeight: isActive ? 600 : 500,
                                  letterSpacing: "-0.005em",
                                }}
                              >
                                {item.label}
                              </span>
                            </span>
                          ) : null}
                        </Link>
                        {isCollapsed ? (
                          <div
                            className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-20 -translate-y-1/2 whitespace-nowrap rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                            style={{
                              fontFamily:
                                'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                              color: "#111827",
                              fontFeatureSettings: "normal",
                              fontSize: "13px",
                              fontVariationSettings: "normal",
                              fontWeight: 500,
                              letterSpacing: "-0.005em",
                            }}
                          >
                            {item.label}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed((value) => !value)}
            className={`mt-6 flex h-[38px] items-center rounded-xl border border-[#E5E7EB] text-[#111827] transition-all hover:bg-[#EFF6FF] ${
              isCollapsed ? "w-[38px] justify-center" : "w-full justify-between px-3"
            }`}
          >
            {!isCollapsed ? (
              <span
                className="truncate whitespace-nowrap"
                style={{
                  fontFamily:
                    'Inter, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                  fontFeatureSettings: "normal",
                  fontSize: "14px",
                  fontVariationSettings: "normal",
                  fontWeight: 500,
                }}
              >
                Collapse
              </span>
            ) : null}
            {isCollapsed ? <ChevronRight size={16} strokeWidth={2.25} /> : <ChevronLeft size={16} strokeWidth={2.25} />}
          </button>
        </div>
      </aside>

      <div className="passport-main">{children}</div>
    </main>
  );
}
