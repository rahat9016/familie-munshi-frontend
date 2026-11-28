import { X } from "lucide-react";
import { Checkbox } from "@/src/components/ui/checkbox";
import { ColumnDef } from "@/src/components/ui/data-table";
import {
  ColorwayFlag,
  ColorwayTextField,
} from "@/src/lib/redux/features/colorway/colorwaySlice";
import { IColorway } from "@/src/lib/redux/features/colorway/colorwayTypes";
import { ColumnFilterSelect } from "@/src/components/admin/shared/ColumnFilterSelect";

function FlagCell({
  row,
  field,
  onToggle,
}: {
  row: IColorway;
  field: ColorwayFlag;
  onToggle?: (code: string, field: ColorwayFlag, value: boolean) => void;
}) {
  return (
    <Checkbox
      checked={row[field]}
      onCheckedChange={(checked) => onToggle?.(row.code, field, checked === true)}
      className="mx-auto"
    />
  );
}

const editableCellClass =
  "w-full bg-transparent border border-transparent rounded px-1 py-0.5 -mx-1 focus:outline-none";

function EditableTextCell({
  value,
  code,
  field,
  type = "text",
  onCommit,
}: {
  value: string;
  code: string;
  field: ColorwayTextField;
  type?: string;
  onCommit?: (code: string, field: ColorwayTextField, value: string) => void;
}) {
  return (
    <input
      key={value}
      type={type}
      defaultValue={value}
      onBlur={(e) => {
        if (e.target.value !== value) onCommit?.(code, field, e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      className={editableCellClass}
    />
  );
}

function SwatchCell({ row }: { row: IColorway }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={!row.image ? { backgroundColor: row.colorHex || "#ffffff" } : undefined}
      title={row.name}
    >
      {row.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
      )}
    </div>
  );
}

export type ArticleColorwayFilterableField =
  | "name"
  | "colorway"
  | "spec"
  | "standard"
  | "pantone"
  | "active"
  | "inTheme"
  | "sustLabelOff"
  | "planSms"
  | "plan3dSms"
  | "actualSms";

const boolLabel = (v: string) => (v === "true" ? "Yes" : "No");

export const GetArticleColorwayColumns = (
  onRemove?: (code: string) => void,
  onFieldChange?: (code: string, field: ColorwayTextField, value: string) => void,
  onToggle?: (code: string, field: ColorwayFlag, value: boolean) => void,
  filterOptions: Partial<Record<ArticleColorwayFilterableField, string[]>> = {},
  columnFilters: Partial<Record<ArticleColorwayFilterableField, string[]>> = {},
  onColumnFilterChange?: (field: ArticleColorwayFilterableField, value: string[]) => void
): ColumnDef<IColorway>[] => {
  const columnFilter = (
    field: ArticleColorwayFilterableField,
    renderLabel?: (value: string) => string
  ) => (
    <ColumnFilterSelect
      value={columnFilters[field] ?? []}
      options={filterOptions[field] ?? []}
      onChange={(value) => onColumnFilterChange?.(field, value)}
      renderLabel={renderLabel}
    />
  );

  return [
    {
      header: (
        <>
          Color Marketing
          <br />
          Name
        </>
      ),
      accessorKey: "name",
      filterLabel: columnFilter("name"),
    },
    {
      header: (
        <span className="inline-flex items-center gap-1">
          Colorway <span className="text-[10px] opacity-70">↕</span>
        </span>
      ),
      accessorKey: "colorway",
      filterLabel: columnFilter("colorway"),
      cell: (value) => <span className="text-primary font-medium">{value as string}</span>,
    },
    {
      header: (
        <>
          Color
          <br />
          Specification
        </>
      ),
      accessorKey: "spec",
      filterLabel: columnFilter("spec"),
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: (
        <>
          Color
          <br />
          Standard
        </>
      ),
      accessorKey: "standard",
      filterLabel: columnFilter("standard"),
    },
    {
      header: "Pantone",
      accessorKey: "pantone",
      filterLabel: columnFilter("pantone"),
    },
    {
      header: "Image",
      accessorKey: "image",
      align: "center",
      noPadding: true,
      cell: (_value, row) => <SwatchCell row={row} />,
    },
    {
      header: "Active",
      accessorKey: "active",
      align: "center",
      filterLabel: columnFilter("active", boolLabel),
      cell: (_value, row) => <FlagCell row={row} field="active" onToggle={onToggle} />,
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
      filterLabel: columnFilter("inTheme", boolLabel),
      cell: (_value, row) => <FlagCell row={row} field="inTheme" onToggle={onToggle} />,
    },
    {
      header: (
        <>
          Sust
          <br />
          Label
          <br />
          Off
        </>
      ),
      accessorKey: "sustLabelOff",
      align: "center",
      filterLabel: columnFilter("sustLabelOff", boolLabel),
      cell: (_value, row) => <FlagCell row={row} field="sustLabelOff" onToggle={onToggle} />,
    },
    {
      header: (
        <>
          Plan
          <br />
          SMS
        </>
      ),
      accessorKey: "planSms",
      align: "center",
      filterLabel: columnFilter("planSms", boolLabel),
      cell: (_value, row) => <FlagCell row={row} field="planSms" onToggle={onToggle} />,
    },
    {
      header: (
        <>
          Plan
          <br />
          3D SMS
        </>
      ),
      accessorKey: "plan3dSms",
      align: "center",
      filterLabel: columnFilter("plan3dSms", boolLabel),
      cell: (_value, row) => <FlagCell row={row} field="plan3dSms" onToggle={onToggle} />,
    },
    {
      header: (
        <>
          Actual
          <br />
          SMS
        </>
      ),
      accessorKey: "actualSms",
      align: "center",
      filterLabel: columnFilter("actualSms", boolLabel),
      cell: (_value, row) => <FlagCell row={row} field="actualSms" onToggle={onToggle} />,
    },
    {
      header: (
        <>
          Color
          <br />
          Start Date
        </>
      ),
      accessorKey: "startDate",
      cell: (value, row) => (
        <EditableTextCell
          value={value as string}
          code={row.code}
          field="startDate"
          type="date"
          onCommit={onFieldChange}
        />
      ),
    },
    {
      header: (
        <>
          Color
          <br />
          End Date
        </>
      ),
      accessorKey: "endDate",
      cell: (value, row) => (
        <EditableTextCell
          value={value as string}
          code={row.code}
          field="endDate"
          type="date"
          onCommit={onFieldChange}
        />
      ),
    },
    {
      header: (
        <>
          Stock
          <br />
          Clearance Date
        </>
      ),
      accessorKey: "clearanceDate",
      cell: (value, row) => (
        <EditableTextCell
          value={value as string}
          code={row.code}
          field="clearanceDate"
          type="date"
          onCommit={onFieldChange}
        />
      ),
    },
    {
      header: "",
      accessorKey: "code",
      align: "center",
      cell: (_value, row) => (
        <button
          type="button"
          onClick={() => onRemove?.(row.code)}
          className="inline-flex items-center justify-center size-6 rounded text-secondary-dark/60 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Remove from this style"
        >
          <X className="size-4" />
        </button>
      ),
    },
  ];
};
