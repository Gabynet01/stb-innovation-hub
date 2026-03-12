export const API_BASE_URL =
  (process.env.REACT_APP_API_BASE_URL || "").trim() || "http://localhost:9000";

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    version: "v1",
    timeout: 30000,
  },
  app: {
    name: "Digital Suggestion Box",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },
  features: {
    enableNotifications: true,
    enableSearch: true,
    enableFilters: true,
  },
  ui: {
    theme: "light",
    language: "en",
    dateFormat: "en-US",
    timeFormat: "24h",
  },
};

export default config;
