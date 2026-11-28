"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { cn } from "@/src/lib/utils";
import {
  Camera,
  ChevronDown,
  ImageDown,
  ImagePlus,
  ImageUp,
  ImageMinus,
  RefreshCw,
  Shirt,
  Tag,
} from "lucide-react";
import { useAppSelector } from "@/src/lib/redux/hooks";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import ColorwaysTab from "./ColorwaysTab";
import PropertyDetailsView from "./PropertyDetailsView";

interface ArticleDetailViewProps {
  seasonId: string;
  departmentId: string;
  categoryId: string;
  articleId: string;
}

const seasonNames: Record<string, string> = {
  "0000-dummy": "0000 Dummy",
  "786-summer": "786 NOOS/Summer",
  "786-winter": "786 NOOS/Winter",
  "2027-main": "2027 Main Collection",
  "2028-main": "2028 Main Collection",
};

const deptNames: Record<string, string> = {
  women: "Women",
  men: "Men",
  kids: "Kids",
  home: "Home",
  specials: "Specials",
  gifts: "Gifts",
};

const catNames: Record<string, string> = {
  "t-shirts": "T-Shirt",
  shirts: "Shirts",
  blouses: "Blouses",
  sweatshirts: "Sweatshirts",
};

const SUB_TABS = [
  "Properties",
  "Colorways",
  "Samples",
  "SKUs",
  "Documents",
  "Issues",
];

const TOOLBAR_ICONS = [
  { icon: Camera, label: "Capture image" },
  { icon: ImagePlus, label: "Approve image" },
  { icon: ImageDown, label: "Import image" },
  { icon: ImageUp, label: "Export image" },
  { icon: ImageMinus, label: "Remove image" },
];

const ACTION_BUTTONS = [
  "Promote",
  "Demote",
  "Cancel",
  "Re-activate",
  "Transfer",
  "Approve",
];

interface MarketingRow {
  label: string;
  value: string;
  /** Render the value as an affirmative badge. */
  highlight?: boolean;
}

const FABRIC_ROWS: MarketingRow[] = [
  { label: "Fabric Description", value: "Single Jersey, 100% BCI" },
  { label: "Fabric Composition", value: "80% Cotton, 20% Polyester" },
  { label: "Handfeel", value: "Soft & Premium Touch" },
  { label: "Fabric Stability", value: "High Durability & Preshrunk" },
];

const CARE_INSTRUCTIONS = [
  "Iron at moderate temperature",
  "Do not Bleach",
  "Do not dry-Clean",
  "30° mild fine wash",
  "Mild Drying Processes",
  "Pull into shape after washing",
  "Wash and Iron inside out",
  "Wash with similar Colors",
];

const DETAIL_QUESTIONS = [
  "Why this design is created?",
  "Why you will buy this style?",
  "Where you can wear this T-shirt?",
  "How much comfortability will you experience during wear?",
  "what is the most interesting info of this style?",
];

const MARKETING_ROWS: MarketingRow[] = [
  { label: "Variations of this style", value: "212633, 212634, 212635, 212636" },
  { label: "Better Together", value: "212730, 212741, 212745, 212640" },
  { label: "Recommendations", value: "213232, 213234, 213235, 213236" },
  { label: "Custom-Teamwear", value: "Clubs & Organisations" },
  { label: "Rent-a-Dress", value: "Everyday, Vacations" },
  { label: "PPR", value: "0.10", highlight: true },
  { label: "Golden-Draw", value: "Yes" },
  { label: "Promotional Header", value: "Summer Deals" },
];

interface PropertyRow {
  label: string;
  value: string;
  /** Render the value as an affirmative badge. */
  highlight?: boolean;
}

function ValueBadge({ children }: { children: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">
      {children}
    </span>
  );
}

