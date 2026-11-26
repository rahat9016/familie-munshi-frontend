"use client";

import { cn } from "@/src/lib/utils";
import { CornerDownLeft, Loader2, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAdminPageSearch } from "./useAdminPageSearch";

const LISTBOX_ID = "admin-page-search-results";

/** Big header search — jumps to any admin page the user can access. */
export default function HeaderSearchBar() {
  const pathname = usePathname();
  const {
    containerRef,
    inputRef,
    query,
    open,
    isSearching,
    results,
    highlighted,
    setOpen,
    setActiveIndex,
    handleChange,
    handleKeyDown,
    clear,
    goTo,
  } = useAdminPageSearch();

  const showDropdown = open && (results.length > 0 || !isSearching);

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0 max-w-3xl">
      <div className="flex items-center h-11 rounded-lg border border-skeleton bg-gray-50 px-3 gap-2 transition-colors focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/15">
        {isSearching ? (
          <Loader2 className="w-4 h-4 shrink-0 animate-spin text-primary" />
        ) : (
          <Search className="w-4 h-4 shrink-0 text-[#8C8C8C]" />
        )}

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Search admin pages"
          aria-expanded={showDropdown}
          aria-controls={LISTBOX_ID}
          aria-autocomplete="list"
          aria-activedescendant={
            showDropdown && results[highlighted]
              ? `${LISTBOX_ID}-${highlighted}`
              : undefined
          }
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search pages…"
          className="flex-1 min-w-0 h-full bg-transparent text-sm text-secondary-dark placeholder:text-[#8C8C8C] outline-none"
        />

        {query ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={clear}
            className="p-1 rounded text-[#8C8C8C] hover:text-secondary-dark"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-skeleton bg-white px-1.5 py-0.5 text-[11px] font-medium text-[#8C8C8C]">
            Ctrl K
          </kbd>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 overflow-hidden rounded-lg border border-skeleton bg-white shadow-xl">
          {results.length > 0 ? (
            <ul id={LISTBOX_ID} role="listbox" className="max-h-80 overflow-y-auto py-1">
              {results.map((page, index) => {
                const isActive = index === highlighted;
                const isCurrent = pathname === page.href;
                return (
                  <li
                    key={page.href}
                    id={`${LISTBOX_ID}-${index}`}
                    role="option"
                    aria-selected={isActive}
                  >
                    <button
                      type="button"
                      onClick={() => goTo(page)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                        isActive && "bg-gray-100"
                      )}
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <page.icon className="w-4 h-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-secondary-dark">
                          {page.label}
                        </span>
                        {page.group && (
                          <span className="block truncate text-xs text-[#8C8C8C]">
                            {page.group}
                          </span>
                        )}
                      </span>
                      {isCurrent && (
                        <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                          Current
                        </span>
                      )}
                      {isActive && (
                        <CornerDownLeft className="w-3.5 h-3.5 shrink-0 text-[#8C8C8C]" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-[#8C8C8C]">
              No pages found for &quot;{query.trim()}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
