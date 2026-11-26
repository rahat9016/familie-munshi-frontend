import { Skeleton } from "@/src/components/ui/skeleton";
import { ShieldCheck } from "lucide-react";
import { AccessSummaryProps } from "./types";
import { countPermissions } from "./utils/myPermissionsData";

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-light-dark bg-white px-4 py-3 min-w-0">
      <p className="text-xs text-secondary-gary">{label}</p>
      <div className="mt-1 text-sm font-semibold text-secondary-dark truncate">
        {value}
      </div>
    </div>
  );
}

/** Role / scope / branch / totals at a glance. */
export default function AccessSummary({
  access,
  isSuperAdmin,
  isLoading = false,
}: AccessSummaryProps) {
  if (isLoading || !access) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-17 w-full" />
        ))}
      </div>
    );
  }

  const modules = access.permissions ?? [];
  const branch = [access.branchName, access.branchCode]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-3">
      {isSuperAdmin && (
        <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          You are a super admin — you have full access to every module.
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          label={access.roles?.length > 1 ? "Roles" : "Role"}
          value={access.roles?.join(", ") || "—"}
        />
        <Stat label="Scope" value={access.scope || "—"} />
        <Stat label="Branch" value={branch || "All branches"} />
        <Stat
          label="Permissions"
          value={`${countPermissions(modules)} in ${modules.length} modules`}
        />
      </div>
    </div>
  );
}
