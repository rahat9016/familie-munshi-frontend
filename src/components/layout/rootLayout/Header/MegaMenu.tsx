"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MegaMenuData } from "./megaMenuData";

interface MegaMenuProps {
  data: MegaMenuData;
  /** changes per category — used to crossfade the content on switch */
  menuKey: string;
  onNavigate?: () => void;
}

/** Full-width category mega-menu panel (3 icon columns + promo card). */
export default function MegaMenu({ data, menuKey, onNavigate }: MegaMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute inset-x-0 top-full z-40 border-t border-gray-100 bg-white shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
    >
      <motion.div
        key={menuKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="container grid grid-cols-4 gap-6 pt-2 pb-0 min-[1024px]:max-[1480px]:pt-1"
      >
        {data.columns.map((col, colIdx) => (
          <div key={col.id ?? `${col.heading}-${colIdx}`}>
            <h4
              className={`text-base font-bold text-gray-400 pb-0 ${
                menuKey === "Custom-Teamwear" || col.items.length <= 5 ? "text-left" : "text-center"
              }`}
            >
              {col.heading}
            </h4>
            {/* Conditional layout: 5 items per sub-column normally, but Custom-Teamwear items stack in a single column */}
            <ul
              className={
                menuKey === "Custom-Teamwear"
                  ? "flex flex-col gap-0.5 min-[1024px]:max-[1480px]:gap-1"
                  : "grid grid-flow-col grid-rows-5 gap-x-2 xl:gap-x-4 min-[1024px]:max-[1480px]:gap-x-3"
              }
            >
              {col.items.map(({ label, href, icon: Icon, iconUrl, highlight }) => (
                <li key={href} className="">
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={`group/i flex items-center gap-0.5 xl:gap-3 rounded-md px-0 xl:px-2 -mx-2 text-xs xl:sm transition-colors duration-150 ${
                      menuKey === "Custom-Teamwear" ? "py-0" : "py-0.5 xl:py-1.5"
                    } ${
                      highlight
                        ? "font-semibold text-red-500 hover:bg-red-50"
                        : "text-foreground hover:bg-light hover:text-primary"
                    }`}
                  >
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt=""
                        width={18}
                        height={18}
                        unoptimized
                        className="size-4.5 shrink-0 object-contain transition-transform duration-150 group-hover/i:scale-110"
                      />
                    ) : (
                      <Icon
                        size={18}
                        strokeWidth={1.6}
                        className="shrink-0 transition-transform duration-150 group-hover/i:scale-110"
                      />
                    )}
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
