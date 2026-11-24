from fastapi import APIRouter
from database import query_all

router = APIRouter(prefix="/api/settings", tags=["Settings"])

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
    },
    "IN-MH-01": {
        "district": "Chakan / Pimpri-Chinchwad",
        "lead": "Rajesh Deshmukh (Stamping Operations)",
        "lines": 4,
        "status": "Active"
    },
    "IN-GJ-01": {
        "district": "Sanand Industrial Corridor",
        "lead": "Ananya Patel (EV Powertrain Lead)",
        "lines": 4,
        "status": "Active"
    },
    "IN-HR-01": {
        "district": "Manesar / Gurugram Belt",
        "lead": "Vikram Singhania (Harness & Materials)",
        "lines": 3,
        "status": "Active"
    },
    "IN-TN-02": {
        "district": "Hosur / Coimbatore Corridor",
        "lead": "Karthik Swaminathan (Tooling & Dies)",
        "lines": 2,
        "status": "Active"
    }
}

COMPANY_SETTINGS = {
    "companyName": "Motherson Group (GWC Industrial Automation Division)",
    "industry": "Automotive Tier-1 & Industrial Electronics",
    "totalPlants": 6,
    "activeStateCoverage": ["Tamil Nadu", "Karnataka", "Maharashtra", "Gujarat", "Haryana"],
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
        },
        {
            "plantCode": "IN-MH-01",
            "plantName": "Pune Precision Stamping Plant",
            "state": "Maharashtra",
            "district": "Chakan / Pimpri-Chinchwad",
            "lines": 4,
            "status": "Active",
            "lead": "Rajesh Deshmukh (Stamping Operations)"
        },
        {
            "plantCode": "IN-GJ-01",
            "plantName": "Sanand EV Powertrain & Casting",
            "state": "Gujarat",
            "district": "Sanand Industrial Corridor",
            "lines": 4,
            "status": "Active",
            "lead": "Ananya Patel (EV Powertrain Lead)"
        },
        {
            "plantCode": "IN-HR-01",
            "plantName": "Gurugram Polymer & Wire Harness",
            "state": "Haryana",
            "district": "Manesar / Gurugram Belt",
            "lines": 3,
            "status": "Active",
            "lead": "Vikram Singhania (Harness & Materials)"
        },
        {
            "plantCode": "IN-TN-02",
            "plantName": "Hosur Precision Tooling & Dies",
            "state": "Tamil Nadu",
            "district": "Hosur / Coimbatore Corridor",
            "lines": 2,
            "status": "Active",
            "lead": "Karthik Swaminathan (Tooling & Dies)"
        }
    ],
    "telemetryRefreshIntervalSec": 12,
    "neonDatabaseStatus": "Online (AWS PostgreSQL)",
    "executiveCommandAgent": "Agent 20 (Master Decision Command Center)"
}

@router.get("")
def get_settings():
    try:
        db_plants = query_all("SELECT plant_id, plant_name, state, country FROM dim_plant ORDER BY plant_id;")
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
    global COMPANY_SETTINGS
    COMPANY_SETTINGS.update(payload)
    return {"success": True, "settings": COMPANY_SETTINGS}
