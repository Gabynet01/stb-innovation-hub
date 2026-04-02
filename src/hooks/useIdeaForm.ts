import { useState, useEffect, useCallback } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Idea } from "@/types/api";

export interface ContactInfo {
  email: string | null;
  phone: string | null;
}

export interface FormAttachment {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface IdeaFormData {
  source_id: number;
  category_id: number;
  title: string;
  body: string;
  contact: ContactInfo;
  attachments: FormAttachment[];
}

/** Matches IdeaHub: title + description only (stored as `description` on the API). */
export interface FormData {
  source_id: number | null;
  category_id: number | null;
  title: string;
  description: string;
  contact: ContactInfo;
  attachments: FormAttachment[];
}

const MAX_DESCRIPTION_LEN = 10000;

export const useIdeaForm = (
  editingIdea: Idea | null,
  loading: boolean,
  isAuthenticated: boolean
) => {
  const maxStep = isAuthenticated ? 4 : 5;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    if (editingIdea) {
      return {
        source_id: editingIdea.source_id,
        category_id: editingIdea.category_id,
        title: editingIdea.title,
        description: editingIdea.body ?? "",
        contact: {
          email: (editingIdea.contact?.email as string) || null,
          phone: (editingIdea.contact?.phone as string) || null,
        },
        attachments: [],
      };
    }
    return {
      source_id: null,
      category_id: null,
      title: "",
      description: "",
      contact: { email: null, phone: null },
      attachments: [],
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [prevLoading, setPrevLoading] = useState(loading);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    basicInfo: true,
    contactInfo: false,
  });

  useEffect(() => {
    if (editingIdea) {
      setFormData({
        source_id: editingIdea.source_id,
        category_id: editingIdea.category_id,
        title: editingIdea.title,
        description: editingIdea.body ?? "",
        contact: {
          email: (editingIdea.contact?.email as string) || null,
          phone: (editingIdea.contact?.phone as string) || null,
        },
        attachments: [],
      });
      setCurrentStep(1);
      setErrors({});
    }
  }, [editingIdea]);

  useEffect(() => {
    if (prevLoading && !loading) {
      setFormData({
        source_id: null,
        category_id: null,
        title: "",
        description: "",
        contact: { email: null, phone: null },
        attachments: [],
      });
      setCurrentStep(1);
      setErrors({});
    }
    setPrevLoading(loading);
  }, [loading, prevLoading]);

  const buildBodyForSubmit = useCallback((): string => {
    return formData.description.trim();
  }, [formData.description]);

  const handleInputChange = (field: keyof FormData, value: unknown) => {
    if (field === "contact") {
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, ...(value as ContactInfo) },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    if (errors[field as string]) {
      setErrors((prev) => ({ ...prev, [field as string]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (formData.source_id == null) {
        newErrors.source_id = "Select where this idea comes from";
      }
    }

    if (step === 2) {
      if (formData.category_id == null) {
        newErrors.category_id = "Select an idea category";
      }
    }

    if (step === 3) {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      } else if (formData.title.trim().length > 255) {
        newErrors.title = "Title must be 255 characters or less";
      }
      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      } else if (formData.description.trim().length > MAX_DESCRIPTION_LEN) {
        newErrors.description = `Description must be ${MAX_DESCRIPTION_LEN.toLocaleString()} characters or less`;
      }
    }

    if (step === 4 && !isAuthenticated) {
      if (!formData.contact.email && !formData.contact.phone) {
        newErrors.contact = "Provide email or phone";
      }
      if (
        formData.contact.email &&
        !/^[^@]+@[^@]+\.[^@]+$/.test(formData.contact.email)
      ) {
        newErrors.email = "Enter a valid email";
      }
      if (
        formData.contact.phone &&
        !isValidPhoneNumber(formData.contact.phone)
      ) {
        newErrors.phone = "Enter a valid phone number for the selected country";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((prev) => Math.min(prev + 1, maxStep));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const canSubmit = (): boolean => {
    if (
      formData.source_id == null ||
      formData.category_id == null ||
      !formData.title.trim() ||
      !formData.description.trim()
    ) {
      return false;
    }
    if (formData.description.trim().length > MAX_DESCRIPTION_LEN) {
      return false;
    }
    if (!isAuthenticated) {
      if (!formData.contact.email && !formData.contact.phone) return false;
      if (
        formData.contact.phone &&
        !isValidPhoneNumber(formData.contact.phone)
      ) {
        return false;
      }
    }
    return true;
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      if (prev[section]) {
        return { ...prev, [section]: false };
      }
      return {
        basicInfo: section === "basicInfo",
        contactInfo: section === "contactInfo",
      };
    });
  };

  const resetForm = () => {
    setFormData({
      source_id: null,
      category_id: null,
      title: "",
      description: "",
      contact: { email: null, phone: null },
      attachments: [],
    });
    setCurrentStep(1);
    setErrors({});
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= maxStep) {
      setCurrentStep(step);
    }
  };

  return {
    currentStep,
    maxStep,
    formData,
    errors,
    expandedSections,
    handleInputChange,
    validateStep,
    nextStep,
    prevStep,
    canSubmit,
    toggleSection,
    resetForm,
    goToStep,
    buildBodyForSubmit,
  };
};
