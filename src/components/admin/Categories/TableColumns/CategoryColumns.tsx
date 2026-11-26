import RowActionsMenu from "@/src/components/shared/RowActionsMenu/RowActionsMenu";
import StatusBadge from "@/src/components/shared/Status/Status";
import { ColumnDef } from "@/src/components/ui/data-table";
import { getClassificationIcon } from "@/src/constants/ecommerce/classificationIcons";
import { StatusType } from "@/src/types/common/common";
import {
  IProductClassification,
  PRODUCT_CLASSIFICATION_LEVEL_LABEL,
  PRODUCT_CLASSIFICATION_PARENT_LEVEL,
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
  const parentLevel = PRODUCT_CLASSIFICATION_PARENT_LEVEL[level];

  return [
    {
      header: "Icon",
      accessorKey: "icon",
      cell: (value) => {
        const icon = getClassificationIcon(value as string | null);
        return icon ? (
          <span
            title={icon.label}
            className="inline-flex size-8 items-center justify-center rounded-md bg-light"
          >
            <icon.Icon className="size-4 text-primary" />
          </span>
        ) : (
          <span className="text-sm text-secondary-gary">
            {(value as string | null) || "—"}
          </span>
        );
      },
    },
    { header: "Name", accessorKey: "name" },
    { header: "Code", accessorKey: "code" },
    ...(parentLevel
      ? [
          {
            header: PRODUCT_CLASSIFICATION_LEVEL_LABEL[parentLevel],
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
