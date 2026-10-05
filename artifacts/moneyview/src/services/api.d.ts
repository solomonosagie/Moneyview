import type { Account, NewTransaction, Transaction } from '@/types/moneyview';

export function getAccounts(): Promise<Account[]>;
export function getTransactions(): Promise<Transaction[]>;
export function getCategories(): Promise<string[]>;
export function createTransaction(data: NewTransaction): Promise<Transaction>;
