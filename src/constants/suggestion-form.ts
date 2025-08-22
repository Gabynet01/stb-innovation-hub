export const categoryOptions = [
  {
    value: "UX" as const,
    label: "User Experience",
    description: "Improvements to customer interfaces and user interactions",
  },
  {
    value: "PRODUCT" as const,
    label: "Product & Services",
    description: "New products or service enhancements",
  },
  {
    value: "SERVICE" as const,
    label: "Service & Support",
    description: "Customer service improvements and support processes",
  },
  {
    value: "OPERATIONAL" as const,
    label: "Operational & Process",
    description: "Internal process optimization and efficiency",
  },
  {
    value: "OTHER" as const,
    label: "Other",
    description: "General improvements and miscellaneous ideas",
  },
];

export const authorTypeOptions = [
  {
    value: "STAFF" as const,
    label: "Staff Member",
    description: "Internal employee or team member",
  },
  {
    value: "CUSTOMER" as const,
    label: "Customer",
    description: "External customer or client",
  },
];

export const formSteps = [
  { number: 1, label: "Basic Info", key: "basicInfo" },
  { number: 2, label: "Contact", key: "contactInfo" },
  { number: 3, label: "Files", key: "attachments" },
  { number: 4, label: "Review", key: "review" },
];

export const fileTypes = {
  accept: ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif",
  description: "Support for PDF, DOC, DOCX, TXT, JPG, PNG, GIF files",
};
