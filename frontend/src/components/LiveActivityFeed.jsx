import React, { useState, useEffect } from 'react';
import {
  Activity,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Radio,
  Cpu,
  Layers
} from 'lucide-react';

export default function LiveActivityFeed({ onSelectAgent }) {
  const initialEvents = [
    {
      id: 1,
      time: 'Just now',
      agentNum: '06',
      agentName: 'Vision Inspection System',
      plant: 'Chennai Precision',
      action: 'Inspected component batch #B-8841. 0 surface micro-cracks detected (38ms inspection speed).',
      status: 'success'
    },
    {
      id: 2,
      time: '2m ago',
      agentNum: '11',
      agentName: 'Automated Sourcing & RFQ',
      plant: 'Consortium Hub',
      action: 'Extracted & scored 3 supplier quotes for SS-304 sheet coils. Recommended award to JSW Steel (₹95.5L).',
      status: 'success'
    },
    {
      id: 3,
      time: '5m ago',
      agentNum: '04',
      agentName: 'Predictive Maintenance Unit',
      plant: 'Sanand EV Unit',
      action: 'Detected 3.2 kHz vibration harmonic on Spindle Bearing B-2. RUL locked at 120 hrs; maintenance scheduled.',
      status: 'warning'
    },
    {
      id: 4,
      time: '8m ago',
      agentNum: '13',
      agentName: 'Energy Management System',
      plant: 'Pune Stamping',
      action: 'Shifted 180 kW compressor baseline ahead of 18:00 peak grid tariff window. Saved ₹1.8L in demand charges.',
      status: 'success'
    },
    {
      id: 5,
      time: '12m ago',
      agentNum: '01',
      agentName: 'Production Planning System',
      plant: 'Manesar Polymer',
      action: 'Finite-capacity schedule recalculated to accommodate emergency Tier-1 OEM order without overtime penalty.',
      status: 'success'
    }
  ];

  const crossAgentInsights = [
    {
      id: 'insight-1',
      title: 'Production Stoppage Correlated to Supplier Batch Hardness',
      agentsInvolved: ['Module 02 (Monitoring)', 'Module 10 (Supplier Perf)'],
      correlation: 'Pune Line 02 output dropped 6.4% over 3 shifts. Cross-department correlation discovered this was caused by Supplier XYZ batch #881 hardness variance exceeding drawing specs.',
      actionTaken: 'Non-conformance report automatically opened in QMS; replacement lot expedited from secondary vendor.'
    },
    {
      id: 'insight-2',
      title: 'Predictive Shutdown Synchronized with Energy Tariff Valley',
      agentsInvolved: ['Module 04 (Maintenance)', 'Module 13 (Energy Mgmt)'],
      correlation: 'Spindle lubrication maintenance on Press #07 was synchronized with the low-tariff energy window (12:00 - 14:00), avoiding ₹42,000 in peak machine restart costs.',
      actionTaken: 'Automated work order executed during planned low-tariff slot.'
    },
    {
      id: 'insight-3',
      title: 'Dynamic Safety Stock Buffer Protected Customer Commitments',
      agentsInvolved: ['Module 09 (Inventory)', 'Module 18 (Customer Order)'],
      correlation: 'Customer Order system detected sudden +20% demand spike from Tata Motors; Inventory module immediately evaluated on-hand stock and triggered an automated RFQ before lines starved.',
      actionTaken: 'Zero stockout risk maintained across all 14 automotive lines.'
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.7fr', gap: '20px' }}>
      {/* Column 1: Live Activity Feed */}
      <div
        className="card"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgb(var(--surface-rgb))'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot" />
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Live Factory Operations Stream
            </h4>
          </div>
          <span
            style={{
              fontSize: '10.5px',
              padding: '2px 8px',
              borderRadius: '99px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--status-success)',
              fontWeight: 700
            }}
          >
            Real-Time Plant Feed
          </span>
        </div>

        {/* Timeline Events List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {initialEvents.map((ev) => (
            <div
              key={ev.id}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'var(--muted-fill)',
                border: '1px solid rgba(var(--line-rgb), 0.06)',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Module Badge Icon */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: ev.status === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(111, 61, 186, 0.15)',
                  color: ev.status === 'warning' ? 'var(--status-warning)' : 'var(--brand-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '11px',
                  flexShrink: 0
                }}
              >
                {ev.agentNum}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {ev.agentName}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{ev.time}</span>
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--brand-blue)', fontWeight: 600 }}>
                  📍 {ev.plant}
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: 1.45 }}>
                  {ev.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Cross-Department Operational Insights */}
      <div
        className="card"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          background: 'rgb(var(--surface-rgb))'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: 'var(--brand-purple)' }} />
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Cross-Department Operations Intelligence
            </h4>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Why 19 Integrated Modules Beat Disconnected Systems
          </span>
        </div>

        {/* Insights Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {crossAgentInsights.map((ins) => (
            <div
              key={ins.id}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(111, 61, 186, 0.04), rgba(77, 142, 235, 0.04))',
                border: '1px solid rgba(111, 61, 186, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h5 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {ins.title}
                </h5>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {ins.agentsInvolved.map((ag) => (
                    <span
                      key={ag}
                      style={{
                        fontSize: '9.5px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'var(--dr-active)',
                        color: 'var(--brand-purple)',
                        fontWeight: 700
                      }}
                    >
                      {ag}
                    </span>
                  ))}
                </div>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {ins.correlation}
              </p>

              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--status-success)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '2px'
                }}
              >
                <CheckCircle2 size={12} /> {ins.actionTaken}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
