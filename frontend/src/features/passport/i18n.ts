import { useCallback, useMemo, useSyncExternalStore } from "react";

export type PassportLocale = "zh" | "en";

const PASSPORT_LOCALE_KEY = "passport.locale";
const PASSPORT_LOCALE_EVENT = "passport-locale-change";
const DEFAULT_LOCALE: PassportLocale = "en";

const isPassportLocale = (value: string | null): value is PassportLocale =>
  value === "zh" || value === "en";

const getSnapshot = (): PassportLocale => {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const storedLocale = window.localStorage.getItem(PASSPORT_LOCALE_KEY);
  return isPassportLocale(storedLocale) ? storedLocale : DEFAULT_LOCALE;
};

const subscribe = (listener: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === PASSPORT_LOCALE_KEY) {
      listener();
    }
  };

  const handleCustomEvent = () => listener();

  window.addEventListener("storage", handleStorage);
  window.addEventListener(PASSPORT_LOCALE_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(PASSPORT_LOCALE_EVENT, handleCustomEvent);
  };
};

export const setPassportLocale = (locale: PassportLocale) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PASSPORT_LOCALE_KEY, locale);
  window.dispatchEvent(new Event(PASSPORT_LOCALE_EVENT));
};

export const usePassportLocale = () => {
  const locale = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_LOCALE);
  const t = useCallback((zh: string, en: string) => (locale === "zh" ? zh : en), [locale]);

  return useMemo(
    () => ({
      isEnglish: locale === "en",
      isChinese: locale === "zh",
      locale,
      setLocale: setPassportLocale,
      t,
    }),
    [locale, t],
  );
};
