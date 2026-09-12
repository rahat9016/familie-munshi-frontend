import { ReactNode } from "react";
import DynamicBreadcrumb from "./DynamicBreadcrumb";

interface TableHeaderProps {
  /** A node rather than a string so detail pages can make the title editable. */
  title?: ReactNode;
  icon?: ReactNode;
  /** Label for the last breadcrumb segment — see DynamicBreadcrumb. */
  currentLabel?: string;
  /** Rendered on the right of the bar, e.g. a status badge. */
  action?: ReactNode;
}

export default function TableTopBarHeader({
  title,
  icon,
  currentLabel,
  action,
}: TableHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row w-full lg:items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center size-11 rounded-lg bg-primary/10 text-primary shrink-0 [&>svg]:size-5">
            {icon}
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-xl md:text-2xl text-secondary-dark font-bold tracking-tight">
            {title}
          </h1>
          <DynamicBreadcrumb currentLabel={currentLabel} />
        </div>
      </div>

      {action}
    </div>
  );
}
