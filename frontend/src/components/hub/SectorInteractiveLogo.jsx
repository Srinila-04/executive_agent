import React from 'react';
import '../../styles/hubAnimatedLogos.css';

/**
 * SectorInteractiveLogo
 * Renders an interactive animated SVG logo for the 6 manufacturing domains.
 * Recreates the exact motifs from the original diagram with animated micro-interactions:
 * - Safety & People: Gold/dark shield, gleaming safety helmet, pulsing protective ring
 * - Maintenance: Dual counter-rotating precision gears, tilting wrench with dynamic torque
 * - Production: Modern factory facility, rhythmic chimney smoke puffs, spinning machinery gear
 * - Quality: Precision inspector reticle, quality checkmark, animated laser scan beam
 * - Supply Chain: Express delivery truck, spinning wheels, pulsing logistics network route
 * - Finance: Ascending 3-pillar performance chart, surge growth trend arrow, glint particle
 */
export default function SectorInteractiveLogo({ sectorId, fallbackLogo, sectorName }) {
  // If fallback requested, render clean original image
  if (fallbackLogo && !sectorId) {
    return <img src={fallbackLogo} alt={sectorName} className="sector-logo-img" />;
  }

  switch (sectorId) {
    /* 1. SAFETY & PEOPLE */
    case 'people-safety':
      return (
        <div className="interactive-logo-wrapper has-idle-float" title="Safety & People (Interactive)">
          <svg
            viewBox="0 0 48 48"
            className="interactive-logo-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="shieldGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="shieldInnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <clipPath id="shieldClip">
                <path d="M24 6L37 11V23C37 31.5 24 41 24 41C24 41 11 31.5 11 23V11L24 6Z" />
              </clipPath>
            </defs>

            {/* Pulsing Outer Protective Ring */}
            <circle
              cx="24"
              cy="24"
              r="22"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="safety-ring-pulse"
              opacity="0.4"
            />

            {/* Shield Outline with Golden Rim */}
            <path
              d="M24 6L37 11V23C37 31.5 24 41 24 41C24 41 11 31.5 11 23V11L24 6Z"
              fill="url(#shieldGoldGrad)"
              stroke="#b45309"
              strokeWidth="1.5"
              className="safety-shield-body"
            />

            {/* Dark Shield Core */}
            <path
              d="M24 9L34 13.5V23C34 29.5 24 37 24 37C24 37 14 29.5 14 23V13.5L24 9Z"
              fill="url(#shieldInnerGrad)"
            />

            {/* Safety Helmet Icon Inside */}
            <path
              d="M17 24C17 19.5 20.1 16 24 16C27.9 16 31 19.5 31 24V25H17V24Z"
              fill="#fbbf24"
            />
            {/* Helmet Rim */}
            <path
              d="M15 25H33C33.5 25 34 25.4 34 26C34 26.6 33.5 27 33 27H15C14.5 27 14 26.6 14 26C14 25.4 14.5 25 15 25Z"
              fill="#f59e0b"
            />
            {/* Helmet Ridge */}
            <path d="M23 16V24H25V16H23Z" fill="#d97706" />

            {/* "SAFETY" Text Badge */}
            <rect x="17" y="28.5" width="14" height="4.5" rx="1" fill="#f59e0b" />
            <text x="24" y="32" fontSize="3.2" fontWeight="800" fill="#0f172a" textAnchor="middle" letterSpacing="0.4">
              SAFETY
            </text>

            {/* Gleam Line Sweep */}
            <g clipPath="url(#shieldClip)">
              <rect
                x="20"
                y="-10"
                width="8"
                height="60"
                fill="rgba(255, 255, 255, 0.45)"
                className="safety-gleam-line"
              />
            </g>
          </svg>
        </div>
      );

    /* 2. MAINTENANCE & UTILITIES */
    case 'maintenance-utilities':
      return (
        <div className="interactive-logo-wrapper has-idle-float" title="Maintenance & Utilities (Interactive)">
          <svg
            viewBox="0 0 48 48"
            className="interactive-logo-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="maintWrenchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {/* Primary Spinning Gear (Left / Lower) */}
            <g className="maint-gear-large">
              <circle cx="17" cy="27" r="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
              {/* Gear Teeth */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <rect
                  key={angle}
                  x="15.5"
                  y="14.5"
                  width="3"
                  height="3.5"
                  rx="0.8"
                  fill="#64748b"
                  transform={`rotate(${angle} 17 27)`}
                />
              ))}
              <circle cx="17" cy="27" r="4.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.2" />
            </g>

            {/* Secondary Counter-Rotating Gear (Right / Upper) */}
            <g className="maint-gear-small">
              <circle cx="32" cy="16" r="7.5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.8" />
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <rect
                  key={angle}
                  x="30.8"
                  y="7"
                  width="2.4"
                  height="2.8"
                  rx="0.6"
                  fill="#d97706"
                  transform={`rotate(${angle} 32 16)`}
                />
              ))}
              <circle cx="32" cy="16" r="3" fill="#fffbeb" stroke="#d97706" strokeWidth="1" />
            </g>

            {/* Precision Mechanic Wrench (Tilts and Works on Hover) */}
            <g className="maint-wrench">
              {/* Wrench Shaft */}
              <line
                x1="12"
                y1="38"
                x2="31"
                y2="19"
                stroke="url(#maintWrenchGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Wrench Jaw (Open Head) */}
              <path
                d="M33 17L37 13C38.5 14.5 39 16.5 38 18.5L34.5 22L30.5 18L33 17Z"
                fill="#334155"
                stroke="#64748b"
                strokeWidth="0.8"
              />
              <circle cx="34" cy="17" r="2.5" fill="white" />
              {/* Wrench Grip Ring */}
              <circle cx="12" cy="38" r="4" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="12" cy="38" r="1.8" fill="white" />
            </g>
          </svg>
        </div>
      );

    /* 3. PRODUCTION & PLANNING */
    case 'production-planning':
      return (
        <div className="interactive-logo-wrapper has-idle-float" title="Production & Planning (Interactive)">
          <svg
            viewBox="0 0 48 48"
            className="interactive-logo-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Animated Translucent Smoke Puffs */}
            <circle cx="16" cy="11" r="2.5" fill="#cbd5e1" className="prod-smoke-1" />
            <circle cx="23" cy="8" r="3" fill="#94a3b8" className="prod-smoke-2" />
            <circle cx="30" cy="11" r="2" fill="#cbd5e1" className="prod-smoke-3" />

            {/* Factory Building Silhouette */}
            {/* Main Facility Body */}
            <path
              d="M8 38V24L18 30V22L28 28V16L38 22V38H8Z"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="1.2"
            />
            {/* Chimneys */}
            <rect x="14" y="14" width="4" height="10" fill="#334155" />
            <rect x="21" y="10" width="4" height="12" fill="#475569" />
            <rect x="28" y="14" width="4" height="14" fill="#334155" />

            {/* Glowing Factory Windows */}
            <rect x="11" y="32" width="3" height="3" fill="#facc15" rx="0.5" />
            <rect x="16" y="32" width="3" height="3" fill="#facc15" rx="0.5" />
            <rect x="21" y="32" width="3" height="3" fill="#facc15" rx="0.5" />
            <rect x="26" y="32" width="3" height="3" fill="#facc15" rx="0.5" />

            {/* Rotating Automation Gear in Foreground */}
            <g className="prod-gear">
              <circle cx="37" cy="34" r="7" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1.5" />
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <rect
                  key={angle}
                  x="36"
                  y="26"
                  width="2"
                  height="2.5"
                  rx="0.5"
                  fill="#5b21b6"
                  transform={`rotate(${angle} 37 34)`}
                />
              ))}
              <circle cx="37" cy="34" r="2.5" fill="#f3e8ff" />
            </g>
          </svg>
        </div>
      );

    /* 4. QUALITY & ENGINEERING */
    case 'quality-engineering':
      return (
        <div className="interactive-logo-wrapper has-idle-float" title="Quality & Engineering (Interactive)">
          <svg
            viewBox="0 0 48 48"
            className="interactive-logo-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Quality Rotating Reticle Ring */}
            <g className="quality-reticle-ring">
              <circle cx="34" cy="22" r="10" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" />
              <rect x="33" y="10.5" width="2" height="3" fill="#0284c7" />
              <rect x="33" y="30.5" width="2" height="3" fill="#0284c7" />
              <rect x="22.5" y="21" width="3" height="2" fill="#0284c7" />
              <rect x="42.5" y="21" width="3" height="2" fill="#0284c7" />
            </g>

            {/* Quality Inspector Silhouette */}
            {/* Head */}
            <circle cx="19" cy="15" r="5" fill="#0284c7" />
            {/* Hard Hat */}
            <path d="M14 14C14 11 16.5 9 19 9C21.5 9 24 11 24 14H14Z" fill="#38bdf8" />
            {/* Body */}
            <path
              d="M11 38V30C11 26 14.5 23 19 23C23.5 23 27 26 27 30V38H11Z"
              fill="#0369a1"
            />
            {/* Inspector Arm Holding Caliper/Wrench */}
            <path
              d="M24 26L32 23L34 26L26 30"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Laser Scanner Beam (Sweeping Up and Down) */}
            <line
              x1="26"
              y1="16"
              x2="42"
              y2="16"
              stroke="#38bdf8"
              strokeWidth="1.5"
              className="quality-scan-beam"
            />

            {/* Quality Approved Checkmark Shield */}
            <g className="quality-check-sparkle">
              <circle cx="35" cy="33" r="6" fill="#10b981" stroke="#059669" strokeWidth="1.2" />
              <path
                d="M32.5 33L34.5 35L37.5 31"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      );

    /* 5. SUPPLY CHAIN & CUSTOMERS */
    case 'supply-chain-customers':
      return (
        <div className="interactive-logo-wrapper has-idle-float" title="Supply Chain & Customers (Interactive)">
          <svg
            viewBox="0 0 48 48"
            className="interactive-logo-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circular Logistics Network Arc */}
            <path
              d="M8 20C8 13.3 13.3 8 20 8C27 8 33 13 34 20"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            {/* Network Nodes */}
            <circle cx="8" cy="20" r="2" fill="#10b981" className="supply-route-dot" />
            <circle cx="20" cy="8" r="2.5" fill="#059669" className="supply-route-dot" />
            <circle cx="34" cy="20" r="2" fill="#10b981" className="supply-route-dot" />

            {/* Delivery Fleet Truck Body */}
            <g className="supply-truck-body">
              {/* Cargo Container */}
              <rect x="10" y="20" width="18" height="12" rx="1.5" fill="#10b981" stroke="#059669" strokeWidth="1" />
              {/* Driver Cab */}
              <path
                d="M28 24H35L38 28V32H28V24Z"
                fill="#34d399"
                stroke="#059669"
                strokeWidth="1"
              />
              {/* Windshield */}
              <polygon points="29,25 34,25 36,28 29,28" fill="#d1fae5" />
              {/* Cargo Detail Lines */}
              <line x1="16" y1="22" x2="16" y2="30" stroke="#047857" strokeWidth="0.8" />
              <line x1="22" y1="22" x2="22" y2="30" stroke="#047857" strokeWidth="0.8" />
            </g>

            {/* Spinning Wheels */}
            <g className="supply-wheel-1">
              <circle cx="19" cy="33" r="3.2" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
              <circle cx="19" cy="33" r="1.2" fill="#f8fafc" />
              <line x1="19" y1="30" x2="19" y2="36" stroke="#94a3b8" strokeWidth="0.6" />
            </g>
            <g className="supply-wheel-2">
              <circle cx="33" cy="33" r="3.2" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
              <circle cx="33" cy="33" r="1.2" fill="#f8fafc" />
              <line x1="33" y1="30" x2="33" y2="36" stroke="#94a3b8" strokeWidth="0.6" />
            </g>

            {/* Road Ground Line */}
            <line x1="6" y1="36" x2="42" y2="36" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      );

    /* 6. FINANCE & LEADERSHIP */
    case 'finance-leadership':
      return (
        <div className="interactive-logo-wrapper has-idle-float" title="Finance & Leadership (Interactive)">
          <svg
            viewBox="0 0 48 48"
            className="interactive-logo-svg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="finBarGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="finBarGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
              <linearGradient id="finBarGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>

            {/* Coordinate Base Axis */}
            <line x1="8" y1="38" x2="40" y2="38" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="8" y1="38" x2="8" y2="10" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />

            {/* Dynamic Rising Histogram Bars */}
            {/* Bar 1 */}
            <rect
              x="12"
              y="26"
              width="6.5"
              height="12"
              rx="1.5"
              fill="url(#finBarGrad1)"
              className="finance-bar-1"
            />
            {/* Bar 2 */}
            <rect
              x="21"
              y="19"
              width="6.5"
              height="19"
              rx="1.5"
              fill="url(#finBarGrad2)"
              className="finance-bar-2"
            />
            {/* Bar 3 */}
            <rect
              x="30"
              y="12"
              width="6.5"
              height="26"
              rx="1.5"
              fill="url(#finBarGrad3)"
              className="finance-bar-3"
            />

            {/* Growth Trend Curved Arrow Line */}
            <g className="finance-trend-arrow">
              <path
                d="M10 32C16 28 22 23 37 13"
                stroke="#10b981"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              {/* Arrow Head */}
              <polygon points="38,10 38,16 32,12" fill="#10b981" />
            </g>

            {/* Currency Sparkle Symbol */}
            <circle cx="38" cy="11" r="1.5" fill="#facc15" />
          </svg>
        </div>
      );

    default:
      return <img src={fallbackLogo} alt={sectorName} className="sector-logo-img" />;
  }
}
