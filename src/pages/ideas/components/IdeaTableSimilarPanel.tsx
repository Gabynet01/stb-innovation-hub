import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { apiService } from "@/services/api";
import { ApiError } from "@/services/baseApi";
import { Button, LoadingSpinner, useSnackbar } from "@/components/ui";
import type { IdeahubIdeaInsight, IdeahubSimilarIdea } from "@/types/ideahub";
import { embeddingErrorDisplay } from "@/utils/embeddingErrorDisplay";

const SIMILAR_LIMIT = 8;

/**
 * Compact similar-ideas block for the ideas table expand row (same API as idea detail).
 */
export function IdeaTableSimilarPanel({ ideaId }: { ideaId: string }) {
  const numericId = Number(ideaId);
  const { showSnackbar } = useSnackbar();
  const [items, setItems] = useState<IdeahubSimilarIdea[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<IdeahubIdeaInsight | null>(null);
  const [retrying, setRetrying] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(numericId)) return;
    setLoading(true);
    setItems(null);
    setInsight(null);
    try {
      try {
        const ins = await apiService.ideaInsights.get(numericId);
        if (ins.ok && ins.data) setInsight(ins.data);
      } catch (e) {
        if (!(e instanceof ApiError && e.status === 404)) throw e;
      }
      const sim = await apiService.ideaInsights.getSimilar(
        numericId,
        SIMILAR_LIMIT
      );
      if (sim.ok && sim.data) setItems(sim.data);
      else setItems([]);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [numericId]);

  useEffect(() => {
    void load();
  }, [load]);

  const embeddingPending =
    !insight || insight.embedding_status !== "completed";

  const canRetryEmbedding =
    !!insight &&
    (insight.embedding_status === "failed" || !!insight.embedding_error);

  const errorPresentation = insight?.embedding_error
    ? embeddingErrorDisplay(insight.embedding_error)
    : null;

  const handleRetryEmbedding = async () => {
    setRetrying(true);
    try {
      const res = await apiService.ideaInsights.retryEmbedding(numericId);
      if (res.ok) {
        showSnackbar({
          type: "success",
          title: "Embedding queued",
          message: "Expand again in a moment to refresh similar ideas.",
          duration: 5000,
        });
        await load();
      }
    } catch (e) {
      showSnackbar({
        type: "error",
        title: "Could not retry embedding",
        message: e instanceof Error ? e.message : "Try again shortly.",
        duration: 6000,
      });
    } finally {
      setRetrying(false);
    }
  };

  if (!Number.isFinite(numericId)) return null;

  return (
    <div className="flex w-full min-w-0 gap-0 text-left">
      <div
        className="w-px shrink-0 self-stretch bg-slate-300"
        aria-hidden
      />
      <div className="min-w-0 flex-1 pl-3 sm:pl-4">
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                Similar ideas
              </h4>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-600">
                Closest matches by embedding (cosine similarity). Requires a
                completed embedding for this idea.
              </p>
            </div>
            {canRetryEmbedding ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={ArrowPathIcon}
                iconPosition="left"
                loading={retrying}
                onClick={() => void handleRetryEmbedding()}
                className="shrink-0"
              >
                Retry embedding
              </Button>
            ) : null}
          </div>

          {errorPresentation ? (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50/90 px-2.5 py-2 text-xs text-amber-950">
              <p className="font-medium">Embedding unavailable</p>
              <p className="mt-1 leading-relaxed">
                {errorPresentation.summary}
              </p>
            </div>
          ) : null}

          {loading ? (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <LoadingSpinner size="sm" color="primary" />
              <span>Finding similar ideas…</span>
            </div>
          ) : items && items.length > 0 ? (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {items.map((s) => (
                <li key={s.idea_id}>
                  <Link
                    to={`/ideas?ideaId=${s.idea_id}`}
                    className="group flex items-start justify-between gap-3 rounded-lg border border-slate-200/90 bg-white px-3 py-2.5 shadow-sm transition hover:border-[#0051FF]/35 hover:shadow-md"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-[#0051FF]">
                        {s.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {s.reference_number} ·{" "}
                        {s.status.replace(/_/g, " ")}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-700 ring-1 ring-slate-200/80">
                      {Math.round(s.similarity * 100)}%
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-xs text-slate-600">
              {embeddingPending
                ? "No matches yet — embeddings usually finish within a minute or two after the idea is created."
                : "No close matches in the bank yet, or not enough indexed ideas to compare."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
