import React from 'react';
import {
    HomeIcon,
    LightBulbIcon,
    ClipboardDocumentCheckIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { useSidebarCounts } from '@/hooks/useSidebarCounts';
import type { SidebarCounts } from '@/hooks/useSidebarCounts';
import { LoadingSpinner } from '@/components/ui';
import './sidebar.component.scss';

type ViewType = 'form' | 'list';
export type MenuId =
    | 'dashboard'
    | 'ideas'
    | 'assessments'
    | 'document-templates'
    | 'documents'
    | 'administration';

type NavSection = { kind: 'section'; label: string };
type NavItem = {
    kind: 'item';
    id: MenuId;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
};
type NavEntry = NavSection | NavItem;

interface SidebarProps {
    onViewChange: (view: ViewType) => void;
    currentView: ViewType;
    onMenuChange: (menu: MenuId) => void;
    currentMenu: MenuId;
    onCollapseChange: (collapsed: boolean) => void;
    isCollapsed: boolean;
    mobileOpen?: boolean;
    counts?: SidebarCounts;
    countsLoading?: boolean;
    countsError?: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
    onViewChange,
    currentView: _currentView,
    onMenuChange,
    currentMenu,
    onCollapseChange: _onCollapseChange,
    isCollapsed,
    mobileOpen = false,
    counts: countsProp,
    countsLoading: loadingProp,
    countsError: errorProp
}) => {
    const hookCounts = useSidebarCounts();
    const counts = countsProp ?? hookCounts.counts;
    const loading = loadingProp ?? hookCounts.loading;
    const error = errorProp ?? hookCounts.error;

    const navStructure: NavEntry[] = [
        { kind: 'section', label: 'Overview' },
        { kind: 'item', id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
        { kind: 'section', label: 'Idea Bank' },
        { kind: 'item', id: 'ideas', name: 'Ideas', icon: LightBulbIcon, count: counts.ideas },
        { kind: 'item', id: 'assessments', name: 'Assessments', icon: ClipboardDocumentCheckIcon },
        { kind: 'item', id: 'document-templates', name: 'Templates', icon: DocumentTextIcon },
        { kind: 'item', id: 'documents', name: 'Documents', icon: DocumentDuplicateIcon },
        { kind: 'item', id: 'administration', name: 'Administration', icon: Cog6ToothIcon },
    ];

    const handleMenuClick = (menuId: MenuId) => {
        onMenuChange(menuId);
        if (menuId === 'ideas') {
            onViewChange('list');
        }
    };

    const renderMenuItem = (item: NavItem) => {
        const isActive = currentMenu === item.id;

        return (
            <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`sidebar__menu-item group ${isActive ? 'sidebar__menu-item--active' : ''}`}
                title={isCollapsed ? item.name : undefined}
            >
                <div className={`sidebar__menu-item-content ${isCollapsed ? 'sidebar__menu-item-content--collapsed' : ''}`}>
                    <item.icon className={`sidebar__menu-item-icon ${isActive ? 'sidebar__menu-item-icon--active' : ''}`} />

                    {!isCollapsed && (
                        <div className="sidebar__menu-item-details">
                            <div className="sidebar__menu-item-header">
                                <h3 className="sidebar__menu-item-title">
                                    {item.name}
                                </h3>
                                {item.count !== undefined && item.count > 0 && (
                                    <span className={`sidebar__menu-item-count ${isActive ? 'sidebar__menu-item-count--active' : ''}`}>
                                        {loading ? (
                                            <span
                                                className="inline-flex items-center justify-center py-0.5"
                                                aria-hidden
                                            >
                                                <LoadingSpinner
                                                    size="sm"
                                                    color="primary"
                                                    className="scale-[0.65]"
                                                />
                                            </span>
                                        ) : (
                                            item.count
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </button>
        );
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}>
            <div className="sidebar__container">
                <nav className="sidebar__navigation">
                    {navStructure.map((entry) => {
                        if (entry.kind === 'section') {
                            return (
                                <div
                                    key={entry.label}
                                    className="sidebar__section-label"
                                    aria-hidden={isCollapsed}
                                >
                                    {!isCollapsed ? entry.label : '\u00a0'}
                                </div>
                            );
                        }
                        return renderMenuItem(entry);
                    })}
                </nav>
                {error && (
                    <div className="sidebar__error">
                        <p className="text-xs text-red-500 text-center">
                            Failed to load counts
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
