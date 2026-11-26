import { AdminSettings } from "../types";

export const mockAdminSettings: AdminSettings = {
  siteName: "Tecgen Store",
  legalName: "Tecgen Soft Ltd.",
  supportEmail: "support@tecgen.com",
  supportPhone: "+8801700000000",
  logoUrl: "/images/logo.png",
  description:
    "Multi-branch commerce platform for seasons, styles and product lifecycle management.",
  maintenanceMode: false,

  currency: "BDT",
  timezone: "Asia/Dhaka",
  language: "en",
  weightUnit: "kg",
  orderPrefix: "ORD",
  taxRate: 5,
  freeShippingThreshold: 3000,
  storeAddress: "House 12, Road 7, Gulshan-1, Dhaka 1212, Bangladesh",

  updatedAt: "2026-08-01T09:30:00.000Z",
};

export const CURRENCY_OPTIONS = [
  { label: "BDT — Bangladeshi Taka", value: "BDT" },
  { label: "USD — US Dollar", value: "USD" },
  { label: "EUR — Euro", value: "EUR" },
  { label: "GBP — British Pound", value: "GBP" },
  { label: "AED — UAE Dirham", value: "AED" },
];

export const TIMEZONE_OPTIONS = [
  { label: "Asia/Dhaka (GMT+6)", value: "Asia/Dhaka" },
  { label: "Asia/Dubai (GMT+4)", value: "Asia/Dubai" },
  { label: "Europe/Berlin (GMT+1)", value: "Europe/Berlin" },
  { label: "Europe/London (GMT+0)", value: "Europe/London" },
  { label: "America/New_York (GMT-5)", value: "America/New_York" },
];

export const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "Bangla", value: "bn" },
  { label: "German", value: "de" },
  { label: "Arabic", value: "ar" },
];

export const WEIGHT_UNIT_OPTIONS = [
  { label: "Kilogram (kg)", value: "kg" },
  { label: "Gram (g)", value: "g" },
  { label: "Pound (lb)", value: "lb" },
];
