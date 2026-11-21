import { ReactNode } from "react";

/** One label/value row in a view modal `<dl>`. */
export default function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 py-3 border-b last:border-b-0">
      <dt className="text-sm text-secondary-gary">{label}</dt>
      <dd className="col-span-2 text-sm text-secondary font-medium wrap-break-word">
        {children}
      </dd>
    </div>
  );
}
