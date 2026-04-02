export interface IdeaFormStepMeta {
  number: number;
  label: string;
  key: string;
}

export function getIdeaFormSteps(isAuthenticated: boolean): IdeaFormStepMeta[] {
  if (isAuthenticated) {
    return [
      { number: 1, label: "Source", key: "source" },
      { number: 2, label: "Idea Category", key: "category" },
      { number: 3, label: "Your idea", key: "content" },
      { number: 4, label: "Review", key: "review" },
    ];
  }
  return [
    { number: 1, label: "Source", key: "source" },
    { number: 2, label: "Idea Category", key: "category" },
    { number: 3, label: "Your idea", key: "content" },
    { number: 4, label: "Contact", key: "contact" },
    { number: 5, label: "Review", key: "review" },
  ];
}

/** @deprecated Use getIdeaFormSteps */
export const formSteps = getIdeaFormSteps(false);

export const IDEA_FORM_HERO_PATTERN_SVG =
  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";

/** Legacy attachment step (optional); not used in the main idea flow. */
export const fileTypes = {
  accept: ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif",
  description: "Support for PDF, DOC, DOCX, TXT, JPG, PNG, GIF files",
};
