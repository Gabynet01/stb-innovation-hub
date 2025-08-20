import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

type ViewType = 'form' | 'list';
type MenuId = 'dashboard' | 'suggestions' | 'clusters' | 'topics' | 'documents';

interface MainLayoutProps {
    children: React.ReactNode;
    onViewChange: (view: ViewType) => void;
    currentView: ViewType;
    onMenuChange: (menu: MenuId) => void;
    currentMenu: MenuId;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    onViewChange,
    currentView,
    onMenuChange,
    currentMenu
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/30">
            <Navbar />
            <div className="flex">
                <Sidebar
                    onViewChange={onViewChange}
                    currentView={currentView}
                    onMenuChange={onMenuChange}
                    currentMenu={currentMenu}
                />
                <main className="flex-1 p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}; 