import React from "react";
import { getRelativeTime } from "@/utils/date";
import type { Idea } from "@/types/api";
import { Button, PageHeader } from "@/components/ui";

interface IdeaHeaderProps {
  idea: Idea;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const IdeaHeader: React.FC<IdeaHeaderProps> = ({
  idea,
  onClose,
  onEdit,
  onDelete,
}) => {
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
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Back to list
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onEdit}
            className="w-full sm:w-auto"
          >
            Edit idea
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onDelete}
            className="w-full sm:w-auto"
          >
            Delete
          </Button>
        </div>
      }
    />
  );
};
