import React from 'react';
import '../styles/missionVisuals.css';

/**
 * High-fidelity animated picture representations for all 20 agents (60 bespoke visuals)
 * Designed for Pillar 3 (MISSION: What It Does)
 * Single-screen fit with zero text bloat — pure visual animation + respective name
 */

// Helper to generate unique gradient IDs
const uid = (prefix, code, idx) => `${prefix}_${code}_${idx}`.toLowerCase();

export default function MissionAnimatedVisual({ agentCode = 'PRED_MAINT', cardIndex = 0, title = '', color = '#2563eb' }) {
  const code = (agentCode || 'PRED_MAINT').toUpperCase();
  const renderVisual = RENDERERS[code]?.[cardIndex] || FallbackVisual;

  return (
    <div className="mission-svg-canvas">
      {renderVisual({ code, cardIndex, title, color })}
    </div>
  );
}

// ============================================================================
// 1. PREDICTIVE MACHINE MAINTENANCE (PRED_MAINT)
// ============================================================================
function PredMaintVisual0({ color }) {
  // 24/7 Vibration & Heat Sampling: Multi-wave oscilloscope with acoustic sine + heat gradient sweep
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="oscGrid" x1="0" y1="0" x2="160" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(37, 99, 235, 0.05)" />
          <stop offset="1" stopColor="rgba(239, 68, 68, 0.08)" />
        </linearGradient>
        <linearGradient id="heatSweep" x1="0" y1="0" x2="160" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="0.5" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <rect width="160" height="46" rx="4" fill="url(#oscGrid)" />
      {/* Grid lines */}
      <line x1="10" y1="23" x2="150" y2="23" stroke="rgba(37, 99, 235, 0.2)" strokeDasharray="3 3" />
      <line x1="45" y1="6" x2="45" y2="40" stroke="rgba(37, 99, 235, 0.15)" strokeDasharray="2 2" />
      <line x1="80" y1="6" x2="80" y2="40" stroke="rgba(37, 99, 235, 0.15)" strokeDasharray="2 2" />
      <line x1="115" y1="6" x2="115" y2="40" stroke="rgba(37, 99, 235, 0.15)" strokeDasharray="2 2" />

      {/* Acoustic Frequency Wave 1 (Fast blue) */}
      <g className="m-wave-scroll-1">
        <path
          d="M-20 23 Q-10 10, 0 23 T20 23 T40 23 T60 23 T80 23 T100 23 T120 23 T140 23 T160 23 T180 23"
          stroke="#2563eb"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Motor Thermal Wave 2 (Orange/Red Heat harmonic) */}
      <g className="m-wave-scroll-2">
        <path
          d="M-20 23 Q-5 35, 10 23 T30 23 T50 23 T70 23 T90 23 T110 23 T130 23 T150 23 T170 23 T190 23"
          stroke="url(#heatSweep)"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
      </g>

      {/* Sensor Probes with live pulse */}
      <circle cx="45" cy="23" r="3.2" fill="#2563eb" className="m-probe-pulse" />
      <circle cx="115" cy="23" r="3.2" fill="#ef4444" className="m-probe-pulse" style={{ animationDelay: '0.5s' }} />

      {/* Live Badge */}
      <rect x="8" y="5" width="34" height="10" rx="3" fill="#2563eb" opacity="0.15" />
      <text x="25" y="12.5" fill="#2563eb" fontSize="6.5" fontWeight="800" textAnchor="middle">24/7 SAMPLING</text>
    </svg>
  );
}

function PredMaintVisual1() {
  // 14-Day Micro-Wear Warning: Rotating bearing & gear with warning radar sweep
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(202, 138, 4, 0.05)" />
      
      {/* Sonar Expanding Alert Rings */}
      <g transform="translate(80, 23)">
        <circle cx="0" cy="0" r="16" stroke="#ca8a04" strokeWidth="1" fill="none" className="m-sonar-ring-1" />
        <circle cx="0" cy="0" r="16" stroke="#eab308" strokeWidth="0.8" fill="none" className="m-sonar-ring-2" />
        <circle cx="0" cy="0" r="16" stroke="#f59e0b" strokeWidth="0.6" fill="none" className="m-sonar-ring-3" />
      </g>

      {/* Industrial Machine Bearing */}
      <g transform="translate(80, 23)">
        {/* Outer Ring */}
        <circle cx="0" cy="0" r="14" stroke="#ca8a04" strokeWidth="2.2" fill="none" />
        {/* Inner Shaft */}
        <circle cx="0" cy="0" r="6" fill="#ca8a04" />
        <circle cx="0" cy="0" r="3" fill="#ffffff" />
        
        {/* 6 Rotating Ball Bearings */}
        <g className="m-spin-cw-fast">
          <circle cx="0" cy="-10" r="2.2" fill="#eab308" />
          <circle cx="8.6" cy="-5" r="2.2" fill="#eab308" />
          <circle cx="8.6" cy="5" r="2.2" fill="#eab308" />
          <circle cx="0" cy="10" r="2.2" fill="#eab308" />
          <circle cx="-8.6" cy="5" r="2.2" fill="#eab308" />
          <circle cx="-8.6" cy="-5" r="2.2" fill="#eab308" />
        </g>
      </g>

      {/* Rotating Radar Crosshair */}
      <g transform="translate(80, 23)" className="m-radar-sweep">
        <line x1="0" y1="0" x2="16" y2="0" stroke="#ca8a04" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Left / Right Telemetry Limits */}
      <line x1="20" y1="23" x2="52" y2="23" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="108" y1="23" x2="140" y2="23" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2 2" />
      <text x="26" y="16" fill="#ca8a04" fontSize="6.5" fontWeight="800">0.04mm DRIFT</text>
      <text x="112" y="16" fill="#ca8a04" fontSize="6.5" fontWeight="800">14-DAY LEAD</text>
    </svg>
  );
}

function PredMaintVisual2() {
  // Automated Off-Shift Repair: Robotic wrench calibrating machine gear with scheduled calendar sync
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      
      {/* Calendar Card Icon on Left */}
      <g transform="translate(24, 11)">
        <rect x="0" y="0" width="22" height="24" rx="3" fill="#ffffff" stroke="#16a34a" strokeWidth="1.4" />
        <rect x="0" y="0" width="22" height="6" rx="1" fill="#16a34a" />
        <circle cx="5" cy="12" r="1.2" fill="#16a34a" />
        <circle cx="11" cy="12" r="1.2" fill="#16a34a" />
        <circle cx="17" cy="12" r="1.2" fill="#16a34a" />
        <circle cx="5" cy="18" r="1.2" fill="#16a34a" />
        <circle cx="11" cy="18" r="1.2" fill="#16a34a" />
        <path d="M15 18L17 20L21 15" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Sync Flow Arrows */}
      <g transform="translate(56, 23)">
        <path d="M0 0H20M20 0L15 -3M20 0L15 3" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Machine Cog with Rotating teeth */}
      <g transform="translate(100, 23)">
        <g className="m-spin-cw-slow">
          <circle cx="0" cy="0" r="9" fill="none" stroke="#16a34a" strokeWidth="1.8" />
          <rect x="-1.5" y="-12" width="3" height="24" rx="0.8" fill="#16a34a" />
          <rect x="-12" y="-1.5" width="24" height="3" rx="0.8" fill="#16a34a" />
          <circle cx="0" cy="0" r="3.5" fill="#16a34a" />
          <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
        </g>
      </g>

      {/* Robotic Automated Wrench docking */}
      <g className="m-tool-dock">
        <path
          d="M125 12L112 21L114 24L127 15Z"
          fill="#15803d"
        />
        <circle cx="127" cy="14" r="3.5" stroke="#15803d" strokeWidth="1.2" fill="#ffffff" />
      </g>

      <text x="125" y="38" fill="#16a34a" fontSize="6.5" fontWeight="800" textAnchor="middle">AUTO-DISPATCH</text>
    </svg>
  );
}

// ============================================================================
// 2. ENERGY COST & TARIFF OPTIMIZER (ENERGY_MGMT)
// ============================================================================
function EnergyVisual0() {
  // Live Substation Grid Watch: Pylon tower with active electric lightning arcs
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(202, 138, 4, 0.05)" />
      {/* High-voltage Substation Pylon */}
      <g transform="translate(35, 8)">
        <path d="M12 2L6 28H18L12 2Z" stroke="#ca8a04" strokeWidth="1.2" />
        <line x1="2" y1="10" x2="22" y2="10" stroke="#ca8a04" strokeWidth="1.4" />
        <line x1="4" y1="18" x2="20" y2="18" stroke="#ca8a04" strokeWidth="1.4" />
        <line x1="6" y1="28" x2="18" y2="28" stroke="#ca8a04" strokeWidth="1.4" />
        <circle cx="12" cy="2" r="1.5" fill="#ca8a04" />
      </g>

      {/* Electric Spark / Pulse lines across grid */}
      <path
        d="M47 10L65 14L80 9L95 15L115 10L135 14"
        stroke="#ca8a04"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        className="m-spark-flow"
      />
      <circle cx="80" cy="9" r="2.5" fill="#facc15" className="m-probe-pulse" />
      <circle cx="115" cy="10" r="2.5" fill="#facc15" className="m-probe-pulse" style={{ animationDelay: '0.4s' }} />

      <text x="135" y="32" fill="#ca8a04" fontSize="7" fontWeight="800" textAnchor="middle">4.8 MW</text>
      <text x="135" y="40" fill="#a16207" fontSize="5.5" fontWeight="600" textAnchor="middle">GRID ACTIVE</text>
    </svg>
  );
}

