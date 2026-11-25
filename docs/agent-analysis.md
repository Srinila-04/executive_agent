# GWC DATA.AI — Comprehensive Multi-Agent Telemetry Analysis

> **Executive Scope**: Engineering analysis of all 19 manufacturing intelligence agents across the GWC DATA.AI platform. Real telemetry endpoints, network architecture, KPI schemas, chart specifications, and filter taxonomies are cataloged below.
> **Plant Scope**: Exactly two plants are deployed enterprise-wide: **Chennai (Tamil Nadu)** and **Bangalore (Karnataka)**.

---

## Master Architecture & Endpoint Registry

| # | Agent Name | Status | Frontend URL | API Base URL / Network Source | Ingestion Mode |
|:---:|:---|:---:|:---|:---|:---:|
| 1 | **Production Planning** | Live | `https://production-planning-khaki.vercel.app/#Overview` | `https://production-planning-khaki.vercel.app/api` | REST / WebSocket Proxy |
| 2 | **Production Monitoring** | Coming soon | Unassigned | N/A | Procedural Mock Adapter |
| 3 | **OEE Performance** | Live | `https://oee-performance-agent.vercel.app/` | `https://oee-performance-agent.vercel.app/api` | REST / Telemetry Ingestion |
| 4 | **Predictive Maintenance** | Live | `https://predictive-maintenance-frontend-kappa.vercel.app/` | `https://predictive-maintenance-frontend-kappa.vercel.app/api` | Edge Diagnostics / Neon DB |
| 5 | **Quality Management** | Live | `https://quality-management-agent-app.vercel.app` | Embedded Client Data Store / REST | Client-Side Ingestion Store |
| 6 | **Vision AI Inspection** | Live | `https://vision-ai-inspection-agent-app.vercel.app/` | `https://vision-ai-inspection-agent-app.vercel.app/api` | Computer Vision Stream / API |
| 7 | **Engineering Change Management** | Live | `https://manufacturing-ai-frontend.vercel.app` | `https://manufacturing-ai-frontend.vercel.app/api` | PLM & ERP Graph Ingestion |
| 8 | **Product Traceability** | Live | `https://product-traceability-rho.vercel.app/` | Ingestion Stream / REST | DAG Lineage Telemetry |
| 9 | **Inventory Management** | Live | `https://inventory-managment-agent.vercel.app/` | Ingestion Store / REST | WMS Real-Time Stock Stream |
| 10 | **Supplier Performance** | Live | `https://supplier-performance-agent-frontend-sable.vercel.app/` | Ingestion Store / REST | SRM Ingestion Stream |
| 11 | **Agentic RFQ Management** | Live | `https://manufacturing-rfq-poc.vercel.app` | Ingestion Store / REST | Procurement NLP Pipeline |
| 12 | **Logistics and Dispatch** | Live | `https://logistics-dispatch-gamma.vercel.app/` | Ingestion Store / REST | Fleet Telematics / TMS |
| 13 | **Energy Management** | Live | `https://energy-gules.vercel.app/` | `https://energy-gules.vercel.app/api` | Smart Meter IoT Ingestion |
| 14 | **EHS and Safety** | Live | `https://frontend-dhob.onrender.com` | `https://frontend-dhob.onrender.com/api/v1` | Video Analytics & Sensor Hub |
| 15 | **Workforce Management** | Live | `https://workforce-management-navy.vercel.app/` | Ingestion Store / REST | Biometric MES Shift Stream |
| 16 | **Manufacturing Cost** | Live | `https://mfc-agent-frontend.vercel.app/home` | Client Mathematical Engine / REST | ERP Variance Ledger |
| 17 | **Customer Order Management** | Live | `https://customer-order-management-two.vercel.app/monitoring` | `https://customer-order-management-two.vercel.app/api` | Order Flow Messaging Bridge |
| 18 | **Digital Twin** | Live | `https://digital-twin-frontend-c0ji.onrender.com/` | Real-Time Sync Engine / REST | Simulation WebGL Sync State |
| 19 | **Utilities Management** | Coming soon | Not yet available | N/A | Procedural Mock Adapter |

---

## Detailed Agent Profiles

