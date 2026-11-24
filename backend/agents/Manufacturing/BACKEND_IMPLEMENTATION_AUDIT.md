# Customer Order Management Agent — Backend Implementation Audit

**Audit Date:** November 11, 2026  
**Auditor:** Senior Python Backend Architect  
**Scope:** Read-Only Backend Verification, Dataset Audit, Database Readiness, and Architecture Compliance  

---

## 1. Project Overview

The **Customer Order Management Agent** is an enterprise manufacturing backend application designed to:
- Track customer purchase orders from placement through manufacturing, quality inspection, and dispatch.
- Perform transparent, rule-based risk analysis distinguishing between actual delivery delays, potential delivery risks, and unknown risks stemming from unlinked records.
- Provide a conversational AI Agent powered by LangChain and the Domo AI Services Text Generation API (`domo.domo_ai.domogpt-small-v2.1:anthropic`) using a controlled ReAct JSON-action loop.
- Deliver high-performance REST APIs powered by FastAPI, SQLAlchemy 2.x, Alembic, and Pydantic v2.

---

## 2. Existing Folder Structure

```text
Manufacturing/
├── 20 use cases - Mapping tables list.docx
├── AI_Agent_Development_Setup_Guide.docx
├── Connecting to Neon DB with Python.docx
├── Manufacturing_Use_Case_Assignment_Tracker.xlsx
├── render.yaml                                    # Render Web Service deployment definition
├── data/
│   └── data/                                      # 36 manufacturing CSV datasets (read-only)
│       ├── dim_customer.csv
│       ├── dim_plant.csv
│       ├── dim_product.csv
│       ├── fact_customer_order.csv
│       ├── fact_production_order.csv
│       ├── fact_shipment_milestone.csv
│       ├── fact_quality_inspection.csv
│       └── fact_inventory_daily_snapshot.csv
└── backend/
    ├── alembic/
    │   ├── versions/
    │   │   └── bba26adb5eca_initial_schema.py     # Alembic baseline migration
    │   ├── env.py
    │   └── script.py.mako
    ├── app/
    │   ├── __init__.py
    │   ├── config.py                              # Pydantic BaseSettings environment config
    │   ├── database.py                            # SQLAlchemy 2.x engines (RW & RO) and session factories
    │   ├── main.py                                # FastAPI app, lifespans, CORS, GZip, middlewares
    │   ├── models/
    │   │   ├── __init__.py
    │   │   ├── base.py                            # Shared DeclarativeBase
    │   │   ├── business.py                        # 8 Business datasets with read-only mutation guards
    │   │   ├── auth.py                            # Users and RefreshTokens models
    │   │   └── chat.py                            # Conversations and Messages (with tool steps) models
    │   ├── schemas/
    │   │   ├── __init__.py
    │   │   ├── common.py                          # Pagination, Standard, Error DTOs
    │   │   ├── auth.py                            # LoginRequest, TokenResponse, UserResponse
    │   │   ├── order.py                           # CustomerOrderListItem, Detail, Timeline DTOs
    │   │   ├── dashboard.py                       # DashboardSummary, StatusCount, AtRiskSummary
    │   │   ├── inventory.py                       # MaterialInventoryItem, MaterialSummary
    │   │   └── chat.py                            # ToolStep, MessageResponse, ChatResponse
    │   ├── controllers/
    │   │   └── __init__.py
    │   ├── services/
    │   │   ├── __init__.py
    │   │   ├── auth_service.py                    # Argon2 hashing, JWT signing, token rotation
    │   │   ├── risk_service.py                    # Rule-based delay, milestone, & consistency analyzer
    │   │   ├── order_service.py                   # Order querying, details, and timeline builder
    │   │   ├── inventory_service.py               # Raw material availability calculations
    │   │   ├── dashboard_service.py               # Aggregate operational metrics & at-risk orders
    │   │   └── chat_service.py                    # Conversation manager & tool loop orchestrator
    │   ├── repositories/
    │   │   ├── __init__.py
    │   │   ├── order_repo.py                      # Eager pre-fetching (joinedload/selectinload)
    │   │   ├── inventory_repo.py                  # Snapshot and warehouse aggregation
    │   │   ├── dashboard_repo.py                  # Summary metrics and status distribution
    │   │   ├── user_repo.py                       # Credential queries
    │   │   └── chat_repo.py                       # Message and thread persistence
    │   ├── routes/
    │   │   ├── __init__.py
    │   │   ├── auth.py                            # /api/auth (login, refresh, logout, me)
    │   │   ├── dashboard.py                       # /api/dashboard (summary, order-status, at-risk)
    │   │   ├── orders.py                          # /api/orders (list, detail, timeline)
    │   │   ├── inventory.py                       # /api/inventory (materials list & summary)
    │   │   ├── conversations.py                   # /api/conversations (list & messages)
    │   │   └── agent.py                           # /api/agent/chat
    │   ├── middleware/
    │   │   ├── __init__.py
    │   │   ├── request_id.py                      # X-Request-ID propagation
    │   │   ├── security.py                        # Security headers (HSTS, CSP, X-Frame, X-Content-Type)
    │   │   ├── rate_limit.py                      # IP-based sliding-window rate limiter
    │   │   └── error_handler.py                   # Centralized error handler
    │   ├── agent/
    │   │   ├── __init__.py
    │   │   ├── domo_client.py                     # Custom LangChain LLM wrapper for Domo Text API
    │   │   ├── prompts.py                         # ReAct prompt templates
    │   │   ├── tools.py                           # 4 Approved read-only domain service tools
    │   │   └── agent_loop.py                      # Controlled JSON action loop
    │   └── scripts/
    │       ├── __init__.py
    │       └── seed.py                            # Idempotent bulk CSV importer & seeder
    ├── tests/
    │   ├── __init__.py
    │   ├── conftest.py                            # In-memory test isolation & auth fixtures
    │   ├── test_auth.py                           # Authentication, rotation, revocation
    │   ├── test_orders.py                         # Pagination, detail, timeline tests
    │   ├── test_dashboard.py                      # KPI summaries, distribution, at-risk filters
    │   ├── test_inventory.py                      # Material snapshots, net available qty
    │   ├── test_risk.py                           # Rule-based delay & consistency tests
    │   ├── test_agent.py                          # Tool execution & agent conversation tests
    │   └── test_import.py                         # Row counts & read-only enforcement tests
    ├── .env.example                               # Production and local environment template
    ├── alembic.ini                                # Alembic migration configuration
    ├── import_report.json                         # Complete dataset import & validation results
    ├── requirements.txt                           # Pinned production dependencies
    └── README.md                                  # Setup and deployment documentation
```

