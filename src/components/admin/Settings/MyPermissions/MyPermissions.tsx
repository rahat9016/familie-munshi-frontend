"use client";

import { Skeleton } from "@/src/components/ui/skeleton";
import { useGet } from "@/src/hooks/useGet";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { selectIsSuperAdmin } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import {
  MyPermissionsResponse,
  PERMISSIONS_ME_ENDPOINT,
  RBAC_QUERY_KEY,
} from "@/src/utils/rbac";
import { Building2, KeyRound, Search } from "lucide-react";
import { useMemo } from "react";
import SettingsSection from "../SettingsSection";
import AccessSummary from "./AccessSummary";
import BranchAccessList from "./BranchAccessList";
import ModulePermissionList from "./ModulePermissionList";
import { filterModules } from "./utils/myPermissionsData";

/** Settings → My permissions: read-only view of GET /permissions/me. */
export default function MyPermissionsPage() {
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const { search, debouncedSearch, handleSearchChange } =
    useSearchDebounce(250);

  // Same key as useRbacPermissions → normally served from cache.
  const { data, isLoading } = useGet<MyPermissionsResponse>(
    PERMISSIONS_ME_ENDPOINT,
    RBAC_QUERY_KEY,
    undefined,
    { staleTime: 5 * 60 * 1000 }
  );
  const access = data?.data;

  const modules = useMemo(
    () => filterModules(access?.permissions ?? [], debouncedSearch),
    [access, debouncedSearch]
  );
  const branches = access?.branches ?? [];

  return (
    <div className="space-y-3">
      <AccessSummary
        access={access}
        isSuperAdmin={isSuperAdmin}
        isLoading={isLoading}
      />

      <SettingsSection
        title="Permissions"
        description="What your role lets you see and do. Ask an admin if something is missing."
        icon={KeyRound}
        action={
          <div className="flex items-center h-9 w-full sm:w-72 rounded-md border border-light-dark px-2.5 gap-2 focus-within:border-primary">
            <Search className="w-4 h-4 text-[#BDBDBD] shrink-0" />
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search permissions…"
              aria-label="Search permissions"
              className="flex-1 min-w-0 bg-transparent text-sm outline-none placeholder:text-[#BDBDBD]"
            />
          </div>
        }
      >
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-36 w-full" />
            ))}
          </div>
        ) : (
          <ModulePermissionList
            modules={modules}
            emptyMessage={
              debouncedSearch.trim()
                ? `No permissions match "${debouncedSearch.trim()}".`
                : "You don't have any permissions yet."
            }
          />
        )}
      </SettingsSection>

      {branches.length > 0 && (
        <SettingsSection
          title="Branch access"
          description="Roles and permissions you hold in each branch."
          icon={Building2}
        >
          <BranchAccessList branches={branches} />
        </SettingsSection>
      )}
    </div>
  );
}
