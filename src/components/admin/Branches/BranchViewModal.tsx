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
import { useGet } from "@/src/hooks/useGet";
import { StatusType } from "@/src/types/common/common";
import { getBranchLogo, IBranch, isBranchActive } from "@/src/types/branch";
import { Skeleton } from "@/src/components/ui/skeleton";
import { formatDateTime } from "@/src/utils/formatDateTime";
import { Building2 } from "lucide-react";
import { BranchViewModalProps } from "./types";
import { BRANCHES_QUERY_KEY } from "./utils/branchFormData";

export default function BranchViewModal({
  branchId,
  onClose,
}: BranchViewModalProps) {
  // GET /branches/{id}
  const { data, isLoading, error } = useGet<IBranch>(
    `/branches/${branchId}`,
    [BRANCHES_QUERY_KEY, "detail", branchId ?? ""],
    undefined,
    { enabled: !!branchId }
  );
  const branch = data?.data;
  const logo = getBranchLogo(branch);

  return (
    <Dialog open={!!branchId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold flex items-center gap-3">
            <span className="inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-light">
              {isLoading ? (
                <Skeleton className="size-full" />
              ) : logo ? (
                <img src={logo} alt="" className="size-full object-contain" />
              ) : (
                <Building2 className="size-5 text-primary" />
              )}
            </span>
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <span className="truncate">{branch?.name ?? "Branch"}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <DetailRowsSkeleton rows={7} />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : branch ? (
          <dl className="mt-2">
            <DetailRow label="Name">{branch.name}</DetailRow>
            <DetailRow label="Phone">{branch.phone || "—"}</DetailRow>
            <DetailRow label="Address">{branch.address || "—"}</DetailRow>
            <DetailRow label="Status">
              <StatusBadge
                status={
                  isBranchActive(branch)
                    ? StatusType.ACTIVE
                    : StatusType.INACTIVE
                }
                className="px-2 py-1"
              />
            </DetailRow>
            <DetailRow label="Created">
              {formatDateTime(branch.createdAt)}
            </DetailRow>
            <DetailRow label="Updated">
              {formatDateTime(branch.updatedAt)}
            </DetailRow>
            <DetailRow label="ID">
              <span className="font-mono text-xs">{branch.id}</span>
            </DetailRow>
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
