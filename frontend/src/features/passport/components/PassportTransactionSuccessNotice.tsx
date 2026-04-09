import FloatingNotice from "../../../components/FloatingNotice";

type PassportTransactionSuccessNoticeProps = {
  duration?: number;
  message: string;
  onClose: () => void;
};

export default function PassportTransactionSuccessNotice(
  props: PassportTransactionSuccessNoticeProps,
) {
  const { duration, message, onClose } = props;

  return (
    <FloatingNotice
      message={message}
      onClose={onClose}
      duration={duration}
      tone="success"
      closeAriaLabel="Close transaction success notice"
      positionClassName="fixed right-3 top-20 z-[70] w-[min(23.5rem,calc(100vw-1.5rem))] animate-passport-notice-drop sm:right-6 sm:top-24"
    />
  );
}