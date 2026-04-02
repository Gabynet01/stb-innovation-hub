import React from "react";
import { IdeaFormStepIntro } from "./IdeaFormStepHeader";
import {
  ideaFormPanelClass,
  ideaFormSectionLabelClass,
} from "./ideaFormStyles";
import { Input, Textarea } from "../../../../components/ui";
import { FormData } from "../../../../hooks";

interface ContentStepProps {
  formData: FormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof FormData, value: unknown) => void;
}

export const ContentStep: React.FC<ContentStepProps> = ({
  formData,
  errors,
  onInputChange,
}) => {
  return (
    <div className="mb-1">
      <IdeaFormStepIntro
        title="Your idea"
        description="Idea title and description are saved to IdeaHub as the idea record."
      />

      <div className={`${ideaFormPanelClass} divide-y divide-slate-100`}>
        <section className="pb-6">
          <p className={ideaFormSectionLabelClass}>Idea</p>
          <div className="mt-3">
            <label className="mb-2 block text-sm font-medium text-slate-800">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => onInputChange("title", e.target.value)}
              placeholder="Short headline for your idea"
              maxLength={255}
              inputSize="md"
              variant={errors.title ? "danger" : "default"}
            />
            {errors.title && (
              <p className="mt-1.5 text-sm text-red-600">{errors.title}</p>
            )}
            <span className="mt-1 block text-right text-xs text-slate-400">
              {formData.title.length}/255
            </span>
          </div>
        </section>

        <section className="pt-6">
          <label className="mb-2 block text-sm font-medium text-slate-800">
            Description *
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Describe your idea clearly and concisely."
            rows={10}
            variant={errors.description ? "danger" : "default"}
          />
          {errors.description && (
            <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
          )}
          <span className="mt-1 block text-right text-xs text-slate-400">
            {formData.description.length.toLocaleString()}/10,000
          </span>
        </section>
      </div>
    </div>
  );
};
