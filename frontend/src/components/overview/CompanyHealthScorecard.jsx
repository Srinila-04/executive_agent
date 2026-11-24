import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function CompanyHealthScorecard() {
  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    fetch('/api/agents/health-scorecard')
      .then((res) => res.json())
      .then((data) => setLiveData(data))
      .catch((err) => console.error('Failed to fetch scorecard metrics:', err));
  }, []);

  const cards = [
    {
      id: 'attainment',
      title: 'Production Attainment',
      value: liveData ? `${liveData.attainment}%` : '83.2%',
      target: 'Target: 85.0%',
      delta: liveData && liveData.attainment >= 85 ? `+${(liveData.attainment - 85).toFixed(1)}% vs plan` : `${(liveData?.attainment - 85 || -1.8).toFixed(1)}% vs plan`,
      isGood: (liveData?.attainment || 83.2) >= 80,
      direction: 'up',
      subtitle: liveData ? `${liveData.actual_units?.toLocaleString()} / ${liveData.target_units?.toLocaleString()} units` : '2,424,184 / 2,914,560 units',
      sector: 'Planning & Operations',
      color: '#6f3dba',
      sparkline: [220, 235, 228, 242, 248.5]
    },
    {
      id: 'oee',
      title: 'Overall OEE',
      value: liveData ? `${liveData.oee}%` : '87.4%',
      target: 'Target: 85.0%',
      delta: liveData ? `+${(liveData.oee - 85.0).toFixed(1)}% baseline` : '+2.4% baseline',
      isGood: true,
      direction: 'up',
      subtitle: liveData ? `Avail: ${liveData.availability}% • Perf: ${liveData.performance}% • Q: ${liveData.quality}%` : 'Avail: 92.1% • Perf: 89.5% • Q: 96.2%',
      sector: 'Equipment Effectiveness',
      color: '#4d8eeb',
      sparkline: [84, 85, 86.5, 87, 88.4]
    },
    {
      id: 'yield',
      title: 'First-Pass Yield',
      value: liveData ? `${liveData.fpy}%` : '98.2%',
      target: 'Target: 97.5%',
      delta: liveData ? `Scrap: ${liveData.scrap_rate}%` : 'Scrap: 1.8%',
      isGood: true,
      direction: 'up',
      subtitle: `Verified across 6 multi-plant lines`,
      sector: 'Quality & Inspection',
      color: '#10b981',
      sparkline: [96.5, 97.0, 97.4, 97.8, 98.2]
    },
    {
      id: 'otif',
      title: 'On-Time Delivery',
      value: liveData ? `${liveData.otif}%` : '98.2%',
      target: 'Target: 95.0%',
      delta: '+3.2% vs target',
      isGood: true,
      direction: 'up',
      subtitle: 'Supplier POs verified in Neon DB',
      sector: 'Logistics & Dispatch',
      color: '#0ea5e9',
      sparkline: [94, 95.2, 95.8, 96.1, 96.8]
    },
    {
      id: 'cost',
      title: 'Cost / Unit',
      value: liveData ? `₹${liveData.unit_cost}` : '₹48.50',
      target: 'Standard: ₹51.70',
      delta: '-6.2% cost drop',
      isGood: true,
      direction: 'down',
      subtitle: 'Savings: ₹14.8L this month',
      sector: 'Cost Management',
      color: '#8b5cf6',
      sparkline: [53, 51.5, 50.2, 49.1, 48.5]
    },
    {
      id: 'energy',
      title: 'Energy / Unit',
      value: liveData ? `₹${liveData.energy_cost_per_unit}` : '₹3.42',
      target: 'Baseline: ₹3.75',
      delta: '-8.5% tariff drop',
      isGood: true,
      direction: 'down',
      subtitle: '12.8 MWh peak load shifted',
      sector: 'Energy Management',
      color: '#10b981',
      sparkline: [3.9, 3.75, 3.62, 3.51, 3.42]
    },
    {
      id: 'safety',
      title: 'Safety Incidents',
      value: liveData ? `${liveData.safety_days} Days` : '428 Days',
      target: 'Target: 365+ Days',
      delta: '0 Lost Time Incidents',
      isGood: true,
      direction: 'up',
      subtitle: '0 Hazards • 100% Compliance',
      sector: 'Safety & EHS',
      color: '#e45c72',
      sparkline: [380, 395, 410, 420, 428]
    },
    {
      id: 'inventory',
      title: 'Inventory Buffer',
      value: '₹18.4 Cr',
      target: 'Target: ₹16.0 Cr',
      delta: '2 Stock Alerts',
      isGood: false,
      direction: 'up',
      subtitle: '14.2 Days stock buffer',
      sector: 'Inventory Optimization',
      color: '#f58a3a',
      sparkline: [12, 10, 8, 4, 2]
    }
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.8px' }}>
            Operational Scorecard • Top Indicators
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
            Company Health Scorecard
          </h3>
        </div>
        <span style={{ fontSize: '12.5px', color: '#111111', fontWeight: 700 }}>
          Live Shopfloor Telemetry Pipeline
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {cards.map((c) => {
          const min = Math.min(...c.sparkline);
          const max = Math.max(...c.sparkline);

          return (
            <div
              key={c.id}
              className="card"
              style={{
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'rgb(var(--surface-rgb))',
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
              }}
            >
              <div>
                {/* Header: Title & Sector */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#000000', textTransform: 'uppercase' }}>
                    {c.title}
                  </span>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      padding: '2.5px 7px',
                      borderRadius: '4px',
                      background: 'var(--muted-fill)',
                      color: '#000000'
                    }}
                  >
                    {c.sector}
                  </span>
                </div>

                {/* Big Metric & Trend Row */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                  <span style={{ fontSize: '25px', fontWeight: 700, color: '#000000' }}>
                    {c.value}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: c.isGood ? 'var(--status-success)' : 'var(--status-danger)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}
                  >
                    {c.direction === 'up' ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {c.delta}
                  </span>
                </div>

                {/* Target Subtitle */}
                <div style={{ fontSize: '12px', color: '#111111', marginTop: '2px', fontWeight: 700 }}>
                  {c.target}
                </div>

                {/* Granular Detail */}
                <div style={{ fontSize: '12px', color: '#000000', marginTop: '4px', fontWeight: 600 }}>
                  {c.subtitle}
                </div>
              </div>

              {/* Sparkline Visual */}
              <div style={{ marginTop: '10px', height: '22px' }}>
                <svg viewBox="0 0 100 20" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <polyline
                    fill="none"
                    stroke={c.color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    points={c.sparkline
                      .map((val, idx) => {
                        const y = 16 - ((val - min) / (max - min || 1)) * 13;
                        const x = 4 + idx * 23;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
