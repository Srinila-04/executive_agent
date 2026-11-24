# API Availability and Frontend Integration Verification Report

**Date:** November 11, 2026  
**Auditor:** Senior Python FastAPI Backend Engineer  
**Document Path:** `backend/API_AVAILABILITY_AND_INTEGRATION_REPORT.md`  
**Classification:** Technical Investigation & Integration Verification  

---

## Executive Summary

The investigation into the reported `HTTP 404 Not Found` for `http://localhost:8000/openapi.json` is complete. The backend is operational, healthy, and compatible with the frontend contracts defined in `frontend/API_INTEGRATION_REFERENCE.md`.

- **Root Cause of the 404 Error**: The FastAPI application was configured with `openapi_url="/api/openapi.json"` (and `docs_url="/api/docs"`), placing all API documentation and schema endpoints under the `/api` prefix. Requests to `http://localhost:8000/openapi.json` returned HTTP 404 because the correct path is **`http://localhost:8000/api/openapi.json`**.
- **Virtual Environment Status**: The `backend/venv` folder initially contained only a base Python interpreter without project dependencies. All requirements from `backend/requirements.txt` have now been populated into `backend/venv`, making the virtual environment self-contained.
- **Server Status**: The FastAPI backend is running on port **8000** (`http://127.0.0.1:8000`). All 13 business routes are tested and functional.
- **Automated Tests**: 24 of 24 tests passed (100%).

---

## 1. Python Environment Status

| Item | Details | Status |
| :--- | :--- | :---: |
| **System Python Installation** | Python 3.12.10 (64-bit AMD64) at `C:\Users\DELL 5430\AppData\Local\Programs\Python\Python312\python.exe` | **VERIFIED** |
| **Virtual Environment Path** | `C:\Users\DELL 5430\Desktop\Manufacturing\backend\venv` | **VERIFIED** |
| **Virtual Environment Dependencies** | Synchronized with `backend/requirements.txt` (FastAPI 0.115+, SQLAlchemy 2.1+, Alembic 1.20+, Psycopg 3.3+, Pydantic 2.14+, PyJWT 2.15+, Argon2-cffi 25.1+, LangChain-core 1.7+, Pandas 3.1+) | **VERIFIED** |
| **Working Directory** | Workspace root: `C:\Users\DELL 5430\Desktop\Manufacturing` (or `backend/` subfolder) | **VERIFIED** |

---

## 2. Correct Virtual Environment Activation Commands

### Windows Command Prompt (CMD)
```cmd
cd C:\Users\DELL 5430\Desktop\Manufacturing\backend
venv\Scripts\activate.bat
```
*(Or from the project root: `backend\venv\Scripts\activate.bat`)*

### Windows PowerShell
```powershell
cd "C:\Users\DELL 5430\Desktop\Manufacturing\backend"
.\venv\Scripts\Activate.ps1
```
*(If script execution is disabled in PowerShell, activate via CMD or invoke python directly without activation using `backend\venv\Scripts\python.exe`)*

---

## 3. Correct Backend Startup Commands

### Option A: From Project Root (`C:\Users\DELL 5430\Desktop\Manufacturing`)

#### Windows CMD:
```cmd
backend\venv\Scripts\uvicorn.exe backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Windows PowerShell:
```powershell
.\backend\venv\Scripts\uvicorn.exe backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Option B: From Inside `backend/` Folder (`C:\Users\DELL 5430\Desktop\Manufacturing\backend`)

#### Windows CMD:
```cmd
venv\Scripts\activate.bat && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Windows PowerShell:
```powershell
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 4. Actual Backend Port & Base URL

| Setting | Value | Status |
| :--- | :--- | :---: |
| **Host** | `127.0.0.1` (or `localhost`) | **VERIFIED** |
| **Port** | `8000` | **VERIFIED** |
| **Base API URL** | `http://127.0.0.1:8000` (or `http://localhost:8000`) | **VERIFIED** |
| **Frontend `.env` Target** | `VITE_API_BASE_URL=http://localhost:8000` | **VERIFIED** |
| **Health Endpoint** | `http://127.0.0.1:8000/api/health` | **VERIFIED (HTTP 200)** |
| **Root Status Endpoint** | `http://127.0.0.1:8000/` | **VERIFIED (HTTP 200)** |

---

## 5. OpenAPI and Swagger Availability

