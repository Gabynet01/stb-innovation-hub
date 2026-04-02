import React from "react";
import { Card, Stepper, ConfirmationModal } from "../../../components/ui";
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
import {
  PAGE_HERO_HEADER_CLASS,
  PAGE_HERO_PATTERN_LIGHT,
  PAGE_HERO_SURFACE,
} from "@/constants/pageHero";
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 via-slate-50 to-neutral-100/90">
      <header className={PAGE_HERO_HEADER_CLASS}>
        <div className={PAGE_HERO_SURFACE} aria-hidden />
        <div
          className="absolute inset-0 opacity-80"
          style={{ backgroundImage: PAGE_HERO_PATTERN_LIGHT }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-20 top-1/4 h-56 w-56 rounded-full bg-indigo-200/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 top-6 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-5 pt-6 sm:px-6 sm:pb-6 sm:pt-7">
          {/* Editing: return to list. Guest new idea: return to staff sign-in. */}
          {onCancel && editing ? (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
            >
              ← Back to ideas
            </button>
          ) : null}
          {onCancel && !editing && !isAuthenticated ? (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
            >
              ← Back to sign in
            </button>
          ) : null}

          <div
            className={
              (onCancel && editing) || (onCancel && !editing && !isAuthenticated)
                ? 'mt-4'
                : ''
            }
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-[11px]">
              Stanbic Bank · Innovation
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-[2rem]">
              {editing ? "Refine your idea" : "Share a new idea"}
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-gray-600 sm:text-sm">
              {editing
                ? "Update details below, then review and save."
                : "Start with the source, then category, then title and description. No file uploads — IdeaHub stores title and description only."}
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200/90 bg-white/90 px-3 py-3 shadow-sm sm:mt-6 sm:px-4 sm:py-4">
            <Stepper
              steps={formSteps}
              currentStep={currentStep}
              loading={loading}
            />
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-4xl space-y-5 px-4 pb-16 pt-5 sm:px-6">
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
          className="border-0 bg-white/95 shadow-[0_18px_50px_-24px_rgba(0,51,161,0.44),0_10px_22px_-16px_rgba(15,23,42,0.28)] ring-1 ring-slate-200/70 backdrop-blur-[1.5px]"
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
