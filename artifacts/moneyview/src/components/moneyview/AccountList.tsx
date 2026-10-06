import type { Account } from '@/types/moneyview';
import { formatMoney } from '@/utils/format.js';

function accountSymbol(accountId: string) {
  if (accountId === 'savings') return 'savings-symbol';
  if (accountId === 'card') return 'card-symbol';
  return 'current-symbol';
}

export function AccountList({ accounts }: { accounts: Account[] }) {
  return (
    <ul className="account-list" aria-label="MoneyView accounts">
      {accounts.map((account) => (
        <li className="account-row" key={account.id}>
          <span
            className={`account-symbol ${accountSymbol(account.id)}`}
            aria-hidden="true"
          >
            <span />
          </span>
          <span className="account-copy">
            <strong>{account.name}</strong>
            <small>{account.maskedNumber}</small>
          </span>
          <span className="account-balance">{formatMoney(account.balance)}</span>
        </li>
      ))}
    </ul>
  );
}
