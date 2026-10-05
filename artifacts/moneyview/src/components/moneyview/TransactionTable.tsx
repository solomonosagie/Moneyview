import type {
  Transaction,
  TransactionFilters,
} from '@/types/moneyview';
import { formatDate, formatMoney } from '@/utils/format.js';
import { getCategoryLabel } from '@/utils/filters.js';

type SortField = NonNullable<TransactionFilters['sortBy']>;

const columns: { key: SortField; label: string }[] = [
  { key: 'description', label: 'Transaction' },
  { key: 'category', label: 'Category' },
  { key: 'date', label: 'Date' },
  { key: 'amount', label: 'Amount' },
];

function iconFor(transaction: Transaction) {
  if (transaction.type === 'in') return 'income-icon';
  const category = getCategoryLabel(transaction.category).toLowerCase();
  if (category === 'groceries') return 'groceries-icon';
  if (category === 'transport') return 'transport-icon';
  if (category === 'transfer') return 'transfer-icon';
  if (category === 'utilities') return 'utilities-icon';
  return 'merchant-icon-neutral';
}

export function TransactionTable({
  transactions,
  sortBy = 'date',
  sortDirection = 'desc',
  onSort,
}: {
  transactions: Transaction[];
  sortBy?: SortField;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: SortField) => void;
}) {
  function renderColumnHeading(key: SortField, label: string) {
    if (!onSort) return label;
    const active = sortBy === key;
    const nextDirection =
      active && sortDirection === 'asc' ? 'descending' : 'ascending';

    return (
      <button
        className="mv-sort-button"
        type="button"
        onClick={() => onSort(key)}
        aria-label={`Sort by ${label.toLowerCase()}${active ? `, currently ${sortDirection === 'asc' ? 'ascending' : 'descending'}` : ''}`}
      >
        {label}
        <span className="mv-sort-mark" aria-hidden="true">
          {active ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
        </span>
        <span className="sr-only">
          {active ? `Activate ${nextDirection} order` : 'Activate sorting'}
        </span>
      </button>
    );
  }

  return (
    <div className="mv-table-scroll">
      <table className="transaction-table mv-data-table">
        <caption className="sr-only">
          Sample transactions with category, date, and amount direction.
        </caption>
        <thead>
          <tr>
            {columns.map(({ key, label }) => (
              <th
                key={key}
                scope="col"
                aria-sort={
                  onSort && sortBy === key
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {renderColumnHeading(key, label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const incoming = transaction.type === 'in';
            return (
              <tr
                key={transaction.id}
                id={`transaction-${transaction.id}`}
                data-transaction-id={transaction.id}
              >
                <td>
                  <div className="transaction-name-cell">
                    <span
                      className={`merchant-icon ${iconFor(transaction)}`}
                      aria-hidden="true"
                    >
                      <span />
                    </span>
                    <span className="transaction-copy">
                      <strong>{transaction.description || 'Untitled transaction'}</strong>
                      <small>{incoming ? 'Money in' : 'Money out'}</small>
                    </span>
                  </div>
                </td>
                <td>
                  <span className="category-label">
                    {getCategoryLabel(transaction.category)}
                  </span>
                </td>
                <td className="mv-date-cell">{formatDate(transaction.date)}</td>
                <td className="transaction-amount">
                  <span className={`direction-tag ${incoming ? 'direction-in' : 'direction-out'}`}>
                    {incoming ? 'Money in' : 'Money out'}
                  </span>
                  <strong>
                    {incoming ? '+' : '−'}
                    {formatMoney(transaction.amount)}
                  </strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
