import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { ApiError } from "@/services/baseApi";
import type { IdeahubDocument } from "@/types/ideahub";
import {
  Card,
  DataTable,
  LoadingSpinner,
  CompactErrorWithToast,
  type DataTableColumn,
} from "@/components/ui";
import { PAGE_HERO_PATTERN_LIGHT, PAGE_HERO_SURFACE } from "@/constants/pageHero";

function formatShortDate(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

function errMessage(e: unknown) {
  return e instanceof ApiError ? e.message : "Request failed";
}

export const DocumentsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<IdeahubDocument[]>([]);
  const [ideaTitles, setIdeaTitles] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: "/documents" } },
      });
    }
  }, [isAuthenticated, navigate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.documents.list();
      if (!res.ok || !res.data) {
        setDocuments([]);
        setIdeaTitles({});
        return;
      }
      setDocuments(res.data);
      const ids = Array.from(new Set(res.data.map((d) => d.idea_id)));
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            const ir = await apiService.ideas.getIdea(String(id));
            if (ir.ok && ir.data) return [id, ir.data.title] as const;
          } catch {
            /* ignore */
          }
          return [id, `Idea #${id}`] as const;
        })
      );
      setIdeaTitles(Object.fromEntries(entries));
    } catch (e) {
      setError(errMessage(e));
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    void load();
  }, [isAuthenticated, load]);

  const rows = useMemo(
    () =>
      [...documents].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ),
    [documents]
  );

  const columns: DataTableColumn<IdeahubDocument>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Document",
        cell: (d) => (
          <div>
            <p className="font-medium text-slate-900">{d.name}</p>
            <p className="text-xs text-slate-500">
              Template #{d.template_id} · {d.generation_status}
            </p>
          </div>
        ),
      },
      {
        id: "idea",
        header: "Idea",
        cell: (d) => (
          <Link
            to={`/ideas?ideaId=${d.idea_id}`}
            className="text-sm font-medium text-[#0051FF] hover:underline"
          >
            {ideaTitles[d.idea_id] ?? `Idea #${d.idea_id}`}
          </Link>
        ),
      },
      {
        id: "updated",
        header: "Updated",
        className: "text-slate-600 text-xs whitespace-nowrap",
        cell: (d) => formatShortDate(d.updated_at),
      },
    ],
    [ideaTitles]
  );

  if (!isAuthenticated) return null;

  if (loading && documents.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" color="primary" />
        <p className="text-slate-600">Loading documents…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="relative overflow-hidden border-b border-slate-200/90">
        <div className={PAGE_HERO_SURFACE} aria-hidden />
        <div
          className="absolute inset-0 opacity-80"
          style={{ backgroundImage: PAGE_HERO_PATTERN_LIGHT }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Documents
          </h1>
          <p className="mt-2 max-w-2xl text-base text-gray-600">
            All generated Word documents across ideas. Open an idea to create or
            download files from its Documents tab.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl space-y-6 px-4 sm:px-6">
        {error && (
          <CompactErrorWithToast
            error={error}
            title="Could not load documents"
            onRetry={() => void load()}
          />
        )}

        <Card className="border-slate-200 p-6 shadow-sm">
          <DataTable
            columns={columns}
            rows={rows}
            getRowKey={(d) => String(d.id)}
            emptyMessage="No generated documents yet."
          />
        </Card>
      </div>
    </div>
  );
};
