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

export type PropertyPage = {
  items: Property[];
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasMore: boolean;
};

const imageFallbacks = demoProperties.map((item) => item.imageUrl);
const defaultPageSize = 6;

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

function dailyRank(value: string): number {
  const seed = Math.floor(Date.now() / 86_400_000);
  let hash = seed;
  for (let index = 0; index < value.length; index += 1) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 2654435761);
  }
  return hash >>> 0;
}

function demoOrder(items: Property[]): Property[] {
  return [...items].sort((a, b) => {
    const featuredDelta = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featuredDelta !== 0) return featuredDelta;
    return dailyRank(a.id) - dailyRank(b.id);
  });
}

function filterDemoProperties(filters: FetchPropertyFilters): Property[] {
  const search = filters.search?.trim().toLowerCase() || '';
  return demoProperties.filter((property) => {
    const matchesSearch = !search || `${property.title} ${property.city} ${property.zone} ${property.neighborhood}`.toLowerCase().includes(search);
    const matchesOperation = !filters.operationType || property.operationType === filters.operationType;
    const matchesType = !filters.propertyType || property.propertyType.toLowerCase().includes(String(filters.propertyType).toLowerCase());
    const matchesFeatured = !filters.featuredOnly || Boolean(property.featured);
    return matchesSearch && matchesOperation && matchesType && matchesFeatured;
  });
}

function pageFromItems(items: Property[], page: number, pageSize: number): PropertyPage {
  const ordered = demoOrder(items);
  const start = page * pageSize;
  return {
    items: ordered.slice(start, start + pageSize),
    page,
    pageSize,
    totalElements: ordered.length,
    totalPages: Math.max(1, Math.ceil(ordered.length / pageSize)),
    hasMore: start + pageSize < ordered.length,
  };
}

function localDemoPage(filters: FetchPropertyFilters, page: number, pageSize: number): PropertyPage {
  return pageFromItems(filterDemoProperties(filters), page, pageSize);
}

function mergedDemoPage(apiItems: Property[], filters: FetchPropertyFilters, page: number, pageSize: number): PropertyPage {
  const seen = new Set(apiItems.map((item) => item.id));
  const demoItems = filterDemoProperties(filters).filter((item) => !seen.has(item.id));
  return pageFromItems([...apiItems, ...demoItems], page, pageSize);
}

type FetchPropertyFilters = {
  search?: string;
  operationType?: string;
  propertyType?: string;
  city?: string;
  zone?: string;
  minPrice?: number;
  maxPrice?: number;
  featuredOnly?: boolean;
};

export async function fetchProperties(filters: FetchPropertyFilters = {}, page = 0, pageSize = defaultPageSize): Promise<PropertyPage> {
  const url = new URL(apiUrl('/v1/public/properties'));
  url.searchParams.set('tenantId', appConfig.tenantId);
  url.searchParams.set('page', `${page}`);
  url.searchParams.set('pageSize', `${pageSize}`);
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
    const mapped = demoOrder(content.map(mapProperty));
    if (!mapped.length) {
      if (page > 0) {
        const firstPageUrl = new URL(url);
        firstPageUrl.searchParams.set('page', '0');
        const firstPageResponse = await fetch(firstPageUrl, { headers: { Accept: 'application/json' } });
        if (firstPageResponse.ok) {
          const firstPageJson = await firstPageResponse.json();
          const firstPageContent = Array.isArray(firstPageJson) ? firstPageJson : Array.isArray(firstPageJson?.content) ? firstPageJson.content : [];
          const firstPageMapped = demoOrder(firstPageContent.map(mapProperty));
          if (firstPageMapped.length) return mergedDemoPage(firstPageMapped, filters, page, pageSize);
        }
      }
      return localDemoPage(filters, page, pageSize);
    }
    const totalElements = Number(json?.totalElements ?? mapped.length);
    const totalPages = Number(json?.totalPages ?? (Math.ceil(totalElements / pageSize) || 1));
    if (totalPages <= 1 || totalElements <= pageSize) return mergedDemoPage(mapped, filters, page, pageSize);
    return {
      items: mapped,
      page: Number(json?.page ?? page),
      pageSize: Number(json?.pageSize ?? pageSize),
      totalElements,
      totalPages,
      hasMore: page + 1 < totalPages,
    };
  } catch {
    return localDemoPage(filters, page, pageSize);
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
