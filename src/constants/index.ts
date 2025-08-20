// Status Colors for UI badges - Stanbic Bank Zambia Brand
export const STATUS_COLORS = {
  pending: "border-stanbic-gold-200 bg-stanbic-gold-50 text-stanbic-gold-800",
  approved: "border-green-200 bg-green-50 text-green-800",
  rejected: "border-red-200 bg-red-50 text-red-800",
  in_progress: "border-stanbic-200 bg-stanbic-50 text-stanbic-700",
  completed: "border-corporate-200 bg-corporate-50 text-corporate-800",
} as const;

// Priority Colors for UI badges - Stanbic Bank Zambia Brand
export const PRIORITY_COLORS = {
  low: "border-corporate-200 bg-corporate-50 text-corporate-800",
  medium: "border-stanbic-gold-200 bg-stanbic-gold-50 text-stanbic-gold-800",
  high: "border-stanbic-200 bg-stanbic-50 text-stanbic-700",
  critical: "border-red-200 bg-red-50 text-red-800",
} as const;

// Status Labels for UI display
export const STATUS_LABELS = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  in_progress: "In Progress",
  completed: "Completed",
} as const;

// Sort Options for suggestions
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
] as const;

// Priority Order for sorting
export const PRIORITY_ORDER = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
} as const;

// Status Order for sorting
export const STATUS_ORDER = {
  pending: 1,
  in_progress: 2,
  approved: 3,
  completed: 4,
  rejected: 5,
} as const;
