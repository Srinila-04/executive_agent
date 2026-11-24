import time
import os
import sys

sys.path.insert(0, 'backend')
from database import query_all, query_one
from routers.agents_router import AGENT_METADATA, compute_agent_live_metrics

agent_id = 16
meta = next((m for m in AGENT_METADATA if m["id"] == agent_id), None)
table_name = meta.get("table", "fact_production_order")

def timed(label, fn):
    t0 = time.time()
    res = fn()
    dt = round(time.time() - t0, 3)
    print(f"[{dt}s] {label}")
    return res

timed("1. compute_agent_live_metrics", lambda: compute_agent_live_metrics(agent_id))
timed("2. count(*)", lambda: query_one(f'SELECT count(*) as cnt FROM "{table_name}";'))
timed("3. LIMIT 25", lambda: query_all(f'SELECT * FROM "{table_name}" LIMIT 25;'))
timed("4. manual_kpi_entries", lambda: query_all("SELECT * FROM manual_kpi_entries WHERE agent_id = %s ORDER BY created_at DESC LIMIT 20;", (agent_id,)))
timed("5. admin_tasks", lambda: query_all("SELECT * FROM admin_tasks WHERE agent_id = %s ORDER BY created_at DESC;", (agent_id,)))
timed("6. admin_queries", lambda: query_all("SELECT * FROM admin_queries WHERE agent_id = %s ORDER BY created_at DESC;", (agent_id,)))
timed("7. plant_rows", lambda: query_all(f'SELECT plant_id, count(*) as record_count FROM "{table_name}" WHERE plant_id IS NOT NULL GROUP BY plant_id ORDER BY plant_id;'))
timed("8. dim_plant", lambda: query_all("SELECT plant_id, plant_name FROM dim_plant ORDER BY plant_id;"))
timed("9. deep_stats agent 16", lambda: query_one("""
    SELECT avg(CAST(standard_cost_per_unit_inr AS numeric)) as avg_cost,
           sum(CAST(material_cost_inr AS numeric)) as mat_sum,
           sum(CAST(labour_cost_inr AS numeric)) as lab_sum,
           sum(CAST(scrap_rework_cost_inr AS numeric)) as scrap_sum
    FROM fact_manufacturing_cost;
"""))
