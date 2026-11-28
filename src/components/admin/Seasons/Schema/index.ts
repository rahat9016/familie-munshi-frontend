import {
  DEFAULT_SEASON_STATUS,
  SEASON_NAME_MAX,
  SEASON_STATUSES,
  SeasonStatus,
} from "@/src/types/season";
import * as Yup from "yup";

export const seasonSchema = Yup.object({
  season: Yup.string()
    .trim()
    .required("Season name is required")
    .max(SEASON_NAME_MAX, `Season name must be at most ${SEASON_NAME_MAX} characters`),
  status: Yup.mixed<SeasonStatus>()
    .oneOf([...SEASON_STATUSES], "Select a valid status")
    .default(DEFAULT_SEASON_STATUS)
    .required("Status is required"),
});

export type SeasonFormType = Yup.InferType<typeof seasonSchema>;
