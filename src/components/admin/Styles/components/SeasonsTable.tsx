"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { DataTable } from "@/src/components/ui/data-table";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { CalendarRange } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { ISeasonItem, mockSeasonsList } from "../data/mockStyleData";
import CreateUpdateSeason from "../Form/CreateUpdateSeason";
import { seasonStatusOptions, SeasonFormValues } from "../Schema/seasonSchema";
import { GetSeasonColumns } from "../TableColumns/SeasonColumns";

const seasonStatusFilterOptions = [
  { label: "All Status", value: "all" },
  ...seasonStatusOptions,
];

export default function SeasonsTable() {
  const [seasons, setSeasons] = useState<ISeasonItem[]>(mockSeasonsList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISeasonItem | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { sortBy } = useAppSelector((state) => state.filter);

  const handleEdit = (item: ISeasonItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setSeasons((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: SeasonFormValues) => {
    if (selectedItem) {
      setSeasons((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...values } : item
        )
      );
      toast.success(`Season "${values.season}" updated`);
    } else {
      const id = values.season
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
      setSeasons((prev) => [
        ...prev,
        { id, season: values.season, numberOfStyles: 0, status: values.status },
      ]);
      toast.success(`Season "${values.season}" created`);
    }
    handleModalClose();
  };

  const columns = GetSeasonColumns(handleEdit, handleDelete);

  const filteredSeasons = seasons.filter((item) => {
    const matchesSearch = item.season
      .toLowerCase()
      .includes(search.toLowerCase().trim());
    const matchesStatus = !sortBy || item.status === sortBy;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={filteredSeasons}
        title="Seasons"
        icon={<CalendarRange />}
        totalItems={filteredSeasons.length}
        itemsPerPage={filteredSeasons.length || 10}
        currentPage={1}
        showSearch
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search season..."
        isShowStatus
        statusOptions={seasonStatusFilterOptions}
        IsCreate
        createTitle="Add Season"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />

      <CreateUpdateSeason
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Season"
        description="Are you sure you want to delete this season? This action cannot be undone."
      />
    </div>
  );
}
