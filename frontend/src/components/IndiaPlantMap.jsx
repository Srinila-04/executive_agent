import React, { useState } from 'react';
import { MapPin, Activity, AlertTriangle, Users, TrendingUp, ShieldCheck } from 'lucide-react';

export default function IndiaPlantMap({ plants, selectedPlant, onSelectPlant }) {
  const [hoveredPlant, setHoveredPlant] = useState(null);

  // Accurate SVG coordinates mapped onto the stylized India peninsula outline
  const plantCoordinates = {
    'PLANT-HR-04': { x: 235, y: 145, label: 'Manesar, Haryana', state: 'Haryana' },
    'PLANT-GJ-03': { x: 155, y: 240, label: 'Sanand, Gujarat', state: 'Gujarat' },
    'PLANT-MH-02': { x: 215, y: 320, label: 'Pune, Maharashtra', state: 'Maharashtra' },
    'PLANT-KA-05': { x: 230, y: 440, label: 'Bengaluru, Karnataka', state: 'Karnataka' },
    'PLANT-TN-01': { x: 285, y: 460, label: 'Chennai, Tamil Nadu', state: 'Tamil Nadu' }
  };

  const getStatusColor = (status) => {
    if (status === 'critical') return 'var(--status-danger)';
    if (status === 'warning') return 'var(--status-warning)';
    return 'var(--status-success)';
  };

  const getStatusBg = (status) => {
    if (status === 'critical') return 'rgba(239, 68, 68, 0.15)';
    if (status === 'warning') return 'rgba(245, 158, 11, 0.15)';
    return 'rgba(16, 185, 129, 0.15)';
  };

  return (
    <div
      style={{
        position: 'relative',
        background: 'radial-gradient(circle at 40% 45%, rgba(111, 61, 186, 0.06) 0%, transparent 70%), var(--kg-bg-2)',
        borderRadius: '18px',
        border: '1px solid rgba(var(--line-rgb), 0.12)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '440px',
        overflow: 'hidden'
      }}
    >
      {/* Map Header with Filter status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-purple)', letterSpacing: '0.8px' }}>
              Multi-State Operations Map
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '99px',
                background: selectedPlant ? 'var(--dr-active)' : 'rgba(16, 185, 129, 0.12)',
                color: selectedPlant ? 'var(--brand-purple)' : 'var(--status-success)'
              }}
            >
              {selectedPlant ? `Filtered: ${selectedPlant.state}` : '● All 5 State Hubs Synced'}
            </span>
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            India Industrial Manufacturing Corridor
          </h3>
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Click any plant pin to filter enterprise KPIs and alerts to that state
          </p>
        </div>

        {selectedPlant && (
          <button
            style={{
              padding: '4px 10px',
              borderRadius: '8px',
              border: '1px solid rgba(var(--line-rgb), 0.15)',
              background: 'rgb(var(--surface-rgb))',
              color: 'var(--brand-purple)',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            onClick={() => onSelectPlant(null)}
          >
            Reset to All Plants ✕
          </button>
        )}
      </div>

      {/* SVG Map Container */}
      <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg
          viewBox="0 0 500 560"
          style={{ width: '100%', height: '100%', maxHeight: '380px' }}
        >
          <defs>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand-purple)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0.05" />
            </linearGradient>
            <filter id="pinGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Stylized Modern High-Tech India Map Silhouette */}
          <path
            d="M 230 40 
               C 245 45, 270 70, 275 95 
               C 285 110, 310 120, 320 140 
               C 335 155, 360 170, 370 190 
               C 365 205, 340 215, 335 235 
               C 330 250, 345 270, 340 290 
               C 335 315, 320 330, 310 355 
               C 305 380, 315 410, 305 440 
               C 295 470, 280 500, 255 520 
               C 240 500, 220 460, 215 420 
               C 205 385, 185 365, 175 335 
               C 165 310, 140 295, 130 270 
               C 120 245, 135 220, 140 200 
               C 150 175, 180 155, 195 130 
               C 205 105, 215 70, 230 40 Z"
            fill="url(#mapGradient)"
            stroke="var(--brand-purple)"
            strokeWidth="1.8"
            strokeDasharray="4 3"
            opacity="0.85"
          />

          {/* Golden Quadrilateral Industrial Corridor Connectors */}
          <path
            d="M 235 145 L 155 240 L 215 320 L 230 440 L 285 460 Z"
            fill="none"
            stroke="var(--brand-purple)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.4"
          />

          {/* Active Data Packets moving along the corridor */}
          <circle r="3.5" fill="var(--brand-blue)">
            <animateMotion
              path="M 235 145 L 155 240 L 215 320 L 230 440 L 285 460 Z"
              dur="6s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Interactive Plant Pins */}
          {plants.map((plant) => {
            const coords = plantCoordinates[plant.plantCode];
            if (!coords) return null;

            const isSelected = selectedPlant?.plantCode === plant.plantCode;
            const isHovered = hoveredPlant?.plantCode === plant.plantCode;
            const pinColor = getStatusColor(plant.status || 'optimal');
            const pinBg = getStatusBg(plant.status || 'optimal');

            return (
              <g
                key={plant.plantCode}
                transform={`translate(${coords.x}, ${coords.y})`}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectPlant(isSelected ? null : plant)}
                onMouseEnter={() => setHoveredPlant(plant)}
                onMouseLeave={() => setHoveredPlant(null)}
              >
                {/* Concentric Pulse Ring for active plant */}
                <circle
                  r={isSelected ? 22 : 14}
                  fill={pinBg}
                  stroke={pinColor}
                  strokeWidth={isSelected ? 2 : 1}
                  opacity={isSelected ? 0.9 : 0.6}
                >
                  <animate
                    attributeName="r"
                    values={isSelected ? '18;26;18' : '12;18;12'}
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Core Pin Dot */}
                <circle
                  r={isSelected ? 9 : 7}
                  fill={pinColor}
                  filter="url(#pinGlow)"
                  stroke="#fff"
                  strokeWidth="2"
                />

                {/* State Tag Badge */}
                <rect
                  x="-38"
                  y="-26"
                  width="76"
                  height="16"
                  rx="8"
                  fill="rgb(var(--surface-rgb))"
                  stroke={isSelected ? pinColor : 'rgba(var(--line-rgb), 0.15)'}
                  strokeWidth={isSelected ? 1.5 : 1}
                />
                <text
                  x="0"
                  y="-14"
                  fill="var(--text-primary)"
                  fontSize="9"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {coords.state}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live Hover Tooltip Card */}
        {hoveredPlant && (
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              background: 'rgb(var(--surface-rgb))',
              borderRadius: '12px',
              border: `1.5px solid ${getStatusColor(hoveredPlant.status || 'optimal')}`,
              padding: '12px 14px',
              boxShadow: '0 8px 24px rgba(var(--shadow-rgb), 0.18)',
              zIndex: 30,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              animation: 'fadeIn 0.15s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getStatusColor(hoveredPlant.status || 'optimal')
                  }}
                />
                <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                  {hoveredPlant.plantName}
                </strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  ({hoveredPlant.district}, {hoveredPlant.state})
                </span>
              </div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '6px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                <span>Lines: <strong>{hoveredPlant.lines}</strong></span>
                <span>Output Today: <strong style={{ color: 'var(--brand-purple)' }}>{hoveredPlant.outputToday || '42,100 units'}</strong></span>
                <span>Workforce: <strong>{hoveredPlant.workforce || '480 on shift'}</strong></span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: getStatusColor(hoveredPlant.status || 'optimal') }}>
                OEE: {hoveredPlant.oee || '88.4%'}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                {hoveredPlant.activeAgents || 19} Modules Active
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Legend */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(var(--line-rgb), 0.08)',
          paddingTop: '12px',
          fontSize: '11.5px',
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-success)' }} />
            Healthy (4 Hubs)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-warning)' }} />
            Stock Warning (Sanand)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-danger)' }} />
            Line Stoppage (0)
          </span>
        </div>
        <span style={{ fontWeight: 600, color: 'var(--brand-purple)' }}>
          Total Shift Headcount: 2,420
        </span>
      </div>
    </div>
  );
}
