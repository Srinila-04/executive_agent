from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import query_all, query_one, execute_stmt

router = APIRouter(prefix="/api/admin", tags=["Admin Queries & Task Tracking"])

class NewQueryPayload(BaseModel):
    query_text: str
    agent_id: int
    agent_name: str
    recipient_role: str
    recipient_name: str = ""
    priority: str = "High"

class QueryReplyPayload(BaseModel):
    reply_text: str

class NewTaskPayload(BaseModel):
    task_title: str
    description: str = ""
    agent_id: int
    agent_name: str
    assigned_to_role: str
    assigned_to_name: str = ""
    plant_id: str = "IN-TN-01"
    priority: str = "High"
    target_date: str = ""
    notes: str = ""

class UpdateTaskStagePayload(BaseModel):
    stage: str # Assigned, Acknowledged, In Progress, Quality Review, Completed
    notes: str = ""

# Available Managers & Supervisors linked to Agents
SUPERVISOR_DIRECTORY = [
    {"role": "Plant Head (Chennai Plant 01)", "name": "Murugan K", "plant": "IN-TN-01", "sector": "Executive / Cross-Plant"},
    {"role": "Plant Head (Pune Plant 02)", "name": "Vikram Patil", "plant": "IN-KA-01", "sector": "Executive / Cross-Plant"},
    {"role": "Operations Planning Lead (Agent 01)", "name": "Suresh Raina", "plant": "IN-TN-01", "sector": "Production & Planning"},
    {"role": "Shop Floor Monitoring Lead (Agent 02)", "name": "Arun Kumar", "plant": "IN-KA-01", "sector": "Production & Planning"},
    {"role": "Maintenance & OEE Lead (Agent 03)", "name": "Ramesh V", "plant": "IN-TN-01", "sector": "Production & Planning"},
    {"role": "Reliability Engineering Lead (Agent 04)", "name": "Deepak Joshi", "plant": "IN-KA-01", "sector": "Maintenance & Utilities"},
    {"role": "Quality Assurance Head (Agent 05)", "name": "Karthik Raman", "plant": "IN-TN-01", "sector": "Quality & Engineering"},
    {"role": "Metrology & Vision Lead (Agent 06)", "name": "Pooja Nair", "plant": "IN-TN-01", "sector": "Quality & Engineering"},
    {"role": "Materials Management Lead (Agent 09)", "name": "Rajesh Sharma", "plant": "IN-KA-01", "sector": "Supply Chain & Customers"},
    {"role": "Supplier Quality Director (Agent 10)", "name": "Manoj Tiwari", "plant": "IN-TN-01", "sector": "Supply Chain & Customers"},
    {"role": "Logistics & Fleet Lead (Agent 12)", "name": "Gurpreet Singh", "plant": "IN-TN-01", "sector": "Supply Chain & Customers"},
    {"role": "Energy & Sustainability Lead (Agent 13)", "name": "Amit Saxena", "plant": "IN-KA-01", "sector": "Maintenance & Utilities"},
    {"role": "Plant Safety & EHS Director (Agent 14)", "name": "Ananya Deshmukh", "plant": "IN-TN-01", "sector": "People & Safety"},
    {"role": "Workforce & HR Lead (Agent 15)", "name": "Sunita Rao", "plant": "IN-KA-01", "sector": "People & Safety"},
    {"role": "Plant Controller Lead (Agent 16)", "name": "Nitin Gupta", "plant": "IN-TN-01", "sector": "Finance & Leadership"}
]

@router.get("/supervisors")
def get_supervisors():
    """Return the plant managers and supervisors directory."""
    return {"supervisors": SUPERVISOR_DIRECTORY}

# -------------------------------------------------------------
# 1. ADMIN QUERIES ENDPOINTS
# -------------------------------------------------------------
@router.get("/queries")
def get_admin_queries():
    """Retrieve all admin queries and supervisor replies from Neon DB."""
    queries = query_all("SELECT * FROM admin_queries ORDER BY created_at DESC;")
    return {"queries": queries}

@router.post("/queries")
def create_admin_query(payload: NewQueryPayload):
    """Admin creates a new query sent to a manager/supervisor."""
    sql = """
        INSERT INTO admin_queries (query_text, agent_id, agent_name, recipient_role, recipient_name, priority, status)
        VALUES (%s, %s, %s, %s, %s, %s, 'Open')
        RETURNING *;
    """
    row = execute_stmt(
        sql,
        (
            payload.query_text,
            payload.agent_id,
            payload.agent_name,
            payload.recipient_role,
            payload.recipient_name or payload.recipient_role,
            payload.priority
        )
    )
    return {"success": True, "query": row, "message": "Query sent to supervisor."}

@router.post("/queries/{query_id}/reply")
def reply_admin_query(query_id: int, payload: QueryReplyPayload):
    """Supervisor logs a response to the admin's query."""
    sql = """
        UPDATE admin_queries
        SET reply_text = %s, status = 'Replied', replied_at = CURRENT_TIMESTAMP
        WHERE id = %s
        RETURNING *;
    """
    row = execute_stmt(sql, (payload.reply_text, query_id))
    if not row:
        raise HTTPException(status_code=404, detail="Query not found")
    return {"success": True, "query": row}

# -------------------------------------------------------------
# 2. TASK STAGE TRACKING ENDPOINTS
# -------------------------------------------------------------
VALID_STAGES = ["Assigned", "Acknowledged", "In Progress", "Quality Review", "Completed"]

@router.get("/tasks")
def get_admin_tasks():
    """Retrieve all assigned tasks across stages."""
    tasks = query_all("SELECT * FROM admin_tasks ORDER BY created_at DESC;")
    
    # Group tasks by stage
    stages = {st: [] for st in VALID_STAGES}
    for t in tasks:
        stage = t.get("stage", "Assigned")
        if stage in stages:
            stages[stage].append(t)
        else:
            stages["Assigned"].append(t)

    return {
        "tasks": tasks,
        "stages": stages,
        "validStages": VALID_STAGES,
        "totalTasks": len(tasks),
        "completedCount": len(stages["Completed"])
    }

@router.post("/tasks")
def create_admin_task(payload: NewTaskPayload):
    """Assign a new operational task to a manager/supervisor."""
    sql = """
        INSERT INTO admin_tasks (task_title, description, agent_id, agent_name, assigned_to_role, assigned_to_name, plant_id, priority, stage, notes)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'Assigned', %s)
        RETURNING *;
    """
    row = execute_stmt(
        sql,
        (
            payload.task_title,
            payload.description,
            payload.agent_id,
            payload.agent_name,
            payload.assigned_to_role,
            payload.assigned_to_name or payload.assigned_to_role,
            payload.plant_id,
            payload.priority,
            payload.notes
        )
    )
    return {"success": True, "task": row, "message": "Task assigned to manager."}

@router.put("/tasks/{task_id}/stage")
def update_task_stage(task_id: int, payload: UpdateTaskStagePayload):
    """Transition a task to the next stage in the manufacturing workflow."""
    if payload.stage not in VALID_STAGES:
        raise HTTPException(status_code=400, detail=f"Invalid stage. Must be one of: {VALID_STAGES}")

    sql = """
        UPDATE admin_tasks
        SET stage = %s, notes = COALESCE(NULLIF(%s, ''), notes)
        WHERE id = %s
        RETURNING *;
    """
    row = execute_stmt(sql, (payload.stage, payload.notes, task_id))
    if not row:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"success": True, "task": row}
