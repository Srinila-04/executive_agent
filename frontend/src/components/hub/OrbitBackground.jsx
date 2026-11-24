import React from 'react';

/**
 * Animated orbital background: concentric rotating rings, dashed guide paths,
 * drifting micro-particles, and telemetry spokes.
 * Style reference: https://pin.it/2FIafJIIB
 */
export default function OrbitBackground({
  radius = 210,
  spokeTargets = [],
  viewState = 'HOME',
  accentColor = '#8b5cf6'
}) {
  return (
    <svg
      className="hub-orbit-svg"
      viewBox="-350 -350 700 700"
      aria-hidden="true"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="orbit-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="core-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <radialGradient id="ring-pulse-grad">
          <stop offset="60%" stopColor="rgba(111, 61, 186, 0)" />
          <stop offset="85%" stopColor="rgba(111, 61, 186, 0.12)" />
          <stop offset="100%" stopColor="rgba(77, 142, 235, 0.28)" />
        </radialGradient>
      </defs>

      {/* Center Group (Centered at 0, 0) */}
      <g>
        {/* Ambient Radial Depth Fill */}
        <circle r={radius * 1.3} fill="url(#ring-pulse-grad)" opacity="0.4" />

        {/* Innermost Telemetry Ring */}
        <circle
          r="75"
          className="orbit-ring orbit-ring-inner"
          stroke="var(--brand-purple)"
          strokeWidth="1.2"
          strokeDasharray="4 8 2 12"
          fill="none"
          opacity="0.45"
        />

        {/* Primary Orbit Ring (Matches Sector/Agent Node Radius) */}
        <circle
          r={radius}
          className="orbit-ring orbit-ring-primary"
          stroke="var(--brand-blue)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
          fill="none"
          opacity="0.35"
        />

        {/* Secondary Concentric Ring */}
        <circle
          r={radius * 0.72}
          className="orbit-ring orbit-ring-secondary"
          stroke="var(--brand-purple)"
          strokeWidth="1"
          strokeDasharray="16 10 4 10"
          fill="none"
          opacity="0.28"
        />

        {/* Outer Halo Track */}
        <circle
          r={radius * 1.25}
          className="orbit-ring orbit-ring-outer"
          stroke="var(--brand-navy)"
          strokeWidth="0.8"
          strokeDasharray="3 9"
          fill="none"
          opacity="0.25"
        />

        {/* Orbiting Particle Beacons */}
        <g className="orbit-particles-group">
          <circle r="3" cx={radius} cy="0" fill="var(--brand-purple)" filter="url(#orbit-glow)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="24s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.5" cx={-radius * 0.72} cy="0" fill="var(--brand-blue)" filter="url(#orbit-glow)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360"
              to="0"
              dur="18s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.2" cx="0" cy={radius * 1.25} fill="#38bdf8" filter="url(#orbit-glow)">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="32s"
              repeatCount="indefinite"
            />
          </circle>
        </g>

        {/* Telemetry Connection Spokes to Nodes */}
        {spokeTargets.map((target, idx) => (
          <g key={`spoke-${idx}`}>
            {/* Base guide spoke line */}
            <line
              x1="0"
              y1="0"
              x2={target.x}
              y2={target.y}
              stroke="var(--card-border)"
              strokeWidth="1.2"
              strokeDasharray="3 5"
              opacity="0.5"
            />
            {/* Animated telemetry packet traveling along the spoke */}
            <circle
              r="2.5"
              fill={target.color || 'var(--brand-purple)'}
              filter="url(#orbit-glow)"
              className="spoke-telemetry-packet"
            >
              <animate
                attributeName="cx"
                from={target.x * 0.15}
                to={target.x}
                dur="2.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                from={target.y * 0.15}
                to={target.y}
                dur="2.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                keyTimes="0;0.2;0.8;1"
                dur="2.4s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </g>
    </svg>
  );
}
