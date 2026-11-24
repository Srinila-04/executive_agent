import React, { useState } from 'react';
import { BarChart3, PieChart, Award, TrendingUp, AlertTriangle } from 'lucide-react';

export default function OverviewCharts() {
  const [activeBar, setActiveBar] = useState(null);
  const [activeDonutSlice, setActiveDonutSlice] = useState(null);

  // 1. Plant Production vs Target Data
  const plantProductionData = [
    { plant: 'Manesar (HR)', actual: 68400, target: 70000, attainment: 97.7 },
    { plant: 'Pune (MH)', actual: 54200, target: 58000, attainment: 93.4 },
    { plant: 'Chennai (TN)', actual: 42100, target: 44000, attainment: 95.6 },
    { plant: 'Sanand (GJ)', actual: 38900, target: 40000, attainment: 97.2 },
    { plant: 'Bengaluru (KA)', actual: 18500, target: 19000, attainment: 97.3 }
  ];

  // 2. Downtime Reason Donut Data (Degrees and Percentages)
  const downtimeReasons = [
    { label: 'Tooling & Changeover', pct: 38, hours: '14.2h', color: '#6f3dba' },
    { label: 'Spindle / Bearing Wear', pct: 26, hours: '9.8h', color: '#4d8eeb' },
    { label: 'Material Starvation', pct: 20, hours: '7.5h', color: '#f58a3a' },
    { label: 'Operator / Shift Gaps', pct: 16, hours: '6.0h', color: '#10b981' }
  ];

  // 3. Plant Leaderboard
  const leaderboard = [
    { rank: 1, name: 'Bengaluru Robotics Hub', oee: 94.2, fpy: 99.4, color: 'var(--status-success)' },
    { rank: 2, name: 'Sanand EV Powertrain', oee: 91.0, fpy: 98.9, color: 'var(--status-success)' },
    { rank: 3, name: 'Manesar Wire & Polymers', oee: 89.5, fpy: 98.4, color: 'var(--brand-blue)' },
    { rank: 4, name: 'Chennai Precision Auto', oee: 88.4, fpy: 98.1, color: 'var(--brand-purple)' },
    { rank: 5, name: 'Pune Stamping & Assembly', oee: 86.2, fpy: 97.6, color: 'var(--brand-orange)' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr 1.4fr', gap: '20px' }}>
      {/* Chart 1: Production vs Target (SVG Bar Chart) */}
      <div
        className="card"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgb(var(--surface-rgb))'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-purple)', letterSpacing: '0.8px' }}>
              Production Attainment
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              Actual vs Target by Plant Hub
            </h4>
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '10.5px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', background: 'var(--brand-purple)', borderRadius: '2px' }} /> Actual
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', background: 'var(--muted-fill)', borderRadius: '2px' }} /> Target
            </span>
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div style={{ position: 'relative', height: '200px', marginTop: '16px' }}>
          <svg viewBox="0 0 380 180" style={{ width: '100%', height: '100%' }}>
            {plantProductionData.map((d, idx) => {
              const x = 20 + idx * 72;
              const maxVal = 75000;
              const targetHeight = (d.target / maxVal) * 130;
              const actualHeight = (d.actual / maxVal) * 130;
              const isHovered = activeBar === idx;

              return (
                <g
                  key={d.plant}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setActiveBar(idx)}
                  onMouseLeave={() => setActiveBar(null)}
                >
                  {/* Target Bar (Background) */}
                  <rect
                    x={x + 12}
                    y={150 - targetHeight}
                    width="32"
                    height={targetHeight}
                    rx="4"
                    fill="var(--muted-fill)"
                  />
                  {/* Actual Bar (Foreground) */}
                  <rect
                    x={x + 16}
                    y={150 - actualHeight}
                    width="24"
                    height={actualHeight}
                    rx="4"
                    fill={isHovered ? 'var(--brand-blue)' : 'var(--brand-purple)'}
                    filter={isHovered ? 'drop-shadow(0 4px 8px rgba(111, 61, 186, 0.4))' : 'none'}
                    transition="all 0.2s ease"
                  />
                  {/* Attainment % Badge */}
                  <text
                    x={x + 28}
                    y={140 - actualHeight}
                    fill={isHovered ? 'var(--brand-blue)' : 'var(--text-primary)'}
                    fontSize="9.5"
                    fontWeight="800"
                    textAnchor="middle"
                  >
                    {d.attainment}%
                  </text>
                  {/* X Axis Label */}
                  <text
                    x={x + 28}
                    y="168"
                    fill="var(--text-muted)"
                    fontSize="8.5"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {d.plant.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Bar Info */}
        <div
          style={{
            borderTop: '1px solid rgba(var(--line-rgb), 0.08)',
            paddingTop: '8px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>Consortium Output Today: <strong style={{ color: 'var(--brand-purple)' }}>222,100 units</strong></span>
          <span>Target Attainment: <strong style={{ color: 'var(--status-success)' }}>96.2%</strong></span>
        </div>
      </div>

      {/* Chart 2: Downtime Loss Pareto (Interactive SVG Donut Chart) */}
      <div
        className="card"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgb(var(--surface-rgb))'
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-orange)', letterSpacing: '0.8px' }}>
            Loss Root Cause Pareto
          </div>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Downtime Attribution (37.5 hrs)
          </h4>
        </div>

        {/* SVG Donut Center */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: '170px' }}>
          <svg viewBox="0 0 160 160" style={{ width: '150px', height: '150px' }}>
            {/* Donut Segments using dasharray */}
            <circle
              cx="80"
              cy="80"
              r="54"
              fill="none"
              stroke="#6f3dba"
              strokeWidth="20"
              strokeDasharray="128.8 339"
              strokeDashoffset="0"
            />
            <circle
              cx="80"
              cy="80"
              r="54"
              fill="none"
              stroke="#4d8eeb"
              strokeWidth="20"
              strokeDasharray="88.2 339"
              strokeDashoffset="-128.8"
            />
            <circle
              cx="80"
              cy="80"
              r="54"
              fill="none"
              stroke="#f58a3a"
              strokeWidth="20"
              strokeDasharray="67.8 339"
              strokeDashoffset="-217"
            />
            <circle
              cx="80"
              cy="80"
              r="54"
              fill="none"
              stroke="#10b981"
              strokeWidth="20"
              strokeDasharray="54.2 339"
              strokeDashoffset="-284.8"
            />
            {/* Center Label */}
            <text x="80" y="76" fill="var(--text-primary)" fontSize="16" fontWeight="900" textAnchor="middle">
              37.5h
            </text>
            <text x="80" y="92" fill="var(--text-muted)" fontSize="9" fontWeight="700" textAnchor="middle">
              TOTAL LOSS
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
          {downtimeReasons.map((r) => (
            <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color }} />
              <span style={{ color: 'var(--text-secondary)' }}>
                {r.label}: <strong>{r.pct}%</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 3: Plant Performance Leaderboard */}
      <div
        className="card"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgb(var(--surface-rgb))'
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--status-success)', letterSpacing: '0.8px' }}>
            Executive Benchmarking
          </div>
          <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Plant Efficiency Leaderboard
          </h4>
        </div>

        {/* Ranked Plants List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '10px 0' }}>
          {leaderboard.map((item) => (
            <div
              key={item.rank}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                padding: '4px 0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  #{item.rank} {item.name}
                </span>
                <span style={{ fontWeight: 800, color: item.color }}>
                  OEE {item.oee}%
                </span>
              </div>
              {/* Horizontal Progress Bar */}
              <div style={{ height: '6px', background: 'var(--muted-fill)', borderRadius: '99px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(item.oee / 100) * 100}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: '99px'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-muted)', borderTop: '1px solid rgba(var(--line-rgb), 0.08)', paddingTop: '8px' }}>
          Top Performer: <strong>Bengaluru Hub</strong> (94.2% OEE • 99.4% FPY)
        </div>
      </div>
    </div>
  );
}
