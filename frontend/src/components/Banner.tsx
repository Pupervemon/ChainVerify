import { useState, useEffect } from "react";
import { X, ExternalLink } from "lucide-react";

const BANNER_STORAGE_KEY = "hide-dencun-banner";

const Banner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // 检查本地存储
    const isHidden = localStorage.getItem(BANNER_STORAGE_KEY);
    if (!isHidden) {
      setIsVisible(true);
      setShouldRender(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(BANNER_STORAGE_KEY, "true");
    // 动画结束后移除 DOM
    setTimeout(() => setShouldRender(false), 300);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={`overflow-hidden border-b border-slate-200 bg-white text-slate-700 transition-all duration-300 ease-in-out ${
        isVisible ? "max-h-12 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 text-sm font-medium">
          <div className="flex-1 flex justify-center items-center gap-2">
            <span className="text-slate-500">
              The Dencun Upgrade is now live on Mainnet!
            </span>
            <a
              href="https://ethereum.org/en/roadmap/dencun/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-orange-500 underline decoration-orange-200 underline-offset-4 transition-colors hover:text-orange-600"
            >
              [Read the full announcement]
              <ExternalLink size={12} />
            </a>
          </div>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
