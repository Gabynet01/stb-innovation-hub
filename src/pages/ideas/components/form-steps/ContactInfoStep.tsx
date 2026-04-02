import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Input } from "../../../../components/ui";
import { FormData } from "../../../../hooks";
import { DEFAULT_PHONE_COUNTRY } from "@/constants/phone";
import { IdeaFormStepIntro } from "./IdeaFormStepHeader";
import {
  ideaFormPanelClass,
  ideaFormSectionLabelClass,
} from "./ideaFormStyles";
import "./contact-phone-input.scss";

interface ContactInfoStepProps {
  formData: FormData;
  errors: Record<string, string>;
  onInputChange: (field: keyof FormData, value: unknown) => void;
}

export const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
  formData,
  errors,
  onInputChange,
}) => (
  <div className="mb-1">
    <IdeaFormStepIntro
      title="Contact"
      description="How we can reach you about this submission."
    />

    <div className={ideaFormPanelClass}>
      <p className={ideaFormSectionLabelClass}>Details</p>
      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
        <div>
          <Input
            label="Email"
            type="email"
            value={formData.contact.email || ""}
            onChange={(e) =>
              onInputChange("contact", { email: e.target.value || null })
            }
            placeholder="your.email@company.com"
            inputSize="md"
            variant={errors.email ? "danger" : "default"}
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div
          className={`contact-phone-field ${errors.phone ? "contact-phone-field--error" : ""}`}
        >
          <label
            className="mb-1.5 block text-sm font-medium text-slate-700"
            htmlFor="idea-contact-phone"
          >
            Phone
          </label>
          <PhoneInput
            international
            defaultCountry={DEFAULT_PHONE_COUNTRY}
            limitMaxLength
            value={formData.contact.phone || undefined}
            onChange={(value) =>
              onInputChange("contact", { phone: value ?? null })
            }
            numberInputProps={{
              id: "idea-contact-phone",
              name: "contact_phone",
              autoComplete: "tel",
              "aria-invalid": errors.phone ? true : undefined,
              "aria-describedby": errors.phone
                ? "idea-contact-phone-error"
                : undefined,
            }}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Choose your country and enter your number. It will be stored in
            international format.
          </p>
          {errors.phone ? (
            <p
              id="idea-contact-phone-error"
              className="mt-1.5 text-sm text-red-600"
            >
              {errors.phone}
            </p>
          ) : null}
        </div>
      </div>

      {errors.contact && (
        <div className="mt-5 rounded-lg border border-red-200/80 bg-red-50/60 p-3 text-sm text-red-800">
          {errors.contact}
        </div>
      )}
    </div>
  </div>
);
