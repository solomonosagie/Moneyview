import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { EmptyState, ErrorState, LoadingState } from '@/components/RemoteState';
import { PageHeading } from '@/components/moneyview/PageHeading';
import { useFetch } from '@/hooks/useFetch.js';
import { getTransactions } from '@/services/api.js';
import type { CategorySpend, Transaction } from '@/types/moneyview';
import { spendByCategory } from '@/utils/insights.js';
import { formatCompactMoney, formatMoney } from '@/utils/format.js';

function monthLabel(month: string) {
  return new Intl.DateTimeFormat('en-NG', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${month}-01T00:00:00Z`));
}

function previousMonth(month: string) {
  const [year, monthNumber] = month.split('-').map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 2, 1));
  return date.toISOString().slice(0, 7);
}

function totalSpend(items: CategorySpend[]) {
  return items.reduce((total, item) => total + item.amount, 0);
}

function SpendChart({ data, title }: { data: CategorySpend[]; title: string }) {
  return (
    <div
      className="mv-chart-wrap"
      role="img"
      aria-label={`${title}. Categories are listed vertically and naira spending is measured from zero horizontally.`}
      style={{ height: `${Math.max(280, data.length * 42)}px` }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 18, bottom: 28, left: 16 }}
          barCategoryGap={12}
        >
          <CartesianGrid horizontal={false} stroke="#e5ece6" />
          <XAxis
            type="number"
            dataKey="amount"
            domain={[0, 'auto']}
            allowDecimals={false}
            tickFormatter={(value: number) => formatCompactMoney(Number(value))}
            tick={{ fill: '#788b88', fontSize: 11 }}
            axisLine={{ stroke: '#d7e2d8' }}
            tickLine={{ stroke: '#d7e2d8' }}
            label={{
              value: 'Amount (NGN)',
              position: 'insideBottom',
              offset: -18,
              fill: '#667b74',
              fontSize: 11,
            }}
          />
          <YAxis
            type="category"
            dataKey="category"
            width={106}
            tick={{ fill: '#426061', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: 'Category',
              angle: -90,
              position: 'insideLeft',
              fill: '#667b74',
              fontSize: 11,
            }}
          />
          <Tooltip
            formatter={(value) => formatMoney(Number(value ?? 0))}
            contentStyle={{
              border: '1px solid #e0e9e1',
              borderRadius: 10,
              boxShadow: '0 10px 24px rgba(27, 68, 63, 0.10)',
            }}
          />
          <Bar dataKey="amount" fill="#32756c" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function InsightsPage() {
  const transactionsQuery = useFetch<Transaction[]>(getTransactions);
  const transactions = transactionsQuery.data ?? [];
  const availableMonths = useMemo(
    () =>
      [...new Set(
        transactions
          .map((transaction) => transaction.date)
          .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date ?? ''))
          .map((date) => date.slice(0, 7)),
      )].sort((left, right) => right.localeCompare(left)),
    [transactions],
  );
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    if (
      availableMonths.length > 0 &&
      (!selectedMonth || !availableMonths.includes(selectedMonth))
    ) {
      setSelectedMonth(availableMonths[0]);
    }
  }, [availableMonths, selectedMonth]);

  const spending = useMemo(
    () => spendByCategory(transactions, selectedMonth),
    [transactions, selectedMonth],
  );
  const previousPeriod = previousMonth(selectedMonth || '2026-10');
  const previousSpending = useMemo(
    () => spendByCategory(transactions, previousPeriod),
    [transactions, previousPeriod],
  );
  const currentTotal = totalSpend(spending);
  const previousTotal = totalSpend(previousSpending);
  const difference = currentTotal - previousTotal;
  const percentChange =
    previousTotal > 0 ? (Math.abs(difference) / previousTotal) * 100 : undefined;
  const topCategories = spending.slice(0, 3);
  const chartTitle = selectedMonth
    ? `Spending by category for ${monthLabel(selectedMonth)}`
    : 'Spending by category';

  return (
    <div className="mv-content" data-testid="insights-page">
      <PageHeading
        eyebrow="PATTERNS IN YOUR SAMPLE DATA"
        title="Insights"
        description="See how fictional outgoing transactions group by category over time."
      />

      {transactionsQuery.isLoading ? (
        <LoadingState label="Loading spending insights…" />
      ) : transactionsQuery.error ? (
        <ErrorState
          message="We could not load spending insights right now."
          onRetry={transactionsQuery.refetch}
        />
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No sample transactions yet"
          description="Add a fictional transaction to start exploring monthly spending."
        />
      ) : (
        <>
          <div className="mv-insights-toolbar">
            <div>
              <label htmlFor="insights-month">Choose a month</label>
              <select
                id="insights-month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              >
                {availableMonths.map((month) => (
                  <option value={month} key={month}>
                    {monthLabel(month)}
                  </option>
                ))}
              </select>
            </div>
            <p>Only money-out transactions are included in spending totals.</p>
          </div>

          <section className="mv-metric-grid" aria-label="Monthly spending summary">
            <article className="mv-metric-card mv-metric-card-featured">
              <p className="card-kicker">TOTAL SPENDING</p>
              <h2>{formatMoney(currentTotal)}</h2>
              <p>{selectedMonth ? monthLabel(selectedMonth) : 'Selected month'}</p>
            </article>
            <article className="mv-metric-card">
              <p className="card-kicker">PREVIOUS MONTH</p>
              <h2>{formatMoney(previousTotal)}</h2>
              <p>{monthLabel(previousPeriod)}</p>
            </article>
            <article className="mv-metric-card">
              <p className="card-kicker">MONTH-TO-MONTH CHANGE</p>
              {previousTotal === 0 ? (
                <h2 className="mv-metric-change">—</h2>
              ) : (
                <h2 className="mv-metric-change">
                  {difference > 0 ? '+' : difference < 0 ? '−' : ''}
                  {formatMoney(Math.abs(difference))}
                </h2>
              )}
              <p>
                {previousTotal === 0
                  ? currentTotal === 0
                    ? 'No spending in either month'
                    : 'No previous-month spending to compare'
                  : `${difference > 0 ? 'Up' : difference < 0 ? 'Down' : 'Unchanged'} ${percentChange?.toFixed(1)}% from the previous month`}
              </p>
            </article>
          </section>

          <div className="mv-insight-columns">
            <section className="mv-chart-panel" aria-labelledby="spending-chart-heading">
              <div className="mv-section-header">
                <div>
                  <p className="card-kicker">CATEGORY BREAKDOWN</p>
                  <h2 id="spending-chart-heading">{chartTitle}</h2>
                  <p className="section-subtitle">
                    Naira amounts start at zero and are sorted from highest to lowest.
                  </p>
                </div>
              </div>
              {spending.length === 0 ? (
                <EmptyState
                  title="No spending recorded this month"
                  description="Money-in transactions do not count as spending. Choose another month to compare."
                />
              ) : (
                <>
                  <SpendChart data={spending} title={chartTitle} />
                  <table className="sr-only">
                    <caption>{chartTitle}</caption>
                    <thead>
                      <tr>
                        <th scope="col">Category</th>
                        <th scope="col">Amount spent in naira</th>
                        <th scope="col">Share of spending</th>
                      </tr>
                    </thead>
                    <tbody>
                      {spending.map((entry) => (
                        <tr key={entry.category}>
                          <th scope="row">{entry.category}</th>
                          <td>{formatMoney(entry.amount)}</td>
                          <td>{(entry.share * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </section>

            <section className="mv-top-categories" aria-labelledby="top-categories-heading">
              <div className="mv-section-header">
                <div>
                  <p className="card-kicker">THE BIGGEST CATEGORIES</p>
                  <h2 id="top-categories-heading">Top three</h2>
                </div>
              </div>
              {topCategories.length === 0 ? (
                <p className="mv-no-top-categories">
                  There are no spending categories to rank for this month.
                </p>
              ) : (
                <ol className="mv-category-rankings">
                  {topCategories.map((entry, index) => (
                    <li key={entry.category}>
                      <div className="mv-ranking-heading">
                        <span className="mv-ranking-number" aria-hidden="true">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <strong>{entry.category}</strong>
                        <span>{formatMoney(entry.amount)}</span>
                      </div>
                      <div
                        className="mv-share-track"
                        role="img"
                        aria-label={`${entry.category}: ${(entry.share * 100).toFixed(1)} percent of total spending`}
                      >
                        <span style={{ width: `${Math.max(entry.share * 100, 1)}%` }} />
                      </div>
                      <p>{(entry.share * 100).toFixed(1)}% of total spending</p>
                    </li>
                  ))}
                </ol>
              )}
              <p className="mv-top-note">
                {spending.length} {spending.length === 1 ? 'category' : 'categories'}{' '}
                with spending this month.
              </p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
