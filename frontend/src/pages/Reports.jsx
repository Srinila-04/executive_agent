import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Share2,
  Calendar,
  Clock,
  Eye,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit2,
  RefreshCw,
  Star,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Building2,
  MapPin,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  Printer,
  Copy,
  Lock,
  MessageSquare,
  ShieldCheck,
  Cpu,
  ArrowRight,
  ExternalLink,
  X,
  Sliders,
  Send,
  FileSpreadsheet,
  FileCode,
  Users,
  Activity,
  Zap,
  Gauge,
  Factory,
  Check,
  AlertCircle,
  Truck,
  HardHat,
  Boxes,
  PieChart,
  Target
} from 'lucide-react';
import { HOME_SECTORS } from '../data/homeRadialData';
import '../styles/reports.css';

// =========================================================================
// STATIC FALLBACK DATA (Guarantees zero empty states or "0 reports")
// =========================================================================

const FALLBACK_PLANTS = [
  { id: 'ALL', code: 'ALL', plantName: 'All Plant Facilities', state: 'India', district: 'National Grid', lines: 17, oee: 87.4, status: 'Optimal' },
  { id: 'IN-TN-01', code: 'IN-TN-01', plantName: 'Chennai Electronics Plant', state: 'Tamil Nadu', district: 'Sriperumbudur / Kanchipuram', lines: 4, oee: 88.2, status: 'Optimal' },
  { id: 'IN-KA-01', code: 'IN-KA-01', plantName: 'Bengaluru Electronics Plant', state: 'Karnataka', district: 'Peenya / Whitefield', lines: 3, oee: 86.8, status: 'Optimal' },
  { id: 'IN-MH-01', code: 'IN-MH-01', plantName: 'Pune Precision Stamping Plant', state: 'Maharashtra', district: 'Chakan / Pimpri-Chinchwad', lines: 4, oee: 85.4, status: 'Warning' },
  { id: 'IN-GJ-01', code: 'IN-GJ-01', plantName: 'Sanand Automotive Assembly', state: 'Gujarat', district: 'Sanand Industrial Belt', lines: 4, oee: 89.1, status: 'Optimal' },
  { id: 'IN-TN-02', code: 'IN-TN-02', plantName: 'Coimbatore Precision Tooling', state: 'Tamil Nadu', district: 'Pollachi / Coimbatore', lines: 2, oee: 87.6, status: 'Optimal' }
];

const PLANT_LINES_MAP = {
  'ALL': [
    { id: 'ALL', name: 'All Production Lines (17 Lines)' },
    { id: 'L-TN-01', name: 'Line 01 - High-Speed SMT (Chennai)' },
    { id: 'L-TN-02', name: 'Line 02 - Wave Soldering & AOI (Chennai)' },
    { id: 'L-KA-01', name: 'Line 01 - Advanced Wire Harness (Bengaluru)' },
    { id: 'L-MH-01', name: 'Line 01 - 800T Transfer Press (Pune)' },
    { id: 'L-GJ-01', name: 'Line 01 - Chassis Robotic Welding (Sanand)' }
  ],
  'Chennai Electronics Plant': [
    { id: 'ALL', name: 'All Lines (Chennai - 4 Lines)' },
    { id: 'L-TN-01', name: 'Line 01 - High-Speed SMT Placement' },
    { id: 'L-TN-02', name: 'Line 02 - Dual-Wave Nitrogen Soldering' },
    { id: 'L-TN-03', name: 'Line 03 - Conformal Coating & Inspection' },
    { id: 'L-TN-04', name: 'Line 04 - Box Build & Final Packaging' }
  ],
  'Bengaluru Electronics Plant': [
    { id: 'ALL', name: 'All Lines (Bengaluru - 3 Lines)' },
    { id: 'L-KA-01', name: 'Line 01 - Auto-Crimping & Wire Harness' },
    { id: 'L-KA-02', name: 'Line 02 - ECU Enclosure Assembly' },
    { id: 'L-KA-03', name: 'Line 03 - Ultrasonic Testing Cell' }
  ],
  'Pune Precision Stamping Plant': [
    { id: 'ALL', name: 'All Lines (Pune - 4 Lines)' },
    { id: 'L-MH-01', name: 'Line 01 - 800T Tandem Stamping Press' },
    { id: 'L-MH-02', name: 'Line 02 - High-Speed Blanking Line' },
    { id: 'L-MH-03', name: 'Line 03 - Progressive Die Stamping' },
    { id: 'L-MH-04', name: 'Line 04 - Laser Trimming & Deburring' }
  ],
  'Sanand Automotive Assembly': [
    { id: 'ALL', name: 'All Lines (Sanand - 4 Lines)' },
    { id: 'L-GJ-01', name: 'Line 01 - Robotic Body Sub-Assembly' },
    { id: 'L-GJ-02', name: 'Line 02 - E-Coat & Primer Line' },
    { id: 'L-GJ-03', name: 'Line 03 - Powertrain Dress-Up Cell' },
    { id: 'L-GJ-04', name: 'Line 04 - End-of-Line Dynamic Dyno Test' }
  ],
  'Coimbatore Precision Tooling': [
    { id: 'ALL', name: 'All Lines (Coimbatore - 2 Lines)' },
    { id: 'L-TN-21', name: 'Line 01 - 5-Axis CNC Milling Cell' },
    { id: 'L-TN-22', name: 'Line 02 - Precision Die & Mold Heat Treatment' }
  ]
};

const SECTORS_LIST = [
  'All 6 Sectors',
  'Production & Planning',
  'Maintenance & Utilities',
  'Quality & Engineering',
  'Supply Chain & Customers',
  'People & Safety',
  'Finance & Leadership'
];

const SECTOR_ID_MAP = {
  'production': 'Production & Planning',
  'maintenance': 'Maintenance & Utilities',
  'quality': 'Quality & Engineering',
  'supplychain': 'Supply Chain & Customers',
  'people': 'People & Safety',
  'finance': 'Finance & Leadership'
};

