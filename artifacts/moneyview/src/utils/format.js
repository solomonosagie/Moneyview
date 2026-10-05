const moneyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactMoneyFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat('en-NG', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatMoney(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    throw new TypeError('Amount must be a finite number.');
  }
  return moneyFormatter.format(amount);
}

export function formatCompactMoney(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    throw new TypeError('Amount must be a finite number.');
  }
  return compactMoneyFormatter.format(amount);
}

export function formatDate(value) {
  const date =
    value instanceof Date
      ? value
      : new Date(`${String(value ?? '').slice(0, 10)}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return dateFormatter.format(date);
}
