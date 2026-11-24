import time
import os
import sys
from concurrent.futures import ThreadPoolExecutor

sys.path.insert(0, 'backend')
from database import query_all, query_one
from routers.agents_router import AGENT_METADATA, compute_agent_live_metrics

agent_id = 16
meta = next((m for m in AGENT_METADATA if m["id"] == agent_id), None)
table_name = meta.get("table", "fact_production_order")

def run_concurrent():
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=8) as ex:
        f1 = ex.submit(compute_agent_live_metrics, agent_id)
        f2 = ex.submit(query_one, f'SELECT count(*) as cnt FROM "{table_name}";')
        f3 = ex.submit(query_all, f'SELECT * FROM "{table_name}" LIMIT 25;')
        f4 = ex.submit(query_all, "SELECT * FROM manual_kpi_entries WHERE agent_id = %s ORDER BY created_at DESC LIMIT 20;", (agent_id,))
        f5 = ex.submit(query_all, "SELECT * FROM admin_tasks WHERE agent_id = %s ORDER BY created_at DESC;", (agent_id,))
        f6 = ex.submit(query_all, "SELECT * FROM admin_queries WHERE agent_id = %s ORDER BY created_at DESC;", (agent_id,))
        f7 = ex.submit(query_all, f'SELECT plant_id, count(*) as record_count FROM "{table_name}" WHERE plant_id IS NOT NULL GROUP BY plant_id ORDER BY plant_id;')
        f8 = ex.submit(query_one, """
            SELECT avg(CAST(standard_cost_per_unit_inr AS numeric)) as avg_cost,
                   sum(CAST(material_cost_inr AS numeric)) as mat_sum,
                   sum(CAST(labour_cost_inr AS numeric)) as lab_sum,
                   sum(CAST(scrap_rework_cost_inr AS numeric)) as scrap_sum
            FROM fact_manufacturing_cost;
        """)
        r1, r2, r3, r4, r5, r6, r7, r8 = f1.result(), f2.result(), f3.result(), f4.result(), f5.result(), f6.result(), f7.result(), f8.result()
    dt = round(time.time() - t0, 3)
    print(f"Parallel Execution Time: {dt}s (was 10.3s!)")

run_concurrent()
