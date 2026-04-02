import React from "react";
import {
  Squares2X2Icon,
  ChartBarIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { FormData } from "@/hooks";
import type { IdeahubIdeaCategory } from "@/types/ideahub";
import { IdeaFormStepIntro } from "./IdeaFormStepHeader";
import { ideaFormPanelClass } from "./ideaFormStyles";

const ICONS = [Squares2X2Icon, ChartBarIcon, RocketLaunchIcon, ShieldCheckIcon];

interface CategoryStepProps {
  formData: FormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof FormData, value: unknown) => void;
  categories: IdeahubIdeaCategory[];
}

export const CategoryStep: React.FC<CategoryStepProps> = ({
  formData,
  errors,
  onInputChange,
  categories,
}) => {
  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="mb-1">
      <IdeaFormStepIntro
        title="Idea Category"
        description="Choose the idea category. This maps to IdeaHub `category_id` and how the idea is routed for assessment."
      />
      <div className={ideaFormPanelClass}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sorted.map((cat, i) => {
            const Icon = ICONS[i % ICONS.length];
            const selected = formData.category_id === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onInputChange("category_id", cat.id)}
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
                  {cat.name}
                </span>
                {cat.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {cat.description}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
        {errors.category_id ? (
          <p className="mt-4 text-sm text-red-600">{errors.category_id}</p>
        ) : null}
      </div>
    </div>
  );
};
