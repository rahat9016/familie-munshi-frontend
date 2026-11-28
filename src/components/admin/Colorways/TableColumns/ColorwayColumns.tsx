import RowActionsMenu from "@/src/components/shared/RowActionsMenu/RowActionsMenu";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ColumnDef } from "@/src/components/ui/data-table";
import { useImageDrop } from "@/src/hooks/useImageDrop";
import { cn } from "@/src/lib/utils";
import {
  COLORWAY_IMAGE_TYPES,
  COLORWAY_STANDARDS,
  ColorwayFlag,
  ColorwayTextField,
  getColorwayCover,
  IColorway,
} from "@/src/types/colorway";
import { Eye, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useId } from "react";
import { colorwayRoute } from "../utils/colorwayFormData";

export interface ColorwayRowActions {
  onView?: (item: IColorway) => void;
  /** Omit to make cells read-only (no COLORWAY_UPDATE). */
  /** Return `false` to reject the edit and restore the cell. */
  onFieldChange?: (
    item: IColorway,
    field: ColorwayTextField,
    value: string
  ) => boolean | void | Promise<boolean | void>;
  onFlagChange?: (item: IColorway, field: ColorwayFlag, value: boolean) => void;
  /** New image becomes the cover. */
  onImageUpload?: (item: IColorway, file: File) => void | Promise<void>;
  /** Omit to hide (no COLORWAY_DELETE). */
  onDelete?: (item: IColorway) => void;
}

const editableCellClass =
  "w-full bg-transparent border border-transparent rounded px-1 py-0.5 -mx-1 focus:outline-none";

