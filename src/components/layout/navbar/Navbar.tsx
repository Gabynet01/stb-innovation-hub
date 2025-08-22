import React from 'react';
import { UserCircleIcon, MagnifyingGlassIcon, PlusIcon, Bars3Icon } from '@heroicons/react/24/outline';
import stanbicLogo from '@/assets/images/stanbic-logo.jpg';
import './navbar.component.scss';

interface NavbarProps {
    onSidebarToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSidebarToggle }) => {
    const handleNewIdea = () => {
        console.log('New Idea clicked');
        // Add your new idea logic here
    };

    const handleUserProfile = () => {
        console.log('User profile clicked');
        // Add your user profile logic here
    };

    return (
        <nav className="navbar">
            <div className="navbar__container">
                <div className="navbar__content">
                    {/* Left section - Logo and brand */}
                    <div className="navbar__brand">
                        <div className="navbar__logo">
                            <img
                                src={stanbicLogo}
                                alt="Standard Bank Logo"
                                className="navbar__logo-image"
                            />
                        </div>

                        <div className="navbar__brand-text">
                            <h1 className="navbar__brand-title">Standard Bank</h1>
                            <p className="navbar__brand-subtitle">Ideation Hub</p>
                        </div>
                    </div>

                    {/* Center section - Search and Quick Actions */}
                    <div className="navbar__center">
                        <div className="navbar__search-section">
                            {/* Search Bar */}
                            <div className="navbar__search-container">
                                <div className="navbar__search-icon">
                                    <MagnifyingGlassIcon className="navbar__search-icon-svg" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search ideas, topics, or users..."
                                    className="navbar__search-input"
                                />
                            </div>

                            {/* Quick Action Button */}
                            <button
                                onClick={handleNewIdea}
                                className="navbar__new-idea-btn"
                            >
                                <PlusIcon className="navbar__new-idea-icon" />
                                <span className="navbar__new-idea-text">New Idea</span>
                            </button>
                        </div>
                    </div>

                    {/* Right section - Actions and user */}
                    <div className="navbar__actions">
                        {/* Sidebar Toggle Button */}
                        <button
                            onClick={onSidebarToggle}
                            className="navbar__sidebar-toggle"
                            title="Toggle sidebar"
                        >
                            <Bars3Icon className="navbar__sidebar-toggle-icon" />
                        </button>

                        {/* User Profile */}
                        <button
                            onClick={handleUserProfile}
                            className="navbar__user-profile"
                        >
                            <div className="navbar__user-avatar">
                                <div className="navbar__user-avatar-container">
                                    <UserCircleIcon className="navbar__user-avatar-icon" />
                                </div>
                                <div className="navbar__user-status"></div>
                            </div>
                            <div className="navbar__user-info">
                                <div className="navbar__user-name">Admin User</div>
                                <div className="navbar__user-role">Administrator</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}; 