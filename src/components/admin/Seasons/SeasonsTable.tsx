"use client";

import { DataTable } from "@/src/components/ui/data-table";
import { ITableProps } from "@/src/types/common/common";
import { CalendarRange } from "lucide-react";
import { SEASON_STATUS_FILTER_OPTIONS } from "./utils/seasonFormData";

const SeasonsTable = <T,>({
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
      icon={<CalendarRange />}
      title="Seasons"
      showSearch={showSearch}
      searchValue={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search season..."
      isShowStatus
      statusOptions={SEASON_STATUS_FILTER_OPTIONS}
      createTitle={createTitle}
      IsCreate={showCreateButton}
      setIsModalOpen={setIsModalOpen}
    />
  );
};

export default SeasonsTable;
