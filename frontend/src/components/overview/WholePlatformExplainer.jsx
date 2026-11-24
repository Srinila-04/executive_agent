import React from 'react';
import {
  Cpu,
  Layers,
  Factory,
  ShieldCheck,
  TrendingUp,
  Zap,
  ArrowRight,
  Boxes,
  Users,
  CheckCircle2,
  DollarSign,
  Sparkles
} from 'lucide-react';

export default function WholePlatformExplainer({ onNavigateToAgents, onNavigateToArchitecture }) {
  const sectors = [
    {
      id: 'production',
      name: '1. Production & Planning',
      agents: 'Agents 01, 02, 03, 19',
      color: '#6f3dba',
      bg: 'rgba(111, 61, 186, 0.08)',
      whatHappens: 'Synchronizes order backlogs with finite plant capacity, detects micro-stops under 3 minutes in real time, decomposes OEE losses, and simulates what-if scenarios in a 3D digital twin.'
    },
    {
      id: 'maintenance',
      name: '2. Maintenance & Utilities',
      agents: 'Agents 04, 13, 17',
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.08)',
      whatHappens: 'Analyzes FFT vibration telemetry to predict bearing wear 14 days before failure, reschedules heavy annealing loads to off-peak energy tariffs, and balances compressed air leaks.'
    },
    {
      id: 'quality',
      name: '3. Quality & Engineering',
      agents: 'Agents 05, 06, 07, 08',
      color: '#059669',
      bg: 'rgba(5, 150, 105, 0.08)',
      whatHappens: 'Inspects parts using high-speed optical vision cameras (<0.05mm tolerance), isolates scrap root causes, governs Engineering Change Notices (ECN), and maintains serialized 2D barcode traceability.'
    },
    {
      id: 'supplychain',
      name: '4. Supply Chain & Customers',
      agents: 'Agents 09, 10, 11, 12, 18',
      color: '#d97706',
      bg: 'rgba(217, 119, 6, 0.08)',
      whatHappens: 'Monitors raw material safety buffers (1.8-day coil alert), scores vendor OTIF ratings (96.8%), dispatches automated RFQs to JSW Steel, and tracks dispatch fleets across state boundaries.'
    },
    {
      id: 'people',
      name: '5. People & Safety',
      agents: 'Agents 14, 15',
      color: '#e11d48',
      bg: 'rgba(225, 29, 72, 0.08)',
      whatHappens: 'Enforces digital Lockout/Tagout (LOTO) safety permits for high-voltage maintenance, preserves a 428-day zero-LTI safety streak, and stations certified operators on high-tonnage stamping presses.'
    },
    {
      id: 'finance',
      name: '6. Finance & Leadership',
      agents: 'Agents 16, 20',
      color: '#4f46e5',
      bg: 'rgba(79, 70, 229, 0.08)',
      whatHappens: 'Decomposes standard cost vs actual unit cost (₹48.50 vs ₹51.70 standard), tracks ₹14.8L realized savings, and feeds Agent 20 Executive Intelligence to deliver synthesized briefings to the company owner.'
    }
  ];

  return (
    <div
      style={{
        background: 'rgb(var(--surface-rgb))',
        borderRadius: '14px',
        border: '1px solid rgba(var(--line-rgb), 0.15)',
        padding: '20px 24px',
        boxShadow: '0 2px 14px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(111, 61, 186, 0.12)', color: 'var(--brand-purple)' }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              How the Manufacturing AI Platform Operates (Whole System Architecture)
            </h2>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Shop floor IoT sensors across 6 multi-state plants feed 20 specialized autonomous agents in real time.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToAgents}
          className="btn-primary"
          style={{ padding: '7px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          Explore Operations Fleet (19 Sectors) <ArrowRight size={13} />
        </button>
      </div>

      {/* 6 Sector Workflow Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '12px'
        }}
      >
        {sectors.map((sec) => (
          <div
            key={sec.id}
            style={{
              background: sec.bg,
              border: `1px solid ${sec.color}25`,
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              transition: 'transform 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: sec.color }}>
                {sec.name}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgb(var(--surface-rgb))',
                  color: sec.color,
                  border: `1px solid ${sec.color}30`
                }}
              >
                {sec.agents}
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.45, opacity: 0.9 }}>
              {sec.whatHappens}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
