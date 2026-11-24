/**
 * Mock operational telemetry & KPI card data for all 19 autonomous agents
 */
export const AGENT_METRICS_DB = {
  // --- Production & Planning ---
  'production-planning-system': {
    agentId: 'production-planning-system',
    agentName: 'Production Planning System',
    status: 'Normal',
    sectorId: 'production-planning',
    sectorName: 'Production & Planning',
    lastUpdated: 'Just now',
    mission: 'Dynamic schedule sequencing & real-time work order dispatching across multi-cell lines.',
    kpis: [
      { label: 'Schedule Adherence', value: '98.4', unit: '%', delta: '+2.1%', deltaType: 'up' },
      { label: 'WIP Velocity', value: '4.2', unit: 'days', delta: '-0.6d', deltaType: 'up' },
      { label: 'Active Work Orders', value: '142', unit: 'jobs', delta: '+12', deltaType: 'neutral' },
      { label: 'Plan Bottlenecks', value: '0', unit: 'cells', delta: '-2', deltaType: 'up' }
    ],
    trend: [92, 94, 93, 96, 95, 97, 98.4],
    recommendation: 'Line 4 sequence re-optimized for die-changeover minimization.'
  },
  'production-monitoring-system': {
    agentId: 'production-monitoring-system',
    agentName: 'Production Monitoring System',
    status: 'Normal',
    sectorId: 'production-planning',
    sectorName: 'Production & Planning',
    lastUpdated: '1m ago',
    mission: 'Continuous cycle-time telemetry tracking and takt-time variance alerts.',
    kpis: [
      { label: 'Takt Adherence', value: '99.1', unit: '%', delta: '+0.5%', deltaType: 'up' },
      { label: 'Throughput', value: '1,420', unit: 'units/hr', delta: '+45', deltaType: 'up' },
      { label: 'Micro-Stoppages', value: '3', unit: 'events', delta: '-4', deltaType: 'up' },
      { label: 'Line Balance Ratio', value: '94.2', unit: '%', delta: '+1.3%', deltaType: 'up' }
    ],
    trend: [95, 96, 94, 98, 97, 98, 99.1],
    recommendation: 'Stamping bay takt pacing running within ±1.2s nominal tolerance.'
  },
  'oee': {
    agentId: 'oee',
    agentName: 'Equipment Effectiveness (OEE)',
    status: 'Normal',
    sectorId: 'production-planning',
    sectorName: 'Production & Planning',
    appUrl: 'https://oee-performance-agent.vercel.app/',
    lastUpdated: '2m ago',
    mission: 'Tri-factor OEE computation: Availability, Performance, and Quality yield indexing.',
    kpis: [
      { label: 'Overall OEE', value: '88.6', unit: '%', delta: '+3.2%', deltaType: 'up' },
      { label: 'Availability', value: '94.5', unit: '%', delta: '+1.1%', deltaType: 'up' },
      { label: 'Performance', value: '96.2', unit: '%', delta: '+2.4%', deltaType: 'up' },
      { label: 'Quality Yield', value: '99.1', unit: '%', delta: '+0.2%', deltaType: 'up' }
    ],
    trend: [82, 84, 85, 87, 86, 87.5, 88.6],
    recommendation: 'OEE benchmark exceeds World-Class 85% threshold across 8 lines.'
  },
  'digital-plant-twin': {
    agentId: 'digital-plant-twin',
    agentName: 'Digital Plant Twin Simulation',
    status: 'Normal',
    sectorId: 'production-planning',
    sectorName: 'Production & Planning',
    appUrl: 'https://digital-twin-frontend-c0ji.onrender.com/',
    lastUpdated: '3m ago',
    mission: 'Physics-informed simulation engine evaluating layout capacity and bottleneck shifts.',
    kpis: [
      { label: 'Sim Sync Fidelity', value: '99.8', unit: '%', delta: '+0.1%', deltaType: 'up' },
      { label: 'Bottleneck Horizon', value: '48', unit: 'hrs', delta: '+12h', deltaType: 'up' },
      { label: 'Virtual Line Runs', value: '18', unit: 'today', delta: '+4', deltaType: 'neutral' },
      { label: 'Material Flow Score', value: '96.4', unit: '/100', delta: '+1.8', deltaType: 'up' }
    ],
    trend: [92, 93, 95, 96, 96, 97, 99.8],
    recommendation: 'Paint shop buffer model confirms 15% throughput headroom for Q3 ramp.'
  },

  // --- Maintenance & Utilities ---
  'predictive-maintenance': {
    agentId: 'predictive-maintenance',
    agentName: 'Predictive Maintenance System',
    status: 'Warning',
    sectorId: 'maintenance-utilities',
    sectorName: 'Maintenance & Utilities',
    lastUpdated: 'Just now',
    mission: 'Vibration, thermography, and acoustic telemetry anomaly detection for rotating assets.',
    kpis: [
      { label: 'MTBF', value: '412', unit: 'hrs', delta: '+18h', deltaType: 'up' },
      { label: 'Assets at Risk', value: '2', unit: 'units', delta: '-1', deltaType: 'down' },
      { label: 'Next Service Due', value: '14.5', unit: 'hrs', delta: 'Line 2 CNC', deltaType: 'neutral' },
      { label: 'Alerts Today', value: '3', unit: 'events', delta: '+1', deltaType: 'down' }
    ],
    trend: [480, 460, 430, 410, 400, 412],
    recommendation: 'Spindle bearing on CNC #04 shows harmonic anomaly (8.2 kHz). Schedule lubrication.'
  },
  'energy-tariff': {
    agentId: 'energy-tariff',
    agentName: 'Energy Management & Tariff System',
    status: 'Normal',
    sectorId: 'maintenance-utilities',
    sectorName: 'Maintenance & Utilities',
    lastUpdated: '1m ago',
    mission: 'Automated peak-shaving, power factor correction, and dynamic tariff optimization.',
    kpis: [
      { label: 'Energy Today', value: '14,820', unit: 'kWh', delta: '-4.8%', deltaType: 'up' },
      { label: 'Peak Demand', value: '1,840', unit: 'kVA', delta: '-120', deltaType: 'up' },
      { label: 'Tariff Slot', value: 'Off-Peak', unit: 'Green', delta: '₹4.20/u', deltaType: 'up' },
      { label: 'Cost Avoidance', value: '₹1.84', unit: 'Lakh', delta: '+18%', deltaType: 'up' }
    ],
    trend: [18.2, 17.5, 16.8, 15.9, 15.2, 14.82],
    recommendation: 'Heavy furnace load scheduled during 23:00-06:00 low tariff window.'
  },
  'utilities-facilities': {
    agentId: 'utilities-facilities',
    agentName: 'Utilities & Facilities Management',
    status: 'Normal',
    sectorId: 'maintenance-utilities',
    sectorName: 'Maintenance & Utilities',
    lastUpdated: '4m ago',
    mission: 'Pneumatics, boiler pressure, chilled water, and compressed air loop optimization.',
    kpis: [
      { label: 'Air Pressure', value: '6.8', unit: 'bar', delta: '±0.1 bar', deltaType: 'up' },
      { label: 'Chiller COP', value: '5.2', unit: 'ratio', delta: '+0.3', deltaType: 'up' },
      { label: 'Pneumatic Leaks', value: '0', unit: 'active', delta: '-3', deltaType: 'up' },
      { label: 'Water Recycling', value: '84.2', unit: '%', delta: '+2.8%', deltaType: 'up' }
    ],
    trend: [6.4, 6.5, 6.7, 6.6, 6.8, 6.8],
    recommendation: 'Chilled water loop flow balanced; supply temperature stabilized at 7.1°C.'
  },

  // --- Quality & Engineering ---
  'quality-inspection': {
    agentId: 'quality-inspection',
    agentName: 'Quality Management & Inspection System',
    status: 'Normal',
    sectorId: 'quality-engineering',
    sectorName: 'Quality & Engineering',
    lastUpdated: 'Just now',
    mission: 'In-line SPC control charting, dimensional tolerance audits, and lot dispositioning.',
    kpis: [
      { label: 'First Pass Yield', value: '99.4', unit: '%', delta: '+0.6%', deltaType: 'up' },
      { label: 'Cpk Process Index', value: '1.68', unit: 'index', delta: '+0.08', deltaType: 'up' },
      { label: 'Defect Rate', value: '180', unit: 'PPM', delta: '-45', deltaType: 'up' },
      { label: 'Open NCRs', value: '1', unit: 'case', delta: '-2', deltaType: 'up' }
    ],
    trend: [98.2, 98.6, 98.9, 99.1, 99.2, 99.4],
    recommendation: 'Sub-assembly precision within Six Sigma 4-sigma boundary.'
  },
  'aoi': {
    agentId: 'aoi',
    agentName: 'Automated Optical Inspection System',
    status: 'Normal',
    sectorId: 'quality-engineering',
    sectorName: 'Quality & Engineering',
    lastUpdated: '1m ago',
    mission: 'High-speed computer vision inspecting surface scratches, welds, and solder defects.',
    kpis: [
      { label: 'Inspection Speed', value: '420', unit: 'parts/min', delta: '+15', deltaType: 'up' },
      { label: 'False Alarm Rate', value: '0.04', unit: '%', delta: '-0.02%', deltaType: 'up' },
      { label: 'Defects Caught', value: '14', unit: 'today', delta: '100% sort', deltaType: 'up' },
      { label: 'Camera Uptime', value: '100', unit: '%', delta: 'Nominal', deltaType: 'up' }
    ],
    trend: [99.8, 99.85, 99.9, 99.92, 99.96],
    recommendation: 'All 6 machine vision stations operating at 50μm defect resolution.'
  },
  'ecn-bom': {
    agentId: 'ecn-bom',
    agentName: 'Engineering Change & BOM System',
    status: 'Normal',
    sectorId: 'quality-engineering',
    sectorName: 'Quality & Engineering',
    lastUpdated: '6m ago',
    mission: 'Real-time BOM version synchronizer bridging CAD/PLM with shopfloor ERP routing.',
    kpis: [
      { label: 'BOM Sync Accuracy', value: '100', unit: '%', delta: '0 drift', deltaType: 'up' },
      { label: 'Active ECNs', value: '4', unit: 'in-review', delta: '-1', deltaType: 'neutral' },
      { label: 'Avg Approval Time', value: '3.2', unit: 'hrs', delta: '-1.4h', deltaType: 'up' },
      { label: 'Revision Match', value: 'Rev 4.2', unit: 'active', delta: 'SAP live', deltaType: 'neutral' }
    ],
    trend: [96, 97, 98, 99, 100, 100],
    recommendation: 'ECN #842 (composite bracket) released to production cells without stoppage.'
  },
  'traceability-genealogy': {
    agentId: 'traceability-genealogy',
    agentName: 'Product Traceability & Genealogy System',
    status: 'Normal',
    sectorId: 'quality-engineering',
    sectorName: 'Quality & Engineering',
    lastUpdated: '2m ago',
    mission: 'Complete 1D/2D DPM genealogy ledger linking raw material batch to finished serials.',
    kpis: [
      { label: 'Genealogy Depth', value: '100', unit: '%', delta: 'End-to-End', deltaType: 'up' },
      { label: 'Tracked Serials', value: '28,400', unit: 'units', delta: '+1.2k', deltaType: 'up' },
      { label: 'Audit Retrieval', value: '120', unit: 'ms', delta: '-40ms', deltaType: 'up' },
      { label: 'Batch Integrity', value: 'Zero Gap', unit: 'status', delta: 'Verified', deltaType: 'up' }
    ],
    trend: [99.2, 99.5, 99.8, 99.9, 100, 100],
    recommendation: 'Automotive compliance audit export generated in 1.4 seconds.'
  },

  // --- Supply Chain & Customers ---
  'inventory-buffer': {
    agentId: 'inventory-buffer',
    agentName: 'Inventory Optimization & Buffer System',
    status: 'Normal',
    sectorId: 'supply-chain-customers',
    sectorName: 'Supply Chain & Customers',
    lastUpdated: 'Just now',
    mission: 'Dynamic buffer sizing, slow-moving part liquidation, and safety stock balancing.',
    kpis: [
      { label: 'Buffer Health', value: '97.2', unit: '%', delta: '+1.4%', deltaType: 'up' },
      { label: 'Days Stock Cover', value: '14.2', unit: 'days', delta: '-2.1d', deltaType: 'up' },
      { label: 'Capital Freed', value: '₹1.20', unit: 'Cr', delta: '+₹15L', deltaType: 'up' },
      { label: 'Stockout Risk', value: '0', unit: 'SKUs', delta: '-3', deltaType: 'up' }
    ],
    trend: [88, 90, 92, 94, 95.5, 97.2],
    recommendation: 'Alloy stock buffer safely adjusted from 21 days to 14.2 days.'
  },
  'supplier-risk': {
    agentId: 'supplier-risk',
    agentName: 'Supplier Performance & Risk System',
    status: 'Warning',
    sectorId: 'supply-chain-customers',
    sectorName: 'Supply Chain & Customers',
    lastUpdated: '3m ago',
    mission: 'Tier-1 & Tier-2 vendor risk matrix, lead-time variance, and financial health scorecards.',
    kpis: [
      { label: 'Vendor Scorecard', value: '92.4', unit: '%', delta: '-1.1%', deltaType: 'down' },
      { label: 'Suppliers Monitored', value: '86', unit: 'active', delta: '+4', deltaType: 'neutral' },
      { label: 'At-Risk Vendors', value: '2', unit: 'Tier-2', delta: '+1', deltaType: 'down' },
      { label: 'Lead Time Drift', value: '+1.8', unit: 'days', delta: 'Port delay', deltaType: 'down' }
    ],
    trend: [96, 95, 94, 93, 93.5, 92.4],
    recommendation: 'Secondary fastener supplier triggered for shipment expediting.'
  },
  'sourcing-rfq': {
    agentId: 'sourcing-rfq',
    agentName: 'Automated Sourcing & RFQ System',
    status: 'Normal',
    sectorId: 'supply-chain-customers',
    sectorName: 'Supply Chain & Customers',
    lastUpdated: '5m ago',
    mission: 'AI-assisted RFQ bid leveling, quote extraction, and should-cost calculation.',
    kpis: [
      { label: 'Auto RFQ Processing', value: '94.8', unit: '%', delta: '+6.2%', deltaType: 'up' },
      { label: 'Purchase Savings', value: '8.4', unit: '%', delta: '+1.2%', deltaType: 'up' },
      { label: 'Active Quotes', value: '38', unit: 'rfqs', delta: '+9', deltaType: 'neutral' },
      { label: 'Cycle Time', value: '1.8', unit: 'days', delta: '-2.4d', deltaType: 'up' }
    ],
    trend: [82, 85, 88, 91, 93, 94.8],
    recommendation: '3 competitive quotes leveled for Q3 sheet metal supply contract.'
  },
  'logistics-dispatch': {
    agentId: 'logistics-dispatch',
    agentName: 'Logistics & Dispatch Tracking System',
    status: 'Normal',
    sectorId: 'supply-chain-customers',
    sectorName: 'Supply Chain & Customers',
    lastUpdated: '1m ago',
    mission: 'GPS freight telematics, dock turnaround optimization, and dispatch ETA routing.',
    kpis: [
      { label: 'OTIF Dispatch', value: '97.8', unit: '%', delta: '+1.5%', deltaType: 'up' },
      { label: 'Fleet in Transit', value: '24', unit: 'trucks', delta: 'Active', deltaType: 'neutral' },
      { label: 'Dock Turnaround', value: '42', unit: 'mins', delta: '-8 min', deltaType: 'up' },
      { label: 'Route Deviation', value: '0.2', unit: '%', delta: '-0.1%', deltaType: 'up' }
    ],
    trend: [94, 95, 96, 96.5, 97.2, 97.8],
    recommendation: 'Dock #2 unloading complete; fleet turnaround running 18% faster.'
  },
  'order-fulfillment': {
    agentId: 'order-fulfillment',
    agentName: 'Customer Order Fulfillment System',
    status: 'Normal',
    sectorId: 'supply-chain-customers',
    sectorName: 'Supply Chain & Customers',
    lastUpdated: 'Just now',
    mission: 'End-to-end customer order SLA tracking, allocation rules, and dispatch promise dates.',
    kpis: [
      { label: 'Fulfillment Rate', value: '99.2', unit: '%', delta: '+0.8%', deltaType: 'up' },
      { label: 'Backorder Count', value: '0', unit: 'orders', delta: '-2', deltaType: 'up' },
      { label: 'Avg Lead Time', value: '2.4', unit: 'days', delta: '-0.4d', deltaType: 'up' },
      { label: 'Customer NPS', value: '78', unit: 'score', delta: '+4', deltaType: 'up' }
    ],
    trend: [96, 97, 98, 98.4, 99.0, 99.2],
    recommendation: '100% of OEM priority shipments on schedule for tomorrow delivery.'
  },

  // --- People & Safety ---
  'ehs-safety': {
    agentId: 'ehs-safety',
    agentName: 'EHS & Plant Safety Management System',
    status: 'Normal',
    sectorId: 'people-safety',
    sectorName: 'People & Safety',
    lastUpdated: 'Just now',
    mission: 'Computer vision PPE compliance, safety zone breaches, and near-miss logging.',
    kpis: [
      { label: 'Incident-Free Days', value: '418', unit: 'days', delta: '+1 day', deltaType: 'up' },
      { label: 'PPE Compliance', value: '99.6', unit: '%', delta: '+0.2%', deltaType: 'up' },
      { label: 'Safety Audits', value: '100', unit: '%', delta: 'Completed', deltaType: 'up' },
      { label: 'Near Miss Log', value: '0', unit: 'active', delta: '-1', deltaType: 'up' }
    ],
    trend: [98.5, 99.0, 99.2, 99.4, 99.5, 99.6],
    recommendation: 'Thermal & helmet detection active across all 4 production bays.'
  },
  'workforce-skills': {
    agentId: 'workforce-skills',
    agentName: 'Workforce Allocation & Skills System',
    status: 'Normal',
    sectorId: 'people-safety',
    sectorName: 'People & Safety',
    lastUpdated: '4m ago',
    mission: 'Dynamic operator-to-station skill matrix, shift rosters, and cross-training audits.',
    kpis: [
      { label: 'Station Coverage', value: '98.5', unit: '%', delta: '+1.2%', deltaType: 'up' },
      { label: 'Skill Matrix Score', value: '94.2', unit: '%', delta: '+2.0%', deltaType: 'up' },
      { label: 'Present Operators', value: '184', unit: 'staff', delta: 'Shift A', deltaType: 'neutral' },
      { label: 'Overtime Ratio', value: '3.1', unit: '%', delta: '-1.4%', deltaType: 'up' }
    ],
    trend: [92, 93, 95, 96, 97, 98.5],
    recommendation: 'Certified Level-3 robotic welding operators verified on Line 1.'
  },

  // --- Finance & Leadership ---
  'unit-cost': {
    agentId: 'unit-cost',
    agentName: 'Manufacturing Unit Cost System',
    status: 'Normal',
    sectorId: 'finance-leadership',
    sectorName: 'Finance & Leadership',
    lastUpdated: 'Just now',
    mission: 'Real-time landed unit cost tracking (BOM raw materials + direct labor + machine power + overheads).',
    kpis: [
      { label: 'Unit Cost', value: '₹142.50', unit: '/part', delta: '-₹4.20', deltaType: 'up' },
      { label: 'Material Ratio', value: '64.2', unit: '%', delta: '-1.1%', deltaType: 'up' },
      { label: 'Labor Cost', value: '16.5', unit: '%', delta: '-0.8%', deltaType: 'up' },
      { label: 'Energy & Overhead', value: '19.3', unit: '%', delta: '-0.3%', deltaType: 'up' }
    ],
    trend: [152, 149, 147, 145, 144, 142.5],
    recommendation: 'Scrap reduction and off-peak tariff savings decreased unit cost by 2.8% this week.'
  },
  'exec-decision': {
    agentId: 'exec-decision',
    agentName: 'Executive Operations Command Center',
    status: 'Normal',
    sectorId: 'finance-leadership',
    sectorName: 'Finance & Leadership',
    lastUpdated: 'Live',
    mission: 'Consolidated multi-plant executive intelligence, cross-agent orchestration, and autonomous governance.',
    kpis: [
      { label: 'OEE Gain', value: '+12.0', unit: '%', delta: 'vs Baseline', deltaType: 'up' },
      { label: 'Quality Boost', value: '+8.0', unit: '%', delta: 'FPY Uplift', deltaType: 'up' },
      { label: 'Cost Savings', value: '₹14.8', unit: 'Lakh MTD', delta: '+16%', deltaType: 'up' },
      { label: 'Plants Synced', value: '6', unit: 'facilities', delta: '100% Online', deltaType: 'up' }
    ],
    trend: [86, 88, 91, 93, 95, 98],
    recommendation: 'Autonomous closed-loop orchestration active across all 19 functional agents.'
  }
};

/**
 * Async API simulation service for agent metrics
 * Allows transparent migration to backend API in the future
 */
export async function getAgentMetrics(agentId) {
  // Simulate rapid micro-network delay (50ms)
  await new Promise((resolve) => setTimeout(resolve, 50));
  
  if (AGENT_METRICS_DB[agentId]) {
    return { success: true, data: AGENT_METRICS_DB[agentId] };
  }

  // Graceful fallback if unknown ID requested
  return {
    success: true,
    data: {
      agentId,
      agentName: 'Autonomous Agent System',
      status: 'Normal',
      sectorId: 'production-planning',
      sectorName: 'Operations',
      lastUpdated: 'Live',
      mission: 'Autonomous operations telemetry and real-time process monitoring.',
      kpis: [
        { label: 'System Health', value: '99.5', unit: '%', delta: '+0.2%', deltaType: 'up' },
        { label: 'Telemetry Rate', value: '1.2', unit: 'kHz', delta: 'Nominal', deltaType: 'up' },
        { label: 'Throughput', value: '100', unit: '%', delta: 'Optimal', deltaType: 'up' }
      ],
      trend: [92, 94, 96, 97, 98, 99.5],
      recommendation: 'System running within optimal operating parameters.'
    }
  };
}
