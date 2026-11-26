import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export default function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-10 h-10 rounded-lg bg-light flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-secondary">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
