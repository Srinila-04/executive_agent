# Frontend–Backend Integration Test Report

> Historical baseline: this report covers the earlier frontend state. The Task 6 workflows and theme updates have not been re-exercised against a live backend.

**Test date:** 2026-11-11  
**Final readiness:** **PARTIALLY READY**

## 1. Test environment

- Frontend: Vite development server at `http://localhost:5173`
- Backend: local FastAPI/Uvicorn service on port `8000`
- Browser viewport checks: desktop `1440 × 900`, tablet `768 × 900`, mobile `390 × 844`
- Authentication: seeded local admin account; credentials intentionally omitted from this report
- Data: live responses from the running backend; no source order or inventory records were edited
- Frontend build and dependency audit are recorded below

The backend routes responded at the expected `/api/...` paths. Root `/docs` and `/openapi.json` returned 404, but authenticated application routes and login were exercised directly through the running service.

## 2. Pages and features tested

- Login, invalid credentials, profile lookup, protected-route redirect, access-token refresh, logout
- Dashboard KPIs, status chart data, risk list, recent orders, mock trend labeling
- Orders list, search, status/date filters, sorting, pagination, empty search state
- Order details for `CO-001234` and `CO-000005`
- Inventory API and the current Inventory page
- Assistant chat, tool trace display, persisted conversation list/history
- Desktop/tablet/mobile layout, mobile navigation, route navigation, browser refresh
- API request counts and browser console/network errors observed during these checks

## 3. Passed tests

### Authentication

- Admin login through the frontend succeeded and redirected to the dashboard. The backend returned an access token, admin role, and refresh cookie.
- Invalid credentials returned HTTP 401 and the UI displayed “Invalid email or password” without falsely reporting session expiration.
- `GET /api/auth/me` returned HTTP 200 with a user profile.
- A page reload restored the authenticated application. Replacing the access token with an invalid test value triggered refresh; the frontend replaced it and retained the protected Assistant page.
- Logout cleared the frontend access token, returned to `/login`, and a subsequent refresh attempt without a cookie returned HTTP 401.
- Opening `/orders` after logout redirected to `/login`.

### Dashboard

- Live backend data rendered: 1,500 total orders, 289 open, 317 delivered, and 1,496 at risk (1,489 actual delay, 5 potential delay, 2 unknown).
- The status chart showed the backend categories and counts, totaling 1,500 orders.
- At-risk orders and five recent order records rendered from API responses.
- The trend chart is visibly labeled **MOCK TREND DATA** and explains that no backend trend endpoint is available.
- The “In transit” KPI correctly showed unavailable because the backend order-status response did not report that status.

### Orders and details

- The initial order-list request first failed with 422 because blank date filters were sent. After the frontend fix, the list loaded 20 rows from 1,500 records without blank dates in the query.
- Selecting `DELIVERED` returned 317 records and all displayed rows had delivered status.
- Search found an exact currently loaded order ID after the debounce interval; a non-matching query displayed the empty state. The UI discloses that search only covers the current server page.
- A date range of 2026-10-25 returned 19 records without a validation error.
- Sorting by oldest date placed August records first. Pagination advanced from page 1 to page 2 (of 16 in the delivered-filter check).
- `CO-001234` displayed its returned customer and product, two timeline events, and explicit unavailable/not-linked shipment, production, and quality states.
- `CO-000005` displayed linked shipment `SHP-000183`, carrier, status, quantities, dates, and four source timeline events. It also showed the backend’s shipment/order quantity mismatch warning; no relationship was inferred by the UI.

### Inventory

- The authenticated raw-material inventory API returned HTTP 200, five records for the requested page, and a total of 6,624. Returned fields included material, plant, warehouse, lot, quantity, status, and cost fields.
- The current Inventory page did not mislabel data as finished-goods inventory; it displayed an explicit no-frontend-records-yet state.

### Assistant and conversation history

- The conversation list loaded existing backend conversations. Opening a conversation displayed stored user/assistant messages in order.
- A question about `CO-001234` produced a backend answer with a `get_order_delay_analysis` step. Expanding the trace displayed the tool name, input, and output.
- A fresh at-risk query used `list_at_risk_orders` and returned the backend risk summary.
- A shipment query for `CO-000005` returned a delay-analysis response with the linked `SHP-000183` transit-delay milestone. It was not a full shipment-detail response.
- A blank new conversation displayed the welcome/suggested-question state.
- While a message is in flight, the New conversation and conversation-selection controls are now disabled to prevent a pending response from being inserted into a different conversation.

### Browser and responsive behavior

- Desktop, tablet, and mobile layouts were checked at the viewport sizes above; none had horizontal document overflow.
- The mobile navigation opened and closed; navigation to Orders updated the URL and active navigation state.
- Refresh restored the signed-in route as expected.
- No uncaught JavaScript exception was observed. HTTP 401 console entries came from deliberate invalid-login, forced-expired-token, and post-logout checks. The earlier order-list 422 was resolved by the frontend change below.

