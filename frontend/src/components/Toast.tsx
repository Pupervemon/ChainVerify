import React, { useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, Loader2, X } from "lucide-react";

import type { ToastVariant } from "../types/toast";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose: () => void;
  autoCloseMs?: number;
  topClassName?: string;
}

const Toast: React.FC<ToastProps> = ({
  message,
  variant = "info",
  onClose,
  autoCloseMs = 3000,
  topClassName = "top-24",
}) => {

  useEffect(() => {
    if (!message || variant === "loading" || autoCloseMs <= 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseMs);

    return () => clearTimeout(timer);
  }, [autoCloseMs, message, onClose, variant]);

  if (!message) return null;

  let bgColor = "bg-sky-50/95 border-sky-100 text-sky-700";
  let icon = <Info size={14} className="text-sky-600" />;

  if (variant === "error") {
    bgColor = "bg-red-50/95 border-red-100 text-red-700";
    icon = <AlertCircle size={14} className="text-red-600 animate-pulse" />;
  }

  if (variant === "success") {
    bgColor = "bg-green-50/95 border-green-100 text-green-700";
    icon = <CheckCircle2 size={14} className="text-green-600 animate-in zoom-in duration-500" />;
  }

  if (variant === "loading") {
    bgColor = "bg-white/95 border-slate-100 text-slate-700";
    icon = <Loader2 size={14} className="animate-spin text-primary-600" />;
  }

  return (
    <div
      className={`fixed left-1/2 z-[60] -translate-x-1/2 animate-in fade-in slide-in-from-top-4 duration-300 ease-out ${topClassName}`}
    >
      <div
        className={`flex max-w-[min(90vw,36rem)] items-start gap-3 rounded-2xl border px-5 py-3 shadow-xl backdrop-blur-xl transition-all duration-500 ${bgColor}`}
        role={variant === "error" ? "alert" : "status"}
        aria-live={variant === "error" ? "assertive" : "polite"}
      >
        <div className="flex items-center justify-center pt-0.5">{icon}</div>

        <span className="min-w-0 text-sm font-semibold leading-5 break-words">{message}</span>

        <button
          onClick={onClose}
          className="ml-1 rounded-full p-1 transition-colors hover:bg-black/5"
          aria-label="Close"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
