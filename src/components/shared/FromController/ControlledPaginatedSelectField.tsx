"use client";

import { useDebounce } from "@/src/hooks/useDebounce";
import { useInfiniteGet } from "@/src/hooks/useInfiniteGet";
import { cn } from "@/src/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { UIEvent, useEffect, useMemo, useRef, useState } from "react";
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

interface ControlledPaginatedSelectFieldProps<T> {
  name: string;
  /** Paginated list endpoint, e.g. "/branches". */
  endpoint: string;
  queryKey: string[];
  /** Extra query params (e.g. `{ isActive: true }`). */
  params?: Record<string, unknown>;
  getOption: (item: T) => { value: string; label: string };
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  pageSize?: number;
  disabled?: boolean;
  className?: string;
}

/**
 * Searchable select backed by a paginated API: server-side `search`,
 * next page loads when the list is scrolled to the bottom.
 */
export default function ControlledPaginatedSelectField<T>({
  name,
  endpoint,
  queryKey,
  params,
  getOption,
  placeholder = "Select",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  pageSize = 20,
  disabled,
  className,
}: ControlledPaginatedSelectFieldProps<T>) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search.trim(), 300);
  // Remember labels of every option seen, so the selected one still
  // shows after the search changes the loaded pages.
  const labels = useRef(new Map<string, string>());

  const {
    items,
    totalRecords,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteGet<T>(
    endpoint,
    queryKey,
    { ...params, search: debounced },
    { enabled: open, size: pageSize }
  );

  const options = useMemo(() => items.map(getOption), [items, getOption]);
  useEffect(() => {
    options.forEach((o) => labels.current.set(o.value, o.label));
  }, [options]);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      el.scrollTop + el.clientHeight >= el.scrollHeight - 24 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedLabel = field.value
          ? (labels.current.get(field.value) ?? "Selected")
          : "";

        return (
          <div className="w-full">
            <Popover
              modal
              open={open}
              onOpenChange={(next) => {
                setOpen(next);
                if (!next) setSearch("");
              }}
            >
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
                {/* shouldFilter={false}: the API does the searching */}
                <Command shouldFilter={false}>
                  <CommandInput
                    value={search}
                    onValueChange={setSearch}
                    placeholder={searchPlaceholder}
                    className="h-9"
                  />
                  <CommandList
                    className="max-h-64 overflow-y-auto overscroll-contain"
                    onScroll={onScroll}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-secondary-gary">
                        <Loader2 className="size-4 animate-spin" /> Loading...
                      </div>
                    ) : (
                      <CommandEmpty>{emptyMessage}</CommandEmpty>
                    )}
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          className={cn(
                            "cursor-pointer data-[selected=true]:bg-primary/5 data-[selected=true]:text-primary",
                            field.value === opt.value &&
                              "bg-primary/10 font-medium text-primary data-[selected=true]:bg-primary/10"
                          )}
                          key={opt.value}
                          value={opt.value}
                          onSelect={() => {
                            field.onChange(opt.value);
                            setOpen(false);
                            setSearch("");
                          }}
                        >
                          <span className="truncate">{opt.label}</span>
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
                    {isFetchingNextPage && (
                      <div className="flex items-center justify-center gap-2 py-2 text-xs text-secondary-gary">
                        <Loader2 className="size-3.5 animate-spin" /> Loading
                        more...
                      </div>
                    )}
                    {!isLoading && options.length > 0 && (
                      <p className="px-3 py-1.5 text-[11px] text-secondary-gary border-t">
                        {options.length} of {totalRecords}
                      </p>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {error && (
              <p className="mt-1 pl-2 text-xs text-rose-500">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
