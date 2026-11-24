// 5 Core Manufacturing Problems Solved by each AI Agent
// Designed strictly to match Image 2 reference format:
// - Numbered 01-05
// - Colorful pastel backgrounds (coral, yellow, purple, cyan, rose)
// - Concise, punchy problem statements based on realistic factory floor use cases
// - Domain icons accurately appropriate to the specific failure mode / reason

export const COLOR_TIERS = [
  {
    num: '01',
    color: '#991b1b',
    borderColor: '#f87171',
    bg: '#fee2e2',
    darkBg: 'rgba(239, 68, 68, 0.14)',
    darkBorder: '#ef4444',
    darkText: '#fca5a5'
  },
  {
    num: '02',
    color: '#92400e',
    borderColor: '#fbbf24',
    bg: '#fef3c7',
    darkBg: 'rgba(234, 179, 8, 0.14)',
    darkBorder: '#eab308',
    darkText: '#fde047'
  },
  {
    num: '03',
    color: '#6b21a8',
    borderColor: '#c084fc',
    bg: '#f3e8ff',
    darkBg: 'rgba(168, 85, 247, 0.14)',
    darkBorder: '#a855f7',
    darkText: '#d8b4fe'
  },
  {
    num: '04',
    color: '#155e75',
    borderColor: '#22d3ee',
    bg: '#cffafe',
    darkBg: 'rgba(6, 182, 212, 0.14)',
    darkBorder: '#06b6d4',
    darkText: '#67e8f9'
  },
  {
    num: '05',
    color: '#9f1239',
    borderColor: '#fb7185',
    bg: '#ffe4e6',
    darkBg: 'rgba(244, 63, 94, 0.14)',
    darkBorder: '#f43f5e',
    darkText: '#fda4af'
  }
];

