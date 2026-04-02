import React from "react";

export const IdeaFormStepIntro: React.FC<{
  title: string;
  description?: string;
}> = ({ title, description }) => (
  <div className="mb-5 flex items-start gap-3.5 sm:mb-6">
    <div
      className="mt-0.5 h-11 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-[#3B82F6] via-[#0051FF] to-[#0033A1] shadow-[0_0_0_4px_rgba(0,81,255,0.08)]"
      aria-hidden
    />
    <div className="min-w-0">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-[1.35rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600/95">
          {description}
        </p>
      ) : null}
    </div>
  </div>
);
