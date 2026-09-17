import React, { useState, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ClockIcon, CogIcon, LogoutIcon, UserCircleIcon, BriefcaseIcon, PlusCircleIcon, DocumentTextIcon, BellIcon } from './icons';
import NotificationDropdown from './NotificationDropdown';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
    const { isAuthenticated, user, signOut } = useAuth();
    const { persistentNotifications, markNotificationAsRead } = useData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);

    const unreadCount = useMemo(() => {
        return persistentNotifications.filter(n => !n.isRead).length;
    }, [persistentNotifications]);

    const activeLinkClass = "bg-serene-accent dark:bg-nocturne-accent text-serene-accent-content dark:text-nocturne-accent-content";
    const inactiveLinkClass = "text-serene-text-subtle dark:text-nocturne-text-subtle hover:bg-black/5 dark:hover:bg-white/5 hover:text-serene-text-main dark:hover:text-nocturne-text-main";
    const linkClasses = `px-3 py-2 rounded-md text-sm font-medium transition-colors`;
    
    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsNotificationMenuOpen(false);
    }

    return (
        <header className="bg-serene-panel/80 dark:bg-nocturne-panel/80 backdrop-blur-lg sticky top-0 z-40 border-b border-serene-border dark:border-nocturne-border">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-serene-accent dark:text-nocturne-accent">TimeBank</Link>
                        {isAuthenticated && (
                            <div className="hidden md:block ml-10">
                                <div className="flex items-baseline space-x-4">
                                    <NavLink to="/dashboard" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Dashboard</NavLink>
                                    <NavLink to="/services" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Services</NavLink>
                                    <NavLink to="/post-service" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>Post Service</NavLink>
                                    <NavLink to="/jobs" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass}`}>My Jobs</NavLink>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="hidden md:flex items-center">
                        {isAuthenticated && user ? (
                            <div className="flex items-center space-x-4">
                                <ThemeToggle />
                                {user.role === 'admin' && (
                                     <NavLink to="/admin" title="Admin Dashboard" className={`p-2 rounded-full ${inactiveLinkClass}`}>
                                        <CogIcon className="h-6 w-6" />
                                     </NavLink>
                                )}
                                <div className="relative">
                                    <button onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)} className={`relative p-2 rounded-full ${inactiveLinkClass}`}>
                                        <BellIcon className="h-6 w-6" />
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full ring-2 ring-serene-panel dark:ring-nocturne-panel bg-red-500 text-white text-xs font-bold">{unreadCount}</span>
                                        )}
                                    </button>
                                     {isNotificationMenuOpen && (
                                        <NotificationDropdown 
                                            notifications={persistentNotifications}
                                            onClose={() => setIsNotificationMenuOpen(false)}
                                            onMarkAsRead={markNotificationAsRead}
                                        />
                                     )}
                                </div>
                                <div className="flex items-center bg-black/5 dark:bg-white/5 px-3 py-1 rounded-full border border-serene-border dark:border-nocturne-border">
                                    <ClockIcon className="h-5 w-5 text-serene-accent dark:text-nocturne-accent mr-2" />
                                    <span className="font-semibold text-serene-text-main dark:text-nocturne-text-main">{user.timeBalance.toFixed(2)} hrs</span>
                                </div>
                                <div className="relative">
                                     <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2 text-serene-text-subtle dark:text-nocturne-text-subtle hover:text-serene-text-main dark:hover:text-nocturne-text-main">
                                        {user.profilePhoto ? (
                                            <img src={user.profilePhoto} alt={user.name} className="h-8 w-8 rounded-full ring-2 ring-serene-border dark:ring-nocturne-border hover:ring-serene-accent dark:hover:ring-nocturne-accent transition" />
                                        ) : (
                                            <UserCircleIcon className="h-8 w-8" />
                                        )}
                                        <span className="hidden sm:inline">{user.name}</span>
                                    </button>
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-serene-panel dark:bg-nocturne-panel rounded-md shadow-lg py-1 z-50 ring-1 ring-serene-border dark:ring-nocturne-border">
                                            <NavLink to="/profile" onClick={() => setIsProfileMenuOpen(false)} className={`flex items-center px-4 py-2 text-sm w-full ${inactiveLinkClass}`}>
                                                <UserCircleIcon className="w-4 h-4 mr-2"/> My Profile
                                            </NavLink>
                                            <NavLink to="/transactions" onClick={() => setIsProfileMenuOpen(false)} className={`flex items-center px-4 py-2 text-sm w-full ${inactiveLinkClass}`}>
                                                <DocumentTextIcon className="w-4 h-4 mr-2"/> Transactions
                                            </NavLink>
                                            <button onClick={() => { signOut(); setIsProfileMenuOpen(false); }} className={`flex items-center px-4 py-2 text-sm w-full ${inactiveLinkClass}`}>
                                                <LogoutIcon className="h-4 w-4 mr-2" /> Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <ThemeToggle />
                                <Link to="/auth" className="px-4 py-2 rounded-md text-sm font-medium bg-serene-accent dark:bg-nocturne-accent text-serene-accent-content dark:text-nocturne-accent-content hover:bg-serene-accent-hover dark:hover:bg-nocturne-accent-hover transition">Sign In</Link>
                            </div>
                        )}
                    </div>
                     <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white dark:focus:ring-offset-nocturne-panel ${inactiveLinkClass}`}>
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                 {isMenuOpen && isAuthenticated && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <NavLink to="/dashboard" onClick={()=>setIsMenuOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass} flex items-center`}><DocumentTextIcon className="w-4 h-4 mr-2"/>Dashboard</NavLink>
                            <NavLink to="/services" onClick={()=>setIsMenuOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass} flex items-center`}><BriefcaseIcon className="w-4 h-4 mr-2"/>Services</NavLink>
                            <NavLink to="/post-service" onClick={()=>setIsMenuOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass} flex items-center`}><PlusCircleIcon className="w-4 h-4 mr-2"/>Post Service</NavLink>
                            <NavLink to="/jobs" onClick={()=>setIsMenuOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass} flex items-center`}><BriefcaseIcon className="w-4 h-4 mr-2"/>My Jobs</NavLink>
                            <NavLink to="/profile" onClick={()=>setIsMenuOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass} flex items-center`}><UserCircleIcon className="w-4 h-4 mr-2"/>Profile</NavLink>
                             <NavLink to="/transactions" onClick={()=>setIsMenuOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass} flex items-center`}><DocumentTextIcon className="w-4 h-4 mr-2"/>Transactions</NavLink>
                            {user?.role === 'admin' && (
                                <NavLink to="/admin" onClick={()=>setIsMenuOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClass : inactiveLinkClass} flex items-center`}><CogIcon className="w-4 h-4 mr-2"/>Admin</NavLink>
                            )}
                        </div>
                         <div className="pt-4 pb-3 border-t border-serene-border dark:border-nocturne-border">
                            <button onClick={() => { signOut(); setIsMenuOpen(false); }} className={`flex items-center px-3 py-2 text-base font-medium rounded-md w-full ${inactiveLinkClass}`}>
                                <LogoutIcon className="h-5 w-5 mr-2" /> Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;