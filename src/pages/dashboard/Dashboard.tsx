import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../../services/api';
import type { Idea } from '../../types/api';
import { DashboardHero } from './components/DashboardHero';
import { MetricsGrid } from './components/MetricsGrid';
import { QuickActions } from './components/QuickActions';
import { DashboardGuide } from './components/DashboardGuide';
import { LoadingSpinner, CompactErrorWithToast } from '../../components/ui';
import { aggregateIdeaStatusCounts } from './aggregateIdeaStatuses';

export const Dashboard: React.FC = () => {
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
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statusCounts = useMemo(
    () => aggregateIdeaStatusCounts(ideas),
    [ideas]
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <LoadingSpinner size="lg" color="primary" />
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">
            Loading dashboard…
          </h2>
          <p className="text-slate-500 text-lg">Fetching IdeaHub data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <CompactErrorWithToast
        error={error}
        title="Failed to load dashboard"
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-10">
      <DashboardHero />
      <MetricsGrid
        totalIdeas={ideas.length}
        statusCounts={statusCounts}
        assessmentCount={assessmentCount}
      />
      <DashboardGuide />
      <QuickActions />
    </div>
  );
};
