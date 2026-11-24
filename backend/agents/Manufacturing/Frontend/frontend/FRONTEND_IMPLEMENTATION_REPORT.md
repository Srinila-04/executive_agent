# Frontend implementation report

## 1. Project structure

```text
frontend/
  src/
    api/                 Axios, authentication, dashboard, orders, assistant APIs
    assets/              Reserved for local UI assets
    components/
      agent/             Tool execution trace
      common/            Buttons, inputs, select, card, badge, table, loader, states, modal
      dashboard/         Lazy-loaded Recharts visualizations
      layout/            Authenticated shell, sidebar, top navigation
      orders/             Reusable order table
    context/             Authentication state
    hooks/               Debounced value hook
    pages/               Dashboard, orders, order detail, login, assistant, operational workflows
    routes/              Protected route
    utils/               Formatting, API errors, and role permissions
```

## 2. UI design system

The UI combines the references' compact navigation, clear dashboard hierarchy, timelines, and assistant context with a deep-purple/violet identity, white and pale-lavender surfaces, restrained orange risk accents, consistent rounded cards, subtle borders/shadows, and responsive layouts. The design is original rather than a literal copy of either image.

## 3. Reusable components

Created or wired shared `Button`, `Input`, `Select`, `Modal`, `Card`, `Badge`, `Loader`, `EmptyState`, `ErrorState`, and `DataTable` components. Layout, order status/risk badges, timeline, and assistant tool traces are reusable components as well.

## 4. Pages implemented

- Login with email/password validation, visibility toggle, loading/error handling, and no public registration.
- Dashboard with backend summary, order status, at-risk, recent-order, and weekly trend data.
- Orders with backend pagination, status/customer/product/priority/date filters, sorting, page-local search, risk, quality-release, and production-link filters, and CSV export.
- Order details with source order/customer/product data, linked shipments and production, timeline-based quality events, data-quality warnings, ATP/CTP, promise recommendation, status draft, and escalation pack.
- Assistant with conversation history, suggested questions, send/error states, and backend tool-step traces.
- Approvals, alerts, KPIs, and allocation pages connected to their backend endpoints, with role-limited actions and navigation.

## 5. Backend API compatibility

API modules use the inspected `/api/auth`, `/api/dashboard`, `/api/orders`, `/api/commitment-proposals`, `/api/allocation`, `/api/kpis`, `/api/agent`, and `/api/conversations` contracts. Inventory routes are also wired. See [API_INTEGRATION_REFERENCE.md](./API_INTEGRATION_REFERENCE.md) for request/response fields, auth, errors, and unavailable routes.

Local live connectivity has been verified for login, profile, dashboard, order list/detail/timeline, chat/conversation, and inventory API requests. Inventory data is not wired into the Inventory page, and the AI agent returned incorrect tool selections for some prompts. See [FRONTEND_BACKEND_INTEGRATION_TEST_REPORT.md](./FRONTEND_BACKEND_INTEGRATION_TEST_REPORT.md) for the full results.

## 6. Authentication status

Login, `GET /api/auth/me`, logout, bearer access-token attachment, credentialed requests, and cookie-based refresh are supported. The access token stays in a module variable; page reload restores the session through `/api/auth/refresh` and the HttpOnly refresh cookie. Actual login requires a valid backend user account.

## 7. Mock data

- Mock order/dashboard modules and successful mock fallbacks have been removed. API failures are surfaced through error states.

## 8. Build and test results

- `npm.cmd run build` — passed after the workflow and theme integration.
- `node --test src/utils/permissions.test.js` — passed (3 tests).
- No dedicated automated frontend test script is configured in `package.json`.
- Live backend and browser integration were not rerun for this implementation.

## 9. Known issues and limits

- Not all backend routes and error conditions have been exercised.
- Order search and risk/quality/link filters are client-side and limited to the currently loaded server page because the backend list route does not accept those filters.
- Some assistant queries receive incorrect or repeated tool responses from the backend agent; see the integration test report.
- Shipment status is unavailable in the order list schema; it is displayed as unavailable there.
- No production, shipment, tracking, quality, or settings API route was found for the corresponding sections.

## 10. Follow-up

Add broader tests for backend response schemas, workflow error states, and token refresh, and exercise the new workflows against a live backend before release.
