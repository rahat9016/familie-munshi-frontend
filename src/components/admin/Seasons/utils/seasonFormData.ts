import {
  DEFAULT_SEASON_STATUS,
  isSeasonStatus,
  ISeason,
  ISeasonCreatePayload,
  ISeasonUpdatePayload,
  SEASON_STATUSES,
} from "@/src/types/season";
import { SeasonFormType } from "../Schema";

/** Root key — invalidating it refreshes every season query. */
export const SEASONS_QUERY_KEY = "seasons";
export const SEASONS_ENDPOINT = "/seasons";

export const PRODUCT_DEVELOPMENT_ROUTE = "/admin/product-development";

export const seasonEndpoint = (id: string) => `${SEASONS_ENDPOINT}/${id}`;
export const seasonRoute = (id: string) => `${PRODUCT_DEVELOPMENT_ROUTE}/${id}`;

export const SEASON_STATUS_OPTIONS = SEASON_STATUSES.map((s) => ({
  label: s,
  value: s,
}));

/** Toolbar filter; value goes to redux `filter.sortBy`, "all" → "". */
export const SEASON_STATUS_FILTER_OPTIONS = [
  { label: "All Status", value: "all" },
  ...SEASON_STATUS_OPTIONS,
];

export const toStatusParam = (sortBy?: string) =>
  isSeasonStatus(sortBy) ? sortBy : undefined;

/** Entity → form defaults (create when `item` is omitted). */
export const toFormValues = (item?: ISeason): SeasonFormType => ({
  season: item?.season ?? "",
  status: item?.status ?? DEFAULT_SEASON_STATUS,
});

export const toCreatePayload = (data: SeasonFormType): ISeasonCreatePayload => ({
  season: data.season.trim(),
  status: data.status,
});

/** PATCH body: only changed fields. */
export const toUpdatePayload = (
  original: ISeason,
  data: SeasonFormType
): ISeasonUpdatePayload => {
  const body: ISeasonUpdatePayload = {};
  const season = data.season.trim();
  if (season && season !== original.season) body.season = season;
  if (data.status !== original.status) body.status = data.status;
  return body;
};
