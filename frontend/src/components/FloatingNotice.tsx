import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { Bell, Check, Info, TriangleAlert, X } from "lucide-react";

export type FloatingNoticeTone = "success" | "info" | "warning" | "neutral";

export interface FloatingNoticeProps {
  message: string;
  onClose: () => void;
  duration?: number;
  tone?: FloatingNoticeTone;
  icon?: ReactNode;
  role?: "status" | "alert";
  ariaLive?: "polite" | "assertive";
  closeAriaLabel?: string;
  positionClassName?: string;
}

const DEFAULT_DURATION = 3600;

const toneStyles: Record<
  FloatingNoticeTone,
  {
    panelClassName: string;
    iconBadgeClassName: string;
    iconClassName: string;
    messageClassName: string;
    closeButtonClassName: string;
    progressTrackClassName: string;
    progressBarClassName: string;
  }
> = {
  success: {
    panelClassName:
      "border border-[rgba(0,245,147,0.78)] bg-[rgb(0,245,147)] shadow-[0_28px_80px_-36px_rgba(0,245,147,0.58)] ring-1 ring-white/10",
    iconBadgeClassName: "bg-[#042B1D] text-[rgb(0,245,147)]",
    iconClassName: "text-[rgb(0,245,147)]",
    messageClassName: "text-[#042B1D]",
    closeButtonClassName: "text-[#042B1D]/70 hover:bg-black/10 hover:text-[#042B1D]",
    progressTrackClassName: "bg-black/10",
    progressBarClassName: "bg-[#042B1D]/85",
  },
  info: {
    panelClassName:
      "border border-sky-200/80 bg-sky-100 shadow-[0_24px_70px_-36px_rgba(14,165,233,0.45)] ring-1 ring-white/20",
    iconBadgeClassName: "bg-sky-700 text-sky-100",
    iconClassName: "text-sky-100",
    messageClassName: "text-sky-950",
    closeButtonClassName: "text-sky-900/70 hover:bg-sky-900/10 hover:text-sky-950",
    progressTrackClassName: "bg-sky-900/10",
    progressBarClassName: "bg-sky-800/80",
  },
  warning: {
    panelClassName:
      "border border-amber-200/80 bg-amber-100 shadow-[0_24px_70px_-36px_rgba(245,158,11,0.45)] ring-1 ring-white/20",
    iconBadgeClassName: "bg-amber-900 text-amber-100",
    iconClassName: "text-amber-100",
    messageClassName: "text-amber-950",
    closeButtonClassName: "text-amber-900/70 hover:bg-amber-900/10 hover:text-amber-950",
    progressTrackClassName: "bg-amber-900/10",
    progressBarClassName: "bg-amber-900/80",
  },
  neutral: {
    panelClassName:
      "border border-slate-200/80 bg-white shadow-[0_24px_70px_-36px_rgba(15,23,42,0.28)] ring-1 ring-slate-100/80",
    iconBadgeClassName: "bg-slate-900 text-white",
    iconClassName: "text-white",
    messageClassName: "text-slate-900",
    closeButtonClassName: "text-slate-700 hover:bg-slate-900/5 hover:text-slate-950",
    progressTrackClassName: "bg-slate-900/8",
    progressBarClassName: "bg-slate-900/75",
  },
};

function getDefaultIcon(tone: FloatingNoticeTone, iconClassName: string) {
  if (tone === "success") {
    return <Check size={10} strokeWidth={3} className={iconClassName} />;
  }

  if (tone === "info") {
    return <Info size={10} strokeWidth={2.4} className={iconClassName} />;
  }

  if (tone === "warning") {
    return <TriangleAlert size={10} strokeWidth={2.4} className={iconClassName} />;
  }

  return <Bell size={10} strokeWidth={2.4} className={iconClassName} />;
}

