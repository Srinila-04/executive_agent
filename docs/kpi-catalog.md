# GWC DATA.AI — Normalized KPI & Chart Catalog

> **Standardization Directive**: Every manufacturing metric across the platform adheres to consistent units, mathematical definitions, and directional polarities (`higher` = growth/green, `lower` = reduction/green).
> **Geographic Boundary**: Metrics are tracked exclusively for **Chennai (TN)** and **Bangalore (Karnataka)**.

---

## Executive Summary Headline KPIs (Dashboard Row 1)

These 8 core cross-plant headline metrics anchor the Executive Summary view:

| KPI ID | Headline Metric Name | Unit | Formula / Calculation | Good Direction | Target Benchmark |
|:---|:---|:---:|:---|:---:|:---:|
| `exec-oee` | **Overall Equipment Effectiveness (OEE)** | `%` | `Availability × Performance × Quality` | Higher | ≥ 85.0% |
| `exec-otif` | **On-Time In-Full (OTIF) Delivery** | `%` | `(Customer Orders Shipped Complete on Schedule / Total Orders) * 100` | Higher | ≥ 95.0% |
| `exec-fpy` | **First Pass Yield (FPY)** | `%` | `(Units Passing All Quality Inspection Gates / Units Started) * 100` | Higher | ≥ 98.5% |
| `exec-downtime`| **Unplanned Downtime** | `Hours` | `Total Unscheduled Machine Breakdown Duration (Shift Hours)` | Lower | ≤ 4.0 hrs |
| `exec-inventory`| **Inventory Turns** | `Turns/yr` | `Cost of Goods Sold (Annualized) / Average Value of Total Inventory` | Higher | ≥ 8.0 turns |
| `exec-cost` | **Manufacturing Cost per Unit** | `₹/unit` | `(Direct Material + Direct Labor + Factory Overhead) / Output Units` | Lower | ≤ ₹1,850 |
| `exec-energy` | **Specific Energy Consumption** | `kWh/unit`| `Total Electrical Grid & Generator Energy (kWh) / Output Units` | Lower | ≤ 4.2 kWh/u |
| `exec-safety` | **Recordable Safety Incidents** | `Count` | `OSHA Recordable Incidents during Selected Operational Period` | Lower | 0 |

---

## Agent-Specific Normalized KPI & Chart Catalog

### Group 1: Plan
#### 1. Production Planning Agent
- **Key KPIs**:
  1. `plan-adherence`: **Schedule Adherence Rate** (`%`, Higher, Target 95.0%) — `(Completed Work Orders on Time / Scheduled WOs) * 100`
  2. `plan-floor-oee`: **Floor OEE This Hour** (`%`, Higher, Target 88.0%) — Real-time line OEE snapshot
  3. `plan-shortages`: **Material Shortage Risk SKUs** (`count`, Lower, Target 0) — Items with buffer coverage < production cycle
  4. `plan-days-cover`: **Stock Days Coverage** (`Days`, Higher, Target 14.0d) — `Total On-Hand / Average Daily Run Rate`
  5. `plan-budget-var`: **Budget Variance** (`₹ Lakhs`, Lower, Target 0) — Planned cost vs actual scheduled allocation
- **Charts**:
  - `chart-plan-gantt`: **Production & Maintenance Gantt Schedule** (Gantt: Work Orders, PM Slots, Line Changeovers)
  - `chart-plan-takt`: **Takt Pacing vs Target Output** (Line & Area: Output vs Takt Speed over Shift Hours)

#### 2. Production Monitoring Agent
- **Status**: **Coming soon (Unassigned)**
- Placeholder banner with scheduled Q1 OPC-UA ingestion roadmap.

---

