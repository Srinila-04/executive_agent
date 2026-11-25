import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ExternalLink, Clock, RefreshCw, ChevronDown } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ChatAssistant from './components/ChatAssistant';
import AgentModal from './components/AgentModal';

import Hub from './components/hub/Hub';
import Overview from './pages/Overview';
import SystemArchitecture from './pages/SystemArchitecture';
import Connectors from './pages/Connectors';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import { DEFAULT_CONNECTORS } from './data/defaultConnectors';

import './theme.css';
import './app.css';

export default function App() {
  // Authentication Gate: User must log in first before entering the application
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('gwc_user_authenticated') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Default to 'home' hub once authenticated
  const [activeTab, setActiveTab] = useState(() => {
    const tab = new URLSearchParams(window.location.search).get('tab') || 'home';
    return tab === 'notifications' ? 'home' : tab;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Enterprise Data
  const [agents, setAgents] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [connectors, setConnectors] = useState(DEFAULT_CONNECTORS);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Modal State
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Full-Screen Embedded Team Member Application State ({ url, title })
  // Restores state from URL or sessionStorage so browser refresh stays in the teammate app UI
  const [activeEmbeddedApp, setActiveEmbeddedApp] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const appUrl = params.get('app_url');
      const appTitle = params.get('app_title');
      if (appUrl) {
        let decodedUrl = decodeURIComponent(appUrl);
        if (decodedUrl.includes('localhost:3018')) {
          decodedUrl = 'https://customer-order-management-two.vercel.app/monitoring';
        }
        return {
          url: decodedUrl,
          title: appTitle ? decodeURIComponent(appTitle) : 'Teammate System App'
        };
      }
      const saved = sessionStorage.getItem('active_embedded_app');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.url) {
          if (parsed.url.includes('localhost:3018')) {
            parsed.url = 'https://customer-order-management-two.vercel.app/monitoring';
            sessionStorage.setItem('active_embedded_app', JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse initial embedded app:', e);
    }
    return null;
  });

  const [iframeKey, setIframeKey] = useState(0);

  // Auto-hiding floating top bar state for full-screen teammate portal
  const [isTopbarVisible, setIsTopbarVisible] = useState(true);
  const topbarTimerRef = useRef(null);

  // Initially show the bar for 3 seconds on launch, then hide it automatically
  useEffect(() => {
    if (activeEmbeddedApp) {
      setIsTopbarVisible(true);
      if (topbarTimerRef.current) clearTimeout(topbarTimerRef.current);
      topbarTimerRef.current = setTimeout(() => {
        setIsTopbarVisible(false);
      }, 3000);
    }
    return () => {
      if (topbarTimerRef.current) clearTimeout(topbarTimerRef.current);
    };
  }, [activeEmbeddedApp]);

  const handleTopbarMouseEnter = () => {
    if (topbarTimerRef.current) clearTimeout(topbarTimerRef.current);
    setIsTopbarVisible(true);
  };

  const handleTopbarMouseLeave = () => {
    if (topbarTimerRef.current) clearTimeout(topbarTimerRef.current);
    setIsTopbarVisible(false);
  };

  // Keep activeEmbeddedApp and activeTab synced with URL search params and sessionStorage
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (activeTab) {
        url.searchParams.set('tab', activeTab);
      }
      if (activeEmbeddedApp && activeEmbeddedApp.url) {
        sessionStorage.setItem('active_embedded_app', JSON.stringify(activeEmbeddedApp));
        url.searchParams.set('app_url', encodeURIComponent(activeEmbeddedApp.url));
        if (activeEmbeddedApp.title) {
          url.searchParams.set('app_title', encodeURIComponent(activeEmbeddedApp.title));
        }
      } else {
        sessionStorage.removeItem('active_embedded_app');
        url.searchParams.delete('app_url');
        url.searchParams.delete('app_title');
      }
      window.history.replaceState(null, '', url.toString());
    } catch (e) {
      console.error('Failed to sync state to URL:', e);
    }
  }, [activeEmbeddedApp, activeTab]);

  // Escape key to exit full-screen embedded app
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && activeEmbeddedApp) {
        setActiveEmbeddedApp(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [activeEmbeddedApp]);

  // Apply Theme Token to HTML Root
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Initial Fetch & Polling
  const fetchAllData = async () => {
    try {
      // 1. Fetch Agents
      const agRes = await fetch('/api/agents');
      if (agRes.ok) {
        const agData = await agRes.json();
        if (agData.agents) setAgents(agData.agents);
      }

      // 2. Fetch Sectors
      const secRes = await fetch('/api/agents/sectors');
      if (secRes.ok) {
        const secData = await secRes.json();
        if (secData.sectors) setSectors(secData.sectors);
      }

      // 3. Fetch Connectors
      const connRes = await fetch('/api/connectors');
      if (connRes.ok) {
        const connData = await connRes.json();
        if (connData.connectors) setConnectors(connData.connectors);
      }

      // 4. Fetch Notifications
      const notifRes = await fetch('/api/notifications');
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        if (notifData.notifications) {
          setNotifications(notifData.notifications);
          setUnreadCount(notifData.unreadCount || 0);
        }
      }

      // 5. Fetch Settings
      const setRes = await fetch('/api/settings');
      if (setRes.ok) {
        const setData = await setRes.json();
        if (setData) setSettings(setData);
      }

      // 6. Fetch Dynamic Enterprise Filter Options (From Neon DB)
      const fltRes = await fetch('/api/filters/options');
      if (fltRes.ok) {
        const fltData = await fltRes.json();
        if (fltData.success) {
          setFilterOptions(fltData);
        }
      }
    } catch (err) {
      console.warn('API sync warning (running with cached enterprise data):', err);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 12000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleToggleConnector = async (connectorId) => {
    try {
      const res = await fetch('/api/connectors/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: connectorId })
      });
      const data = await res.json();
      if (data.success) {
        setConnectors((prev) =>
          prev.map((c) => (c.id === connectorId ? data.connector : c))
        );
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to toggle connector:', err);
    }
  };

  const handleMarkNotificationsRead = async (id = 'all') => {
    try {
      const res = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const handleSimulateAlert = async (alertPayload) => {
    try {
      const res = await fetch('/api/notifications/simulate-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertPayload)
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to simulate alert:', err);
    }
  };

  const handleRestartAgent = async (agentId) => {
    try {
      const res = await fetch(`/api/agents/${agentId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'running' })
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
      }
    } catch (err) {
      console.error('Failed to restart agent:', err);
    }
  };

  const handleCheckBackendAndAI = async () => {
    try {
      const res = await fetch('/api/notifications/check-ai', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        }
        fetchAllData();
        return data;
      }
    } catch (err) {
      console.error('Failed to check backend and AI:', err);
    }
    return null;
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const stoppedAgentsCount = agents.filter((a) => a.id !== 20 && a.status === 'stopped').length;

  // Strict Initial Authentication Gate: Show Login first; proceed to main dashboard only after credentials
  if (!isAuthenticated || activeTab === 'login') {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setActiveTab('home');
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('tab');
            window.history.replaceState({}, '', url.pathname);
          } catch (e) {}
        }}
      />
    );
  }

  const handleAppLogout = () => {
    try {
      localStorage.removeItem('gwc_user_authenticated');
      localStorage.removeItem('gwc_auth_user');
    } catch (e) {
      console.warn('Could not clear auth storage:', e);
    }
    setIsAuthenticated(false);
    setActiveTab('login');
  };

  return (
    <>
      <div className={`app-layout ${activeEmbeddedApp ? 'app-hidden-for-embed' : ''}`}>
      {/* Side Navbar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        unreadCount={unreadCount}
        stoppedAgentsCount={stoppedAgentsCount}
        onLogout={handleAppLogout}
      />

      {/* Main Content Area */}
      <div className={`main-wrapper ${activeTab === 'home' ? 'no-page-scroll' : ''}`}>
        {/* Topbar */}
        <Topbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          setTheme={setTheme}
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkRead={handleMarkNotificationsRead}
          onRestartAgent={handleRestartAgent}
          onSimulateAlert={handleSimulateAlert}
          onCheckBackendAndAI={handleCheckBackendAndAI}
          agents={agents}
          selectedPlant={selectedPlant}
          setSelectedPlant={setSelectedPlant}
          plants={filterOptions?.plants || settings?.districtCoverage || []}
          onLogout={handleAppLogout}
        />

        {/* Page Switcher */}
        {activeTab === 'home' && (
          <Hub
            onLaunchApp={(url, title) => setActiveEmbeddedApp({ url, title })}
            onNavigateToArchitecture={() => setActiveTab('architecture')}
          />
        )}

        {activeTab === 'overview' && (
          <Overview
            agents={agents}
            sectors={sectors}
            connectors={connectors}
            notifications={notifications}
            onNavigateToAgents={(agentId) => {
              if (agentId) {
                const found = agents.find((a) => a.id === agentId || a.agentNumber === agentId);
                if (found) setSelectedAgent(found);
              }
            }}
            onNavigateToArchitecture={() => setActiveTab('architecture')}
            onNavigateToNotifications={() => setActiveTab('reports')}
            onNavigateToConnectors={() => setActiveTab('connectors')}
            selectedPlant={selectedPlant}
            setSelectedPlant={setSelectedPlant}
          />
        )}

        {activeTab === 'architecture' && (
          <SystemArchitecture
            onNavigateToAgents={(agentId) => {
              if (agentId) {
                const found = agents.find((a) => a.id === agentId || a.agentNumber === agentId);
                if (found) setSelectedAgent(found);
              }
            }}
            onNavigateToConnectors={() => setActiveTab('connectors')}
            onNavigateToNotifications={() => setActiveTab('reports')}
            agents={agents}
          />
        )}

        {activeTab === 'connectors' && (
          <Connectors
            connectors={connectors}
            onToggleConnector={handleToggleConnector}
          />
        )}

        {activeTab === 'reports' && (
          <Reports
            onNavigateToAgents={() => setActiveTab('home')}
            onNavigateToArchitecture={() => setActiveTab('architecture')}
            onNavigateToConnectors={() => setActiveTab('connectors')}
            selectedPlant={selectedPlant}
            setSelectedPlant={setSelectedPlant}
            plants={filterOptions?.plants || settings?.districtCoverage || []}
            filterOptions={filterOptions}
            onOpenAgent={(url, title) => setActiveEmbeddedApp({ url, title })}
          />
        )}



        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}

        {/* Deep Agent Modal */}
        {selectedAgent && (
          <AgentModal
            agent={selectedAgent}
            onClose={() => setSelectedAgent(null)}
            onStatusChange={(updatedAgent) => {
              setSelectedAgent(updatedAgent);
              fetchAllData();
            }}
          />
        )}
      </div>
    </div>

    {/* Full-Screen Embedded Team Member Application Portal (Entire App Hides) */}
    {activeEmbeddedApp && (
      <div className="fullscreen-embedded-app-portal">
        {/* Top-edge invisible hover sensor (triggers bar reveal on mouse enter near top) */}
        <div
          className="embedded-app-hover-sensor"
          onMouseEnter={handleTopbarMouseEnter}
        />

        {/* Floating Auto-Hiding Topbar Overlay */}
        <div
          className={`embedded-app-topbar-wrapper ${isTopbarVisible ? 'visible' : 'hidden'}`}
          onMouseEnter={handleTopbarMouseEnter}
          onMouseLeave={handleTopbarMouseLeave}
        >
          <div className="embedded-app-topbar">
            <div className="embedded-app-left">
              <button
                className="embedded-app-back-btn"
                onClick={() => setActiveEmbeddedApp(null)}
                title="Return to Hub (Esc)"
              >
                <ArrowLeft size={16} />
                <span>Back to Hub</span>
              </button>
              <div className="embedded-app-title-badge">
                <span className="embedded-app-pulse-dot" />
                <span className="embedded-app-title">{activeEmbeddedApp.title}</span>
              </div>
            </div>
            {activeEmbeddedApp.url ? (
              <div className="embedded-app-right" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="embedded-app-host-tag">Live System View</span>
                <button
                  className="embedded-app-reload-btn"
                  onClick={() => setIframeKey((k) => k + 1)}
                  title="Refresh embedded application view"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#ffffff',
                    padding: '5px 11px',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <RefreshCw size={13} />
                  <span>Reload Frame</span>
                </button>
                <a
                  href={activeEmbeddedApp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="embedded-app-ext-link"
                  title="Open in new window"
                >
                  <ExternalLink size={13} />
                  <span>Open in New Tab</span>
                </a>
              </div>
            ) : (
              <div className="embedded-app-right">
                <span className="embedded-app-host-tag">Pending Integration</span>
              </div>
            )}
          </div>

          {/* Sleek Peek Tab when the bar is hidden: hints hover and allows 1-click reveal */}
          <div
            className="embedded-app-peek-pill"
            onClick={() => setIsTopbarVisible(true)}
            title="Move cursor here or click to show navigation bar"
          >
            <ChevronDown size={12} strokeWidth={2.4} />
            <span>Navigation</span>
          </div>
        </div>

        {activeEmbeddedApp.url ? (
          <iframe
            key={iframeKey}
            src={activeEmbeddedApp.url}
            title={activeEmbeddedApp.title}
            className="fullscreen-embedded-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; full-screen"
          />
        ) : (
          <div className="embedded-app-placeholder-container">
            <div className="embedded-app-placeholder-card">
              <div className="placeholder-icon-badge">
                <Clock size={36} />
              </div>
              <h2 className="placeholder-title">Team Member Didn't Give URL</h2>
              <p className="placeholder-desc">
                The deployment URL for <strong>{activeEmbeddedApp.title}</strong> has not been provided by the team member yet.
              </p>
              <div className="placeholder-tag">Status: Awaiting Link</div>
              <button
                className="placeholder-return-btn"
                onClick={() => setActiveEmbeddedApp(null)}
              >
                <ArrowLeft size={16} />
                <span>Back to Hub</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )}
  </>
  );
}
