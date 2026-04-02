import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { apiService } from "@/services/api";
import { ApiError } from "@/services/baseApi";
import { Button, LoadingSpinner, useSnackbar } from "@/components/ui";
import type { IdeahubIdeaInsight, IdeahubSimilarIdea } from "@/types/ideahub";
import { embeddingErrorDisplay } from "@/utils/embeddingErrorDisplay";

/**
 * Loads `GET /api/v1/idea-insights/{id}/similar` — cosine similarity on completed
 * embeddings. Empty until the source idea’s embedding is `completed`.
 */
export function IdeaSimilarSection({ ideaId }: { ideaId: string }) {
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
      const sim = await apiService.ideaInsights.getSimilar(numericId, 10);
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
          message: "Refresh this tab in a moment to see similar ideas.",
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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Similar ideas
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Ideas in the bank with the closest embedding match to this one
            (cosine similarity). Results appear after this idea&apos;s embedding
            has finished processing.
          </p>
        </div>
        {canRetryEmbedding ? (
          <Button
            type="button"
            variant="secondary"
            loading={retrying}
            onClick={() => void handleRetryEmbedding()}
            className="shrink-0"
          >
            <ArrowPathIcon className="mr-2 h-4 w-4" aria-hidden />
            Retry embedding
          </Button>
        ) : null}
      </div>

      {errorPresentation ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          <p className="font-medium text-amber-950">Embedding unavailable</p>
          <p className="mt-1 leading-relaxed">{errorPresentation.summary}</p>
          {errorPresentation.technical ? (
            <details className="mt-2 text-xs text-amber-900/90">
              <summary className="cursor-pointer select-none font-medium text-amber-900">
                Technical details
              </summary>
              <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded border border-amber-200/80 bg-white/80 p-2 font-mono text-amber-950">
                {errorPresentation.technical}
              </pre>
            </details>
          ) : null}
          <p className="mt-2 text-xs text-amber-900/85">
            Retry only succeeds after the embedding URL and deployment name are fixed on
            the server.
          </p>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-6">
          <LoadingSpinner size="md" color="primary" />
          <p className="text-sm text-slate-500">Finding similar ideas…</p>
        </div>
      ) : items && items.length > 0 ? (
        <ul className="mt-6 space-y-3">
          {items.map((s) => (
            <li key={s.idea_id}>
              <Link
                to={`/ideas?ideaId=${s.idea_id}`}
                className="group block rounded-xl border border-slate-200 bg-slate-50/90 px-4 py-3 transition hover:border-[#0051FF]/30 hover:bg-white hover:shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 group-hover:text-[#0051FF]">
                      {s.title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {s.reference_number} · {s.status.replace(/_/g, " ")}
                    </p>
                    {s.description ? (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                        {s.description}
                      </p>
                    ) : null}
                  </div>
                  <span className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold tabular-nums text-slate-700 ring-1 ring-slate-200/80">
                    {Math.round(s.similarity * 100)}% match
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-slate-600">
          {embeddingPending
            ? "No matches yet — similarity search becomes available once this idea’s embedding is completed (usually within a minute or two after creation)."
            : "No other ideas are close enough in the embedding space yet, or there aren’t enough indexed ideas to compare against."}
        </p>
      )}
    </div>
  );
}
