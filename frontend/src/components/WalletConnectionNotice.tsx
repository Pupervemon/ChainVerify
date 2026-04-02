import { useCallback, useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";

type WalletConnectionNoticeProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

const DEFAULT_DURATION = 3600;

export default function WalletConnectionNotice(props: WalletConnectionNoticeProps) {
  const { message, onClose, duration = DEFAULT_DURATION } = props;
  const [progress, setProgress] = useState(100);
  const [progressTransitionMs, setProgressTransitionMs] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const nestedFrameRef = useRef<number | null>(null);
  const remainingMsRef = useRef(duration);
  const lastStartedAtRef = useRef(0);

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
    [clearCloseTimer, clearFrames, duration, onClose],
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

    remainingMsRef.current = duration;
    startCountdown(duration);

    return () => {
      clearCloseTimer();
      clearFrames();
    };
  }, [clearCloseTimer, clearFrames, duration, message, startCountdown]);

  if (!message) {
    return null;
  }

  const pauseCountdown = () => {
    const elapsedMs = Date.now() - lastStartedAtRef.current;
    const remainingMs = Math.max(0, remainingMsRef.current - elapsedMs);

    remainingMsRef.current = remainingMs;
    clearCloseTimer();
    clearFrames();
    setProgressTransitionMs(0);
    setProgress((remainingMs / duration) * 100);
  };

  const resumeCountdown = () => {
    startCountdown(remainingMsRef.current);
  };

  return (
    <div className="fixed right-3 top-20 z-[70] w-[min(23.5rem,calc(100vw-1.5rem))] animate-in fade-in slide-in-from-right-8 slide-in-from-top-3 duration-300 ease-out sm:right-6 sm:top-24">
      <div
        className="relative overflow-hidden rounded-[1.45rem] border border-[rgba(0,245,147,0.78)] bg-[rgb(0,245,147)] shadow-[0_28px_80px_-36px_rgba(0,245,147,0.58)] ring-1 ring-white/10"
        role="status"
        aria-live="polite"
        onMouseEnter={pauseCountdown}
        onMouseLeave={resumeCountdown}
      >
        <div className="relative px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="mt-2 flex h-[0.875rem] w-[0.875rem] shrink-0 items-center justify-center rounded-full bg-[#042B1D] text-[rgb(0,245,147)]">
              <Check size={10} strokeWidth={3} />
            </div>

            <p className="min-w-0 flex-1 pt-2 text-sm font-semibold leading-5 text-[#042B1D]">
              {message}
            </p>

            <button
              onClick={onClose}
              className="mt-1 rounded-full p-1 text-[#042B1D]/70 transition-colors hover:bg-black/10 hover:text-[#042B1D]"
              aria-label="Close wallet notification"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="relative h-1 w-full bg-black/10">
          <div
            className="h-full rounded-r-full bg-[#042B1D]/85"
            style={{
              width: `${progress}%`,
              transitionProperty: "width",
              transitionTimingFunction: "linear",
              transitionDuration: `${progressTransitionMs}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

