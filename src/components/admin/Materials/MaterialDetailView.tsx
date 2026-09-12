"use client";

import { ArrowLeft, Layers, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useCallback, useId, useState } from "react";
import { toast } from "react-toastify";
import { cn } from "@/src/lib/utils";
import {
  DetailFieldColumn,
  DetailRow,
  DetailSectionTitle,
} from "@/src/components/admin/shared/DetailFields";
import ImageGalleryPanel from "@/src/components/admin/shared/ImageGalleryPanel";
import TableTopBarHeader from "@/src/components/shared/TableTopBarHeader";
import { prepareGalleryImages } from "@/src/utils/galleryImage";
import { MATERIAL_TYPES } from "./data/materialHierarchy";
import { MATERIAL_STATUSES, YARN_COUNT_UNITS } from "./data/materialOptions";
import { useMaterials } from "./hooks/useMaterials";
import { useMaterialTaxonomy } from "./hooks/useMaterialTaxonomy";
import { IMaterial, MaterialFlag, MaterialTextField } from "./types";

const DETAIL_TABS = ["Details", "Documents"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

/** Status pill colors — mirrors the inline status cell on the list table. */
const statusStyles: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-700 border-slate-200",
  "In Development": "bg-amber-100 text-amber-800 border-amber-200",
  Approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
};

