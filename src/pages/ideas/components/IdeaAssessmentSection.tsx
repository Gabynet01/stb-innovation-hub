import React, { useCallback, useEffect, useState } from "react";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui";
import type { Idea } from "@/types/api";
import type { IdeahubIdeaAssessment } from "@/types/ideahub";
import { defaultScores } from "@/pages/assessments/assessmentConstants";
import type { DraftScores } from "@/pages/assessments/assessmentTypes";
import { AssessmentCriteriaForm } from "@/pages/assessments/components/AssessmentCriteriaForm";
import { AssessmentStickyPreview } from "@/pages/assessments/components/AssessmentStickyPreview";
import {
  ASSESSMENT_CRITERIA,
  computeWeightedScore,
  priorityLabelFromScore,
} from "@/constants/assessment-criteria";
import { priorityPresentation } from "@/pages/assessments/assessmentPriorityStyles";
import { formatDateTime } from "@/utils/date";
import { detailSectionLabel } from "./ideaDetailStyles";

interface IdeaAssessmentSectionProps {
  idea: Idea;
  /** Called after create/update succeeds with the API assessment payload. */
  onUpdated: (assessment: IdeahubIdeaAssessment) => void;
}

function scoresFromAssessment(a: IdeahubIdeaAssessment): DraftScores {
  return {
    potential_impact: a.potential_impact,
    feasibility: a.feasibility,
    alignment: a.alignment,
    market_demand: a.market_demand,
    innovation: a.innovation,
  };
}

function CriterionBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 10) * 100;
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-slate-700">{label}</span>
        <span className="tabular-nums text-sm font-bold text-[#0033A1]">
          {value}
          <span className="font-semibold text-slate-400">/10</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200/90">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#0033A1] to-[#0051FF]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function AssessmentReadOnlyLight({
  existing,
}: {
  existing: IdeahubIdeaAssessment;
}) {
  const bandStyle = priorityPresentation(existing.priority_band);
  const criteriaValues = scoresFromAssessment(existing);

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_4px_32px_-16px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.03]">
        <div className="border-b border-white/10 bg-gradient-to-br from-[#0033A1] via-[#0047CC] to-[#0051FF] px-6 py-6 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
                Weighted score
              </p>
              <p className="mt-2 font-mono text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">
                {existing.weighted_score.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-end">
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${bandStyle.badge}`}
              >
                {existing.priority_band}
              </span>
              <p className="text-xs text-white/80">
                Updated {formatDateTime(existing.updated_at)}
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 py-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Criteria breakdown
          </p>
          <div className="mt-4 space-y-5">
            {ASSESSMENT_CRITERIA.map((c) => (
              <CriterionBar
                key={c.key}
                label={c.label}
                value={criteriaValues[c.key]}
              />
            ))}
          </div>
        </div>
      </div>

      {existing.notes ? (
        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white p-5 shadow-sm ring-1 ring-amber-900/5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/90">
            Analyst notes
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
            {existing.notes}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export const IdeaAssessmentSection: React.FC<IdeaAssessmentSectionProps> = ({
  idea,
  onUpdated,
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const existing = idea.assessment ?? null;
  const idNum = Number(idea.id);
  /** Only IdeaHub admins may create or update assessments; everyone else sees read-only. */
  const canEditAssessment = isAuthenticated && isAdmin;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** When an assessment already exists, admins start in view mode and turn this on to edit. */
  const [editingExisting, setEditingExisting] = useState(false);
  const [scores, setScores] = useState<DraftScores>(() =>
    existing ? scoresFromAssessment(existing) : defaultScores
  );
  const [notes, setNotes] = useState(existing?.notes || "");

  useEffect(() => {
    if (existing) {
      setScores(scoresFromAssessment(existing));
      setNotes(existing.notes || "");
    } else {
      setScores(defaultScores);
      setNotes("");
    }
  }, [existing, idea.id]);

  useEffect(() => {
    setEditingExisting(false);
  }, [idea.id, existing?.id]);

  const handleSave = async () => {
    if (!canEditAssessment) return;
    setSaving(true);
    setError(null);
    try {
      if (existing) {
        const res = await apiService.assessments.update(existing.id, {
          ...scores,
          notes: notes.trim() || null,
        });
        if (!res.ok || !res.data) throw new Error("Update failed");
        onUpdated(res.data);
        setEditingExisting(false);
      } else {
        const res = await apiService.assessments.create({
          idea_id: idNum,
          ...scores,
          notes: notes.trim() || null,
        });
        if (!res.ok || !res.data) throw new Error("Create failed");
        onUpdated(res.data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const reset = useCallback(() => {
    if (existing) {
      setScores(scoresFromAssessment(existing));
      setNotes(existing.notes || "");
    } else {
      setScores(defaultScores);
      setNotes("");
    }
  }, [existing]);

  const handleFormCancel = useCallback(() => {
    reset();
    if (existing) {
      setEditingExisting(false);
    }
  }, [existing, reset]);

  const previewScore = computeWeightedScore(scores);
  const previewBand = priorityLabelFromScore(previewScore);
  const previewStyle = priorityPresentation(previewBand);

  if (!canEditAssessment) {
    return (
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={detailSectionLabel}>Assessment</p>
            <p className="mt-2 max-w-lg text-sm text-slate-600">
              Review scores and notes from the innovation team. Creating or
              changing an assessment requires an administrator account.
            </p>
          </div>
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
            View only
          </span>
        </div>

        <div className="mt-6">
          {!existing ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <ChartBarIcon
                className="mx-auto h-10 w-10 text-slate-300"
                aria-hidden
              />
              <p className="mt-4 text-sm font-medium text-slate-800">
                No assessment yet
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                When scoring is complete, the weighted result and criteria will
                show here.
              </p>
            </div>
          ) : (
            <AssessmentReadOnlyLight existing={existing} />
          )}
        </div>
      </section>
    );
  }

  // Admin: existing assessment — show results first; edit is explicit.
  if (existing && !editingExisting) {
    return (
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={detailSectionLabel}>Assessment</p>
            <p className="mt-2 max-w-lg text-sm text-slate-600">
              Weighted score and criteria for this idea. Select Edit to change
              scores or analyst notes.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => setEditingExisting(true)}
            className="!min-h-[40px] !bg-[#0051FF] hover:!bg-[#0033A1]"
          >
            Edit assessment
          </Button>
        </div>

        <div className="mt-6">
          <AssessmentReadOnlyLight existing={existing} />
        </div>
      </section>
    );
  }

  return (
    <section className="pb-24 lg:pb-0">
      <p className={detailSectionLabel}>Assessment</p>
      <p className="mt-2 text-sm text-slate-600">
        {existing
          ? "Adjust scores or notes below, then save. Others can view this assessment but only administrators can change it."
          : "One assessment per idea (IdeaHub). Add scores below. Only administrators can score ideas. Analyst notes are stored on the assessment record."}
      </p>

      {error ? (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      ) : null}

      <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-stretch">
        <div className="min-w-0 lg:col-span-7">
          <AssessmentCriteriaForm
            activeIdea={idea}
            scores={scores}
            onScoresChange={setScores}
            notes={notes}
            onNotesChange={setNotes}
            saving={saving}
            isEditing={!!existing}
            onSubmit={() => void handleSave()}
            onCancel={handleFormCancel}
          />
        </div>
        <aside className="relative min-w-0 lg:col-span-5">
          <AssessmentStickyPreview
            previewScore={previewScore}
            previewBand={previewBand}
            previewStyle={previewStyle}
            desktopFooter={
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/90 px-4 py-3 text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-800">Tip:</span>{" "}
                Adjust sliders — the preview updates in real time. Save when
                you are ready to sync with IdeaHub.
              </div>
            }
          />
        </aside>
      </div>
    </section>
  );
};
