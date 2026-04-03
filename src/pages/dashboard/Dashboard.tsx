import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/services/api";
import type { Idea } from "@/types/api";
import { MetricsGrid } from "./components/MetricsGrid";
import { DashboardShortcuts } from "./components/DashboardShortcuts";
import { DashboardWorkflow } from "./components/DashboardWorkflow";
import {
  CompactErrorWithToast,
  LoadingSpinner,
  PageHeader,
} from "@/components/ui";
import { aggregateIdeaStatusCounts } from "./aggregateIdeaStatuses";
import { APP_CONFIG } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";

export const Dashboard: React.FC = () => {
  const { displayName } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [assessmentCount, setAssessmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const ideasResponse = await apiService.ideas.listIdeas({
          page_size: 500,
          with_assessments: true,
        });

        if (ideasResponse.ok && ideasResponse.data) {
          setIdeas(ideasResponse.data);
        }

        try {
          const ar = await apiService.assessments.list();
          if (ar.ok && ar.data) {
            setAssessmentCount(ar.data.length);
          }
        } catch {
          setAssessmentCount(0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  const statusCounts = useMemo(
    () => aggregateIdeaStatusCounts(ideas),
    [ideas]
  );

  const welcomeLine = displayName
    ? `Signed in as ${displayName}. Overview below matches your Idea Bank list load (up to 500 ideas).`
    : "Overview below matches your Idea Bank list load (up to 500 ideas).";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEF1F6]">
        <PageHeader
          breadcrumbs={[]}
          title="Dashboard"
          description={`${APP_CONFIG.name} — ${APP_CONFIG.description}`}
        />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/90 p-12 shadow-[0_24px_64px_-20px_rgba(34,46,55,0.12)] backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center gap-5">
              <LoadingSpinner size="lg" color="primary" />
              <p className="text-sm font-medium text-stanbic-text/70">
                Loading overview…
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EEF1F6]">
        <PageHeader
          breadcrumbs={[]}
          title="Dashboard"
          description={`${APP_CONFIG.name} — ${APP_CONFIG.description}`}
        />
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <CompactErrorWithToast
            error={error}
            title="Failed to load dashboard"
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF1F6]">
      <PageHeader
        breadcrumbs={[]}
        title="Dashboard"
        description={`${welcomeLine} Use shortcuts to open any part of the app.`}
      />

      <div className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-8 sm:px-6">
        <MetricsGrid
          totalIdeas={ideas.length}
          statusCounts={statusCounts}
          assessmentCount={assessmentCount}
        />
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:items-start">
          <div className="xl:col-span-8">
            <DashboardShortcuts />
          </div>
          <div className="xl:col-span-4">
            <DashboardWorkflow />
          </div>
        </div>
      </div>
    </div>
  );
};
