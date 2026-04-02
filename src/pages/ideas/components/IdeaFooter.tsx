import React from "react";
import { Button } from "@/components/ui";
import { detailInnerColumn, detailPageGutterX } from "./ideaDetailStyles";

interface IdeaFooterProps {
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const IdeaFooter: React.FC<IdeaFooterProps> = ({
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className={`${detailPageGutterX} py-4`}>
        <div
          className={`${detailInnerColumn} flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3`}
        >
        <Button
          onClick={onClose}
          variant="secondary"
          size="md"
          className="w-full sm:w-auto"
        >
          Close
        </Button>
        <Button
          onClick={onEdit}
          variant="primary"
          size="md"
          className="w-full sm:w-auto"
        >
          Edit idea
        </Button>
        <Button
          onClick={onDelete}
          variant="danger"
          size="md"
          className="w-full sm:w-auto"
        >
          Delete
        </Button>
        </div>
      </div>
    </footer>
  );
};
