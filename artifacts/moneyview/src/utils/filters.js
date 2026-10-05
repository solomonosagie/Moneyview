export function getCategoryLabel(category) {
  if (typeof category !== 'string' || category.trim() === '') {
    return 'Uncategorised';
  }
  return category.trim();
}

function compareValues(left, right, sortBy) {
  if (sortBy === 'amount') {
    const leftAmount = Number.isFinite(left.amount) ? left.amount : 0;
    const rightAmount = Number.isFinite(right.amount) ? right.amount : 0;
    return leftAmount - rightAmount;
  }

  const leftValue =
    sortBy === 'category'
      ? getCategoryLabel(left.category)
      : sortBy === 'description'
        ? String(left.description ?? '')
        : String(left.date ?? '');
  const rightValue =
    sortBy === 'category'
      ? getCategoryLabel(right.category)
      : sortBy === 'description'
        ? String(right.description ?? '')
        : String(right.date ?? '');

  return leftValue.localeCompare(rightValue, 'en-NG', {
    numeric: true,
    sensitivity: 'base',
  });
}

export function filterTransactions(transactions, filters = {}) {
  if (!Array.isArray(transactions)) {
    return [];
  }

  const search = String(filters.search ?? '').trim().toLocaleLowerCase('en-NG');
  const selectedCategory = String(filters.category ?? '')
    .trim()
    .toLocaleLowerCase('en-NG');
  const dateFrom = String(filters.dateFrom ?? '');
  const dateTo = String(filters.dateTo ?? '');
  const sortBy = filters.sortBy ?? 'date';
  const direction = filters.sortDirection === 'asc' ? 1 : -1;

  return transactions
    .map((transaction, index) => ({ transaction, index }))
    .filter(({ transaction }) => {
      if (!transaction || typeof transaction !== 'object') {
        return false;
      }

      const category = getCategoryLabel(transaction.category);
      const description = String(transaction.description ?? '');
      const matchesSearch =
        !search ||
        `${description} ${category}`.toLocaleLowerCase('en-NG').includes(search);
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === 'all' ||
        category.toLocaleLowerCase('en-NG') === selectedCategory;
      const date = String(transaction.date ?? '');
      const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
      const matchesFrom = !dateFrom || (validDate && date >= dateFrom);
      const matchesTo = !dateTo || (validDate && date <= dateTo);

      return matchesSearch && matchesCategory && matchesFrom && matchesTo;
    })
    .sort((left, right) => {
      const comparison = compareValues(
        left.transaction,
        right.transaction,
        sortBy,
      );
      if (comparison !== 0) {
        return comparison * direction;
      }
      return (left.index - right.index) * direction;
    })
    .map(({ transaction }) => transaction);
}
