"use client";

import { useGet } from "@/src/hooks/useGet";
import {
  GENDERS_FALLBACK,
  INavGroup,
  mapNavigation,
  NavLink,
  navByGenderFallback,
  NAVIGATION_API_ENABLED,
  NAVIGATION_ENDPOINT,
  type Gender,
} from "./navLinks";

export interface NavigationData {
  genders: Gender[];
  navByGender: Record<Gender, NavLink[]>;
  isLoading: boolean;
  /** true while the static fallback is being shown (no API data yet). */
  isFallback: boolean;
}

/**
 * Fetches the gender/category navigation tree from the API and normalizes it.
 * Falls back to the static nav while loading or if the API returns nothing,
 * so the header never renders empty. React Query dedupes by query key, so
 * calling this from multiple components shares one request.
 */
export function useNavigation(): NavigationData {
  const { data, isLoading } = useGet<INavGroup[]>(
    NAVIGATION_ENDPOINT,
    ["navigation"],
    undefined,
    { enabled: NAVIGATION_API_ENABLED }
  );

  const groups = data?.data;

  if (groups && groups.length > 0) {
    return { ...mapNavigation(groups), isLoading, isFallback: false };
  }

  return {
    genders: GENDERS_FALLBACK,
    navByGender: navByGenderFallback,
    isLoading,
    isFallback: true,
  };
}
