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
    }
  };

  const retrySchemaExtraction = async (t: IdeahubDocumentTemplate) => {
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
          <p className="font-medium text-slate-900">{t.name}</p>
          <p className="text-xs text-slate-500">{t.file_name}</p>
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
      className: "max-w-[min(22rem,36vw)] align-top text-xs text-slate-700",
      cell: (t) =>
        t.note_guide_areas?.length ? (
          <ul className="list-disc space-y-0.5 pl-4">
            {t.note_guide_areas.slice(0, 4).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
            {t.note_guide_areas.length > 4 ? (
              <li className="list-none text-slate-400">
                +{t.note_guide_areas.length - 4} more
              </li>
            ) : null}
          </ul>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      id: "err",
      header: "Last error",
      className: "max-w-[min(28rem,40vw)] align-top text-xs text-slate-700",
      cell: (t) =>
        t.schema_extraction_error ? (
          <span
            className="line-clamp-4 text-red-800"
            title={t.schema_extraction_error}
          >
            {t.schema_extraction_error}
          </span>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      id: "updated",
      header: "Updated",
      className: "text-slate-600 text-xs whitespace-nowrap",
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
        <p className="text-slate-600">Loading document templates…</p>
      </div>
    );
  }

  return (
    <>
      <Card className="border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Word document templates
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Upload a .docx file with Jinja-style placeholders. IdeaHub extracts
              a variable schema in the background (Azure OpenAI). Once
              schema status is <span className="font-medium">completed</span>,
              users can generate documents from an idea&apos;s Documents tab.
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

        {error ? (
          <div className="mt-8">
            <CompactErrorWithToast
              error={error}
              title="Notice"
              onRetry={() => setError(null)}
            />
          </div>
        ) : null}

        <div className="mt-6">
          <DataTable
            columns={columns}
            rows={templates}
            getRowKey={(t) => String(t.id)}
            emptyMessage="No templates yet. Upload a .docx to get started."
          />
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
