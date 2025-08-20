import React from 'react';
import { LightBulbIcon, ListBulletIcon, PlusIcon, HomeIcon, TagIcon, ChartBarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

type ViewType = 'form' | 'list';
type MenuId = 'dashboard' | 'suggestions' | 'clusters' | 'topics' | 'documents';

interface MenuItem {
    id: MenuId;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    count?: number;
}

interface SidebarProps {
    onViewChange: (view: ViewType) => void;
    currentView: ViewType;
    onMenuChange: (menu: MenuId) => void;
    currentMenu: MenuId;
}

export const Sidebar: React.FC<SidebarProps> = ({ onViewChange, currentView, onMenuChange, currentMenu }) => {
    const menuItems: MenuItem[] = [
        {
            id: 'dashboard',
            name: 'Dashboard',
            icon: HomeIcon,
            description: 'AI-powered analytics',
            count: undefined
        },
        {
            id: 'suggestions',
            name: 'Suggestions',
            icon: ListBulletIcon,
            description: 'Innovation management',
            count: 24
        },
        {
            id: 'clusters',
            name: 'AI Clusters',
            icon: TagIcon,
            description: 'Manage suggestion clusters',
            count: 7
        },
        {
            id: 'topics',
            name: 'Topics',
            icon: ChartBarIcon,
            description: 'Manage AI topics',
            count: 5
        },
        {
            id: 'documents',
            name: 'Documents',
            icon: DocumentTextIcon,
            description: 'Generate AI reports',
            count: 12
        }
    ];

    const handleMenuClick = (menuId: MenuId) => {
        onMenuChange(menuId);

        // Handle view changes
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
                className={`
                    group relative w-full flex items-center p-4 text-left rounded-2xl transition-all duration-300
                    ${isActive
                        ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-800 border-l-4 border-primary-500 shadow-lg'
                        : 'text-neutral-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 hover:border-l-4 hover:border-primary-300 hover:shadow-md'
                    }
                `}
            >
                <div className="flex-shrink-0">
                    <item.icon
                        className={`h-5 w-5 transition-colors duration-150 ${isActive
                            ? 'text-stanbic-700'
                            : 'text-corporate-500 group-hover:text-stanbic-700'
                            }`}
                    />
                </div>

                <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className={`text-sm font-semibold transition-colors duration-300 ${isActive ? 'text-primary-900' : 'text-neutral-700'
                            }`}>
                            {item.name}
                        </div>
                        {item.count !== undefined && (
                            <span className={`
                                inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold
                                ${isActive
                                    ? 'bg-primary-200 text-primary-700 shadow-md'
                                    : 'bg-neutral-100 text-neutral-600'
                                }
                            `}>
                                {item.count}
                            </span>
                        )}
                    </div>
                    <div className={`text-xs mt-1 transition-colors duration-300 ${isActive ? 'text-primary-600' : 'text-neutral-500'
                        }`}>
                        {item.description}
                    </div>
                </div>
            </button>
        );
    };

    return (
        <div className="w-72 bg-gradient-to-b from-white to-neutral-50 border-r border-neutral-200 min-h-screen shadow-xl">
            <div className="p-8">

                {/* Navigation */}
                <nav className="space-y-1">
                    {menuItems.map(renderMenuItem)}
                </nav>

                {/* Quick Actions */}
                <div className="mt-10 pt-8 border-t border-neutral-200">
                    <div className="space-y-3">
                        <button
                            onClick={() => onViewChange('form')}
                            className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Submit Suggestion
                        </button>

                        <button
                            onClick={() => onViewChange('list')}
                            className="w-full flex items-center justify-center p-4 border-2 border-primary-200 text-primary-700 rounded-2xl hover:bg-primary-50 hover:border-primary-400 transition-all duration-300 text-sm font-semibold hover:shadow-md"
                        >
                            <ListBulletIcon className="h-4 w-4 mr-2" />
                            View All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 