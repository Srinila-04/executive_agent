import React from 'react';
import {
  FileCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function DailyManagementBrief({
  onJumpToDecisions,
  onSelectPlant,
  selectedPlant
}) {
  const hour = new Date().getHours();
  const greetingTime = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div
      style={{
        background: 'rgb(var(--surface-rgb))',
        borderRadius: '14px',
        padding: '16px 20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        position: 'relative',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                padding: '3px 10px',
                borderRadius: '5px',
                background: 'var(--brand-purple)',
                color: '#fff'
              }}
            >
              Executive Daily Brief
            </span>
            <span style={{ fontSize: '13px', color: '#111111', fontWeight: 700 }}>
              Consortium Output: <strong>96.4% Attainment</strong> Across 6 Facilities
            </span>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#000000', margin: '6px 0' }}>
            {greetingTime}, Srinila. Output is 96.4% across 6 plants. 3 items need your decision.
          </h1>

          <p style={{ fontSize: '13.5px', color: '#111111', maxWidth: '820px', margin: 0, lineHeight: 1.5 }}>
            Unified view synthesized from live plant floor telemetry across all 19 operations sectors.
          </p>
        </div>

        {/* Quick Decision Jump Action */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className="btn-primary"
            onClick={onJumpToDecisions}
            style={{
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <FileCheck size={16} /> 3 Decisions Waiting For You <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 3 Executive Analysis Pillars (What Changed, Why It Matters, What You Should Decide) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
          marginTop: '16px'
        }}
      >
        {/* Pillar 1: What Changed Since Yesterday */}
        <div
          style={{
            background: 'var(--muted-fill)',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000000', fontSize: '12.5px', fontWeight: 700, textTransform: 'uppercase' }}>
              <TrendingUp size={15} style={{ color: 'var(--brand-purple)' }} /> What Changed
            </div>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '16px', fontSize: '13px', color: '#000000', lineHeight: 1.6 }}>
              <li>
                <strong>Pune Line 04:</strong> Throughput gained <strong>+3.2%</strong> after tooling recalibration.
              </li>
              <li>
                <strong>Chennai Stamping:</strong> SS-304 sheet coil reserve at <strong>1.8 days</strong> (buffer alert).
              </li>
              <li>
                <strong>Sanand Unit 07:</strong> Bearing vibration drift flagged with <strong>120h window</strong>.
              </li>
            </ul>
          </div>
          <div style={{ fontSize: '11.5px', color: '#111111', fontWeight: 700, marginTop: '8px' }}>
            Source: Operations Telemetry
          </div>
        </div>

        {/* Pillar 2: Why It Matters */}
        <div
          style={{
            background: 'var(--muted-fill)',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000000', fontSize: '12.5px', fontWeight: 700, textTransform: 'uppercase' }}>
              <AlertTriangle size={15} style={{ color: 'var(--status-warning)' }} /> Why It Matters
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#000000', lineHeight: 1.6 }}>
              Unapproved coil orders risk <strong>₹24.8 Cr</strong> in OEM deliveries in 36h. Early vibration servicing prevents a <strong>$180,000 thermal seizure</strong> and 4.2h line halt.
            </p>
          </div>
          <div style={{ fontSize: '11.5px', color: '#111111', fontWeight: 700, marginTop: '8px' }}>
            Risk Impact: High
          </div>
        </div>

        {/* Pillar 3: What You Should Decide */}
        <div
          style={{
            background: 'var(--muted-fill)',
            borderRadius: '10px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#000000', fontSize: '12.5px', fontWeight: 700, textTransform: 'uppercase' }}>
              <CheckCircle2 size={15} style={{ color: 'var(--status-success)' }} /> What To Decide Today
            </div>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '16px', fontSize: '13px', color: '#000000', lineHeight: 1.6 }}>
              <li>
                <strong>Approve PO #PO-94182</strong> to JSW Steel for 40T SS-304 coils.
              </li>
              <li>
                <strong>Authorize 20-min Saturday shutdown</strong> for Sanand spindle.
              </li>
              <li>
                <strong>Lock Shift-2 schedule</strong> for 42,000 units on Line 03.
              </li>
            </ul>
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--status-success)', fontWeight: 700, marginTop: '8px' }}>
            Queued for authorization below
          </div>
        </div>
      </div>
    </div>
  );
}
