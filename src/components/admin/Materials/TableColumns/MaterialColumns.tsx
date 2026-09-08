import { ImageIcon, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { ColumnFilterSelect } from "@/src/components/admin/Styles/TableColumns/ColorwayColumns";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ColumnDef } from "@/src/components/ui/data-table";
import { MATERIAL_TYPES } from "../data/materialHierarchy";
import {
  MATERIAL_STATUSES,
  YARN_COUNT_UNITS,
} from "../data/materialOptions";
import { IMaterial, MaterialFlag, MaterialTextField } from "../types";
import TableRowActions from "./TableRowActions";
import { fileToThumbnail } from "@/src/utils/imageThumbnail";

const editableCellClass =
  "w-full min-w-28 bg-transparent border-none p-0 text-sm text-secondary-dark focus:outline-none focus:ring-0";

/** Status pill colors — mirrors the promote status styling on Articles. */
const statusStyles: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-700 border-slate-200",
  "In Development": "bg-amber-100 text-amber-800 border-amber-200",
  Approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
};

export type MaterialFilterableField =
  | "code"
  | "material"
  | "materialDescription"
  | "defaultSupplierRefCode"
  | "textComposition"
  | "materialClass"
  | "materialSubClass"
  | "materialType"
  | "structure"
  | "productSuppliers"
  | "weight"
  | "yarnCount"
  | "yarnCountUnit"
  | "okForColorSpecification"
  | "materialStatus"
  | "isActive"
  | "isSustainable"
  | "createdBy";

const yesNoLabel = (value: string) => (value === "true" ? "Yes" : "No");

