// Complete End-to-End System Architecture Data
// 8 Numbered Stages connecting Shop Floor to Executive Decisions

export const architectureData = {
  header: {
    title: 'Manufacturing Agentic AI Platform: System Architecture',
    tagline: 'From shop floor data to executive decisions',
    pill: '20 Agents | Multi-Plant | Live'
  },
  stages: [
    {
      id: 'stage-1',
      number: 1,
      title: 'SOURCE SYSTEMS',
      subtitle: 'Plants across multiple states and districts',
      bannerColor: '#dc2626', // Red banner
      category: 'Shop Floor & Enterprise Systems',
      caption: 'Plants in Tamil Nadu, Maharashtra, Gujarat, Haryana, Karnataka',
      iconType: 'factory',
      simpleSummary: 'Operational machinery, enterprise ERPs, and sensors in multi-state manufacturing facilities generate live telemetry 24/7.',
      detailedSummary: 'OPC-UA, Modbus, MQTT, and RFC/REST connections stream physical machine states, MES part cycle times, and ERP transaction logs.',
      inputs: [
        'Physical CNC machines, stamping presses, welding robots, conveyor PLCs',
        'SAP S/4HANA production orders and bill of materials (BOM)',
        'MECPL MES real-time shift counters and scrap logs',
        'Facility sub-meter power readings (kW, power factor, harmonic distortion)'
      ],
      processing: [
        'Continuous sensor sampling at millisecond intervals on PLCs',
        'Operator tablet barcode scanning at production staging lines',
        'ERP batch posting of purchase orders, stock reserves, and delivery milestones'
      ],
      outputs: [
        'Raw telemetry payloads with machine timestamps',
        'CSV, JSON, and binary telemetry batches awaiting ingestion',
        'Shop floor emergency alarms and safety trip states'
      ],
      components: [
        { name: 'Shop Floor Machines', role: 'Presses, CNC, Robotics, PLCs', icon: 'Cpu' },
        { name: 'MECPL MES System', role: 'Cycle counts, takt time, scrap', icon: 'Layers' },
        { name: 'SAP S/4HANA / ERP', role: 'BOMs, purchase orders, orders', icon: 'Boxes' },
        { name: 'CMMS Maintenance', role: 'Asset registers, work orders', icon: 'Wrench' },
        { name: 'QMS Quality Logs', role: 'First-pass yield, defect codes', icon: 'ShieldCheck' },
        { name: 'WMS / Manhattan', role: 'Inventory bins, pick/pack/ship', icon: 'Truck' },
        { name: 'Energy & Utility Meters', role: 'Power factor, gas, steam, air', icon: 'Zap' },
        { name: 'HRMS Shift Rosters', role: 'Operator skills, attendance', icon: 'Users' },
        { name: 'Excel / Manual Files', role: 'Plant targets, budget sheets', icon: 'FileSpreadsheet' }
      ]
    },
    {
      id: 'stage-2',
      number: 2,
      title: 'CONNECTORS LAYER',
      subtitle: 'Admin-managed zero-trust integration mesh',
      bannerColor: '#7c3aed', // Purple banner
      category: 'Secure Gateways',
      caption: 'Configured by Admin via Connectors Page',
      iconType: 'plug',
      simpleSummary: 'Admin selects and manages certified data connectors with read-only credentials, isolating the company network.',
      detailedSummary: 'Mutual TLS (mTLS), token-authenticated REST gateways, and secure VPN reverse-proxies enforce read-only zero-trust boundaries.',
      inputs: [
        'Secure credentials configured in Enterprise Connectors UI',
        'Motherson dedicated intermediate gateway (IP: 10.244.101.228)',
        'SAP RFC endpoints and Manhattan WMS webhook listeners'
      ],
      processing: [
        'Automated authentication handshake and token rotation every 60 min',
        'Inbound rate limiting, IP whitelisting, and payload decryption',
        'Heartbeat telemetry polling every 10 seconds to detect connector health'
      ],
      outputs: [
        'Verified secure data streams ready for automated ingestion',
        'Real-time connector health signals (Connected / Disconnected)',
        'Audit trail of all administrative connection events'
      ],
      bullets: [
        'Admin selects the connectors from the Connectors page',
        'Secure, read-only access by default',
        'Connection health: connected / disconnected'
      ],
      connectorsList: [
        { name: 'SAP S/4HANA', status: 'connected', type: 'ERP' },
        { name: 'Manhattan WMS', status: 'connected', type: 'Supply Chain' },
        { name: 'MECPL MES', status: 'connected', type: 'Shop Floor' },
        { name: 'CMMS REST', status: 'connected', type: 'Maintenance' },
        { name: 'Excel / CSV', status: 'connected', type: 'Manual' },
        { name: 'Live Webhooks', status: 'connected', type: 'Streaming' }
      ]
    },
    {
      id: 'stage-3',
      number: 3,
      title: 'DATA INGESTION AND ETL',
      subtitle: 'Automated Python transformation pipeline',
      bannerColor: '#7c3aed', // Purple banner
      category: 'Data Engineering',
      caption: 'Extract, Validate, Transform, Standardise',
      iconType: 'cog',
      simpleSummary: 'Extracts data from all plants, cleans conflicting formats, and tags every record with plant, state, and shift.',
      detailedSummary: 'Python Pandas / Polars pipelines standardize UTC timestamps, deduplicate sensor bursts, and resolve SKU taxonomies.',
      inputs: [
        'Raw telemetry payloads from 9 source connector types',
        'Master plant metadata table (districts, lines, machine IDs)',
        'Shift calendar tables defining 3-shift 8-hour rotations'
      ],
      processing: [
        'Format validation: checks nulls, data types, and out-of-range anomalies',
        'Unit standardization: normalizes Celsius/Fahrenheit, metric tons/kg, INR/USD',
        'Tagging: injects { plant_id, state, line_id, shift_num, supervisor_id }'
      ],
      outputs: [
        'Standardized relational schemas conforming to unified enterprise models',
        'Data quality scorecard (99.8% schema validation compliance)',
        'Clean staging tables ready for central data warehouse persistence'
      ],
      bullets: [
        'Extract data from every connector',
        'Validate, clean and standardise (units, codes, time)',
        'Tag each record with plant, state, line and shift'
      ]
    },
    {
      id: 'stage-4',
      number: 4,
      title: 'SCHEDULER AND LIVE EVENTS',
      subtitle: 'Dual-frequency automation engine',
      bannerColor: '#7c3aed', // Purple banner
      category: 'Orchestration',
      caption: '10-Minute Cycles + Millisecond Alarms',
      iconType: 'clock-bolt',
      simpleSummary: 'Runs regular sync jobs every 10 minutes while instantly intercepting urgent machine alarms and downtime events.',
      detailedSummary: 'Windows Task Scheduler orchestrates 10-minute batch syncs; event webhooks process urgent telemetry alarms with auto-retries.',
      inputs: [
        'Cron triggers firing on 10-minute cadence (:00, :10, :20, :30, :40, :50)',
        'Real-time webhook alarm events from vibration and safety sensors',
        'Job execution logs tracking latency and batch record counts'
      ],
      processing: [
        'Automated task scheduler queues Python ETL scripts in parallel threads',
        'Exponential back-off retry logic (up to 3 retries) on network flakiness',
        'Failure logger writing telemetry alerts directly to notifications broker'
      ],
      outputs: [
        'Guaranteed fresh data every 10 minutes across all 6 plant facilities',
        'Sub-second incident event routing for emergency machine halts',
        'Full execution audit logs for enterprise compliance'
      ],
      bullets: [
        'Scheduled refresh every 10 minutes',
        'Live events for alarms and downtime',
        'Retries and failure logging'
      ]
    },
    {
      id: 'stage-5',
      number: 5,
      title: 'CENTRAL DATA STORE',
      subtitle: 'Governed multi-plant enterprise warehouse',
      bannerColor: '#7c3aed', // Purple banner
      category: 'Storage & Governance',
      caption: 'SQL Server / SSMS + Neon PostgreSQL',
      iconType: 'database',
      simpleSummary: 'A single, high-speed warehouse that keeps plant data partitioned, securely isolated, and stored for long-term trends.',
      detailedSummary: 'Row-level security (RLS) partitions multi-plant data across state boundaries with columnar indexing for sub-20ms queries.',
      inputs: [
        'Cleaned, tagged batches from Stage 3 ETL pipeline',
        'Historical maintenance work orders and inspection images',
        'Historical time-series tables going back 36 months'
      ],
      processing: [
        'Tenant and plant isolation via cryptographic schema partitioning',
        'Automated continuous indexing for fast analytical query execution',
        'Write-ahead logging (WAL) ensuring zero data loss during power disruptions'
      ],
      outputs: [
        'Certified golden tables querying production, OEE, cost, and safety',
        'High-speed read replicas powering the 19 AI agents and BI engines',
        'Immutable historical audit trails preserving compliance records'
      ],
      bullets: [
        'One governed data warehouse',
        'Separate and secure by plant and tenant',
        'History kept for trends and audit'
      ]
    },
    {
      id: 'stage-6',
      number: 6,
      title: '19 SPECIALISED AGENTS',
      subtitle: 'Cross-functional autonomous intelligence mesh',
      bannerColor: '#2563eb', // Large Blue Panel
      category: 'Autonomous Operations Fleet',
      caption: '6 Functional Sectors • Every agent recommends, humans approve',
      iconType: 'bot-grid',
      simpleSummary: '19 dedicated operational agents continuously analyze their domain, spot risks, and compute recommendations.',
      detailedSummary: 'Domain-specific ML algorithms, physics models, and heuristic solvers run in parallel to detect micro-deviations and simulate outcomes.',
      inputs: [
        'Live warehouse tables from Stage 5 Central Data Store',
        'Domain operational parameters (takt time, defect tolerances, supplier lead times)',
        'Feedback and approval history from the Admin Web Portal (Stage 8)'
      ],
      processing: [
        'Predictive modeling (e.g. RUL bearing vibration forecasting on Unit 07)',
        'Constraint optimization (e.g. shift balancing on Line 03 with zero overtime)',
        'Optical anomaly classification (e.g. 14-micron burr detection in 38ms)',
        'Dynamic RFQ evaluation ranking supplier quotes by price and delivery'
      ],
      outputs: [
        'Actionable recommendations formatted with Impact, Urgency, and Risk',
        'Continuous telemetry health status signals (running, warning, stopped)',
        'Domain KPI rollups sent upstream to Executive Agent 20'
      ],
      sectors: [
        {
          id: 'sec-prod',
          title: 'Production and Planning',
          color: '#6f3dba',
          agents: [
            { num: 1, name: 'Production Planning', tag: 'Shift Scheduling & Takt' },
            { num: 2, name: 'Production Monitoring', tag: 'Real-Time Line Output' },
            { num: 3, name: 'OEE Performance', tag: 'Avail, Speed & Quality Loss' },
            { num: 19, name: 'Digital Twin', tag: 'Virtual Floor Physics Sim' }
          ]
        },
        {
          id: 'sec-maint',
          title: 'Maintenance and Utilities',
          color: '#4d8eeb',
          agents: [
            { num: 4, name: 'Predictive Maintenance', tag: 'Bearing Vibration & RUL' },
            { num: 13, name: 'Energy Management', tag: 'Peak Tariff Load Shaving' },
            { num: 17, name: 'Utilities Management', tag: 'Water, Compressed Air & Steam' }
          ]
        },
        {
          id: 'sec-quality',
          title: 'Quality and Engineering',
          color: '#10b981',
          agents: [
            { num: 5, name: 'Quality Management', tag: 'First-Pass Yield & Scrap' },
            { num: 6, name: 'Vision AI Inspection', tag: '38ms Optical Surface QA' },
            { num: 7, name: 'Engineering Change', tag: 'ECN & BOM Revision Cut-in' },
            { num: 8, name: 'Product Traceability', tag: 'QR Serial Genealogy Tree' }
          ]
        },
        {
          id: 'sec-supply',
          title: 'Supply Chain and Customers',
          color: '#f58a3a',
          agents: [
            { num: 9, name: 'Inventory Management', tag: 'Safety Stock & Reorder PO' },
            { num: 10, name: 'Supplier Performance', tag: 'Vendor Scorecard & OTIF' },
            { num: 11, name: 'RFQ Management', tag: 'Automated Quote Sourcing' },
            { num: 12, name: 'Logistics and Dispatch', tag: 'Dedicated Truck Tracking' },
            { num: 18, name: 'Customer Order', tag: 'Order ATP/CTP Fulfillment' }
          ]
        },
        {
          id: 'sec-people',
          title: 'People and Safety',
          color: '#e45c72',
          agents: [
            { num: 14, name: 'EHS and Safety', tag: 'Zero Incidents & LOTO Audits' },
            { num: 15, name: 'Workforce Management', tag: 'Skill Matrix & Absentee Shift' }
          ]
        },
        {
          id: 'sec-finance',
          title: 'Finance',
          color: '#8b5cf6',
          agents: [
            { num: 16, name: 'Manufacturing Cost', tag: 'Cost / Unit & Margin Leakage' }
          ]
        }
      ]
    },
    {
      id: 'stage-7',
      number: 7,
      title: 'EXECUTIVE DECISION INTELLIGENCE AGENT',
      subtitle: 'Agent 20: The Company Owner Cockpit Brain',
      bannerColor: '#d97706', // Gold / Dark Panel highlight
      category: 'Master Orchestration',
      caption: 'Synthesizes All 19 Agents • Highlights Decisions',
      iconType: 'crown-brain',
      isHighlight: true,
      simpleSummary: 'Combines all 19 agents into one executive view, surfaces the exact choices needing the owner’s approval, and tracks impact.',
      detailedSummary: 'Cross-agent correlation engine synthesizes macro KPIs, extracts root-cause narratives, and filters high-impact decision vectors.',
      inputs: [
        'Real-time findings, alerts, and recommendations from Agents 1 through 19',
        'Cross-agent risk correlations (e.g. inventory shortage + customer delivery penalty)',
        'Owner authorization preferences and multi-plant delegation rules'
      ],
      processing: [
        'Macro KPI Synthesis: compiles total company output, OEE, cost/unit, and safety',
        'Tri-Factor Analysis: structures every issue into Fact → Likely Reason → Recommendation',
        'Financial Impact Ranking: orders pending decisions by monetary value and downtime risk'
      ],
      outputs: [
        'Daily Executive Brief: greeting, today’s output attainment, and pending decisions count',
        'Action cards with 1-click Approve, Reject, or Ask Details',
        'Consortium Risk Ledger protecting against delivery penalties and thermal machine seizures'
      ],
      bullets: [
        'Combines KPIs from all 19 agents',
        'Finds what changed, why and what to decide',
        'Daily brief, risk alerts, decision log'
      ],
      frameworkTags: [
        { label: 'Fact', desc: 'Verified shop floor telemetry' },
        { label: 'Likely Reason', desc: 'Cross-agent root cause analysis' },
        { label: 'Recommendation', desc: 'Pre-computed solution with financial impact' }
      ]
    },
    {
      id: 'stage-8',
      number: 8,
      title: 'ADMIN WEB PORTAL AND OUTPUTS',
      subtitle: 'Executive command cockpit and multi-stakeholder delivery',
      bannerColor: '#059669', // Green banner
      category: 'Enterprise Delivery',
      caption: 'Multi-Device Responsive Portal & Scheduled Dispatches',
      iconType: 'laptop-portal',
      simpleSummary: 'Delivers the live platform across 6 dedicated pages to the company owner and plant heads with 1-click decision authorization.',
      detailedSummary: 'Responsive React portal rendering real-time telemetry, Power BI embedded semantic models, and instant mobile alerts.',
      inputs: [
        'Live intelligence feeds from Agent 20 Executive Intelligence',
        'Real-time WebSocket alerts from the telemetry broker',
        'User interactions and approval actions from the Admin UI'
      ],
      processing: [
        'Interactive state updates dispatching human decisions back to Stage 6 agents',
        'Automated generation and distribution of daily PDF shift summaries',
        'Audit logging recording timestamp, user ID, and decision rationale'
      ],
      outputs: [
        'Executive Overview: Top KPIs, Plant Map, Decisions Waiting For You, Risk Ledger',
        'Agents Page: Interactive node graph showing 19 agents organized by sectors',
        'Enterprise Connectors: Live connection table for SAP, Manhattan, MES, etc.',
        'Notifications: High-priority disruption warnings with recovery suggestions',
        'Company Settings: Multi-state district plant hubs and notification channels',
        'Operations Advisor: Right-bottom chat assistant answering company queries'
      ],
      portalPages: [
        { name: 'Overview', icon: 'BarChart3', desc: 'Daily brief & KPI scorecard' },
        { name: 'Agents', icon: 'Cpu', desc: '19 node fleet & sector hierarchy' },
        { name: 'Connectors', icon: 'Boxes', desc: 'SAP, WMS & MES connections' },
        { name: 'Settings', icon: 'Settings', desc: 'Multi-state plant hubs' },
        { name: 'Notifications', icon: 'Bell', desc: 'Real-time alert dispatch' },
        { name: 'Chat Assistant', icon: 'MessageSquare', desc: '24/7 operations intelligence' }
      ],
      consumers: [
        { title: 'Company Owner / Admin', role: 'Full multi-state visibility & final sign-off' },
        { title: 'Plant General Managers', role: 'Facility throughput & shift execution' },
        { title: 'Approvals Engine', role: 'Instant 1-click Approve / Reject dispatch' },
        { title: 'Executive Daily Reports', role: 'Automated 07:00 AM management brief' }
      ]
    }
  ],
  feedbackLoops: [
    {
      id: 'loop-monitoring',
      from: 'Stage 6 (19 Agents)',
      to: 'Stage 8 (Notifications)',
      label: 'Monitoring & Disruption Alerts',
      desc: 'Monitoring: if any agent stops or fails, an alert goes to the Notifications page (and email/WhatsApp) with the reason.'
    },
    {
      id: 'loop-approval',
      from: 'Stage 8 (Admin Portal)',
      to: 'Stage 6 (19 Agents) → Stage 1 (Source Systems)',
      label: 'Closed-Loop Authorizations',
      desc: 'Admin approvals go back to the agents and then to source systems (e.g. ERP PO generation, machine lubrication schedule).'
    }
  ],
  bottomStrip: [
    { title: 'Higher Productivity', icon: 'TrendingUp', metric: '+3.2% Output' },
    { title: 'Better Quality', icon: 'ShieldCheck', metric: '98.2% First-Pass Yield' },
    { title: 'Lower Costs', icon: 'DollarSign', metric: '-6.2% Unit Cost' },
    { title: 'Safer Workplace', icon: 'Users', metric: '428 Days Zero LTI' },
    { title: 'Sustainable Manufacturing', icon: 'Zap', metric: '-8.5% Energy Shaving' }
  ]
};
