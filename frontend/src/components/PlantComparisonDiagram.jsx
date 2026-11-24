import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Zap,
  Activity,
  Cpu,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export default function PlantComparisonDiagram({ onSelectModule }) {
  const [activeMode, setActiveMode] = useState('smart'); // 'traditional' or 'smart'
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const traditionalHotspots = [
    {
      id: 'breakdown',
      title: 'Spindle Bearing Failure & Line Halt',
      station: 'Line 02: CNC Precision Milling',
      stat: '4.2 hrs Downtime',
      cost: '$180,000 Loss',
      desc: 'Bearing vibration went undetected until thermal seizure occurred. Operators waited 3 hours for maintenance crew and replacement spares.',
      moduleSolved: 'Predictive Maintenance System (#04)'
    },
    {
      id: 'quality',
      title: 'Micro-Cracks Escaped Inspection',
      station: 'Station 04: Assembly & Quality Check',
      stat: '18.4% Defect Escapes',
      cost: 'Customer Recall Risk',
      desc: 'Human inspectors fatigued on night shift missed sub-surface tooling marks, shipping 420 defective steering knuckles to Tier-1 OEM.',
      moduleSolved: 'Automated Optical Inspection System (#06)'
    },
    {
      id: 'inventory',
      title: 'Critical Coil Stockout Halts Stamping',
      station: 'Raw Material Storage & Press 01',
      stat: 'Line Stoppage (2 Shifts)',
      cost: '$85,000 Penalty',
      desc: 'ERP inventory balance did not account for scrap rate. Stamping presses starved of SS-304 sheet metal with 7-day supplier lead time.',
      moduleSolved: 'Inventory System (#09) & Sourcing System (#11)'
    },
    {
      id: 'energy',
      title: 'Peak-Hour Power Spike Surcharge',
      station: 'Substation & Compressor Bank',
      stat: '480 kW Peak Spike',
      cost: '₹4.8 Lakhs Tariff Penalty',
      desc: 'All industrial chillers and compressors fired simultaneously during 18:00 - 21:00 peak grid tariff window without load management.',
      moduleSolved: 'Energy Management System (#13)'
    }
  ];

  const smartHotspots = [
    {
      id: 'pred_maint',
      title: 'Early Anomaly Detected (120 hrs RUL)',
      station: 'Module 04: Predictive Maintenance',
      stat: '92% Machine Health',
      benefit: 'Zero Unplanned Downtime',
      desc: 'Continuous vibration telemetry identified 3.2kHz harmonic. Maintenance work order automatically queued for planned Saturday 20-minute lubrication window.',
      moduleSolved: 'Predictive Maintenance System (#04)'
    },
    {
      id: 'optical_qa',
      title: '38ms Inline Optical Quality Scan',
      station: 'Module 06: Optical Inspection',
      stat: '99.1% First Pass Yield',
      benefit: 'Zero Defect Escapes',
      desc: 'High-speed optical inspection monitors dimensional tolerances and surface finishes at 1,200 parts/min, auto-diverting non-conforming items to rework immediately.',
      moduleSolved: 'Automated Optical Inspection System (#06)'
    },
    {
      id: 'smart_scm',
      title: 'Automated Multi-Vendor RFQ & Sourcing',
      station: 'Modules 09 & 11: Inventory & Sourcing',
      stat: 'Safety Buffer Preserved',
      benefit: 'Lead Time Cut by 68%',
      desc: 'Automated RFQ dispatched bid requests to approved suppliers the instant safety buffer dropped below 48-hr threshold. Awarded optimal delivery to XYZ Ltd.',
      moduleSolved: 'Automated Sourcing System (#11)'
    },
    {
      id: 'energy_opt',
      title: 'Dynamic Peak Shaving & Load Shifting',
      station: 'Module 13: Energy Management',
      stat: '12.8 MWh Saved (↓8.5%)',
      benefit: '₹14.8 Lakhs Saved/Mo',
      desc: 'Chiller banks pre-cooled cold wells before 18:00 peak hours, smoothly flattening grid demand curve and protecting factory from penalty surcharges.',
      moduleSolved: 'Energy Management System (#13)'
    }
  ];

  const currentHotspots = activeMode === 'traditional' ? traditionalHotspots : smartHotspots;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: 'rgb(var(--surface-rgb))',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid rgba(var(--line-rgb), 0.1)',
        boxShadow: '0 8px 32px rgba(var(--shadow-rgb), 0.05)'
      }}
    >
      {/* Top Header with Mode Switcher */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: activeMode === 'traditional' ? 'var(--status-danger)' : 'var(--brand-purple)'
            }}
          >
            Interactive Plant Flow Diagram
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            {activeMode === 'traditional'
              ? '🔴 The Traditional Plant: Reactive, Disconnected & Costly'
              : '🟣 The Synchronized Plant: Powered by GWC Unified Operations'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Compare how physical production, quality, maintenance, and energy flow change when governed by 20 connected operational modules.
          </p>
        </div>

        {/* Interactive Mode Switcher Toggle */}
        <div
          style={{
            display: 'flex',
            background: 'var(--muted-fill)',
            padding: '5px',
            borderRadius: '14px',
            border: '1px solid rgba(var(--line-rgb), 0.1)'
          }}
        >
          <button
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: activeMode === 'traditional' ? 'var(--status-danger)' : 'transparent',
              color: activeMode === 'traditional' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              setActiveMode('traditional');
              setSelectedHotspot(null);
            }}
          >
            <AlertTriangle size={15} /> Traditional Plant
          </button>
          <button
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: activeMode === 'smart' ? 'var(--brand-purple)' : 'transparent',
              color: activeMode === 'smart' ? '#fff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
            onClick={() => {
              setActiveMode('smart');
              setSelectedHotspot(null);
            }}
          >
            <Cpu size={15} /> GWC Synchronized Operations
          </button>
        </div>
      </div>

      {/* SVG PLANT FLOOR SCHEMATIC DIAGRAM */}
      <div
        style={{
          position: 'relative',
          borderRadius: '16px',
          background:
            activeMode === 'traditional'
              ? 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.06) 0%, transparent 70%), var(--kg-bg-2)'
              : 'radial-gradient(ellipse at center, rgba(111, 61, 186, 0.08) 0%, transparent 70%), var(--kg-bg-2)',
          border: `1.5px solid ${activeMode === 'traditional' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(111, 61, 186, 0.25)'}`,
          overflow: 'hidden',
          padding: '24px 16px'
        }}
      >
        <svg
          viewBox="0 0 960 380"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Linear Gradients */}
            <linearGradient id="conveyorGradRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#b91c1c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="conveyorGradPurple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6f3dba" />
              <stop offset="50%" stopColor="#4d8eeb" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Background Lines */}
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100, 116, 139, 0.08)" strokeWidth="1" />
          </pattern>
          <rect width="960" height="380" fill="url(#gridPattern)" />

          {/* CONVEYOR / DATA HIGHWAY LINE */}
          {activeMode === 'traditional' ? (
            /* Broken Red Dotted Line */
            <g>
              <path
                d="M 60 190 L 260 190"
                stroke="#ef4444"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Broken Point */}
              <circle cx="270" cy="190" r="14" fill="#ef4444" opacity="0.2" />
              <text x="270" y="195" fill="#ef4444" fontSize="16" fontWeight="bold" textAnchor="middle">✕</text>
              <path
                d="M 285 190 L 520 190"
                stroke="#ef4444"
                strokeWidth="6"
                strokeDasharray="8 6"
                opacity="0.4"
              />
              <path
                d="M 520 190 L 730 190"
                stroke="#ef4444"
                strokeWidth="6"
                strokeDasharray="8 6"
                opacity="0.3"
              />
              <path
                d="M 730 190 L 900 190"
                stroke="#64748b"
                strokeWidth="4"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              <text x="310" y="215" fill="#ef4444" fontSize="11" fontWeight="700">Line Halted 4.2h (Spindle Broken)</text>
            </g>
          ) : (
            /* Continuous Animated Green/Purple Data Highway */
            <g>
              <path
                d="M 60 190 L 900 190"
                stroke="url(#conveyorGradPurple)"
                strokeWidth="8"
                strokeLinecap="round"
                filter="url(#glowEffect)"
              />
              {/* Animated Moving Pulses Along Highway */}
              <circle cx="160" cy="190" r="5" fill="#fff" filter="url(#glowEffect)">
                <animate attributeName="cx" from="60" to="900" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx="340" cy="190" r="6" fill="#34d399" filter="url(#glowEffect)">
                <animate attributeName="cx" from="60" to="900" dur="4s" begin="1.3s" repeatCount="indefinite" />
              </circle>
              <circle cx="580" cy="190" r="5" fill="#60a5fa" filter="url(#glowEffect)">
                <animate attributeName="cx" from="60" to="900" dur="4s" begin="2.6s" repeatCount="indefinite" />
              </circle>
              <text x="480" y="215" fill="#10b981" fontSize="11" fontWeight="700" textAnchor="middle">
                Continuous Synchronized Flow • Takt Time: 42s • 100% On-Schedule
              </text>
            </g>
          )}

          {/* STATION 1: INVENTORY & RAW MATERIAL */}
          <g
            transform="translate(80, 80)"
            cursor="pointer"
            onClick={() => setSelectedHotspot(currentHotspots[2])}
          >
            <rect
              width="140"
              height="80"
              rx="12"
              fill={activeMode === 'traditional' ? '#1e293b' : '#1e1836'}
              stroke={activeMode === 'traditional' ? '#ef4444' : '#6f3dba'}
              strokeWidth="2"
            />
            <circle cx="28" cy="28" r="14" fill={activeMode === 'traditional' ? '#ef444425' : '#6f3dba25'} />
            <text x="28" y="33" fill={activeMode === 'traditional' ? '#ef4444' : '#a684ee'} fontSize="14" textAnchor="middle">📦</text>
            <text x="50" y="26" fill="#f1f5fd" fontSize="11" fontWeight="700">Raw Material</text>
            <text x="50" y="40" fill="#94a3b8" fontSize="9.5">Coils & Stamping</text>
            <rect
              x="12"
              y="52"
              width="116"
              height="18"
              rx="6"
              fill={activeMode === 'traditional' ? '#ef444420' : '#10b98120'}
            />
            <text
              x="70"
              y="65"
              fill={activeMode === 'traditional' ? '#ef4444' : '#10b981'}
              fontSize="9"
              fontWeight="700"
              textAnchor="middle"
            >
              {activeMode === 'traditional' ? '⚠️ Stockout Risk' : '✓ System 09/11 Active'}
            </text>
          </g>

          {/* STATION 2: CNC MACHINING (MAINTENANCE) */}
          <g
            transform="translate(290, 80)"
            cursor="pointer"
            onClick={() => setSelectedHotspot(currentHotspots[0])}
          >
            <rect
              width="150"
              height="80"
              rx="12"
              fill={activeMode === 'traditional' ? '#1e293b' : '#142339'}
              stroke={activeMode === 'traditional' ? '#ef4444' : '#4d8eeb'}
              strokeWidth={activeMode === 'traditional' ? 3 : 2}
            />
            <circle cx="28" cy="28" r="14" fill={activeMode === 'traditional' ? '#ef444430' : '#4d8eeb25'} />
            <text x="28" y="33" fill={activeMode === 'traditional' ? '#ef4444' : '#78acf5'} fontSize="14" textAnchor="middle">⚙️</text>
            <text x="50" y="26" fill="#f1f5fd" fontSize="11" fontWeight="700">CNC Machining</text>
            <text x="50" y="40" fill="#94a3b8" fontSize="9.5">Spindle Unit 07</text>
            <rect
              x="12"
              y="52"
              width="126"
              height="18"
              rx="6"
              fill={activeMode === 'traditional' ? '#ef4444' : '#4d8eeb20'}
            />
            <text
              x="75"
              y="65"
              fill={activeMode === 'traditional' ? '#fff' : '#4d8eeb'}
              fontSize="9"
              fontWeight="700"
              textAnchor="middle"
            >
              {activeMode === 'traditional' ? '🚨 SEIZURE BREAKDOWN' : '✓ 120h Predictive RUL'}
            </text>
          </g>

          {/* STATION 3: INLINE VISION INSPECTION */}
          <g
            transform="translate(510, 80)"
            cursor="pointer"
            onClick={() => setSelectedHotspot(currentHotspots[1])}
          >
            <rect
              width="150"
              height="80"
              rx="12"
              fill={activeMode === 'traditional' ? '#1e293b' : '#122b2b'}
              stroke={activeMode === 'traditional' ? '#ef4444' : '#31b7c3'}
              strokeWidth="2"
            />
            <circle cx="28" cy="28" r="14" fill={activeMode === 'traditional' ? '#ef444425' : '#31b7c325'} />
            <text x="28" y="33" fill={activeMode === 'traditional' ? '#ef4444' : '#4fd3de'} fontSize="14" textAnchor="middle">👁️</text>
            <text x="50" y="26" fill="#f1f5fd" fontSize="11" fontWeight="700">Vision Inspection</text>
            <text x="50" y="40" fill="#94a3b8" fontSize="9.5">Sub-surface Defects</text>
            <rect
              x="12"
              y="52"
              width="126"
              height="18"
              rx="6"
              fill={activeMode === 'traditional' ? '#ef444420' : '#10b98120'}
            />
            <text
              x="75"
              y="65"
              fill={activeMode === 'traditional' ? '#ef4444' : '#10b981'}
              fontSize="9"
              fontWeight="700"
              textAnchor="middle"
            >
              {activeMode === 'traditional' ? '❌ 18% Defects Escaped' : '✓ 99.1% FPY (38ms)'}
            </text>
          </g>

          {/* STATION 4: UTILITIES & POWER SUBSTATION */}
          <g
            transform="translate(730, 80)"
            cursor="pointer"
            onClick={() => setSelectedHotspot(currentHotspots[3])}
          >
            <rect
              width="150"
              height="80"
              rx="12"
              fill={activeMode === 'traditional' ? '#1e293b' : '#2b1d17'}
              stroke={activeMode === 'traditional' ? '#ef4444' : '#f58a3a'}
              strokeWidth="2"
            />
            <circle cx="28" cy="28" r="14" fill={activeMode === 'traditional' ? '#ef444425' : '#f58a3a25'} />
            <text x="28" y="33" fill={activeMode === 'traditional' ? '#ef4444' : '#ffab63'} fontSize="14" textAnchor="middle">⚡</text>
            <text x="50" y="26" fill="#f1f5fd" fontSize="11" fontWeight="700">Power Substation</text>
            <text x="50" y="40" fill="#94a3b8" fontSize="9.5">Compressors & Chillers</text>
            <rect
              x="12"
              y="52"
              width="126"
              height="18"
              rx="6"
              fill={activeMode === 'traditional' ? '#ef444420' : '#f58a3a20'}
            />
            <text
              x="75"
              y="65"
              fill={activeMode === 'traditional' ? '#ef4444' : '#f58a3a'}
              fontSize="9"
              fontWeight="700"
              textAnchor="middle"
            >
              {activeMode === 'traditional' ? '⚡ Tariff Spike Penalty' : '✓ Load-Shaved (-8.5%)'}
            </text>
          </g>

          {/* MODULE 20 EXECUTIVE COMMAND TOWER (Bottom Anchor) */}
          <g transform="translate(360, 260)">
            <rect
              width="240"
              height="90"
              rx="14"
              fill="linear-gradient(135deg, rgba(111, 61, 186, 0.25), rgba(77, 142, 235, 0.25))"
              stroke="var(--brand-purple)"
              strokeWidth="2.5"
            />
            <circle cx="36" cy="45" r="22" fill="var(--brand-purple)" />
            <text x="36" y="52" fill="#fff" fontSize="14" fontWeight="800" textAnchor="middle">20</text>
            <text x="70" y="38" fill="#f1f5fd" fontSize="13" fontWeight="800">Module 20: Executive Cockpit</text>
            <text x="70" y="54" fill="#a684ee" fontSize="11" fontWeight="600">Company Owner Multi-Plant Center</text>
            <text x="70" y="70" fill="#94a3b8" fontSize="10">Tamil Nadu • Pune • Sanand • Texas</text>

            {/* Pulsing Beams from Stations to Module 20 */}
            {activeMode === 'smart' && (
              <g stroke="var(--brand-purple)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6">
                <line x1="-200" y1="-100" x2="36" y2="20" />
                <line x1="-40" y1="-100" x2="100" y2="0" />
                <line x1="220" y1="-100" x2="180" y2="0" />
                <line x1="420" y1="-100" x2="230" y2="20" />
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* INTERACTIVE HOTSPOT DETAIL DRAWER */}
      {selectedHotspot ? (
        <div
          style={{
            padding: '20px 24px',
            borderRadius: '14px',
            background:
              activeMode === 'traditional'
                ? 'rgba(239, 68, 68, 0.08)'
                : 'linear-gradient(135deg, var(--brand-purple-soft), var(--brand-blue-soft))',
            border: `1.5px solid ${activeMode === 'traditional' ? 'var(--status-danger)' : 'var(--brand-purple)'}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '99px',
                  background: activeMode === 'traditional' ? 'var(--status-danger)' : 'var(--brand-purple)',
                  color: '#fff'
                }}
              >
                {selectedHotspot.station}
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {selectedHotspot.title}
              </h4>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5, maxWidth: '680px' }}>
              {selectedHotspot.desc}
            </p>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-purple)', marginTop: '8px' }}>
              {activeMode === 'traditional' ? `💡 Solved by: ${selectedHotspot.moduleSolved}` : `🚀 Powered by: ${selectedHotspot.moduleSolved}`}
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: '160px' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: activeMode === 'traditional' ? 'var(--status-danger)' : 'var(--status-success)' }}>
              {selectedHotspot.stat}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {activeMode === 'traditional' ? selectedHotspot.cost : selectedHotspot.benefit}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            fontSize: '12.5px',
            color: 'var(--text-muted)',
            padding: '8px'
          }}
        >
          👉 Click on any station above (Raw Material, CNC Machining, Vision Inspection, Substation) to inspect the manufacturing impact!
        </div>
      )}
    </div>
  );
}
