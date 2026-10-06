# MoneyView

MoneyView is a Nigerian retail-banking dashboard that uses sample data and displays amounts in naira.

## Run & Operate

- Replit's managed `artifacts/moneyview: web` workflow runs the Vite app.
- Replit's managed `artifacts/moneyview: Mock API` workflow runs the development-only JSON Server.
- `pnpm --filter @workspace/moneyview run typecheck` — typecheck MoneyView.
- `pnpm --filter @workspace/moneyview run test` — run MoneyView's unit tests.
- `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/moneyview run build` — build the static frontend.
- The JSON Server reads and writes sample data in `artifacts/moneyview/db.json`.
- No secrets, database, bank connection, authentication, or payment service is needed.

## Stack

- pnpm workspaces, React, TypeScript, and Vite
- Development-only mock API: JSON Server
- Form validation: Zod and React Hook Form
- Charts: Recharts

## Where things live

- `artifacts/moneyview/src/pages/` — dashboard, transactions, add-entry, and insights pages.
- `artifacts/moneyview/src/services/api.js` — the single fetch boundary for the mock API.
- `artifacts/moneyview/src/utils/` — formatting, filtering, and spending calculations.
- `artifacts/moneyview/db.json` — sample accounts, categories, and transactions.
- `artifacts/moneyview/static-dashboard.html` — preserved static dashboard milestone.

## Architecture decisions

- Only the development workflow includes the mutable JSON Server; production serves static files.
- Transaction results are derived from the original fetched array and current filters.
- Keep account and transaction data as sample data and format money in NGN.

## Product

The app demonstrates sample balances, recent activity, transaction filtering and sorting, validated sample-entry creation, and month-by-month spending insights.

## User preferences

- Keep explanations and run instructions in plain English.
- Preserve the earlier static milestone files when changing the app.

## Gotchas

- API requests use the `/moneyview-api` service path in Replit; do not add a Vite proxy or make the mock API part of production.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