function EnergyVisual1() {
  // Off-Peak Load Rescheduling: 24h tariff stepped curve with sliding load block
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(37, 99, 235, 0.05)" />
      {/* Tariff step levels */}
      <path d="M15 32H50V14H95V32H145" stroke="#94a3b8" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
      <text x="72" y="10" fill="#ef4444" fontSize="6" fontWeight="700" textAnchor="middle">PEAK ₹9.50</text>
      <text x="120" y="40" fill="#16a34a" fontSize="6" fontWeight="700" textAnchor="middle">OFF-PEAK ₹4.20</text>

      {/* Sliding Workload Block shifting to off-peak */}
      <g className="m-slide-bar" transform="translate(60, 20)">
        <rect x="0" y="0" width="28" height="12" rx="2" fill="#2563eb" />
        <text x="14" y="8.5" fill="#ffffff" fontSize="6" fontWeight="800" textAnchor="middle">LOAD 1.2MW</text>
      </g>
      <path d="M92 26L102 26M102 26L98 23M102 26L98 29" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function EnergyVisual2() {
  // Demand Surcharge Protection: Dial gauge with limiter ceiling
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(225, 29, 72, 0.05)" />
      {/* Surcharge Boundary Line */}
      <line x1="20" y1="12" x2="140" y2="12" stroke="#e11d48" strokeWidth="1.2" strokeDasharray="3 3" />
      <text x="80" y="9" fill="#e11d48" fontSize="6" fontWeight="800" textAnchor="middle">SURCHARGE THRESHOLD: 5.0 MW</text>

      {/* Center Gauge Arc */}
      <g transform="translate(80, 36)">
        <path d="M-22 0 A22 22 0 0 1 22 0" stroke="#cbd5e1" strokeWidth="3" fill="none" />
        <path d="M-22 0 A22 22 0 0 1 10 -19" stroke="#16a34a" strokeWidth="3" fill="none" />
        <path d="M10 -19 A22 22 0 0 1 22 0" stroke="#e11d48" strokeWidth="3" fill="none" />
        {/* Oscillating needle staying below red */}
        <g className="m-gauge-needle-wiggle">
          <line x1="0" y1="0" x2="0" y2="-18" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="0" cy="0" r="3" fill="#0f172a" />
        </g>
      </g>
      <text x="25" y="32" fill="#16a34a" fontSize="6.5" fontWeight="800">SAFE TIER</text>
      <text x="135" y="32" fill="#e11d48" fontSize="6.5" fontWeight="800" textAnchor="end">₹0 PENALTY</text>
    </svg>
  );
}

// ============================================================================
// 3. PLANT UTILITIES & FACILITIES SYSTEM (UTILITIES_MGMT)
// ============================================================================
function UtilVisual0() {
  // Continuous Pressure Watch: Pipeline with moving pressure particles and gauge
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(37, 99, 235, 0.05)" />
      {/* Pipeline Pipe */}
      <rect x="15" y="18" width="130" height="10" rx="3" fill="#e2e8f0" stroke="#3b82f6" strokeWidth="1.2" />
      {/* Air particle flow */}
      <line x1="20" y1="23" x2="140" y2="23" stroke="#2563eb" strokeWidth="2.5" strokeDasharray="5 10" className="m-particle-flow" />
      {/* Pressure Gauge tapped into pipe */}
      <g transform="translate(80, 18)">
        <line x1="0" y1="0" x2="0" y2="-6" stroke="#3b82f6" strokeWidth="1.5" />
        <circle cx="0" cy="-11" r="7" fill="#ffffff" stroke="#3b82f6" strokeWidth="1.4" />
        <g className="m-gauge-needle-wiggle">
          <line x1="0" y1="-11" x2="3" y2="-15" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <circle cx="0" cy="-11" r="1.5" fill="#3b82f6" />
      </g>
      <text x="115" y="12" fill="#2563eb" fontSize="6.5" fontWeight="800">6.8 BAR STABLE</text>
    </svg>
  );
}

function UtilVisual1() {
  // Micro-Leak Detection: Pipe joint with ultrasonic sonar concentric ripples
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(202, 138, 4, 0.05)" />
      {/* Pipe with Flange */}
      <rect x="15" y="20" width="55" height="8" fill="#cbd5e1" />
      <rect x="70" y="16" width="6" height="16" rx="1" fill="#64748b" />
      <rect x="76" y="16" width="6" height="16" rx="1" fill="#64748b" />
      <rect x="82" y="20" width="63" height="8" fill="#cbd5e1" />
      
      {/* Sonar Leak Detection at joint */}
      <g transform="translate(76, 24)">
        <circle cx="0" cy="0" r="8" stroke="#ca8a04" strokeWidth="1" fill="none" className="m-sonar-ring-1" />
        <circle cx="0" cy="0" r="14" stroke="#eab308" strokeWidth="0.8" fill="none" className="m-sonar-ring-2" />
        <circle cx="0" cy="0" r="20" stroke="#f59e0b" strokeWidth="0.6" fill="none" className="m-sonar-ring-3" />
        <circle cx="0" cy="0" r="2.5" fill="#ca8a04" />
      </g>
      <text x="135" y="14" fill="#ca8a04" fontSize="6.5" fontWeight="800" textAnchor="end">ZERO LEAKS</text>
    </svg>
  );
}

function UtilVisual2() {
  // Targeted Section Servicing: Valve with automated bypass flow arrows
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      {/* Pipeline bypass loop */}
      <path d="M20 28H50V14H110V28H140" stroke="#16a34a" strokeWidth="1.8" fill="none" strokeDasharray="4 4" className="m-particle-flow" />
      <path d="M20 28H140" stroke="#94a3b8" strokeWidth="1.4" fill="none" />
      {/* Valve with servicing wrench */}
      <g transform="translate(80, 28)">
        <polygon points="-6,-6 6,6 6,-6 -6,6" fill="#16a34a" />
        <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
      </g>
      <g className="m-tool-dock" transform="translate(80, 10)">
        <circle cx="0" cy="0" r="3" fill="#15803d" />
        <line x1="0" y1="0" x2="8" y2="-6" stroke="#15803d" strokeWidth="1.8" />
      </g>
      <text x="80" y="42" fill="#16a34a" fontSize="6" fontWeight="800" textAnchor="middle">VALVE SEC-04 ACTIVE</text>
    </svg>
  );
}

// ============================================================================
// 4. PRODUCTION PLANNING SYSTEM (PROD_PLANNING)
// ============================================================================
function ProdPlanVisual0() {
  // Demand & Capacity Balancing: Mechanical balance scale leveling orders & line capacity
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(111, 61, 186, 0.05)" />
      {/* Fulcrum base */}
      <polygon points="80,26 74,38 86,38" fill="#6f3dba" />
      {/* Balance Beam tilting smoothly */}
      <g className="m-gauge-needle-wiggle" style={{ transformOrigin: '80px 26px' }}>
        <line x1="35" y1="26" x2="125" y2="26" stroke="#6f3dba" strokeWidth="2.2" strokeLinecap="round" />
        {/* Left Pan (Demand Orders) */}
        <line x1="45" y1="26" x2="45" y2="34" stroke="#6f3dba" strokeWidth="1" />
        <rect x="35" y="34" width="20" height="5" rx="1.5" fill="#6f3dba" />
        <rect x="38" y="28" width="14" height="6" rx="1" fill="#8b5cf6" />
        {/* Right Pan (Line Capacity) */}
        <line x1="115" y1="26" x2="115" y2="34" stroke="#6f3dba" strokeWidth="1" />
        <rect x="105" y="34" width="20" height="5" rx="1.5" fill="#6f3dba" />
        <rect x="108" y="28" width="14" height="6" rx="1" fill="#8b5cf6" />
      </g>
      <text x="45" y="14" fill="#6f3dba" fontSize="6.5" fontWeight="800" textAnchor="middle">DEMAND</text>
      <text x="115" y="14" fill="#6f3dba" fontSize="6.5" fontWeight="800" textAnchor="middle">CAPACITY</text>
      <text x="80" y="12" fill="#16a34a" fontSize="6.5" fontWeight="800" textAnchor="middle">100% BALANCED</text>
    </svg>
  );
}

function ProdPlanVisual1() {
  // Changeover Optimization: Rotating sequential tooling turret with countdown timer
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(37, 99, 235, 0.05)" />
      {/* Turret Disc */}
      <g transform="translate(50, 23)" className="m-spin-cw-fast">
        <circle cx="0" cy="0" r="14" fill="none" stroke="#2563eb" strokeWidth="1.8" />
        <circle cx="0" cy="-10" r="3" fill="#2563eb" />
        <circle cx="8.6" cy="5" r="3" fill="#2563eb" />
        <circle cx="-8.6" cy="5" r="3" fill="#2563eb" />
        <circle cx="0" cy="0" r="4" fill="#93c5fd" />
      </g>
      {/* Quick Swap Arrow */}
      <path d="M75 23H95M95 23L90 19M95 23L90 27" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
      <g transform="translate(125, 23)">
        <circle cx="0" cy="0" r="11" fill="#ffffff" stroke="#2563eb" strokeWidth="1.4" />
        <g className="m-spin-cw-slow">
          <line x1="0" y1="0" x2="0" y2="-7" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round" />
        </g>
        <circle cx="0" cy="0" r="1.5" fill="#0f172a" />
      </g>
      <text x="125" y="42" fill="#2563eb" fontSize="6" fontWeight="800" textAnchor="middle">-40m SWAP</text>
    </svg>
  );
}