### Python Environment & Runtime
- **Python Version**: 3.12.10 (64-bit AMD64)
- **Active Interpreter**: `C:\Users\DELL 5430\AppData\Local\Programs\Python\Python312\python.exe`
- **Core Dependencies Verified**: `fastapi==0.162.0`, `uvicorn==0.54.0`, `sqlalchemy==2.1.8`, `alembic==1.20.1`, `psycopg==3.3.8`, `pydantic==2.14.2`, `pydantic-settings==2.16.2`, `pyjwt==2.15.1`, `argon2-cffi==25.1.0`, `langchain-core==1.7.7`, `httpx==0.28.1`, `email-validator==2.3.0`, `pandas==3.1.0`.

---

## 3. Dataset Inspection Results

The workspace supplies 36 CSV files in `data/data/`. The eight business datasets relevant to Customer Order Management Agent were identified, inspected, and verified:

| # | Dataset Description | Actual CSV Filename | Row Count | Primary Key | Foreign Keys / Linkages | Nullable Columns |
| :-: | :--- | :--- | :---: | :--- | :--- | :--- |
| 1 | **Customers** | `dim_customer.csv` | 4 | `customer_id` | None | None |
| 2 | **Products** | `dim_product.csv` | 3 | `product_id` | None | None |
| 3 | **Plants** | `dim_plant.csv` | 2 | `plant_id` | None | None |
| 4 | **Customer Orders** | `fact_customer_order.csv` | 1,500 | `customer_order_id` | `customer_id` -> `dim_customer`<br>`product_id` -> `dim_product` | None |
| 5 | **Production Orders** | `fact_production_order.csv` | 450 | `production_order_id` | `plant_id` -> `dim_plant`<br>`product_id` -> `dim_product` | `customer_order_id` (450 present, but IDs are unlinked) |
| 6 | **Inventory Snapshots** | `fact_inventory_daily_snapshot.csv` | 6,624 | Composite: `(snapshot_date, plant_id, material_id, warehouse_id, lot_id)` | `plant_id` -> `dim_plant` | `expiry_date` (5,888 nulls, raw materials) |
| 7 | **Quality Inspections** | `fact_quality_inspection.csv` | 16,000 | `inspection_id` | `plant_id` -> `dim_plant`<br>`product_id` -> `dim_product`<br>`production_order_id` -> `fact_production_order` | None |
| 8 | **Shipment Milestones** | `fact_shipment_milestone.csv` | 1,000 | `shipment_id` | `customer_order_id` -> `fact_customer_order`<br>`plant_id` -> `dim_plant` | `actual_delivery_ts` (for in-transit / delayed) |

