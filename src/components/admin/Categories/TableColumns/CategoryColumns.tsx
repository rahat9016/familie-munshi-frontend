import RowActionsMenu from "@/src/components/shared/RowActionsMenu/RowActionsMenu";
import StatusBadge from "@/src/components/shared/Status/Status";
import { ColumnDef } from "@/src/components/ui/data-table";
import ClassificationIcon, {
  hasClassificationIcon,
} from "@/src/components/shared/ClassificationIcon/ClassificationIcon";
import { StatusType } from "@/src/types/common/common";
import {
  getParentLevelLabel,
  IProductClassification,
  ProductClassificationLevel,
} from "@/src/types/productClassification";
import { Eye, Pencil, Trash2 } from "lucide-react";

export interface CategoryRowActions {
  onView?: (item: IProductClassification) => void;
  /** Omit to hide (no PRODUCT_CLASSIFICATION_UPDATE). */
  onEdit?: (item: IProductClassification) => void;
  /** Omit to hide (no PRODUCT_CLASSIFICATION_DELETE). */
  onDelete?: (item: IProductClassification) => void;
}

export const GetCategoryColumns = (
  level: ProductClassificationLevel,
  { onView, onEdit, onDelete }: CategoryRowActions = {}
): ColumnDef<IProductClassification>[] => {
  const parentLabel = getParentLevelLabel(level);

  return [
    {
      header: "Icon",
      accessorKey: "icon",
      cell: (_value, row) =>
        hasClassificationIcon(row) ? (
          <span className="inline-flex size-8 items-center justify-center rounded-md bg-light">
            <ClassificationIcon
              source={row}
              name={row.name}
              size={16}
              className="text-primary"
            />
          </span>
        ) : (
          <span className="text-sm text-secondary-gary">—</span>
        ),
    },
    { header: "Name", accessorKey: "name" },
    {
      header: "Description",
      accessorKey: "description",
      cell: (value) => (
        <span
          title={(value as string | null) ?? undefined}
          className="block max-w-60 truncate text-sm text-secondary-gary"
        >
          {(value as string | null) || "—"}
        </span>
      ),
    },
    { header: "Code", accessorKey: "code" },
    ...(parentLabel
      ? [
          {
            header: parentLabel,
            accessorKey: "parentName",
            cell: (value) => (
              <span className="text-sm text-secondary-gary">
                {(value as string | null) || "—"}
              </span>
            ),
          } satisfies ColumnDef<IProductClassification>,
        ]
      : []),
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
              // Soft-deleted rows are already inactive.
              hidden: !onDelete || !row.active,
            },
          ]}
        />
      ),
    },
  ];
};
