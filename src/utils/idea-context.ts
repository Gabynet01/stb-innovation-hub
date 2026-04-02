import type { IdeaWorkItemType } from "@/constants/referenceData";
import { IDEA_WORK_ITEM_LABELS } from "@/constants/referenceData";

export const IDEA_CONTEXT_MARKER = "\n\n---\n**Innovation context (Idea Flow)**\n";

export interface ParsedIdeaBody {
  coreDescription: string;
  organizationalUnit: string | null;
  workItemType: IdeaWorkItemType | null;
}

const labelToWorkItemType = (label: string): IdeaWorkItemType | null => {
  const t = label.trim().toLowerCase();
  if (t === "epic") return "EPIC";
  if (t === "user story") return "USER_STORY";
  if (t === "feature") return "FEATURE";
  return null;
};

export function parseIdeaContextFromBody(raw: string): ParsedIdeaBody {
  const idx = raw.indexOf(IDEA_CONTEXT_MARKER);
  if (idx === -1) {
    return {
      coreDescription: raw,
      organizationalUnit: null,
      workItemType: null,
    };
  }

  const coreDescription = raw.slice(0, idx);
  const block = raw.slice(idx + IDEA_CONTEXT_MARKER.length);
  let organizationalUnit: string | null = null;
  let workItemType: IdeaWorkItemType | null = null;

  for (const line of block.split("\n")) {
    const u = line.match(/^-\s*Organizational unit:\s*(.+)\s*$/i);
    if (u?.[1]) organizationalUnit = u[1].trim();

    const w = line.match(/^-\s*Work item framing:\s*(.+)\s*$/i);
    if (w?.[1]) workItemType = labelToWorkItemType(w[1]);
  }

  return { coreDescription, organizationalUnit, workItemType };
}

export function buildIdeaContextFooter(
  organizationalUnit: string | null | undefined,
  workItemType: IdeaWorkItemType | null | undefined
): string {
  if (!organizationalUnit && !workItemType) return "";

  const lines = ["---", "**Innovation context (Idea Flow)**"];
  if (organizationalUnit?.trim()) {
    lines.push(`- Organizational unit: ${organizationalUnit.trim()}`);
  }
  if (workItemType) {
    lines.push(
      `- Work item framing: ${IDEA_WORK_ITEM_LABELS[workItemType]}`
    );
  }
  return `\n\n${lines.join("\n")}`;
}

export function composeIdeaBodyWithContext(
  coreDescription: string,
  organizationalUnit: string | null | undefined,
  workItemType: IdeaWorkItemType | null | undefined
): string {
  const core = coreDescription.trimEnd();
  const footer = buildIdeaContextFooter(organizationalUnit, workItemType);
  return core + footer;
}
