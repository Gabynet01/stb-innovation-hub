import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiService } from "@/services/api";
import { ApiError } from "@/services/baseApi";
import type { Idea } from "@/types/api";
import type { IdeahubDocument, IdeahubDocumentTemplate } from "@/types/ideahub";
import { Button } from "@/components/ui";
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

export const IdeaDocumentsSection: React.FC<IdeaDocumentsSectionProps> = ({
  idea,
}) => {
  const { isAuthenticated } = useAuth();
  const [templates, setTemplates] = useState<IdeahubDocumentTemplate[]>([]);
  const [documents, setDocuments] = useState<IdeahubDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const generate = async (templateId: number) => {
    if (!isAuthenticated) return;
    setCreating(true);
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
      setCreating(false);
    }
  };

  const downloadFile = async (doc: IdeahubDocument) => {
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
    }
  };

  return (
    <section>
      <p className={detailSectionLabel}>Documents</p>
      <p className="mt-2 text-sm text-slate-600">
        Generate Word documents from IdeaHub templates (server-side generation).
        Templates must finish variable-schema extraction before you can
        generate.
      </p>
      {!isAuthenticated ? (
        <p className="mt-3 text-sm text-slate-600">
          Sign in to generate and download.
        </p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">Loading templates…</p>
      ) : (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <div>
            <p className="text-xs font-medium text-slate-500">Templates</p>
            <ul className="mt-3 space-y-2">
              {templates.map((t) => {
                const ready = t.variable_schema_status === "completed";
                return (
                  <li
                    key={t.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5"
                  >
                    <div>
                      <span className="text-sm font-medium text-slate-800">
                        {t.name}
                      </span>
                      <span
                        className={schemaBadgeClass(t.variable_schema_status)}
                      >
                        {t.variable_schema_status}
                      </span>
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
                      disabled={
                        !isAuthenticated || creating || !ready
                      }
                      title={
                        !ready
                          ? "Wait until variable schema status is completed"
                          : undefined
                      }
                      onClick={() => void generate(t.id)}
                    >
                      Generate
                    </Button>
                  </li>
                );
              })}
              {templates.length === 0 ? (
                <li className="text-sm text-slate-500">
                  No templates in IdeaHub. An admin can upload .docx templates
                  under Administration → Doc templates.
                </li>
              ) : null}
            </ul>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <p className="text-xs font-medium text-slate-500">
              Generated for this idea
            </p>
            <ul className="mt-3 space-y-2">
              {documents.map((d) => (
                <li
                  key={d.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5"
                >
                  <div>
                    <span className="text-sm font-medium text-slate-800">
                      {d.name}
                    </span>
                    <span className={genBadgeClass(d.generation_status)}>
                      {d.generation_status}
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={d.generation_status !== "completed"}
                    onClick={() => void downloadFile(d)}
                  >
                    Download
                  </Button>
                </li>
              ))}
              {documents.length === 0 ? (
                <li className="text-sm text-slate-500">No documents yet.</li>
              ) : null}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
