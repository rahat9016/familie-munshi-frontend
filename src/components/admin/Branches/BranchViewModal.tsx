"use client";

/* eslint-disable @next/next/no-img-element -- logo host is backend-defined */
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
import { Building2 } from "lucide-react";
import { ReactNode } from "react";
import { BranchViewModalProps } from "./types";
import { BRANCHES_QUERY_KEY } from "./utils/branchFormData";

const SKELETON_ROWS = 7;

function DetailsSkeleton() {
  return (
    <div className="mt-2" aria-busy="true" aria-label="Loading branch">
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-3 gap-3 py-3 border-b last:border-b-0"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className={`col-span-2 h-4 ${i % 2 ? "w-1/2" : "w-3/4"}`} />
        </div>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 py-3 border-b last:border-b-0">
      <dt className="text-sm text-secondary-gary">{label}</dt>
      <dd className="col-span-2 text-sm text-secondary font-medium wrap-break-word">
        {children}
      </dd>
    </div>
  );
}

const fmtDate = (v?: string) =>
  v
    ? new Date(v).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

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
          <DetailsSkeleton />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : branch ? (
          <dl className="mt-2">
            <Row label="Name">{branch.name}</Row>
            <Row label="Phone">{branch.phone || "—"}</Row>
            <Row label="Address">{branch.address || "—"}</Row>
            <Row label="Status">
              <StatusBadge
                status={
                  isBranchActive(branch)
                    ? StatusType.ACTIVE
                    : StatusType.INACTIVE
                }
                className="px-2 py-1"
              />
            </Row>
            <Row label="Created">{fmtDate(branch.createdAt)}</Row>
            <Row label="Updated">{fmtDate(branch.updatedAt)}</Row>
            <Row label="ID">
              <span className="font-mono text-xs">{branch.id}</span>
            </Row>
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