### Group 2: Produce
#### 3. OEE Performance Agent
- **Key KPIs**:
  1. `oee-overall`: **Plant Overall OEE** (`%`, Higher, Target 85.0%) — Availability × Performance × Quality
  2. `oee-avail`: **Machine Availability Rate** (`%`, Higher, Target 92.0%) — Operating Time / Planned Production Time
  3. `oee-perf`: **Operating Performance Efficiency** (`%`, Higher, Target 94.0%) — Actual Rate / Nameplate Capacity
  4. `oee-quality`: **Quality Factor** (`%`, Higher, Target 98.0%) — Good Units / Total Produced Units
  5. `oee-downtime`: **Shift Downtime Duration** (`Hours`, Lower, Target < 2.0 hrs) — Sum of unscheduled stops
- **Charts**:
  - `chart-oee-waterfall`: **OEE Loss Decomposition Waterfall** (Stacked Bar: 100% theoretical to net OEE)
  - `chart-oee-shift-comparison`: **Line × Shift OEE Distribution** (Grouped Bar: Shift A, B, C across Chennai & Bangalore)

#### 4. Digital Twin Agent
- **Key KPIs**:
  1. `twin-fidelity`: **Simulation Sync Fidelity** (`%`, Higher, Target 99.5%) — Agreement between physical telemetry & 3D state
  2. `twin-latency`: **Telemetry Ingestion Latency** (`ms`, Lower, Target < 25ms) — Round-trip PLC to digital twin mesh
  3. `twin-accuracy`: **Virtual Commissioning Accuracy** (`%`, Higher, Target 98.0%) — Cycle time prediction agreement
  4. `twin-lead-time`: **Bottleneck Prediction Horizon** (`Hours`, Higher, Target 4.0h) — Autonomous bottleneck forewarning
- **Charts**:
  - `chart-twin-throughput`: **Simulated vs Physical Throughput** (Dual Line: Physical counter vs Virtual Model)
  - `chart-twin-bottlenecks`: **Station Bottleneck Constraints** (Radar / Bar: Constraint index by cell)

---

### Group 3: Quality
#### 5. Quality Management Agent
- **Key KPIs**:
  1. `qual-fpy`: **First Pass Yield (FPY)** (`%`, Higher, Target 98.5%) — Units passing all gates with zero rework
  2. `qual-ppm`: **Defect Rate (PPM)** (`PPM`, Lower, Target < 150 PPM) — `(Defective Units / Total Units) * 1,000,000`
  3. `qual-escape`: **Customer Escape Rate** (`%`, Lower, Target 0.0%) — Defective units caught post-shipping
  4. `qual-exposure`: **Material-Lot Defect Exposure** (`Units`, Lower, Target 0) — WIP associated with flagged lots
- **Charts**:
  - `chart-qual-pareto`: **Defect Classification Pareto (80/20)** (Bar + Cumulative Line: Solder Voids, Burr, Shift, etc.)
  - `chart-qual-spc`: **Statistical Process Control (SPC) X-bar Chart** (Line with UCL, LCL, and Mean)

#### 6. Vision AI Inspection Agent
- **Key KPIs**:
  1. `vision-accuracy`: **Automated Defect Sort Accuracy** (`%`, Higher, Target 99.8%) — Ground truth visual accuracy
  2. `vision-frr`: **False Reject Rate (FRR)** (`%`, Lower, Target < 0.5%) — Conforming parts misclassified as defective
  3. `vision-latency`: **Inference Processing Latency** (`ms`, Lower, Target < 45ms) — Real-time frame inference speed
  4. `vision-throughput`: **Conveyor Inspection Rate** (`units/min`, Higher, Target 120 u/min) — Production pacing
- **Charts**:
  - `chart-vision-matrix`: **Confusion Matrix / Classification Share** (Heatmap / Donut: True Positives vs False Rejects)
  - `chart-vision-trend`: **Defect Detection Volume vs Camera Station** (Stacked Bar: Stations 1 to 4)

