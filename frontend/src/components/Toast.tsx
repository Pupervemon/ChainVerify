import React, { useEffect } from "react";
import { AlertCircle, Loader2, X, CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const msgLower = (message || "").toLowerCase();
  const isError = msgLower.includes("error") || msgLower.includes("failed");
  const isSuccess = msgLower.includes("success") || msgLower.includes("completed");
  const isProcessing = message !== "" && !isError && !isSuccess;

  useEffect(() => {
    if (!message || isProcessing) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, isProcessing, onClose]);

  if (!message) return null;

  let bgColor = "bg-white/90 border-slate-100 text-slate-700";
  if (isError) bgColor = "bg-red-50/90 border-red-100 text-red-700";
  if (isSuccess) bgColor = "bg-green-50/90 border-green-100 text-green-700";

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300 ease-out">
      <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-xl backdrop-blur-xl transition-all duration-500 ${bgColor}`}>
        <div className="flex items-center justify-center">
          {isError ? (
            <AlertCircle size={14} className="animate-pulse" />
          ) : isSuccess ? (
            <CheckCircle2 size={14} className="text-green-600 animate-in zoom-in duration-500" />
          ) : (
            <Loader2 size={14} className="animate-spin text-primary-600" />
          )}
        </div>

        <span className="text-xs font-bold whitespace-nowrap tracking-wide">{message}</span>

        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