export default function ArticleDetailView({
  seasonId,
  departmentId,
  categoryId,
  articleId,
}: ArticleDetailViewProps) {
  const seasonName = seasonNames[seasonId] || "2027 Main Collection";
  const deptName = deptNames[departmentId] || "Men";
  const categoryName = catNames[categoryId] || "T-Shirt";

  const createdProperty = useAppSelector(
    (state) => state.styleProperty.items[articleId]
  );

  const [activeSubTab, setActiveSubTab] = useState("Properties");
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAction = (btn: string) => {
    toast.success(`Action executed: ${btn} for Style #${articleId}`);
  };

  if (createdProperty) {
    return (
      <PropertyDetailsView
        property={createdProperty}
        seasonName={seasonName}
        deptName={deptName}
        backHref={`/admin/product-development/${seasonId}/${departmentId}/${categoryId}`}
      />
    );
  }

  const productImages = [
    {
      src: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
      label: "Technical Drawing - Front/Back (CW5978 / CW0120)",
    },
    {
      src: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80",
      label: "White Mockup Flatlay",
    },
    {
      src: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=600&q=80",
      label: "Navy & White Colorway Set",
    },
  ];

  // Left "Article" column of the property grid.
  const articleRows: PropertyRow[] = [
    { label: "Article", value: articleId },
    { label: "Promote Status", value: "Concept", highlight: true },
    { label: "Collection", value: seasonName },
    { label: "Promotional Month", value: "January" },
    { label: "Time schedule", value: "-" },
    { label: "Category", value: categoryName },
    { label: "Department", value: deptName },
    { label: "Fit", value: "Slim" },
    { label: "Special Comment", value: "-" },
    { label: "General Comment", value: "-" },
    { label: "Active colorways", value: "2" },
    { label: "Size Chart Template", value: "Standard Menswear" },
    { label: "Size Range", value: "Letter Size" },
    { label: "Sizes", value: "S, M, L, XL" },
    { label: "Proto Quantity", value: "10" },
    { label: "SMS Quantity", value: "5" },
  ];

  // Right "Assigned Branch" column of the property grid.
  const branchRows: PropertyRow[] = [
    { label: "Assigned Branch", value: "Dhaka" },
    { label: "Supplier", value: "Square" },
    { label: "Copied From", value: "-" },
    { label: "Active", value: "Yes", highlight: true },
    { label: "Cancellation Reason", value: "-" },
    { label: "Data Locked", value: "Yes", highlight: true },
    { label: "Auto Proto Request", value: "Yes", highlight: true },
    { label: "Auto SMS Request", value: "Yes", highlight: true },
    { label: "Auto FFP Request", value: "Yes", highlight: true },
    { label: "Packing Code", value: "EI" },
    { label: "Packing Comment", value: "-" },
    { label: "Transport Mode", value: "L" },
    { label: "Sustainability", value: "Re-cycled" },
    { label: "FOB", value: "150BDT" },
    { label: "Retail Price", value: "14.99€" },
    { label: "Virtual Trial", value: "Yes", highlight: true },
  ];

  const rowCount = Math.max(articleRows.length, branchRows.length);

  const renderCells = (row: PropertyRow | undefined, isLast: boolean) => {
    if (!row) {
      return (
        <>
          <td className="py-2 px-3 bg-light border-r border-light-dark" />
          <td className={cn("py-2 px-3", !isLast && "border-r border-light-dark")} />
        </>
      );
    }
    return (
      <>
        <td className="py-2 px-3 font-semibold text-secondary-dark bg-light border-r border-light-dark w-1/4">
          {row.label}
        </td>
        <td
          className={cn(
            "py-2 px-3 w-1/4 text-secondary-gary",
            !isLast && "border-r border-light-dark"
          )}
        >
          {row.highlight ? <ValueBadge>{row.value}</ValueBadge> : row.value}
        </td>
      </>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Header card */}
      <div className="bg-white border border-light-dark rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-11 rounded-lg bg-primary/10 text-primary shrink-0">
              <Shirt className="size-5" />
            </div>
            <div className="font-bold text-lg text-secondary-dark tracking-wide">
              FAMILIE MUNSHI
            </div>
            <div className="flex items-center border border-light-dark rounded-[6px] overflow-hidden h-11">
              <span className="bg-primary/10 text-primary font-semibold px-3 h-full flex items-center gap-1 border-r border-light-dark text-sm cursor-pointer">
                Style <ChevronDown className="size-3.5" />
              </span>
              <input
                type="text"
                defaultValue={articleId}
                className="px-3 h-full text-sm font-semibold w-28 text-secondary-dark outline-none bg-transparent"
              />
            </div>
          </div>

          <span className="inline-block px-3 py-1.5 text-sm font-semibold rounded-md bg-primary/10 text-primary">
            Product Developement
          </span>
        </div>

        {/* Breadcrumb */}
        <div className="px-5 py-2.5 border-t border-light-dark bg-light/60">
          <Breadcrumb>
            <BreadcrumbList className="text-xs md:text-sm text-secondary-gary">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/admin/product-development">Style</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/admin/product-development/${seasonId}`}>{seasonName}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/admin/product-development/${seasonId}/${departmentId}`}>{deptName}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={`/admin/product-development/${seasonId}/${departmentId}/${categoryId}`}>{categoryName}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">{articleId}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex w-max items-center gap-1 bg-white border border-light-dark rounded-lg p-1.5 shadow-sm overflow-x-auto scrollbar-hide">
        {SUB_TABS.map((subTab) => (
          <button
            key={subTab}
            onClick={() => setActiveSubTab(subTab)}
            className={cn(
              "whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-md transition-colors",
              activeSubTab === subTab
                ? "bg-primary text-white shadow-sm"
                : "text-secondary-dark hover:bg-light hover:text-primary"
            )}
          >
            {subTab}
          </button>
        ))}
      </div>

      {/* Toolbar + workflow actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {TOOLBAR_ICONS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              title={label}
              aria-label={label}
              onClick={() => handleAction(label)}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-light-dark bg-light text-secondary-gary transition-colors hover:bg-light-dark/40 hover:text-secondary-dark cursor-pointer"
            >
              <Icon className="h-4.5 w-4.5" />
            </button>
          ))}

          <button
            type="button"
            title="Tag"
            aria-label="Tag"
            onClick={() => handleAction("Tag")}
            className="h-9 flex items-center gap-1 px-2 rounded-lg border border-light-dark bg-light text-secondary-gary transition-colors hover:bg-light-dark/40 hover:text-secondary-dark cursor-pointer"
          >
            <Tag className="h-4.5 w-4.5" />
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            title="Refresh"
            aria-label="Refresh"
            onClick={() => handleAction("Refresh")}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-light-dark bg-light text-secondary-gary transition-colors hover:bg-light-dark/40 hover:text-secondary-dark cursor-pointer"
          >
            <RefreshCw className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ACTION_BUTTONS.map((btn) => (
            <button
              key={btn}
              type="button"
              onClick={() => handleAction(btn)}
              className="h-9 px-4 rounded-lg border border-light-dark bg-white text-sm font-medium text-secondary-dark transition-colors hover:bg-primary/5 hover:border-primary/40 hover:text-primary cursor-pointer"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area Conditional Rendering */}
      {activeSubTab === "Properties" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Technical Sketches & Preview */}
        <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-4 bg-white p-3 border border-light-dark rounded-xl shadow-sm space-y-3">
          <div className="relative w-full h-56 bg-light border border-light-dark rounded-lg overflow-hidden flex items-center justify-center p-2">
            <Image
              src={productImages[selectedImage].src}
              alt={productImages[selectedImage].label}
              fill
              className="object-contain p-2"
            />
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded backdrop-blur-xs font-mono">
              CW5978 / CW0120
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-3 gap-2">
            {productImages.map((img, idx) => (
              <button
                key={img.src}
                onClick={() => setSelectedImage(idx)}
                className={cn(
                  "relative h-16 rounded-lg border-2 overflow-hidden transition-all",
                  selectedImage === idx
                    ? "border-primary shadow-md"
                    : "border-light-dark hover:border-primary/50"
                )}
              >
                <Image src={img.src} alt={img.label} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Properties & Marketing Info */}
        <div className="lg:col-span-7 space-y-6">
          {/* Article / Assigned Branch property grid */}
          <div className="bg-white border border-light-dark rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                {Array.from({ length: rowCount }).map((_, idx) => (
                  <tr
                    key={articleRows[idx]?.label ?? branchRows[idx]?.label ?? idx}
                    className={cn(idx < rowCount - 1 && "border-b border-light-dark")}
                  >
                    {renderCells(articleRows[idx], false)}
                    {renderCells(branchRows[idx], true)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Marketing Info */}
          <div className="bg-white border border-light-dark rounded-lg overflow-hidden shadow-sm">
            <h3 className="bg-light border-b border-light-dark px-4 py-3 text-lg font-bold text-secondary-dark">
              Marketing Info
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 text-xs">
              {/* Left Column: fabric facts, care instructions, details */}
              <div className="border-b border-light-dark md:border-b-0 md:border-r md:border-light-dark">
                {FABRIC_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="flex min-h-11 border-b border-light-dark"
                  >
                    <span className="w-1/2 flex items-center px-3 py-2 font-semibold text-secondary-dark border-r border-light-dark bg-light">
                      {row.label}
                    </span>
                    <span className="w-1/2 flex items-center px-3 py-2 text-secondary-gary">
                      {row.value}
                    </span>
                  </div>
                ))}

                <div className="border-b border-light-dark px-3 py-2">
                  <p className="font-semibold text-secondary-dark">Care Instructions:</p>
                  <ul className="mt-1 space-y-0.5 pl-6 text-secondary-gary">
                    {CARE_INSTRUCTIONS.map((care) => (
                      <li key={care}>&gt; {care}</li>
                    ))}
                  </ul>
                </div>

                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-secondary-dark">Details:</p>
                  <ol className="mt-1 list-decimal space-y-1 pl-5 text-secondary-gary">
                    {DETAIL_QUESTIONS.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Right Column: linked styles, pricing signals, care label print */}
              <div>
                {MARKETING_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="flex min-h-11 border-b border-light-dark"
                  >
                    <span className="w-1/2 flex items-center px-3 py-2 font-semibold text-secondary-dark border-r border-light-dark bg-light">
                      {row.label}
                    </span>
                    <span className="w-1/2 flex items-center px-3 py-2 text-secondary-gary">
                      {row.highlight ? <ValueBadge>{row.value}</ValueBadge> : row.value}
                    </span>
                  </div>
                ))}

                <div className="px-3 py-2">
                  <p className="font-semibold text-secondary-dark">Print on Care Label</p>
                  <div className="mt-2 space-y-3 pl-3">
                    <div className="flex">
                      <span className="w-24 shrink-0 font-semibold text-secondary-dark">
                        Designed in
                      </span>
                      <span className="text-secondary-gary">Germany</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 shrink-0 font-semibold text-secondary-dark">
                        Address
                      </span>
                      <div className="space-y-0.5 text-secondary-gary">
                        <p>Familie Munshi</p>
                        <p className="pt-2">Familie Munshi UG</p>
                        <p>Robert Dißmann str.10</p>
                        <p>65936, Frankfurt, Germany</p>
                        <p>info@familiemunshi.de</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {activeSubTab === "Colorways" && <ColorwaysTab articleId={articleId} />}
    </div>
  );
}
