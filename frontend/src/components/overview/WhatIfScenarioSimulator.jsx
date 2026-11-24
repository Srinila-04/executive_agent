import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  Cpu,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Layers
} from 'lucide-react';

export default function WhatIfScenarioSimulator() {
  const [activeScenarioId, setActiveScenarioId] = useState('scenario-1');
  const [isSimulating, setIsSimulating] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const scenarios = [
    {
      id: 'scenario-1',
      question: 'What if Pune Stamping loses Line 02 for 2 days?',
      category: 'Unplanned Machine Stoppage',
      outputLoss: '-4,200 units',
      orderRisk: '2 OEM orders delayed by 18 hrs',
      costImpact: '₹3.8 Lakhs revenue delayed',
      countermeasure: 'Reroute 2,400 units to Chennai Line 04; pre-schedule Saturday 4-hr buffer shift on Line 03.',
      feasibility: '96% Recoverable',
      recoveryTime: 'Within 36 hours'
    },
    {
      id: 'scenario-2',
      question: 'What if raw material supplier delays sheet coils by 48 hours?',
      category: 'Supply Chain Disruption',
      outputLoss: '0 units lost (buffer absorbed to 0.4 days)',
      orderRisk: 'Zero missed deliveries with interim spot lot',
      costImpact: '₹45,000 spot freight premium',
      countermeasure: 'Trigger Automated Sourcing (Module 11) to dispatch 15T emergency spot lot to secondary vendor ABC Corp.',
      feasibility: '100% Protected',
      recoveryTime: 'Immediate buffer release'
    },
    {
      id: 'scenario-3',
      question: 'What if Tata Motors increases steering order volume by +25% next week?',
      category: 'Customer Demand Surge',
      outputLoss: '+14,500 units additional demand',
      orderRisk: 'Bottleneck flagged at Heat Treatment Oven #02',
      costImpact: '+₹18.4 Lakhs incremental gross margin',
      countermeasure: 'Pre-cool cold wells on Saturday; add 4 operators to Shift 2; run Heat Treatment Oven at 98% nominal speed.',
      feasibility: '94.8% Feasible',
      recoveryTime: 'Full schedule adherence'
    }
  ];

  const currentScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const handleSelectScenario = (id) => {
    setIsSimulating(true);
    setActiveScenarioId(id);
    setTimeout(() => {
      setIsSimulating(false);
    }, 450);
  };

  const handleRunCustom = () => {
    if (!customInput.trim()) return;
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div
      className="card"
      style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(77, 142, 235, 0.05) 100%), rgb(var(--surface-rgb))',
        border: '1.5px solid rgba(139, 92, 246, 0.25)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '3px 10px',
                borderRadius: '99px',
                background: 'var(--brand-purple)',
                color: '#fff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Cpu size={12} /> Digital Plant Twin • Module 19
            </span>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Virtual Physics & Factory Floor Simulator
            </span>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            "What If?" Operational Scenario Simulator
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Evaluate cross-plant decisions, downtime shocks, and demand spikes in virtual simulation before altering physical factory operations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 700 }}>
            ● Calibration Confidence: 97.4%
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Sync Lag: &lt;400ms
          </span>
        </div>
      </div>

      {/* Preset Scenario Selector Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
        {scenarios.map((sc) => {
          const isActive = sc.id === activeScenarioId;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc.id)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: `1.5px solid ${isActive ? 'var(--brand-purple)' : 'rgba(var(--line-rgb), 0.15)'}`,
                background: isActive ? 'var(--brand-purple)' : 'rgb(var(--surface-rgb))',
                color: isActive ? '#fff' : 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '12.5px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Play size={13} fill={isActive ? '#fff' : 'transparent'} />
              {sc.question}
            </button>
          );
        })}
      </div>

      {/* Simulated Output Dashboard */}
      <div
        style={{
          marginTop: '18px',
          background: 'rgb(var(--surface-rgb))',
          borderRadius: '14px',
          border: '1px solid rgba(var(--line-rgb), 0.12)',
          padding: '20px',
          opacity: isSimulating ? 0.5 : 1,
          transition: 'opacity 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-purple)' }}>
              Simulation Result • {currentScenario.category}
            </span>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {currentScenario.question}
            </h4>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '99px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--status-success)'
            }}
          >
            {currentScenario.feasibility}
          </span>
        </div>

        {/* 3 Impact Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--muted-fill)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Output Capacity Delta
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
              {currentScenario.outputLoss}
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--muted-fill)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Customer Order Delivery Impact
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--status-warning)', marginTop: '2px' }}>
              {currentScenario.orderRisk}
            </div>
          </div>

          <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--muted-fill)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Financial Net Impact
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-purple)', marginTop: '2px' }}>
              {currentScenario.costImpact}
            </div>
          </div>
        </div>

        {/* Recommended Closed-Loop Countermeasure */}
        <div
          style={{
            marginTop: '14px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-success)', textTransform: 'uppercase' }}>
              Autonomous Recommended Countermeasure
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
              👉 {currentScenario.countermeasure}
            </div>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            Recovery: <strong>{currentScenario.recoveryTime}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
