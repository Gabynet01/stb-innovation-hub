import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { ApiError } from "@/services/baseApi";
import type { Idea } from "@/types/api";
import type { IdeahubDocument, IdeahubDocumentTemplate } from "@/types/ideahub";
import { Button, Input, LoadingSpinner } from "@/components/ui";
import { formatDocumentGenerationLabel } from "@/utils/date";
import { detailSectionLabel } from "./ideaDetailStyles";

interface IdeaDocumentsSectionProps {
  idea: Idea;
}

function schemaBadgeClass(status: string) {
  const base =
    "ml-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide";
  if (status === "completed") return `${base} bg-emerald-50 text-emerald-800`;
  if (status === "failed") return `${base} bg-red-50 text-red-800`;
  return `${base} bg-amber-50 text-amber-900`;
}

function genBadgeClass(status: string) {
  const base =
    "ml-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide";
  if (status === "completed") return `${base} bg-emerald-50 text-emerald-800`;
  if (status === "failed") return `${base} bg-red-50 text-red-800`;
  return `${base} bg-sky-50 text-sky-900`;
}

const POLL_MS = 3500;
const DOC_POLL_ATTEMPTS = 45;
const DOC_POLL_INTERVAL_MS = 2000;

/** Each list scrolls inside a capped area so two sections don’t stretch the page. */
const LIST_SCROLL_CLASS =
  "max-h-[min(34vh,300px)] sm:max-h-[min(40vh,380px)] lg:max-h-[min(45vh,520px)] overflow-y-auto overscroll-contain scroll-smooth rounded-lg border border-slate-100 bg-slate-50/50 p-2 sm:p-3";

