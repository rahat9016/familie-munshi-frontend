"use client";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { RowActionsMenuProps } from "./types";

const ITEM_CLASS =
  "cursor-pointer gap-2 rounded-none px-3 py-2.5 text-sm border-b border-light-dark last:border-b-0 transition-colors [&_svg]:text-current!";

const VARIANT_CLASS = {
  default:
    "text-secondary hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary",
  danger:
    "text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700",
} as const;

/** Right-aligned three-dot row menu. Renders nothing when no actions. */
export default function RowActionsMenu({
  actions,
  label = "Row actions",
}: RowActionsMenuProps) {
  const visible = actions.filter((a) => !a.hidden);
  if (visible.length === 0) return null;

  return (
    <div className="flex justify-end">
      {/* modal={false}: lets dialogs opened from an item take focus cleanly */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="sm"
            aria-label={label}
            className="w-9! min-h-9 border border-[#E6E6E6] flex items-center justify-center rounded-lg bg-light hover:bg-white data-[state=open]:bg-white"
          >
            <EllipsisVertical className="h-4 w-4 text-secondary-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44 overflow-hidden rounded-lg border border-light-dark bg-white p-0 shadow-lg"
        >
          {visible.map(
            ({ key, label: text, icon: Icon, onSelect, variant }) => (
              <DropdownMenuItem
                key={key}
                onSelect={onSelect}
                className={cn(ITEM_CLASS, VARIANT_CLASS[variant ?? "default"])}
              >
                <Icon className="h-4 w-4" /> {text}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
