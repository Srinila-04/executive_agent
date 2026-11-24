import React, { useState, useMemo, useRef } from 'react';
import {
  Wrench,
  Factory,
  ShieldCheck,
  Truck,
  Users,
  DollarSign,
  Activity,
  Zap,
  Sliders,
  Calendar,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Layers,
  FileText,
  AlertTriangle,
  ShieldAlert,
  Boxes,
  Clock,
  BarChart3,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Check,
  Cog,
  LayoutDashboard,
  LineChart,
  Gauge,
  ScanLine,
  Eye,
  Radio,
  Flame,
  Droplets,
  Workflow,
  RefreshCw,
  Orbit,
  PieChart,
  Leaf,
  PowerOff,
  Wind,
  Thermometer,
  Coins,
  Timer,
  HardHat,
  ScanEye,
  PackageX,
  PackageSearch
} from 'lucide-react';
import {
  RealisticMachineSymbol,
  RealisticSupplyChainSymbol,
  RealisticQualitySymbol,
  RealisticProductionSymbol,
  RealisticEnergySymbol,
  RealisticSafetySymbol,
  RealisticFinanceSymbol,
  RealisticDashboardSymbol
} from '../components/RealisticSymbols';
import MissionAnimatedVisual from '../components/MissionAnimatedVisual';
import AnimatedTreeConnector from '../components/AnimatedTreeConnector';
import { SECTORS, PROBLEMS_SOLVED } from '../data/systemArchitectureData';
import { COLOR_TIERS, getProblemsForAgent } from '../data/agentProblemsData';
import '../styles/systemArchitecture.css';
import '../styles/missionVisuals.css';

// Map icon names to Lucide icon components
const ICON_MAP = {
  Wrench,
  Factory,
  ShieldCheck,
  Truck,
  Users,
  DollarSign,
  Activity,
  Zap,
  Sliders,
  Calendar,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Layers,
  FileText,
  AlertTriangle,
  ShieldAlert,
  Boxes,
  Clock,
  BarChart3,
  Cog,
  LayoutDashboard,
  LineChart,
  Gauge,
  ScanLine,
  Eye,
  Radio,
  Flame,
  Droplets,
  Workflow,
  RefreshCw,
  Orbit,
  PieChart,
  Leaf,
  PowerOff,
  Wind,
  Thermometer,
  Coins,
  Timer,
  HardHat,
  ScanEye,
  PackageX,
  PackageSearch
};

