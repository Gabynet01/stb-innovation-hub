import React from "react";
import type { Idea } from "@/types/api";
import { ASSESSMENT_CRITERIA } from "@/constants/assessment-criteria";
import { Button, Textarea } from "@/components/ui";
import type { DraftScores } from "../assessmentTypes";

interface AssessmentCriteriaFormProps {
  activeIdea?: Idea;
  scores: DraftScores;
  onScoresChange: React.Dispatch<React.SetStateAction<DraftScores>>;
  notes: string;
  onNotesChange: (v: string) => void;
  saving: boolean;
  isEditing: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const AssessmentCriteriaForm: React.FC<AssessmentCriteriaFormProps> = ({
  activeIdea,
  scores,
  onScoresChange,
  notes,
  onNotesChange,
  saving,
  isEditing,
  onSubmit,
  onCancel,
}) => (
  <section className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_32px_-16px_rgba(15,23,42,0.1)] ring-1 ring-slate-900/[0.03]">
    <div
      className="h-1.5 w-full bg-gradient-to-r from-[#0033A1] via-[#0051FF] to-[#50BEFF]"
      aria-hidden
    />
    <div className="p-6 sm:p-8">
      <header className="mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Scoring criteria
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Rate each dimension from <span className="font-semibold">1</span> to{" "}
          <span className="font-semibold">10</span>. The weighted score updates
          live in the preview.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          The idea is fixed for this session — adjust sliders, then save.
        </p>
      </header>

      {activeIdea && (
        <div className="mb-8 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-4">
          <p className="font-semibold text-slate-900">{activeIdea.title}</p>
          <p className="mt-1.5 text-xs text-slate-600">
            {activeIdea.reference_number && (
              <span>Ref. {activeIdea.reference_number} · </span>
            )}
            {activeIdea.category_label} · {activeIdea.source_label}
          </p>
        </div>
      )}

      <ol className="space-y-6">
        {ASSESSMENT_CRITERIA.map((c, index) => (
          <li
            key={c.key}
            className="relative rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/50 p-5 shadow-sm ring-1 ring-slate-900/[0.02] transition hover:border-[#0051FF]/20 hover:shadow-md"
          >
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-[#0051FF] to-[#0038CC] opacity-90" />
            <div className="pl-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0051FF]/10 text-xs font-bold text-[#0033A1] ring-1 ring-[#0051FF]/20">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {c.label}
                    </span>
                    <span className="rounded-md bg-[#0051FF]/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#0033A1] ring-1 ring-[#0051FF]/15">
                      {(c.weight * 100).toFixed(0)}% weight
                    </span>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {c.description}
                  </p>
                </div>
                <div
                  className="flex h-11 min-w-[2.75rem] items-center justify-center rounded-xl border border-slate-200/90 bg-white px-3 text-xl font-bold tabular-nums text-[#0033A1] shadow-inner"
                  aria-live="polite"
                >
                  {scores[c.key]}
                </div>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={scores[c.key]}
                onChange={(e) =>
                  onScoresChange((s) => ({
                    ...s,
                    [c.key]: Number(e.target.value),
                  }))
                }
                className="mt-5 h-2.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200/90 accent-[#0051FF] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#0051FF] [&::-webkit-slider-thumb]:shadow-md"
                aria-label={`${c.label}: ${scores[c.key]} out of 10`}
              />
              <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <span>1 — Low</span>
                <span>10 — High</span>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Analyst notes (optional)
        </label>
        <p className="mb-2 text-xs text-slate-500">
          Saved to IdeaHub with this assessment and shown wherever this score is
          displayed (assessment queue, idea detail).
        </p>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={5}
          placeholder="Rationale, risks, dependencies, or follow-ups…"
          className="border-slate-200 focus:border-[#0051FF] focus:ring-[#0051FF]/20"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-8">
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={saving}
          className="!min-h-[44px] !bg-[#0051FF] px-6 hover:!bg-[#0033A1]"
        >
          {saving ? "Saving…" : isEditing ? "Save changes" : "Submit assessment"}
        </Button>
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={saving}
          className="!min-h-[44px]"
        >
          Cancel
        </Button>
      </div>
    </div>
  </section>
);
