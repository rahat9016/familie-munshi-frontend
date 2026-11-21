"use client";

import { DataTable } from "@/src/components/ui/data-table";
import { ITableProps } from "@/src/types/common/common";
import { Building2 } from "lucide-react";

const BranchesTable = <T,>({
  columns,
  data,
  isLoading = false,
  totalItems = 0,
  currentPage = 1,
  itemsPerPage = 10,
  setCurrentPage,
  setItemsPerPage,
  search = "",
  showSearch,
  handleSearchChange,
  setIsModalOpen,
  showCreateButton = false,
  createTitle,
}: ITableProps<T>) => {
  return (
    <DataTable
      columns={columns}
      data={Array.isArray(data) ? data : []}
      isLoading={isLoading}
      totalItems={totalItems}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      setItemsPerPage={setItemsPerPage}
      icon={<Building2 />}
      title="Branches"
      showSearch={showSearch}
      searchValue={search}
      onSearchChange={handleSearchChange}
      createTitle={createTitle}
      IsCreate={showCreateButton}
      setIsModalOpen={setIsModalOpen}
    />
  );
};

export default BranchesTable;
