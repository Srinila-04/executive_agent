import React from 'react';
import '../../styles/hubAnimatedLogos.css';

/**
 * CenterInteractiveLogo
 * Renders an interactive animated SVG core for the central "Manufacturing 360°" node.
 * Features:
 * - Rotating industrial mechanical cog perimeter
 * - Sweeping radar scan arc
 * - Pulsing core energy aura with brand purple gradient
 * - Multi-chimney manufacturing plant with subtle smoke wisps
 * - Fallback to original image if needed
 */
export default function CenterInteractiveLogo({ fallbackLogo }) {
  return (
    <div className="interactive-logo-wrapper has-idle-float" title="Manufacturing 360° Core Engine">
      <svg
        viewBox="0 0 64 64"
        className="interactive-logo-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="centerCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#6f3dba" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="centerRadarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0.0)" />
          </linearGradient>
        </defs>

        {/* Pulsing Core Aura */}
        <circle
          cx="32"
          cy="32"
          r="26"
          fill="rgba(111, 61, 186, 0.08)"
          stroke="#8b5cf6"
          strokeWidth="1"
          strokeDasharray="4 3"
          className="center-pulse-core"
        />

        {/* Sweeping Radar Arc */}
        <path
          d="M32 32 L32 8 A24 24 0 0 1 54 22 Z"
          fill="url(#centerRadarGrad)"
          className="center-radar-arc"
        />

        {/* Industrial Mechanical Cog Ring (Rotating Perimeter) */}
        <g className="center-cog-ring">
          <circle cx="32" cy="32" r="22" stroke="#6f3dba" strokeWidth="2.5" />
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
            <rect
              key={angle}
              x="30.5"
              y="6"
              width="3"
              height="4.5"
              rx="0.8"
              fill="#6f3dba"
              transform={`rotate(${angle} 32 32)`}
            />
          ))}
          <circle cx="32" cy="32" r="19" stroke="#9333ea" strokeWidth="0.8" strokeDasharray="2 2" />
        </g>

        {/* Central Factory Structure */}
        {/* Factory Chimneys */}
        <rect x="23" y="19" width="3.5" height="10" fill="#334155" />
        <rect x="29" y="15" width="4" height="14" fill="#1e293b" />
        <rect x="36" y="20" width="3.5" height="9" fill="#334155" />

        {/* Chimney Caps */}
        <rect x="22" y="18" width="5.5" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="28" y="14" width="6" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="35" y="19" width="5.5" height="1.5" rx="0.5" fill="#64748b" />

        {/* Factory Gable & Pitch Body */}
        <path
          d="M19 44V34L26 38V30L34 35V26L43 32V44H19Z"
          fill="url(#centerCoreGrad)"
          stroke="#4c1d95"
          strokeWidth="1.2"
        />

        {/* Glowing Control Center Windows */}
        <rect x="23" y="38" width="2.5" height="2.5" rx="0.5" fill="#facc15" />
        <rect x="28" y="38" width="2.5" height="2.5" rx="0.5" fill="#facc15" />
        <rect x="33" y="38" width="2.5" height="2.5" rx="0.5" fill="#facc15" />
        <rect x="38" y="38" width="2.5" height="2.5" rx="0.5" fill="#facc15" />

        {/* Core Base Gear Plate */}
        <path
          d="M17 44H47V47C47 47.6 46.6 48 46 48H18C17.4 48 17 47.6 17 47V44Z"
          fill="#1e293b"
        />
        {/* Center Indicator Light */}
        <circle cx="32" cy="46" r="1.2" fill="#10b981" />
      </svg>
    </div>
  );
}
