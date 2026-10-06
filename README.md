# MoneyView

MoneyView is a personal finance dashboard for Nigerian accounts. It displays balances and transactions in naira (₦) and includes monthly spending insights.

## Features

- See account balances and recent activity.
- Search, filter, and sort transactions.
- Add a transaction with a validated form.
- Review monthly spending by category.

## Data

The app uses local records in `artifacts/moneyview/db.json` and a JSON Server during development. It does not connect to banks, process payments, or use real customer data.

## Run locally

Install the workspace dependencies from the repository root:

```sh
pnpm install
```

Start the data service in one terminal:

```sh
pnpm --filter @workspace/moneyview run mock-api
```

Start the web app in a second terminal:

```sh
PORT=5173 BASE_PATH=/ VITE_API_BASE_URL=http://localhost:4000/moneyview-api \
  pnpm --filter @workspace/moneyview run dev
```

Then open `http://localhost:5173`.

## Checks

```sh
pnpm --filter @workspace/moneyview run typecheck
pnpm --filter @workspace/moneyview run test
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/moneyview run build
```

## Pages

- `/` — account overview and recent transactions
- `/transactions` — searchable and sortable transaction history
- `/add` — add a transaction
- `/insights` — monthly spending by category