const INITIAL_REPORTS = [
  // Production and Planning
  {
    id: 'rep-pp-1',
    name: 'Plan vs Actual Output & Adherence Variance',
    sector: 'Production & Planning',
    sectorId: 'production',
    agent: 'Agent 01 (Production Planning)',
    agentId: 1,
    plantsCovered: 'All 6 Plant Facilities',
    lastUpdated: '10 mins ago',
    dataFreshness: 'Live (10m ago)',
    status: 'Ready',
    isFavorite: true,
    description: 'Hourly and shift variance between scheduled production orders and physical shop-floor output across all high-speed lines.',
    metrics: [
      { label: 'Plan Adherence', value: '98.2%' },
      { label: 'Scheduled Units', value: '49,100' },
      { label: 'Actual Output', value: '48,240' },
      { label: 'Variance', value: '-1.8%' }
    ],
    summary: {
      fact: 'Total output reached 48,240 units (+3.2% vs baseline). SMT Line 01 in Chennai achieved 101.4% plan adherence.',
      likelyReason: 'Finite scheduling eliminated die changeover bottlenecks and balanced takt pacing at 39.8s/unit.',
      recommendation: 'Lock in current sequence through Shift C to safeguard export order delivery windows.'
    }
  },
  {
    id: 'rep-pp-2',
    name: 'Digital Shift Handover & Supervisor Log',
    sector: 'Production & Planning',
    sectorId: 'production',
    agent: 'Agent 02 (Production Monitoring)',
    agentId: 2,
    plantsCovered: 'All 6 Plant Facilities',
    lastUpdated: '18 mins ago',
    dataFreshness: 'Live (18m ago)',
    status: 'Ready',
    isFavorite: false,
    description: 'Digital shift log detailing open WIP, active machine telemetry alarms, tooling life remaining, and supervisor notes.',
    metrics: [
      { label: 'Open WIP Units', value: '3,840' },
      { label: 'Active Alarms', value: '2 Resolved' },
      { label: 'Shift Handover', value: '100% Signed' },
      { label: 'Tool Life Buffer', value: '84.2%' }
    ],
    summary: {
      fact: 'Zero safety or quality holds passed between Shift A and Shift B. Line 02 nitrogen pressure normalized.',
      likelyReason: 'Automated digital checklist enforced verification of tooling wear and calibration offsets.',
      recommendation: 'Perform routine nozzle cleaning on SMT placement head during planned 15-minute meal break.'
    }
  },
  {
    id: 'rep-pp-3',
    name: 'OEE 6-Big-Loss Pareto & Machine Ranking',
    sector: 'Production & Planning',
    sectorId: 'production',
    agent: 'Agent 03 (Equipment Effectiveness OEE)',
    agentId: 3,
    plantsCovered: 'Chennai, Pune, Bengaluru',
    lastUpdated: '25 mins ago',
    dataFreshness: 'Live (25m ago)',
    status: 'Ready',
    isFavorite: true,
    description: 'Six big losses Pareto decomposition across availability breakdowns, speed derating, and scrap yield losses.',
    metrics: [
      { label: 'Group OEE', value: '87.4%' },
      { label: 'Availability', value: '92.1%' },
      { label: 'Performance', value: '96.8%' },
      { label: 'Quality Rate', value: '98.2%' }
    ],
    summary: {
      fact: 'Overall group OEE stands at 87.4% (+2.4% vs benchmark). Micro-stoppages dropped by 42 minutes across shifts.',
      likelyReason: 'Predictive lubrication and sensor threshold alerts arrested intermittent feeder jams before stoppage.',
      recommendation: 'Calibrate stamping die #14 guidance pins on Pune Line 02 to recapture remaining 1.8% speed loss.'
    }
  },
  {
    id: 'rep-pp-4',
    name: 'Digital Plant Twin 3D Simulation Analysis',
    sector: 'Production & Planning',
    sectorId: 'production',
    agent: 'Agent 04 (Digital Plant Twin)',
    agentId: 4,
    plantsCovered: 'Pune Line 01 & 02',
    lastUpdated: '45 mins ago',
    dataFreshness: 'Updated 45m ago',
    status: 'Ready',
    isFavorite: false,
    description: 'Predictive bottleneck simulations comparing 2-shift vs 3-shift setups, AGV material dispatch, and buffer leveling.',
    metrics: [
      { label: 'Buffer Health', value: '98.6%' },
      { label: 'AGV Utilization', value: '84.2%' },
      { label: 'Bottleneck Shift', value: '0 Critical' },
      { label: 'Simulated Throughput', value: '+6.4%' }
    ],
    summary: {
      fact: 'Simulated scenario B shows +6.4% higher throughput by staggering coil delivery to stamping presses by 18 minutes.',
      likelyReason: 'AGV traffic congestion at main central aisle is bypassed via dedicated return loop.',
      recommendation: 'Deploy Scenario B dispatch rule live to Pune shop-floor AGV fleet controller.'
    }
  },

  // Maintenance and Utilities
  {
    id: 'rep-mu-1',
    name: 'Asset Health Index & Spindle Vibration Telemetry',
    sector: 'Maintenance & Utilities',
    sectorId: 'maintenance',
    agent: 'Agent 05 (Predictive Maintenance)',
    agentId: 5,
    plantsCovered: '140 Assets Across 6 Plants',
    lastUpdated: '5 mins ago',
    dataFreshness: 'Live (5m ago)',
    status: 'Ready',
    isFavorite: true,
    description: 'Vibration, temperature, and bearing degradation index ranking every asset from healthiest to high-risk.',
    metrics: [
      { label: 'Monitored Assets', value: '140 Machines' },
      { label: 'Asset Health Score', value: '94.2 / 100' },
      { label: 'Predictive Flags', value: '1 Watchlist' },
      { label: 'Downtime Avoided', value: '3.8 Hours' }
    ],
    summary: {
      fact: 'Press #04 main bearing vibration flagged at 3.8 mm/s RMS (approaching 4.5 mm/s ISO limit). All other assets normal.',
      likelyReason: 'Outer raceway micro-pitting detected via high-frequency acoustic emission sensor.',
      recommendation: 'Stage replacement bearing B-6312 for scheduled changeover tonight at 23:00 PM.'
    }
  },
  {
    id: 'rep-mu-2',
    name: 'Energy Management & Peak Tariff Optimization',
    sector: 'Maintenance & Utilities',
    sectorId: 'maintenance',
    agent: 'Agent 06 (Energy & Tariff Management)',
    agentId: 6,
    plantsCovered: 'All HT Substations & Grid Feeds',
    lastUpdated: '15 mins ago',
    dataFreshness: 'Live (15m ago)',
    status: 'Ready',
    isFavorite: true,
    description: 'Specific energy consumption (kWh per finished unit) tracked by line and shift against dynamic time-of-day tariffs.',
    metrics: [
      { label: 'Specific Energy', value: '4.2 kWh/Unit' },
      { label: 'Peak Load Shaved', value: '18.4%' },
      { label: 'Daily Tariff Savings', value: '₹4.88 Lakhs' },
      { label: 'Power Factor', value: '0.992 Lead' }
    ],
    summary: {
      fact: 'Energy cost per finished unit dropped by -6.2%. Heavy annealing cycles shifted to off-peak slots (22:00 - 06:00).',
      likelyReason: 'Automated chiller sequencing and SCADA smart capacitor banks maintained 0.992 power factor.',
      recommendation: 'Maintain current annealing furnace pre-heating schedule to capture off-peak tariff rebate.'
    }
  },
  {
    id: 'rep-mu-3',
    name: 'Ultrasonic Utility Leak & Compressed Air Audit',
    sector: 'Maintenance & Utilities',
    sectorId: 'maintenance',
    agent: 'Agent 07 (Utilities & Facilities)',
    agentId: 7,
    plantsCovered: 'Compressed Air, Nitrogen, Chilled Water',
    lastUpdated: '40 mins ago',
    dataFreshness: 'Updated 40m ago',
    status: 'Ready',
    isFavorite: false,
    description: 'Ultrasonic acoustic sensor detection of compressed air leaks, nitrogen pressure drops, and compressor cycle efficiency.',
    metrics: [
      { label: 'System Pressure', value: '6.8 Bar' },
      { label: 'Leak Rate', value: '4.2% (Benchmark <5%)' },
      { label: 'Compressor Load', value: '74% Optimal' },
      { label: 'Monthly Loss Saved', value: '₹1.15 Lakhs' }
    ],
    summary: {
      fact: 'Compressed air system efficiency stands at 95.8%. Quick-connect coupler on Bay 4 nitrogen line resealed.',
      likelyReason: 'Automated acoustic leak sensing pinpointed micro-loss before pressure drop alarmed.',
      recommendation: 'Continue weekly automated acoustic sweeps across high-pressure manifolds.'
    }
  },

  // Quality and Engineering
  {
    id: 'rep-qe-1',
    name: 'AOI Vision Inspection Results & Defect Pareto',
    sector: 'Quality & Engineering',
    sectorId: 'quality',
    agent: 'Agent 09 (Automated Optical Inspection AOI)',
    agentId: 9,
    plantsCovered: '12 In-Line Camera Stations',
    lastUpdated: '6 mins ago',
    dataFreshness: 'Live (6m ago)',
    status: 'Ready',
    isFavorite: true,
    description: 'High-speed 38ms AI automated optical inspection pass/fail telemetry, solder bridging trends, and component alignment.',
    metrics: [
      { label: 'First-Pass Yield', value: '98.4%' },
      { label: 'Inference Speed', value: '38 ms/frame' },
      { label: 'Defect PPM', value: '182 PPM' },
      { label: 'False Rejects', value: '0.12%' }
    ],
    summary: {
      fact: 'First-pass yield reached 98.4% across 48,240 inspected units. Solder bridge defect rate reduced to 0.04%.',
      likelyReason: 'Automatic feedback from AOI to solder paste printer triggered self-cleaning stencil wipe every 20 boards.',
      recommendation: 'Keep autonomous stencil wipe interval active on SMT Line 02.'
    }
  },
  {
    id: 'rep-qe-2',
    name: 'Product Traceability & Component Genealogy Log',
    sector: 'Quality & Engineering',
    sectorId: 'quality',
    agent: 'Agent 11 (Product Traceability & Genealogy)',
    agentId: 11,
    plantsCovered: 'Batch Serialization & Barcode Mesh',
    lastUpdated: '1 hour ago',
    dataFreshness: 'Updated 1h ago',
    status: 'Ready',
    isFavorite: false,
    description: '100% component-to-finished-good genealogy trace from customer VIN/barcode back to raw material coil heat numbers.',
    metrics: [
      { label: 'Serialized Units', value: '100% Tracked' },
      { label: 'Recall Scope', value: 'Zero Spread' },
      { label: 'Barcode Read Rate', value: '99.98%' },
      { label: 'Trace Query Speed', value: '120 ms' }
    ],
    summary: {
      fact: '100% traceability compliance maintained across OEM audit batches. Sub-tier capacitor lots verified.',
      likelyReason: 'High-speed DPM laser barcode verification at each automated work cell.',
      recommendation: 'Archive serialized genealogy logs to permanent cloud storage per OEM 15-year warranty covenant.'
    }
  },

  // Supply Chain and Customers
  {
    id: 'rep-sc-1',
    name: 'Dynamic Inventory Safety Stock & Buffer Health',
    sector: 'Supply Chain & Customers',
    sectorId: 'supplychain',
    agent: 'Agent 12 (Inventory Optimization & Buffer)',
    agentId: 12,
    plantsCovered: 'All Raw Material & Finished Goods Warehouses',
    lastUpdated: '10 mins ago',
    dataFreshness: 'Live (10m ago)',
    status: 'Ready',
    isFavorite: true,
    description: 'Safety stock buffer levels, stockout risk radar, forward days of inventory, and working capital optimization.',
    metrics: [
      { label: 'Buffer Health', value: '14.2 Days' },
      { label: 'Stockout Risk', value: '0 SKUs' },
      { label: 'Working Capital', value: '-₹38 Lakhs' },
      { label: 'Inventory Turns', value: '8.4x' }
    ],
    summary: {
      fact: 'Zero critical stockout risks across 1,840 active components. Raw material buffer stabilized at 14.2 days.',
      likelyReason: 'Dynamic re-order points auto-adjusted for supplier lead-time variances.',
      recommendation: 'Approve scheduled delivery batch for copper strip arriving Friday morning.'
    }
  },
  {
    id: 'rep-sc-2',
    name: 'Tier-1 Supplier Scorecard & Quality OTIF Matrix',
    sector: 'Supply Chain & Customers',
    sectorId: 'supplychain',
    agent: 'Agent 13 (Supplier Performance & Risk)',
    agentId: 13,
    plantsCovered: '48 Tier-1 Suppliers Globally',
    lastUpdated: '35 mins ago',
    dataFreshness: 'Updated 35m ago',
    status: 'Ready',
    isFavorite: true,
    description: 'Ranked supplier delivery OTIF, quality PPM, invoice accuracy, ESG compliance, and dual-sourcing contingency risk.',
    metrics: [
      { label: 'Supplier OTIF', value: '97.4%' },
      { label: 'Active Suppliers', value: '48 Certified' },
      { label: 'At-Risk Vendors', value: '1 Monitored' },
      { label: 'Quality Acceptance', value: '99.2%' }
    ],
    summary: {
      fact: '47 of 48 suppliers met SLA targets. Secondary vendor allocated 30% quota to mitigate regional freight disruption.',
      likelyReason: 'Autonomous RFQ evaluation balanced price against lead-time reliability index.',
      recommendation: 'Re-certify primary stamping steel coil vendor following flawless quarterly quality audit.'
    }
  },

  // People and Safety
  {
    id: 'rep-ps-1',
    name: 'EHS Plant Safety & Zero-LTI OSHA Incident Log',
    sector: 'People & Safety',
    sectorId: 'people',
    agent: 'Agent 17 (EHS & Plant Safety Management)',
    agentId: 17,
    plantsCovered: 'All 6 Plant Facilities',
    lastUpdated: '12 mins ago',
    dataFreshness: 'Live (12m ago)',
    status: 'Ready',
    isFavorite: true,
    description: 'OSHA & ISO-45001 compliance logs, lost-time injury tracker (428 days zero LTI), near-miss hazards, and PPE vision audit.',
    metrics: [
      { label: 'Days Without LTI', value: '428 Days' },
      { label: 'PPE Compliance', value: '100% Observed' },
      { label: 'Near-Miss Resolved', value: '3 Closed' },
      { label: 'Safety Index', value: '99.8 / 100' }
    ],
    summary: {
      fact: '428 consecutive days of zero lost-time injuries. Computer vision cameras detected 100% PPE compliance across all bays.',
      likelyReason: 'Proactive near-miss reporting closed 3 trip-hazard corrective actions in under 24 hours.',
      recommendation: 'Award quarterly Safety Excellence trophy to Chennai Press Shop during tomorrow morning briefing.'
    }
  },
  {
    id: 'rep-ps-2',
    name: 'Workforce Allocation & Multi-Skill Matrix',
    sector: 'People & Safety',
    sectorId: 'people',
    agent: 'Agent 18 (Workforce Allocation & Skills)',
    agentId: 18,
    plantsCovered: 'All 3 Shifts Across Facilities',
    lastUpdated: '18 mins ago',
    dataFreshness: 'Live (18m ago)',
    status: 'Ready',
    isFavorite: false,
    description: 'Required headcounts by skill matrix station versus physical attendance, cross-training certification, and fatigue alerts.',
    metrics: [
      { label: 'Staffing Fill Rate', value: '98.6%' },
      { label: 'Multi-Skilled Staff', value: '84.2%' },
      { label: 'Overtime Ratio', value: '3.8% (Target <5%)' },
      { label: 'Fatigue Risk', value: '0 Critical' }
    ],
    summary: {
      fact: '98.6% shift staffing fill rate achieved with zero critical station vacancies. Overtime kept at 3.8%.',
      likelyReason: 'Automated skill-station matching assigned certified backup operators during unexpected sick leaves.',
      recommendation: 'Enroll 8 junior operators into Level-2 SMT feeder setup certification program next Monday.'
    }
  },

  // Finance and Leadership
  {
    id: 'rep-fl-1',
    name: 'Unit Production Cost & Net Margin Variance Ledger',
    sector: 'Finance & Leadership',
    sectorId: 'finance',
    agent: 'Agent 19 (Manufacturing Unit Cost System)',
    agentId: 19,
    plantsCovered: 'All Active Product Lines',
    lastUpdated: '30 mins ago',
    dataFreshness: 'Updated 30m ago',
    status: 'Ready',
    isFavorite: true,
    description: 'Bill of materials variance, direct labor, utility allocation, net unit margin impact, and standard vs actual costing.',
    metrics: [
      { label: 'Avg Unit Cost', value: '₹142.50' },
      { label: 'Budget Variance', value: '-2.4% Favorable' },
      { label: 'Scrap Cost Recovered', value: '₹1.85 Lakhs' },
      { label: 'EBITDA Margin', value: '18.4%' }
    ],
    summary: {
      fact: 'Unit manufacturing cost settled at ₹142.50 (2.4% below budget benchmark). EBITDA margin expanded to 18.4%.',
      likelyReason: 'Lower unit energy tariffs and optimized scrap recovery preserved ₹1.85 Lakhs in operating profit.',
      recommendation: 'Lock in standard cost matrix for Q4 OEM annual supplier price adjustment.'
    }
  },
  {
    id: 'rep-fl-2',
    name: 'Daily Executive Operations Decision & Action Brief',
    sector: 'Finance & Leadership',
    sectorId: 'finance',
    agent: 'Agent 20 (Master Decision Command Center)',
    agentId: 20,
    plantsCovered: 'All 6 Plant Facilities (National Grid)',
    lastUpdated: 'Just now',
    dataFreshness: 'Live (Real-Time Mesh)',
    status: 'Ready',
    isFavorite: true,
    description: 'Master autonomous intelligence ledger of cross-plant decisions, predicted financial impact, and enterprise governance.',
    metrics: [
      { label: 'Daily Loss Avoided', value: '₹14.8 Lakhs' },
      { label: 'Pending Decisions', value: '2 Actions' },
      { label: 'Autonomous Actions', value: '38 Executed' },
      { label: 'Mesh Health', value: '100% Synced' }
    ],
    summary: {
      fact: 'Multi-agent mesh prevented ₹14.8 Lakhs in cumulative downtime, quality scrap, and energy demand penalty losses today.',
      likelyReason: 'Closed-loop autonomous orchestration across all 20 agents operated with zero human delay.',
      recommendation: 'Review and approve 2 pending capital reallocation recommendations in the Master Decision log.'
    }
  }
];

