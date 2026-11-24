import React from 'react';
import {
  Boxes,
  Truck,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function SupplyChainAndPeopleView({ onNavigateToAgents }) {
  const materialsAtRisk = [
    {
      material: 'SS-304 Sheet Metal Coils (2.5mm)',
      stockLeft: '1.8 Days',
      criticalThreshold: '2.0 Days',
      affectedLines: 'Pune Line 01 & Chennai Line 02',
      status: 'critical',
      action: 'PO #PO-94182 pending approval'
    },
    {
      material: 'Copper Wire Harness 18AWG Spools',
      stockLeft: '3.1 Days',
      criticalThreshold: '2.0 Days',
      affectedLines: 'Manesar Assembly Line 04',
      status: 'warning',
      action: 'In-transit ETA: Tomorrow 09:00'
    },
    {
      material: 'Polyamide Nylon Pellets Grade B',
      stockLeft: '6.4 Days',
      criticalThreshold: '3.0 Days',
      affectedLines: 'Chennai Precision Molding',
      status: 'healthy',
      action: 'Replenishment on schedule'
    }
  ];

  const suppliers = [
    { name: 'JSW Steel Ltd', otif: '98.4%', ppm: '42 PPM', grade: 'Grade A+', status: 'best' },
    { name: 'Bosch Automotive Tier-1', otif: '97.8%', ppm: '68 PPM', grade: 'Grade A', status: 'best' },
    { name: 'Delta Precision Fasteners', otif: '84.2%', ppm: '310 PPM', grade: 'Grade C', status: 'worst' }
  ];

  const shiftsManpower = [
    { shift: 'Shift 1 (Morning • 06:00 - 14:00)', avail: 480, req: 480, pct: 100, gaps: '0 skill gaps' },
    { shift: 'Shift 2 (Evening • 14:00 - 22:00)', avail: 450, req: 460, pct: 97.8, gaps: '0 gaps (10 reallocated)' },
    { shift: 'Shift 3 (Night • 22:00 - 06:00)', avail: 380, req: 395, pct: 96.2, gaps: '2 Robotic Welding Techs absent' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* COLUMN 1: Supply Chain and Customer View */}
      <div
        className="card"
        style={{
          padding: '16px 18px',
          background: 'rgb(var(--surface-rgb))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.8px' }}>
                Upstream & Downstream Flow
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
                Supply Chain & Customer Orders
              </h3>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'var(--muted-fill)', color: '#000000' }}>
              Procurement & Logistics
            </span>
          </div>

          {/* Section 1A: Materials at Risk */}
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', marginBottom: '8px' }}>
              Materials at Risk (Stockout Threat)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {materialsAtRisk.map((m) => {
                const isCrit = m.status === 'critical';
                const isWarn = m.status === 'warning';
                return (
                  <div
                    key={m.material}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'var(--muted-fill)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '12.5px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#000000' }}>
                        {m.material}
                      </div>
                      <div style={{ fontSize: '12px', color: '#111111', marginTop: '2px' }}>
                        Affects: {m.affectedLines} • {m.action}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: isCrit ? '#b91c1c' : isWarn ? '#b45309' : '#047857'
                        }}
                      >
                        {m.stockLeft}
                      </span>
                      <div style={{ fontSize: '11.5px', color: '#111111', marginTop: '1px' }}>
                        Min {m.criticalThreshold}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 1B: Supplier Scorecard */}
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', marginBottom: '8px' }}>
              Supplier Scorecard (Best vs. At-Risk)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {suppliers.map((s) => (
                <div
                  key={s.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'var(--muted-fill)',
                    fontSize: '12.5px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#000000' }}>{s.name}</span>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: s.status === 'best' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: s.status === 'best' ? '#047857' : '#b91c1c'
                      }}
                    >
                      {s.grade}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#000000', fontWeight: 700 }}>
                    OTIF: <strong>{s.otif}</strong> • Defect: <strong>{s.ppm}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 1C: Orders & Dispatch */}
        <div
          style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: 'var(--muted-fill)',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12.5px'
          }}
        >
          <span style={{ color: '#000000' }}>
            Order Book: <strong>278 On Schedule</strong>, <strong>4 In-Transit</strong>, <strong>2 At-Risk</strong>
          </span>
          <span style={{ color: '#047857', fontWeight: 700 }}>
            98.2% OTIF
          </span>
        </div>
      </div>

      {/* COLUMN 2: People and Workplace Safety */}
      <div
        className="card"
        style={{
          padding: '16px 18px',
          background: 'rgb(var(--surface-rgb))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <div>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.8px' }}>
                Human Capital & EHS
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
                Workforce Allocation & Workplace Safety
              </h3>
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'var(--muted-fill)', color: '#000000' }}>
              Workforce & Safety
            </span>
          </div>

          {/* Section 2A: Shift Manpower & Skill Gaps */}
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', marginBottom: '8px' }}>
              Shift Manpower Allocation vs. Requirement
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {shiftsManpower.map((sm) => (
                <div
                  key={sm.shift}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--muted-fill)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '12.5px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#000000' }}>{sm.shift}</span>
                    <span style={{ fontWeight: 700, color: sm.pct === 100 ? '#047857' : '#b45309' }}>
                      {sm.avail} / {sm.req} staff ({sm.pct}%)
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#000000' }}>
                    Skill matrix: <strong>{sm.gaps}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2B: Safety Record & Environmental Hazards */}
          <div style={{ marginTop: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', marginBottom: '8px' }}>
              Safety Record & Hazard Remediation
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--muted-fill)', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#047857' }}>428</div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: 700, marginTop: '2px' }}>Days Zero LTI</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--muted-fill)', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#000000' }}>0</div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: 700, marginTop: '2px' }}>Open Hazards</div>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--muted-fill)', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#047857' }}>100%</div>
                <div style={{ fontSize: '12px', color: '#000000', fontWeight: 700, marginTop: '2px' }}>LOTO Compliance</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2C: Certification */}
        <div
          style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: 'var(--muted-fill)',
            borderRadius: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12.5px'
          }}
        >
          <span style={{ color: '#000000' }}>
            OSHA & ISO-45001 Status: <strong>100% Compliant</strong> Across All 6 Plants
          </span>
          <span style={{ color: '#047857', fontWeight: 700 }}>
            Zero Citations
          </span>
        </div>
      </div>
    </div>
  );
}