export const IdeaDocumentsSection: React.FC<IdeaDocumentsSectionProps> = ({
  idea,
}) => {
  const { isAuthenticated } = useAuth();
  const [templates, setTemplates] = useState<IdeahubDocumentTemplate[]>([]);
  const [documents, setDocuments] = useState<IdeahubDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingTemplateId, setGeneratingTemplateId] = useState<
    number | null
  >(null);
  const [downloadingDocId, setDownloadingDocId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [listSearch, setListSearch] = useState("");

  const docSectionBusy =
    generatingTemplateId !== null || downloadingDocId !== null;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tr, dr] = await Promise.all([
        apiService.documentTemplates.list(),
        apiService.documents.list(),
      ]);
      if (tr.ok && tr.data) setTemplates(tr.data);
      if (dr.ok && dr.data) {
        const id = Number(idea.id);
        setDocuments(dr.data.filter((d) => d.idea_id === id));
      }
    } catch (e) {
      setError(
        e instanceof ApiError ? e.message : "Failed to load documents"
      );
    } finally {
      setLoading(false);
    }
  }, [idea.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const anyTemplatePending = templates.some(
    (t) => t.variable_schema_status === "pending"
  );
  const anyDocPending = documents.some(
    (d) => d.generation_status === "pending"
  );

  useEffect(() => {
    if (!anyTemplatePending && !anyDocPending) return;
    const id = window.setInterval(() => void load(), POLL_MS);
    return () => window.clearInterval(id);
  }, [anyTemplatePending, anyDocPending, load]);

  const templatesSorted = useMemo(
    () =>
      [...templates].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    [templates]
  );

  const documentsSorted = useMemo(
    () =>
      [...documents].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ),
    [documents]
  );

  const filteredTemplates = useMemo(() => {
    const q = listSearch.trim().toLowerCase();
    if (!q) return templatesSorted;
    return templatesSorted.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.file_name.toLowerCase().includes(q)
    );
  }, [templatesSorted, listSearch]);

  const filteredDocuments = useMemo(() => {
    const q = listSearch.trim().toLowerCase();
    if (!q) return documentsSorted;
    return documentsSorted.filter((d) => d.name.toLowerCase().includes(q));
  }, [documentsSorted, listSearch]);

  const generate = async (templateId: number) => {
    if (!isAuthenticated) return;
    setGeneratingTemplateId(templateId);
    setError(null);
    try {
      const res = await apiService.documents.create({
        template_id: templateId,
        idea_id: Number(idea.id),
        name: `${idea.title.slice(0, 80)} — doc`,
      });
      if (!res.ok || !res.data) throw new Error("Create failed");

      let doc = res.data;
      for (let i = 0; i < DOC_POLL_ATTEMPTS; i++) {
        if (doc.generation_status !== "pending") break;
        await new Promise((r) => setTimeout(r, DOC_POLL_INTERVAL_MS));
        const g = await apiService.documents.get(doc.id);
        if (g.ok && g.data) doc = g.data;
        else break;
      }
      await load();
      if (doc.generation_status === "failed") {
        setError(
          "Generation finished with an error. Check IdeaHub logs and Azure OpenAI configuration."
        );
      }
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Generation request failed"
      );
    } finally {
      setGeneratingTemplateId(null);
    }
  };

  const downloadFile = async (doc: IdeahubDocument) => {
    setDownloadingDocId(doc.id);
    setError(null);
    try {
      const blob = await apiService.documents.downloadFile(doc.id);
      if (!blob) {
        setError("Download failed or document not ready.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.name.replace(/[^\w.-]+/g, "_")}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Download failed."
      );
    } finally {
      setDownloadingDocId(null);
    }
  };

  return (
    <section>
      <p className={detailSectionLabel}>Documents</p>
      <p className="mt-2 text-sm text-slate-600">
        Pick a template to generate a Word file, then download it below.
        Schema status must be <span className="font-medium">completed</span>{" "}
        before Generate is enabled. Use search to narrow long lists — each block
        scrolls on its own.
      </p>
      {!isAuthenticated ? (
        <p className="mt-3 text-sm text-slate-600">
          Sign in to generate and download.
        </p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <div
          className="mt-4 flex items-center gap-3 text-sm text-slate-600"
          role="status"
          aria-live="polite"
        >
          <LoadingSpinner size="sm" color="primary" />
          <span>Loading templates…</span>
        </div>
      ) : (
        <div className="relative mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          {generatingTemplateId !== null ? (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/85 px-4 py-8 text-center backdrop-blur-[2px]"
              role="status"
              aria-live="polite"
              aria-busy="true"
              aria-label="Generating document"
            >
              <LoadingSpinner size="lg" color="primary" />
              <p className="text-sm font-semibold text-slate-800">
                Generating document…
              </p>
              <p className="max-w-sm text-xs leading-relaxed text-slate-500">
                The server is filling your template. This often takes up to a
                minute.
              </p>
            </div>
          ) : downloadingDocId !== null ? (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/85 px-4 py-8 text-center backdrop-blur-[2px]"
              role="status"
              aria-live="polite"
              aria-busy="true"
              aria-label="Downloading document"
            >
              <LoadingSpinner size="lg" color="primary" />
              <p className="text-sm font-semibold text-slate-800">
                Preparing download…
              </p>
              <p className="max-w-sm text-xs leading-relaxed text-slate-500">
                Fetching your Word file from the server.
              </p>
            </div>
          ) : null}

          <div className="mb-4">
            <Input
              placeholder="Search templates (name, file) and generated files…"
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              autoComplete="off"
              className="border-slate-200"
              aria-label="Filter templates and generated documents"
            />
          </div>

          <div className="space-y-1 border-b border-slate-100 pb-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Generate from template
            </h3>
            <p className="text-xs text-slate-500">
              {templates.length} template{templates.length === 1 ? "" : "s"}{" "}
              available
              {listSearch.trim() &&
              filteredTemplates.length !== templates.length
                ? ` · showing ${filteredTemplates.length}`
                : null}
            </p>
          </div>
          <div className={`mt-3 ${LIST_SCROLL_CLASS}`}>
            <ul className="space-y-2 pr-0.5">
                {filteredTemplates.map((t) => {
                  const ready = t.variable_schema_status === "completed";
                  return (
                    <li
                      key={t.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-slate-800">
                          {t.name}
                        </span>
                        <span
                          className={schemaBadgeClass(
                            t.variable_schema_status
                          )}
                        >
                          {t.variable_schema_status}
                        </span>
                        <p className="mt-0.5 truncate text-[11px] text-slate-400">
                          {t.file_name}
                        </p>
                        {t.variable_schema_status === "failed" ? (
                          <p className="mt-1 text-xs text-slate-600">
                            {t.schema_extraction_error?.trim() ? (
                              <span className="block rounded-md bg-red-50/90 px-2 py-1.5 text-red-900">
                                {t.schema_extraction_error}
                              </span>
                            ) : (
                              <span className="block text-slate-600">
                                No detail was stored for this failure. Set{" "}
                                <code className="rounded bg-slate-100 px-1 text-[11px]">
                                  AZURE_OPENAI_API_KEY
                                </code>
                                ,{" "}
                                <code className="rounded bg-slate-100 px-1 text-[11px]">
                                  AZURE_OPENAI_ENDPOINT
                                </code>
                                , and{" "}
                                <code className="rounded bg-slate-100 px-1 text-[11px]">
                                  LLM_MODEL
                                </code>{" "}
                                in IdeaHub&apos;s{" "}
                                <code className="rounded bg-slate-100 px-1 text-[11px]">
                                  .env
                                </code>
                                , restart the API, then{" "}
                                <Link
                                  className="font-medium text-[#0033A1] underline decoration-[#0033A1]/40 underline-offset-2 hover:decoration-[#0033A1]"
                                  to="/administration"
                                >
                                  Administration
                                </Link>{" "}
                                → Doc templates →{" "}
                                <span className="font-medium">
                                  Retry schema extraction
                                </span>{" "}
                                for this template. The next run saves the real
                                error message here if it still fails.
                              </span>
                            )}
                          </p>
                        ) : null}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        loading={generatingTemplateId === t.id}
                        disabled={
                          !isAuthenticated || docSectionBusy || !ready
                        }
                        title={
                          !ready
                            ? "Wait until variable schema status is completed"
                            : undefined
                        }
                        onClick={() => void generate(t.id)}
                        className="shrink-0"
                      >
                        Generate
                      </Button>
                    </li>
                  );
                })}
                {templates.length === 0 ? (
                  <li className="px-2 py-8 text-center text-sm text-slate-500">
                    No templates in IdeaHub. An admin can upload .docx
                    templates under Administration → Doc templates.
                  </li>
                ) : filteredTemplates.length === 0 ? (
                  <li className="px-2 py-8 text-center text-sm text-slate-500">
                    No templates match your search.
                  </li>
                ) : null}
            </ul>
          </div>

          <div className="mt-8 space-y-1 border-b border-slate-100 pb-2 pt-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Files for this idea
            </h3>
            <p className="text-xs text-slate-500">
              {documents.length} generated file
              {documents.length === 1 ? "" : "s"}
              {listSearch.trim() &&
              filteredDocuments.length !== documents.length
                ? ` · showing ${filteredDocuments.length}`
                : null}
            </p>
          </div>
          <div className={`mt-3 ${LIST_SCROLL_CLASS}`}>
            <ul className="space-y-2 pr-0.5">
              {filteredDocuments.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-sm font-medium text-slate-800">
                      {d.name}
                    </span>
                    <span className={genBadgeClass(d.generation_status)}>
                      {d.generation_status}
                    </span>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDocumentGenerationLabel(
                        d.generation_status,
                        d.created_at,
                        d.updated_at
                      )}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    loading={downloadingDocId === d.id}
                    disabled={
                      d.generation_status !== "completed" || docSectionBusy
                    }
                    onClick={() => void downloadFile(d)}
                    className="shrink-0"
                  >
                    Download
                  </Button>
                </li>
              ))}
              {documents.length === 0 ? (
                <li className="px-2 py-8 text-center text-sm text-slate-500">
                  No documents yet. Pick a template above and generate one.
                </li>
              ) : filteredDocuments.length === 0 ? (
                <li className="px-2 py-8 text-center text-sm text-slate-500">
                  No generated files match your search.
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
