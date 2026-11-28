"use client";

import {
  DetailFieldColumn,
  DetailSectionTitle,
} from "@/src/components/admin/shared/DetailFields";
import ImageGalleryPanel from "@/src/components/admin/shared/ImageGalleryPanel";
import TableTopBarHeader from "@/src/components/shared/TableTopBarHeader";
import { Skeleton } from "@/src/components/ui/skeleton";
import { PERMISSION } from "@/src/constants/auth/permissions";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePatch } from "@/src/hooks/usePatch";
import { usePost } from "@/src/hooks/usePost";
import { usePut } from "@/src/hooks/usePut";
import { selectHasPermission } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { cn } from "@/src/lib/utils";
import {
  COLORWAY_STANDARDS,
  ColorwayFlag,
  ColorwayTextField,
  IColorway,
  IColorwayUpdatePayload,
} from "@/src/types/colorway";
import { getApiErrorMessage } from "@/src/utils/apiError";
import { ArrowLeft, Palette, Shirt } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  colorwayDetailQueryKey,
  colorwayEndpoint,
  colorwayImageEndpoint,
  colorwayImageOrderEndpoint,
  colorwayImagesEndpoint,
  COLORWAYS_QUERY_KEY,
  COLORWAYS_ROUTE,
  formatDateTime,
  MULTIPART_CONFIG,
  toCoverOrder,
  toFieldPatch,
  toFlagPatch,
  toImagesFormData,
  validateImageFiles,
} from "../utils/colorwayFormData";
import {
  COLORWAY_DETAIL_TABS,
  ColorwayDetailProps,
  ColorwayDetailRow,
  ColorwayDetailTab,
} from "./types";

const invalidateKeys = [[COLORWAYS_QUERY_KEY]];
const NO_ARTICLES: string[] = [];

function DetailSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="rounded-lg border border-light-dark bg-white px-5 py-4 shadow-sm">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-3 h-8 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Skeleton className="h-72 lg:col-span-3" />
        <div className="grid grid-cols-1 gap-4 lg:col-span-9 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, col) => (
            <div key={col} className="space-y-2">
              {Array.from({ length: 6 }).map((_, row) => (
                <Skeleton key={row} className="h-8 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ColorwayDetail({ colorwayId }: ColorwayDetailProps) {
  const [activeTab, setActiveTab] = useState<ColorwayDetailTab>("Details");
  const canUpdate = useAppSelector(
    selectHasPermission(PERMISSION.COLORWAY_UPDATE)
  );

  // GET /colorways/{id}
  const { data, isLoading, error } = useGet<IColorway>(
    colorwayEndpoint(colorwayId),
    colorwayDetailQueryKey(colorwayId),
    undefined,
    { enabled: !!colorwayId }
  );
  const colorway = data?.data;

  // Article mapping isn't in the backend yet — still local (redux, by code).
  const linkedArticleIds = useAppSelector(
    (state) =>
      (colorway && state.colorway.items[colorway.code]?.articleIds) ||
      NO_ARTICLES
  );

  // usePatch / usePut / useDelete toast their own errors; usePost does not.
  const { mutateAsync: updateColorway } = usePatch<IColorway>(
    undefined,
    invalidateKeys
  );
  const { mutateAsync: uploadImages, isPending: isUploading } =
    usePost<IColorway>(undefined, undefined, invalidateKeys);
  const { mutateAsync: deleteImage } = useDelete<IColorway>(
    undefined,
    invalidateKeys
  );
  const { mutateAsync: reorderImages } = usePut<IColorway>(
    undefined,
    invalidateKeys
  );

  /** Resolves `false` when the server rejects the change. */
  const patch = (payload: IColorwayUpdatePayload) =>
    updateColorway({
      url: colorwayEndpoint(colorwayId),
      data: payload as Record<string, unknown>,
    })
      .then(() => true)
      .catch(() => false);

  const handleText = (field: ColorwayTextField, value: string) => {
    if (!colorway) return false;
    const result = toFieldPatch(colorway, field, value);
    // Unchanged, or blank on a field that can't be cleared → restore.
    if (!result) return false;
    if ("error" in result) {
      toast.error(result.error);
      return false;
    }
    return patch(result.payload);
  };

  const handleFlag = (field: ColorwayFlag, value: boolean) => {
    patch(toFlagPatch(field, value));
  };

  /** Every intake path — drop, click, multi select — lands here. */
  const handleImageFiles = async (files: File[]) => {
    if (!colorway || files.length === 0) return;
    const invalid = validateImageFiles(files, colorway.images.length);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    try {
      await uploadImages({
        endpoint: colorwayImagesEndpoint(colorwayId),
        data: toImagesFormData(files),
        config: MULTIPART_CONFIG,
      });
      toast.success(
        `${files.length} image${files.length > 1 ? "s" : ""} added`
      );
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not upload the image"));
    }
  };

  const handleRemoveImage = (index: number) => {
    const image = colorway?.images[index];
    if (!image) return;
    deleteImage({ url: colorwayImageEndpoint(colorwayId, image.id) }).catch(
      () => undefined
    );
  };

  const handleSetCover = (index: number) => {
    const image = colorway?.images[index];
    if (!colorway || !image || index === 0) return;
    reorderImages({
      url: colorwayImageOrderEndpoint(colorwayId),
      data: { imageIds: toCoverOrder(colorway, image.id) },
    }).catch(() => undefined);
  };

  // Gallery expects { id, thumbnail }; presigned URL serves as both sizes.
  const galleryImages = useMemo(
    () =>
      (colorway?.images ?? []).map((img) => ({
        id: img.id,
        thumbnail: img.url,
      })),
    [colorway?.images]
  );

  if (isLoading) return <DetailSkeleton />;

  if (!colorway) {
    return (
      <div className="space-y-3 p-6">
        <p className="text-sm text-secondary-gary">
          {error?.statusCode === 404 || !error
            ? "This colorway no longer exists."
            : getApiErrorMessage(error, "Could not load the colorway.")}
        </p>
        <Link
          href={COLORWAYS_ROUTE}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Color Way
        </Link>
      </div>
    );
  }

  // Without COLORWAY_UPDATE every editable row renders read-only.
  const field = (
    label: string,
    name: ColorwayTextField,
    extra: Partial<Extract<ColorwayDetailRow, { kind: "text" }>> = {}
  ): ColorwayDetailRow =>
    canUpdate
      ? { kind: "text", label, field: name, ...extra }
      : { kind: "readonly", label, value: colorway[name] ?? "" };

  const flag = (label: string, name: ColorwayFlag): ColorwayDetailRow =>
    canUpdate
      ? { kind: "flag", label, field: name }
      : { kind: "readonly", label, value: colorway[name] ? "Yes" : "No" };

  const standards = (COLORWAY_STANDARDS as readonly string[]).includes(
    colorway.colorStandard ?? ""
  )
    ? COLORWAY_STANDARDS
    : [...COLORWAY_STANDARDS, colorway.colorStandard ?? ""].filter(Boolean);

  const columnOne: ColorwayDetailRow[] = [
    { kind: "readonly", label: "Code", value: colorway.code, emphasis: true },
    field("Color Marketing Name", "marketingName"),
    field("Colorway", "name"),
    field("Color Specification", "colorSpecification"),
    field("Description", "description", { multiline: true }),
    canUpdate
      ? {
          kind: "select",
          label: "Color Standard",
          field: "colorStandard",
          options: standards,
        }
      : {
          kind: "readonly",
          label: "Color Standard",
          value: colorway.colorStandard ?? "",
        },
    field("Color Reference", "colorReference"),
    field("Color Hex", "hexCode", { type: "color" }),
  ];

  const columnTwo: ColorwayDetailRow[] = [
    flag("Active", "active"),
    flag("In Theme", "inTheme"),
    flag("Sustainability Label", "sustainabilityLabel"),
    flag("Plan SMS", "planSms"),
    flag("Plan 3D SMS", "plan3dSms"),
    flag("Actual SMS", "actualSms"),
  ];

  const columnThree: ColorwayDetailRow[] = [
    {
      kind: "readonly",
      label: "Created",
      value: formatDateTime(colorway.createdAt),
    },
    {
      kind: "readonly",
      label: "Updated",
      value: formatDateTime(colorway.updatedAt),
    },
    {
      kind: "readonly",
      label: "Linked Articles",
      value: String(linkedArticleIds.length),
    },
    {
      kind: "readonly",
      label: "Images",
      value: String(colorway.images.length),
    },
  ];

  const planningColumns: ColorwayDetailRow[][] = [
    [field("Start Date", "startDate", { type: "date" })],
    [field("End Date", "endDate", { type: "date" })],
    [field("Clearance Date", "clearanceDate", { type: "date" })],
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
                style={{ backgroundColor: colorway.hexCode || "#ffffff" }}
                title={colorway.hexCode ?? undefined}
              />
              {canUpdate ? (
                <input
                  key={colorway.marketingName}
                  defaultValue={colorway.marketingName}
                  placeholder="Color marketing name"
                  onBlur={(e) => {
                    const input = e.currentTarget;
                    if (input.value === colorway.marketingName) return;
                    Promise.resolve(
                      handleText("marketingName", input.value)
                    ).then((ok) => {
                      if (ok === false) input.value = colorway.marketingName;
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                  className="w-full min-w-60 border-none bg-transparent p-0 text-xl font-bold tracking-tight text-secondary-dark focus:outline-none focus:ring-0 md:text-2xl"
                />
              ) : (
                <span className="text-xl font-bold tracking-tight text-secondary-dark md:text-2xl">
                  {colorway.marketingName}
                </span>
              )}
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
        {COLORWAY_DETAIL_TABS.map((tab) => (
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
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
          <div
            className={cn(
              "lg:col-span-3",
              (!canUpdate || isUploading) && "pointer-events-none",
              isUploading && "opacity-60"
            )}
          >
            <ImageGalleryPanel
              images={galleryImages}
              alt={colorway.marketingName}
              onAdd={handleImageFiles}
              onRemove={handleRemoveImage}
              onSetPrimary={handleSetCover}
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
      )}

      {activeTab === "Articles" && (
        <div className="overflow-hidden rounded-lg border border-light-dark bg-white shadow-sm">
          <h3 className="border-b border-light-dark bg-light px-4 py-3 text-base font-bold text-secondary-dark">
            Linked Articles
          </h3>
          {linkedArticleIds.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-secondary-gary">
              This colorway is not mapped to any article yet.
            </p>
          ) : (
            <ul className="divide-y divide-light-dark">
              {linkedArticleIds.map((articleId) => (
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
