export type OperationType = 'SALE' | 'RENT' | 'TEMPORARY_RENT';

export type Property = {
  id: string;
  slug: string;
  title: string;
  operationType: OperationType;
  propertyType: string;
  status: string;
  price: number;
  currency: string;
  expenses?: number;
  city: string;
  zone: string;
  neighborhood: string;
  address: string;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  coveredArea: number;
  totalArea: number;
  amenities: string[];
  description: string;
  imageUrl: string;
  featured?: boolean;
  caseStage: string;
  documentStage: string;
  leadScore: number;
  daysPublished: number;
};

export type LeadInput = {
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  propertyId?: string;
  actionCode: string;
};

export type MarketingEventType =
  | 'VIEW'
  | 'CLICK'
  | 'SEARCH'
  | 'FILTER'
  | 'PROPERTY_VIEW'
  | 'LEAD'
  | 'ROI_CALC'
  | 'BOT_OPEN'
  | 'BOT_QUESTION'
  | 'DEMO_STEP'
  | 'SCROLL_DEPTH';

export type RoiInputs = {
  properties: number;
  monthlyLeads: number;
  conversionRate: number;
  averageCommission: number;
  adminHoursPerWeek: number;
  hourlyCost: number;
};

export type RoiResult = {
  recoveredLeads: number;
  extraDeals: number;
  extraRevenue: number;
  adminSavings: number;
  totalMonthlyImpact: number;
};

export type CopilotMessage = {
  id: string;
  sender: 'user' | 'bot';
  title?: string;
  text: string;
  prompts?: string[];
  showLeadForm?: boolean;
};