### 1. Production Planning Agent
- **URL**: `https://production-planning-khaki.vercel.app/#Overview`
- **Pages / Routes**: `#Overview`, `#Plan`, `#Performance`, `#CostPlan`, `#Recommendations`, `#Materials`.
- **KPI Cards**:
  - *Schedule Adherence Rate*: Unit `%`. Calculated as `(Completed Work Orders on Time / Total Scheduled Work Orders) * 100`.
  - *Floor OEE This Hour*: Unit `%`. Calculated as Real-time Availability × Performance × Quality for the active line.
  - *Material Shortage Risk*: Unit `count`. Count of SKUs with stock coverage < scheduled consumption window.
  - *Stock Days Coverage*: Unit `days`. Total Available Inventory / Average Daily Production Demand.
  - *Production Budget Variance*: Unit `₹ Lakhs`. Actual Line Cost vs. Scheduled Target Budget.
- **Charts**:
  - *Gantt Shift Plan*: Gantt chart showing work orders, line changeovers, and preventive maintenance windows across time slices (06:00 to 22:00).
  - *Takt Pacing Heatmap*: Heatmap showing line output vs takt speed by hour across Shift A, B, and C.
- **Filters**: Plant (`Chennai`, `Bangalore`), Line (`SMT Line 1`, `Wave Line 2`, `Press Line 3`, `Assembly Line 4`), Shift (`A`, `B`, `C`), Date Range.
- **Network API Calls**:
  - `GET /api/overview/solutions` — fetches plan recommendations.
  - `GET /api/plan-sets/latest` — retrieves current master production schedule.
  - `POST /api/orders/upload` — ingests customer sales demands into scheduling buffer.

---

### 2. Production Monitoring Agent
- **Status**: **NOT ASSIGNED (Coming soon)**
- **UI Treatment**: Renders a clean "Coming soon" state card with an architectural placeholder explaining planned IoT OPC-UA / SCADA machine telemetry integration. No synthetic or hardcoded metrics are shown.

---

### 3. OEE Performance Agent
- **URL**: `https://oee-performance-agent.vercel.app/`
- **Pages / Routes**: `/`, `/snapshot`, `/runs`, `/capability/machines`, `/mail/operators`.
- **KPI Cards**:
  - *Overall Equipment Effectiveness (OEE)*: Unit `%`. Calculated as `Availability × Performance × Quality`.
  - *Availability Rate*: Unit `%`. `Operating Time / Planned Production Time`.
  - *Performance Efficiency*: Unit `%`. `(Total Units Produced / Operating Time) / Ideal Run Rate`.
  - *Quality Yield*: Unit `%`. `Good Units Produced / Total Units Started`.
  - *Unplanned Downtime*: Unit `Hours`. Cumulative minutes of machine stops not on PM schedule.
- **Charts**:
  - *OEE Decomposition Waterfall*: Stacked / Composed bar chart showing theoretical 100% capacity reduced by Availability losses, Performance slows, and Quality defects.
  - *Line × Shift OEE Comparison*: Grouped bar chart comparing Shift A, B, and C across Chennai and Bangalore lines.
- **Filters**: Plant, Line, Shift, Time Window (Today, 7D, 30D, Quarter).
- **Network API Calls**:
  - `GET /api/snapshot` — current OEE snapshot across machine clusters.
  - `GET /api/runs` — historical production run log with downtime tags.
  - `GET /api/capability/machines` — machine health limits and theoretical takt speeds.

---

### 4. Predictive Maintenance Agent
- **URL**: `https://predictive-maintenance-frontend-kappa.vercel.app/`
- **Pages / Routes**: `/`, `/cases`, `/machines`, `/reports/preview`.
- **KPI Cards**:
  - *Mean Time Between Failures (MTBF)*: Unit `Hours`. Total Operating Hours / Number of Failures.
  - *Mean Time to Repair (MTTR)*: Unit `Minutes`. Total Repair Time / Total Interventions.
  - *Remaining Useful Life (RUL)*: Unit `Hours`. Prognostic algorithm output for critical components (spindle bearings, pumps).
  - *Vibration Severity Index*: Unit `mm/s RMS`. Real-time accelerometer sensor RMS amplitude.
  - *Pending Maintenance Cases*: Unit `count`. Work orders awaiting planner sign-off.
- **Charts**:
  - *Degradation Signature Curve*: Multi-line chart showing harmonic vibration and thermal drift over operating cycles with anomaly thresholds.
  - *Machine Health Distribution Donut*: Machine breakdown by status (Optimal, Warning, Critical, In Maintenance).
