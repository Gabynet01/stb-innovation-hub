import React from 'react';
import {
    HomeIcon,
    LightBulbIcon,
    TagIcon,
    ChartBarIcon,
    DocumentTextIcon,
    ClockIcon,
    FolderIcon
} from '@heroicons/react/24/outline';
import { useSidebarCounts } from '@/hooks/useSidebarCounts';
import './sidebar.component.scss';

type ViewType = 'form' | 'list';
type MenuId = 'dashboard' | 'suggestions' | 'clusters' | 'topics' | 'documents' | 'templates' | 'jobs';

interface MenuItem {
    id: MenuId;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
}

interface SidebarProps {
    onViewChange: (view: ViewType) => void;
    currentView: ViewType;
    onMenuChange: (menu: MenuId) => void;
    currentMenu: MenuId;
    onCollapseChange: (collapsed: boolean) => void;
    isCollapsed: boolean;
    mobileOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
    onViewChange,
    currentView,
    onMenuChange,
    currentMenu,
    onCollapseChange,
    isCollapsed,
    mobileOpen = false
}) => {
    const { counts, loading, error } = useSidebarCounts();

    const menuItems: MenuItem[] = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: HomeIcon,
            count: undefined
        },
        {
            id: 'suggestions',
            name: 'Suggestions',
            icon: LightBulbIcon,
            count: counts.suggestions
        },
        {
            id: 'clusters',
            name: 'AI Clusters',
            icon: TagIcon,
            count: counts.clusters
        },
        {
            id: 'topics',
            name: 'Topics',
            icon: ChartBarIcon,
            count: counts.topics
        },
        {
            id: 'documents',
            name: 'Documents',
            icon: DocumentTextIcon,
            count: counts.documents
        },
        {
            id: 'templates',
            name: 'Templates',
            icon: FolderIcon,
            count: counts.templates
        },
        {
            id: 'jobs',
            name: 'Jobs',
            icon: ClockIcon,
            count: counts.jobs
        }
    ];

    const handleMenuClick = (menuId: MenuId) => {
        onMenuChange(menuId);
        if (menuId === 'suggestions') {
            onViewChange('list');
        }
    };

    const renderMenuItem = (item: MenuItem) => {
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
                                        {loading ? '...' : item.count}
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
                    {menuItems.map(renderMenuItem)}
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