### Root Cause Analysis of the 404
In `backend/app/main.py` (lines 64–72):
```python
app = FastAPI(
    title="Customer Order Management Agent API",
    description="Intelligent manufacturing customer order tracking, risk assessment, and Domo AI agent backend.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",  # <-- Mounted under /api prefix
    lifespan=lifespan,
)
```

Because `openapi_url` is explicitly configured as `/api/openapi.json`, probing the default FastAPI root path `/openapi.json` triggers a 404 Not Found response.

### Verification Matrix

| Endpoint | URL | Response | Status |
| :--- | :--- | :---: | :---: |
| Default OpenAPI Path | `http://localhost:8000/openapi.json` | `HTTP 404 Not Found` | **EXPECTED BY CONFIG** |
| **Actual OpenAPI Schema** | `http://localhost:8000/api/openapi.json` | `HTTP 200 OK` (31,476 bytes) | **VERIFIED** |
| **Interactive Swagger UI** | `http://localhost:8000/api/docs` | `HTTP 200 OK` | **VERIFIED** |
| **ReDoc UI** | `http://localhost:8000/api/redoc` | `HTTP 200 OK` | **VERIFIED** |

*Note: If desired by the frontend team, a root route `/openapi.json` forwarding to `/api/openapi.json` can be added after approval.*

---

## 6. Registered Endpoint Verification

Live HTTP requests were executed against the running backend instance:

| Group | Method & Path | Auth Required | Live HTTP Status | Verified Payload / Behavior |
| :--- | :--- | :---: | :---: | :--- |
| **System** | `GET /` | No | `200 OK` | Returns service name, version, documentation link. |
| **Health** | `GET /api/health` | No | `200 OK` | Returns `status: "healthy"`, `database: "connected"`. |
| **OpenAPI** | `GET /api/openapi.json` | No | `200 OK` | Full OpenAPI 3.1.0 JSON schema. |
| **Auth** | `POST /api/auth/login` | No | `200 OK` | Accepts `{ email, password }`; returns `access_token`, `refresh_token`, `user`; sets HttpOnly `refresh_token` cookie. |
| **Auth** | `GET /api/auth/me` | Bearer | `200 OK` | Returns authenticated user profile (`admin@manufacturing.com`). |
| **Auth** | `POST /api/auth/refresh` | Cookie/Body | `200 OK` | Rotates opaque refresh token; delivers new access token and rotated cookie. |
| **Auth** | `POST /api/auth/logout` | Bearer | `200 OK` | Revokes refresh token in database; clears cookie. |
| **Dashboard** | `GET /api/dashboard/summary` | Bearer | `200 OK` | Returns 1,500 total orders, status counts, actual/potential delay metrics, on-time delivery rate. |
| **Dashboard** | `GET /api/dashboard/order-status` | Bearer | `200 OK` | Returns 5 status buckets with counts, percentages, and total values. |
| **Dashboard** | `GET /api/dashboard/at-risk` | Bearer | `200 OK` | Returns paginated orders categorized by delay risk with rule explanations. |
| **Orders** | `GET /api/orders` | Bearer | `200 OK` | Server-side pagination, sorting, status/priority filtering; attached risk evaluation. |
| **Orders** | `GET /api/orders/{id}` | Bearer | `200 OK` | Full order detail with customer, product, shipments, production links, and data-quality warnings. |
| **Orders** | `GET /api/orders/{id}/timeline` | Bearer | `200 OK` | Chronologically ordered event history. |
| **Inventory** | `GET /api/inventory/materials` | Bearer | `200 OK` | Paginated raw materials across 6,624 daily snapshot records with calculated net available quantity. |
| **Agent** | `POST /api/agent/chat` | Bearer | `200 OK` | ReAct JSON action loop; invokes approved read-only tools; returns answer and tool traces. |
| **Agent** | `GET /api/conversations` | Bearer | `200 OK` | List of user conversation threads. |
| **Agent** | `GET /api/conversations/{id}/messages`| Bearer | `200 OK` | Message history with tool step traces. |

**Overall Endpoint Verification Status:** **VERIFIED**

---

## 7. Frontend / Backend Contract Alignment

The backend contracts were compared against `frontend/API_INTEGRATION_REFERENCE.md` and the frontend client implementations in `frontend/src/api/*.js`:

