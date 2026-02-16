# Remix Inventory Dashboard (Assessment)

This project is a resilient inventory dashboard built with **React Router v7** and **Shopify Polaris**, designed to handle a legacy backend with high latency and frequent failures.

## Key Features

### 1. Zero-Latency Rendering (Streaming)
Instead of blocking the page load for the 3-second API call, I used **React Router Streaming**.
- The `loader` returns a raw promise (deferred data).
- The Page Shell renders immediately (0ms).
- A `<Suspense>` boundary displays a Polaris Skeleton while the data streams in.

### 2. Optimistic UI (Task 2 Implementation)
To make the "Claim One" action feel instant despite the 1-second API delay, I implemented **Optimistic UI**.

**Implementation Choice:**
Instead of using local state (`useState`), which can easily drift out of sync with the server, I derived the UI state directly from the pending form submission:
- I used `fetcher.formData` to check if a specific item is currently being modified.
- If a submission is in flight, the UI calculates `item.stock - 1` immediately.
- **Rollback Strategy:** If the server action fails, the `ErrorBoundary` catches it, and the UI automatically reverts to the reliable server state (Single Source of Truth).

### 3. Resilience & Error Boundaries (Task 3 Implementation)
The backend has a 20% failure rate. To prevent the entire application from crashing ("White Screen of Death"), I implemented a **Route-Level ErrorBoundary**.

**Implementation Choice:**
- **Containment:** The error is trapped within the route, keeping the main Layout and Header visible.
- **Recovery:** The "Retry" button uses `revalidator.revalidate()` to re-run the server loader without forcing a full browser page refresh.
- **UX Polish:** During the retry, the UI switches back to the Skeleton loader to indicate activity, rather than leaving the user staring at a stale error message.

## Tech Stack
- **Framework:** React Router v7 (Remix)
- **UI Library:** Shopify Polaris
- **Language:** TypeScript