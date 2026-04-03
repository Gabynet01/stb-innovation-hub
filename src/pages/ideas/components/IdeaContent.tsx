import React, { useCallback, useMemo, useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import type { Idea } from "@/types/api";
import {
  StatusDotBadge,
  statusToneFromString,
  type StatusDotTone,
} from "@/components/ui";
import { parseIdeaContextFromBody } from "@/utils/idea-context";
import { IDEA_WORK_ITEM_LABELS } from "@/constants/referenceData";
import { AttachmentViewer } from "./AttachmentViewer";

interface IdeaContentProps {
  idea: Idea;
}

const LONG_DESCRIPTION_SCROLL = 1400;
const DROP_CAP_MIN_LENGTH = 480;

function formatIdeahubLabel(raw: string | undefined | null): string {
  if (!raw) return "—";
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function pipelineLabel(status: Idea["status"]): string {
  switch (status) {
    case "NEW":
      return "New";
    case "PROCESSED":
      return "Processed";
    case "ARCHIVED":
      return "Archived";
    default:
      return status;
  }
}

function pipelineTone(status: Idea["status"]): StatusDotTone {
  switch (status) {
    case "NEW":
      return "pending";
    case "PROCESSED":
      return "success";
    case "ARCHIVED":
      return "neutral";
    default:
      return "neutral";
  }
}

/** Shared section chrome inside the inspector panel */
function AsideSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 py-4 sm:px-6 sm:py-5">
      <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-stanbic-text/32">
        {title}
      </h3>
      {children}
    </section>
  );
}

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-stanbic-text/38">
        {label}
      </p>
      <div className="text-sm font-medium leading-relaxed text-stanbic-text">
        {children}
      </div>
    </div>
  );
}

function DescriptionReader({ text }: { text: string }) {
  const useScroll = text.length >= LONG_DESCRIPTION_SCROLL;
  const useDropCap = text.length >= DROP_CAP_MIN_LENGTH;

  const scrollWrap = useScroll
    ? "max-h-[min(72vh,52rem)] overflow-y-auto overscroll-y-contain [scrollbar-gutter:stable]"
    : "";

  const proseClass = useMemo(
    () =>
      [
        "font-reader text-[1.0625rem] sm:text-[1.125rem] leading-[1.82] text-[#2a3238]",
        "selection:bg-stanbic-secondary/18 whitespace-pre-wrap text-pretty",
        useDropCap
          ? "first-letter:float-left first-letter:mr-2.5 first-letter:mt-0.5 first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-stanbic-text first-letter:[font-size:2.85rem]"
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    [useDropCap]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f9f7f2] lg:min-h-0">
      <div
        className={`min-h-0 flex-1 px-7 py-11 sm:px-12 sm:py-14 lg:px-14 lg:py-16 ${scrollWrap}`}
      >
        <article
          className="mx-auto max-w-[42rem]"
          aria-label="Idea description, reading layout"
        >
          <p className={proseClass}>{text}</p>
        </article>
      </div>
    </div>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0 border-b border-stanbic-border/40 bg-white px-5 py-3 sm:px-6">
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stanbic-text/32">
        {children}
      </span>
    </div>
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
  const workflowLabel = workflowRaw ? formatIdeahubLabel(workflowRaw) : null;
  const workflowTone = workflowRaw
    ? statusToneFromString(workflowRaw)
    : "neutral";

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
    <div className="flex min-h-0 min-h-[min(62vh,580px)] flex-1 flex-col overflow-hidden lg:grid lg:h-full lg:min-h-0 lg:grid-cols-12 lg:divide-x lg:divide-stanbic-border/80 lg:items-stretch">
      <aside className="border-b border-stanbic-border/80 bg-stanbic-canvas/40 px-4 py-4 sm:px-5 sm:py-5 lg:col-span-4 xl:col-span-3 lg:flex lg:h-full lg:min-h-0 lg:border-b-0 lg:bg-transparent lg:px-5 lg:py-1">
        <div className="flex h-full min-h-0 flex-1 flex-col divide-y divide-stanbic-border/35 overflow-hidden rounded-xl border border-stanbic-border/70 bg-white shadow-sm">
          <AsideSection title="Status">
            <div className="flex flex-wrap gap-2">
              <StatusDotBadge
                label={pipelineLabel(idea.status)}
                tone={pipelineTone(idea.status)}
                className="!text-xs"
              />
              {workflowLabel ? (
                <StatusDotBadge
                  label={workflowLabel}
                  tone={workflowTone}
                  className="!text-xs"
                />
              ) : (
                <span className="self-center text-xs text-stanbic-text/42">
                  No workflow state
                </span>
              )}
            </div>
          </AsideSection>

          {idea.reference_number ? (
            <AsideSection title="Reference">
              <div className="flex items-center justify-between gap-3">
                <code className="min-w-0 break-all text-sm font-medium tracking-tight text-stanbic-text">
                  {idea.reference_number}
                </code>
                <button
                  type="button"
                  onClick={() => void copyReference()}
                  className="shrink-0 rounded-md p-2 text-stanbic-text/35 transition hover:bg-stanbic-canvas hover:text-stanbic-secondary"
                  aria-label={refCopied ? "Copied" : "Copy reference number"}
                >
                  {refCopied ? (
                    <CheckIcon className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </AsideSection>
          ) : null}

          <AsideSection title="Classification">
            <div className="space-y-5">
              <PropRow label="Category">{idea.category_label}</PropRow>
              <PropRow label="Source">{idea.source_label}</PropRow>
            </div>
          </AsideSection>

          {hasInnovationContext ? (
            <AsideSection title="Context">
              <div className="space-y-5">
                {parsed.organizationalUnit ? (
                  <PropRow label="Organisational unit">
                    {parsed.organizationalUnit}
                  </PropRow>
                ) : null}
                {parsed.workItemType ? (
                  <PropRow label="Work item">
                    {IDEA_WORK_ITEM_LABELS[parsed.workItemType]}
                  </PropRow>
                ) : null}
              </div>
            </AsideSection>
          ) : null}

          {hasContact ? (
            <AsideSection title="Contact">
              <div className="space-y-5">
                {!!idea.contact!.email && (
                  <PropRow label="Email">
                    <span className="break-all">{String(idea.contact!.email)}</span>
                  </PropRow>
                )}
                {!!idea.contact!.phone && (
                  <PropRow label="Phone">
                    {String(idea.contact!.phone)}
                  </PropRow>
                )}
              </div>
            </AsideSection>
          ) : null}
          {/* Fills remaining column height so inspector aligns with reader (lg+) */}
          <div
            className="hidden min-h-0 flex-1 bg-white lg:block"
            aria-hidden
          />
        </div>
      </aside>

      <div className="flex h-full min-h-0 flex-1 flex-col bg-white lg:col-span-8 xl:col-span-9">
        <PanelLabel>Description</PanelLabel>

        {hasDescription ? (
          <DescriptionReader text={descriptionText} />
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center bg-[#f9f7f2] px-6 py-16">
            <p className="max-w-sm text-center text-sm text-stanbic-text/45">
              No description was provided for this idea.
            </p>
          </div>
        )}

        {hasAttachments ? (
          <div className="shrink-0 border-t border-stanbic-border/40 bg-white">
            <PanelLabel>
              Attachments · {idea.attachments!.length}
            </PanelLabel>
            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <AttachmentViewer attachments={idea.attachments!} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
