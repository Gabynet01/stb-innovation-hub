import React from "react";
import { Button } from "../../../../components/ui";
import { FormData } from "../../../../hooks";
import { fileTypes } from "../../../../constants/idea-form";
import { IdeaFormStepIntro } from "./IdeaFormStepHeader";
import {
  ideaFormPanelClass,
  ideaFormSectionLabelClass,
} from "./ideaFormStyles";

interface AttachmentsStepProps {
  formData: FormData;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement> | File[]) => void;
  onRemoveAttachment: (index: number) => void;
}

export const AttachmentsStep: React.FC<AttachmentsStepProps> = ({
  formData,
  onFileUpload,
  onRemoveAttachment,
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const truncateFileName = (fileName: string, maxLength: number = 16) => {
    const lastDotIndex = fileName.lastIndexOf(".");
    if (lastDotIndex === -1) {
      return fileName.length > maxLength
        ? fileName.substring(0, maxLength) + "..."
        : fileName;
    }

    const name = fileName.substring(0, lastDotIndex);
    const extension = fileName.substring(lastDotIndex);

    if (name.length <= maxLength) {
      return fileName;
    }

    return name.substring(0, maxLength) + "..." + extension;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileUpload(files);
    }
  };

  return (
    <div className="mb-1">
      <IdeaFormStepIntro
        title="Supporting files"
        description="Optional. PDF, Office, images—add anything that clarifies your idea."
      />

      <div className={ideaFormPanelClass}>
        <p className={ideaFormSectionLabelClass}>Upload</p>
        <div
          className={`mt-4 rounded-lg border border-dashed p-6 text-center transition-all sm:p-7 ${
            isDragOver
              ? "border-[#0051FF] bg-[#F0F7FF] ring-2 ring-[#0051FF]/15"
              : "border-slate-200 bg-slate-50/40 hover:border-slate-300 hover:bg-slate-50/70"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <p
            className={`text-sm font-medium ${
              isDragOver ? "text-[#0033A1]" : "text-slate-800"
            }`}
          >
            {isDragOver ? "Drop files here" : "Drag and drop here, or browse"}
          </p>
          <p className="mt-1 text-xs text-slate-500">{fileTypes.description}</p>
          <input
            ref={(input) => {
              if (input) input.style.display = "none";
            }}
            type="file"
            multiple
            onChange={onFileUpload}
            id="file-upload"
            accept={fileTypes.accept}
          />
          <Button
            type="button"
            variant="primary"
            size="md"
            className="mt-4 w-full sm:w-auto"
            onClick={() => {
              const el = document.getElementById("file-upload") as HTMLInputElement;
              el?.click();
            }}
          >
            Choose files
          </Button>
        </div>

        {formData.attachments.length > 0 && (
          <ul className="mt-4 space-y-2">
            {formData.attachments.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-2 rounded-lg bg-slate-50/90 px-3 py-2.5 text-sm ring-1 ring-slate-200/80"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate font-medium text-slate-800"
                    title={file.name}
                  >
                    <span className="sm:hidden">
                      {truncateFileName(file.name, 24)}
                    </span>
                    <span className="hidden sm:inline">{file.name}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(index)}
                  className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
