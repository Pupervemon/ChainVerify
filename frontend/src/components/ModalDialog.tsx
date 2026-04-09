import { type ReactNode, useEffect, useId } from 'react';
import { Bell, Info, TriangleAlert, X } from 'lucide-react';
import { createPortal } from 'react-dom';

export type ModalDialogTone = 'warning' | 'info' | 'neutral';

type ModalDialogProps = {
  children: ReactNode;
  closeAriaLabel?: string;
  description?: string;
  footer?: ReactNode;
  onClose: () => void;
  open: boolean;
  title: string;
  tone?: ModalDialogTone;
};

const toneStyles: Record<
  ModalDialogTone,
  {
    headerBadgeClassName: string;
    headerBorderClassName: string;
    headerDescriptionClassName: string;
    headerIconClassName: string;
    headerTitleClassName: string;
  }
> = {
  warning: {
    headerBadgeClassName: 'bg-amber-100 text-amber-900 ring-1 ring-amber-200',
    headerBorderClassName: 'border-amber-100',
    headerDescriptionClassName: 'text-amber-900/80',
    headerIconClassName: 'text-amber-900',
    headerTitleClassName: 'text-amber-950',
  },
  info: {
    headerBadgeClassName: 'bg-sky-100 text-sky-900 ring-1 ring-sky-200',
    headerBorderClassName: 'border-sky-100',
    headerDescriptionClassName: 'text-sky-900/80',
    headerIconClassName: 'text-sky-900',
    headerTitleClassName: 'text-sky-950',
  },
  neutral: {
    headerBadgeClassName: 'bg-slate-100 text-slate-900 ring-1 ring-slate-200',
    headerBorderClassName: 'border-slate-100',
    headerDescriptionClassName: 'text-slate-700',
    headerIconClassName: 'text-slate-900',
    headerTitleClassName: 'text-slate-950',
  },
};

function renderToneIcon(tone: ModalDialogTone, className: string) {
  if (tone === 'warning') {
    return <TriangleAlert size={18} className={className} />;
  }

  if (tone === 'info') {
    return <Info size={18} className={className} />;
  }

  return <Bell size={18} className={className} />;
}

export default function ModalDialog(props: ModalDialogProps) {
  const {
    children,
    closeAriaLabel = 'Close dialog',
    description,
    footer,
    onClose,
    open,
    title,
    tone = 'neutral',
  } = props;
  const titleId = useId();
  const descriptionId = useId();
  const styles = toneStyles[tone];

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className='fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6'>
      <button
        type='button'
        aria-label={closeAriaLabel}
        className='absolute inset-0 bg-slate-950/45 backdrop-blur-sm'
        onClick={onClose}
      />

      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className='relative z-10 w-full max-w-xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_36px_120px_-48px_rgba(15,23,42,0.5)] animate-in fade-in zoom-in-95 duration-200'
      >
        <div className={`flex items-start gap-4 border-b px-6 py-5 sm:px-7 ${styles.headerBorderClassName}`}>
          <div
            className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.headerBadgeClassName}`}
          >
            {renderToneIcon(tone, styles.headerIconClassName)}
          </div>

          <div className='min-w-0 flex-1'>
            <h2 id={titleId} className={`text-xl font-black tracking-tight ${styles.headerTitleClassName}`}>
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className={`mt-2 text-sm font-medium leading-6 ${styles.headerDescriptionClassName}`}>
                {description}
              </p>
            ) : null}
          </div>

          <button
            type='button'
            onClick={onClose}
            className='rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900'
            aria-label={closeAriaLabel}
          >
            <X size={16} />
          </button>
        </div>

        <div className='px-6 py-5 sm:px-7'>{children}</div>

        {footer ? <div className='border-t border-slate-100 px-6 py-5 sm:px-7'>{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}
