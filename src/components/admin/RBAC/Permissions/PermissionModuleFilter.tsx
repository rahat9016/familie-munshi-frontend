"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { PermissionModuleFilterProps } from "./types";
import { ALL_MODULES, formatModule } from "./utils/permissionData";

/** Module dropdown → `module` query param. */
export default function PermissionModuleFilter({
  value,
  onChange,
  modules,
  isLoading = false,
}: PermissionModuleFilterProps) {
  return (
    <Select
      value={value || ALL_MODULES}
      onValueChange={(v) => onChange(v === ALL_MODULES ? "" : v)}
      disabled={isLoading}
    >
      <SelectTrigger className="h-10! w-52 bg-white" aria-label="Module">
        <SelectValue placeholder="All modules" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem value={ALL_MODULES}>All modules</SelectItem>
        {modules.map((m) => (
          <SelectItem key={m} value={m}>
            {formatModule(m)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
