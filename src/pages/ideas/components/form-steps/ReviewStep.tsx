import React from "react";
import { Button } from "../../../../components/ui";
import { FormData } from "../../../../hooks";
import { IdeaFormStepIntro } from "./IdeaFormStepHeader";
import { ideaFormReviewPanelClass } from "./ideaFormStyles";
import type {
  IdeahubIdeaCategory,
  IdeahubIdeaSource,
} from "@/types/ideahub";

interface ReviewStepProps {
  formData: FormData;
  expandedSections: Record<string, boolean>;
  onToggleSection: (section: string) => void;
  onEditStep: (step: number) => void;
  sources: IdeahubIdeaSource[];
  categories: IdeahubIdeaCategory[];
  /** When true, contact step was skipped (signed-in submitter). */
  isAuthenticated: boolean;
}

function AccordionBar({
  title,
  open,
  onClick,
}: {
  title: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between border-b border-slate-200 bg-slate-50/90 px-4 py-3 text-left transition hover:bg-slate-100/90 sm:px-5 sm:py-3.5"
      onClick={onClick}
    >
      <span className="text-sm font-semibold text-slate-900 sm:text-base">
        {title}
      </span>
      <span className="text-slate-500 tabular-nums" aria-hidden>
        {open ? "▼" : "▶"}
      </span>
    </button>
  );
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  expandedSections,
  onToggleSection,
  onEditStep,
  sources,
  categories,
  isAuthenticated,
}) => {
  const sourceName =
    sources.find((s) => s.id === formData.source_id)?.name ?? "—";
  const cat = categories.find((c) => c.id === formData.category_id);

  const contactRows: { label: string; value: React.ReactNode }[] = [];
  if (formData.contact.email) {
    contactRows.push({ label: "Email", value: formData.contact.email });
  }
  if (formData.contact.phone) {
    contactRows.push({ label: "Phone", value: formData.contact.phone });
  }

  const reviewThead = (
    <thead>
      <tr className="border-b border-stanbic-border bg-white">
        <th
          scope="col"
          className="w-1/3 px-3 py-3 text-left text-sm font-medium leading-[130%] text-stanbic-text sm:px-4"
        >
          Field
        </th>
        <th
          scope="col"
          className="px-3 py-3 text-left text-sm font-medium leading-[130%] text-stanbic-text sm:px-4"
        >
          Value
        </th>
      </tr>
    </thead>
  );

  const stripe = (i: number) =>
    i % 2 === 1 ? "bg-stanbic-canvas" : "bg-white";

  return (
    <div className="mb-1">
      <IdeaFormStepIntro
        title="Review & submit"
        description="Confirm details below. Expand a section or use Edit to jump back."
      />

      <div className={ideaFormReviewPanelClass}>
        <div className="space-y-3">
          <div className="overflow-hidden rounded-xl border border-stanbic-border">
            <AccordionBar
              title="Idea & classification"
              open={!!expandedSections.basicInfo}
              onClick={() => onToggleSection("basicInfo")}
            />
            {expandedSections.basicInfo && (
              <div className="border-t border-stanbic-border/60 px-4 py-4 sm:px-5">
                <div className="overflow-hidden rounded-lg border border-stanbic-border">
                  <table className="w-full text-left text-sm">
                    {reviewThead}
                    <tbody>
                      <tr className={stripe(0)}>
                        <td className="w-1/3 px-3 py-2.5 text-xs font-medium leading-[130%] text-stanbic-text sm:px-4 sm:text-sm">
                          Title
                        </td>
                        <td className="px-3 py-2.5 text-xs font-normal leading-[130%] text-stanbic-text sm:px-4 sm:text-sm">
                          {formData.title}
                        </td>
                      </tr>
                      <tr className={stripe(1)}>
                        <td className="px-3 py-2.5 text-xs font-medium leading-[130%] text-stanbic-text sm:px-4 sm:text-sm align-top">
                          Description
                        </td>
                        <td className="max-w-md whitespace-pre-wrap px-3 py-2.5 text-xs font-normal leading-[130%] text-stanbic-text sm:px-4 sm:text-sm">
                          {formData.description}
                        </td>
                      </tr>
                      <tr className={stripe(2)}>
                        <td className="px-3 py-2.5 text-xs font-medium leading-[130%] text-stanbic-text sm:px-4 sm:text-sm">
                          Collection source
                        </td>
                        <td className="px-3 py-2.5 text-xs font-normal leading-[130%] text-stanbic-text sm:px-4 sm:text-sm">
                          {sourceName}
                        </td>
                      </tr>
                      <tr className={stripe(3)}>
                        <td className="px-3 py-2.5 text-xs font-medium leading-[130%] text-stanbic-text sm:px-4 sm:text-sm">
                          Idea Category
                        </td>
                        <td className="px-3 py-2.5 text-xs font-normal leading-[130%] text-stanbic-text sm:px-4 sm:text-sm">
                          {cat?.name ?? "—"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEditStep(1)}
                  >
                    Edit source
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEditStep(2)}
                  >
                    Edit category
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEditStep(3)}
                  >
                    Edit idea
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!isAuthenticated ? (
            <div className="overflow-hidden rounded-xl border border-stanbic-border">
              <AccordionBar
                title="Contact"
                open={!!expandedSections.contactInfo}
                onClick={() => onToggleSection("contactInfo")}
              />
              {expandedSections.contactInfo && (
                <div className="border-t border-stanbic-border/60 px-4 py-4 sm:px-5">
                  <div className="overflow-hidden rounded-lg border border-stanbic-border">
                    <table className="w-full text-left text-sm">
                      {reviewThead}
                      <tbody>
                        {contactRows.length > 0 ? (
                          contactRows.map((row, i) => (
                            <tr key={row.label} className={stripe(i)}>
                              <td className="w-1/3 px-3 py-2.5 text-xs font-medium leading-[130%] text-stanbic-text sm:px-4 sm:text-sm">
                                {row.label}
                              </td>
                              <td className="px-3 py-2.5 text-xs font-normal leading-[130%] text-stanbic-text sm:px-4 sm:text-sm">
                                {row.value}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr className={stripe(0)}>
                            <td
                              colSpan={2}
                              className="px-3 py-2.5 text-xs font-normal italic leading-[130%] text-stanbic-text/60 sm:px-4 sm:text-sm"
                            >
                              No contact details
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEditStep(4)}
                    >
                      Edit contact
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="rounded-xl border border-stanbic-border bg-stanbic-canvas/80 px-4 py-3 text-sm font-normal leading-[130%] text-stanbic-text/75">
              You are signed in — IdeaHub will record you as the internal submitter.
              Contact fields were not required.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
