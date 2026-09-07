"use client";

import { Layers } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { DataTable } from "@/src/components/ui/data-table";
import { MATERIAL_TABS } from "../data/materialTabs";
import { useClientPagination } from "../hooks/useClientPagination";
import { useMaterialTaxonomy } from "../hooks/useMaterialTaxonomy";
import MaterialClassModal from "../MaterialClassModal";
import { GetMaterialClassColumns } from "../TableColumns/MaterialClassColumns";
import { IMaterialClass, MaterialClassFormValues } from "../types";

export default function MaterialClassTab() {
  const {
    classes,
    countSubClasses,
    addClass,
    updateClass,
    deleteClass,
  } = useMaterialTaxonomy();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<IMaterialClass | null>(null);
  const [deleting, setDeleting] = useState<IMaterialClass | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((c) =>
      [c.materialType, c.name].join(" ").toLowerCase().includes(q)
    );
  }, [classes, search]);

  const {
    pagedItems,
    totalItems,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    resetPage,
  } = useClientPagination(filtered);

  const columns = useMemo(
    () =>
      GetMaterialClassColumns(
        countSubClasses,
        (item) => {
          setEditing(item);
          setIsModalOpen(true);
        },
        (item) => setDeleting(item)
      ),
    [countSubClasses]
  );

  const handleSubmit = (values: MaterialClassFormValues) => {
    const duplicate = classes.some(
      (c) =>
        c.id !== editing?.id &&
        c.materialType === values.materialType &&
        c.name.toLowerCase() === values.name.toLowerCase()
    );
    if (duplicate) {
      toast.error(
        `"${values.name}" already exists under ${values.materialType}`
      );
      return;
    }

    if (editing) {
      updateClass(editing.id, values);
      toast.success(`Material Class "${values.name}" updated`);
    } else {
      addClass(values);
      toast.success(`Material Class "${values.name}" created`);
    }
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteClass(deleting.id);
    toast.info(`Material Class "${deleting.name}" deleted`);
    setDeleting(null);
  };

  const deletingSubCount = deleting ? countSubClasses(deleting.id) : 0;

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={pagedItems}
        tabs={MATERIAL_TABS}
        title="Material Class"
        icon={<Layers />}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        searchValue={search}
        onSearchChange={(e) => {
          setSearch(e.target.value);
          resetPage();
        }}
        searchPlaceholder="Search classes..."
        isShowStatus={false}
        IsCreate
        createTitle="New Material Class"
        setIsModalOpen={() => {
          setEditing(null);
          setIsModalOpen(true);
        }}
      />

      <MaterialClassModal
        key={`${isModalOpen}-${editing?.id ?? "create"}`}
        isOpen={isModalOpen}
        initial={editing}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleting?.name ?? ""}"?`}
        description={
          deletingSubCount > 0
            ? `This class has ${deletingSubCount} sub class(es). Deleting it removes them too.`
            : "This action cannot be undone."
        }
      />
    </div>
  );
}
