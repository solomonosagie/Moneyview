import { Link } from 'react-router-dom';
import { AccountList } from '@/components/moneyview/AccountList';
import { PageHeading } from '@/components/moneyview/PageHeading';
import { TransactionTable } from '@/components/moneyview/TransactionTable';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/RemoteState';
import { useFetch } from '@/hooks/useFetch.js';
import { getAccounts, getTransactions } from '@/services/api.js';
import type { Account, Transaction } from '@/types/moneyview';
import { filterTransactions } from '@/utils/filters.js';
import { formatMoney } from '@/utils/format.js';

export default function DashboardPage() {
  const accountsQuery = useFetch<Account[]>(getAccounts);
  const transactionsQuery = useFetch<Transaction[]>(getTransactions);
  const accounts = accountsQuery.data ?? [];
  const transactions = transactionsQuery.data ?? [];
  // I add every account balance to get the total shown here.
  const totalBalance = accounts.reduce(
    (total, account) => total + account.balance,
    0,
  );
  const recentTransactions = filterTransactions(transactions, {
    sortBy: 'date',
    sortDirection: 'desc',
  }).slice(0, 5);
  const today = new Date();
  const todayLabel = new Intl.DateTimeFormat('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(today);

  return (
    <div className="mv-content" data-testid="dashboard-page">
      <PageHeading
        eyebrow="YOUR MONEY, AT A GLANCE"
        title={
          <>
            Good morning, <span className="mv-accent-name">Ada</span>
          </>
        }
        description="A clear view of your accounts and recent activity."
        action={
          <Link className="button button-primary" to="/add">
            Add transaction
          </Link>
        }
      />

      <section className="overview-grid" aria-label="Account overview">
        <article className="balance-card" aria-labelledby="total-balance-heading">
          <div className="balance-card-top">
            <div>
               <p className="card-kicker">TOTAL BALANCE</p>
              {accountsQuery.isLoading ? (
                <LoadingState label="Loading account balances…" />
              ) : accountsQuery.error ? (
                <ErrorState
                  message="We could not load your accounts right now."
                  onRetry={accountsQuery.refetch}
                />
              ) : accounts.length === 0 ? (
                <h2 id="total-balance-heading" data-testid="value-overall-balance">
                  {formatMoney(0)}
                </h2>
              ) : (
                <h2 id="total-balance-heading" data-testid="value-overall-balance">
                  {formatMoney(totalBalance)}
                </h2>
              )}
            </div>
            <span className="balance-stamp" aria-hidden="true">
              ₦
            </span>
          </div>
          <div className="balance-card-foot">
            <span>
              <span className="foot-marker" aria-hidden="true" />
              Across <span data-testid="balance-account-count">{accounts.length}</span>{' '}
              accounts
            </span>
            <span className="balance-foot-note">As of {todayLabel}</span>
          </div>
          <div className="balance-decoration" aria-hidden="true" />
        </article>

        <article className="accounts-panel" aria-labelledby="accounts-heading">
          <div className="section-heading compact-heading">
            <div>
                <p className="card-kicker">YOUR ACCOUNTS</p>
                <h2 id="accounts-heading">Accounts</h2>
            </div>
            <span className="account-count">{accounts.length}</span>
          </div>
          {accountsQuery.isLoading ? (
            <LoadingState label="Loading your accounts…" />
          ) : accountsQuery.error ? (
            <ErrorState
              message="We could not load your accounts right now."
              onRetry={accountsQuery.refetch}
            />
          ) : accounts.length === 0 ? (
            <EmptyState
              title="No accounts yet"
              description="Your accounts will appear here."
            />
          ) : (
            <AccountList accounts={accounts} />
          )}
        </article>
      </section>

      <section className="transactions-panel" aria-labelledby="recent-heading">
        <div className="transactions-heading">
          <div>
            <p className="card-kicker">THE LATEST</p>
            <h2 id="recent-heading">Recent transactions</h2>
            <p className="section-subtitle">
              Recent activity from Ada’s account.
            </p>
          </div>
          <Link className="text-link" to="/transactions">
            View all
          </Link>
        </div>
        {transactionsQuery.isLoading ? (
          <LoadingState label="Loading recent transactions…" />
        ) : transactionsQuery.error ? (
          <ErrorState
            message="We could not load your transactions right now."
            onRetry={transactionsQuery.refetch}
          />
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No transactions yet"
            description="Add a transaction to see it appear here."
            action={
              <Link className="button button-secondary" to="/add">
                Add the first transaction
              </Link>
            }
          />
        ) : (
          <>
            <TransactionTable transactions={recentTransactions} />
            <p className="transaction-footnote">
              Signs and labels show whether money came in or went out.
            </p>
          </>
        )}
      </section>

    </div>
  );
}
