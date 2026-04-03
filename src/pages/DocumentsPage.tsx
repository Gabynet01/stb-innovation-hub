import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownTrayIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { ApiError } from "@/services/baseApi";
import type {
  IdeahubDocument,
  IdeahubDocumentTemplate,
} from "@/types/ideahub";
import {
  Button,
  Card,
  DataTable,
  DataTableToolbar,
  Input,
  LoadingSpinner,
  CompactErrorWithToast,
  PageHeader,
  StatusDotBadge,
  statusToneFromString,
  type DataTableColumn,
} from "@/components/ui";
import { formatDocumentGenerationLabel } from "@/utils/date";
import { buildCsv, downloadCsvFile } from "@/utils/csvExport";

function errMessage(e: unknown) {
  return e instanceof ApiError ? e.message : "Request failed";
}

export const DocumentsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<IdeahubDocument[]>([]);
  const [templatesById, setTemplatesById] = useState<
    Record<number, IdeahubDocumentTemplate>
  >({});
  const [ideaTitles, setIdeaTitles] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadingDocId, setDownloadingDocId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

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
      const [docRes, tmplRes] = await Promise.all([
        apiService.documents.list(),
        apiService.documentTemplates.list(),
      ]);

      const byId: Record<number, IdeahubDocumentTemplate> = {};
      if (tmplRes.ok && tmplRes.data) {
        for (const t of tmplRes.data) byId[t.id] = t;
      }
      setTemplatesById(byId);

      if (!docRes.ok || !docRes.data) {
        setDocuments([]);
        setIdeaTitles({});
        return;
      }
      setDocuments(docRes.data);
      const ids = Array.from(new Set(docRes.data.map((d) => d.idea_id)));
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
      setTemplatesById({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    void load();
  }, [isAuthenticated, load]);

  const rowsSorted = useMemo(
    () =>
      [...documents].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ),
    [documents]
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rowsSorted;
    return rowsSorted.filter((d) => {
      const title = (ideaTitles[d.idea_id] ?? "").toLowerCase();
      const tmpl = templatesById[d.template_id];
      const tmplName = (tmpl?.name ?? "").toLowerCase();
      const tmplFile = (tmpl?.file_name ?? "").toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        title.includes(q) ||
        String(d.idea_id).includes(q) ||
        String(d.template_id).includes(q) ||
        tmplName.includes(q) ||
        tmplFile.includes(q)
      );
    });
  }, [rowsSorted, search, ideaTitles, templatesById]);

  const downloadFile = useCallback(async (doc: IdeahubDocument) => {
    setDownloadingDocId(doc.id);
    setDownloadError(null);
    try {
      const blob = await apiService.documents.downloadFile(doc.id);
      if (!blob) {
        setDownloadError("Download failed or document not ready.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.name.replace(/[^\w.-]+/g, "_")}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setDownloadError(errMessage(e));
    } finally {
      setDownloadingDocId(null);
    }
  }, []);

  const exportCsv = useCallback(() => {
    const header = [
      "Document",
      "Template",
      "Idea title",
      "Idea ID",
      "Status",
      "Updated",
    ];
    const body = rows.map((d) => [
      d.name,
      templatesById[d.template_id]?.name ?? "",
      ideaTitles[d.idea_id] ?? "",
      String(d.idea_id),
      d.generation_status,
      d.updated_at,
    ]);
    downloadCsvFile("documents-export.csv", buildCsv([header, ...body]));
  }, [rows, templatesById, ideaTitles]);

  const columns: DataTableColumn<IdeahubDocument>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Document",
        cell: (d) => (
          <div>
            <p className="font-medium text-stanbic-text">{d.name}</p>
            <div className="mt-1">
              <StatusDotBadge
                label={d.generation_status.replace(/_/g, " ")}
                tone={statusToneFromString(d.generation_status)}
              />
            </div>
          </div>
        ),
      },
      {
        id: "template",
        header: "From template",
        className: "max-w-[14rem]",
        cell: (d) => {
          const t = templatesById[d.template_id];
          if (t) {
            return (
              <div>
                <p className="font-medium text-stanbic-text">{t.name}</p>
                {t.file_name && t.file_name !== t.name ? (
                  <p className="mt-0.5 truncate text-xs text-stanbic-text/60">
                    {t.file_name}
                  </p>
                ) : null}
              </div>
            );
          }
          return (
            <div>
              <p className="text-stanbic-text/75">Template removed or unknown</p>
              <p className="text-xs text-stanbic-text/50">ID {d.template_id}</p>
            </div>
          );
        },
      },
      {
        id: "idea",
        header: "Idea",
        cell: (d) => (
          <Link
            to={`/ideas?ideaId=${d.idea_id}`}
            className="text-sm font-medium text-stanbic-secondary hover:underline"
          >
            {ideaTitles[d.idea_id] ?? `Idea #${d.idea_id}`}
          </Link>
        ),
      },
      {
        id: "generated",
        header: "Generated",
        className: "max-w-[14rem] text-xs leading-[130%] text-stanbic-text/75",
        cell: (d) =>
          formatDocumentGenerationLabel(
            d.generation_status,
            d.created_at,
            d.updated_at
          ),
      },
      {
        id: "actions",
        header: "Download",
        headerClassName: "text-right",
        className: "text-right",
        cell: (d) => (
          <Button
            type="button"
            size="sm"
            variant="outline"
            loading={downloadingDocId === d.id}
            disabled={
              d.generation_status !== "completed" ||
              downloadingDocId === d.id
            }
            title={
              d.generation_status !== "completed"
                ? "Available when generation is completed"
                : undefined
            }
            onClick={() => void downloadFile(d)}
          >
            Download
          </Button>
        ),
      },
    ],
    [ideaTitles, templatesById, downloadingDocId, downloadFile]
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
    <div className="min-h-screen bg-stanbic-canvas pb-16">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Documents" },
        ]}
        title="Documents"
        description="All generated Word documents across ideas. See which template each file came from, open the idea, or download the .docx when generation is complete."
      />

      <div className="mx-auto mt-8 max-w-6xl space-y-6 px-4 sm:px-6">
        {error && (
          <CompactErrorWithToast
            error={error}
            title="Could not load documents"
            onRetry={() => void load()}
          />
        )}

        <Card className="border-stanbic-border p-6 shadow-sm">
          {downloadError ? (
            <p className="mb-4 rounded-lg border border-red-100 bg-red-50/90 px-3 py-2 text-sm text-red-800">
              {downloadError}
            </p>
          ) : null}
          <DataTableToolbar total={rowsSorted.length} totalLabel="documents">
            <button
              type="button"
              onClick={() =>
                document.getElementById("documents-table-search")?.focus()
              }
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-stanbic-secondary transition hover:text-stanbic-primary"
            >
              <FunnelIcon className="h-4 w-4 shrink-0" aria-hidden />
              Filter
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={rowsSorted.length === 0}
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-stanbic-secondary transition hover:text-stanbic-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowDownTrayIcon className="h-4 w-4 shrink-0" aria-hidden />
              Export CSV
            </button>
          </DataTableToolbar>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <Input
                id="documents-table-search"
                placeholder="Search by document, idea, template name, or ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                className="border-stanbic-border"
              />
            </div>
            {search.trim() && rowsSorted.length > 0 ? (
              <p className="shrink-0 text-xs text-stanbic-text/60 sm:pb-2">
                {rows.length} of {rowsSorted.length} shown
              </p>
            ) : null}
          </div>
          <DataTable
            columns={columns}
            rows={rows}
            getRowKey={(d) => String(d.id)}
            minWidthClass="min-w-[800px]"
            emptyMessage={
              search.trim()
                ? "No documents match your search."
                : "No generated documents yet."
            }
            flush
            scrollMaxHeightClass="max-h-[min(60vh,560px)]"
          />
        </Card>
      </div>
    </div>
  );
};