function ProdPlanVisual2() {
  // Shift Dispatch Scheduling: Multi-shift Gantt timeline blocks
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      {/* Timeline track */}
      <line x1="20" y1="12" x2="140" y2="12" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="20" y1="24" x2="140" y2="24" stroke="#cbd5e1" strokeWidth="1" />
      <line x1="20" y1="36" x2="140" y2="36" stroke="#cbd5e1" strokeWidth="1" />

      {/* Shift 1 Block */}
      <rect x="25" y="8" width="45" height="8" rx="2" fill="#16a34a" />
      <text x="47" y="14" fill="#ffffff" fontSize="5.5" fontWeight="800" textAnchor="middle">SHIFT A: LINE 1</text>
      {/* Shift 2 Block */}
      <rect x="75" y="20" width="55" height="8" rx="2" fill="#059669" />
      <text x="102" y="26" fill="#ffffff" fontSize="5.5" fontWeight="800" textAnchor="middle">SHIFT B: LINE 2</text>
      {/* Dispatch indicator */}
      <circle cx="140" cy="24" r="3" fill="#16a34a" className="m-probe-pulse" />
    </svg>
  );
}

// ============================================================================
// 5. LIVE PRODUCTION MONITORING (PROD_MONITORING)
// ============================================================================
function ProdMonVisual0() {
  // Live Cycle Counting: Factory conveyor belt with moving parts and optical laser tally
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(37, 99, 235, 0.05)" />
      {/* Conveyor Bed */}
      <rect x="15" y="26" width="130" height="6" rx="2" fill="#64748b" />
      <line x1="15" y1="29" x2="145" y2="29" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 6" className="m-conveyor-track" />
      
      {/* Optical Sensor Gate */}
      <rect x="76" y="8" width="8" height="6" rx="1" fill="#0f172a" />
      <line x1="80" y1="14" x2="80" y2="26" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="2 2" className="m-probe-pulse" />

      {/* Moving Parts stream */}
      <g className="m-moving-part-1">
        <rect x="20" y="19" width="12" height="7" rx="1.5" fill="#2563eb" />
      </g>
      <g className="m-moving-part-2">
        <rect x="20" y="19" width="12" height="7" rx="1.5" fill="#2563eb" />
      </g>
      <g className="m-moving-part-3">
        <rect x="20" y="19" width="12" height="7" rx="1.5" fill="#2563eb" />
      </g>
      <text x="135" y="14" fill="#2563eb" fontSize="6.5" fontWeight="800" textAnchor="end">1,420 PCS/HR</text>
    </svg>
  );
}

function ProdMonVisual1() {
  // Bottleneck Detection: Flow funnel diagram with auto-clearing flow arrows
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(202, 138, 4, 0.05)" />
      {/* Choke funnel shape */}
      <path d="M20 12 L70 20 L70 26 L20 34" stroke="#ca8a04" strokeWidth="1.5" fill="none" />
      <path d="M140 12 L90 20 L90 26 L140 34" stroke="#ca8a04" strokeWidth="1.5" fill="none" />
      {/* Choke warning indicator */}
      <circle cx="80" cy="23" r="5" fill="#ca8a04" className="m-probe-pulse" />
      <text x="80" y="25" fill="#ffffff" fontSize="5" fontWeight="900" textAnchor="middle">!</text>
      {/* Clear bypass arrows */}
      <path d="M45 23H65M95 23H115" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
      <text x="80" y="39" fill="#ca8a04" fontSize="6" fontWeight="800" textAnchor="middle">STATION 03 BOTTLENECK</text>
    </svg>
  );
}

function ProdMonVisual2() {
  // Supervisor Action Push: Plant floor tablet with radio alert broadcast
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      {/* Tablet Device */}
      <rect x="65" y="10" width="30" height="26" rx="3" fill="#0f172a" stroke="#16a34a" strokeWidth="1.2" />
      <rect x="68" y="13" width="24" height="18" rx="1" fill="#ffffff" />
      <path d="M72 20L76 24L87 16" stroke="#16a34a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Radio Broadcast Waves */}
      <g transform="translate(58, 23)">
        <path d="M0 -10 A12 12 0 0 0 0 10" stroke="#16a34a" strokeWidth="1.4" fill="none" className="m-probe-pulse" />
        <path d="M-6 -14 A18 18 0 0 0 -6 14" stroke="#16a34a" strokeWidth="1.2" fill="none" className="m-probe-pulse" style={{ animationDelay: '0.3s' }} />
      </g>
      <g transform="translate(102, 23)">
        <path d="M0 -10 A12 12 0 0 1 0 10" stroke="#16a34a" strokeWidth="1.4" fill="none" className="m-probe-pulse" />
        <path d="M6 -14 A18 18 0 0 1 6 14" stroke="#16a34a" strokeWidth="1.2" fill="none" className="m-probe-pulse" style={{ animationDelay: '0.3s' }} />
      </g>
    </svg>
  );
}

// ============================================================================
// 6. MACHINE EFFICIENCY OPTIMIZER (OEE_PERFORMANCE)
// ============================================================================
function OeeVisual0() {
  // Tri-Factor Efficiency Metric: 3 concentric rotating OEE rings (A, P, Q)
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      <g transform="translate(50, 23)">
        {/* Ring 1 Availability */}
        <circle cx="0" cy="0" r="16" stroke="#3b82f6" strokeWidth="2.2" strokeDasharray="75 25" fill="none" className="m-spin-cw-slow" />
        {/* Ring 2 Performance */}
        <circle cx="0" cy="0" r="11" stroke="#eab308" strokeWidth="2.2" strokeDasharray="50 15" fill="none" className="m-spin-ccw" />
        {/* Ring 3 Quality */}
        <circle cx="0" cy="0" r="6" stroke="#16a34a" strokeWidth="2.2" strokeDasharray="30 8" fill="none" className="m-spin-cw-fast" />
      </g>
      <text x="115" y="18" fill="#16a34a" fontSize="10" fontWeight="900" textAnchor="middle">88.4%</text>
      <text x="115" y="27" fill="#047857" fontSize="6" fontWeight="700" textAnchor="middle">WORLD CLASS OEE</text>
      <text x="115" y="36" fill="#64748b" fontSize="5.5" fontWeight="600" textAnchor="middle">A:94% | P:96% | Q:98%</text>
    </svg>
  );
}

function OeeVisual1() {
  // Micro-Stop Isolation: Continuous timeline highlighting isolated micro-stops
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(202, 138, 4, 0.05)" />
      {/* Production Run timeline bar */}
      <rect x="20" y="18" width="120" height="10" rx="2" fill="#e2e8f0" />
      <rect x="20" y="18" width="40" height="10" fill="#16a34a" />
      {/* Micro-Stop 1 (Amber gap) */}
      <rect x="60" y="18" width="6" height="10" fill="#ef4444" className="m-probe-pulse" />
      <rect x="66" y="18" width="30" height="10" fill="#16a34a" />
      {/* Micro-Stop 2 */}
      <rect x="96" y="18" width="8" height="10" fill="#ef4444" className="m-probe-pulse" style={{ animationDelay: '0.5s' }} />
      <rect x="104" y="18" width="36" height="10" fill="#16a34a" />
      <text x="63" y="12" fill="#ef4444" fontSize="5.5" fontWeight="800" textAnchor="middle">45s STOP</text>
      <text x="100" y="12" fill="#ef4444" fontSize="5.5" fontWeight="800" textAnchor="middle">1.2m JAM</text>
      <text x="80" y="38" fill="#ca8a04" fontSize="6" fontWeight="700" textAnchor="middle">ISOLATING CHOKEPOINTS</text>
    </svg>
  );
}

function OeeVisual2() {
  // Capacity Unlock Prioritization: Stacked capacity bar animating upwards
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      {/* Base bars */}
      <g transform="translate(30, 36)">
        <rect x="0" y="-12" width="16" height="12" rx="1" fill="#94a3b8" />
        <rect x="22" y="-18" width="16" height="18" rx="1" fill="#94a3b8" />
        <rect x="44" y="-24" width="16" height="24" rx="1" fill="#94a3b8" />
        {/* Unlocked green expansion */}
        <rect x="44" y="-30" width="16" height="6" rx="1" fill="#16a34a" className="m-probe-pulse" />
      </g>
      {/* Arrow jumping up */}
      <path d="M105 32L105 16M105 16L100 20M105 16L110 20" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
      <text x="125" y="22" fill="#16a34a" fontSize="8" fontWeight="800">+14%</text>
      <text x="125" y="31" fill="#047857" fontSize="5.5" fontWeight="700">CAPACITY</text>
    </svg>
  );
}

