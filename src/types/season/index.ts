/** Status labels — sent and received as the label, e.g. "On Process". */
export const SEASON_STATUSES = [
  "On Planning",
  "On Concept",
  "On Process",
  "Completed",
] as const;

export type SeasonStatus = (typeof SEASON_STATUSES)[number];

export const DEFAULT_SEASON_STATUS: SeasonStatus = "On Planning";

/** Season as returned by /seasons (list + detail). */
export interface ISeason {
  id: string;
  season: string;
  /** Computed, read-only (0 until the Style module exists). */
  numberOfStyles: number;
  status: SeasonStatus;
  createdAt: string;
  updatedAt: string;
}

/** POST /seasons body. Name is unique (case-insensitive), max 100. */
export interface ISeasonCreatePayload {
  season: string;
  status?: SeasonStatus;
}

/** PATCH /seasons/{id} body — omit (or blank name) = keep. */
export interface ISeasonUpdatePayload {
  season?: string;
  status?: SeasonStatus;
}

export interface ISeasonListQuery {
  search?: string;
  status?: SeasonStatus;
  /** Starts at 1. */
  page?: number;
  /** Max 100, default 20. */
  size?: number;
}

export const SEASON_NAME_MAX = 100;

export const isSeasonStatus = (value?: string | null): value is SeasonStatus =>
  (SEASON_STATUSES as readonly string[]).includes(value ?? "");
