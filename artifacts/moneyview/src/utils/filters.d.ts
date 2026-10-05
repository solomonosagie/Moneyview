import type { Transaction, TransactionFilters } from '@/types/moneyview';

export function getCategoryLabel(category: unknown): string;
export function filterTransactions(
  transactions: Transaction[] | unknown,
  filters?: TransactionFilters,
): Transaction[];
