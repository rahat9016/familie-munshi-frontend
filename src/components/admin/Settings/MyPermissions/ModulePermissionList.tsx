import { Check } from "lucide-react";
import { ModulePermissionListProps } from "./types";
import { getModuleIcon } from "./utils/moduleIcons";
import { getActionKey, humanize } from "./utils/myPermissionsData";

/**
 * One card per module. CSS columns (masonry) so short modules don't leave
 * empty space next to long ones.
 */
export default function ModulePermissionList({
  modules,
  emptyMessage = "No permissions.",
}: ModulePermissionListProps) {
  if (!modules.length) {
    return (
      <p className="py-10 text-center text-sm text-secondary-gary">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="columns-1 md:columns-2 2xl:columns-3 gap-3">
      {modules.map((m) => {
        const Icon = getModuleIcon(m.module);
        const count = m.permissions.length;

        return (
          <div
            key={m.module}
            className="mb-3 break-inside-avoid rounded-lg border border-light-dark bg-white"
          >
            <div className="flex items-center gap-3 border-b border-light-dark px-4 py-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4.5" />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-semibold leading-tight text-secondary-dark">
                  {humanize(m.module)}
                </h3>
                <p className="mt-0.5 text-xs text-secondary-gary">
                  {count} {count === 1 ? "permission" : "permissions"}
                </p>
              </div>
            </div>

            <ul className="py-1.5">
              {m.permissions.map((p) => {
                const action = getActionKey(m.module, p.name);
                return (
                  <li
                    key={p.id ?? p.name}
                    className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-light/70"
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span className="min-w-0 flex-1 text-sm text-secondary-dark">
                      {p.description || humanize(action)}
                    </span>
                    <span
                      title={p.name}
                      className="shrink-0 rounded-md bg-light px-2 py-0.5 text-[11px] font-medium text-secondary-gary"
                    >
                      {humanize(action)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