export const AGENT_PROBLEMS_MAP = {
  /* ========================================================================= */
  /* 1. PREDICTIVE MACHINE MAINTENANCE                                         */
  /* ========================================================================= */
  PRED_MAINT: [
    {
      num: '01',
      title: 'Sudden mechanical failures and catastrophic spindle seizures',
      icon: 'Wrench', // Mechanical breakdown / spindle seizure
      outcomeMetric: '↓ 35% Downtime',
      savings: '₹1.8 Cr Saved Annually',
      category: 'Equipment Reliability',
      severity: 'High Operational Risk',
      painPointAnalysis: 'Unpredicted machine seizures halt entire lines for 18+ hours, causing stranding workers, premium overtime expenses, and missed customer delivery deadlines.',
      solutionSteps: [
        { step: 1, title: '24/7 Acoustic & Vibration Sampling', desc: 'Continuous edge ingestion of frequency and motor heat decibels.' },
        { step: 2, title: '14-Day Micro-Wear Predictive Alert', desc: 'Neural anomaly model detects friction anomalies weeks in advance.' },
        { step: 3, title: 'Autonomous Off-Shift Repair Dispatch', desc: 'Pre-books maintenance work orders and reserves spare inventory.' }
      ],
      turnaround: 'Eliminated catastrophic machine seizures and maintained 96.8% fleet uptime across 6 facilities.'
    },
    {
      num: '02',
      title: 'Undetected micro-wear on high-speed motor bearings',
      icon: 'Cog', // Rotational bearing friction and micro-wear
      outcomeMetric: '0.04mm Drift Limit',
      savings: '₹62 Lakhs Avoided',
      category: 'Precision Maintenance',
      severity: 'Medium Risk',
      painPointAnalysis: 'Microscopic bearing flaking generates friction that accelerates rapidly, turning a ₹5,000 bearing swap into a ₹50 Lakh motor core replacement.',
      solutionSteps: [
        { step: 1, title: 'High-Frequency Vibration Telemetry', desc: 'Captures rotational vibration signatures at 500ms intervals.' },
        { step: 2, title: 'Harmonic Drift Isolation', desc: 'Isolates abnormal bearing harmonics from background factory noise.' },
        { step: 3, title: 'Proactive Lubrication & Re-alignment', desc: 'Dispatches automated work alerts to prevent surface galling.' }
      ],
      turnaround: 'Extended critical spindle lifespan by 3.2x with zero catastrophic motor burnout.'
    },
    {
      num: '03',
      title: 'Unplanned shift halts causing expensive emergency overtime',
      icon: 'Clock', // Unplanned halts and overtime shift drain
      outcomeMetric: 'Zero Shift Halts',
      savings: '₹45 Lakhs Overtime Cut',
      category: 'Shift Continuity',
      severity: 'Operational Drain',
      painPointAnalysis: 'Breakdowns during peak production shifts strand dozens of line operators while maintenance scrambles, forcing costly weekend overtime catching up.',
      solutionSteps: [
        { step: 1, title: 'Remaining Useful Life (RUL) Modeling', desc: 'Accurately calculates remaining machine run hours before wear limit.' },
        { step: 2, title: 'Off-Shift Service Window Matching', desc: 'Schedules servicing during natural shift handover pauses.' },
        { step: 3, title: '1-Click Shift Handover Sign-off', desc: 'Confirms machine readiness before the next operating crew arrives.' }
      ],
      turnaround: 'Reduced emergency maintenance overtime by 78% and eliminated stranded worker hours.'
    },
    {
      num: '04',
      title: 'Critical spare parts unavailable during emergency breakdowns',
      icon: 'Boxes', // Spare parts inventory starvation
      outcomeMetric: '100% Spares Ready',
      savings: 'Zero Parts Starvation',
      category: 'Spare Parts Logistics',
      severity: 'Supply Bottleneck',
      painPointAnalysis: 'When a press fails unexpectedly, technicians often discover the required seal or bearing is out of stock, causing multi-day delays waiting for rush air freight.',
      solutionSteps: [
        { step: 1, title: 'Automated Spare Reservation', desc: 'Autonomously reserves replacement components 14 days before failure.' },
        { step: 2, title: 'Smart Buffer Reorder Trigger', desc: 'Alerts procurement before central warehouse stock reaches safety minimum.' },
        { step: 3, title: 'Kitted Maintenance Carts', desc: 'Pre-stages exact tools and seals at the machine bay before scheduled repair.' }
      ],
      turnaround: 'Achieved 100% parts availability for scheduled maintenance with zero rush air-freight fees.'
    },
    {
      num: '05',
      title: 'Unverified machine health status across multi-plant fleets',
      icon: 'Factory', // Cross-facility multi-plant fleet health
      outcomeMetric: '6 Plants Connected',
      savings: 'Unified Fleet Health',
      category: 'Fleet Intelligence',
      severity: 'Visibility Blindspot',
      painPointAnalysis: 'Plant managers across 6 facilities operate in silos, leading to identical machine failure modes repeating in different plants without shared intelligence.',
      solutionSteps: [
        { step: 1, title: 'Unified Edge Telemetry Ingestion', desc: 'Streams machine health metrics across all 6 facilities into one cockpit.' },
        { step: 2, title: 'Cross-Plant Anomaly Benchmarking', desc: 'Compares machine vibration baselines across identical CNC models.' },
        { step: 3, title: 'Fleet-Wide Best Practice Propagation', desc: 'Autonomously applies preventive thresholds discovered in Plant 1 to all plants.' }
      ],
      turnaround: 'Connected 142 critical industrial assets across 6 plants with standardized 96.8% uptime.'
    }
  ],

  /* ========================================================================= */
  /* 2. ENERGY COST & TARIFF OPTIMIZER                                         */
  /* ========================================================================= */
  ENERGY_MGMT: [
    {
      num: '01',
      title: 'Rising electricity cost per manufactured good unit',
      icon: 'DollarSign', // Electricity cost inflation per unit
      outcomeMetric: '↓ 8.5% Electric Bills',
      savings: '₹42 Lakhs Saved',
      category: 'Energy Efficiency',
      severity: 'Financial Cost Creep',
      painPointAnalysis: 'Unregulated machine cycles and unoptimized tariff schedules inflate electricity expenses, eroding gross margins across competitive high-volume production lines.',
      solutionSteps: [
        { step: 1, title: 'Sub-Meter Telemetry Stream', desc: 'Measures live kilowatt-hour draw per machine and per manufactured part.' },
        { step: 2, title: 'Unit Energy Benchmarking', desc: 'Identifies power-hungry batches and compares against optimum target run-rates.' },
        { step: 3, title: 'Energy-Optimized Machine Pacing', desc: 'Regulates auxiliary motors and heaters to maintain optimal part energy cost.' }
      ],
      turnaround: 'Cut average power cost per part from ₹4.80 to ₹4.20, delivering ₹42 Lakhs in annual energy savings.'
    },
    {
      num: '02',
      title: 'Heavy energy consumption during non-productive idle shifts',
      icon: 'PowerOff', // Off-shift / idle machine power waste
      outcomeMetric: '↓ 18% Idle Power',
      savings: '₹18 Lakhs Power Waste',
      category: 'Idle Load Control',
      severity: 'Wasted Utility Expense',
      painPointAnalysis: 'Heavy industrial furnaces, chillers, and hydraulic pumps left running at full power during lunch breaks and idle shift intervals waste millions annually.',
      solutionSteps: [
        { step: 1, title: 'Automated Shift State Detection', desc: 'Detects zero-production pauses via line PLC heartbeat signals.' },
        { step: 2, title: 'Eco-Standby Sleep Modulation', desc: 'Ramps down auxiliary blowers, heaters, and pumps into low-power eco modes.' },
        { step: 3, title: 'Pre-Shift Warmup Scheduling', desc: 'Autonomously ramps machines back to operating temperature 15 minutes before shift start.' }
      ],
      turnaround: 'Eliminated 18% in baseline utility waste during shift pauses and non-productive weekend hours.'
    },
    {
      num: '03',
      title: 'Expensive commercial tariff surcharges during peak grid hours',
      icon: 'Zap', // Peak grid power surge & demand surcharges
      outcomeMetric: 'Zero Tariff Penalties',
      savings: '₹28 Lakhs Surcharge Cut',
      category: 'Tariff Optimization',
      severity: 'Peak Utility Penalty',
      painPointAnalysis: 'Operating energy-heavy annealing furnaces and air compressors during daytime peak grid tariff windows triggers massive utility demand multiplier charges.',
      solutionSteps: [
        { step: 1, title: '24-Hour Utility Pricing Watch', desc: 'Syncs dynamic time-of-day tariff structures from regional utility grids.' },
        { step: 2, title: 'Heavy Load Rescheduling', desc: 'Sequences high-energy batches to run during cheaper off-peak night windows.' },
        { step: 3, title: 'Peak Demand Threshold Guard', desc: 'Alerts plant dispatchers before factory demand breaches contract maximums.' }
      ],
      turnaround: 'Completely avoided utility demand penalty surcharges and lowered effective tariff rates by 22%.'
    },
    {
      num: '04',
      title: 'Conflicting or delayed sub-meter readings across plant substations',
      icon: 'Gauge', // Sub-meter digital telemetry & calibration
      outcomeMetric: '100% Sub-Meter Sync',
      savings: 'Zero Meter Drift',
      category: 'Data Integrity',
      severity: 'Monitoring Blindspot',
      painPointAnalysis: 'Manual meter reading logs are prone to human entry errors and lag behind reality, preventing plant engineers from detecting substation phase imbalances.',
      solutionSteps: [
        { step: 1, title: 'Direct IoT Bus Ingestion', desc: 'Captures continuous digital meter data via Modbus and RS-485 connections.' },
        { step: 2, title: 'Phase Balance Auditing', desc: 'Continuously balances electrical load across all three substation phases.' },
        { step: 3, title: 'Automated Calibration Alerts', desc: 'Flags sensor drift and conflicting readings instantly for electrical servicing.' }
      ],
      turnaround: 'Unified 38 substation digital meters into one synchronized telemetry mesh with zero logging delay.'
    },
    {
      num: '05',
      title: 'Unverified carbon footprint and power factor penalty fees',
      icon: 'Leaf', // Carbon emissions, ESG compliance & sustainability
      outcomeMetric: '0.98 Power Factor',
      savings: '14.2 Tons CO₂ Saved',
      category: 'Sustainability & ESG',
      severity: 'Compliance Risk',
      painPointAnalysis: 'Low power factors trigger utility penalty fees and undermine corporate environmental sustainability commitments required by major enterprise buyers.',
      solutionSteps: [
        { step: 1, title: 'Live Power Factor Monitoring', desc: 'Tracks reactive power and power factor rating in continuous real time.' },
        { step: 2, title: 'Automated Capacitor Bank Switching', desc: 'Engages corrective capacitor banks to maintain power factor above 0.98.' },
        { step: 3, title: 'ESG Carbon Audit Reports', desc: 'Generates ISO-compliant carbon reduction certificates for executive sustainability audits.' }
      ],
      turnaround: 'Maintained 0.98+ power factor compliance with zero utility penalties and reduced carbon footprint by 14.2 tons.'
    }
  ],

  /* ========================================================================= */
  /* 3. PLANT UTILITIES & FACILITIES SYSTEM                                    */
  /* ========================================================================= */
  UTILITIES_MGMT: [
    {
      num: '01',
      title: 'Compressed air pressure drops causing automated tool misfires',
      icon: 'Wind', // Compressed air flow & pneumatic pressure
      outcomeMetric: '6.8 Bar Constant',
      savings: 'Zero Pressure Halts',
      category: 'Pneumatics Stability',
      severity: 'Tooling Fault Risk',
      painPointAnalysis: 'Pressure fluctuations in pneumatic lines cause automated clamping fixtures and pneumatic drills to misfire, creating part defects and line pauses.',
      solutionSteps: [
        { step: 1, title: 'Continuous Line Pressure Sensing', desc: 'Monitors pneumatic manifold transducers across all factory bays.' },
        { step: 2, title: 'Dual-Compressor Load Balancing', desc: 'Modulates secondary compressors seamlessly before pressure drops occur.' },
        { step: 3, title: 'Automated Pressure Reserve Staging', desc: 'Maintains constant 6.8 Bar delivery across heavy stamping shifts.' }
      ],
      turnaround: 'Eliminated 100% of tool misfires caused by line pressure drops, ensuring uninterrupted assembly speed.'
    },
    {
      num: '02',
      title: 'Undetected pipeline leaks in high-pressure steam and air lines',
      icon: 'Droplets', // Fluid & steam pipeline leaks
      outcomeMetric: 'Zero Active Leaks',
      savings: '₹14 Lakhs Energy Leakage',
      category: 'Leak Prevention',
      severity: 'Silent Energy Drain',
      painPointAnalysis: 'Microscopic pinhole leaks in pneumatic lines and steam couplings hiss unnoticed in noisy plants, silently wasting up to 20% of compressor energy.',
      solutionSteps: [
        { step: 1, title: 'Ultrasonic Flow Discrepancy Scanning', desc: 'Compares compressor outflow against downstream tool consumption.' },
        { step: 2, title: 'Automated Section Pinpointing', desc: 'Isolates the exact 5-meter pipe section displaying acoustic pressure drop.' },
        { step: 3, title: 'Targeted Servicing Dispatch', desc: 'Sends maintenance technicians directly to the leaking coupling with pre-kitted seals.' }
      ],
      turnaround: 'Detected and resolved 18 micro-leaks, recovering 12% in wasted compressor power.'
    },
    {
      num: '03',
      title: 'Chiller loop temperature spikes overheating production machinery',
      icon: 'Thermometer', // Chiller cooling loop temperature spikes
      outcomeMetric: '7.2°C Optimal Water',
      savings: 'Zero Thermal Seizures',
      category: 'Cooling Reliability',
      severity: 'Thermal Overheat Risk',
      painPointAnalysis: 'Cooling tower water scale buildup and thermal loop blockages cause spindle coolant temperatures to spike, triggering thermal emergency shutdowns.',
      solutionSteps: [
        { step: 1, title: 'Continuous Cooling Loop Monitoring', desc: 'Measures supply and return water temperatures at 1-second intervals.' },
        { step: 2, title: 'Cooling Tower Fan Speed Modulation', desc: 'Dynamically adjusts fan speeds to maintain precise 7.2°C coolant loop delivery.' },
        { step: 3, title: 'Scale Buildup Predictive Warnings', desc: 'Schedules chemical flushing weeks before thermal heat transfer degrades.' }
      ],
      turnaround: 'Zero machine thermal trips and extended industrial tooling lifespan by 28%.'
    },
    {
      num: '04',
      title: 'Wasted compressor power from unsealed pipe joints',
      icon: 'Zap', // Electric compressor motor power waste
      outcomeMetric: '12% Energy Saved',
      savings: '₹16 Lakhs Power Saved',
      category: 'Compressor Efficiency',
      severity: 'Utility Waste',
      painPointAnalysis: 'Aging pipe fittings and loose manifold seals force heavy compressors to run continuously at 100% load even when plant demand is low.',
      solutionSteps: [
        { step: 1, title: 'Variable Frequency Drive Coordination', desc: 'Syncs compressor motor RPM precisely with live shop floor CFM demand.' },
        { step: 2, title: 'Unsealed Joint Anomaly Detection', desc: 'Flags pipe segments where pressure decays rapidly during off-shift hours.' },
        { step: 3, title: 'Automated Air Delivery Zoning', desc: 'Shuts off air supply valves to idle production bays automatically.' }
      ],
      turnaround: 'Saved 12% in monthly compressor electricity expenditure while maintaining constant air tool pressure.'
    },
    {
      num: '05',
      title: 'Facility boiler trip hazards and delayed section servicing',
      icon: 'Flame', // Boiler steam combustion hazard
      outcomeMetric: '99.9% Uptime',
      savings: 'Zero Boiler Trips',
      category: 'Steam & Boiler Safety',
      severity: 'Facility Hazard',
      painPointAnalysis: 'Industrial steam boilers that trip due to feedwater imbalances or pressure surges take hours to safely depressurize and restart, halting all plant heating.',
      solutionSteps: [
        { step: 1, title: 'Boiler Feedwater Chemistry Tracking', desc: 'Monitors steam pressure, water levels, and chemical treatment logs 24/7.' },
        { step: 2, title: 'Bypass Valve Automation', desc: 'Reroutes steam flow through secondary headers during scheduled valve maintenance.' },
        { step: 3, title: 'Automated Blowdown Scheduling', desc: 'Performs scheduled boiler blowdowns during planned shift transitions.' }
      ],
      turnaround: 'Achieved 99.9% facility utility loop availability with zero unplanned steam outages.'
    }
  ],

  /* ========================================================================= */
  /* 4. VISION AI & AUTOMATED OPTICAL INSPECTION                                */
  /* ========================================================================= */
  VISION_AI: [
    {
      num: '01',
      title: 'Micro-surface scratches and cosmetic blemishes escaping manual QA',
      icon: 'Eye', // Visual cosmetic inspection
      outcomeMetric: '99.8% Defect Catch',
      savings: '₹34 Lakhs Returns Avoided',
      category: 'Surface Inspection',
      severity: 'Customer Rejection Risk',
      painPointAnalysis: 'High-speed assembly lines cause human inspector eye fatigue, allowing sub-millimeter hairline scratches and coating blemishes to ship to Tier-1 OEMs.',
      solutionSteps: [
        { step: 1, title: 'High-Speed Line-Scan Cameras', desc: 'Captures 120 FPS high-resolution surface images at conveyor speed.' },
        { step: 2, title: 'Sub-Pixel Neural Segmentation', desc: 'Detects microscopic scratches, voids, and discolorations down to 15 microns.' },
        { step: 3, title: 'Instant Pneumatic Ejection', desc: 'Triggers line kickers to reject defective units without halting the line.' }
      ],
      turnaround: 'Reduced customer return rates by 94% with automated 15-micron defect detection.'
    },
    {
      num: '02',
      title: 'High false-positive rejection rates slowing down packaging lines',
      icon: 'AlertTriangle', // False alarm bottlenecks
      outcomeMetric: '<0.1% False Trips',
      savings: '₹22 Lakhs Rework Cut',
      category: 'Inspection Accuracy',
      severity: 'Yield Inefficiency',
      painPointAnalysis: 'Traditional threshold sensors flag harmless shadow variations as structural defects, forcing operators to manually re-inspect hundreds of good parts.',
      solutionSteps: [
        { step: 1, title: 'Dynamic Contrast Calibration', desc: 'Separates genuine physical cracks from harmless oil smudges and reflections.' },
        { step: 2, title: 'Self-Calibrating Decision Edge', desc: 'Continuously updates tolerance boundaries against confirmed golden samples.' },
        { step: 3, title: 'Continuous Model Validation', desc: 'Suppresses false defect alarms while retaining 100% true defect capture.' }
      ],
      turnaround: 'Cut false-positive scrap rejections by 88%, unlocking 14 hours of weekly packaging line capacity.'
    },
    {
      num: '03',
      title: 'Inconsistent optical inspection across variable ambient plant lighting',
      icon: 'ScanEye', // Optical scanning under lighting shifts
      outcomeMetric: '100% Optical Stability',
      savings: 'Zero Sunlight Bias',
      category: 'Optical Calibration',
      severity: 'Quality Variance',
      painPointAnalysis: 'Direct sunlight from factory skylights and shifting bay illumination distort visual camera exposures, degrading defect classification accuracy across shifts.',
      solutionSteps: [
        { step: 1, title: 'Polarized Multi-Spectrum Strobing', desc: 'Isolates part surfaces using synchronized narrow-band LED strobe arrays.' },
        { step: 2, title: 'Ambient Light Normalization', desc: 'Auto-compensates camera gain and exposure based on ambient lux sensors.' },
        { step: 3, title: 'Constant Exposure Assurance', desc: 'Delivers uniform contrast regardless of time of day or seasonal weather.' }
      ],
      turnaround: 'Standardized optical inspection accuracy at 99.8% across day, night, and mixed-shift sunlight.'
    },
    {
      num: '04',
      title: 'Undetected dimensional drift on high-speed stamping presses',
      icon: 'ScanLine', // Dimensional coordinate scanning
      outcomeMetric: '±0.02mm Tolerance',
      savings: '₹29 Lakhs Tooling Wear',
      category: 'Metrology Drift',
      severity: 'Tooling Wear Risk',
      painPointAnalysis: 'Progressive stamping die thermal expansion causes hole diameters and bend angles to creep outside OEM blueprint specifications over long shifts.',
      solutionSteps: [
        { step: 1, title: 'In-Line Laser Coordinate Gauging', desc: 'Measures 28 critical dimensional datums per stamped piece in real time.' },
        { step: 2, title: 'Statistical Process Control (SPC) Feed', desc: 'Traces dimensional trends to detect punch pin wear before out-of-spec parts occur.' },
        { step: 3, title: 'Automated Press Offset Correction', desc: 'Signals press controllers to adjust stroke depth automatically.' }
      ],
      turnaround: 'Maintained strict ±0.02mm tolerances across 500,000 continuous stamping strokes.'
    },
    {
      num: '05',
      title: 'Unlogged defect image archives creating supplier dispute delays',
      icon: 'FileText', // Defect image archiving & documentation
      outcomeMetric: '100% Traceable Images',
      savings: 'Zero Dispute Losses',
      category: 'Digital Genealogy',
      severity: 'Audit Vulnerability',
      painPointAnalysis: 'Without high-resolution timestamped image proof of part conditions at station handoffs, resolving defect blame between suppliers and assembly takes weeks.',
      solutionSteps: [
        { step: 1, title: 'Automated Serialized Defect Snapshots', desc: 'Indexes high-res images to part barcode serial numbers.' },
        { step: 2, title: 'Cloud Defect Repository Sync', desc: 'Uploads classified defect crops to a secure searchable portal.' },
        { step: 3, title: '1-Click Quality Certificate Sharing', desc: 'Dispatches conclusive visual proof to suppliers within minutes of defect discovery.' }
      ],
      turnaround: 'Resolved vendor defect disputes in 15 minutes instead of 3 weeks with instant visual proof.'
    }
  ],

  /* ========================================================================= */
  /* 5. MANUFACTURING UNIT COST AGENT                                          */
  /* ========================================================================= */
  UNIT_COST: [
    {
      num: '01',
      title: 'Hidden overhead and machine energy creep eroding batch margins',
      icon: 'DollarSign', // Batch profit erosion & overhead costs
      outcomeMetric: '100% True Cost Visibility',
      savings: '₹55 Lakhs Margin Recovery',
      category: 'Margin Protection',
      severity: 'Profit Erosion',
      painPointAnalysis: 'Standard cost estimations fail to account for machine setup idle power, coolant usage, and auxiliary tooling wear, silently destroying gross margins.',
      solutionSteps: [
        { step: 1, title: 'Activity-Based Cost Engine', desc: 'Maps exact machine electrical kilowatt-hours and operator hours to each part serial.' },
        { step: 2, title: 'Live Margin Variance Alerts', desc: 'Notifies plant financial controllers when batch cost exceeds target quote by >3%.' },
        { step: 3, title: 'Batch Profitability Re-balancing', desc: 'Optimizes machine feed rates to maximize unit margin without slowing fulfillment.' }
      ],
      turnaround: 'Identified ₹55 Lakhs in hidden process overhead and improved net gross margin by 2.8%.'
    },
    {
      num: '02',
      title: 'Inaccurate scrap cost allocation across multi-cavity tooling',
      icon: 'Coins', // Scrap cost allocation & material currency
      outcomeMetric: '±0.5% Cost Allocation',
      savings: '₹26 Lakhs Scrap Recaptured',
      category: 'Scrap Metrology',
      severity: 'Financial Skew',
      painPointAnalysis: 'Lumping scrap into a global plant overhead pool hides the fact that specific molds or product variants are generating 80% of the scrap expenses.',
      solutionSteps: [
        { step: 1, title: 'Cavity-Level Scrap Telemetry', desc: 'Assigns scrap resin and metal weight directly to the offending tool cavity.' },
        { step: 2, title: 'Product Line P&L Realignment', desc: 'Recalculates true product line contribution margins using accurate scrap rates.' },
        { step: 3, title: 'Targeted Mold Refurbishment', desc: 'Prioritizes toolroom maintenance on molds with the highest financial scrap penalties.' }
      ],
      turnaround: 'Eliminated cost subsidization across product lines, accurately pricing high-wear parts.'
    },
    {
      num: '03',
      title: 'Unbudgeted emergency freight surcharges inflating component costs',
      icon: 'Truck', // Rush freight surcharges & logistics
      outcomeMetric: 'Zero Expedited Air Bills',
      savings: '₹31 Lakhs Rush Freight Saved',
      category: 'Logistics Cost Control',
      severity: 'Emergency Surcharge',
      painPointAnalysis: 'Production delays force operations to pay 10x standard freight rates for emergency next-day air shipping to avoid customer line-stop penalties.',
      solutionSteps: [
        { step: 1, title: 'Production Velocity Lead-Time Guard', desc: 'Predicts finished goods completion time 72 hours in advance.' },
        { step: 2, title: 'Standard Freight Window Locks', desc: 'Books economical road and rail carriers days before dispatch deadlines.' },
        { step: 3, title: 'Delay Risk Escalation', desc: 'Re-sequences priority pallets to guarantee on-time completion via standard shipping.' }
      ],
      turnaround: 'Cut rush air-freight penalties by 84%, saving ₹31 Lakhs in unbudgeted logistics fees.'
    },
    {
      num: '04',
      title: 'Delayed cost variances discovered weeks after monthly financial close',
      icon: 'Clock', // Delayed monthly financial close & variance lag
      outcomeMetric: 'Live Daily Cost Closing',
      savings: '30-Day Delay Eliminated',
      category: 'Financial Agility',
      severity: 'Executive Blindspot',
      painPointAnalysis: 'Plant managers only learn a product ran 15% over budget 30 days after shipment when ERP cost accounting batches close, making corrective action impossible.',
      solutionSteps: [
        { step: 1, title: 'Live Shift Cost Rollups', desc: 'Aggregates material, labor, and machine energy cost at the end of every operating shift.' },
        { step: 2, title: 'Intra-Day Variance Tracking', desc: 'Highlights cost overruns while the job order is still running on the machine.' },
        { step: 3, title: 'Immediate Shop Floor Correction', desc: 'Enables supervisors to adjust tooling and speeds mid-run to protect profitability.' }
      ],
      turnaround: 'Shortened cost variance discovery from 30 days to 1 shift, preventing ₹40 Lakhs in cumulative budget overruns.'
    },
    {
      num: '05',
      title: 'Fluctuating raw material input prices destroying contract profitability',
      icon: 'TrendingUp', // Raw material price fluctuations & market trends
      outcomeMetric: 'Dynamic Margin Hedging',
      savings: '₹48 Lakhs Hedged',
      category: 'Procurement Strategy',
      severity: 'Market Price Exposure',
      painPointAnalysis: 'Sudden surges in copper, aluminum, or polymer spot prices erode margins on fixed-price long-term customer purchase contracts.',
      solutionSteps: [
        { step: 1, title: 'Commodity Index Feed Integration', desc: 'Tracks real-time raw material market prices against BOM index allowances.' },
        { step: 2, title: 'Dynamic Price Adjustment Triggers', desc: 'Calculates contract index surcharge formulas automatically.' },
        { step: 3, title: 'Optimal Buying Window Alerts', desc: 'Signals procurement to bulk-buy raw stock during commodity price dips.' }
      ],
      turnaround: 'Protected contract profit margins against commodity price volatility across ₹12 Cr in annual purchases.'
    }
  ],

  /* ========================================================================= */
  /* 6. PRODUCTION PLANNING & OPERATIONS SYSTEM                                */
  /* ========================================================================= */
  PROD_PLANNING: [
    {
      num: '01',
      title: 'Unbalanced production schedules causing upstream line starvation',
      icon: 'Workflow', // Line flow balance & process workflow
      outcomeMetric: '98% Line Flow Balance',
      savings: '₹38 Lakhs Throughput Gained',
      category: 'Line Balancing',
      severity: 'Throughput Bottleneck',
      painPointAnalysis: 'Mismatched machine cycle times cause buffer accumulation at fast stations while downstream assembly lines sit starved waiting for components.',
      solutionSteps: [
        { step: 1, title: 'Live Takt Time Harmonization', desc: 'Syncs cycle speeds across upstream machining and downstream packaging cells.' },
        { step: 2, title: 'Dynamic Work-in-Progress Buffers', desc: 'Balances buffer sizes based on active station throughput rates.' },
        { step: 3, title: 'Automated Line Pacing', desc: 'Ramps feeder stations up or down to maintain continuous fluid line velocity.' }
      ],
      turnaround: 'Eliminated station starvation and increased effective factory throughput by 14%.'
    },
    {
      num: '02',
      title: 'Urgent customer change orders disrupting continuous batch runs',
      icon: 'Calendar', // Order calendar & change management
      outcomeMetric: '<15 Min Rescheduling',
      savings: 'Zero Run Waste',
      category: 'Schedule Agility',
      severity: 'Disruption Risk',
      painPointAnalysis: 'Sudden customer expedite requests force supervisors to tear down active machine setups, wasting hours in scrapped setup time.',
      solutionSteps: [
        { step: 1, title: 'Digital Schedule Re-sequencing', desc: 'Optimizes order insertion to minimize setup tool changeover penalties.' },
        { step: 2, title: 'Color and Tool Family Grouping', desc: 'Sequences compatible variants together to reuse identical machine fixtures.' },
        { step: 3, title: 'Automated Workstation Dispatch', desc: 'Pushes revised job orders directly to operator touchscreens instantly.' }
      ],
      turnaround: 'Accommodated urgent customer rush orders with zero teardown scrap and 60% faster turnaround.'
    },
    {
      num: '03',
      title: 'Tool changeover delays extending planned setup intervals',
      icon: 'Clock', // Changeover setup clock delays
      outcomeMetric: '↓ 42% Setup Time',
      savings: '₹24 Lakhs Uptime Gained',
      category: 'SMED Optimization',
      severity: 'Idle Machine Drain',
      painPointAnalysis: 'Technicians searching for dies, fixtures, and calibration tools double machine changeover downtime between different production runs.',
      solutionSteps: [
        { step: 1, title: 'Pre-Staged Tooling Kitting', desc: 'Pre-routes required dies and calibration gauges to the bay 30 minutes prior.' },
        { step: 2, title: 'Guided Setup Checklists', desc: 'Steps operators through standardized SMED quick-change procedures.' },
        { step: 3, title: 'Digital First-Piece Verification', desc: 'Instantly validates tool offset accuracy on the first stamped piece.' }
      ],
      turnaround: 'Cut die changeover duration from 65 minutes down to 38 minutes across 8 primary stamping lines.'
    },
    {
      num: '04',
      title: 'Inaccurate cycle time assumptions inflating work-in-progress inventory',
      icon: 'Timer', // Cycle timer accuracy & pacing
      outcomeMetric: '±1.2% Cycle Accuracy',
      savings: '₹19 Lakhs WIP Reduction',
      category: 'WIP Control',
      severity: 'Inventory Bloat',
      painPointAnalysis: 'Using idealized engineering blueprint times instead of actual floor cycle times creates massive piles of unfinished parts cluttering aisles.',
      solutionSteps: [
        { step: 1, title: 'Actual Cycle Time Telemetry', desc: 'Measures live PLC cycle duration across thousands of operating parts.' },
        { step: 2, title: 'Dynamic ERP Master Sync', desc: 'Auto-updates ERP routing sheets with true empirical run speeds.' },
        { step: 3, title: 'Pull-System Buffer Control', desc: 'Restricts upstream parts release until downstream buffer consumption triggers.' }
      ],
      turnaround: 'Reduced floor work-in-progress inventory by 32% and recovered 1,200 sq.ft of shop floor space.'
    },
    {
      num: '05',
      title: 'Multi-facility production silos duplicating changeover setups',
      icon: 'Factory', // Multi-plant facility planning
      outcomeMetric: 'Unified Global Dispatch',
      savings: '₹46 Lakhs Fleet Savings',
      category: 'Enterprise Capacity',
      severity: 'Fleet Inefficiency',
      painPointAnalysis: 'Plant 1 runs overtime manufacturing Part A while Plant 2 has idle capacity for the exact same tooling, inflating enterprise manufacturing costs.',
      solutionSteps: [
        { step: 1, title: 'Enterprise Capacity Aggregation', desc: 'Consolidates machine load across all facilities into one global planning cockpit.' },
        { step: 2, title: 'Automated Job Shifting', desc: 'Reroutes overflow volumes to nearby facilities with available setup tooling.' },
        { step: 3, title: 'Regional Logistics Optimization', desc: 'Balances freight cost against overtime production expenses.' }
      ],
      turnaround: 'Balanced machine utilization across 6 manufacturing sites, cutting overtime spend by ₹46 Lakhs.'
    }
  ],

  /* ========================================================================= */
  /* 7. EHS & PLANT WORKFORCE SAFETY SYSTEM                                    */
  /* ========================================================================= */
  EHS_SAFETY: [
    {
      num: '01',
      title: 'Unflagged hazard zones and close-proximity forklift collisions',
      icon: 'AlertTriangle', // Collision hazard warning
      outcomeMetric: 'Zero Collision Incidents',
      savings: '₹75 Lakhs Liability Avoided',
      category: 'Collision Prevention',
      severity: 'Severe Physical Hazard',
      painPointAnalysis: 'Blind intersections and high-traffic pedestrian crosswalks in manufacturing warehouses create high-risk forklift impact hazards.',
      solutionSteps: [
        { step: 1, title: 'Ultra-Wideband Proximity Beacons', desc: 'Tracks active distance between forklift telematics and pedestrian worker badges.' },
        { step: 2, title: 'Dynamic Speed Governors', desc: 'Autonomously slows vehicle speed when approaching blind corners or worker clusters.' },
        { step: 3, title: 'Visual Intersection Projectors', desc: 'Projects bright hazard warning arrows onto shop floor pavement ahead of moving vehicles.' }
      ],
      turnaround: 'Achieved 420+ consecutive days with zero vehicle-pedestrian near-misses across all 6 plant logistics bays.'
    },
    {
      num: '02',
      title: 'Missed mandatory PPE compliance checks on high-risk chemical lines',
      icon: 'HardHat', // Worker PPE compliance & protective gear
      outcomeMetric: '100% PPE Verification',
      savings: 'Zero OSHA Violations',
      category: 'Personal Protection',
      severity: 'Compliance Hazard',
      painPointAnalysis: 'Workers entering hazardous plating and solvent wash cells without eye protection or respirators risk severe chemical injuries and regulatory shutdowns.',
      solutionSteps: [
        { step: 1, title: 'Edge Computer Vision Gateways', desc: 'Scans operators at cleanroom and hazardous cell turnstiles.' },
        { step: 2, title: 'Multi-Gear Verification', desc: 'Verifies safety glasses, respirators, ear protection, and chemical gloves.' },
        { step: 3, title: 'Interlocked Gate Access', desc: 'Unlocks cell access turnstiles only upon 100% confirmed gear compliance.' }
      ],
      turnaround: 'Eliminated 100% of chemical splash and eye injury risks with automated gate enforcement.'
    },
    {
      num: '03',
      title: 'Incomplete machine safety interlocking checks before shift start',
      icon: 'ShieldAlert', // Machine safety interlock guard
      outcomeMetric: '100% Safety Guard Uptime',
      savings: 'Zero Mechanical Pinch Incidents',
      category: 'Machine Safety',
      severity: 'Critical Safety Hazard',
      painPointAnalysis: 'Bypassed light curtains and misaligned interlock switches allow machinery to cycle with open guards, exposing operators to pinch-point trauma.',
      solutionSteps: [
        { step: 1, title: 'Pre-Shift Safety Interlock Sweep', desc: 'Electronically tests all emergency stops, light curtains, and door switches.' },
        { step: 2, title: 'Bypass Detection Alarms', desc: 'Flags tampered or jumpered interlock relays immediately to safety directors.' },
        { step: 3, title: 'Mandatory Digital Clearance', desc: 'Prevents main motor PLC boot until safety verification passes.' }
      ],
      turnaround: 'Maintained 100% machine safety circuit integrity across 240 heavy stamping and stamping presses.'
    },
    {
      num: '04',
      title: 'Delayed emergency evacuation drills and unverified muster headcounts',
      icon: 'Users', // Workforce muster headcounts & emergency personnel
      outcomeMetric: '<90s Muster Accountability',
      savings: 'Life Safety Assurance',
      category: 'Emergency Response',
      severity: 'Life Safety Risk',
      painPointAnalysis: 'During plant fire alarms, paper clipboard headcounts take over 20 minutes to account for all staff and contractors across sprawling facilities.',
      solutionSteps: [
        { step: 1, title: 'Automated RFID Muster Scanners', desc: 'Logs worker badges automatically as personnel reach safe assembly zones.' },
        { step: 2, title: 'Live Missing Personnel Roster', desc: 'Cross-references shift badge entries to pinpoint exact missing individuals.' },
        { step: 3, title: 'First-Responder GPS Guidance', desc: 'Provides emergency services with exact last-known indoor locations.' }
      ],
      turnaround: 'Cut total emergency headcount verification time from 22 minutes to 84 seconds.'
    },
    {
      num: '05',
      title: 'Audit compliance fines from missing timestamped safety training records',
      icon: 'ShieldCheck', // Safety compliance verification & audit pass
      outcomeMetric: '100% Audit Readiness',
      savings: 'Zero Compliance Penalties',
      category: 'Regulatory Compliance',
      severity: 'Audit Fine Risk',
      painPointAnalysis: 'Incomplete paperwork for operator crane certifications and chemical handling licenses results in heavy regulatory fines during surprise inspections.',
      solutionSteps: [
        { step: 1, title: 'Digital Skill Matrix Sync', desc: 'Links operator machine badge swipe directly to their certified training profile.' },
        { step: 2, title: 'Uncertified Operation Interlock', desc: 'Prevents unauthorized or lapsed operators from powering on specialized equipment.' },
        { step: 3, title: '1-Click Audit Trail Generator', desc: 'Produces tamper-proof digital compliance certificates for regulatory inspectors.' }
      ],
      turnaround: 'Passed 14 consecutive ISO 45001 and OSHA audits with zero citations or safety penalty fines.'
    }
  ]
};

