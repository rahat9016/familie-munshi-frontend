/* eslint-disable @next/next/no-img-element -- logo host is backend-defined */
import RowActionsMenu from "@/src/components/shared/RowActionsMenu/RowActionsMenu";
import StatusBadge from "@/src/components/shared/Status/Status";
import { ColumnDef } from "@/src/components/ui/data-table";
import { getBrandLogo, IBrand, isBrandActive } from "@/src/types/brand";
import { StatusType } from "@/src/types/common/common";
import { Eye, Pencil, Tag, Trash2 } from "lucide-react";

export interface BrandRowActions {
  /** Omit to hide (no BRAND_VIEW). */
  onView?: (item: IBrand) => void;
  /** Omit to hide (no BRAND_UPDATE). */
  onEdit?: (item: IBrand) => void;
  /** Omit to hide (no BRAND_DELETE). */
  onDelete?: (item: IBrand) => void;
}

export const GetBrandColumns = ({
  onView,
  onEdit,
  onDelete,
}: BrandRowActions = {}): ColumnDef<IBrand>[] => [
  {
    header: "Logo",
    accessorKey: "logoUrl",
    cell: (_value, row) => {
      const logo = getBrandLogo(row);
      return (
        <span className="inline-flex size-10 items-center justify-center overflow-hidden rounded-md border border-light-dark bg-white">
          {logo ? (
            <img src={logo} alt="" className="size-full object-contain" />
          ) : (
            <Tag className="size-4 text-secondary-gary" />
          )}
        </span>
      );
    },
  },
  {
    header: "Title",
    accessorKey: "title",
    cell: (value) => (
      <span className="text-sm font-medium">{(value as string) || "—"}</span>
    ),
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: (value) => (
      <span className="text-sm text-secondary-gary line-clamp-2 max-w-md">
        {(value as string) || "—"}
      </span>
    ),
  },
  {
    header: "Position",
    accessorKey: "position",
    cell: (value) => (
      <span className="text-sm text-secondary-gary">
        {(value as number | null) ?? "—"}
      </span>
    ),
  },
  {
    header: "Status",
    accessorKey: "active",
    cell: (_value, row) => (
      <StatusBadge
        status={isBrandActive(row) ? StatusType.ACTIVE : StatusType.INACTIVE}
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
        label={`Actions for ${row.title}`}
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
          {
            key: "delete",
            label: "Delete",
            icon: Trash2,
            variant: "danger",
            onSelect: () => onDelete?.(row),
            hidden: !onDelete,
          },
        ]}
      />
    ),
  },
];
