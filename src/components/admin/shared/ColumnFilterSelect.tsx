"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";

function CheckboxMark({ checked }: { checked: boolean }) {
  return (
    <span
      className={cn(
        "flex items-center justify-center size-3.5 shrink-0 rounded-[4px] border",
        checked ? "bg-primary border-primary text-white" : "border-input"
      )}
    >
      {checked && <Check className="size-2.5" />}
    </span>
  );
}
export function ColumnFilterSelect({
  value,
  options,
  onChange,
  renderLabel,
}: {
  value: string[];
  options: string[];
  onChange: (value: string[]) => void;
  renderLabel?: (value: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const label =
    value.length === 0
      ? "All"
      : value.length === 1
      ? renderLabel
        ? renderLabel(value[0])
        : value[0]
      : `${value.length} selected`;

  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full flex items-center justify-between gap-1 bg-transparent text-secondary-dark font-medium focus:outline-none"
        >
          <span className="truncate">{label}</span>
          <ChevronsUpDown className="size-3 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." className="h-8 text-xs" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange([]);
                }}
              >
                <CheckboxMark checked={value.length === 0} />
                All
              </CommandItem>
              {options.map((opt) => (
                <CommandItem
                  key={opt}
                  value={opt}
                  onSelect={() => toggle(opt)}
                >
                  <CheckboxMark checked={value.includes(opt)} />
                  {renderLabel ? renderLabel(opt) : opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
