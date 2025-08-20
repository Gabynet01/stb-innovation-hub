import React from 'react';
import { UserCircleIcon, BellIcon, Cog6ToothIcon, LightBulbIcon } from '@heroicons/react/24/outline';

export const Navbar: React.FC = () => {
    return (
        <nav className="bg-white border-b border-neutral-200 shadow-lg backdrop-blur-sm bg-white/95">
            <div className="px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                                <LightBulbIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                                    Innovation Hub
                                </h1>
                                <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Stanbic Bank Zambia</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <button className="relative p-3 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                            <BellIcon className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-accent-500 rounded-full animate-pulse"></span>
                        </button>

                        {/* Settings */}
                        <button className="p-3 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                            <Cog6ToothIcon className="h-5 w-5" />
                        </button>

                        {/* User Profile */}
                        <button className="flex items-center space-x-3 px-4 py-2.5 text-neutral-700 hover:text-primary-700 hover:bg-primary-50 rounded-xl transition-all duration-200">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                                <UserCircleIcon className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-neutral-900">Admin User</div>
                                <div className="text-xs text-neutral-500">Administrator</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}; 