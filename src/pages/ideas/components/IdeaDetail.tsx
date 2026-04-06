import React, { useState } from "react";
import { Idea } from "@/types/api";
import type { IdeahubIdeaAssessment, IdeahubIdeaStatus } from "@/types/ideahub";
import { Card, ConfirmationModal, SegmentedTabs } from "@/components/ui";
import { useConfirmation } from "@/hooks/useConfirmation";
import { IdeaHeader } from "./IdeaHeader";
import { IdeaContent } from "./IdeaContent";
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
  onStatusChange?: (status: IdeahubIdeaStatus) => Promise<void>;
}

export const IdeaDetail: React.FC<IdeaDetailProps> = ({
  idea,
  onClose,
  onEdit,
  onDelete,
  onAssessmentSaved,
  onStatusChange,
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
        <IdeaHeader
          idea={idea}
          onClose={onClose}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={onStatusChange}
        />
        <main className={detailMainPadding}>
          <div className={detailInnerColumn}>
            <Card
              padding="none"
              rounded="xl"
              className="flex min-h-0 flex-col overflow-hidden border border-stanbic-border bg-white shadow-[0_1px_2px_rgba(34,46,55,0.04)]"
            >
              <div className="shrink-0 space-y-3 px-4 pb-1 pt-4 sm:px-6 sm:pt-5">
                <SegmentedTabs<IdeaDetailTab>
                  aria-label="Idea detail sections"
                  variant="filled"
                  panelId={tabPanelId}
                  items={[
                    { id: "details", label: "Details" },
                    { id: "assessment", label: "Assessment" },
                    { id: "documents", label: "Documents" },
                    { id: "related", label: "Related" },
                  ]}
                  value={activeTab}
                  onChange={setActiveTab}
                />
              </div>
              <div
                id={tabPanelId}
                role="tabpanel"
                aria-labelledby={`segmented-tab-${activeTab}`}
                className={
                  activeTab === "details"
                    ? "flex min-h-[min(52vh,520px)] flex-1 flex-col overflow-hidden lg:min-h-[min(64vh,640px)]"
                    : "min-h-[min(50vh,480px)] p-5 sm:p-8"
                }
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
            </Card>
          </div>
        </main>
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
