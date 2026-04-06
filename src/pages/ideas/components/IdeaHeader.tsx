import React, { useState } from "react";
import { getRelativeTime } from "@/utils/date";
import type { Idea } from "@/types/api";
import type { IdeahubIdeaStatus } from "@/types/ideahub";
import { Button, PageHeader } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { IDEAHUB_STATUS_LABEL } from "@/pages/dashboard/aggregateIdeaStatuses";

const STATUS_ORDER: IdeahubIdeaStatus[] = [
  "draft",
  "under_review",
  "approved",
  "rejected",
  "implemented",
];

interface IdeaHeaderProps {
  idea: Idea;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange?: (status: IdeahubIdeaStatus) => Promise<void>;
}

export const IdeaHeader: React.FC<IdeaHeaderProps> = ({
  idea,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const { isAdmin } = useAuth();
  const [changingStatus, setChangingStatus] = useState(false);

  const currentStatus = idea.ideahub_status ?? "draft";

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as IdeahubIdeaStatus;
    if (next === currentStatus || !onStatusChange) return;
    setChangingStatus(true);
    try {
      await onStatusChange(next);
    } finally {
      setChangingStatus(false);
    }
  };

  const sub =
    idea.updated_at !== idea.created_at
      ? `Created ${getRelativeTime(idea.created_at)} · Updated ${getRelativeTime(idea.updated_at)}`
      : `Created ${getRelativeTime(idea.created_at)}`;

  const metaParts = [
    idea.author_type === "STAFF" ? "Staff submitter" : "Customer submitter",
    sub,
  ];
  if (idea.reference_number) {
    metaParts.push(`Ref ${idea.reference_number}`);
  }

  return (
    <PageHeader
      breadcrumbs={[{ label: "Idea Bank", onClick: onClose }]}
      title={idea.title}
      titleClassName="break-words"
      description={metaParts.join(" · ")}
      actions={
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          {isAdmin && onStatusChange && (
            <div className="relative w-full sm:w-auto">
              <select
                value={currentStatus}
                onChange={(e) => void handleStatusChange(e)}
                disabled={changingStatus}
                aria-label="Change idea status"
                className="w-full appearance-none rounded-lg border border-stanbic-border bg-white px-3 py-2 pr-8 text-sm font-medium text-stanbic-text transition hover:border-stanbic-secondary focus:outline-none focus:ring-2 focus:ring-stanbic-secondary/40 disabled:opacity-50 sm:w-auto"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {IDEAHUB_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                {changingStatus ? (
                  <svg className="h-4 w-4 animate-spin text-stanbic-secondary" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          )}
          <Button type="button" variant="secondary" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Back to list
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={onEdit} className="w-full sm:w-auto">
            Edit idea
          </Button>
          <Button type="button" variant="danger" size="sm" onClick={onDelete} className="w-full sm:w-auto">
            Delete
          </Button>
        </div>
      }
    />
  );
};
