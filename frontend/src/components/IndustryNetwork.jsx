import React, { useMemo, useState, useEffect, useRef } from 'react';
import './IndustryNetwork.css';

/**
 * Industry configuration with exact coordinates, photographic backgrounds,
 * connections, and hub node affinities.
 * All 5 circles have identical diameter and are non-overlapping along an arc.
 */
export const INDUSTRIES = [
  {
    id: 'circle-manufacturing',
    name: 'manufacturing',
    title: 'Manufacturing',
    imageSrc: '/assets/industry/manufacturing.jpg',
    className: 'in-circle-manufacturing',
    targetX: 480,
    targetY: 120,
    dots: [
      { x: 262, y: 323, r: 3.8 },
      { x: 362, y: 230, r: 3.8 }
    ],
    hubNode: 'purple'
  },
  {
    id: 'circle-finance',
    name: 'finance',
    title: 'Finance',
    imageSrc: '/assets/industry/finance.jpg',
    className: 'in-circle-finance',
    targetX: 590,
    targetY: 265,
    dots: [
      { x: 300, y: 374, r: 3.8 },
      { x: 434, y: 324, r: 3.8 }
    ],
    hubNode: 'coral'
  },
  {
    id: 'circle-tech-saas',
    name: 'tech-saas',
    title: 'Tech And SAAS',
    label: (
      <>
        Tech And<br />SAAS
      </>
    ),
    imageSrc: '/assets/industry/tech_saas.jpg',
    className: 'in-circle-tech-saas',
    targetX: 640,
    targetY: 433,
    dots: [
      { x: 342, y: 433, r: 3.8 },
      { x: 466, y: 433, r: 3.8 }
    ],
    hubNode: 'orange'
  },
  {
    id: 'circle-retail',
    name: 'retail',
    title: 'Retail',
    imageSrc: '/assets/industry/retail.jpg',
    className: 'in-circle-retail',
    targetX: 590,
    targetY: 601,
    dots: [
      { x: 300, y: 492, r: 3.8 },
      { x: 434, y: 542, r: 3.8 }
    ],
    hubNode: 'blue'
  },
  {
    id: 'circle-customer-innovation',
    name: 'customer-innovation',
    title: 'Customer Innovation',
    label: (
      <>
        Customer<br />Innovation
      </>
    ),
    imageSrc: '/assets/industry/customer_innovation.jpg',
    className: 'in-circle-customer-innovation',
    targetX: 480,
    targetY: 746,
    dots: [
      { x: 262, y: 543, r: 3.8 },
      { x: 362, y: 636, r: 3.8 }
    ],
    hubNode: 'blue'
  }
];

/**
 * Deterministically generated background constellation dots.
 * Clustered with higher density around the central hub and left region.
 */
function generateBackgroundDots() {
  const dots = [];
  let seed = 42;
  function rnd() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }

  // 1. Clustered dots on the left / around the hub (high density)
  for (let i = 0; i < 280; i++) {
    const x = 30 + Math.pow(rnd(), 1.35) * 440;
    const y = 60 + rnd() * 740;
    const r = 1.2 + rnd() * 2.2;
    const colors = ['#8b5cf6', '#a78bfa', '#6366f1', '#c4b5fd', '#818cf8', '#38bdf8'];
    const color = colors[Math.floor(rnd() * colors.length)];
    const opacity = 0.25 + rnd() * 0.55;
    dots.push({ x: Math.round(x), y: Math.round(y), r: Number(r.toFixed(1)), color, opacity });
  }

  // 2. Lighter dot scattering on the right half
  for (let i = 0; i < 90; i++) {
    const x = 460 + rnd() * 370;
    const y = 40 + rnd() * 780;
    const r = 1.0 + rnd() * 1.8;
    const colors = ['#a78bfa', '#c4b5fd', '#818cf8'];
    const color = colors[Math.floor(rnd() * colors.length)];
    const opacity = 0.18 + rnd() * 0.35;
    dots.push({ x: Math.round(x), y: Math.round(y), r: Number(r.toFixed(1)), color, opacity });
  }

  return dots;
}

