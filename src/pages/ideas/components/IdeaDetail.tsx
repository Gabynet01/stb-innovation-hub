import React, { useState } from "react";
import { Idea } from "@/types/api";
import type { IdeahubIdeaAssessment } from "@/types/ideahub";
import { ConfirmationModal, SegmentedTabs } from "@/components/ui";
import { useConfirmation } from "@/hooks/useConfirmation";
import { IdeaHeader } from "./IdeaHeader";
import { IdeaContent } from "./IdeaContent";
import { IdeaFooter } from "./IdeaFooter";
import { IdeaAssessmentSection } from "./IdeaAssessmentSection";
import { IdeaDocumentsSection } from "./IdeaDocumentsSection";
import { IdeaSimilarSection } from "./IdeaSimilarSection";
import {
  detailInnerColumn,
  detailMainPadding,
  detailOuterShell,
} from "./ideaDetailStyles";

type IdeaDetailTab = "details" | "assessment" | "documents" | "related";

interface IdeaDetailProps {
  idea: Idea;
  onClose: () => void;
  onEdit?: (idea: Idea) => void;
  onDelete?: (id: string) => void;
  /** Merge saved assessment into the open idea without relying on list refresh alone. */
  onAssessmentSaved?: (assessment: IdeahubIdeaAssessment) => void;
}

export const IdeaDetail: React.FC<IdeaDetailProps> = ({
  idea,
  onClose,
  onEdit,
  onDelete,
  onAssessmentSaved,
}) => {
  const { confirmation, showConfirmation, hideConfirmation } = useConfirmation();

  const handleDelete = () => {
    showConfirmation(
      {
        title: "Confirm deletion",
        message:
          "Are you sure you want to delete this idea? This action cannot be undone.",
        type: "danger",
      },
      () => {
        onDelete?.(idea.id);
        onClose();
      }
    );
  };

  const handleEdit = () => {
    onEdit?.(idea);
  };

  const [activeTab, setActiveTab] = useState<IdeaDetailTab>("details");
  const tabPanelId = "idea-detail-tabpanel";

  return (
    <>
      <div className={detailOuterShell}>
        <IdeaHeader idea={idea} onClose={onClose} />
        <main className={`${detailMainPadding} bg-slate-50/50`}>
          <div className={detailInnerColumn}>
            <SegmentedTabs<IdeaDetailTab>
              aria-label="Idea detail sections"
              panelId={tabPanelId}
              className="mb-8 w-full max-w-full"
              items={[
                { id: "details", label: "Details" },
                { id: "assessment", label: "Assessment" },
                { id: "documents", label: "Documents" },
                { id: "related", label: "Related ideas" },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />
            <div
              id={tabPanelId}
              role="tabpanel"
              aria-labelledby={`segmented-tab-${activeTab}`}
              className="min-h-[min(60vh,560px)]"
            >
              {activeTab === "details" ? (
                <IdeaContent idea={idea} />
              ) : null}
              {activeTab === "assessment" ? (
                <IdeaAssessmentSection
                  idea={idea}
                  onUpdated={(assessment) => onAssessmentSaved?.(assessment)}
                />
              ) : null}
              {activeTab === "documents" ? (
                <IdeaDocumentsSection idea={idea} />
              ) : null}
              {activeTab === "related" ? (
                <IdeaSimilarSection ideaId={idea.id} />
              ) : null}
            </div>
          </div>
        </main>
        <IdeaFooter onClose={onClose} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {confirmation && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          onClose={hideConfirmation}
          onConfirm={confirmation.onConfirm}
          title={confirmation.title}
          message={confirmation.message}
          type={confirmation.type}
        />
      )}
    </>
  );
};
