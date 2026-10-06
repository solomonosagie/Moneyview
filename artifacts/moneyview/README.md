# MoneyView

MoneyView is a fictional Nigerian retail-banking learning app. It displays sample account balances and transactions in naira, and lets you explore transaction search, filters, sorting, adding sample entries, and spending insights.

It does not connect to a bank or handle real accounts, personal financial data, authentication, or payments.

## Run in Replit

Use the managed MoneyView workflows:

- **web** serves the React app.
- **Mock API** serves the development-only JSON Server at `/moneyview-api`.

The mock API saves added transactions to `db.json`. The production artifact is static and does not include the mutable mock API.

## Check the app

Run these from the workspace root:

```sh
pnpm --filter @workspace/moneyview run typecheck
pnpm --filter @workspace/moneyview run test
```

The build command is:

```sh
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/moneyview run build
```

Vite requires `PORT` and `BASE_PATH` to load its configuration; Replit's managed web workflow supplies them during development.

## Pages

- `/` — sample account overview and recent transactions
- `/transactions` — searchable, filterable, sortable sample history
- `/add` — validated form for creating a fictional transaction
- `/insights` — monthly outgoing spend by category

The earlier static dashboard milestone is retained at `static-dashboard.html`; its original styling and JavaScript remain under `src/`.
