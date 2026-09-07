"use client";

import { Layers } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { DataTable } from "@/src/components/ui/data-table";
import { MATERIAL_TABS } from "../data/materialTabs";
import { useClientPagination } from "../hooks/useClientPagination";
import { useMaterialTaxonomy } from "../hooks/useMaterialTaxonomy";
import MaterialSubClassModal from "../MaterialSubClassModal";
import { GetMaterialSubClassColumns } from "../TableColumns/MaterialSubClassColumns";
import {
  IMaterialSubClass,
  IMaterialSubClassRow,
  MaterialSubClassFormValues,
} from "../types";

export default function MaterialSubClassTab() {
  const {
    classes,
    subClasses,
    classById,
    addSubClass,
    updateSubClass,
    deleteSubClass,
  } = useMaterialTaxonomy();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<IMaterialSubClass | null>(null);
  const [deleting, setDeleting] = useState<IMaterialSubClassRow | null>(null);

  const rows = useMemo<IMaterialSubClassRow[]>(() => {
    const q = search.trim().toLowerCase();
    return subClasses
      .map((sub) => {
        const parent = classById.get(sub.classId);
        return {
          ...sub,
          materialType: parent?.materialType ?? "—",
          className: parent?.name ?? "—",
        };
      })
      .filter((row) =>
        !q
          ? true
          : [row.materialType, row.className, row.name]
              .join(" ")
              .toLowerCase()
              .includes(q)
      );
  }, [subClasses, classById, search]);

  const {
    pagedItems,
    totalItems,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    resetPage,
  } = useClientPagination(rows);

  const columns = useMemo(
    () =>
      GetMaterialSubClassColumns(
        (item) => {
          setEditing(item);
          setIsModalOpen(true);
        },
        (item) => setDeleting(item)
      ),
    []
  );

  const handleSubmit = (values: MaterialSubClassFormValues) => {
    const duplicate = subClasses.some(
      (s) =>
        s.id !== editing?.id &&
        s.classId === values.classId &&
        s.name.toLowerCase() === values.name.toLowerCase()
    );
    if (duplicate) {
      const parentName = classById.get(values.classId)?.name ?? "this class";
      toast.error(`"${values.name}" already exists under ${parentName}`);
      return;
    }

    if (editing) {
      updateSubClass(editing.id, values);
      toast.success(`Material Sub Class "${values.name}" updated`);
    } else {
      addSubClass(values);
      toast.success(`Material Sub Class "${values.name}" created`);
    }
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteSubClass(deleting.id);
    toast.info(`Material Sub Class "${deleting.name}" deleted`);
    setDeleting(null);
  };

  const hasClasses = classes.length > 0;

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={pagedItems}
        tabs={MATERIAL_TABS}
        title="Material Sub Class"
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
        searchPlaceholder="Search sub classes..."
        isShowStatus={false}
        IsCreate
        createTitle="New Material Sub Class"
        setIsModalOpen={() => {
          if (!hasClasses) {
            toast.error("Create a Material Class first");
            return;
          }
          setEditing(null);
          setIsModalOpen(true);
        }}
      />

      <MaterialSubClassModal
        key={`${isModalOpen}-${editing?.id ?? "create"}`}
        isOpen={isModalOpen}
        initial={editing}
        classes={classes}
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
        description="This action cannot be undone."
      />
    </div>
  );
}