| Contract Area | Frontend Expectation (`frontend/src/api/`) | Backend Implementation (`backend/app/`) | Alignment Status |
| :--- | :--- | :--- | :---: |
| **Base URL** | `http://localhost:8000` (`VITE_API_BASE_URL`) | Listens on `http://127.0.0.1:8000` | **VERIFIED** |
| **Login Schema** | `{ email, password }` | `LoginRequest(email: EmailStr, password: str)` | **VERIFIED** |
| **Token Delivery** | JSON `access_token` stored in localStorage; `refresh_token` stored in HttpOnly cookie | JSON contains `access_token` and `refresh_token`; `Set-Cookie` header sets `refresh_token` | **VERIFIED** |
| **Bearer Auth Header** | `Authorization: Bearer <access_token>` | Handled by `HTTPBearer` in `get_current_user` dependency | **VERIFIED** |
| **Refresh Rotation** | `POST /api/auth/refresh` sending cookies with credentials | Reads `request.cookies.get("refresh_token")` or request body; rotates token in database | **VERIFIED** |
| **Summary KPIs** | Expects `total_orders`, `open_orders`, `delivered_orders`, `data_quality_missing_po_count` | Exact field names match `DashboardSummary` model | **VERIFIED** |
| **Order Status Breakdown** | Expects array of `{ status, count }` | Returns array of `OrderStatusCount` | **VERIFIED** |
| **At-Risk Summary** | Expects `{ total_at_risk, actual_delayed, potential_delayed, unknown_risk, items: [...] }` | Exact match with `AtRiskSummaryResponse` | **VERIFIED** |
| **Order List Pagination** | `{ items: [...], total, page, page_size, total_pages }` | Exact match with `PaginatedResponse[CustomerOrderListItem]` | **VERIFIED** |
| **Order Detail Structure** | Fields plus `customer`, `product`, `shipments[]`, `production_orders[]`, `data_quality_warnings[]` | Exact match with `CustomerOrderDetail` | **VERIFIED** |
| **Timeline Schema** | `{ customer_order_id, events: [...], total_events }` | Exact match with `OrderTimelineResponse` | **VERIFIED** |
| **Agent Chat Request** | `{ message: string, conversation_id?: string }` | `ChatRequest(message: str, conversation_id: Optional[str])` | **VERIFIED** |
| **Agent Chat Response** | `{ conversation_id, answer, steps: [{ tool, input, output }], message_id, created_at }` | Exact match with `ChatResponse` | **VERIFIED** |
| **Conversations List** | Array of `{ id, user_id, title, created_at, updated_at, message_count }` | Returns `List[ConversationResponse]` | **VERIFIED** |
| **Error Format** | `{ success: false, error: string, code: string, request_id: string }` | Handled by `middleware/error_handler.py` | **VERIFIED** |

---

## 8. CORS and Authentication Readiness

### CORS Allowlist
- **Frontend Origin**: `http://localhost:5173` (Vite dev server)
- **Backend Configuration**:
  - `settings.cors_origins`: `"http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"`
  - `CORSMiddleware`:
    - `allow_origins=settings.cors_origin_list`
    - `allow_credentials=True`
    - `allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]`
    - `allow_headers=["*"]`
    - `expose_headers=["X-Request-ID", "Content-Disposition"]`
- **Cross-Origin Credential Readiness**: **VERIFIED**

### Cookie Handling
- **Cookie Name**: `refresh_token`
- **HttpOnly**: `True` (cannot be accessed by browser JavaScript, protecting against XSS)
- **SameSite**: `"lax"` (allows top-level navigation while protecting against CSRF)
- **Secure**: `False` in local development (`settings.cookie_secure=False`), `True` in production
- **Scope Path**: `path="/api/auth"` (cookie is only sent to authentication rotation endpoints, minimizing exposure)
- **Cookie Readiness**: **VERIFIED**

---

## 9. Security and Data Constraints Verification

| Security / Data Constraint | Verification Finding | Status |
| :--- | :--- | :---: |
| **Business Tables Read-Only** | SQLAlchemy event listeners block updates and deletes with `PermissionError`. Tested by `test_business_tables_are_read_only`. | **VERIFIED** |
| **No Synthetic Relationships** | Production orders referencing unlinked customer order numbers (e.g. `CO-10873`) are not artificially linked. Surfaced as data-quality warnings. | **VERIFIED** |
| **Restricted Agent Tools** | Tools execute strictly through verified backend services (`OrderService`, `DashboardService`). Zero arbitrary SQL execution. | **VERIFIED** |
| **Credential Protection** | Argon2 password hashing; refresh tokens stored as SHA-256 hashes. Password and secret keys excluded from all API responses. | **VERIFIED** |
| **No Public Registration** | Registration route omitted; only pre-seeded `admin` and `demo` accounts exist. | **VERIFIED** |

