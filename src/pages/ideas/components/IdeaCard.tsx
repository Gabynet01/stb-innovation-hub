import React, { useMemo, useCallback } from "react";
import { Idea } from "@/types/api";
import { RowActionsMenu } from "@/components/ui";
import { getRelativeTime } from "@/utils/date";
import { parseIdeaContextFromBody } from "@/utils/idea-context";

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onView: (idea: Idea) => void;
}

const IdeaCardComponent: React.FC<IdeaCardProps> = ({
  idea,
  onEdit,
  onDelete,
  onView,
}) => {
  const statusLabel = useMemo(() => {
    switch (idea.status) {
      case "NEW":
        return "New";
      case "PROCESSED":
        return "Processed";
      case "ARCHIVED":
        return "Archived";
      default:
        return idea.status;
    }
  }, [idea.status]);

  const statusStyle = useMemo(() => {
    switch (idea.status) {
      case "NEW":
        return "bg-[#0051FF]/10 text-[#0033A1] ring-1 ring-[#0051FF]/20";
      case "PROCESSED":
        return "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100";
      case "ARCHIVED":
        return "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }, [idea.status]);

  const relativeTime = useMemo(
    () => getRelativeTime(idea.created_at),
    [idea.created_at]
  );

  const bodyPreview = useMemo(() => {
    const core = parseIdeaContextFromBody(idea.body).coreDescription;
    return core.length > 140 ? `${core.substring(0, 140)}…` : core;
  }, [idea.body]);

  const pipeline = idea.ideahub_status
    ? idea.ideahub_status.replace(/_/g, " ")
    : null;

  const onCardClick = useCallback(() => onView(idea), [onView, idea]);
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <article
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-sm transition-all duration-200 hover:border-[#0051FF]/35 hover:shadow-md hover:shadow-[#0051FF]/10"
      onClick={onCardClick}
    >
      <div
        className="h-1 w-full bg-gradient-to-r from-[#0033A1] via-[#0051FF] to-[#50BEFF] opacity-90"
        aria-hidden
      />

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <div className="mb-4 flex flex-wrap items-center gap-2.5 text-xs">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle}`}
          >
            {statusLabel}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500">{relativeTime}</span>
          {pipeline && (
            <>
              <span className="text-slate-400">·</span>
              <span className="capitalize text-slate-600">{pipeline}</span>
            </>
          )}
        </div>

        <h3 className="mb-3 text-lg font-semibold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-[#0051FF] sm:text-xl">
          {idea.title}
        </h3>

        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:text-[15px] sm:leading-relaxed">
          {bodyPreview}
        </p>

        <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1.5 text-xs sm:text-[13px]">
          <span className="font-medium text-[#0033A1]/90">{idea.category_label}</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">{idea.source_label}</span>
          {idea.attachments && idea.attachments.length > 0 && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-slate-500">
                {idea.attachments.length} file
                {idea.attachments.length !== 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>
      </div>

      <footer
        className="flex items-center justify-end border-t border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-6 py-3 sm:px-8"
        onClick={stop}
      >
        <RowActionsMenu
          ariaLabel={`Actions for ${idea.title}`}
          items={[
            {
              key: "view",
              label: "View",
              onClick: () => onView(idea),
            },
            {
              key: "edit",
              label: "Edit",
              onClick: () => onEdit(idea),
            },
            {
              key: "delete",
              label: "Delete",
              danger: true,
              onClick: () => void onDelete(idea.id),
            },
          ]}
        />
      </footer>
    </article>
  );
};

export const IdeaCard = React.memo(IdeaCardComponent);