## 4. Failed or partially passed tests

| Area | Result | Evidence |
|---|---|---|
| Risk filter on Orders | Not implemented | No risk filter control exists; backend order-list schema has no risk filter parameter. |
| Inventory page integration | Not implemented | The backend inventory endpoint returns data, but the frontend page is still a connected-data placeholder and makes no inventory request. |
| Assistant follow-ups in one conversation | Failed semantically | After the first `CO-001234` question, later risk, shipment, and customer-summary questions were persisted with the same `get_order_delay_analysis` input for `CO-001234` and repeated the same answer. |
| Customer order summary prompt | Failed semantically | A fresh “Summarize Digital Bazaar’s orders” conversation invoked `list_at_risk_orders` rather than a customer-order summary tool. |
| Shipment prompt | Partial | It returned a risk-analysis payload containing one shipment milestone rather than a dedicated/full shipment response. The order-details page itself displayed the linked shipment correctly. |
| Error/empty states | Partial coverage | Invalid login and empty order search were exercised. A deliberate dashboard outage and an AI-service outage were not induced; live services were available. |
| Production duplicate-request behavior | Not verified | The browser checks used Vite development mode only. |

These assistant mismatches were present in backend-persisted `steps` and message content retrieved from conversation history. The frontend displayed those responses as returned; no mock or fabricated AI answer was used. Backend changes were outside scope.

## 5. Issues discovered

1. **Blank order date query values caused HTTP 422.** The Orders page sent empty `start_date` and `end_date` values, which the backend validates as dates.
2. **Pending assistant responses could race with conversation switching.** The page allowed starting or selecting another conversation while a send was unresolved; a late response could then update the newly selected conversation.
3. **Order risk filter is absent.** Neither the current Orders UI nor the backend order-list endpoint supports it.
4. **Inventory backend data is not connected to the Inventory page.** The UI remains a placeholder despite a working raw-material endpoint.
5. **Agent tool selection/context can be incorrect.** Repeated follow-ups in one conversation reused the first order-analysis tool input, and a customer-summary question selected the at-risk tool.
6. **Development mode issues duplicate GETs.** Resource timing showed each of the four dashboard data routes twice after dashboard mount, and the initial Orders list route twice. This is consistent with the app’s `React.StrictMode` effect replay in Vite development; production behavior was not browser-tested.
7. **Backend data contains reported relationship/quantity gaps.** Detail pages surfaced the missing production/quality links and shipment mismatch for the tested orders rather than hiding them.

## 6. Fixes applied

- Updated `src/api/orders.api.js` to omit empty, null, and undefined query values. The date-filter requests then returned successfully.
- Disabled New conversation and existing conversation selection controls during an in-flight assistant response to prevent cross-conversation state races.
- No UI restyling, backend changes, or dataset changes were made.

## 7. Remaining limitations

- Add a real risk filter only after deciding whether it should be server-side or clearly page-local; the backend currently exposes no list risk filter.
- Wire the Inventory page to the existing raw-material API if it is in scope. Current page does not load records or offer filters/pagination.
- Backend agent behavior needs investigation for context carry-over and customer-summary tool selection.
- Order text search is local to the currently loaded server page because the backend has no text-search parameter.
- Dashboard trends remain mock data; shipment status remains unavailable in the order list schema.
- Dashboard/AI outage states and production-mode request behavior have not been verified.
- The local assistant tests created persisted test conversations/messages; no business order, shipment, inventory, or source dataset records were changed.

## 8. Screenshots and evidence

No screenshot files were saved. Evidence was collected from the live browser page snapshots, rendered DOM, and authenticated API responses during the test session:

- Dashboard: live KPI/status/risk/recent-order text and mock trend label.
- Orders: 422 response before the fix; successful list/date/status/search/pagination after it.
- Order details: returned relationship sections and data-quality warnings for `CO-001234` and `CO-000005`.
- Inventory API: HTTP 200, page size 5, total 6,624; UI placeholder remained visible.
- Assistant history: persisted message order and tool-step input/output, including the mismatched tool selections.
- Responsive checks: 1440, 768, and 390 CSS-pixel viewport widths with no horizontal overflow.

## 9. Final integration readiness

**PARTIALLY READY.** Authentication, dashboard, order listing/details, refresh/logout, and conversation persistence were exercised successfully against the local backend. The Orders request issue was fixed. The frontend is not fully integrated for Inventory, has no Orders risk filter, and the backend agent returned semantically incorrect tools/results for some prompts. Those remaining issues should be resolved and retested before describing the application as fully integrated.

Final validation: `npm.cmd run build` passed; `npm.cmd audit` reported zero vulnerabilities. The project has no dedicated automated frontend test script.
