import React from 'react';

/**
 * Informative Manufacturing Company Background
 * Renders technical manufacturing plant blueprints, machinery CAD schematics,
 * plant layout coordinates, and live shop floor telemetry HUDs based on the selected sector.
 */
export default function ManufacturingBackground({ sectorId, sectorColor = '#6f3dba' }) {
  return (
    <div
      className="mfg-bg-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.88,
        transition: 'opacity 0.5s ease'
      }}
    >
      {/* 1. INDUSTRIAL TECHNICAL BLUEPRINT GRID */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Technical Grid */}
          <pattern id="mfg-grid-small" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(111, 61, 186, 0.05)" strokeWidth="0.8" />
          </pattern>
          <pattern id="mfg-grid-large" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="url(#mfg-grid-small)" />
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(111, 61, 186, 0.12)" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="1.5" fill="rgba(111, 61, 186, 0.25)" />
            <circle cx="120" cy="0" r="1.5" fill="rgba(111, 61, 186, 0.25)" />
            <circle cx="0" cy="120" r="1.5" fill="rgba(111, 61, 186, 0.25)" />
            <circle cx="120" cy="120" r="1.5" fill="rgba(111, 61, 186, 0.25)" />
          </pattern>

          {/* Glowing Radial Sector Gradients */}
          <radialGradient id="sectorAmbientGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={sectorColor} stopOpacity="0.14" />
            <stop offset="55%" stopColor={sectorColor} stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background Grid Fill */}
        <rect width="100%" height="100%" fill="url(#mfg-grid-large)" />
        <rect width="100%" height="100%" fill="url(#sectorAmbientGlow)" />

        {/* 2. TECHNICAL SCHEMATIC OVERLAYS BASED ON SECTOR */}
        {(!sectorId || sectorId === 'global') && <GlobalPlantSchematic color={sectorColor} />}
        {sectorId === 'production' && <ProductionSchematic color={sectorColor} />}
        {sectorId === 'maintenance' && <MaintenanceSchematic color={sectorColor} />}
        {sectorId === 'quality' && <QualitySchematic color={sectorColor} />}
        {sectorId === 'supplychain' && <SupplyChainSchematic color={sectorColor} />}
        {sectorId === 'employees' && <EmployeesSchematic color={sectorColor} />}
        {sectorId === 'finance' && <FinanceSchematic color={sectorColor} />}
      </svg>

      {/* 3. TECHNICAL SHOP FLOOR TELEMETRY WATERMARKS (INFORMATIVE HUD) */}
      <div className="mfg-hud-overlay">
        {/* Top-Left Coordinate HUD */}
        <div className="hud-corner-box top-left">
          <div className="hud-metric-row">
            <span className="hud-label">PLANT GRID:</span>
            <span className="hud-val">X: 142.80 • Y: 890.15 • Z: 0.00</span>
          </div>
          <div className="hud-metric-row">
            <span className="hud-label">TELEMETRY CYCLE:</span>
            <span className="hud-val">600s Task Scheduler • Neon DB Active</span>
          </div>
          <div className="hud-metric-row">
            <span className="hud-label">EDGE GATEWAY:</span>
            <span className="hud-val">10.244.101.228 (Motherson Line 4)</span>
          </div>
        </div>

        {/* Top-Right Active State HUD */}
        <div className="hud-corner-box top-right">
          <div className="hud-metric-row">
            <span className="hud-label">FACILITY SCOPE:</span>
            <span className="hud-val" style={{ color: sectorColor }}>
              6 Multi-State Plants (TN, KA, MH, GJ, HR)
            </span>
          </div>
          <div className="hud-metric-row">
            <span className="hud-label">ACTIVE SECTOR:</span>
            <span className="hud-val" style={{ color: sectorColor, fontWeight: 700 }}>
              {sectorId ? sectorId.toUpperCase() : 'GWC INDUSTRIAL AI MESH'}
            </span>
          </div>
          <div className="hud-metric-row">
            <span className="hud-label">STATUS:</span>
            <span className="hud-val">● 19 Autonomous Systems Synchronized</span>
          </div>
        </div>

        {/* Bottom Technical Footnote */}
        <div className="hud-bottom-bar">
          <span>MANUFACTURING EXECUTION ARCHITECTURE • ISO-9001 / IATF-16949 / ISO-45001 COMPLIANT</span>
          <span>SUB-SECOND EDGE TELEMETRY • CLOSED-LOOP AUTONOMOUS RESOLUTION</span>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* CASE 1: GLOBAL 6-PLANT MANUFACTURING BLUEPRINT SCHEMATIC                  */
