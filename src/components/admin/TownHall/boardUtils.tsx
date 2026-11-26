"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

/** ৳ formatted money, no decimals */
export const money = (value: number) => `৳${value.toLocaleString("en-US")}`;

/** plain grouped number */
export const count = (value: number) => value.toLocaleString("en-US");

interface BoardCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Shared card shell wrapping every board on the Town Hall dashboard */
export function BoardCard({
  title,
  subtitle,
  icon: Icon,
  gradient,
  badge,
  children,
  className = "",
}: BoardCardProps) {
  return (
    <section
      className={`bg-white rounded-lg border border-light-dark shadow-sm overflow-hidden ${className}`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-light-dark">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-linear-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-secondary-dark truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-secondary-foreground mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {badge}
      </header>
      {children}
    </section>
  );
}

/** Label + mono value chip used for Article Number / PO Number */
export function KeyChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center rounded-md overflow-hidden border border-light-dark shrink-0">
      <span className="px-2.5 py-1.5 text-[11px] font-medium text-secondary-foreground bg-light">
        {label}
      </span>
      <span className="px-2.5 py-1.5 text-[11px] sm:text-xs font-semibold text-secondary-dark font-mono tracking-tight">
        {value}
      </span>
    </div>
  );
}

/** Small rounded status/label chip used inside table cells */
export function Pill({
  children,
  tone = "neutral",
  dot = false,
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info" | "brand";
  dot?: boolean;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-light text-secondary-gary border-light-dark",
    success: "bg-emerald-50 text-emerald-600 border-emerald-200",
    warning: "bg-amber-50 text-amber-600 border-amber-200",
    danger: "bg-red-50 text-red-500 border-red-200",
    info: "bg-sky-50 text-sky-600 border-sky-200",
    brand: "bg-primary/10 text-primary border-primary/20",
  };
  const dots: Record<string, string> = {
    neutral: "bg-secondary-gary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-sky-500",
    brand: "bg-primary",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />}
      {children}
    </span>
  );
}
