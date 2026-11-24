# 🏭 GWC DATA.AI — Manufacturing Agentic AI Platform
> **Agent 20: Executive Decision Intelligence (Admin Master Platform)**  
> Overseeing 19 Autonomous Industrial Agents Across Multi-State & District Production Facilities

---

## 🌟 Architecture & Pages Built

This platform serves as the **Executive Admin Command Center (Agent 20)**, unifying all 19 functional agents built by your teammates into one enterprise dashboard:

1. **Overview Page** (`/overview`):
   - **Current Situation**: Core operational challenges manufacturing enterprises face (costly unplanned downtime, micro-stops, quality escapes, scrap costs, inventory imbalance, volatile peak energy tariffs, EHS safety compliance gaps, and disconnected multi-plant visibility across states).
   - **Solution We Are Giving**: The GWC DATA.AI 20-Agent Autonomous Ecosystem providing closed-loop orchestration, sub-second genealogy, 38ms vision AI inspection, and predictive maintenance.
   - **Executive KPI Impact**: Real-time attainment metrics (↑12% OEE, 98.2% FPY, ↓10% Unit Cost, 0 LTI Safety Incidents).

2. **System Architecture Page** (`/architecture`):
   - **Picture-Wise Interactive End-to-End Pipeline**: Matches the Motherson Industrial Environment reference blueprint:
     1. **Source Systems (Edge)**: MECPL MES, Shop Floor PLCs, Excel Reference Files, CMMS.
     2. **Intermediate Gateway**: Dedicated edge server (*IP: 10.244.101.228*).
     3. **Automated Data Pipeline**: Python ETL with 10-Minute Windows Task Scheduler loading into intermediate SQL Server & Neon DB.
     4. **Multi-Agent AI Mesh**: 20 Autonomous Agents executing in parallel.
     5. **BI Development**: Power BI Desktop semantic models & DirectQuery pipelines.
     6. **Output & Closed-Loop Consumption**: Power BI Cloud Service, KPI Reports, and Agent 20 Executive Cockpit.
   - Animated SVG flow particles, clickable stage inspection drawers, and reference blueprint viewer toggle.

3. **Autonomous Agents Page** (`/agents`):
   - **Interactive Orbital / Radial Node Graph**:
     - **Center Circle**: Universal Core — **GWC DATA.AI Universal AI Hub**.
     - **7 Radiating Sector Nodes**:
       1. 🏭 **Operations & Production** (Agents 01, 02, 03)
       2. 🔧 **Maintenance & Quality** (Agents 04, 05, 06)
       3. 📐 **Engineering & Traceability** (Agents 07, 08)
       4. 🚚 **Supply Chain & Sourcing** (Agents 09, 10, 11, 12)
       5. ⚡ **Energy, Cost & Utilities** (Agents 13, 16, 17)
       6. 👷 **Workforce & Safety** (Agents 14, 15) *(e.g. under employees comes EHS safety and workforce)*
       7. 🌐 **Customer & Virtual Operations** (Agents 18, 19)
     - **Click Sector Node**: Expands to showcase all available agents within that sector.
     - **Click Internal Agent Node**: Opens the **Teammate Frontend Integration Gateway** modal featuring:
       - **Live Port Embed (iframe)** with configurable port (e.g. `http://localhost:3001` - `3019`).
       - **Interactive Simulator**: Demonstrates what that teammate's agent UI looks like.
       - Full Agent Blueprint (Purpose, Responsibilities, Inputs, Outputs, Success KPIs).
       - Status control (Start / Stop agent to test failure alerts).

4. **Connectors Page** (`/connectors`):
   - Interactive table for enterprise systems: **SAP S/4HANA**, **Manhattan WMS**, **MECPL MES**, **Siemens SCADA**, **Rockwell Automation**, **PTC ThingWorx**, **Neon DB**, **Snowflake**, **Power BI**, and **Honeywell Forge**.
   - Admin can toggle connections ON/OFF, inspect latency pings, protocols, and synced records.

5. **Notifications & Alerts Page** (`/notifications`):
   - Real-time agent stoppage alarms with root-cause diagnosis.
   - **Interactive Simulation Console**: Admin can simulate a failure or crash on any agent to immediately test the topbar bell badge and alert feed!

6. **Admin Settings Page** (`/settings`):
   - Admin / Company Owner profile management.
   - **Multi-State / District Plant Facilities Manager**: Add and manage production facilities across Tamil Nadu (Chennai/Sriperumbudur), Maharashtra (Pune/Chakan), Gujarat (Sanand), Haryana (Manesar), Karnataka (Bengaluru), and international hubs (Texas).
   - Downtime notification thresholds & Domo AI model configuration.

7. **Floating Chat Assistant (Bottom-Right)**:
   - **GWC Executive Copilot**: Answers queries about system architecture, any of the 20 agents, plant health, and connectors.

---

## 🎨 Enterprise Design & Color Palette
Built using the official color tokens from the GWC DATA.AI design system:
- **Font**: Montserrat
- **Brand Purple**: `#6f3dba` (Light) / `#a684ee` (Dark)
- **Brand Blue**: `#4d8eeb` (Light) / `#78acf5` (Dark)
- **Brand Orange**: `#f58a3a` (Light) / `#ffab63` (Dark)
- **Brand Navy**: `#1f2f59` (Light) / `#e7edfa` (Dark)
- **Page Background**: `#f5f7fa` (Light) / `#090e1a` (Dark)
- **Dark/Light Theme Toggle**: Seamless toggle with persistent browser storage.

---

## 🚀 How to Run Locally

### 1. Backend Server (Port 5000)
```powershell
cd backend
npm install
node src/index.js
```
*Health endpoint: `http://localhost:5000/api/health`*

### 2. Frontend React App (Port 5173)
```powershell
cd frontend
npm install
npm run dev
```
*Open in your browser: `http://localhost:5173`*

---

## 🤝 Integrating Your 19 Teammates' Code
When each teammate finishes their agent UI:
1. They run their frontend on their assigned port (e.g. Agent 01 on `3001`, Agent 02 on `3002`, etc.).
2. In the Admin Platform, click that agent's node in the **Autonomous Agents** view.
3. Switch to **"Live Port Embed (iframe)"** and their entire application will load directly inside the master platform!
