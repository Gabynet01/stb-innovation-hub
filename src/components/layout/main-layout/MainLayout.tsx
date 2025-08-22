import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../navbar';
import { Sidebar } from '../sidebar';
import './main-layout.component.scss';

type ViewType = 'form' | 'list';

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleViewChange = (view: ViewType) => {
        // Handle view changes if needed
        console.log('View changed to:', view);
    };

    const handleMenuChange = (menu: string) => {
        // Navigate to the selected menu
        navigate(`/${menu}`);
    };

    // Extract current menu from pathname
    const currentMenu = location.pathname.split('/')[1] || 'dashboard';
    const currentView: ViewType = 'list'; // Default view

    return (
        <div className="main-layout">
            {/* Navigation - Full width at top */}
            <Navbar onSidebarToggle={handleSidebarToggle} />

            <div className="main-layout__content">
                {/* Sidebar */}
                <Sidebar
                    onViewChange={handleViewChange}
                    currentView={currentView}
                    onMenuChange={handleMenuChange}
                    currentMenu={currentMenu as any}
                    onCollapseChange={setSidebarCollapsed}
                    isCollapsed={sidebarCollapsed}
                />

                {/* Main content area */}
                <main className={`main-layout__main ${sidebarCollapsed ? 'main-layout__main--collapsed' : ''}`}>
                    <div className="main-layout__main-container">
                        <div className="main-layout__main-content">
                            <div className="main-layout__main-card">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}; 