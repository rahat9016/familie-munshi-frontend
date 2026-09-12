"use client";

import { ArrowLeft, Palette, Shirt } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import {
  DetailFieldColumn,
  DetailRow,
  DetailSectionTitle,
} from "@/src/components/admin/shared/DetailFields";
import ImageGalleryPanel from "@/src/components/admin/shared/ImageGalleryPanel";
import TableTopBarHeader from "@/src/components/shared/TableTopBarHeader";
import {
  addColorwayImages,
  ColorwayFlag,
  ColorwayTextField,
  removeColorwayImage,
  setColorwayField,
  setColorwayFlag,
  setPrimaryColorwayImage,
} from "@/src/lib/redux/features/colorway/colorwaySlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { cn } from "@/src/lib/utils";
import { prepareGalleryImages } from "@/src/utils/galleryImage";
import { colorwayStandardOptions } from "../Schema/colorwaySchema";

const DETAIL_TABS = ["Details", "Articles"] as const;
type DetailTab = (typeof DETAIL_TABS)[number];

type ColorwayDetailRow = DetailRow<ColorwayTextField, ColorwayFlag>;

const STANDARDS = colorwayStandardOptions.map((option) => option.value);

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

export default function ColorwayDetailView({
  colorwayCode,
}: {
  colorwayCode: string;
}) {
  const dispatch = useAppDispatch();
  const colorway = useAppSelector((state) => state.colorway.items[colorwayCode]);
  const [activeTab, setActiveTab] = useState<DetailTab>("Details");

  const handleText = useCallback(
    (field: ColorwayTextField, value: string) => {
      dispatch(setColorwayField({ code: colorwayCode, field, value }));
    },
    [colorwayCode, dispatch]
  );

  const handleFlag = useCallback(
    (field: ColorwayFlag, value: boolean) => {
      dispatch(setColorwayFlag({ code: colorwayCode, field, value }));
    },
    [colorwayCode, dispatch]
  );

  /** Every intake path — drop, click, multi select — lands here. */
  const handleImageFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;
      try {
        const images = await prepareGalleryImages(files);
        dispatch(addColorwayImages({ code: colorwayCode, images }));
        toast.success(
          `${images.length} image${images.length > 1 ? "s" : ""} added`
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not upload the image"
        );
      }
    },
    [colorwayCode, dispatch]
  );

  if (!colorway) {
    return (
      <div className="space-y-3 p-6">
        <p className="text-sm text-secondary-gary">
          This colorway no longer exists.
        </p>
        <Link
          href="/admin/styles/color-way"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Color Way
        </Link>
      </div>
    );
  }

  const columnOne: ColorwayDetailRow[] = [
    { kind: "readonly", label: "Code", value: colorway.code, emphasis: true },
    { kind: "text", label: "Color Marketing Name", field: "name" },
    { kind: "text", label: "Colorway", field: "colorway" },
    { kind: "text", label: "Color Specification", field: "spec" },
    { kind: "text", label: "Description", field: "description", multiline: true },
    {
      kind: "select",
      label: "Color Standard",
      field: "standard",
      options: STANDARDS,
    },
    { kind: "text", label: "Pantone", field: "pantone", multiline: true },
    { kind: "text", label: "Color Hex", field: "colorHex", type: "color" },
  ];

  const columnTwo: ColorwayDetailRow[] = [
    { kind: "flag", label: "Active", field: "active" },
    { kind: "flag", label: "In Theme", field: "inTheme" },
    { kind: "flag", label: "Sust. Label Off", field: "sustLabelOff" },
    { kind: "flag", label: "Plan SMS", field: "planSms" },
    { kind: "flag", label: "Plan 3D SMS", field: "plan3dSms" },
    { kind: "flag", label: "Actual SMS", field: "actualSms" },
  ];

  const columnThree: ColorwayDetailRow[] = [
    {
      kind: "readonly",
      label: "Created",
      value: formatDateTime(colorway.createdAt),
    },
    {
      kind: "readonly",
      label: "Linked Articles",
      value: String(colorway.articleIds.length),
    },
    {
      kind: "readonly",
      label: "Images",
      value: String(colorway.images.length),
    },
  ];

  const planningColumns: ColorwayDetailRow[][] = [
    [{ kind: "text", label: "Start Date", field: "startDate", type: "date" }],
    [{ kind: "text", label: "End Date", field: "endDate", type: "date" }],
    [
      {
        kind: "text",
        label: "Clearance Date",
        field: "clearanceDate",
        type: "date",
      },
    ],
  ];

  const column = (rows: ColorwayDetailRow[]) => (
    <DetailFieldColumn
      rows={rows}
      record={colorway}
      onText={handleText}
      onFlag={handleFlag}
    />
  );

  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-light-dark bg-white px-5 py-4 shadow-sm">
        <TableTopBarHeader
          icon={<Palette />}
          currentLabel={colorway.code}
          title={
            <span className="flex items-center gap-3">
              <span
                className="size-7 shrink-0 rounded-md border border-light-dark"
                style={{ backgroundColor: colorway.colorHex || "#ffffff" }}
                title={colorway.colorHex}
              />
              <input
                key={colorway.name}
                defaultValue={colorway.name}
                placeholder="Color marketing name"
                onBlur={(e) => {
                  if (e.target.value !== colorway.name)
                    handleText("name", e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                className="w-full min-w-60 border-none bg-transparent p-0 text-xl font-bold tracking-tight text-secondary-dark focus:outline-none focus:ring-0 md:text-2xl"
              />
            </span>
          }
          action={
            <span
              className={cn(
                "w-fit rounded-md border px-4 py-1.5 text-sm font-semibold",
                colorway.active
                  ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                  : "border-slate-200 bg-slate-100 text-slate-700"
              )}
            >
              {colorway.active ? "Active" : "Inactive"}
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
                images={colorway.images}
                alt={colorway.name}
                onAdd={handleImageFiles}
                onRemove={(index) =>
                  dispatch(removeColorwayImage({ code: colorwayCode, index }))
                }
                onSetPrimary={(index) =>
                  dispatch(
                    setPrimaryColorwayImage({ code: colorwayCode, index })
                  )
                }
              />
            </div>

            {/* The sections below sit inside this column so they line up under
                the fields, not under the image. */}
            <div className="space-y-6 lg:col-span-9">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {column(columnOne)}
                {column(columnTwo)}
                {column(columnThree)}
              </div>

              <section className="space-y-3">
                <DetailSectionTitle>Planning</DetailSectionTitle>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  {planningColumns.map((rows, index) => (
                    <div key={index}>{column(rows)}</div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Articles" && (
        <div className="overflow-hidden rounded-lg border border-light-dark bg-white shadow-sm">
          <h3 className="border-b border-light-dark bg-light px-4 py-3 text-base font-bold text-secondary-dark">
            Linked Articles
          </h3>
          {colorway.articleIds.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-secondary-gary">
              This colorway is not mapped to any article yet.
            </p>
          ) : (
            <ul className="divide-y divide-light-dark">
              {colorway.articleIds.map((articleId) => (
                <li
                  key={articleId}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-secondary-dark"
                >
                  <Shirt className="size-4 text-secondary-gary" />
                  {articleId}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
