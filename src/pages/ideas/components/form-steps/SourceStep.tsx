import React from "react";
import {
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { FormData } from "@/hooks";
import type { IdeahubIdeaSource } from "@/types/ideahub";
import { IdeaFormStepIntro } from "./IdeaFormStepHeader";
import { ideaFormPanelClass } from "./ideaFormStyles";

const ICONS = [LightBulbIcon, ChatBubbleLeftRightIcon, BuildingOffice2Icon, DocumentTextIcon];

interface SourceStepProps {
  formData: FormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof FormData, value: unknown) => void;
  sources: IdeahubIdeaSource[];
}

export const SourceStep: React.FC<SourceStepProps> = ({
  formData,
  errors,
  onInputChange,
  sources,
}) => {
  return (
    <div className="mb-1">
      <IdeaFormStepIntro
        title="Where does this idea come from?"
        description="Pick the collection source that matches how this idea was captured. This is stored on the idea record in IdeaHub."
      />
      <div className={ideaFormPanelClass}>
        {sources.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            No idea sources are available yet. Add sources in IdeaHub
            administration.
          </p>
        ) : null}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sources.map((src, i) => {
            const Icon = ICONS[i % ICONS.length];
            const selected = formData.source_id === src.id;
            return (
              <button
                key={src.id}
                type="button"
                onClick={() => onInputChange("source_id", src.id)}
                className={`flex flex-col items-start rounded-2xl border-2 p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0051FF] focus-visible:ring-offset-2 ${
                  selected
                    ? "border-[#0051FF] bg-[#F0F7FF] shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${
                    selected
                      ? "bg-[#0051FF] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <span className="text-base font-semibold text-slate-900">
                  {src.name}
                </span>
                {src.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {src.description}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
        {errors.source_id ? (
          <p className="mt-4 text-sm text-red-600">{errors.source_id}</p>
        ) : null}
      </div>
    </div>
  );
};
