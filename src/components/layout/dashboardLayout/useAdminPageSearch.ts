"use client";

import { useAccessibleMenuItems } from "@/src/hooks/useAccessibleMenuItems";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { type AdminSearchPage } from "./types";
import {
  ADMIN_SEARCH_DEBOUNCE_MS,
  filterPages,
  flattenMenuPages,
} from "./utils/adminPageSearch";

/**
 * Header page search: debounced filter over every admin page the user can
 * access, with dropdown open state, keyboard navigation and Ctrl/⌘+K focus.
 */
export function useAdminPageSearch() {
  const router = useRouter();
  const menuItems = useAccessibleMenuItems();
  const pages = useMemo(() => flattenMenuPages(menuItems), [menuItems]);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const debouncedQuery = useDebounce(query.trim(), ADMIN_SEARCH_DEBOUNCE_MS);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSearching = query.trim() !== debouncedQuery;
  const results = useMemo(
    () => filterPages(pages, debouncedQuery),
    [pages, debouncedQuery]
  );
  // Clamp instead of resetting in an effect when results shrink.
  const highlighted = Math.min(activeIndex, Math.max(results.length - 1, 0));

  // Close on outside click.
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // Ctrl/⌘ + K focuses the search from anywhere in the admin panel.
  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const goTo = (page: AdminSearchPage) => {
    setQuery("");
    setOpen(false);
    setActiveIndex(0);
    inputRef.current?.blur();
    router.push(page.href);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(0);
    setOpen(true);
  };

  const clear = () => {
    setQuery("");
    setActiveIndex(0);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setOpen(true);
        if (results.length) setActiveIndex((highlighted + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (results.length)
          setActiveIndex(
            (highlighted - 1 + results.length) % results.length
          );
        break;
      case "Enter": {
        e.preventDefault();
        // Debounce still pending → match against what is typed right now.
        const target = isSearching
          ? filterPages(pages, query)[0]
          : results[highlighted];
        if (target) goTo(target);
        break;
      }
      case "Escape":
        setOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return {
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
  };
}
