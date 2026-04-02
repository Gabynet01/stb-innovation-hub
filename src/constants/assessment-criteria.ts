export const ASSESSMENT_CRITERIA = [
  {
    key: "potential_impact" as const,
    label: "Potential impact on business objectives",
    weight: 0.3,
    description:
      "Revenue growth, cost savings, and market expansion potential.",
  },
  {
    key: "feasibility" as const,
    label: "Feasibility & resource requirements",
    weight: 0.2,
    description: "Resources, technical feasibility, and time constraints.",
  },
  {
    key: "alignment" as const,
    label: "Alignment with strategic objectives",
    weight: 0.2,
    description: "Fit with organisational strategy and priorities.",
  },
  {
    key: "market_demand" as const,
    label: "Market demand & competitive advantage",
    weight: 0.2,
    description: "Customer demand and differentiation vs alternatives.",
  },
  {
    key: "innovation" as const,
    label: "Innovation & differentiation",
    weight: 0.1,
    description: "Novelty and uniqueness vs existing solutions.",
  },
];

export function computeWeightedScore(values: {
  potential_impact: number;
  feasibility: number;
  alignment: number;
  market_demand: number;
  innovation: number;
}): number {
  return Math.round(
    (values.potential_impact * 0.3 +
      values.feasibility * 0.2 +
      values.alignment * 0.2 +
      values.market_demand * 0.2 +
      values.innovation * 0.1) *
      100
  ) / 100;
}

export function priorityLabelFromScore(score: number): string {
  if (score >= 9) return "High priority";
  if (score >= 7) return "Significant priority";
  if (score >= 5) return "Moderate priority";
  if (score >= 3) return "Low priority";
  return "Very low priority";
}
