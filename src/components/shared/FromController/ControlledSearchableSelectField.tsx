"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/src/lib/utils";
import { Button } from "../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

/** Plain strings when value and label match, objects when they differ (ids). */
export type SearchableOption = string | { value: string; label: string };

interface ControlledSearchableSelectFieldProps {
  name: string;
  options: readonly SearchableOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  /** Runs after the field value changes — e.g. clear dependent cascading fields. */
  onChanged?: (value: string) => void;
}

/** Type-to-filter select wired to react-hook-form, for cascading dropdowns. */
const ControlledSearchableSelectField: React.FC<
  ControlledSearchableSelectFieldProps
> = ({
  name,
  options,
  placeholder = "Select",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  disabled,
  className,
  onChanged,
}) => {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);

  const items = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedLabel =
          items.find((opt) => opt.value === field.value)?.label ?? "";

        return (
          <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    "h-11 w-full justify-between border-light-dark bg-white font-normal text-sm hover:bg-white",
                    !field.value && "text-muted-foreground",
                    error && "border-rose-500",
                    className
                  )}
                >
                  <span className="truncate">
                    {selectedLabel || placeholder}
                  </span>
                  <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="p-0 w-(--radix-popover-trigger-width)"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup>
                      {items.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          value={opt.label}
                          onSelect={() => {
                            field.onChange(opt.value);
                            onChanged?.(opt.value);
                            setOpen(false);
                          }}
                        >
                          {opt.label}
                          <Check
                            className={cn(
                              "ml-auto size-4",
                              field.value === opt.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {error && (
              <p className="mt-1 pl-2 text-xs text-rose-500">
                {error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default ControlledSearchableSelectField;
