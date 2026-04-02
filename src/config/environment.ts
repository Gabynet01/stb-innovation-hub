/** API origin only (scheme + host + port). No path. */
export const API_ORIGIN =
  (process.env.REACT_APP_API_BASE_URL || "").trim() ||
  "http://127.0.0.1:8000";

/** IdeaHub REST prefix (FastAPI). */
export const API_PREFIX_PATH = "/api/v1";

export const API_BASE_URL = API_ORIGIN;

export const config = {
  api: {
    baseUrl: API_ORIGIN,
    versionPrefix: API_PREFIX_PATH,
    timeout: 30000,
  },
  app: {
    name: "Idea Flow",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },
  features: {
    enableNotifications: true,
    enableSearch: true,
    enableFilters: true,
    /** Integrated with IdeaHub (ideas, auth, catalogs). Legacy AI cluster/topic APIs are off. */
    useIdeahubBackend: true,
  },
  ui: {
    theme: "light",
    language: "en",
    dateFormat: "en-US",
    timeFormat: "24h",
  },
};

export default config;
