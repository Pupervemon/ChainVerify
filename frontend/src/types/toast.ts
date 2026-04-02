export type ToastVariant = "loading" | "success" | "error" | "info";

export type ToastState = {
  message: string;
  variant: ToastVariant;
};
