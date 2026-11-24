// Comprehensive Static Dataset for Home Radial Network & Interactive Presentation Deck
// 6 Factory Domains & 20 Industrial Autonomous Agents

export const HOME_PLATFORM_CORE = {
  id: 'platform_core',
  name: 'GWC Data.AI',
  fullName: 'Autonomous Manufacturing Intelligence Platform',
  tagline: 'End-to-end multi-agent autonomous operations across 6 smart production facilities',
  description: 'Enterprise operational command grid synchronizing real-time telemetry, predictive reliability, closed-loop quality inspection, resilient supply chains, and plant-wide financial margin governance.',
  stats: [
    { label: 'Connected Plants', val: '6 Smart Facilities' },
    { label: 'Autonomous Systems', val: '20 Active Systems' },
    { label: 'Operational Uptime', val: '99.4%' },
    { label: 'Annual Value Created', val: '₹14.8 Cr+' }
  ],
  capabilities: [
    'Sub-second PLC edge telemetry ingestion across 120+ production lines',
    'Real-time predictive maintenance stopping unplanned spindle failures',
    'Autonomous multi-vendor RFQ scoring and dynamic buffer stock leveling',
    'Closed-loop vision quality inspection running at 38ms inference speed'
  ],
  lead: 'Enterprise Operations Command Lead',
  status: 'All 6 Domains Synchronized'
};

