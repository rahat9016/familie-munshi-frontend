"use client";

/* eslint-disable @next/next/no-img-element -- logo host is backend-defined */
import DetailRow from "@/src/components/shared/DetailRow/DetailRow";
import DetailRowsSkeleton from "@/src/components/shared/DetailRow/DetailRowsSkeleton";
import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import StatusBadge from "@/src/components/shared/Status/Status";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGet } from "@/src/hooks/useGet";
import { getBrandLogo, IBrand, isBrandActive } from "@/src/types/brand";
import { StatusType } from "@/src/types/common/common";
import { Tag } from "lucide-react";
import { BrandViewModalProps } from "./types";
import { brandEndpoint, BRANDS_QUERY_KEY } from "./utils/brandFormData";

export default function BrandViewModal({
  brandId,
  onClose,
}: BrandViewModalProps) {
  // GET /brands/{id}
  const { data, isLoading, error } = useGet<IBrand>(
    brandEndpoint(brandId ?? ""),
    [BRANDS_QUERY_KEY, "detail", brandId ?? ""],
    undefined,
    { enabled: !!brandId }
  );
  const brand = data?.data;
  const logo = getBrandLogo(brand);

  return (
    <Dialog open={!!brandId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold flex items-center gap-3">
            <span className="inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-light">
              {isLoading ? (
                <Skeleton className="size-full" />
              ) : logo ? (
                <img src={logo} alt="" className="size-full object-contain" />
              ) : (
                <Tag className="size-5 text-primary" />
              )}
            </span>
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <span className="truncate">{brand?.title ?? "Brand"}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <DetailRowsSkeleton rows={5} />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : brand ? (
          <dl className="mt-2">
            <DetailRow label="Title">{brand.title}</DetailRow>
            <DetailRow label="Description">
              <span className="whitespace-pre-line">
                {brand.description || "—"}
              </span>
            </DetailRow>
            <DetailRow label="Position">{brand.position ?? "—"}</DetailRow>
            <DetailRow label="Status">
              <StatusBadge
                status={
                  isBrandActive(brand) ? StatusType.ACTIVE : StatusType.INACTIVE
                }
                className="px-2 py-1"
              />
            </DetailRow>
            <DetailRow label="ID">
              <span className="font-mono text-xs">{brand.id}</span>
            </DetailRow>
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
