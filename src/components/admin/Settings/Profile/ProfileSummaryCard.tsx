"use client";

import StatusBadge from "@/src/components/shared/Status/Status";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Skeleton } from "@/src/components/ui/skeleton";
import { StatusType } from "@/src/types/common/common";
import { getUserFullName } from "@/src/types/user";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { ProfileSummaryCardProps } from "./types";
import { getInitials } from "./utils/profileFormData";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-light-dark last:border-b-0">
      <dt className="text-xs text-secondary-gary shrink-0">{label}</dt>
      <dd className="text-sm text-secondary-dark text-right min-w-0">
        {children}
      </dd>
    </div>
  );
}

/** Read-only account overview: who you are and where you have access. */
export default function ProfileSummaryCard({
  profile,
  access,
  isLoading = false,
}: ProfileSummaryCardProps) {
  if (isLoading || !profile) {
    return (
      <div className="rounded-lg border border-light-dark bg-white p-4 sm:p-5">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="mt-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const roles = access?.roles ?? [];
  const branch = [access?.branchName, access?.branchCode]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-lg border border-light-dark bg-white p-4 sm:p-5">
      <div className="flex flex-col items-center text-center">
        <Avatar className="size-20 border border-light-dark">
          {profile.profilePicture && (
            <AvatarImage
              src={profile.profilePicture}
              alt={getUserFullName(profile)}
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-light text-lg font-semibold text-secondary">
            {getInitials(profile.firstName, profile.lastName)}
          </AvatarFallback>
        </Avatar>
        <h2 className="mt-3 text-base font-semibold text-secondary-dark">
          {getUserFullName(profile)}
        </h2>
        <p className="text-sm text-secondary-gary break-all">{profile.email}</p>
      </div>

      <dl className="mt-4">
        <Row label="Status">
          <StatusBadge
            status={profile.active ? StatusType.ACTIVE : StatusType.INACTIVE}
            className="px-2 py-0.5 text-xs"
          />
        </Row>
        <Row label={roles.length > 1 ? "Roles" : "Role"}>
          {roles.length ? (
            <span className="flex flex-wrap justify-end gap-1">
              {roles.map((role) => (
                <span
                  key={role}
                  className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  {role}
                </span>
              ))}
            </span>
          ) : (
            "—"
          )}
        </Row>
        <Row label="Scope">{access?.scope ?? "—"}</Row>
        {branch && <Row label="Branch">{branch}</Row>}
        <Row label="Phone">{profile.phone || "—"}</Row>
      </dl>

      <Link
        href="/admin/settings/permissions"
        className="mt-4 flex items-center justify-center gap-1.5 rounded-md border border-light-dark py-2 text-sm font-medium text-primary hover:bg-light transition-colors"
      >
        View my permissions
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