// ============================================================================
// 7. VIRTUAL FACTORY TWIN SIMULATOR (DIGITAL_TWIN)
// ============================================================================
function DigitalTwinVisual0() {
  // Virtual Floor Physics: Isometric 3D cyber grid with wireframe pulsing node
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(99, 102, 241, 0.06)" />
      {/* Isometric Grid Floor */}
      <path d="M80 6 L140 22 L80 38 L20 22 Z" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1.2" fill="none" />
      <path d="M50 14 L110 30M110 14 L50 30" stroke="rgba(99, 102, 241, 0.2)" strokeWidth="0.8" />
      {/* Cyber Machine Cube Floating in center */}
      <g transform="translate(80, 20)" className="m-cyber-cube">
        <polygon points="0,-10 9,-5 0,0 -9,-5" fill="#818cf8" stroke="#4f46e5" strokeWidth="1" />
        <polygon points="0,0 9,-5 9,6 0,11" fill="#6366f1" stroke="#4f46e5" strokeWidth="1" />
        <polygon points="0,0 -9,-5 -9,6 0,11" fill="#4f46e5" stroke="#4f46e5" strokeWidth="1" />
      </g>
      <text x="135" y="12" fill="#6366f1" fontSize="6.5" fontWeight="800" textAnchor="end">DIGITAL TWIN 1:1</text>
    </svg>
  );
}

function DigitalTwinVisual1() {
  // What-If Scenario Sandbox: Branching decision tree nodes
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(99, 102, 241, 0.05)" />
      {/* Root Node */}
      <circle cx="30" cy="23" r="5" fill="#4f46e5" />
      {/* Branching paths */}
      <path d="M35 23 C55 23, 60 12, 85 12" stroke="#6366f1" strokeWidth="1.5" fill="none" />
      <path d="M35 23 C55 23, 60 34, 85 34" stroke="#6366f1" strokeWidth="1.5" fill="none" />
      {/* Branch Node 1 (Speed) */}
      <circle cx="85" cy="12" r="4" fill="#16a34a" className="m-probe-pulse" />
      <text x="94" y="14" fill="#16a34a" fontSize="6" fontWeight="800">+20% SPEED (PASS)</text>
      {/* Branch Node 2 (Stress) */}
      <circle cx="85" cy="34" r="4" fill="#ef4444" className="m-probe-pulse" style={{ animationDelay: '0.4s' }} />
      <text x="94" y="36" fill="#ef4444" fontSize="6" fontWeight="800">OVERHEAT (FAIL)</text>
    </svg>
  );
}

function DigitalTwinVisual2() {
  // Risk-Free Verification: Verified digital shield
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      <g transform="translate(80, 23)">
        <polygon points="0,-16 14,-8 14,6 0,16 -14,6 -14,-8" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.8" />
        <path d="M-5 -1L-1 3L6 -4" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <circle cx="80" cy="23" r="18" stroke="#16a34a" strokeWidth="1" strokeDasharray="3 3" className="m-spin-cw-slow" fill="none" />
      <text x="25" y="25" fill="#16a34a" fontSize="6.5" fontWeight="800">VIRTUAL PASS</text>
      <text x="135" y="25" fill="#16a34a" fontSize="6.5" fontWeight="800" textAnchor="end">ZERO RISK</text>
    </svg>
  );
}

// ============================================================================
// 8. QUALITY MANAGEMENT & INSPECTION (QUALITY_MGMT)
// ============================================================================
function QualityVisual0() {
  // Automated Tolerance Gate: Precision caliper clamping part with green tolerance band
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(5, 150, 105, 0.05)" />
      {/* Part inside Caliper */}
      <rect x="70" y="16" width="20" height="14" rx="2" fill="#e2e8f0" stroke="#059669" strokeWidth="1.2" />
      <line x1="80" y1="12" x2="80" y2="34" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Caliper Jaw Left & Right closing */}
      <g transform="translate(45, 12)">
        <rect x="0" y="0" width="22" height="6" fill="#0f172a" />
        <rect x="18" y="0" width="4" height="22" fill="#0f172a" />
      </g>
      <g transform="translate(93, 12)">
        <rect x="0" y="0" width="22" height="6" fill="#0f172a" />
        <rect x="0" y="0" width="4" height="22" fill="#0f172a" />
      </g>
      <text x="80" y="41" fill="#059669" fontSize="6" fontWeight="800" textAnchor="middle">±0.01mm TOLERANCE GATE</text>
    </svg>
  );
}

function QualityVisual1() {
  // Early Scrap Drift: SPC normal bell curve with drift alert marker
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(202, 138, 4, 0.05)" />
      {/* Bell Curve */}
      <path d="M20 36 C50 36, 65 10, 80 10 C95 10, 110 36, 140 36" stroke="#059669" strokeWidth="1.8" fill="none" />
      <line x1="80" y1="8" x2="80" y2="38" stroke="#059669" strokeWidth="1" strokeDasharray="2 2" />
      {/* Upper Spec Limit Drift Line */}
      <line x1="110" y1="8" x2="110" y2="38" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="3 3" />
      {/* Drifting dot flashing */}
      <circle cx="106" cy="18" r="3.2" fill="#ca8a04" className="m-probe-pulse" />
      <text x="110" y="7" fill="#ef4444" fontSize="5.5" fontWeight="800" textAnchor="middle">USL DRIFT</text>
      <text x="45" y="24" fill="#059669" fontSize="6" fontWeight="800">SPC NORMAL</text>
    </svg>
  );
}

function QualityVisual2() {
  // Quality Compliance Audit: Digital clipboard stamping pass checkmarks
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      {/* Clipboard */}
      <g transform="translate(40, 8)">
        <rect x="0" y="0" width="80" height="30" rx="3" fill="#ffffff" stroke="#16a34a" strokeWidth="1.2" />
        <rect x="25" y="-3" width="30" height="5" rx="1.5" fill="#16a34a" />
        {/* Checklist rows with stamps */}
        <line x1="12" y1="10" x2="50" y2="10" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="18" x2="50" y2="18" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="24" x2="40" y2="24" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        {/* Stamp Checks */}
        <g className="m-stamp-press" transform="translate(62, 10)">
          <circle cx="0" cy="0" r="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
          <path d="M-2 0L-0.5 1.5L2 -1.5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" />
        </g>
        <g className="m-stamp-press" transform="translate(62, 18)" style={{ animationDelay: '0.4s' }}>
          <circle cx="0" cy="0" r="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
          <path d="M-2 0L-0.5 1.5L2 -1.5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </g>
      <text x="135" y="26" fill="#16a34a" fontSize="6.5" fontWeight="800" textAnchor="end">100% AUDIT</text>
    </svg>
  );
}

// ============================================================================
// 9. AUTOMATED OPTICAL CAMERA INSPECTION (VISION_AI)
// ============================================================================
function VisionVisual0() {
  // 38ms Sub-Second Scan: Camera aperture with high-speed horizontal laser sweep
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(5, 150, 105, 0.05)" />
      {/* Component on inspection bed */}
      <rect x="45" y="15" width="70" height="18" rx="2" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
      <circle cx="65" cy="24" r="4" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="95" cy="24" r="4" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />

      {/* Sweeping High-Speed Emerald Laser */}
      <g className="m-laser-scan-h" transform="translate(48, 12)">
        <line x1="0" y1="0" x2="0" y2="24" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" filter="drop-shadow(0 0 3px #10b981)" />
      </g>
      {/* Camera Mount */}
      <rect x="72" y="3" width="16" height="5" rx="1.5" fill="#0f172a" />
      <circle cx="80" cy="5.5" r="1.5" fill="#10b981" className="m-probe-pulse" />
      <text x="25" y="25" fill="#059669" fontSize="7" fontWeight="900">38ms</text>
    </svg>
  );
}

function VisionVisual1() {
  // 99.8% Flaw Accuracy: Crosshair targeting component flaw
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(5, 150, 105, 0.05)" />
      {/* Component Outline */}
      <rect x="35" y="10" width="90" height="26" rx="3" fill="#ffffff" stroke="#94a3b8" strokeWidth="1.2" />
      {/* Crosshair Locking onto micro-scratch */}
      <g transform="translate(80, 23)">
        <circle cx="0" cy="0" r="10" stroke="#059669" strokeWidth="1.4" strokeDasharray="4 2" className="m-spin-cw-slow" fill="none" />
        <line x1="-14" y1="0" x2="14" y2="0" stroke="#059669" strokeWidth="1" />
        <line x1="0" y1="-14" x2="0" y2="14" stroke="#059669" strokeWidth="1" />
        <circle cx="0" cy="0" r="2" fill="#ef4444" />
      </g>
      <text x="135" y="25" fill="#059669" fontSize="6.5" fontWeight="800" textAnchor="end">99.8% ACCURACY</text>
    </svg>
  );
}

function VisionVisual2() {
  // Pneumatic Reject Ejection: Conveyor with pneumatic piston ejecting defect
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(225, 29, 72, 0.05)" />
      {/* Conveyor */}
      <rect x="15" y="26" width="130" height="6" rx="2" fill="#64748b" />
      {/* Pneumatic Cylinder above */}
      <g transform="translate(80, 8)">
        <rect x="-6" y="0" width="12" height="10" rx="1.5" fill="#0f172a" />
        {/* Piston punching down */}
        <g className="m-piston-punch">
          <line x1="0" y1="10" x2="0" y2="18" stroke="#cbd5e1" strokeWidth="3" />
          <rect x="-8" y="18" width="16" height="4" rx="1" fill="#ef4444" />
        </g>
      </g>
      {/* Rejected part sliding into bin */}
      <path d="M85 32 L105 42" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2 2" />
      <text x="135" y="20" fill="#e11d48" fontSize="6.5" fontWeight="800" textAnchor="end">AUTO-EJECT</text>
    </svg>
  );
}