// Continuous animated symbol component - supports both realistic mechanical widgets & clean animated symbols
function AnimatedSymbol({ name, size = 15, className = '', color, realistic = false, type = '', showEqualizer = false }) {
  // 1. High-fidelity realistic animated illustrations
  if (realistic || type) {
    const t = (type || name || '').toLowerCase();
    if (t.includes('maint') || t.includes('machine') || t.includes('pred_maint') || name === 'Cog') {
      return <RealisticMachineSymbol size={size + 10} color={color} />;
    }
    if (t.includes('supply') || t.includes('delivery') || t.includes('freight') || t.includes('truck') || name === 'Truck') {
      return <RealisticSupplyChainSymbol size={size + 12} color={color} />;
    }
    if (t.includes('quality') || t.includes('inspect') || t.includes('scrap') || name === 'ScanLine' || name === 'Eye') {
      return <RealisticQualitySymbol size={size + 10} color={color} />;
    }
    if (t.includes('energy') || t.includes('util') || t.includes('power') || name === 'Zap' || name === 'Gauge') {
      return <RealisticEnergySymbol size={size + 10} color={color} />;
    }
    if (t.includes('prod') || t.includes('oper') || name === 'Factory') {
      return <RealisticProductionSymbol size={size + 10} color={color} />;
    }
    if (t.includes('safe') || t.includes('hazard') || name === 'ShieldAlert') {
      return <RealisticSafetySymbol size={size + 10} color={color} />;
    }
    if (t.includes('fin') || t.includes('cost') || t.includes('margin') || name === 'DollarSign' || name === 'TrendingUp') {
      return <RealisticFinanceSymbol size={size + 10} color={color} />;
    }
    if (name === 'LayoutDashboard' || name === 'BarChart3' || t.includes('dash') || t.includes('monitor')) {
      return <RealisticDashboardSymbol size={size + 10} color={color} />;
    }
  }

  // 2. Standard animated symbols with continuous keyframes
  const Component = ICON_MAP[name] || Activity;

  let animClass = 'anim-pulse-subtle';
  if (name === 'Cog') animClass = 'anim-spin-smooth';
  else if (name === 'LayoutDashboard' || name === 'BarChart3' || name === 'LineChart' || name === 'PieChart') animClass = 'anim-chart-glow';
  else if (name === 'Gauge') animClass = 'anim-gauge-wiggle';
  else if (name === 'Zap') animClass = 'anim-zap-shimmer';
  else if (name === 'ScanLine' || name === 'Eye') animClass = 'anim-scanner';
  else if (name === 'Truck') animClass = 'anim-truck-rumble';
  else if (name === 'TrendingUp' || name === 'DollarSign') animClass = 'anim-roi-float';
  else if (name === 'AlertTriangle' || name === 'ShieldAlert') animClass = 'anim-beacon';
  else if (name === 'Activity' || name === 'Radio') animClass = 'anim-heartbeat';
  else if (name === 'Workflow' || name === 'RefreshCw' || name === 'Orbit') animClass = 'anim-orbit-spin';
  else if (name === 'Sparkles') animClass = 'anim-sparkle-twinkle';
  else if (name === 'Clock') animClass = 'anim-clock-tick';
  else if (name === 'CheckCircle2' || name === 'ShieldCheck') animClass = 'anim-check-gleam';

  return (
    <span className={`symbol-anim-wrapper ${animClass} ${className}`}>
      <Component size={size} color={color} />
      {showEqualizer && (
        <span className="live-equalizer-bars" style={{ color: color || '#0284c7' }}>
          <i />
          <i />
          <i />
        </span>
      )}
    </span>
  );
}

