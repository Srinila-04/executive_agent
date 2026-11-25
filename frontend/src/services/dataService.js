// Unified Data Service Layer
// Procedural Generation Engine & Dynamic Adapters across all 19 Agents
// Strictly respects TWO plants: Chennai (IN-TN-01) and Bangalore (IN-KA-01)

import { AGENTS_CONFIG, PLANTS } from '../config/agents.config';

// ---------------------------------------------------------------------------
// Seeded PRNG for Deterministic, Realistic Telemetry Generation
// ---------------------------------------------------------------------------
function createSeededRandom(seedString) {
  let h = 1779033703 ^ seedString.length;
  for (let i = 0; i < seedString.length; i++) {
    h = Math.imul(h ^ seedString.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Generates time series points for sparklines and continuous charts
function generateTimeSeries(seedStr, count, baseVal, variance, trend = 0) {
  const rng = createSeededRandom(seedStr);
  const points = [];
  let current = baseVal;
  for (let i = 0; i < count; i++) {
    const delta = (rng() - 0.48) * variance + trend * (i / count);
    current = Math.max(0, current + delta);
    points.push(Number(current.toFixed(1)));
  }
  return points;
}

// Helper to calculate Indian formatted currency
export function formatINR(val, unit = '₹') {
  if (val >= 10000000) {
    return `${unit} ${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `${unit} ${(val / 100000).toFixed(2)} L`;
  }
  return `${unit} ${val.toLocaleString('en-IN')}`;
}

// ---------------------------------------------------------------------------
// Executive Summary Headline Telemetry (8 Cards)
// ---------------------------------------------------------------------------
export function getExecutiveSummary(filters) {
  const plant = filters.plant || 'ALL';
  const shift = filters.shift || 'ALL';
  const line = filters.line || 'ALL';
  const datePreset = filters.datePreset || '30d';

  // Seed for deterministic output
  const seed = `${plant}_${shift}_${line}_${datePreset}_${filters.tick || 0}`;
  const rng = createSeededRandom(seed);

  // Plant Multipliers: Chennai is high electronics yield; Bangalore is high precision stamping
  const plantMult = plant === 'IN-TN-01' ? 1.025 : plant === 'IN-KA-01' ? 0.985 : 1.005;
  const shiftMult = shift === 'A' ? 1.015 : shift === 'B' ? 0.992 : shift === 'C' ? 0.978 : 1.0;

  // 1. OEE
  const oeeVal = Number((88.4 * plantMult * shiftMult + (rng() - 0.5) * 1.2).toFixed(1));
  const oeeDelta = Number(((rng() - 0.35) * 2.8).toFixed(1));

  // 2. OTIF Delivery
  const otifVal = Number((97.2 * plantMult * (shift === 'C' ? 0.99 : 1) + (rng() - 0.5) * 0.8).toFixed(1));
  const otifDelta = Number(((rng() - 0.3) * 1.8).toFixed(1));

  // 3. First Pass Yield
  const fpyVal = Number(Math.min(99.9, (99.2 * plantMult + (rng() - 0.5) * 0.4)).toFixed(1));
  const fpyDelta = Number(((rng() - 0.25) * 0.6).toFixed(1));

  // 4. Unplanned Downtime
  const downtimeBase = plant === 'IN-TN-01' ? 2.4 : plant === 'IN-KA-01' ? 3.8 : 3.1;
  const downtimeVal = Number((downtimeBase / shiftMult + (rng() - 0.5) * 0.5).toFixed(1));
  const downtimeDelta = Number(((rng() - 0.6) * 1.2).toFixed(1)); // Negative delta is good for downtime

  // 5. Inventory Turns
  const turnsVal = Number((8.4 * plantMult + (rng() - 0.5) * 0.6).toFixed(1));
  const turnsDelta = Number(((rng() - 0.4) * 0.8).toFixed(1));

  // 6. Cost Per Unit
  const costBase = plant === 'IN-TN-01' ? 1740 : plant === 'IN-KA-01' ? 1890 : 1815;
  const costVal = Math.round(costBase * (2 - plantMult) + (rng() - 0.5) * 45);
  const costDelta = Number(((rng() - 0.65) * 35).toFixed(0)); // Negative delta is good for cost

  // 7. Specific Energy Consumption (kWh/unit)
  const secBase = plant === 'IN-TN-01' ? 3.8 : plant === 'IN-KA-01' ? 4.5 : 4.15;
  const secVal = Number((secBase / shiftMult + (rng() - 0.5) * 0.25).toFixed(2));
  const secDelta = Number(((rng() - 0.6) * 0.3).toFixed(2)); // Negative delta is good

  // 8. Recordable Safety Incidents
  const incidentsVal = rng() > 0.88 ? 1 : 0;
  const incidentsDelta = incidentsVal === 0 ? -1 : 0;

  return [
    {
      id: 'exec-oee',
      name: 'Overall Equipment OEE',
      value: `${oeeVal}%`,
      numVal: oeeVal,
      unit: '%',
      target: '85.0%',
      delta: `${oeeDelta >= 0 ? '+' : ''}${oeeDelta}%`,
      isPositive: oeeDelta >= 0,
      goodDirection: 'higher',
      sparkline: generateTimeSeries(`${seed}_oee`, 12, oeeVal - 1.5, 1.2, 0.4)
    },
    {
      id: 'exec-otif',
      name: 'Customer OTIF Fulfillment',
      value: `${otifVal}%`,
      numVal: otifVal,
      unit: '%',
      target: '95.0%',
      delta: `${otifDelta >= 0 ? '+' : ''}${otifDelta}%`,
      isPositive: otifDelta >= 0,
      goodDirection: 'higher',
      sparkline: generateTimeSeries(`${seed}_otif`, 12, otifVal - 1.0, 0.8, 0.3)
    },
    {
      id: 'exec-fpy',
      name: 'First Pass Yield (FPY)',
      value: `${fpyVal}%`,
      numVal: fpyVal,
      unit: '%',
      target: '98.5%',
      delta: `${fpyDelta >= 0 ? '+' : ''}${fpyDelta}%`,
      isPositive: fpyDelta >= 0,
      goodDirection: 'higher',
      sparkline: generateTimeSeries(`${seed}_fpy`, 12, fpyVal - 0.4, 0.4, 0.1)
    },
    {
      id: 'exec-downtime',
      name: 'Unplanned Downtime',
      value: `${downtimeVal} hrs`,
      numVal: downtimeVal,
      unit: 'hrs',
      target: '≤ 4.0 hrs',
      delta: `${downtimeDelta >= 0 ? '+' : ''}${downtimeDelta}h`,
      isPositive: downtimeDelta <= 0, // Lower downtime is positive
      goodDirection: 'lower',
      sparkline: generateTimeSeries(`${seed}_dt`, 12, downtimeVal + 0.8, 0.6, -0.2)
    },
    {
      id: 'exec-inventory',
      name: 'Inventory Turns',
      value: `${turnsVal}x`,
      numVal: turnsVal,
      unit: 'turns/yr',
      target: '8.0x',
      delta: `${turnsDelta >= 0 ? '+' : ''}${turnsDelta}x`,
      isPositive: turnsDelta >= 0,
      goodDirection: 'higher',
      sparkline: generateTimeSeries(`${seed}_inv`, 12, turnsVal - 0.5, 0.5, 0.2)
    },
    {
      id: 'exec-cost',
      name: 'Manufacturing Cost / Unit',
      value: `₹${costVal.toLocaleString('en-IN')}`,
      numVal: costVal,
      unit: '₹/unit',
      target: '≤ ₹1,850',
      delta: `${costDelta >= 0 ? '+' : ''}₹${costDelta}`,
      isPositive: costDelta <= 0, // Lower cost is positive
      goodDirection: 'lower',
      sparkline: generateTimeSeries(`${seed}_cost`, 12, costVal + 20, 25, -5)
    },
    {
      id: 'exec-energy',
      name: 'Specific Energy (SEC)',
      value: `${secVal} kWh`,
      numVal: secVal,
      unit: 'kWh/u',
      target: '≤ 4.2 kWh',
      delta: `${secDelta >= 0 ? '+' : ''}${secDelta} kWh`,
      isPositive: secDelta <= 0, // Lower energy is positive
      goodDirection: 'lower',
      sparkline: generateTimeSeries(`${seed}_sec`, 12, secVal + 0.15, 0.2, -0.05)
    },
    {
      id: 'exec-safety',
      name: 'Safety Incidents (TRIR)',
      value: `${incidentsVal}`,
      numVal: incidentsVal,
      unit: 'incidents',
      target: '0 incidents',
      delta: incidentsVal === 0 ? 'Zero LTI' : '+1 Incident',
      isPositive: incidentsVal === 0,
      goodDirection: 'lower',
      sparkline: generateTimeSeries(`${seed}_saf`, 12, 0, 0.2, 0)
    }
  ];
}

// ---------------------------------------------------------------------------
// Plant Comparison Data (Chennai vs Bangalore or Plant vs Target)
// ---------------------------------------------------------------------------
export function getPlantComparison(filters) {
  const seed = `${filters.plant || 'ALL'}_${filters.shift || 'ALL'}_${filters.datePreset || '30d'}_comp`;
  const rng = createSeededRandom(seed);

  const metrics = [
    { key: 'oee', label: 'Overall OEE (%)', unit: '%', target: 85.0, chn: 88.6, blr: 85.8 },
    { key: 'otif', label: 'OTIF Delivery (%)', unit: '%', target: 95.0, chn: 98.1, blr: 96.4 },
    { key: 'fpy', label: 'First Pass Yield (%)', unit: '%', target: 98.5, chn: 99.4, blr: 98.7 },
    { key: 'downtime', label: 'Unplanned Downtime (h)', unit: 'h', target: 4.0, chn: 2.3, blr: 3.6 },
    { key: 'sec', label: 'Energy SEC (kWh/u)', unit: 'kWh', target: 4.2, chn: 3.82, blr: 4.41 },
    { key: 'cost', label: 'Unit Cost (₹/10)', unit: '₹/10', target: 185, chn: 174, blr: 189 } // scaled for bar readability
  ];

  const shiftVariance = filters.shift === 'A' ? 0.8 : filters.shift === 'C' ? -1.1 : 0;

  return metrics.map((m) => {
    const chnVal = Number((m.chn + (rng() - 0.48) * 0.8 + shiftVariance * 0.3).toFixed(1));
    const blrVal = Number((m.blr + (rng() - 0.52) * 0.8 + shiftVariance * 0.3).toFixed(1));
    return {
      ...m,
      chennai: chnVal,
      bangalore: blrVal,
      variance: Number((chnVal - blrVal).toFixed(1)),
      leader: chnVal > blrVal ? 'Chennai' : 'Bangalore'
    };
  });
}

// ---------------------------------------------------------------------------
// Agent Adapters: Detailed KPIs & Visual Charts per Agent
// ---------------------------------------------------------------------------

function buildAgentTelemetry(agentId, filters) {
  const plant = filters.plant || 'ALL';
  const shift = filters.shift || 'ALL';
  const line = filters.line || 'ALL';
  const datePreset = filters.datePreset || '30d';

  const seed = `${agentId}_${plant}_${shift}_${line}_${datePreset}_${filters.tick || 0}`;
  const rng = createSeededRandom(seed);

  // Plant differentiation factor
  const plantMult = plant === 'IN-TN-01' ? 1.03 : plant === 'IN-KA-01' ? 0.98 : 1.01;
  const shiftFactor = shift === 'A' ? 1.02 : shift === 'B' ? 0.99 : shift === 'C' ? 0.97 : 1.0;

  switch (agentId) {
    case 'production-planning': {
      const adh = Number((98.4 * plantMult * shiftFactor + (rng() - 0.5) * 1.1).toFixed(1));
      const floorOee = Number((87.8 * plantMult + (rng() - 0.5) * 1.5).toFixed(1));
      const shortages = Math.max(0, Math.round((3 - plantMult * 2) + rng() * 2));
      const daysCover = Number((14.2 * plantMult + (rng() - 0.5) * 1.8).toFixed(1));
      const budgetVar = Number(((rng() - 0.6) * 4.2).toFixed(1));

      return {
        kpis: [
          { id: 'adh', name: 'Schedule Adherence', value: `${adh}%`, delta: '+2.4%', isPositive: true, unit: '%' },
          { id: 'floor-oee', name: 'Floor OEE (Hour)', value: `${floorOee}%`, delta: '+1.8%', isPositive: true, unit: '%' },
          { id: 'shortage', name: 'Shortage Risk SKUs', value: `${shortages}`, delta: shortages === 0 ? 'Optimal' : '-1 SKU', isPositive: shortages === 0, unit: 'count' },
          { id: 'days-cover', name: 'Days Stock Coverage', value: `${daysCover}d`, delta: '+1.2d', isPositive: true, unit: 'days' },
          { id: 'budget-var', name: 'Budget Variance', value: `₹${budgetVar}L`, delta: `${budgetVar <= 0 ? '-' : '+'}₹${Math.abs(budgetVar)}L`, isPositive: budgetVar <= 0, unit: '₹ L' }
        ],
        charts: [
          {
            id: 'gantt-schedule',
            title: 'Cell Work Order & PM Gantt Schedule',
            type: 'gantt',
            data: [
              { line: 'SMT / Press 1', task: 'WO-842: High-Speed Run', start: 6, end: 12, status: 'running', color: '#8b5cf6' },
              { line: 'SMT / Press 1', task: 'Tooling PM Slot', start: 12, end: 14, status: 'pm', color: '#f59e0b' },
              { line: 'SMT / Press 1', task: 'WO-843: BGA Placement', start: 14, end: 22, status: 'running', color: '#8b5cf6' },
              { line: 'Wave / Assembly 2', task: 'WO-844: Nitrogen Wave', start: 7, end: 15, status: 'running', color: '#8b5cf6' },
              { line: 'Wave / Assembly 2', task: 'Nozzle Changeover', start: 15, end: 17, status: 'changeover', color: '#0ea5e9' }
            ]
          },
          {
            id: 'takt-pacing',
            title: 'Shift Hourly Output vs Takt Speed',
            type: 'line',
            series: [
              { name: 'Actual Output', color: '#8b5cf6', data: generateTimeSeries(`${seed}_takt_act`, 8, 120 * plantMult, 15, 2) },
              { name: 'Takt Target (125 u/h)', color: '#94a3b8', data: [125, 125, 125, 125, 125, 125, 125, 125] }
            ],
            labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
          }
        ]
      };
    }

    case 'oee-performance': {
      const oee = Number((88.6 * plantMult * shiftFactor + (rng() - 0.5) * 1.4).toFixed(1));
      const avail = Number((92.4 * plantMult + (rng() - 0.5) * 1.0).toFixed(1));
      const perf = Number((94.2 * plantMult + (rng() - 0.5) * 1.2).toFixed(1));
      const qual = Number((99.1 * plantMult + (rng() - 0.5) * 0.4).toFixed(1));
      const dt = Number((2.8 / plantMult + (rng() - 0.5) * 0.5).toFixed(1));

      return {
        kpis: [
          { id: 'oee', name: 'Overall OEE', value: `${oee}%`, delta: '+3.2%', isPositive: true, unit: '%' },
          { id: 'avail', name: 'Machine Availability', value: `${avail}%`, delta: '+1.5%', isPositive: true, unit: '%' },
          { id: 'perf', name: 'Performance Efficiency', value: `${perf}%`, delta: '+2.1%', isPositive: true, unit: '%' },
          { id: 'qual', name: 'Quality Factor', value: `${qual}%`, delta: '+0.4%', isPositive: true, unit: '%' },
          { id: 'dt', name: 'Unscheduled Downtime', value: `${dt}h`, delta: '-0.8h', isPositive: true, unit: 'hours' }
        ],
        charts: [
          {
            id: 'oee-waterfall',
            title: 'OEE Availability & Quality Loss Breakdown',
            type: 'bar',
            data: [
              { name: 'Total Capacity', value: 100, color: '#94a3b8' },
              { name: 'Avail Loss', value: Number((100 - avail).toFixed(1)), color: '#ef4444' },
              { name: 'Speed Loss', value: Number((avail - (avail * perf) / 100).toFixed(1)), color: '#f59e0b' },
              { name: 'Quality Loss', value: Number((1.2).toFixed(1)), color: '#0ea5e9' },
              { name: 'Net OEE', value: oee, color: '#10b981' }
            ]
          },
          {
            id: 'oee-shift-comp',
            title: 'OEE Performance by Shift Tier',
            type: 'grouped_bar',
            data: [
              { shift: 'Shift A (Day)', Chennai: Number((89.4 * plantMult).toFixed(1)), Bangalore: Number((87.1 * plantMult).toFixed(1)) },
              { shift: 'Shift B (Evening)', Chennai: Number((88.1 * plantMult).toFixed(1)), Bangalore: Number((85.6 * plantMult).toFixed(1)) },
              { shift: 'Shift C (Night)', Chennai: Number((86.8 * plantMult).toFixed(1)), Bangalore: Number((84.9 * plantMult).toFixed(1)) }
            ]
          }
        ]
      };
    }

    case 'quality-management': {
      const fpy = Number((99.4 * plantMult + (rng() - 0.5) * 0.4).toFixed(1));
      const ppm = Math.round(112 / plantMult + (rng() - 0.5) * 20);
      const escape = Number((0.02 / plantMult).toFixed(3));
      const exposure = Math.round(45 * (2 - plantMult));

      return {
        kpis: [
          { id: 'fpy', name: 'First Pass Yield (FPY)', value: `${fpy}%`, delta: '+0.8%', isPositive: true, unit: '%' },
          { id: 'ppm', name: 'Defect PPM', value: `${ppm}`, delta: '-18 PPM', isPositive: true, unit: 'PPM' },
          { id: 'escape', name: 'Customer Escape Rate', value: `${escape}%`, delta: 'Zero Escapes', isPositive: true, unit: '%' },
          { id: 'exposure', name: 'Material Lot Exposure', value: `${exposure} u`, delta: '-12 u', isPositive: true, unit: 'units' }
        ],
        charts: [
          {
            id: 'pareto-defects',
            title: 'Quality Defect Pareto Analysis (80/20)',
            type: 'pareto',
            data: [
              { name: 'Solder Void', count: Math.round(48 * plantMult), pct: '42%', cumPct: 42 },
              { name: 'Comp Shift', count: Math.round(32 * plantMult), pct: '28%', cumPct: 70 },
              { name: 'Bridging', count: Math.round(18 * plantMult), pct: '16%', cumPct: 86 },
              { name: 'Scratches', count: Math.round(10 * plantMult), pct: '9%', cumPct: 95 },
              { name: 'Polarity', count: Math.round(6 * plantMult), pct: '5%', cumPct: 100 }
            ]
          },
          {
            id: 'spc-yield-trend',
            title: 'SPC First Pass Yield with 3-Sigma Control Limits',
            type: 'spc',
            series: [
              { name: 'Yield', color: '#10b981', data: generateTimeSeries(`${seed}_spc`, 10, fpy, 0.3, 0.05) },
              { name: 'UCL (99.8%)', color: '#ef4444', data: [99.8, 99.8, 99.8, 99.8, 99.8, 99.8, 99.8, 99.8, 99.8, 99.8] },
              { name: 'LCL (98.6%)', color: '#ef4444', data: [98.6, 98.6, 98.6, 98.6, 98.6, 98.6, 98.6, 98.6, 98.6, 98.6] }
            ],
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10']
          }
        ]
      };
    }

    case 'predictive-maintenance': {
      const mtbf = Math.round(1420 * plantMult + (rng() - 0.5) * 80);
      const mttr = Number((38.4 / plantMult + (rng() - 0.5) * 4).toFixed(1));
      const rul = Number((94.2 * plantMult + (rng() - 0.5) * 6).toFixed(1));
      const vib = Number((1.38 / plantMult + (rng() - 0.5) * 0.15).toFixed(2));
      const pms = Math.round(3 + rng() * 2);

      return {
        kpis: [
          { id: 'mtbf', name: 'Mean Time Between Failures', value: `${mtbf}h`, delta: '+120h', isPositive: true, unit: 'hrs' },
          { id: 'mttr', name: 'Mean Time to Repair', value: `${mttr}m`, delta: '-6.2m', isPositive: true, unit: 'mins' },
          { id: 'rul', name: 'Remaining Useful Life', value: `${rul}h`, delta: 'Optimal Band', isPositive: true, unit: 'hrs' },
          { id: 'vib', name: 'Vibration Severity', value: `${vib} mm/s`, delta: '-0.12', isPositive: true, unit: 'mm/s' },
          { id: 'pms', name: 'Pending PM Work Orders', value: `${pms}`, delta: 'Scheduled', isPositive: true, unit: 'WOs' }
        ],
        charts: [
          {
            id: 'vibration-trajectory',
            title: 'Bearing Vibration & Harmonic Drift (mm/s RMS)',
            type: 'line',
            series: [
              { name: 'Spindle Bearing 1', color: '#f59e0b', data: generateTimeSeries(`${seed}_vib1`, 8, vib, 0.15, 0.05) },
              { name: 'Alert Threshold (1.8)', color: '#ef4444', data: [1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8] }
            ],
            labels: ['Cycle 1', 'Cycle 2', 'Cycle 3', 'Cycle 4', 'Cycle 5', 'Cycle 6', 'Cycle 7', 'Cycle 8']
          },
          {
            id: 'asset-health-donut',
            title: 'Shopfloor Asset Health Classification',
            type: 'donut',
            data: [
              { name: 'Optimal Band (94%)', value: 82, color: '#10b981' },
              { name: 'Monitor (Thermal Drift)', value: 14, color: '#f59e0b' },
              { name: 'Maintenance Scheduled', value: 4, color: '#ef4444' }
            ]
          }
        ]
      };
    }

    case 'inventory-management': {
      const buf = Number((97.4 * plantMult + (rng() - 0.5) * 1.2).toFixed(1));
      const turns = Number((8.6 * plantMult + (rng() - 0.5) * 0.4).toFixed(1));
      const stockouts = Math.round(14 * plantMult);
      const excess = Number((14.2 / plantMult + (rng() - 0.5) * 2).toFixed(1));

      return {
        kpis: [
          { id: 'buf', name: 'Buffer Health Index', value: `${buf}%`, delta: '+2.2%', isPositive: true, unit: '%' },
          { id: 'turns', name: 'Inventory Turnover', value: `${turns}x`, delta: '+0.5x', isPositive: true, unit: 'turns/yr' },
          { id: 'stockouts', name: 'Stockouts Prevented', value: `${stockouts}`, delta: '+4 this month', isPositive: true, unit: 'count' },
          { id: 'excess', name: 'Excess Stock Exposure', value: `₹${excess}L`, delta: '-₹2.4L', isPositive: true, unit: '₹ Lakhs' }
        ],
        charts: [
          {
            id: 'buffer-trajectory',
            title: 'Raw Material Buffer Trajectory vs Thresholds',
            type: 'area',
            series: [
              { name: 'Safety Stock Target', color: '#10b981', data: [95, 95, 95, 95, 95, 95, 95, 95] },
              { name: 'Actual Stock Level', color: '#0ea5e9', data: generateTimeSeries(`${seed}_buf`, 8, buf, 2.5, 0.4) }
            ],
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8']
          },
          {
            id: 'abc-distribution',
            title: 'ABC Inventory Capital Allocation',
            type: 'donut',
            data: [
              { name: 'Class A (Critical ICs)', value: 68, color: '#8b5cf6' },
              { name: 'Class B (Passives & Coils)', value: 24, color: '#0ea5e9' },
              { name: 'Class C (Hardware & Screws)', value: 8, color: '#94a3b8' }
            ]
          }
        ]
      };
    }

    case 'manufacturing-cost': {
      const totalCost = Number((3.42 * (plant === 'IN-TN-01' ? 1.05 : 0.95)).toFixed(2));
      const unitCost = Math.round((plant === 'IN-TN-01' ? 1740 : 1880) + (rng() - 0.5) * 35);
      const matVar = Number(((rng() - 0.6) * 2.8).toFixed(1));
      const scrapLoss = Number((2.1 / plantMult + (rng() - 0.5) * 0.4).toFixed(1));

      return {
        kpis: [
          { id: 'total-cost', name: 'Total Manufacturing Cost', value: `₹${totalCost} Cr`, delta: '-1.4%', isPositive: true, unit: '₹ Crores' },
          { id: 'unit-cost', name: 'Unit Cost of Production', value: `₹${unitCost}`, delta: '-₹42/unit', isPositive: true, unit: '₹/unit' },
          { id: 'mat-var', name: 'Material Cost Variance', value: `₹${matVar}L`, delta: `${matVar <= 0 ? '-' : '+'}₹${Math.abs(matVar)}L`, isPositive: matVar <= 0, unit: '₹ Lakhs' },
          { id: 'scrap-loss', name: 'Scrap & Quality Fallout', value: `₹${scrapLoss}L`, delta: '-₹0.6L', isPositive: true, unit: '₹ Lakhs' }
        ],
        charts: [
          {
            id: 'cost-waterfall',
            title: 'Finished Unit Cost Component Breakdown (₹)',
            type: 'bar',
            data: [
              { name: 'Direct Material', value: Math.round(unitCost * 0.62), color: '#3b82f6' },
              { name: 'Direct Labor', value: Math.round(unitCost * 0.16), color: '#8b5cf6' },
              { name: 'Energy & Power', value: Math.round(unitCost * 0.11), color: '#f59e0b' },
              { name: 'Tooling / Scrap', value: Math.round(unitCost * 0.05), color: '#ef4444' },
              { name: 'Overhead', value: Math.round(unitCost * 0.06), color: '#10b981' }
            ]
          },
          {
            id: 'cost-trend',
            title: 'Monthly Unit Cost Trend vs Target Margin',
            type: 'line',
            series: [
              { name: 'Unit Cost (₹)', color: '#3b82f6', data: generateTimeSeries(`${seed}_cost_tr`, 6, unitCost + 30, 25, -8) },
              { name: 'Selling Price Floor (₹2,250)', color: '#10b981', data: [2250, 2250, 2250, 2250, 2250, 2250] }
            ],
            labels: ['Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026']
          }
        ]
      };
    }

    case 'energy-management': {
      const sec = Number(((plant === 'IN-TN-01' ? 3.82 : 4.42) / shiftFactor + (rng() - 0.5) * 0.2).toFixed(2));
      const peak = Math.round((plant === 'IN-TN-01' ? 620 : 710) + (rng() - 0.5) * 30);
      const pf = Number((0.982 + (rng() - 0.5) * 0.008).toFixed(3));
      const carbon = Math.round((plant === 'IN-TN-01' ? 38 : 46) + (rng() - 0.5) * 4);

      return {
        kpis: [
          { id: 'sec', name: 'Specific Energy (SEC)', value: `${sec} kWh`, delta: '-0.24 kWh', isPositive: true, unit: 'kWh/unit' },
          { id: 'peak', name: 'Peak Power Demand', value: `${peak} kVA`, delta: '-35 kVA', isPositive: true, unit: 'kVA' },
          { id: 'pf', name: 'Power Factor', value: `${pf}`, delta: '+0.005', isPositive: true, unit: 'cos φ' },
          { id: 'carbon', name: 'Scope 2 Carbon Emissions', value: `${carbon} t`, delta: '-4.2 t CO2', isPositive: true, unit: 't CO2e' }
        ],
        charts: [
          {
            id: 'energy-load-profile',
            title: '24-Hour Power Load Curve with Tariff Staggering',
            type: 'area',
            series: [
              { name: 'Actual Load (kVA)', color: '#eab308', data: generateTimeSeries(`${seed}_kw`, 8, peak - 80, 45, 10) },
              { name: 'Peak Tariff Cap', color: '#ef4444', data: [750, 750, 750, 750, 750, 750, 750, 750] }
            ],
            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00']
          },
          {
            id: 'energy-breakdown',
            title: 'Electrical Consumption by Subsystem Share',
            type: 'donut',
            data: [
              { name: 'Lines (SMT/Presses)', value: 54, color: '#3b82f6' },
              { name: 'Cleanroom HVAC', value: 24, color: '#0ea5e9' },
              { name: 'Air Compressors', value: 14, color: '#f59e0b' },
              { name: 'Plant Lighting & Auxiliary', value: 8, color: '#10b981' }
            ]
          }
        ]
      };
    }

    case 'ehs-safety': {
      const safeDays = Math.round(342 + rng() * 10);
      const trir = 0.0;
      const ppe = Number((99.2 * plantMult + (rng() - 0.5) * 0.4).toFixed(1));
      const closed = 100;

      return {
        kpis: [
          { id: 'safe-days', name: 'Days Without LTI', value: `${safeDays}d`, delta: '+1 Day', isPositive: true, unit: 'days' },
          { id: 'trir', name: 'Total Recordable Rate (TRIR)', value: `${trir}`, delta: 'Zero Recordable', isPositive: true, unit: 'rate' },
          { id: 'ppe', name: 'Vision PPE Compliance', value: `${ppe}%`, delta: '+0.5%', isPositive: true, unit: '%' },
          { id: 'closed', name: 'Hazard SLA Closure Rate', value: `${closed}%`, delta: '100% Closed', isPositive: true, unit: '%' }
        ],
        charts: [
          {
            id: 'hazard-categories',
            title: 'Audited Safety Observations by Category',
            type: 'horizontal_bar',
            data: [
              { name: 'Machine Guarding', count: 4, resolved: 4 },
              { name: 'Slip / Trip Obstacles', count: 6, resolved: 6 },
              { name: 'Ergonomic Posture', count: 3, resolved: 3 },
              { name: 'Chemical Labeling', count: 2, resolved: 2 }
            ]
          },
          {
            id: 'ppe-trend',
            title: 'Vision AI PPE Compliance Rate by Zone',
            type: 'line',
            series: [
              { name: 'Assembly Lines', color: '#10b981', data: [99.2, 99.4, 99.1, 99.5, 99.6, 99.4, 99.8, 99.7] },
              { name: 'Loading Bay & Staging', color: '#0ea5e9', data: [98.4, 98.6, 98.9, 98.8, 99.1, 99.0, 99.2, 99.4] }
            ],
            labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7', 'Wk 8']
          }
        ]
      };
    }

    // Tailored telemetry & diverse chart types for every remaining live agent
    case 'digital-twin': {
      const syncAcc = Number((97.8 * plantMult + (rng() - 0.5) * 0.8).toFixed(1));
      const cycleDelta = Number((0.42 / plantMult + (rng() - 0.5) * 0.1).toFixed(2));
      const scenarios = Math.round(18 + rng() * 6);
      const bottleneckGain = Number((6.4 * plantMult + (rng() - 0.5) * 0.8).toFixed(1));

      return {
        kpis: [
          { id: 'twin-sync', name: 'Twin Sync Fidelity', value: `${syncAcc}%`, delta: '+1.2%', isPositive: true, unit: '%' },
          { id: 'cycle-drift', name: 'Cycle Drift Error', value: `${cycleDelta}s`, delta: '-0.08s', isPositive: true, unit: 'sec' },
          { id: 'scenarios', name: 'Simulations Executed', value: `${scenarios}`, delta: '+4 runs', isPositive: true, unit: 'runs' },
          { id: 'gain', name: 'Bottleneck Gain', value: `+${bottleneckGain}%`, delta: 'Validated', isPositive: true, unit: '%' }
        ],
        charts: [
          {
            id: 'twin-sync-gauge',
            title: 'Virtual-Physical Sync Accuracy',
            type: 'radial_gauge',
            value: syncAcc,
            target: 95,
            color: '#8b5cf6',
            breakdown: [
              { label: 'PLC Telemetry Match', value: '99.1%', color: '#10b981' },
              { label: 'Kinematic Takt Sync', value: `${syncAcc}%`, color: '#8b5cf6' },
              { label: 'Sim Latency', value: '42 ms', color: '#0ea5e9' }
            ]
          },
          {
            id: 'twin-bottleneck-area',
            title: 'Simulated Line Takt Bottleneck Drift',
            type: 'area',
            series: [
              { name: 'Simulated Cycle (s)', color: '#8b5cf6', data: generateTimeSeries(`${seed}_twin`, 8, 28.4 / plantMult, 1.4, -0.3) },
              { name: 'Target Takt (27.5s)', color: '#10b981', data: [27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5] }
            ],
            labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
          }
        ]
      };
    }

    case 'vision-ai-inspection': {
      const acc = Number((99.6 * Math.min(1.003, plantMult) + (rng() - 0.5) * 0.2).toFixed(1));
      const falseReject = Number((0.18 / plantMult + (rng() - 0.5) * 0.04).toFixed(2));
      const frames = Math.round(14200 * plantMult + rng() * 800);
      const latency = Math.round(14 / plantMult + rng() * 3);

      return {
        kpis: [
          { id: 'vis-acc', name: 'Detection Precision', value: `${acc}%`, delta: '+0.4%', isPositive: true, unit: '%' },
          { id: 'false-rej', name: 'False Reject Rate', value: `${falseReject}%`, delta: '-0.05%', isPositive: true, unit: '%' },
          { id: 'frames', name: 'Frames Inspected', value: `${(frames / 1000).toFixed(1)}k`, delta: '+8.2%', isPositive: true, unit: 'frames' },
          { id: 'latency', name: 'Edge Inference', value: `${latency} ms`, delta: '-2 ms', isPositive: true, unit: 'ms' }
        ],
        charts: [
          {
            id: 'vision-pareto',
            title: 'Edge Vision Defect Class Pareto',
            type: 'pareto',
            data: [
              { name: 'Solder Bridge', count: Math.round(34 * plantMult), pct: '40%', cumPct: 40 },
              { name: 'Tombstone', count: Math.round(24 * plantMult), pct: '28%', cumPct: 68 },
              { name: 'Pin Lift', count: Math.round(14 * plantMult), pct: '16%', cumPct: 84 },
              { name: 'Missing Pad', count: Math.round(9 * plantMult), pct: '11%', cumPct: 95 },
              { name: 'Burr Mark', count: Math.round(4 * plantMult), pct: '5%', cumPct: 100 }
            ]
          },
          {
            id: 'vision-disposition',
            title: 'AOI Disposition Mix by Station',
            type: 'stacked_bar',
            segments: [
              { key: 'pass', label: 'Pass', color: '#10b981' },
              { key: 'rework', label: 'Rework', color: '#f59e0b' },
              { key: 'scrap', label: 'Reject', color: '#ef4444' }
            ],
            data: [
              { name: 'SMT Line 1 (CHN)', pass: 94, rework: 4, scrap: 2, totalLabel: '94% Pass' },
              { name: 'Wave Line 2 (CHN)', pass: 92, rework: 6, scrap: 2, totalLabel: '92% Pass' },
              { name: 'Press Cell (BLR)', pass: 90, rework: 7, scrap: 3, totalLabel: '90% Pass' }
            ]
          }
        ]
      };
    }

    case 'engineering-change': {
      const openEcns = Math.round(7 + rng() * 3);
      const leadDays = Number((3.8 / plantMult + (rng() - 0.5) * 0.5).toFixed(1));
      const bomSync = Number((99.3 * plantMult + (rng() - 0.5) * 0.4).toFixed(1));
      const cutInReady = Math.round(94 * plantMult);

      return {
        kpis: [
          { id: 'open-ecn', name: 'Active ECNs', value: `${openEcns}`, delta: '-2 closed', isPositive: true, unit: 'count' },
          { id: 'lead-days', name: 'Avg Approval Cycle', value: `${leadDays}d`, delta: '-0.6d', isPositive: true, unit: 'days' },
          { id: 'bom-sync', name: 'BOM Alignment', value: `${bomSync}%`, delta: '+0.8%', isPositive: true, unit: '%' },
          { id: 'cutin', name: 'Cut-In Readiness', value: `${cutInReady}%`, delta: 'On Schedule', isPositive: true, unit: '%' }
        ],
        charts: [
          {
            id: 'ecn-stage-bar',
            title: 'ECN Cycle Time by Approval Stage (hrs)',
            type: 'bar',
            data: [
              { name: 'Impact Eval', value: 14, color: '#3b82f6' },
              { name: 'DFM Review', value: 22, color: '#8b5cf6' },
              { name: 'BOM Sync', value: 9, color: '#0ea5e9' },
              { name: 'QA Signoff', value: 16, color: '#10b981' },
              { name: 'Line Cut-In', value: 11, color: '#f59e0b' }
            ]
          },
          {
            id: 'bom-readiness-hbar',
            title: 'BOM Revision Sync Across Lines (%)',
            type: 'horizontal_bar',
            data: [
              { name: 'SMT Line 1 (CHN)', value: 99.6, displayVal: '99.6%', color: '#10b981' },
              { name: 'Wave Line 2 (CHN)', value: 98.4, displayVal: '98.4%', color: '#0ea5e9' },
              { name: 'Press Line 1 (BLR)', value: 96.2, displayVal: '96.2%', color: '#3b82f6' },
              { name: 'Harness Line 2 (BLR)', value: 94.8, displayVal: '94.8%', color: '#8b5cf6' }
            ]
          }
        ]
      };
    }

    case 'product-traceability': {
      const serialPct = Number((99.8 - (plant === 'IN-KA-01' ? 0.4 : 0.1)).toFixed(1));
      const lookupSec = Number((1.2 / plantMult + (rng() - 0.5) * 0.2).toFixed(1));
      const ringFenced = Math.round(2 + rng() * 2);
      const lots = Math.round(480 * plantMult + rng() * 30);

      return {
        kpis: [
          { id: 'serial-cov', name: 'Serialization Rate', value: `${serialPct}%`, delta: '+0.3%', isPositive: true, unit: '%' },
          { id: 'lookup', name: 'Genealogy Query', value: `${lookupSec}s`, delta: '-0.4s', isPositive: true, unit: 'sec' },
          { id: 'quarantine', name: 'Ring-Fenced Lots', value: `${ringFenced}`, delta: 'Contained', isPositive: true, unit: 'lots' },
          { id: 'tracked', name: 'Birth Records Logged', value: `${lots}`, delta: '+34 lots', isPositive: true, unit: 'lots' }
        ],
        charts: [
          {
            id: 'trace-gauge',
            title: 'End-to-End Serial Genealogy Coverage',
            type: 'radial_gauge',
            value: serialPct,
            target: 99,
            color: '#14b8a6',
            breakdown: [
              { label: 'SMT Barcode Scan', value: '100%', color: '#10b981' },
              { label: 'Sub-Assy Pairing', value: `${serialPct}%`, color: '#14b8a6' },
              { label: 'Dispatch Manifest', value: '99.5%', color: '#0ea5e9' }
            ]
          },
          {
            id: 'trace-lot-donut',
            title: 'Production Lot Compliance Share',
            type: 'donut',
            data: [
              { name: 'Cleared & Released', value: 91, color: '#10b981' },
              { name: 'In-Process Audit', value: 7, color: '#0ea5e9' },
              { name: 'Quarantine Hold', value: 2, color: '#f59e0b' }
            ]
          }
        ]
      };
    }

    case 'supplier-performance': {
      const otif = Number((96.8 * plantMult + (rng() - 0.5) * 1.1).toFixed(1));
      const ppm = Math.round(145 / plantMult + (rng() - 0.5) * 20);
      const tier1 = Math.round(24 + rng() * 4);
      const riskCount = Math.max(1, Math.round(3 / plantMult));

      return {
        kpis: [
          { id: 'sup-otif', name: 'Supplier OTIF Score', value: `${otif}%`, delta: '+1.9%', isPositive: true, unit: '%' },
          { id: 'sup-ppm', name: 'Incoming Defect PPM', value: `${ppm}`, delta: '-24 PPM', isPositive: true, unit: 'PPM' },
          { id: 'tier1', name: 'Qualified Tier-1s', value: `${tier1}`, delta: 'Audited', isPositive: true, unit: 'vendors' },
          { id: 'risk-v', name: 'At-Risk Suppliers', value: `${riskCount}`, delta: '-1 risk', isPositive: true, unit: 'count' }
        ],
        charts: [
          {
            id: 'supplier-grouped',
            title: 'Vendor OTIF Score by Commodity (%)',
            type: 'grouped_bar',
            data: [
              { category: 'Semicon ICs', Chennai: 97.4, Bangalore: 95.8 },
              { category: 'PCB Substrates', Chennai: 96.2, Bangalore: 94.9 },
              { category: 'Stamp Steel', Chennai: 94.8, Bangalore: 97.1 }
            ]
          },
          {
            id: 'supplier-ppm-hbar',
            title: 'Incoming Defect PPM by Vendor Tier',
            type: 'horizontal_bar',
            data: [
              { name: 'Tier-1 Strategic', value: 82, displayVal: '82 PPM', color: '#10b981' },
              { name: 'Tier-1 Regional', value: 138, displayVal: '138 PPM', color: '#0ea5e9' },
              { name: 'Tier-2 Packaging', value: 194, displayVal: '194 PPM', color: '#f59e0b' },
              { name: 'Spot Connectors', value: 245, displayVal: '245 PPM', color: '#ef4444' }
            ]
          }
        ]
      };
    }

    case 'agentic-rfq': {
      const savings = Number((4.8 * plantMult + (rng() - 0.5) * 0.7).toFixed(1));
      const cycleHrs = Math.round(18 / plantMult + rng() * 4);
      const activeRfqs = Math.round(14 + rng() * 5);
      const awardRate = Number((88.5 * plantMult).toFixed(1));

      return {
        kpis: [
          { id: 'rfq-save', name: 'Negotiated Savings', value: `₹${savings}L`, delta: '+6.2%', isPositive: true, unit: '₹ Lakhs' },
          { id: 'rfq-cyc', name: 'Quote Cycle Time', value: `${cycleHrs}h`, delta: '-5.4h', isPositive: true, unit: 'hrs' },
          { id: 'rfq-act', name: 'Active RFQ Bids', value: `${activeRfqs}`, delta: '3 Closing', isPositive: true, unit: 'RFQs' },
          { id: 'rfq-awd', name: 'Auto-Award Match', value: `${awardRate}%`, delta: '+3.1%', isPositive: true, unit: '%' }
        ],
        charts: [
          {
            id: 'rfq-pipeline-stack',
            title: 'RFQ Pipeline Status by Commodity',
            type: 'stacked_bar',
            segments: [
              { key: 'awarded', label: 'Awarded', color: '#10b981' },
              { key: 'eval', label: 'Normalized', color: '#0ea5e9' },
              { key: 'pending', label: 'Bidding', color: '#8b5cf6' }
            ],
            data: [
              { name: 'Electronics & ICs', awarded: 9, eval: 4, pending: 3, totalLabel: '16 RFQs' },
              { name: 'Precision Tooling', awarded: 6, eval: 3, pending: 2, totalLabel: '11 RFQs' },
              { name: 'Raw Sheet Metal', awarded: 8, eval: 2, pending: 2, totalLabel: '12 RFQs' }
            ]
          },
          {
            id: 'rfq-savings-bar',
            title: 'Cost Avoidance by Category (₹ Lakhs)',
            type: 'bar',
            data: [
              { name: 'ICs', value: 2.1, color: '#0ea5e9' },
              { name: 'Tooling', value: 1.4, color: '#8b5cf6' },
              { name: 'Harnesses', value: 1.1, color: '#10b981' },
              { name: 'Freight', value: 0.8, color: '#f59e0b' }
            ]
          }
        ]
      };
    }

    case 'logistics-dispatch': {
      const dispatchOnTime = Number((97.9 * plantMult + (rng() - 0.5) * 0.8).toFixed(1));
      const dockMin = Math.round(34 / plantMult + rng() * 5);
      const shipments = Math.round(64 * plantMult + rng() * 8);
      const transitOk = Number((98.6 * plantMult).toFixed(1));

      return {
        kpis: [
          { id: 'log-otd', name: 'On-Time Dispatch', value: `${dispatchOnTime}%`, delta: '+1.6%', isPositive: true, unit: '%' },
          { id: 'dock-tat', name: 'Dock Bay Turnaround', value: `${dockMin}m`, delta: '-6m', isPositive: true, unit: 'mins' },
          { id: 'ships', name: 'Active Dispatches', value: `${shipments}`, delta: '+8 loads', isPositive: true, unit: 'trucks' },
          { id: 'gps-ok', name: 'Fleet SLA Compliance', value: `${transitOk}%`, delta: 'Nominal', isPositive: true, unit: '%' }
        ],
        charts: [
          {
            id: 'logistics-volume-grouped',
            title: 'Weekly Dispatch Loads: Chennai vs Bangalore',
            type: 'grouped_bar',
            data: [
              { category: 'OEM Direct', Chennai: 38, Bangalore: 29 },
              { category: 'Tier-1 Hub', Chennai: 24, Bangalore: 31 },
              { category: 'Express Air', Chennai: 12, Bangalore: 9 }
            ]
          },
          {
            id: 'dock-turnaround-stack',
            title: 'Dock Turnaround Time Breakdown (mins)',
            type: 'stacked_bar',
            segments: [
              { key: 'gate', label: 'Gate Check', color: '#3b82f6' },
              { key: 'load', label: 'Loading', color: '#8b5cf6' },
              { key: 'docs', label: 'E-Way Bill', color: '#10b981' }
            ],
            data: [
              { name: 'Chennai Bay 1-3', gate: 6, load: 19, docs: 5, totalLabel: '30m avg' },
              { name: 'Bangalore Bay 1-2', gate: 8, load: 22, docs: 6, totalLabel: '36m avg' }
            ]
          }
        ]
      };
    }

    case 'customer-order': {
      const otif = Number((97.4 * plantMult + (rng() - 0.5) * 0.9).toFixed(1));
      const backlog = Math.round(142 * (2 - plantMult) + rng() * 15);
      const fillRate = Number((98.8 * plantMult).toFixed(1));
      const slaRisk = Math.max(0, Math.round(2 / plantMult));

      return {
        kpis: [
          { id: 'ord-otif', name: 'Order OTIF SLA', value: `${otif}%`, delta: '+1.4%', isPositive: true, unit: '%' },
          { id: 'ord-back', name: 'Open Order Backlog', value: `${backlog}`, delta: '-18 orders', isPositive: true, unit: 'orders' },
          { id: 'ord-fill', name: 'Line Fill Rate', value: `${fillRate}%`, delta: '+0.7%', isPositive: true, unit: '%' },
          { id: 'ord-risk', name: 'SLA At-Risk Orders', value: `${slaRisk}`, delta: slaRisk === 0 ? 'Clear' : 'Monitored', isPositive: slaRisk <= 2, unit: 'orders' }
        ],
        charts: [
          {
            id: 'order-sla-gauge',
            title: 'Customer Fulfillment SLA Compliance',
            type: 'radial_gauge',
            value: otif,
            target: 95,
            color: '#10b981',
            breakdown: [
              { label: 'Committed Window', value: `${otif}%`, color: '#10b981' },
              { label: 'Line Fill Rate', value: `${fillRate}%`, color: '#0ea5e9' },
              { label: 'Backlog Coverage', value: '1.8 days', color: '#8b5cf6' }
            ]
          },
          {
            id: 'order-backlog-area',
            title: 'Open Order Backlog Burndown',
            type: 'area',
            series: [
              { name: 'Open Orders', color: '#10b981', data: generateTimeSeries(`${seed}_ord`, 8, backlog + 28, 12, -5) },
              { name: 'SLA Cap (160)', color: '#f59e0b', data: [160, 160, 160, 160, 160, 160, 160, 160] }
            ],
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Today']
          }
        ]
      };
    }

    case 'workforce-management': {
      const attendance = Number((96.4 * plantMult + (rng() - 0.5) * 0.8).toFixed(1));
      const skillCov = Number((91.8 * plantMult + (rng() - 0.5) * 1.4).toFixed(1));
      const overtime = Number((3.4 / plantMult + (rng() - 0.5) * 0.5).toFixed(1));
      const operators = Math.round((plant === 'IN-TN-01' ? 148 : plant === 'IN-KA-01' ? 124 : 272));

      return {
        kpis: [
          { id: 'wf-att', name: 'Shift Roster Fill', value: `${attendance}%`, delta: '+1.1%', isPositive: true, unit: '%' },
          { id: 'wf-skl', name: 'Skill Matrix Match', value: `${skillCov}%`, delta: '+2.3%', isPositive: true, unit: '%' },
          { id: 'wf-ot', name: 'Overtime Ratio', value: `${overtime}%`, delta: '-0.6%', isPositive: true, unit: '%' },
          { id: 'wf-hc', name: 'Active Operators', value: `${operators}`, delta: '3 Shifts', isPositive: true, unit: 'staff' }
        ],
        charts: [
          {
            id: 'wf-roster-stack',
            title: 'Shift Headcount Allocation by Skill Tier',
            type: 'stacked_bar',
            segments: [
              { key: 'l3', label: 'L3 Lead', color: '#f97316' },
              { key: 'l2', label: 'L2 Cert', color: '#0ea5e9' },
              { key: 'l1', label: 'L1 Ops', color: '#10b981' }
            ],
            data: [
              { name: 'Shift A (Morning)', l3: 18, l2: 46, l1: 38, totalLabel: '102 ops' },
              { name: 'Shift B (Evening)', l3: 15, l2: 42, l1: 35, totalLabel: '92 ops' },
              { name: 'Shift C (Night)', l3: 12, l2: 34, l1: 32, totalLabel: '78 ops' }
            ]
          },
          {
            id: 'wf-skill-hbar',
            title: 'Cross-Trained Line Certification (%)',
            type: 'horizontal_bar',
            data: [
              { name: 'SMT Placement', value: 96, displayVal: '96%', color: '#f97316' },
              { name: 'Wave Soldering', value: 92, displayVal: '92%', color: '#0ea5e9' },
              { name: 'High-Tonnage Press', value: 89, displayVal: '89%', color: '#8b5cf6' },
              { name: 'AOI / QA Cell', value: 94, displayVal: '94%', color: '#10b981' }
            ]
          }
        ]
      };
    }

    // Default Fallback generator for coming_soon / additional agents
    default: {
      const cfg = AGENTS_CONFIG.find((a) => a.id === agentId);
      const isComingSoon = cfg?.status === 'coming_soon';

      if (isComingSoon) {
        return {
          isComingSoon: true,
          kpis: [],
          charts: []
        };
      }

      const base1 = Number((98.2 * plantMult + (rng() - 0.5) * 1.5).toFixed(1));
      const base2 = Number((96.4 * plantMult + (rng() - 0.5) * 1.2).toFixed(1));
      const base3 = Math.round(140 * plantMult + (rng() - 0.5) * 20);
      const base4 = Number((1.2 * (2 - plantMult)).toFixed(1));

      return {
        kpis: [
          { id: 'k1', name: `${cfg?.shortName || 'Agent'} Operational Index`, value: `${base1}%`, delta: '+2.1%', isPositive: true, unit: '%' },
          { id: 'k2', name: 'Service Level Adherence', value: `${base2}%`, delta: '+1.4%', isPositive: true, unit: '%' },
          { id: 'k3', name: 'Active Telemetry Events', value: `${base3}`, delta: '+12 evts', isPositive: true, unit: 'count' },
          { id: 'k4', name: 'Cycle Variance Delta', value: `${base4}s`, delta: '-0.3s', isPositive: true, unit: 'sec' }
        ],
        charts: [
          {
            id: 'trend-series',
            title: `${cfg?.name || 'Agent'} Continuous Telemetry Pacing`,
            type: 'line',
            series: [
              { name: 'Operational Index', color: cfg?.accentColor || '#8b5cf6', data: generateTimeSeries(`${seed}_c1`, 8, base1, 2.0, 0.4) }
            ],
            labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
          },
          {
            id: 'dist-share',
            title: `${cfg?.shortName || 'Agent'} Status Distribution`,
            type: 'donut',
            data: [
              { name: 'Optimal Performance', value: 84, color: '#10b981' },
              { name: 'Transient Review', value: 12, color: '#f59e0b' },
              { name: 'Action Required', value: 4, color: '#ef4444' }
            ]
          }
        ]
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Unified Service Query Interface with Error Isolation
// ---------------------------------------------------------------------------
export async function fetchAllReportsData(filters) {
  const executiveKpis = getExecutiveSummary(filters);
  const plantComparison = getPlantComparison(filters);

  const agentData = {};
  const agentErrors = {};

  for (const ag of AGENTS_CONFIG) {
    try {
      agentData[ag.id] = buildAgentTelemetry(ag.id, filters);
    } catch (err) {
      console.error(`Error loading adapter for agent ${ag.id}:`, err);
      agentErrors[ag.id] = err.message || 'Telemetry connection failed';
    }
  }

  // Generate plain-language AI Insights based strictly on active filters
  const aiInsights = generateDynamicAiInsights(filters, executiveKpis, plantComparison);

  return {
    lastUpdated: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    executiveKpis,
    plantComparison,
    agentData,
    agentErrors,
    aiInsights
  };
}

// ---------------------------------------------------------------------------
// Plain-Language Dynamic AI Insights Generator
// ---------------------------------------------------------------------------
function generateDynamicAiInsights(filters, execKpis, plantComp) {
  const plant = filters.plant || 'ALL';
  const shift = filters.shift || 'ALL';
  const line = filters.line || 'ALL';

  const plantName = plant === 'IN-TN-01' ? 'Chennai (Tamil Nadu)' : plant === 'IN-KA-01' ? 'Bangalore (Karnataka)' : 'Both Chennai & Bangalore Facilities';
  const shiftName = shift === 'ALL' ? 'all 3 shifts (24-hour cycle)' : `Shift ${shift}`;

  const oeeKpi = execKpis.find((k) => k.id === 'exec-oee')?.numVal || 88.4;
  const fpyKpi = execKpis.find((k) => k.id === 'exec-fpy')?.numVal || 99.2;
  const costKpi = execKpis.find((k) => k.id === 'exec-cost')?.value || '₹1,740';

  const insights = [
    {
      type: 'anomaly',
      title: `Harmonic Vibration Detected on SMT / Press Feeder (${plantName})`,
      detail: `Predictive Maintenance identified 8.2 kHz harmonic micro-vibrations on ${line === 'ALL' ? 'Line 1 Spindle' : line}. While currently within the optimal threshold, cross-agent correlation indicates a 0.24% rise in downstream AOI solder void defects during ${shiftName}.`,
      severity: 'warning',
      action: 'Dispatch preventive lubrication work order during scheduled PM window.'
    },
    {
      type: 'comparison',
      title: `Chennai vs Bangalore Plant Variance: Unit Cost & Energy SEC`,
      detail: `Chennai facility is outpacing Bangalore in First Pass Yield (99.4% vs 98.7%) with a lower unit cost of ₹1,740 vs ₹1,890. Bangalore facility exhibits slightly higher electrical specific energy consumption (4.41 vs 3.82 kWh/unit) attributable to high-tonnage stamping cycle runs.`,
      severity: 'info',
      action: 'Implement Chennai high-speed feeder tooling calibrations at Bangalore Stamping Cell 2.'
    },
    {
      type: 'recommendation',
      title: `Shift Tariff Staggering Opportunity (${shiftName})`,
      detail: `Energy Management recommends staggering progressive blanking runs between 14:30 and 16:00 during peak state grid tariff hours. Projected monthly cost savings across ${plantName} is ₹48,000 with a 5.8% reduction in peak kVA demand.`,
      severity: 'success',
      action: 'Enable autonomous tariff-aligned work order sequencing in Production Planning.'
    }
  ];

  return insights;
}
