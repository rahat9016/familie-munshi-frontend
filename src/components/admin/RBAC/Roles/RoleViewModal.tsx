"use client";

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
import { StatusType } from "@/src/types/common/common";
import { IRole } from "@/src/types/role";
import { formatDateTime } from "@/src/utils/formatDateTime";
import { ShieldCheck } from "lucide-react";
import { RoleViewModalProps } from "./types";
import { ROLES_QUERY_KEY, roleEndpoint } from "./utils/roleFormData";

export default function RoleViewModal({ roleId, onClose }: RoleViewModalProps) {
  // GET /system/roles/{id}
  const { data, isLoading, error } = useGet<IRole>(
    roleEndpoint(roleId ?? ""),
    [ROLES_QUERY_KEY, "detail", roleId ?? ""],
    undefined,
    { enabled: !!roleId }
  );
  const role = data?.data;

  return (
    <Dialog open={!!roleId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold flex items-center gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-light">
              <ShieldCheck className="size-5 text-primary" />
            </span>
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <span className="truncate">{role?.name ?? "Role"}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <DetailRowsSkeleton rows={8} />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : role ? (
          <dl className="mt-2">
            <DetailRow label="Name">{role.name}</DetailRow>
            <DetailRow label="Description">{role.description || "—"}</DetailRow>
            <DetailRow label="Scope">{role.scope || "—"}</DetailRow>
            <DetailRow label="Branch">{role.branch?.name || "—"}</DetailRow>
            <DetailRow label="Type">
              {role.isSystem ? "System" : "Custom"}
            </DetailRow>
            <DetailRow label="Status">
              <StatusBadge
                status={role.isActive ? StatusType.ACTIVE : StatusType.INACTIVE}
                className="px-2 py-1"
              />
            </DetailRow>
            <DetailRow label="Created">
              {formatDateTime(role.createdAt)}
            </DetailRow>
            <DetailRow label="ID">
              <span className="font-mono text-xs">{role.id}</span>
            </DetailRow>
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
