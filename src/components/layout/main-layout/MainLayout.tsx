import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../navbar';
import { Sidebar, type MenuId } from '../sidebar';
import { SidebarCountsProvider } from '@/contexts/SidebarCountsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebarCounts } from '@/hooks/useSidebarCounts';
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
    const { isAuthenticated } = useAuth();
    const { counts, loading, error, refreshCounts } = useSidebarCounts(isAuthenticated);

    const normalizedPath = (location.pathname.replace(/\/$/, '') || '/') as string;
    /** Avoid mounting staff routes for guests (prevents e.g. Assessments redirecting to /login). */
    const guestMayRenderPage = isAuthenticated || normalizedPath === '/ideas';

    useLayoutEffect(() => {
        if (guestMayRenderPage) return;
        navigate('/ideas?view=form', { replace: true });
    }, [guestMayRenderPage, navigate]);

    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && mobileSidebarOpen) {
                setMobileSidebarOpen(false);
            }
        };

        if (mobileSidebarOpen) {
            document.addEventListener('keydown', handleEscape);
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

    const handleViewChange = (_view: ViewType) => {};

    const handleMenuChange = (menu: string) => {
        navigate(`/${menu}`, { replace: menu === segment });
        setMobileSidebarOpen(false);
    };

    const validMenus: MenuId[] = [
        'dashboard',
        'ideas',
        'assessments',
        'document-templates',
        'documents',
        'administration',
    ];
    const segment = (location.pathname.split('/')[1] || 'dashboard') as string;
    const currentMenu: MenuId = validMenus.includes(segment as MenuId)
        ? (segment as MenuId)
        : 'dashboard';
    const currentView: ViewType = 'list';

    return (
        <SidebarCountsProvider refreshCounts={refreshCounts}>
            <div className="main-layout">
                {/* Navigation - Full width at top */}
                <Navbar
                    onSidebarToggle={handleSidebarToggle}
                    onMobileSidebarToggle={handleMobileSidebarToggle}
                    mobileSidebarOpen={mobileSidebarOpen}
                />

                <div className="main-layout__content">
                    {/* Mobile Sidebar Overlay */}
                    {isAuthenticated && mobileSidebarOpen && (
                        <div
                            className="main-layout__mobile-overlay"
                            onClick={() => setMobileSidebarOpen(false)}
                        />
                    )}

                    {/* Sidebar — staff only */}
                    {isAuthenticated ? (
                        <Sidebar
                            onViewChange={handleViewChange}
                            currentView={currentView}
                            onMenuChange={handleMenuChange}
                            currentMenu={currentMenu}
                            onCollapseChange={setSidebarCollapsed}
                            isCollapsed={sidebarCollapsed}
                            mobileOpen={mobileSidebarOpen}
                            counts={counts}
                            countsLoading={loading}
                            countsError={error}
                        />
                    ) : null}

                    {/* Main content area */}
                    <main
                        className={`main-layout__main ${sidebarCollapsed ? 'main-layout__main--collapsed' : ''} ${!isAuthenticated ? 'main-layout__main--guest' : ''}`}
                    >
                        <div className="main-layout__main-container">
                            <div className="main-layout__main-content">
                                <div className="main-layout__main-card">
                                    {guestMayRenderPage ? children : null}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarCountsProvider>
    );
}; 