import React from "react";
import { IdeaDetail } from "./IdeaDetail";
import { Idea } from "@/types/api";
import type { IdeahubIdeaAssessment } from "@/types/ideahub";

export interface IdeaDetailViewProps {
  selectedIdea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => Promise<void>;
  onBack: () => void;
  onAssessmentSaved?: (assessment: IdeahubIdeaAssessment) => void;
}

export const IdeaDetailView: React.FC<IdeaDetailViewProps> = ({
  selectedIdea,
  onEdit,
  onDelete,
  onBack,
  onAssessmentSaved,
}) => {
  return (
    <div className="flex w-full flex-col">
      <IdeaDetail
        idea={selectedIdea}
        onEdit={() => onEdit(selectedIdea)}
        onDelete={(id) => {
          void onDelete(id);
        }}
        onClose={onBack}
        onAssessmentSaved={onAssessmentSaved}
      />
    </div>
  );
};
