import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sectors } from '../../data/sectors';
import { getAgentMetrics, AGENT_METRICS_DB } from '../../data/agentMetrics.mock';
import CenterCircle from './CenterCircle';
import BlueprintCanvas from './BlueprintCanvas';
import SectorNode from './SectorNode';
import AgentNode, { getAgentPositions } from './AgentNode';
import AgentDetailCard from './AgentDetailCard';
import RightVideoPane from './RightVideoPane';
import SectorTree from './SectorTree';
import SectorInlineTree from './SectorInlineTree';
import TeammateLightform from './TeammateLightform';
import '../../styles/hub.css';

/**
 * Manufacturing 360° Hub
 * Features:
 * 1. Perfectly centered Left Blueprint layout (Origin node + arc of sectors).
 * 2. Automatic 5-second rotation between sectors.
 * 3. Zero dotted lines on circles (clean solid & glowing rings).
 * 4. Proper spacing & collision-free layout for agent nodes.
 * 5. Dedicated looping video zone on the right with frosted glass card.
 */
export default function Hub({
  onLaunchApp,
  onNavigateToArchitecture,
  onNavigateToAgents
} = {}) {
  // State Machine: 'HOME' | 'SECTOR_VIEW' | 'AGENT_SELECTED'
  const [viewState, setViewState] = useState('HOME');
  const [activeSectorId, setActiveSectorId] = useState(null);
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [agentMetrics, setAgentMetrics] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Teammate Agent URLs (loaded from backend .env + customizable via localStorage)
  const [customUrls, setCustomUrls] = useState(() => {
    try {
      const saved = localStorage.getItem('teammate_agent_urls');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Fetch live agent URLs from backend .env API on mount
  useEffect(() => {
    let isCancelled = false;
    fetch('/api/agents/urls')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isCancelled && data && data.urls) {
          setCustomUrls((prev) => ({
            ...data.urls,
            ...prev
          }));
        }
      })
      .catch(() => {
        // Fallbacks already in sectors.js
      });
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleSaveTeammateUrl = useCallback((agentId, url) => {
    setCustomUrls((prev) => {
      const next = { ...prev, [agentId]: url };
      try {
        localStorage.setItem('teammate_agent_urls', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save to localStorage:', err);
      }
      return next;
    });
  }, []);

  const handleRemoveTeammateUrl = useCallback((agentId) => {
    setCustomUrls((prev) => {
      const next = { ...prev };
      delete next[agentId];
      try {
        localStorage.setItem('teammate_agent_urls', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to remove from localStorage:', err);
      }
      return next;
    });
  }, []);

  // Merge custom URLs into sectors data seamlessly
  const mergedSectors = useMemo(() => {
    return sectors.map((sec) => ({
      ...sec,
      agents: sec.agents.map((ag) => ({
        ...ag,
        appUrl: customUrls[ag.id] || customUrls[ag.name] || ag.appUrl || null
      }))
    }));
  }, [customUrls]);

  // Sector ordering along the crescent arc:
  // 1. Supply Chain, 2. Production, 3. Quality, 4. Maintenance, 5. Finance, 6. Safety
  const orderedSectors = useMemo(() => {
    const order = [
      'supply-chain-customers',
      'production-planning',
      'quality-engineering',
      'maintenance-utilities',
      'finance-leadership',
      'people-safety'
    ];
    return order
      .map((id) => mergedSectors.find((s) => s.id === id))
      .filter(Boolean);
  }, [mergedSectors]);

  // Active Sector Object
  const activeSector = useMemo(() => {
    if (!activeSectorId) return null;
    return mergedSectors.find((s) => s.id === activeSectorId) || null;
  }, [activeSectorId, mergedSectors]);

  // Active Agent Object
  const activeAgent = useMemo(() => {
    if (!activeSector || !activeAgentId) return null;
    return activeSector.agents.find((a) => a.id === activeAgentId) || null;
  }, [activeSector, activeAgentId]);

  // Active Agent Metrics
  const activeMetrics = useMemo(() => {
    if (!activeAgentId) return null;
    return agentMetrics || AGENT_METRICS_DB[activeAgentId] || null;
  }, [activeAgentId, agentMetrics]);

  // Geometry: Shifted right with generous gap between sectors and agents
  const STAGE_WIDTH = 750;
  const STAGE_HEIGHT = 570;
  const originPos = useMemo(() => ({ x: 105, y: 285 }), []);
  const arcRadius = 315;
  const arcAngles = useMemo(() => [-44, -26.4, -8.8, 8.8, 26.4, 44], []);

  // Sector Coordinates along the crescent arc
  const sectorPositions = useMemo(() => {
    return orderedSectors.map((sec, idx) => {
      const deg = arcAngles[idx] || 0;
      const rad = (deg * Math.PI) / 180;
      return {
        id: sec.id,
        x: Math.round(originPos.x + arcRadius * Math.cos(rad)),
        y: Math.round(originPos.y + arcRadius * Math.sin(rad))
      };
    });
  }, [orderedSectors, arcAngles, originPos, arcRadius]);

  // Active sector position
  const activeSectorPos = useMemo(() => {
    if (!activeSectorId) return null;
    return sectorPositions.find((s) => s.id === activeSectorId) || null;
  }, [sectorPositions, activeSectorId]);

  // Agent Coordinates fanning out to the right from the active sector circle (Radius = 138, uniform gaps)
  const agentPositions = useMemo(() => {
    if (!activeSector || !activeSectorPos) return [];
    return getAgentPositions(activeSector.agents.length, activeSectorPos, 138, activeSector.id);
  }, [activeSector, activeSectorPos]);

  // Telemetry fetch for active agent
  useEffect(() => {
    let isCancelled = false;
    if (activeAgentId) {
      getAgentMetrics(activeAgentId).then((res) => {
        if (!isCancelled && res.success) {
          setAgentMetrics(res.data);
        }
      });
    } else {
      setAgentMetrics(null);
    }
    return () => {
      isCancelled = true;
    };
  }, [activeAgentId]);

  // --- State Transitions ---

  // Click Sector (Toggle: opens agents if closed, closes agents if already open)
  const handleSelectSector = useCallback(
    (sectorId) => {
      // If this sector is already open with agents visible, clicking it again closes all agents!
      if (
        activeSectorId === sectorId &&
        (viewState === 'SECTOR_VIEW' || viewState === 'AGENT_SELECTED')
      ) {
        setActiveAgentId(null);
        setActiveSectorId(null);
        setViewState('HOME');
      } else {
        // Open agents for this sector
        setActiveSectorId(sectorId);
        setActiveAgentId(null);
        setViewState('SECTOR_VIEW');
      }
    },
    [activeSectorId, viewState]
  );

  // Click Agent
  const handleSelectAgent = useCallback((agentId) => {
    setActiveAgentId(agentId);
    setViewState('AGENT_SELECTED');
  }, []);

  // Close Card
  const handleCloseCard = useCallback(() => {
    setActiveAgentId(null);
    setViewState('SECTOR_VIEW');
  }, []);

  // Click Origin Node -> Return Home
  const handleOriginClick = useCallback(() => {
    setActiveAgentId(null);
    setActiveSectorId(null);
    setAgentMetrics(null);
    setViewState('HOME');
  }, []);

  return (
    <div className="hub-full-viewport-layout">
      {/* ================================================================= */}
      {/* LEFT ZONE (~55%): Centered Blueprint Network                       */}
      {/* ================================================================= */}
      <div
        className="hub-left-interactive-zone"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="hub-blueprint-stage-centered">
          <div
            className="hub-stage-canvas-wrapper"
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            {/* Blueprint Canvas: Connecting Rays, Traveling Pulses & Constellation */}
            <BlueprintCanvas
              origin={originPos}
              sectorPositions={sectorPositions}
              activeSectorId={activeSectorId}
              agentPositions={[]}
              viewState={viewState}
              accentColor={activeSector?.accentColor || '#8b5cf6'}
              width={STAGE_WIDTH}
              height={STAGE_HEIGHT}
            />

            {/* Origin Node on the Left (Manufacturing 360 Core) */}
            <CenterCircle
              position={originPos}
              viewState={viewState}
              onClick={handleOriginClick}
            />

            {/* Arc of 6 Sector Circles (ALL 6 ALWAYS SHOWN ON HOME PAGE) */}
            {orderedSectors.map((sector, idx) => {
              const pos = sectorPositions[idx];
              const isSelected = sector.id === activeSectorId;
              return (
                <SectorNode
                  key={sector.id}
                  sector={sector}
                  position={pos}
                  index={idx}
                  isSelected={isSelected}
                  onClick={handleSelectSector}
                />
              );
            })}

            {/* In-Place Tree Structure for Clicked Sector (Image 2 format) */}
            <AnimatePresence>
              {activeSectorId && activeSector && activeSectorPos && (
                <SectorInlineTree
                  key={`inline-tree-${activeSectorId}`}
                  sector={activeSector}
                  sectorPos={activeSectorPos}
                  activeAgentId={activeAgentId}
                  onSelectAgent={handleSelectAgent}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Ambient Bottom Status Strip */}
        {/* <div className="hub-bottom-status-strip">
          <div className="status-indicator-pill">
            <span className="live-pulse-dot" />
            <span className="status-title">
              {viewState === 'HOME' && `Auto-Cycling • ${activeSector.name}`}
              {viewState === 'SECTOR_VIEW' && `${activeSector.name} • Select an agent to inspect telemetry`}
              {viewState === 'AGENT_SELECTED' && `${activeAgent?.name} • Live Telemetry Active`}
            </span>
          </div>
          {viewState !== 'HOME' && (
            <button className="hub-return-home-btn" onClick={handleOriginClick}>
              Overview (Esc)
            </button>
          )}
        </div> */}
      </div>

      {/* ================================================================= */}
      {/* RIGHT ZONE (~45%): Dedicated Looping Video & Frosted Glass Card   */}
      {/* ================================================================= */}
      <div className="hub-right-video-zone">
        <RightVideoPane />

        {/* Pure Color-Free Frosted Glass Detail Card */}
        <div className="hub-card-dock-overlay">
          <AnimatePresence mode="wait">
            {viewState === 'AGENT_SELECTED' && activeAgent && activeMetrics && (
              <AgentDetailCard
                key={activeAgent.id}
                agent={activeAgent}
                metrics={activeMetrics}
                sector={activeSector}
                onClose={handleCloseCard}
                onLaunchApp={onLaunchApp}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Top-Right Corner: Teammate Agent URL Registration Form */}
      <TeammateLightform
        sectors={mergedSectors}
        customUrls={customUrls}
        onSaveUrl={handleSaveTeammateUrl}
        onRemoveUrl={handleRemoveTeammateUrl}
        onSelectAgent={(agentId, sectorId) => {
          setActiveSectorId(sectorId);
          setActiveAgentId(agentId);
          setViewState('AGENT_SELECTED');
        }}
        onLaunchApp={onLaunchApp}
      />
    </div>
  );
}
