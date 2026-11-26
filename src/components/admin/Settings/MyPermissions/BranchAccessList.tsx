import ModulePermissionList from "./ModulePermissionList";
import { BranchAccessListProps } from "./types";
import {
  countPermissions,
  filterModules,
  humanize,
} from "./utils/myPermissionsData";

/** Per-branch roles + permissions (branch-scoped users). */
export default function BranchAccessList({ branches }: BranchAccessListProps) {
  return (
    <div className="space-y-3">
      {branches.map((b) => (
        <div
          key={b.branchId}
          className="rounded-md border border-light-dark p-3 sm:p-4"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-secondary-dark truncate">
                {b.branchName || "Branch"}
                {b.branchCode && (
                  <span className="ml-2 text-xs font-normal text-secondary-gary">
                    {b.branchCode}
                  </span>
                )}
              </h3>
              <p className="text-xs text-secondary-gary">
                {countPermissions(b.permissions ?? [])} permissions
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {(b.roles ?? []).map((role) => (
                <span
                  key={role}
                  title={role}
                  className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                >
                  {humanize(role)}
                </span>
              ))}
            </div>
          </div>
          <ModulePermissionList
            modules={filterModules(b.permissions ?? [], "")}
            emptyMessage="No permissions in this branch."
          />
        </div>
      ))}
    </div>
  );
}
