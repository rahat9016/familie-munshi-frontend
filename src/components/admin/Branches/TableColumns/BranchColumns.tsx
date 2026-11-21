/* eslint-disable @next/next/no-img-element -- logo host is backend-defined */
import RowActionsMenu from "@/src/components/shared/RowActionsMenu/RowActionsMenu";
import StatusBadge from "@/src/components/shared/Status/Status";
import { ColumnDef } from "@/src/components/ui/data-table";
import { StatusType } from "@/src/types/common/common";
import { getBranchLogo, IBranch, isBranchActive } from "@/src/types/branch";
import { Building2, Eye, Pencil } from "lucide-react";

export interface BranchRowActions {
  onView?: (item: IBranch) => void;
  /** Omit to hide (no BRANCH_UPDATE). */
  onEdit?: (item: IBranch) => void;
}

export const GetBranchColumns = ({
  onView,
  onEdit,
}: BranchRowActions = {}): ColumnDef<IBranch>[] => [
  {
    header: "Logo",
    accessorKey: "logo",
    cell: (_value, row) => {
      const logo = getBranchLogo(row);
      return (
        <span className="inline-flex size-9 items-center justify-center overflow-hidden rounded-md bg-light">
          {logo ? (
            <img src={logo} alt="" className="size-full object-contain" />
          ) : (
            <Building2 className="size-4 text-secondary-gary" />
          )}
        </span>
      );
    },
  },
  {
    header: "Name",
    accessorKey: "name",
    cell: (value) => (
      <span className="text-sm font-medium">{(value as string) || "—"}</span>
    ),
  },
  {
    header: "Phone",
    accessorKey: "phone",
    cell: (value) => (
      <span className="text-sm text-secondary-gary">
        {(value as string) || "—"}
      </span>
    ),
  },
  {
    header: "Address",
    accessorKey: "address",
    cell: (value) => (
      <span className="text-sm line-clamp-2">{(value as string) || "—"}</span>
    ),
  },
  {
    header: "Status",
    accessorKey: "isActive",
    cell: (_value, row) => (
      <StatusBadge
        status={isBranchActive(row) ? StatusType.ACTIVE : StatusType.INACTIVE}
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
            key: "edit",
            label: "Edit",
            icon: Pencil,
            onSelect: () => onEdit?.(row),
            hidden: !onEdit,
          },
        ]}
      />
    ),
  },
];
