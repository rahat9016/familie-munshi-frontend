import RowActionsMenu from "@/src/components/shared/RowActionsMenu/RowActionsMenu";
import { ColumnDef } from "@/src/components/ui/data-table";
import { IPermission } from "@/src/types/permission";
import { Eye } from "lucide-react";
import { formatModule } from "../utils/permissionData";

export interface PermissionRowActions {
  onView?: (item: IPermission) => void;
}

export const GetPermissionColumns = ({
  onView,
}: PermissionRowActions = {}): ColumnDef<IPermission>[] => [
  {
    header: "Code",
    accessorKey: "name",
    cell: (value) => (
      <span className="font-mono text-xs font-medium text-secondary">
        {value as string}
      </span>
    ),
  },
  {
    header: "Module",
    accessorKey: "module",
    cell: (value) => (
      <span className="text-[11px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
        {formatModule(value as string)}
      </span>
    ),
  },
  {
    header: "Description",
    accessorKey: "description",
    wrap: true,
    cell: (value) => (
      <span className="text-sm text-secondary-gary">
        {(value as string | null) || "—"}
      </span>
    ),
  },
  {
    header: "Action",
    accessorKey: "actions",
    align: "right",
    cell: (_value, row) => (
      <RowActionsMenu
        label={`Actions for ${row.name}`}
        actions={[
          {
            key: "view",
            label: "View",
            icon: Eye,
            onSelect: () => onView?.(row),
            hidden: !onView,
          },
        ]}
      />
    ),
  },
];
