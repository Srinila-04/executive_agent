// Master Agent Configuration Registry
// Exactly TWO plants: Chennai (Tamil Nadu) and Bangalore (Karnataka)

export const PLANTS = [
  { id: 'ALL', name: 'All Plants', state: 'National', code: 'ALL' },
  { id: 'IN-TN-01', name: 'Chennai (TN)', state: 'Tamil Nadu', code: 'IN-TN-01', city: 'Chennai' },
  { id: 'IN-KA-01', name: 'Bangalore (Karnataka)', state: 'Karnataka', code: 'IN-KA-01', city: 'Bangalore' }
];

export const PLANT_LINES = {
  'ALL': [
    { id: 'ALL', name: 'All Lines (Chennai & Bangalore)' },
    { id: 'CHN-L1', name: 'Chennai - SMT Line 1', plantId: 'IN-TN-01' },
    { id: 'CHN-L2', name: 'Chennai - Wave Line 2', plantId: 'IN-TN-01' },
    { id: 'BLR-L1', name: 'Bangalore - Press Line 1', plantId: 'IN-KA-01' },
    { id: 'BLR-L2', name: 'Bangalore - Assembly Line 2', plantId: 'IN-KA-01' }
  ],
  'IN-TN-01': [
    { id: 'ALL', name: 'All Chennai Lines (4 Lines)' },
    { id: 'CHN-L1', name: 'SMT Placement Line 1' },
    { id: 'CHN-L2', name: 'Nitrogen Wave Line 2' },
    { id: 'CHN-L3', name: 'Conformal Coating Line 3' },
    { id: 'CHN-L4', name: 'Box Build & Test Line 4' }
  ],
  'IN-KA-01': [
    { id: 'ALL', name: 'All Bangalore Lines (4 Lines)' },
    { id: 'BLR-L1', name: '800T Tandem Press Line 1' },
    { id: 'BLR-L2', name: 'High-Speed Wire Harness Line 2' },
    { id: 'BLR-L3', name: 'ECU Enclosure Assembly Line 3' },
    { id: 'BLR-L4', name: 'Ultrasonic Inspection Cell 4' }
  ]
};

export const SHIFTS = [
  { id: 'ALL', name: 'All Shifts (24 Hours)' },
  { id: 'A', name: 'Shift A (06:00 - 14:00)' },
  { id: 'B', name: 'Shift B (14:00 - 22:00)' },
  { id: 'C', name: 'Shift C (22:00 - 06:00)' }
];

export const DATE_PRESETS = [
  { id: 'today', name: 'Today' },
  { id: '7d', name: 'Last 7 days' },
  { id: '30d', name: 'Last 30 days' },
  { id: 'quarter', name: 'This quarter' },
  { id: 'custom', name: 'Custom range' }
];

export const AGENT_GROUPS = [
  { id: 'plan', name: 'Plan', description: 'Master production scheduling & takt demand planning' },
  { id: 'produce', name: 'Produce', description: 'Overall equipment effectiveness & real-time digital twin' },
  { id: 'quality', name: 'Quality', description: 'First pass yield, vision AI, engineering change & genealogy' },
  { id: 'maintain', name: 'Maintain', description: 'Predictive health, vibration telemetry & remaining useful life' },
  { id: 'supply_chain', name: 'Supply Chain', description: 'Dynamic buffer inventory, supplier OTIF, RFQs & dispatch' },
  { id: 'safety_people', name: 'Safety & People', description: 'Workplace EHS, incident prevention & workforce skills' },
  { id: 'cost_energy', name: 'Cost & Energy', description: 'Unit manufacturing economics & smart energy consumption' }
];

