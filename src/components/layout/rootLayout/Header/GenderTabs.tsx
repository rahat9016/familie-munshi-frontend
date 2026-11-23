"use client";

import GenderTabsSkeleton from "./Skeleton/GenderTabsSkeleton";
import { useGender } from "./useGender";

/** Root classification pills (Men / Women / Kids — API-driven; drive the category nav). */
export default function GenderTabs() {
  const { gender, setGender, genders, rootsLoading } = useGender();

  if (rootsLoading) return <GenderTabsSkeleton />;

  return (
    <div className="flex items-center gap-1.5">
      {genders.map((tab) => {
        const on = gender === tab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => setGender(tab)}
            className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-all duration-200 ease-out cursor-pointer hover:-translate-y-0.5 active:scale-95 xl:px-4 ${
              on
                ? "bg-secondary text-white shadow-sm"
                : "text-foreground hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
