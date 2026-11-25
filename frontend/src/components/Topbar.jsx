import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Sun,
  Moon,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  CheckCheck,
  Play,
  Search,
  X,
  TrendingUp,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  LogOut,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';
import '../styles/logoutModal.css';

export default function Topbar({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  notifications = [],
  unreadCount = 0,
  onMarkRead,
  onRestartAgent,
  onSimulateAlert,
  onCheckBackendAndAI,
  agents = [],
  selectedPlant,
  setSelectedPlant,
  plants,
  onLogout
}) {
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifFilter, setNotifFilter] = useState('all'); // 'all' | 'stopped' | 'updates' | 'unread'
  const [notifSearch, setNotifSearch] = useState('');
  const [isCheckingAI, setIsCheckingAI] = useState(false);
  const [aiSyncSummary, setAiSyncSummary] = useState(null);
  const [lastCheckedTime, setLastCheckedTime] = useState('Just now');
  const [restartingAgentId, setRestartingAgentId] = useState(null);
  const [showSimulateBox, setShowSimulateBox] = useState(false);
  const [simAgentNum, setSimAgentNum] = useState(4);
  const [simReason, setSimReason] = useState('Thermal spindle bearing runaway: Vibration velocity peaked at 14.2 mm/s on CNC Milling Unit 07.');

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const notifDropdownRef = useRef(null);

  // Close notifications panel and modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showNotifPanel) setShowNotifPanel(false);
        if (showLogoutConfirm) setShowLogoutConfirm(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNotifPanel, showLogoutConfirm]);

  // Click outside to close notification panel
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target)) {
        setShowNotifPanel(false);
      }
    };
    if (showNotifPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifPanel]);

  // Dynamic AI & Backend Check Handler
  const handleTriggerAICheck = async () => {
    setIsCheckingAI(true);
    try {
      if (onCheckBackendAndAI) {
        const result = await onCheckBackendAndAI();
        if (result && result.summary) {
          setAiSyncSummary(result.summary);
        }
      } else {
        const res = await fetch('/api/notifications/check-ai', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          if (data.summary) setAiSyncSummary(data.summary);
        }
      }
      setLastCheckedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.warn('Dynamic AI check completed with cached state:', err);
    } finally {
      setTimeout(() => {
        setIsCheckingAI(false);
      }, 600);
    }
  };

  // Toggle Notif Panel and run dynamic backend check when opening
  const handleToggleNotifications = () => {
    const nextState = !showNotifPanel;
    setShowNotifPanel(nextState);
    if (nextState) {
      handleTriggerAICheck();
    }
  };

  const handleRestartAgentClick = async (agentId, e) => {
    e.stopPropagation();
    setRestartingAgentId(agentId);
    try {
      if (onRestartAgent) {
        await onRestartAgent(agentId);
      } else {
        await fetch(`/api/agents/${agentId}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'running' })
        });
      }
      // Re-check backend & AI after restart
      setTimeout(() => {
        handleTriggerAICheck();
      }, 400);
    } catch (err) {
      console.error('Failed to restart agent:', err);
    } finally {
      setTimeout(() => {
        setRestartingAgentId(null);
      }, 700);
    }
  };

  const handleDispatchSimulation = async () => {
    const targetAgent = agents.find((a) => a.agentNumber === Number(simAgentNum) || a.id === Number(simAgentNum));
    const agentName = targetAgent ? `${targetAgent.name} (Module ${targetAgent.agentNumber < 10 ? '0' : ''}${targetAgent.agentNumber})` : `Module ${simAgentNum}`;

    if (onSimulateAlert) {
      await onSimulateAlert({
        agentNumber: Number(simAgentNum),
        agentName,
        reason: simReason,
        severity: 'error'
      });
    } else {
      await fetch('/api/notifications/simulate-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentNumber: Number(simAgentNum),
          agentName,
          reason: simReason,
          severity: 'error'
        })
      });
    }
    setShowSimulateBox(false);
    handleTriggerAICheck();
  };

  const timeAgo = (iso) => {
    if (!iso) return 'Just now';
    try {
      const diff = (Date.now() - new Date(iso).getTime()) / 1000;
      if (diff < 45) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch (e) {
      return 'Recently';
    }
  };

  // Stopped agents count
  const stoppedNotifs = notifications.filter(
    (n) => n.isStoppedAgent || n.severity === 'error' || (n.title && n.title.toLowerCase().includes('stopped'))
  );
  const stoppedCount = stoppedNotifs.length;
  const aiUpdatesCount = notifications.filter((n) => n.isAgentAnalysis || n.severity !== 'error').length;

  // Filtered notifications
  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === 'stopped') {
      const isStop = n.isStoppedAgent || n.severity === 'error' || (n.title && n.title.toLowerCase().includes('stopped'));
      if (!isStop) return false;
    } else if (notifFilter === 'updates') {
      const isUpd = n.isAgentAnalysis || n.severity !== 'error';
      if (!isUpd) return false;
    } else if (notifFilter === 'unread') {
      if (n.status !== 'unread') return false;
    }

    if (notifSearch.trim()) {
      const q = notifSearch.toLowerCase();
      const match =
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.agentName && n.agentName.toLowerCase().includes(q)) ||
        (n.oneLineReason && n.oneLineReason.toLowerCase().includes(q)) ||
        (n.message && n.message.toLowerCase().includes(q)) ||
        (n.sector && n.sector.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  const getPageTitle = () => {
    switch (activeTab) {
      case 'home':
        return {
          title: 'Manufacturing 360°',
          sub: 'Every Function, One Platform'
        };
      case 'overview':
        return {
          title: 'Manufacturing Industry Overview & Solutions',
          sub: 'Operational Challenges vs. Integrated Manufacturing Solutions'
        };
      case 'architecture':
        return {
          title: 'System Architecture',
          sub: 'Overview of factory systems and operational problems solved'
        };
      case 'connectors':
        return {
          title: 'Enterprise Connectors & Integration Mesh',
          sub: 'SAP S/4HANA, Manhattan WMS, MECPL MES & Industrial SCADA'
        };
      case 'reports':
        return {
          title: 'Reports & Operational Intelligence',
          sub: 'Download, schedule and share reports from all 19 agents'
        };
      case 'settings':
        return {
          title: 'Executive Admin & Multi-State Plant Settings',
          sub: 'Corporate Facilities across Tamil Nadu (Chennai) & Karnataka (Bengaluru)'
        };
      default:
        return { title: 'Enterprise Portal', sub: 'Smart Manufacturing Platform' };
    }
  };

  // Reusable Notifications Bell Control with Dynamic Panel
  const renderNotificationsSymbol = () => (
    <div style={{ position: 'relative' }} ref={notifDropdownRef}>
      <button
        className={`icon-btn ${stoppedCount > 0 ? 'icon-btn-danger-glow' : ''}`}
        onClick={handleToggleNotifications}
        title={`Notifications (${unreadCount} unread, ${stoppedCount} stopped)`}
        aria-label="System Notifications"
        style={{
          position: 'relative',
          border: stoppedCount > 0 ? '1.5px solid rgba(239, 68, 68, 0.7)' : undefined,
          background: stoppedCount > 0 ? 'rgba(239, 68, 68, 0.1)' : undefined
        }}
      >
        <Bell size={18} color={stoppedCount > 0 ? '#ef4444' : undefined} />
        {stoppedCount > 0 ? (
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              background: '#ef4444',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              minWidth: '18px',
              height: '18px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 0 0 2px rgb(var(--surface-rgb)), 0 2px 6px rgba(239, 68, 68, 0.5)',
              animation: 'pulse-dot-anim 1.8s infinite'
            }}
          >
            {stoppedCount}
          </span>
        ) : unreadCount > 0 ? (
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              background: 'var(--brand-purple)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              minWidth: '18px',
              height: '18px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 0 0 2px rgb(var(--surface-rgb))'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {/* Dynamic Notifications Flyout Panel */}
      {showNotifPanel && (
        <div
          style={{
            position: 'absolute',
            top: '52px',
            right: 0,
            width: '460px',
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: '84vh',
            background: 'rgb(var(--surface-rgb))',
            borderRadius: '18px',
            border: '1px solid rgba(var(--line-rgb), 0.18)',
            boxShadow: '0 24px 60px rgba(var(--shadow-rgb), 0.28), 0 0 0 1px rgba(111, 61, 186, 0.12)',
            zIndex: 90,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeInSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(111, 61, 186, 0.08) 0%, rgba(2, 132, 199, 0.06) 100%)',
              borderBottom: '1px solid rgba(var(--line-rgb), 0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: stoppedCount > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(111, 61, 186, 0.12)',
                    color: stoppedCount > 0 ? '#ef4444' : 'var(--brand-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Bell size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    Operational & AI Alerts
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Live 19-Agent Intelligence Mesh
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {unreadCount > 0 && (
                  <button
                    onClick={() => onMarkRead?.('all')}
                    title="Mark all notifications as read"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(var(--line-rgb), 0.15)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--brand-purple)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCheck size={12} />
                    <span>Read all</span>
                  </button>
                )}
                <button
                  onClick={() => setShowNotifPanel(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Close (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Dynamic AI Check Action & Status Strip */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(var(--line-rgb), 0.05)',
                border: '1px solid rgba(var(--line-rgb), 0.08)',
                fontSize: '11.5px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: isCheckingAI ? '#f59e0b' : '#10b981',
                    boxShadow: isCheckingAI ? '0 0 6px #f59e0b' : '0 0 6px #10b981'
                  }}
                />
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {isCheckingAI ? 'Checking Backend & AI...' : 'AI Mesh Synced'}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                  • {lastCheckedTime}
                </span>
              </div>

              <button
                onClick={handleTriggerAICheck}
                disabled={isCheckingAI}
                style={{
                  background: 'linear-gradient(135deg, var(--brand-purple), #4338ca)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  padding: '4px 9px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: isCheckingAI ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  opacity: isCheckingAI ? 0.7 : 1,
                  boxShadow: '0 2px 6px rgba(111, 61, 186, 0.25)'
                }}
                title="Trigger dynamic operational scan across backend database & all 19 domain agents"
              >
                <Sparkles size={11} className={isCheckingAI ? 'animate-spin' : ''} />
                <span>{isCheckingAI ? 'Checking...' : 'Check Backend & AI'}</span>
              </button>
            </div>

            {/* Stopped Agents Urgency Banner */}
            {stoppedCount > 0 && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.28)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  fontSize: '11.5px',
                  color: '#e11d48'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                  <ShieldAlert size={15} />
                  <span>{stoppedCount} Agent{stoppedCount > 1 ? 's' : ''} Stopped Running</span>
                </div>
                <button
                  onClick={() => setNotifFilter('stopped')}
                  style={{
                    background: '#e11d48',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '2px 8px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  View Causes
                </button>
              </div>
            )}
          </div>

          {/* Filter Pills & Search Bar */}
          <div
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(var(--line-rgb), 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              background: 'rgb(var(--surface-rgb))'
            }}
          >
            {/* Search Input */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Search
                size={13}
                style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                value={notifSearch}
                onChange={(e) => setNotifSearch(e.target.value)}
                placeholder="Filter by agent, sector, or reason..."
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  borderRadius: '8px',
                  border: '1px solid rgba(var(--line-rgb), 0.12)',
                  background: 'rgba(var(--line-rgb), 0.04)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />
              {notifSearch && (
                <button
                  onClick={() => setNotifSearch('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `All (${notifications.length})` },
                {
                  id: 'stopped',
                  label: `Stopped (${stoppedCount})`,
                  danger: stoppedCount > 0
                },
                { id: 'updates', label: `AI Insights (${aiUpdatesCount})` },
                { id: 'unread', label: `Unread (${unreadCount})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setNotifFilter(tab.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: notifFilter === tab.id ? '1px solid var(--brand-purple)' : '1px solid rgba(var(--line-rgb), 0.12)',
                    background:
                      notifFilter === tab.id
                        ? 'var(--brand-purple)'
                        : tab.danger
                        ? 'rgba(239, 68, 68, 0.08)'
                        : 'transparent',
                    color:
                      notifFilter === tab.id
                        ? '#ffffff'
                        : tab.danger
                        ? '#e11d48'
                        : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Scroll List */}
          <div
            style={{
              padding: '12px 16px',
              overflowY: 'auto',
              maxHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((n) => {
                const isStopped = n.isStoppedAgent || n.severity === 'error' || (n.title && n.title.toLowerCase().includes('stopped'));
                const isUnread = n.status === 'unread';

                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (isUnread && onMarkRead) onMarkRead(n.id);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: isStopped
                        ? 'rgba(239, 68, 68, 0.05)'
                        : isUnread
                        ? 'rgba(111, 61, 186, 0.04)'
                        : 'var(--muted-fill)',
                      border: isStopped
                        ? '1.5px solid rgba(239, 68, 68, 0.35)'
                        : isUnread
                        ? '1px solid rgba(111, 61, 186, 0.25)'
                        : '1px solid rgba(var(--line-rgb), 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    {/* Item Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            fontSize: '11.5px',
                            color: isStopped
                              ? '#e11d48'
                              : n.severity === 'warning'
                              ? '#d97706'
                              : n.severity === 'success'
                              ? '#059669'
                              : 'var(--brand-purple)'
                          }}
                        >
                          {isStopped ? (
                            <XCircle size={14} />
                          ) : n.severity === 'warning' ? (
                            <AlertTriangle size={14} />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          <span>{n.agentName}</span>
                        </span>

                        {n.sector && (
                          <span
                            style={{
                              fontSize: '10px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: 'rgba(var(--line-rgb), 0.08)',
                              color: 'var(--text-muted)',
                              fontWeight: 500
                            }}
                          >
                            {n.sector}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {timeAgo(n.timestamp)}
                        </span>
                        {isUnread && (
                          <span
                            title="Unread"
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: isStopped ? '#ef4444' : 'var(--brand-purple)'
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {n.title}
                    </div>

                    {/* Concise One-Line Reason / Update */}
                    {n.oneLineReason && (
                      <div
                        style={{
                          fontSize: '11.5px',
                          color: isStopped ? '#be123c' : 'var(--text-primary)',
                          background: isStopped ? 'rgba(239, 68, 68, 0.08)' : 'rgba(var(--line-rgb), 0.04)',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          borderLeft: isStopped ? '3px solid #e11d48' : '3px solid var(--brand-purple)',
                          fontWeight: isStopped ? 600 : 500,
                          lineHeight: 1.4
                        }}
                      >
                        {n.oneLineReason}
                      </div>
                    )}

                    {/* Additional Message or KPI Impact */}
                    {n.kpiImpact && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                        <TrendingUp size={12} />
                        <span>KPI Impact: {n.kpiImpact}</span>
                      </div>
                    )}

                    {/* Suggested Action for Stoppage with Instant Restart Button */}
                    {isStopped && (
                      <div
                        style={{
                          marginTop: '4px',
                          paddingTop: '6px',
                          borderTop: '1px solid rgba(239, 68, 68, 0.15)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', flex: 1 }}>
                          {n.suggestedAction ? n.suggestedAction.split('.')[0] + '.' : 'Auto-fail safe recovery ready.'}
                        </span>
                        <button
                          onClick={(e) => handleRestartAgentClick(n.agentId || n.agentNumber, e)}
                          disabled={restartingAgentId === (n.agentId || n.agentNumber)}
                          style={{
                            background: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: restartingAgentId === (n.agentId || n.agentNumber) ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                          }}
                        >
                          {restartingAgentId === (n.agentId || n.agentNumber) ? (
                            <>
                              <RefreshCw size={11} className="animate-spin" />
                              <span>Starting...</span>
                            </>
                          ) : (
                            <>
                              <Play size={11} fill="#ffffff" />
                              <span>Restart Agent</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: '36px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircle2 size={24} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  All Systems Operating Nominally
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '300px' }}>
                  No active stoppage alerts or unread operational warnings across all 19 domain factory agents.
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar: Simulation & AI Status */}
          <div
            style={{
              padding: '10px 16px',
              borderTop: '1px solid rgba(var(--line-rgb), 0.1)',
              background: 'rgba(var(--line-rgb), 0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setShowSimulateBox(!showSimulateBox)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-purple)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{showSimulateBox ? 'Hide Simulation Tool' : 'Simulate Stoppage Alert'}</span>
                <ChevronDown size={12} style={{ transform: showSimulateBox ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                19 Agents • 6 Sectors
              </span>
            </div>

            {/* Collapsible Simulation Box */}
            {showSimulateBox && (
              <div
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(var(--line-rgb), 0.05)',
                  border: '1px solid rgba(var(--line-rgb), 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Trigger Simulated Agent Stoppage (Test Real-Time Dynamic Alert)
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    value={simAgentNum}
                    onChange={(e) => setSimAgentNum(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '5px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(var(--line-rgb), 0.15)',
                      fontSize: '11.5px',
                      background: 'rgb(var(--surface-rgb))',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value={4}>Module 04: Predictive Maintenance</option>
                    <option value={6}>Module 06: Vision Inspection</option>
                    <option value={2}>Module 02: Production Monitoring</option>
                    <option value={9}>Module 09: Inventory Optimization</option>
                    <option value={13}>Module 13: Energy Management</option>
                  </select>

                  <button
                    onClick={handleDispatchSimulation}
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Trigger Stoppage
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Reusable Theme Toggle Control
  const renderThemeToggle = () => (
    <button
      className="icon-btn"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );

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

  // Reusable User Identity in Top Navbar
  const renderUserCapsule = () => (
    <div className="topbar-user-capsule">
      <div className="user-capsule-badge" title="Logged in as Executive Admin">
        <span className="user-avatar-dot">HQ</span>
        <span className="user-capsule-name">Admin</span>
      </div>
    </div>
  );

  // Logout Confirmation Modal Dialog
  const renderLogoutConfirmModal = () => {
    if (!showLogoutConfirm) return null;

    return (
      <div
        className="logout-modal-backdrop"
        onClick={() => setShowLogoutConfirm(false)}
      >
        <div
          className="logout-modal-card"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-dialog-title"
        >
          <div className="logout-modal-icon-bubble">
            <LogOut size={26} />
          </div>

          <h3 id="logout-dialog-title" className="logout-modal-title">
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
              <span>Yes, Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Phase 1 Clean Header: On Home page, display "Manufacturing 360°: Every Function, One Platform" + Controls
  if (activeTab === 'home') {
    return (
      <>
        <header className="topbar home-clean-topbar" style={{ justifyContent: 'space-between', borderBottom: '1px solid var(--card-border)' }}>
          <div className="topbar-left" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="home-topbar-brand-title">
              <span className="home-topbar-title-main">Manufacturing 360°</span>
              <span className="home-topbar-title-colon">:</span>
              <span className="home-topbar-title-tagline">Every Function, One Platform</span>
            </div>
          </div>
          <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {renderUserCapsule()}
            {renderNotificationsSymbol()}
            {renderThemeToggle()}
          </div>
        </header>
        {renderLogoutConfirmModal()}
      </>
    );
  }

  const titleInfo = getPageTitle();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <h1 className="page-title">{titleInfo.title}</h1>
          <p className="page-sub">{titleInfo.sub}</p>
        </div>
      </div>

      {/* Topbar Right Controls for other views */}
      <div className="topbar-right">
        {renderUserCapsule()}
        {renderNotificationsSymbol()}
        {renderThemeToggle()}
      </div>
      {renderLogoutConfirmModal()}
    </header>
  );
}