- **Filters**: Plant, Line, Machine Cluster, Anomaly Severity (`P1 Critical`, `P2 Warning`, `P3 Advisory`).
- **Network API Calls**:
  - `GET /api/cases` — open anomaly diagnostics cases.
  - `GET /api/machines/register/read` — telemetry register mapping for CNC / SMT units.
  - `POST /api/reports/send` — dispatch work order to SAP/Maximo MES.

---

### 5. Quality Management Agent
- **URL**: `https://quality-management-agent-app.vercel.app`
- **Pages / Routes**: `/`, `/investigation`, `/alerts`, `/benchmarking`.
- **KPI Cards**:
  - *First Pass Yield (FPY)*: Unit `%`. `(Units Passing All Inspection Gates / Total Units Started) * 100`.
  - *Defect Parts Per Million (PPM)*: Unit `PPM`. `(Total Defective Units / Total Units Produced) * 1,000,000`.
  - *Customer Escape Rate*: Unit `%`. Escaped defects detected post-dock / Total shipped lots.
  - *Material-Lot Defect Exposure*: Unit `Units`. Volume of work-in-progress tied to suspicious supplier lots.
- **Charts**:
  - *Defect Classification Pareto (80/20)*: Ranked frequency bars of defect categories with cumulative impact curve.
  - *Yield Trend with 3-Sigma Upper/Lower Control Limits*: Statistical process control (SPC) chart.
- **Filters**: Plant, Production Line, Defect Severity, Product Assembly.
- **Network API Calls**:
  - Connects to Neon Postgres client pool for real-time defect logs and station benchmarking.

---

### 6. Vision AI Inspection Agent
- **URL**: `https://vision-ai-inspection-agent-app.vercel.app/`
- **Pages / Routes**: `/`, `/inspection/entry`, `/prod/monitor`, `/workspace/inspect`.
- **KPI Cards**:
  - *Vision Defect Sort Accuracy*: Unit `%`. Confirmed ground truth agreement / Total inferences.
  - *False Reject Rate (FRR)*: Unit `%`. Good parts incorrectly flagged / Total good parts inspected.
  - *Inference Latency*: Unit `ms`. Average edge AI model forward pass time per frame.
  - *Inspection Throughput*: Unit `units/min`. High-speed conveyor camera inspection rate.
- **Charts**:
  - *Surface Defect Location Heatmap*: Coordinates of solder bridge, pin misalignment, and scratch defects mapped onto PCB layout.
  - *Hourly Defect Count vs Conveyor Velocity*: Bivariate trend chart.
- **Filters**: Camera Station, Product Family, Defect Type, Confidence Threshold.
- **Network API Calls**:
  - `GET /api/inspection/entry/options` — inspection gates and criteria.
  - `GET /api/prod/review/stats` — inference accuracy statistics.
  - `POST /api/prod/export` — export audit images and pass/fail telemetry.

---

### 7. Engineering Change Management Agent
- **URL**: `https://manufacturing-ai-frontend.vercel.app`
- **Pages / Routes**: `/overview`, `/changes`, `/pipeline`, `/new`.
- **KPI Cards**:
  - *BOM Synchronization Accuracy*: Unit `%`. ERP vs PLM matched item revisions.
  - *Open Engineering Change Notices (ECN)*: Unit `count`. Active engineering change requests in flight.
  - *Average ECN Cycle Lead Time*: Unit `days`. Elapsed duration from change request creation to factory cut-in.
  - *Obsolete Inventory Scrap Exposure*: Unit `₹ Lakhs`. Value of stocked components made obsolete by revision.
- **Charts**:
  - *ECN Stage Funnel*: Stage-by-stage pipeline bar chart (Draft → Review → Simulation → Approved → Cut-In).
  - *Lead Time Variance by Change Severity*: Box-and-whisker / bar chart for Minor vs Critical changes.
- **Filters**: Plant, Product Line, Change Status (`Draft`, `Under Review`, `Approved`, `Cut-In`), Impacted System.
- **Network API Calls**:
  - `GET /api/changes` — listing of all registered change requests.
  - `GET /api/lineage/graph` — dependency graph of parts, assemblies, and supplier contracts.
  - `POST /api/bom/confirm-item-intelligence` — approve automated BOM substitutions.

---

### 8. Product Traceability Agent
- **URL**: `https://product-traceability-rho.vercel.app/`
- **Pages / Routes**: `/`, `/lineage`, `/investigation`, `/quarantine`.
- **KPI Cards**:
  - *Genealogy Traceability Coverage*: Unit `%`. Serial numbers with complete component-level birth records.
  - *Mean Time to Contain (MTTC)*: Unit `Minutes`. Speed to identify and lock all suspect serial numbers upon quarantine trigger.
  - *Active Quarantine Lots*: Unit `count`. Batches flagged and quarantined on shop floor or warehouse.
  - *Supplier Lineage Integrity Score*: Unit `%`. Upstream component lot traceability score.