function TextCell({
  row,
  field,
  placeholder,
  className,
  onCommit,
}: {
  row: IColorway;
  field: ColorwayTextField;
  placeholder?: string;
  className?: string;
  onCommit?: ColorwayRowActions["onFieldChange"];
}) {
  const value = row[field] ?? "";
  if (!onCommit)
    return (
      <span className={cn("text-sm", className)}>{value || "—"}</span>
    );

  return (
    <input
      // Remount when the stored value changes.
      key={`${row.id}-${value}`}
      defaultValue={value}
      placeholder={placeholder}
      onBlur={(e) => {
        const input = e.currentTarget;
        if (input.value === value) return;
        Promise.resolve(onCommit(row, field, input.value)).then((ok) => {
          if (ok === false) input.value = value;
        });
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      className={cn(editableCellClass, className)}
    />
  );
}

function StandardCell({
  row,
  onCommit,
}: {
  row: IColorway;
  onCommit?: ColorwayRowActions["onFieldChange"];
}) {
  const value = row.colorStandard ?? "";
  if (!onCommit) return <span className="text-sm">{value || "—"}</span>;

  return (
    <select
      value={value}
      onChange={(e) => onCommit(row, "colorStandard", e.target.value)}
      className={cn(editableCellClass, "text-sm")}
    >
      {/* Keep an unknown stored value selectable. */}
      {value && !(COLORWAY_STANDARDS as readonly string[]).includes(value) && (
        <option value={value}>{value}</option>
      )}
      {COLORWAY_STANDARDS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function ImageCell({
  row,
  onUpload,
}: {
  row: IColorway;
  onUpload?: ColorwayRowActions["onImageUpload"];
}) {
  // A <label> opens the picker natively — see the note in MaterialColumns.
  const inputId = useId();
  const cover = getColorwayCover(row);

  const handleFiles = async (files: File[]) => {
    if (files[0]) await onUpload?.(row, files[0]);
  };
  const { isDragging, dropHandlers } = useImageDrop(handleFiles);

  const swatch = (
    <>
      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt={row.marketingName}
          className="w-full h-full object-cover"
        />
      )}
    </>
  );
  const style = !cover
    ? { backgroundColor: row.hexCode || "#ffffff" }
    : undefined;

  if (!onUpload)
    return (
      <span className="absolute inset-0 overflow-hidden" style={style}>
        {swatch}
      </span>
    );

  return (
    <label
      htmlFor={inputId}
      {...dropHandlers}
      className={cn(
        "group absolute inset-0 overflow-hidden cursor-pointer",
        isDragging && "ring-2 ring-inset ring-primary"
      )}
      style={style}
      title="Upload cover image — or drop one here"
    >
      {swatch}
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-colors group-hover:bg-black/40 group-hover:opacity-100",
          isDragging ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0"
        )}
      >
        <Upload className="size-3.5 text-white" />
      </span>
      <input
        id={inputId}
        type="file"
        accept={COLORWAY_IMAGE_TYPES.join(",")}
        className="sr-only"
        // Clearing `value` drops the FileList, so it waits for the upload.
        onChange={async (e) => {
          const input = e.currentTarget;
          await handleFiles(Array.from(input.files ?? []));
          input.value = "";
        }}
      />
    </label>
  );
}

function FlagCell({
  row,
  field,
  onToggle,
}: {
  row: IColorway;
  field: ColorwayFlag;
  onToggle?: ColorwayRowActions["onFlagChange"];
}) {
  return (
    <Checkbox
      checked={row[field]}
      disabled={!onToggle}
      onCheckedChange={(checked) => onToggle?.(row, field, checked === true)}
      className="mx-auto"
    />
  );
}

export const GetColorwayColumns = ({
  onView,
  onFieldChange,
  onFlagChange,
  onImageUpload,
  onDelete,
}: ColorwayRowActions = {}): ColumnDef<IColorway>[] => [
  {
    header: "Code",
    accessorKey: "code",
    cell: (_value, row) => (
      <Link
        href={colorwayRoute(row.id)}
        className="font-medium text-primary underline-offset-2 hover:underline"
        title="Open colorway details"
      >
        {row.code}
      </Link>
    ),
  },
  {
    header: (
      <>
        Color Marketing
        <br />
        Name
      </>
    ),
    accessorKey: "marketingName",
    cell: (_value, row) => (
      <TextCell
        row={row}
        field="marketingName"
        placeholder="e.g. Midnight Navy"
        onCommit={onFieldChange}
      />
    ),
  },
  {
    header: "Colorway",
    accessorKey: "name",
    cell: (_value, row) => (
      <TextCell
        row={row}
        field="name"
        placeholder="e.g. Navy/White"
        className="text-primary font-medium"
        onCommit={onFieldChange}
      />
    ),
  },
  {
    header: (
      <>
        Color
        <br />
        Specification
      </>
    ),
    accessorKey: "colorSpecification",
    cell: (_value, row) => (
      <TextCell
        row={row}
        field="colorSpecification"
        placeholder="e.g. Solid dyed"
        onCommit={onFieldChange}
      />
    ),
  },
  {
    header: "Description",
    accessorKey: "description",
    cell: (_value, row) => (
      <TextCell
        row={row}
        field="description"
        placeholder="Description"
        onCommit={onFieldChange}
      />
    ),
  },
  {
    header: (
      <>
        Color
        <br />
        Standard
      </>
    ),
    accessorKey: "colorStandard",
    cell: (_value, row) => (
      <StandardCell row={row} onCommit={onFieldChange} />
    ),
  },
  {
    header: (
      <>
        Color
        <br />
        Reference
      </>
    ),
    accessorKey: "colorReference",
    cell: (_value, row) => (
      <TextCell
        row={row}
        field="colorReference"
        placeholder="e.g. 19-4052 TCX"
        onCommit={onFieldChange}
      />
    ),
  },
  {
    header: "Image",
    accessorKey: "images",
    align: "center",
    noPadding: true,
    cell: (_value, row) => <ImageCell row={row} onUpload={onImageUpload} />,
  },
  {
    header: "Active",
    accessorKey: "active",
    align: "center",
    cell: (_value, row) => (
      <FlagCell row={row} field="active" onToggle={onFlagChange} />
    ),
  },
  {
    header: (
      <>
        In
        <br />
        Theme
      </>
    ),
    accessorKey: "inTheme",
    align: "center",
    cell: (_value, row) => (
      <FlagCell row={row} field="inTheme" onToggle={onFlagChange} />
    ),
  },
  {
    header: "Action",
    accessorKey: "id",
    align: "right",
    cell: (_value, row) => (
      <RowActionsMenu
        label={`Actions for ${row.code}`}
        actions={[
          {
            key: "view",
            label: "View",
            icon: Eye,
            onSelect: () => onView?.(row),
            hidden: !onView,
          },
          {
            key: "delete",
            label: "Delete",
            icon: Trash2,
            variant: "danger",
            onSelect: () => onDelete?.(row),
            hidden: !onDelete,
          },
        ]}
      />
    ),
  },
];
