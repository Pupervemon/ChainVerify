import FloatingNotice from "./FloatingNotice";

type WalletConnectionNoticeProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export default function WalletConnectionNotice(props: WalletConnectionNoticeProps) {
  const { message, onClose, duration } = props;

  return (
    <FloatingNotice
      message={message}
      onClose={onClose}
      duration={duration}
      tone="success"
      closeAriaLabel="Close wallet notification"
    />
  );
}

