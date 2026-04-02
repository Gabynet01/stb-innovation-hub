import React, { forwardRef } from "react";
import type { Idea } from "@/types/api";
import { computeWeightedScore, priorityLabelFromScore } from "@/constants/assessment-criteria";
import { priorityPresentation } from "../assessmentPriorityStyles";
import type { DraftScores } from "../assessmentTypes";
import { AssessmentEditorBanner } from "./AssessmentEditorBanner";
import { AssessmentCriteriaForm } from "./AssessmentCriteriaForm";
import { AssessmentPreviewSidebar } from "./AssessmentPreviewSidebar";

interface AssessmentWorkspaceProps {
  editingId: string | null;
  ideaId: string;
  activeIdea?: Idea;
  scores: DraftScores;
  setScores: React.Dispatch<React.SetStateAction<DraftScores>>;
  notes: string;
  setNotes: (v: string) => void;
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
}

export const AssessmentWorkspace = forwardRef<
  HTMLDivElement,
  AssessmentWorkspaceProps
>(function AssessmentWorkspace(
  {
    editingId,
    ideaId,
    activeIdea,
    scores,
    setScores,
    notes,
    setNotes,
    saving,
    onSave,
    onReset,
  },
  ref
) {
  const previewScore = computeWeightedScore(scores);
  const previewBand = priorityLabelFromScore(previewScore);
  const previewStyle = priorityPresentation(previewBand);
  const ideaTitle = activeIdea?.title ?? `Idea #${ideaId}`;

  return (
    <div
      ref={ref}
      id="assessment-workspace"
      className="scroll-mt-6 pb-24 lg:pb-0"
    >
      <AssessmentEditorBanner
        isEditing={!!editingId}
        ideaTitle={ideaTitle}
        onClose={onReset}
        saving={saving}
      />

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 lg:items-stretch">
        <div className="min-w-0 lg:col-span-7">
          <AssessmentCriteriaForm
            activeIdea={activeIdea}
            scores={scores}
            onScoresChange={setScores}
            notes={notes}
            onNotesChange={setNotes}
            saving={saving}
            isEditing={!!editingId}
            onSubmit={onSave}
            onCancel={onReset}
          />
        </div>
        <aside className="relative min-w-0 lg:col-span-5">
          <AssessmentPreviewSidebar
            previewScore={previewScore}
            previewBand={previewBand}
            previewStyle={previewStyle}
          />
        </aside>
      </div>
    </div>
  );
});
