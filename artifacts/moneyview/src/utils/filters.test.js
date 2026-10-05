import { describe, expect, it } from 'vitest';
import { filterTransactions, getCategoryLabel } from './filters.js';

const transactions = [
  {
    id: 'first',
    date: '2026-09-01',
    description: 'Olive Market',
    category: 'Groceries',
    amount: 500,
    type: 'out',
  },
  {
    id: 'second',
    date: '2026-10-02',
    description: 'CityHop',
    category: 'Transport',
    amount: 1200,
    type: 'out',
  },
  {
    id: 'third',
    date: '2026-10-02',
    description: 'Transfer from Bisi',
    category: 'Transfer',
    amount: 5000,
    type: 'in',
  },
];

describe('filterTransactions', () => {
  it('searches descriptions and categories without mutating the source', () => {
    const original = [...transactions];
    expect(filterTransactions(transactions, { search: 'olive' })).toHaveLength(1);
    expect(filterTransactions(transactions, { search: 'transport' })[0].id).toBe(
      'second',
    );
    expect(transactions).toEqual(original);
  });

  it('filters by category and an inclusive date range', () => {
    expect(
      filterTransactions(transactions, {
        category: 'Transport',
        dateFrom: '2026-10-02',
        dateTo: '2026-10-02',
      }).map((transaction) => transaction.id),
    ).toEqual(['second']);
  });

  it('sorts by amount in either direction and handles empty input', () => {
    expect(
      filterTransactions(transactions, {
        sortBy: 'amount',
        sortDirection: 'desc',
      }).map((transaction) => transaction.id),
    ).toEqual(['third', 'second', 'first']);
    expect(
      filterTransactions(transactions, {
        sortBy: 'amount',
        sortDirection: 'asc',
      }).map((transaction) => transaction.id),
    ).toEqual(['first', 'second', 'third']);
    expect(filterTransactions([], {})).toEqual([]);
    expect(filterTransactions(undefined, {})).toEqual([]);
  });

  it('puts missing dates outside an active range and handles awkward fields', () => {
    const awkward = [
      { id: 'missing', date: '', description: null, category: '  ', amount: 0 },
      { id: 'valid', date: '2026-10-01', description: 'Shop', category: null },
    ];
    expect(
      filterTransactions(awkward, { dateFrom: '2026-10-01' }).map(
        (transaction) => transaction.id,
      ),
    ).toEqual(['valid']);
    expect(
      filterTransactions(awkward, { category: 'uncategorised' }).map(
        (transaction) => transaction.id,
      ),
    ).toEqual(['missing', 'valid']);
    expect(getCategoryLabel('   ')).toBe('Uncategorised');
  });
});
