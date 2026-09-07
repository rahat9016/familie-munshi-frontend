"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoriesTable from "../CategoriesTable";
import { mockSegmentsList } from "../data/mockCategoryHierarchy";
import CreateUpdateSegment, {
  SegmentSubmitValues,
} from "../Form/CreateUpdateSegment";
import { GetSegmentColumns } from "../TableColumns/SegmentColumns";
import { ISegment } from "../types";

export default function SegmentList() {
  const [segments, setSegments] = useState<ISegment[]>(mockSegmentsList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISegment | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    setCurrentPage,
    itemsPerPage,
    currentPage,
    totalItems,
    setTotalItems,
    setItemsPerPage,
  } = usePagination();
  const { search, handleSearchChange, debouncedSearch } =
    useSearchDebounce(300);
  const { sortBy } = useAppSelector((state) => state.filter);

  const filteredSegments = segments.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase().trim());
    const matchesStatus = !sortBy || item.status === sortBy;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setTotalItems(filteredSegments.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSegments.length]);

  const effectivePerPage =
    itemsPerPage === -1 ? filteredSegments.length || 1 : itemsPerPage;
  const pageStart = (currentPage - 1) * effectivePerPage;
  const paginatedSegments =
    itemsPerPage === -1
      ? filteredSegments
      : filteredSegments.slice(pageStart, pageStart + effectivePerPage);

  const handleEdit = (item: ISegment) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setSegments((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: SegmentSubmitValues) => {
    if (selectedItem) {
      setSegments((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...values } : item
        )
      );
      toast.success(`Segment "${values.name}" updated`);
    } else {
      const id = values.name.toLowerCase().trim().replace(/\s+/g, "-");
      setSegments((prev) => [
        ...prev,
        { id, createdAt: new Date().toISOString(), ...values },
      ]);
      toast.success(`Segment "${values.name}" created`);
    }
    handleModalClose();
  };

  const columns = GetSegmentColumns(handleEdit, handleDelete);

  return (
    <div>
      <CategoriesTable
        columns={columns}
        data={paginatedSegments}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        search={search}
        showSearch
        handleSearchChange={handleSearchChange}
        showCreateButton
        createTitle="Create"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateSegment
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Segment"
        description="Are you sure you want to delete this segment? This action cannot be undone."
      />
    </div>
  );
}
