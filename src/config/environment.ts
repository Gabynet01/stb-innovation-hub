// Environment Configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || "http://localhost:9000",
    version: "v1",
    timeout: 30000, // 30 seconds
  },

  // Application Configuration
  app: {
    name: "Digital Suggestion Box",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },

  // Feature Flags
  features: {
    enableNotifications: true,
    enableSearch: true,
    enableFilters: true,
  },

  // UI Configuration
  ui: {
    theme: "light", // light | dark
    language: "en",
    dateFormat: "en-US",
    timeFormat: "24h",
  },
};

export default config;
