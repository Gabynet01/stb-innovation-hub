import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentTemplatesTab } from "./administration/DocumentTemplatesTab";
import { PageHeader } from "@/components/ui";

export const DocumentTemplatesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: { pathname: "/document-templates" } },
      });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-stanbic-canvas pb-16">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Document templates" },
        ]}
        title="Document templates"
        description="Upload Word templates with placeholders, manage schema extraction, and see note guide areas for staff annotations. Generated documents are created from each idea's Documents tab."
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <DocumentTemplatesTab />
      </div>
    </div>
  );
};
