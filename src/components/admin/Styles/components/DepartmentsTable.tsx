"use client";

import { ColumnDef, DataTable } from "@/src/components/ui/data-table";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { IDepartmentItem, mockDepartmentsList } from "../data/mockStyleData";
import CreateUpdateDepartment from "../Form/CreateUpdateDepartment";
import { DepartmentFormValues } from "../Schema/departmentSchema";

interface DepartmentsTableProps {
  seasonId: string;
}

export default function DepartmentsTable({ seasonId }: DepartmentsTableProps) {
  const [departments, setDepartments] =
    useState<IDepartmentItem[]>(mockDepartmentsList);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (values: DepartmentFormValues) => {
    const id = values.department.toLowerCase().trim().replace(/\s+/g, "-");
    setDepartments((prev) => [
      ...prev,
      {
        id,
        department: values.department,
        numberOfStyles: 0,
        numberOfColorways: 0,
        categories: [],
      },
    ]);
    toast.success(`Department "${values.department}" added`);
    handleModalClose();
  };

  const columns: ColumnDef<IDepartmentItem>[] = [
    {
      header: "Department",
      accessorKey: "department",
      cell: (value, row) => (
        <Link
          href={`/admin/styles/${seasonId}/${row.id}`}
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
      header: "Categories",
      accessorKey: "categories",
      wrap: true,
      cell: (value) => (
        <span className="text-xs leading-relaxed text-secondary-gary">
          {(value as string[]).join(", ")}
        </span>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={departments}
        title="Departments"
        icon={<LayoutGrid />}
        totalItems={departments.length}
        itemsPerPage={departments.length || 10}
        currentPage={1}
        showSearch={false}
        isShowStatus={false}
        IsCreate
        createTitle="Add Department"
        setIsModalOpen={() => setIsModalOpen(true)}
      />

      <CreateUpdateDepartment
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
      />
    </>
  );
}
