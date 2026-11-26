export interface AdminSettings {
  // General
  siteName: string;
  legalName: string;
  supportEmail: string;
  supportPhone: string;
  logoUrl: string;
  description: string;
  maintenanceMode: boolean;

  // Store
  currency: string;
  timezone: string;
  language: string;
  weightUnit: string;
  orderPrefix: string;
  taxRate: number;
  freeShippingThreshold: number;
  storeAddress: string;

  updatedAt: string;
}
