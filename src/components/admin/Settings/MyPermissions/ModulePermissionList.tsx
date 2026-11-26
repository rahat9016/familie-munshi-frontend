import { Check } from "lucide-react";
import { ModulePermissionListProps } from "./types";
import { humanize } from "./utils/myPermissionsData";

/** Module cards, each listing the permissions held in it. */
export default function ModulePermissionList({
  modules,
  emptyMessage = "No permissions.",
}: ModulePermissionListProps) {
  if (!modules.length) {
    return (
      <p className="py-8 text-center text-sm text-secondary-gary">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
      {modules.map((m) => (
        <div
          key={m.module}
          className="rounded-md border border-light-dark overflow-hidden"
        >
          <div className="flex items-center justify-between gap-2 bg-light px-3 py-2">
            <h3 className="text-sm font-semibold text-secondary-dark truncate">
              {humanize(m.module)}
            </h3>
            <span className="shrink-0 rounded bg-white px-1.5 py-0.5 text-[11px] font-medium text-secondary-gary border border-light-dark">
              {m.permissions.length}
            </span>
          </div>
          <ul className="divide-y divide-light-dark">
            {m.permissions.map((p) => (
              <li key={p.id ?? p.name} className="flex gap-2 px-3 py-2">
                <Check className="mt-0.5 w-3.5 h-3.5 shrink-0 text-emerald-500" />
                <div className="min-w-0">
                  <p className="font-mono text-xs text-secondary-dark break-all">
                    {p.name}
                  </p>
                  {p.description && (
                    <p className="text-xs text-secondary-gary mt-0.5">
                      {p.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
