import {
  CreditCard,
  MapPin,
  Package,
  RotateCcw,
  User,
  XCircle,
  type LucideIcon,
} from "lucide-react";

export interface ProfileMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Customer account menu (storefront users only). */
export const userMenuItems: ProfileMenuItem[] = [
  { label: "My Profile", href: "/account", icon: User },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Returns", href: "/account/returns", icon: RotateCcw },
  { label: "Cancellations", href: "/account/cancellations", icon: XCircle },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  {
    label: "Payment Methods",
    href: "/account/payment-methods",
    icon: CreditCard,
  },
];

const pick = (...hrefs: string[]) =>
  hrefs.map((href) => userMenuItems.find((item) => item.href === href)!);

export const sidebarSections = [
  {
    title: "Manage My Account",
    items: pick("/account", "/account/addresses", "/account/payment-methods"),
  },
  {
    title: "My Orders",
    items: pick(
      "/account/orders",
      "/account/returns",
      "/account/cancellations"
    ),
  },
];
