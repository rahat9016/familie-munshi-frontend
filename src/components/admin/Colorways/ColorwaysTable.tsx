"use client";

import { DataTable } from "@/src/components/ui/data-table";
import { ITableProps } from "@/src/types/common/common";
import { Palette } from "lucide-react";
import { COLORWAY_STATUS_OPTIONS } from "./utils/colorwayFormData";

const ColorwaysTable = <T,>({
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
      icon={<Palette />}
      title="Color Way"
      showSearch={showSearch}
      searchValue={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search code, name, marketing name..."
      isShowStatus
      statusOptions={COLORWAY_STATUS_OPTIONS}
      createTitle={createTitle}
      IsCreate={showCreateButton}
      setIsModalOpen={setIsModalOpen}
    />
  );
};

export default ColorwaysTable;