### Key Dataset & Relational Findings
1. **Critical Relationship Finding (Production Orders)**:
   - In `fact_production_order.csv`, all 450 rows contain `customer_order_id` values ranging from `CO-10283` to `CO-10999`.
   - In `fact_customer_order.csv`, the IDs range from `CO-000001` to `CO-001500`.
   - **Intersection Count**: **0 matching customer orders**.
   - **Rule Compliance**: As required by the Critical Data Rules, no artificial linkages or synthetic IDs were invented. The system marks all 1,500 customer orders with an explicit data-quality warning: *"Missing production link: No production order linked to this customer order in manufacturing execution records."*
2. **Shipment Milestones Linkage**:
   - 100% of customer orders referenced in `fact_shipment_milestone.csv` exist in `fact_customer_order.csv`.
   - 733 distinct customer orders have shipment milestone tracking records.
3. **Inventory Nature**:
   - Snapshots represent raw materials (e.g., `MAT-SOC-001`, `MAT-ADH-018`), not finished goods.

---

## 4. Database Readiness

### Configuration Status
- **Dialect Support**: Configured via SQLAlchemy 2.x to support both **Neon PostgreSQL** and **SQLite**.
- **Neon PostgreSQL Support**: Supported via `DATABASE_URL=postgresql+psycopg://...`. Connection string normalization automatically converts `postgres://` and `postgresql://` to `postgresql+psycopg://` and injects production connection pool parameters (`pool_size=10`, `max_overflow=20`, `pool_recycle=300`, `pool_pre_ping=True`).
- **Local Fallback**: Defaults to `sqlite:///./manufacturing.db` when `DATABASE_URL` is unset, providing zero-configuration offline execution.
- **Neon Live Status**: The user's specific Neon project credentials have not yet been provided in `.env`. The database connection layer is verified and ready to connect immediately upon adding the Neon connection string to `.env`.
- **Migrations (Alembic)**: Initial migration revision `bba26adb5eca_initial_schema.py` is created and applies cleanly via `alembic upgrade head`.

### Database Tables Present in `manufacturing.db`
All 12 required tables exist:
- **Business Tables (8)**: `dim_customer`, `dim_product`, `dim_plant`, `fact_customer_order`, `fact_production_order`, `fact_inventory_daily_snapshot`, `fact_quality_inspection`, `fact_shipment_milestone`.
- **Application Tables (4)**: `users`, `refresh_tokens`, `conversations`, `messages`.
- **Migration Tracking**: `alembic_version`.

### Read-Only Enforcement
- Runtime mutation protection is enforced via SQLAlchemy event listeners (`before_update`, `before_delete`) in `app.models.business`. Application operations attempting to modify business tables trigger a `PermissionError`.

### Dataset Import Status
- Bulk import is complete and verified. All 25,583 business records are stored in the database.
- Seeding script `backend/app/scripts/seed.py` is idempotent and safe to re-run.

---

## 5. Requirements Status Table

