import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { msg, type Locale } from './messages';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: ReturnType<typeof msg>;
};

const storageKey = 'inmopub.locale.v1';
const LocaleContext = createContext<LocaleContextValue | null>(null);

function initialLocale(): Locale {
  if (typeof window === 'undefined') return 'es';
  const pathLocale = window.location.pathname.split('/').filter(Boolean)[0];
  if (pathLocale === 'es' || pathLocale === 'en' || pathLocale === 'pt') return pathLocale;
  const stored = window.localStorage.getItem(storageKey);
  if (stored === 'es' || stored === 'en' || stored === 'pt') return stored;
  const nav = window.navigator.language.toLowerCase();
  if (nav.startsWith('pt')) return 'pt';
  if (nav.startsWith('en')) return 'en';
  return 'es';
}

function pathForLocale(next: Locale) {
  const parts = window.location.pathname.split('/').filter(Boolean);
  const currentHasLocale = parts[0] === 'es' || parts[0] === 'en' || parts[0] === 'pt';
  const rest = currentHasLocale ? parts.slice(1) : parts;
  const prefix = next === 'es' ? [] : [next];
  const pathname = `/${[...prefix, ...rest].join('/')}`.replace(/\/$/, '') || '/';
  return `${pathname}${window.location.hash || ''}`;
}

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [localeState, setLocaleState] = useState<Locale>(initialLocale);
  useEffect(() => {
    document.documentElement.lang = localeState;
  }, [localeState]);
  const value = useMemo<LocaleContextValue>(() => ({
    locale: localeState,
    setLocale: (next) => {
      setLocaleState(next);
      window.localStorage.setItem(storageKey, next);
      document.documentElement.lang = next;
      window.history.pushState(null, '', pathForLocale(next));
    },
    t: msg(localeState),
  }), [localeState]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale must be used inside LocaleProvider');
  return value;
}
