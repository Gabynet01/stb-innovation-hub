import React, { useState, useEffect } from 'react';
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
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Close mobile sidebar when route changes
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    // Handle escape key to close mobile sidebar
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && mobileSidebarOpen) {
                setMobileSidebarOpen(false);
            }
        };

        if (mobileSidebarOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when mobile sidebar is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [mobileSidebarOpen]);

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const handleMobileSidebarToggle = () => {
        setMobileSidebarOpen(!mobileSidebarOpen);
    };

    const handleViewChange = (view: ViewType) => {
        // Handle view changes if needed
        console.log('View changed to:', view);
    };

    const handleMenuChange = (menu: string) => {
        // Navigate to the selected menu
        navigate(`/${menu}`);
        // Close mobile sidebar after navigation
        setMobileSidebarOpen(false);
    };

    // Extract current menu from pathname
    const currentMenu = location.pathname.split('/')[1] || 'dashboard';
    const currentView: ViewType = 'list'; // Default view

    return (
        <div className="main-layout">
            {/* Navigation - Full width at top */}
            <Navbar
                onSidebarToggle={handleSidebarToggle}
                onMobileSidebarToggle={handleMobileSidebarToggle}
                mobileSidebarOpen={mobileSidebarOpen}
            />

            <div className="main-layout__content">
                {/* Mobile Sidebar Overlay */}
                {mobileSidebarOpen && (
                    <div
                        className="main-layout__mobile-overlay"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <Sidebar
                    onViewChange={handleViewChange}
                    currentView={currentView}
                    onMenuChange={handleMenuChange}
                    currentMenu={currentMenu as any}
                    onCollapseChange={setSidebarCollapsed}
                    isCollapsed={sidebarCollapsed}
                    mobileOpen={mobileSidebarOpen}
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