export default function Reports({
  onNavigateToAgents,
  onNavigateToArchitecture,
  onNavigateToConnectors,
  selectedPlant,
  setSelectedPlant,
  filterOptions
}) {
  // -------------------------------------------------------------
  // Data States
  // -------------------------------------------------------------
  const [reportsList, setReportsList] = useState(INITIAL_REPORTS);
  const [plantsList, setPlantsList] = useState(FALLBACK_PLANTS);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSectorTab, setActiveSectorTab] = useState('all'); // 'all', 'favorites', 'production', 'maintenance', 'quality', 'supplychain', 'people', 'finance'

  // -------------------------------------------------------------
  // Dynamic Filter Matrix States (User requirement: Add as much dynamic filters)
  // -------------------------------------------------------------
  const [timeHorizon, setTimeHorizon] = useState('This Month');
  const [selectedPlantFilter, setSelectedPlantFilter] = useState(selectedPlant?.plantName || 'All Plant Facilities');
  const [selectedLineFilter, setSelectedLineFilter] = useState('ALL');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('All Shifts');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState('All 6 Sectors');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('All 20 Agents');
  const [selectedHealthStatus, setSelectedHealthStatus] = useState('All Statuses');
  const [selectedLossCategory, setSelectedLossCategory] = useState('All Categories');
  const [selectedReportType, setSelectedReportType] = useState('All Types');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterShrunk, setIsFilterShrunk] = useState(false);

  // -------------------------------------------------------------
  // AI Operations Synthesis & Diagnosis States
  // -------------------------------------------------------------
  const [isAiSynthesizing, setIsAiSynthesizing] = useState(false);
  const [aiLastUpdated, setAiLastUpdated] = useState('Just now (Live Telemetry)');
  const [aiInsights, setAiInsights] = useState([
    {
      category: 'Cross-Domain Bottleneck Pre-Emption',
      title: 'Spindle Vibration & Line 02 Schedule Sync',
      text: 'Agent 05 (Predictive Maintenance) identified a 3.8mm/s RMS harmonic vibration anomaly on Pune Press #04. Agent 01 (Planning) auto-balanced sequence to bypass die shock, preventing 3.2 hours of unplanned downtime.',
      impact: '₹4.2 Lakhs Downtime Loss Avoided'
    },
    {
      category: 'Closed-Loop Quality Self-Correction',
      title: 'AOI Vision Feedback to Solder Paste Printer',
      text: 'Agent 09 (AOI Vision) detected micro solder-bridging trend on 0402 SMD pads. Closed-loop telemetry instructed stencil wiper cycle every 20 boards, raising First-Pass Yield to 98.4%.',
      impact: 'Zero Defect PPM Customer Escape'
    },
    {
      category: 'Dynamic Energy & Working Capital Balance',
      title: 'Off-Peak Tariff Shifting & Coil Buffer Leveling',
      text: 'Agent 06 (Energy Tariff) shifted 18.4% of heavy annealing cycles into off-peak hours (₹4.88L saved). Agent 12 (Inventory) leveled buffer stocks across Chennai and Bengaluru with 14.2 days safety margin.',
      impact: '₹14.8 Lakhs Net Daily Value Created'
    }
  ]);

  // Modals
  const [viewingReport, setViewingReport] = useState(null);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Sync with prop plant if provided
  useEffect(() => {
    if (selectedPlant?.plantName) {
      setSelectedPlantFilter(selectedPlant.plantName);
    }
  }, [selectedPlant]);

  // Load plants dynamically from backend if available
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.districtCoverage && data.districtCoverage.length > 0) {
          const formatted = [
            FALLBACK_PLANTS[0], // All Plants
            ...data.districtCoverage.map((p) => ({
              id: p.plantCode,
              code: p.plantCode,
              plantName: p.plantName,
              state: p.state || 'India',
              district: p.district || 'Industrial Corridor',
              lines: p.lines || 4,
              oee: 87.4,
              status: p.status || 'Optimal'
            }))
          ];
          setPlantsList(formatted);
        }
      })
      .catch((err) => console.warn('Using local plant matrix:', err));
  }, []);

  // Dynamic Available Lines based on Selected Plant
  const availableLines = useMemo(() => {
    return PLANT_LINES_MAP[selectedPlantFilter] || PLANT_LINES_MAP['ALL'];
  }, [selectedPlantFilter]);

  // Dynamic Available Agents based on Selected Sector
  const availableAgents = useMemo(() => {
    if (selectedSectorFilter === 'All 6 Sectors') {
      const all = [];
      HOME_SECTORS.forEach((sec) => {
        (sec.agents || []).forEach((ag) => {
          all.push({ id: ag.id, name: `Agent ${String(ag.agentNumber || ag.id).padStart(2, '0')} (${ag.name})`, sector: sec.name });
        });
      });
      return [{ id: 'ALL', name: 'All 20 Agents' }, ...all];
    } else {
      const foundSec = HOME_SECTORS.find((s) => s.name === selectedSectorFilter);
      if (!foundSec) return [{ id: 'ALL', name: 'All Agents' }];
      const list = (foundSec.agents || []).map((ag) => ({
        id: ag.id,
        name: `Agent ${String(ag.agentNumber || ag.id).padStart(2, '0')} (${ag.name})`,
        sector: foundSec.name
      }));
      return [{ id: 'ALL', name: `All ${foundSec.name} Agents` }, ...list];
    }
  }, [selectedSectorFilter]);

  // Trigger AI Operations Re-Analysis
  const handleTriggerAiAnalysis = () => {
    setIsAiSynthesizing(true);
    setToastMessage('Synthesizing cross-agent operational telemetry with AI...');
    setTimeout(() => {
      setIsAiSynthesizing(false);
      setAiLastUpdated('Just now (AI Mesh Recalibrated)');
      setToastMessage('AI Operations Synthesis updated across all 20 agents!');
      setTimeout(() => setToastMessage(''), 3500);
    }, 1200);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setTimeHorizon('This Month');
    setSelectedPlantFilter('All Plant Facilities');
    setSelectedLineFilter('ALL');
    setSelectedShiftFilter('All Shifts');
    setSelectedSectorFilter('All 6 Sectors');
    setSelectedAgentFilter('All 20 Agents');
    setSelectedHealthStatus('All Statuses');
    setSelectedLossCategory('All Categories');
    setSelectedReportType('All Types');
    setSearchQuery('');
    setActiveSectorTab('all');
    setToastMessage('All dynamic filters reset to enterprise default view.');
    setTimeout(() => setToastMessage(''), 2500);
  };

  // -------------------------------------------------------------
  // Dynamic Filtering Logic
  // -------------------------------------------------------------
  const filteredReports = useMemo(() => {
    return reportsList.filter((r) => {
      // Sector tab filter
      if (activeSectorTab === 'favorites') {
        if (!r.isFavorite) return false;
      } else if (activeSectorTab !== 'all') {
        const expectedSectorName = SECTOR_ID_MAP[activeSectorTab];
        if (expectedSectorName && r.sector !== expectedSectorName) return false;
      }

      // Sector dropdown filter
      if (selectedSectorFilter !== 'All 6 Sectors') {
        if (r.sector !== selectedSectorFilter) return false;
      }

      // Agent filter
      if (selectedAgentFilter !== 'All 20 Agents' && !selectedAgentFilter.startsWith('All ')) {
        const agMatch = selectedAgentFilter.match(/Agent \d+/);
        if (agMatch && !r.agent.includes(agMatch[0])) return false;
      }

      // Plant filter
      if (selectedPlantFilter !== 'All Plant Facilities' && selectedPlantFilter !== 'ALL') {
        const pLower = selectedPlantFilter.toLowerCase();
        const covers = (r.plantsCovered || '').toLowerCase();
        if (!covers.includes('all') && !covers.includes(pLower)) {
          if (pLower.includes('chennai') && !covers.includes('chennai')) return false;
          if (pLower.includes('pune') && !covers.includes('pune')) return false;
          if (pLower.includes('bengaluru') && !covers.includes('bengaluru')) return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (r.name || '').toLowerCase().includes(q);
        const matchAgent = (r.agent || '').toLowerCase().includes(q);
        const matchDesc = (r.description || '').toLowerCase().includes(q);
        const matchSector = (r.sector || '').toLowerCase().includes(q);
        if (!matchName && !matchAgent && !matchDesc && !matchSector) return false;
      }

      return true;
    });
  }, [reportsList, activeSectorTab, selectedSectorFilter, selectedAgentFilter, selectedPlantFilter, searchQuery]);

  // Active filter count calculation
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (timeHorizon !== 'This Month') count++;
    if (selectedPlantFilter !== 'All Plant Facilities') count++;
    if (selectedLineFilter !== 'ALL') count++;
    if (selectedShiftFilter !== 'All Shifts') count++;
    if (selectedSectorFilter !== 'All 6 Sectors') count++;
    if (selectedAgentFilter !== 'All 20 Agents' && !selectedAgentFilter.startsWith('All ')) count++;
    if (selectedHealthStatus !== 'All Statuses') count++;
    if (selectedLossCategory !== 'All Categories') count++;
    if (selectedReportType !== 'All Types') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [timeHorizon, selectedPlantFilter, selectedLineFilter, selectedShiftFilter, selectedSectorFilter, selectedAgentFilter, selectedHealthStatus, selectedLossCategory, selectedReportType, searchQuery]);

  // Flat list of all 20 agents for the Matrix
  const allAgentsFlat = useMemo(() => {
    const list = [];
    HOME_SECTORS.forEach((sec) => {
      (sec.agents || []).forEach((ag) => {
        list.push({
          ...ag,
          sectorName: sec.name,
          sectorColor: sec.color,
          sectorCode: sec.code
        });
      });
    });
    return list;
  }, []);

  // Filtered agents matrix
  const filteredAgentsMatrix = useMemo(() => {
    return allAgentsFlat.filter((ag) => {
      if (selectedSectorFilter !== 'All 6 Sectors' && ag.sectorName !== selectedSectorFilter) return false;
      if (selectedAgentFilter !== 'All 20 Agents' && !selectedAgentFilter.startsWith('All ')) {
        const agMatch = selectedAgentFilter.match(/Agent \d+/);
        if (agMatch) {
          const num = parseInt(agMatch[0].replace('Agent ', ''), 10);
          if (ag.agentNumber !== num && ag.id !== num) return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const m1 = ag.name.toLowerCase().includes(q);
        const m2 = ag.tagline.toLowerCase().includes(q);
        const m3 = ag.sectorName.toLowerCase().includes(q);
        if (!m1 && !m2 && !m3) return false;
      }
      return true;
    });
  }, [allAgentsFlat, selectedSectorFilter, selectedAgentFilter, searchQuery]);

  return (
    <div className="content-scroll reports-page-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            background: 'var(--brand-purple)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(111, 61, 186, 0.4)',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================= */}
      {/* 1. STICKY DYNAMIC FILTER MATRIX HEADER                        */}
      {/* ============================================================= */}
      <div className="reports-header-card">
        {/* Title & Actions Row */}
        <div className="reports-title-row">
          <div className="reports-title-left">
            <div className="reports-icon-badge">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="reports-main-title">
                Reports & Operational Intelligence
                <span className="reports-sync-pill">20 Autonomous Agents Synced</span>
              </h1>
              <p className="reports-subtitle">
                AI cross-agent operational synthesis, loss diagnostics, and real-time plant telemetry across all facilities.
              </p>
            </div>
          </div>

          <div className="reports-actions-row">
            {/* Shrink / Expand Filters Toggle Button */}
            <button
              className={`filter-shrink-toggle-btn ${isFilterShrunk ? 'shrunk' : ''}`}
              onClick={() => setIsFilterShrunk(!isFilterShrunk)}
              title={isFilterShrunk ? "Expand Filter Matrix" : "Shrink Filter Matrix"}
            >
              {isFilterShrunk ? (
                <>
                  <Filter size={13} />
                  <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
                  <ChevronDown size={13} />
                </>
              ) : (
                <>
                  <ChevronUp size={13} />
                  <span>Shrink Filters</span>
                </>
              )}
            </button>

            <button
              className="btn-primary"
              onClick={handleTriggerAiAnalysis}
              disabled={isAiSynthesizing}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={15} />
              <span>{isAiSynthesizing ? 'Synthesizing...' : 'Re-Analyze All Agents with AI'}</span>
            </button>

            <button
              className="btn-secondary"
              onClick={() => setShowBuilderModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} />
              <span>Custom Report Builder</span>
            </button>

            <button
              className="btn-secondary"
              onClick={() => setShowScheduleModal(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Clock size={15} />
              <span>Add Schedule</span>
            </button>
          </div>
        </div>

        {/* Shrunk vs Expanded Filter Views */}
        {isFilterShrunk ? (
          <div className="filter-shrunk-bar">
            <div className="filter-shrunk-left">
              <div className="filter-shrunk-badge">
                <Filter size={12} />
                <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount} Active)` : '(Default)'}</span>
              </div>
              <div className="filter-shrunk-chips">
                <span className="shrunk-chip">📅 {timeHorizon}</span>
                <span className="shrunk-chip">🏭 {selectedPlantFilter.replace(' Plant', '')}</span>
                {selectedLineFilter !== 'ALL' && <span className="shrunk-chip highlight">⚡ Line: {selectedLineFilter}</span>}
                {selectedShiftFilter !== 'All Shifts' && <span className="shrunk-chip highlight">🕒 {selectedShiftFilter}</span>}
                {selectedSectorFilter !== 'All 6 Sectors' && <span className="shrunk-chip highlight">🏷️ {selectedSectorFilter}</span>}
                {selectedAgentFilter !== 'All 20 Agents' && !selectedAgentFilter.startsWith('All ') && (
                  <span className="shrunk-chip highlight">🤖 {selectedAgentFilter.split('(')[0]}</span>
                )}
                {selectedHealthStatus !== 'All Statuses' && <span className="shrunk-chip highlight">🩺 {selectedHealthStatus}</span>}
                {selectedLossCategory !== 'All Categories' && <span className="shrunk-chip highlight">⚠️ {selectedLossCategory}</span>}
                {searchQuery.trim() && <span className="shrunk-chip highlight">🔍 "{searchQuery}"</span>}
              </div>
            </div>

            <div className="filter-shrunk-actions">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  className="reset-filters-btn"
                  onClick={handleResetFilters}
                  style={{ padding: '3px 7px' }}
                >
                  <RefreshCw size={11} /> Reset
                </button>
              )}
              <button
                type="button"
                className="filter-expand-btn"
                onClick={() => setIsFilterShrunk(false)}
              >
                <span>Adjust Filters</span>
                <ChevronDown size={12} />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Dynamic Filter Controls Grid (As much filters as possible - dynamic) */}
            <div className="dynamic-filter-grid">
          {/* 1. Date Range / Horizon */}
          <div className="filter-input-cell">
            <label className="filter-label">
              <Calendar size={12} /> Date Range
            </label>
            <select
              className="filter-select"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
            >
              <option value="Today">Live Shifts (Today)</option>
              <option value="Yesterday">Yesterday</option>
              <option value="This Week">This Week</option>
              <option value="Last Week">Last Week</option>
              <option value="This Month">This Month (MTD)</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Q4">Q4 (Oct - Dec 2026)</option>
              <option value="YTD">Year to Date (YTD)</option>
            </select>
          </div>

          {/* 2. Plant Facility (Dynamic from registered sites) */}
          <div className="filter-input-cell">
            <label className="filter-label">
              <Building2 size={12} /> Plant Facility
            </label>
            <select
              className="filter-select"
              value={selectedPlantFilter}
              onChange={(e) => {
                setSelectedPlantFilter(e.target.value);
                setSelectedLineFilter('ALL');
              }}
            >
              {plantsList.map((p) => (
                <option key={p.id} value={p.plantName}>
                  {p.plantName}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Production Line (Dynamically linked to Plant) */}
          <div className="filter-input-cell">
            <label className="filter-label">
              <Layers size={12} /> Production Line
            </label>
            <select
              className="filter-select"
              value={selectedLineFilter}
              onChange={(e) => setSelectedLineFilter(e.target.value)}
            >
              {availableLines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Shift Schedule */}
          <div className="filter-input-cell">
            <label className="filter-label">
              <Clock size={12} /> Shift Schedule
            </label>
            <select
              className="filter-select"
              value={selectedShiftFilter}
              onChange={(e) => setSelectedShiftFilter(e.target.value)}
            >
              <option value="All Shifts">All Shifts (24 Hours)</option>
              <option value="Shift A">Shift A (Morning 06:00 - 14:00)</option>
              <option value="Shift B">Shift B (Evening 14:00 - 22:00)</option>
              <option value="Shift C">Shift C (Night 22:00 - 06:00)</option>
            </select>
          </div>

          {/* 5. Sector / Domain */}
          <div className="filter-input-cell">
            <label className="filter-label">
              <Factory size={12} /> Domain / Sector
            </label>
            <select
              className="filter-select"
              value={selectedSectorFilter}
              onChange={(e) => {
                setSelectedSectorFilter(e.target.value);
                setSelectedAgentFilter('All 20 Agents');
              }}
            >
              {SECTORS_LIST.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Autonomous Agent (Dynamically filtered by Sector) */}
          <div className="filter-input-cell">
            <label className="filter-label">
              <Cpu size={12} /> Target Agent
            </label>
            <select
              className="filter-select"
              value={selectedAgentFilter}
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
            >
              {availableAgents.map((ag) => (
                <option key={ag.id} value={ag.name}>
                  {ag.name}
                </option>
              ))}
            </select>
          </div>

          {/* 7. Operational Health Status */}
          <div className="filter-input-cell">
            <label className="filter-label">
              <Activity size={12} /> System Health
            </label>
            <select
              className="filter-select"
              value={selectedHealthStatus}
              onChange={(e) => setSelectedHealthStatus(e.target.value)}
            >
              <option value="All Statuses">All Health Statuses</option>
              <option value="Optimal">Optimal (Running)</option>
              <option value="Warning">Degraded (Warning)</option>
              <option value="Alarm">Critical (Alarms Active)</option>
            </select>
          </div>

          {/* 8. Loss / Defect Category */}
          <div className="filter-input-cell">
            <label className="filter-label">
              <AlertTriangle size={12} /> 6-Big-Loss Category
            </label>
            <select
              className="filter-select"
              value={selectedLossCategory}
              onChange={(e) => setSelectedLossCategory(e.target.value)}
            >
              <option value="All Categories">All Loss Categories</option>
              <option value="Breakdowns">Equipment Breakdowns (Availability)</option>
              <option value="Changeovers">Setup & Changeovers (Availability)</option>
              <option value="Micro-stops">Idling & Minor Stops (Performance)</option>
              <option value="Reduced Speed">Speed Derating (Performance)</option>
              <option value="Scrap & Defect">Process Defects & Scrap (Quality)</option>
            </select>
          </div>

          {/* 9. Live Search Query Filter */}
          <div className="filter-input-cell" style={{ gridColumn: 'span 2' }}>
            <label className="filter-label">
              <Search size={12} /> Search Reports & Metrics
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search across 20 agents, metrics, reports, root-causes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Active Filters Bar */}
        {activeFiltersCount > 0 && (
          <div className="active-filters-strip">
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>
              Active Dynamic Filters ({activeFiltersCount}):
            </span>

            {timeHorizon !== 'This Month' && (
              <span className="active-filter-tag">
                Time: {timeHorizon}
                <button className="active-filter-close" onClick={() => setTimeHorizon('This Month')}>✕</button>
              </span>
            )}

            {selectedPlantFilter !== 'All Plant Facilities' && (
              <span className="active-filter-tag">
                Plant: {selectedPlantFilter}
                <button className="active-filter-close" onClick={() => setSelectedPlantFilter('All Plant Facilities')}>✕</button>
              </span>
            )}

            {selectedLineFilter !== 'ALL' && (
              <span className="active-filter-tag">
                Line: {selectedLineFilter}
                <button className="active-filter-close" onClick={() => setSelectedLineFilter('ALL')}>✕</button>
              </span>
            )}

            {selectedShiftFilter !== 'All Shifts' && (
              <span className="active-filter-tag">
                Shift: {selectedShiftFilter}
                <button className="active-filter-close" onClick={() => setSelectedShiftFilter('All Shifts')}>✕</button>
              </span>
            )}

            {selectedSectorFilter !== 'All 6 Sectors' && (
              <span className="active-filter-tag">
                Sector: {selectedSectorFilter}
                <button className="active-filter-close" onClick={() => setSelectedSectorFilter('All 6 Sectors')}>✕</button>
              </span>
            )}

            {selectedAgentFilter !== 'All 20 Agents' && (
              <span className="active-filter-tag">
                Agent: {selectedAgentFilter}
                <button className="active-filter-close" onClick={() => setSelectedAgentFilter('All 20 Agents')}>✕</button>
              </span>
            )}

            {selectedLossCategory !== 'All Categories' && (
              <span className="active-filter-tag">
                Loss: {selectedLossCategory}
                <button className="active-filter-close" onClick={() => setSelectedLossCategory('All Categories')}>✕</button>
              </span>
            )}

            {searchQuery.trim() && (
              <span className="active-filter-tag">
                Query: "{searchQuery}"
                <button className="active-filter-close" onClick={() => setSearchQuery('')}>✕</button>
              </span>
            )}

            <button className="reset-filters-btn" onClick={handleResetFilters}>
              <RefreshCw size={11} /> Reset All
            </button>

            <button
              type="button"
              className="shrink-filters-action-btn"
              onClick={() => setIsFilterShrunk(true)}
              title="Shrink down filter matrix"
            >
              <ChevronUp size={12} /> Shrink Filters
            </button>
          </div>
        )}
      </>
    )}
  </div>

      {/* ============================================================= */}
      {/* 2. AI OPERATIONS SYNTHESIS & SYSTEM HEALTH                    */}
      {/* ============================================================= */}
      <div className="ai-synthesis-banner">
        <div className="ai-synthesis-header">
          <div className="ai-synthesis-title">
            <Sparkles size={18} />
            <span>AI Operations Synthesis & Autonomous Loss Diagnostic Engine</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {aiLastUpdated}
          </span>
        </div>

        <div className="ai-insights-grid">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className="ai-insight-card">
              <span className="ai-insight-category">{insight.category}</span>
              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '2px 0 4px 0', color: 'var(--text-primary)' }}>
                {insight.title}
              </h4>
              <p className="ai-insight-text">{insight.text}</p>
              <div className="ai-insight-impact">
                <CheckCircle2 size={13} />
                <span>{insight.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================= */}
      {/* 3. EXECUTIVE KPI COMMAND STRIP (OVERALL SYSTEM METRICS)       */}
      {/* ============================================================= */}
      <div className="executive-kpi-grid">
        {/* KPI 1: Group OEE */}
        <div className="executive-kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-card-label">Overall OEE</span>
            <div className="kpi-icon-container" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
              <Gauge size={16} />
            </div>
          </div>
          <div className="kpi-card-value">87.4%</div>
          <div className="kpi-card-footer">
            <span>Target: 85.0%</span>
            <span className="kpi-delta-positive">↑ +2.4%</span>
          </div>
        </div>

        {/* KPI 2: Total Output */}
        <div className="executive-kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-card-label">Total Daily Output</span>
            <div className="kpi-icon-container" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
              <Factory size={16} />
            </div>
          </div>
          <div className="kpi-card-value">48,240 Units</div>
          <div className="kpi-card-footer">
            <span>Takt: 39.8s/unit</span>
            <span className="kpi-delta-positive">↑ +3.2%</span>
          </div>
        </div>

        {/* KPI 3: AI Losses Avoided / ROI */}
        <div className="executive-kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-card-label">Daily Loss Avoided</span>
            <div className="kpi-icon-container" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="kpi-card-value">₹14.8 Lakhs</div>
          <div className="kpi-card-footer">
            <span>Via 20 Agents</span>
            <span className="kpi-delta-positive">↑ +₹2.4L today</span>
          </div>
        </div>

        {/* KPI 4: Quality First-Pass Yield */}
        <div className="executive-kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-card-label">First-Pass Yield</span>
            <div className="kpi-icon-container" style={{ background: 'rgba(14, 165, 233, 0.12)', color: '#0ea5e9' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="kpi-card-value">98.4%</div>
          <div className="kpi-card-footer">
            <span>Defects: 182 PPM</span>
            <span className="kpi-delta-positive">↑ +0.8%</span>
          </div>
        </div>

        {/* KPI 5: Workplace Safety Record */}
        <div className="executive-kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-card-label">Zero-LTI Safety</span>
            <div className="kpi-icon-container" style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' }}>
              <HardHat size={16} />
            </div>
          </div>
          <div className="kpi-card-value">428 Days</div>
          <div className="kpi-card-footer">
            <span>PPE: 100% Verified</span>
            <span className="kpi-delta-positive">✓ Safe</span>
          </div>
        </div>

        {/* KPI 6: Supply Chain OTIF */}
        <div className="executive-kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-card-label">Customer OTIF</span>
            <div className="kpi-icon-container" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
              <Truck size={16} />
            </div>
          </div>
          <div className="kpi-card-value">97.8%</div>
          <div className="kpi-card-footer">
            <span>Buffer: 14.2 Days</span>
            <span className="kpi-delta-positive">↑ +1.6%</span>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 4. MULTI-TYPE INTERACTIVE CHARTS & VISUALS                    */}
      {/* ============================================================= */}
      <div className="charts-visuals-grid">
        {/* Chart 1: OEE 6-Big-Loss Pareto Waterfall Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-title-group">
              <h3 className="chart-title">
                <BarChart3 size={17} style={{ color: 'var(--brand-purple)' }} />
                OEE 6-Big-Loss Pareto Waterfall De-escalation
              </h3>
              <span className="chart-desc">
                Real-time shop-floor operational loss breakdown from Gross Shift Hours (480 min) to Value-Add Operating Time.
              </span>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--status-success)', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '6px' }}>
              87.4% Net OEE
            </span>
          </div>

          {/* SVG Waterfall Visual */}
          <div style={{ width: '100%', height: '220px', marginTop: '10px' }}>
            <svg width="100%" height="100%" viewBox="0 0 700 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="barGradVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="barGradLoss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
                <linearGradient id="barGradTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="30" x2="680" y2="30" stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
              <line x1="40" y1="80" x2="680" y2="80" stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
              <line x1="40" y1="130" x2="680" y2="130" stroke="rgba(100,116,139,0.15)" strokeDasharray="3 3" />
              <line x1="40" y1="170" x2="680" y2="170" stroke="rgba(100,116,139,0.3)" />

              {/* Bar 1: Planned Shift (480m) */}
              <rect x="50" y="30" width="70" height="140" rx="6" fill="url(#barGradTotal)" />
              <text x="85" y="25" textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="700">480 min</text>
              <text x="85" y="185" textAnchor="middle" fill="var(--text-muted)" fontSize="10">Planned</text>

              {/* Bar 2: Breakdowns (-42m) */}
              <rect x="155" y="30" width="70" height="24" rx="6" fill="url(#barGradLoss)" />
              <text x="190" y="25" textAnchor="middle" fill="#f43f5e" fontSize="11" fontWeight="700">-42 min</text>
              <text x="190" y="185" textAnchor="middle" fill="var(--text-muted)" fontSize="10">Breakdown</text>

              {/* Bar 3: Changeovers (-28m) */}
              <rect x="260" y="54" width="70" height="16" rx="6" fill="url(#barGradLoss)" />
              <text x="295" y="49" textAnchor="middle" fill="#f43f5e" fontSize="11" fontWeight="700">-28 min</text>
              <text x="295" y="185" textAnchor="middle" fill="var(--text-muted)" fontSize="10">Setup/Die</text>

              {/* Bar 4: Micro-Stops (-19m) */}
              <rect x="365" y="70" width="70" height="11" rx="6" fill="url(#barGradLoss)" />
              <text x="400" y="65" textAnchor="middle" fill="#f43f5e" fontSize="11" fontWeight="700">-19 min</text>
              <text x="400" y="185" textAnchor="middle" fill="var(--text-muted)" fontSize="10">Micro-Stops</text>

              {/* Bar 5: Speed Derating (-15m) */}
              <rect x="470" y="81" width="70" height="9" rx="6" fill="url(#barGradLoss)" />
              <text x="505" y="76" textAnchor="middle" fill="#f43f5e" fontSize="11" fontWeight="700">-15 min</text>
              <text x="505" y="185" textAnchor="middle" fill="var(--text-muted)" fontSize="10">Speed Loss</text>

              {/* Bar 6: Value-Add Time (376m = 87.4%) */}
              <rect x="575" y="55" width="85" height="115" rx="6" fill="url(#barGradVal)" />
              <text x="617" y="50" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="700">376 min (87.4%)</text>
              <text x="617" y="185" textAnchor="middle" fill="var(--text-muted)" fontSize="10">Value-Add Time</text>
            </svg>
          </div>
        </div>

        {/* Chart 2: Multi-Sector Health & Capability Comparison */}
        <div className="chart-card">
          <div className="chart-card-header">
            <div className="chart-title-group">
              <h3 className="chart-title">
                <PieChart size={17} style={{ color: 'var(--brand-blue)' }} />
                6-Domain Performance Index
              </h3>
              <span className="chart-desc">Composite operational compliance index</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', marginTop: '4px' }}>
            {[
              { name: 'Production & Planning', score: 94, color: '#8b5cf6' },
              { name: 'Maintenance & Utilities', score: 89, color: '#f59e0b' },
              { name: 'Quality & Engineering', score: 98, color: '#0ea5e9' },
              { name: 'Supply Chain & Customers', score: 92, color: '#10b981' },
              { name: 'People & Safety', score: 100, color: '#f43f5e' },
              { name: 'Finance & Leadership', score: 91, color: '#3b82f6' }
            ].map((sec) => (
              <div key={sec.name} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-primary)' }}>{sec.name}</span>
                  <span style={{ color: sec.color, fontWeight: 700 }}>{sec.score}%</span>
                </div>
                <div style={{ width: '100%', height: '7px', background: 'var(--kg-bg-2)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${sec.score}%`, height: '100%', background: sec.color, borderRadius: '99px', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 5. INTERACTIVE PLANT GEOGRAPHIC CORRIDOR MAP                   */}
      {/* ============================================================= */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <MapPin size={18} style={{ color: 'var(--brand-purple)' }} />
              National Manufacturing Facilities & Industrial Corridors
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              Click any plant node below to dynamically isolate its telemetry, agents, and operational reports.
            </p>
          </div>

          <span style={{ fontSize: '12px', color: 'var(--brand-purple)', fontWeight: 600 }}>
            {selectedPlantFilter === 'All Plant Facilities' ? 'Showing All 6 Sites' : `Filtered: ${selectedPlantFilter}`}
          </span>
        </div>

        <div className="plants-map-grid">
          {plantsList.map((p) => {
            const isSelected = selectedPlantFilter === p.plantName;
            return (
              <div
                key={p.id}
                className={`plant-site-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedPlantFilter(isSelected && p.code !== 'ALL' ? 'All Plant Facilities' : p.plantName);
                  setSelectedLineFilter('ALL');
                }}
              >
                <div className="plant-site-top">
                  <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: 'var(--dr-active)', color: 'var(--brand-purple)' }}>
                    {p.code}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: p.status === 'Warning' ? '#f59e0b' : '#10b981' }}>
                    ● {p.status}
                  </span>
                </div>

                <div className="plant-site-name">{p.plantName}</div>

                <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={11} /> {p.district}, {p.state}
                </div>

                <div className="plant-site-metrics">
                  <span>Lines: <strong>{p.lines}</strong></span>
                  <span>OEE: <strong style={{ color: 'var(--brand-purple)' }}>{p.oee}%</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================= */}
      {/* 6. PER-AGENT DEEP DIVE INTELLIGENCE MATRIX (ALL 20 AGENTS)    */}
      {/* ============================================================= */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <Cpu size={18} style={{ color: 'var(--brand-blue)' }} />
              20 Autonomous Agents AI Diagnosis & Live Performance Matrix
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              AI analysis of each and every agent UI, sub-system state, live KPIs, and loss-avoidance directives.
            </p>
          </div>

          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-purple)' }}>
            Showing {filteredAgentsMatrix.length} of 20 Agents
          </span>
        </div>

        <div className="agent-matrix-grid">
          {filteredAgentsMatrix.map((ag) => (
            <div key={ag.id} className="agent-matrix-card">
              <div className="agent-card-header">
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-purple)' }}>
                    AGENT {String(ag.agentNumber || ag.id).padStart(2, '0')}
                  </div>
                  <h4 className="agent-card-title">{ag.name}</h4>
                </div>
                <span
                  className="agent-sector-badge"
                  style={{ background: `${ag.sectorColor}18`, color: ag.sectorColor }}
                >
                  {ag.sectorName.split(' ')[0]}
                </span>
              </div>

              {/* AI Assessment Box */}
              <div className="agent-ai-assessment">
                <strong>AI Assessment:</strong> {ag.tagline || ag.description}
              </div>

              {/* KPIs */}
              <div className="agent-kpis-row">
                {(ag.kpis || []).slice(0, 2).map((kpi, kIdx) => (
                  <div key={kIdx} className="agent-kpi-box">
                    <span className="agent-kpi-label">{kpi.label}</span>
                    <span className="agent-kpi-val" style={{ color: ag.sectorColor }}>{kpi.val}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="agent-card-footer">
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                  {ag.statusChip || 'OPTIMAL • ONLINE'}
                </span>

                {ag.appUrl ? (
                  <a
                    href={ag.appUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--brand-purple)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <span>Launch UI</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <button
                    onClick={() => onNavigateToAgents?.(ag.id)}
                    style={{ background: 'none', border: 'none', fontSize: '11.5px', fontWeight: 700, color: 'var(--brand-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <span>View System</span>
                    <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================= */}
      {/* 7. STANDARDIZED EXECUTIVE REPORTS LIBRARY                     */}
      {/* ============================================================= */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <FileText size={18} style={{ color: 'var(--brand-purple)' }} />
              Executive Reports Library
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
              Standardized, scheduled, and ad-hoc reports synthesized live across all operational divisions.
            </p>
          </div>

          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>
            Showing {filteredReports.length} Reports
          </span>
        </div>

        {/* Sector Tabs */}
        <div className="reports-library-tabs">
          <button
            className={`reports-tab-btn ${activeSectorTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSectorTab('all')}
          >
            All Reports ({reportsList.length})
          </button>
          <button
            className={`reports-tab-btn ${activeSectorTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveSectorTab('favorites')}
          >
            ⭐ Pinned Favorites ({reportsList.filter((r) => r.isFavorite).length})
          </button>
          <button
            className={`reports-tab-btn ${activeSectorTab === 'production' ? 'active' : ''}`}
            onClick={() => setActiveSectorTab('production')}
          >
            Production & Planning ({reportsList.filter((r) => r.sector === 'Production & Planning').length})
          </button>
          <button
            className={`reports-tab-btn ${activeSectorTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveSectorTab('maintenance')}
          >
            Maintenance & Utilities ({reportsList.filter((r) => r.sector === 'Maintenance & Utilities').length})
          </button>
          <button
            className={`reports-tab-btn ${activeSectorTab === 'quality' ? 'active' : ''}`}
            onClick={() => setActiveSectorTab('quality')}
          >
            Quality & Engineering ({reportsList.filter((r) => r.sector === 'Quality & Engineering').length})
          </button>
          <button
            className={`reports-tab-btn ${activeSectorTab === 'supplychain' ? 'active' : ''}`}
            onClick={() => setActiveSectorTab('supplychain')}
          >
            Supply Chain ({reportsList.filter((r) => r.sector === 'Supply Chain & Customers').length})
          </button>
          <button
            className={`reports-tab-btn ${activeSectorTab === 'people' ? 'active' : ''}`}
            onClick={() => setActiveSectorTab('people')}
          >
            People & Safety ({reportsList.filter((r) => r.sector === 'People & Safety').length})
          </button>
          <button
            className={`reports-tab-btn ${activeSectorTab === 'finance' ? 'active' : ''}`}
            onClick={() => setActiveSectorTab('finance')}
          >
            Finance & Leadership ({reportsList.filter((r) => r.sector === 'Finance & Leadership').length})
          </button>
        </div>

        {/* Reports Grid */}
        <div className="reports-grid">
          {filteredReports.map((report) => (
            <div key={report.id} className="report-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'var(--dr-active)',
                    color: 'var(--brand-purple)'
                  }}
                >
                  {report.sector}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setReportsList((prev) =>
                      prev.map((item) => (item.id === report.id ? { ...item, isFavorite: !item.isFavorite } : item))
                    );
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: report.isFavorite ? '#f59e0b' : 'var(--text-muted)' }}
                  title="Toggle Favorite"
                >
                  <Star size={16} fill={report.isFavorite ? '#f59e0b' : 'none'} />
                </button>
              </div>

              <h4 className="report-card-title">{report.name}</h4>
              <p className="report-card-desc">{report.description}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Cpu size={12} /> {report.agent}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} /> {report.plantsCovered}
                </div>
              </div>

              <div className="report-card-actions">
                <span style={{ fontSize: '11px', color: 'var(--status-success)', fontWeight: 600 }}>
                  ● {report.dataFreshness || 'Live'}
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setViewingReport(report)}
                    style={{ padding: '5px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Eye size={13} /> View
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setToastMessage(`Downloading ${report.name} (PDF)...`);
                      setTimeout(() => setToastMessage(''), 2500);
                    }}
                    style={{ padding: '5px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Download size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODAL 1: VIEW REPORT MODAL WITH PREVIEW                       */}
      {/* ============================================================= */}
      {viewingReport && (
        <div className="settings-modal-backdrop" onClick={() => setViewingReport(null)}>
          <div className="settings-modal-card" style={{ width: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-purple)', textTransform: 'uppercase' }}>
                  {viewingReport.sector}
                </span>
                <h3 className="settings-modal-title">{viewingReport.name}</h3>
                <p className="settings-modal-subtitle">{viewingReport.agent} • {viewingReport.plantsCovered}</p>
              </div>
              <button
                type="button"
                className="facility-action-btn"
                onClick={() => setViewingReport(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="settings-modal-body">
              {/* Executive Metrics Strip */}
              {viewingReport.metrics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {viewingReport.metrics.map((m, mIdx) => (
                    <div key={mIdx} style={{ padding: '10px 12px', borderRadius: '10px', background: 'var(--kg-bg-2)', border: '1px solid rgba(var(--line-rgb), 0.08)' }}>
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: 600 }}>{m.label}</div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* AI Summary Breakdown */}
              {viewingReport.summary && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(111, 61, 186, 0.06)', borderLeft: '3px solid var(--brand-purple)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-purple)', textTransform: 'uppercase' }}>Key Operational Finding</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '3px' }}>{viewingReport.summary.fact}</div>
                  </div>

                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.06)', borderLeft: '3px solid #0ea5e9' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0ea5e9', textTransform: 'uppercase' }}>Root Cause Analysis</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '3px' }}>{viewingReport.summary.likelyReason}</div>
                  </div>

                  <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.06)', borderLeft: '3px solid #10b981' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>AI Executive Recommendation</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', marginTop: '3px' }}>{viewingReport.summary.recommendation}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="settings-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setViewingReport(null)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setToastMessage(`Exported ${viewingReport.name} to PDF!`);
                  setViewingReport(null);
                  setTimeout(() => setToastMessage(''), 2500);
                }}
              >
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 2: CUSTOM REPORT BUILDER WIZARD                         */}
      {/* ============================================================= */}
      {showBuilderModal && (
        <div className="settings-modal-backdrop" onClick={() => setShowBuilderModal(false)}>
          <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <div>
                <h3 className="settings-modal-title">Custom Report Builder</h3>
                <p className="settings-modal-subtitle">Synthesize multi-agent data across any domain, facility, or measure.</p>
              </div>
              <button type="button" className="facility-action-btn" onClick={() => setShowBuilderModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="settings-modal-body">
              <div className="settings-form-group">
                <label className="settings-input-label">Report Topic / Domain</label>
                <select className="settings-input">
                  {SECTORS_LIST.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="settings-form-group">
                <label className="settings-input-label">Target Manufacturing Plant</label>
                <select className="settings-input">
                  {plantsList.map((p) => (
                    <option key={p.id} value={p.plantName}>{p.plantName}</option>
                  ))}
                </select>
              </div>

              <div className="settings-form-group">
                <label className="settings-input-label">Date Horizon</label>
                <select className="settings-input">
                  <option value="Live Shifts">Live Shifts (Today)</option>
                  <option value="This Month">Month to Date (MTD)</option>
                  <option value="Q4">Quarter 4 Benchmark</option>
                </select>
              </div>

              <div className="settings-form-group">
                <label className="settings-input-label">Export Format</label>
                <select className="settings-input">
                  <option value="PDF">Adobe PDF (Executive Print Ready)</option>
                  <option value="Excel">Microsoft Excel (.xlsx)</option>
                  <option value="CSV">Raw Telemetry CSV</option>
                </select>
              </div>
            </div>

            <div className="settings-modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowBuilderModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setToastMessage('Synthesizing custom report across agents...');
                  setShowBuilderModal(false);
                  setTimeout(() => setToastMessage('Custom report generated and added to library!'), 1500);
                  setTimeout(() => setToastMessage(''), 3500);
                }}
              >
                <Sparkles size={14} /> Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 3: SCHEDULE REPORT DELIVERY MODAL                       */}
      {/* ============================================================= */}
      {showScheduleModal && (
        <div className="settings-modal-backdrop" onClick={() => setShowScheduleModal(false)}>
          <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <div>
                <h3 className="settings-modal-title">Schedule Automated Report</h3>
                <p className="settings-modal-subtitle">Auto-deliver operational intelligence briefings via Email or Teams.</p>
              </div>
              <button type="button" className="facility-action-btn" onClick={() => setShowScheduleModal(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="settings-modal-body">
              <div className="settings-form-group">
                <label className="settings-input-label">Report Selection</label>
                <select className="settings-input">
                  {reportsList.map((r) => (
                    <option key={r.id} value={r.name}>{r.name} ({r.sector})</option>
                  ))}
                </select>
              </div>

              <div className="settings-form-group">
                <label className="settings-input-label">Delivery Frequency</label>
                <select className="settings-input">
                  <option value="Daily">Daily at 06:45 AM IST (Shift Handover)</option>
                  <option value="Weekly">Weekly on Monday at 07:00 AM IST</option>
                  <option value="Monthly">Monthly on 1st at 06:00 AM IST</option>
                </select>
              </div>

              <div className="settings-form-group">
                <label className="settings-input-label">Recipients / Stakeholder Group</label>
                <input
                  type="text"
                  placeholder="e.g. director@gwcdata.ai, plant-heads@gwcdata.ai"
                  defaultValue="Company Owner & Plant Operations Leadership"
                  className="settings-input"
                />
              </div>

              <div className="settings-form-group">
                <label className="settings-input-label">Delivery Channel</label>
                <select className="settings-input">
                  <option value="Email">Secure Email (PDF & Excel Attachment)</option>
                  <option value="Teams">Microsoft Teams Webhook Channel</option>
                  <option value="WhatsApp">WhatsApp Executive Summary</option>
                </select>
              </div>
            </div>

            <div className="settings-modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setToastMessage('Automated recurring report schedule created!');
                  setShowScheduleModal(false);
                  setTimeout(() => setToastMessage(''), 3000);
                }}
              >
                <Clock size={14} /> Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