| # | Requirement Area | Status | Verification / Implementation Summary |
| :-: | :--- | :---: | :--- |
| 1 | **Project Structure** | **COMPLETED** | Modular monolith with clean separation across `models`, `schemas`, `controllers`, `services`, `repositories`, `routes`, `middleware`, `agent`, `scripts`, and `tests`. |
| 2 | **Database Connection** | **COMPLETED** | Dialect-agnostic SQLAlchemy 2.x engine supporting Neon PostgreSQL (`postgresql+psycopg://`) and SQLite with connection pooling and separate read-only engine (`ro_engine`). |
| 3 | **SQLAlchemy Models** | **COMPLETED** | All 8 business models + 4 application models (`User`, `RefreshToken`, `Conversation`, `Message`) declared with appropriate indexes and relationships. |
| 4 | **Dataset Import** | **COMPLETED** | Safe, repeatable bulk import (`seed.py`) with duplicate protection. 25,583 rows imported with 0 rejected records. |
| 5 | **Data Integrity Validation** | **COMPLETED** | Generates `import_report.json`. Highlights production order mismatch as data-quality warning without fabricating synthetic links. |
| 6 | **Authentication** | **COMPLETED** | Argon2 password hashing, 15-minute JWT access tokens, opaque refresh tokens stored as SHA-256 hashes, rotation, revocation, and seeded users (`admin`, `demo`). No public registration. |
| 7 | **Security Middleware** | **COMPLETED** | CORS allowlist, security headers (HSTS, CSP, X-Frame, X-Content-Type), rate limiting (login: 10/min, AI: 30/min), `X-Request-ID` tracing, centralized error handling. |
| 8 | **Dashboard APIs** | **COMPLETED** | `GET /api/dashboard/summary`, `GET /api/dashboard/order-status`, `GET /api/dashboard/at-risk` with server-side aggregation and pagination. |
| 9 | **Order APIs** | **COMPLETED** | `GET /api/orders` (filtering, sorting, pagination, max page 100), `GET /api/orders/{id}`, `GET /api/orders/{id}/timeline` with chronological ordering. |
| 10 | **Order Risk Analysis** | **COMPLETED** | Transparent rule-based analyzer (`OrderRiskAnalyzer`) categorizing `ACTUAL_DELAY`, `POTENTIAL_DELAY`, `UNKNOWN_RISK`, `ON_SCHEDULE` with explicit reason lists and warnings. |
| 11 | **LangChain Integration** | **COMPLETED** | Custom `DomoTextLLM(LLM)` wrapper integrated with `langchain-core` prompt templates and output parsers. |
| 12 | **Domo Text Generation** | **COMPLETED** | Connects to Domo AI Services (`https://gwcteq-partner.domo.com/api/ai/v1/text/generation`) using `X-DOMO-Developer-Token`. Deterministic fallback simulator for offline development. |
| 13 | **Agent Tools** | **COMPLETED** | 4 Approved read-only domain tools: `get_order_status`, `list_at_risk_orders`, `get_customer_summary`, `get_order_delay_analysis`. Zero arbitrary model SQL execution. Tool traces captured. |
| 14 | **Unit and API Tests** | **COMPLETED** | 24 Automated tests covering authentication, order queries, dashboard KPIs, inventory calculations, risk evaluation, tool execution, import counts, and mutation guards. |
| 15 | **Deployment Configuration** | **COMPLETED** | `render.yaml` blueprint with build/start commands, environment variables, and comprehensive deployment documentation in `README.md`. |

---

## 6. Test Results

Automated test run executed via `python -m pytest backend/tests -v`:

```text
============================= test session starts =============================
platform win32 -- Python 3.12.10, pytest-9.2.0, pluggy-1.7.0
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

======================= 24 passed in 20.07s =======================
```

### Untested Scenarios (Requiring Live External Services)
- **Live Domo AI HTTP Round-Trip**: The Domo API call requires an active, paid Domo Developer Token from the customer's instance (`gwcteq-partner.domo.com`). The custom LLM fallback simulator was tested; live API HTTP handshake will run once the token is added to `.env`.
- **Live Neon SSL Connection**: Tested against local SQLite. Connection pooling parameters and the psycopg driver are installed and ready to connect to Neon PostgreSQL once the connection string is provided.

---

## 7. Missing Features & Gaps

There are **zero missing backend features** relative to the backend specifications. All specified APIs, auth mechanisms, risk analysis rules, data models, agent tools, and test suites are built and verified.

---

## 8. Blockers

There are currently **no technical blockers** preventing backend operation:
- The local server is running on `http://127.0.0.1:8000`.
- All 24 unit and API tests pass.
- Optional external credentials (Neon connection string and Domo Developer Token) can be added to `.env` whenever available without changing code.

---

## 9. Recommended Implementation Order

Now that the backend is fully built, tested, and audited, the recommended path forward is:

1. **Environment Configuration**: When ready for cloud deployment, set `DATABASE_URL` (Neon PostgreSQL) and `DOMO_TOKEN` in `backend/.env`.
2. **Frontend Architecture Alignment**: Design the React + Vite frontend matching the existing backend API contracts:
   - Authentication flow (JWT storage, refresh interceptor, HttpOnly cookies).
   - Dashboard views (KPI cards, order status chart, at-risk orders table).
   - Order management views (data table, search/filter, detail view, timeline component).
   - Raw materials inventory view.
   - AI Chat view (interactive message stream with expandable tool execution traces).
3. **Frontend Development**: Implement the React application connecting to the backend endpoints.

---

## 10. Exact Next Development Step

The single highest-priority next step is:
> **Review the audit results and decide whether to configure live external credentials (Neon PostgreSQL connection string and Domo AI developer token) or authorize starting Phase 8: Frontend Architecture & UI Development (React + Vite).**