const formatDateTime = (value: string) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const formatSize = (bytes: number) =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1024 * 1024
    ? `${(bytes / 1024).toFixed(1)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

type MaterialDetailRow = DetailRow<MaterialTextField, MaterialFlag>;

export default function MaterialDetailView({
  materialId,
}: {
  materialId: string;
}) {
  const {
    getMaterial,
    updateMaterial,
    addImages,
    removeImage,
    setPrimaryImage,
    addDocument,
    deleteDocument,
    hydrated,
  } = useMaterials();
  const { getClassOptions, getSubClassOptions } = useMaterialTaxonomy();

  const [activeTab, setActiveTab] = useState<DetailTab>("Details");
  // A <label> opens the picker natively — no JS .click() to be swallowed.
  const docInputId = useId();

  const material = getMaterial(materialId);

  // Editing a level of the hierarchy invalidates everything below it —
  // same rule the list table applies to its inline selects.
  const handleText = useCallback(
    (field: MaterialTextField, value: string) => {
      const patch: Partial<IMaterial> = { [field]: value };
      if (field === "materialType") {
        patch.materialClass = "";
        patch.materialSubClass = "";
      }
      if (field === "materialClass") patch.materialSubClass = "";
      updateMaterial(materialId, patch);
    },
    [materialId, updateMaterial]
  );

  const handleFlag = useCallback(
    (field: MaterialFlag, value: boolean) =>
      updateMaterial(materialId, { [field]: value }),
    [materialId, updateMaterial]
  );

  /** Every intake path — drop, click, multi select — lands here. */
  const handleImageFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      try {
        const prepared = await prepareGalleryImages(files);
        addImages(materialId, prepared);
        toast.success(
          `${prepared.length} image${prepared.length > 1 ? "s" : ""} added`
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not upload the image"
        );
      }
    },
    // addImages is recreated each render by the hook; materialId is the key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [materialId]
  );

  if (!hydrated) {
    return (
      <p className="p-6 text-sm text-secondary-gary">Loading material…</p>
    );
  }

  if (!material) {
    return (
      <div className="space-y-3 p-6">
        <p className="text-sm text-secondary-gary">
          This material no longer exists.
        </p>
        <Link
          href="/admin/styles/material"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Material Management
        </Link>
      </div>
    );
  }

  const classOptions = getClassOptions(material.materialType).map((c) => c.name);
  const subClassOptions = getSubClassOptions(
    material.materialType,
    material.materialClass
  ).map((s) => s.name);

  const columnOne: MaterialDetailRow[] = [
    {
      kind: "readonly",
      label: "FAMILIE MUNSHI Code",
      value: material.code,
      emphasis: true,
    },
    {
      kind: "text",
      label: "Material Description",
      field: "materialDescription",
      multiline: true,
    },
    { kind: "text", label: "Composition", field: "composition" },
    { kind: "text", label: "Composition Text", field: "textComposition" },
    { kind: "text", label: "Structure", field: "structure" },
    { kind: "text", label: "Release Season", field: "releaseSeason" },
    {
      kind: "select",
      label: "MaterialStatus",
      field: "materialStatus",
      options: MATERIAL_STATUSES,
    },
    { kind: "flag", label: "Active", field: "isActive" },
    {
      kind: "text",
      label: "Size Unit of Measure",
      field: "sizeUnitOfMeasure",
    },
    { kind: "text", label: "Sizes", field: "sizes", multiline: true },
    { kind: "text", label: "Consumption Unit", field: "consumptionUnit" },
    {
      kind: "text",
      label: "Total Width",
      field: "totalWidth",
      type: "number",
    },
    {
      kind: "text",
      label: "Usable Width",
      field: "usableWidth",
      type: "number",
    },
    { kind: "text", label: "Width Unit", field: "widthUnit" },
    { kind: "text", label: "Weight", field: "weight", type: "number" },
    { kind: "text", label: "Weight Unit", field: "weightUnit" },
    { kind: "text", label: "Default Size", field: "defaultSize" },
    { kind: "text", label: "Default Color", field: "defaultColor" },
  ];

  const columnTwo: MaterialDetailRow[] = [
    { kind: "text", label: "Libraries", field: "libraries" },
    {
      kind: "text",
      label: "Material Security Groups",
      field: "materialSecurityGroups",
    },
    {
      kind: "select",
      label: "Material Type",
      field: "materialType",
      options: MATERIAL_TYPES,
    },
    {
      kind: "select",
      label: "Material Class",
      field: "materialClass",
      options: classOptions,
      disabled: !material.materialType,
    },
    {
      kind: "select",
      label: "Material Sub Class",
      field: "materialSubClass",
      options: subClassOptions,
      disabled: !material.materialClass,
    },
    {
      kind: "flag",
      label: "OK for Color Specification",
      field: "okForColorSpecification",
    },
    {
      kind: "readonly",
      label: "Created",
      value: formatDateTime(material.createdAt),
    },
    { kind: "readonly", label: "Created By", value: material.createdBy },
    {
      kind: "readonly",
      label: "Modified",
      value: formatDateTime(material.modifiedAt),
    },
    { kind: "readonly", label: "Modified By", value: material.modifiedBy },
    { kind: "text", label: "Owner", field: "owner" },
    {
      kind: "text",
      label: "Special Comment",
      field: "specialComment",
      multiline: true,
    },
    {
      kind: "text",
      label: "Dest. for Development 1",
      field: "destForDevelopment1",
    },
    {
      kind: "text",
      label: "Dest. for Development 2",
      field: "destForDevelopment2",
    },
    {
      kind: "text",
      label: "Dest. for Development 3",
      field: "destForDevelopment3",
    },
    {
      kind: "text",
      label: "Product Suppliers",
      field: "productSuppliers",
      multiline: true,
    },
    { kind: "text", label: "Default Supplier", field: "defaultSupplier" },
    { kind: "text", label: "Default Agent", field: "defaultAgent" },
  ];

  const columnThree: MaterialDetailRow[] = [
    {
      kind: "text",
      label: "Default Supplier Ref Code",
      field: "defaultSupplierRefCode",
    },
    {
      kind: "text",
      label: "Default Supplier Quote",
      field: "defaultSupplierQuote",
    },
    {
      kind: "text",
      label: "Default Leadtime Samples (days)",
      field: "defaultLeadtimeSamples",
      type: "number",
    },
    {
      kind: "text",
      label: "Default Leadtime Bulk (days)",
      field: "defaultLeadtimeBulk",
      type: "number",
    },
    { kind: "text", label: "Sample Minimums", field: "sampleMinimums" },
    { kind: "text", label: "Garment Prod.", field: "garmentProd" },
    {
      kind: "text",
      label: "Minimum Qty per Color",
      field: "minimumQtyPerColor",
      type: "number",
    },
    {
      kind: "text",
      label: "Minimum Qty per Order",
      field: "minimumQtyPerOrder",
      type: "number",
    },
    {
      kind: "text",
      label: "Consumption Price",
      field: "consumptionPrice",
      type: "number",
    },
    { kind: "text", label: "Sub Division", field: "subDivision" },
    { kind: "flag", label: "Is Sustainable", field: "isSustainable" },
    {
      kind: "flag",
      label: "Has Season Availability",
      field: "hasSeasonAvailability",
    },
    { kind: "text", label: "Data Sheets", field: "dataSheets" },
    {
      kind: "text",
      label: "Recent Conversations",
      field: "recentConversations",
    },
    {
      kind: "text",
      label: "Packaging Recyclingcode",
      field: "packagingRecyclingCode",
    },
    {
      kind: "flag",
      label: "Material Interface Trigger",
      field: "materialInterfaceTrigger",
    },
  ];

  const materialDetailColumns: MaterialDetailRow[][] = [
    [
      { kind: "text", label: "Construction", field: "construction" },
      { kind: "text", label: "Design", field: "design" },
      { kind: "text", label: "Spinning Type", field: "spinningType" },
      { kind: "text", label: "Yarn Count", field: "yarnCount", type: "number" },
      {
        kind: "select",
        label: "Yarn Count Unit",
        field: "yarnCountUnit",
        options: YARN_COUNT_UNITS,
      },
    ],
    [
      { kind: "text", label: "Dyeing Method", field: "dyeingMethod" },
      { kind: "text", label: "Dyeing Stuff", field: "dyeingStuff" },
      {
        kind: "text",
        label: "Material Information Status",
        field: "materialInformationStatus",
      },
    ],
    [{ kind: "text", label: "Trademark", field: "trademark" }],
  ];

  const sustainabilityColumns: MaterialDetailRow[][] = [
    [
      {
        kind: "text",
        label: "Sustainable Composition",
        field: "sustainableComposition",
        multiline: true,
      },
      { kind: "text", label: "% Of Organic", field: "percentOrganic" },
    ],
    [{ kind: "text", label: "% Of Others", field: "percentOthers" }],
    [{ kind: "text", label: "% Of Recycled", field: "percentRecycled" }],
  ];

  const column = (rows: MaterialDetailRow[]) => (
    <DetailFieldColumn
      rows={rows}
      record={material}
      onText={handleText}
      onFlag={handleFlag}
    />
  );

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-light-dark bg-white px-5 py-4 shadow-sm">
        <TableTopBarHeader
          icon={<Layers />}
          currentLabel={material.code}
          title={
            <input
              key={material.material}
              defaultValue={material.material}
              placeholder="Material name"
              onBlur={(e) => {
                if (e.target.value !== material.material)
                  handleText("material", e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              className="w-full min-w-60 border-none bg-transparent p-0 text-xl font-bold tracking-tight text-secondary-dark focus:outline-none focus:ring-0 md:text-2xl"
            />
          }
          action={
            <span
              className={cn(
                "w-fit rounded-md border px-4 py-1.5 text-sm font-semibold",
                statusStyles[material.materialStatus] ??
                  "border-slate-200 bg-slate-100 text-slate-700"
              )}
            >
              {material.materialStatus || "Draft"}
            </span>
          }
        />
      </div>

      {/* Tabs */}
      <div className="flex w-max items-center gap-1 rounded-lg border border-light-dark bg-white p-1.5 shadow-sm">
        {DETAIL_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition-colors",
              activeTab === tab
                ? "bg-primary text-white shadow-sm"
                : "text-secondary-dark hover:bg-light hover:text-primary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Details" && (
        <div>
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <ImageGalleryPanel
                images={material.images}
                alt={material.material}
                onAdd={handleImageFiles}
                onRemove={(index) => removeImage(materialId, index)}
                onSetPrimary={(index) => setPrimaryImage(materialId, index)}
              />
            </div>

            {/* Field columns — the sections below stay inside this column so
                they line up under the fields, not under the image. */}
            <div className="space-y-6 lg:col-span-9">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {column(columnOne)}
                {column(columnTwo)}
                {column(columnThree)}
              </div>

              <section className="space-y-3">
                <DetailSectionTitle>Material Details</DetailSectionTitle>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {materialDetailColumns.map((rows, index) => (
                    <div key={index}>{column(rows)}</div>
                  ))}
                </div>
              </section>

              <section className="space-y-3">
                <DetailSectionTitle>Sustainability</DetailSectionTitle>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {sustainabilityColumns.map((rows, index) => (
                    <div key={index}>{column(rows)}</div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Documents" && (
        <div className="overflow-hidden rounded-lg border border-light-dark bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-light-dark bg-light px-4 py-3">
            <h3 className="text-base font-bold text-secondary-dark">
              Documents
            </h3>
            <label
              htmlFor={docInputId}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Upload className="size-4" />
              Add Document
            </label>
            {/* Only the file's metadata is kept — storing the bytes would blow
                the localStorage quota this module persists into. */}
            <input
              id={docInputId}
              type="file"
              multiple
              className="sr-only"
              onChange={(e) => {
                const input = e.currentTarget;
                const files = Array.from(input.files ?? []);
                files.forEach((file) =>
                  addDocument(materialId, {
                    name: file.name,
                    type: file.type || "unknown",
                    size: file.size,
                  })
                );
                if (files.length)
                  toast.success(
                    `${files.length} document${
                      files.length > 1 ? "s" : ""
                    } added`
                  );
                input.value = "";
              }}
            />
          </div>

          {material.documents.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-secondary-gary">
              No documents attached to this material yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-light text-secondary-dark">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Name</th>
                    <th className="px-4 py-2 font-semibold">Type</th>
                    <th className="px-4 py-2 font-semibold">Size</th>
                    <th className="px-4 py-2 font-semibold">Added</th>
                    <th className="px-4 py-2 font-semibold">Added By</th>
                    <th className="px-4 py-2 text-end font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {material.documents.map((doc) => (
                    <tr key={doc.id} className="border-t border-light-dark">
                      <td className="px-4 py-2 font-medium text-secondary-dark">
                        {doc.name}
                      </td>
                      <td className="px-4 py-2 text-secondary-gary">
                        {doc.type}
                      </td>
                      <td className="px-4 py-2 text-secondary-gary">
                        {formatSize(doc.size)}
                      </td>
                      <td className="px-4 py-2 text-secondary-gary">
                        {formatDateTime(doc.addedAt)}
                      </td>
                      <td className="px-4 py-2 text-secondary-gary">
                        {doc.addedBy}
                      </td>
                      <td className="px-4 py-2 text-end">
                        <button
                          type="button"
                          title="Remove document"
                          onClick={() => {
                            deleteDocument(materialId, doc.id);
                            toast.info(`Document "${doc.name}" removed`);
                          }}
                          className="cursor-pointer text-red-600 transition-colors hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
