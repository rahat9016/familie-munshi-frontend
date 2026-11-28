import { Button } from "@/src/components/ui/button";
import { ColumnDef } from "@/src/components/ui/data-table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { ISeasonItem } from "../data/mockStyleData";

export const GetSeasonColumns = (
  onEdit?: (item: ISeasonItem) => void,
  onDelete?: (id: string) => void
): ColumnDef<ISeasonItem>[] => {
  return [
    {
      header: "Season",
      accessorKey: "season",
      cell: (value, row) => {
        const isAll = row.id === "all";
        return isAll ? (
          <span className="font-medium">{value as string}</span>
        ) : (
          <Link
            href={`/admin/product-development/${row.id}`}
            className="text-blue-700 hover:underline font-medium"
          >
            {value as string}
          </Link>
        );
      },
    },
    {
      header: "Number of Styles",
      accessorKey: "numberOfStyles",
      align: "center",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (value) => {
        const status = value as ISeasonItem["status"];
        return (
          <span
            className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded ${
              status === "Completed"
                ? "bg-emerald-100 text-emerald-800"
                : status === "On Process"
                ? "bg-amber-100 text-amber-800"
                : status === "On Concept"
                ? "bg-blue-100 text-blue-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Action",
      accessorKey: "actions",
      cell: (_value, row) => {
        if (row.id === "all") return null;
        return (
          <div className="flex items-center gap-2">
            <Button
              className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-light"
              size="sm"
              onClick={() => onEdit?.(row)}
            >
              <Pencil className="h-4 w-4 text-secondary-foreground" />
            </Button>
            <Button
              className="w-9! min-h-9 border border-red-200 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100"
              size="sm"
              onClick={() => onDelete?.(row.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        );
      },
    },
  ];
};
