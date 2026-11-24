import React, { useState, useEffect } from 'react';
import {
  TrendingDown,
  TrendingUp,
  BarChart3,
  Clock,
  DollarSign
} from 'lucide-react';

export default function ProductionLossStoryCharts() {
  const [timeframe, setTimeframe] = useState('today');

  const defaultOutput = {
    today: [
      { plant: 'Chennai Plant (IN-TN-01)', actual: 42.1, plan: 41.5, unit: 'k' },
      { plant: 'Bengaluru Plant (IN-KA-01)', actual: 43.8, plan: 42.0, unit: 'k' }
    ],
    this_week: [
      { plant: 'Chennai Plant (IN-TN-01)', actual: 294, plan: 290, unit: 'k' },
      { plant: 'Bengaluru Plant (IN-KA-01)', actual: 306, plan: 295, unit: 'k' }
    ],
    this_month: [
      { plant: 'Chennai Plant (IN-TN-01)', actual: 1206, plan: 1457, unit: 'k' },
      { plant: 'Bengaluru Plant (IN-KA-01)', actual: 1218, plan: 1457, unit: 'k' }
    ]
  };

  const defaultLoss = [
    { label: 'Effective Production (OEE)', pct: 87.4, color: '#4d8eeb', desc: 'Good units at rated nominal takt' },
    { label: 'Unplanned Breakdowns', pct: 3.4, color: '#ef4444', desc: 'Bearing vibration and spindle wear' },
    { label: 'Setups & Changeovers', pct: 2.8, color: '#f58a3a', desc: 'SMT reel and feeder setup' },
    { label: 'Micro-Stops (<3 min)', pct: 2.2, color: '#f59e0b', desc: 'Optical sensor trips & part misalignment' },
    { label: 'Reduced Speed Loss', pct: 4.2, color: '#8b5cf6', desc: 'Thermal throttling & paste pause' }
  ];

  const [outputByPlant, setOutputByPlant] = useState(defaultOutput);
  const [lossBreakdown, setLossBreakdown] = useState(defaultLoss);

  const currentOutput = outputByPlant?.[timeframe] || defaultOutput[timeframe] || [];

  useEffect(() => {
    fetch('/api/analytics/loss-story')
      .then((res) => res.json())
      .then((data) => {
        if (data.outputByPlant && Object.keys(data.outputByPlant).length > 0) {
          setOutputByPlant(data.outputByPlant);
        }
        if (data.lossBreakdown && data.lossBreakdown.length > 0) {
          setLossBreakdown(data.lossBreakdown);
        }
      })
      .catch((err) => console.error('Failed to load loss story from Neon DB:', err));
  }, []);

  // Top Defect Causes
  const defectCauses = [
    { cause: 'Surface Porosity & Cavities', pct: 38, count: '52 items', color: '#ef4444' },
    { cause: 'Dimensional Drift (±0.05mm)', pct: 26, count: '36 items', color: '#f58a3a' },
    { cause: 'Tooling Burrs & Chatter', pct: 21, count: '29 items', color: '#f59e0b' },
    { cause: 'Handling Scratches / Cosmetic', pct: 15, count: '21 items', color: '#0ea5e9' }
  ];

  // Cost Drivers
  const costDrivers = [
    { driver: 'Raw Material (Steel / Resin)', share: '58%', perUnit: '₹28.10', trend: '-2.4%' },
    { driver: 'Shopfloor Labour', share: '18%', perUnit: '₹8.73', trend: '-4.8%' },
    { driver: 'Tooling & Depreciation', share: '14%', perUnit: '₹6.79', trend: '-1.5%' },
    { driver: 'Energy & Utility Tariffs', share: '10%', perUnit: '₹4.88', trend: '-8.5%' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#000000', letterSpacing: '0.8px' }}>
            Operational Story
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#000000', marginTop: '2px' }}>
            Production, Quality & Cost Loss Decomposition
          </h3>
        </div>

        {/* Timeframe Toggle Buttons */}
        <div style={{ display: 'flex', background: 'var(--muted-fill)', padding: '3px', borderRadius: '7px' }}>
          {[
            { id: 'today', label: 'Today' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeframe(t.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '5px',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                background: timeframe === t.id ? '#000000' : 'transparent',
                color: timeframe === t.id ? '#ffffff' : '#000000'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Story Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr', gap: '14px' }}>
        {/* CHART 1: Plan vs Actual Output by Plant */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#000000' }}>
                  Plan vs. Actual Output by Plant
                </h4>
                <div style={{ fontSize: '12px', color: '#111111', marginTop: '2px' }}>
                  Target vs realized output ({timeframe.replace('_', ' ')})
                </div>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'var(--muted-fill)', color: '#000000' }}>
                Throughput
              </span>
            </div>

            {/* Bar Chart Visualization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
              {currentOutput.map((item) => {
                const maxVal = currentOutput.length > 0
                  ? Math.max(...currentOutput.map((x) => Math.max(x.actual || 0, x.plan || 0))) * 1.15
                  : 100;
                const actualWidth = maxVal > 0 ? ((item.actual || 0) / maxVal) * 100 : 0;
                const planWidth = maxVal > 0 ? ((item.plan || 0) / maxVal) * 100 : 0;
                const isOver = (item.actual || 0) >= (item.plan || 0);

                return (
                  <div key={item.plant} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                      <span style={{ fontWeight: 700, color: '#000000' }}>
                        {item.plant}
                      </span>
                      <span style={{ color: '#000000', fontWeight: 700 }}>
                        <strong style={{ color: isOver ? 'var(--status-success)' : 'var(--status-danger)' }}>
                          {item.actual}{item.unit}
                        </strong> / {item.plan}{item.unit} ({isOver ? '+' : ''}{((item.actual - item.plan) / item.plan * 100).toFixed(1)}%)
                      </span>
                    </div>

                    <div style={{ position: 'relative', height: '11px', background: 'var(--muted-fill)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${actualWidth}%`,
                          background: isOver ? 'var(--brand-purple)' : 'var(--status-warning)',
                          borderRadius: '5px'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: `${planWidth}%`,
                          top: 0,
                          bottom: 0,
                          width: '2px',
                          background: '#000000'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ fontSize: '12.5px', color: '#111111', marginTop: '12px' }}>
            Consortium Total: <strong>248.5k units</strong> vs <strong>240.8k target</strong> (+3.2% above plan)
          </div>
        </div>

        {/* CHART 2: Where Equipment Time is Lost (Loss Decomposition) */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#000000' }}>
                  Equipment Time Loss Decomposition
                </h4>
                <div style={{ fontSize: '12px', color: '#111111', marginTop: '2px' }}>
                  OEE breakdown (88.4% effective)
                </div>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'var(--muted-fill)', color: '#000000' }}>
                OEE Losses
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div style={{ height: '16px', borderRadius: '5px', display: 'flex', overflow: 'hidden', margin: '14px 0 12px 0' }}>
              {lossBreakdown.map((lb) => (
                <div
                  key={lb.label}
                  style={{
                    width: `${lb.pct}%`,
                    background: lb.color,
                    title: `${lb.label}: ${lb.pct}%`
                  }}
                />
              ))}
            </div>

            {/* Loss Breakdown List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lossBreakdown.map((lb) => (
                <div key={lb.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: lb.color }} />
                    <span style={{ fontWeight: 700, color: '#000000' }}>{lb.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#111111' }}>{lb.desc}</span>
                    <strong style={{ color: '#000000', minWidth: '45px', textAlign: 'right' }}>{lb.pct}%</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '12.5px', color: '#111111', marginTop: '12px' }}>
            Largest avoidable loss: <strong>3.4% Unplanned Breakdowns</strong> (Preventable)
          </div>
        </div>

        {/* CHART 3: Top Quality Defect Causes */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#000000' }}>
                  Top Defect Causes & Scrap Root-Cause
                </h4>
                <div style={{ fontSize: '12px', color: '#111111', marginTop: '2px' }}>
                  Optical inspection & manual QA flags
                </div>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'var(--muted-fill)', color: '#000000' }}>
                Quality QA
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
              {defectCauses.map((dc) => (
                <div key={dc.cause} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                    <span style={{ fontWeight: 700, color: '#000000' }}>{dc.cause}</span>
                    <span style={{ color: '#000000', fontWeight: 700 }}>
                      <strong>{dc.pct}%</strong> ({dc.count})
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--muted-fill)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${dc.pct}%`, height: '100%', background: dc.color, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '12.5px', color: '#111111', marginTop: '12px' }}>
            First-Pass Yield: <strong>98.2%</strong> • Scrap Cost: <strong>₹1.4 Lakhs/day</strong>
          </div>
        </div>

        {/* CHART 4: Cost Drivers per Finished Unit */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#000000' }}>
                  Cost Drivers (₹48.50 / Unit Total)
                </h4>
                <div style={{ fontSize: '12px', color: '#111111', marginTop: '2px' }}>
                  Standard baseline: ₹51.70 (-6.2% improvement)
                </div>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'var(--muted-fill)', color: '#000000' }}>
                Cost Control
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
              {costDrivers.map((cd) => (
                <div
                  key={cd.driver}
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
                  <div>
                    <div style={{ fontWeight: 700, color: '#000000' }}>{cd.driver}</div>
                    <div style={{ fontSize: '12px', color: '#111111' }}>Share: {cd.share} of unit cost</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: '#000000' }}>{cd.perUnit}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--status-success)' }}>
                      {cd.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '12.5px', color: '#111111', marginTop: '12px' }}>
            Total Realized Savings This Month: <strong>₹14.8 Lakhs</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
