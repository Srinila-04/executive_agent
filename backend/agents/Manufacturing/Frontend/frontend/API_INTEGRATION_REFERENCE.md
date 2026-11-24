# API integration reference

This reference reflects source inspection of the FastAPI backend and limited live testing against a local running backend. Login, dashboard, order list/detail/timeline, conversations/chat, and inventory routes were exercised during the integration test. Not every route or error condition was tested; see [FRONTEND_BACKEND_INTEGRATION_TEST_REPORT.md](./FRONTEND_BACKEND_INTEGRATION_TEST_REPORT.md) for verified scope and remaining issues.

## Configuration and authentication

- Base URL: backend origin, for example `http://localhost:8000`; set `VITE_API_BASE_URL` in `.env`. Route paths below include the `/api` prefix.
- Authenticated requests use `Authorization: Bearer <access_token>`. The frontend stores the access token only in a module variable.
- Requests use `withCredentials: true`. The backend refresh cookie is named `refresh_token`, is HttpOnly, and is scoped to `/api/auth`. Cookie security and SameSite attributes depend on backend settings.
- Login also returns a refresh token in JSON, but the frontend intentionally does not store it. Refresh calls rely on the HttpOnly cookie.
- CORS must allow the exact frontend origin and credentials.
- There is no public registration endpoint.
- The app restores sessions on load through `/api/auth/refresh` using the HttpOnly cookie. Expired access tokens share one refresh request; failed refresh clears the in-memory access token.

### Authentication endpoints

| Method and path | Request | Response / behavior | Authentication |
|---|---|---|---|
| `POST /api/auth/login` | `{ "email": "<email>", "password": "<password>" }`; email is validated and password has a minimum length of 6 | `{ "access_token": "...", "token_type": "Bearer", "expires_in": <seconds>, "refresh_token": "...", "user": { "id", "email", "full_name", "role", "is_active", "created_at" } }`; sets/rotates the refresh cookie | Public |
| `POST /api/auth/refresh` | Optional `{ "refresh_token": "..." }`; cookie is preferred by the frontend | New access token and rotated refresh credentials/cookie | Refresh cookie or optional body token |
| `POST /api/auth/logout` | Optional refresh token body; frontend sends no body and includes cookies | Clears/revokes refresh session | Bearer access token |
| `GET /api/auth/me` | None | Current user: `{ "id", "email", "full_name", "role", "is_active", "created_at" }` | Bearer access token |

## Dashboard and orders

| Method and path | Query/request | Response structure | Authentication |
|---|---|---|---|
| `GET /api/dashboard/summary` | None | Summary object includes `total_orders`, `open_orders`, `in_production_orders`, `partially_shipped_orders`, `delivered_orders`, `delayed_orders_count`, `potential_delay_count`, `unknown_risk_count`, INR totals, `on_time_delivery_rate_pct`, and `data_quality_missing_po_count` | Bearer |
| `GET /api/dashboard/order-status` | None | Array of `{ "status", "count", "percentage", "total_qty", "total_value_inr" }` | Bearer |
| `GET /api/dashboard/at-risk` | `page` (default 1), `page_size` (default 20), optional `risk_category` | `{ "total_at_risk", "actual_delayed", "potential_delayed", "unknown_risk", "items": [...] }`. Each item carries order/customer/product/status/priority/delivery/quantity fields and `risk: { "risk_level", "category", "reasons": [...], "warnings": [...] }` | Bearer |
| `GET /api/orders` | `page`, `page_size` (maximum 100), optional `status`, `customer_id`, `product_id`, `priority`, `start_date`, `end_date`, `sort_by`, `sort_order` (`asc` or `desc`) | `{ "items": [CustomerOrderListItem], "total", "page", "page_size", "total_pages" }`. List items include `customer_order_id`, `customer_id`, `customer_name`, `product_id`, `product_name`, `order_date`, requested/confirmed delivery dates, `order_qty`, `shipped_qty`, price/value, `order_status`, `priority`, `channel`, and calculated `risk` | Bearer |
| `GET /api/orders/{order_id}` | Order ID path parameter | Customer order detail: list-item fields plus linked `customer`, `product`, `shipments[]`, `production_orders[]`, and `data_quality_warnings[]` | Bearer |
| `GET /api/orders/{order_id}/timeline` | Order ID path parameter | `{ "customer_order_id", "events": [...], "total_events" }`; events include `event_type`, `event_title`, `timestamp`, `description`, `status`, `source_table`, and `metadata` | Bearer |

