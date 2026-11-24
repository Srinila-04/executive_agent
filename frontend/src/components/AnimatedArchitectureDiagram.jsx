import React, { useState, useEffect, useRef } from 'react';

/**
 * Animated System Architecture Diagram
 * 6-Column Manufacturing AI Architecture with Horizontally Scrollable Pipeline.
 *
 * All 6 panels have the EXACT same height (240px) and width (160px).
 * All 12 stacked cards across Panels 1, 3, 4, 6 have the EXACT same height (44px).
 * Panels 2 and 5 have evenly proportioned, centered content with zero vertical dead space.
 * Smooth horizontal scroll (overflow-x: auto) prevents cramping or vertical stretching on any screen size.
 * Continuous 60fps moving data packets, micro-animations, card hover tooltips, and panel focus selection.
 * Clean header strip with no pause/replay/svg buttons.
 */

export default function AnimatedArchitectureDiagram({
  onSelectStage,
  selectedStageKey = 'agents'
}) {
  const [activePanelId, setActivePanelId] = useState(selectedStageKey);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, text: '' });
  const [chipStep, setChipStep] = useState(0);
  const scrollContainerRef = useRef(null);

  // Sync with external selected stage
  useEffect(() => {
    if (selectedStageKey) {
      const mapping = {
        source: 'source',
        prep: 'prep',
        gateway: 'prep',
        warehouse: 'warehouse',
        agents: 'agents',
        consumption: 'consumption',
        governance: 'consumption',
        outcome: 'outcome',
        dispatch: 'outcome'
      };
      setActivePanelId(mapping[selectedStageKey] || selectedStageKey);
    }
  }, [selectedStageKey]);

  // Loop the Extract -> Transform -> Load chips sequence in Panel 2
  useEffect(() => {
    const interval = setInterval(() => {
      setChipStep((prev) => (prev + 1) % 3);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  const handlePanelClick = (id) => {
    const nextId = activePanelId === id ? null : id;
    setActivePanelId(nextId);
    if (onSelectStage) {
      onSelectStage(nextId || id);
    }
  };

  const handleCardMouseEnter = (e, tooltip) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      text: tooltip
    });
    setHoveredCard(tooltip);
  };

  const handleCardMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
    <div
      className="animated-architecture-canvas"
      style={{
        background: '#ffffff',
        borderRadius: '14px',
        padding: '14px 16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(226, 232, 240, 0.95)',
        position: 'relative',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxSizing: 'border-box',
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <style>{`
        @keyframes gearRotateClockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes gearRotateCounter {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes pulseCloud {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes floatCube {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(2deg); }
        }
        @keyframes chartBarGrow {
          0%, 100% { height: 14px; }
          50% { height: 26px; }
        }
        @keyframes chartBarGrow2 {
          0%, 100% { height: 22px; }
          50% { height: 10px; }
        }
        @keyframes chartBarGrow3 {
          0%, 100% { height: 18px; }
          50% { height: 28px; }
        }
        @keyframes bellRing {
          0%, 80%, 100% { transform: rotate(0deg); }
          85% { transform: rotate(14deg); }
          90% { transform: rotate(-14deg); }
          95% { transform: rotate(8deg); }
        }
        @keyframes targetPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 0.4; }
        }
        @keyframes aiCorePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes dashMove {
          to { stroke-dashoffset: -32; }
        }
        @keyframes pillShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes introSlideUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .anim-panel {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .anim-panel:hover {
          transform: translateY(-2px);
        }
        .anim-card {
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .anim-card:hover {
          transform: translateY(-2px) scale(1.015);
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
          z-index: 5;
        }
        .gear-cw {
          transform-origin: center;
          animation: gearRotateClockwise 6s linear infinite;
        }
        .gear-ccw {
          transform-origin: center;
          animation: gearRotateCounter 6s linear infinite;
        }
        .cloud-pulse {
          transform-origin: center;
          animation: pulseCloud 2.8s ease-in-out infinite;
        }
        .cube-float {
          transform-origin: center;
          animation: floatCube 3.5s ease-in-out infinite;
        }
        .ai-pulse {
          transform-origin: center;
          animation: aiCorePulse 2.6s ease-in-out infinite;
        }
        .bell-shake {
          transform-origin: top center;
          animation: bellRing 4.2s ease-in-out infinite;
        }
        .target-ring {
          transform-origin: center;
          animation: targetPulse 2.4s ease-in-out infinite;
        }

        .architecture-scroll-container::-webkit-scrollbar {
          height: 5px;
        }
        .architecture-scroll-container::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 99px;
        }
        .architecture-scroll-container::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 99px;
        }
        .architecture-scroll-container::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* TOP HEADER TITLE STRIP */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981'
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            System Architecture Pipeline
          </span>
          <span style={{ fontSize: '10px', color: '#64748b' }}>
            • 6 Integrated Architecture Layers (Scroll ↔ to explore)
          </span>
        </div>
        <span style={{ fontSize: '9.5px', color: '#94a3b8', fontWeight: 600 }}>
          Click any card to inspect details ↘
        </span>
      </div>

      {/* HORIZONTALLY SCROLLABLE 6-PANEL CONTAINER (PROPERLY ALIGNED, UNIFORM SIZING) */}
      <div
        ref={scrollContainerRef}
        className="architecture-scroll-container"
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: '0px',
          overflowX: 'auto',
          overflowY: 'hidden',
          paddingBottom: '8px',
          width: '100%',
          boxSizing: 'border-box',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* ========================================================
            PANEL 1: 1. SOURCE SYSTEM (DATA INTEGRATION)
           ======================================================== */}
        <div
          className="anim-panel"
          onClick={() => handlePanelClick('source')}
          style={{
            flex: '0 0 160px',
            width: '160px',
            minWidth: '160px',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            border: activePanelId === 'source' ? '2.5px solid #b3161b' : '1px solid rgba(220, 38, 38, 0.45)',
            boxShadow: activePanelId === 'source' ? '0 6px 20px rgba(179, 22, 27, 0.2)' : '0 1px 4px rgba(0,0,0,0.03)',
            opacity: activePanelId && activePanelId !== 'source' ? 0.5 : 1,
            cursor: 'pointer',
            overflow: 'hidden',
            background: '#ffffff',
            boxSizing: 'border-box',
            animation: 'introSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0.06s'
          }}
        >
          {/* Header 1 */}
          <div
            style={{
              height: '44px',
              background: 'linear-gradient(135deg, #b3161b 0%, #d32f2f 100%)',
              color: '#ffffff',
              padding: '4px 3px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1px',
              boxSizing: 'border-box',
              flexShrink: 0
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2z" fill="#ffffff" fillOpacity="0.25" />
              <path d="M18 18h2" stroke="#ffffff" strokeWidth="2" />
              <path d="M12 18h2" stroke="#ffffff" strokeWidth="2" />
              <path d="M6 18h2" stroke="#ffffff" strokeWidth="2" />
            </svg>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2px', lineHeight: 1.1 }}>
              1. SOURCE SYSTEM
            </div>
            <div style={{ fontSize: '7.5px', fontWeight: 600, opacity: 0.95 }}>
              (DATA INTEGRATION)
            </div>
          </div>

          {/* Body 1: 3 Uniform Height Cards (44px each) */}
          <div
            style={{
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              flex: 1,
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}
          >
            {/* Card 1: ERP & MES */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "Pulls production orders, BOM, and line routings from SAP S/4HANA & MES.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#ebf4fc',
                border: '1px solid #c2dbf5',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ position: 'relative', width: '26px', height: '26px', flexShrink: 0 }}>
                <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                  <ellipse cx="14" cy="9" rx="10" ry="4" fill="#0f4c81" />
                  <path d="M4 9v6c0 2.2 4.5 4 10 4s10-1.8 10-4V9" fill="#1b609e" />
                  <ellipse cx="14" cy="15" rx="10" ry="4" fill="#2d77bc" opacity="0.4" />
                  <path d="M4 15v6c0 2.2 4.5 4 10 4s10-1.8 10-4v-6" fill="#0f4c81" />
                  <g className="gear-cw" style={{ transformOrigin: '22px 22px' }}>
                    <circle cx="22" cy="22" r="7" fill="#10b981" />
                    <circle cx="22" cy="22" r="3" fill="#ffffff" />
                    <rect x="21" y="13" width="2" height="18" fill="#10b981" rx="1" />
                    <rect x="13" y="21" width="18" height="2" fill="#10b981" rx="1" />
                  </g>
                </svg>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  ERP & MES
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (SAP / Oracle / Etc.)
                </div>
              </div>
            </div>

            {/* Card 2: Excel & Files */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "Ingests daily shift handovers, manual QA logs, and vendor dispatch files.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#edf7ee',
                border: '1px solid #cce8cf',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #107c41, #0b5a2f)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '12px',
                  boxShadow: '0 2px 4px rgba(16, 124, 65, 0.3)',
                  flexShrink: 0
                }}
              >
                X
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Excel & Files
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (CSV / XLSX / Etc.)
                </div>
              </div>
            </div>

            {/* Card 3: APIs & ETL */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "Real-time REST, OData, and OPC-UA streams from plant IoT telemetry.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#f5f0fb',
                border: '1px solid #decbf5',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div
                className="cloud-pulse"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '5px',
                  background: 'rgba(124, 58, 237, 0.12)',
                  color: '#6d28d9',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6d28d9" strokeWidth="2">
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="rgba(124, 58, 237, 0.15)" />
                </svg>
                <span style={{ fontSize: '6.5px', fontWeight: 900, marginTop: '-4px', letterSpacing: '0.3px' }}>API</span>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  APIs & ETL
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (REST / OData / Etc.)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ARROW 1 -> 2 */}
        <div style={{ flex: '0 0 20px', width: '20px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="20" viewBox="0 0 24 24">
            <line x1="2" y1="12" x2="18" y2="12" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3" style={{ animation: 'dashMove 1s linear infinite' }} />
            <polyline points="13 7 19 12 13 17" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="12" r="3" fill="#2563eb">
              <animate attributeName="cx" values="2;18" dur="1.7s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* ========================================================
            PANEL 2: 2. DATA PREPARATION (ETL / DATA PIPELINE)
           ======================================================== */}
        <div
          className="anim-panel"
          onClick={() => handlePanelClick('prep')}
          style={{
            flex: '0 0 160px',
            width: '160px',
            minWidth: '160px',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            border: activePanelId === 'prep' ? '2.5px solid #1e40af' : '1px solid rgba(30, 64, 175, 0.45)',
            boxShadow: activePanelId === 'prep' ? '0 6px 20px rgba(30, 64, 175, 0.2)' : '0 1px 4px rgba(0,0,0,0.03)',
            opacity: activePanelId && activePanelId !== 'prep' ? 0.5 : 1,
            cursor: 'pointer',
            overflow: 'hidden',
            background: '#ffffff',
            boxSizing: 'border-box',
            animation: 'introSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0.12s'
          }}
        >
          {/* Header 2 */}
          <div
            style={{
              height: '44px',
              background: '#1e40af',
              color: '#ffffff',
              padding: '4px 3px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1px',
              boxSizing: 'border-box',
              flexShrink: 0
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" fill="#ffffff" fillOpacity="0.2" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2px', lineHeight: 1.1 }}>
              2. DATA PREPARATION
            </div>
            <div style={{ fontSize: '7.5px', fontWeight: 600, opacity: 0.95 }}>
              (ETL / DATA PIPELINE)
            </div>
          </div>

          {/* Body 2: Evenly Distributed Content */}
          <div
            style={{
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              flex: 1,
              boxSizing: 'border-box'
            }}
          >
            {/* Database & Interlocking Gears Graphic */}
            <div style={{ position: 'relative', width: '60px', height: '42px' }}>
              <svg width="60" height="42" viewBox="0 0 80 64" fill="none">
                <ellipse cx="32" cy="14" rx="20" ry="7" fill="#1e40af" />
                <path d="M12 14v10c0 3.8 9 7 20 7s20-3.2 20-7V14" fill="#2563eb" />
                <ellipse cx="32" cy="24" rx="20" ry="7" fill="#3b82f6" opacity="0.4" />
                <path d="M12 24v10c0 3.8 9 7 20 7s20-3.2 20-7V24" fill="#1e40af" />
                <ellipse cx="32" cy="34" rx="20" ry="7" fill="#60a5fa" opacity="0.4" />
                <path d="M12 34v10c0 3.8 9 7 20 7s20-3.2 20-7V34" fill="#1d4ed8" />
                
                <g className="gear-cw" style={{ transformOrigin: '56px 22px' }}>
                  <circle cx="56" cy="22" r="10" fill="#0284c7" />
                  <circle cx="56" cy="22" r="4" fill="#ffffff" />
                  <rect x="54.5" y="9" width="3" height="26" fill="#0284c7" rx="1.5" />
                  <rect x="43" y="20.5" width="26" height="3" fill="#0284c7" rx="1.5" />
                </g>
                <g className="gear-ccw" style={{ transformOrigin: '66px 42px' }}>
                  <circle cx="66" cy="42" r="8" fill="#38bdf8" />
                  <circle cx="66" cy="42" r="3" fill="#ffffff" />
                  <rect x="64.5" y="32" width="3" height="20" fill="#38bdf8" rx="1" />
                  <rect x="56" y="40.5" width="20" height="3" fill="#38bdf8" rx="1" />
                </g>
              </svg>
            </div>

            {/* PREPARE & LOAD Pill Button */}
            <div
              style={{
                background: 'linear-gradient(90deg, #1e40af, #2563eb, #1e40af)',
                backgroundSize: '200% auto',
                animation: 'pillShimmer 3s linear infinite',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '99px',
                fontSize: '8.5px',
                fontWeight: 900,
                letterSpacing: '0.4px',
                boxShadow: '0 2px 6px rgba(30, 64, 175, 0.28)',
                textAlign: 'center',
                width: '90%',
                boxSizing: 'border-box'
              }}
            >
              PREPARE & LOAD
            </div>

            {/* 3 Small Chips */}
            <div style={{ display: 'flex', gap: '3px', width: '100%', justifyContent: 'center' }}>
              {['Extract', 'Transform', 'Load'].map((chip, idx) => {
                const isActive = chipStep === idx;
                return (
                  <span
                    key={chip}
                    style={{
                      fontSize: '7.5px',
                      fontWeight: 700,
                      padding: '2px 5px',
                      borderRadius: '4px',
                      border: isActive ? '1px solid #1e40af' : '1px solid #cbd5e1',
                      background: isActive ? '#dbeafe' : '#f8fafc',
                      color: isActive ? '#1e40af' : '#64748b',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    {chip}
                  </span>
                );
              })}
            </div>

            {/* Caption */}
            <div style={{ fontSize: '7.5px', color: '#64748b', textAlign: 'center', fontWeight: 600 }}>
              (SSIS / ADF / ETL / RPA)
            </div>
          </div>
        </div>

        {/* ARROW 2 -> 3 */}
        <div style={{ flex: '0 0 20px', width: '20px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="20" viewBox="0 0 24 24">
            <line x1="2" y1="12" x2="18" y2="12" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3" style={{ animation: 'dashMove 1s linear infinite' }} />
            <polyline points="13 7 19 12 13 17" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="12" r="3" fill="#7c3aed">
              <animate attributeName="cx" values="2;18" dur="1.7s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* ========================================================
            PANEL 3: 3. DATA & BUSINESS LAYER (WAREHOUSE / SEMANTIC)
           ======================================================== */}
        <div
          className="anim-panel"
          onClick={() => handlePanelClick('warehouse')}
          style={{
            flex: '0 0 160px',
            width: '160px',
            minWidth: '160px',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            border: activePanelId === 'warehouse' ? '2.5px solid #5b2a86' : '1px solid rgba(123, 63, 176, 0.45)',
            boxShadow: activePanelId === 'warehouse' ? '0 6px 20px rgba(91, 42, 134, 0.2)' : '0 1px 4px rgba(0,0,0,0.03)',
            opacity: activePanelId && activePanelId !== 'warehouse' ? 0.5 : 1,
            cursor: 'pointer',
            overflow: 'hidden',
            background: '#ffffff',
            boxSizing: 'border-box',
            animation: 'introSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0.18s'
          }}
        >
          {/* Header 3 */}
          <div
            style={{
              height: '44px',
              background: 'linear-gradient(135deg, #5b2a86 0%, #7b3fb0 100%)',
              color: '#ffffff',
              padding: '4px 3px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1px',
              boxSizing: 'border-box',
              flexShrink: 0
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" fill="#ffffff" fillOpacity="0.25" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2px', lineHeight: 1.1 }}>
              3. DATA & BUSINESS LAYER
            </div>
            <div style={{ fontSize: '7.5px', fontWeight: 600, opacity: 0.95 }}>
              (DATA WAREHOUSE / SEMANTIC)
            </div>
          </div>

          {/* Body 3: 3 Uniform Height Cards */}
          <div
            style={{
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              flex: 1,
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}
          >
            {/* Card 1: Cleaned & Integrated Data */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "Single golden record linking manufacturing ops, maintenance, and finance.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#f6f1fc',
                border: '1px solid #dfcbf7',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div className="cube-float" style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <polygon points="14 3 24 8.5 14 14 4 8.5" fill="#a855f7" />
                  <polygon points="4 8.5 14 14 14 25 4 19.5" fill="#7c3aed" />
                  <polygon points="14 14 24 8.5 24 19.5 14 25" fill="#581c87" />
                </svg>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Cleaned & Integrated
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (Single Source of Truth)
                </div>
              </div>
            </div>

            {/* Card 2: Business / Semantic Model */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "Enforces manufacturing domain logic: OEE, scrap rates, and cost variance.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#eef8fc',
                border: '1px solid #cce8f5',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <line x1="7" y1="21" x2="14" y2="7" stroke="#0284c7" strokeWidth="2" />
                  <line x1="21" y1="21" x2="14" y2="7" stroke="#0284c7" strokeWidth="2" />
                  <circle cx="14" cy="7" r="4.5" fill="#0284c7" />
                  <circle cx="7" cy="21" r="4" fill="#38bdf8" />
                  <circle cx="21" cy="21" r="4" fill="#38bdf8" />
                </svg>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Business / Semantic
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (Metrics / KPIs / Logic)
                </div>
              </div>
            </div>

            {/* Card 3: Aggregated & Optimized Data */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "Pre-aggregated facts, dimensions, and views optimized for sub-100ms queries.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#edf7ee',
                border: '1px solid #cbe9ce',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 4px rgba(5, 150, 105, 0.25)'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Aggregated & Optimized
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (Facts / Dimensions / Views)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ARROW 3 -> 4 */}
        <div style={{ flex: '0 0 20px', width: '20px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="20" viewBox="0 0 24 24">
            <line x1="2" y1="12" x2="18" y2="12" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3" style={{ animation: 'dashMove 1s linear infinite' }} />
            <polyline points="13 7 19 12 13 17" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="12" r="3" fill="#4f46e5">
              <animate attributeName="cx" values="2;18" dur="1.7s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* ========================================================
            PANEL 4: 4. MULTI-AGENT AI LAYER (OUR USE CASE - WHAT WE GONNA DO)
           ======================================================== */}
        <div
          className="anim-panel"
          onClick={() => handlePanelClick('agents')}
          style={{
            flex: '0 0 160px',
            width: '160px',
            minWidth: '160px',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            border: activePanelId === 'agents' ? '2.5px solid #4338ca' : '1px solid rgba(99, 102, 241, 0.45)',
            boxShadow: activePanelId === 'agents' ? '0 6px 20px rgba(67, 56, 202, 0.22)' : '0 1px 4px rgba(0,0,0,0.03)',
            opacity: activePanelId && activePanelId !== 'agents' ? 0.5 : 1,
            cursor: 'pointer',
            overflow: 'hidden',
            background: '#ffffff',
            boxSizing: 'border-box',
            animation: 'introSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0.24s'
          }}
        >
          {/* Header 4: Indigo AI Gradient */}
          <div
            style={{
              height: '44px',
              background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
              color: '#ffffff',
              padding: '4px 3px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1px',
              boxSizing: 'border-box',
              flexShrink: 0
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" fill="#ffffff" fillOpacity="0.25" />
              <path d="M9 14h6" />
              <path d="M9 18h6" />
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v3" />
              <path d="M12 18v3" />
            </svg>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2px', lineHeight: 1.1 }}>
              4. MULTI-AGENT AI
            </div>
            <div style={{ fontSize: '7.5px', fontWeight: 600, opacity: 0.95 }}>
              (20 AUTONOMOUS ENGINES)
            </div>
          </div>

          {/* Body 4: 3 Uniform Height Cards (44px each) */}
          <div
            style={{
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              flex: 1,
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}
          >
            {/* Card 1: Production & Planning */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "Agents 01, 02, 03, 19: finite scheduling, 3D line digital twin, takt pace.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div
                className="ai-pulse"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 4px rgba(79, 70, 229, 0.3)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <circle cx="4" cy="12" r="2" fill="#ffffff" />
                  <circle cx="12" cy="10" r="2" fill="#ffffff" />
                  <circle cx="20" cy="14" r="2" fill="#ffffff" />
                </svg>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Production & Planning
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (Takt / Schedule / Twins)
                </div>
              </div>
            </div>

            {/* Card 2: Quality & Predictive Fleet */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "Agents 04, 05, 06, 13: 14-day bearing FFT alert, optical scrap Pareto.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #9333ea, #7e22ce)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 4px rgba(147, 51, 234, 0.3)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Quality & Predictive
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (Vibration FFT / Scrap AOI)
                </div>
              </div>
            </div>

            {/* Card 3: Supply & Autonomous RFQ */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "Agents 09, 10, 11, 14: Automated RFQ PO-94182 to JSW Steel, 428-day zero-LTI.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 4px rgba(5, 150, 105, 0.3)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Supply & Auto-RFQ
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (Buffer / PO Dispatch)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ARROW 4 -> 5 */}
        <div style={{ flex: '0 0 20px', width: '20px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="20" viewBox="0 0 24 24">
            <line x1="2" y1="12" x2="18" y2="12" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3" style={{ animation: 'dashMove 1s linear infinite' }} />
            <polyline points="13 7 19 12 13 17" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="12" r="3" fill="#1e3a9f">
              <animate attributeName="cx" values="2;18" dur="1.7s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* ========================================================
            PANEL 5: 5. CONSUMPTION (BI / REPORTING / APPS)
           ======================================================== */}
        <div
          className="anim-panel"
          onClick={() => handlePanelClick('consumption')}
          style={{
            flex: '0 0 160px',
            width: '160px',
            minWidth: '160px',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            border: activePanelId === 'consumption' ? '2.5px solid #1e3a9f' : '1px solid rgba(30, 58, 159, 0.45)',
            boxShadow: activePanelId === 'consumption' ? '0 6px 20px rgba(30, 58, 159, 0.2)' : '0 1px 4px rgba(0,0,0,0.03)',
            opacity: activePanelId && activePanelId !== 'consumption' ? 0.5 : 1,
            cursor: 'pointer',
            overflow: 'hidden',
            background: '#ffffff',
            boxSizing: 'border-box',
            animation: 'introSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0.3s'
          }}
        >
          {/* Header 5 */}
          <div
            style={{
              height: '44px',
              background: '#1e3a9f',
              color: '#ffffff',
              padding: '4px 3px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1px',
              boxSizing: 'border-box',
              flexShrink: 0
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2px', lineHeight: 1.1 }}>
              5. CONSUMPTION
            </div>
            <div style={{ fontSize: '7.5px', fontWeight: 600, opacity: 0.95 }}>
              (BI / REPORTING / APPS)
            </div>
          </div>

          {/* Body 5 */}
          <div
            style={{
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              flex: 1,
              boxSizing: 'border-box'
            }}
          >
            {/* Desktop Monitor Illustration */}
            <div
              style={{
                width: '68px',
                height: '40px',
                background: '#ffffff',
                border: '2px solid #0f172a',
                borderRadius: '4px',
                padding: '2.5px',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: '5px', background: '#0284c7', borderRadius: '1.5px', animation: 'chartBarGrow 2.2s ease-in-out infinite', height: '16px' }} />
              <div style={{ width: '5px', background: '#38bdf8', borderRadius: '1.5px', animation: 'chartBarGrow2 2.6s ease-in-out infinite', height: '22px' }} />
              <div style={{ width: '5px', background: '#0ea5e9', borderRadius: '1.5px', animation: 'chartBarGrow3 2s ease-in-out infinite', height: '12px' }} />
              
              <div style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px' }}>
                <svg width="16" height="16" viewBox="0 0 32 32">
                  <circle cx="16" cy="16" r="14" fill="#f59e0b" />
                  <path d="M16 16 L16 2 A14 14 0 0 1 30 16 Z" fill="#10b981" />
                </svg>
              </div>

              <div style={{ position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%)', width: '18px', height: '3px', background: '#334155', borderRadius: '1.5px' }} />
            </div>

            {/* Title Caption */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15 }}>
                Reports & Dashboards
              </div>
              <div style={{ fontSize: '7.5px', color: '#64748b', marginTop: '1px' }}>
                (Power BI / Tableau / Custom Apps)
              </div>
            </div>

            {/* 3 Tool Tiles */}
            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center' }}>
              <div
                title="Microsoft Power BI"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '3px',
                  background: 'linear-gradient(135deg, #f2c811, #e6a100)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '2px',
                  gap: '1px',
                  boxShadow: '0 2px 4px rgba(242, 200, 17, 0.3)',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ width: '2px', height: '5px', background: '#111827', borderRadius: '0.5px' }} />
                <div style={{ width: '2px', height: '8px', background: '#111827', borderRadius: '0.5px' }} />
                <div style={{ width: '2px', height: '11px', background: '#111827', borderRadius: '0.5px' }} />
              </div>

              <div
                title="Tableau Software"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '3px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                  boxSizing: 'border-box'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24">
                  <rect x="10" y="2" width="4" height="20" fill="#e11d48" rx="1" />
                  <rect x="2" y="10" width="20" height="4" fill="#0284c7" rx="1" />
                  <circle cx="12" cy="12" r="3" fill="#f59e0b" />
                </svg>
              </div>

              <div
                title="Custom Manufacturing Command Portal"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '3px',
                  background: '#1d4ed8',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1px',
                  padding: '2px',
                  boxShadow: '0 2px 4px rgba(29, 78, 216, 0.3)',
                  boxSizing: 'border-box'
                }}
              >
                <div style={{ background: '#ffffff', borderRadius: '1px' }} />
                <div style={{ background: '#ffffff', borderRadius: '1px' }} />
                <div style={{ background: '#ffffff', borderRadius: '1px' }} />
                <div style={{ background: '#93c5fd', borderRadius: '1px' }} />
              </div>
            </div>

            {/* Subtitle */}
            <div style={{ fontSize: '7.5px', color: '#64748b', textAlign: 'center', fontWeight: 600 }}>
              (Power BI / Tableau / Etc.)
            </div>
          </div>
        </div>

        {/* ARROW 5 -> 6 */}
        <div style={{ flex: '0 0 20px', width: '20px', minWidth: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="20" viewBox="0 0 24 24">
            <line x1="2" y1="12" x2="18" y2="12" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3" style={{ animation: 'dashMove 1s linear infinite' }} />
            <polyline points="13 7 19 12 13 17" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="12" r="3" fill="#a4262c">
              <animate attributeName="cx" values="2;18" dur="1.7s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* ========================================================
            PANEL 6: 6. BUSINESS OUTCOME (INSIGHTS & ACTIONS)
           ======================================================== */}
        <div
          className="anim-panel"
          onClick={() => handlePanelClick('outcome')}
          style={{
            flex: '0 0 160px',
            width: '160px',
            minWidth: '160px',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '12px',
            border: activePanelId === 'outcome' ? '2.5px solid #a4262c' : '1px solid rgba(164, 38, 44, 0.45)',
            boxShadow: activePanelId === 'outcome' ? '0 6px 20px rgba(164, 38, 44, 0.2)' : '0 1px 4px rgba(0,0,0,0.03)',
            opacity: activePanelId && activePanelId !== 'outcome' ? 0.5 : 1,
            cursor: 'pointer',
            overflow: 'hidden',
            background: '#ffffff',
            boxSizing: 'border-box',
            animation: 'introSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0.36s'
          }}
        >
          {/* Header 6 */}
          <div
            style={{
              height: '44px',
              background: '#a4262c',
              color: '#ffffff',
              padding: '4px 3px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1px',
              boxSizing: 'border-box',
              flexShrink: 0
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" fill="#ffffff" fillOpacity="0.25" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.2px', lineHeight: 1.1 }}>
              6. BUSINESS OUTCOME
            </div>
            <div style={{ fontSize: '7.5px', fontWeight: 600, opacity: 0.95 }}>
              (INSIGHTS & ACTIONS)
            </div>
          </div>

          {/* Body 6: 3 Uniform Height Cards */}
          <div
            style={{
              padding: '6px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              flex: 1,
              justifyContent: 'space-between',
              boxSizing: 'border-box'
            }}
          >
            {/* Card 1: Data-Driven Decisions */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "Enables real-time and historical shift analytics, eliminating operational guesswork.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#fef9e8',
                border: '1px solid #f9e39a',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <rect x="4" y="16" width="4" height="8" fill="#f59e0b" rx="1" />
                  <rect x="10" y="12" width="4" height="12" fill="#f59e0b" rx="1" />
                  <rect x="16" y="8" width="4" height="16" fill="#f59e0b" rx="1" />
                  <rect x="22" y="4" width="4" height="20" fill="#d97706" rx="1" />
                  <polyline points="4 10 12 4 20 8 26 2" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="20 2 26 2 26 8" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Data-Driven Decisions
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (Real-time / Historical)
                </div>
              </div>
            </div>

            {/* Card 2: Alerts & Early Actions */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "Automated threshold alerts on bearing vibration, temperature, and buffer levels.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#fef9e8',
                border: '1px solid #f9e39a',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div className="bell-shake" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Alerts & Early Actions
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (Threshold / Anomaly)
                </div>
              </div>
            </div>

            {/* Card 3: Operational & Business Impact */}
            <div
              className="anim-card"
              onMouseEnter={(e) => handleCardMouseEnter(e, "96.8% OTIF sustained, 18% scrap reduction, ₹14.8L tariff saved, zero LTI streak.")}
              onMouseLeave={handleCardMouseLeave}
              style={{
                height: '44px',
                background: '#edf5fd',
                border: '1px solid #c7defa',
                borderRadius: '8px',
                padding: '0 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: '24px', height: '24px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <circle className="target-ring" cx="14" cy="14" r="12" stroke="#0284c7" strokeWidth="1.5" />
                  <circle cx="14" cy="14" r="8" stroke="#0369a1" strokeWidth="2" fill="rgba(2, 132, 199, 0.15)" />
                  <circle cx="14" cy="14" r="4" fill="#0284c7" />
                  <line x1="14" y1="2" x2="14" y2="6" stroke="#0284c7" strokeWidth="1.5" />
                  <line x1="14" y1="22" x2="14" y2="26" stroke="#0284c7" strokeWidth="1.5" />
                  <line x1="2" y1="14" x2="6" y2="14" stroke="#0284c7" strokeWidth="1.5" />
                  <line x1="22" y1="14" x2="26" y2="14" stroke="#0284c7" strokeWidth="1.5" />
                </svg>
              </div>

              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f1f4b', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Operational Impact
                </div>
                <div style={{ fontSize: '8px', color: '#475569', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  (Efficiency / Quality / Yield)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING HOVER TOOLTIP */}
      {hoveredCard && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translate(-50%, -100%)',
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#ffffff',
            padding: '4px 8px',
            borderRadius: '5px',
            fontSize: '9.5px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(4px)'
          }}
        >
          {tooltipPos.text}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              borderWidth: '4px',
              borderStyle: 'solid',
              borderColor: 'rgba(15, 23, 42, 0.95) transparent transparent transparent'
            }}
          />
        </div>
      )}
    </div>
  );
}
