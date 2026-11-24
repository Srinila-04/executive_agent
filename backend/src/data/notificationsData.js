/**
 * Enterprise Notifications Store for Manufacturing 360° Multi-Agent Platform
 * Handles:
 * 1. Agent stoppage notifications with concise one-line failure reasons
 * 2. Intelligent operational analysis and important updates across all 19 domain agents
 */

let NOTIFICATIONS = [
  /* ========================================================================= */
  /* 1. AGENTS STOPPED RUNNING (With Clear One-Line Reasons)                   */
  /* ========================================================================= */
  {
    id: 'notif-stop-4',
    agentId: 4,
    agentNumber: 4,
    agentName: 'Predictive Maintenance System (Module 04)',
    sector: 'Maintenance & Utilities',
    severity: 'error',
    isStoppedAgent: true,
    title: 'Agent 04 Stopped Running — Acoustic Spindle Harmonic Anomaly',
    oneLineReason: 'Reason: Vibration harmonic frequency drift (4.8 kHz) on Spindle Bearing B-2 exceeded ISO-10816 safety shutdown threshold.',
    message: 'Predictive Maintenance worker halted automated telemetry stream after detecting continuous abnormal bearing friction during high-speed CNC milling.',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    status: 'unread',
    rootCause: 'Vibration harmonic frequency drift (4.8 kHz) on Spindle Bearing B-2 exceeded ISO-10816 safety shutdown threshold.',
    suggestedAction: 'CMMS Work Order #WO-8829 auto-created with SKF synthetic grease specs. Replace bearing seal and click Restart Agent.',
    kpiImpact: 'Avoided ₹1.8 Cr catastrophic spindle seizure'
  },
  {
    id: 'notif-stop-6',
    agentId: 6,
    agentNumber: 6,
    agentName: 'Automated Optical Inspection System (Module 06)',
    sector: 'Quality & Engineering',
    severity: 'error',
    isStoppedAgent: true,
    title: 'Agent 06 Stopped Running — Camera Strobe Driver Synchronization Fault',
    oneLineReason: 'Reason: High-resolution camera strobe driver dropped synchronization frame pulses on Surface Inspection Gate 01.',
    message: 'Optical inspection image acquisition stopped to prevent uninspected bracket parts from bypassing automated surface defect classification.',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    status: 'unread',
    rootCause: 'High-resolution camera strobe driver dropped synchronization frame pulses on Surface Inspection Gate 01.',
    suggestedAction: 'Reset Cognex frame-grabber interface over GigE Vision bridge and restart agent service.',
    kpiImpact: 'Prevented uninspected parts entering final pack'
  },

  /* ========================================================================= */
  /* 2. ANALYZED IMPORTANT UPDATES ACROSS ALL 19 AGENTS                        */
  /* ========================================================================= */
  {
    id: 'notif-upd-1',
    agentId: 1,
    agentNumber: 1,
    agentName: 'Production Planning System (Module 01)',
    sector: 'Production & Planning',
    severity: 'info',
    isAgentAnalysis: true,
    title: 'Module 01 Analysis: Stamping Sequence Optimized',
    oneLineReason: 'Update: Re-sequenced 4,200 sheet metal stamping jobs to off-peak shift, eliminating 28 mins of planned changeover downtime.',
    message: 'AI production solver re-sequenced batch runs against die changeover matrix. Achieved 98.2% schedule adherence and reduced idle line transition time by 14%.',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: 'unread',
    rootCause: 'Dynamic job re-clustering based on material coil thickness groupings.',
    suggestedAction: 'Approved finite capacity plan dispatched to Line 01 and Line 02 supervisors.',
    kpiImpact: '+28 Mins Production Time Gained'
  },
  {
    id: 'notif-upd-2',
    agentId: 2,
    agentNumber: 2,
    agentName: 'Production Monitoring System (Module 02)',
    sector: 'Production & Planning',
    severity: 'warning',
    isAgentAnalysis: true,
    title: 'Module 02 Analysis: Intermittent Micro-Stops Isolated on Line 03',
    oneLineReason: 'Update: Detected 14 recurring 10-second micro-stops on Packaging Conveyor 03; sensor alignment alert dispatched.',
    message: 'Line telemetry comparison identified brief part jamming at robotic orienter. Alerted maintenance to re-align photo-electric emitter before shift target was impacted.',
    timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    status: 'unread',
    rootCause: 'Photo-eye reflector vibration loosening at Conveyor 03 transfer point.',
    suggestedAction: 'Tighten mounting bracket during upcoming 15-minute tea break window.',
    kpiImpact: 'Shift Attainment Maintained at 94.0%'
  },
  {
    id: 'notif-upd-3',
    agentId: 3,
    agentNumber: 3,
    agentName: 'OEE Performance Optimization System (Module 03)',
    sector: 'Production & Planning',
    severity: 'success',
    isAgentAnalysis: true,
    title: 'Module 03 Analysis: Morning Shift OEE Surpassed 91.8%',
    oneLineReason: 'Update: Line 03 achieved 91.8% OEE for morning shift (beating 85% plant benchmark); minor stop duration fell by 42%.',
    message: 'Real-time speed regulation and buffer smoothing enabled record operational continuity across CNC cell. Quality score held firm at 98.4%.',
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    status: 'read',
    rootCause: 'Harmonized takt speed matching between press feeder and secondary welding station.',
    suggestedAction: 'Export OEE shift summary to plant executive board report.',
    kpiImpact: '+6.8% Above Plant Target'
  },
  {
    id: 'notif-upd-5',
    agentId: 5,
    agentNumber: 5,
    agentName: 'Quality Management & Inspection System (Module 05)',
    sector: 'Quality & Engineering',
    severity: 'warning',
    isAgentAnalysis: true,
    title: 'Module 05 Analysis: Dimensional Drift Feedback Corrected',
    oneLineReason: 'Update: Closed-loop feedback corrected +0.06mm hole-position drift on Stamping Die #04, preventing ₹65L in potential scrap.',
    message: 'Vision gauges flagged slight thermal expansion on tooling pin. Automated offset command applied to servo feed to re-center hole piercing.',
    timestamp: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
    status: 'unread',
    rootCause: 'Die thermal expansion during high-speed 90-stroke/min continuous run.',
    suggestedAction: 'Coolant flow rate to Die #04 increased by 12% to stabilize thermal profile.',
    kpiImpact: '₹65 Lakhs Scrap Prevented'
  },
  {
    id: 'notif-upd-7',
    agentId: 7,
    agentNumber: 7,
    agentName: 'Engineering Change & BOM System (Module 07)',
    sector: 'Quality & Engineering',
    severity: 'info',
    isAgentAnalysis: true,
    title: 'Module 07 Analysis: Engineering Change Order ECO-2026-88 Released',
    oneLineReason: 'Update: Synchronized revised wiring harness fastener BOM across ERP and line-side MES terminals with zero scrap.',
    message: 'Seamless engineering change rollout ensured old fastener stock was depleted exactly to zero before the upgraded M6 alloy screw was introduced.',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    status: 'read',
    rootCause: 'Approved engineering revision for enhanced corrosion resistance on export models.',
    suggestedAction: 'BOM revision locked in SAP S/4HANA with automated validation stamp.',
    kpiImpact: 'Zero Obsolete Part Write-offs'
  },
  {
    id: 'notif-upd-8',
    agentId: 8,
    agentNumber: 8,
    agentName: 'Product Traceability & Genealogy System (Module 08)',
    sector: 'Quality & Engineering',
    severity: 'success',
    isAgentAnalysis: true,
    title: 'Module 08 Analysis: 100% Genealogy Lock for Batch #AB-442',
    oneLineReason: 'Update: Verified complete component heat-number genealogy across 1,500 automotive brackets with zero certificate gaps.',
    message: 'Every finished unit tied directly to raw coil steel mill certificate, welding wire batch, and operator badge ID for audit compliance.',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    status: 'read',
    rootCause: 'Automated 2D barcode scan verification at each assembly station.',
    suggestedAction: 'Quality passport generated and transmitted to customer portal.',
    kpiImpact: '100% Audit Readiness'
  },
  {
    id: 'notif-upd-9',
    agentId: 9,
    agentNumber: 9,
    agentName: 'Inventory Optimization & Buffer System (Module 09)',
    sector: 'Supply Chain & Customers',
    severity: 'warning',
    isAgentAnalysis: true,
    title: 'Module 09 Analysis: Critical Safety Stock Buffer Re-order',
    oneLineReason: 'Update: Raw material grade SS-304 sheet coil dropped below 48-hr buffer; expedited replenishment PO auto-created.',
    message: 'Unscheduled spike in stamping volume consumed safety buffer. Agent auto-calculated optimal economic order quantity and notified sourcing.',
    timestamp: new Date(Date.now() - 1000 * 60 * 125).toISOString(),
    status: 'unread',
    rootCause: 'Spike in customer demand for export chassis bracket variant.',
    suggestedAction: 'Authorize PO #PO-94182 to JSW Steel via Automated RFQ System.',
    kpiImpact: 'Zero Part Shortage Line Halts'
  },
  {
    id: 'notif-upd-10',
    agentId: 10,
    agentNumber: 10,
    agentName: 'Supplier Performance & Risk System (Module 10)',
    sector: 'Supply Chain & Customers',
    severity: 'warning',
    isAgentAnalysis: true,
    title: 'Module 10 Analysis: Fastener Vendor Transit Delay Escalation',
    oneLineReason: 'Update: Fastener supplier Jindal Fasteners flagged for 72-hr transit delay; secondary buffer in Pune automatically reserved.',
    message: 'Vendor tracking API indicated delay at interstate border. Secondary supplier buffer in Pune was auto-engaged to prevent assembly line starvation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    status: 'unread',
    rootCause: 'Interstate logistics strike on NH-48 freight corridor.',
    suggestedAction: 'Activate 3-day buffer dispatch from secondary certified supplier.',
    kpiImpact: 'Protected 450 Assembled Vehicles'
  },
  {
    id: 'notif-upd-11',
    agentId: 11,
    agentNumber: 11,
    agentName: 'Automated Sourcing & RFQ System (Module 11)',
    sector: 'Supply Chain & Customers',
    severity: 'success',
    isAgentAnalysis: true,
    title: 'Module 11 Analysis: Competitive RFQ Awarded with ₹8.4L Savings',
    oneLineReason: 'Update: Processed 4 supplier quotes for copper wiring harness; selected lowest landed cost with ISO-9001 certified vendor.',
    message: 'Algorithmic supplier evaluation factored freight, payment terms, and historical defect rate to recommend top quotation.',
    timestamp: new Date(Date.now() - 1000 * 60 * 160).toISOString(),
    status: 'read',
    rootCause: 'Automated RFQ round completed with 4 pre-qualified tier-1 vendors.',
    suggestedAction: 'Contract PO executed automatically with standard 30-day payment terms.',
    kpiImpact: '₹8.4 Lakhs Direct Procurement Savings'
  },
  {
    id: 'notif-upd-12',
    agentId: 12,
    agentNumber: 12,
    agentName: 'Logistics & Dispatch Tracking System (Module 12)',
    sector: 'Supply Chain & Customers',
    severity: 'info',
    isAgentAnalysis: true,
    title: 'Module 12 Analysis: Fleet Transit Re-routed to Avoid Highway Stoppage',
    oneLineReason: 'Update: 4 inter-plant transit trailers dynamically re-routed via expressway bypass, preserving 98.6% on-time delivery.',
    message: 'GPS fleet tracking coordinated with dispatch docks to re-route outbound shipments around heavy regional highway construction.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'read',
    rootCause: 'Live traffic congestion detected on state highway arterial.',
    suggestedAction: 'Driver electronic dispatch manifests updated with toll bypass route.',
    kpiImpact: '98.6% On-Time Customer Delivery'
  },
  {
    id: 'notif-upd-13',
    agentId: 13,
    agentNumber: 13,
    agentName: 'Energy Management & Tariff System (Module 13)',
    sector: 'Maintenance & Utilities',
    severity: 'success',
    isAgentAnalysis: true,
    title: 'Module 13 Analysis: Peak Tariff Shaving Captured ₹1.8L Savings',
    oneLineReason: 'Update: Shifted 450 kW compressor load outside 18:00–21:00 peak billing hours, avoiding heavy utility penalty tariffs.',
    message: 'Automated chiller load pre-cooling scheduled before peak grid pricing window. Zero impact on plant ambient production comfort.',
    timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    status: 'read',
    rootCause: 'Dynamic tariff schedule rule auto-triggering utility compressor staging.',
    suggestedAction: 'Maintain automated energy scheduler across evening shifts.',
    kpiImpact: '₹1.8 Lakhs Tariff Penalties Avoided'
  },
  {
    id: 'notif-upd-14',
    agentId: 14,
    agentNumber: 14,
    agentName: 'EHS & Plant Safety Management System (Module 14)',
    sector: 'People & Safety',
    severity: 'success',
    isAgentAnalysis: true,
    title: 'Module 14 Analysis: 428 Days Incident-Free Safety Milestone',
    oneLineReason: 'Update: Vision safety sensors verified 100% PPE compliance and zero light-curtain breaches across 48 robotic press cells.',
    message: 'Continuous safety mesh audit verified all interlocks, emergency stop circuits, and machine guarding are fully operational.',
    timestamp: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    status: 'read',
    rootCause: 'Autonomous lockout-tagout verification and optical exclusion zones.',
    suggestedAction: 'Transmit daily safety compliance certification to plant director.',
    kpiImpact: '100% Zero Lost-Time Injuries'
  },
  {
    id: 'notif-upd-15',
    agentId: 15,
    agentNumber: 15,
    agentName: 'Workforce Allocation & Skills System (Module 15)',
    sector: 'People & Safety',
    severity: 'warning',
    isAgentAnalysis: true,
    title: 'Module 15 Analysis: 5-Axis CNC Certified Operator Roster Balanced',
    oneLineReason: 'Update: Identified certified machinist shortage for night shift; auto-notified qualified relief pool to avoid line downtime.',
    message: 'Skill matrix database cross-referenced upcoming schedule with operator certification records to assign certified backup personnel.',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    status: 'unread',
    rootCause: 'Medical leave request received 4 hours prior to shift commencement.',
    suggestedAction: 'Certified relief machinist accepted shift reassignment notification.',
    kpiImpact: 'Zero Machine Stoppage from Operator Gap'
  },
  {
    id: 'notif-upd-16',
    agentId: 16,
    agentNumber: 16,
    agentName: 'Manufacturing Unit Cost System (Module 16)',
    sector: 'Finance & Leadership',
    severity: 'success',
    isAgentAnalysis: true,
    title: 'Module 16 Analysis: Direct Unit Manufacturing Cost Lowered by ₹14.20',
    oneLineReason: 'Update: Reduced scrap rate and energy optimization lowered per-unit manufacturing cost to ₹412.80 (beating corporate target by 3.2%).',
    message: 'Real-time cost telemetry unified material consumption, machine energy tariff, and labor allocation into live unit cost tracking.',
    timestamp: new Date(Date.now() - 1000 * 60 * 260).toISOString(),
    status: 'read',
    rootCause: 'Synergistic improvements from Agent 03 (OEE) and Agent 13 (Energy Tariff).',
    suggestedAction: 'Publish executive cost variance summary to SAP financial ledger.',
    kpiImpact: '₹42.6 Lakhs Monthly Operating Margin Gain'
  },
  {
    id: 'notif-upd-17',
    agentId: 17,
    agentNumber: 17,
    agentName: 'Utilities & Facilities Management System (Module 17)',
    sector: 'Maintenance & Utilities',
    severity: 'info',
    isAgentAnalysis: true,
    title: 'Module 17 Analysis: Pneumatic Line Pressure Stabilized at 6.8 Bar',
    oneLineReason: 'Update: Pressure drop detected in Bay 03; secondary compressor modulation restored header pressure within 90 seconds.',
    message: 'Automated pressure regulator valves adjusted flow rate to prevent pneumatic torque wrench stalls on the assembly line.',
    timestamp: new Date(Date.now() - 1000 * 60 * 280).toISOString(),
    status: 'read',
    rootCause: 'Simultaneous tool changeover surge in welding sub-assembly bay.',
    suggestedAction: 'No manual intervention required. Automated pressure loop balanced.',
    kpiImpact: 'Pneumatic Tool Torque Maintained'
  },
  {
    id: 'notif-upd-18',
    agentId: 18,
    agentNumber: 18,
    agentName: 'Customer Order Fulfillment System (Module 18)',
    sector: 'Supply Chain & Customers',
    severity: 'success',
    isAgentAnalysis: true,
    title: 'Module 18 Analysis: Order #ORD-9824 Dispatched Ahead of SLA',
    oneLineReason: 'Update: Customer order ORD-9824 fulfilled 4 hours ahead of schedule with zero defect flags; tracking shared with OEM client.',
    message: 'Coordinated order packaging, quality release stamp, and logistics dispatch trailer loading ahead of target milestone.',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    status: 'read',
    rootCause: 'High line adherence and synchronized finished-goods staging.',
    suggestedAction: 'Shipping notice transmitted to Motherson Automotive customer ERP.',
    kpiImpact: '100% On-Time Customer SLA'
  },
  {
    id: 'notif-upd-19',
    agentId: 19,
    agentNumber: 19,
    agentName: 'Digital Plant Twin & Virtual Simulation System (Module 19)',
    sector: 'Production & Planning',
    severity: 'info',
    isAgentAnalysis: true,
    title: 'Module 19 Analysis: Throughput Bottleneck Simulation Complete',
    oneLineReason: 'Update: Virtual simulation identified assembly buffer expansion will raise plant throughput by 8.4% without capital investment.',
    message: 'Physics-based digital twin simulated 100,000 continuous operating cycles under varying demand mixes. Discovered buffer reallocation removes feeder starve.',
    timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    status: 'read',
    rootCause: 'Discrete-event simulation run completed on Chennai Plant 01 digital twin.',
    suggestedAction: 'Review simulation playback in Digital Plant Twin 3D workspace.',
    kpiImpact: '+8.4% Annual Throughput Uplift Potential'
  }
];

function addNotification(notif) {
  const newNotif = {
    id: `notif-${Date.now()}`,
    timestamp: new Date().toISOString(),
    status: 'unread',
    ...notif
  };
  NOTIFICATIONS.unshift(newNotif);
  return newNotif;
}

function getNotifications() {
  return NOTIFICATIONS;
}

function markAsRead(id) {
  if (id === 'all') {
    NOTIFICATIONS.forEach(n => n.status = 'read');
    return true;
  }
  const item = NOTIFICATIONS.find(n => n.id === id);
  if (item) {
    item.status = 'read';
    return true;
  }
  return false;
}

function clearNotification(id) {
  NOTIFICATIONS = NOTIFICATIONS.filter(n => n.id !== id);
}

module.exports = { getNotifications, addNotification, markAsRead, clearNotification };
