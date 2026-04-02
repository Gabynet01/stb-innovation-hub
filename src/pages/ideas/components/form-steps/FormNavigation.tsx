import React from "react";
import { Button } from "../../../../components/ui";

interface FormNavigationProps {
  currentStep: number;
  maxStep: number;
  /** Labels for each step in order (length === maxStep). */
  stepLabels: string[];
  canSubmit: boolean;
  loading: boolean;
  editingIdea: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
  onClearForm: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  maxStep,
  stepLabels,
  canSubmit,
  loading,
  editingIdea,
  onPrevStep,
  onNextStep,
  onSubmit,
  onClearForm,
}) => {
  const nextLabel =
    currentStep < maxStep ? stepLabels[currentStep] : undefined;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
      <div className="flex items-center justify-center sm:justify-start space-x-4">
        {currentStep > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onPrevStep}
            className="w-full border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900 sm:w-auto"
          >
            ← Back
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClearForm}
            className="w-full border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-800 sm:w-auto"
          >
            Clear form
          </Button>
        )}
      </div>

      {currentStep < maxStep ? (
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onNextStep}
          className="w-full bg-gradient-to-r from-[#0051FF] to-[#0047E6] hover:from-[#0047E6] hover:to-[#0038CC] sm:w-auto"
        >
          Continue to {nextLabel ?? "next"}
        </Button>
      ) : (
        <div>
          <Button
            type="button"
            variant="primary"
            size="md"
            className="w-full bg-gradient-to-r from-[#0051FF] to-[#0047E6] hover:from-[#0047E6] hover:to-[#0038CC] sm:w-auto"
            disabled={!canSubmit || loading}
            onClick={onSubmit}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting…
              </span>
            ) : editingIdea ? (
              "Update idea"
            ) : (
              "Submit idea"
            )}
          </Button>

          {!canSubmit && (
            <p className="mt-3 max-w-md text-sm text-slate-600">
              Complete earlier steps—source, idea category, user story, and contact
              (if required)—before you can submit.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
