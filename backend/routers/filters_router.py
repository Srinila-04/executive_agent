import time
from fastapi import APIRouter
from database import query_all, get_db
from psycopg2.extras import RealDictCursor
from routers.agents_router import AGENT_METADATA

router = APIRouter(prefix="/api/filters", tags=["Filters"])

_FILTER_CACHE = {"ts": 0, "data": None}
_FILTER_CACHE_TTL = 30.0  # 30 seconds fresh cache

@router.get("/options")
def get_filter_options():
    """Return unified filter dropdown options directly from Neon PostgreSQL."""
    now = time.time()
    if _FILTER_CACHE["data"] and (now - _FILTER_CACHE["ts"] < _FILTER_CACHE_TTL):
        return _FILTER_CACHE["data"]

    try:
        with get_db() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # 1. Fetch real plants from dim_plant
                cur.execute("SELECT plant_id, plant_name, state, country, timezone FROM dim_plant ORDER BY plant_id;")
                db_plants = [dict(r) for r in cur.fetchall()]

                # 2. Fetch real lines from dim_production_line
                cur.execute("SELECT line_id, plant_id, line_type, nominal_capacity_per_hour, takt_time_sec FROM dim_production_line ORDER BY plant_id, line_id;")
                db_lines = [dict(r) for r in cur.fetchall()]
    except Exception as e:
        print(f"Error querying filter options from Neon DB: {e}")
        db_plants = [
            {"plant_id": "IN-TN-01", "plant_name": "Chennai Electronics Plant", "state": "Tamil Nadu", "country": "India"},
            {"plant_id": "IN-KA-01", "plant_name": "Bengaluru Electronics Plant", "state": "Karnataka", "country": "India"}
        ]
        db_lines = [
            {"line_id": "SMT-L1", "plant_id": "IN-TN-01", "line_type": "SMT"},
            {"line_id": "FAL-L1", "plant_id": "IN-TN-01", "line_type": "Final Assembly"},
            {"line_id": "SMT-L2", "plant_id": "IN-KA-01", "line_type": "SMT"},
            {"line_id": "FAL-L2", "plant_id": "IN-KA-01", "line_type": "Final Assembly"}
        ]

    # Structure plants with attached lines
    plants = [
        {
            "id": "ALL",
            "code": "ALL",
            "name": "All Plant Facilities",
            "displayName": "🌐 All Plant Facilities (Consortium)",
            "state": "All States",
            "lines": [l["line_id"] for l in db_lines]
        }
    ]
    for p in db_plants:
        p_id = p["plant_id"]
        p_lines = [l["line_id"] for l in db_lines if l.get("plant_id") == p_id]
        plants.append({
            "id": p_id,
            "code": p_id,
            "name": p["plant_name"],
            "displayName": f"🏭 {p['plant_name']} ({p_id})",
            "state": p.get("state", "India"),
            "lines": p_lines
        })

    # Structure lines
    lines = [
        {"id": "ALL", "name": "All Production Lines", "plantId": "ALL"}
    ]
    for l in db_lines:
        lines.append({
            "id": l["line_id"],
            "name": f"{l['line_id']} ({l.get('line_type', 'Assembly')})",
            "plantId": l.get("plant_id")
        })

    # Shifts standard in Neon DB
    shifts = [
        {"id": "ALL", "name": "All Shifts (24 Hours)", "time": "00:00 - 24:00"},
        {"id": "A", "name": "Shift A (Morning)", "time": "06:00 - 14:00"},
        {"id": "B", "name": "Shift B (Evening)", "time": "14:00 - 22:00"},
        {"id": "C", "name": "Shift C (Night)", "time": "22:00 - 06:00"}
    ]

    # Sectors (6 active sectors)
    sectors = [
        {"id": "all", "name": "All 6 Sectors", "code": "ALL"},
        {"id": "production", "name": "Production & Planning", "code": "PROD"},
        {"id": "maintenance", "name": "Maintenance & Utilities", "code": "MAINT"},
        {"id": "quality", "name": "Quality & Engineering", "code": "QUAL"},
        {"id": "supplychain", "name": "Supply Chain & Customers", "code": "SCM"},
        {"id": "people", "name": "People & Safety", "code": "PEOPLE"},
        {"id": "finance", "name": "Finance & Leadership", "code": "FIN"}
    ]

    # Agents list (20 operational agents)
    agents = [
        {"id": "ALL", "name": "All 20 Agents", "code": "ALL", "sectorId": "all"}
    ]
    for a in AGENT_METADATA:
        agents.append({
            "id": str(a["id"]),
            "agentNumber": a["id"],
            "name": f"Agent {a['id']:02d}: {a['name']}",
            "code": a["code"],
            "sectorId": a.get("sectorId", "production"),
            "table": a.get("table", "")
        })

    date_ranges = [
        "Today",
        "This Week",
        "This Month",
        "Quarter (Q4)",
        "Last 30 Days",
        "Year to Date"
    ]

    result = {
        "success": True,
        "plants": plants,
        "lines": lines,
        "shifts": shifts,
        "sectors": sectors,
        "agents": agents,
        "dateRanges": date_ranges,
        "primaryWarehouse": "Neon PostgreSQL (AWS US-East-2)",
        "timestamp": now
    }

    _FILTER_CACHE["ts"] = now
    _FILTER_CACHE["data"] = result
    return result
