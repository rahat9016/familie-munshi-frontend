import { cn } from "@/src/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

/** Card shell shared by every settings tab. */
export default function SettingsSection({
  title,
  description,
  icon: Icon,
  action,
  className,
  children,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  /** Optional control on the right of the header (e.g. a search box). */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "bg-white rounded-lg border border-light-dark p-4 sm:p-5",
        className
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-md bg-light flex items-center justify-center shrink-0">
            <Icon className="w-4.5 h-4.5 text-secondary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-secondary">{title}</h2>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
