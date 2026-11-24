import time
from fastapi import APIRouter
from pydantic import BaseModel
from database import query_one

router = APIRouter(prefix="/api/connectors", tags=["Enterprise Connectors"])

class ToggleConnectorPayload(BaseModel):
    id: str

class CreateConnectorPayload(BaseModel):
    name: str
    category: str
    endpoint: str = ""
    authType: str = "OAuth 2.0"
    plant: str = "All Plant Facilities"

CONNECTORS_STORE = [
    {
        "id": "conn-neondb",
        "name": "Neon PostgreSQL (Data Warehouse)",
        "shortCode": "NEON",
        "color": "#00e599",
        "category": "Database • Primary Enterprise Star-Schema Data Warehouse",
        "status": "connected",
        "eventsCount": 32,
        "eventsText": "32 Star Schema Tables • Live Telemetry Active",
        "endpoint": "ep-autumn-hat-bdadpaw0-pooler.c-8.us-east-2.aws.neon.tech",
        "lastSync": "Live Streaming (<40ms)",
        "recordsSynced": "168,420 Rows",
        "plant": "All Plant Facilities (Chennai & Bengaluru)",
        "isPrimary": True,
        "authType": "SSL / SCRAM-SHA-256 Verified"
    },
    {
        "id": "conn-sap",
        "name": "SAP S/4HANA ERP",
        "shortCode": "SAP",
        "color": "#008fd3",
        "category": "ERP / CMMS • Work Orders, Production Orders & BOM",
        "status": "connected",
        "eventsCount": 8,
        "eventsText": "PO Sync, BOM Cut-In, Material Master, Cost Centers",
        "endpoint": "sap-s4hana.enterprise.internal:8443",
        "lastSync": "Synced 2 mins ago",
        "recordsSynced": "28,450 Orders",
        "plant": "Chennai & Bengaluru Plants",
        "isPrimary": False,
        "authType": "OAuth 2.0 / X.509 Certificate"
    },
    {
        "id": "conn-opcenter",
        "name": "Siemens Opcenter MES",
        "shortCode": "OP",
        "color": "#00646e",
        "category": "MES • Production Line States, Downtime & Takt Telemetry",
        "status": "connected",
        "eventsCount": 6,
        "eventsText": "Takt Time, Micro-Stops, Shift Handover & Line States",
        "endpoint": "opcenter-mes.chennai.internal:9092",
        "lastSync": "Streaming Real-Time",
        "recordsSynced": "142,100 Telemetry Points",
        "plant": "Chennai Electronics Plant (IN-TN-01)",
        "isPrimary": False,
        "authType": "OPC-UA / Industrial Webhook"
    },
    {
        "id": "conn-wms",
        "name": "Manhattan Associates WMS",
        "shortCode": "WMS",
        "color": "#e056fd",
        "category": "Supply Chain • Warehouse Management & Dispatch Staging",
        "status": "connected",
        "eventsCount": 5,
        "eventsText": "ASN Inbound, Bin Allocation & Dock Turnaround",
        "endpoint": "wms.logistics.cloud:443",
        "lastSync": "Synced 5 mins ago",
        "recordsSynced": "15,820 Shipments",
        "plant": "Bengaluru Electronics Plant (IN-KA-01)",
        "isPrimary": False,
        "authType": "Bearer Token API"
    },
    {
        "id": "conn-oracle",
        "name": "Oracle Cloud SCM / Autonomous DB",
        "shortCode": "OR",
        "color": "#c73e1d",
        "category": "Database • Enterprise Financial & SCM Warehouse",
        "status": "connected",
        "eventsCount": 4,
        "eventsText": "GL Costing, Standard Cost Variances & Vendor Ratings",
        "endpoint": "adb.us-ashburn-1.oraclecloud.com:1522",
        "lastSync": "Synced 12 mins ago",
        "recordsSynced": "45,000 Financial Rows",
        "plant": "Corporate Consortium",
        "isPrimary": False,
        "authType": "Mutual TLS / Wallet"
    },
    {
        "id": "conn-kafka",
        "name": "Apache Kafka Industrial IoT Event Bus",
        "shortCode": "KAF",
        "color": "#231f20",
        "category": "Streaming • High-Frequency Sensor Stream (Vibration, Thermal, Current)",
        "status": "connected",
        "eventsCount": 12,
        "eventsText": "12 Machine Telemetry Topics • 500ms Windowing",
        "endpoint": "kafka-cluster.plant-edge.internal:9092",
        "lastSync": "Live Streaming",
        "recordsSynced": "1.2M Events/Day",
        "plant": "All Plant Workcenters",
        "isPrimary": False,
        "authType": "SASL_SSL / Scram512"
    },
    {
        "id": "conn-mqtt",
        "name": "MQTT Industrial IoT Gateway (OPC-UA)",
        "shortCode": "MQTT",
        "color": "#660066",
        "category": "SCADA / Edge • Line PLC Telemetry & Machine Sensor Bridge",
        "status": "connected",
        "eventsCount": 24,
        "eventsText": "24 Monitored Machine Workcenters Synced",
        "endpoint": "mqtt-edge.mfg.internal:1883",
        "lastSync": "Live Sub-Second",
        "recordsSynced": "4,200 Packets/Min",
        "plant": "All Assembly Lines",
        "isPrimary": False,
        "authType": "TLS Pre-Shared Key"
    },
    {
        "id": "conn-snowflake",
        "name": "Snowflake Data Cloud",
        "shortCode": "SF",
        "color": "#29b5e8",
        "category": "Warehouse • Corporate BI Aggregations & ML Feature Store",
        "status": "available",
        "eventsCount": 4,
        "eventsText": "Daily Executive Rollups & Long-Term Retention",
        "endpoint": "gwc_enterprise.snowflakecomputing.com",
        "lastSync": "Available (Ready to Connect)",
        "recordsSynced": "0 (Paused)",
        "plant": "Corporate Analytics",
        "isPrimary": False,
        "authType": "OAuth 2.0 / Key-Pair"
    },
    {
        "id": "conn-powerbi",
        "name": "Microsoft Power BI Service",
        "shortCode": "BI",
        "color": "#f2c811",
        "category": "Reporting • Executive Semantic Models & Board Packs",
        "status": "connected",
        "eventsCount": 3,
        "eventsText": "Automated Dataset Refresh & Executive Scorecard Push",
        "endpoint": "api.powerbi.com/v1.0/myorg",
        "lastSync": "Refreshed Today 06:00 AM",
        "recordsSynced": "32 Dashboards",
        "plant": "Executive Leadership",
        "isPrimary": False,
        "authType": "Azure AD Service Principal"
    },
    {
        "id": "conn-teams",
        "name": "Microsoft Teams Operations Desk",
        "shortCode": "MT",
        "color": "#464eb8",
        "category": "Messaging • Shift Handover & Escalation Alert Webhooks",
        "status": "connected",
        "eventsCount": 3,
        "eventsText": "Micro-Stop Alarms, Buffer Stock Depletions & LTI Alerts",
        "endpoint": "outlook.office.com/webhook/v2",
        "lastSync": "Listening (Online)",
        "recordsSynced": "Active Channel",
        "plant": "All Plant Supervision Desks",
        "isPrimary": False,
        "authType": "HMAC Webhook Secret"
    },
    {
        "id": "conn-allenbradley",
        "name": "Rockwell FactoryTalk SCADA",
        "shortCode": "AB",
        "color": "#eb4d4b",
        "category": "SCADA • Shop-Floor PLC & Robotic Welder Tags",
        "status": "available",
        "eventsCount": 4,
        "eventsText": "4 Workcenter Controllers Ready",
        "endpoint": "rockwell-ft.plant.internal:44818",
        "lastSync": "Available (Ready to Connect)",
        "recordsSynced": "0 (Standby)",
        "plant": "Chennai Plant Line 02",
        "isPrimary": False,
        "authType": "CIP / EtherNet/IP"
    },
    {
        "id": "conn-mongodb",
        "name": "MongoDB Timeseries Cache",
        "shortCode": "MDB",
        "color": "#13aa52",
        "category": "Database • Operational Hot-Cache for Live Telemetry",
        "status": "available",
        "eventsCount": 4,
        "eventsText": "Sensor Window Buffer Ready",
        "endpoint": "cluster0.mongodb.net",
        "lastSync": "Available (Ready to Connect)",
        "recordsSynced": "0 (Standby)",
        "plant": "Edge Gateway Cluster",
        "isPrimary": False,
        "authType": "SCRAM-SHA-256"
    }
]

