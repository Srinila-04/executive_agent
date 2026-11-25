from fastapi import APIRouter
from database import query_all

router = APIRouter(prefix="/api/settings", tags=["Settings"])

# Active plant scope: Chennai & Bengaluru only
ALLOWED_PLANT_IDS = ("IN-TN-01", "IN-KA-01")

PLANT_METADATA = {
    "IN-TN-01": {
        "district": "Sriperumbudur / Kanchipuram",
        "lead": "Murugan K (Operations Lead)",
        "lines": 4,
        "status": "Active"
    },
    "IN-KA-01": {
        "district": "Peenya / Whitefield",
        "lead": "Sunita Rao (Robotics & R&D Lead)",
        "lines": 3,
        "status": "Active"
    }
}

COMPANY_SETTINGS = {
    "companyName": "Motherson Group (GWC Industrial Automation Division)",
    "industry": "Automotive Tier-1 & Industrial Electronics",
    "totalPlants": 2,
    "activeStateCoverage": ["Tamil Nadu", "Karnataka"],
    "districtCoverage": [
        {
            "plantCode": "IN-TN-01",
            "plantName": "Chennai Electronics Plant",
            "state": "Tamil Nadu",
            "district": "Sriperumbudur / Kanchipuram",
            "lines": 4,
            "status": "Active",
            "lead": "Murugan K (Operations Lead)"
        },
        {
            "plantCode": "IN-KA-01",
            "plantName": "Bengaluru Electronics Plant",
            "state": "Karnataka",
            "district": "Peenya / Whitefield",
            "lines": 3,
            "status": "Active",
            "lead": "Sunita Rao (Robotics & R&D Lead)"
        }
    ],
    "telemetryRefreshIntervalSec": 12,
    "neonDatabaseStatus": "Online (AWS PostgreSQL)",
    "executiveCommandAgent": "Agent 20 (Master Decision Command Center)"
}

_USER_CUSTOMIZED_SETTINGS = False

@router.get("")
def get_settings():
    if _USER_CUSTOMIZED_SETTINGS:
        return COMPANY_SETTINGS
    try:
        db_plants = query_all(
            "SELECT plant_id, plant_name, state, country FROM dim_plant WHERE plant_id = ANY(%s) ORDER BY CASE plant_id WHEN 'IN-TN-01' THEN 1 WHEN 'IN-KA-01' THEN 2 ELSE 3 END;",
            (list(ALLOWED_PLANT_IDS),)
        )
        if db_plants:
            coverage = []
            for p in db_plants:
                p_id = p["plant_id"]
                lines_res = query_all("SELECT count(*) as cnt FROM dim_production_line WHERE plant_id = %s;", (p_id,))
                db_cnt = int(lines_res[0]["cnt"]) if (lines_res and lines_res[0]["cnt"]) else None
                meta = PLANT_METADATA.get(p_id, {})
                coverage.append({
                    "plantCode": p_id,
                    "plantName": p["plant_name"],
                    "state": p["state"],
                    "district": meta.get("district", f"{p['state']} Industrial Corridor"),
                    "lines": db_cnt or meta.get("lines", 2),
                    "status": meta.get("status", "Active"),
                    "lead": meta.get("lead", "Murugan K")
                })
            return {
                **COMPANY_SETTINGS,
                "districtCoverage": coverage,
                "totalPlants": len(coverage)
            }
    except Exception as e:
        print(f"Error fetching dim_plant from DB: {e}")
    return COMPANY_SETTINGS

@router.put("")
def update_settings(payload: dict):
    global COMPANY_SETTINGS, _USER_CUSTOMIZED_SETTINGS
    COMPANY_SETTINGS.update(payload)
    if "districtCoverage" in payload and isinstance(payload["districtCoverage"], list):
        COMPANY_SETTINGS["totalPlants"] = len(payload["districtCoverage"])
    _USER_CUSTOMIZED_SETTINGS = True
    return {"success": True, "settings": COMPANY_SETTINGS}
