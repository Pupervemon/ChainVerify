import { Languages, LogOut, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { usePassportLocale } from "../features/passport/i18n";

type AppNavigationProps = {
  activeWalletIcon?: string;
  activeWalletName: string;
  connectedAddress: string;
  isAccountMenuOpen: boolean;
  isConnected: boolean;
  isDisconnecting: boolean;
  navSearchQuery: string;
  onConnect: () => void;
  onDisconnect: () => void | Promise<void>;
  onNavSearchQueryChange: (value: string) => void;
  onToggleAccountMenu: () => void;
  pathname: string;
  setAccountMenuRef: (element: HTMLDivElement | null) => void;
  truncateAddress: (value: string) => string;
};

const navControlClassName =
  "h-10 rounded-full border border-slate-200 bg-slate-100/70 text-sm transition-all duration-300";

const walletButtonClassName = `${navControlClassName} inline-flex items-center gap-2.5 px-4 hover:border-slate-300 hover:bg-slate-100 active:scale-[0.98]`;

const isActiveNavigationItem = (currentPathname: string, itemPath: string) => {
  if (itemPath === "/") {
    return currentPathname === "/";
  }

  return currentPathname === itemPath || currentPathname.startsWith(`${itemPath}/`);
};

export default function AppNavigation(props: AppNavigationProps) {
  const { locale, setLocale, t } = usePassportLocale();
  const {
    activeWalletIcon,
    activeWalletName,
    connectedAddress,
    isAccountMenuOpen,
    isDisconnecting,
    navSearchQuery,
    onConnect,
    onDisconnect,
    onNavSearchQueryChange,
    onToggleAccountMenu,
    pathname,
    setAccountMenuRef,
    truncateAddress,
  } = props;
  const enableLocaleToggle = false;
  const showLocaleToggle = enableLocaleToggle && (pathname.startsWith("/passport") || pathname.startsWith("/doc"));
  const navigationItems = [
    { label: "Notary", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Passport", path: "/passport" },
    { label: "ZKP", path: "/zkp" },
    { label: t("文档", "DOC"), path: "/doc" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white font-nav selection:bg-orange-100">
      <div className="mx-auto max-w-[1408px] px-4 py-3 sm:px-6 lg:h-[65px] lg:py-0">
        <div className="flex min-w-0 flex-col gap-3 lg:h-full lg:justify-center">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex min-w-0 items-center justify-between gap-4 lg:flex-1 lg:justify-start lg:gap-8">
              <Link to="/" className="shrink-0 text-xl font-black tracking-tighter text-slate-900">
                DeProof
              </Link>

              <div className="hidden min-w-0 flex-1 items-center gap-4 lg:flex xl:gap-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative shrink-0 whitespace-nowrap py-2 text-[15px] font-[700] transition-all xl:text-[16px] ${
                      isActiveNavigationItem(pathname, item.path)
                        ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-orange-500"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {showLocaleToggle ? (
                <button
                  onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 transition-all hover:border-sky-200 hover:text-sky-600 lg:hidden"
                >
                  <Languages size={14} />
                  {locale === "zh" ? "EN" : "CN"}
                </button>
              ) : null}
            </div>

            <div className="flex min-w-0 flex-wrap items-center justify-end gap-3 lg:flex-1 lg:flex-nowrap lg:gap-4">
              {showLocaleToggle ? (
                <button
                  onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
                  className="hidden h-10 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 transition-all hover:border-sky-200 hover:text-sky-600 lg:inline-flex"
                >
                  <Languages size={14} />
                  {locale === "zh" ? "EN" : "CN"}
                </button>
              ) : null}

              <div className="group relative hidden shrink-0 min-[880px]:block">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500"
                />
                <input
                  type="text"
                  placeholder="Search hash..."
                  value={navSearchQuery}
                  onChange={(event) => onNavSearchQueryChange(event.target.value)}
                  className={`${navControlClassName} w-44 border-transparent pl-10 pr-4 font-bold placeholder:text-slate-400 focus:w-60 focus:border-orange-500/30 focus:bg-white focus:outline-none xl:w-48 xl:focus:w-64`}
                />
              </div>

              {connectedAddress ? (
                <div className="relative min-w-0 shrink-0" ref={setAccountMenuRef}>
                  <button onClick={onToggleAccountMenu} className={`${walletButtonClassName} group min-w-0 max-w-full`}>
                    {activeWalletIcon ? (
                      <img
                        src={activeWalletIcon}
                        alt={activeWalletName}
                        className="h-4 w-4 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-4 w-4 shrink-0 rounded-full bg-gradient-to-tr from-orange-400 to-red-400" />
                    )}
                    <span className="connected-address max-w-[8rem] truncate md:max-w-[9rem] lg:max-w-[10rem] xl:max-w-[12rem] 2xl:max-w-[14rem]">
                      {truncateAddress(connectedAddress)}
                    </span>
                  </button>

                  {isAccountMenuOpen && (
                    <div className="animate-in fade-in slide-in-from-top-2 absolute left-[2.625rem] right-0 z-50 mt-3 rounded-2xl border border-slate-100 bg-white p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] duration-200">
                      <button
                        disabled={isDisconnecting}
                        onClick={onDisconnect}
                        className="group flex w-full items-center gap-1.5 rounded-xl px-2 py-1.5 text-[11px] font-semibold text-slate-600 transition-all hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center text-slate-400 transition-colors group-hover:text-red-500">
                          <LogOut size={12} />
                        </span>
                        {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onConnect}
                  className={`${walletButtonClassName} shrink-0 border-orange-200 bg-white px-4 text-xs font-black uppercase text-orange-600 shadow-sm shadow-orange-100 hover:border-orange-300 hover:bg-orange-50 sm:px-5`}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          <div className="-mx-4 overflow-x-auto px-4 pb-1 lg:hidden">
            <div className="flex min-w-max items-center gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    isActiveNavigationItem(pathname, item.path)
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}



