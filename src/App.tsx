import React, { useState, useCallback, useMemo } from 'react';
import { MainLayout } from './components/layout';
import { SuggestionsPage } from './components/suggestions';
import { Dashboard } from './pages/Dashboard';
import { ClustersPage } from './pages/ClustersPage';
import { TopicsPage } from './pages/TopicsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { ErrorBoundary } from './components';

type MenuId = 'dashboard' | 'suggestions' | 'clusters' | 'topics' | 'documents';
type ViewType = 'form' | 'list';

export const App: React.FC = () => {
  const [currentMenu, setCurrentMenu] = useState<MenuId>('dashboard');
  const [currentView, setCurrentView] = useState<ViewType>('list');

  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
  }, []);

  const handleMenuChange = useCallback((menu: MenuId) => {
    setCurrentMenu(menu);
    // Reset view when changing menu
    if (menu === 'suggestions') {
      setCurrentView('list');
    }
  }, []);

  const menuItems = useMemo(() => ({
    dashboard: {
      id: 'dashboard' as MenuId,
      name: 'Dashboard',
      description: 'AI-powered innovation analytics',
      content: <Dashboard />
    },
    suggestions: {
      id: 'suggestions' as MenuId,
      name: 'Suggestions',
      description: 'Innovation management',
      content: null // Will be rendered separately
    },
    clusters: {
      id: 'clusters' as MenuId,
      name: 'AI Clusters',
      description: 'Manage suggestion clusters',
      content: <ClustersPage />
    },
    topics: {
      id: 'topics' as MenuId,
      name: 'Topics',
      description: 'Manage AI topics',
      content: <TopicsPage />
    },
    documents: {
      id: 'documents' as MenuId,
      name: 'Documents',
      description: 'Generate AI reports',
      content: <DocumentsPage />
    }
  }), []);

  const currentContent = menuItems[currentMenu]?.content || menuItems.dashboard.content;

  return (
    <ErrorBoundary>
      <MainLayout
        onViewChange={handleViewChange}
        currentView={currentView}
        onMenuChange={handleMenuChange}
        currentMenu={currentMenu}
      >
        {currentMenu === 'suggestions' ? (
          <SuggestionsPage />
        ) : (
          currentContent
        )}
      </MainLayout>
    </ErrorBoundary>
  );
};
