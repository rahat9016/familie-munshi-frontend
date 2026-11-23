"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MobileNavSkeleton from "./Skeleton/MobileNavSkeleton";
import { useClassificationTree } from "./useNavigation";

interface MobileGenderSectionProps {
  rootId: string;
  name: string;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}

/**
 * One root (Men / Women / Kids) in the mobile drawer accordion:
 * root → parent category → category → segment → sub-category. The tree is fetched only
 * once the section is opened (cached afterwards).
 */
export default function MobileGenderSection({
  rootId,
  name,
  open,
  onToggle,
  onNavigate,
}: MobileGenderSectionProps) {
  const { navLinks, isLoading } = useClassificationTree(
    open ? rootId : undefined
  );
  const [openCat, setOpenCat] = useState<string | null>(null);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => {
          onToggle();
          setOpenCat(null);
        }}
        className="flex w-full items-center justify-between px-3 py-3 text-base font-bold text-secondary"
      >
        {name}
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="pb-2">
          {isLoading ? (
            <MobileNavSkeleton />
          ) : (
            navLinks.map((cat) => {
              const key = cat.id ?? cat.label;
              const catOpen = openCat === key;
              const columns = cat.menu?.columns ?? [];
              const expandable = columns.length > 0 && !cat.isHighlighted;

              return (
                <div key={key}>
                  <div className="flex items-center">
                    <Link
                      href={cat.href}
                      onClick={onNavigate}
                      className={`flex-1 px-4 py-2 text-sm ${
                        cat.isHighlighted ? "font-bold text-red-500" : "text-secondary"
                      }`}
                    >
                      {cat.label}
                    </Link>
                    {expandable && (
                      <button
                        type="button"
                        onClick={() => setOpenCat(catOpen ? null : key)}
                        className="px-3 py-2 text-gray-400"
                        aria-label="expand"
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${catOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {expandable && catOpen && (
                    <div className="ml-3 border-l border-gray-100 pl-3">
                      {columns
                        .flatMap((col) => col.items)
                        .map((s) => (
                          <Link
                            key={s.href}
                            href={s.href}
                            onClick={onNavigate}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-primary"
                          >
                            {s.label}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
