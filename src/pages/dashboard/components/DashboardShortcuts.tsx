import React from "react";
import { Link } from "react-router-dom";
import {
  LightBulbIcon,
  DocumentTextIcon,
  DocumentPlusIcon,
  ClipboardDocumentCheckIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

type Shortcut = {
  to: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  requireAdmin?: boolean;
};

const SHORTCUTS: Shortcut[] = [
  {
    to: "/ideas",
    label: "Idea Bank",
    description: "Browse, filter, and manage ideas",
    icon: LightBulbIcon,
  },
  {
    to: "/ideas?view=form",
    label: "New submission",
    description: "User story intake (as a / I want / so that)",
    icon: DocumentPlusIcon,
  },
  {
    to: "/assessments",
    label: "Assessments",
    description: "Queue and completed scores",
    icon: ClipboardDocumentCheckIcon,
  },
  {
    to: "/documents",
    label: "Documents",
    description: "Generated files across ideas",
    icon: DocumentDuplicateIcon,
  },
  {
    to: "/document-templates",
    label: "Templates",
    description: "Word templates and placeholders",
    icon: DocumentTextIcon,
  },
  {
    to: "/administration",
    label: "Administration",
    description: "Sources, categories, directory",
    icon: Cog6ToothIcon,
    requireAdmin: true,
  },
];

export const DashboardShortcuts: React.FC = () => {
  const { isAdmin } = useAuth();
  const visible = SHORTCUTS.filter((s) => !s.requireAdmin || isAdmin);

  return (
    <section
      className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/85 shadow-[0_24px_64px_-20px_rgba(34,46,55,0.14),0_12px_32px_-16px_rgba(34,46,55,0.08)] backdrop-blur-xl"
      aria-label="Quick links"
    >
      <div className="border-b border-stanbic-border/60 bg-white/60 px-6 py-6 sm:px-8 sm:py-7">
        <h2 className="text-lg font-semibold tracking-tight text-stanbic-text">
          Quick links
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-stanbic-text/65">
          Jump to any workspace — same destinations as the sidebar.
        </p>
      </div>
      <ul className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:gap-5 sm:p-7 lg:grid-cols-3">
        {visible.map(({ to, label, description, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              className="group flex h-full min-h-[5.75rem] items-start gap-4 rounded-2xl border border-stanbic-border/70 bg-white p-5 shadow-[0_12px_32px_-12px_rgba(34,46,55,0.1)] transition hover:-translate-y-0.5 hover:border-stanbic-border hover:shadow-[0_20px_44px_-16px_rgba(34,46,55,0.14)] focus:outline-none focus-visible:ring-2 focus-visible:ring-stanbic-secondary/40"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stanbic-canvas text-stanbic-secondary ring-1 ring-stanbic-border/80 transition group-hover:bg-white group-hover:ring-stanbic-secondary/25">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-stanbic-text group-hover:text-stanbic-primary">
                    {label}
                  </span>
                  <ChevronRightIcon
                    className="h-4 w-4 shrink-0 text-stanbic-text/35 transition group-hover:translate-x-0.5 group-hover:text-stanbic-secondary"
                    aria-hidden
                  />
                </span>
                <span className="mt-1.5 block text-xs leading-relaxed text-stanbic-text/55">
                  {description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
