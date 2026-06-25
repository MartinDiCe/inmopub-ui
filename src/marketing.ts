import type { LeadInput, MarketingEventType } from './types';

const env = import.meta.env;

export const appConfig = {
  apiBaseUrl: clean(env.VITE_API_BASE_URL) || 'https://api.diceprojects.com/api',
  tenantId: clean(env.VITE_PROPERTIES_TENANT_ID) || 'efe8818b-6e5b-4687-b231-40f24fa76d79',
  marketingCampaignKey: clean(env.VITE_MARKETING_CAMPAIGN_KEY) || 'inmopub-web',
  publicBotKey: clean(env.VITE_PUBLIC_BOT_KEY) || 'inmopub-web',
  whatsappUrl: clean(env.VITE_PUBLIC_WHATSAPP_URL) || 'https://wa.me/541172466605',
};

const visitorKey = 'inmopub.visitorId.v1';
const scrollDepthKey = 'inmopub.scrollDepth.v1';
const consentKey = 'inmopub.cookieConsent.v1';

export type CookieConsent = 'accepted' | 'rejected' | null;

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim().replace(/\/+$/, '') : '';
}

export function apiUrl(path: string): string {
  return `${appConfig.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function visitorId(): string {
  const current = window.localStorage.getItem(visitorKey);
  if (current) return current;
  const next = window.crypto?.randomUUID?.() || `visitor_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(visitorKey, next);
  return next;
}

export function getCookieConsent(): CookieConsent {
  const value = window.localStorage.getItem(consentKey);
  return value === 'accepted' || value === 'rejected' ? value : null;
}

export function setCookieConsent(value: Exclude<CookieConsent, null>) {
  window.localStorage.setItem(consentKey, value);
}

export function hasMarketingConsent(): boolean {
  return getCookieConsent() === 'accepted';
}

function utm() {
  const params = new URLSearchParams(window.location.search);
  return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].reduce<Record<string, string>>((acc, key) => {
    const value = params.get(key);
    if (value) acc[key] = value;
    return acc;
  }, {});
}

function metadata(extra?: Record<string, unknown>) {
  return JSON.stringify({
    site: 'inmopub.com',
    tenantId: appConfig.tenantId,
    visitorId: visitorId(),
    title: document.title,
    path: window.location.pathname,
    search: window.location.search,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    ...utm(),
    ...(extra || {}),
  });
}

export function track(eventType: MarketingEventType, input: {
  actionCode: string;
  actionLabel: string;
  category?: string;
  propertyId?: string;
  sellerId?: string;
  metadata?: Record<string, unknown>;
}) {
  if (!appConfig.marketingCampaignKey) return;
  if (!hasMarketingConsent()) return;
  void fetch(apiUrl(`/v1/campaigns/capture/${encodeURIComponent(appConfig.marketingCampaignKey)}/events`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      eventType,
      visitorId: visitorId(),
      actionCode: input.actionCode,
      actionLabel: input.actionLabel,
      category: input.category || 'INMOPUB',
      channel: 'WEB',
      productId: input.propertyId,
      sellerId: input.sellerId,
      pageUrl: window.location.href,
      referrerUrl: document.referrer || undefined,
      metadata: metadata(input.metadata),
    }),
  }).catch(() => undefined);
}

export function bindGlobalClickTracking() {
  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-track]') : null;
    if (!target) return;
    track('CLICK', {
      actionCode: target.dataset.track || 'click',
      actionLabel: target.dataset.trackLabel || target.textContent?.trim() || target.getAttribute('aria-label') || 'Click',
      category: target.dataset.trackCategory || 'CTA',
      metadata: { href: target instanceof HTMLAnchorElement ? target.href : target.getAttribute('href') },
    });
  };
  document.addEventListener('click', onClick, { capture: true });
  return () => document.removeEventListener('click', onClick, { capture: true });
}

export function bindScrollDepthTracking() {
  const checkpoints = [25, 50, 75, 90];
  const sent = new Set((window.sessionStorage.getItem(scrollDepthKey) || '').split(',').filter(Boolean).map(Number));
  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (max <= 0) return;
    const depth = Math.round((window.scrollY / max) * 100);
    checkpoints.forEach((checkpoint) => {
      if (depth >= checkpoint && !sent.has(checkpoint)) {
        sent.add(checkpoint);
        window.sessionStorage.setItem(scrollDepthKey, Array.from(sent).join(','));
        track('SCROLL_DEPTH', {
          actionCode: `scroll_${checkpoint}`,
          actionLabel: `${checkpoint}% scroll`,
          category: 'ENGAGEMENT',
          metadata: { depth: checkpoint },
        });
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
}

export async function submitLead(input: LeadInput) {
  const response = await fetch(apiUrl(`/v1/campaigns/capture/${encodeURIComponent(appConfig.marketingCampaignKey)}/form`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'WEB',
      fullName: input.fullName,
      email: input.email,
      phone: input.phone || undefined,
      message: input.message,
      actionCode: input.actionCode,
      consent: true,
      productId: input.propertyId,
      metadata: metadata({
        propertyId: input.propertyId,
        form: input.actionCode,
      }),
    }),
  });
  if (!response.ok) throw new Error(`Lead capture failed ${response.status}`);
}
