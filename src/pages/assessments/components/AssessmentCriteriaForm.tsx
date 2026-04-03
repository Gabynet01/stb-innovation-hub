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
  <section className="relative overflow-hidden rounded-2xl border border-stanbic-border bg-white shadow-sm">
    <div
      className="h-1.5 w-full bg-gradient-to-r from-stanbic-primary via-stanbic-secondary to-[#50BEFF]"
      aria-hidden
    />
    <div className="p-6 sm:p-8">
      <header className="mb-8 border-b border-stanbic-border/60 pb-6">
        <h2 className="text-lg font-semibold tracking-tight text-stanbic-text">
          Scoring criteria
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-stanbic-text/70">
          Rate each dimension from <span className="font-semibold">1</span> to{" "}
          <span className="font-semibold">10</span>. The weighted score updates
          live in the preview.
        </p>
        <p className="mt-2 text-xs text-stanbic-text/55">
          The idea is fixed for this session — adjust sliders, then save.
        </p>
      </header>

      {activeIdea && (
        <div className="mb-8 rounded-xl border border-stanbic-border/70 bg-stanbic-canvas/60 px-4 py-4">
          <p className="font-semibold text-stanbic-text">{activeIdea.title}</p>
          <p className="mt-1.5 text-xs text-stanbic-text/65">
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
            className="relative rounded-xl border border-stanbic-border/70 bg-gradient-to-br from-white to-stanbic-canvas/40 p-5 shadow-sm transition hover:border-stanbic-secondary/25 hover:shadow-md"
          >
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-gradient-to-b from-stanbic-secondary to-stanbic-primary opacity-90" />
            <div className="pl-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stanbic-secondary/10 text-xs font-bold text-stanbic-primary ring-1 ring-stanbic-secondary/20">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-stanbic-text">
                      {c.label}
                    </span>
                    <span className="rounded-md bg-stanbic-secondary/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-stanbic-primary ring-1 ring-stanbic-secondary/15">
                      {(c.weight * 100).toFixed(0)}% weight
                    </span>
                  </div>
                  <p className="mt-2.5 text-xs leading-relaxed text-stanbic-text/70 sm:text-sm">
                    {c.description}
                  </p>
                </div>
                <div
                  className="flex h-11 min-w-[2.75rem] items-center justify-center rounded-xl border border-stanbic-border bg-white px-3 text-xl font-bold tabular-nums text-stanbic-primary shadow-inner"
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
                className="mt-5 h-2.5 w-full cursor-pointer appearance-none rounded-full bg-stanbic-border/50 accent-stanbic-secondary [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-stanbic-secondary [&::-webkit-slider-thumb]:shadow-md"
                aria-label={`${c.label}: ${scores[c.key]} out of 10`}
              />
              <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-stanbic-text/40">
                <span>1 — Low</span>
                <span>10 — High</span>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-stanbic-text/50">
          Analyst notes (optional)
        </label>
        <p className="mb-2 text-xs text-stanbic-text/55">
          Saved to IdeaHub with this assessment and shown wherever this score is
          displayed (assessment queue, idea detail).
        </p>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={5}
          placeholder="Rationale, risks, dependencies, or follow-ups…"
          className="border-stanbic-border focus:border-stanbic-secondary focus:ring-stanbic-secondary/20"
        />
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-stanbic-border/60 pt-8">
        <Button
          variant="primary"
          onClick={onSubmit}
          loading={saving}
          className="!min-h-[44px] !bg-stanbic-secondary px-6 hover:!bg-stanbic-primary"
        >
          {isEditing ? "Save changes" : "Submit assessment"}
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