function EditableTextCell({
  row,
  field,
  placeholder,
  type = "text",
  className,
  onCommit,
}: {
  row: IMaterial;
  field: MaterialTextField;
  placeholder?: string;
  type?: string;
  className?: string;
  onCommit?: (id: string, field: MaterialTextField, value: string) => void;
}) {
  const value = row[field];
  return (
    <input
      key={value}
      type={type}
      defaultValue={value}
      placeholder={placeholder}
      onBlur={(e) => {
        if (e.target.value !== value) onCommit?.(row.id, field, e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      className={`${editableCellClass} ${className ?? ""}`}
    />
  );
}

function EditableSelectCell({
  row,
  field,
  options,
  disabled,
  className,
  onCommit,
}: {
  row: IMaterial;
  field: MaterialTextField;
  options: readonly string[];
  disabled?: boolean;
  className?: string;
  onCommit?: (id: string, field: MaterialTextField, value: string) => void;
}) {
  return (
    <select
      value={row[field]}
      disabled={disabled}
      onChange={(e) => onCommit?.(row.id, field, e.target.value)}
      className={`${editableCellClass} cursor-pointer disabled:cursor-not-allowed disabled:text-secondary-gary/70 ${
        className ?? ""
      }`}
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function FlagCell({
  row,
  field,
  onToggle,
}: {
  row: IMaterial;
  field: MaterialFlag;
  onToggle?: (id: string, field: MaterialFlag, value: boolean) => void;
}) {
  return (
    <Checkbox
      checked={row[field]}
      onCheckedChange={(checked) => onToggle?.(row.id, field, checked === true)}
      className="mx-auto"
    />
  );
}

function ImageCell({
  row,
  onUpload,
}: {
  row: IMaterial;
  onUpload?: (id: string, image: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      onUpload?.(row.id, await fileToThumbnail(file));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not upload the image"
      );
    }
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      title={row.image ? "Replace image" : "Upload image"}
      className="group absolute inset-0 flex items-center justify-center overflow-hidden bg-light cursor-pointer"
    >
      {row.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={row.image}
          alt={row.material}
          className="w-full h-full object-cover"
        />
      ) : (
        <ImageIcon className="size-5 text-secondary-gary/70" />
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
        <Upload className="size-3.5 text-white" />
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </button>
  );
}

export interface MaterialColumnsOptions {
  onEdit: (item: IMaterial) => void;
  onDelete: (item: IMaterial) => void;
  onTextChange?: (id: string, field: MaterialTextField, value: string) => void;
  onFlagToggle?: (id: string, field: MaterialFlag, value: boolean) => void;
  onImageUpload?: (id: string, image: string) => void;
  /** Cascading options for the inline Class / Sub Class selects. */
  getClassOptions: (materialType: string) => string[];
  getSubClassOptions: (materialType: string, materialClass: string) => string[];
  filterOptions?: Partial<Record<MaterialFilterableField, string[]>>;
  columnFilters?: Partial<Record<MaterialFilterableField, string[]>>;
  onColumnFilterChange?: (
    field: MaterialFilterableField,
    value: string[]
  ) => void;
}

export const GetMaterialColumns = ({
  onEdit,
  onDelete,
  onTextChange,
  onFlagToggle,
  onImageUpload,
  getClassOptions,
  getSubClassOptions,
  filterOptions = {},
  columnFilters = {},
  onColumnFilterChange,
}: MaterialColumnsOptions): ColumnDef<IMaterial>[] => {
  const columnFilter = (
    field: MaterialFilterableField,
    renderLabel?: (value: string) => string
  ) => (
    <ColumnFilterSelect
      value={columnFilters[field] ?? []}
      options={filterOptions[field] ?? []}
      onChange={(value) => onColumnFilterChange?.(field, value)}
      renderLabel={renderLabel}
    />
  );

  const text = (
    header: string,
    field: MaterialTextField,
    extra?: Partial<ColumnDef<IMaterial>>
  ): ColumnDef<IMaterial> => ({
    header,
    accessorKey: field,
    filterLabel: columnFilter(field as MaterialFilterableField),
    cell: (_value, row) => (
      <EditableTextCell
        row={row}
        field={field}
        placeholder="—"
        onCommit={onTextChange}
      />
    ),
    ...extra,
  });

  const flag = (
    header: string,
    field: MaterialFlag
  ): ColumnDef<IMaterial> => ({
    header,
    accessorKey: field,
    align: "center",
    filterLabel: columnFilter(field as MaterialFilterableField, yesNoLabel),
    cell: (_value, row) => (
      <FlagCell row={row} field={field} onToggle={onFlagToggle} />
    ),
  });

  return [
    {
      header: "Code",
      accessorKey: "code",
      filterLabel: columnFilter("code" as MaterialFilterableField),
      cell: (_value, row) => (
        <span className="font-medium text-secondary-dark">{row.code}</span>
      ),
    },
    {
      header: "Material",
      accessorKey: "material",
      filterLabel: columnFilter("material"),
      cell: (_value, row) => (
        <EditableTextCell
          row={row}
          field="material"
          placeholder="Material name"
          onCommit={onTextChange}
          className="font-medium text-secondary-dark"
        />
      ),
    },
    {
      header: "Image",
      accessorKey: "image",
      align: "center",
      noPadding: true,
      cell: (_value, row) => <ImageCell row={row} onUpload={onImageUpload} />,
    },
    text("Material Description", "materialDescription"),
    text("Default Supplier Ref Code", "defaultSupplierRefCode"),
    text("Text Composition", "textComposition"),
    {
      header: "Material Class",
      accessorKey: "materialClass",
      filterLabel: columnFilter("materialClass"),
      cell: (_value, row) => (
        <EditableSelectCell
          row={row}
          field="materialClass"
          options={getClassOptions(row.materialType)}
          disabled={!row.materialType}
          onCommit={onTextChange}
        />
      ),
    },
    {
      header: "Material Sub Class",
      accessorKey: "materialSubClass",
      filterLabel: columnFilter("materialSubClass"),
      cell: (_value, row) => (
        <EditableSelectCell
          row={row}
          field="materialSubClass"
          options={getSubClassOptions(row.materialType, row.materialClass)}
          disabled={!row.materialClass}
          onCommit={onTextChange}
        />
      ),
    },
    {
      header: "Material Type",
      accessorKey: "materialType",
      filterLabel: columnFilter("materialType"),
      cell: (_value, row) => (
        <EditableSelectCell
          row={row}
          field="materialType"
          options={MATERIAL_TYPES}
          onCommit={onTextChange}
        />
      ),
    },
    text("Structure", "structure"),
    text("Product Suppliers", "productSuppliers"),
    text("Weight", "weight", { align: "right" }),
    text("Yarn Count", "yarnCount", { align: "right" }),
    {
      header: "Yarn Count Unit",
      accessorKey: "yarnCountUnit",
      filterLabel: columnFilter("yarnCountUnit"),
      cell: (_value, row) => (
        <EditableSelectCell
          row={row}
          field="yarnCountUnit"
          options={YARN_COUNT_UNITS}
          onCommit={onTextChange}
        />
      ),
    },
    flag("OK for Color Specification", "okForColorSpecification"),
    {
      header: "Material Status",
      accessorKey: "materialStatus",
      filterLabel: columnFilter("materialStatus"),
      cell: (_value, row) => (
        <EditableSelectCell
          row={row}
          field="materialStatus"
          options={MATERIAL_STATUSES}
          onCommit={onTextChange}
          className={`w-fit min-w-0 rounded-md border px-2 py-0.5 font-medium ${
            statusStyles[row.materialStatus] ??
            "bg-slate-100 text-slate-700 border-slate-200"
          }`}
        />
      ),
    },
    flag("Active", "isActive"),
    flag("Sustainable", "isSustainable"),
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: (value) =>
        new Date(value as string).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      header: "Created By",
      accessorKey: "createdBy",
      filterLabel: columnFilter("createdBy"),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (_value, row) => (
        <TableRowActions
          onEdit={() => onEdit(row)}
          onDelete={() => onDelete(row)}
        />
      ),
    },
  ];
};
