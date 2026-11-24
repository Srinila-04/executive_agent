import React, { useState, useEffect } from 'react';
import gwcLogo from '../assets/gwc-logo.png';
import gwcIcon from '../assets/gwc-icon-transparent.png';
import {
  Home as HomeIcon,
  Network,
  Boxes,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText,
  LogIn,
  LogOut
} from 'lucide-react';
import '../styles/logoutModal.css';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  unreadCount,
  stoppedAgentsCount,
  onLogout
}) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Close confirmation modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showLogoutConfirm) {
        setShowLogoutConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutConfirm]);

  const handleConfirmLogout = () => {
    try {
      localStorage.removeItem('gwc_user_authenticated');
      localStorage.removeItem('gwc_auth_user');
    } catch (e) {
      console.warn('Could not clear auth state:', e);
    }
    setShowLogoutConfirm(false);
    if (onLogout) {
      onLogout();
    } else if (setActiveTab) {
      setActiveTab('login');
    } else {
      window.location.search = '?tab=login';
    }
  };
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: HomeIcon,
    },
    {
      id: 'architecture',
      label: 'System Architecture',
      icon: Network,
    },
    {
      id: 'connectors',
      label: 'Connectors',
      icon: Boxes,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <>
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className={`sidebar-header ${isCollapsed ? 'collapsed' : ''}`}>
        {isCollapsed ? (
          <div className="collapsed-brand-header">
            <div
              className="brand-logo-collapsed-wrapper"
              onClick={() => setIsCollapsed(false)}
              title="Expand Sidebar (GWC DATA.AI)"
            >
              <img
                src={gwcIcon}
                alt="GWC DATA.AI"
                className="brand-logo-collapsed"
                onError={(e) => {
                  if (e.target.src !== '/assets/gwc-icon-transparent.png') {
                    e.target.src = '/assets/gwc-icon-transparent.png';
                  }
                }}
              />
            </div>
            <button
              className="collapse-btn collapsed-toggle-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title="Expand Sidebar"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="brand-container">
              <img
                src={gwcLogo}
                alt="GWC DATA.AI"
                className="brand-logo-img"
                onError={(e) => {
                  if (e.target.src !== '/assets/gwc-logo.png') {
                    e.target.src = '/assets/gwc-logo.png';
                  }
                }}
              />
            </div>
            <button
              className="collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <ChevronLeft size={18} />
            </button>
          </>
        )}
      </div>

      {/* Nav List */}
      <nav className="sidebar-nav">
        {!isCollapsed && (
          <div className="nav-section-label"></div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="nav-item-icon" />
              {!isCollapsed && (
                <>
                  <span className="nav-item-label">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`nav-badge ${
                        item.badgeDanger ? 'danger' : ''
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer - Executive Identity & Logout Option */}
      <div className="sidebar-footer">
        <div
          className={`admin-badge-card ${isCollapsed ? 'collapsed' : ''}`}
          title={isCollapsed ? 'Admin (Company Owner) • Click to Logout' : undefined}
        >
          <div className="admin-badge-main">
            <div className="admin-avatar">HQ</div>
            {!isCollapsed && (
              <div className="admin-info">
                <span className="admin-name">Admin (Company Owner)</span>
                <span className="admin-tag">Executive Command Hub</span>
              </div>
            )}
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={() => setShowLogoutConfirm(true)}
            title="Log Out of Executive Session"
            aria-label="Logout"
          >
            <LogOut size={13} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>

    {/* Logout Confirmation Modal Dialog */}
    {showLogoutConfirm && (
      <div
        className="logout-modal-backdrop"
        onClick={() => setShowLogoutConfirm(false)}
      >
        <div
          className="logout-modal-card"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sidebar-logout-dialog-title"
        >
          <div className="logout-modal-icon-bubble">
            <LogOut size={26} />
          </div>

          <h3 id="sidebar-logout-dialog-title" className="logout-modal-title">
            Sign Out of Session?
          </h3>
          <p className="logout-modal-desc">
            Are you sure you want to end your current session in <strong>Manufacturing 360°</strong>? You will be redirected to the sign-in portal.
          </p>

          <div className="logout-modal-account-box">
            <div className="logout-account-avatar">HQ</div>
            <div className="logout-account-details">
              <div className="logout-account-name">Operations Director</div>
              <div className="logout-account-meta">admin@gwcdata.ai • Executive Command Hub</div>
            </div>
          </div>

          <div className="logout-modal-actions">
            <button
              type="button"
              className="logout-btn-cancel"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="logout-btn-confirm"
              onClick={handleConfirmLogout}
            >
              <LogOut size={15} />
              <span>Yes, Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