/* ========================================================================= */
function GlobalPlantSchematic({ color }) {
  return (
    <g className="global-plant-schematic" opacity="0.65">
      {/* Plant Bay Outline Layout */}
      <rect x="60" y="60" width="460" height="280" rx="6" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="4 4" />
      <text x="75" y="85" fill={color} fontSize="11" fontWeight="800" letterSpacing="1">
        FACILITY LAYOUT: CHENNAI & HOSUR HEAVY STAMPING (IN-TN-01 / 02)
      </text>

      {/* Assembly Bays */}
      <rect x="80" y="105" width="120" height="90" rx="4" fill="none" stroke="rgba(111,61,186,0.3)" strokeWidth="1" />
      <text x="90" y="125" fill="#64748b" fontSize="9" fontWeight="700">BAY A: STAMPING PRESSES</text>
      <text x="90" y="145" fill="#94a3b8" fontSize="8">Press 01 - 04 (800T - 2000T)</text>
      <text x="90" y="165" fill="#10b981" fontSize="8">● OEE: 88.4% • 1,410 Pcs/hr</text>

      <rect x="220" y="105" width="120" height="90" rx="4" fill="none" stroke="rgba(111,61,186,0.3)" strokeWidth="1" />
      <text x="230" y="125" fill="#64748b" fontSize="9" fontWeight="700">BAY B: ROBOTIC WELD CELLS</text>
      <text x="230" y="145" fill="#94a3b8" fontSize="8">16 KUKA 6-Axis Arms</text>
      <text x="230" y="165" fill="#10b981" fontSize="8">● 38ms AOI Weld Inspection</text>

      <rect x="360" y="105" width="140" height="90" rx="4" fill="none" stroke="rgba(111,61,186,0.3)" strokeWidth="1" />
      <text x="370" y="125" fill="#64748b" fontSize="9" fontWeight="700">BAY C: HIGH-BAY ASRS BUFFER</text>
      <text x="370" y="145" fill="#94a3b8" fontSize="8">4,200 Pallet Locations</text>
      <text x="370" y="165" fill="#0284c7" fontSize="8">● 14.2 Days Stock Cover</text>

      {/* AGV Transit Route Line */}
      <path d="M 140 230 L 430 230" stroke={color} strokeWidth="1.5" strokeDasharray="6 4" />
      <circle cx="280" cy="230" r="5" fill={color} />
      <text x="140" y="250" fill="#64748b" fontSize="8" fontWeight="600">
        AGV AUTONOMOUS LOGISTICS CORRIDOR #01 (12 AGVs ACTIVE)
      </text>

      {/* Right Side Plant Layout Blueprint */}
      <g transform="translate(620, 60)">
        <rect x="0" y="0" width="380" height="240" rx="6" fill="none" stroke="rgba(100,116,139,0.3)" strokeWidth="1" strokeDasharray="3 3" />
        <text x="15" y="25" fill="#64748b" fontSize="10" fontWeight="800">
          PUNE & SANAND POWERTRAIN & INTEGRATION (IN-MH-01 / IN-GJ-01)
        </text>

        {/* Machine Nodes */}
        <circle cx="60" cy="80" r="24" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="60" cy="80" r="14" fill="none" stroke="rgba(16,185,129,0.4)" strokeWidth="1" strokeDasharray="2 2" />
        <text x="45" y="83" fill={color} fontSize="8" fontWeight="800">CNC-01</text>
        <text x="35" y="115" fill="#64748b" fontSize="8">1,480 RPM</text>

        <path d="M 84 80 L 160 80" stroke="rgba(100,116,139,0.4)" strokeWidth="1.5" strokeDasharray="4 2" />

        <circle cx="185" cy="80" r="24" fill="none" stroke={color} strokeWidth="1" />
        <text x="170" y="83" fill={color} fontSize="8" fontWeight="800">CNC-02</text>
        <text x="160" y="115" fill="#64748b" fontSize="8">1,485 RPM</text>

        <path d="M 210 80 L 290 80" stroke="rgba(100,116,139,0.4)" strokeWidth="1.5" strokeDasharray="4 2" />

        <rect x="290" y="60" width="70" height="40" rx="4" fill="none" stroke="#10b981" strokeWidth="1" />
        <text x="298" y="78" fill="#10b981" fontSize="8" fontWeight="800">AOI SCAN</text>
        <text x="298" y="92" fill="#64748b" fontSize="7.5">99.8% PASS</text>
      </g>
    </g>
  );
}

