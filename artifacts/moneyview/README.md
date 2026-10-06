# MoneyView

MoneyView is a Nigerian personal-finance dashboard for viewing account balances and transactions in naira, with search, filters, sorting, entry creation, and spending insights.

The app uses local records and does not connect to a bank or process payments.

## Development workflows

Use the configured MoneyView workflows:

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

Vite requires `PORT` and `BASE_PATH` to load its configuration; the development workflow supplies them.

## Pages

- `/` — account overview and recent transactions
- `/transactions` — searchable, filterable, sortable transaction history
- `/add` — validated form for creating a transaction
- `/insights` — monthly outgoing spend by category

The earlier static dashboard milestone is retained at `static-dashboard.html`; its original styling and JavaScript remain under `src/`.
