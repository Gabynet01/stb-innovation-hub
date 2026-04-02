import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout';
import {
  IdeasPage,
  Dashboard,
  LoginPage,
  AssessmentsPage,
  AdministrationPage,
  DocumentTemplatesPage,
  DocumentsPage,
} from './pages';
import { ErrorBoundary } from './components';
import { SnackbarProvider } from './components/ui';
import { AuthProvider } from './contexts/AuthContext';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SnackbarProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/ideas" element={<IdeasPage />} />
                      <Route path="/suggestions" element={<Navigate to="/ideas" replace />} />
                      <Route path="/assessments" element={<AssessmentsPage />} />
                      <Route
                        path="/document-templates"
                        element={<DocumentTemplatesPage />}
                      />
                      <Route path="/documents" element={<DocumentsPage />} />
                      <Route path="/administration" element={<AdministrationPage />} />
                      <Route path="/strategy" element={<Navigate to="/dashboard" replace />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </MainLayout>
                }
              />
            </Routes>
          </ErrorBoundary>
        </SnackbarProvider>
      </AuthProvider>
    </Router>
  );
};
