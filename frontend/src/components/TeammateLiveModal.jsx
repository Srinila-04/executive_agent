import React, { useState } from 'react';
import AgentInPageDashboard from './AgentInPageDashboard';
import {
  X,
  ExternalLink,
  RefreshCw,
  Monitor,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

/**
 * Teammate Live UI Modal
 * Opens the live web application developed by teammate on their local port (e.g. http://localhost:3001-3019),
 * with live port switching, external new tab launcher, and integrated interactive simulator fallback.
 */
export default function TeammateLiveModal({ agent, sector, onClose }) {
  const [viewMode, setViewMode] = useState('live'); // 'live' or 'simulator'
  const [iframeKey, setIframeKey] = useState(1);
  const [hasIframeError, setHasIframeError] = useState(false);

  if (!agent) return null;

  // Resolve teammate port & URL
  const port = agent.port || 3000 + agent.id;
  const isAgent18 = agent.id === 18 || agent.code === 'CUSTOMER_ORDER';
  const isAgent16 = agent.id === 16 || agent.code === 'MFG_COST' || agent.id === 'unit-cost';
  const isAgent19 = agent.id === 19 || agent.code === 'DIGITAL_TWIN' || agent.id === 'digital-plant-twin';
  const isAgent13 = agent.id === 13 || agent.code === 'ENERGY_MGMT' || agent.id === 'energy-tariff';
  const isAgent3 = agent.id === 3 || agent.code === 'OEE_PERF' || agent.id === 'oee';
  const liveUrl = agent.appUrl
    ? agent.appUrl
    : isAgent3
    ? 'https://oee-performance-agent.vercel.app/'
    : isAgent19
    ? 'https://digital-twin-frontend-c0ji.onrender.com/'
    : isAgent18
    ? 'https://customer-order-management-two.vercel.app/monitoring'
    : isAgent16
    ? 'https://mfc-agent-frontend.vercel.app/home'
    : isAgent13
    ? 'https://energy-gules.vercel.app/'
    : agent.frontendUrl || `http://localhost:${port}`;

  const reloadIframe = () => {
    setIframeKey((prev) => prev + 1);
    setHasIframeError(false);
  };

  return (
    <div
      className="teammate-modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(5, 7, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        animation: 'modalFadeIn 0.2s ease-out'
      }}
    >
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* MODAL WINDOW */}
      <div
        className="teammate-modal-window"
        style={{
          width: '96vw',
          maxWidth: '1540px',
          height: '92vh',
          maxHeight: '940px',
          backgroundColor: '#0f172a',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(111, 61, 186, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* MODAL TOPBAR */}
        <div
          style={{
            padding: '12px 20px',
            background: '#1e293b',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Left: Agent Identification */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: sector?.color || '#6f3dba',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '14px',
                boxShadow: `0 0 14px ${sector?.color || '#6f3dba'}66`
              }}
            >
              AG-{String(agent.id || agent.agentNumber).padStart(2, '0')}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#f8fafc' }}>
                  {agent.name}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#10b981',
                      boxShadow: '0 0 6px #10b981'
                    }}
                  />
                  Live Teammate Portal
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                {agent.tagline || agent.description} • Owner: <span style={{ color: '#cbd5e1' }}>{agent.owner}</span>
              </p>
            </div>
          </div>

          {/* Center: Live Port & Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '5px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontSize: '12px'
              }}
            >
              <span style={{ color: '#64748b', fontWeight: 600 }}>Port:</span>
              <code style={{ color: '#38bdf8', fontWeight: 700, background: 'rgba(56, 189, 248, 0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                :{port}
              </code>
              <span style={{ color: '#475569' }}>|</span>
              <span style={{ color: '#64748b' }}>Table:</span>
              <code style={{ color: '#a78bfa', fontSize: '11px' }}>
                {agent.table || `fact_agent_${agent.id}`}
              </code>
            </div>

            {/* View Switcher: Live Iframe vs Simulator */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '8px',
                padding: '2px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <button
                onClick={() => setViewMode('live')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: viewMode === 'live' ? '#6f3dba' : 'transparent',
                  color: viewMode === 'live' ? '#ffffff' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Monitor size={14} />
                <span>Live Port UI</span>
              </button>
              <button
                onClick={() => setViewMode('simulator')}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: viewMode === 'simulator' ? '#6f3dba' : 'transparent',
                  color: viewMode === 'simulator' ? '#ffffff' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Sparkles size={14} />
                <span>Simulator</span>
              </button>
            </div>
          </div>

          {/* Right: Actions (Reload, Open Tab, Close) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {viewMode === 'live' && (
              <button
                onClick={reloadIframe}
                title="Reload Live Frame"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <RefreshCw size={13} />
                <span>Reload</span>
              </button>
            )}

            <button
              onClick={() => window.open(liveUrl, '_blank')}
              title={`Open ${liveUrl} in new tab`}
              style={{
                background: '#4338ca',
                border: 'none',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '6px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              <ExternalLink size={13} />
              <span>Open in New Tab</span>
            </button>

            <button
              onClick={onClose}
              title="Close Live Gateway"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#f8fafc',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s ease'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* MODAL MAIN VIEWPORT */}
        <div style={{ flex: 1, minHeight: 0, width: '100%', position: 'relative', overflow: 'hidden' }}>
          {viewMode === 'live' ? (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Secondary Status Banner */}
              <div
                style={{
                  padding: '6px 16px',
                  background: '#090d16',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11.5px',
                  color: '#94a3b8'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#10b981' }}>● Connecting to Live Teammate UI:</span>
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#38bdf8', textDecoration: 'underline', fontWeight: 600 }}
                  >
                    {liveUrl}
                  </a>
                </div>
                <div>
                  If teammate's server on <code style={{ color: '#38bdf8' }}>:{port}</code> is not started, toggle to{' '}
                  <strong style={{ color: '#a78bfa', cursor: 'pointer' }} onClick={() => setViewMode('simulator')}>
                    Simulator Mode
                  </strong>
                </div>
              </div>

              {/* Live Iframe */}
              <div style={{ flex: 1, minHeight: 0, width: '100%', position: 'relative', background: '#020617' }}>
                <iframe
                  key={iframeKey}
                  src={liveUrl}
                  title={`${agent.name} Teammate Live UI`}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: 'block'
                  }}
                  onError={() => setHasIframeError(true)}
                />
              </div>
            </div>
          ) : (
            /* SIMULATOR MODE (Interactive in-page dashboard with Neon DB) */
            <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: 'var(--page-bg)' }}>
              <AgentInPageDashboard
                system={agent}
                sector={sector}
                isFullScreenOnly={true}
                onBackToSector={onClose}
                onBackToOrbit={onClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