- **Charts**:
  - *Traceability Directed Acyclic Graph (DAG)*: Component lot to sub-assembly to finished product serial trace.
  - *Containment Velocity Timeline*: Cumulative suspect units contained vs hours elapsed.
- **Filters**: Plant, Product Serial Range, Component Supplier, Quarantine Status.
- **Network API Calls**:
  - `GET /api/lineage/search` — search serial number or batch lot.
  - External integration with supplier COA streams.

---

### 9. Inventory Management Agent
- **URL**: `https://inventory-managment-agent.vercel.app/`
- **Pages / Routes**: `/`, `/stock`, `/buffer`, `/replenishment`.
- **KPI Cards**:
  - *Buffer Health Index*: Unit `%`. Ratio of actual stock levels to dynamic safety stock buffer target.
  - *Inventory Turns*: Unit `Turns/yr`. Annual Cost of Goods Sold / Average Inventory Value.
  - *Stockouts Prevented*: Unit `count`. AI dynamic replenishment interventions that averted line starvation.
  - *Excess / Slow-Moving Capital*: Unit `₹ Lakhs`. Stock exceeding 90 days forward production demand.
- **Charts**:
  - *Stock Band Trajectory*: Multi-area chart displaying Max, Target, Safety, and Critical stock levels against actual on-hand quantity.
  - *ABC Valuation Distribution*: Donut chart for High-Value (A), Medium (B), and Low-Value (C) inventory.
- **Filters**: Warehouse Location (`Chennai Main Store`, `Bangalore Depot`), Stock Category, Velocity Tier.
- **Network API Calls**:
  - Ingests ERP / WMS stock movements and calculates automated reorder points.

---

### 10. Supplier Performance Agent
- **URL**: `https://supplier-performance-agent-frontend-sable.vercel.app/`
- **Pages / Routes**: `/`, `/scorecards`, `/risk`, `/deliveries`.
- **KPI Cards**:
  - *Vendor Performance Score*: Unit `/100`. Composite index of quality, on-time delivery, and responsiveness.
  - *Supplier On-Time in-Full (OTIF)*: Unit `%`. Orders delivered on promised date with 100% quantity.
  - *Inbound Defect Rate*: Unit `PPM`. Defective components received at incoming quality control.
  - *High-Risk Supplier Share*: Unit `%`. Vendors flagged in Tier 3 or Tier 4 risk categories.
- **Charts**:
  - *Supplier Risk Matrix (Severity vs Probability)*: 2D scatter quadrant plot.
  - *Monthly OTIF Delivery Trends by Vendor Tier*: Grouped bar and line comparison.
- **Filters**: Plant Facility, Supplier Name / ID, Commodity Category, Performance Tier.
- **Network API Calls**:
  - Ingests PO delivery manifests and incoming inspection defect logs.

---

### 11. Agentic RFQ Management Agent
- **URL**: `https://manufacturing-rfq-poc.vercel.app`
- **Pages / Routes**: `/`, `/quotes`, `/approvals`, `/dashboard`.
- **KPI Cards**:
  - *Automated RFQ Processing Rate*: Unit `%`. RFQs processed and scored by autonomous NLP agents.
  - *Cost Avoidance Savings*: Unit `₹ Lakhs`. Baseline budget vs negotiated awarded quote delta.
  - *RFQ Turnaround Cycle Time*: Unit `Days`. Requisition created to purchase order release.
  - *Vendor Participation Rate*: Unit `%`. Suppliers submitting compliant quotes / Requests sent.
- **Charts**:
  - *Quote Spread vs Market Baseline*: Multi-bar comparison across vendors for top BOM items.
  - *Autonomous RFQ Stage Pipeline*: Funnel of RFQ drafting, quote receipt, normalization, and award.
- **Filters**: Plant, Sourcing Category, RFQ Status (`Draft`, `Out for Quote`, `Scored`, `Awarded`).
- **Network API Calls**:
  - `POST /api/quotes/parse` — extracts multi-line vendor PDF quotes.
  - `GET /api/dashboard/stats` — procurement velocity and price variance.

---

