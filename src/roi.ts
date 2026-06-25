import type { RoiInputs, RoiResult } from './types';

export function calculateRoi(input: RoiInputs): RoiResult {
  const conversion = Math.max(input.conversionRate, 0) / 100;
  const recoveredLeads = Math.round(input.monthlyLeads * 0.18);
  const extraDeals = Number((recoveredLeads * conversion).toFixed(2));
  const extraRevenue = Math.round(extraDeals * input.averageCommission);
  const adminSavings = Math.round(input.adminHoursPerWeek * 4.33 * input.hourlyCost * 0.42);
  return {
    recoveredLeads,
    extraDeals,
    extraRevenue,
    adminSavings,
    totalMonthlyImpact: extraRevenue + adminSavings,
  };
}

export function money(value: number, currency = 'USD') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
