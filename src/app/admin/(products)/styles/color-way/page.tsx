"use client";

import { useMemo, useState } from "react";
import { Palette } from "lucide-react";
import { toast } from "react-toastify";
import { DataTable } from "@/src/components/ui/data-table";
import { prepareGalleryImage } from "@/src/utils/galleryImage";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import {
  ColorwayFlag,
  ColorwayTextField,
  createColorway,
  setColorwayField,
  setColorwayFlag,
  setColorwayImage,
} from "@/src/lib/redux/features/colorway/colorwaySlice";
import CreateColorway from "@/src/components/admin/Styles/Form/CreateColorway";
import { ColorwayFormValues } from "@/src/components/admin/Styles/Schema/colorwaySchema";
import {
  ColorwayFilterableField,
  GetColorwayColumns,
} from "@/src/components/admin/Styles/TableColumns/ColorwayColumns";

const colorwayStatusFilterOptions = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function StyleColorWayPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.colorway.items);
  const { sortBy } = useAppSelector((state) => state.filter);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<
    Partial<Record<ColorwayFilterableField, string[]>>
  >({});

  const handleColumnFilterChange = (field: ColorwayFilterableField, value: string[]) => {
    setColumnFilters((prev) => ({ ...prev, [field]: value }));
  };

  const textFilterFields = ["name", "colorway", "spec", "standard", "pantone"] as const;

  const filterOptions = useMemo(() => {
    const all = Object.values(items);
    const map: Partial<Record<ColorwayFilterableField, string[]>> = {
      active: ["true", "false"],
    };
    textFilterFields.forEach((field) => {
      map[field] = Array.from(
        new Set(all.map((item) => item[field]).filter(Boolean))
      ).sort();
    });
    return map;
  }, [items]);

  const data = useMemo(() => {
    const query = search.trim().toLowerCase();
    return Object.values(items)
      .filter((item) => {
        const matchesStatus =
          !sortBy ||
          (sortBy === "active" && item.active) ||
          (sortBy === "inactive" && !item.active);
        const matchesSearch =
          !query ||
          [item.name, item.colorway, item.spec, item.description, item.standard, item.pantone]
            .join(" ")
            .toLowerCase()
            .includes(query);
        const matchesColumns = (
          Object.keys(columnFilters) as ColorwayFilterableField[]
        ).every((field) => {
          const selected = columnFilters[field];
          if (!selected || selected.length === 0) return true;
          if (field === "active") return selected.includes(String(item.active));
          const itemValue = String(item[field] ?? "").toLowerCase();
          return selected.some((v) => itemValue.includes(v.toLowerCase()));
        });
        return matchesStatus && matchesSearch && matchesColumns;
      })
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [items, sortBy, search, columnFilters]);
  const handleToggleFlag = (code: string, field: ColorwayFlag, value: boolean) => {
    dispatch(setColorwayFlag({ code, field, value }));
  };
  const handleImageUpload = async (code: string, file: File) => {
    try {
      dispatch(setColorwayImage({ code, image: await prepareGalleryImage(file) }));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not upload the image"
      );
    }
  };
  const handleFieldChange = (code: string, field: ColorwayTextField, value: string) => {
    dispatch(setColorwayField({ code, field, value }));
  };
  const columns = useMemo(
    () =>
      GetColorwayColumns(
        handleToggleFlag,
        handleImageUpload,
        handleFieldChange,
        filterOptions,
        columnFilters,
        handleColumnFilterChange
      ),
    [filterOptions, columnFilters]
  );

  const handleCreateColorway = (values: ColorwayFormValues) => {
    const action = dispatch(
      createColorway({
        name: values.name,
        colorway: values.colorway,
        spec: values.spec ?? "",
        description: values.description ?? "",
        standard: values.standard,
        pantone: values.pantone ?? "",
        colorHex: values.colorHex,
        active: false,
        inTheme: false,
        sustLabelOff: false,
        planSms: false,
        plan3dSms: false,
        actualSms: false,
        startDate: values.startDate ?? "",
        endDate: values.endDate ?? "",
        clearanceDate: values.clearanceDate ?? "",
      })
    );
    setIsModalOpen(false);
    toast.success(`Colorway ${action.payload.code} created`);
  };

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={data}
        title="Color Way"
        icon={<Palette />}
        IsCreate
        createTitle="New Colorway"
        setIsModalOpen={setIsModalOpen}
        showSearch
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search colorway..."
        isShowStatus
        statusOptions={colorwayStatusFilterOptions}
        showColumnFilters
        totalItems={data.length}
        itemsPerPage={data.length || 10}
        currentPage={1}
      />

      <CreateColorway
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateColorway}
      />
    </div>
  );
}
