"use client";

import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { RolePermissionsFormType } from "../Schema";
import { RolePermissionsFormProps } from "../types";
import { formatModule } from "../utils/rolePermissionsData";

export default function RolePermissionsForm({
  onSubmit,
  onCancel,
  groups,
  isGroupsLoading = false,
  error,
  isPending = false,
}: RolePermissionsFormProps) {
  const methods = useFormContext<RolePermissionsFormType>();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        permissions: g.permissions.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            g.module.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.permissions.length > 0);
  }, [groups, query]);

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="w-full space-y-4 mt-2"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-secondary-gary" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search permissions..."
          className="h-10 pl-9 bg-light"
        />
      </div>

      <Controller
        name="permissionCodes"
        control={methods.control}
        render={({ field, fieldState }) => {
          const selected = new Set(field.value ?? []);
          const set = (codes: string[], on: boolean) => {
            const next = new Set(selected);
            codes.forEach((c) => (on ? next.add(c) : next.delete(c)));
            field.onChange(Array.from(next));
          };

          return (
            <div>
              <div className="mb-2 flex items-center justify-between text-xs text-secondary-gary">
                <span>{selected.size} selected</span>
                {selected.size > 0 && (
                  <button
                    type="button"
                    className="text-primary underline"
                    onClick={() => field.onChange([])}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-light-dark divide-y divide-light-dark">
                {isGroupsLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2 p-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ))
                ) : filtered.length === 0 ? (
                  <p className="p-6 text-center text-sm text-secondary-gary">
                    No permissions found.
                  </p>
                ) : (
                  filtered.map((group) => {
                    const codes = group.permissions.map((p) => p.name);
                    const count = codes.filter((c) => selected.has(c)).length;
                    const all = count === codes.length;
                    return (
                      <fieldset key={group.module} className="p-4">
                        <legend className="sr-only">{group.module}</legend>
                        <label className="mb-2 flex cursor-pointer items-center gap-2">
                          <Checkbox
                            checked={
                              all ? true : count > 0 ? "indeterminate" : false
                            }
                            onCheckedChange={() => set(codes, !all)}
                            aria-label={`Select all ${group.module}`}
                          />
                          <span className="text-sm font-semibold text-secondary">
                            {formatModule(group.module)}
                          </span>
                          <span className="text-xs text-secondary-gary">
                            {count}/{codes.length}
                          </span>
                        </label>
                        <div className="grid grid-cols-1 gap-2 pl-6 sm:grid-cols-2">
                          {group.permissions.map((p) => (
                            <label
                              key={p.id}
                              className="flex cursor-pointer items-start gap-2 rounded-md p-1.5 hover:bg-light"
                            >
                              <Checkbox
                                className="mt-0.5"
                                checked={selected.has(p.name)}
                                onCheckedChange={(v) =>
                                  set([p.name], v === true)
                                }
                              />
                              <span className="min-w-0">
                                <span className="block font-mono text-xs text-secondary">
                                  {p.name}
                                </span>
                                {p.description && (
                                  <span className="block text-xs text-secondary-gary">
                                    {p.description}
                                  </span>
                                )}
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    );
                  })
                )}
              </div>

              {fieldState.error && (
                <p className="mt-1 pl-2 text-xs text-rose-500">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          );
        }}
      />

      <ErrorMessage error={error} />

      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        <SubmitButton isLoading={isPending} label="Assign" />
      </div>
    </form>
  );
}
