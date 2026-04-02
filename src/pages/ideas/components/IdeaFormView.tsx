import React from "react";
import { IdeaForm } from "./IdeaForm";
import { Idea } from "@/types/api";
import type { IdeaFormData } from "@/hooks";
import type {
  IdeahubIdeaCategory,
  IdeahubIdeaSource,
} from "@/types/ideahub";

export interface IdeaFormViewProps {
  sources: IdeahubIdeaSource[];
  categories: IdeahubIdeaCategory[];
  selectedIdea: Idea | null;
  onSubmit: (data: IdeaFormData) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

/** Create / edit idea flow (layout and stepper live in IdeaForm). */
export const IdeaFormView: React.FC<IdeaFormViewProps> = (props) => (
  <IdeaForm
    sources={props.sources}
    categories={props.categories}
    onSubmit={props.onSubmit}
    onCancel={props.onCancel}
    editingIdea={props.selectedIdea}
    loading={props.loading}
  />
);