export const AGENTS_CONFIG = [
  // 1. Production Planning
  {
    id: 'production-planning',
    name: 'Production Planning',
    shortName: 'Planning',
    group: 'plan',
    status: 'live',
    appUrl: 'https://production-planning-khaki.vercel.app/#Overview',
    apiBase: 'https://production-planning-khaki.vercel.app/api',
    endpoints: ['/overview/solutions', '/plan-sets/latest', '/orders/upload'],
    icon: 'Calendar',
    accentColor: '#8b5cf6',
    mission: 'Autonomous master scheduling, dynamic takt pacing, and shortage-free line allocation.'
  },
  // 2. Production Monitoring (Coming soon)
  {
    id: 'production-monitoring',
    name: 'Production Monitoring',
    shortName: 'Monitoring',
    group: 'plan',
    status: 'coming_soon',
    appUrl: null,
    apiBase: null,
    endpoints: [],
    icon: 'Activity',
    accentColor: '#94a3b8',
    mission: 'Real-time SCADA and machine signal ingestion across edge gateways (Q1 roadmap).'
  },
  // 3. OEE Performance
  {
    id: 'oee-performance',
    name: 'OEE Performance',
    shortName: 'OEE',
    group: 'produce',
    status: 'live',
    appUrl: 'https://oee-performance-agent.vercel.app/',
    apiBase: 'https://oee-performance-agent.vercel.app/api',
    endpoints: ['/snapshot', '/runs', '/capability/machines'],
    icon: 'Gauge',
    accentColor: '#6366f1',
    mission: 'Tracks Availability, Performance efficiency, and Quality yield across lines in real time.'
  },
  // 4. Digital Twin
  {
    id: 'digital-twin',
    name: 'Digital Twin',
    shortName: 'Twin',
    group: 'produce',
    status: 'live',
    appUrl: 'https://digital-twin-frontend-c0ji.onrender.com/',
    apiBase: null,
    endpoints: [],
    icon: 'Box',
    accentColor: '#8b5cf6',
    mission: '3D physical-to-virtual simulation sync, bottleneck prediction, and cycle validation.'
  },
  // 5. Quality Management
  {
    id: 'quality-management',
    name: 'Quality Management',
    shortName: 'Quality',
    group: 'quality',
    status: 'live',
    appUrl: 'https://quality-management-agent-app.vercel.app',
    apiBase: null,
    endpoints: [],
    icon: 'ShieldCheck',
    accentColor: '#10b981',
    mission: 'Statistical process control (SPC), first pass yield tracking, and defect root-cause containment.'
  },
  // 6. Vision AI Inspection
  {
    id: 'vision-ai-inspection',
    name: 'Vision AI Inspection',
    shortName: 'Vision AI',
    group: 'quality',
    status: 'live',
    appUrl: 'https://vision-ai-inspection-agent-app.vercel.app/',
    apiBase: 'https://vision-ai-inspection-agent-app.vercel.app/api',
    endpoints: ['/inspection/entry', '/prod/review/stats'],
    icon: 'Eye',
    accentColor: '#0ea5e9',
    mission: 'Edge computer vision defect classification, solder bridge detection, and surface inspection.'
  },
  // 7. Engineering Change Management
  {
    id: 'engineering-change',
    name: 'Engineering Change Management',
    shortName: 'ECN & BOM',
    group: 'quality',
    status: 'live',
    appUrl: 'https://manufacturing-ai-frontend.vercel.app',
    apiBase: 'https://manufacturing-ai-frontend.vercel.app/api',
    endpoints: ['/changes', '/lineage/graph', '/bom/confirm-item-intelligence'],
    icon: 'GitPullRequest',
    accentColor: '#3b82f6',
    mission: 'Orchestrates engineering change notices, BOM synchronization, and cut-in schedule control.'
  },
  // 8. Product Traceability
  {
    id: 'product-traceability',
    name: 'Product Traceability',
    shortName: 'Traceability',
    group: 'quality',
    status: 'live',
    appUrl: 'https://product-traceability-rho.vercel.app/',
    apiBase: null,
    endpoints: [],
    icon: 'Search',
    accentColor: '#14b8a6',
    mission: 'Component-to-finished-good serial genealogy, quarantine ring-fencing, and birth history logs.'
  },
  // 9. Predictive Maintenance
  {
    id: 'predictive-maintenance',
    name: 'Predictive Maintenance',
    shortName: 'Maintenance',
    group: 'maintain',
    status: 'live',
    appUrl: 'https://predictive-maintenance-frontend-kappa.vercel.app/',
    apiBase: 'https://predictive-maintenance-frontend-kappa.vercel.app/api',
    endpoints: ['/cases', '/machines/register/read'],
    icon: 'Wrench',
    accentColor: '#f59e0b',
    mission: 'Vibration pattern diagnostics, RUL forecasting, and automated lubrication work orders.'
  },
  // 10. Inventory Management
  {
    id: 'inventory-management',
    name: 'Inventory Management',
    shortName: 'Inventory',
    group: 'supply_chain',
    status: 'live',
    appUrl: 'https://inventory-managment-agent.vercel.app/',
    apiBase: null,
    endpoints: [],
    icon: 'Package',
    accentColor: '#10b981',
    mission: 'Dynamic buffer safety-stock sizing, stockout prevention, and slow-moving capital minimization.'
  },
  // 11. Supplier Performance
  {
    id: 'supplier-performance',
    name: 'Supplier Performance',
    shortName: 'Suppliers',
    group: 'supply_chain',
    status: 'live',
    appUrl: 'https://supplier-performance-agent-frontend-sable.vercel.app/',
    apiBase: null,
    endpoints: [],
    icon: 'Building2',
    accentColor: '#059669',
    mission: 'Supplier OTIF scoring, incoming defect PPM surveillance, and vendor risk matrix analytics.'
  },
  // 12. Agentic RFQ Management
  {
    id: 'agentic-rfq',
    name: 'Agentic RFQ Management',
    shortName: 'Sourcing & RFQ',
    group: 'supply_chain',
    status: 'live',
    appUrl: 'https://manufacturing-rfq-poc.vercel.app',
    apiBase: null,
    endpoints: [],
    icon: 'FileText',
    accentColor: '#0ea5e9',
    mission: 'Autonomous procurement bid collation, quote normalization, and cost avoidance optimization.'
  },
  // 13. Logistics and Dispatch
  {
    id: 'logistics-dispatch',
    name: 'Logistics and Dispatch',
    shortName: 'Logistics',
    group: 'supply_chain',
    status: 'live',
    appUrl: 'https://logistics-dispatch-gamma.vercel.app/',
    apiBase: null,
    endpoints: [],
    icon: 'Truck',
    accentColor: '#2563eb',
    mission: 'Dock bay turnaround scheduling, in-transit fleet telematics tracking, and on-time dispatch.'
  },
  // 14. Customer Order Management
  {
    id: 'customer-order',
    name: 'Customer Order Management',
    shortName: 'Orders',
    group: 'supply_chain',
    status: 'live',
    appUrl: 'https://customer-order-management-two.vercel.app/monitoring',
    apiBase: 'https://customer-order-management-two.vercel.app/api',
    endpoints: ['/conversations', '/auth/department-mappings'],
    icon: 'CheckSquare',
    accentColor: '#10b981',
    mission: 'End-to-end customer order fulfillment pacing, backlog visibility, and OTIF shipment guarantees.'
  },
  // 15. EHS and Safety
  {
    id: 'ehs-safety',
    name: 'EHS and Safety',
    shortName: 'EHS & Safety',
    group: 'safety_people',
    status: 'live',
    appUrl: 'https://frontend-dhob.onrender.com',
    apiBase: 'https://frontend-dhob.onrender.com/api/v1',
    endpoints: ['/analytics/overview', '/detection/models/status'],
    icon: 'Shield',
    accentColor: '#ef4444',
    mission: 'Vision AI PPE compliance enforcement, incident hazard tracking, and zero lost-time injury assurance.'
  },
  // 16. Workforce Management
  {
    id: 'workforce-management',
    name: 'Workforce Management',
    shortName: 'Workforce',
    group: 'safety_people',
    status: 'live',
    appUrl: 'https://workforce-management-navy.vercel.app/',
    apiBase: null,
    endpoints: [],
    icon: 'Users',
    accentColor: '#f97316',
    mission: 'Shift headcount roster allocation, technician skill-matrix balancing, and overtime controls.'
  },
  // 17. Manufacturing Cost
  {
    id: 'manufacturing-cost',
    name: 'Manufacturing Cost',
    shortName: 'Cost & Variance',
    group: 'cost_energy',
    status: 'live',
    appUrl: 'https://mfc-agent-frontend.vercel.app/home',
    apiBase: null,
    endpoints: [],
    icon: 'DollarSign',
    accentColor: '#3b82f6',
    mission: 'Granular unit cost calculations, scrap loss monetization, and material variance ledger analysis.'
  },
  // 18. Energy Management
  {
    id: 'energy-management',
    name: 'Energy Management',
    shortName: 'Energy',
    group: 'cost_energy',
    status: 'live',
    appUrl: 'https://energy-gules.vercel.app/',
    apiBase: 'https://energy-gules.vercel.app/api',
    endpoints: ['/health'],
    icon: 'Zap',
    accentColor: '#eab308',
    mission: 'Specific energy consumption (kWh/unit), peak tariff load shifting, and Scope 2 carbon accounting.'
  },
  // 19. Utilities Management (Coming soon)
  {
    id: 'utilities-management',
    name: 'Utilities Management',
    shortName: 'Utilities',
    group: 'cost_energy',
    status: 'coming_soon',
    appUrl: null,
    apiBase: null,
    endpoints: [],
    icon: 'Droplet',
    accentColor: '#94a3b8',
    mission: 'Chilled water loop, compressed air header, and nitrogen generation telemetry (Q1 roadmap).'
  }
];
