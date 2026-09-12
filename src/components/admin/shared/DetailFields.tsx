"use client";

import { Checkbox } from "@/src/components/ui/checkbox";
import { cn } from "@/src/lib/utils";

/**
 * Label/value rows for the record detail pages (Material, Colorway).
 *
 * `TText` and `TFlag` are passed in rather than derived from `T` so each page
 * can keep its own read-only fields out of the editable unions.
 */
export type DetailRow<TText extends string, TFlag extends string> =
  | {
      kind: "text";
      label: string;
      field: TText;
      type?: "text" | "number" | "date" | "color";
      multiline?: boolean;
    }
  | {
      kind: "select";
      label: string;
      field: TText;
      options: readonly string[];
      disabled?: boolean;
    }
  | { kind: "flag"; label: string; field: TFlag }
  | { kind: "readonly"; label: string; value: string; emphasis?: boolean };

const inputClass =
  "w-full bg-transparent border-none p-0 text-sm text-secondary-dark placeholder:text-secondary-gary/60 focus:outline-none focus:ring-0";

interface FieldProps<T, TText extends string, TFlag extends string> {
  row: DetailRow<TText, TFlag>;
  record: T;
  onText: (field: TText, value: string) => void;
  onFlag: (field: TFlag, value: boolean) => void;
}

function FieldRow<T, TText extends string, TFlag extends string>({
  row,
  record,
  onText,
  onFlag,
}: FieldProps<T, TText, TFlag>) {
  const read = (field: string) => (record as Record<string, unknown>)[field];
  const value = row.kind === "readonly" ? row.value : String(read(row.field) ?? "");

  return (
    <div className="grid grid-cols-[minmax(7.5rem,45%)_1fr] items-start gap-2 border-b border-light-dark bg-white px-3 py-2 last:border-b-0">
      <span className="text-xs font-semibold text-secondary-dark">
        {row.label}
      </span>

      {row.kind === "readonly" && (
        <span
          className={cn(
            "text-sm break-words",
            row.emphasis
              ? "font-semibold text-secondary-dark"
              : "text-secondary-gary"
          )}
        >
          {row.value || "—"}
        </span>
      )}

      {row.kind === "text" &&
        (row.multiline ? (
          <textarea
            key={value}
            rows={2}
            defaultValue={value}
            placeholder="—"
            onBlur={(e) => {
              if (e.target.value !== value) onText(row.field, e.target.value);
            }}
            className={`${inputClass} resize-y`}
          />
        ) : (
          <input
            key={value}
            type={row.type ?? "text"}
            defaultValue={value}
            placeholder="—"
            onBlur={(e) => {
              if (e.target.value !== value) onText(row.field, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className={cn(
              inputClass,
              row.type === "color" && "h-6 w-12 cursor-pointer p-0"
            )}
          />
        ))}

      {row.kind === "select" && (
        <select
          value={value}
          disabled={row.disabled}
          onChange={(e) => onText(row.field, e.target.value)}
          className={cn(
            inputClass,
            "cursor-pointer disabled:cursor-not-allowed disabled:text-secondary-gary/70"
          )}
        >
          <option value="">Select</option>
          {row.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {row.kind === "flag" && (
        <Checkbox
          checked={Boolean(read(row.field))}
          onCheckedChange={(checked) => onFlag(row.field, checked === true)}
        />
      )}
    </div>
  );
}

export function DetailFieldColumn<T, TText extends string, TFlag extends string>({
  rows,
  record,
  onText,
  onFlag,
}: {
  rows: DetailRow<TText, TFlag>[];
} & Omit<FieldProps<T, TText, TFlag>, "row">) {
  return (
    <div className="overflow-hidden rounded-lg border border-light-dark bg-white">
      {rows.map((row) => (
        <FieldRow
          key={row.label}
          row={row}
          record={record}
          onText={onText}
          onFlag={onFlag}
        />
      ))}
    </div>
  );
}

export function DetailSectionTitle({ children }: { children: string }) {
  return (
    <h2 className="border-b border-light-dark pb-2 text-base font-bold text-secondary-dark">
      {children}
    </h2>
  );
}
