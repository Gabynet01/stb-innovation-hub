import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircleIcon, MagnifyingGlassIcon, PlusIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import stanbicLogo from '@/assets/images/stanbic-logo.png';
import './navbar.component.scss';

interface NavbarProps {
    onSidebarToggle?: () => void;
    onMobileSidebarToggle?: () => void;
    mobileSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
    onSidebarToggle,
    onMobileSidebarToggle,
    mobileSidebarOpen
}) => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Check initial screen size
        checkScreenSize();

        // Add resize listener
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleNewIdea = () => {
        navigate('/suggestions?view=form');
    };

    const handleUserProfile = () => {
        console.log('User profile clicked');
        // Add your user profile logic here
    };

    const handleSidebarToggle = () => {
        if (isMobile) {
            onMobileSidebarToggle?.();
        } else {
            onSidebarToggle?.();
        }
    };

    const toggleMobileSearch = () => {
        setShowMobileSearch(!showMobileSearch);
    };

    const closeMobileSearch = () => {
        setShowMobileSearch(false);
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
                                alt="Stanbic Bank Logo"
                                className="navbar__logo-image"
                            />
                        </div>

                        <div className="navbar__brand-text">
                            <h1 className="navbar__brand-title">Stanbic Bank</h1>
                            {!isMobile && <p className="navbar__brand-subtitle">Ideation Hub</p>}
                        </div>
                    </div>

                    {/* Center section - Search and Quick Actions */}
                    <div className="navbar__center">
                        <div className="navbar__search-section">
                            {/* Search Bar - Only show on desktop/tablet */}
                            {!isMobile && (
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
                            )}

                            {/* Quick Action Button - Only show on desktop/tablet */}
                            {!isMobile && (
                                <button
                                    onClick={handleNewIdea}
                                    className="navbar__new-idea-btn"
                                >
                                    <PlusIcon className="navbar__new-idea-icon" />
                                    <span className="navbar__new-idea-text">New Idea</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right section - Actions and user */}
                    <div className="navbar__actions">
                        {/* Mobile Search Icon (only visible on mobile) */}
                        {isMobile && !showMobileSearch && (
                            <button
                                onClick={toggleMobileSearch}
                                className="navbar__mobile-search-toggle"
                                title="Search"
                            >
                                <MagnifyingGlassIcon className="navbar__mobile-search-icon" />
                            </button>
                        )}

                        {/* New Idea Button - Only show on mobile */}
                        {isMobile && (
                            <button
                                onClick={handleNewIdea}
                                className="navbar__new-idea-btn navbar__new-idea-btn--mobile"
                                title="New Idea"
                            >
                                <PlusIcon className="navbar__new-idea-icon" />
                            </button>
                        )}

                        {/* Sidebar Toggle Button */}
                        <button
                            onClick={handleSidebarToggle}
                            className={`navbar__sidebar-toggle ${mobileSidebarOpen ? 'navbar__sidebar-toggle--active' : ''}`}
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

                {/* Mobile Search Row - New row when search is active on mobile */}
                {isMobile && showMobileSearch && (
                    <div className="navbar__mobile-search-row">
                        <div className="navbar__mobile-search-container">
                            <div className="navbar__mobile-search-icon-container">
                                <MagnifyingGlassIcon className="navbar__mobile-search-icon-svg" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search ideas, topics, or users..."
                                className="navbar__mobile-search-input"
                                autoFocus
                            />
                            <button
                                onClick={closeMobileSearch}
                                className="navbar__mobile-search-close-btn"
                                title="Close search"
                            >
                                <XMarkIcon className="navbar__mobile-search-close-icon" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}; 