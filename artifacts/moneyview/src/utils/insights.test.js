import { describe, expect, it } from 'vitest';
import { spendByCategory } from './insights.js';

describe('spendByCategory', () => {
  it('groups only outgoing transactions for the selected month, largest first', () => {
    const result = spendByCategory(
      [
        { date: '2026-10-01', type: 'out', category: 'Groceries', amount: 2000 },
        { date: '2026-10-02', type: 'out', category: 'groceries', amount: 1000 },
        { date: '2026-10-03', type: 'out', category: 'Transport', amount: 1500 },
        { date: '2026-10-03', type: 'in', category: 'Income', amount: 90000 },
        { date: '2026-09-30', type: 'out', category: 'Housing', amount: 50000 },
      ],
      '2026-10',
    );

    expect(result).toEqual([
      { category: 'Groceries', amount: 3000, share: 2 / 3 },
      { category: 'Transport', amount: 1500, share: 1 / 3 },
    ]);
  });

  it('returns an empty result for empty data, invalid months, and zero spend', () => {
    expect(spendByCategory([], '2026-10')).toEqual([]);
    expect(spendByCategory(undefined, '2026-10')).toEqual([]);
    expect(spendByCategory([{ date: '2026-10-01', type: 'out', amount: 0 }], '2026-10')).toEqual([]);
    expect(spendByCategory([{ date: '2026-10-01', type: 'out', amount: 10 }], 'October')).toEqual([]);
  });

  it('handles a single item, missing categories, and awkward amounts', () => {
    expect(
      spendByCategory(
        [
          { date: '2026-08-01', type: 'out', category: null, amount: 725 },
          { date: '2026-08-02', type: 'out', category: ' ', amount: -2 },
          { date: 'bad-date', type: 'out', category: 'Ignored', amount: 900 },
          { date: '2026-08-03', type: 'out', category: 'Ignored', amount: Number.NaN },
        ],
        '2026-08',
      ),
    ).toEqual([{ category: 'Uncategorised', amount: 725, share: 1 }]);
  });

  it('preserves large totals and calculates their shares', () => {
    const result = spendByCategory(
      [
        { date: '2026-09-01', type: 'out', category: 'Housing', amount: 250000000 },
        { date: '2026-09-02', type: 'out', category: 'Transport', amount: 50000000 },
      ],
      '2026-09',
    );
    expect(result[0].amount).toBe(250000000);
    expect(result[0].share).toBe(5 / 6);
  });
});
