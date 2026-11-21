import RowActionsMenu from "@/src/components/shared/RowActionsMenu/RowActionsMenu";
import StatusBadge from "@/src/components/shared/Status/Status";
import { ColumnDef } from "@/src/components/ui/data-table";
import { StatusType } from "@/src/types/common/common";
import { IRole } from "@/src/types/role";
import { Eye, KeyRound } from "lucide-react";

export interface RoleRowActions {
  onView?: (item: IRole) => void;
  /** Omit to hide (no ROLE_PERMISSION_MANAGE). */
  onAssignPermissions?: (item: IRole) => void;
}

export const GetRoleColumns = ({
  onView,
  onAssignPermissions,
}: RoleRowActions = {}): ColumnDef<IRole>[] => [
  {
    header: "Name",
    accessorKey: "name",
    cell: (value) => (
      <span className="text-sm font-medium">{(value as string) || "—"}</span>
    ),
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: (value) => (
      <span className="text-sm text-secondary-gary">
        {(value as string | null) || "—"}
      </span>
    ),
  },
  {
    header: "Scope",
    accessorKey: "scope",
    cell: (value) => (
      <span className="text-[11px] font-semibold uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
        {(value as string | null) || "—"}
      </span>
    ),
  },
  {
    header: "Type",
    accessorKey: "isSystem",
    cell: (value) =>
      value ? (
        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          System
        </span>
      ) : (
        <span className="text-xs font-medium text-secondary-gary bg-light px-2 py-0.5 rounded-full">
          Custom
        </span>
      ),
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: (value) => (
      <StatusBadge
        status={value ? StatusType.ACTIVE : StatusType.INACTIVE}
        className="px-2 py-1"
      />
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
          {
            key: "permissions",
            label: "Permissions",
            icon: KeyRound,
            onSelect: () => onAssignPermissions?.(row),
            hidden: !onAssignPermissions,
          },
        ]}
      />
    ),
  },
];
