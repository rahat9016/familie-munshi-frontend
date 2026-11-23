"use client";

import { setGender as setGenderAction } from "@/src/lib/redux/features/gender/genderSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import type { Gender } from "./navLinks";
import { useClassificationTree, useNavigationRoots } from "./useNavigation";

/**
 * Header gender state. Selection lives in Redux; the roots (genders) and the
 * selected root's category tree come from the API (cached by React Query).
 * Defaults to the first root until the user picks one.
 */
export function useGender() {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((s) => s.gender.selected);
  const { roots, genders, isLoading: rootsLoading } = useNavigationRoots();

  // Effective gender: the user's pick if still valid, else the first root.
  const gender =
    selected && genders.includes(selected) ? selected : genders[0] ?? "";
  const rootId = roots.find((r) => r.name === gender)?.id;

  const { navLinks, isLoading: treeLoading } = useClassificationTree(rootId);

  const setGender = (g: Gender) => dispatch(setGenderAction(g));

  return {
    gender,
    setGender,
    genders,
    roots,
    navLinks,
    rootsLoading,
    /** true while either the roots or the selected root's tree is loading. */
    navLoading: rootsLoading || treeLoading,
  };
}
