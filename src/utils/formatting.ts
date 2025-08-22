// Formatting utility functions for data display

// Helper function to get status color for display
export const getStatusColor = (status: string) => {
  switch (status) {
    case "NEW":
      return "bg-emerald-500";
    case "PROCESSED":
      return "bg-blue-500";
    case "ARCHIVED":
      return "bg-gray-500";
    default:
      return "bg-amber-500";
  }
};

// Helper function to get category display name
export const getCategoryDisplayName = (category: string) => {
  switch (category) {
    case "UX":
      return "UX";
    case "PRODUCT":
      return "Product";
    case "SERVICE":
      return "Service";
    case "OPERATIONAL":
      return "Operations";
    case "OTHER":
      return "Other";
    default:
      return category;
  }
};

// Helper function to format date for display
export const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays - 1} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
