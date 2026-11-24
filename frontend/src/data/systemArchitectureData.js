// System Architecture & Solved Problems Data
// Formatted strictly in clean, non-technical business language with rich visual cards (Image 2 style).

export const SECTORS = [
  {
    id: 'maintenance',
    name: 'Equipment Maintenance & Utilities',
    shortName: 'Maintenance',
    icon: 'Wrench',
    color: '#2563eb',
    headerBg: '#1e40af',
    tagline: 'Predictive Machine Health, Energy & Plant Utilities',
    agentsCount: 3,
    agents: [
      {
        id: 4,
        agentNumber: 4,
        name: 'Predictive Machine Maintenance',
        code: 'PRED_MAINT',
        icon: 'Cog',
        tagline: 'Predict machine wear 14 days before failure',
        whatItDoes: 'Monitors continuous machine vibration, motor acoustics, and temperature 24/7 to catch equipment wear and predict bearing failure up to 14 days before a line breakdown.',
        missionCards: [
          { icon: 'Activity', title: '24/7 Vibration & Heat Sampling', desc: 'Monitors acoustic frequency, motor heat & rotational velocity.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'AlertTriangle', title: '14-Day Micro-Wear Warning', desc: 'Detects microscopic metal friction weeks before equipment stalls.', bg: '#fefce8', color: '#ca8a04' },
          { icon: 'Calendar', title: 'Automated Off-Shift Repair', desc: 'Pre-books maintenance work orders and reserves spare parts.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Machine Health Score', val: '92% Optimal', badge: 'Live Status', color: '#2563eb' },
          { icon: 'Clock', title: 'Remaining Useful Life', val: '14 Days RUL', badge: 'Bearing 07', color: '#7c3aed' },
          { icon: 'CheckCircle2', title: 'Preventive Work Orders', val: '2 Scheduled', badge: 'Next Shift', color: '#16a34a' },
          { icon: 'TrendingUp', title: 'Bearing Wear Index', val: '0.04mm Drift', badge: 'Safe Range', color: '#0284c7' }
        ],
        outcomesList: [
          { icon: 'TrendingUp', title: 'Downtime Reduction', val: '↓ 35% Stoppages', desc: 'Zero catastrophic seizures', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'DollarSign', title: 'Repair Cost Avoidance', val: '₹1.8 Cr Saved', desc: 'Prevented spindle loss', bg: '#ecfdf5', color: '#059669' },
          { icon: 'ShieldCheck', title: 'Plant Fleet Availability', val: '96.8% Uptime', desc: '6 multi-state facilities', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Continuous acoustic and vibration intelligence protecting heavy production equipment from unexpected stoppages.',
          howItWorks: [
            'Monitors rotational vibration, motor heat, and electrical current across all critical presses, CNCs, and motors in real time.',
            'Identifies microscopic metal wear and friction anomalies weeks before any visible breakdown or operator symptom.',
            'Autonomously reserves replacement parts from inventory and schedules repair work during planned shift pauses.'
          ],
          inputsMonitored: 'Vibration velocity, motor temperature sensors, acoustic decibels, machine operating hours, lubrication logs.',
          outputsProduced: 'Remaining equipment lifespan forecast, proactive work orders, automated maintenance alerts.',
          businessValue: 'Zero catastrophic equipment failures, ₹1.8 Cr saved annually in emergency repair costs, 96.8% machine uptime.',
          liveStatus: 'Active & Protecting 6 Plant Facilities'
        }
      },
      {
        id: 13,
        agentNumber: 13,
        name: 'Energy Cost & Tariff Optimizer',
        code: 'ENERGY_MGMT',
        icon: 'Zap',
        tagline: 'Shift heavy power loads away from expensive peak tariff hours',
        whatItDoes: 'Monitors factory electricity consumption and automatically aligns heavy machine cycles with low-cost utility hours, avoiding expensive peak-hour grid surcharges.',
        missionCards: [
          { icon: 'Zap', title: 'Live Substation Grid Watch', desc: 'Monitors factory power draw against utility pricing bands.', bg: '#fefce8', color: '#ca8a04' },
          { icon: 'Clock', title: 'Off-Peak Load Rescheduling', desc: 'Sequences power-heavy ovens and heaters during cheaper hours.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'AlertTriangle', title: 'Demand Surcharge Protection', desc: 'Alerts plant managers before penalty thresholds are breached.', bg: '#fff1f2', color: '#e11d48' }
        ],
        reportsList: [
          { icon: 'Zap', title: 'Factory Power Demand', val: '4.8 MW Draw', badge: 'Substation 02', color: '#eab308' },
          { icon: 'Clock', title: 'Tariff State Meter', val: 'Off-Peak Tier', badge: 'Night Window', color: '#2563eb' },
          { icon: 'DollarSign', title: 'Energy Cost per Unit', val: '₹4.20 / Part', badge: '-8.5% YoY', color: '#16a34a' },
          { icon: 'TrendingUp', title: 'Carbon Footprint Saved', val: '14.2 Tons CO₂', badge: 'Eco Goal', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'DollarSign', title: 'Monthly Bill Reduction', val: '↓ 8.5% Bills', desc: 'Lower tariff expenses', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'TrendingUp', title: 'Peak Surcharge Avoided', val: '₹42 Lakhs Saved', desc: 'No demand penalties', bg: '#ecfdf5', color: '#059669' },
          { icon: 'ShieldCheck', title: 'Grid Load Stability', val: '99.4% Compliant', desc: 'Zero utility trip fees', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Smart energy schedule coordination that lowers utility costs without slowing down production delivery.',
          howItWorks: [
            'Tracks commercial utility tariff schedules, maximum demand limits, and live sub-meter readings across all factory lines.',
            'Collaborates with production planning to run energy-heavy ovens, compressors, and heaters during cheaper off-peak hours.',
            'Alerts plant managers before factory power demand crosses utility penalty thresholds.'
          ],
          inputsMonitored: 'Substation energy meters, electricity tariff rates, active machine power draw, production schedules.',
          outputsProduced: 'Energy-optimized production schedule, demand peak warnings, monthly utility savings audit.',
          businessValue: '8.5% reduction in total energy bills, ₹42 Lakhs saved annually in power demand surcharges.',
          liveStatus: 'Active & Optimizing Grid Tariffs'
        }
      },
      {
        id: 17,
        agentNumber: 17,
        name: 'Plant Utilities & Facilities System',
        code: 'UTILITIES_MGMT',
        icon: 'Gauge',
        tagline: 'Maintain uninterrupted compressed air, cooling water and steam',
        whatItDoes: 'Oversees critical factory utilities—including compressed air lines, cooling water, and steam boilers—to stop leaks and maintain constant pressure for machinery.',
        missionCards: [
          { icon: 'Sliders', title: 'Continuous Pressure Watch', desc: 'Monitors compressed air lines, chiller loops & steam boilers.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'AlertTriangle', title: 'Micro-Leak Detection', desc: 'Catches line drops that cause automated tooling misfires.', bg: '#fefce8', color: '#ca8a04' },
          { icon: 'Wrench', title: 'Targeted Section Servicing', desc: 'Dispatches instant repair alerts for the exact leaking pipe section.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'Sliders', title: 'Air Line Pressure', val: '6.8 Bar Stable', badge: 'Lines 01-04', color: '#2563eb' },
          { icon: 'Activity', title: 'Chiller Water Loop', val: '7.2°C Optimal', badge: 'Cooling Tank', color: '#0284c7' },
          { icon: 'CheckCircle2', title: 'Water Recovery Rate', val: '94% Recycled', badge: 'Closed Loop', color: '#16a34a' },
          { icon: 'AlertTriangle', title: 'Active Utility Leaks', val: '0 Leaks Found', badge: 'Verified', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'Zap', title: 'Compressor Energy Saved', val: '12% Energy Saved', desc: 'Eliminated wasted air', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'TrendingUp', title: 'Pressure-Related Stalls', val: 'Zero Halts', desc: 'Constant tool pressure', bg: '#ecfdf5', color: '#059669' },
          { icon: 'ShieldCheck', title: 'Utility Loop Reliability', val: '99.9% Uptime', desc: 'Uninterrupted power', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Facility-wide monitoring ensuring machines have constant, uninterrupted utility power without wasteful leaks.',
          howItWorks: [
            'Monitors pneumatic air pressure lines, cooling tower water temperatures, and steam boiler pressures continuously.',
            'Detects microscopic pipeline leaks and pressure drops that waste energy and cause automated tools to misfire.',
            'Dispatches instant maintenance alerts with the exact pipe section or compressor requiring servicing.'
          ],
          inputsMonitored: 'Pneumatic pressure transducers, flow meters, water chiller temperature gauges, boiler steam logs.',
          outputsProduced: 'Utility health status, pipeline leak detection alerts, facility maintenance work orders.',
          businessValue: 'Eliminates machine stalls due to pressure loss, cuts 12% in compressor energy waste.',
          liveStatus: 'Active & Monitoring Facility Utilities'
        }
      }
    ]
  },
  {
    id: 'production',
    name: 'Production & Operations',
    shortName: 'Operations',
    icon: 'Factory',
    color: '#6f3dba',
    headerBg: '#581c87',
    tagline: 'Shop Floor Throughput, Line Balancing & Machine Efficiency',
    agentsCount: 4,
    agents: [
      {
        id: 1,
        agentNumber: 1,
        name: 'Production Planning System',
        code: 'PROD_PLANNING',
        icon: 'Calendar',
        tagline: 'Convert customer demand into achievable, balanced daily schedules',
        whatItDoes: 'Translates customer sales orders and machine availability into balanced shift schedules, preventing bottlenecks, idle waiting, and rush order chaos.',
        missionCards: [
          { icon: 'Calendar', title: 'Demand & Capacity Balancing', desc: 'Aligns confirmed sales orders with machine run-rate availability.', bg: '#faf5ff', color: '#6f3dba' },
          { icon: 'Clock', title: 'Changeover Optimization', desc: 'Sequences part runs to eliminate unnecessary tooling swap time.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'CheckCircle2', title: 'Shift Dispatch Scheduling', desc: 'Dispatches finite shift schedules directly to plant floor lines.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Schedule Adherence', val: '98.2% Plan Match', badge: 'Active Shift', color: '#6f3dba' },
          { icon: 'Activity', title: 'Line Capacity Load', val: '92% Balanced', badge: 'All Lines', color: '#2563eb' },
          { icon: 'Clock', title: 'Avg Changeover Time', val: '14% Faster', badge: 'Tooling Queue', color: '#16a34a' },
          { icon: 'CheckCircle2', title: 'On-Time Order Readiness', val: '99.1% Ready', badge: 'Customer ATP', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'Clock', title: 'Changeover Idle Time', val: '↓ 14% Changeover', desc: 'Reduced retooling wait', bg: '#faf5ff', color: '#6f3dba' },
          { icon: 'TrendingUp', title: 'Schedule Adherence', val: '98.2% Adherence', desc: 'Accurate shift execution', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'ShieldCheck', title: 'On-Time Readiness', val: '99.1% On-Time', desc: 'No customer order delays', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Intelligent production scheduling aligning customer orders with real-time machine and worker availability.',
          howItWorks: [
            'Consolidates incoming customer orders, priority delivery dates, and finished goods inventory requirements.',
            'Checks machine tooling status, raw material buffers, operator skill rosters, and scheduled maintenance windows.',
            'Generates a balanced hourly production sequence for every line to minimize changeover downtime and avoid late orders.'
          ],
          inputsMonitored: 'Customer purchase orders, bill of materials, machine run rates, inventory availability, worker shift calendars.',
          outputsProduced: 'Optimized shift production schedule, line-wise job dispatch list, material call-off timing.',
          businessValue: '14% faster line changeovers, 98.2% schedule adherence, 99.1% on-time customer order readiness.',
          liveStatus: 'Active & Scheduling 6 Facilities'
        }
      },
      {
        id: 2,
        agentNumber: 2,
        name: 'Live Production Monitoring',
        code: 'PROD_MONITORING',
        icon: 'LayoutDashboard',
        tagline: 'Track real-time output and stop shift delays within minutes',
        whatItDoes: 'Tracks live machine cycle counts, hourly part output, and micro-delays in real time so supervisors can catch and fix slowdowns before shift targets are missed.',
        missionCards: [
          { icon: 'Activity', title: 'Live Cycle Counting', desc: 'Pulls automated station counts every few seconds across all lines.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'AlertTriangle', title: 'Bottleneck Detection', desc: 'Flags stations running slower than takt time within 3 minutes.', bg: '#fefce8', color: '#ca8a04' },
          { icon: 'CheckCircle2', title: 'Supervisor Action Push', desc: 'Sends immediate alert with root-cause fix to floor supervisors.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Live Shift Output', val: '11,280 / 12,000', badge: '94% Attainment', color: '#2563eb' },
          { icon: 'Clock', title: 'Supervisor Response', val: '< 3 Min Avg', badge: 'Fast Action', color: '#16a34a' },
          { icon: 'Activity', title: 'Shift Speedometer', val: '98.5% Takt Pace', badge: 'Normal', color: '#6f3dba' },
          { icon: 'TrendingUp', title: 'Recovered Output', val: '+8.5% Units', badge: 'Per Shift', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'Clock', title: 'Supervisor Response', val: '< 3 Min Response', desc: 'Fastest incident recovery', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'TrendingUp', title: 'Shift Output Recovered', val: '+8.5% Lost Output', desc: 'Caught before shift end', bg: '#ecfdf5', color: '#059669' },
          { icon: 'ShieldCheck', title: 'Hourly Attainment', val: '94.0% Target Met', desc: 'Continuous pace tracking', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Live line-by-line monitoring that alerts factory supervisors the moment production falls behind pace.',
          howItWorks: [
            'Receives part cycle counts and machine status signals directly from line counters every few seconds.',
            'Compares current output against the shift target and highlights stations running slower than expected takt time.',
            'Sends instant notifications to floor supervisors detailing the exact station issue and recommended action.'
          ],
          inputsMonitored: 'Sensor cycle counters, automated line counters, operator station logs, shift target benchmarks.',
          outputsProduced: 'Real-time hourly production board, line slowdown alerts, shift output reconciliation reports.',
          businessValue: 'Average supervisor response time under 3 minutes, 8.5% recovery of previously lost shift output.',
          liveStatus: 'Active & Streaming Live Shift Telemetry'
        }
      },
      {
        id: 3,
        agentNumber: 3,
        name: 'Machine Efficiency (OEE) Optimizer',
        code: 'OEE_PERFORMANCE',
        icon: 'Gauge',
        tagline: 'Maximize machine availability, speed, and quality output',
        whatItDoes: 'Measures overall machine efficiency by analyzing Availability, Running Speed, and Quality to pinpoint exactly where time and money are lost on the floor.',
        missionCards: [
          { icon: 'TrendingUp', title: 'Tri-Factor Efficiency Metric', desc: 'Calculates Availability × Speed × Quality for every machine.', bg: '#faf5ff', color: '#6f3dba' },
          { icon: 'Clock', title: 'Micro-Stop Isolation', desc: 'Separates 30-second jams from genuine mechanical breakdowns.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'DollarSign', title: 'Capacity Unlock Prioritization', desc: 'Reveals which lines can yield 10% more volume without capital spend.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Factory OEE Score', val: '86.4% Efficiency', badge: 'Top Tier', color: '#6f3dba' },
          { icon: 'Clock', title: 'Availability Loss', val: '4.2% Total Loss', badge: 'Controlled', color: '#2563eb' },
          { icon: 'Activity', title: 'Speed Variance Rate', val: '2.1% Micro-Stops', badge: 'Optimized', color: '#16a34a' },
          { icon: 'CheckCircle2', title: 'First-Pass Yield', val: '98.4% Quality', badge: 'High Quality', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'TrendingUp', title: 'Overall Equipment Yield', val: '+4.2% Capacity', desc: 'Without buying machines', bg: '#faf5ff', color: '#6f3dba' },
          { icon: 'DollarSign', title: 'Capital Spend Saved', val: '₹75 Lakhs Capex', desc: 'Extracted from existing lines', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'ShieldCheck', title: 'OEE Attainment Target', val: '86.4% Benchmark', desc: 'Industry leading standard', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Comprehensive machine efficiency analytics isolating the root causes of lost manufacturing capacity.',
          howItWorks: [
            'Analyzes machine operating time, separating planned maintenance from unplanned micro-stoppages.',
            'Evaluates actual production speed against maximum designed machine velocity to detect hidden slowdowns.',
            'Correlates reject part counts to calculate true First-Pass Yield and presents clear improvement opportunities.'
          ],
          inputsMonitored: 'Machine running hours, idle timestamps, theoretical cycle speed, reject part counts.',
          outputsProduced: 'Executive machine efficiency scorecard, speed loss diagnosis, weekly improvement priorities.',
          businessValue: '4.2% increase in plant capacity without purchasing new machinery, saving significant capital expenditure.',
          liveStatus: 'Active & Analyzing Machine Fleet'
        }
      },
      {
        id: 19,
        agentNumber: 19,
        name: 'Virtual Factory Twin Simulator',
        code: 'DIGITAL_TWIN',
        icon: 'Cpu',
        tagline: 'Simulate production line changes virtually before physical implementation',
        whatItDoes: 'Simulates full factory production flow virtually to test schedule changes, line rebalancing, and layout adjustments before testing them on real machinery.',
        missionCards: [
          { icon: 'Cpu', title: 'Virtual Floor Physics Model', desc: 'Simulates conveyors, buffers, cycle times, and machine tooling.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'TrendingUp', title: 'What-If Scenario Sandbox', desc: 'Tests 10% speed hikes or SKU changes virtually before roll-out.', bg: '#faf5ff', color: '#6f3dba' },
          { icon: 'CheckCircle2', title: 'Risk-Free Verification', desc: 'Guarantees zero physical trial-and-error stoppage hours.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Virtual Throughput Sim', val: '14,200 Parts/Day', badge: 'Projected', color: '#2563eb' },
          { icon: 'AlertTriangle', title: 'Buffer Bottleneck Risk', val: 'Station 04 Jam', badge: 'Pre-solved', color: '#ca8a04' },
          { icon: 'Clock', title: 'Retooling Downtime', val: 'Zero Trial Loss', badge: 'Pre-tested', color: '#16a34a' },
          { icon: 'TrendingUp', title: 'Line Balance Score', val: '97% Balanced', badge: 'Simulated', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'Clock', title: 'Trial-and-Error Downtime', val: 'Zero Trial Loss', desc: 'Simulated before building', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'DollarSign', title: 'Retooling Savings', val: '₹35 Lakhs Saved', desc: 'Avoided stalled shifts', bg: '#ecfdf5', color: '#059669' },
          { icon: 'ShieldCheck', title: 'Layout Verification', val: '100% Risk-Free', desc: 'Pre-validated changes', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'A virtual model of the factory floor allowing managers to test operational decisions without risk.',
          howItWorks: [
            'Builds an exact virtual replica of machine lines, conveyor speeds, part buffers, and worker stations.',
            'Runs simulated scenarios—such as increasing line speed by 10% or adding a new product variant—to reveal bottlenecks.',
            'Presents leadership with proven, risk-free configuration recommendations before physical tools are moved.'
          ],
          inputsMonitored: 'Factory CAD layouts, conveyor speeds, machine cycle times, buffer capacities, product routings.',
          outputsProduced: 'Simulated throughput reports, line rebalancing recommendations, risk impact assessments.',
          businessValue: 'Eliminates costly trial-and-error line shutdowns, saving an estimated ₹35 Lakhs in changeover losses.',
          liveStatus: 'Active & Simulating Factory Scenarios'
        }
      }
    ]
  },
  {
    id: 'quality',
    name: 'Quality Assurance & Engineering',
    shortName: 'Quality',
    icon: 'ShieldCheck',
    color: '#059669',
    headerBg: '#065f46',
    tagline: 'Zero-Defect Standards, Vision Inspection & Product Genealogy',
    agentsCount: 4,
    agents: [
      {
        id: 5,
        agentNumber: 5,
        name: 'Quality Management & Inspection',
        code: 'QUALITY_MGMT',
        icon: 'ShieldCheck',
        tagline: 'Catch quality variations early before parts leave the line',
        whatItDoes: 'Enforces strict quality inspection standards across every production lot, flagging dimension variances and defect patterns before parts leave the line.',
        missionCards: [
          { icon: 'ShieldCheck', title: 'Automated Tolerance Gate', desc: 'Samples dimensional measurements across every production station.', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'AlertTriangle', title: 'Early Scrap Drift Detection', desc: 'Halts defective lot progression before bad parts accumulate.', bg: '#fefce8', color: '#ca8a04' },
          { icon: 'CheckCircle2', title: 'Quality Compliance Audit', desc: 'Issues digital quality certificates for verified good lots.', bg: '#eff6ff', color: '#2563eb' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'First-Pass Yield Score', val: '98.4% FPY', badge: 'World Class', color: '#16a34a' },
          { icon: 'AlertTriangle', title: 'Defect Pareto Top Cause', val: 'Edge Burr (0.6%)', badge: 'Drift Warning', color: '#ca8a04' },
          { icon: 'Clock', title: 'Lot Quarantine Time', val: '< 30 Seconds', badge: 'Instant Stop', color: '#2563eb' },
          { icon: 'TrendingUp', title: 'Scrap Cost Reduction', val: '↓ 22% Less Scrap', badge: 'Monthly ROI', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'TrendingUp', title: 'Scrap Cost Reduction', val: '↓ 22% Scrap Cost', desc: 'Saved ₹65 Lakhs raw stock', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'ShieldCheck', title: 'First-Pass Yield Target', val: '98.4% Quality', desc: 'Zero defect escapes', bg: '#ecfdf5', color: '#059669' },
          { icon: 'DollarSign', title: 'Customer Claims Avoided', val: 'Zero Return Costs', desc: 'No customer warranty fees', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Rigorous quality governance stopping defective batches before they progress to subsequent assembly steps.',
          howItWorks: [
            'Collects quality measurement checkpoints and manual inspection results across each production stage.',
            'Detects subtle recurring tolerance drifts and dimensional variances before parts exceed acceptable thresholds.',
            'Quarantines suspicious production lots automatically and alerts quality supervisors with corrective guidance.'
          ],
          inputsMonitored: 'Dimensional measurements, test bench readings, manual inspection logs, defect classification codes.',
          outputsProduced: 'Quality compliance certificates, scrap cause diagnostics, lot quarantine notices.',
          businessValue: '22% reduction in scrap waste, 98.4% First-Pass Yield, zero customer defect shipments.',
          liveStatus: 'Active & Governing Quality Gates'
        }
      },
      {
        id: 6,
        agentNumber: 6,
        name: 'Automated Optical Camera Inspection',
        code: 'VISION_AI',
        icon: 'CheckCircle2',
        tagline: 'Scan 100% of finished parts at high speed with optical AI',
        whatItDoes: 'Uses high-speed cameras to inspect manufactured surfaces for hairline cracks, scratches, and burrs in under 40 milliseconds per unit.',
        missionCards: [
          { icon: 'CheckCircle2', title: '38ms Sub-Second Scan', desc: 'High-speed camera scans surface finish, edges & paint.', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'Activity', title: '99.8% Flaw Accuracy', desc: 'Classifies hairline cracks and burrs down to 14 microns.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'AlertTriangle', title: 'Pneumatic Reject Ejection', desc: 'Instantly fires reject arms to drop flawed items into scrap bin.', bg: '#fefce8', color: '#ca8a04' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Inspection Coverage', val: '100% All Units', badge: 'Full Speed', color: '#16a34a' },
          { icon: 'Activity', title: 'Inspection Speed', val: '38 ms / Unit', badge: 'Real Time', color: '#2563eb' },
          { icon: 'CheckCircle2', title: 'Flaw Detection Rate', val: '99.8% Accuracy', badge: 'High Precision', color: '#059669' },
          { icon: 'AlertTriangle', title: 'Ejected Rejects Count', val: '14 Units / Shift', badge: 'Defect Free', color: '#ca8a04' }
        ],
        outcomesList: [
          { icon: 'ShieldCheck', title: 'Inspection Rate', val: '100% Parts Scanned', desc: 'Full speed on conveyor', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'TrendingUp', title: 'Detection Precision', val: '99.8% Flaw Catch', desc: '14-micron defect catch', bg: '#ecfdf5', color: '#059669' },
          { icon: 'DollarSign', title: 'Customer Escape Rate', val: 'Zero Defect Escapes', desc: 'Guaranteed part quality', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Sub-second optical inspection that examines every single manufactured part without slowing production.',
          howItWorks: [
            'High-resolution cameras capture multi-angle images of components as they travel along high-speed conveyors.',
            'Advanced vision models analyze surface finish, paint consistency, and edge tolerances in under 40 milliseconds.',
            'Instantly signals automated pneumatic reject arms to discard defective pieces before packaging.'
          ],
          inputsMonitored: 'High-speed camera image feeds, lighting calibration signals, conveyor speed triggers.',
          outputsProduced: 'Real-time defect classification, surface flaw heatmap, automated reject trigger signals.',
          businessValue: '100% of manufactured parts inspected, 99.8% flaw detection accuracy, zero defective escapes.',
          liveStatus: 'Active & Inspecting at 38ms per Part'
        }
      },
      {
        id: 7,
        agentNumber: 7,
        name: 'Engineering Change & Blueprint Control',
        code: 'ENG_CHANGE',
        icon: 'FileText',
        tagline: 'Ensure the shop floor always builds with approved, latest designs',
        whatItDoes: 'Coordinates engineering design updates and bill-of-material revisions to make sure the shop floor always produces with the latest verified specifications.',
        missionCards: [
          { icon: 'FileText', title: 'Revision Synchronization', desc: 'Connects R&D drawing releases directly to machine operator tablets.', bg: '#faf5ff', color: '#6f3dba' },
          { icon: 'Clock', title: 'Obsolete Stock Prevention', desc: 'Ensures older part inventory is fully consumed before cut-over.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'CheckCircle2', title: '100% Spec Compliance', desc: 'Locks machine tooling programs to verified engineering blueprints.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Active ECN Notices', val: '3 Cut-Overs Live', badge: 'Controlled', color: '#6f3dba' },
          { icon: 'CheckCircle2', title: 'Spec Compliance Rate', val: '100% Compliant', badge: 'Verified', color: '#16a34a' },
          { icon: 'Clock', title: 'Old Stock Depletion', val: '98% Consumed', badge: 'Zero Waste', color: '#2563eb' },
          { icon: 'TrendingUp', title: 'Outdated Scrap Cost', val: '₹0 Scrap Loss', badge: 'Protected', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'ShieldCheck', title: 'Drawing Spec Error', val: 'Zero Blueprint Scrap', desc: 'Only builds latest design', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'DollarSign', title: 'Obsolete Part Savings', val: '₹18 Lakhs Saved', desc: 'Full stock consumption', bg: '#ecfdf5', color: '#059669' },
          { icon: 'TrendingUp', title: 'Engineering Cut-Over', val: '100% Adherence', desc: 'Seamless plant rollouts', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Strict design-to-production synchronization ensuring factories never build outdated specifications.',
          howItWorks: [
            'Bridges engineering design releases with physical shop floor machine tooling and parts lists.',
            'Validates that existing inventories of older parts are safely consumed before new revisions take effect.',
            'Updates digital work instructions on operator screens automatically upon approved revision release.'
          ],
          inputsMonitored: 'Engineering change notices, CAD revisions, bill of materials tables, warehouse part stock.',
          outputsProduced: 'Cut-over schedules, revision verification certificates, obsolete inventory prevention alerts.',
          businessValue: 'Zero scrap from outdated drawings, 100% engineering specification compliance.',
          liveStatus: 'Active & Synchronizing Engineering Revisions'
        }
      },
      {
        id: 8,
        agentNumber: 8,
        name: 'Product Traceability & Serial Genealogy',
        code: 'TRACEABILITY',
        icon: 'Layers',
        tagline: '1-click complete birth certificate for every serialized part',
        whatItDoes: 'Builds a complete birth history for every serialized product, recording every component lot, machine used, operator, and inspection result.',
        missionCards: [
          { icon: 'Layers', title: 'Sub-Second QR Birth Record', desc: 'Binds serial barcode to raw material batch, machine & operator.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'Clock', title: '60-Second Root Cause Scan', desc: 'Traces customer field queries to exact stamping heat in seconds.', bg: '#faf5ff', color: '#6f3dba' },
          { icon: 'CheckCircle2', title: 'Targeted Recall Isolation', desc: 'Limits potential recall scope from thousands to single lot.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Serialized Tracking', val: '100% Parts Tagged', badge: 'Live Barcode', color: '#2563eb' },
          { icon: 'Clock', title: 'Serial History Lookup', val: '< 60 Seconds', badge: 'Instant Scan', color: '#16a34a' },
          { icon: 'Layers', title: 'Genealogy Depth', val: '4 Station Levels', badge: 'Full Tree', color: '#6f3dba' },
          { icon: 'ShieldCheck', title: 'Recall Exposure Cut', val: '90% Risk Narrow', badge: 'Lot Confined', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'Clock', title: 'Warranty Query Speed', val: '< 60 Sec Lookup', desc: 'Instant genealogy lookup', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'TrendingUp', title: 'Recall Scope Boundary', val: '90% Risk Reduction', desc: 'Confines defect to 1 lot', bg: '#ecfdf5', color: '#059669' },
          { icon: 'ShieldCheck', title: 'Customer Trust Rating', val: '100% Verified', desc: 'Complete birth certificate', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Sub-second product genealogy linking raw material lots, machines, and test results for every unit built.',
          howItWorks: [
            'Assigns and tracks unique serial QR barcodes on components across every manufacturing station.',
            'Links the specific raw material batch, machine ID, operator shift, and test scores to that unique serial number.',
            'Enables executives to instantly trace any customer warranty inquiry back to the exact root cause in seconds.'
          ],
          inputsMonitored: 'Barcode scanner logs, machine assignment stamps, raw material heat numbers, test bench records.',
          outputsProduced: 'Complete product genealogy tree, targeted recall scope boundary, digital birth certificates.',
          businessValue: 'Investigates customer inquiries in under 60 seconds, reduces recall exposure by up to 90%.',
          liveStatus: 'Active & Tracking All Serialized Output'
        }
      }
    ]
  },
  {
    id: 'supply_chain',
    name: 'Supply Chain & Sourcing',
    shortName: 'Supply Chain',
    icon: 'Truck',
    color: '#d97706',
    headerBg: '#92400e',
    tagline: 'Inventory Buffers, Sourcing, Dispatch & On-Time Customer Orders',
    agentsCount: 5,
    agents: [
      {
        id: 9,
        agentNumber: 9,
        name: 'Smart Inventory & Stock Buffer System',
        code: 'INV_BUFFER',
        icon: 'Boxes',
        tagline: 'Maintain optimal stock levels without tying up working capital',
        whatItDoes: 'Monitors warehouse raw material and finished stock levels, automatically forecasting reorder needs to avoid stockouts while lowering holding costs.',
        missionCards: [
          { icon: 'Boxes', title: 'Live Buffer Level Watch', desc: 'Continuously balances machine consumption against supplier lead time.', bg: '#fefce8', color: '#ca8a04' },
          { icon: 'AlertTriangle', title: 'Zero Line Starvation', desc: 'Alerts purchasing before critical sheet coil or fastener runs dry.', bg: '#fff1f2', color: '#e11d48' },
          { icon: 'DollarSign', title: 'Working Capital Free-Up', desc: 'Calculates dynamic safety stocks to purge excess holding capital.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Inventory Health Index', val: '98% Balanced', badge: 'Optimal Level', color: '#ca8a04' },
          { icon: 'Clock', title: 'Stock Coverage Days', val: '4.2 Days Stock', badge: 'Safe Buffer', color: '#2563eb' },
          { icon: 'AlertTriangle', title: 'Stockout Risk Feed', val: 'Zero Low Stock', badge: 'Protected', color: '#16a34a' },
          { icon: 'DollarSign', title: 'Capital Unlocked', val: '₹1.2 Cr Released', badge: 'Purged Excess', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'ShieldCheck', title: 'Material Shortage Halts', val: 'Zero Line Halts', desc: 'Lines never starve', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'DollarSign', title: 'Capital Released', val: '₹1.2 Cr Freed', desc: 'Eliminated idle excess stock', bg: '#ecfdf5', color: '#059669' },
          { icon: 'TrendingUp', title: 'Warehouse Bin Health', val: '98% Optimal Stock', desc: 'Just-in-time buffers', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Dynamic inventory balance keeping production lines supplied while minimizing idle warehouse capital.',
          howItWorks: [
            'Tracks real-time material consumption across assembly lines against supplier delivery lead times.',
            'Calculates dynamic safety stock levels that adjust automatically for seasonal demand and supply volatility.',
            'Flags inventory stockout risks days in advance and recommends exact reorder quantities.'
          ],
          inputsMonitored: 'Warehouse bin counts, line consumption rates, supplier lead times, confirmed purchase orders.',
          outputsProduced: 'Reorder recommendations, excess stock alerts, working capital optimization scorecards.',
          businessValue: 'Zero line halts caused by missing parts, ₹1.2 Cr in working capital released from excess stock.',
          liveStatus: 'Active & Balancing Plant Inventories'
        }
      },
      {
        id: 10,
        agentNumber: 10,
        name: 'Supplier Performance & Vendor Scorecard',
        code: 'SUPPLIER_RISK',
        icon: 'ShieldAlert',
        tagline: 'Rank supplier punctuality, quality compliance, and delivery risk',
        whatItDoes: 'Ranks supplier reliability based on on-time deliveries, quality compliance, and invoice accuracy to protect production from unreliable vendors.',
        missionCards: [
          { icon: 'ShieldAlert', title: 'Vendor Scorecard Ranking', desc: 'Grades suppliers on punctuality, quality rejects, and contract terms.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'Clock', title: 'OTIF Punctuality Meter', desc: 'Tracks On-Time In-Full metrics for every inbound shipment.', bg: '#fefce8', color: '#ca8a04' },
          { icon: 'CheckCircle2', title: 'Disruption Risk Warning', desc: 'Flags financially fragile or delayed vendors before orders fail.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Supplier OTIF Score', val: '94.2% On-Time', badge: '48 Vendors', color: '#2563eb' },
          { icon: 'AlertTriangle', title: 'Dock Rejection Rate', val: '0.4% Low Rejects', badge: 'High Quality', color: '#16a34a' },
          { icon: 'Clock', title: 'Punctuality Growth', val: '+18% Faster', badge: 'Yearly Trend', color: '#ca8a04' },
          { icon: 'ShieldCheck', title: 'Critical Risk Vendors', val: '0 Risky Vendors', badge: 'Pre-screened', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'Clock', title: 'Supplier Punctuality', val: '+18% Punctual', desc: 'Consistent delivery dates', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'ShieldCheck', title: 'Dock Quality Rejects', val: '0.4% Rejections', desc: 'Eliminated bad vendors', bg: '#ecfdf5', color: '#059669' },
          { icon: 'TrendingUp', title: 'Partner Stability', val: '94.2% OTIF Delivery', desc: 'Protected production run', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Continuous vendor performance evaluation safeguarding the supply chain against unreliable partners.',
          howItWorks: [
            'Measures every inbound supplier shipment against purchase contract delivery dates and quantities.',
            'Logs receiving dock quality rejection rates and calculates vendor compliance scorecards automatically.',
            'Identifies high-risk suppliers early and suggests pre-approved backup vendors.'
          ],
          inputsMonitored: 'Inbound delivery receipts, dock inspection rejection logs, purchase order delivery terms.',
          outputsProduced: 'Vendor performance scorecards, supplier risk ranking, contract penalty recommendations.',
          businessValue: '18% improvement in vendor on-time delivery, early warning on supplier disruption risks.',
          liveStatus: 'Active & Evaluating 48 Partner Vendors'
        }
      },
      {
        id: 11,
        agentNumber: 11,
        name: 'Automated Sourcing & RFQ Manager',
        code: 'SOURCING_RFQ',
        icon: 'DollarSign',
        tagline: 'Automate price quote comparisons to secure the best purchase terms',
        whatItDoes: 'Generates and compares price quotes from certified suppliers for raw materials, helping purchasing managers lock in the best prices and terms.',
        missionCards: [
          { icon: 'DollarSign', title: 'Instant RFQ Generation', desc: 'Drafts price inquiries to approved vendors upon reorder trigger.', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'Clock', title: '2-Hour Bid Comparison', desc: 'Compares prices, freight, and payment terms in 2 hours instead of 5 days.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'CheckCircle2', title: '1-Click Award Card', desc: 'Presents executives with highest value option for instant sign-off.', bg: '#faf5ff', color: '#6f3dba' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Procurement Turnaround', val: '2 Hours Avg', badge: 'Was 5 Days', color: '#16a34a' },
          { icon: 'DollarSign', title: 'Material Spend Saved', val: '4.5% Cost Cut', badge: 'Negotiated', color: '#059669' },
          { icon: 'Activity', title: 'Active RFQ Bids', val: '12 Active Bids', badge: 'In Review', color: '#2563eb' },
          { icon: 'CheckCircle2', title: 'Supplier Savings Ledger', val: '₹28 Lakhs Saved', badge: 'This Quarter', color: '#6f3dba' }
        ],
        outcomesList: [
          { icon: 'Clock', title: 'Quote Turnaround', val: '2-Hour Response', desc: 'Reduced from 5 days', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'DollarSign', title: 'Purchasing Savings', val: '4.5% Price Cut', desc: 'Negotiated on raw coils', bg: '#ecfdf5', color: '#059669' },
          { icon: 'TrendingUp', title: 'Procurement Efficiency', val: '80% Faster Cycle', desc: 'Zero manual paperwork', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Automated purchasing workflows that speed up procurement and secure the best market prices.',
          howItWorks: [
            'Generates structured requests for quotations (RFQs) the moment inventory reorder triggers fire.',
            'Collects and standardizes incoming supplier bids, comparing unit price, shipping freight, and payment terms.',
            'Presents purchasing executives with a clear 1-click comparison card showing the highest-value option.'
          ],
          inputsMonitored: 'Material reorder requisitions, supplier price matrices, commodity market indices, historical bids.',
          outputsProduced: 'Standardized quote comparisons, supplier award recommendations, purchase order drafts.',
          businessValue: 'Procurement cycle time cut by 80%, 4.5% net savings on negotiated raw material purchases.',
          liveStatus: 'Active & Managing Sourcing Bids'
        }
      },
      {
        id: 12,
        agentNumber: 12,
        name: 'Logistics & Dispatch Fleet Tracker',
        code: 'LOGISTICS_FLEET',
        icon: 'Truck',
        tagline: 'Monitor dispatch trucks with live GPS and predict delivery arrivals',
        whatItDoes: 'Monitors outgoing finished goods trucks and logistics routes with live GPS, predicting delivery arrival times and flagging transit delays.',
        missionCards: [
          { icon: 'Truck', title: 'Live GPS Vehicle Telematics', desc: 'Tracks finished goods trucks from plant gate to customer dock.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'Clock', title: 'Dynamic ETA Prediction', desc: 'Calculates traffic and weather to forecast delivery times precisely.', bg: '#fefce8', color: '#ca8a04' },
          { icon: 'AlertTriangle', title: 'Proactive Route Rerouting', desc: 'Alerts dispatch before delivery windows are missed to avoid penalties.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'On-Time Delivery Rate', val: '98.6% OTIF', badge: 'High Standard', color: '#16a34a' },
          { icon: 'Truck', title: 'Active Fleet Dispatches', val: '24 Trucks En Route', badge: 'Live GPS', color: '#2563eb' },
          { icon: 'Clock', title: 'ETA Accuracy Index', val: '± 12 Min Avg', badge: 'Precise', color: '#6f3dba' },
          { icon: 'DollarSign', title: 'Expedited Freight Surcharge', val: '₹0 Air Freight', badge: 'Avoided', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'TrendingUp', title: 'On-Time In-Full Delivery', val: '98.6% On-Time', desc: 'Lifts customer trust', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'DollarSign', title: 'Emergency Freight Fees', val: 'Zero Freight Fees', desc: 'No rush shipping costs', bg: '#ecfdf5', color: '#059669' },
          { icon: 'ShieldCheck', title: 'Buyer SLA Compliance', val: '100% SLA Match', desc: 'Eliminated late penalties', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'End-to-end shipment tracking keeping customer deliveries punctual and transport costs controlled.',
          howItWorks: [
            'Monitors vehicle GPS telemetry and dispatch milestones from plant gate departure to customer unloading dock.',
            'Calculates real-time arrival estimates, factoring in route conditions, weather, and toll checkpoints.',
            'Alerts logistics managers proactively if an order risks missing a delivery window so alternate routes can be used.'
          ],
          inputsMonitored: 'GPS telemetry feeds, vehicle telematics, road traffic advisories, customer delivery dock windows.',
          outputsProduced: 'Live shipment tracking dashboard, transit delay notifications, freight efficiency reports.',
          businessValue: '98.6% on-time delivery attainment, zero expedited air freight surcharges.',
          liveStatus: 'Active & Tracking Active Dispatches'
        }
      },
      {
        id: 18,
        agentNumber: 18,
        name: 'Customer Order Fulfillment Intelligence',
        code: 'ORDER_FULFILLMENT',
        icon: 'CheckCircle2',
        tagline: 'Guarantee 100% dependable delivery dates for corporate customers',
        whatItDoes: 'Validates customer orders against live factory inventory and line production schedules to confirm accurate, reliable promised delivery dates.',
        missionCards: [
          { icon: 'CheckCircle2', title: 'Live Capacity Verification', desc: 'Validates purchase orders against finished stock and line schedules.', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'Clock', title: 'Dependable Promise Dates', desc: 'Confirms 100% achievable delivery commitments without overpromising.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'AlertTriangle', title: 'Priority Order Guard', desc: 'Safeguards key OEM contracts against internal schedule conflicts.', bg: '#faf5ff', color: '#6f3dba' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Order Fulfillment Rate', val: '99.2% Fulfilled', badge: 'Enterprise Standard', color: '#16a34a' },
          { icon: 'CheckCircle2', title: 'Promise Date Accuracy', val: '99.5% Accurate', badge: 'Dependable', color: '#2563eb' },
          { icon: 'Clock', title: 'Backorder Queue', val: '0 Backorders', badge: 'Cleared', color: '#059669' },
          { icon: 'DollarSign', title: 'Contract Penalty Deduction', val: '₹0 Deductions', badge: 'Protected', color: '#6f3dba' }
        ],
        outcomesList: [
          { icon: 'TrendingUp', title: 'Customer Fulfillment', val: '99.2% Fulfilled', desc: 'Strengthens buyer loyalty', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'DollarSign', title: 'Late Delivery Deductions', val: 'Zero Deductions', desc: 'No customer penalties', bg: '#ecfdf5', color: '#059669' },
          { icon: 'ShieldCheck', title: 'Enterprise Retention', val: '100% Retained', desc: 'Tier 1 OEM partner trust', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Direct bridge between customer commitments and physical production capacity.',
          howItWorks: [
            'Validates incoming purchase orders against live finished inventory and scheduled assembly line capacity.',
            'Confirms reliable, achievable delivery commitments without overpromising factory capabilities.',
            'Monitors high-priority orders continuously, escalating any potential scheduling conflicts before they impact the buyer.'
          ],
          inputsMonitored: 'Customer sales orders, finished goods buffer counts, production schedule commitments.',
          outputsProduced: 'Order promise confirmations, fulfillment progress tracking, customer satisfaction metrics.',
          businessValue: '99.2% customer order fulfillment, zero contractual late-delivery penalties.',
          liveStatus: 'Active & Safeguarding Customer Orders'
        }
      }
    ]
  },
  {
    id: 'workforce',
    name: 'Workforce Health & Safety',
    shortName: 'Safety & People',
    icon: 'Users',
    color: '#e11d48',
    headerBg: '#9f1239',
    tagline: 'Zero Incidents, Operator Skills & Digital Safety Permits',
    agentsCount: 2,
    agents: [
      {
        id: 14,
        agentNumber: 14,
        name: 'Plant Safety & Environmental (EHS) Guardian',
        code: 'EHS_SAFETY',
        icon: 'ShieldAlert',
        tagline: 'Enforce digital safety checklists and protect workers 24/7',
        whatItDoes: 'Safeguards workers by tracking safety permit checklists, lockout-tagout procedures, and hazardous zone guidelines to keep incidents at zero.',
        missionCards: [
          { icon: 'ShieldAlert', title: 'Digital LOTO Permit Check', desc: 'Enforces digital lock-out before high-voltage equipment can power on.', bg: '#fff1f2', color: '#e11d48' },
          { icon: 'Activity', title: 'Restricted Zone Perimeter', desc: 'Warns supervisors if unauthorized workers enter high-risk zones.', bg: '#fefce8', color: '#ca8a04' },
          { icon: 'CheckCircle2', title: 'Zero Incident Guardian', desc: 'Maintains daily compliance logs across presses, cranes & chemicals.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Zero Incident Streak', val: '428 Days Safe', badge: 'Zero LTI', color: '#16a34a' },
          { icon: 'ShieldCheck', title: 'LOTO Permit Compliance', val: '100% Signed', badge: 'Verified', color: '#e11d48' },
          { icon: 'Activity', title: 'Environmental Air Quality', val: 'Nominal Level', badge: 'Healthy', color: '#2563eb' },
          { icon: 'CheckCircle2', title: 'Audit Scorecard', val: '100% Regulatory', badge: 'Certified', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'ShieldCheck', title: 'Workplace Incident Streak', val: '428 Days Safe', desc: 'Zero lost-time injuries', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'TrendingUp', title: 'Safety Permit Compliance', val: '100% Digital LOTO', desc: 'All machine checks signed', bg: '#ecfdf5', color: '#059669' },
          { icon: 'DollarSign', title: 'Regulatory Fine Avoidance', val: 'Zero Safety Fines', desc: 'Full audit compliance', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Comprehensive workplace safety guardian keeping industrial factory environments safe and fully compliant.',
          howItWorks: [
            'Enforces mandatory digital lockout-tagout (LOTO) checklists before high-voltage or stamping equipment can be opened.',
            'Monitors environmental sensors for air quality, chemical exhaust, and ambient factory temperatures.',
            'Provides immediate alert routing if unauthorized personnel enter restricted high-risk machine zones.'
          ],
          inputsMonitored: 'Digital safety permit signatures, restricted zone motion sensors, environmental air quality logs.',
          outputsProduced: 'Safety compliance audit certificates, hazardous condition warnings, daily incident-free scorecard.',
          businessValue: '428 consecutive days without a lost-time injury, 100% regulatory safety compliance.',
          liveStatus: 'Active & Safeguarding Plant Personnel'
        }
      },
      {
        id: 15,
        agentNumber: 15,
        name: 'Operator Skill & Shift Allocation Manager',
        code: 'WORKFORCE_ALLOC',
        icon: 'Users',
        tagline: 'Ensure qualified, certified operators are on every machine station',
        whatItDoes: 'Optimizes shift staffing by matching certified operator skill levels to specialized machine stations, ensuring smooth shift handovers and zero absenteeism delays.',
        missionCards: [
          { icon: 'Users', title: 'Skill Matrix Station Mapping', desc: 'Matches operator certifications directly to specific machine lines.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'Clock', title: 'Absentee Fill Suggestions', desc: 'Suggests qualified backup workers instantly if an operator calls out.', bg: '#fefce8', color: '#ca8a04' },
          { icon: 'CheckCircle2', title: 'Zero Shift Startup Delay', desc: 'Ensures stations begin work on the second the shift whistle blows.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Shift Certification Rate', val: '100% Certified', badge: 'All Lines', color: '#16a34a' },
          { icon: 'Clock', title: 'Shift Startup Delay', val: '0 Minutes Lost', badge: 'On Time', color: '#2563eb' },
          { icon: 'Users', title: 'Absentee Fill Speed', val: '< 2 Minutes', badge: 'Instant Fill', color: '#6f3dba' },
          { icon: 'TrendingUp', title: 'Operator Training Level', val: '92% Multi-Skilled', badge: 'Flexible', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'Clock', title: 'Shift Startup Delays', val: 'Zero Lost Minutes', desc: 'Instant shift handover', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'ShieldCheck', title: 'Critical Machine Coverage', val: '100% Certified', desc: 'No uncertified operators', bg: '#ecfdf5', color: '#059669' },
          { icon: 'TrendingUp', title: 'Workforce Flexibility', val: '92% Multi-Skilled', desc: 'High cross-station skills', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Skill-aware worker scheduling that matches certified capabilities with critical machine operations.',
          howItWorks: [
            'Maintains up-to-date certification records and safety training histories for all factory technicians.',
            'Matches operator competencies with required machine line stations during shift roster creation.',
            'Instantly recommends certified backup personnel if an operator is absent, preventing station stoppages.'
          ],
          inputsMonitored: 'Shift attendance logs, skill qualification matrices, training expiration dates, machine certifications.',
          outputsProduced: 'Certified shift roster, absentee replacement recommendations, skill gap training priorities.',
          businessValue: 'Zero shift startup delays, 100% qualified operator compliance across all production lines.',
          liveStatus: 'Active & Coordinating Plant Shifts'
        }
      }
    ]
  },
  {
    id: 'finance',
    name: 'Financial & Executive Intelligence',
    shortName: 'Finance & Master',
    icon: 'DollarSign',
    color: '#7c3aed',
    headerBg: '#4c1d95',
    tagline: 'Real-Time Cost per Part, Margin Protection & Owner Cockpit',
    agentsCount: 2,
    agents: [
      {
        id: 16,
        agentNumber: 16,
        name: 'Manufacturing Unit Cost & Margin System',
        code: 'UNIT_COST',
        icon: 'DollarSign',
        tagline: 'Track the true real-time manufacturing cost of every single part',
        whatItDoes: 'Calculates the true real-time manufacturing cost of every single part produced, accounting for materials, power, machine time, and labor.',
        missionCards: [
          { icon: 'DollarSign', title: 'Real-Time Part Costing', desc: 'Computes cost-per-unit shift-by-shift rather than at month-end.', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'AlertTriangle', title: 'Margin Leakage Warning', desc: 'Flags subtle cost creep from power usage, scrap, or extra tooling.', bg: '#fefce8', color: '#ca8a04' },
          { icon: 'TrendingUp', title: 'Line Budget Variance', desc: 'Reveals shift-wise profitability across multi-plant facilities.', bg: '#eff6ff', color: '#2563eb' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Live Cost per Part', val: '₹142.50 / Unit', badge: 'Within Budget', color: '#16a34a' },
          { icon: 'DollarSign', title: 'Cost Reduction Margin', val: '↓ 4.8% Unit Cost', badge: 'Profitable', color: '#059669' },
          { icon: 'Activity', title: 'Power Cost per Part', val: '₹4.20 / Unit', badge: 'Off-Peak', color: '#2563eb' },
          { icon: 'TrendingUp', title: 'Gross Line Margin', val: '28.4% Margin', badge: 'Protected', color: '#7c3aed' }
        ],
        outcomesList: [
          { icon: 'DollarSign', title: 'Unit Cost Reduction', val: '↓ 4.8% Unit Cost', desc: 'Protected profit margins', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'TrendingUp', title: 'Margin Leakage Prevention', val: '₹48 Lakhs Saved', desc: 'Caught before month-end', bg: '#ecfdf5', color: '#059669' },
          { icon: 'ShieldCheck', title: 'Cost Visibility', val: '100% Real Time', desc: 'No accounting delay', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'Live financial cost governance calculating exact production costs per unit as items roll off the line.',
          howItWorks: [
            'Combines live raw material consumption, kilowatt-hours used, machine cycle time, and labor hours per lot.',
            'Calculates true cost-per-unit in real time instead of waiting for month-end financial accounting reconciliations.',
            'Alerts leadership immediately if tool wear or scrap causes part costs to creep beyond budgeted thresholds.'
          ],
          inputsMonitored: 'Raw material bills, electricity sub-meter kWh, labor shift hours, machine tooling amortizations.',
          outputsProduced: 'Real-time part cost breakdown, line cost variance scorecard, margin protection recommendations.',
          businessValue: '4.8% reduction in overall unit cost, prevents hidden profit margin leakage.',
          liveStatus: 'Active & Computing Real-Time Part Costs'
        }
      },
      {
        id: 20,
        agentNumber: 20,
        name: 'Executive Operations Decision Center',
        code: 'EXECUTIVE_COCKPIT',
        icon: 'Cpu',
        tagline: 'Synthesizes all 19 agents into 1 clear executive control view',
        whatItDoes: 'Acts as the central brain unifying findings from all 19 agents into one executive dashboard with 1-click approvals for plant owners.',
        missionCards: [
          { icon: 'Cpu', title: 'Unified Operational Mesh', desc: 'Synthesizes intelligence from all 19 domain agents into 1 brief.', bg: '#faf5ff', color: '#7c3aed' },
          { icon: 'CheckCircle2', title: 'Top 3 Executive Decisions', desc: 'Surfaces only high-dollar choices needing owner authorization.', bg: '#eff6ff', color: '#2563eb' },
          { icon: 'Clock', title: '1-Click Decision Dispatch', desc: 'Instantly routes approved owner decisions back to shop floor lines.', bg: '#f0fdf4', color: '#16a34a' }
        ],
        reportsList: [
          { icon: 'BarChart3', title: 'Executive Daily Brief', val: '3 Pending Decisions', badge: 'High Impact', color: '#7c3aed' },
          { icon: 'ShieldCheck', title: 'Multi-Plant Uptime', val: '96.8% Fleet Wide', badge: 'All 6 Plants', color: '#16a34a' },
          { icon: 'Clock', title: 'Owner Review Time', val: '2 Hours Saved/Day', badge: 'Fast Clarity', color: '#2563eb' },
          { icon: 'TrendingUp', title: 'Executive Control', val: '100% Unified', badge: 'Master Brain', color: '#059669' }
        ],
        outcomesList: [
          { icon: 'Clock', title: 'Owner Review Time', val: '2+ Hours Saved/Day', desc: 'Zero manual report wading', bg: '#faf5ff', color: '#7c3aed' },
          { icon: 'ShieldCheck', title: 'Cross-Plant Visibility', val: '100% Control', desc: 'Real-time multi-state status', bg: '#f0fdf4', color: '#16a34a' },
          { icon: 'TrendingUp', title: 'Decision Execution Speed', val: 'Instant 1-Click', desc: 'Direct to plant systems', bg: '#eff6ff', color: '#2563eb' }
        ],
        detailedExplanation: {
          summary: 'The master intelligence hub coordinating all 19 operational agents for executive leadership.',
          howItWorks: [
            'Synthesizes continuous operational intelligence across all 6 manufacturing sectors into plain business insights.',
            'Filters out trivial noise, surfacing only the top 3 high-impact decisions requiring owner or director approval.',
            'Dispatches approved executive decisions back to shop floor systems with one click.'
          ],
          inputsMonitored: 'Operational findings and KPIs from Agents 01 through 19 across all 6 manufacturing plants.',
          outputsProduced: 'Daily executive brief, prioritized decision approval cards, multi-facility KPI comparisons.',
          businessValue: 'Saves 2+ hours daily in executive review time, provides total operational clarity across all plants.',
          liveStatus: 'Active & Orchestrating 19 Operational Agents'
        }
      }
    ]
  }
];

export const PROBLEMS_SOLVED = [
  {
    id: 'problem_downtime',
    title: 'Costly Unplanned Machine Breakdowns',
    category: 'Equipment Reliability',
    icon: 'Cog',
    severity: 'High Operational Risk',
    color: '#ef4444',
    headerBg: '#b91c1c',
    shortDescription: 'Sudden mechanical failures halt lines, stranding workers and causing heavy repair and overtime costs.',
    resolvedByAgentIds: [4, 2],
    resolvedByAgents: ['Predictive Machine Maintenance', 'Live Production Monitoring'],
    outcomeMetric: '↓ 35% Downtime',
    savings: '₹1.8 Cr Saved Annually',
    painPointAnalysis: 'Traditional manufacturing plants wait for a machine bearing or motor spindle to seize up before calling maintenance. A single catastrophic failure on a primary press can halt an entire factory for 18 hours, causing massive overtime costs and delayed shipments.',
    solutionSteps: [
      { step: 1, title: 'Continuous 24/7 Sensors', desc: 'Measures vibration acoustics and motor heat continuously.', icon: 'Activity' },
      { step: 2, title: '14-Day Micro-Wear Warning', desc: 'Predictive intelligence spots metal wear weeks before failure.', icon: 'Clock' },
      { step: 3, title: 'Pre-Booked Off-Shift Repair', desc: 'Schedules maintenance during planned breaks with reserved parts.', icon: 'CheckCircle2' }
    ],
    businessTurnaround: 'Eliminated catastrophic machine seizures, saved over ₹1.8 Cr in emergency repairs, and maintains factory availability at 96.8%.'
  },
  {
    id: 'problem_scrap',
    title: 'Scrap Losses & Undetected Quality Defects',
    category: 'Quality Assurance',
    icon: 'ScanLine',
    severity: 'High Financial Waste',
    color: '#f59e0b',
    headerBg: '#b45309',
    shortDescription: 'Micro-cracks, surface blemishes, and dimension drift go unnoticed, resulting in wasted material and customer complaints.',
    resolvedByAgentIds: [5, 6, 8],
    resolvedByAgents: ['Quality Management & Inspection', 'Optical Camera Quality Inspection', 'Product Traceability System'],
    outcomeMetric: '98.4% First-Pass Yield',
    savings: '₹65 Lakhs Scrap Prevented',
    painPointAnalysis: 'When quality checks happen only at the end of a shift, a worn stamping tool or misaligned cutter can produce thousands of defective components before detection, forcing entire production lots to be scrapped or melted down.',
    solutionSteps: [
      { step: 1, title: 'Sub-Second Optical Camera Scan', desc: 'Scans 100% of parts in 38 milliseconds right off the press.', icon: 'CheckCircle2' },
      { step: 2, title: 'Micro-Defect AI Classification', desc: 'Identifies hairline cracks and burrs with sub-millimeter precision.', icon: 'Activity' },
      { step: 3, title: 'Automated Ejection & Press Halt', desc: 'Drops bad parts into reject bin and halts press before scrap spreads.', icon: 'AlertTriangle' }
    ],
    businessTurnaround: 'Drives First-Pass Yield to 98.4%, completely avoids warranty return penalties, and cuts scrap expenditure by 22%.'
  },
  {
    id: 'problem_energy',
    title: 'Expensive Peak Electricity & Utility Surcharges',
    category: 'Energy & Sustainability',
    icon: 'Zap',
    severity: 'Recurring Cost Drain',
    color: '#eab308',
    headerBg: '#a16207',
    shortDescription: 'Running energy-heavy furnaces and compressors during peak tariff hours results in massive utility penalty charges.',
    resolvedByAgentIds: [13, 17],
    resolvedByAgents: ['Energy Cost & Tariff Optimizer', 'Plant Utilities & Facilities'],
    outcomeMetric: '↓ 8.5% Electric Bills',
    savings: '₹42 Lakhs Surcharge Avoidance',
    painPointAnalysis: 'Commercial electric utilities enforce steep multiplier rates during peak grid demand hours. Plants that run power-intensive heating, annealing, and compression cycles during daytime peak hours receive staggering monthly electricity bills.',
    solutionSteps: [
      { step: 1, title: 'Substation Tariff Monitoring', desc: 'Monitors commercial utility rate tiers and demand thresholds.', icon: 'Zap' },
      { step: 2, title: 'Smart Off-Peak Sequencing', desc: 'Shifts high-energy annealing and compressor loads to night hours.', icon: 'Clock' },
      { step: 3, title: 'Compressed Air Leak Detection', desc: 'Stops pneumatic line pressure drops that bleed kilowatt-hours.', icon: 'Sliders' }
    ],
    businessTurnaround: 'Cuts total factory power expenditure by 8.5% and prevents costly maximum-demand utility penalties.'
  },
  {
    id: 'problem_stockouts',
    title: 'Sudden Raw Material Stockouts & Starved Lines',
    category: 'Supply Chain Continuity',
    icon: 'Boxes',
    severity: 'Production Bottleneck',
    color: '#6366f1',
    headerBg: '#4338ca',
    shortDescription: 'Assembly lines suddenly stop because a specific bracket, fastener, or raw sheet coil runs out unexpectedly.',
    resolvedByAgentIds: [9, 11, 10],
    resolvedByAgents: ['Smart Inventory Buffer System', 'Automated Sourcing & RFQ', 'Supplier Performance Risk'],
    outcomeMetric: 'Zero Part Shortage Halts',
    savings: '₹1.2 Cr Released in Capital',
    painPointAnalysis: 'Traditional ERP inventory counts often lag behind actual shop floor consumption by days. When stock runs dry without warning, high-speed lines sit idle while purchasing teams scramble to pay premium rush delivery fees.',
    solutionSteps: [
      { step: 1, title: 'Live Cycle-Based Consumption', desc: 'Tracks raw stock consumption directly from machine sensors.', icon: 'Boxes' },
      { step: 2, title: 'Dynamic Buffer Calculation', desc: 'Recalculates safety buffers against vendor delivery lead times.', icon: 'TrendingUp' },
      { step: 3, title: 'Autonomous Supplier RFQ Push', desc: 'Prepares quote requests before stock hits safety thresholds.', icon: 'DollarSign' }
    ],
    businessTurnaround: 'Guarantees 100% material availability for scheduled shifts while releasing ₹1.2 Cr from bloated warehouse inventory.'
  },
  {
    id: 'problem_safety',
    title: 'Worker Safety Hazards & Compliance Incidents',
    category: 'Workforce & Safety',
    icon: 'Users',
    severity: 'Human & Regulatory Risk',
    color: '#10b981',
    headerBg: '#047857',
    shortDescription: 'Skipped machine lockout checklists and assigning uncertified workers to heavy equipment risk workplace injury.',
    resolvedByAgentIds: [14, 15],
    resolvedByAgents: ['Plant Safety & Environmental Guardian', 'Operator Skill & Shift Allocation'],
    outcomeMetric: '428 Days Incident-Free',
    savings: '100% Zero Lost-Time Injuries',
    painPointAnalysis: 'Heavy industrial presses and automated robotics cells present real physical hazards. Paper safety permits and hurried shift handovers often lead to missed safety protocols, risking worker injuries and regulatory shutdowns.',
    solutionSteps: [
      { step: 1, title: 'Digital Safety Verification', desc: 'Enforces digital sign-off before dangerous machines can power on.', icon: 'ShieldAlert' },
      { step: 2, title: 'Operator Skill Verification', desc: 'Matches operator certification records with machine requirements.', icon: 'Users' },
      { step: 3, title: 'Hazardous Perimeter Alarm', desc: 'Alerts supervisors if workers enter dangerous zones without PPE.', icon: 'AlertTriangle' }
    ],
    businessTurnaround: 'Maintained 428 consecutive incident-free days across all facilities, protecting workers and achieving 100% regulatory compliance.'
  },
  {
    id: 'problem_delivery',
    title: 'Late Customer Deliveries & Freight Penalties',
    category: 'Customer Satisfaction',
    icon: 'Truck',
    severity: 'Customer Churn Risk',
    color: '#06b6d4',
    headerBg: '#0e7490',
    shortDescription: 'Lack of visibility between assembly progress and logistics dispatch causes missed customer deadlines and expensive air freight.',
    resolvedByAgentIds: [12, 18, 1],
    resolvedByAgents: ['Logistics & Fleet Tracker', 'Customer Order Fulfillment System', 'Production Planning System'],
    outcomeMetric: '98.6% On-Time Delivery',
    savings: 'Zero Expedited Freight Fees',
    painPointAnalysis: 'When production delays are discovered too late, companies are forced to book emergency premium air freight or face severe contractual penalty deductions from major enterprise buyers.',
    solutionSteps: [
      { step: 1, title: 'Assembly-to-Dispatch Link', desc: 'Binds line output directly to truck dock dispatch schedules.', icon: 'Truck' },
      { step: 2, title: 'Live GPS Delay Prediction', desc: 'Forecasts transit delays and reroutes before deadlines pass.', icon: 'Clock' },
      { step: 3, title: 'Transparent Customer Arrival', desc: 'Provides corporate buyers with dependable, verified arrival times.', icon: 'CheckCircle2' }
    ],
    businessTurnaround: 'Elevated On-Time In-Full customer delivery to 98.6%, completely wiping out emergency freight fees and late penalties.'
  }
];
