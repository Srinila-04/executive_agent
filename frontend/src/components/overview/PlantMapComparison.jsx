import React, { useState, useEffect } from 'react';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Users,
  Filter
} from 'lucide-react';

export default function PlantMapComparison({
  selectedPlant,
  onSelectPlant
}) {
  const [hoveredPlant, setHoveredPlant] = useState(null);

  const defaultPlants = [
    {
      code: 'IN-TN-01',
      name: 'Chennai Electronics Plant',
      district: 'Sriperumbudur / Kanchipuram',
      state: 'Tamil Nadu',
      mapX: 230,
      mapY: 365,
      status: 'optimal',
      badge: 'High Efficiency',
      output: '1,206,371 units',
      target: '1,457,280 units',
      gap: '-17.2%',
      isPositive: true,
      oee: '87.4%',
      fpy: '98.2%',
      workforce: '680 staff',
      problems: '0 active critical alarms',
      lines: 2
    },
    {
      code: 'IN-KA-01',
      name: 'Bengaluru Electronics Plant',
      district: 'Peenya / Whitefield',
      state: 'Karnataka',
      mapX: 200,
      mapY: 345,
      status: 'optimal',
      badge: 'Top Quality',
      output: '1,217,813 units',
      target: '1,457,280 units',
      gap: '-16.4%',
      isPositive: true,
      oee: '87.4%',
      fpy: '98.2%',
      workforce: '630 staff',
      problems: '0 active critical alarms',
      lines: 2
    }
  ];

  const [plants, setPlants] = useState(defaultPlants);

  useEffect(() => {
    fetch('/api/analytics/plant-comparison')
      .then((res) => res.json())
      .then((data) => {
        if (data.plants && data.plants.length > 0) {
          setPlants(data.plants);
        }
      })
      .catch((err) => console.error('Failed to load plant comparison from Neon DB:', err));
  }, []);

  const getStatusColor = (status) => {
    if (status === 'warning') return '#b45309';
    if (status === 'danger') return '#b91c1c';
    return '#047857';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1.65fr', gap: '16px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* LEFT: India Map with Glowing State Pins */}
      <div
        className="card"
        style={{
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgb(var(--surface-rgb))',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.8px' }}>
              Multi-State Footprint
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
              India Multi-Plant Network
            </h3>
          </div>
          {selectedPlant && (
            <button
              className="btn-secondary"
              style={{ fontSize: '12px', padding: '4px 10px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", border: 'none', background: 'var(--muted-fill)', color: '#000000', cursor: 'pointer', borderRadius: '5px', fontWeight: 600 }}
              onClick={() => onSelectPlant(null)}
            >
              <Filter size={13} /> Clear Filter
            </button>
          )}
        </div>

        {/* SVG India Map Silhouette & Interactive Pins */}
        <div style={{ position: 'relative', width: '100%', height: '320px', margin: '8px 0', display: 'flex', justifyContent: 'center' }}>
          <svg
            viewBox="0 0 400 450"
            style={{ width: '100%', height: '100%', maxWidth: '340px' }}
          >
            {/* Soft India Geometric Shape */}
            <path
              d="M 180 50
                 L 220 70 L 250 100 L 245 130 L 270 160 L 320 180 L 350 210
                 L 330 240 L 280 250 L 260 280 L 250 340 L 220 400 L 200 440
                 L 190 400 L 160 340 L 140 280 L 110 230 L 130 180 L 170 140
                 L 165 90 Z"
              fill="rgba(111, 61, 186, 0.05)"
              stroke="rgba(111, 61, 186, 0.2)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Connecting Telemetry Links */}
            {plants.map((p, idx) => {
              const next = plants[(idx + 1) % plants.length];
              return (
                <line
                  key={`link-${p.code}`}
                  x1={p.mapX}
                  y1={p.mapY}
                  x2={next.mapX}
                  y2={next.mapY}
                  stroke="rgba(0, 0, 0, 0.12)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              );
            })}

            {/* Plant Pins */}
            {plants.map((p) => {
              const isSelected = selectedPlant?.plantCode === p.code || selectedPlant?.code === p.code;
              const isHovered = hoveredPlant?.code === p.code;
              const color = getStatusColor(p.status);

              return (
                <g
                  key={p.code}
                  transform={`translate(${p.mapX}, ${p.mapY})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSelectPlant(isSelected ? null : p)}
                  onMouseEnter={() => setHoveredPlant(p)}
                  onMouseLeave={() => setHoveredPlant(null)}
                >
                  <circle
                    r={isSelected || isHovered ? 14 : 9}
                    fill={color}
                    opacity="0.25"
                  />
                  <circle
                    r={isSelected || isHovered ? 7 : 5}
                    fill={color}
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  <text
                    x="10"
                    y="4"
                    fill="#000000"
                    fontSize="11.5"
                    fontFamily="'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                    fontWeight="700"
                  >
                    {p.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Floating Details Tooltip */}
          {hoveredPlant && (
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                background: '#000000',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 20
              }}
            >
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700 }}>
                  {hoveredPlant.name} ({hoveredPlant.state})
                </div>
                <div style={{ fontSize: '12px', color: '#e5e7eb' }}>
                  Output: {hoveredPlant.output} • OEE: {hoveredPlant.oee}
                </div>
              </div>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: hoveredPlant.isPositive ? '#34d399' : '#fbbf24'
                }}
              >
                {hoveredPlant.gap} vs target
              </span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#000000', fontWeight: 700 }}>
          <span>● Optimal (4 Plants)</span>
          <span style={{ color: '#b45309' }}>● Amber: Needs Attention</span>
          <span>Click pin to filter</span>
        </div>
      </div>

      {/* RIGHT: Plant Comparison Leaderboard Table */}
      <div
        className="card"
        style={{
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'rgb(var(--surface-rgb))'
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.8px' }}>
                Benchmarking
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
                Plant Performance & Gap-to-Target
              </h3>
            </div>
            <span style={{ fontSize: '12px', color: '#000000', fontWeight: 700 }}>
              Ranked by Performance
            </span>
          </div>

          {/* Comparison Table without heavy lines */}
          <div style={{ overflowX: 'auto', marginTop: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ color: '#000000', textAlign: 'left', fontWeight: 700, background: 'var(--muted-fill)', fontSize: '12.5px' }}>
                  <th style={{ padding: '8px 10px', borderRadius: '4px 0 0 4px' }}>Plant</th>
                  <th style={{ padding: '8px 10px' }}>Output</th>
                  <th style={{ padding: '8px 10px' }}>OEE</th>
                  <th style={{ padding: '8px 10px' }}>Gap</th>
                  <th style={{ padding: '8px 10px' }}>Staff</th>
                  <th style={{ padding: '8px 10px', borderRadius: '0 4px 4px 0' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {plants.map((p) => {
                  const isSelected = selectedPlant?.plantCode === p.code || selectedPlant?.code === p.code;
                  return (
                    <tr
                      key={p.code}
                      onClick={() => onSelectPlant(isSelected ? null : p)}
                      style={{
                        cursor: 'pointer',
                        background: isSelected ? 'var(--brand-purple-soft)' : 'transparent',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'var(--muted-fill)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '10px 10px' }}>
                        <div style={{ fontWeight: 700, color: '#000000' }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#111111' }}>
                          {p.district}, {p.state} • {p.lines} Lines
                        </div>
                      </td>

                      <td style={{ padding: '10px 10px' }}>
                        <div style={{ fontWeight: 700, color: '#000000' }}>
                          {p.output}
                        </div>
                        <div style={{ fontSize: '12px', color: '#111111' }}>
                          / {p.target}
                        </div>
                      </td>

                      <td style={{ padding: '10px 10px', fontWeight: 700, color: '#000000' }}>
                        {p.oee}
                      </td>

                      <td style={{ padding: '10px 10px' }}>
                        <span
                          style={{
                            fontWeight: 700,
                            color: p.isPositive ? 'var(--status-success)' : 'var(--status-danger)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          {p.isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {p.gap}
                        </span>
                      </td>

                      <td style={{ padding: '10px 10px', color: '#000000', fontWeight: 500 }}>
                        {p.workforce}
                      </td>

                      <td style={{ padding: '10px 10px' }}>
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: p.status === 'warning' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                            color: getStatusColor(p.status)
                          }}
                        >
                          {p.badge}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Insight */}
        <div
          style={{
            padding: '10px 12px',
            background: 'var(--muted-fill)',
            borderRadius: '6px',
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12.5px'
          }}
        >
          <span style={{ color: '#000000' }}>
            Consortium Today: <strong>248,500 units</strong> (+3.2% vs target)
          </span>
          <span style={{ color: '#000000', fontWeight: 700 }}>
            Bengaluru leads: 94.2% OEE
          </span>
        </div>
      </div>
    </div>
  );
}
