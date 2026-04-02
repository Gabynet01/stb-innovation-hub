import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentTemplatesTab } from "./administration/DocumentTemplatesTab";
import { PAGE_HERO_PATTERN_LIGHT, PAGE_HERO_SURFACE } from "@/constants/pageHero";

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
    <div className="min-h-screen pb-16">
      <div className="relative overflow-hidden border-b border-slate-200/90">
        <div className={PAGE_HERO_SURFACE} aria-hidden />
        <div
          className="absolute inset-0 opacity-80"
          style={{ backgroundImage: PAGE_HERO_PATTERN_LIGHT }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Document templates
          </h1>
          <p className="mt-2 max-w-2xl text-base text-gray-600">
            Upload Word templates with placeholders, manage schema extraction, and
            see note guide areas for staff annotations. Generated documents are
            created from each idea&apos;s Documents tab.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl px-4 sm:px-6">
        <DocumentTemplatesTab />
      </div>
    </div>
  );
};
