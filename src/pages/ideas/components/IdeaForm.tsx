import React, { useMemo } from "react";
import {
  Card,
  ConfirmationModal,
  PageHeader,
  Stepper,
  type BreadcrumbItem,
} from "@/components/ui";
import {
  useConfirmation,
  useIdeaForm,
  IdeaFormData,
} from "../../../hooks";
import type { Idea } from "../../../types/api";
import {
  SourceStep,
  CategoryStep,
  ContentStep,
  ContactInfoStep,
  ReviewStep,
  FormNavigation,
  FormStatus,
} from "./form-steps";
import { getIdeaFormSteps } from "../../../constants/idea-form";
import type {
  IdeahubIdeaCategory,
  IdeahubIdeaSource,
} from "@/types/ideahub";
import { useAuth } from "@/contexts/AuthContext";

interface IdeaFormProps {
  sources: IdeahubIdeaSource[];
  categories: IdeahubIdeaCategory[];
  onSubmit: (data: IdeaFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
  editingIdea?: Idea | null;
}

export const IdeaForm: React.FC<IdeaFormProps> = ({
  sources,
  categories,
  onSubmit,
  onCancel,
  loading = false,
  error,
  editingIdea,
}) => {
  const { isAuthenticated } = useAuth();
  const formSteps = getIdeaFormSteps(isAuthenticated);
  const stepLabels = formSteps.map((s) => s.label);

  const {
    currentStep,
    maxStep,
    formData,
    errors,
    expandedSections,
    handleInputChange,
    nextStep,
    prevStep,
    canSubmit,
    toggleSection,
    resetForm,
    goToStep,
    buildBodyForSubmit,
  } = useIdeaForm(editingIdea || null, loading, isAuthenticated);

  const { confirmation, showConfirmation, hideConfirmation } = useConfirmation();

  const editing = !!editingIdea;

  const formBreadcrumbs: BreadcrumbItem[] = useMemo(() => {
    if (editing) {
      return [{ label: "Idea Bank", to: "/ideas" }, { label: "Edit idea" }];
    }
    if (isAuthenticated) {
      return [
        { label: "Idea Bank", to: "/ideas" },
        { label: "New submission" },
      ];
    }
    return [
      { label: "Staff sign in", to: "/login" },
      { label: "Guest submission" },
    ];
  }, [editing, isAuthenticated]);

  const formTitle = editing ? "Refine your idea" : "Share a new idea";
  const formDescription = editing
    ? "Update details below, then review and save."
    : "Start with the source, then category, then title and description. No file uploads — IdeaHub stores title and description only.";

  const handleSubmit = () => {
    if (!canSubmit()) return;

    const message = editingIdea
      ? "Are you sure you want to update this idea?"
      : "Are you sure you want to submit this idea?";

    showConfirmation(
      {
        title: editingIdea ? "Update idea" : "Submit your idea",
        message,
        type: "question",
      },
      async () => {
        if (formData.source_id == null || formData.category_id == null) return;

        const data: IdeaFormData = {
          source_id: formData.source_id,
          category_id: formData.category_id,
          title: formData.title.trim(),
          body: buildBodyForSubmit(),
          contact: {
            email: formData.contact.email,
            phone: formData.contact.phone,
          },
          attachments: [],
        };

        await onSubmit(data);
      }
    );
  };

  const handleClearForm = () => {
    showConfirmation(
      {
        title: "Clear form",
        message:
          "Are you sure you want to clear the form? This action cannot be undone.",
        type: "warning",
      },
      () => {
        resetForm();
        hideConfirmation();
      }
    );
  };

  const handleEditStep = (step: number) => {
    goToStep(step);
  };

  const showReview =
    (isAuthenticated && currentStep === 4) ||
    (!isAuthenticated && currentStep === 5);

  return (
    <div className="min-h-screen bg-stanbic-canvas">
      <PageHeader
        breadcrumbs={formBreadcrumbs}
        title={formTitle}
        description={formDescription}
      />

      <div className="mx-auto max-w-4xl space-y-5 px-4 pb-16 pt-8 sm:px-6">
        <Card className="border-stanbic-border p-4 shadow-sm sm:p-5">
          <Stepper
            steps={formSteps}
            currentStep={currentStep}
            loading={loading}
          />
        </Card>

        <FormStatus error={error} loading={loading} />

        {currentStep === 1 && (
          <SourceStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            sources={sources}
          />
        )}

        {currentStep === 2 && (
          <CategoryStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            categories={categories}
          />
        )}

        {currentStep === 3 && (
          <ContentStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        )}

        {currentStep === 4 && !isAuthenticated && (
          <ContactInfoStep
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
          />
        )}

        {showReview && (
          <ReviewStep
            formData={formData}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onEditStep={handleEditStep}
            sources={sources}
            categories={categories}
            isAuthenticated={isAuthenticated}
          />
        )}

        <Card
          padding="none"
          rounded="xl"
          className="border-stanbic-border shadow-sm"
        >
          <div className="px-4 py-3 sm:px-5 sm:py-4">
            <FormNavigation
              currentStep={currentStep}
              maxStep={maxStep}
              stepLabels={stepLabels}
              canSubmit={canSubmit()}
              loading={loading}
              editingIdea={!!editingIdea}
              onPrevStep={prevStep}
              onNextStep={nextStep}
              onSubmit={handleSubmit}
              onClearForm={handleClearForm}
            />
          </div>
        </Card>
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
    </div>
  );
};