#### 7. Engineering Change Management (ECM) Agent
- **Key KPIs**:
  1. `ecm-bom-sync`: **BOM Synchronization Accuracy** (`%`, Higher, Target 100.0%) — Alignment of ERP, MES, and PLM
  2. `ecm-open-ecn`: **Active Change Notices (ECN)** (`count`, Lower, Target < 5) — Changes in review or trial run
  3. `ecm-lead-time`: **Average ECN Lead Time** (`Days`, Lower, Target < 12d) — Request to plant cut-in duration
  4. `ecm-scrap-risk`: **Obsolete Inventory Exposure** (`₹ Lakhs`, Lower, Target < ₹5.0L) — Obsolete material write-off risk
- **Charts**:
  - `chart-ecm-funnel`: **ECN Progression Pipeline Funnel** (Bar: Draft → Review → Simulation → Cut-In)
  - `chart-ecm-leadtime`: **Cycle Lead Time by Change Severity** (Grouped Bar: Minor, Moderate, Critical)

#### 8. Product Traceability Agent
- **Key KPIs**:
  1. `trace-coverage`: **Genealogy Traceability Coverage** (`%`, Higher, Target 100.0%) — Complete component-to-serial pedigree
  2. `trace-mttc`: **Mean Time to Contain (MTTC)** (`Minutes`, Lower, Target < 15m) — Speed to isolate suspect serial lots
  3. `trace-quarantine`: **Active Quarantined Lots** (`count`, Lower, Target 0) — Flagged inventory in quarantine cage
  4. `trace-integrity`: **Supplier Lot Lineage Score** (`%`, Higher, Target 99.0%) — Upstream cryptographic verification
- **Charts**:
  - `chart-trace-containment`: **Containment Velocity Curve** (Line: Quarantined units locked over elapsed hours)
  - `chart-trace-risk`: **Component Lot Risk Ranking** (Horizontal Bar: Risk index by supplier component lot)

---

### Group 4: Maintain
#### 9. Predictive Maintenance Agent
- **Key KPIs**:
  1. `maint-mtbf`: **Mean Time Between Failures (MTBF)** (`Hours`, Higher, Target 1,200h) — Operating hours / breakdown count
  2. `maint-mttr`: **Mean Time to Repair (MTTR)** (`Minutes`, Lower, Target < 45m) — Repair duration per intervention
  3. `maint-rul`: **Remaining Useful Life (RUL)** (`Hours`, Higher, Target > 72h) — Machine health projection
  4. `maint-vibration`: **Bearing Vibration Severity** (`mm/s RMS`, Lower, Target < 1.8 mm/s) — ISO vibration velocity
  5. `maint-backlog`: **Pending Preventive Work Orders** (`count`, Lower, Target < 3) — Scheduled PMs awaiting completion
- **Charts**:
  - `chart-maint-trend`: **Spindle Bearing Vibration & Temperature Trajectory** (Line: Harmonic amplitude over cycles)
  - `chart-maint-health`: **Asset Health Tier Distribution** (Donut: Optimal, Monitor, Alert, Critical)

---

### Group 5: Supply Chain
#### 10. Inventory Management Agent
- **Key KPIs**:
  1. `inv-buffer-health`: **Buffer Health Index** (`%`, Higher, Target 95.0%) — Stock on-hand vs dynamic buffer threshold
  2. `inv-turns`: **Inventory Turns** (`Turns/yr`, Higher, Target 8.5) — Annualized COGS / Average Stock
  3. `inv-stockouts`: **Stockouts Prevented** (`count`, Higher, Target > 10) — Automated replenishment interventions
  4. `inv-excess-val`: **Excess / Slow-Moving Capital** (`₹ Lakhs`, Lower, Target < ₹20.0L) — Inventory > 90 days coverage
- **Charts**:
  - `chart-inv-trajectory`: **Stock Level vs Dynamic Buffer Bands** (Area: Critical, Safety, Target vs Actual)
  - `chart-inv-abc`: **ABC Inventory Valuation Share** (Donut: Class A, B, and C items)