/* ========================================================================= */
/* CASE 2: PRODUCTION & PLANNING SCHEMATICS (PRESSES & TAKT CYCLES)          */
/* ========================================================================= */
function ProductionSchematic({ color }) {
  return (
    <g className="production-schematic" opacity="0.7">
      {/* Stamping Press Cross Section CAD Drawing */}
      <g transform="translate(100, 80)">
        <rect x="0" y="0" width="280" height="320" rx="8" fill="none" stroke={color} strokeWidth="1.5" />
        <text x="15" y="25" fill={color} fontSize="11" fontWeight="800">
          HEAVY STAMPING PRESS 2000T (CAD SCHEMATIC)
        </text>
        {/* Crown & Ram */}
        <rect x="30" y="45" width="220" height="40" fill="rgba(111,61,186,0.1)" stroke={color} strokeWidth="1" />
        <text x="95" y="70" fill={color} fontSize="9" fontWeight="700">HYDRAULIC CROWN (2,000T)</text>

        {/* Vertical Guide Pillars */}
        <line x1="50" y1="85" x2="50" y2="240" stroke={color} strokeWidth="2.5" />
        <line x1="230" y1="85" x2="230" y2="240" stroke={color} strokeWidth="2.5" />

        {/* Moving Bolster & Die */}
        <rect x="40" y="140" width="200" height="35" rx="3" fill="rgba(111,61,186,0.15)" stroke={color} strokeWidth="1" />
        <text x="80" y="162" fill="#ffffff" fontSize="9" fontWeight="800">DIE BED #A-42 (ACTIVE)</text>

        {/* Telemetry Annotations */}
        <line x1="245" y1="155" x2="310" y2="155" stroke="#10b981" strokeWidth="1" />
        <text x="315" y="152" fill="#10b981" fontSize="9" fontWeight="700">STROKE SPEED: 38 SPM</text>
        <text x="315" y="165" fill="#64748b" fontSize="8">Tonnage Load: 1,840T Peak</text>

        <rect x="30" y="240" width="220" height="50" fill="none" stroke={color} strokeWidth="1" />
        <text x="100" y="270" fill="#94a3b8" fontSize="9">BED FOUNDATION</text>
      </g>

      {/* Takt Time & Real-Time Flow Vectors */}
      <g transform="translate(680, 100)">
        <rect x="0" y="0" width="340" height="220" rx="8" fill="rgba(0,0,0,0.4)" stroke="rgba(111,61,186,0.3)" strokeWidth="1" />
        <text x="15" y="25" fill={color} fontSize="11" fontWeight="800">FINITE SCHEDULE & TAKT PACING</text>

        <path d="M 20 80 Q 80 40 160 80 T 300 80" fill="none" stroke="#10b981" strokeWidth="2" />
        <circle cx="160" cy="80" r="4" fill="#10b981" />
        <text x="20" y="115" fill="#64748b" fontSize="9">PLANNED TAKT: 42.0 SEC</text>
        <text x="160" y="115" fill="#10b981" fontSize="9" fontWeight="700">ACTUAL: 39.8 SEC (OPTIMAL)</text>

        <line x1="20" y1="145" x2="320" y2="145" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        <text x="20" y="170" fill="#94a3b8" fontSize="8.5">SHIFT 1 ADHERENCE: 98.2%</text>
        <text x="20" y="190" fill="#94a3b8" fontSize="8.5">LINE 1 THROUGHPUT: 11,280 / 12,000 UNITS</text>
        <text x="180" y="190" fill="#047857" fontSize="8.5" fontWeight="700">OEE ATTAINMENT: 87.4%</text>
      </g>
    </g>
  );
}