---

## 10. Automated Test Results

Executed with the virtual environment interpreter (`backend\venv\Scripts\python.exe -m pytest backend/tests -v`):

```text
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.2.0, pluggy-1.7.0 -- C:\Users\DELL 5430\Desktop\Manufacturing\backend\venv\Scripts\python.exe
cachedir: .pytest_cache
rootdir: C:\Users\DELL 5430\Desktop\Manufacturing
plugins: anyio-4.16.0, langsmith-0.14.17, asyncio-1.4.1.post1
collected 24 items

backend/tests/test_agent.py::test_agent_tools_direct_execution PASSED    [  4%]
backend/tests/test_agent.py::test_agent_chat_api PASSED                  [  8%]
backend/tests/test_auth.py::test_login_success PASSED                    [ 12%]
backend/tests/test_auth.py::test_login_invalid_password PASSED           [ 16%]
backend/tests/test_auth.py::test_get_me_authenticated PASSED             [ 20%]
backend/tests/test_auth.py::test_get_me_unauthorized PASSED              [ 25%]
backend/tests/test_auth.py::test_refresh_token_rotation PASSED           [ 29%]
backend/tests/test_auth.py::test_logout PASSED                           [ 33%]
backend/tests/test_dashboard.py::test_dashboard_summary PASSED           [ 37%]
backend/tests/test_dashboard.py::test_dashboard_order_status_distribution PASSED [ 41%]
backend/tests/test_dashboard.py::test_dashboard_at_risk_orders PASSED    [ 45%]
backend/tests/test_import.py::test_imported_row_counts PASSED            [ 50%]
backend/tests/test_import.py::test_business_tables_are_read_only PASSED  [ 54%]
backend/tests/test_inventory.py::test_list_materials PASSED              [ 58%]
backend/tests/test_inventory.py::test_list_materials_filtering PASSED    [ 62%]
backend/tests/test_inventory.py::test_get_material_summary PASSED        [ 66%]
backend/tests/test_orders.py::test_list_orders PASSED                    [ 70%]
backend/tests/test_orders.py::test_list_orders_filtering PASSED          [ 75%]
backend/tests/test_orders.py::test_get_order_detail PASSED               [ 79%]
backend/tests/test_orders.py::test_get_order_detail_not_found PASSED     [ 83%]
backend/tests/test_orders.py::test_get_order_timeline PASSED             [ 87%]
backend/tests/test_risk.py::test_order_risk_actual_delay PASSED          [ 91%]
backend/tests/test_risk.py::test_order_risk_quantity_inconsistency PASSED [ 95%]
backend/tests/test_risk.py::test_order_risk_missing_production_link PASSED [100%]

======================= 24 passed in 8.28s =======================
```

**Test Status:** **VERIFIED (24/24 passed)**

---

## 11. Remaining Blockers & Next Actions

### Blockers
- **Zero Technical Blockers**: The backend server is currently running on `http://127.0.0.1:8000`. All contracts, schemas, CORS settings, and cookies are aligned with the frontend.
- **External Services Note**:
  - Neon PostgreSQL connection: Currently running against verified local SQLite (`manufacturing.db`). When the user chooses to connect to Neon, setting `DATABASE_URL` in `backend/.env` is all that is required.
  - Domo Text Generation: Running with the deterministic fallback simulator. When the user provides `DOMO_TOKEN` in `backend/.env`, it will make live calls to Domo AI.

### Recommended Configuration Adjustment (Pending Approval)
To prevent confusion when frontend tools or automated checkers look for OpenAPI documentation at the standard root `/openapi.json`, we propose adding a route in `backend/app/main.py` that maps `GET /openapi.json` to the OpenAPI schema generator.
*(Per instructions, this change has not been applied and awaits approval).*

### Exact Next Steps for the User
1. **Start the Frontend Application**:
   In a separate terminal:
   ```cmd
   cd C:\Users\DELL 5430\Desktop\Frontend\frontend
   npm.cmd run dev
   ```
2. **Access the Application**:
   Open browser to `http://localhost:5173` and log in with:
   - **Email**: `admin@manufacturing.com`
   - **Password**: `AdminSecurePass123!`
   *(Or `demo@manufacturing.com` / `DemoSecurePass123!`)*
3. **Inspect Backend Documentation**:
   - Swagger UI: `http://localhost:8000/api/docs`
   - OpenAPI Schema: `http://localhost:8000/api/openapi.json`

