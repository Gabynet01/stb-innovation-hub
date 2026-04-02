import type { DraftScores } from "./assessmentTypes";

export const defaultScores: DraftScores = {
  potential_impact: 5,
  feasibility: 5,
  alignment: 5,
  market_demand: 5,
  innovation: 5,
};

export const PENDING_PAGE_SIZE = 20;
export const ASSESSED_PAGE_SIZE = 12;

/** Loaded idea bank size for this page; true scale needs server-side paging. */
export const IDEAS_FETCH_PAGE_SIZE = 5000;

export const STANBIC_HERO_PATTERN_SVG =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