### 12. Logistics and Dispatch Agent
- **URL**: `https://logistics-dispatch-gamma.vercel.app/`
- **Pages / Routes**: `/`, `/fleet`, `/shipments`, `/dock`.
- **KPI Cards**:
  - *On-Time Dispatch Rate*: Unit `%`. Shipments cleared dock within promised slot / Total scheduled.
  - *Dock Turnaround Time*: Unit `Minutes`. Elapsed duration from truck bay arrival to departure.
  - *In-Transit Damage Rate*: Unit `%`. Shipments arriving at distribution centers with telematics shock/tilt alerts.
  - *Freight Cost per Ton-Km*: Unit `₹/ton-km`. Carrier transportation efficiency metric.
- **Charts**:
  - *Fleet Dispatch Status Donut*: Loading, In Transit, Delivered, Delayed.
  - *Bay Occupancy Heatmap*: Loading dock utilization by hour across bays.
- **Filters**: Plant Dock (`Chennai Dock A-D`, `Bangalore Dock 1-3`), Logistics Carrier, Destination Region.
- **Network API Calls**:
  - GPS telematics stream and dock scheduling queues.

---

### 13. Energy Management Agent
- **URL**: `https://energy-gules.vercel.app/`
- **Pages / Routes**: `/dashboard`, `/energy-analytics`, `/production-analytics`, `/daily-reports`.
- **KPI Cards**:
  - *Specific Energy Consumption (SEC)*: Unit `kWh/unit`. Total electrical consumption / Finished production output.
  - *Peak Power Demand*: Unit `kVA`. Maximum instantaneous power draw during high-takt shifts.
  - *Power Factor (PF)*: Unit `cos φ`. Average electrical network power factor (Target > 0.98).
  - *Carbon Emissions*: Unit `t CO2e`. Scope 2 greenhouse gas emissions calculated from grid power mix.
- **Charts**:
  - *Load Profile with Tariff Staggering Windows*: Line chart showing peak tariff hours vs base tariff with automated load-shifting recommendation.
  - *Substation Energy Consumption Distribution*: Stacked bar chart for SMT, Press, HVAC, and Utilities.
- **Filters**: Plant Facility, Substation / Transformer, Shift, Utility Meter.
- **Network API Calls**:
  - `GET /api/health` — energy meter gateway health.
  - Telemetry ingestion from smart energy loggers.

---

### 14. EHS and Safety Agent
- **URL**: `https://frontend-dhob.onrender.com`
- **Pages / Routes**: `/command-center`, `/operations`, `/events`, `/training-matrix`.
- **KPI Cards**:
  - *Safe Days Without Lost-Time Injury (LTI)*: Unit `Days`. Consecutive days with zero lost-time incidents.
  - *Total Incident Rate (TRIR)*: Unit `Rate`. `(Total Recordable Injuries * 200,000) / Total Hours Worked`.
  - *PPE Compliance Rate*: Unit `%`. Vision AI detection compliance for hardhats, safety vests, and eyewear.
  - *Hazard Mitigations Closed*: Unit `%`. Identified hazards addressed within SLA window.
- **Charts**:
  - *Safety Hazard Category Distribution*: Horizontal bar chart (Slip/Trip, Machine Guarding, Ergonomics, Chemical, Electrical).
  - *PPE Compliance Trend by Plant Area*: Area chart comparing assembly, stamping, and warehouse zones.
- **Filters**: Plant, Shop Area, Shift, Hazard Severity (`Low`, `Medium`, `High`, `Critical P1`).
- **Network API Calls**:
  - `GET /api/v1/analytics/overview` — site safety metrics.
  - `GET /api/v1/detection/models/status` — edge camera AI inference state.

---

### 15. Workforce Management Agent
- **URL**: `https://workforce-management-navy.vercel.app/`
- **Pages / Routes**: `/`, `/shifts`, `/skills`, `/attendance`.
- **KPI Cards**:
  - *Shift Staffing Adherence*: Unit `%`. Scheduled headcount vs actual clocked operators.
  - *Skill Matrix Competency Index*: Unit `/5.0`. Multi-tier skill rating of shopfloor technicians.
  - *Overtime Ratio*: Unit `%`. Overtime hours / Total productive shift hours.
  - *Unplanned Absenteeism*: Unit `%`. Unplanned absences / Total scheduled roster.
- **Charts**:
  - *Shift Roster Balance Heatmap*: Available vs required operators across lines and stations.
  - *Skill Gap vs Station Difficulty Matrix*: Radar chart comparing cell requirements with current team skills.
