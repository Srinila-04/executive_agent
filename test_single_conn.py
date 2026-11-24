import time
import os
import sys

sys.path.insert(0, 'backend')
from database import get_db, RealDictCursor
from routers.agents_router import AGENT_METADATA, compute_agent_live_metrics

agent_id = 16
meta = next((m for m in AGENT_METADATA if m["id"] == agent_id), None)
table_name = meta.get("table", "fact_production_order")

def run_single_connection():
    t0 = time.time()
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # 1. Combined queries in a single multi-statement or single cursor
            cur.execute(f'SELECT count(*) as cnt FROM "{table_name}";')
            total_records = cur.fetchone()["cnt"]

            cur.execute(f'SELECT * FROM "{table_name}" LIMIT 25;')
            recent_records = [dict(r) for r in cur.fetchall()]

            cur.execute("SELECT * FROM manual_kpi_entries WHERE agent_id = %s ORDER BY created_at DESC LIMIT 20;", (agent_id,))
            manual_entries = [dict(r) for r in cur.fetchall()]

            cur.execute("SELECT * FROM admin_tasks WHERE agent_id = %s ORDER BY created_at DESC LIMIT 10;", (agent_id,))
            tasks = [dict(r) for r in cur.fetchall()]

            cur.execute("SELECT * FROM admin_queries WHERE agent_id = %s ORDER BY created_at DESC LIMIT 10;", (agent_id,))
            queries = [dict(r) for r in cur.fetchall()]

            cur.execute(f'SELECT plant_id, count(*) as record_count FROM "{table_name}" WHERE plant_id IS NOT NULL GROUP BY plant_id ORDER BY plant_id;')
            plant_rows = [dict(r) for r in cur.fetchall()]

            cur.execute("""
                SELECT avg(CAST(standard_cost_per_unit_inr AS numeric)) as avg_cost,
                       sum(CAST(material_cost_inr AS numeric)) as mat_sum,
                       sum(CAST(labour_cost_inr AS numeric)) as lab_sum,
                       sum(CAST(scrap_rework_cost_inr AS numeric)) as scrap_sum
                FROM fact_manufacturing_cost;
            """)
            deep_row = dict(cur.fetchone())

    dt = round(time.time() - t0, 3)
    print(f"Single connection time: {dt}s")

run_single_connection()