export const HOME_SECTORS = [
  {
    id: 'production',
    name: 'Production & Planning',
    shortName: 'Production',
    code: 'DOM_01',
    color: '#8b5cf6',
    colorSoft: 'rgba(139, 92, 246, 0.15)',
    iconName: 'Factory',
    customIconUrl: '/production_icon.png',
    agentCount: 4,
    health: 'optimal',
    statusChip: 'SYSTEMS RUNNING • 87.4% OEE',
    previewMetric: 'OEE 87.4% • 11.2k Units',
    ticker: 'SCADA EDGE • Line 03 OEE 87.4% • Press #04 Takt 39.8s • 11,280 Daily Units • SAP S/4HANA Synced',
    tagline: 'Finite capacity scheduling, live takt tracking & digital twin simulations',
    description: 'Eliminates micro-stoppages on high-speed press and assembly lines while continuously re-sequencing multi-model production orders to meet changing OEM dispatch windows.',
    metrics: [
      { label: 'Plan Adherence', val: '98.2%', sub: 'Target: >95.0%', spark: [88, 91, 93, 94, 96, 98.2] },
      { label: 'Line OEE', val: '87.4%', sub: 'Benchmark: 85.0%', spark: [81, 83, 84, 85, 86, 87.4] },
      { label: 'Takt Pacing', val: '39.8s', sub: 'Target: 42.0s/unit', spark: [44, 43, 42, 41, 40.5, 39.8] },
      { label: 'Daily Output', val: '11,280 Units', sub: 'Target: 12,000', spark: [9800, 10200, 10600, 10900, 11100, 11280] }
    ],
    capabilities: [
      'Finite capacity scheduling synchronized with SAP S/4HANA order backlog',
      'Real-time takt pace variance tracking and micro-stop root-cause alerts',
      '6-Big-Loss OEE Pareto waterfall analysis and speed derating correction',
      '3D discrete-event plant twin simulation for line buffer optimization'
    ],
    lead: 'VP of Manufacturing & Industrial Engineering',
    agents: [
      {
        id: 1,
        agentNumber: 1,
        code: 'PROD_PLANNING',
        name: 'Production Planning System',
        iconName: 'Calendar',
        health: 'optimal',
        statusChip: 'ONLINE • DISPATCH SYNCED',
        previewMetric: 'Plan: 98.2%',
        tagline: 'Plan the right product, quantity, and sequence at finite capacity',
        description: 'Dynamically balances open customer orders against machine die changeover constraints, tool life limits, and material availability to generate optimized shift run-plans.',
        kpis: [
          { label: 'Plan Adherence', val: '98.2%', spark: [92, 94, 95, 96, 97, 98.2] },
          { label: 'Schedule Attainment', val: '95.4%', spark: [90, 91, 93, 94, 95, 95.4] },
          { label: 'Changeover Time', val: '24 min', spark: [36, 32, 29, 27, 25, 24] },
          { label: 'Die Allocation', val: '100% Synced', spark: [100, 100, 100, 100, 100, 100] }
        ],
        inputs: 'SAP S/4HANA production orders, OEM delivery deadlines, press die change matrix.',
        outputs: 'Optimized 3-shift production schedule, automated raw material call-off slips.',
        owner: 'Operations Team Lead 01'
      },
      {
        id: 2,
        agentNumber: 2,
        code: 'PROD_MONITORING',
        name: 'Live Production Monitoring System',
        iconName: 'Activity',
        tagline: 'Live shop floor telemetry & micro-stop pre-emption across lines',
        description: 'Ingests sub-second photoelectric counter pulses and PLC cycle states to detect sub-3-minute micro-stoppages and line starvation before shift output slips.',
        kpis: [
          { label: 'Current Output', val: '11,280 Units' },
          { label: 'Takt Efficiency', val: '94.0%' },
          { label: 'Micro-Stop Alerts', val: '<2 min response' },
          { label: 'Bottleneck Index', val: 'Line 03 Clear' }
        ],
        inputs: 'PLC sub-second count pulses, photoelectric beam counters, shift handover logs.',
        outputs: 'Sub-3 min micro-stop alerts, live bottleneck detection, hourly attainment boards.',
        owner: 'Operations Team Lead 02'
      },
      {
        id: 3,
        agentNumber: 3,
        code: 'OEE_PERF',
        name: 'Equipment Effectiveness (OEE) System',
        iconName: 'Sliders',
        tagline: 'Availability, performance & quality loss Pareto decomposition',
        description: 'Breaks down every lost production second into the 6 Big Losses, giving production superintendents exact visibility into whether speed derating, minor stops, or ramp-up scrap caused losses.',
        appUrl: 'https://oee-performance-agent.vercel.app/',
        kpis: [
          { label: 'Overall OEE', val: '87.4%' },
          { label: 'Availability', val: '92.1%' },
          { label: 'Performance', val: '95.8%' },
          { label: 'Quality Rate', val: '98.9%' }
        ],
        inputs: 'Machine downtime reason codes, planned vs actual cycle times, scrap counts.',
        outputs: 'Automated 6-Big-Loss Pareto waterfall, speed derating recommendations.',
        owner: 'Maintenance & OEE Lead 03'
      },
      {
        id: 19,
        agentNumber: 19,
        code: 'DIGITAL_TWIN',
        name: 'Digital Plant Twin & Simulation',
        iconName: 'Cpu',
        tagline: '3D discrete-event simulation & bottleneck pre-emption',
        description: 'Executes thousands of Monte Carlo simulation runs ahead of actual production shifts to stress-test layout bottlenecks, AGV travel paths, and buffer sizes.',
        appUrl: 'https://digital-twin-frontend-c0ji.onrender.com/',
        kpis: [
          { label: 'Simulation Fidelity', val: '99.1%' },
          { label: 'Scenario Run Speed', val: '<45s' },
          { label: 'AGV Congestion', val: '0 Bottlenecks' },
          { label: 'Buffer Sizing', val: 'Optimized' }
        ],
        inputs: 'Live plant layout 3D coordinates, AGV velocity vectors, machine cycle standard deviations.',
        outputs: 'Simulated shift outcomes, buffer sizing recommendations, AGV dispatch routes.',
        owner: 'Simulation & Digital Twin Lead 19'
      }
    ]
  },
  {
    id: 'maintenance',
    name: 'Maintenance & Utilities',
    shortName: 'Maintenance',
    code: 'DOM_02',
    color: '#f59e0b',
    colorSoft: 'rgba(245, 158, 11, 0.15)',
    iconName: 'Wrench',
    agentCount: 3,
    health: 'warning',
    statusChip: 'PREDICTIVE WATCH • 14D WARNING',
    previewMetric: '0 Stops • 14d Lead Warning',
    ticker: 'VIBRATION LIVE • 248 Assets Monitored • Substation 33kV Off-Peak • Air Header 6.8 Bar Steady',
    tagline: 'Predictive vibration analytics, dynamic peak tariff reduction & utilities reliability',
    description: 'Eliminates catastrophic machine downtime through high-frequency acoustic bearing telemetry and optimizes plant power and compressed air usage against state electricity pricing tiers.',
    metrics: [
      { label: 'Unplanned Stops', val: '0 Incidents', sub: 'Last 180 Days', spark: [3, 2, 1, 0, 0, 0] },
      { label: 'Peak Tariff Cut', val: '-18.4%', sub: '₹2.1 Cr Saved', spark: [-10, -12, -14, -16, -17.5, -18.4] },
      { label: 'Header Pressure', val: '6.8 Bar', sub: 'Zero Leaks', spark: [6.4, 6.5, 6.7, 6.8, 6.8, 6.8] },
      { label: 'MTBF Uptime', val: '96.8%', sub: 'Target: >95.0%', spark: [93, 94, 95.2, 95.8, 96.4, 96.8] }
    ],
    capabilities: [
      'Continuous 24/7 accelerometer vibration and motor thermography monitoring',
      'Automated CMMS work orders pre-booking maintenance during planned shift breaks',
      'Time-of-day tariff optimization shifting energy-intensive heating to cheaper hours',
      'Acoustic ultrasonic leak detection across compressed air and nitrogen loops'
    ],
    lead: 'Head of Plant Reliability & Sustainability',
    agents: [
      {
        id: 4,
        agentNumber: 4,
        code: 'PREDICTIVE_MAINT',
        name: 'Predictive Maintenance System',
        iconName: 'Wrench',
        tagline: 'Vibration & acoustic bearing degradation pre-emption',
        description: 'Continuously monitors rotating machinery for high-frequency micro-wear, issuing warning tickets 14 days before bearing failure can seize stamping presses.',
        kpis: [
          { label: 'Breakdown Reduction', val: '-35.0%' },
          { label: 'Warning Lead Time', val: '14 Days' },
          { label: 'Monitored Assets', val: '248 Machines' },
          { label: 'CMMS Auto-Tickets', val: '100% Automated' }
        ],
        inputs: 'High-frequency accelerometer vibration (ISO 10816), motor casing thermography.',
        outputs: 'Automated CMMS work order generation, proactive replacement part reservation.',
        owner: 'Reliability Engineering Lead 04'
      },
      {
        id: 13,
        agentNumber: 13,
        code: 'ENERGY_MGMT',
        name: 'Energy Management & Tariff System',
        iconName: 'Zap',
        tagline: 'Time-of-day tariff optimization & power factor governance',
        description: 'Monitors incoming 33kV substation feeder telemetry and state utility pricing tiers to sequence power-heavy annealing furnaces away from peak surcharge windows.',
        appUrl: 'https://energy-gules.vercel.app/',
        kpis: [
          { label: 'Energy Cost/Unit', val: '₹7.42/kWh' },
          { label: 'Peak Load Shift', val: '1.2 MW' },
          { label: 'Annual Bill Cut', val: '₹42 Lakhs' },
          { label: 'Power Factor', val: '0.98 Inductive' }
        ],
        inputs: '33kV Substation digital energy meters, state utility peak tariff schedules.',
        outputs: 'Automated furnace/press staggering, dynamic power factor capacitor switching.',
        owner: 'Energy & Sustainability Lead 13'
      },
      {
        id: 17,
        agentNumber: 17,
        code: 'UTILITIES',
        name: 'Utilities & Facilities Management',
        iconName: 'Flame',
        tagline: 'Compressed air, chilled water & nitrogen line monitoring',
        description: 'Governs industrial utility loops including compressed air ring mains, cooling towers, and nitrogen blankets to prevent pressure drops that starve pneumatic pick-and-place robots.',
        kpis: [
          { label: 'Air Pressure', val: '6.8 Bar' },
          { label: 'Acoustic Leaks', val: '0 Active' },
          { label: 'Chilled Water Loop', val: '7.2°C Steady' },
          { label: 'Compressor Power', val: 'Optimal VFD' }
        ],
        inputs: 'Ultrasonic acoustic flow sensors, chiller loop temperature RTDs, compressor VFDs.',
        outputs: 'Autonomous pressure modulation, predictive filter replacement dispatch.',
        owner: 'Facilities Operations Lead 17'
      }
    ]
  },
  {
    id: 'quality',
    name: 'Quality & Engineering',
    shortName: 'Quality',
    code: 'DOM_03',
    color: '#0284c7',
    colorSoft: 'rgba(2, 132, 199, 0.15)',
    iconName: 'ShieldCheck',
    agentCount: 4,
    health: 'optimal',
    statusChip: 'AOI ACTIVE • 38ms INFERENCE',
    previewMetric: 'FPY 98.4% • 38ms Edge',
    ticker: 'OPTICAL INSPECT • 38ms GigE Stream • FPY 98.4% • Zero Open CAPA • 14.2M Parts Serialized',
    tagline: 'Automated optical inspection, sub-second genealogy & engineering revision control',
    description: 'Enforces flawless product quality through high-speed edge camera AI and provides instant end-to-end component genealogy from raw sheet coil to final customer vehicle shipment.',
    metrics: [
      { label: 'First Pass Yield', val: '98.4%', sub: 'Target: >97.5%', spark: [96.2, 96.8, 97.4, 97.9, 98.1, 98.4] },
      { label: 'Vision Latency', val: '38ms', sub: 'High-Speed Edge', spark: [52, 48, 44, 41, 39, 38] },
      { label: 'Genealogy Speed', val: '<400ms', sub: 'Instant Trace', spark: [480, 450, 420, 390, 360, 340] },
      { label: 'CAPA Resolution', val: '<24 Hrs', sub: 'Zero Open NCs', spark: [48, 36, 30, 26, 24, 22] }
    ],
    capabilities: [
      '38ms computer vision inspection detecting micro-cracks and weld spatter',
      'Automated 8D CAPA generation routing non-conformances to responsible supplier docks',
      'Instant forward and backward serial genealogy tracing across 10 years of production',
      'BOM revision cut-in governance eliminating obsolete inventory scrap'
    ],
    lead: 'Chief Quality Officer & VP of Metrology',
    agents: [
      {
        id: 5,
        agentNumber: 5,
        code: 'QUALITY_MGMT',
        name: 'Quality Management & Inspection System',
        iconName: 'ShieldCheck',
        tagline: 'Non-conformance containment & automated 8D CAPA workflows',
        description: 'Monitors first-pass yield across automated test benches, instantly raising digital containment quarantine flags when tolerance drift approaches upper statistical control limits.',
        kpis: [
          { label: 'FPY Attainment', val: '98.4%' },
          { label: 'Scrap Rate', val: '0.8%' },
          { label: '8D CAPA Cycles', val: '<24 Hrs' },
          { label: 'Quarantine Locks', val: 'Automated' }
        ],
        inputs: 'Coordinate Measuring Machine (CMM) reports, manual inspector digital tablets.',
        outputs: 'Immediate scrap containment locks, supplier chargeback debit notices.',
        owner: 'Quality Assurance Lead 05'
      },
      {
        id: 6,
        agentNumber: 6,
        code: 'VISION_INSPECTION',
        name: 'Automated Optical Inspection (AOI)',
        iconName: 'Eye',
        tagline: '38ms edge computer vision inspection on high-speed lines',
        description: 'High-speed GigE optical cameras paired with edge tensor processors inspect stampings, welds, and coatings at 38ms per part, firing pneumatic ejectors for defective units.',
        kpis: [
          { label: 'Inference Speed', val: '38ms' },
          { label: 'Defect Catch Rate', val: '99.98%' },
          { label: 'False Reject Rate', val: '<0.05%' },
          { label: 'Defect Heatmap', val: 'Live 4K' }
        ],
        inputs: '4K GigE high-speed camera streams over robotic welding and surface stamping.',
        outputs: 'Instant pneumatic part reject actuator trigger, defect heatmap classification.',
        owner: 'Metrology & Vision Lead 06'
      },
      {
        id: 7,
        agentNumber: 7,
        code: 'ENG_CHANGE',
        name: 'Engineering Change & BOM System',
        iconName: 'FileText',
        tagline: 'Multi-plant BOM synchronization & cut-in effectivity governance',
        description: 'Bridges PLM CAD updates with plant ERP routings, ensuring revision cut-ins occur precisely when old inventory balances run dry to eliminate obsolete stock write-downs.',
        kpis: [
          { label: 'BOM Sync Rate', val: '100%' },
          { label: 'Obsolescence Scrap', val: '₹0' },
          { label: 'Cut-In Accuracy', val: 'Flawless' },
          { label: 'ECN Approvals', val: '<12 Hrs' }
        ],
        inputs: 'PLM Teamcenter engineering change notices (ECN), CAD revision models.',
        outputs: 'Automated shop floor router cut-in dates, legacy inventory run-out plans.',
        owner: 'Engineering Systems Lead 07'
      },
      {
        id: 8,
        agentNumber: 8,
        code: 'TRACEABILITY',
        name: 'Product Traceability & Genealogy',
        iconName: 'ScanLine',
        tagline: 'Instant backward & forward component genealogy reconstruction',
        description: 'Scans 2D DataMatrix serial codes at every station, building an immutable digital passport linking supplier heat lot, torque angles, and operator IDs for every shipped product.',
        kpis: [
          { label: 'Trace Query Latency', val: '340ms' },
          { label: 'Recall Scope', val: '<0.5%' },
          { label: 'Archived Serials', val: '14.2M Parts' },
          { label: 'Audit Compliance', val: 'ISO 9001/IATF' }
        ],
        inputs: 'Laser-etched 2D DataMatrix serial scans, supplier coil heats, torque tool records.',
        outputs: 'Instant backward & forward genealogy trees, audited digital certificate of conformity.',
        owner: 'Traceability & Compliance Lead 08'
      }
    ]
  },
  {
    id: 'supplychain',
    name: 'Supply Chain & Logistics',
    shortName: 'Supply Chain',
    code: 'DOM_04',
    color: '#10b981',
    colorSoft: 'rgba(16, 185, 129, 0.15)',
    iconName: 'Truck',
    agentCount: 5,
    health: 'optimal',
    statusChip: 'BUFFERS LEVELED • 96.8% OTIF',
    previewMetric: 'OTIF 96.8% • 14.2d Buffer',
    ticker: 'LOGISTICS LIVE • 64 Fleet Trucks • 14.2d Cover Buffer • ASRS High-Bay 98.5% • Zero Expedited Freight',
    tagline: 'Dynamic inventory buffers, supplier OTIF scoring, automated RFQ comparison & customer fulfillment',
    description: 'Protects assembly line continuity with zero part shortage halts while freeing up excess working capital through AI-calibrated safety stock buffers and real-time transit tracking.',
    metrics: [
      { label: 'Supplier OTIF', val: '96.8%', sub: 'Target: >95.0%', spark: [91, 92.5, 94, 95.2, 96.1, 96.8] },
      { label: 'Stock Buffer', val: '14.2 Days', sub: 'Zero Starvation', spark: [18, 17, 16.2, 15.4, 14.8, 14.2] },
      { label: 'Order Fulfillment', val: '98.9%', sub: 'On-Time SLA', spark: [95, 96.2, 97.1, 98, 98.5, 98.9] },
      { label: 'Capital Freed', val: '₹1.2 Cr', sub: 'Buffer Optimized', spark: [0.4, 0.6, 0.8, 1.0, 1.1, 1.2] }
    ],
    capabilities: [
      'Dynamic safety stock buffer calculation responding to machine cycle demand',
      'Continuous supplier delivery scorecard ranking punctuality, quality PPM, and lead times',
      'Automated multi-vendor RFQ quote parsing and landed-cost benchmarking',
      'Live IoT GPS dispatch fleet monitoring with predictive dock turn-around ETA'
    ],
    lead: 'VP of Global Supply Chain & Logistics',
    agents: [
      {
        id: 9,
        agentNumber: 9,
        code: 'INVENTORY_OPT',
        name: 'Smart Inventory & Stock Buffer System',
        iconName: 'Boxes',
        tagline: 'Dynamic safety stock leveling & working capital governance',
        description: 'Continuously balances machine consumption against supplier replenishment lead times to maintain optimal parts buffers without tying up excess factory working capital.',
        kpis: [
          { label: 'Days of Cover', val: '14.2 Days' },
          { label: 'Working Capital Cut', val: '-12.4%' },
          { label: 'Stockout Halts', val: '0 Incidents' },
          { label: 'ASRS Slotting', val: '98.5% Optimal' }
        ],
        inputs: 'ASRS high-bay warehouse slot telemetry, SAP stock balances, supplier lead times.',
        outputs: 'Dynamic reorder point recalculation, stock redistribution across multi-state depots.',
        owner: 'Materials Management Lead 09'
      },
      {
        id: 10,
        agentNumber: 10,
        code: 'SUPPLIER_PERF',
        name: 'Supplier Performance & Vendor Scorecard',
        iconName: 'ShieldAlert',
        tagline: 'Tier-1 vendor reliability, incoming defect PPM & delivery scorecards',
        description: 'Ranks tier-1 suppliers on delivery punctuality, dock rejection PPM, and invoice variance, dynamically recommending re-routing purchase volume to top performers.',
        kpis: [
          { label: 'Vendor OTIF', val: '96.8%' },
          { label: 'Incoming Defect PPM', val: '<25 PPM' },
          { label: 'Scored Suppliers', val: '142 Vendors' },
          { label: 'Late PO Penalty', val: 'Auto-Calculated' }
        ],
        inputs: 'Gate-in electronic delivery notes, automated weighbridge logs, QC dock inspects.',
        outputs: 'Automated vendor risk rating, dynamic allocation shift to top-performing suppliers.',
        owner: 'Supplier Quality Lead 10'
      },
      {
        id: 11,
        agentNumber: 11,
        code: 'RFQ_MGMT',
        name: 'Automated Sourcing & RFQ Manager',
        iconName: 'DollarSign',
        tagline: 'Multi-quote evaluation, landed cost benchmarking & automated award',
        description: 'Parses vendor bids, raw material indexes, and freight surcharges in seconds to generate executive cost-comparison matrices for new tooling and part sourcing.',
        kpis: [
          { label: 'Quote Speed', val: '3.2 Days' },
          { label: 'Purchase Savings', val: '₹1.8 Cr' },
          { label: 'Bids Compared', val: '100% Automated' },
          { label: 'Award Turnaround', val: '<48 Hrs' }
        ],
        inputs: 'BOM part requirement requisitions, vendor quote submissions, raw material commodity indices.',
        outputs: 'Automated supplier comparison matrix, purchase order recommendation drafts.',
        owner: 'Strategic Procurement Lead 11'
      },
      {
        id: 12,
        agentNumber: 12,
        code: 'LOGISTICS',
        name: 'Logistics & Dispatch Fleet Tracker',
        iconName: 'Truck',
        tagline: 'Live GPS truck transit tracking & carrier dock turnaround control',
        description: 'Tracks delivery trucks via IoT GPS and toll plaza beacons to give plants precise arrival estimates, eliminating gate congestion and detention demurrage fees.',
        kpis: [
          { label: 'Transit Visibility', val: '99.4%' },
          { label: 'Dock Turnaround', val: '<45 min' },
          { label: 'Expedited Freight', val: '₹0 Fees' },
          { label: 'Active Fleet', val: '64 Trucks' }
        ],
        inputs: 'IoT GPS vehicle beacons, FASTag toll plaza milestones, gate RFID scanners.',
        outputs: 'Predictive ETA calculation, automated dock gate assignment, carrier detention alerts.',
        owner: 'Logistics & Fleet Lead 12'
      },
      {
        id: 18,
        agentNumber: 18,
        code: 'CUSTOMER_ORDER',
        name: 'Customer Order Fulfillment Intelligence',
        iconName: 'CheckCircle2',
        tagline: 'Available-to-promise commitments & OEM delivery SLA monitoring',
        description: 'Connects warehouse finished-goods staging with customer shipping schedules, ensuring 100% dependable on-time fulfillment without emergency air freight costs.',
        kpis: [
          { label: 'On-Time Fulfillment', val: '98.9%' },
          { label: 'Backlog Orders', val: '1,500 Synced' },
          { label: 'Dispatch Speed', val: 'Same-Day' },
          { label: 'SLA Penalties', val: '₹0 Incurred' }
        ],
        inputs: 'OEM customer EDI portals, warehouse finished goods dispatch status, credit limits.',
        outputs: 'Real-time available-to-promise commitments, automated dispatch documentation.',
        owner: 'Customer Fulfillment Lead 18'
      }
    ]
  },
  {
    id: 'employees',
    name: 'Employees & Safety',
    shortName: 'Safety & People',
    code: 'DOM_05',
    color: '#f43f5e',
    colorSoft: 'rgba(244, 63, 94, 0.15)',
    iconName: 'Users',
    agentCount: 2,
    health: 'optimal',
    statusChip: '100% COMPLIANT • ZERO LTI',
    previewMetric: '428 Days Zero LTI',
    ticker: 'EHS TELEMETRY • 428 Days Zero LTI • 100% Digital LOTO Pass • 1,310 Certified Operators Deployed',
    tagline: 'Zero-incident safety culture, digital LOTO permits & certified skill allocation',
    description: 'Guarantees shop floor workforce safety and operational compliance through digital lockout/tagout permits, ergonomics monitoring, and automated certified operator scheduling.',
    metrics: [
      { label: 'Safety Record', val: '428 Days', sub: 'Zero Lost-Time Injury', spark: [360, 380, 400, 412, 420, 428] },
      { label: 'Staffing Level', val: '98.4%', sub: '1,310 / 1,335 Workers', spark: [95, 96, 96.8, 97.5, 98, 98.4] },
      { label: 'Permit Pass Rate', val: '100%', sub: 'Digital LOTO', spark: [100, 100, 100, 100, 100, 100] },
      { label: 'Cross-Trained', val: '128 Techs', sub: 'Ready Deploy', spark: [96, 104, 112, 118, 124, 128] }
    ],
    capabilities: [
      'Digital Lockout/Tagout (LOTO) permit validation before heavy maintenance energization',
      'Real-time certified skill matching ensuring only qualified technicians operate CNC presses',
      'Automated shift attendance tracking predicting absenteeism bottlenecks 30 min before shift start',
      'Computer vision ergonomics and PPE compliance monitoring across assembly cells'
    ],
    lead: 'Head of EHS & Plant Human Resources',
    agents: [
      {
        id: 14,
        agentNumber: 14,
        code: 'WORKFORCE_MGMT',
        name: 'Workforce Skill & Attendance Allocator',
        iconName: 'Users',
        tagline: 'Certified skill matrix matching & dynamic line staffing allocation',
        description: 'Scans operator certification matrices to ensure hazardous robotic cells and high-precision presses are staffed only by trained and certified operators.',
        kpis: [
          { label: 'Staffing Attainment', val: '98.4%' },
          { label: 'Skill Matrix Match', val: '100%' },
          { label: 'Absenteeism Fill', val: '<15 min' },
          { label: 'Certified Techs', val: '1,310 Active' }
        ],
        inputs: 'Biometric turnstile punches, HR skill qualification database, daily production manning tables.',
        outputs: 'Automated line station assignments, certified reserve tech re-deployment alerts.',
        owner: 'Workforce Operations Lead 14'
      },
      {
        id: 15,
        agentNumber: 15,
        code: 'SAFETY_EHS',
        name: 'Safety & Environmental Incident System',
        iconName: 'AlertTriangle',
        tagline: 'Digital LOTO permits, near-miss logging & zero lost-time compliance',
        description: 'Governs high-risk plant activities with digital permits, ensuring electrical circuits and hydraulic valves are locked out before maintenance begins.',
        kpis: [
          { label: 'Incident-Free Days', val: '428 Days' },
          { label: 'Near-Miss Closure', val: '99.2%' },
          { label: 'LOTO Pass Rate', val: '100%' },
          { label: 'OSHA/EHS Rating', val: 'Zero Violations' }
        ],
        inputs: 'Digital Lockout/Tagout QR smart locks, near-miss mobile reporting, CCTV hazard alerts.',
        outputs: 'Instant machine lockout interlocks, EHS root-cause corrective action schedules.',
        owner: 'Plant Safety & EHS Lead 15'
      }
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Master Data',
    shortName: 'Finance & Master',
    code: 'DOM_06',
    color: '#6366f1',
    colorSoft: 'rgba(99, 102, 241, 0.15)',
    iconName: 'DollarSign',
    agentCount: 2,
    health: 'optimal',
    statusChip: 'REAL-TIME MARGIN GOVERNED',
    previewMetric: 'Unit Cost: ₹142.50',
    ticker: 'MARGIN STREAM • ₹142.50 Unit Cost • Shift P&L <5min • Multi-Plant Fleet ROI ₹14.8 Cr',
    tagline: 'Real-time shift unit costing, margin leakage warnings & operations decision center',
    description: 'Provides executives with live shift-by-shift profitability insights, pinpointing cost variance and margin erosion from scrap or overtime in real time instead of at month-end.',
    metrics: [
      { label: 'Margin Variance', val: '±0.8%', sub: 'Target: <±2.0%', spark: [1.8, 1.5, 1.2, 1.0, 0.9, 0.8] },
      { label: 'Cost-Per-Unit', val: '₹142.50', sub: 'Calculated Live', spark: [154, 150, 147, 145, 143.2, 142.5] },
      { label: 'Shift P&L Speed', val: '<5 min', sub: 'Immediate Post-Shift', spark: [30, 20, 15, 10, 6, 5] },
      { label: 'Budget Precision', val: '99.2%', sub: 'Plant Network', spark: [96.5, 97.2, 98, 98.6, 99, 99.2] }
    ],
    capabilities: [
      'Sub-minute unit cost accumulation tracking material, energy, labor, and machine depreciation',
      'Real-time margin erosion alerts triggered when scrap or tooling exceeds budget limits',
      'Multi-plant executive benchmarking ranking plant profitability across 6 locations',
      'Master data synchronization harmonizing SAP ERP, MES, and PLM registries'
    ],
    lead: 'Chief Financial Officer & VP of Enterprise Systems',
    agents: [
      {
        id: 16,
        agentNumber: 16,
        code: 'FINANCE_COST',
        name: 'Manufacturing Unit Cost & Margin System',
        iconName: 'DollarSign',
        tagline: 'Live shift-by-shift part costing & subtle margin leakage detection',
        description: 'Calculates the true cost-per-part in real time by aggregating steel coil weight, cycle energy, direct labor, and tooling wear as parts roll off the line.',
        appUrl: 'https://mfc-agent-frontend.vercel.app/home',
        kpis: [
          { label: 'Unit Cost Precision', val: '₹142.50' },
          { label: 'Margin Leak Warnings', val: 'Live Alerts' },
          { label: 'Scrap Cost Impact', val: '<0.4%' },
          { label: 'Shift Reconciliation', val: '<5 min' }
        ],
        inputs: 'Actual scrap counts, energy meter tariffs, line speed derating, raw material batch invoices.',
        outputs: 'Shift-wise gross margin statement, variance escalation to plant controllers.',
        owner: 'Finance & Cost Accounting Lead 16'
      },
      {
        id: 20,
        agentNumber: 20,
        code: 'EXEC_DECISION',
        name: 'Executive Operations Decision Center',
        iconName: 'LayoutDashboard',
        tagline: 'Multi-plant fleet intelligence & executive decision matrix',
        description: 'Harmonizes data from all 19 systems across all 6 factory facilities into an executive decision hub with automated scenario evaluation and capital allocation recommendations.',
        kpis: [
          { label: 'Plants Coordinated', val: '6 Facilities' },
          { label: 'Executive Health Index', val: '98.5%' },
          { label: 'Decision Velocity', val: '<1 Hour' },
          { label: 'Network ROI', val: '₹14.8 Cr' }
        ],
        inputs: 'Aggregated KPIs from Production, Maintenance, Quality, Supply Chain, and Finance marts.',
        outputs: 'Autonomous plant load-balancing recommendations, executive weekly operating reviews.',
        owner: 'Chief Operating Officer & Enterprise Lead 20'
      }
    ]
  }
];