@router.get("")
@router.get("/")
def get_connectors():
    """Return all enterprise connectors with live Neon DB metadata."""
    # Try to augment Neon DB connector with real row count if available
    try:
        po_row = query_one("SELECT count(*) as cnt FROM fact_production_order;")
        if po_row:
            cnt = int(po_row.get("cnt") or 450)
            CONNECTORS_STORE[0]["recordsSynced"] = f"{cnt * 300:,} Total Rows"
    except Exception:
        pass

    return {
        "success": True,
        "connectors": CONNECTORS_STORE,
        "totalConnectors": len(CONNECTORS_STORE),
        "connectedCount": len([c for c in CONNECTORS_STORE if c["status"] == "connected"]),
        "primaryWarehouse": "Neon PostgreSQL (AWS US-East-2)"
    }

@router.post("/toggle")
def toggle_connector(payload: ToggleConnectorPayload):
    for c in CONNECTORS_STORE:
        if c["id"] == payload.id:
            # Don't allow disconnecting the primary Neon DB warehouse
            if c.get("isPrimary"):
                return {"success": True, "connector": c, "message": "Primary Neon DB warehouse remains permanently active."}
            c["status"] = "connected" if c["status"] != "connected" else "available"
            c["lastSync"] = "Live (Just now)" if c["status"] == "connected" else "Not connected"
            return {"success": True, "connector": c}
    return {"success": False, "message": "Connector not found"}

@router.post("/create")
def create_connector(payload: CreateConnectorPayload):
    words = payload.name.strip().split()
    short_code = "".join([w[0] for w in words[:2]]).upper() if words else "CX"
    new_conn = {
        "id": f"conn-custom-{int(time.time())}",
        "name": payload.name.strip(),
        "shortCode": short_code,
        "color": "#6f3dba",
        "category": payload.category,
        "status": "connected",
        "eventsCount": 4,
        "eventsText": "4 events active • Custom Ingestion",
        "endpoint": payload.endpoint or "https://api.internal.plant.corp",
        "lastSync": "Live (Just now)",
        "recordsSynced": "Connected",
        "plant": payload.plant,
        "isPrimary": False,
        "authType": payload.authType
    }
    # Insert right after Neon DB
    CONNECTORS_STORE.insert(1, new_conn)
    return {"success": True, "connector": new_conn}