#### 11. Supplier Performance Agent
- **Key KPIs**:
  1. `supp-score`: **Composite Vendor Score** (`/100`, Higher, Target ≥ 90.0) — Weighted quality, OTIF, and commercial score
  2. `supp-otif`: **Supplier OTIF Rate** (`%`, Higher, Target ≥ 95.0%) — Inbound deliveries on time and in full
  3. `supp-defect-ppm`: **Inbound Defect Rate** (`PPM`, Lower, Target < 100 PPM) — Defective parts at receiving inspection
  4. `supp-risk-share`: **High-Risk Supplier Proportion** (`%`, Lower, Target < 5.0%) — Share of tier-3/tier-4 suppliers
- **Charts**:
  - `chart-supp-matrix`: **Supplier Risk Matrix** (Scatter: Delivery Delay vs Inbound Quality PPM)
  - `chart-supp-otif`: **Monthly OTIF Trend by Commodity Tier** (Line: Electronics, Metals, Plastics)

#### 12. Agentic RFQ Management Agent
- **Key KPIs**:
  1. `rfq-auto-rate`: **Automated RFQ Processing Rate** (`%`, Higher, Target ≥ 90.0%) — Requisitions processed autonomously
  2. `rfq-savings`: **Cost Avoidance Savings** (`₹ Lakhs`, Higher, Target > ₹30.0L) — Budget vs negotiated price savings
  3. `rfq-cycle-time`: **Sourcing Cycle Time** (`Days`, Lower, Target < 4.0d) — RFQ draft to vendor contract award
  4. `rfq-vendor-resp`: **Vendor Participation Rate** (`%`, Higher, Target ≥ 80.0%) — Suppliers bidding per RFQ package
- **Charts**:
  - `chart-rfq-spread`: **Quote Pricing Spread vs Market Benchmark** (Grouped Bar: Top quoted assemblies)
  - `chart-rfq-funnel`: **RFQ Lifecycle Pipeline** (Funnel: Draft → Out for Bid → Analyzed → Awarded)

#### 13. Logistics and Dispatch Agent
- **Key KPIs**:
  1. `log-dispatch-otif`: **On-Time Dispatch Rate** (`%`, Higher, Target ≥ 96.0%) — Dock departures within scheduled slot
  2. `log-dock-time`: **Average Dock Turnaround Time** (`Minutes`, Lower, Target < 35m) — Truck bay ingress to egress
  3. `log-damage-rate`: **In-Transit Shock / Damage Rate** (`%`, Lower, Target < 0.2%) — Telematics shock alerts
  4. `log-freight-cost`: **Freight Cost per Ton-Km** (`₹/t-km`, Lower, Target < ₹4.2/t-km) — Route fuel and rate efficiency
- **Charts**:
  - `chart-log-status`: **Fleet Delivery Status Breakdown** (Donut: In Transit, Completed, Staged, Delayed)
  - `chart-log-dock-heatmap`: **Dock Bay Occupancy Heatmap** (Heatmap: Bays 1 to 4 across hours 06:00 to 22:00)

#### 14. Customer Order Management Agent
- **Key KPIs**:
  1. `order-otif`: **Customer OTIF Fulfillment Rate** (`%`, Higher, Target ≥ 96.0%) — Shipments matching customer PO date
  2. `order-active`: **Active Production Orders** (`count`, Stable, Benchmark ~140) — Active customer orders in flight
  3. `order-cycle`: **Order-to-Delivery Cycle Time** (`Days`, Lower, Target < 6.0d) — Order booking to dock delivery
  4. `order-backlog`: **Committed Backlog Value** (`₹ Crores`, Stable, Benchmark ₹4.5 Cr) — Confirmed orders awaiting release
- **Charts**:
  - `chart-order-pacing`: **Delivery Pacing by Key OEM Accounts** (Stacked Bar: Account delivery commitments)
  - `chart-order-flow`: **Daily Order Booking vs Fulfillment** (Line & Area: New Orders vs Shipped Orders)

---

