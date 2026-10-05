import { describe, expect, it } from 'vitest';
import { formatCompactMoney, formatDate, formatMoney } from './format.js';

describe('formatMoney', () => {
  it('formats ordinary Nigerian naira values', () => {
    expect(formatMoney(1234.5)).toContain('1,234.50');
    expect(formatMoney(1234.5)).toMatch(/₦|NGN/);
  });

  it('formats zero and very large balances', () => {
    expect(formatMoney(0)).toContain('0.00');
    expect(formatMoney(9876543210.75)).toContain('9,876,543,210.75');
    expect(formatCompactMoney(9876543210)).toMatch(/₦|NGN/);
  });

  it('rejects invalid amounts instead of hiding them', () => {
    expect(() => formatMoney(Number.NaN)).toThrow('finite number');
    expect(() => formatMoney(Number.POSITIVE_INFINITY)).toThrow('finite number');
  });
});

describe('formatDate', () => {
  it('formats an ISO date without shifting its calendar day', () => {
    expect(formatDate('2026-10-05')).toMatch(/05/);
    expect(formatDate('2026-10-05')).toMatch(/Oct/i);
    expect(formatDate('2026-10-05')).toMatch(/2026/);
  });

  it('formats a Date instance and labels missing or malformed dates', () => {
    expect(formatDate(new Date('2026-08-02T00:00:00Z'))).toMatch(/2026/);
    expect(formatDate('')).toBe('Date unavailable');
    expect(formatDate('not-a-date')).toBe('Date unavailable');
    expect(formatDate(null)).toBe('Date unavailable');
  });
});