// ============================================================================
// 10. ENGINEERING CHANGE & BLUEPRINT CONTROL (ENG_CHANGE)
// ============================================================================
function EngChangeVisual0() {
  // Revision Synchronization: CAD blueprint sheets auto-aligning to REV D
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(37, 99, 235, 0.05)" />
      {/* Blueprint Sheet Base */}
      <rect x="40" y="8" width="80" height="30" rx="2" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
      <line x1="45" y1="14" x2="115" y2="14" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      <line x1="45" y1="22" x2="90" y2="22" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      <circle cx="102" cy="22" r="5" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
      {/* Revision Stamp */}
      <g className="m-stamp-press" transform="translate(100, 24)">
        <rect x="-14" y="-5" width="28" height="10" rx="2" fill="#2563eb" stroke="#ffffff" strokeWidth="1" />
        <text x="0" y="2" fill="#ffffff" fontSize="5.5" fontWeight="900" textAnchor="middle">REV D SYNC</text>
      </g>
    </svg>
  );
}

function EngChangeVisual1() {
  // Obsolete Stock Prevention: Quarantine gate barrier locked over obsolete parts
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(202, 138, 4, 0.05)" />
      {/* Obsolete bins */}
      <rect x="35" y="16" width="30" height="20" rx="2" fill="#cbd5e1" />
      <rect x="70" y="16" width="30" height="20" rx="2" fill="#cbd5e1" />
      {/* Lockout Gate Barrier */}
      <line x1="25" y1="14" x2="110" y2="14" stroke="#ca8a04" strokeWidth="2.5" />
      <circle cx="110" cy="14" r="3" fill="#ca8a04" />
      {/* Lock Icon */}
      <g transform="translate(68, 6)" className="m-loto-snap">
        <rect x="0" y="3" width="10" height="8" rx="1.5" fill="#ca8a04" />
        <path d="M2 3V-1C2 -2.5 8 -2.5 8 -1V3" stroke="#ca8a04" strokeWidth="1.2" fill="none" />
      </g>
      <text x="135" y="26" fill="#ca8a04" fontSize="6.5" fontWeight="800" textAnchor="end">ZERO SCRAP</text>
    </svg>
  );
}

function EngChangeVisual2() {
  // 100% Spec Compliance: Golden compass and ISO compliance watermark
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      <g transform="translate(80, 23)">
        <circle cx="0" cy="0" r="15" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="3 3" className="m-spin-cw-slow" fill="none" />
        <circle cx="0" cy="0" r="12" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.2" />
        <text x="0" y="2" fill="#16a34a" fontSize="6.5" fontWeight="900" textAnchor="middle">ISO 9001</text>
      </g>
      <text x="25" y="25" fill="#16a34a" fontSize="6.5" fontWeight="800">100% SPEC</text>
      <text x="135" y="25" fill="#16a34a" fontSize="6.5" fontWeight="800" textAnchor="end">VERIFIED</text>
    </svg>
  );
}

// ============================================================================
// 11. PRODUCT TRACEABILITY & SERIAL GENEALOGY (TRACEABILITY)
// ============================================================================
function TraceVisual0() {
  // Sub-Second QR Birth Record: 2D DataMatrix with laser beam engraving serial
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(99, 102, 241, 0.05)" />
      {/* 2D QR DataMatrix Code */}
      <g transform="translate(45, 11)">
        <rect x="0" y="0" width="24" height="24" rx="2" fill="#ffffff" stroke="#4f46e5" strokeWidth="1.2" />
        {/* Finder corners */}
        <rect x="2" y="2" width="6" height="6" fill="#4f46e5" />
        <rect x="16" y="2" width="6" height="6" fill="#4f46e5" />
        <rect x="2" y="16" width="6" height="6" fill="#4f46e5" />
        <rect x="10" y="10" width="4" height="4" fill="#4f46e5" />
        {/* Red laser scanning across QR */}
        <line x1="-2" y1="12" x2="26" y2="12" stroke="#ef4444" strokeWidth="1.5" className="m-laser-scan-v" />
      </g>
      {/* Digital Serial String */}
      <g transform="translate(85, 18)">
        <text x="0" y="0" fill="#4f46e5" fontSize="7" fontWeight="900" fontFamily="monospace">SN-2026-948A</text>
        <text x="0" y="8" fill="#16a34a" fontSize="5.5" fontWeight="700">BIRTH LOGGED 12ms</text>
        <text x="0" y="15" fill="#64748b" fontSize="5" fontWeight="600">HEAT: H482 | BATCH: 09</text>
      </g>
    </svg>
  );
}

function TraceVisual1() {
  // 60-Second Root Cause: Inverse genealogy tree connecting sub-components
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(37, 99, 235, 0.05)" />
      {/* Finished Unit */}
      <rect x="20" y="18" width="22" height="10" rx="1.5" fill="#2563eb" />
      <text x="31" y="25" fill="#ffffff" fontSize="5" fontWeight="800" textAnchor="middle">UNIT</text>
      {/* Branching Backwards */}
      <path d="M42 23 L65 13 M42 23 L65 33" stroke="#2563eb" strokeWidth="1.4" />
      {/* Sub-Assemblies */}
      <rect x="65" y="8" width="24" height="10" rx="1.5" fill="#60a5fa" />
      <text x="77" y="15" fill="#ffffff" fontSize="5" fontWeight="800" textAnchor="middle">MOTOR</text>
      <rect x="65" y="28" width="24" height="10" rx="1.5" fill="#60a5fa" />
      <text x="77" y="35" fill="#ffffff" fontSize="5" fontWeight="800" textAnchor="middle">GEARBOX</text>
      {/* Root Supplier Node */}
      <path d="M89 13 L110 13 M89 33 L110 33" stroke="#2563eb" strokeWidth="1.4" />
      <rect x="110" y="18" width="30" height="12" rx="1.5" fill="#ef4444" className="m-probe-pulse" />
      <text x="125" y="26" fill="#ffffff" fontSize="5.5" fontWeight="900" textAnchor="middle">SUPPLIER X</text>
    </svg>
  );
}

function TraceVisual2() {
  // Targeted Recall Isolation: Precision serial filter isolating suspect batch
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      {/* 5 Part nodes */}
      <g transform="translate(30, 23)">
        <circle cx="0" cy="0" r="5" fill="#16a34a" />
        <circle cx="25" cy="0" r="5" fill="#16a34a" />
        {/* The 1 Defective Isolated Node */}
        <circle cx="50" cy="0" r="6" fill="#ef4444" className="m-probe-pulse" />
        <circle cx="75" cy="0" r="5" fill="#16a34a" />
        <circle cx="100" cy="0" r="5" fill="#16a34a" />
      </g>
      <text x="80" y="39" fill="#16a34a" fontSize="6.5" fontWeight="800" textAnchor="middle">ONLY 1 UNIT ISOLATED (NO FLEET HALT)</text>
    </svg>
  );
}

// ============================================================================
// 12. SMART INVENTORY & STOCK BUFFER SYSTEM (INV_BUFFER)
// ============================================================================
function InvBufferVisual0() {
  // Live Buffer Level Watch: Warehouse racks with dynamic fluid levels
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(234, 88, 12, 0.05)" />
      {/* 3 Warehouse Rack Columns with levels */}
      <g transform="translate(40, 36)">
        {/* Rack 1 */}
        <rect x="0" y="-26" width="18" height="26" stroke="#ea580c" strokeWidth="1.2" fill="none" />
        <rect x="2" y="-20" width="14" height="18" fill="#ea580c" className="m-bar-grow-1" />
        {/* Rack 2 */}
        <rect x="26" y="-26" width="18" height="26" stroke="#ea580c" strokeWidth="1.2" fill="none" />
        <rect x="28" y="-14" width="14" height="12" fill="#f97316" className="m-bar-grow-2" />
        {/* Rack 3 */}
        <rect x="52" y="-26" width="18" height="26" stroke="#ea580c" strokeWidth="1.2" fill="none" />
        <rect x="54" y="-24" width="14" height="22" fill="#ea580c" className="m-bar-grow-3" />
      </g>
      <text x="135" y="20" fill="#ea580c" fontSize="8" fontWeight="900" textAnchor="end">94.2%</text>
      <text x="135" y="28" fill="#c2410c" fontSize="5.5" fontWeight="700" textAnchor="end">BUFFER HEALTH</text>
    </svg>
  );
}

function InvBufferVisual1() {
  // Zero Line Starvation: AGV robot delivering parts cart to assembly line
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      {/* Guided Magnetic Tape Floor Line */}
      <line x1="20" y1="30" x2="140" y2="30" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4 4" />
      {/* AGV Vehicle moving */}
      <g className="m-slide-bar" transform="translate(35, 16)">
        <rect x="0" y="6" width="26" height="8" rx="2" fill="#0f172a" />
        <circle cx="5" cy="14" r="2" fill="#94a3b8" />
        <circle cx="21" cy="14" r="2" fill="#94a3b8" />
        {/* Tote Box payload */}
        <rect x="4" y="0" width="18" height="6" rx="1" fill="#16a34a" />
      </g>
      <text x="135" y="16" fill="#16a34a" fontSize="6.5" fontWeight="800" textAnchor="end">ZERO STARVATION</text>
    </svg>
  );
}

