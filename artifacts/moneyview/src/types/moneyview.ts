export interface Account {
  id: string;
  name: string;
  maskedNumber: string;
  balance: number;
  currency: 'NGN';
}

export type TransactionType = 'in' | 'out';

export interface Transaction {
  id: string | number;
  accountId: string;
  date: string;
  description: string;
  category?: string | null;
  amount: number;
  type: TransactionType;
}

export interface NewTransaction {
  accountId: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
}

export interface TransactionFilters {
  search?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'date' | 'description' | 'category' | 'amount';
  sortDirection?: 'asc' | 'desc';
}

export interface CategorySpend {
  category: string;
  amount: number;
  share: number;
}
