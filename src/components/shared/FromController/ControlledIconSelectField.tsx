"use client";

import {
  CLASSIFICATION_ICON_GROUPS,
  ClassificationIconGroup,
  getClassificationIcon,
} from "@/src/constants/ecommerce/classificationIcons";
import { cn } from "@/src/lib/utils";
import { ChevronsUpDown, X } from "lucide-react";
import * as React from "react";
import { Controller, useFormContext } from "react-hook-form";
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

interface ControlledIconSelectFieldProps {
  name: string;
  groups?: ClassificationIconGroup[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Show an "x" to clear the selection (for optional fields). */
  clearable?: boolean;
}

/** Searchable icon dropdown; stores the icon's string `value` in the form. */
const ControlledIconSelectField: React.FC<ControlledIconSelectFieldProps> = ({
  name,
  groups = CLASSIFICATION_ICON_GROUPS,
  placeholder = "Select icon",
  disabled,
  className,
  clearable = true,
}) => {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selected = getClassificationIcon(field.value);

        return (
          <div className="w-full">
            <Popover modal open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    "h-11 w-full justify-between border-light-dark bg-white font-normal text-sm hover:bg-white",
                    !selected && "text-muted-foreground",
                    error && "border-rose-500",
                    className
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    {selected ? (
                      <>
                        <selected.Icon className="size-4 shrink-0 text-primary" />
                        <span className="truncate">{selected.label}</span>
                        <span className="text-xs text-muted-foreground">
                          ({selected.value})
                        </span>
                      </>
                    ) : (
                      placeholder
                    )}
                  </span>
                  <span className="flex items-center gap-1">
                    {clearable && selected && (
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label="Clear icon"
                        className="rounded p-0.5 hover:bg-muted"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            field.onChange("");
                          }
                        }}
                      >
                        <X className="size-3.5 opacity-60" />
                      </span>
                    )}
                    <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                  </span>
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="p-0 w-(--radix-popover-trigger-width)"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Search icon..." className="h-9" />
                  <CommandList className="max-h-80 overflow-y-auto overscroll-contain">
                    <CommandEmpty>No icon found.</CommandEmpty>
                    {groups.map((group) => (
                      <CommandGroup
                        key={group.group}
                        heading={group.group}
                        className="**:[[cmdk-group-items]]:grid **:[[cmdk-group-items]]:grid-cols-6 **:[[cmdk-group-items]]:gap-1 sm:**:[[cmdk-group-items]]:grid-cols-8"
                      >
                        {group.icons.map((opt) => {
                          const isSelected = field.value === opt.value;
                          return (
                            <CommandItem
                              key={opt.value}
                              value={opt.value}
                              keywords={[
                                opt.label,
                                group.group,
                                ...(opt.keywords?.split(" ") ?? []),
                              ]}
                              title={opt.label}
                              aria-label={opt.label}
                              onSelect={() => {
                                field.onChange(opt.value);
                                setOpen(false);
                              }}
                              className={cn(
                                "flex-col justify-center gap-1 h-16 px-1 py-1.5 border border-transparent text-center",
                                isSelected &&
                                  "border-primary bg-primary/10 data-[selected=true]:bg-primary/15"
                              )}
                            >
                              <opt.Icon
                                className={cn(
                                  "size-5!",
                                  isSelected
                                    ? "text-primary"
                                    : "text-secondary-foreground"
                                )}
                              />
                              <span className="w-full truncate text-[10px] leading-tight">
                                {opt.label}
                              </span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    ))}
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

export default ControlledIconSelectField;