function InvBufferVisual2() {
  // Working Capital Free-Up: Currency coins released from holding stock
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      <g transform="translate(45, 23)">
        <circle cx="0" cy="0" r="12" fill="#16a34a" />
        <circle cx="0" cy="0" r="10" stroke="#ffffff" strokeWidth="1" fill="none" />
        <text x="0" y="3.5" fill="#ffffff" fontSize="9" fontWeight="900" textAnchor="middle">₹</text>
      </g>
      <g transform="translate(85, 23)">
        <path d="M0 0 H20M20 0 L15 -4M20 0 L15 4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
      </g>
      <text x="115" y="20" fill="#16a34a" fontSize="9" fontWeight="900">₹1.2 Cr</text>
      <text x="115" y="28" fill="#059669" fontSize="5.5" fontWeight="700">RELEASED CAPITAL</text>
    </svg>
  );
}

// ============================================================================
// 13. SUPPLIER PERFORMANCE & VENDOR SCORECARD (SUPPLIER_RISK)
// ============================================================================
function SupplierVisual0() {
  // Vendor Scorecard Ranking: 3-tier podium with stars
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(225, 29, 72, 0.05)" />
      {/* Podium */}
      <g transform="translate(40, 36)">
        <rect x="0" y="-14" width="20" height="14" rx="1" fill="#cbd5e1" />
        <text x="10" y="-6" fill="#475569" fontSize="6" fontWeight="900" textAnchor="middle">#2</text>
        <rect x="24" y="-22" width="22" height="22" rx="1" fill="#facc15" />
        <text x="35" y="-12" fill="#854d0e" fontSize="7" fontWeight="900" textAnchor="middle">#1</text>
        <rect x="50" y="-10" width="20" height="10" rx="1" fill="#fdba74" />
        <text x="60" y="-3" fill="#9a3412" fontSize="6" fontWeight="900" textAnchor="middle">#3</text>
      </g>
      <text x="135" y="20" fill="#e11d48" fontSize="8" fontWeight="900" textAnchor="end">TIER 1</text>
      <text x="135" y="28" fill="#be123c" fontSize="5.5" fontWeight="700" textAnchor="end">CERTIFIED</text>
    </svg>
  );
}

function SupplierVisual1() {
  // OTIF Punctuality Meter: Speedometer dial pointing to 98.4%
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      <g transform="translate(50, 34)">
        <path d="M-22 0 A22 22 0 0 1 22 0" stroke="#cbd5e1" strokeWidth="4" fill="none" />
        <path d="M-22 0 A22 22 0 0 1 18 -12" stroke="#16a34a" strokeWidth="4" fill="none" />
        <g className="m-gauge-needle-wiggle">
          <line x1="0" y1="0" x2="16" y2="-12" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="0" cy="0" r="3" fill="#0f172a" />
      </g>
      <text x="110" y="18" fill="#16a34a" fontSize="10" fontWeight="900">98.4%</text>
      <text x="110" y="27" fill="#047857" fontSize="6" fontWeight="700">OTIF PUNCTUALITY</text>
    </svg>
  );
}

function SupplierVisual2() {
  // Disruption Risk Warning: Global route radar sweep detecting delays
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(202, 138, 4, 0.05)" />
      <g transform="translate(80, 23)">
        <circle cx="0" cy="0" r="16" stroke="#ca8a04" strokeWidth="1" strokeDasharray="3 3" fill="none" />
        <g className="m-radar-sweep">
          <line x1="0" y1="0" x2="16" y2="0" stroke="#ca8a04" strokeWidth="1.5" />
        </g>
        <circle cx="8" cy="-8" r="3" fill="#ef4444" className="m-probe-pulse" />
      </g>
      <text x="25" y="25" fill="#ca8a04" fontSize="6.5" fontWeight="800">PORT DELAY</text>
      <text x="135" y="25" fill="#ca8a04" fontSize="6.5" fontWeight="800" textAnchor="end">EARLY ALERT</text>
    </svg>
  );
}

// ============================================================================
// 14. AUTOMATED SOURCING & RFQ MANAGER (SOURCING_RFQ)
// ============================================================================
function SourcingVisual0() {
  // Instant RFQ Generation: Dispatch document packet to vendors
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(5, 150, 105, 0.05)" />
      {/* RFQ Envelope */}
      <g transform="translate(35, 11)">
        <rect x="0" y="0" width="32" height="24" rx="2" fill="#ffffff" stroke="#059669" strokeWidth="1.4" />
        <path d="M0 0 L16 12 L32 0" stroke="#059669" strokeWidth="1.2" fill="none" />
      </g>
      {/* Fast Dispatch arrows */}
      <path d="M75 23 H105 M105 23 L100 19 M105 23 L100 27" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      <text x="125" y="20" fill="#059669" fontSize="8" fontWeight="900">12 SEC</text>
      <text x="125" y="28" fill="#047857" fontSize="5.5" fontWeight="700">AUTO-RFQ</text>
    </svg>
  );
}

function SourcingVisual1() {
  // 2-Hour Bid Comparison: Multi-vendor price comparison bars
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(37, 99, 235, 0.05)" />
      {/* 3 Supplier Quote Bars */}
      <g transform="translate(30, 12)">
        <rect x="0" y="0" width="60" height="6" rx="1.5" fill="#94a3b8" />
        <text x="65" y="5.5" fill="#64748b" fontSize="5.5" fontWeight="700">₹450 (Vendor A)</text>
        <rect x="0" y="9" width="45" height="6" rx="1.5" fill="#16a34a" />
        <text x="50" y="14.5" fill="#16a34a" fontSize="5.5" fontWeight="900">₹380 BEST (Vendor B)</text>
        <rect x="0" y="18" width="55" height="6" rx="1.5" fill="#94a3b8" />
        <text x="60" y="23.5" fill="#64748b" fontSize="5.5" fontWeight="700">₹420 (Vendor C)</text>
      </g>
    </svg>
  );
}

function SourcingVisual2() {
  // 1-Click Award Card: Purchase contract seal
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      <g transform="translate(80, 23)">
        <circle cx="0" cy="0" r="15" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" className="m-stamp-press" />
        <path d="M-5 -1L-1 3L6 -4" stroke="#854d0e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="25" y="25" fill="#16a34a" fontSize="6.5" fontWeight="800">PO GENERATED</text>
      <text x="135" y="25" fill="#16a34a" fontSize="6.5" fontWeight="800" textAnchor="end">AWARDED</text>
    </svg>
  );
}

// ============================================================================
// 15. LOGISTICS & DISPATCH FLEET TRACKER (LOGISTICS_FLEET)
// ============================================================================
function LogisticsVisual0() {
  // Live GPS Vehicle Telematics: Moving truck on dashed highway with satellite orbit
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(234, 88, 12, 0.05)" />
      {/* Highway Road */}
      <line x1="15" y1="32" x2="145" y2="32" stroke="#475569" strokeWidth="3" />
      <line x1="15" y1="32" x2="145" y2="32" stroke="#ffffff" strokeWidth="1" strokeDasharray="6 6" className="m-conveyor-track" />
      
      {/* Moving Truck */}
      <g transform="translate(55, 14)">
        <rect x="0" y="4" width="22" height="12" rx="1.5" fill="#ea580c" />
        <path d="M22 8H28L33 11V16H22V8Z" fill="#1e293b" />
        <circle cx="6" cy="17" r="2.5" fill="#0f172a" />
        <circle cx="27" cy="17" r="2.5" fill="#0f172a" />
      </g>

      {/* GPS Satellite Beam */}
      <g transform="translate(100, 8)" className="m-probe-pulse">
        <circle cx="0" cy="0" r="3" fill="#0284c7" />
        <line x1="0" y1="0" x2="-15" y2="12" stroke="#0284c7" strokeWidth="1" strokeDasharray="2 2" />
      </g>
      <text x="135" y="14" fill="#ea580c" fontSize="6.5" fontWeight="800" textAnchor="end">GPS 42 UNITS</text>
    </svg>
  );
}

function LogisticsVisual1() {
  // Dynamic ETA Prediction: Countdown timeline synchronizing arrival
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(37, 99, 235, 0.05)" />
      {/* Route Timeline */}
      <line x1="25" y1="23" x2="135" y2="23" stroke="#cbd5e1" strokeWidth="2.5" />
      <line x1="25" y1="23" x2="95" y2="23" stroke="#2563eb" strokeWidth="2.5" />
      <circle cx="25" cy="23" r="4" fill="#2563eb" />
      <circle cx="95" cy="23" r="5" fill="#2563eb" className="m-probe-pulse" />
      <circle cx="135" cy="23" r="4" fill="#94a3b8" />
      <text x="95" y="14" fill="#2563eb" fontSize="7" fontWeight="900" textAnchor="middle">ETA 14:30</text>
      <text x="135" y="34" fill="#64748b" fontSize="5.5" fontWeight="700" textAnchor="middle">PLANT 02</text>
    </svg>
  );
}

