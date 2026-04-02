import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { initialsFromName } from '@/utils/userInitials';
import { MagnifyingGlassIcon, PlusIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import stanbicLogo from '@/assets/images/stanbic_logo.svg';
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
    const { isAuthenticated, displayName, username, provider, logout } = useAuth();
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (!userMenuOpen) return;

        const onDocMouseDown = (e: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(e.target as Node)
            ) {
                setUserMenuOpen(false);
            }
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setUserMenuOpen(false);
        };

        document.addEventListener('mousedown', onDocMouseDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onDocMouseDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [userMenuOpen]);

    const handleNewIdea = () => {
        navigate('/ideas?view=form');
    };

    const sessionName = (displayName?.trim() || username?.trim() || '').trim();
    const avatarInitials = initialsFromName(sessionName);

    const handleUserProfileClick = () => {
        setUserMenuOpen((open) => !open);
    };

    const handleLogout = async () => {
        setUserMenuOpen(false);
        await logout();
        navigate('/dashboard');
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
                            <p className="navbar__brand-subtitle">Idea Flow</p>
                        </div>
                    </div>

                    {/* Center section — staff only (search + new idea) */}
                    {isAuthenticated ? (
                        <div className="navbar__center">
                            <div className="navbar__search-section">
                                {!isMobile && (
                                    <div className="navbar__search-container">
                                        <div className="navbar__search-icon">
                                            <MagnifyingGlassIcon className="navbar__search-icon-svg" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search ideas…"
                                            className="navbar__search-input"
                                        />
                                    </div>
                                )}

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
                    ) : null}

                    {/* Right section - Actions and user */}
                    <div className="navbar__actions">
                        {isAuthenticated && isMobile && !showMobileSearch && (
                            <button
                                onClick={toggleMobileSearch}
                                className="navbar__mobile-search-toggle"
                                title="Search"
                            >
                                <MagnifyingGlassIcon className="navbar__mobile-search-icon" />
                            </button>
                        )}

                        {isAuthenticated && isMobile && (
                            <button
                                onClick={handleNewIdea}
                                className="navbar__new-idea-btn navbar__new-idea-btn--mobile"
                                title="New Idea"
                            >
                                <PlusIcon className="navbar__new-idea-icon" />
                            </button>
                        )}

                        {isAuthenticated ? (
                            <button
                                onClick={handleSidebarToggle}
                                className={`navbar__sidebar-toggle ${mobileSidebarOpen ? 'navbar__sidebar-toggle--active' : ''}`}
                                title="Toggle sidebar"
                            >
                                <Bars3Icon className="navbar__sidebar-toggle-icon" />
                            </button>
                        ) : null}

                        {/* Auth — staff sign-in, or profile + account menu (Sign out inside menu) */}
                        {!isAuthenticated ? (
                            <Link
                                to="/login"
                                className="navbar__auth-link"
                            >
                                Staff sign in
                            </Link>
                        ) : null}

                        {isAuthenticated ? (
                            <div className="navbar__user-menu" ref={userMenuRef}>
                                <button
                                    type="button"
                                    onClick={handleUserProfileClick}
                                    className="navbar__user-profile"
                                    aria-expanded={userMenuOpen}
                                    aria-haspopup="menu"
                                    aria-controls="navbar-user-menu"
                                    id="navbar-user-menu-button"
                                    aria-label={sessionName || username || undefined}
                                >
                                    <div className="navbar__user-avatar">
                                        <div className="navbar__user-avatar-container" aria-hidden={!avatarInitials}>
                                            {avatarInitials ? (
                                                <span className="navbar__user-avatar-initials">{avatarInitials}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="navbar__user-info">
                                        {sessionName ? (
                                            <div className="navbar__user-name">{sessionName}</div>
                                        ) : null}
                                        {provider ? (
                                            <div className="navbar__user-role capitalize">{provider}</div>
                                        ) : null}
                                    </div>
                                </button>
                                {userMenuOpen ? (
                                    <div
                                        id="navbar-user-menu"
                                        role="menu"
                                        aria-labelledby="navbar-user-menu-button"
                                        className="navbar__user-dropdown"
                                    >
                                        <button
                                            type="button"
                                            role="menuitem"
                                            className="navbar__user-dropdown-item"
                                            onClick={() => {
                                                void handleLogout();
                                            }}
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Mobile Search Row - New row when search is active on mobile */}
                {isAuthenticated && isMobile && showMobileSearch && (
                    <div className="navbar__mobile-search-row">
                        <div className="navbar__mobile-search-container">
                            <div className="navbar__mobile-search-icon-container">
                                <MagnifyingGlassIcon className="navbar__mobile-search-icon-svg" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search ideas…"
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