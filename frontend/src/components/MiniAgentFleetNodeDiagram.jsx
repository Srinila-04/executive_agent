import React, { useState } from 'react';
import { Cpu, ArrowRight, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Zap } from 'lucide-react';

export default function MiniAgentFleetNodeDiagram({ agents, onNavigateToAgents, onSelectAgent }) {
  const [hoveredAgent, setHoveredAgent] = useState(null);

  // Exclude Module 20 (Master Platform) to show exactly the 19 functional modules
  const fleet = agents.filter((a) => a.id !== 20);

  const runningCount = fleet.filter((a) => a.status === 'running').length;
  const warningCount = fleet.filter((a) => a.status === 'warning').length;
  const stoppedCount = fleet.filter((a) => a.status === 'stopped').length;

  const getStatusColor = (status) => {
    if (status === 'stopped') return 'var(--status-danger)';
    if (status === 'warning') return 'var(--status-warning)';
    return 'var(--status-success)';
  };

  // Compute 19 node positions in a radial circular constellation
  const total = fleet.length || 19;
  const radius = 105;
  const centerX = 140;
  const centerY = 140;

  return (
    <div
      style={{
        background: 'rgb(var(--surface-rgb))',
        borderRadius: '18px',
        border: '1px solid rgba(var(--line-rgb), 0.12)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '440px',
        boxShadow: '0 4px 20px rgba(var(--shadow-rgb), 0.04)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={15} style={{ color: 'var(--brand-purple)' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-purple)', letterSpacing: '0.8px' }}>
              Operations Modules Network (19 Workflows)
            </span>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Operations Modules Status
          </h3>
        </div>

        <button
          className="btn-secondary"
          style={{ fontSize: '11.5px', padding: '6px 12px' }}
          onClick={onNavigateToAgents}
        >
          View All 19 Modules <ArrowRight size={13} />
        </button>
      </div>

      {/* Status Counters Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          margin: '12px 0'
        }}
      >
        <div
          style={{
            padding: '8px 12px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-success)' }} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--status-success)' }}>
              {runningCount}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Running</div>
          </div>
        </div>

        <div
          style={{
            padding: '8px 12px',
            borderRadius: '10px',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-warning)' }} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--status-warning)' }}>
              {warningCount}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Stock Alert</div>
          </div>
        </div>

        <div
          style={{
            padding: '8px 12px',
            borderRadius: '10px',
            background: stoppedCount > 0 ? 'rgba(239, 68, 68, 0.12)' : 'var(--muted-fill)',
            border: stoppedCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(var(--line-rgb), 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: stoppedCount > 0 ? 'var(--status-danger)' : 'var(--text-muted)'
            }}
          />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: stoppedCount > 0 ? 'var(--status-danger)' : 'var(--text-muted)' }}>
              {stoppedCount}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Stopped</div>
          </div>
        </div>
      </div>

      {/* Mini Node Graph SVG */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg viewBox="0 0 280 280" style={{ width: '220px', height: '220px' }}>
          <defs>
            <radialGradient id="centerCoreGlow">
              <stop offset="0%" stopColor="var(--brand-purple)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--brand-purple)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Orbit Ring */}
          <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="rgba(var(--line-rgb), 0.1)" strokeDasharray="4 4" />
          <circle cx={centerX} cy={centerY} r={radius + 15} fill="none" stroke="rgba(var(--line-rgb), 0.05)" />

          {/* Connecting spiderweb spokes */}
          {fleet.map((ag, i) => {
            const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const isHovered = hoveredAgent?.id === ag.id;
            return (
              <line
                key={`line-${ag.id}`}
                x1={centerX}
                y1={centerY}
                x2={x}
                y2={y}
                stroke={isHovered ? getStatusColor(ag.status) : 'rgba(var(--line-rgb), 0.12)'}
                strokeWidth={isHovered ? 2 : 1}
              />
            );
          })}

          {/* Universal Center Hub */}
          <circle cx={centerX} cy={centerY} r="32" fill="url(#centerCoreGlow)" />
          <circle cx={centerX} cy={centerY} r="22" fill="linear-gradient(135deg, var(--brand-purple), var(--brand-blue))" />
          <text x={centerX} y={centerY - 3} fill="#fff" fontSize="8" fontWeight="800" textAnchor="middle">GWC</text>
          <text x={centerX} y={centerY + 8} fill="#a684ee" fontSize="7" fontWeight="700" textAnchor="middle">CORE</text>

          {/* 19 Satellite Module Nodes */}
          {fleet.map((ag, i) => {
            const angle = (i * 2 * Math.PI) / total - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const isHovered = hoveredAgent?.id === ag.id;
            const nodeColor = getStatusColor(ag.status);

            return (
              <g
                key={ag.id}
                transform={`translate(${x}, ${y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectAgent ? onSelectAgent(ag) : onNavigateToAgents()}
                onMouseEnter={() => setHoveredAgent(ag)}
                onMouseLeave={() => setHoveredAgent(null)}
              >
                <circle
                  r={isHovered ? 11 : 8}
                  fill={isHovered ? nodeColor : 'rgb(var(--surface-rgb))'}
                  stroke={nodeColor}
                  strokeWidth="2"
                />
                <text
                  x="0"
                  y="3"
                  fill={isHovered ? '#fff' : 'var(--text-primary)'}
                  fontSize="7"
                  fontWeight="800"
                  textAnchor="middle"
                >
                  {ag.agentNumber}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hovered Module Detail Card */}
        {hoveredAgent && (
          <div
            style={{
              position: 'absolute',
              bottom: '0px',
              left: '0px',
              right: '0px',
              background: 'rgb(var(--surface-rgb))',
              border: `1.5px solid ${getStatusColor(hoveredAgent.status)}`,
              borderRadius: '10px',
              padding: '8px 12px',
              boxShadow: '0 8px 24px rgba(var(--shadow-rgb), 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 20
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-primary)' }}>
                Module {hoveredAgent.agentNumber}: {hoveredAgent.name}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Port {hoveredAgent.port} • Success Rate: 99.4% • Last ping: Just now
              </div>
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: getStatusColor(hoveredAgent.status)
              }}
            >
              ● {hoveredAgent.status.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Fleet Meta Footer */}
      <div
        style={{
          borderTop: '1px solid rgba(var(--line-rgb), 0.08)',
          paddingTop: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11.5px',
          color: 'var(--text-secondary)'
        }}
      >
        <span>Operational Success Rate: <strong style={{ color: 'var(--status-success)' }}>99.4%</strong></span>
        <span>Telemetry Latency: <strong style={{ color: 'var(--brand-purple)' }}>18ms</strong></span>
      </div>
    </div>
  );
}