function LogisticsVisual2() {
  // Proactive Route Rerouting: Dynamic route splitting around hazard
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      {/* Obstructed route (Red dash) */}
      <line x1="25" y1="23" x2="135" y2="23" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="80" cy="23" r="4" fill="#ef4444" />
      <text x="80" y="25" fill="#ffffff" fontSize="4.5" fontWeight="900" textAnchor="middle">X</text>
      {/* Clear Bypass Detour (Green) */}
      <path d="M45 23 C55 10, 105 10, 115 23" stroke="#16a34a" strokeWidth="2" fill="none" />
      <text x="80" y="9" fill="#16a34a" fontSize="6.5" fontWeight="800" textAnchor="middle">AUTO-DETOUR (+0m)</text>
    </svg>
  );
}

// ============================================================================
// 16. CUSTOMER ORDER FULFILLMENT INTELLIGENCE (ORDER_FULFILLMENT)
// ============================================================================
function OrderFulfillVisual0() {
  // Live Capacity Verification: Factory slot checker filling demand
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(37, 99, 235, 0.05)" />
      {/* Shift Slots */}
      <g transform="translate(35, 14)">
        <rect x="0" y="0" width="18" height="18" rx="2" fill="#2563eb" />
        <rect x="22" y="0" width="18" height="18" rx="2" fill="#2563eb" />
        <rect x="44" y="0" width="18" height="18" rx="2" fill="#2563eb" />
        {/* Next Available Slot */}
        <rect x="66" y="0" width="18" height="18" rx="2" stroke="#16a34a" strokeWidth="1.5" fill="none" className="m-probe-pulse" />
        <text x="75" y="11" fill="#16a34a" fontSize="6.5" fontWeight="900" textAnchor="middle">OPEN</text>
      </g>
      <text x="135" y="25" fill="#2563eb" fontSize="6.5" fontWeight="800" textAnchor="end">ATP VERIFIED</text>
    </svg>
  );
}

function OrderFulfillVisual1() {
  // Dependable Promise Dates: Calendar lock icon with 100% guarantee
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      <g transform="translate(45, 11)">
        <rect x="0" y="0" width="24" height="24" rx="3" fill="#ffffff" stroke="#16a34a" strokeWidth="1.4" />
        <rect x="0" y="0" width="24" height="6" rx="1" fill="#16a34a" />
        <path d="M7 16L10 19L17 12" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(80, 18)">
        <text x="0" y="0" fill="#16a34a" fontSize="8" fontWeight="900">PROMISE MET</text>
        <text x="0" y="8" fill="#047857" fontSize="5.5" fontWeight="700">98.6% ON-TIME DISPATCH</text>
      </g>
    </svg>
  );
}

function OrderFulfillVisual2() {
  // Priority Order Guard: Fast-track VIP lane
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(202, 138, 4, 0.05)" />
      <rect x="25" y="14" width="110" height="18" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.2" />
      <text x="80" y="25" fill="#854d0e" fontSize="7.5" fontWeight="900" textAnchor="middle">★ VIP PRIORITY EXPEDITE</text>
    </svg>
  );
}

// ============================================================================
// 17. PLANT SAFETY & ENVIRONMENTAL GUARDIAN (EHS_SAFETY)
// ============================================================================
function EhsVisual0() {
  // Digital LOTO Permit Check: Heavy safety padlock snapping shut
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(225, 29, 72, 0.05)" />
      <g transform="translate(50, 14)" className="m-loto-snap">
        {/* Shackle */}
        <path d="M4 6V-2C4 -6 16 -6 16 -2V6" stroke="#e11d48" strokeWidth="2.5" fill="none" />
        {/* Lock Body */}
        <rect x="0" y="6" width="20" height="18" rx="3" fill="#e11d48" />
        <circle cx="10" cy="13" r="2.5" fill="#ffffff" />
        <line x1="10" y1="13" x2="10" y2="18" stroke="#ffffff" strokeWidth="1.5" />
      </g>
      <g transform="translate(85, 18)">
        <text x="0" y="0" fill="#e11d48" fontSize="8" fontWeight="900">LOTO LOCKED</text>
        <text x="0" y="9" fill="#9f1239" fontSize="6" fontWeight="700">ZERO ENERGY STATE</text>
      </g>
    </svg>
  );
}

function EhsVisual1() {
  // Restricted Zone Perimeter: Pulsing red infrared laser barrier
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(225, 29, 72, 0.05)" />
      {/* Perimeter boundary posts */}
      <rect x="25" y="10" width="8" height="26" rx="1.5" fill="#0f172a" />
      <rect x="127" y="10" width="8" height="26" rx="1.5" fill="#0f172a" />
      {/* 3 Red Laser Beams */}
      <line x1="33" y1="16" x2="127" y2="16" stroke="#ef4444" strokeWidth="1.8" className="m-probe-pulse" />
      <line x1="33" y1="23" x2="127" y2="23" stroke="#ef4444" strokeWidth="1.8" className="m-probe-pulse" style={{ animationDelay: '0.3s' }} />
      <line x1="33" y1="30" x2="127" y2="30" stroke="#ef4444" strokeWidth="1.8" className="m-probe-pulse" style={{ animationDelay: '0.6s' }} />
      <text x="80" y="25" fill="#ef4444" fontSize="6.5" fontWeight="900" textAnchor="middle">GEOFENCE ACTIVE</text>
    </svg>
  );
}

function EhsVisual2() {
  // Zero Incident Guardian: Green protective shield with 428-day counter
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      <g transform="translate(45, 23)">
        <path d="M0 -15 L12 -8 V4 C12 11 0 16 0 16 C0 16 -12 11 -12 4 V-8 Z" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.8" />
        <path d="M-4 1L-1 4L5 -3" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" />
      </g>
      <text x="75" y="20" fill="#16a34a" fontSize="9" fontWeight="900">428 DAYS</text>
      <text x="75" y="29" fill="#047857" fontSize="6" fontWeight="700">INCIDENT-FREE</text>
    </svg>
  );
}

// ============================================================================
// 18. OPERATOR SKILL & SHIFT ALLOCATION MANAGER (WORKFORCE_ALLOC)
// ============================================================================
function WorkforceVisual0() {
  // Skill Matrix Station Mapping: Stations connected to operator avatars
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(99, 102, 241, 0.05)" />
      {/* 3 Operators mapped to 3 machines */}
      <g transform="translate(30, 23)">
        <circle cx="0" cy="0" r="7" fill="#6366f1" />
        <text x="0" y="2.5" fill="#ffffff" fontSize="5.5" fontWeight="900" textAnchor="middle">OP1</text>
        <line x1="7" y1="0" x2="25" y2="0" stroke="#6366f1" strokeWidth="1.2" strokeDasharray="2 2" />
        <rect x="25" y="-6" width="12" height="12" rx="2" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1" />
      </g>
      <g transform="translate(95, 23)">
        <circle cx="0" cy="0" r="7" fill="#6366f1" />
        <text x="0" y="2.5" fill="#ffffff" fontSize="5.5" fontWeight="900" textAnchor="middle">OP2</text>
        <line x1="7" y1="0" x2="25" y2="0" stroke="#6366f1" strokeWidth="1.2" strokeDasharray="2 2" />
        <rect x="25" y="-6" width="12" height="12" rx="2" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1" />
      </g>
      <text x="80" y="41" fill="#4f46e5" fontSize="6" fontWeight="800" textAnchor="middle">LEVEL 4 CERTIFIED</text>
    </svg>
  );
}

function WorkforceVisual1() {
  // Absentee Fill: Smart roster auto-swap
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(37, 99, 235, 0.05)" />
      {/* Absentee (Grayed out) */}
      <rect x="30" y="14" width="35" height="18" rx="2" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
      <text x="47" y="25" fill="#94a3b8" fontSize="5.5" fontWeight="700" textAnchor="middle">ABSENT</text>
      {/* Swap arrow */}
      <path d="M72 23H88M88 23L83 19M88 23L83 27" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
      {/* Reserve qualified operator */}
      <rect x="95" y="14" width="40" height="18" rx="2" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.2" />
      <text x="115" y="25" fill="#2563eb" fontSize="5.5" fontWeight="900" textAnchor="middle">AUTO-FILL</text>
    </svg>
  );
}

function WorkforceVisual2() {
  // Zero Startup Delay: Stopwatch hitting 00:00:00
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      <g transform="translate(50, 23)">
        <circle cx="0" cy="0" r="14" fill="#ffffff" stroke="#16a34a" strokeWidth="1.8" />
        <line x1="0" y1="0" x2="0" y2="-9" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="0" cy="0" r="2" fill="#16a34a" />
      </g>
      <text x="75" y="20" fill="#16a34a" fontSize="8" fontWeight="900">0.0m DELAY</text>
      <text x="75" y="29" fill="#047857" fontSize="6" fontWeight="700">ON-TIME SHIFT START</text>
    </svg>
  );
}

