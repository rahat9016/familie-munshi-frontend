import {
  Baby,
  Backpack,
  Briefcase,
  Building2,
  Camera,
  Church,
  Coffee,
  CreditCard,
  Crown,
  Droplet,
  Dumbbell,
  Flag,
  Footprints,
  Gem,
  Gift,
  Heart,
  Home,
  Layers,
  Monitor,
  Mountain,
  Package,
  Palmtree,
  Pen,
  Shirt,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Sun,
  Tag,
  Trophy,
  Users,
  Watch,
  Wind,
  type LucideIcon,
} from "lucide-react";

export interface MegaItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Uploaded icon URL; rendered instead of `icon` when set. */
  iconUrl?: string;
  highlight?: boolean;
}

export interface MegaColumn {
  id?: string;
  heading: string;
  items: MegaItem[];
}

export interface MegaMenuData {
  columns: MegaColumn[];
  promo: { image: string; label: string; href: string };
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

type Pair = [string, LucideIcon];

const item = ([label, icon]: Pair): MegaItem => ({
  label,
  href: `/categories?c=${slug(label)}`,
  icon,
});

// Shared subcategory groups (same set under every category).
const TOPS: Pair[] = [
  ["Blouses", Shirt],
  ["Shirts", Shirt],
  ["T-shirts", Shirt],
  ["Polo shirts", Shirt],
  ["Sweatshirts", Shirt],
  ["Sweatshirt Jacke", Layers],
  ["Indoor jackets", Shirt],
  ["Indoor Blazer", Layers],
  ["Indoor-Sakko", Layers],
  ["Indoor-Weste", Layers],
];

const OUTDOOR: Pair[] = [
  ["Outdoor jackets", Mountain],
  ["Outdoor-Coat", Snowflake],
  ["Outdoor-Weste", Layers],
  ["Outdoor-Poncho", Wind],
  ["Outdoor-Umhang", Wind],
  ["Knitwear", Snowflake],
  ["Knitted sweater", Snowflake],
  ["Knitted Vest", Layers],
  ["Knitted cardigan", Snowflake],
  ["Knitted twinset", Sparkles],
];

const BOTTOMS: Pair[] = [
  ["Pants", Tag],
  ["Jeans pants", Tag],
  ["Skirts", Tag],
  ["One-pieces/dresses", Shirt],
  ["Underwear", Package],
  ["Swimwear", Droplet],
  ["Accessories", Watch],
  ["Socks/Hosiery", Footprints],
  ["Daywear", Sparkles],
  ["Hats", Crown],
];

const SPECIALS: Pair[] = [
  ["Curtains", Home],
  ["Home Cloths", Home],
  ["Shoes", Footprints],
  ["Fine Jewelry", Gem],
  ["Fashion Jewelry", Sparkles],
  ["Bags", ShoppingBag],
  ["Fragrances", Droplet],
  ["Flags", Flag],
  ["Religious", Crown],
  ["Traditionals", Backpack],
];

const ESSENTIAL_CLOSET: Pair[] = [
  ["Everyday", Shirt],
  ["Formal Wear", Crown],
  ["Office Wear", Briefcase],
  ["Matching Sets", Layers],
];

const OCCASION_WARDROBE: Pair[] = [
  ["Vacations", Palmtree],
  ["Weddings", Heart],
  ["Traditional", Backpack],
  ["Summer/Winter Outfitting", Sun],
];

const LIFESTYLE_EDIT: Pair[] = [
  ["Exercise Time", Dumbbell],
  ["Sports Day", Trophy],
  ["Maternity Cloths", Baby],
  ["Religionals", Church],
];

const FAMILY_VAULT: Pair[] = [
  ["Kids", Users],
  ["Boys", Users],
  ["Girls", Users],
  ["Ornaments", Gem],
];

const RENT_A_DRESS_MENU: MegaMenuData = {
  columns: [
    { heading: "The Essential Closet", items: ESSENTIAL_CLOSET.map(item) },
    { heading: "The Occasion Wardrobe", items: OCCASION_WARDROBE.map(item) },
    { heading: "The Lifestyle Edit", items: LIFESTYLE_EDIT.map(item) },
    { heading: "The Family Vault", items: FAMILY_VAULT.map(item) },
  ],
  promo: {
    image: "https://picsum.photos/seed/rent-a-dress/520/360",
    label: "RENT THE LOOK",
    href: "/categories?c=rent-a-dress",
  },
};

const SHARED_MENU: MegaMenuData = {
  columns: [
    { heading: "Tops & Indoor", items: TOPS.map(item) },
    { heading: "Outdoor & Knitwear", items: OUTDOOR.map(item) },
    { heading: "Bottoms & More", items: BOTTOMS.map(item) },
    { heading: "Home & Specials", items: SPECIALS.map(item) },
  ],
  promo: {
    image: "https://picsum.photos/seed/familie-munshi/520/360",
    label: "NEW SEASON EDIT",
    href: "/categories?h=new-season",
  },
};

export const defaultMegaMenu: MegaMenuData = SHARED_MENU;

const CUSTOM_TEAMWEAR_MENU: MegaMenuData = {
  columns: [
    {
      heading: "For Businesses & Promotions",
      items: (
        [
          ["Corporate Swag", Briefcase],
          ["Trade Show Merch & Signage", Flag],
          ["Marketing Campaigns & Giveaways", Sparkles],
          ["Promo & Advertising Merch", Tag],
          ["Client Gifts", Gift],
          ["Branded Staff Apparel", Shirt],
          ["Bulk order for wholesale Business", Building2],
          ["Employee Recognition & Gifts", Trophy],
          ["Employee Team Building Swag", Users],
          ["Content Creators", Camera],
          ["Small Businesses & Uniforms", Briefcase],
        ] as Pair[]
      ).map(item),
    },
    {
      heading: "For Group & Events",
      items: (
        [
          ["Sports Jerseys", Shirt],
          ["Personalized Gifts", Gift],
          ["Weddings", Heart],
          ["Family Events", Home],
          ["Friend Events", Users],
          ["Clubs & Organisations", Church],
          ["Kindergarten to 12th Class", Backpack],
          ["Colleges & Universities", Backpack],
          ["Teacher Appreciation", Crown],
          ["Hospital services", Droplet],
          ["Festival & Religious Events", Church],
        ] as Pair[]
      ).map(item),
    },
    {
      heading: "Designing Tool",
      items: (
        [
          ["T-shirt", Shirt],
          ["Tanktop", Shirt],
          ["Polo Shirt", Shirt],
          ["Sweatshirt", Layers],
          ["Hoodies", Layers],
          ["Blazer", Briefcase],
          ["Socks", Footprints],
          ["Skirts", Tag],
          ["short Trousers", Tag],
          ["Flags", Flag],
          ["Jerseys", Shirt],
        ] as Pair[]
      ).map(item),
    },
    {
      heading: "Accessories",
      items: (
        [
          ["Socks", Footprints],
          ["Belts", Watch],
          ["Hats & Caps", Crown],
          ["Flags", Flag],
          ["Back pack", Backpack],
          ["Bags", ShoppingBag],
          ["Pens", Pen],
          ["Mugs", Coffee],
          ["Water Bottle", Droplet],
          ["Key Ring", Gem],
          ["Gift Card", CreditCard],
        ] as Pair[]
      ).map(item),
    },
  ],
  promo: {
    image: "https://picsum.photos/seed/custom-teamwear/520/360",
    label: "CUSTOMIZE NOW",
    href: "/categories?c=custom-teamwear",
  },
};

/** Per-label menus; anything not listed falls back to the shared subcategory menu. */
const MENU_BY_LABEL: Record<string, MegaMenuData> = {
  "rent-a-dress": RENT_A_DRESS_MENU,
  "custom-teamwear": CUSTOM_TEAMWEAR_MENU,
};

export function getMegaMenu(label: string): MegaMenuData {
  return MENU_BY_LABEL[slug(label)] ?? SHARED_MENU;
}
