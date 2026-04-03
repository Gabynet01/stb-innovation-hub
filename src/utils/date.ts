/**
 * Formats a date string to a readable format
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return date.toLocaleDateString("en-US", defaultOptions);
}

/**
 * Formats a date string to include date and time (locale-aware).
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * User-facing line for a generated document row (idea detail / documents list).
 */
export function formatDocumentGenerationLabel(
  generationStatus: string,
  createdAt: string,
  updatedAt: string
): string {
  const line = (prefix: string, iso: string) => {
    const t = new Date(iso).getTime();
    const body = Number.isNaN(t) ? "—" : formatDateTime(iso);
    return `${prefix} ${body}`;
  };
  if (generationStatus === "completed") {
    return line("Generated", updatedAt);
  }
  if (generationStatus === "pending") {
    return line("Requested", createdAt);
  }
  return line("Last updated", updatedAt);
}

/**
 * Gets relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  }

  return formatDate(dateString);
}

/**
 * Checks if a date is today
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();

  return date.toDateString() === today.toDateString();
}

/**
 * Checks if a date is this week
 */
export function isThisWeek(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(
    today.setDate(today.getDate() - today.getDay() + 6)
  );

  return date >= startOfWeek && date <= endOfWeek;
}

/**
 * Gets the start of a day
 */
export function getStartOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Gets the end of a day
 */
export function getEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}
