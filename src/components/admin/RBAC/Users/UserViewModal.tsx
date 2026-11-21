"use client";

/* eslint-disable @next/next/no-img-element -- picture host is backend-defined */
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
import { getUserFullName, isUserActive, IUser } from "@/src/types/user";
import { User } from "lucide-react";
import { UserViewModalProps } from "./types";
import { USERS_QUERY_KEY, userEndpoint } from "./utils/userFormData";

export default function UserViewModal({ userId, onClose }: UserViewModalProps) {
  // GET /users/{id}
  const { data, isLoading, error } = useGet<IUser>(
    userEndpoint(userId ?? ""),
    [USERS_QUERY_KEY, "detail", userId ?? ""],
    undefined,
    { enabled: !!userId }
  );
  const user = data?.data;

  return (
    <Dialog open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold flex items-center gap-3">
            <span className="inline-flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-light">
              {isLoading ? (
                <Skeleton className="size-full" />
              ) : user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-5 text-primary" />
              )}
            </span>
            {isLoading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <span className="truncate">
                {user ? getUserFullName(user) : "User"}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <DetailRowsSkeleton rows={6} />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : user ? (
          <dl className="mt-2">
            <DetailRow label="First name">{user.firstName || "—"}</DetailRow>
            <DetailRow label="Last name">{user.lastName || "—"}</DetailRow>
            <DetailRow label="Email">{user.email}</DetailRow>
            <DetailRow label="Phone">{user.phone || "—"}</DetailRow>
            <DetailRow label="Status">
              <StatusBadge
                status={
                  isUserActive(user) ? StatusType.ACTIVE : StatusType.INACTIVE
                }
                className="px-2 py-1"
              />
            </DetailRow>
            <DetailRow label="ID">
              <span className="font-mono text-xs">{user.id}</span>
            </DetailRow>
          </dl>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
