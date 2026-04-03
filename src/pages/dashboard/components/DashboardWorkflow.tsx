import React from "react";
import { Link } from "react-router-dom";

const steps = [
  {
    n: 1,
    title: "Capture",
    body: (
      <>
        Log ideas in the{" "}
        <Link
          to="/ideas"
          className="font-semibold text-stanbic-secondary underline-offset-2 hover:text-stanbic-primary hover:underline"
        >
          Idea Bank
        </Link>{" "}
        or submit a structured story.
      </>
    ),
  },
  {
    n: 2,
    title: "Assess",
    body: (
      <>
        Score and prioritise in{" "}
        <Link
          to="/assessments"
          className="font-semibold text-stanbic-secondary underline-offset-2 hover:text-stanbic-primary hover:underline"
        >
          Assessments
        </Link>
        .
      </>
    ),
  },
  {
    n: 3,
    title: "Document",
    body: (
      <>
        Build outputs from{" "}
        <Link
          to="/document-templates"
          className="font-semibold text-stanbic-secondary underline-offset-2 hover:text-stanbic-primary hover:underline"
        >
          Templates
        </Link>{" "}
        — see files under{" "}
        <Link
          to="/documents"
          className="font-semibold text-stanbic-secondary underline-offset-2 hover:text-stanbic-primary hover:underline"
        >
          Documents
        </Link>
        .
      </>
    ),
  },
  {
    n: 4,
    title: "Configure",
    body: (
      <>
        Admins maintain sources, categories, and directory in{" "}
        <Link
          to="/administration"
          className="font-semibold text-stanbic-secondary underline-offset-2 hover:text-stanbic-primary hover:underline"
        >
          Administration
        </Link>
        .
      </>
    ),
  },
] as const;

export const DashboardWorkflow: React.FC = () => {
  return (
    <section
      className="overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/85 shadow-[0_24px_64px_-20px_rgba(34,46,55,0.14),0_12px_32px_-16px_rgba(34,46,55,0.08)] backdrop-blur-xl"
      aria-label="Typical workflow"
    >
      <div className="border-b border-stanbic-border/60 bg-white/60 px-6 py-6 sm:px-8 sm:py-7">
        <h2 className="text-lg font-semibold tracking-tight text-stanbic-text">
          How teams use IdeaHub
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-stanbic-text/65">
          End-to-end flow from intake to artefacts.
        </p>
      </div>
      <div className="px-6 py-6 sm:px-8 sm:py-7">
        <ol className="space-y-0">
          {steps.map((step, i) => (
            <li
              key={step.n}
              className={`flex gap-4 py-4 first:pt-0 last:pb-0 ${
                i < steps.length - 1 ? "border-b border-stanbic-border/50" : ""
              }`}
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0051FF] text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(0,81,255,0.45)]"
                aria-hidden
              >
                {step.n}
              </span>
              <div className="min-w-0 pt-0.5">
                <h3 className="text-sm font-semibold text-stanbic-text">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stanbic-text/70">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
