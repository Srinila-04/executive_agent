import React from 'react';
import '../styles/realisticSymbols.css';

/**
 * 1. REALISTIC RUNNING MACHINE SYMBOL
 * Clean 24x24 vector: Dual intermeshing industrial gears spinning continuously.
 */
export function RealisticMachineSymbol({ size = 22, color = '#2563eb' }) {
  return (
    <div className="realistic-symbol-box machine-box" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="machine-svg"
      >
        <defs>
          <linearGradient id="mGearGrad1" x1="2" y1="2" x2="18" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor={color} />
            <stop offset="1" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="mGearGrad2" x1="12" y1="12" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#64748b" />
            <stop offset="1" stopColor="#334155" />
          </linearGradient>
        </defs>

        {/* Primary Main Gear (Center: 10, 10 - Radius: 6 - Clockwise) */}
        <g className="gear-main-clockwise">
          {/* 6 Teeth */}
          <rect x="8.5" y="2" width="3" height="16" rx="1" fill="url(#mGearGrad1)" />
          <rect x="2" y="8.5" width="16" height="3" rx="1" fill="url(#mGearGrad1)" />
          <rect x="4" y="4" width="12" height="12" rx="1" transform="rotate(45 10 10)" fill="url(#mGearGrad1)" />
          {/* Main Gear Disc */}
          <circle cx="10" cy="10" r="5" fill="url(#mGearGrad1)" />
          <circle cx="10" cy="10" r="2.8" fill="#ffffff" />
          <circle cx="10" cy="10" r="1.5" fill={color} />
        </g>

        {/* Secondary Intermeshed Gear (Center: 17, 16 - Radius: 4 - Counter-Clockwise) */}
        <g className="gear-sub-counter">
          <rect x="15.8" y="11" width="2.4" height="10" rx="0.8" fill="url(#mGearGrad2)" />
          <rect x="12" y="14.8" width="10" height="2.4" rx="0.8" fill="url(#mGearGrad2)" />
          <rect x="13.2" y="13.2" width="7.6" height="7.6" rx="0.8" transform="rotate(45 17 16)" fill="url(#mGearGrad2)" />
          <circle cx="17" cy="16" r="3.2" fill="url(#mGearGrad2)" />
          <circle cx="17" cy="16" r="1.5" fill="#ffffff" />
          <circle cx="17" cy="16" r="0.8" fill="#334155" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 2. REALISTIC MOVING SUPPLY CHAIN TRUCK
 * Clean 24x24 vector: Moving cargo truck with spinning wheels and gentle chassis bob.
 */
export function RealisticSupplyChainSymbol({ size = 22, color = '#ea580c' }) {
  return (
    <div className="realistic-symbol-box truck-box" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="truck-svg"
      >
        <defs>
          <linearGradient id="tBodyGrad" x1="1" y1="5" x2="14" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor={color} />
            <stop offset="1" stopColor="#c2410c" />
          </linearGradient>
          <linearGradient id="tCabinGrad" x1="14" y1="8" x2="22" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Bouncing Truck Body */}
        <g className="truck-chassis-group">
          {/* Cargo Container */}
          <rect x="2" y="6" width="12" height="9" rx="1.5" fill="url(#tBodyGrad)" />
          <line x1="6" y1="7" x2="6" y2="14" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <line x1="10" y1="7" x2="10" y2="14" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          {/* Cabin */}
          <path d="M14 9H18.5L21.5 12V15H14V9Z" fill="#1e293b" />
          {/* Windshield */}
          <path d="M15.5 10H18L20 12H15.5V10Z" fill="url(#tCabinGrad)" />
          {/* Headlight */}
          <circle cx="21" cy="14" r="0.9" fill="#fef08a" className="headlight-beam" />
        </g>

        {/* Rear Wheel (Center: 5.5, 16.5) */}
        <g className="wheel-rear" transform="translate(5.5, 16.5)">
          <circle cx="0" cy="0" r="2.6" fill="#0f172a" />
          <circle cx="0" cy="0" r="1.3" fill="#94a3b8" />
          <line x1="-1.3" y1="0" x2="1.3" y2="0" stroke="#ffffff" strokeWidth="0.7" className="spoke-spin" />
        </g>

        {/* Front Wheel (Center: 18, 16.5) */}
        <g className="wheel-front" transform="translate(18, 16.5)">
          <circle cx="0" cy="0" r="2.6" fill="#0f172a" />
          <circle cx="0" cy="0" r="1.3" fill="#94a3b8" />
          <line x1="-1.3" y1="0" x2="1.3" y2="0" stroke="#ffffff" strokeWidth="0.7" className="spoke-spin" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 3. REALISTIC QUALITY OPTICAL SCANNER
 * Clean 24x24 vector: Part with sweeping emerald laser beam.
 */
export function RealisticQualitySymbol({ size = 22, color = '#059669' }) {
  return (
    <div className="realistic-symbol-box quality-box" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="quality-svg"
      >
        <defs>
          <linearGradient id="qLaserGrad" x1="2" y1="0" x2="22" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgba(16,185,129,0)" />
            <stop offset="0.5" stopColor="#10b981" />
            <stop offset="1" stopColor="rgba(16,185,129,0)" />
          </linearGradient>
        </defs>

        {/* Camera Sensor Mount */}
        <rect x="9" y="2" width="6" height="3" rx="1" fill="#1e293b" />
        <circle cx="12" cy="3.5" r="1" fill="#10b981" />

        {/* Precision Part Being Scanned */}
        <rect x="4" y="6" width="16" height="15" rx="2.5" fill="#f8fafc" stroke="#64748b" strokeWidth="1.2" />
        <circle cx="12" cy="13.5" r="3.5" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M9.5 13.5L11.5 15.5L14.5 11.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Oscillating Laser Beam */}
        <g className="laser-sweep-beam">
          <line x1="3" y1="9" x2="21" y2="9" stroke="url(#qLaserGrad)" strokeWidth="2.2" />
          <circle cx="12" cy="9" r="1.2" fill="#34d399" filter="drop-shadow(0 0 3px #10b981)" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 4. REALISTIC PRODUCTION CONVEYOR & ROBOTIC ARM
 * Clean 24x24 vector: Moving parts along track with automated tool.
 */
export function RealisticProductionSymbol({ size = 22, color = '#6f3dba' }) {
  return (
    <div className="realistic-symbol-box prod-box" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="prod-svg"
      >
        {/* Conveyor Bed */}
        <rect x="2" y="16" width="20" height="3.5" rx="1.5" fill="#334155" />
        <line x1="3" y1="17.8" x2="21" y2="17.8" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2.5 2.5" className="conveyor-motion" />

        {/* Work-in-Progress Parts */}
        <g className="conveyor-parts-stream">
          <rect x="5" y="11.5" width="4" height="4.5" rx="0.8" fill={color} />
          <rect x="15" y="11.5" width="4" height="4.5" rx="0.8" fill={color} />
        </g>

        {/* Automated Robotic Tool */}
        <g className="robotic-arm-tool">
          <path d="M12 2V7" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="7" r="2" fill="#64748b" />
          <path d="M10.5 8.5L12 10L13.5 8.5" stroke="#4338ca" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 5. REALISTIC ENERGY & UTILITIES TURBINE
 * Clean 24x24 vector: Rotating turbine generator with electrical spark.
 */
export function RealisticEnergySymbol({ size = 22, color = '#eab308' }) {
  return (
    <div className="realistic-symbol-box energy-box" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="energy-svg"
      >
        <defs>
          <linearGradient id="eAura" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="1" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        {/* Rotating Dynamo Blades */}
        <g className="turbine-blades-spin">
          <circle cx="12" cy="12" r="7.5" stroke="rgba(234, 179, 8, 0.3)" strokeWidth="1.2" />
          <path d="M12 5C12 5 14.5 8.5 12 12C9.5 15.5 12 19 12 19" stroke="url(#eAura)" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M5 12C5 12 8.5 9.5 12 12C15.5 14.5 19 12 19 12" stroke="url(#eAura)" strokeWidth="1.8" strokeLinecap="round" />
        </g>

        {/* Central Core & Electric Spark */}
        <circle cx="12" cy="12" r="3" fill="#ca8a04" />
        <path
          d="M12 8.5L11 12H13L12 15.5"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="electric-spark-zap"
        />
      </svg>
    </div>
  );
}

/**
 * 6. REALISTIC SAFETY & WORKFORCE SHIELD
 * Clean 24x24 vector: Armored shield with pulsing radar wave.
 */
export function RealisticSafetySymbol({ size = 22, color = '#dc2626' }) {
  return (
    <div className="realistic-symbol-box safety-box" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="safety-svg"
      >
        {/* Pulsing Radar Aura */}
        <circle cx="12" cy="12" r="9.5" stroke={color} strokeWidth="0.8" strokeDasharray="2.5 2.5" className="safety-radar-wave" />

        {/* Heavy Shield */}
        <path
          d="M12 3L18.5 6.5V12C18.5 16.5 15.5 19.5 12 21C8.5 19.5 5.5 16.5 5.5 12V6.5L12 3Z"
          fill="#fee2e2"
          stroke={color}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* Strobe Alert Icon */}
        <g className="safety-strobe-alert">
          <line x1="12" y1="8" x2="12" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="15.8" r="1" fill={color} />
        </g>
      </svg>
    </div>
  );
}

/**
 * 7. REALISTIC FINANCIAL & ROI TOKEN
 * Clean 24x24 vector: Currency token with floating gleams.
 */
export function RealisticFinanceSymbol({ size = 22, color = '#047857' }) {
  return (
    <div className="realistic-symbol-box finance-box" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="finance-svg"
      >
        <defs>
          <linearGradient id="fCoinGrad" x1="2" y1="2" x2="20" y2="20" gradientUnits="userSpaceOnUse">
            <stop stopColor="#34d399" />
            <stop offset="1" stopColor="#065f46" />
          </linearGradient>
        </defs>

        {/* Coin Body */}
        <g className="coin-wobble">
          <ellipse cx="11.5" cy="13.5" rx="8" ry="8" fill="#047857" />
          <ellipse cx="11.5" cy="12" rx="8" ry="8" fill="url(#fCoinGrad)" stroke="#6ee7b7" strokeWidth="1" />
          <text x="11.5" y="15.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800" fontFamily="sans-serif">
            ₹
          </text>
        </g>

        {/* Upward Floating Sparkle */}
        <path d="M18 4L18.8 5.5L20.5 6.2L18.8 7L18 8.5L17.2 7L15.5 6.2L17.2 5.5L18 4Z" fill="#34d399" className="roi-star-1" />
      </svg>
    </div>
  );
}

/**
 * 8. REALISTIC LIVE DASHBOARD / MONITOR
 * Clean 24x24 vector: Monitor screen with 3 dancing equalizer frequency bars.
 */
export function RealisticDashboardSymbol({ size = 22, color = '#0284c7' }) {
  return (
    <div className="realistic-symbol-box dash-box" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="dash-svg"
      >
        {/* Terminal Screen Frame */}
        <rect x="2" y="3" width="20" height="14" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.1" />

        {/* Live Frequency Bars */}
        <g className="equalizer-bars-group">
          <line x1="6" y1="14" x2="6" y2="9" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" className="eq-bar-1" />
          <line x1="9.5" y1="14" x2="9.5" y2="6.5" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" className="eq-bar-2" />
          <line x1="13" y1="14" x2="13" y2="8" stroke="#facc15" strokeWidth="1.6" strokeLinecap="round" className="eq-bar-3" />
        </g>

        {/* Live Signal Wave */}
        <path
          d="M15 11L16.5 8.5L18 12.5L20 10"
          stroke="#38bdf8"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="dash-wave-line"
        />

        {/* Base Stand */}
        <path d="M9 17H15M12 17V19.5M8.5 19.5H15.5" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
