import { getCategoryLabel } from './filters.js';

export function spendByCategory(transactions, month) {
  if (!Array.isArray(transactions) || !/^\d{4}-\d{2}$/.test(String(month))) {
    return [];
  }

  const totals = new Map();

  for (const transaction of transactions) {
    if (
      !transaction ||
      transaction.type !== 'out' ||
      typeof transaction.date !== 'string' ||
      transaction.date.slice(0, 7) !== month ||
      !Number.isFinite(transaction.amount) ||
      transaction.amount <= 0
    ) {
      continue;
    }

    const category = getCategoryLabel(transaction.category);
    const key = category.toLocaleLowerCase('en-NG');
    const previous = totals.get(key);
    totals.set(key, {
      category: previous?.category ?? category,
      amount: (previous?.amount ?? 0) + transaction.amount,
    });
  }

  const totalSpend = [...totals.values()].reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );

  return [...totals.values()]
    .map((entry) => ({
      ...entry,
      share: totalSpend > 0 ? entry.amount / totalSpend : 0,
    }))
    .sort(
      (left, right) =>
        right.amount - left.amount ||
        left.category.localeCompare(right.category, 'en-NG'),
    );
}
