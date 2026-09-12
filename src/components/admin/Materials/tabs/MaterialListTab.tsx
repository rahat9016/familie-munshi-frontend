"use client";

import { Layers } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { DataTable, DataTableGroup } from "@/src/components/ui/data-table";
import { prepareGalleryImage } from "@/src/utils/galleryImage";
import { MATERIAL_TYPES } from "../data/materialHierarchy";
import { MATERIAL_STATUSES, YARN_COUNT_UNITS } from "../data/materialOptions";
import { MATERIAL_TABS } from "../data/materialTabs";
import { useMaterials } from "../hooks/useMaterials";

import { useMaterialTaxonomy } from "../hooks/useMaterialTaxonomy";
import MaterialModal from "../MaterialModal";
import {
  GetMaterialColumns,
  MaterialFilterableField,
} from "../TableColumns/MaterialColumns";
import {
  IMaterial,
  MaterialFlag,
  MaterialFormValues,
  MaterialTextField,
} from "../types";

const SEARCH_FIELDS: (keyof IMaterial)[] = [
  "code",
  "material",
  "materialDescription",
  "materialType",
  "materialClass",
  "materialSubClass",
  "defaultSupplierRefCode",
  "textComposition",
  "structure",
  "productSuppliers",
];

export default function MaterialListTab() {
  const {
    materials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    replacePrimaryImage,
    getNextCode,
  } = useMaterials();
  const { classes, subClasses, getClassOptions, getSubClassOptions } =
    useMaterialTaxonomy();

  // The material form selects names, not ids — map taxonomy rows down to names.
  const classNameOptions = useCallback(
    (materialType: string) => getClassOptions(materialType).map((c) => c.name),
    [getClassOptions]
  );
  const subClassNameOptions = useCallback(
    (materialType: string, materialClass: string) =>
      getSubClassOptions(materialType, materialClass).map((s) => s.name),
    [getSubClassOptions]
  );

  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<
    Partial<Record<MaterialFilterableField, string[]>>
  >({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<IMaterial | null>(null);

  // Type / Class / Sub Class and the status enums drive their own filters, so
  // every defined value stays selectable even when no row uses it yet.
  const filterOptions = useMemo<
    Partial<Record<MaterialFilterableField, string[]>>
  >(() => {
    const unique = (field: keyof IMaterial) =>
      Array.from(
        new Set(materials.map((m) => String(m[field])).filter(Boolean))
      ).sort();
    return {
      code: unique("code"),
      material: unique("material"),
      materialDescription: unique("materialDescription"),
      defaultSupplierRefCode: unique("defaultSupplierRefCode"),
      textComposition: unique("textComposition"),
      materialType: [...MATERIAL_TYPES],
      materialClass: Array.from(new Set(classes.map((c) => c.name))).sort(),
      materialSubClass: Array.from(
        new Set(subClasses.map((s) => s.name))
      ).sort(),
      structure: unique("structure"),
      productSuppliers: unique("productSuppliers"),
      weight: unique("weight"),
      yarnCount: unique("yarnCount"),
      yarnCountUnit: [...YARN_COUNT_UNITS],
      materialStatus: [...MATERIAL_STATUSES],
      okForColorSpecification: ["true", "false"],
      isActive: ["true", "false"],
      isSustainable: ["true", "false"],
      createdBy: unique("createdBy"),
    };
  }, [materials, classes, subClasses]);

  const handleColumnFilterChange = (
    field: MaterialFilterableField,
    value: string[]
  ) => {
    setColumnFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredMaterials = useMemo(() => {
    const q = search.trim().toLowerCase();
    return materials.filter((m) => {
      const matchesSearch =
        !q ||
        SEARCH_FIELDS.map((field) => m[field])
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesColumns = (
        Object.keys(columnFilters) as MaterialFilterableField[]
      ).every((field) => {
        const selected = columnFilters[field];
        return (
          !selected ||
          selected.length === 0 ||
          selected.includes(String(m[field]))
        );
      });
      return matchesSearch && matchesColumns;
    });
  }, [materials, search, columnFilters]);

  // Group strictly by the Material Type enum — every type always shows, even
  // with 0 rows, so a newly created material always has a visible home.
  const groups = useMemo<DataTableGroup<IMaterial>[]>(
    () =>
      MATERIAL_TYPES.map((type) => ({
        key: type,
        label: type,
        items: filteredMaterials.filter((m) => m.materialType === type),
      })),
    [filteredMaterials]
  );

  // Editing a level of the hierarchy invalidates everything below it.
  const handleTextChange = (
    id: string,
    field: MaterialTextField,
    value: string
  ) => {
    const patch: Partial<IMaterial> = { [field]: value };
    if (field === "materialType") {
      patch.materialClass = "";
      patch.materialSubClass = "";
    }
    if (field === "materialClass") patch.materialSubClass = "";
    updateMaterial(id, patch);
  };

  const columns = useMemo(
    () =>
      GetMaterialColumns({
        onEdit: (item) => {
          setEditing(item);
          setIsModalOpen(true);
        },
        onDelete: (item) => {
          deleteMaterial(item.id);
          toast.info(`Material "${item.material}" deleted`);
        },
        onTextChange: handleTextChange,
        onFlagToggle: (id: string, field: MaterialFlag, value: boolean) =>
          updateMaterial(id, { [field]: value }),
        // Keeps the gallery in sync — the cell edits the primary image only.
        onImageUpload: async (id: string, file: File) => {
          try {
            replacePrimaryImage(id, await prepareGalleryImage(file));
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Could not upload the image"
            );
          }
        },
        getClassOptions: classNameOptions,
        getSubClassOptions: subClassNameOptions,
        filterOptions,
        columnFilters,
        onColumnFilterChange: handleColumnFilterChange,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      classNameOptions,
      subClassNameOptions,
      filterOptions,
      columnFilters,
      deleteMaterial,
      updateMaterial,
      replacePrimaryImage,
    ]
  );

  const handleSubmit = (values: MaterialFormValues) => {
    if (editing) {
      updateMaterial(editing.id, values);
      toast.success(`Material "${values.material}" updated`);
    } else {
      addMaterial(values);
      toast.success(`Material "${values.material}" created`);
    }
    setIsModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        groups={groups}
        groupEmptyMessage="No materials yet under this type."
        tabs={MATERIAL_TABS}
        title="Material Management"
        icon={<Layers />}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search materials..."
        showColumnFilters
        isShowStatus={false}
        IsCreate
        createTitle="New Material"
        setIsModalOpen={() => {
          setEditing(null);
          setIsModalOpen(true);
        }}
      />

      <MaterialModal
        key={`${isModalOpen}-${editing?.id ?? "create"}`}
        isOpen={isModalOpen}
        initial={editing}
        getClassOptions={classNameOptions}
        getSubClassOptions={subClassNameOptions}
        getNextCode={getNextCode}
        onClose={() => {
          setIsModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
