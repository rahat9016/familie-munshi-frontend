"use client";

import { AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGender } from "./useGender";
import MegaMenu from "./MegaMenu";
import NavItemsSkeleton from "./Skeleton/NavItemsSkeleton";
import NavSearch from "./NavSearch";
import { useHeaderSearch } from "./useHeaderSearch";

export default function NavItems() {
  const pathname = usePathname();
  const { navLinks, navLoading } = useGender();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const search = useHeaderSearch();

  // Keyed by classification id, so switching root auto-closes the panel
  // (the old id isn't in the new root's links).
  const openLink = openMenu
    ? navLinks.find((l) => (l.id ?? l.label) === openMenu)
    : undefined;

  // Toggle arrows based on scroll position: left hidden at start, right hidden at end.
  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [navLinks]);

  const scrollBy = (dir: 1 | -1) =>
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  // Small delay so moving the cursor link → panel doesn't flicker.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };
  const close = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(null);
  };

  return (
    <nav
      className="relative hidden lg:block bg-white border-b border-gray-200"
      onMouseLeave={scheduleClose}
      onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
    >
      <div className="container flex items-center gap-3 py-0.5">
        {/* Category links + scroll arrows */}
        <div className="flex min-w-0 flex-1 items-center">
          {navLoading ? (
            <NavItemsSkeleton />
          ) : (
          <>
          {canLeft && (
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll categories left"
              className="mr-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-primary"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={updateArrows}
            className="flex min-w-0 flex-1 items-center gap-0 -ml-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
          {navLinks.map(({ id, label, href, isHighlighted, menu }) => {
            const key = id ?? label;
            const isActive =
              pathname === href || pathname.startsWith(href.split("?")[0] + "/");
            const isOpen = openMenu === key;
            // Only categories with children get a mega-menu.
            const expandable = !!menu?.columns.length && !isHighlighted;

            return (
              <Link
                key={key}
                href={href}
                onMouseEnter={() => (expandable ? open(key) : close())}
                className={`relative px-1 py-1.5 text-[14px] transition-colors whitespace-nowrap 2xl:text-sm after:absolute after:left-1 after:right-1 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary after:transition-transform after:duration-200 ${
                  isOpen ? "after:scale-x-100" : "after:scale-x-0"
                } ${
                  isHighlighted
                    ? "font-bold text-red-500 hover:text-red-600"
                    : isActive || isOpen
                      ? "text-primary font-semibold"
                      : "text-foreground hover:text-primary"
                }`}
              >
                {label}
              </Link>
            );
          })}
          </div>

          {canRight && (
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll categories right"
              className="ml-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-primary"
            >
              <ChevronRight size={18} />
            </button>
          )}
          </>
          )}
        </div>

        {/* Search on the right — fixed width */}
        <NavSearch
          searchRef={search.searchRef}
          inputRef={search.inputRef}
          searchQuery={search.searchQuery}
          showResults={search.showResults}
          isSearching={search.isSearching}
          searchResults={search.searchResults}
          setSearchQuery={search.setSearchQuery}
          setShowResults={search.setShowResults}
          handleSearch={search.handleSearch}
          clearSearch={search.clearSearch}
          handleProductClick={search.handleProductClick}
          onViewAllResults={search.handleViewAllResults}
        />
      </div>

      {/* Animated mega-menu panel on hover */}
      <AnimatePresence>
        {openLink?.menu && (
          <MegaMenu
            data={openLink.menu}
            menuKey={openLink.label}
            onNavigate={close}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
