/**
 * Counts ideas by IdeaHub `IdeaResponse.status` (see ideahub `StatusEnum`:
 * draft, under_review, approved, rejected, implemented).
 */
import type { Idea } from "@/types/api";
import type { IdeahubIdeaStatus } from "@/types/ideahub";

export const IDEAHUB_IDEA_STATUSES: readonly IdeahubIdeaStatus[] = [
  "draft",
  "under_review",
  "approved",
  "rejected",
  "implemented",
] as const;

export function emptyIdeaStatusCounts(): Record<IdeahubIdeaStatus, number> {
  return {
    draft: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    implemented: 0,
  };
}

export function aggregateIdeaStatusCounts(
  ideas: Idea[]
): Record<IdeahubIdeaStatus, number> {
  const counts = emptyIdeaStatusCounts();
  for (const i of ideas) {
    const st = i.ideahub_status;
    if (st != null && st in counts) {
      counts[st as IdeahubIdeaStatus] += 1;
    }
  }
  return counts;
}

export const IDEAHUB_STATUS_LABEL: Record<IdeahubIdeaStatus, string> = {
  draft: "Draft",
  under_review: "Under review",
  approved: "Approved",
  rejected: "Rejected",
  implemented: "Implemented",
};
