import React, { useState } from 'react';
import AgentInPageDashboard from '../components/AgentInPageDashboard';
import {
  Users,
  Factory,
  Wrench,
  ShieldCheck,
  Truck,
  DollarSign,
  Play,
  Pause,
  ChevronRight,
  ArrowLeft,
  Shield,
  Award,
  Layers,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

// 6 SEGREGATED SECTORS WITH COMPLETE TREE HIERARCHY
const SECTOR_ECOSYSTEM = [
  {
    id: 'employees',
    name: 'Employees',
    shortName: 'Employees',
    fullName: 'Employees (Workforce & EHS)',
    color: '#e11d48', // Crimson Rose
    bgSoft: 'rgba(225, 29, 72, 0.08)',
    borderColor: 'rgba(225, 29, 72, 0.3)',
    icon: Users,
    description: 'Human capital allocation, operator skill matrices, zero-incident safety & permit compliance',
    systemCount: 2,
    systems: [
      {
        id: 14,
        systemNumber: 14,
        name: 'EHS & Workplace Safety System',
        code: 'EHS_SAFETY',
        table: 'fact_ehs_event',
        tagline: 'Zero-incident safety culture, permit compliance & hazard pre-emption',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Shield,
        kpiHighlight: '428 Days Zero LTI • 100% LOTO Pass',
        metrics: [
          { label: 'Safety Record', value: '428 Days', sub: 'Zero Lost-Time Injury (LTI)' },
          { label: 'Open Hazards', value: '0 Open', sub: '100% Rapid Resolution' },
          { label: 'Permit Compliance', value: '100%', sub: 'Digital LOTO Verified' },
          { label: 'Audit Score', value: '99.4%', sub: 'ISO-45001 Compliant' }
        ],
        leaves: [
          {
            title: 'Zero LTI Tracking',
            metric: '428 Days LTI-Free',
            desc: '428 consecutive days without lost-time injury across all 6 multi-state manufacturing facilities.'
          },
          {
            title: 'Digital Permit-to-Work',
            metric: '100% LOTO Verified',
            desc: 'Mandatory automated verification for high-voltage, confined-space and hazardous hot-work permits.'
          },
          {
            title: 'Real-Time Hazard Reporting',
            metric: '0 Open Hazards',
            desc: 'Near-miss reporting system with automated escalation and 2-hour root-cause corrective closure.'
          },
          {
            title: 'Regulatory & EHS Compliance',
            metric: 'ISO-45001 Certified',
            desc: 'Continuous compliance tracking under ISO-45001 and OSHA with one-click export for corporate audits.'
          }
        ],
        owner: 'Workplace Safety Lead 14'
      },
      {
        id: 15,
        systemNumber: 15,
        name: 'Workforce Allocation & Skill Matrix System',
        code: 'WORKFORCE_SKILL',
        table: 'fact_workforce_attendance',
        tagline: 'Match line skill requirements with operator certifications in real time',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Award,
        kpiHighlight: '98.4% Staffing • 100% Certified Stations',
        metrics: [
          { label: 'Staffing Attainment', value: '98.4%', sub: '1,310 / 1,335 Workers on Shift' },
          { label: 'Critical Coverage', value: '100%', sub: '0 Uncertified Stations' },
          { label: 'Cross-Trained Techs', value: '128 Techs', sub: 'Trained on 2+ Critical Machines' },
          { label: 'Skill Gap Remediation', value: '<15 min', sub: 'Rapid Reserve Redeployment' }
        ],
        leaves: [
          {
            title: 'Shift Manpower Scheduling',
            metric: '98.4% Shift Staffing',
            desc: 'Dynamic shift allocation (Shift 1: 100%, Shift 2: 97.8%, Shift 3: 96.2%) across all active lines.'
          },
          {
            title: 'Certified Skill Matrix Balancing',
            metric: '100% Station Certified',
            desc: 'Ensures certified operators are stationed on robotic welding, high-tonnage stamping & precision CNCs.'
          },
          {
            title: 'Absence & Shortage Mitigation',
            metric: '<15 min Gap Fill',
            desc: 'Automated skill leveling system pulls qualified cross-trained technicians to fill gaps within 15 minutes.'
          },
          {
            title: 'Operator Training & Competency',
            metric: 'Weekly Matrix Sync',
            desc: 'Multi-skill matrices updated weekly based on station performance, scrap trends and certified training hours.'
          }
        ],
        owner: 'Human Capital & Staffing Lead 15'
      }
    ]
  },
  {
    id: 'production',
    name: 'Production & Planning',
    shortName: 'Production',
    fullName: 'Production & Planning Systems',
    color: '#6f3dba', // Brand Purple
    bgSoft: 'rgba(111, 61, 186, 0.08)',
    borderColor: 'rgba(111, 61, 186, 0.3)',
    icon: Factory,
    description: 'Demand forecasting, finite scheduling, live takt tracking & 3D digital plant twin simulation',
    systemCount: 4,
    systems: [
      {
        id: 1,
        systemNumber: 1,
        name: 'Production Planning System',
        code: 'PROD_PLANNING',
        table: 'fact_production_order',
        tagline: 'Finite-capacity schedule synchronization across shifts & plant lines',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Factory,
        kpiHighlight: '98.2% Plan Adherence',
        metrics: [
          { label: 'Plan Adherence', value: '98.2%', sub: 'Target: 95.0%' },
          { label: 'Schedule Attainment', value: '95.4%', sub: 'Finite Capacity' }
        ],
        leaves: [
          { title: 'Finite Capacity Scheduling', metric: '98.2% Adherence', desc: 'Synchronizes confirmed order backlog, die changeovers and work-center capacity.' },
          { title: 'Material Call-Off Synchronization', metric: '100% In Buffer', desc: 'Locks assembly schedules only after verifying required BOM stock is in plant buffer.' }
        ],
        owner: 'Operations Planning Lead 01'
      },
      {
        id: 2,
        systemNumber: 2,
        name: 'Production Monitoring System',
        code: 'PROD_MONITORING',
        table: 'fact_hourly_production',
        tagline: 'Live shop floor telemetry & micro-stop detection',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Factory,
        kpiHighlight: '11,280 Units • 94.0% Takt',
        metrics: [
          { label: 'Current Output', value: '11,280', sub: 'Target: 12,000 Units' },
          { label: 'Takt Efficiency', value: '94.0%', sub: '4 Micro-Stops Flagged' }
        ],
        leaves: [
          { title: 'Real-Time Takt Tracking', metric: 'Live Micro-Stops', desc: 'Catches line slowdowns under 3 minutes before cumulative shift throughput drops.' },
          { title: 'Multi-Plant Hourly Board', metric: '6 Plants Synced', desc: 'Live output by machine, line and shift across Tamil Nadu, Maharashtra and Gujarat.' }
        ],
        owner: 'Shop Floor Monitoring Lead 02'
      },
      {
        id: 3,
        systemNumber: 3,
        name: 'Equipment Effectiveness (OEE) System',
        code: 'OEE_PERF',
        table: 'mart_daily_line_shift_kpi',
        tagline: 'Availability, performance and quality loss Pareto decomposition',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Factory,
        kpiHighlight: '87.4% OEE (Target: 85%)',
        metrics: [
          { label: 'Overall OEE', value: '87.4%', sub: 'Benchmark: 85%' },
          { label: 'Availability', value: '92.1%', sub: 'Quality: 96.2%' }
        ],
        leaves: [
          { title: 'Equipment Loss Decomposition', metric: 'Pareto Analysis', desc: 'Pinpoints losses into setup times, minor stops, and chronic derated speed runs.' },
          { title: 'Speed Optimization', metric: '+3.2% Speed Gain', desc: 'Recommends optimal cycle rates on stamping presses and CNC milling centers.' }
        ],
        owner: 'OEE Optimization Lead 03'
      },
      {
        id: 19,
        systemNumber: 19,
        name: 'Digital Plant Twin & Simulation',
        code: 'DIGITAL_TWIN',
        table: 'fact_digital_twin_scenario',
        tagline: 'Physics-based virtual factory twin & scenario simulation',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Factory,
        kpiHighlight: '12 Active Twins • 97.4% Sync',
        metrics: [
          { label: 'Simulation Accuracy', value: '97.4%', sub: 'Lag: <400ms' },
          { label: 'Active Twins', value: '12 Lines', sub: 'Virtual Factory' }
        ],
        leaves: [
          { title: 'Virtual Bottleneck Simulation', metric: 'Buffer Sizing', desc: 'Simulates buffer sizing and layout rebalancing prior to physical line retooling.' },
          { title: 'What-If Shift Modeling', metric: 'Output Forecast', desc: 'Forecasts plant output under variable manpower attendance and supplier delays.' }
        ],
        owner: 'Simulation Lead 19'
      }
    ]
  },
  {
    id: 'maintenance',
    name: 'Maintenance & Utilities',
    shortName: 'Maintenance',
    fullName: 'Maintenance & Utilities Systems',
    color: '#0284c7', // Sky Blue
    bgSoft: 'rgba(2, 132, 199, 0.08)',
    borderColor: 'rgba(2, 132, 199, 0.3)',
    icon: Wrench,
    description: 'Vibration predictive maintenance, energy tariff management & utility balancing',
    systemCount: 3,
    systems: [
      {
        id: 4,
        systemNumber: 4,
        name: 'Predictive Equipment Maintenance',
        code: 'PRED_MAINT',
        table: 'fact_machine_telemetry_hourly',
        tagline: 'Vibration anomaly detection and remaining useful life estimation',
        status: 'Attention',
        statusColor: '#d97706',
        icon: Wrench,
        kpiHighlight: '120h RUL • $180k Loss Avoided',
        metrics: [
          { label: 'Spindle RUL', value: '120 Hours', sub: 'Sanand Unit 07' },
          { label: 'Prevented Loss', value: '$180,000', sub: 'Emergency Avoided' }
        ],
        leaves: [
          { title: 'Spindle Bearing Anomaly', metric: '120h Remaining', desc: 'Flagged 120-hour RUL warning on Sanand Unit 07 CNC spindle bearing.' },
          { title: 'Planned Lubrication Window', metric: 'Low-Tariff Slot', desc: 'Schedules low-tariff shutdown window this Saturday preventing seizure.' }
        ],
        owner: 'Reliability Engineering Lead 04'
      },
      {
        id: 13,
        systemNumber: 13,
        name: 'Industrial Energy Management',
        code: 'ENERGY_MGMT',
        table: 'fact_energy_meter_hourly',
        tagline: 'Peak tariff shaving, compressor sequencing and kWh/unit tracking',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Wrench,
        kpiHighlight: '₹4.88 / Unit (-8.5%)',
        metrics: [
          { label: 'Energy Cost / Unit', value: '₹4.88', sub: '-8.5% Cost Reduction' },
          { label: 'Peak Avoidance', value: '92.4%', sub: 'Pre-Cooling Chiller' }
        ],
        leaves: [
          { title: 'Peak Tariff Load Shaving', metric: 'Pre-Cooled Wells', desc: 'Staggers heavy compressor runs during peak utility tariff periods.' },
          { title: 'Unit Energy Intensity', metric: 'kWh/Part Monitored', desc: 'Continuously measures kWh consumed per finished unit across all stamping presses.' }
        ],
        owner: 'Energy Management Lead 13'
      },
      {
        id: 17,
        systemNumber: 17,
        name: 'Water & Compressed Air Utilities',
        code: 'UTILITIES_AIR',
        table: 'fact_utility_telemetry_hourly',
        tagline: 'Compressed air pressure balancing, leak detection and zero liquid discharge',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Wrench,
        kpiHighlight: '6.8 Bar • 98.5% Water Recycled',
        metrics: [
          { label: 'Air Pressure', value: '6.8 Bar', sub: 'Stable Header' },
          { label: 'Water Recycled', value: '98.5%', sub: 'ZLD Certified' }
        ],
        leaves: [
          { title: 'Acoustic Air Leak Detection', metric: 'Zero Pressure Drop', desc: 'Identifies micro-fissures in air headers to prevent unneeded compressor cycling.' },
          { title: 'Closed-Loop Rinse Recycling', metric: '98.5% Recirculated', desc: 'Purifies and returns 98.5% of process rinse water to automated plating lines.' }
        ],
        owner: 'Plant Utilities Lead 17'
      }
    ]
  },
  {
    id: 'quality',
    name: 'Quality & Engineering',
    shortName: 'Quality',
    fullName: 'Quality & Engineering Systems',
    color: '#059669', // Emerald Green
    bgSoft: 'rgba(5, 150, 105, 0.08)',
    borderColor: 'rgba(5, 150, 105, 0.3)',
    icon: ShieldCheck,
    description: 'High-speed automated optical inspection, scrap reduction, ECN cut-ins & genealogy',
    systemCount: 4,
    systems: [
      {
        id: 5,
        systemNumber: 5,
        name: 'Automated Optical Quality Inspection',
        code: 'QUALITY_AOI',
        table: 'fact_quality_inspection',
        tagline: 'High-speed inline vision inspection and first-pass yield protection',
        status: 'Optimal',
        statusColor: '#059669',
        icon: ShieldCheck,
        kpiHighlight: '98.2% FPY • 120 Parts/min',
        metrics: [
          { label: 'First-Pass Yield', value: '98.2%', sub: 'Precision Automotive' },
          { label: 'Daily Scrap Cost', value: '₹1.4L', sub: '-18% vs Baseline' }
        ],
        leaves: [
          { title: 'Inline Vision Classification', metric: '120 Parts / Min', desc: 'Sub-millimeter weld porosity and surface defect detection at high line speeds.' },
          { title: 'First-Pass Yield Safeguard', metric: '98.2% FPY', desc: 'Preserves 98.2% FPY across precision chassis brackets and stamping assemblies.' }
        ],
        owner: 'Quality Engineering Lead 05'
      },
      {
        id: 6,
        systemNumber: 6,
        name: 'Scrap & Rework Containment',
        code: 'SCRAP_REWORK',
        table: 'fact_vision_inspection',
        tagline: 'Defect cause Pareto analysis and immediate station interlock',
        status: 'Optimal',
        statusColor: '#059669',
        icon: ShieldCheck,
        kpiHighlight: '1.8% Scrap • 42 min Rework',
        metrics: [
          { label: 'Scrap Rate', value: '1.8%', sub: 'Target: <2.2%' },
          { label: 'Rework Turnaround', value: '42 min', sub: 'Containment Time' }
        ],
        leaves: [
          { title: 'Automated Station Interlock', metric: '3-Part Limit', desc: 'Pauses feeder stations if 3 consecutive parts exceed dimensional tolerance limits.' },
          { title: 'Quarantine Routing', metric: 'Automated Routing', desc: 'Digitally tags and segregates suspected non-conformance lots to dedicated rework cells.' }
        ],
        owner: 'Continuous Improvement Lead 06'
      },
      {
        id: 7,
        systemNumber: 7,
        name: 'Engineering Change & BOM (ECN)',
        code: 'ENG_CHANGE',
        table: 'fact_engineering_change',
        tagline: 'Revision cut-in coordination, tooling qualification and zero scrap write-off',
        status: 'Optimal',
        statusColor: '#059669',
        icon: ShieldCheck,
        kpiHighlight: 'Tooling Ready • ₹0 Scrap Cut-In',
        metrics: [
          { label: 'ECN Cut-In Status', value: 'Tooling OK', sub: 'Rev C EV Tray Bracket' },
          { label: 'Scrap Write-Off', value: '₹0 Scrap', sub: '100% Design Compliant' }
        ],
        leaves: [
          { title: 'Revision Cut-In Coordination', metric: 'Shift 1 Release', desc: 'Authorizes Rev C cut-in starting Monday Shift 1 with all Tier 1 suppliers confirmed.' },
          { title: 'Tooling Qualification Sync', metric: 'Dies Verified', desc: 'Verifies die measurements and CNC tool offsets before full batch release.' }
        ],
        owner: 'Product Engineering Lead 07'
      },
      {
        id: 8,
        systemNumber: 8,
        name: 'Genealogy & Product Traceability',
        code: 'TRACEABILITY',
        table: 'fact_product_genealogy_event',
        tagline: 'Full unit serialization, component lot genealogy and recall containment',
        status: 'Optimal',
        statusColor: '#059669',
        icon: ShieldCheck,
        kpiHighlight: '100% Traceability • 0% Recall Risk',
        metrics: [
          { label: 'Traceability Depth', value: '100%', sub: 'Unit Serialization' },
          { label: 'Recall Defense', value: '0% Exposure', sub: 'Precision Batch Search' }
        ],
        leaves: [
          { title: 'Unit-Level Laser Serialization', metric: '2D Laser Barcode', desc: 'Permanently links 2D laser codes with steel heat lot, press force and operator id.' },
          { title: 'Bi-Directional Genealogy Audit', metric: 'VIN Lot Search', desc: 'Instantly identifies all manufactured vehicles associated with a flagged fastener lot.' }
        ],
        owner: 'Compliance & Traceability Lead 08'
      }
    ]
  },
  {
    id: 'supplychain',
    name: 'Supply Chain & Logistics',
    shortName: 'Supply Chain',
    fullName: 'Supply Chain & Customer Logistics',
    color: '#d97706', // Warm Amber
    bgSoft: 'rgba(217, 119, 6, 0.08)',
    borderColor: 'rgba(217, 119, 6, 0.3)',
    icon: Truck,
    description: 'Dynamic inventory buffers, supplier ratings, automated RFQ, freight tracking & order fulfillment',
    systemCount: 5,
    systems: [
      {
        id: 9,
        systemNumber: 9,
        name: 'Dynamic Inventory Optimization',
        code: 'INVENTORY_OPT',
        table: 'fact_inventory_daily_snapshot',
        tagline: 'Buffer sizing, lead time volatility absorption and stockout pre-emption',
        status: 'Attention',
        statusColor: '#d97706',
        icon: Truck,
        kpiHighlight: '1.8 Days Buffer Alert (Pune)',
        metrics: [
          { label: 'SS-304 Buffer', value: '1.8 Days', sub: 'Pune Plant Line 01' },
          { label: 'Protected Orders', value: '₹24.8 Cr', sub: 'Expedited RFQ' }
        ],
        leaves: [
          { title: 'Stockout Pre-Emption', metric: '1.8 Days Buffer', desc: 'Identified 1.8-day buffer threat for SS-304 coils; generated automated RFQ to JSW Steel.' },
          { title: 'Safety Stock Recalibration', metric: 'Dynamic Recalibration', desc: 'Adjusts min/max inventory buffers weekly based on supplier transit variances.' }
        ],
        owner: 'Materials Management Lead 09'
      },
      {
        id: 10,
        systemNumber: 10,
        name: 'Supplier Quality & Risk Scorecard',
        code: 'SUPPLIER_RISK',
        table: 'fact_purchase_order_receipt',
        tagline: 'Real-time vendor OTIF, PPM quality rating and risk tiers',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Truck,
        kpiHighlight: '98.2% Avg OTIF • 48 Vendors',
        metrics: [
          { label: 'Average OTIF', value: '98.2%', sub: '48 Tier-1 Suppliers' },
          { label: 'Best Supplier', value: 'JSW Steel', sub: 'Grade A+ • 98.4%' }
        ],
        leaves: [
          { title: 'Vendor Scorecard Index', metric: 'Grade A+ JSW Steel', desc: 'Rates suppliers on delivery punctuality, defect PPM and packaging compliance.' },
          { title: 'At-Risk Supplier Mitigation', metric: 'Order Re-Routing', desc: 'Routes critical purchase volumes away from Grade C suppliers to protect plant schedules.' }
        ],
        owner: 'Vendor Quality Lead 10'
      },
      {
        id: 11,
        systemNumber: 11,
        name: 'Automated Sourcing & RFQ',
        code: 'AUTO_SOURCING',
        table: 'fact_rfq_quote',
        tagline: 'Automated multi-vendor quotation comparison and negotiation',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Truck,
        kpiHighlight: '₹2.5L Saved • -2 Lead Days',
        metrics: [
          { label: 'Cost Savings', value: '₹2.5L', sub: 'RFQ-204 Insert Award' },
          { label: 'Lead Time Cut', value: '-2 Days', sub: 'Faster Delivery' }
        ],
        leaves: [
          { title: 'Competitive RFQ Evaluation', metric: 'Awarded XYZ Ltd', desc: 'Automated award of stamping insert contract to XYZ Ltd at ₹95.5L cutting 2 lead days.' },
          { title: 'Commodity Index Benchmarking', metric: 'Spot Market Sync', desc: 'Tracks raw steel and copper spot market pricing to optimize purchase contract timing.' }
        ],
        owner: 'Procurement Operations Lead 11'
      },
      {
        id: 12,
        systemNumber: 12,
        name: 'Logistics, Fleet & Dispatch',
        code: 'LOGISTICS_FLEET',
        table: 'fact_shipment_milestone',
        tagline: 'Dedicated vehicle routing, cross-state freight and dock scheduling',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Truck,
        kpiHighlight: '99.1% On-Time • 24 Trucks',
        metrics: [
          { label: 'On-Time Dispatch', value: '99.1%', sub: '24 Dedicated Trucks' },
          { label: 'Dock Turnaround', value: '38 min', sub: 'Gate-in to Out' }
        ],
        leaves: [
          { title: 'Dedicated Express Dispatch', metric: 'Dedicated Freight', desc: 'Authorizes express container for 4,200 steering knuckles to Tata Motors, guaranteeing OTIF.' },
          { title: 'Dock Turnaround Management', metric: '38 min Turnaround', desc: 'Coordinates pre-notified carrier dock slots to prevent plant gate congestion.' }
        ],
        owner: 'Logistics Operations Lead 12'
      },
      {
        id: 18,
        systemNumber: 18,
        name: 'Customer Order Fulfillment (ATP)',
        code: 'ORDER_FULFILL',
        table: 'fact_customer_order',
        tagline: 'Available-to-Promise delivery dates and customer SLA protection',
        status: 'Optimal',
        statusColor: '#059669',
        icon: Truck,
        kpiHighlight: '98.0% Committed OTIF',
        metrics: [
          { label: 'Committed OTIF', value: '98.0%', sub: '284 Orders on Schedule' },
          { label: 'Penalty Defense', value: '₹5.2L Saved', sub: 'Mahindra Order ORD-8419' }
        ],
        leaves: [
          { title: 'Customer Order Delay Protection', metric: 'SLA Protected', desc: 'Rerouted buffer stock to mitigate minor line slowdown for Mahindra Auto.' },
          { title: 'Available-to-Promise (ATP)', metric: 'Real-Time Dates', desc: 'Provides real-time feasible delivery date commitments based on active capacity.' }
        ],
        owner: 'Customer Fulfillment Lead 18'
      }
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Governance',
    shortName: 'Finance',
    fullName: 'Finance & Cost Governance Systems',
    color: '#7c3aed', // Purple Violet
    bgSoft: 'rgba(124, 58, 237, 0.08)',
    borderColor: 'rgba(124, 58, 237, 0.3)',
    icon: DollarSign,
    description: 'Unit manufacturing cost control, variance accounting & loss-cost Pareto analysis',
    systemCount: 1,
    systems: [
      {
        id: 16,
        systemNumber: 16,
        name: 'Manufacturing Unit Cost Accounting',
        code: 'UNIT_COST',
        table: 'fact_manufacturing_cost',
        tagline: 'Material, direct labor and energy cost per finished part',
        status: 'Optimal',
        statusColor: '#059669',
        icon: DollarSign,
        kpiHighlight: '₹48.20 / Part (-6.2% vs Budget)',
        metrics: [
          { label: 'Cost Per Unit', value: '₹48.20', sub: 'Target: ₹51.40 (-6.2%)' },
          { label: 'Monthly Savings', value: '₹14.8 Lakhs', sub: 'Energy & Scrap' }
        ],
        leaves: [
          { title: 'Unit Manufacturing Cost Control', metric: '₹48.20 Actual', desc: 'Tracks ₹48.20 per unit manufacturing cost against ₹51.40 budgeted target across plants.' },
          { title: 'Loss-Cost Variance Decomposition', metric: 'Scrap & Tariffs', desc: 'Separates scrap expense (₹1.4L/day), changeover scrap and peak tariff penalties.' }
        ],
        owner: 'Plant Financial Controller 16'
      }
    ]
  }
];

export default function Agents({ onSelectAgent, initialAgentId = null }) {
  const [extractedSectorId, setExtractedSectorId] = useState(null);
  const [selectedSystemId, setSelectedSystemId] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('agent_id');
      if (p) {
        const num = parseInt(p, 10);
        return isNaN(num) ? p : num;
      }
      const saved = sessionStorage.getItem('selected_system_id');
      if (saved) {
        const num = parseInt(saved, 10);
        return isNaN(num) ? saved : num;
      }
    } catch (e) {}
    return initialAgentId;
  });
  const [isRotating, setIsRotating] = useState(true);
  const [hoveredSectorId, setHoveredSectorId] = useState(null);
  const [activeLeafDetail, setActiveLeafDetail] = useState(null);

  // Sync selectedSystemId with URL search params and sessionStorage
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (selectedSystemId) {
        sessionStorage.setItem('selected_system_id', String(selectedSystemId));
        url.searchParams.set('agent_id', String(selectedSystemId));
      } else {
        sessionStorage.removeItem('selected_system_id');
        url.searchParams.delete('agent_id');
      }
      window.history.replaceState(null, '', url.toString());
    } catch (e) {}
  }, [selectedSystemId]);

  // Active extracted sector data
  const extractedSector = SECTOR_ECOSYSTEM.find((s) => s.id === extractedSectorId) || null;

  // Active selected system data (for in-page full dashboard view)
  const selectedSystem = extractedSector?.systems?.find((s) => s.id === selectedSystemId)
    || SECTOR_ECOSYSTEM.flatMap((s) => s.systems).find((sys) => sys.id === selectedSystemId)
    || null;

  // Active sector auto-synced
  const activeSector = extractedSector || (selectedSystem ? SECTOR_ECOSYSTEM.find((s) => s.systems.some((sys) => sys.id === selectedSystem.id)) : null);

  // Hovered sector
  const hoveredSector = SECTOR_ECOSYSTEM.find((s) => s.id === hoveredSectorId) || null;

  // Handle clicking on a sector node (extracts tree structure)
  const handleSelectSector = (sectorId) => {
    setActiveLeafDetail(null);
    setSelectedSystemId(null);
    if (extractedSectorId === sectorId) {
      setExtractedSectorId(null);
    } else {
      setExtractedSectorId(sectorId);
    }
  };

  // Coordinates for the 6 nodes in the orbit (Radius = 150px, center = 360, 240)
  // Guaranteed ~45px clearance from ALL 4 edges: ZERO node cutoff!
  const cx = 360;
  const cy = 240;
  const radius = 150;

  const nodePositions = SECTOR_ECOSYSTEM.map((sector, idx) => {
    const angleInDeg = idx * 60 - 90; // Start at top (-90 deg)
    const angleInRad = (angleInDeg * Math.PI) / 180;
    const x = cx + radius * Math.cos(angleInRad);
    const y = cy + radius * Math.sin(angleInRad);
    return {
      ...sector,
      x,
      y,
      angleInDeg
    };
  });

  // FULL SCREEN IN-PAGE VIEW WHEN AN AGENT IS SELECTED
  if (selectedSystem) {
    const isAgent18 = selectedSystem.id === 18 || selectedSystem.code === 'CUSTOMER_ORDER' || selectedSystem.code === 'ORDER_FULFILL';
    const isAgent16 = selectedSystem.id === 16 || selectedSystem.code === 'MFG_COST' || selectedSystem.systemNumber === 16;
    const isAgent19 = selectedSystem.id === 19 || selectedSystem.code === 'DIGITAL_TWIN' || selectedSystem.id === 'digital-plant-twin' || selectedSystem.systemNumber === 19;
    const isAgent3 = selectedSystem.id === 3 || selectedSystem.code === 'OEE_PERF' || selectedSystem.id === 'oee' || selectedSystem.systemNumber === 3;
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgb(var(--surface-rgb))',
          overflow: 'hidden',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          color: '#000000',
          boxSizing: 'border-box'
        }}
      >
        {/* SINGLE CLEAN TOP BAR WITH ONLY ONE BACK BUTTON */}
        <div
          style={{
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            background: 'rgb(var(--surface-rgb))',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.03)',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
        >
          {/* THE ONLY ONE BACK BUTTON */}
          <button
            onClick={() => {
              setSelectedSystemId(null);
              setExtractedSectorId(null);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '7px',
              border: '1px solid rgba(0,0,0,0.14)',
              background: 'rgb(var(--surface-rgb))',
              color: '#000000',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'var(--muted-fill)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgb(var(--surface-rgb))')}
          >
            <ArrowLeft size={15} /> Back to Operations Fleet
          </button>

          {/* SYSTEM INFO BADGE (CLEAN & NON-WRAPPING) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '5px',
                background: activeSector?.color || '#4f46e5',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800
              }}
            >
              #{selectedSystem.systemNumber}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#000000' }}>
              {selectedSystem.name}
            </span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#94a3b8' }} />
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#047857'
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981'
                }}
              />
              Live Telemetry
            </span>
          </div>
        </div>

        {/* FULL SCREEN CONTENT VIEWPORT (100% REMAINING HEIGHT) */}
        <div style={{ flex: 1, minHeight: 0, width: '100%', position: 'relative', overflow: 'hidden' }}>
          {isAgent18 ? (
            <iframe
              id="customer-order-full-frame"
              src="https://customer-order-management-two.vercel.app/monitoring"
              title="Customer Order Management Agent"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
            />
          ) : isAgent3 ? (
            <iframe
              id="oee-performance-full-frame"
              src="https://oee-performance-agent.vercel.app/"
              title="Equipment Effectiveness (OEE) Performance Agent"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
            />
          ) : isAgent19 ? (
            <iframe
              id="digital-plant-twin-full-frame"
              src="https://digital-twin-frontend-c0ji.onrender.com/"
              title="Digital Plant Twin Simulation"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
            />
          ) : isAgent16 ? (
            <iframe
              id="manufacturing-cost-full-frame"
              src="https://mfc-agent-frontend.vercel.app/home"
              title="Manufacturing Unit Cost System"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
              <AgentInPageDashboard
                system={selectedSystem}
                sector={activeSector}
                isFullScreenOnly={true}
                onBackToSector={() => setSelectedSystemId(null)}
                onBackToOrbit={() => {
                  setSelectedSystemId(null);
                  setExtractedSectorId(null);
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 72px)',
        maxHeight: 'calc(100vh - 72px)',
        overflow: 'hidden',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#000000',
        padding: '14px 20px',
        gap: '10px',
        boxSizing: 'border-box',
        background: 'var(--page-bg)'
      }}
    >
      {/* KEYFRAME ANIMATIONS FOR THE ORBITING MESH */}
      <style>{`
        @keyframes orbit-rotation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter-rotation {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes pulse-halo {
          0% { transform: scale(0.96); opacity: 0.5; }
          50% { transform: scale(1.08); opacity: 0.9; }
          100% { transform: scale(0.96); opacity: 0.5; }
        }
        .orbit-track {
          animation: orbit-rotation 52s linear infinite;
          transform-origin: ${cx}px ${cy}px;
        }
        .orbit-node-content {
          animation: counter-rotation 52s linear infinite;
          transform-origin: center center;
        }
        .orbit-track.paused, .orbit-track.paused .orbit-node-content {
          animation-play-state: paused !important;
        }
        .picture-node:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.08) !important;
        }
      `}</style>

      {/* 1. TOP HEADER & INTERACTIVE NAVIGATION STRIP */}
      <div
        className="card"
        style={{
          padding: '12px 20px',
          background: 'rgb(var(--surface-rgb))',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.06)',
          flexShrink: 0
        }}
      >
        {/* Left: Title & Purpose */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(30, 27, 75, 0.25)'
            }}
          >
            <Layers size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#000000', margin: 0 }}>
                Operations Fleet Ecosystem
              </h2>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '99px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#047857'
                }}
              >
                ● 19 Operational Systems Active
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#111111', margin: '2px 0 0 0', fontWeight: 500 }}>
              {selectedSystem
                ? `In-Page System Dashboard: ${selectedSystem.name} • Live Neon DB Data & Ingestion`
                : extractedSector
                ? `Picture Structure Diagram: ${extractedSector.fullName} • Click any system to open its full dashboard`
                : 'Interactive Sector Mesh • Revolving 6-sector multi-plant command hub with live telemetry'}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {selectedSystem ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSelectedSystemId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.15)',
                  background: 'rgb(var(--surface-rgb))',
                  color: '#000000',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={13} /> Back to {activeSector?.shortName || 'Sector'} Tree
              </button>
              <button
                onClick={() => {
                  setSelectedSystemId(null);
                  setExtractedSectorId(null);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: 'transparent',
                  color: '#444444',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Full Orbit Mesh
              </button>
            </div>
          ) : extractedSector ? (
            <button
              onClick={() => setExtractedSectorId(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.15)',
                background: 'rgb(var(--surface-rgb))',
                color: '#000000',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              <ArrowLeft size={14} /> Return to Orbit Mesh
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                onChange={(e) => {
                  if (e.target.value) handleSelectSector(e.target.value);
                }}
                defaultValue=""
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  background: 'var(--muted-fill)',
                  color: '#000000',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <option value="" disabled>Jump to Sector...</option>
                {SECTOR_ECOSYSTEM.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name} ({sec.systemCount} Systems)
                  </option>
                ))}
              </select>

              {/* <button
                onClick={() => setIsRotating(!isRotating)}
                title={isRotating ? 'Pause orbit motion' : 'Resume orbit motion'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0,0,0,0.1)',
                  background: 'rgb(var(--surface-rgb))',
                  color: '#000000',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {isRotating ? <Pause size={13} /> : <Play size={13} />}
                {isRotating ? 'Pause Orbit' : 'Rotate Orbit'}
              </button> */}
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE VIEWPORT (SCROLLABLE & PROPERLY ALIGNED) */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          background: 'rgb(var(--surface-rgb))',
          borderRadius: '14px',
          boxShadow: '0 2px 14px rgba(0,0,0,0.03)',
          border: '1px solid rgba(0,0,0,0.06)',
          overflowX: selectedSystem ? 'hidden' : 'auto',
          overflowY: selectedSystem ? 'hidden' : 'auto',
          display: 'flex',
          position: 'relative'
        }}
      >
        {/* ============================================================ */}
        {/* VIEW 1: IN-PAGE FULL SYSTEM DASHBOARD (IF SELECTED)          */}
        {/* ============================================================ */}
        {selectedSystem && (
          <AgentInPageDashboard
            system={selectedSystem}
            sector={activeSector}
            onBackToSector={() => setSelectedSystemId(null)}
            onBackToOrbit={() => {
              setSelectedSystemId(null);
              setExtractedSectorId(null);
            }}
          />
        )}

        {/* ============================================================ */}
        {/* VIEW 2: FULL CIRCULAR ORBIT MESH (ZERO CUTOFF ON ANY NODE)   */}
        {/* ============================================================ */}
        {!selectedSystem && !extractedSector && (
          <div
            style={{
              width: '100%',
              height: '100%',
              minHeight: '490px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.03) 0%, transparent 70%)'
            }}
          >
            {/* Centered Orbit Canvas Stage (720px x 480px, cx=360, cy=240, r=150) */}
            <div
              style={{
                position: 'relative',
                width: `${cx * 2}px`,
                height: `${cy * 2}px`,
                flexShrink: 0
              }}
            >
              {/* SVG Orbit Ring and Connecting Rays */}
              <svg
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: `${cx * 2}px`,
                  height: `${cy * 2}px`,
                  overflow: 'visible',
                  pointerEvents: 'none'
                }}
                viewBox={`0 0 ${cx * 2} ${cy * 2}`}
              >
                {/* Outer Decorative Concentric Rings */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius + 30}
                  fill="none"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke="rgba(0,0,0,0.12)"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius - 35}
                  fill="none"
                  stroke="rgba(0,0,0,0.04)"
                  strokeWidth="1"
                />

                {/* Connecting Rays from Center Circle to Each Sector Node */}
                {nodePositions.map((node) => (
                  <g key={node.id}>
                    <line
                      x1={cx}
                      y1={cy}
                      x2={node.x}
                      y2={node.y}
                      stroke="rgba(0,0,0,0.15)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    {/* Subtle Pulse dot on connecting line */}
                    <circle
                      cx={(cx + node.x) / 2}
                      cy={(cy + node.y) / 2}
                      r="3"
                      fill={node.color}
                      opacity="0.8"
                    />
                  </g>
                ))}
              </svg>

              {/* 3. CENTRE CIRCLE (GIVEN NAME: "Operations Command Core") */}
              <div
                style={{
                  position: 'absolute',
                  left: `${cx}px`,
                  top: `${cy}px`,
                  transform: 'translate(-50%, -50%)',
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)',
                  boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.1), 0 10px 28px rgba(15, 23, 42, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '12px',
                  color: '#ffffff',
                  zIndex: 20,
                  userSelect: 'none'
                }}
              >
                {/* Central Glowing Pulse Ring */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '-5px',
                    borderRadius: '50%',
                    border: '2px solid rgba(129, 140, 248, 0.4)',
                    animation: 'pulse-halo 3s ease-in-out infinite'
                  }}
                />

                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '3px'
                  }}
                >
                  <Sparkles size={14} style={{ color: '#fbbf24' }} />
                </div>

                {/* Centre Circle Name */}
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    lineHeight: 1.15
                  }}
                >
                  Operations Command Core
                </div>

                <div
                  style={{
                    fontSize: '9px',
                    color: '#94a3b8',
                    marginTop: '2px',
                    fontWeight: 600
                  }}
                >
                  Universal Multi-Plant Hub
                </div>

                <div
                  style={{
                    marginTop: '5px',
                    padding: '2px 7px',
                    borderRadius: '99px',
                    background: 'rgba(255,255,255,0.12)',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#38bdf8'
                  }}
                >
                  6 Sector Mesh
                </div>
              </div>

              {/* 4. REVOLVING ORBITAL TRACK WITH 6 CONNECTED SECTOR NODES */}
              <div
                className={`orbit-track ${!isRotating ? 'paused' : ''}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: `${cx * 2}px`,
                  height: `${cy * 2}px`,
                  pointerEvents: 'none'
                }}
              >
                {nodePositions.map((node) => {
                  const IconComponent = node.icon;
                  const isHovered = hoveredSectorId === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => handleSelectSector(node.id)}
                      onMouseEnter={() => setHoveredSectorId(node.id)}
                      onMouseLeave={() => setHoveredSectorId(null)}
                      style={{
                        position: 'absolute',
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'auto',
                        cursor: 'pointer',
                        zIndex: 30
                      }}
                    >
                      {/* Counter-rotating wrapper to keep text & icon perfectly upright */}
                      <div
                        className="orbit-node-content"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',
                          width: '92px',
                          height: '92px',
                          borderRadius: '50%',
                          background: 'rgb(var(--surface-rgb))',
                          border: `2.5px solid ${node.color}`,
                          boxShadow: isHovered
                            ? `0 0 0 6px ${node.bgSoft}, 0 8px 22px rgba(0,0,0,0.16)`
                            : `0 4px 14px rgba(0,0,0,0.08)`,
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          padding: '6px',
                          boxSizing: 'border-box'
                        }}
                      >
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: node.bgSoft,
                            color: node.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '2px'
                          }}
                        >
                          <IconComponent size={14} />
                        </div>

                        <div
                          style={{
                            fontSize: '10.5px',
                            fontWeight: 800,
                            color: '#000000',
                            lineHeight: 1.15
                          }}
                        >
                          {node.shortName}
                        </div>

                        <div
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            color: node.color,
                            marginTop: '2px'
                          }}
                        >
                          {node.systemCount} Systems
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Helper Hint Banner */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                background: 'rgba(0,0,0,0.04)',
                padding: '5px 14px',
                borderRadius: '99px',
                fontSize: '11px',
                color: '#222222',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>💡 <strong>Click any node</strong> (e.g. <strong>Employees</strong> or <strong>Supply Chain</strong>) to see its visual picture structure branching into operational nodes.</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: PICTURE STRUCTURE DIAGRAM (MAIN CIRCLE ON LEFT, RELATED ON RIGHT) */}
        {/* ========================================================================= */}
        {!selectedSystem && extractedSector && (
          <div
            style={{
              width: '100%',
              minHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '16px 20px',
              boxSizing: 'border-box',
              gap: '14px'
            }}
          >
            {/* Top Navigation Strip */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                flexShrink: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setExtractedSectorId(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(0,0,0,0.15)',
                    background: 'rgb(var(--surface-rgb))',
                    color: '#000000',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
                  }}
                >
                  <ArrowLeft size={14} /> Return to Orbit Mesh
                </button>

                <div style={{ fontSize: '12.5px', color: '#111111', fontWeight: 600 }}>
                  Operations Command Core <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                  <strong style={{ color: extractedSector.color }}>{extractedSector.fullName}</strong>{' '}
                  <ChevronRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />{' '}
                  <span>Visual Picture Structure</span>
                </div>
              </div>

              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '99px',
                  background: extractedSector.bgSoft,
                  color: extractedSector.color,
                  border: `1px solid ${extractedSector.borderColor}`
                }}
              >
                ● {extractedSector.systemCount} Connected Operational Nodes
              </span>
            </div>

            {/* PICTURE STRUCTURE DIAGRAM STAGE: LEFT MAIN CIRCLE -> BRANCHES -> RIGHT NODES */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: '0px',
                position: 'relative',
                padding: '10px 0'
              }}
            >
              {/* ============================================================ */}
              {/* 1. LEFT SIDE: MAIN CIRCLE WHERE USER CLICKED                 */}
              {/* ============================================================ */}
              <div
                style={{
                  width: '230px',
                  minWidth: '230px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  position: 'sticky',
                  top: '20px',
                  zIndex: 20
                }}
              >
                <div
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    background: 'rgb(var(--surface-rgb))',
                    border: `4px solid ${extractedSector.color}`,
                    boxShadow: `0 0 0 10px ${extractedSector.bgSoft}, 0 14px 36px rgba(0,0,0,0.12)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px',
                    boxSizing: 'border-box',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: extractedSector.bgSoft,
                      color: extractedSector.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '6px'
                    }}
                  >
                    <extractedSector.icon size={22} />
                  </div>

                  <div
                    style={{
                      fontSize: '13.5px',
                      fontWeight: 800,
                      color: '#000000',
                      lineHeight: 1.2
                    }}
                  >
                    {extractedSector.name}
                  </div>

                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: extractedSector.color,
                      marginTop: '3px'
                    }}
                  >
                    {extractedSector.systemCount} Sub-Systems
                  </div>

                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      padding: '2px 7px',
                      borderRadius: '99px',
                      background: extractedSector.color,
                      color: '#ffffff',
                      marginTop: '5px'
                    }}
                  >
                    Main Circle
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: '#222222',
                    marginTop: '10px',
                    fontWeight: 600,
                    maxWidth: '210px',
                    lineHeight: 1.4
                  }}
                >
                  {extractedSector.description}
                </div>
              </div>

              {/* ============================================================ */}
              {/* 2. CENTER & RIGHT: PICTURE TREE SPINE & SYSTEM NODES         */}
              {/* ============================================================ */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  paddingLeft: '36px',
                  borderLeft: `3px dashed ${extractedSector.color}`,
                  position: 'relative',
                  marginLeft: '20px'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '20px',
                    height: '3px',
                    background: extractedSector.color
                  }}
                />

                {extractedSector.systems.map((sys) => (
                  <div
                    key={sys.id}
                    onClick={() => setSelectedSystemId(sys.id)}
                    title={`Click to open System ${sys.systemNumber} Full Dashboard (Live KPIs, Bulk Upload, Manual Entry)`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      background: 'rgb(var(--surface-rgb))',
                      border: `1.5px solid ${extractedSector.borderColor}`,
                      borderLeft: `5px solid ${extractedSector.color}`,
                      borderRadius: '14px',
                      padding: '12px 16px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Horizontal connector spoke from vertical tree spine to this node */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-39px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '36px',
                        height: '2px',
                        background: extractedSector.color
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '-42px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: extractedSector.color
                      }}
                    />

                    {/* Primary System Node (Circle badge + title + KPI) */}
                    <div
                      style={{
                        width: '280px',
                        minWidth: '280px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: extractedSector.color,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '14px',
                          boxShadow: `0 4px 12px ${extractedSector.bgSoft}`,
                          flexShrink: 0
                        }}
                      >
                        {sys.systemNumber}
                      </div>

                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              color: extractedSector.color
                            }}
                          >
                            System {sys.systemNumber}
                          </span>
                          <span
                            style={{
                              fontSize: '9.5px',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '99px',
                              background: sys.status === 'Attention' ? 'rgba(217, 119, 6, 0.12)' : 'rgba(5, 150, 105, 0.12)',
                              color: sys.statusColor
                            }}
                          >
                            ● {sys.status}
                          </span>
                          <span
                            style={{
                              fontSize: '9.5px',
                              fontWeight: 800,
                              color: '#ffffff',
                              background: extractedSector.color,
                              padding: '2px 7px',
                              borderRadius: '4px'
                            }}
                          >
                            Open Dashboard ↗
                          </span>
                        </div>
                        <h4 style={{ fontSize: '13px', fontWeight: 800, margin: '2px 0 0 0', color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sys.name}
                        </h4>
                        <div style={{ fontSize: '10.5px', color: '#111111', fontWeight: 600, marginTop: '2px' }}>
                          {sys.kpiHighlight}
                        </div>
                      </div>
                    </div>

                    {/* Small arrow indicator */}
                    <ChevronRight size={18} style={{ color: extractedSector.color, flexShrink: 0 }} />

                    {/* Related Leaf Nodes (Capsules in Picture Layout) */}
                    <div
                      style={{
                        flex: 1,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '8px'
                      }}
                    >
                      {sys.leaves.map((leaf) => (
                        <div
                          key={leaf.title}
                          className="picture-node"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveLeafDetail(leaf);
                          }}
                          style={{
                            background: 'var(--muted-fill)',
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px'
                          }}
                        >
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {leaf.title}
                            </div>
                            <div style={{ fontSize: '9.5px', color: '#222222', marginTop: '1px' }}>
                              {leaf.metric}
                            </div>
                          </div>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: extractedSector.color,
                              flexShrink: 0
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional Leaf Node Detail Inspector (When clicked) */}
            {activeLeafDetail && (
              <div
                style={{
                  background: 'rgb(var(--surface-rgb))',
                  border: `1.5px solid ${extractedSector.color}`,
                  borderRadius: '10px',
                  padding: '10px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
                  flexShrink: 0
                }}
              >
                <div>
                  <strong>🌿 {activeLeafDetail.title}</strong>: {activeLeafDetail.desc}{' '}
                  <span style={{ color: extractedSector.color, fontWeight: 700, marginLeft: '6px' }}>
                    [{activeLeafDetail.metric}]
                  </span>
                </div>
                <button
                  onClick={() => setActiveLeafDetail(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#666666',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 8px'
                  }}
                >
                  ✕ Close
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
