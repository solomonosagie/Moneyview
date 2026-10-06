import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState } from '@/components/RemoteState';
import { PageHeading } from '@/components/moneyview/PageHeading';
import { TransactionTable } from '@/components/moneyview/TransactionTable';
import { useFetch } from '@/hooks/useFetch.js';
import { getCategories, getTransactions } from '@/services/api.js';
import type {
  Transaction,
  TransactionFilters,
} from '@/types/moneyview';
import { filterTransactions } from '@/utils/filters.js';
import { formatMoney } from '@/utils/format.js';

type RouteNotice = {
  description?: string;
  amount?: number;
  type?: 'in' | 'out';
};

const defaultFilters: TransactionFilters = {
  search: '',
  category: '',
  dateFrom: '',
  dateTo: '',
  sortBy: 'date',
  sortDirection: 'desc',
};

export default function TransactionsPage() {
  const transactionsQuery = useFetch<Transaction[]>(getTransactions);
  const categoriesQuery = useFetch<string[]>(getCategories);
  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const location = useLocation();
  const notice = location.state as RouteNotice | null;
  const transactions = transactionsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const visibleTransactions = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters],
  );
  const hasActiveFilters = Boolean(
    filters.search ||
      filters.category ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.sortBy !== 'date' ||
      filters.sortDirection !== 'desc',
  );

  function updateFilter<K extends keyof TransactionFilters>(
    field: K,
    value: TransactionFilters[K],
  ) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function handleSort(field: NonNullable<TransactionFilters['sortBy']>) {
    setFilters((current) => ({
      ...current,
      sortBy: field,
      sortDirection:
        current.sortBy === field && current.sortDirection === 'asc'
          ? 'desc'
          : 'asc',
    }));
  }

  function clearFilters() {
    setFilters(defaultFilters);
  }

  return (
    <div className="mv-content" data-testid="transactions-page">
      <PageHeading
        eyebrow="YOUR ACTIVITY"
        title="Transactions"
        description="Search and review your transaction history."
        action={
          <Link className="button button-primary" to="/add">
            Add transaction
          </Link>
        }
      />

      {notice?.description ? (
        <div className="mv-success-notice" role="status">
          <span aria-hidden="true">✓</span>
          <p>
            Added <strong>{notice.description}</strong>
            {typeof notice.amount === 'number'
              ? ` · ${notice.type === 'in' ? '+' : '−'}${formatMoney(notice.amount)}`
              : ''}
            .
          </p>
        </div>
      ) : null}

      {transactionsQuery.isLoading || categoriesQuery.isLoading ? (
        <LoadingState label="Loading your transaction history…" />
      ) : transactionsQuery.error ? (
        <ErrorState
          message="We could not load your transactions right now."
          onRetry={transactionsQuery.refetch}
        />
      ) : categoriesQuery.error ? (
        <ErrorState
          message="We could not load transaction categories right now."
          onRetry={categoriesQuery.refetch}
        />
      ) : (
        <>
          <section className="mv-filter-panel" aria-label="Transaction filters">
            <div className="mv-filter-heading">
              <div>
                <h2>Find a transaction</h2>
                <p>Search by description or category, or narrow the date range.</p>
              </div>
              <button
                className="button button-secondary"
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
              >
                Clear filters
              </button>
            </div>

            <div className="mv-filter-grid">
              <div className="mv-field mv-search-field">
                <label htmlFor="transaction-search">Search transactions</label>
                <input
                  id="transaction-search"
                  type="search"
                  value={filters.search ?? ''}
                  onChange={(event) => updateFilter('search', event.target.value)}
                  placeholder="Try “groceries” or “CityHop”"
                />
              </div>
              <div className="mv-field">
                <label htmlFor="category-filter">Category</label>
                <select
                  id="category-filter"
                  value={filters.category ?? ''}
                  onChange={(event) => updateFilter('category', event.target.value)}
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option value={category} key={category}>
                      {category}
                    </option>
                  ))}
                  {transactions.some(
                    (transaction) =>
                      !transaction.category ||
                      transaction.category.trim() === '',
                  ) ? (
                    <option value="Uncategorised">Uncategorised</option>
                  ) : null}
                </select>
              </div>
              <div className="mv-field">
                <label htmlFor="date-from">From date</label>
                <input
                  id="date-from"
                  type="date"
                  value={filters.dateFrom ?? ''}
                  onChange={(event) => updateFilter('dateFrom', event.target.value)}
                />
              </div>
              <div className="mv-field">
                <label htmlFor="date-to">To date</label>
                <input
                  id="date-to"
                  type="date"
                  value={filters.dateTo ?? ''}
                  min={filters.dateFrom || undefined}
                  onChange={(event) => updateFilter('dateTo', event.target.value)}
                />
              </div>
            </div>
          </section>

          <section className="transactions-panel mv-results-panel" aria-labelledby="transaction-results-heading">
            <div className="transactions-heading">
              <div>
                <p className="card-kicker">TRANSACTION HISTORY</p>
                <h2 id="transaction-results-heading">All transactions</h2>
                <p className="section-subtitle" aria-live="polite">
                  Showing {visibleTransactions.length} of {transactions.length}{' '}
                  {transactions.length === 1 ? 'transaction' : 'transactions'}
                </p>
              </div>
              <span className="transaction-period">SORT BY ANY COLUMN</span>
            </div>

            {transactions.length === 0 ? (
              <EmptyState
                title="No transactions yet"
                description="Add a transaction to begin building your history."
                action={
                  <Link className="button button-secondary" to="/add">
                    Add transaction
                  </Link>
                }
              />
            ) : visibleTransactions.length === 0 ? (
              <EmptyState
                title="No matching transactions"
                description="Try a different search, category, or date range."
                action={
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <TransactionTable
                transactions={visibleTransactions}
                sortBy={filters.sortBy}
                sortDirection={filters.sortDirection}
                onSort={handleSort}
              />
            )}
          </section>
        </>
      )}
    </div>
  );
}
