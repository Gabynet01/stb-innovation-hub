import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout';
import {
  SuggestionsPage,
  Dashboard,
  ClustersPage,
  TopicsPage,
  DocumentsPage,
  TemplatesPage,
  JobsPage
} from './pages';
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