- **Filters**: Plant, Department, Shift (`A`, `B`, `C`), Skill Level.
- **Network API Calls**:
  - Biometric MES time-clock logs and line skill certification records.

---

### 16. Manufacturing Cost Agent
- **URL**: `https://mfc-agent-frontend.vercel.app/home`
- **Pages / Routes**: `/home`, `/overview`, `/cost-analysis`, `/component-analysis`, `/product-analysis`.
- **KPI Cards**:
  - *Total Manufacturing Cost*: Unit `₹ Crores`. Sum of direct material, direct labor, and factory overhead.
  - *Average Cost per Finished Unit*: Unit `₹/unit`. Total manufacturing cost / Output units.
  - *Material Cost Variance*: Unit `₹ Lakhs`. Standard BOM cost vs actual consumed cost.
  - *Scrap & Fallout Financial Loss*: Unit `₹ Lakhs`. Cost of scrapped raw materials and failed assemblies.
- **Charts**:
  - *Cost Component Breakdown Waterfall*: Material, Labor, Power, Tooling, Scrap, Overhead.
  - *Monthly Unit Cost Trend with Margin Threshold*: Line chart showing historical ₹/unit cost vs contract selling price.
- **Filters**: Plant Facility, Finished Product SKU, Cost Center, Month / Quarter.
- **Network API Calls**:
  - Client-side financial model ingesting ERP purchase orders, BOM explosion lists, and scrap fallout rates.

---

### 17. Customer Order Management Agent
- **URL**: `https://customer-order-management-two.vercel.app/monitoring`
- **Pages / Routes**: `/monitoring`, `/orders`, `/overview`, `/reports`.
- **KPI Cards**:
  - *On-Time In-Full (OTIF) Delivery*: Unit `%`. Customer orders delivered on promised date in full quantity.
  - *Active Open Customer Orders*: Unit `count`. Work orders currently in execution.
  - *Order Cycle Time*: Unit `Days`. Customer PO placement to shipment dispatch.
  - *Backlog Order Value*: Unit `₹ Crores`. Value of committed production demand in queue.
- **Charts**:
  - *Order Fulfillment Status Donut*: On Schedule, Risk of Delay, Expedited, Shipped.
  - *Customer Order Pacing by OEM Partner*: Stacked bar chart showing delivery commitments by key accounts.
- **Filters**: Plant, Customer Account, Order Priority, Delivery Month.
- **Network API Calls**:
  - `GET /api/conversations` — customer operational messages.
  - `GET /api/auth/department-mappings` — sales and operations planning cross-links.

---

### 18. Digital Twin Agent
- **URL**: `https://digital-twin-frontend-c0ji.onrender.com/`
- **Pages / Routes**: `/`, `/twin`, `/insights`, `/validation`.
- **KPI Cards**:
  - *Simulation Sync Fidelity*: Unit `%`. Agreement between physical machine sensors and 3D simulation state.
  - *Telemetry Stream Latency*: Unit `ms`. Average round-trip time between shopfloor PLCs and twin server.
  - *Virtual Commissioning Accuracy*: Unit `%`. Predicted cycle times vs physical validation runs.
  - *Autonomous Anomaly Anticipation*: Unit `Hours Ahead`. Lead time of model-predicted bottlenecks.
- **Charts**:
  - *Twin Simulated vs Physical Output*: Dual line chart tracking simulated throughput against physical counter.
  - *Line Bottleneck Node Network*: Graph visualization of takt constraints.
- **Filters**: Plant Campus (`Chennai Campus`, `Bangalore Campus`), Production Cell, Simulation Mode.
- **Network API Calls**:
  - Real-time WebGL state synchronization and PLC sensor stream.

---

### 19. Utilities Management Agent
- **Status**: **NOT YET AVAILABLE (Coming soon)**
- **UI Treatment**: Renders a dedicated "Coming soon" state card documenting planned facility integration (Chilled Water Loop, Compressed Air, Nitrogen Generation, Water Treatment). No synthetic or hardcoded metrics are shown.

---

## Site & Plant Representation Specification
All agents and the central Reports dashboard standardize strictly on:
1. **Chennai (Tamil Nadu)** — Facility Code: `IN-TN-01`
2. **Bangalore (Karnataka)** — Facility Code: `IN-KA-01`

No other states, districts, or plant facilities may appear anywhere in filters, datasets, or UI labels.
