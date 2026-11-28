import RowActionsMenu from "@/src/components/shared/RowActionsMenu/RowActionsMenu";
import { ColumnDef } from "@/src/components/ui/data-table";
import { ISeason, SeasonStatus } from "@/src/types/season";
import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { seasonRoute } from "../utils/seasonFormData";

export interface SeasonRowActions {
  /** Opens the season's departments. */
  onOpen?: (item: ISeason) => void;
  /** Omit to hide (no SEASON_UPDATE). */
  onEdit?: (item: ISeason) => void;
  /** Omit to hide (no SEASON_DELETE). */
  onDelete?: (item: ISeason) => void;
}

const STATUS_CLASS: Record<SeasonStatus, string> = {
  Completed: "bg-emerald-100 text-emerald-800",
  "On Process": "bg-amber-100 text-amber-800",
  "On Concept": "bg-blue-100 text-blue-800",
  "On Planning": "bg-purple-100 text-purple-800",
};

export const GetSeasonColumns = ({
  onOpen,
  onEdit,
  onDelete,
}: SeasonRowActions = {}): ColumnDef<ISeason>[] => [
  {
    header: "Season",
    accessorKey: "season",
    cell: (_value, row) => (
      <Link
        href={seasonRoute(row.id)}
        className="text-blue-700 hover:underline font-medium"
      >
        {row.season}
      </Link>
    ),
  },
  {
    header: "Number of Styles",
    accessorKey: "numberOfStyles",
    align: "center",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (_value, row) => (
      <span
        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded ${
          STATUS_CLASS[row.status] ?? "bg-slate-100 text-slate-700"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    header: "Action",
    accessorKey: "id",
    align: "right",
    cell: (_value, row) => (
      <RowActionsMenu
        label={`Actions for ${row.season}`}
        actions={[
          {
            key: "open",
            label: "Open",
            icon: FolderOpen,
            onSelect: () => onOpen?.(row),
            hidden: !onOpen,
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
