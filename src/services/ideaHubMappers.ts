import type { Idea } from "@/types/api";
import type {
  IdeahubIdea,
  IdeahubIdeaAssessment,
  IdeahubIdeaCategory,
  IdeahubIdeaSource,
} from "@/types/ideahub";

export function mapIdeahubStatusToUi(
  s: IdeahubIdea["status"]
): Idea["status"] {
  if (s === "draft") return "NEW";
  if (s === "rejected") return "ARCHIVED";
  return "PROCESSED";
}

/** Normalize assessment JSON (UUIDs → strings) for `Idea.assessment`. */
export function mapAssessment(
  a: IdeahubIdeaAssessment | null | undefined
): IdeahubIdeaAssessment | null | undefined {
  if (a === undefined) return undefined;
  if (a === null) return null;
  return {
    ...a,
    id: String(a.id),
    reviewed_by_user_id: String(a.reviewed_by_user_id),
  };
}

export function mapIdeahubIdeaToIdea(
  idea: IdeahubIdea,
  categoriesById: Map<number, IdeahubIdeaCategory>,
  sourcesById: Map<number, IdeahubIdeaSource>
): Idea {
  const cat = categoriesById.get(idea.category_id);
  const src = sourcesById.get(idea.source_id);

  return {
    id: String(idea.id),
    source_id: idea.source_id,
    category_id: idea.category_id,
    source_label: src?.name ?? `Source #${idea.source_id}`,
    category_label: cat?.name ?? `Category #${idea.category_id}`,
    title: idea.title,
    body: idea.description,
    contact: {
      email: idea.submitter_email,
      phone: idea.submitter_phone,
    },
    attachments: [],
    author_type: idea.submitter_type === "internal" ? "STAFF" : "CUSTOMER",
    status: mapIdeahubStatusToUi(idea.status),
    created_at: idea.created_at,
    updated_at: idea.updated_at,
    archived_at: null,
    reference_number: idea.reference_number,
    ideahub_status: idea.status,
    assessment: mapAssessment(idea.assessment),
  };
}

export function buildCategoryMap(
  list: IdeahubIdeaCategory[]
): Map<number, IdeahubIdeaCategory> {
  return new Map(list.map((c) => [c.id, c]));
}

export function buildSourceMap(
  list: IdeahubIdeaSource[]
): Map<number, IdeahubIdeaSource> {
  return new Map(list.map((s) => [s.id, s]));
}
