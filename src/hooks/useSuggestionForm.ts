import { useState, useEffect } from "react";
import { Suggestion } from "../types/api";

export interface ContactInfo {
  email: string | null;
  phone: string | null;
}

export interface SuggestionFormData {
  author_type: "STAFF" | "CUSTOMER";
  category: "UX" | "PRODUCT" | "SERVICE" | "OPERATIONAL" | "OTHER";
  title: string;
  body: string;
  contact: ContactInfo;
  attachments: Record<string, any>[];
}

export interface FormData {
  author_type: "STAFF" | "CUSTOMER" | null;
  category: "UX" | "PRODUCT" | "SERVICE" | "OPERATIONAL" | "OTHER" | null;
  title: string;
  body: string;
  contact: ContactInfo;
  attachments: Record<string, any>[];
}

export const useSuggestionForm = (
  editingSuggestion: Suggestion | null,
  loading: boolean
) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    if (editingSuggestion) {
      return {
        author_type: editingSuggestion.author_type,
        category: editingSuggestion.category,
        title: editingSuggestion.title,
        body: editingSuggestion.body,
        contact: {
          email: editingSuggestion.contact.email || null,
          phone: editingSuggestion.contact.phone || null,
        },
        attachments: editingSuggestion.attachments || [],
      };
    }

    return {
      author_type: null,
      category: null,
      title: "",
      body: "",
      contact: {
        email: null,
        phone: null,
      },
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
    attachments: false,
  });

  // Update form data when editingSuggestion changes
  useEffect(() => {
    if (editingSuggestion) {
      setFormData({
        author_type: editingSuggestion.author_type,
        category: editingSuggestion.category,
        title: editingSuggestion.title,
        body: editingSuggestion.body,
        contact: {
          email: editingSuggestion.contact.email || null,
          phone: editingSuggestion.contact.phone || null,
        },
        attachments: editingSuggestion.attachments || [],
      });
      setCurrentStep(1);
      setErrors({});
    }
  }, [editingSuggestion]);

  // Reset form when submission completes
  useEffect(() => {
    if (prevLoading && !loading) {
      setFormData({
        author_type: null,
        category: null,
        title: "",
        body: "",
        contact: {
          email: null,
          phone: null,
        },
        attachments: [],
      });
      setCurrentStep(1);
      setErrors({});
    }
    setPrevLoading(loading);
  }, [loading, prevLoading]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    if (field === "contact") {
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, ...value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.author_type) {
        newErrors.author_type =
          "Please select whether you are Staff or Customer";
      }
      if (!formData.category) {
        newErrors.category = "Please select a category for your suggestion";
      }
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      } else if (formData.title.trim().length > 120) {
        newErrors.title = "Title must be 120 characters or less";
      }
      if (!formData.body.trim()) {
        newErrors.body = "Description is required";
      } else if (formData.body.trim().length > 10000) {
        newErrors.body = "Description must be 10,000 characters or less";
      }
    }

    if (step === 2) {
      if (!formData.contact.email && !formData.contact.phone) {
        newErrors.contact = "Either email or phone must be provided";
      }
      if (
        formData.contact.email &&
        !/^[^@]+@[^@]+\.[^@]+$/.test(formData.contact.email)
      ) {
        newErrors.email = "Please enter a valid email address";
      }
      if (formData.contact.phone && !formData.contact.phone.startsWith("+")) {
        newErrors.phone =
          "Phone number must start with + (e.g., +260955123456)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));

    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments],
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const canSubmit = (): boolean => {
    return !!(
      formData.author_type &&
      formData.category &&
      formData.title.trim() &&
      formData.body.trim() &&
      (formData.contact.email || formData.contact.phone)
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      if (prev[section]) {
        return {
          ...prev,
          [section]: false,
        };
      }
      return {
        basicInfo: section === "basicInfo",
        contactInfo: section === "contactInfo",
        attachments: section === "attachments",
      };
    });
  };

  const resetForm = () => {
    setFormData({
      author_type: null,
      category: null,
      title: "",
      body: "",
      contact: {
        email: null,
        phone: null,
      },
      attachments: [],
    });
    setCurrentStep(1);
    setErrors({});
  };

  return {
    currentStep,
    formData,
    errors,
    expandedSections,
    handleInputChange,
    validateStep,
    handleFileUpload,
    removeAttachment,
    nextStep,
    prevStep,
    canSubmit,
    toggleSection,
    resetForm,
  };
};
