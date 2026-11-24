import React, { useMemo } from 'react';

/**
 * Blueprint Canvas: Renders the fanning constellation rays and guide paths.
 * Connects Origin Node (100, 340) directly to Sector Nodes and Sector Nodes to Agent Nodes.
 */
export default function BlueprintCanvas({
  origin = { x: 100, y: 285 },
  sectorPositions = [],
  activeSectorId = null,
  agentPositions = [],
  viewState = 'HOME',
  accentColor = '#8b5cf6',
  width = 700,
  height = 570
}) {
  // Static constellation particles fanning between origin and sector arc
  const particles = useMemo(() => {
    const list = [];
    let seed = 77;
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < 40; i++) {
      const spread = rnd();
      const x = origin.x + 35 + spread * 320;
      const maxAngle = 0.72; // ~41 deg
      const angle = (rnd() * 2 - 1) * maxAngle * spread;
      const y = origin.y + Math.tan(angle) * (x - origin.x);

      list.push({
        id: i,
        x: Math.round(x),
        y: Math.round(y),
        r: (rnd() * 1.5 + 1.1).toFixed(1),
        opacity: (rnd() * 0.45 + 0.22).toFixed(2),
        dur: (rnd() * 3 + 2.5).toFixed(1) + 's',
        delay: (rnd() * 2).toFixed(1) + 's'
      });
    }
    return list;
  }, [origin.x, origin.y]);

  // Crescent arc path passing through sector nodes
  const arcPath = useMemo(() => {
    if (!sectorPositions || sectorPositions.length === 0) return '';
    const points = sectorPositions;
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      path += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`;
    }
    const last = points[points.length - 1];
    path += ` T ${last.x} ${last.y}`;
    return path;
  }, [sectorPositions]);

  // Active sector position
  const activeSectorPos = useMemo(() => {
    return sectorPositions.find((s) => s.id === activeSectorId) || null;
  }, [sectorPositions, activeSectorId]);

  return (
    <svg
      className="hub-blueprint-svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="blueprint-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <linearGradient id="ray-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(147, 51, 234, 0.8)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.6)" />
        </linearGradient>

        <radialGradient id="origin-aura">
          <stop offset="0%" stopColor="rgba(147, 51, 234, 0.28)" />
          <stop offset="70%" stopColor="rgba(59, 130, 246, 0.08)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Origin Node subtle background gradient defs */}

      {/* Constellation Particle Field */}
      <g className="blueprint-particles">
        {particles.map((p) => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="#a855f7"
            opacity={p.opacity}
          >
            <animate
              attributeName="opacity"
              values={`${p.opacity};${Number(p.opacity) * 1.8};${p.opacity}`}
              dur={p.dur}
              begin={p.delay}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* Crescent Arc Guide Path connecting Sector Nodes */}
      {arcPath && (
        <path
          d={arcPath}
          fill="none"
          stroke="rgba(168, 85, 247, 0.22)"
          strokeWidth="1.6"
          strokeDasharray="4 6"
        />
      )}

      {/* Radial Connection Rays from Origin to each Sector */}
      <g className="blueprint-rays">
        {sectorPositions.map((sec, idx) => {
          const isTargetActive = sec.id === activeSectorId;
          return (
            <g key={sec.id}>
              {/* Line from exact origin center to sector center */}
              <line
                x1={origin.x}
                y1={origin.y}
                x2={sec.x}
                y2={sec.y}
                stroke={isTargetActive ? 'url(#ray-gradient)' : 'rgba(147, 51, 234, 0.35)'}
                strokeWidth={isTargetActive ? '2.2' : '1.3'}
                strokeDasharray="5 5"
                filter={isTargetActive ? 'url(#blueprint-glow)' : undefined}
              />

              {/* Endpoint Connector Dot */}
              <circle
                cx={sec.x}
                cy={sec.y}
                r={isTargetActive ? '4' : '2.8'}
                fill={isTargetActive ? '#c084fc' : '#a855f7'}
                opacity="0.8"
              />

              {/* Animated Pulse Particle travelling down the ray */}
              <circle r="2.8" fill="#c084fc" filter="url(#blueprint-glow)">
                <animate
                  attributeName="cx"
                  from={origin.x}
                  to={sec.x}
                  dur={`${2.6 + idx * 0.35}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  from={origin.y}
                  to={sec.y}
                  dur={`${2.6 + idx * 0.35}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.9;0"
                  dur={`${2.6 + idx * 0.35}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </g>

      {/* Connection Spokes to Active Agents (when in SECTOR_VIEW or AGENT_SELECTED) */}
      {(viewState === 'SECTOR_VIEW' || viewState === 'AGENT_SELECTED') &&
        activeSectorPos &&
        agentPositions.map((agentPos, idx) => (
          <g key={`agent-spoke-${idx}`}>
            <line
              x1={activeSectorPos.x}
              y1={activeSectorPos.y}
              x2={agentPos.x}
              y2={agentPos.y}
              stroke="rgba(99, 102, 241, 0.5)"
              strokeWidth="1.6"
              strokeDasharray="4 4"
            />
            <circle cx={agentPos.x} cy={agentPos.y} r="3" fill="#818cf8" />
          </g>
        ))}
    </svg>
  );
}
