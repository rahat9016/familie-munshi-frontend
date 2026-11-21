/* eslint-disable @next/next/no-img-element -- picture host is backend-defined */
import RowActionsMenu from "@/src/components/shared/RowActionsMenu/RowActionsMenu";
import StatusBadge from "@/src/components/shared/Status/Status";
import { ColumnDef } from "@/src/components/ui/data-table";
import { StatusType } from "@/src/types/common/common";
import { getUserFullName, isUserActive, IUser } from "@/src/types/user";
import { Eye, UserCog } from "lucide-react";

export interface UserRowActions {
  onView?: (item: IUser) => void;
  /** Omit to hide (no USER_ROLE_ASSIGN / USER_ROLE_REMOVE). */
  onManageRoles?: (item: IUser) => void;
}

const initials = (u: IUser) =>
  `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase() || "?";

export const GetUserColumns = ({
  onView,
  onManageRoles,
}: UserRowActions = {}): ColumnDef<IUser>[] => [
  {
    header: "Name",
    accessorKey: "firstName",
    cell: (_value, row) => (
      <div className="flex items-center gap-3">
        <span className="inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {row.profilePicture ? (
            <img
              src={row.profilePicture}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            initials(row)
          )}
        </span>
        <span className="text-sm font-medium truncate">
          {getUserFullName(row)}
        </span>
      </div>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
    cell: (value) => (
      <span className="text-sm text-secondary-gary">
        {(value as string) || "—"}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "active",
    cell: (_value, row) => (
      <StatusBadge
        status={isUserActive(row) ? StatusType.ACTIVE : StatusType.INACTIVE}
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
        label={`Actions for ${getUserFullName(row)}`}
        actions={[
          {
            key: "view",
            label: "View",
            icon: Eye,
            onSelect: () => onView?.(row),
            hidden: !onView,
          },
          {
            key: "roles",
            label: "Roles",
            icon: UserCog,
            onSelect: () => onManageRoles?.(row),
            hidden: !onManageRoles,
          },
        ]}
      />
    ),
  },
];
