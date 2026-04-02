export type IdeaWorkItemType = "EPIC" | "USER_STORY" | "FEATURE";

export const IDEA_WORK_ITEM_OPTIONS: {
  value: IdeaWorkItemType;
  label: string;
  description: string;
}[] = [
  {
    value: "EPIC",
    label: "Epic",
    description: "Large initiative spanning multiple teams or releases",
  },
  {
    value: "USER_STORY",
    label: "User Story",
    description: "User-centric requirement or outcome",
  },
  {
    value: "FEATURE",
    label: "Feature",
    description: "Concrete product or service capability",
  },
];

export const IDEA_WORK_ITEM_LABELS: Record<IdeaWorkItemType, string> = {
  EPIC: "Epic",
  USER_STORY: "User Story",
  FEATURE: "Feature",
};

export const ORGANIZATIONAL_UNITS: {
  category: string;
  name: string;
  description: string;
}[] = [
  {
    category: "Core Banking",
    name: "Personal & Private Banking",
    description:
      "Retail banking, affluent and HNI customer segment products and services",
  },
  {
    category: "Core Banking",
    name: "Corporate & Investment Banking",
    description:
      "Large corporates, structured finance, capital markets, advisory",
  },
  {
    category: "Core Banking",
    name: "Business Banking",
    description: "SME and commercial banking segment",
  },
  {
    category: "Core Banking",
    name: "Wealth",
    description: "Investment advisory, asset management, wealth structuring",
  },
  {
    category: "Support Functions",
    name: "Human Capital Department",
    description:
      "Talent management, recruitment, performance management, learning & development",
  },
  {
    category: "Support Functions",
    name: "IT Department",
    description:
      "Core systems, infrastructure, cybersecurity, digital platforms",
  },
  {
    category: "Support Functions",
    name: "Marketing Department",
    description: "Brand, campaigns, communications, customer engagement",
  },
  {
    category: "Support Functions",
    name: "Finance Department",
    description: "Financial planning, reporting, budgeting, cost control",
  },
  {
    category: "Support Functions",
    name: "Procurement Department",
    description: "Vendor management, sourcing, contract management",
  },
  {
    category: "Support Functions",
    name: "Group Real Estate Services (GRES)",
    description: "Facilities, property management, physical infrastructure",
  },
  {
    category: "Support Functions",
    name: "Physical Security Department",
    description: "Security operations, surveillance, asset protection",
  },
  {
    category: "Support Functions",
    name: "Operations Department",
    description:
      "Back-office processing, service delivery, operational efficiency",
  },
  {
    category: "Risk & Control",
    name: "Credit Department",
    description: "Credit assessment, approvals, portfolio management",
  },
  {
    category: "Risk & Control",
    name: "Fraud & Financial Crime (FFC)",
    description: "Fraud prevention, AML, transaction monitoring",
  },
  {
    category: "Risk & Control",
    name: "Risk & Compliance",
    description: "Enterprise risk management, regulatory compliance",
  },
  {
    category: "Risk & Control",
    name: "Legal & Governance",
    description: "Legal advisory, contracts, governance frameworks",
  },
  {
    category: "Strategic Units",
    name: "Executive Office",
    description: "Executive leadership, strategy execution, coordination",
  },
  {
    category: "Distribution",
    name: "Branch Network",
    description: "Customer-facing banking operations across locations",
  },
  {
    category: "Other",
    name: "Other (Custom Units)",
    description: "Configurable units to accommodate future departments",
  },
];

export const ORGANIZATIONAL_UNIT_NAMES = ORGANIZATIONAL_UNITS.map((u) => u.name);
