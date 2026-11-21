import { getClassificationIcon } from "@/src/constants/ecommerce/classificationIcons";
import { Button } from "@/src/components/ui/button";
import StatusBadge from "@/src/components/shared/Status/Status";
import { ColumnDef } from "@/src/components/ui/data-table";
import { StatusType } from "@/src/types/common/common";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  IProductClassification,
  PRODUCT_CLASSIFICATION_LEVEL_LABEL,
  PRODUCT_CLASSIFICATION_PARENT_LEVEL,
  ProductClassificationLevel,
} from "@/src/types/ecommerce/productClassification";

export interface ClassificationRowActions {
  onView?: (item: IProductClassification) => void;
  /** Omit to hide the Edit button (no UPDATE permission). */
  onEdit?: (item: IProductClassification) => void;
  /** Omit to hide the Delete button (no DELETE permission). */
  onDelete?: (item: IProductClassification) => void;
}

const actionBtn =
  "w-9! min-h-9 border flex items-center justify-center rounded-lg";

export const getClassificationColumns = (
  level: ProductClassificationLevel,
  { onView, onEdit, onDelete }: ClassificationRowActions = {}
): ColumnDef<IProductClassification>[] => {
  const parentLevel = PRODUCT_CLASSIFICATION_PARENT_LEVEL[level];

  const columns: ColumnDef<IProductClassification>[] = [
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
  ];

  if (parentLevel) {
    columns.push({
      header: PRODUCT_CLASSIFICATION_LEVEL_LABEL[parentLevel],
      accessorKey: "parentName",
      cell: (value) => (
        <span className="text-sm text-secondary-gary">
          {(value as string | null) || "—"}
        </span>
      ),
    });
  }

  columns.push({
    header: "Status",
    accessorKey: "active",
    cell: (value) => (
      <StatusBadge
        status={value ? StatusType.ACTIVE : StatusType.INACTIVE}
        className="px-2 py-1"
      />
    ),
  });

  if (onView || onEdit || onDelete) {
    columns.push({
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => (
        <div className="flex items-center gap-2 w-full">
          {onView && (
            <Button
              type="button"
              size="sm"
              title="View"
              aria-label={`View ${row.name}`}
              className={`${actionBtn} border-[#E6E6E6] bg-light hover:bg-light`}
              onClick={() => onView(row)}
            >
              <Eye className="h-4 w-4 text-secondary-foreground" />
            </Button>
          )}
          {onEdit && (
            <Button
              type="button"
              size="sm"
              title="Edit"
              aria-label={`Edit ${row.name}`}
              className={`${actionBtn} border-[#E6E6E6] bg-light hover:bg-light`}
              onClick={() => onEdit(row)}
            >
              <Pencil className="h-4 w-4 text-secondary-foreground" />
            </Button>
          )}
          {onDelete && row.active && (
            <Button
              type="button"
              size="sm"
              title="Delete"
              aria-label={`Delete ${row.name}`}
              className={`${actionBtn} border-red-200 bg-red-50 hover:bg-red-100`}
              onClick={() => onDelete(row)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          )}
        </div>
      ),
    });
  }

  return columns;
};
