import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  Sliders,
  DollarSign,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';

export default function ProblemSolutionMatrixVisual({ onNavigateToModules }) {
  // Interactive Value Calculator state for plant owners
  const [dailyVolume, setDailyVolume] = useState(25000);
  const [currentScrap, setCurrentScrap] = useState(4.5);
  const [hourlyDowntimeCost, setHourlyDowntimeCost] = useState(3500);

  // Computed live estimates
  const scrapUnitsSaved = Math.round((dailyVolume * (currentScrap - 1.2) / 100) * 30);
  const monthlyScrapSavings = Math.round(scrapUnitsSaved * 48.5); // ₹48.5 per unit
  const monthlyDowntimeHoursSaved = Math.round(42 * 0.72); // ~30 hours saved
  const monthlyDowntimeSavings = Math.round(monthlyDowntimeHoursSaved * hourlyDowntimeCost);
  const totalMonthlySavings = monthlyScrapSavings + monthlyDowntimeSavings;

  const transformationPillars = [
    {
      id: 'downtime',
      title: 'Machine Availability & OEE',
      problemLabel: 'Traditional: 68.4%',
      solutionLabel: 'Optimized: 92.1%',
      gain: '+23.7% Gain',
      module: 'OEE Optimization (#03) & Predictive Maintenance (#04)',
      icon: Clock,
      color: '#4d8eeb',
      progressBefore: 68,
      progressAfter: 92
    },
    {
      id: 'quality',
      title: 'First Pass Yield (FPY)',
      problemLabel: 'Traditional: 82.0%',
      solutionLabel: 'Optimized: 98.2%',
      gain: '+16.2% Yield',
      module: 'Quality (#05) & Optical Inspection (#06)',
      icon: ShieldCheck,
      color: '#10b981',
      progressBefore: 82,
      progressAfter: 98
    },
    {
      id: 'cost',
      title: 'Unit Conversion Cost',
      problemLabel: 'Traditional: ₹54.20 / unit',
      solutionLabel: 'Optimized: ₹48.50 / unit',
      gain: '↓10.5% Cost',
      module: 'Energy (#13) & Cost Optimization (#16)',
      icon: DollarSign,
      color: '#6f3dba',
      progressBefore: 85,
      progressAfter: 50
    },
    {
      id: 'safety',
      title: 'Zero Incident Workplace',
      problemLabel: 'Audit Hazards & Lapses',
      solutionLabel: '428 Days Zero LTI',
      gain: '100% Compliant',
      module: 'Safety EHS (#14) & Workforce (#15)',
      icon: Layers,
      color: '#e45c72',
      progressBefore: 70,
      progressAfter: 100
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Transformation Dials Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px'
        }}
      >
        {transformationPillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                borderTop: `4px solid ${p.color}`,
                padding: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: `${p.color}15`,
                    color: p.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={18} />
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '99px',
                    background: `${p.color}15`,
                    color: p.color
                  }}
                >
                  {p.gain}
                </span>
              </div>

              <div>
                <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {p.title}
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--brand-purple)', fontWeight: 600, marginTop: '2px' }}>
                  {p.module}
                </div>
              </div>

              {/* Animated Dual Progress Comparison Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span>Before</span>
                    <span>{p.problemLabel}</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--muted-fill)', borderRadius: '99px', marginTop: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${p.progressBefore}%`, height: '100%', background: '#94a3b8', borderRadius: '99px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: p.color }}>
                    <span>With GWC Platform</span>
                    <span>{p.solutionLabel}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--muted-fill)', borderRadius: '99px', marginTop: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${p.progressAfter}%`, height: '100%', background: p.color, borderRadius: '99px' }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Value Calculator for Manufacturers */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(111, 61, 186, 0.04), rgba(16, 185, 129, 0.04)), rgb(var(--surface-rgb))',
          border: '1.5px solid rgba(111, 61, 186, 0.2)',
          padding: '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--brand-purple)' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-purple)', letterSpacing: '0.8px' }}>
                Executive Financial Impact Simulator
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              Simulate Realized ROI for Your Plant Capacity
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Drag the sliders below to model how predictive maintenance and optical inspection cut direct scrap & downtime costs.
            </p>
          </div>

          <button className="btn-primary" onClick={onNavigateToModules}>
            Review All 19 Operations Modules <ArrowRight size={14} />
          </button>
        </div>

        {/* Sliders and Dynamic Gauges Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr) 1.2fr',
            gap: '24px',
            marginTop: '24px',
            alignItems: 'center'
          }}
        >
          {/* Slider 1: Production Volume */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Daily Production</span>
              <span style={{ color: 'var(--brand-purple)', fontWeight: 700 }}>
                {dailyVolume.toLocaleString()} units/day
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="100000"
              step="5000"
              value={dailyVolume}
              onChange={(e) => setDailyVolume(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--brand-purple)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              Range: 5,000 to 100,000 components
            </span>
          </div>

          {/* Slider 2: Current Scrap Rate */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Current Scrap Rate</span>
              <span style={{ color: 'var(--status-danger)', fontWeight: 700 }}>{currentScrap}%</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="12.0"
              step="0.5"
              value={currentScrap}
              onChange={(e) => setCurrentScrap(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--status-danger)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              Automated closed-loop control targets reduction down to 1.2% scrap
            </span>
          </div>

          {/* Slider 3: Hourly Stoppage Cost */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Downtime Cost</span>
              <span style={{ color: 'var(--brand-blue)', fontWeight: 700 }}>
                ${hourlyDowntimeCost}/hr
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={hourlyDowntimeCost}
              onChange={(e) => setHourlyDowntimeCost(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--brand-blue)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
              Labor, idle machine, and late penalties
            </span>
          </div>

          {/* Calculated Output Summary Card */}
          <div
            style={{
              background: 'rgb(var(--surface-rgb))',
              border: '2px solid var(--status-success)',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)'
            }}
          >
            <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--status-success)', fontWeight: 700 }}>
              Projected Monthly Financial Gain
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: 'var(--status-success)', letterSpacing: '-0.5px' }}>
              ₹{(totalMonthlySavings / 100000).toFixed(1)} Lakhs / mo
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              • Avoids <strong>{monthlyDowntimeHoursSaved} hours</strong> of unplanned line stoppage
              <br />
              • Prevents <strong>{scrapUnitsSaved.toLocaleString()} defective parts</strong> from entering assembly
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
