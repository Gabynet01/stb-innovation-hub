import React, { useCallback, useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { apiService } from "@/services/api";
import { ApiError } from "@/services/baseApi";
import type { IdeahubDocumentTemplate } from "@/types/ideahub";
import {
  Button,
  Card,
  Input,
  Textarea,
  DataTable,
  DataTableToolbar,
  RowActionsMenu,
  SimpleModal,
  LoadingSpinner,
  CompactErrorWithToast,
  ConfirmationModal,
  useSnackbar,
  type DataTableColumn,
} from "@/components/ui";

function formatShortDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

function schemaBadge(status: string) {
  const base =
    "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize";
  if (status === "completed")
    return `${base} bg-emerald-50 text-emerald-800`;
  if (status === "failed") return `${base} bg-red-50 text-red-800`;
  return `${base} bg-amber-50 text-amber-900`;
}

function errMessage(e: unknown) {
  return e instanceof ApiError ? e.message : "Request failed";
}

export const DocumentTemplatesTab: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const [templates, setTemplates] = useState<IdeahubDocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadExample, setUploadExample] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [pendingDelete, setPendingDelete] =
    useState<IdeahubDocumentTemplate | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [downloadingTemplateId, setDownloadingTemplateId] = useState<
    number | null
  >(null);
  const [retryingTemplateId, setRetryingTemplateId] = useState<number | null>(
    null
  );
  const [expandedTemplateKey, setExpandedTemplateKey] = useState<string | null>(
    null
  );

  const tableAsyncBusy =
    downloadingTemplateId !== null ||
    retryingTemplateId !== null ||
    deleteSubmitting;

  const load = useCallback(async () => {
    try {
      const res = await apiService.documentTemplates.list();
      if (res.ok && res.data) setTemplates(res.data);
      else setError("Could not load document templates.");
    } catch (e) {
      setError(errMessage(e));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await load();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  useEffect(() => {
    const needsPoll = templates.some(
      (t) => t.variable_schema_status === "pending"
    );
    if (!needsPoll) return;
    const id = window.setInterval(() => void load(), 4000);
    return () => window.clearInterval(id);
  }, [templates, load]);

  const resetUploadForm = () => {
    setUploadName("");
    setUploadDesc("");
    setUploadExample("");
    setUploadFile(null);
  };

  const submitUpload = async () => {
    if (!uploadName.trim() || !uploadExample.trim() || !uploadFile) {
      setError("Name, example content, and a .docx file are required.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const res = await apiService.documentTemplates.create(
        {
          name: uploadName.trim(),
          description: uploadDesc.trim() || null,
          example_content: uploadExample.trim(),
        },
        uploadFile
      );
      if (!res.ok || !res.data) {
        setError("Upload did not return a template.");
        return;
      }
      setUploadOpen(false);
      resetUploadForm();
      await load();
      showSnackbar({
        type: "success",
        title: "Template uploaded",
        message:
          "Schema extraction runs in the background. Refresh happens automatically.",
      });
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setUploading(false);
    }
  };

  const downloadOriginal = async (t: IdeahubDocumentTemplate) => {
    setDownloadingTemplateId(t.id);
    setError(null);
    try {
      const blob = await apiService.documentTemplates.downloadFile(t.id);
      if (!blob) {
        setError("Download failed.");
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = t.file_name.replace(/[^\w.-]+/g, "_") || "template.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setDownloadingTemplateId(null);
    }
  };

  const retrySchemaExtraction = async (t: IdeahubDocumentTemplate) => {
    setRetryingTemplateId(t.id);
    setError(null);
    try {
      const res = await apiService.documentTemplates.retrySchemaExtraction(t.id);
      if (!res.ok) throw new Error("Retry failed");
      await load();
      showSnackbar({
        type: "success",
        title: "Schema extraction queued",
        message: "Status will update to pending, then completed or failed.",
      });
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setRetryingTemplateId(null);
    }
  };

  const runDelete = async () => {
    if (!pendingDelete) return;
    setDeleteSubmitting(true);
    setError(null);
    try {
      await apiService.documentTemplates.delete(pendingDelete.id);
      setPendingDelete(null);
      await load();
      showSnackbar({ type: "success", title: "Template removed" });
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const columns: DataTableColumn<IdeahubDocumentTemplate>[] = [
    {
      id: "name",
      header: "Template",
      cell: (t) => (
        <div>
          <p className="font-medium text-stanbic-text">{t.name}</p>
          <p className="text-xs text-stanbic-text/55">{t.file_name}</p>
        </div>
      ),
    },
    {
      id: "schema",
      header: "Variable schema",
      cell: (t) => (
        <span className={schemaBadge(t.variable_schema_status)}>
          {t.variable_schema_status}
        </span>
      ),
    },
    {
      id: "notesGuide",
      header: "Notes guide",
      className: "align-middle text-xs text-stanbic-text/80",
      cell: (t) => {
        const n = t.note_guide_areas?.length ?? 0;
        if (!n) {
          return <span className="text-stanbic-text/45">—</span>;
        }
        return (
          <span className="tabular-nums">
            {n} area{n === 1 ? "" : "s"}
          </span>
        );
      },
    },
    {
      id: "err",
      header: "Last error",
      className:
        "max-w-[min(28rem,40vw)] align-top text-xs text-stanbic-text/90",
      cell: (t) =>
        t.schema_extraction_error ? (
          <span
            className="line-clamp-4 text-red-800"
            title={t.schema_extraction_error}
          >
            {t.schema_extraction_error}
          </span>
        ) : (
          <span className="text-stanbic-text/45">—</span>
        ),
    },
    {
      id: "updated",
      header: "Updated",
      className: "text-stanbic-text/70 text-xs whitespace-nowrap",
      cell: (t) => formatShortDate(t.updated_at),
    },
    {
      id: "actions",
      header: "",
      headerClassName: "w-14",
      className: "w-14 text-right",
      cell: (t) => (
        <RowActionsMenu
          ariaLabel={`Actions for ${t.name}`}
          disabled={tableAsyncBusy}
          items={[
            ...(t.variable_schema_status === "failed"
              ? [
                  {
                    key: "retry",
                    label: "Retry schema extraction",
                    onClick: () => void retrySchemaExtraction(t),
                  },
                ]
              : []),
            {
              key: "dl",
              label: "Download .docx",
              onClick: () => void downloadOriginal(t),
            },
            {
              key: "del",
              label: "Delete",
              danger: true,
              onClick: () => setPendingDelete(t),
            },
          ]}
        />
      ),
    },
  ];

  if (loading && templates.length === 0) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4">
        <LoadingSpinner size="lg" color="primary" />
        <p className="text-stanbic-text/70">Loading document templates…</p>
      </div>
    );
  }

  return (
    <>
      <Card
        padding="none"
        rounded="xl"
        className="min-w-0 border-stanbic-border shadow-sm shadow-stanbic-text/[0.04]"
      >
        <div className="min-w-0 max-w-full px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-stanbic-text">
                Word document templates
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-stanbic-text/70">
                Upload a .docx file with Jinja-style placeholders. IdeaHub extracts
                a variable schema in the background (Azure OpenAI). Once
                schema status is <span className="font-medium text-stanbic-text">completed</span>,
                users can generate documents from an idea&apos;s Documents tab.
                Use the row expand control to read the full notes guide for each
                template.
              </p>
            </div>
            <Button
              variant="primary"
              className="shrink-0 whitespace-nowrap self-start sm:self-center"
              onClick={() => {
                setError(null);
                resetUploadForm();
                setUploadOpen(true);
              }}
            >
              <PlusIcon className="mr-2 h-4 w-4 shrink-0" />
              Upload template
            </Button>
          </div>

          {downloadingTemplateId !== null || retryingTemplateId !== null ? (
            <div
              className="mt-4 flex items-center gap-3 rounded-lg border border-stanbic-border bg-stanbic-canvas/40 px-4 py-3 text-sm text-stanbic-text shadow-sm"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <LoadingSpinner size="sm" color="primary" />
              <span>
                {downloadingTemplateId !== null
                  ? `Downloading “${
                      templates.find((x) => x.id === downloadingTemplateId)
                        ?.name ?? "template"
                    }”…`
                  : `Retrying schema for “${
                      templates.find((x) => x.id === retryingTemplateId)?.name ??
                      "template"
                    }”…`}
              </span>
            </div>
          ) : null}

          {error ? (
            <div className="mt-6">
              <CompactErrorWithToast
                error={error}
                title="Notice"
                onRetry={() => setError(null)}
              />
            </div>
          ) : null}

          <div className="mt-6">
            <DataTableToolbar total={templates.length} totalLabel="templates" />
            <DataTable
              columns={columns}
              rows={templates}
              getRowKey={(t) => String(t.id)}
              minWidthClass="min-w-[760px]"
            emptyMessage="No templates yet. Upload a .docx to get started."
            renderExpandedRow={(t) => (
              <div className="rounded-lg border border-stanbic-border/80 bg-white px-4 py-3 sm:px-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-stanbic-text/50">
                  Notes guide
                </p>
                {t.note_guide_areas?.length ? (
                  <div className="mt-2 max-h-[min(50vh,28rem)] overflow-y-auto overscroll-contain pr-1">
                    <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-stanbic-text">
                      {t.note_guide_areas.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-stanbic-text/55">
                    No note guide areas for this template.
                  </p>
                )}
              </div>
            )}
            isRowExpanded={(key) => expandedTemplateKey === key}
            onToggleRowExpand={(key) =>
              setExpandedTemplateKey((k) => (k === key ? null : key))
            }
            getExpandAriaLabel={(t) =>
              expandedTemplateKey === String(t.id)
                ? `Hide notes guide for ${t.name}`
                : `Show full notes guide for ${t.name}`
            }
            />
          </div>
        </div>
      </Card>

      <SimpleModal
        isOpen={uploadOpen}
        onClose={() => {
          if (uploading) return;
          setUploadOpen(false);
          resetUploadForm();
        }}
        title="Upload document template"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              disabled={uploading}
              onClick={() => {
                setUploadOpen(false);
                resetUploadForm();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={uploading}
              disabled={
                uploading ||
                !uploadName.trim() ||
                !uploadExample.trim() ||
                !uploadFile
              }
              onClick={() => void submitUpload()}
            >
              Upload
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Template name"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
            placeholder="e.g. Executive summary"
          />
          <Textarea
            label="Description"
            value={uploadDesc}
            onChange={(e) => setUploadDesc(e.target.value)}
            placeholder="Optional — shown to admins only"
            rows={2}
          />
          <Textarea
            label="Example content"
            value={uploadExample}
            onChange={(e) => setUploadExample(e.target.value)}
            placeholder="Short sample text that illustrates how placeholders should be filled"
            rows={4}
            helperText="Required for the LLM to understand how to map idea data into the template."
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Word file (.docx)
            </label>
            <input
              type="file"
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-800 hover:file:bg-slate-200"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setUploadFile(f ?? null);
              }}
            />
          </div>
        </div>
      </SimpleModal>

      <ConfirmationModal
        isOpen={!!pendingDelete}
        onClose={() => !deleteSubmitting && setPendingDelete(null)}
        onConfirm={() => void runDelete()}
        title="Delete this template?"
        message={
          pendingDelete
            ? `Remove “${pendingDelete.name}”? Generated documents that reference it may still exist in the database.`
            : ""
        }
        type="danger"
        isLoading={deleteSubmitting}
      />
    </>
  );
};