/* ========================================================================= */
/* CASE 3: MAINTENANCE & UTILITIES SCHEMATIC (VIBRATION & PIPING)             */
/* ========================================================================= */
function MaintenanceSchematic({ color }) {
  return (
    <g className="maintenance-schematic" opacity="0.7">
      {/* Vibration FFT Waveform Telemetry */}
      <g transform="translate(80, 90)">
        <rect x="0" y="0" width="380" height="260" rx="8" fill="none" stroke={color} strokeWidth="1.2" />
        <text x="15" y="25" fill={color} fontSize="11" fontWeight="800">
          PREDICTIVE VIBRATION & BEARING ACOUSTICS (MOTOR #04)
        </text>

        {/* FFT Waveform */}
        <path
          d="M 20 120 Q 50 40 80 120 T 140 120 T 170 60 T 200 120 T 250 120 T 280 80 T 320 120 T 360 120"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
        />
        <line x1="20" y1="120" x2="360" y2="120" stroke="rgba(245,158,11,0.2)" strokeWidth="1" strokeDasharray="2 2" />

        {/* Anomaly Alarm Threshold Line */}
        <line x1="20" y1="50" x2="360" y2="50" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" />
        <text x="240" y="45" fill="#ef4444" fontSize="8" fontWeight="700">CRITICAL THRESHOLD: 4.5 mm/s</text>

        <rect x="20" y="160" width="160" height="70" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
        <text x="30" y="180" fill="#f59e0b" fontSize="9" fontWeight="700">BEARING VELOCITY: 1.8 mm/s</text>
        <text x="30" y="200" fill="#10b981" fontSize="8.5">● Status: Healthy (ISO 10816)</text>
        <text x="30" y="218" fill="#64748b" fontSize="8">Remaining Lifespan: 1,840 Hrs</text>

        <rect x="200" y="160" width="160" height="70" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
        <text x="210" y="180" fill="#f59e0b" fontSize="9" fontWeight="700">MOTOR TEMPERATURE: 58.4°C</text>
        <text x="210" y="200" fill="#10b981" fontSize="8.5">● Thermal Rise: Normal</text>
        <text x="210" y="218" fill="#64748b" fontSize="8">Stator Insulation: 100% OK</text>
      </g>

      {/* Utilities Piping & Pressure Schematic */}
      <g transform="translate(680, 90)">
        <rect x="0" y="0" width="360" height="260" rx="8" fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
        <text x="15" y="25" fill="#f59e0b" fontSize="11" fontWeight="800">
          PLANT UTILITIES: COMPRESSED AIR & 33kV TARIFF
        </text>

        {/* Piping Lines */}
        <path d="M 30 90 L 150 90 L 150 170 L 320 170" fill="none" stroke="#0284c7" strokeWidth="3" />
        <circle cx="150" cy="90" r="6" fill="#0284c7" />
        <circle cx="240" cy="170" r="6" fill="#0284c7" />

        <text x="30" y="75" fill="#0284c7" fontSize="9" fontWeight="700">HEADER PRESSURE: 6.8 BAR</text>
        <text x="160" y="160" fill="#10b981" fontSize="8.5">● Flow: 42 m³/min (Zero Leaks)</text>

        <rect x="30" y="195" width="300" height="45" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(245,158,11,0.2)" strokeWidth="1" />
        <text x="40" y="215" fill="#f59e0b" fontSize="9" fontWeight="700">ELECTRICITY TARIFF OPTIMIZATION:</text>
        <text x="40" y="230" fill="#64748b" fontSize="8.5">Peak Load Shaving Active • -18.4% Unit Energy Cost Savings</text>
      </g>
    </g>
  );
}

/* ========================================================================= */
/* CASE 4: QUALITY & ENGINEERING SCHEMATICS (AOI RETICLE & GENEALOGY)        */
/* ========================================================================= */
function QualitySchematic({ color }) {
  return (
    <g className="quality-schematic" opacity="0.7">
      {/* AOI Vision Inspection Reticle */}
      <g transform="translate(100, 80)">
        <rect x="0" y="0" width="340" height="300" rx="8" fill="none" stroke={color} strokeWidth="1.2" />
        <text x="15" y="25" fill={color} fontSize="11" fontWeight="800">
          AUTOMATED OPTICAL INSPECTION (AOI RETICLE)
        </text>

        {/* Targeting Reticle */}
        <circle cx="170" cy="140" r="70" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="4 4" />
        <circle cx="170" cy="140" r="30" fill="none" stroke="#10b981" strokeWidth="1.5" />
        <line x1="80" y1="140" x2="260" y2="140" stroke={color} strokeWidth="1" />
        <line x1="170" y1="50" x2="170" y2="230" stroke={color} strokeWidth="1" />

        {/* Laser Sweep Scanline */}
        <line x1="90" y1="120" x2="250" y2="120" stroke="#06b6d4" strokeWidth="2" opacity="0.8" />

        <rect x="30" y="235" width="280" height="45" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(2,132,199,0.3)" strokeWidth="1" />
        <text x="40" y="253" fill="#10b981" fontSize="9" fontWeight="800">38ms EDGE INFERENCE: PART PASS</text>
        <text x="40" y="270" fill="#64748b" fontSize="8">Dimensional Drift: ±0.012mm (Within ±0.020mm Tolerance)</text>
      </g>

      {/* Traceability & Serial Genealogy Chain */}
      <g transform="translate(680, 80)">
        <rect x="0" y="0" width="360" height="300" rx="8" fill="none" stroke="rgba(2,132,199,0.3)" strokeWidth="1" />
        <text x="15" y="25" fill="#0284c7" fontSize="11" fontWeight="800">
          END-TO-END PRODUCT GENEALOGY (SUB-SECOND TRACE)
        </text>

        {/* Node Chain */}
        <g transform="translate(25, 60)">
          <rect x="0" y="0" width="310" height="40" rx="4" fill="rgba(0,0,0,0.3)" stroke={color} strokeWidth="1" />
          <text x="15" y="20" fill={color} fontSize="9" fontWeight="700">1. RAW MATERIAL COIL LOT #ST-98214</text>
          <text x="15" y="32" fill="#64748b" fontSize="8">Vendor: JSW Steel • Heat #H-4120 • Cert ISO-9001</text>
        </g>

        <line x1="180" y1="100" x2="180" y2="125" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />

        <g transform="translate(25, 125)">
          <rect x="0" y="0" width="310" height="40" rx="4" fill="rgba(0,0,0,0.3)" stroke={color} strokeWidth="1" />
          <text x="15" y="20" fill={color} fontSize="9" fontWeight="700">2. STAMPED CHASSIS PANEL #SN-2026-0814</text>
          <text x="15" y="32" fill="#64748b" fontSize="8">Press 02 • Die A-42 • Shift A (Chennai Plant IN-TN-01)</text>
        </g>

        <line x1="180" y1="165" x2="180" y2="190" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />

        <g transform="translate(25, 190)">
          <rect x="0" y="0" width="310" height="40" rx="4" fill="rgba(0,0,0,0.3)" stroke={color} strokeWidth="1" />
          <text x="15" y="20" fill="#10b981" fontSize="9" fontWeight="700">3. FINISHED ASSEMBLY SERIAL #ASM-849201</text>
          <text x="15" y="32" fill="#64748b" fontSize="8">100% Verified • Shipped to OEM Partner</text>
        </g>

        <text x="35" y="265" fill="#10b981" fontSize="9" fontWeight="700">RECONSTRUCTION LATENCY: 340ms</text>
      </g>
    </g>
  );
}

/* ========================================================================= */
/* CASE 5: SUPPLY CHAIN & LOGISTICS (ASRS WAREHOUSE & FLEET GPS)             */
/* ========================================================================= */
function SupplyChainSchematic({ color }) {
  return (
    <g className="supplychain-schematic" opacity="0.7">
      {/* High-Bay ASRS Warehouse Blueprint */}
      <g transform="translate(80, 80)">
        <rect x="0" y="0" width="380" height="300" rx="8" fill="none" stroke={color} strokeWidth="1.2" />
        <text x="15" y="25" fill={color} fontSize="11" fontWeight="800">
          HIGH-BAY ASRS WAREHOUSE ELEVATION (BAY 1 - 8)
        </text>

        {/* Warehouse Rack Grid */}
        <g transform="translate(25, 50)">
          {[0, 1, 2, 3].map((row) => (
            <g key={row} transform={`translate(0, ${row * 35})`}>
              {[0, 1, 2, 3, 4, 5].map((col) => (
                <rect
                  key={col}
                  x={col * 52}
                  y="0"
                  width="48"
                  height="28"
                  rx="3"
                  fill="rgba(5,150,105,0.08)"
                  stroke={color}
                  strokeWidth="0.8"
                />
              ))}
            </g>
          ))}
        </g>

        {/* Stock Metrics */}
        <rect x="25" y="210" width="330" height="65" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(5,150,105,0.3)" strokeWidth="1" />
        <text x="35" y="230" fill="#10b981" fontSize="9" fontWeight="700">ACTIVE BUFFER: 14.2 DAYS COVER</text>
        <text x="35" y="248" fill="#64748b" fontSize="8.5">4,200 / 4,500 Pallet Slots Utilized (93.3% Density)</text>
        <text x="35" y="265" fill="#64748b" fontSize="8">Zero Critical Part Shortages across 6 Plant Buffer Stocks</text>
      </g>

      {/* Fleet Dispatch & Carrier OTIF GPS Network */}
      <g transform="translate(680, 80)">
        <rect x="0" y="0" width="360" height="300" rx="8" fill="none" stroke="rgba(5,150,105,0.3)" strokeWidth="1" />
        <text x="15" y="25" fill="#059669" fontSize="11" fontWeight="800">
          LOGISTICS & INTER-PLANT TRANSIT NETWORK
        </text>

        {/* Route Coordinates */}
        <circle cx="80" cy="110" r="14" fill="rgba(5,150,105,0.2)" stroke="#10b981" strokeWidth="1" />
        <text x="65" y="113" fill="#10b981" fontSize="8" fontWeight="800">CHENNAI</text>

        <path d="M 94 110 Q 180 80 260 140" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />

        <circle cx="260" cy="140" r="14" fill="rgba(5,150,105,0.2)" stroke="#10b981" strokeWidth="1" />
        <text x="245" y="143" fill="#10b981" fontSize="8" fontWeight="800">PUNE</text>

        <rect x="25" y="195" width="310" height="80" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(5,150,105,0.2)" strokeWidth="1" />
        <text x="35" y="215" fill="#10b981" fontSize="9" fontWeight="700">VENDOR OTIF SCORE: 96.8%</text>
        <text x="35" y="235" fill="#64748b" fontSize="8.5">Carrier GPS Tracking: 18 Trucks In Transit</text>
        <text x="35" y="255" fill="#64748b" fontSize="8.5">Customer Order Fulfillment Rate: 98.9% On-Time</text>
      </g>
    </g>
  );
}

/* ========================================================================= */
/* CASE 6: EMPLOYEES & WORKPLACE SAFETY (ZONING & SKILL MATRIX)              */
/* ========================================================================= */
function EmployeesSchematic({ color }) {
  return (
    <g className="employees-schematic" opacity="0.7">
      {/* Plant Safety Zoning Blueprint */}
      <g transform="translate(100, 80)">
        <rect x="0" y="0" width="360" height="280" rx="8" fill="none" stroke={color} strokeWidth="1.2" />
        <text x="15" y="25" fill={color} fontSize="11" fontWeight="800">
          PLANT DIGITAL SAFETY ZONES & DIGITAL LOTO
        </text>

        {/* Safety Zones */}
        <rect x="30" y="55" width="140" height="90" rx="4" fill="rgba(225,29,72,0.06)" stroke={color} strokeWidth="1" />
        <text x="40" y="75" fill={color} fontSize="9" fontWeight="700">ZONE A: STAMPING</text>
        <text x="40" y="95" fill="#10b981" fontSize="8">● LOTO Lock: 100% Verified</text>
        <text x="40" y="115" fill="#64748b" fontSize="8">Zero Breaches Detected</text>

        <rect x="190" y="55" width="140" height="90" rx="4" fill="rgba(225,29,72,0.06)" stroke={color} strokeWidth="1" />
        <text x="200" y="75" fill={color} fontSize="9" fontWeight="700">ZONE B: ROBOTIC ARMS</text>
        <text x="200" y="95" fill="#10b981" fontSize="8">● Safety Curtains Active</text>
        <text x="200" y="115" fill="#64748b" fontSize="8">Personnel Interlock 100%</text>

        {/* Safety Attainment Banner */}
        <rect x="30" y="170" width="300" height="65" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(225,29,72,0.3)" strokeWidth="1" />
        <text x="40" y="195" fill="#10b981" fontSize="11" fontWeight="800">428 CONSECUTIVE DAYS ZERO LTI</text>
        <text x="40" y="215" fill="#64748b" fontSize="8.5">ISO-45001 & OSHA Audit Ready across all 6 Facilities</text>
      </g>

      {/* Workforce Certified Skill Matrix Balance */}
      <g transform="translate(680, 80)">
        <rect x="0" y="0" width="360" height="280" rx="8" fill="none" stroke="rgba(225,29,72,0.3)" strokeWidth="1" />
        <text x="15" y="25" fill="#e11d48" fontSize="11" fontWeight="800">
          SHIFT STAFFING & OPERATOR SKILL MATRIX
        </text>

        <g transform="translate(30, 60)">
          <text x="0" y="15" fill="#94a3b8" fontSize="9">SHIFT 1 STAFFING ATTAINMENT: 98.4%</text>
          <rect x="0" y="25" width="300" height="12" rx="6" fill="rgba(255,255,255,0.1)" />
          <rect x="0" y="25" width="295" height="12" rx="6" fill="#10b981" />

          <text x="0" y="65" fill="#94a3b8" fontSize="9">CRITICAL STATION CERTIFICATION: 100%</text>
          <rect x="0" y="75" width="300" height="12" rx="6" fill="rgba(255,255,255,0.1)" />
          <rect x="0" y="75" width="300" height="12" rx="6" fill="#6f3dba" />

          <text x="0" y="115" fill="#94a3b8" fontSize="9">CROSS-TRAINED RESERVE TECHNICIANS: 128 TECHS</text>
          <rect x="0" y="125" width="300" height="12" rx="6" fill="rgba(255,255,255,0.1)" />
          <rect x="0" y="125" width="260" height="12" rx="6" fill="#0284c7" />

          <text x="0" y="165" fill="#64748b" fontSize="8.5">Automated Absence Skill Redeployment: &lt;15 Minutes</text>
        </g>
      </g>
    </g>
  );
}

/* ========================================================================= */
/* CASE 7: FINANCE & UNIT COST BREAKDOWN SCHEMATIC                           */
/* ========================================================================= */
function FinanceSchematic({ color }) {
  return (
    <g className="finance-schematic" opacity="0.7">
      <g transform="translate(200, 90)">
        <rect x="0" y="0" width="700" height="280" rx="8" fill="none" stroke={color} strokeWidth="1.2" />
        <text x="25" y="30" fill={color} fontSize="12" fontWeight="800">
          MANUFACTURING UNIT COST BREAKDOWN & STANDARD VARIANCE (₹842.10 / UNIT)
        </text>

        {/* Cost Bars */}
        <g transform="translate(40, 65)">
          <rect x="0" y="0" width="160" height="90" rx="4" fill="rgba(79,70,229,0.1)" stroke={color} strokeWidth="1" />
          <text x="15" y="25" fill={color} fontSize="10" fontWeight="700">DIRECT BOM MATERIAL</text>
          <text x="15" y="55" fill="#ffffff" fontSize="16" fontWeight="800">₹538.40</text>
          <text x="15" y="75" fill="#10b981" fontSize="8">● -1.4% Steel Index Gain</text>

          <rect x="200" y="0" width="160" height="90" rx="4" fill="rgba(79,70,229,0.1)" stroke={color} strokeWidth="1" />
          <text x="15" y="25" fill={color} fontSize="10" fontWeight="700" transform="translate(200, 0)">DIRECT LABOR</text>
          <text x="15" y="55" fill="#ffffff" fontSize="16" fontWeight="800" transform="translate(200, 0)">₹182.20</text>
          <text x="15" y="75" fill="#10b981" fontSize="8" transform="translate(200, 0)">● 98.4% Staff Efficiency</text>

          <rect x="400" y="0" width="160" height="90" rx="4" fill="rgba(79,70,229,0.1)" stroke={color} strokeWidth="1" />
          <text x="15" y="25" fill={color} fontSize="10" fontWeight="700" transform="translate(400, 0)">ENERGY & OVERHEAD</text>
          <text x="15" y="55" fill="#ffffff" fontSize="16" fontWeight="800" transform="translate(400, 0)">₹121.50</text>
          <text x="15" y="75" fill="#10b981" fontSize="8" transform="translate(400, 0)">● -18.4% Peak Tariff Shift</text>
        </g>

        {/* Net Savings Attribution */}
        <rect x="40" y="185" width="620" height="60" rx="4" fill="rgba(0,0,0,0.3)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
        <text x="60" y="210" fill="#10b981" fontSize="11" fontWeight="800">
          CUMULATIVE ANNUALIZED SAVINGS: ₹14.8 Cr ACROSS 6 PRODUCTION PLANTS
        </text>
        <text x="60" y="230" fill="#64748b" fontSize="9">
          Real-time variance decomposition between Standard SAP BOM Cost vs. Neon DB Actuals.
        </text>
      </g>
    </g>
  );
}