The order list has no free-text search, risk, quality-release, or production-link filter. Those client-side filters and text search apply only to the currently loaded server page. Order status is a source field; risk, quality release, and production-link type are separate backend fields.

The order detail response contains only actual linked production and shipment records. Quality inspections are represented by `QUALITY_CHECK` events in the order timeline, not a standalone top-level inspection collection. Missing links are shown as unavailable/not linked.

### Dashboard mapping and mock-data boundary

- Weekly trends use `GET /api/dashboard/trends`, which returns a `trends` array with `week_label`, `total_orders`, and `delivered_orders`.
- Summary, order statuses, risk items, recent orders, and weekly trends use backend endpoints.
- The frontend does not contain mock order/dashboard modules or network-failure data fallbacks.
- Dashboard metrics and AI answers do not have successful mock fallbacks.

### Operational workflows

| Method and path | Request / response | Role boundary |
|---|---|---|
| `GET /api/orders/overdue` | Paginated overdue order alerts with days overdue and quality release state | Operator, manager, admin |
| `GET /api/orders/{order_id}/atp-ctp` | ATP material availability and CTP production capacity | Operator, manager, admin |
| `GET /api/orders/{order_id}/promise-recommendation` | Backend-computed promise date, conflicts, and explanations | Operator, manager, admin |
| `POST /api/orders/{order_id}/commitment-proposals` | Creates a pending proposal; backend calculates the recommended date when omitted | Operator, manager, admin |
| `GET /api/orders/{order_id}/status-draft` | Customer status draft generated from backend order facts | Operator, manager, admin |
| `GET /api/orders/{order_id}/escalation-pack` | Risk, ATP shortages, quality holds, shipment delays, and actions | Operator, manager, admin |
| `GET /api/commitment-proposals?status=PENDING` | Pending proposals for the Approvals page | Operator, manager, admin |
| `POST /api/commitment-proposals/{proposal_id}/approve` or `/reject` | Optional `{ "decision_note": "..." }`; decision is recorded server-side | Manager, admin |
| `GET /api/allocation/proposal` | Rule-ranked allocation, optionally filtered by `product_id` | Operator, manager, admin |
| `GET /api/kpis` | Six backend KPI groups, including backlog ageing | Operator, manager, admin |
| `GET /api/dashboard/delivery-performance` | Delivery performance by customer and carrier | Operator, manager, admin |

## Assistant and conversations

| Method and path | Request | Response structure | Authentication |
|---|---|---|---|
| `POST /api/agent/chat` | `{ "message": "...", "conversation_id": "<optional id>" }` | `{ "conversation_id", "answer", "steps": [{ "tool", "input", "output" }], "message_id", "created_at" }` | Bearer |
| `GET /api/conversations` | None | Conversation records with `id`, `user_id`, `title`, `created_at`, `updated_at`, `message_count` | Bearer |
| `GET /api/conversations/{conversation_id}/messages` | Conversation ID path parameter | Message records with `id`, `conversation_id`, `role`, `content`, `steps`, `created_at` | Bearer |

The assistant displays backend `answer` and `steps`. It does not simulate an answer when the service is unreachable. Conversation lists/messages accept either a direct list or an `{ "items": [...] }` list envelope; any other shape is surfaced as a schema error.

## Inventory

| Method and path | Query/request | Response |
|---|---|---|
| `GET /api/inventory/materials` | `page`, `page_size`, optional `plant_id`, `material_id`, `warehouse_id`, `status`, `sort_by`, `sort_order` | Paginated inventory records |
| `GET /api/inventory/materials/{material_id}/summary` | Material ID path parameter | Material totals, plants/warehouses, and latest snapshot date |

These inventory routes were found in the backend. The initial frontend does not yet include a live inventory view.

## Errors and unavailable routes

The backend error envelope is:

- HTTP errors: `{ "success": false, "error": "<detail>", "code": "HTTP_<status>", "request_id": "..." }`
- Validation errors (422): `{ "success": false, "error": "Validation failed on request parameters or body.", "code": "VALIDATION_ERROR", "details": [...], "request_id": "..." }`
- Unhandled server errors (500): `{ "success": false, "error": "An internal server error occurred. Please contact system support.", "code": "INTERNAL_SERVER_ERROR", "request_id": "..." }`
- The request identifier is also returned in `X-Request-ID`.

The frontend uses the backend `error` field for user-visible API errors and does not treat HTTP or schema failures as success.

No corresponding backend routes were found for order tracking, production, shipments, quality, or settings in the inspected app. Their sidebar pages therefore show unavailable/coming-soon messaging and do not call invented endpoints. Do not expose Domo credentials in frontend environment variables or code.
