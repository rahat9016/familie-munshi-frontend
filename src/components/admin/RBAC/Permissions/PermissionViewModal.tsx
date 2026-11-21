"use client";

import DetailRow from "@/src/components/shared/DetailRow/DetailRow";
import DetailRowsSkeleton from "@/src/components/shared/DetailRow/DetailRowsSkeleton";
import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGet } from "@/src/hooks/useGet";
import { IPermission } from "@/src/types/permission";
import { formatDateTime } from "@/src/utils/formatDateTime";
import { KeyRound } from "lucide-react";
import { PermissionViewModalProps } from "./types";
import {
  formatModule,
  PERMISSIONS_QUERY_KEY,
  permissionEndpoint,
} from "./utils/permissionData";

export default function PermissionViewModal({
  permissionId,
  onClose,
}: PermissionViewModalProps) {
  // GET /permissions/{id}
  const { data, isLoading, error } = useGet<IPermission>(
    permissionEndpoint(permissionId ?? ""),
    [PERMISSIONS_QUERY_KEY, "detail", permissionId ?? ""],
    undefined,
    { enabled: !!permissionId }
  );
  const permission = data?.data;

  return (
    <Dialog open={!!permissionId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold flex items-center gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-light">
              <KeyRound className="size-5 text-primary" />
            </span>
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <span className="truncate font-mono text-base">
                {permission?.name ?? "Permission"}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <DetailRowsSkeleton rows={5} />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : permission ? (
          <dl className="mt-2">
            <DetailRow label="Code">
              <span className="font-mono text-xs">{permission.name}</span>
            </DetailRow>
            <DetailRow label="Module">
              {formatModule(permission.module)}
            </DetailRow>
            <DetailRow label="Description">
              {permission.description || "—"}
            </DetailRow>
            <DetailRow label="Created">
              {formatDateTime(permission.createdAt)}
            </DetailRow>
            <DetailRow label="ID">
              <span className="font-mono text-xs">{permission.id}</span>
            </DetailRow>
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