// Exactly ONE animated glowing arrow gliding smoothly forward between pillars
function SingleAnimatedArrow() {
  return (
    <div className="single-animated-arrow" title="Operational Flow">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M1 6H9M9 6L5.5 2.5M9 6L5.5 9.5"
          stroke="url(#singleArrowGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="singleArrowGrad" x1="1" y1="6" x2="10" y2="6" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function SystemArchitecture({ onNavigateToAgents }) {
  // Navigation & Active Item States
  // Default to 'maintenance' sector so user immediately sees the 3-system example requested
  const [selectedSectorId, setSelectedSectorId] = useState('maintenance');
  const [selectedAgentId, setSelectedAgentId] = useState(4); // Predictive Machine Maintenance
  const [selectedProblemId, setSelectedProblemId] = useState('problem_downtime');
  const [selectedProblemNum, setSelectedProblemNum] = useState('01');
  
  // Dynamic refs for animated tree connection between Column 1 (Sectors) and Column 2 (Agents)
  const sectorRefs = useRef({});
  const agentRefs = useRef({});
  const treeChannelRef = useRef(null);

  // Explaining Source: 'architecture' (when clicking Pillar 1-5) or 'problem' (when clicking Problems Solved)
  const [activeExplainingSource, setActiveExplainingSource] = useState('architecture');

  // Currently Selected Sector Object
  const currentSector = useMemo(() => {
    return SECTORS.find((s) => s.id === selectedSectorId) || SECTORS[0];
  }, [selectedSectorId]);

  // Currently Selected Agent Object
  const currentAgent = useMemo(() => {
    const inSector = currentSector.agents.find((a) => a.id === selectedAgentId);
    if (inSector) return inSector;
    return currentSector.agents[0] || SECTORS[0].agents[0];
  }, [currentSector, selectedAgentId]);

  // 5 Core Manufacturing Problems Solved by the Selected Agent (Image 2 style)
  const currentAgentProblems = useMemo(() => {
    return getProblemsForAgent(currentAgent);
  }, [currentAgent]);

  // Currently Selected Problem Object (Agent's 5 Core Problems)
  const currentProblem = useMemo(() => {
    const found = currentAgentProblems.find((p) => p.num === selectedProblemNum);
    return found || currentAgentProblems[0];
  }, [currentAgentProblems, selectedProblemNum]);

  // Handlers for interactive clicks
  const handleSelectSector = (sector) => {
    setSelectedSectorId(sector.id);
    if (sector.agents && sector.agents.length > 0) {
      setSelectedAgentId(sector.agents[0].id);
    }
    setActiveExplainingSource('architecture');
  };

  const handleSelectAgent = (agent) => {
    setSelectedAgentId(agent.id);
    setSelectedProblemNum('01');
    setActiveExplainingSource('architecture');
  };

  const handleSelectProblem = (problem) => {
    setSelectedProblemNum(problem.num);
    setActiveExplainingSource('problem');
    // Ensure Part 3 is in view and smoothly focused
    const hubElement = document.querySelector('.part-three-explanation-hub');
    if (hubElement) {
      hubElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="sys-arch-viewport">
      {/* 1. UPPER DECK: EQUAL 50% / 50% SPLIT (Left: Architecture | Right: Problems Solved) */}
      <div className="upper-deck-container">
        
        {/* ========================================================================= */}
        {/* LEFT HALF (50% WIDTH): 5-COLUMN SYSTEM ARCHITECTURE FLOW                  */}
        {/* ========================================================================= */}
        <section className="architecture-deck-half">
          
          {/* Pillar 1: Sectors (Static List of all 6 factory sectors) */}
          <div className="pillar-container pillar-sectors">
            <div className="pillar-solid-header" style={{ backgroundColor: '#6f3dba' }}>
              <div className="pillar-header-icon-wrap">
                <AnimatedSymbol name="Factory" size={15} color="#ffffff" />
              </div>
              <div className="pillar-header-title-wrap">
                <span className="pillar-step-tag">1. SECTORS</span>
                <span className="pillar-sub-tag">6 Factory Domains</span>
              </div>
            </div>

            <div className="pillar-card-body">
              {SECTORS.map((sector) => {
                const isSelected = sector.id === selectedSectorId;
                return (
                  <div
                    key={sector.id}
                    ref={(el) => (sectorRefs.current[sector.id] = el)}
                    className={`pillar-row-card sector-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectSector(sector)}
                    style={{ '--card-brand': sector.color }}
                  >
                    <div
                      className="card-left-icon-box"
                      style={{
                        backgroundColor: isSelected ? sector.color : 'rgba(111, 61, 186, 0.08)',
                        color: isSelected ? '#ffffff' : sector.color
                      }}
                    >
                      <AnimatedSymbol name={sector.icon} size={15} color={isSelected ? '#ffffff' : sector.color} realistic={true} type={sector.id} />
                    </div>
                    <div className="card-text-col">
                      <span className="card-primary-title">{sector.shortName}</span>
                      <span className="card-secondary-badge">{sector.agentsCount} Systems</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Animated Branching Tree Line connecting selected Sector to active Systems (Image 3) */}
          <AnimatedTreeConnector
            selectedSectorId={selectedSectorId}
            agents={currentSector.agents}
            sectorRefs={sectorRefs}
            agentRefs={agentRefs}
            channelRef={treeChannelRef}
            color={currentSector.color || '#4f46e5'}
          />

          {/* Pillar 2: Dynamic Systems List for Current Sector */}
          <div className="pillar-container pillar-agents">
            <div className="pillar-solid-header" style={{ backgroundColor: '#1d4ed8' }}>
              <div className="pillar-header-icon-wrap">
                {/* Continuous rotating machine/system gear */}
                <AnimatedSymbol name="Cog" size={15} color="#ffffff" realistic={true} type="machine" />
              </div>
              <div className="pillar-header-title-wrap">
                <span className="pillar-step-tag">2. SYSTEMS</span>
                <span className="pillar-sub-tag">Active Systems</span>
              </div>
            </div>

            <div className="pillar-card-body agents-body-centered">
              {currentSector.agents.map((agent) => {
                const isSelected = agent.id === currentAgent.id;
                return (
                  <div
                    key={agent.id}
                    ref={(el) => (agentRefs.current[agent.id] = el)}
                    className={`pillar-row-card agent-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectAgent(agent)}
                    style={{ '--card-brand': '#1d4ed8' }}
                  >
                    <div
                      className="card-left-icon-box"
                      style={{
                        backgroundColor: isSelected ? '#1d4ed8' : 'rgba(29, 78, 216, 0.08)',
                        color: isSelected ? '#ffffff' : '#1d4ed8'
                      }}
                    >
                      <AnimatedSymbol name={agent.icon} size={15} color={isSelected ? '#ffffff' : '#1d4ed8'} realistic={true} type={agent.code || agent.name} />
                    </div>
                    <div className="card-text-col">
                      <span className="card-primary-title wrap-title">{agent.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Exactly ONE animated glowing arrow gliding forward */}
          <SingleAnimatedArrow />

          {/* Pillar 3: System Mission (What It Does - Visual Sub-Cards) */}
          <div className="pillar-container pillar-mission">
            <div className="pillar-solid-header" style={{ backgroundColor: '#4338ca' }}>
              <div className="pillar-header-icon-wrap">
                <AnimatedSymbol name="Sparkles" size={15} color="#ffffff" />
              </div>
              <div className="pillar-header-title-wrap">
                <span className="pillar-step-tag">3. MISSION</span>
                <span className="pillar-sub-tag">What It Does</span>
              </div>
            </div>

            <div className="pillar-card-body">
              <div className="mission-agent-title-chip">
                <AnimatedSymbol name={currentAgent.icon} size={13} color="#4338ca" realistic={true} type={currentAgent.code || currentAgent.name} />
                <span className="chip-name-text">{currentAgent.name}</span>
              </div>

              {currentAgent.missionCards.map((card, idx) => (
                <div
                  key={idx}
                  className="visual-sub-card mission-visual-card"
                  style={{ '--card-sub-bg': card.bg, '--card-sub-color': card.color }}
                >
                  <div className="mission-pic-stage">
                    <MissionAnimatedVisual
                      agentCode={currentAgent.code}
                      cardIndex={idx}
                      title={card.title}
                      color={card.color}
                    />
                  </div>
                  <div className="mission-card-caption-bar">
                    <span className="sub-card-title">{card.title}</span>
                  </div>
                </div>
              ))}

              <div className="mission-footer-pill">
                <span>⚡ Real-Time Autonomous Engine</span>
              </div>
            </div>
          </div>

          {/* Exactly ONE animated glowing arrow gliding forward */}
          <SingleAnimatedArrow />

          {/* Pillar 4: Reports & Metrics (Live Performance Signals) */}
          <div className="pillar-container pillar-reports">
            <div className="pillar-solid-header" style={{ backgroundColor: '#0284c7' }}>
              <div className="pillar-header-icon-wrap">
                {/* Live Telemetry Dashboard */}
                <AnimatedSymbol name="LayoutDashboard" size={15} color="#ffffff" realistic={true} type="dash" />
              </div>
              <div className="pillar-header-title-wrap">
                <span className="pillar-step-tag">4. REPORTS</span>
                <span className="pillar-sub-tag">Live Metrics</span>
              </div>
            </div>

            <div className="pillar-card-body">
              <div className="reports-monitor-banner">
                <AnimatedSymbol name="LayoutDashboard" size={13} color="#0284c7" realistic={true} type="dash" />
                <span>Live Signals Deck</span>
              </div>

              <div className="reports-cards-grid">
                {currentAgent.reportsList.map((rep, idx) => (
                  <div key={idx} className="metric-kpi-sub-card">
                    <div className="kpi-card-header">
                      <AnimatedSymbol
                        name={rep.icon}
                        size={13}
                        color={rep.color}
                        showEqualizer={rep.icon === 'BarChart3' || rep.icon === 'LayoutDashboard'}
                      />
                      <span className="kpi-badge">{rep.badge}</span>
                    </div>
                    <span className="kpi-val-text">{rep.val}</span>
                    <span className="kpi-label-text">{rep.title}</span>
                  </div>
                ))}
              </div>

              <div className="telemetry-live-strip">
                <span className="live-dot-green"></span>
                <span>Continuous 500ms Edge Stream</span>
              </div>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* RIGHT HALF (50% WIDTH): PROBLEMS SOLVED BY THE AGENT (Image 2 Format)      */}
        {/* ========================================================================= */}
        <aside className="problems-deck-half image2-style-deck">
          <div className="problems-deck-clean-header">
            <div className="header-left-title-group">
              <div className="header-alert-icon-box">
                <AnimatedSymbol name="AlertTriangle" size={16} color="#dc2626" />
              </div>
              <h3 className="deck-clean-title">Problems Solved by the Agent</h3>
            </div>
            <span className="core-problems-badge">5 CORE PROBLEMS</span>
          </div>

          <div className="agent-problems-pill-list">
            {currentAgentProblems.map((prob, idx) => {
              const tier = COLOR_TIERS[idx % COLOR_TIERS.length];
              const isSelected = activeExplainingSource === 'problem' && selectedProblemNum === prob.num;
              return (
                <div
                  key={idx}
                  className={`agent-problem-pill-row ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectProblem(prob)}
                  style={{
                    '--prob-pill-bg': tier.bg,
                    '--prob-pill-border': tier.borderColor,
                    '--prob-pill-color': tier.color,
                    '--prob-dark-bg': tier.darkBg,
                    '--prob-dark-border': tier.darkBorder,
                    '--prob-dark-text': tier.darkText
                  }}
                  title={prob.title}
                >
                  <span className="prob-pill-num">{prob.num}</span>
                  <span className="prob-pill-text">{prob.title}</span>
                  <div className="prob-pill-icon-box">
                    <AnimatedSymbol name={prob.icon} size={17} color="currentColor" />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

      </div>

      {/* 2. LOWER SECTION: DYNAMIC EXPLANATION HUB (100% Full-Width / Zero Scroll) */}
      <section className="part-three-explanation-hub">
        <div className="hub-top-control-bar">
          <div className="hub-meta-left">
            <span className="hub-title-text">
              {activeExplainingSource === 'architecture'
                ? `System Explanation: ${currentAgent.name} (${currentSector.name})`
                : `Factory Challenge Breakdown: ${currentProblem.title}`}
            </span>
          </div>

          <div className="hub-context-toggles">
            <button
              className={`hub-toggle-btn ${activeExplainingSource === 'architecture' ? 'active' : ''}`}
              onClick={() => setActiveExplainingSource('architecture')}
            >
              <AnimatedSymbol name="Cog" size={13} />
              <span>System Detail: {currentAgent.name}</span>
            </button>
            <button
              className={`hub-toggle-btn ${activeExplainingSource === 'problem' ? 'active' : ''}`}
              onClick={() => setActiveExplainingSource('problem')}
            >
              <AnimatedSymbol name="AlertTriangle" size={13} />
              <span>Problem Solved ({currentProblem.outcomeMetric})</span>
            </button>
          </div>
        </div>

        {/* 4-Card Horizontal Visual Deck */}
        <div className="hub-cards-row">
          {activeExplainingSource === 'architecture' ? (
            /* CASE 1: ARCHITECTURE / SYSTEM EXPLANATION (4 Horizontal Cards) */
            <>
              {/* Card 1: Operational Mission */}
              <div className="hub-card hub-mission-card">
                <div className="hub-card-header">
                  <div className="hub-header-icon" style={{ backgroundColor: 'rgba(111, 61, 186, 0.1)', color: '#6f3dba' }}>
                    <AnimatedSymbol name={currentAgent.icon} size={15} />
                  </div>
                  <span className="hub-header-title">Operational Mission</span>
                </div>
                <p className="hub-card-desc">{currentAgent.detailedExplanation.summary}</p>
                <div className="hub-card-sub-pills">
                  <span className="hub-sub-pill">✓ 24/7 Continuous Edge Ingestion</span>
                  <span className="hub-sub-pill">✓ Autonomous Multi-Plant Action</span>
                </div>
                <div className="hub-chip-footer">
                  <span className="hub-status-chip">● {currentAgent.detailedExplanation.liveStatus}</span>
                </div>
              </div>

              {/* Card 2: 3-Step Decision Flow */}
              <div className="hub-card hub-steps-card">
                <div className="hub-card-header">
                  <div className="hub-header-icon" style={{ backgroundColor: 'rgba(29, 78, 216, 0.1)', color: '#1d4ed8' }}>
                    <AnimatedSymbol name="Workflow" size={15} />
                  </div>
                  <span className="hub-header-title">How This System Works (3-Step Flow)</span>
                </div>
                <div className="hub-steps-flow-horizontal">
                  {currentAgent.detailedExplanation.howItWorks.map((step, idx) => (
                    <div key={idx} className="hub-step-item">
                      <div className="hub-step-badge">{idx + 1}</div>
                      <span className="hub-step-text">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Inputs & Outputs */}
              <div className="hub-card hub-io-card">
                <div className="hub-card-header">
                  <div className="hub-header-icon" style={{ backgroundColor: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>
                    <AnimatedSymbol name="Layers" size={15} />
                  </div>
                  <span className="hub-header-title">Monitored Signals & Outputs</span>
                </div>
                <div className="io-stacked-blocks">
                  <div className="io-block">
                    <span className="io-label">Shop Floor Inputs:</span>
                    <span className="io-text">{currentAgent.detailedExplanation.inputsMonitored}</span>
                  </div>
                  <div className="io-block">
                    <span className="io-label">Delivered Outputs:</span>
                    <span className="io-text">{currentAgent.detailedExplanation.outputsProduced}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Delivered ROI / AI-Analyzed Main KPI Engine */}
              <div className="hub-card hub-roi-card main-kpi-hub-card">
                <div className="hub-card-header">
                  <div className="hub-header-icon" style={{ backgroundColor: 'rgba(4, 120, 87, 0.1)', color: '#047857' }}>
                    <AnimatedSymbol name="TrendingUp" size={16} />
                  </div>
                  <span className="hub-header-title">Delivered Business Value</span>
                  <span className="hub-ai-badge">AI Analyzed</span>
                </div>

                {/* Main KPI Cards */}
                <div className="hub-main-kpis-grid">
                  {currentAgent.outcomesList?.map((kpi, idx) => (
                    <div
                      key={idx}
                      className="main-kpi-card-item"
                      style={{ '--kpi-accent': kpi.color, '--kpi-bg': kpi.bg }}
                    >
                      <div className="kpi-item-icon-box" style={{ color: kpi.color, backgroundColor: kpi.bg }}>
                        <AnimatedSymbol name={kpi.icon} size={13} color={kpi.color} />
                      </div>
                      <div className="kpi-item-text-col">
                        <span className="kpi-item-title">{kpi.title}</span>
                        <span className="kpi-item-desc">{kpi.desc}</span>
                      </div>
                      <div className="kpi-item-val-box" style={{ color: kpi.color }}>
                        <span className="kpi-item-val">{kpi.val}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Node Analysis Banner */}
                <div className="hub-ai-analysis-bar">
                  <div className="ai-analysis-label-row">
                    <span className="ai-pulse-dot"></span>
                    <span className="ai-analysis-heading">AI Node Analysis:</span>
                  </div>
                  <p className="ai-analysis-text">{currentAgent.detailedExplanation.businessValue}</p>
                </div>
              </div>
            </>
          ) : (
            /* CASE 2: PROBLEM SOLVED EXPLANATION (4 Horizontal Cards) */
            <>
              {/* Card 1: Factory Problem & Root Cause Message */}
              <div className="hub-card hub-mission-card prob-mode">
                <div className="hub-card-header">
                  <div className="hub-header-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#dc2626' }}>
                    <AnimatedSymbol name="AlertTriangle" size={15} />
                  </div>
                  <span className="hub-header-title">Manufacturing Challenge & Root Cause</span>
                </div>
                <p className="hub-card-desc">{currentProblem.painPointAnalysis}</p>
                <div className="hub-card-sub-pills">
                  <span className="hub-sub-pill red-pill">⚠️ {currentProblem.shortDescription || currentProblem.title}</span>
                </div>
                <div className="hub-chip-footer">
                  <span className="hub-status-chip red-chip">● Priority: {currentProblem.severity}</span>
                  <span className="hub-status-chip" style={{ color: currentProblem.color }}>Category: {currentProblem.category}</span>
                </div>
              </div>

              {/* Card 2: 3-Step Autonomous Resolution Flow */}
              <div className="hub-card hub-steps-card">
                <div className="hub-card-header">
                  <div className="hub-header-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                    <AnimatedSymbol name="CheckCircle2" size={15} />
                  </div>
                  <span className="hub-header-title">Autonomous Resolution (3-Step AI Flow)</span>
                </div>
                <div className="hub-steps-flow-horizontal">
                  {currentProblem.solutionSteps.map((stepItem, idx) => (
                    <div key={idx} className="hub-step-item prob-step">
                      <div className="hub-step-badge green-badge">{stepItem.step}</div>
                      <div className="hub-step-content-col">
                        <span className="hub-step-strong-title">{stepItem.title}</span>
                        <span className="hub-step-text">{stepItem.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Resolving Systems (AI Agents at Work) */}
              <div className="hub-card hub-io-card">
                <div className="hub-card-header">
                  <div className="hub-header-icon" style={{ backgroundColor: 'rgba(111, 61, 186, 0.1)', color: '#6f3dba' }}>
                    <AnimatedSymbol name="Cog" size={15} />
                  </div>
                  <span className="hub-header-title">Responsible AI Agent</span>
                </div>
                <div className="agents-clickable-hub-list">
                  <div
                    className="hub-agent-link-chip"
                    onClick={() => {
                      setActiveExplainingSource('architecture');
                    }}
                    title={`Click to inspect ${currentAgent.name} in the 4-pillar architecture live`}
                  >
                    <AnimatedSymbol name={currentAgent.icon} size={13} color="#6f3dba" />
                    <span className="hub-agent-name-bold">{currentAgent.name}</span>
                    <span className="hub-agent-inspect-tag">Inspect ↗</span>
                  </div>
                </div>
                <span className="hub-agent-tip">⚡ Click above to inspect this agent's 4-pillar architecture live.</span>
              </div>

              {/* Card 4: Measured Turnaround & Guaranteed Business Impact */}
              <div className="hub-card hub-roi-card green-roi">
                <div className="hub-card-header">
                  <div className="hub-header-icon" style={{ backgroundColor: 'rgba(4, 120, 87, 0.1)', color: '#047857' }}>
                    <AnimatedSymbol name="TrendingUp" size={15} />
                  </div>
                  <span className="hub-header-title">Delivered Business Value & Impact</span>
                </div>
                <div className="roi-large-val-box">
                  <div className="roi-numbers-row">
                    <span className="roi-val-highlight green-text">{currentProblem.outcomeMetric}</span>
                    <span className="roi-sub-savings">{currentProblem.savings}</span>
                  </div>
                  <p className="roi-turnaround-message">{currentProblem.turnaround || currentProblem.businessTurnaround}</p>
                </div>
                <div className="turnaround-guarantee-badge">
                  <span>✓ 100% Autonomous Resolution Guaranteed</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  );
}
