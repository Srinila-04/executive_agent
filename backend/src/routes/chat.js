const express = require('express');
const router = express.Router();
const { AGENTS, SECTORS } = require('../data/agentsData');
const { CONNECTORS } = require('../data/connectorsData');
const { getNotifications } = require('../data/notificationsData');
const { getSettings } = require('../data/settingsData');

router.post('/', (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const query = message.toLowerCase().trim();
  let answer = '';
  let relatedAgent = null;
  let quickSuggestions = [];

  // 1. Architecture questions
  if (query.includes('architecture') || query.includes('pipeline') || query.includes('etl') || query.includes('motherson') || query.includes('how it works') || query.includes('end to end')) {
    answer = `**GWC DATA.AI End-to-End Enterprise Architecture:**
1. **Source Systems (Edge):** Connects to MECPL MES, Shop Floor PLCs/IoT sensors, Excel reference sheets, and CMMS maintenance logs.
2. **Intermediate Gateway:** Routed via Motherson dedicated on-premise server (*IP: 10.244.101.228*).
3. **Automated Data Pipeline:** Python ETL running on a 10-minute Windows Task Scheduler validates and loads clean operational streams into intermediate SQL Server & Neon DB.
4. **Operations Systems Network:** 20 specialized operational modules analyze telemetry, enforce safety boundaries, predict failures, and optimize dispatch schedules.
5. **BI & Action Dispatcher:** Power BI dashboards and direct automated closed-loop triggers to supervisors across all plants.
6. **Executive Command Center (#20):** Multi-plant oversight for company owners across multiple states & districts.`;
    quickSuggestions = ['Show me OEE performance', 'Which module has alerts?', 'Check SAP connection'];
  }
  // 2. Specific Module Questions
  else if (query.includes('module 1') || query.includes('production planning') || query.includes('planning')) {
    const a = AGENTS.find(x => x.id === 1);
    answer = `**Module 01: Production Planning System (PROD_PLANNING)**
• **Mission:** ${a.purpose}
• **Current Status:** ${a.status.toUpperCase()} (${a.health})
• **Key Metrics:** Plan Adherence: ${a.metrics.planAdherence} | Schedule Attainment: ${a.metrics.scheduleAttainment} | WIP Reduction: ${a.metrics.wipReduction}
• **Inputs:** ${a.inputs}`;
    relatedAgent = a;
    quickSuggestions = ['Check Module 02 Monitoring', 'Show Production Sector', 'Open Planning Console'];
  }
  else if (query.includes('module 2') || query.includes('production monitoring') || query.includes('monitoring')) {
    const a = AGENTS.find(x => x.id === 2);
    answer = `**Module 02: Production Monitoring System (PROD_MONITORING)**
• **Mission:** ${a.purpose}
• **Live Production:** ${a.metrics.liveOutput} against Target: ${a.metrics.targetOutput} (${a.metrics.cycleEfficiency})
• **Status:** ${a.status.toUpperCase()} — detected ${a.metrics.microStops} across Line 04.`;
    relatedAgent = a;
    quickSuggestions = ['Check OEE Module 03', 'Inspect Micro-stops'];
  }
  else if (query.includes('module 3') || query.includes('oee')) {
    const a = AGENTS.find(x => x.id === 3);
    answer = `**Module 03: OEE Performance Optimization System (OEE_PERFORMANCE)**
• **Overall OEE:** ${a.metrics.oee} across all 6 plant districts.
• **Availability:** ${a.metrics.availability} | **Performance:** ${a.metrics.performance} | **Quality:** ${a.metrics.quality}
• **Loss Pareto:** Minor speed losses account for 4.2% of gap; breakdown stops reduced by 32%.`;
    relatedAgent = a;
    quickSuggestions = ['Show Predictive Maintenance', 'View Manufacturing Cost'];
  }
  else if (query.includes('module 4') || query.includes('predictive') || query.includes('maintenance')) {
    const a = AGENTS.find(x => x.id === 4);
    answer = `**Module 04: Predictive Maintenance System (PREDICTIVE_MAINT)**
• **Health Score:** ${a.metrics.healthScore}
• **Next Scheduled Service:** ${a.metrics.nextService}
• **Recent Anomaly:** Spindle Bearing B-2 on CNC Milling Unit 07 detected vibration harmonic (3.2 kHz). Remaining useful life estimated at 120 hrs; preventive window locked in for Saturday.`;
    relatedAgent = a;
    quickSuggestions = ['View Maintenance Alerts', 'Check Utilities System'];
  }
  else if (query.includes('module 9') || query.includes('inventory') || query.includes('stock')) {
    const a = AGENTS.find(x => x.id === 9);
    answer = `⚠️ **Module 09: Inventory Optimization System (INVENTORY)**
• **Current Status:** WARNING (Active Stock Alert)
• **Health:** ${a.metrics.inventoryHealth}
• **Active Alert:** SS-304 Sheet coils below 48-hour reserve at Chennai Plant. 
• **Suggested Action:** Expedite PO #PO-94182 to JSW Steel via Automated RFQ System (Module 11).`;
    relatedAgent = a;
    quickSuggestions = ['Open Module 11 RFQ', 'View Inventory Alert', 'Check Supplier Performance'];
  }
  else if (query.includes('module 14') || query.includes('safety') || query.includes('ehs') || query.includes('employee')) {
    const a = AGENTS.find(x => x.id === 14);
    answer = `🛡️ **Module 14: EHS & Safety Management System (EHS_SAFETY)**
• **Safety Record:** ${a.metrics.zeroIncidentsDays} without any Lost Time Incidents!
• **Permit Compliance:** ${a.metrics.permitCompliance} (100% active LOTO verified).
• **Training Completion:** ${a.metrics.trainingRate} across shop floor staff.`;
    relatedAgent = a;
    quickSuggestions = ['Show Workforce Module 15', 'Check Plant Facilities'];
  }
  else if (query.includes('module 20') || query.includes('admin') || query.includes('decision') || query.includes('executive')) {
    const a = AGENTS.find(x => x.id === 20);
    answer = `👑 **Executive Operations Command Center (#20) (Master Platform)**
• **Role:** Central multi-tenant executive cockpit governing all 19 functional operations modules.
• **Cross-Plant Impact:** ${a.metrics.oeeGain} OEE Gain | ${a.metrics.qualityBoost} Quality Boost | ${a.metrics.costSavings} Cost Savings.
• **District Coverage:** Synchronizing 6 plant zones across Tamil Nadu, Maharashtra, Gujarat, Haryana, Karnataka & Texas.`;
    relatedAgent = a;
    quickSuggestions = ['Show Multi-Plant Settings', 'View All 19 Modules'];
  }
  // 3. Connectors questions
  else if (query.includes('connector') || query.includes('sap') || query.includes('manhattan') || query.includes('neon')) {
    const connected = CONNECTORS.filter(c => c.status === 'connected').length;
    answer = `🔌 **Connectors Ecosystem Status:**
• **Active Connections:** ${connected} of ${CONNECTORS.length} connectors online.
• **Core Integrations:**
  - **SAP S/4HANA:** Connected via OData v4 (Last sync 2 min ago, 2.8M records)
  - **Manhattan WMS:** Connected via RESTful API (Last sync 4 min ago, 940k records)
  - **MECPL MES:** Live streaming via OPC-UA/MQTT (14.8M records)
  - **Neon DB:** Active cloud telemetry & operational store (Real-time)`;
    quickSuggestions = ['Go to Connectors Page', 'Toggle Honeywell Forge', 'View Architecture'];
  }
  // 4. Notifications / Alerts
  else if (query.includes('notification') || query.includes('alert') || query.includes('stopped') || query.includes('error') || query.includes('disruption')) {
    const notifs = getNotifications();
    const unread = notifs.filter(n => n.status === 'unread');
    answer = `🔔 **Live System Notifications (${unread.length} unread):**
${notifs.map(n => `• [${n.severity.toUpperCase()}] **${n.agentName}**: ${n.title} — *${n.message.slice(0, 100)}...*`).join('\n')}`;
    quickSuggestions = ['Acknowledge All', 'Simulate System Disruption', 'Go to Operational Alerts'];
  }
  // 5. Multi-state plant facilities
  else if (query.includes('plant') || query.includes('state') || query.includes('district') || query.includes('facility')) {
    const settings = getSettings();
    answer = `🏭 **Multi-State / District Plant Operations (${settings.districtCoverage.length} Facilities):**
${settings.districtCoverage.map(p => `• **${p.plantName}** (${p.state}): ${p.lines} active lines | ${p.activeAgents} modules active.`).join('\n')}`;
    quickSuggestions = ['View Settings Page', 'Check Chennai Plant', 'View System Architecture'];
  }
  // 6. Generic intelligent response
  else {
    answer = `I am your **Executive Operations Advisor**. I have full real-time visibility across all 20 operations modules, 6 plant districts, and connected enterprise systems (SAP, Manhattan, MECPL MES).

Here are quick actions you can ask me:
• *"What is the end-to-end system architecture?"*
• *"Show me the status of all 19 operations modules"*
• *"Explain why Module 09 has a stock warning"*
• *"How is the SAP and Manhattan connection health?"*
• *"What are our OEE numbers across plants?"*`;
    quickSuggestions = ['Explain System Architecture', 'Show Operations Modules', 'Check Connector Status', 'List Plant Locations'];
  }

  res.json({
    reply: answer,
    relatedAgent,
    quickSuggestions,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