export default function FloatingNotice(props: FloatingNoticeProps) {
  const {
    message,
    onClose,
    duration = DEFAULT_DURATION,
    tone = "neutral",
    icon,
    role = "status",
    ariaLive = "polite",
    closeAriaLabel = "Close notification",
    positionClassName = "fixed right-3 top-20 z-[70] w-[min(23.5rem,calc(100vw-1.5rem))] animate-in fade-in slide-in-from-right-8 slide-in-from-top-3 duration-300 ease-out sm:right-6 sm:top-24",
  } = props;
  const [progress, setProgress] = useState(100);
  const [progressTransitionMs, setProgressTransitionMs] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const nestedFrameRef = useRef<number | null>(null);
  const remainingMsRef = useRef(duration);
  const lastStartedAtRef = useRef(0);
  const autoDismissEnabled = duration > 0;
  const styles = toneStyles[tone];

  const clearFrames = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (nestedFrameRef.current !== null) {
      window.cancelAnimationFrame(nestedFrameRef.current);
      nestedFrameRef.current = null;
    }
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startCountdown = useCallback(
    (remainingMs: number) => {
      if (!autoDismissEnabled) {
        return;
      }

      clearCloseTimer();
      clearFrames();

      if (remainingMs <= 0) {
        onClose();
        return;
      }

      remainingMsRef.current = remainingMs;
      lastStartedAtRef.current = Date.now();
      setProgressTransitionMs(0);
      setProgress((remainingMs / duration) * 100);

      timeoutRef.current = window.setTimeout(() => {
        onClose();
      }, remainingMs);

      frameRef.current = window.requestAnimationFrame(() => {
        nestedFrameRef.current = window.requestAnimationFrame(() => {
          setProgressTransitionMs(remainingMs);
          setProgress(0);
        });
      });
    },
    [autoDismissEnabled, clearCloseTimer, clearFrames, duration, onClose],
  );

  useEffect(() => {
    if (!message) {
      clearCloseTimer();
      clearFrames();
      remainingMsRef.current = duration;
      setProgressTransitionMs(0);
      setProgress(100);
      return;
    }

    if (!autoDismissEnabled) {
      clearCloseTimer();
      clearFrames();
      remainingMsRef.current = duration;
      setProgressTransitionMs(0);
      setProgress(100);
      return;
    }

    remainingMsRef.current = duration;
    startCountdown(duration);

    return () => {
      clearCloseTimer();
      clearFrames();
    };
  }, [
    autoDismissEnabled,
    clearCloseTimer,
    clearFrames,
    duration,
    message,
    startCountdown,
  ]);

  if (!message) {
    return null;
  }

  const pauseCountdown = () => {
    if (!autoDismissEnabled) {
      return;
    }

    const elapsedMs = Date.now() - lastStartedAtRef.current;
    const remainingMs = Math.max(0, remainingMsRef.current - elapsedMs);

    remainingMsRef.current = remainingMs;
    clearCloseTimer();
    clearFrames();
    setProgressTransitionMs(0);
    setProgress((remainingMs / duration) * 100);
  };

  const resumeCountdown = () => {
    if (!autoDismissEnabled) {
      return;
    }

    startCountdown(remainingMsRef.current);
  };

  return (
    <div className={positionClassName}>
      <div
        className={`relative overflow-hidden rounded-[1.45rem] ${styles.panelClassName}`}
        role={role}
        aria-live={ariaLive}
        onMouseEnter={pauseCountdown}
        onMouseLeave={resumeCountdown}
      >
        <div className="relative px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex min-w-0 flex-1 items-center gap-3">
              <div
                className={`flex h-[0.875rem] w-[0.875rem] shrink-0 items-center justify-center rounded-full ${styles.iconBadgeClassName}`}
              >
                {icon ?? getDefaultIcon(tone, styles.iconClassName)}
              </div>

              <p
                className={`flex min-h-[1.375rem] min-w-0 flex-1 items-center text-sm font-semibold leading-5 ${styles.messageClassName}`}
              >
                {message}
              </p>
            </div>

            <button
              onClick={onClose}
              className={`mt-1 shrink-0 rounded-full p-1 transition-colors ${styles.closeButtonClassName}`}
              aria-label={closeAriaLabel}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {autoDismissEnabled ? (
          <div className={`relative h-1 w-full ${styles.progressTrackClassName}`}>
            <div
              className={`h-full rounded-r-full ${styles.progressBarClassName}`}
              style={{
                width: `${progress}%`,
                transitionProperty: "width",
                transitionTimingFunction: "linear",
                transitionDuration: `${progressTransitionMs}ms`,
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
