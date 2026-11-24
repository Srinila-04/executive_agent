import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

from database import query_one
from routers.agents_router import router as agents_router
from routers.dashboards_router import router as dashboards_router
from routers.queries_tasks_router import router as queries_tasks_router
from routers.connectors_router import router as connectors_router
from routers.reports_router import router as reports_router
from routers.settings_router import router as settings_router
from routers.chat_router import router as chat_router
from routers.domo_router import router as domo_router
from routers.analytics_router import router as analytics_router
from routers.filters_router import router as filters_router
from routers.notifications_router import router as notifications_router

app = FastAPI(
    title="GWC Manufacturing Agent 20 Platform API",
    description="FastAPI Backend for 20 Multi-Plant Operational Manufacturing Agents & Executive Intelligence",
    version="3.0.0"
)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(agents_router)
app.include_router(dashboards_router)
app.include_router(queries_tasks_router)
app.include_router(connectors_router)
app.include_router(reports_router)
app.include_router(settings_router)
app.include_router(chat_router)
app.include_router(domo_router)
app.include_router(analytics_router)
app.include_router(filters_router)
app.include_router(notifications_router)

import threading
import time

def _gentle_prewarm():
    time.sleep(2.0)
    try:
        from routers.agents_router import get_agents, get_health_scorecard
        from routers.dashboards_router import get_agent_dashboard
        get_agents()
        get_health_scorecard()
        # Prewarm core agents gently with 1.0s pacing
        for aid in [16, 18, 1, 15, 3]:
            try:
                get_agent_dashboard(aid)
                time.sleep(1.0)
            except Exception:
                pass
    except Exception as e:
        print(f"[PREWARM NOTICE] {e}")

@app.on_event("startup")
def startup_event():
    threading.Thread(target=_gentle_prewarm, daemon=True).start()

@app.get("/api/health")
def health_check():
    """System health check verifying Neon DB live connectivity."""
    db_status = "Online"
    db_time = None
    try:
        row = query_one("SELECT NOW() as now;")
        if row:
            db_time = str(row["now"])
    except Exception as e:
        db_status = f"Warning: {e}"

    return {
        "status": "online",
        "framework": "FastAPI (Python 3.12)",
        "database": f"Neon DB (PostgreSQL on AWS) - {db_status}",
        "databaseTimestamp": db_time,
        "totalAgents": 20,
        "port": 5000,
        "environment": "Production Multi-Plant Mode"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
