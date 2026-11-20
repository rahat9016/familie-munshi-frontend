"use client";

import { useAccessibleMenuItems } from "@/src/hooks/useAccessibleMenuItems";
import { cn } from "@/src/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarMenuGroup from "./SidebarMenuGroup";
import SidebarMenuItem from "./SidebarMenuItem";

interface SidebarMenuProps {
  isCollapsed?: boolean;
  onNavigate: () => void;
}

export default function SidebarMenu({
  isCollapsed = false,
  onNavigate,
}: SidebarMenuProps) {
  const pathname = usePathname();

  const menuItems = useAccessibleMenuItems();

  // Track which menu items are expanded
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand parent item if a child is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => {
          if (pathname === child.href) return true;
          if (child.href !== "/admin" && pathname.startsWith(child.href))
            return true;
          if (
            child.matchRoutes &&
            child.matchRoutes.some((r) => pathname.startsWith(r))
          )
            return true;
          return false;
        });
        if (hasActiveChild && !expandedItems.includes(item.label)) {
          setExpandedItems((prev) => [...prev, item.label]);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  return (
    <nav
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar mt-4",
        isCollapsed && "scrollbar-hide"
      )}
    >
      <div className="flex flex-col gap-1 py-1">
        {menuItems.map((item, index) => {
          const showSegment =
            !!item.segment &&
            (index === 0 || menuItems[index - 1]?.segment !== item.segment);
          const isExpanded = expandedItems.includes(item.label);

          if (item.children) {
            return (
              <SidebarMenuGroup
                key={item.label}
                item={item}
                showSegment={showSegment}
                isExpanded={isExpanded}
                isCollapsed={isCollapsed}
                onToggleExpand={toggleExpand}
                onNavigate={onNavigate}
              />
            );
          }

          return (
            <SidebarMenuItem
              key={item.label}
              item={item}
              showSegment={showSegment}
              isCollapsed={isCollapsed}
              onNavigate={onNavigate}
            />
          );
        })}
      </div>
    </nav>
  );
}
