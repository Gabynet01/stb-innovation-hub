export const STATUS_COLORS = {
  pending: "border-blue-200 bg-blue-50 text-blue-800",
  approved: "border-green-200 bg-green-50 text-green-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
  in_progress: "border-amber-200 bg-amber-50 text-amber-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
} as const;

export const PRIORITY_COLORS = {
  low: "border-gray-200 bg-gray-50 text-gray-800",
  medium: "border-blue-200 bg-blue-50 text-blue-800",
  high: "border-amber-200 bg-amber-50 text-amber-800",
  critical: "border-red-200 bg-red-50 text-red-800",
} as const;

export const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  in_progress: "In Progress",
  completed: "Completed",
} as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
] as const;

export const PRIORITY_ORDER = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
} as const;

export const STATUS_ORDER = {
  pending: 1,
  in_progress: 2,
  approved: 3,
  completed: 4,
  rejected: 5,
} as const;

export const APP_CONFIG = {
  name: "Idea Flow",
  description: "Stanbic Bank's Innovation Platform",
  tagline: "Empowering Ideas, Driving Innovation",
  version: "1.0.0",
} as const;

export * from "./idea-form";
export * from "./pageHero";
export * from "./referenceData";
