import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import type { Idea } from "@/types/api";
import type { IdeahubIdeaAssessment } from "@/types/ideahub";
import {
  Card,
  LoadingSpinner,
  CompactErrorWithToast,
  ConfirmationModal,
  PageHeader,
  SegmentedTabs,
} from "@/components/ui";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useSoftRefresh } from "@/hooks";
import type { AssessmentsMainTab, DraftScores } from "./assessmentTypes";
import {
  defaultScores,
  IDEAS_FETCH_PAGE_SIZE,
  PENDING_PAGE_SIZE,
  ASSESSED_PAGE_SIZE,
} from "./assessmentConstants";
import {
  AssessmentWorkspace,
  PendingAssessmentQueue,
  CompletedAssessmentCards,
} from "./components";

export const AssessmentsPage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const assessmentFormRef = useRef<HTMLDivElement>(null);
  const { confirmation, showConfirmation, hideConfirmation } = useConfirmation();

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [assessments, setAssessments] = useState<IdeahubIdeaAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [mainTab, setMainTab] = useState<AssessmentsMainTab>("pending");
  const [newAssessmentIdeaId, setNewAssessmentIdeaId] = useState<string | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [ideaId, setIdeaId] = useState<string>("");
  const [scores, setScores] = useState<DraftScores>(defaultScores);
  const [notes, setNotes] = useState("");

  const [pendingSearch, setPendingSearch] = useState("");
  const [assessedSearch, setAssessedSearch] = useState("");
  const [pendingPage, setPendingPage] = useState(1);
  const [assessedPage, setAssessedPage] = useState(1);

  const ideaById = useMemo(() => {
    const m = new Map<string, Idea>();
    for (const i of ideas) m.set(i.id, i);
    return m;
  }, [ideas]);

  const assessedIdeaIdSet = useMemo(
    () => new Set(assessments.map((a) => a.idea_id)),
    [assessments]
  );

  const pendingIdeas = useMemo(() => {
    return ideas
      .filter((i) => !assessedIdeaIdSet.has(Number(i.id)))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [ideas, assessedIdeaIdSet]);

  const filteredPending = useMemo(() => {
    const q = pendingSearch.trim().toLowerCase();
    if (!q) return pendingIdeas;
    return pendingIdeas.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.reference_number?.toLowerCase().includes(q) ?? false) ||
        i.category_label.toLowerCase().includes(q) ||
        i.source_label.toLowerCase().includes(q)
    );
  }, [pendingIdeas, pendingSearch]);

  const pendingTotalPages = Math.max(
    1,
    Math.ceil(filteredPending.length / PENDING_PAGE_SIZE)
  );
  const pendingSlice = useMemo(() => {
    const start = (pendingPage - 1) * PENDING_PAGE_SIZE;
    return filteredPending.slice(start, start + PENDING_PAGE_SIZE);
  }, [filteredPending, pendingPage]);

  const sortedAssessed = useMemo(
    () =>
      [...assessments].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ),
    [assessments]
  );

  const filteredAssessed = useMemo(() => {
    const q = assessedSearch.trim().toLowerCase();
    if (!q) return sortedAssessed;
    return sortedAssessed.filter((a) => {
      const idea = ideaById.get(String(a.idea_id));
      const t = (idea?.title ?? "").toLowerCase();
      const r = (idea?.reference_number ?? "").toLowerCase();
      return (
        t.includes(q) ||
        r.includes(q) ||
        String(a.idea_id).includes(q) ||
        a.priority_band.toLowerCase().includes(q)
      );
    });
  }, [sortedAssessed, assessedSearch, ideaById]);

  const assessedTotalPages = Math.max(
    1,
    Math.ceil(filteredAssessed.length / ASSESSED_PAGE_SIZE)
  );
  const assessedSlice = useMemo(() => {
    const start = (assessedPage - 1) * ASSESSED_PAGE_SIZE;
    return filteredAssessed.slice(start, start + ASSESSED_PAGE_SIZE);
  }, [filteredAssessed, assessedPage]);

  useEffect(() => {
    setPendingPage(1);
  }, [pendingSearch]);
  useEffect(() => {
    setAssessedPage(1);
  }, [assessedSearch]);

  useEffect(() => {
    if (pendingPage > pendingTotalPages) {
      setPendingPage(pendingTotalPages);
    }
  }, [pendingPage, pendingTotalPages]);

  useEffect(() => {
    if (assessedPage > assessedTotalPages) {
      setAssessedPage(assessedTotalPages);
    }
  }, [assessedPage, assessedTotalPages]);

  const showScoringForm =
    isAdmin && (editingId !== null || newAssessmentIdeaId !== null);
  const activeIdea = ideaId ? ideaById.get(ideaId) : undefined;

  useEffect(() => {
    if (!showScoringForm) return;
    const t = window.setTimeout(() => {
      assessmentFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
    return () => window.clearTimeout(t);
  }, [showScoringForm, editingId, newAssessmentIdeaId]);

  const load = useCallback(async (silent = false) => {
    if (!isAuthenticated) return;
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    try {
      const [ir, ar] = await Promise.all([
        apiService.ideas.listIdeas({
          page_size: IDEAS_FETCH_PAGE_SIZE,
          with_assessments: true,
        }),
        apiService.assessments.list(),
      ]);
      if (ir.ok && ir.data) setIdeas(ir.data);
      else if (!silent) setError("Failed to load ideas");
      if (ar.ok && ar.data) setAssessments(ar.data);
      else if (!ar.ok && !silent) setError("Failed to load assessments");
    } catch (e) {
      if (!silent) {
        setError(e instanceof Error ? e.message : "Failed to load data");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [isAuthenticated]);

  useSoftRefresh(() => void load(true), isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: "/assessments" } },
      });
      return;
    }
    void load();
  }, [isAuthenticated, navigate, load]);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setNewAssessmentIdeaId(null);
    setIdeaId("");
    setScores(defaultScores);
    setNotes("");
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      resetForm();
    }
  }, [isAdmin, resetForm]);

  const startNewFromPending = useCallback((idea: Idea) => {
    setError(null);
    setEditingId(null);
    setNewAssessmentIdeaId(idea.id);
    setIdeaId(idea.id);
    setScores(defaultScores);
    setNotes("");
    setMainTab("pending");
  }, []);

  const startEdit = useCallback((a: IdeahubIdeaAssessment) => {
    setError(null);
    setNewAssessmentIdeaId(null);
    setEditingId(a.id);
    setIdeaId(String(a.idea_id));
    setScores({
      potential_impact: a.potential_impact,
      feasibility: a.feasibility,
      alignment: a.alignment,
      market_demand: a.market_demand,
      innovation: a.innovation,
    });
    setNotes(a.notes || "");
    setMainTab("assessed");
  }, []);

  const handleSave = async () => {
    if (!isAdmin) return;
    const idNum = Number(ideaId);
    if (!ideaId || Number.isNaN(idNum)) {
      setError("No idea selected for this assessment");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        const res = await apiService.assessments.update(editingId, {
          ...scores,
          notes: notes.trim() || null,
        });
        if (!res.ok) throw new Error("Update failed");
      } else {
        if (assessedIdeaIdSet.has(idNum)) {
          setError(
            "This idea already has an assessment. Pick another from the queue."
          );
          return;
        }
        const res = await apiService.assessments.create({
          idea_id: idNum,
          ...scores,
          notes: notes.trim() || null,
        });
        if (!res.ok) throw new Error("Create failed");
      }
      resetForm();
      await load(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const requestDeleteAssessment = useCallback(
    (id: string) => {
      if (!isAdmin) return;
      showConfirmation(
        {
          title: "Delete this assessment?",
          message:
            "This removes the scored record for this idea. You can add a new assessment later if needed. This cannot be undone.",
          type: "danger",
          confirmText: "Delete",
        },
        async () => {
          setSaving(true);
          try {
            await apiService.assessments.delete(id);
            if (editingId === id) resetForm();
            await load(true);
            hideConfirmation();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Delete failed");
            hideConfirmation();
          } finally {
            setSaving(false);
          }
        }
      );
    },
    [isAdmin, showConfirmation, hideConfirmation, editingId, load, resetForm]
  );

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stanbic-canvas">
        <LoadingSpinner size="lg" color="primary" />
        <p className="text-sm font-medium text-[#0033A1]/80">
          Loading assessments…
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-stanbic-canvas">
        <PageHeader
          breadcrumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Idea assessments" },
          ]}
          title="Idea assessments"
          description="Work the queue of unaudited ideas, then browse completed scores. New assessments open only after you choose an idea from the awaiting list."
        />

        <div className="mx-auto max-w-6xl space-y-6 px-4 pb-20 pt-8 sm:px-6">
          {!isAdmin ? (
            <p
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm"
              role="status"
            >
              <span className="font-medium text-slate-800">View only.</span>{" "}
              Creating or editing assessments requires an administrator
              account. You can still browse the queues below.
            </p>
          ) : null}
          {error && (
            <div className="mb-6">
              <CompactErrorWithToast
                error={error}
                title="Something went wrong"
                onRetry={() => {
                  setError(null);
                  void load();
                }}
              />
            </div>
          )}

          <SegmentedTabs<AssessmentsMainTab>
            aria-label="Assessment views"
            variant="filled"
            panelId="assessments-main-panel"
            items={[
              {
                id: "pending",
                label: "Awaiting assessment",
                count: pendingIdeas.length,
              },
              {
                id: "assessed",
                label: "Completed",
                count: assessments.length,
              },
            ]}
            value={mainTab}
            onChange={setMainTab}
          />

          <div
            role="tabpanel"
            id="assessments-main-panel"
            aria-labelledby={`segmented-tab-${mainTab}`}
          >
            <Card className="border-stanbic-border p-4 shadow-sm sm:p-6">
              {mainTab === "pending" && (
                <PendingAssessmentQueue
                  pendingIdeas={pendingIdeas}
                  filteredPending={filteredPending}
                  pendingSlice={pendingSlice}
                  pendingSearch={pendingSearch}
                  onPendingSearchChange={setPendingSearch}
                  pendingPage={pendingPage}
                  pendingTotalPages={pendingTotalPages}
                  onPendingPageChange={setPendingPage}
                  onAssessIdea={startNewFromPending}
                  readOnly={!isAdmin}
                />
              )}
              {mainTab === "assessed" && (
                <CompletedAssessmentCards
                  assessmentsTotal={assessments.length}
                  filteredAssessed={filteredAssessed}
                  assessedSlice={assessedSlice}
                  assessedSearch={assessedSearch}
                  onAssessedSearchChange={setAssessedSearch}
                  assessedPage={assessedPage}
                  assessedTotalPages={assessedTotalPages}
                  onAssessedPageChange={setAssessedPage}
                  ideaById={ideaById}
                  onEdit={startEdit}
                  onRequestDelete={requestDeleteAssessment}
                  readOnly={!isAdmin}
                />
              )}
            </Card>
          </div>

          {showScoringForm && (
            <AssessmentWorkspace
              ref={assessmentFormRef}
              editingId={editingId}
              ideaId={ideaId}
              activeIdea={activeIdea}
              scores={scores}
              setScores={setScores}
              notes={notes}
              setNotes={setNotes}
              saving={saving}
              onSave={() => void handleSave()}
              onReset={resetForm}
            />
          )}
        </div>
      </div>

      {confirmation && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          onClose={hideConfirmation}
          onConfirm={confirmation.onConfirm}
          title={confirmation.title}
          message={confirmation.message}
          type={confirmation.type}
          confirmText={confirmation.confirmText}
          cancelText={confirmation.cancelText}
          isLoading={saving}
        />
      )}
    </>
  );
};