// ============================================================================
// 19. MANUFACTURING UNIT COST & MARGIN SYSTEM (UNIT_COST)
// ============================================================================
function UnitCostVisual0() {
  // Real-Time Part Costing: Waterfall cost breakdown (Material, Labor, Energy)
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(4, 120, 87, 0.05)" />
      {/* Stacked Cost Bar */}
      <g transform="translate(30, 16)">
        <rect x="0" y="0" width="30" height="14" fill="#047857" rx="1.5" />
        <text x="15" y="9" fill="#ffffff" fontSize="5" fontWeight="800" textAnchor="middle">MAT ₹42</text>
        <rect x="32" y="0" width="24" height="14" fill="#059669" rx="1.5" />
        <text x="44" y="9" fill="#ffffff" fontSize="5" fontWeight="800" textAnchor="middle">LAB ₹18</text>
        <rect x="58" y="0" width="18" height="14" fill="#10b981" rx="1.5" />
        <text x="67" y="9" fill="#ffffff" fontSize="5" fontWeight="800" textAnchor="middle">ENG ₹8</text>
      </g>
      <text x="135" y="20" fill="#047857" fontSize="9" fontWeight="900" textAnchor="end">₹68</text>
      <text x="135" y="28" fill="#065f46" fontSize="5.5" fontWeight="700" textAnchor="end">PER PART</text>
    </svg>
  );
}

function UnitCostVisual1() {
  // Margin Leakage Warning: Gauge catching micro-drift
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(202, 138, 4, 0.05)" />
      <g transform="translate(50, 32)">
        <path d="M-20 0 A20 20 0 0 1 20 0" stroke="#cbd5e1" strokeWidth="3" fill="none" />
        <path d="M-20 0 A20 20 0 0 1 12 -16" stroke="#16a34a" strokeWidth="3" fill="none" />
        <g className="m-gauge-needle-wiggle">
          <line x1="0" y1="0" x2="10" y2="-15" stroke="#ef4444" strokeWidth="1.8" />
        </g>
      </g>
      <text x="85" y="20" fill="#ca8a04" fontSize="8" fontWeight="900">LEAKAGE CAUGHT</text>
      <text x="85" y="29" fill="#a16207" fontSize="6" fontWeight="700">₹18 LAKHS SAVED</text>
    </svg>
  );
}

function UnitCostVisual2() {
  // Line Budget Variance: Positive green margin spread
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      <line x1="25" y1="28" x2="135" y2="28" stroke="#cbd5e1" strokeWidth="1" />
      <path d="M25 24 L55 20 L85 16 L115 11 L135 8" stroke="#16a34a" strokeWidth="2" fill="none" />
      <circle cx="135" cy="8" r="3.5" fill="#16a34a" className="m-probe-pulse" />
      <text x="25" y="14" fill="#16a34a" fontSize="7" fontWeight="900">+4.2% MARGIN</text>
    </svg>
  );
}

// ============================================================================
// 20. EXECUTIVE OPERATIONS DECISION CENTER (EXECUTIVE_COCKPIT)
// ============================================================================
function ExecVisual0() {
  // Unified Operational Mesh: 6 sector nodes connected to central core
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(99, 102, 241, 0.05)" />
      <g transform="translate(80, 23)">
        {/* Central Hub Core */}
        <circle cx="0" cy="0" r="9" fill="#4f46e5" className="m-probe-pulse" />
        <circle cx="0" cy="0" r="4" fill="#ffffff" />
        {/* 6 Outer Nodes */}
        <g className="m-spin-cw-slow">
          <circle cx="0" cy="-16" r="3" fill="#6366f1" />
          <line x1="0" y1="0" x2="0" y2="-16" stroke="#818cf8" strokeWidth="1" />
          <circle cx="14" cy="-8" r="3" fill="#6366f1" />
          <line x1="0" y1="0" x2="14" y2="-8" stroke="#818cf8" strokeWidth="1" />
          <circle cx="14" cy="8" r="3" fill="#6366f1" />
          <line x1="0" y1="0" x2="14" y2="8" stroke="#818cf8" strokeWidth="1" />
          <circle cx="0" cy="16" r="3" fill="#6366f1" />
          <line x1="0" y1="0" x2="0" y2="16" stroke="#818cf8" strokeWidth="1" />
          <circle cx="-14" cy="8" r="3" fill="#6366f1" />
          <line x1="0" y1="0" x2="-14" y2="8" stroke="#818cf8" strokeWidth="1" />
          <circle cx="-14" cy="-8" r="3" fill="#6366f1" />
          <line x1="0" y1="0" x2="-14" y2="-8" stroke="#818cf8" strokeWidth="1" />
        </g>
      </g>
      <text x="25" y="25" fill="#4f46e5" fontSize="6.5" fontWeight="800">6 PLANTS</text>
      <text x="135" y="25" fill="#4f46e5" fontSize="6.5" fontWeight="800" textAnchor="end">1 MESH</text>
    </svg>
  );
}

function ExecVisual1() {
  // Top 3 Executive Decisions: 3 priority cards with action toggles
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(22, 163, 74, 0.05)" />
      <g transform="translate(25, 12)">
        <rect x="0" y="0" width="30" height="22" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
        <text x="15" y="9" fill="#16a34a" fontSize="6" fontWeight="900" textAnchor="middle">#1 OEE</text>
        <circle cx="15" cy="15" r="2.5" fill="#16a34a" />
      </g>
      <g transform="translate(65, 12)">
        <rect x="0" y="0" width="30" height="22" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
        <text x="15" y="9" fill="#16a34a" fontSize="6" fontWeight="900" textAnchor="middle">#2 TARIFF</text>
        <circle cx="15" cy="15" r="2.5" fill="#16a34a" />
      </g>
      <g transform="translate(105, 12)">
        <rect x="0" y="0" width="30" height="22" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1" />
        <text x="15" y="9" fill="#16a34a" fontSize="6" fontWeight="900" textAnchor="middle">#3 SCRAP</text>
        <circle cx="15" cy="15" r="2.5" fill="#16a34a" />
      </g>
    </svg>
  );
}

function ExecVisual2() {
  // 1-Click Decision Dispatch: Command broadcast pulse
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(99, 102, 241, 0.05)" />
      <g transform="translate(45, 23)">
        <circle cx="0" cy="0" r="14" fill="#4f46e5" className="m-probe-pulse" />
        <polygon points="-3,-5 6,0 -3,5" fill="#ffffff" />
      </g>
      <text x="75" y="20" fill="#4f46e5" fontSize="8" fontWeight="900">DISPATCHED</text>
      <text x="75" y="29" fill="#3730a3" fontSize="6" fontWeight="700">INSTANT AUTO-SYNC</text>
    </svg>
  );
}

// Fallback for safety
function FallbackVisual({ title, color }) {
  return (
    <svg viewBox="0 0 160 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="160" height="46" rx="4" fill="rgba(0, 0, 0, 0.03)" />
      <g transform="translate(30, 23)">
        <circle cx="0" cy="0" r="10" stroke={color || '#2563eb'} strokeWidth="1.5" strokeDasharray="3 3" className="m-spin-cw-slow" fill="none" />
        <circle cx="0" cy="0" r="4" fill={color || '#2563eb'} className="m-probe-pulse" />
      </g>
      <text x="50" y="26" fill={color || '#0f172a'} fontSize="7" fontWeight="800">{title || 'Active System'}</text>
    </svg>
  );
}

// Map of all 20 agents and their 3 bespoke mission visual cards
const RENDERERS = {
  PRED_MAINT: [PredMaintVisual0, PredMaintVisual1, PredMaintVisual2],
  ENERGY_MGMT: [EnergyVisual0, EnergyVisual1, EnergyVisual2],
  UTILITIES_MGMT: [UtilVisual0, UtilVisual1, UtilVisual2],
  PROD_PLANNING: [ProdPlanVisual0, ProdPlanVisual1, ProdPlanVisual2],
  PROD_MONITORING: [ProdMonVisual0, ProdMonVisual1, ProdMonVisual2],
  OEE_PERFORMANCE: [OeeVisual0, OeeVisual1, OeeVisual2],
  DIGITAL_TWIN: [DigitalTwinVisual0, DigitalTwinVisual1, DigitalTwinVisual2],
  QUALITY_MGMT: [QualityVisual0, QualityVisual1, QualityVisual2],
  VISION_AI: [VisionVisual0, VisionVisual1, VisionVisual2],
  ENG_CHANGE: [EngChangeVisual0, EngChangeVisual1, EngChangeVisual2],
  TRACEABILITY: [TraceVisual0, TraceVisual1, TraceVisual2],
  INV_BUFFER: [InvBufferVisual0, InvBufferVisual1, InvBufferVisual2],
  SUPPLIER_RISK: [SupplierVisual0, SupplierVisual1, SupplierVisual2],
  SOURCING_RFQ: [SourcingVisual0, SourcingVisual1, SourcingVisual2],
  LOGISTICS_FLEET: [LogisticsVisual0, LogisticsVisual1, LogisticsVisual2],
  ORDER_FULFILLMENT: [OrderFulfillVisual0, OrderFulfillVisual1, OrderFulfillVisual2],
  EHS_SAFETY: [EhsVisual0, EhsVisual1, EhsVisual2],
  WORKFORCE_ALLOC: [WorkforceVisual0, WorkforceVisual1, WorkforceVisual2],
  UNIT_COST: [UnitCostVisual0, UnitCostVisual1, UnitCostVisual2],
  EXECUTIVE_COCKPIT: [ExecVisual0, ExecVisual1, ExecVisual2]
};
