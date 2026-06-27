import { demoProperties } from './data';
import { apiUrl, appConfig } from './marketing';
import type { OperationType, Property } from './types';

type PublicPropertyResponse = {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  operationTypeCode?: string;
  propertyTypeCode?: string;
  statusCode?: string;
  currencyCode?: string;
  currency?: string;
  currencySymbol?: string;
  currencyName?: string;
  price?: number | string;
  expenses?: number | string;
  cityName?: string;
  zoneName?: string;
  neighborhood?: string;
  address?: string;
  rooms?: number | string;
  bedrooms?: number;
  bathrooms?: number | string;
  garages?: number;
  coveredArea?: number | string;
  totalArea?: number | string;
  amenities?: string[];
  images?: Array<{ url?: string; cardUrl?: string; thumbUrl?: string }>;
  caseId?: string;
  featured?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

const imageFallbacks = demoProperties.map((item) => item.imageUrl);

function number(value: unknown, fallback = 0): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function operation(value?: string): OperationType {
  const normalized = text(value).toUpperCase();
  if (normalized.includes('ALQUILER_TEMP') || normalized.includes('TEMP')) return 'TEMPORARY_RENT';
  if (normalized.includes('RENT') || normalized.includes('ALQUILER')) return 'RENT';
  return 'SALE';
}

function currencyCode(raw: PublicPropertyResponse, op: OperationType): string {
  const candidate = text(raw.currencyCode || raw.currency || raw.currencyName || raw.currencySymbol).toUpperCase();
  const compact = candidate
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');

  if (compact.includes('USD') || compact.includes('US$') || compact.includes('DOLAR')) return 'USD';
  if (compact.includes('ARS') || compact === '$' || compact.includes('PESO')) return 'ARS';
  if (compact.includes('UYU')) return 'UYU';
  if (compact.includes('BRL') || compact.includes('REAL')) return 'BRL';
  if (/^[A-Z]{3}$/.test(compact)) return compact;
  return op === 'SALE' ? 'USD' : 'ARS';
}

function daysSince(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return fallback;
  const days = Math.floor((Date.now() - parsed.getTime()) / 86_400_000);
  return Math.max(days, 0);
}

function mapProperty(raw: PublicPropertyResponse, index: number): Property {
  const op = operation(raw.operationTypeCode);
  const image = raw.images?.[0]?.cardUrl || raw.images?.[0]?.url || raw.images?.[0]?.thumbUrl || imageFallbacks[index % imageFallbacks.length];
  const publishedDate = raw.publishedAt || raw.updatedAt || raw.createdAt;
  return {
    id: text(raw.id, `api-${index}`),
    slug: text(raw.slug, text(raw.id, `propiedad-${index}`)),
    title: text(raw.title, 'Propiedad publicada'),
    operationType: op,
    propertyType: text(raw.propertyTypeCode, 'Propiedad'),
    status: text(raw.statusCode, 'Publicado'),
    price: number(raw.price),
    currency: currencyCode(raw, op),
    expenses: number(raw.expenses),
    city: text(raw.cityName, 'Buenos Aires'),
    zone: text(raw.zoneName, 'Zona destacada'),
    neighborhood: text(raw.neighborhood, text(raw.zoneName, '')),
    address: text(raw.address, 'Direccion reservada'),
    rooms: number(raw.rooms),
    bedrooms: raw.bedrooms || 0,
    bathrooms: number(raw.bathrooms),
    garages: raw.garages || 0,
    coveredArea: number(raw.coveredArea),
    totalArea: number(raw.totalArea),
    amenities: raw.amenities?.length ? raw.amenities : ['Ficha publica', 'Lead tracking', 'Documentos'],
    description: text(raw.description, 'Ficha inmobiliaria publicada desde InmoPub.'),
    imageUrl: image,
    featured: raw.featured,
    caseStage: raw.caseId ? 'Expediente asociado' : 'Listo para abrir caso',
    documentStage: 'Documentacion comercial disponible',
    leadScore: 70 + (index * 7) % 25,
    daysPublished: daysSince(publishedDate, 3 + index * 4),
  };
}

export async function fetchProperties(filters: {
  search?: string;
  operationType?: string;
  propertyType?: string;
  city?: string;
  zone?: string;
  minPrice?: number;
  maxPrice?: number;
} = {}): Promise<Property[]> {
  const url = new URL(apiUrl('/v1/public/properties'));
  url.searchParams.set('tenantId', appConfig.tenantId);
  url.searchParams.set('page', '0');
  url.searchParams.set('pageSize', '24');
  url.searchParams.set('unassignedOnly', 'true');
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}`.trim()) {
      url.searchParams.set(key, `${value}`);
    }
  });

  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Properties public search failed ${response.status}`);
    const json = await response.json();
    const content = Array.isArray(json) ? json : Array.isArray(json?.content) ? json.content : [];
    const mapped = content.map(mapProperty);
    return mapped.length ? mapped : demoProperties;
  } catch {
    return demoProperties;
  }
}

export async function submitPropertyLead(propertyId: string, input: {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  preferredContact?: string;
}) {
  const response = await fetch(apiUrl(`/v1/public/properties/${encodeURIComponent(propertyId)}/leads?tenantId=${encodeURIComponent(appConfig.tenantId)}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      message: input.message,
      preferredContact: input.preferredContact || 'WHATSAPP',
    }),
  });
  if (!response.ok) throw new Error(`Property lead failed ${response.status}`);
}
