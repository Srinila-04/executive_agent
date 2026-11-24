import React, { useState } from 'react';
import {
  MapPin,
  Globe2,
  Building2,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function MultiPlantNetworkVisual({ selectedPlant, onSelectPlant }) {
  const [activeDistrict, setActiveDistrict] = useState(selectedPlant || null);

  const districts = [
    {
      code: 'PLANT-TN-01',
      name: 'Chennai Precision Automotive Hub',
      state: 'Tamil Nadu',
      district: 'Kanchipuram & Sriperumbudur',
      lines: 14,
      oee: '88.4%',
      fpy: '98.1%',
      status: 'optimal',
      alert: null,
      outputToday: '42,100 parts',
      activeAgents: 19,
      x: 320,
      y: 280
    },
    {
      code: 'PLANT-MH-02',
      name: 'Pune Stamping & Assembly Works',
      state: 'Maharashtra',
      district: 'Pune & Chakan Industrial Belt',
      lines: 18,
      oee: '86.2%',
      fpy: '97.6%',
      status: 'optimal',
      alert: null,
      outputToday: '54,200 parts',
      activeAgents: 19,
      x: 230,
      y: 220
    },
    {
      code: 'PLANT-GJ-03',
      name: 'Sanand EV Powertrain & Casting Unit',
      state: 'Gujarat',
      district: 'Sanand & Ahmedabad Zone',
      lines: 12,
      oee: '91.0%',
      fpy: '98.9%',
      status: 'warning',
      alert: 'Minor stock buffer alert (Coils)',
      outputToday: '38,900 parts',
      activeAgents: 18,
      x: 180,
      y: 160
    },
    {
      code: 'PLANT-HR-04',
      name: 'Manesar Polymer & Wire Harness Plant',
      state: 'Haryana',
      district: 'Gurugram & Manesar',
      lines: 22,
      oee: '89.5%',
      fpy: '98.4%',
      status: 'optimal',
      alert: null,
      outputToday: '68,400 parts',
      activeAgents: 19,
      x: 280,
      y: 100
    },
    {
      code: 'PLANT-KA-05',
      name: 'Bengaluru Advanced Robotics & R&D',
      state: 'Karnataka',
      district: 'Bengaluru Urban & Peenya',
      lines: 8,
      oee: '94.2%',
      fpy: '99.4%',
      status: 'optimal',
      alert: null,
      outputToday: '18,500 parts',
      activeAgents: 19,
      x: 290,
      y: 330
    },
    {
      code: 'PLANT-US-06',
      name: 'Austin Global Export Assembly',
      state: 'Texas (USA)',
      district: 'Austin Metro & Travis County',
      lines: 10,
      oee: '90.1%',
      fpy: '98.8%',
      status: 'optimal',
      alert: null,
      outputToday: '24,000 parts',
      activeAgents: 19,
      x: 740,
      y: 180
    }
  ];

  const current = activeDistrict || districts[0];

  return (
    <div
      className="card"
      style={{
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: 'rgb(var(--surface-rgb))'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-purple)', letterSpacing: '0.8px' }}>
            Multi-District Enterprise Governance
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            Consolidated Multi-State Factory Network
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            As the manufacturing company owner, Master Control connects telemetry from all your facilities into a unified executive glass cockpit.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              padding: '6px 14px',
              borderRadius: '99px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--status-success)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span className="pulse-dot" /> 6 Multi-State Hubs Live
          </span>
        </div>
      </div>

      {/* Network Visual Map Diagram */}
      <div
        style={{
          position: 'relative',
          borderRadius: '16px',
          background: 'radial-gradient(ellipse at center, rgba(77, 142, 235, 0.06) 0%, transparent 70%), var(--kg-bg-2)',
          border: '1px solid rgba(var(--line-rgb), 0.12)',
          padding: '24px 16px',
          overflow: 'hidden'
        }}
      >
        <svg viewBox="0 0 960 400" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="linkPulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--brand-purple)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--brand-blue)" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Central Executive Hub (Module 20 / Corporate HQ) */}
          <g transform="translate(480, 200)">
            {/* Concentric Signal Rings */}
            <circle cx="0" cy="0" r="45" fill="rgba(111, 61, 186, 0.1)" stroke="var(--brand-purple)" strokeWidth="1.5" strokeDasharray="3 3">
              <animate attributeName="r" values="35;55;35" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="0" cy="0" r="32" fill="linear-gradient(135deg, var(--brand-purple), var(--brand-blue))" filter="drop-shadow(0 4px 12px rgba(111, 61, 186, 0.5))" />
            <text x="0" y="5" fill="#fff" fontSize="13" fontWeight="900" textAnchor="middle">HQ</text>
            <text x="0" y="52" fill="var(--text-primary)" fontSize="12" fontWeight="800" textAnchor="middle">
              Executive HQ (Noida NCR)
            </text>
            <text x="0" y="66" fill="var(--brand-purple)" fontSize="10.5" fontWeight="600" textAnchor="middle">
              Master Operations Cockpit
            </text>
          </g>

          {/* Connecting Beams to Plants */}
          {districts.map((d) => (
            <g key={d.code}>
              <line
                x1={d.x}
                y1={d.y}
                x2="480"
                y2="200"
                stroke="url(#linkPulseGrad)"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity={current.code === d.code ? 1 : 0.4}
              />
              {/* Animated Packet Pulse */}
              <circle cx="480" cy="200" r="4" fill="#a684ee">
                <animate attributeName="cx" from={d.x} to="480" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="cy" from={d.y} to="200" dur="2.5s" repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* District Plant Nodes */}
          {districts.map((d) => {
            const isSelected = current.code === d.code;
            return (
              <g
                key={d.code}
                transform={`translate(${d.x}, ${d.y})`}
                cursor="pointer"
                onClick={() => {
                  setActiveDistrict(d);
                  if (onSelectPlant) onSelectPlant(d);
                }}
              >
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? "26" : "20"}
                  fill={d.status === 'warning' ? '#f59e0b20' : '#10b98120'}
                  stroke={d.status === 'warning' ? 'var(--status-warning)' : 'var(--status-success)'}
                  strokeWidth={isSelected ? 3 : 2}
                  filter="drop-shadow(0 2px 8px rgba(0,0,0,0.15))"
                />
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? "14" : "10"}
                  fill={d.status === 'warning' ? 'var(--status-warning)' : 'var(--status-success)'}
                />
                <text x="0" y="4" fill="#fff" fontSize={isSelected ? "10" : "8"} fontWeight="800" textAnchor="middle">
                  {d.lines}L
                </text>
                <text
                  x="0"
                  y={isSelected ? "-32" : "-26"}
                  fill="var(--text-primary)"
                  fontSize={isSelected ? "12" : "10.5"}
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {d.state}
                </text>
                <text
                  x="0"
                  y={isSelected ? "-18" : "-14"}
                  fill="var(--text-muted)"
                  fontSize="9"
                  textAnchor="middle"
                >
                  {d.district.split('&')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected District Plant Deep Profile Card */}
      <div
        style={{
          background: 'var(--kg-bg-2)',
          border: '1.5px solid rgba(var(--line-rgb), 0.1)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: '1.8fr repeat(4, 1fr)',
          gap: '20px',
          alignItems: 'center'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px',
                background: 'var(--dr-active)',
                color: 'var(--brand-purple)'
              }}
            >
              {current.code}
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: current.status === 'warning' ? 'var(--status-warning)' : 'var(--status-success)'
              }}
            >
              ● {current.status === 'warning' ? 'Warning Alert' : 'Optimal Synchronized'}
            </span>
          </div>
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {current.name}
          </h4>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={13} style={{ color: 'var(--brand-blue)' }} /> {current.district}, {current.state}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>OEE Score</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-blue)', marginTop: '2px' }}>
            {current.oee}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>First Pass Yield</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--status-success)', marginTop: '2px' }}>
            {current.fpy}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Output Today</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-purple)', marginTop: '2px' }}>
            {current.outputToday}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Active Modules</div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
            {current.activeAgents} / 19 Modules
          </div>
        </div>
      </div>
    </div>
  );
}