/**
 * Background Pattern Component
 * Clean canvas without grid lines; includes soft radial wash and scattered dots.
 */
function BackgroundPattern() {
  const dots = useMemo(() => generateBackgroundDots(), []);

  return (
    <div className="in-background-layer">
      <div className="in-radial-glow" />
      <svg
        className="in-dots-svg"
        viewBox="0 0 855 866"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {dots.map((d, idx) => (
          <circle
            key={idx}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={d.color}
            opacity={d.opacity}
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * Network Connections Layer
 * 5 dashed purple paths from Central Hub to 5 industry circles.
 * Features an active flowing beam and moving energy pulse when selected.
 */
function NetworkConnections({ activeIndex }) {
  const hubX = 144;
  const hubY = 433;

  return (
    <svg
      className="in-connections-svg"
      viewBox="0 0 855 866"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Glow filter for active moving energy packet */}
        <filter id="packet-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#c084fc" floodOpacity="0.9" />
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#ffffff" floodOpacity="1" />
        </filter>
      </defs>

      {/* 5 Purple Dashed Connection Lines */}
      {INDUSTRIES.map((ind, idx) => {
        const isActive = idx === activeIndex;
        return (
          <g key={ind.id} className={isActive ? 'in-connection-group active' : 'in-connection-group'}>
            {/* Background dashed path */}
            <line
              x1={hubX}
              y1={hubY}
              x2={ind.targetX}
              y2={ind.targetY}
              className={`in-connection-line ${isActive ? 'active' : ''}`}
            />

            {/* Glowing active path overlay when active */}
            {isActive && (
              <line
                x1={hubX}
                y1={hubY}
                x2={ind.targetX}
                y2={ind.targetY}
                className="in-connection-line-active-glow"
              />
            )}

            {/* Intermediate Connection Dots */}
            {ind.dots.map((dot, dIdx) => (
              <circle
                key={`${ind.id}-dot-${dIdx}`}
                cx={dot.x}
                cy={dot.y}
                r={isActive ? dot.r * 1.25 : dot.r}
                className={`in-connection-node-dot ${isActive ? 'active' : ''}`}
              />
            ))}

            {/* Animated Energy Packet Moving from Hub to Circle */}
            {isActive && (
              <circle
                r="4.8"
                fill="#ffffff"
                filter="url(#packet-glow)"
                className="in-energy-packet"
              >
                <animateMotion
                  path={`M ${hubX} ${hubY} L ${ind.targetX} ${ind.targetY}`}
                  dur="1.75s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Central Hub Component
 * Small white circular container containing inline SVG network constellation logo.
 * Reacts dynamically to the active industry.
 */
function CentralHub({ activeIndex }) {
  const activeIndustry = INDUSTRIES[activeIndex];
  const activeNode = activeIndustry?.hubNode;

  return (
    <div className="in-central-hub" title="Central Network Hub">
      <div className="in-central-hub-inner">
        <svg
          className="in-hub-svg"
          viewBox="0 0 152 152"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hub-center-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <filter id="hub-node-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.25" />
            </filter>
            <filter id="hub-glow-active" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Connecting Struts */}
          <line
            x1="48"
            y1="70"
            x2="83"
            y2="76"
            stroke="#4a5584"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <line
            x1="83"
            y1="76"
            x2="106"
            y2="51"
            stroke="#4a5584"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <line
            x1="83"
            y1="76"
            x2="94"
            y2="118"
            stroke="#4a5584"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <line
            x1="106"
            y1="51"
            x2="94"
            y2="118"
            stroke="#4a5584"
            strokeWidth="6.5"
            strokeLinecap="round"
          />

          {/* Nodes */}
          {/* Left Node: Purple */}
          <circle
            cx="48"
            cy="70"
            r={activeNode === 'purple' ? 12 : 10.5}
            fill="#6e2e8e"
            filter={activeNode === 'purple' ? 'url(#hub-glow-active)' : 'url(#hub-node-shadow)'}
            className={`in-hub-node ${activeNode === 'purple' ? 'active' : ''}`}
          />

          {/* Top-Right Node: Coral / Red-Orange */}
          <circle
            cx="106"
            cy="51"
            r={activeNode === 'coral' ? 11 : 9.5}
            fill="#ea580c"
            filter={activeNode === 'coral' ? 'url(#hub-glow-active)' : 'url(#hub-node-shadow)'}
            className={`in-hub-node ${activeNode === 'coral' ? 'active' : ''}`}
          />

          {/* Bottom-Right Node: Cobalt Blue */}
          <circle
            cx="94"
            cy="118"
            r={activeNode === 'blue' ? 12.5 : 11}
            fill="#2563eb"
            filter={activeNode === 'blue' ? 'url(#hub-glow-active)' : 'url(#hub-node-shadow)'}
            className={`in-hub-node ${activeNode === 'blue' ? 'active' : ''}`}
          />

          {/* Center Main Node: Orange Gradient */}
          <circle
            cx="83"
            cy="76"
            r={activeNode === 'orange' ? 16 : 14.5}
            fill="url(#hub-center-grad)"
            filter={activeNode === 'orange' ? 'url(#hub-glow-active)' : 'url(#hub-node-shadow)'}
            className={`in-hub-node ${activeNode === 'orange' ? 'active' : ''}`}
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * Reusable Industry Circle Component
 */
function IndustryCircle({ id, title, imageSrc, className, isActive, onClick, children }) {
  return (
    <div
      className={`in-industry-circle ${className} ${isActive ? 'in-circle-active' : ''}`}
      id={id}
      onClick={onClick}
      role="button"
      tabIndex={0}
      title={`${title} (Click to focus)`}
    >
      <img
        src={imageSrc}
        alt={title}
        className="in-industry-circle-bg"
        loading="eager"
      />
      <div className="in-industry-circle-overlay" />
      <div className="in-industry-circle-label">
        {children || title}
      </div>
      {/* Outer illuminated active ring pulse */}
      {isActive && <div className="in-circle-active-aura" />}
    </div>
  );
}

/**
 * Main IndustryNetwork Component
 *
 * Features:
 * 1. Clean background without grid lines.
 * 2. All 5 industry circles are EVEN in size (uniform 154px diameter).
 * 3. Non-overlapping circular arc layout with generous spacing.
 * 4. Generous vertical clearance so bottom circle is never cut off.
 * 5. Animated 5-second sequential cycle with moving energy packets.
 * 6. Left-anchored full-height presentation.
 */
export default function IndustryNetwork() {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);

  // Cycle to the next industry every 5 seconds
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % INDUSTRIES.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex]);

  const handleSelectIndustry = (index) => {
    setActiveIndex(index);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % INDUSTRIES.length);
    }, 5000);
  };

  return (
    <div className="industry-network-wrapper">
      <div className="industry-network-canvas">
        {/* 1. Background (No Grid lines, subtle glow + constellation dots) */}
        <BackgroundPattern />

        {/* 2. SVG Connections & Animated Flow (Layered behind circles) */}
        <NetworkConnections activeIndex={activeIndex} />

        {/* 3. Central Hub with SVG Network Symbol */}
        <CentralHub activeIndex={activeIndex} />

        {/* 4. Five Evenly Sized, Non-Overlapping Industry Circles */}
        {INDUSTRIES.map((ind, idx) => {
          const isActive = idx === activeIndex;

          return (
            <IndustryCircle
              key={ind.id}
              id={ind.id}
              title={ind.title}
              imageSrc={ind.imageSrc}
              className={ind.className}
              isActive={isActive}
              onClick={() => handleSelectIndustry(idx)}
            >
              {ind.label || ind.title}
            </IndustryCircle>
          );
        })}

        {/* 5. Sleek 5-Second Cycle Progress Bar Indicator (Bottom Left) */}
        <div className="in-cycle-indicators">
          {INDUSTRIES.map((ind, idx) => (
            <button
              key={ind.id}
              className={`in-cycle-dot ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => handleSelectIndustry(idx)}
              title={`Switch to ${ind.title}`}
              aria-label={ind.title}
            >
              {idx === activeIndex && <span className="in-cycle-progress-bar" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