// Default generic generator for any agent without custom override
// Every problem uses a specific, semantically appropriate icon
export function getProblemsForAgent(agent) {
  if (!agent) return AGENT_PROBLEMS_MAP.PRED_MAINT;
  const code = (agent.code || '').toUpperCase();
  if (AGENT_PROBLEMS_MAP[code]) {
    return AGENT_PROBLEMS_MAP[code];
  }

  // Generate dynamic, realistic manufacturing problems tailored to agent's sector & domain
  const agentName = agent.name || 'System';
  return [
    {
      num: '01',
      title: `Unplanned ${agentName} downtime and sudden line stoppages`,
      icon: 'Wrench', // Machine line stoppage & mechanical repair
      outcomeMetric: '↓ 30% Stoppages',
      savings: '₹1.2 Cr Saved',
      category: 'Operational Continuity',
      severity: 'High Operational Risk',
      painPointAnalysis: `Sudden unpredicted interruptions in ${agentName} halt dependent manufacturing cells, stranding operators and causing expensive emergency overtime.`,
      solutionSteps: [
        { step: 1, title: '24/7 Live Edge Telemetry', desc: `Continuous sensing across all ${agentName} shop floor parameters.` },
        { step: 2, title: 'Predictive Anomaly Detection', desc: 'AI models identify micro-drifts days before equipment halts.' },
        { step: 3, title: 'Autonomous Preventive Action', desc: 'Dispatches corrective work orders during scheduled shift pauses.' }
      ],
      turnaround: `Eliminated unplanned stoppages and maintained 98%+ reliability for ${agentName}.`
    },
    {
      num: '02',
      title: `Bottlenecks and speed losses during peak manufacturing shifts`,
      icon: 'Timer', // Speed losses and cycle pacing
      outcomeMetric: '+18% Throughput',
      savings: '₹48 Lakhs Unlocked',
      category: 'Efficiency & Flow',
      severity: 'Throughput Loss',
      painPointAnalysis: `Line starvation and micro-stoppages reduce effective throughput, preventing the facility from hitting confirmed customer order targets.`,
      solutionSteps: [
        { step: 1, title: 'Cycle Time Tracking', desc: 'Monitors exact machine cycle speeds against design specifications.' },
        { step: 2, title: 'Flow Funnel Optimization', desc: 'Clears upstream starvation and balances line handoffs.' },
        { step: 3, title: 'Supervisor Action Push', desc: 'Sends instant alerts with exact corrective action recommendations.' }
      ],
      turnaround: `Unlocked 18% additional capacity without purchasing new machinery.`
    },
    {
      num: '03',
      title: `Excessive scrap expenditure and undetected part quality drift`,
      icon: 'ScanLine', // Metrology scan & quality defect tolerance
      outcomeMetric: '99.2% First-Pass Yield',
      savings: '₹35 Lakhs Scrap Cut',
      category: 'Quality Assurance',
      severity: 'Material Waste',
      painPointAnalysis: `Defects identified late in the manufacturing sequence force entire lots to be scrapped or reworked at heavy financial cost.`,
      solutionSteps: [
        { step: 1, title: 'In-Line Tolerance Verification', desc: 'Measures machined part dimensions continuously during production.' },
        { step: 2, title: 'Early Scrap Drift Warning', desc: 'Alerts operators before tool wear breaches specification limits.' },
        { step: 3, title: 'Automated Tool Compensation', desc: 'Adjusts machine offsets automatically to maintain zero-defect standards.' }
      ],
      turnaround: `Drove First-Pass Yield to 99.2% and cut annual scrap costs by 24%.`
    },
    {
      num: '04',
      title: `Delayed shift handovers and conflicting shop floor data logs`,
      icon: 'Clock', // Shift handover timing & clock synchrony
      outcomeMetric: 'Zero Startup Delay',
      savings: '100% Data Sync',
      category: 'Data Integrity',
      severity: 'Shift Friction',
      painPointAnalysis: `Paper logs and manual shift handovers create confusion between incoming and outgoing crews, delaying line startups by up to 30 minutes.`,
      solutionSteps: [
        { step: 1, title: 'Digital Shift Heartbeat', desc: 'Captures live production tallies directly from machine PLCs.' },
        { step: 2, title: 'Automated Shift Briefs', desc: 'Generates instant handover summaries with open actions.' },
        { step: 3, title: 'One-Click Readiness Sign-off', desc: 'Verifies station readiness before shift clock begins.' }
      ],
      turnaround: `Eliminated shift handover startup delays, recovering 40+ production hours annually.`
    },
    {
      num: '05',
      title: `Unverified compliance certifications and safety hazard risks`,
      icon: 'ShieldAlert', // Safety hazard warning & compliance risk
      outcomeMetric: '100% Verified',
      savings: 'Zero Compliance Fines',
      category: 'Safety & Compliance',
      severity: 'Regulatory Risk',
      painPointAnalysis: `Missed safety protocols and unverified process certifications risk worker safety incidents and expensive regulatory fines.`,
      solutionSteps: [
        { step: 1, title: 'Digital Compliance Guard', desc: 'Enforces mandatory safety checklists before machine activation.' },
        { step: 2, title: 'Hazard Perimeter Monitoring', desc: 'Maintains active geofences around dangerous automation cells.' },
        { step: 3, title: 'Automated Audit Trail', desc: 'Logs complete timestamped compliance records for regulatory inspections.' }
      ],
      turnaround: `Achieved 100% safety and regulatory audit pass rates across all facilities.`
    }
  ];
}
