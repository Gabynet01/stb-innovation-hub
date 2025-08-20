import { useState, useCallback } from "react";

export interface ValidationRule {
  validate: (value: any, allValues: any) => string | undefined;
  message: string;
}

export interface ValidationRules {
  [key: string]: ValidationRule[];
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export function useFormValidation(
  initialValues: any,
  validationRules: ValidationRules
) {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback(
    (field: string, value: any, allValues: any): string | undefined => {
      const rules = validationRules[field];
      if (!rules) return undefined;

      for (const rule of rules) {
        const error = rule.validate(value, allValues);
        if (error) return error;
      }
      return undefined;
    },
    [validationRules]
  );

  const validateForm = useCallback(
    (values: any): boolean => {
      const newErrors: FormErrors = {};

      for (const field in validationRules) {
        const error = validateField(field, values[field], values);
        if (error) {
          newErrors[field] = error;
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [validationRules, validateField]
  );

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
    clearAllErrors,
  };
}

// Common validation rules
export const commonValidations = {
  required: (message = "This field is required") => ({
    validate: (value: any) =>
      !value || (typeof value === "string" && !value.trim())
        ? message
        : undefined,
    message,
  }),

  minLength: (min: number, message?: string) => ({
    validate: (value: any) => {
      if (typeof value === "string" && value.length < min) {
        return message || `Must be at least ${min} characters long`;
      }
      return undefined;
    },
    message: message || `Must be at least ${min} characters long`,
  }),

  maxLength: (max: number, message?: string) => ({
    validate: (value: any) => {
      if (typeof value === "string" && value.length > max) {
        return message || `Must be less than ${max} characters`;
      }
      return undefined;
    },
    message: message || `Must be less than ${max} characters`,
  }),

  email: (message = "Please enter a valid email address") => ({
    validate: (value: any) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        typeof value === "string" &&
        value.trim() &&
        !emailRegex.test(value.trim())
      ) {
        return message;
      }
      return undefined;
    },
    message,
  }),

  phone: (message = "Please enter a valid phone number") => ({
    validate: (value: any) => {
      if (!value) return undefined; // Optional field
      const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
      if (typeof value === "string" && !phoneRegex.test(value.trim())) {
        return message;
      }
      return undefined;
    },
    message,
  }),
};