### Group 6: Safety & People
#### 15. EHS and Safety Agent
- **Key KPIs**:
  1. `ehs-safe-days`: **Safe Days Without LTI** (`Days`, Higher, Target 365d) — Consecutive days with zero lost-time incidents
  2. `ehs-trir`: **Total Recordable Incident Rate (TRIR)** (`Rate`, Lower, Target 0.0) — Normalized OSHA incident rate
  3. `ehs-ppe-compliance`: **Vision AI PPE Compliance Rate** (`%`, Higher, Target ≥ 99.0%) — Camera vision audit agreement
  4. `ehs-hazard-closed`: **Hazard Mitigations Closed on Time** (`%`, Higher, Target 100.0%) — SLA closure of safety issues
- **Charts**:
  - `chart-ehs-hazards`: **Safety Hazard Categories** (Horizontal Bar: Slip/Trip, Ergonomics, Machine Guarding)
  - `chart-ehs-ppe-trend`: **PPE Compliance Rate by Zone** (Line: Assembly Line, Stamping, Warehouse)

#### 16. Workforce Management Agent
- **Key KPIs**:
  1. `work-staffing`: **Shift Staffing Adherence** (`%`, Higher, Target ≥ 98.0%) — Scheduled headcount vs clocked operators
  2. `work-skill-index`: **Skill Matrix Competency Rating** (`/5.0`, Higher, Target ≥ 4.5) — Operator certification competency
  3. `work-overtime`: **Overtime Ratio** (`%`, Lower, Target < 6.0%) — Overtime hours vs total regular shift hours
  4. `work-absenteeism`: **Unplanned Absenteeism** (`%`, Lower, Target < 2.5%) — Unexcused shift absences
- **Charts**:
  - `chart-work-roster`: **Station Staffing Adequacy Heatmap** (Heatmap: Line Stations vs Shift A, B, C)
  - `chart-work-skills`: **Competency Distribution by Cell** (Radar: Assembly, Solder, QA, Packaging)

---

### Group 7: Cost & Energy
#### 17. Manufacturing Cost Agent
- **Key KPIs**:
  1. `cost-total`: **Total Manufacturing Cost** (`₹ Crores`, Lower, Target ₹3.2 Cr) — Material + Labor + Overhead
  2. `cost-unit`: **Unit Cost of Production** (`₹/unit`, Lower, Target ₹1,820) — Total Cost / Output Units
  3. `cost-mat-variance`: **Material Cost Variance** (`₹ Lakhs`, Lower, Target < ₹2.0L) — BOM standard vs purchase price
  4. `cost-scrap-loss`: **Scrap & Quality Fallout Cost** (`₹ Lakhs`, Lower, Target < ₹3.5L) — Scrapped material valuation
- **Charts**:
  - `chart-cost-waterfall`: **Unit Cost Component Breakdown** (Waterfall / Bar: Direct Material, Labor, Power, Scrap, Overhead)
  - `chart-cost-margin-trend`: **Monthly Cost vs Selling Price Margin** (Dual Line: Cost Curve vs Contract Price)

#### 18. Energy Management Agent
- **Key KPIs**:
  1. `energy-sec`: **Specific Energy Consumption (SEC)** (`kWh/unit`, Lower, Target ≤ 4.2 kWh/u) — kWh / Output Units
  2. `energy-peak`: **Peak Power Demand** (`kVA`, Lower, Target < 650 kVA) — Maximum registered demand
  3. `energy-pf`: **Power Factor** (`cos φ`, Higher, Target ≥ 0.98) — Industrial power factor
  4. `energy-carbon`: **Carbon Emissions (Scope 2)** (`t CO2e`, Lower, Target < 45 t) — Monthly indirect emissions
- **Charts**:
  - `chart-energy-load-profile`: **24-Hour Load Curve with Tariff Windows** (Area: Peak Tariff vs Off-Peak Load)
  - `chart-energy-breakdown`: **Consumption by Facility System** (Donut: SMT Lines, Presses, HVAC, Lighting)

#### 19. Utilities Management Agent
- **Status**: **Coming soon (Not yet available)**
- Placeholder banner documenting planned IoT integration for Chilled Water, Compressed Air, and Nitrogen loops.
