import { ColorwayFlag, ColorwayTextField } from "@/src/types/colorway";
import { DetailRow } from "@/src/components/admin/shared/DetailFields";

export interface ColorwayDetailProps {
  /** Colorway UUID from the route. */
  colorwayId: string;
}

export const COLORWAY_DETAIL_TABS = ["Details", "Articles"] as const;
export type ColorwayDetailTab = (typeof COLORWAY_DETAIL_TABS)[number];

export type ColorwayDetailRow = DetailRow<ColorwayTextField, ColorwayFlag>;
