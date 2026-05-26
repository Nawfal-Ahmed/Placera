import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePortalState } from '../context/PortalStateContext';
import { LogOut, Bell, Menu, X, GraduationCap, Search } from 'lucide-react';

export const PortalLayout = ({ children, activeTab, onTabChange, menuItems, searchValue, onSearchChange }) => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationAsRead } = usePortalState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  // Track which notification IDs have been dismissed from the bell dropdown (not deleted)
  const [dismissedIds, setDismissedIds] = useState(new Set());

  // Filter notifications for current user only
  const userNotifications = notifications.filter(n => n.recipientEmail === user?.email);
  // Only show notifications that haven't been dismissed from the dropdown
  const visibleDropdownNotifs = userNotifications.filter(n => !dismissedIds.has(n.id));
  const unreadCount = visibleDropdownNotifs.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const handleClearDropdown = useCallback(() => {
    // Mark all visible notifications as dismissed locally (does NOT delete from DB or Notifications page)
    setDismissedIds(prev => {
      const next = new Set(prev);
      visibleDropdownNotifs.forEach(n => next.add(n.id));
      return next;
    });
  }, [visibleDropdownNotifs]);

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return 'Just now';
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#f9f8f3] text-brand-green flex flex-col md:flex-row font-sans selection:bg-brand-gold/30">
      
      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 bg-brand-green text-brand-cream flex flex-col justify-between shrink-0 border-r border-border-low md:sticky md:top-0 md:h-screen z-40 transition-transform duration-300 ${
        mobileMenuOpen ? 'fixed inset-0 translate-x-0' : 'hidden md:flex'
      }`}>
        
        <div className="flex flex-col flex-1">
          {/* Logo & Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center shrink-0 shadow-sm">
                <GraduationCap className="w-6 h-6 text-[#022c22] stroke-[2] fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="editorial-heading font-serif text-xl font-bold tracking-tight text-white">Placera</span>
                <span className="text-[9px] text-white/50 uppercase tracking-widest font-semibold -mt-0.5">
                  {user?.role === 'student' ? 'STUDENT CONSOLE' : user?.role === 'recruiter' ? 'RECRUITER CONSOLE' : 'ADMIN CONSOLE'}
                </span>
              </div>
            </div>
            <button className="md:hidden text-brand-gold p-1 hover:bg-white/5 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Section Indicator */}
          <div className="px-6 pt-6 pb-2">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Workspace</span>
          </div>

          {/* Nav Menu Links */}
          <nav className="px-4 py-2 space-y-1 flex-1 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left group ${
                    isActive
                      ? 'bg-white/5 text-white font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-brand-gold' : 'text-white/40 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-sm shadow-brand-gold/60"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Credentials Block */}
        <div className="p-4 border-t border-white/5 bg-black/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#124237] text-brand-gold border border-brand-gold/20 font-serif font-bold text-sm flex items-center justify-center shrink-0 shadow-sm">
              {(() => {
                if (!user?.name) return 'U';
                const words = user.name.trim().split(/\s+/);
                if (words.length === 0) return 'U';
                if (words.length === 1) return words[0][0].toUpperCase();
                return (words[0][0] + words[words.length - 1][0]).toUpperCase();
              })()}
            </div>
            <div className="overflow-hidden">
              <span className="font-semibold text-white text-sm block truncate leading-tight">{user?.name}</span>
              <span className="text-[11px] text-white/50 block truncate leading-none mt-1">
                {user?.role === 'student' ? 'B.Tech · CSE · 2026' : user?.role === 'admin' ? 'Placement Officer' : user?.role === 'recruiter' ? 'Talent · Bengaluru' : 'Corporate Partner'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/50 hover:text-white p-2 hover:bg-white/5 rounded-xl transition-all shrink-0"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 text-brand-gold" />
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar Header */}
        <header className="h-20 bg-[#f9f8f3]/80 backdrop-blur-md px-6 md:px-12 flex items-center justify-between sticky top-0 z-30 border-b border-brand-green/5">
          {/* Search Input Bar */}
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            <button className="md:hidden text-brand-green p-1 hover:bg-brand-green/5 rounded-lg" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full hidden md:block">
              <Search className="w-4 h-4 text-brand-green/30 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                placeholder="Search jobs, students, companies..."
                className="w-full bg-[#f4f3ea]/50 border border-brand-green/5 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-brand-gold focus:bg-white transition-all text-brand-green placeholder:text-brand-green/40 shadow-inner"
              />
            </div>
          </div>

          {/* Actions & Alerts */}
          <div className="flex items-center gap-4 relative">
            
            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-brand-green/70 hover:text-brand-green hover:bg-brand-green/5 rounded-xl transition-all"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-brand-gold rounded-full ring-2 ring-[#f9f8f3] animate-pulse"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-border-low rounded-2xl shadow-xl z-50 animate-fade-in-up overflow-hidden">
                  {/* Dropdown Header */}
                  <div className="flex justify-between items-center px-4 pt-4 pb-3 border-b border-border-low">
                    <span className="text-xs uppercase tracking-wider font-extrabold text-brand-green">Notifications</span>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <span className="text-[10px] text-brand-gold font-semibold">{unreadCount} new</span>
                      )}
                      {visibleDropdownNotifs.length > 0 && (
                        <button
                          onClick={handleClearDropdown}
                          className="text-[10px] text-[#022c22]/40 hover:text-[#022c22] font-semibold transition-colors px-1.5 py-0.5 rounded-md hover:bg-[#022c22]/5 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-[#022c22]/30 hover:text-[#022c22] p-0.5 rounded-md transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Notification items */}
                  {visibleDropdownNotifs.length > 0 ? (
                    <div className="max-h-72 overflow-y-auto scrollbar-hide p-2 space-y-1.5">
                      {visibleDropdownNotifs.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-3 rounded-xl border text-[11px] transition-all cursor-pointer ${
                            notif.read
                              ? 'bg-[#f9f9f7] border-border-low opacity-60'
                              : 'bg-brand-gold/5 border-brand-gold/20 hover:bg-brand-gold/10'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-[#022c22] leading-snug pr-2">{notif.title}</span>
                            <span className="text-[9px] text-text-secondary shrink-0">{formatNotificationTime(notif.createdAt) || notif.time}</span>
                          </div>
                          <p className="text-text-secondary leading-normal">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 px-4 text-center">
                      <p className="text-[11px] text-text-secondary">No new notifications</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Role Capsule Badging */}
            <div className="bg-[#f4f3ea] text-brand-green text-xs font-semibold px-4 py-2 rounded-xl border border-brand-green/5 flex items-center gap-1.5 capitalize shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
              {user?.role}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Panel Viewport */}
        <main className="flex-1 p-6 md:p-12 overflow-y-auto scrollbar-hide max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
};
