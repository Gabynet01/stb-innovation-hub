import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { SuggestionsPage } from './pages/suggestions';
import { Dashboard } from './pages/dashboard';
import { ClustersPage } from './pages/ClustersPage';
import { TopicsPage } from './pages/TopicsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { JobsPage } from './pages/JobsPage';
import { ErrorBoundary } from './components';
import { SnackbarProvider } from './components/ui';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SnackbarProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/suggestions" element={<SuggestionsPage />} />
              <Route path="/clusters" element={<ClustersPage />} />
              <Route path="/topics" element={<TopicsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/jobs" element={<JobsPage />} />
            </Routes>
          </MainLayout>
        </Router>
      </SnackbarProvider>
    </ErrorBoundary>
  );
};
