import type { CategorySpend, Transaction } from '@/types/moneyview';

export function spendByCategory(
  transactions: Transaction[] | unknown,
  month: string,
): CategorySpend[];
