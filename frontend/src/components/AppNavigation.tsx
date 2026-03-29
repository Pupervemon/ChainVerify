import { Languages, LogOut, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { usePassportLocale } from "../features/passport/i18n";

type AppNavigationProps = {
  activeWalletIcon?: string;
  activeWalletName: string;
  connectedAddress: string;
  isAccountMenuOpen: boolean;
  isConnected: boolean;
  navSearchQuery: string;
  onConnect: () => void;
  onDisconnect: () => void | Promise<void>;
  onNavSearchQueryChange: (value: string) => void;
  onToggleAccountMenu: () => void;
  pathname: string;
  setAccountMenuRef: (element: HTMLDivElement | null) => void;
  truncateAddress: (value: string) => string;
};

const navigationItems = [
  { label: "Notary", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Passport", path: "/passport" },
  { label: "ZKP", path: "/zkp" },
  { label: "DOC", path: "/doc" },
];

const isActiveNavigationItem = (currentPathname: string, itemPath: string) => {
  if (itemPath === "/") {
    return currentPathname === "/";
  }

  return currentPathname === itemPath || currentPathname.startsWith(`${itemPath}/`);
};

export default function AppNavigation(props: AppNavigationProps) {
  const { locale, setLocale } = usePassportLocale();
  const {
    activeWalletIcon,
    activeWalletName,
    connectedAddress,
    isAccountMenuOpen,
    isConnected,
    navSearchQuery,
    onConnect,
    onDisconnect,
    onNavSearchQueryChange,
    onToggleAccountMenu,
    pathname,
    setAccountMenuRef,
    truncateAddress,
  } = props;
  const isPassportRoute = pathname.startsWith("/passport");

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white font-nav selection:bg-orange-100">
      <div className="mx-auto flex h-[65px] max-w-[1408px] items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-black tracking-tighter text-slate-900"
          >
            DeProof
          </Link>
          <div className="hidden items-center gap-[40px] md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-2 text-[16px] font-[700] transition-all ${
                  isActiveNavigationItem(pathname, item.path)
                    ? "text-slate-900 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-orange-500"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex w-[88px] justify-start">
            {isPassportRoute ? (
              <button
                onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-[11px] font-black uppercase tracking-[0.18em] text-slate-600 transition-all hover:border-sky-200 hover:text-sky-600"
              >
                <Languages size={14} />
                {locale === "zh" ? "EN" : "中文"}
              </button>
            ) : null}
          </div>

          <div className="group relative hidden lg:block">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500"
            />
            <input
              type="text"
              placeholder="Search hash..."
              value={navSearchQuery}
              onChange={(event) => onNavSearchQueryChange(event.target.value)}
              className="w-48 rounded-full border border-transparent bg-slate-100/50 py-2 pl-10 pr-4 text-sm font-bold placeholder:text-slate-400 transition-all duration-300 focus:w-64 focus:border-orange-500/30 focus:bg-white focus:outline-none"
            />
          </div>

          {connectedAddress ? (
            <div className="relative" ref={setAccountMenuRef}>
              <button
                onClick={onToggleAccountMenu}
                className="group flex h-10 items-center gap-2.5 rounded-full border border-slate-200 bg-slate-100 px-4 transition-all hover:bg-slate-200 active:scale-[0.98]"
              >
                {activeWalletIcon ? (
                  <img
                    src={activeWalletIcon}
                    alt={activeWalletName}
                    className="h-4 w-4 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-4 w-4 shrink-0 rounded-full bg-gradient-to-tr from-orange-400 to-red-400" />
                )}
                <span className="connected-address">{truncateAddress(connectedAddress)}</span>
              </button>

              {isAccountMenuOpen && (
                <div className="animate-in fade-in slide-in-from-top-2 absolute right-0 z-50 mt-3 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] duration-200">
                  <button
                    onClick={onDisconnect}
                    className="group flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-medium text-slate-600 transition-all hover:bg-red-50 hover:text-red-600"
                  >
                    <span className="inline-flex h-5 w-5 items-center justify-center text-slate-400 transition-colors group-hover:text-red-500">
                      <LogOut size={13} />
                    </span>
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="h-10 rounded-full border border-orange-200 bg-white px-6 text-sm font-black uppercase text-orange-600 shadow-sm shadow-orange-100 transition-all hover:border-orange-300 hover:bg-orange-50 active:scale-[0.98]"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
