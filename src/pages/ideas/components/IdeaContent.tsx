import React, { useCallback, useState } from "react";
import {
  UserIcon,
  PaperClipIcon,
  HashtagIcon,
  TagIcon,
  FolderOpenIcon,
  DocumentTextIcon,
  Square3Stack3DIcon,
  ChatBubbleLeftEllipsisIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { Idea } from "@/types/api";
import { parseIdeaContextFromBody } from "@/utils/idea-context";
import { IDEA_WORK_ITEM_LABELS } from "@/constants/referenceData";
import { AttachmentViewer } from "./AttachmentViewer";
import { detailSectionLabel } from "./ideaDetailStyles";

interface IdeaContentProps {
  idea: Idea;
}

function formatIdeahubLabel(raw: string | undefined | null): string {
  if (!raw) return "—";
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function pipelineDisplay(status: Idea["status"]): { label: string; tone: string } {
  switch (status) {
    case "NEW":
      return {
        label: "New",
        tone: "from-sky-500/[0.12] to-sky-600/[0.04] border-sky-300/50 text-sky-950",
      };
    case "PROCESSED":
      return {
        label: "Processed",
        tone: "from-emerald-500/[0.12] to-emerald-600/[0.04] border-emerald-300/50 text-emerald-950",
      };
    case "ARCHIVED":
      return {
        label: "Archived",
        tone: "from-slate-400/[0.2] to-slate-500/[0.06] border-slate-300/60 text-slate-900",
      };
    default:
      return {
        label: status,
        tone: "from-slate-400/[0.15] to-slate-500/[0.05] border-slate-300/50 text-slate-900",
      };
  }
}

function workflowDisplay(raw: string): { label: string; tone: string } {
  const label = formatIdeahubLabel(raw);
  const s = raw.toLowerCase();
  if (s === "draft")
    return {
      label,
      tone: "from-slate-500/[0.12] to-slate-600/[0.04] border-slate-300/55 text-slate-900",
    };
  if (s === "under_review")
    return {
      label,
      tone: "from-amber-400/[0.2] to-amber-600/[0.06] border-amber-300/60 text-amber-950",
    };
  if (s === "approved")
    return {
      label,
      tone: "from-emerald-500/[0.14] to-emerald-700/[0.05] border-emerald-300/55 text-emerald-950",
    };
  if (s === "rejected")
    return {
      label,
      tone: "from-rose-400/[0.16] to-rose-600/[0.05] border-rose-300/55 text-rose-950",
    };
  if (s === "implemented")
    return {
      label,
      tone: "from-violet-500/[0.14] to-violet-700/[0.05] border-violet-300/55 text-violet-950",
    };
  return {
    label,
    tone: "from-slate-400/[0.12] to-slate-600/[0.04] border-slate-300/50 text-slate-900",
  };
}

function StatusBlock({
  heading,
  value,
  toneClass,
}: {
  heading: string;
  value: string;
  toneClass: string;
}) {
  return (
    <div
      className={`min-w-[10rem] flex-1 rounded-2xl border bg-gradient-to-br px-5 py-4 shadow-sm transition hover:shadow-md sm:min-w-[11rem] ${toneClass}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600/90">
        {heading}
      </p>
      <p className="mt-2 text-xl font-bold leading-snug tracking-tight">{value}</p>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  icon,
  children,
  dense,
}: {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  dense?: boolean;
}) {
  return (
    <section className="group/section overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_2px_24px_-8px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.035] transition hover:shadow-[0_8px_32px_-12px_rgba(15,23,42,0.1)]">
      <div className="relative border-b border-slate-100/90 bg-gradient-to-r from-white to-slate-50/50 px-5 py-4 sm:px-6">
        <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-[#0051FF] to-[#0038CC]" aria-hidden />
        <div className="flex items-start gap-3 pl-1">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0051FF]/[0.08] text-[#0051FF] ring-1 ring-[#0051FF]/15">
            {icon}
          </span>
          <div className="min-w-0 pt-0.5">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className={
          dense
            ? "px-5 py-4 sm:px-6 sm:py-5"
            : "px-5 py-5 sm:px-6 sm:py-7"
        }
      >
        {children}
      </div>
    </section>
  );
}

export function IdeaContent({ idea }: IdeaContentProps) {
  const parsed = parseIdeaContextFromBody(idea.body);
  const descriptionText = parsed.coreDescription.trim();
  const hasDescription = descriptionText.length > 0;
  const hasInnovationContext =
    !!parsed.organizationalUnit || parsed.workItemType !== null;
  const hasContact =
    idea.contact && (idea.contact.email || idea.contact.phone);
  const hasAttachments = idea.attachments && idea.attachments.length > 0;

  const workflowRaw = idea.ideahub_status?.trim();
  const pipe = pipelineDisplay(idea.status);
  const flow = workflowRaw ? workflowDisplay(workflowRaw) : null;

  const [refCopied, setRefCopied] = useState(false);
  const copyReference = useCallback(async () => {
    if (!idea.reference_number) return;
    try {
      await navigator.clipboard.writeText(idea.reference_number);
      setRefCopied(true);
      window.setTimeout(() => setRefCopied(false), 2000);
    } catch {
      setRefCopied(false);
    }
  }, [idea.reference_number]);

  return (
    <div className="flex w-full flex-col gap-8">
      {/* Hero: status + reference — editorial, scannable */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_4px_32px_-12px_rgba(0,51,161,0.12)] ring-1 ring-slate-900/[0.04]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage: `radial-gradient(at 0% 0%, rgba(0,81,255,0.14) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(0,56,204,0.08) 0px, transparent 45%)`,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#0051FF] via-[#0051FF] to-[#0038CC]"
          aria-hidden
        />
        <div className="relative px-5 py-7 sm:px-8 sm:py-8">
          <p className={detailSectionLabel}>Idea state</p>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-8">
            <div className="flex min-w-0 flex-1 flex-wrap gap-3 sm:gap-4">
              <StatusBlock
                heading="Pipeline"
                value={pipe.label}
                toneClass={pipe.tone}
              />
              {flow ? (
                <StatusBlock
                  heading="Workflow"
                  value={flow.label}
                  toneClass={flow.tone}
                />
              ) : (
                <div className="flex min-w-[10rem] flex-1 items-center rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/80 px-5 py-4 text-sm text-slate-500">
                  No workflow state on record.
                </div>
              )}
            </div>
            {idea.reference_number ? (
              <div className="flex shrink-0 flex-col justify-center rounded-2xl border border-slate-200/90 bg-slate-50/90 px-5 py-4 shadow-inner sm:min-w-[14rem]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    <HashtagIcon className="h-3.5 w-3.5" aria-hidden />
                    Reference
                  </div>
                  <button
                    type="button"
                    onClick={() => void copyReference()}
                    className="rounded-lg border border-transparent p-1.5 text-slate-500 transition hover:border-slate-200 hover:bg-white hover:text-[#0051FF]"
                    aria-label={
                      refCopied
                        ? "Reference copied"
                        : "Copy reference number"
                    }
                    title="Copy reference"
                  >
                    {refCopied ? (
                      <CheckIcon className="h-4 w-4 text-emerald-600" aria-hidden />
                    ) : (
                      <ClipboardDocumentIcon className="h-4 w-4" aria-hidden />
                    )}
                  </button>
                </div>
                <p className="mt-2 font-mono text-lg font-bold tracking-tight text-slate-900">
                  {idea.reference_number}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <SectionCard
        title="Classification"
        subtitle="How this idea is labelled for routing and reporting."
        icon={<Square3Stack3DIcon className="h-5 w-5" aria-hidden />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="group flex gap-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-4 shadow-sm ring-1 ring-slate-900/[0.03] transition hover:border-[#0051FF]/25 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0051FF]/15 to-[#0051FF]/5 text-[#0051FF] ring-1 ring-[#0051FF]/20">
              <TagIcon className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Idea category
              </p>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug text-slate-900">
                {idea.category_label}
              </p>
            </div>
          </div>
          <div className="group flex gap-4 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-4 shadow-sm ring-1 ring-slate-900/[0.03] transition hover:border-slate-300/90 hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200/90 to-slate-100 text-slate-700 ring-1 ring-slate-300/50">
              <FolderOpenIcon className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                Collection source
              </p>
              <p className="mt-1.5 text-[15px] font-semibold leading-snug text-slate-900">
                {idea.source_label}
              </p>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Description"
        subtitle="Primary narrative for this idea — exactly as stored."
        icon={<DocumentTextIcon className="h-5 w-5" aria-hidden />}
      >
        <div className="relative">
          <div
            className="absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-[#0051FF]/50 via-[#0051FF]/25 to-transparent sm:block"
            aria-hidden
          />
          <div className="sm:pl-6">
            {hasDescription ? (
              <p className="max-w-prose whitespace-pre-wrap text-[17px] leading-[1.75] text-slate-800">
                {descriptionText}
              </p>
            ) : (
              <p className="max-w-prose text-[15px] italic leading-relaxed text-slate-500">
                No description was provided for this idea.
              </p>
            )}
          </div>
        </div>
      </SectionCard>

      {hasInnovationContext ? (
        <SectionCard
          title="Additional context"
          subtitle="Structured context captured in the submission."
          icon={<ChatBubbleLeftEllipsisIcon className="h-5 w-5" aria-hidden />}
          dense
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {parsed.organizationalUnit ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 ring-1 ring-slate-900/[0.03]">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Organisational unit
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {parsed.organizationalUnit}
                </p>
              </div>
            ) : null}
            {parsed.workItemType ? (
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 ring-1 ring-slate-900/[0.03]">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  Work item framing
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {IDEA_WORK_ITEM_LABELS[parsed.workItemType]}
                </p>
              </div>
            ) : null}
          </div>
        </SectionCard>
      ) : null}

      {hasContact ? (
        <SectionCard
          title="Contact"
          subtitle="Reach-out details from the submitter."
          icon={<UserIcon className="h-5 w-5" aria-hidden />}
          dense
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 ring-1 ring-slate-200/80">
              <UserIcon className="h-6 w-6" aria-hidden />
            </div>
            <div className="grid min-w-0 flex-1 gap-6 sm:grid-cols-2">
              {!!idea.contact!.email && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Email
                  </p>
                  <p className="mt-2 break-all text-sm font-semibold text-slate-900">
                    {String(idea.contact!.email)}
                  </p>
                </div>
              )}
              {!!idea.contact!.phone && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    Phone
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {String(idea.contact!.phone)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      ) : null}

      {hasAttachments ? (
        <SectionCard
          title="Attachments"
          subtitle={`${idea.attachments!.length} file${
            idea.attachments!.length === 1 ? "" : "s"
          } linked to this idea.`}
          icon={<PaperClipIcon className="h-5 w-5" aria-hidden />}
          dense
        >
          <AttachmentViewer attachments={idea.attachments!} />
        </SectionCard>
      ) : null}
    </div>
  );
}
