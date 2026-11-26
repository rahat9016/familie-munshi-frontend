import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Building2,
  Globe2,
  KeyRound,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { AccessSummaryProps } from "./types";
import { countPermissions, humanize } from "./utils/myPermissionsData";

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  title,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  /** Raw value on hover (e.g. the role code). */
  title?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-light-dark bg-white px-4 py-3.5 min-w-0">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-secondary-gary">{label}</p>
        <p
          title={title}
          className="truncate text-base font-semibold leading-snug text-secondary-dark"
        >
          {value}
        </p>
        {hint && <div className="mt-0.5">{hint}</div>}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-19 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const roles = access.roles ?? [];
  const modules = access.permissions ?? [];
  const total = countPermissions(modules);
  const branch = [access.branchName, access.branchCode]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <Stat
        icon={ShieldCheck}
        label={roles.length > 1 ? "Roles" : "Role"}
        value={roles.map(humanize).join(", ") || "—"}
        title={roles.join(", ")}
        hint={
          isSuperAdmin && (
            <span className="inline-flex rounded-md bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
              Full access to every module
            </span>
          )
        }
      />
      <Stat
        icon={Globe2}
        label="Scope"
        value={access.scope ? humanize(access.scope) : "—"}
      />
      <Stat icon={Building2} label="Branch" value={branch || "All branches"} />
      <Stat
        icon={KeyRound}
        label="Permissions"
        value={total}
        hint={
          <span className="text-xs text-secondary-gary">
            across {modules.length}{" "}
            {modules.length === 1 ? "module" : "modules"}
          </span>
        }
      />
    </div>
  );
}
