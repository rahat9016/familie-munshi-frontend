"use client";

import { ColumnDef, DataTable } from "@/src/components/ui/data-table";
import { Shapes } from "lucide-react";
import Link from "next/link";
import { ICategoryStyleItem, mockCategoryStylesList } from "../data/mockStyleData";

interface StyleCategoriesTableProps {
  seasonId: string;
  departmentId: string;
}

export default function StyleCategoriesTable({
  seasonId,
  departmentId,
}: StyleCategoriesTableProps) {
  const columns: ColumnDef<ICategoryStyleItem>[] = [
    {
      header: "Category",
      accessorKey: "category",
      cell: (value, row) => (
        <Link
          href={`/admin/product-development/${seasonId}/${departmentId}/${row.id}`}
          className="font-semibold text-primary hover:underline"
        >
          {value as string}
        </Link>
      ),
    },
    {
      header: "Number of Styles",
      accessorKey: "numberOfStyles",
      align: "center",
      cell: (value) => (
        <span className="font-semibold text-secondary-dark">
          {value as number}
        </span>
      ),
    },
    {
      header: "Number of Colorways",
      accessorKey: "numberOfColorways",
      align: "center",
      cell: (value) => (
        <span className="font-semibold text-secondary-dark">
          {value as number}
        </span>
      ),
    },
    {
      header: "Season",
      accessorKey: "season",
    },
    {
      header: "Department",
      accessorKey: "department",
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={mockCategoryStylesList}
      title="Categories"
      icon={<Shapes />}
      totalItems={mockCategoryStylesList.length}
      itemsPerPage={mockCategoryStylesList.length || 10}
      currentPage={1}
      showSearch={false}
      isShowStatus={false}
    />
  );
}
