import React, { useState } from 'react';
import {
  Cpu,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function SavingsAndStatusStrip({ agents, onNavigateToAgents }) {
  const [hoveredDot, setHoveredDot] = useState(null);

  // 19 functional operations (excluding Executive Orchestration)
  const functionalUnits = (agents || []).filter((a) => a.id !== 20);
  const runningCount = functionalUnits.filter((a) => a.status === 'running').length || 18;
  const warningCount = functionalUnits.filter((a) => a.status === 'warning').length || 1;
  const stoppedCount = functionalUnits.filter((a) => a.status === 'stopped').length || 0;

  return (
    <div
      className="card"
      style={{
        padding: '12px 18px',
        background: 'rgb(var(--surface-rgb))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* Status Text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Cpu size={18} style={{ color: 'var(--brand-purple)' }} />
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#000000' }}>
            19 Operations Systems Active • 1 Maintenance Flag
          </div>
          <div style={{ fontSize: '12px', color: '#111111', marginTop: '2px' }}>
            Telemetry Heartbeat: <strong style={{ color: 'var(--status-success)' }}>Optimal (18ms)</strong> • 0 Stoppages
          </div>
        </div>
      </div>

      {/* 19 Colored Dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', position: 'relative' }}>
        {functionalUnits.map((m) => {
          const isWarn = m.status === 'warning';
          const isStopped = m.status === 'stopped';
          const dotColor = isStopped
            ? 'var(--status-danger)'
            : isWarn
            ? 'var(--status-warning)'
            : 'var(--status-success)';

          return (
            <div
              key={m.id}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredDot(m)}
              onMouseLeave={() => setHoveredDot(null)}
            >
              <div
                style={{
                  width: '11px',
                  height: '11px',
                  borderRadius: '50%',
                  background: dotColor,
                  cursor: 'pointer',
                  boxShadow: isWarn ? '0 0 6px var(--status-warning)' : 'none'
                }}
                onClick={onNavigateToAgents}
              />
            </div>
          );
        })}

        {/* Hover Tooltip for Dot */}
        {hoveredDot && (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '0px',
              background: '#000000',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              zIndex: 30
            }}
          >
            <strong>Sector {hoveredDot.agentNumber < 10 ? '0' : ''}{hoveredDot.agentNumber}:</strong> {hoveredDot.name} • <span>{hoveredDot.status.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* View All Button */}
      <button
        className="btn-secondary"
        onClick={onNavigateToAgents}
        style={{
          fontSize: '12.5px',
          fontWeight: 600,
          padding: '7px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          color: '#000000',
          background: 'var(--muted-fill)',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        View All 19 Operations <ArrowRight size={14} />
      </button>
    </div>
  );
}
