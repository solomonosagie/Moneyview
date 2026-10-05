const API_PATH = 'moneyview-api';
const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  `${import.meta.env.BASE_URL}${API_PATH}`
).replace(/\/+$/, '');

async function requestJSON(path, options = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}/${path.replace(/^\/+/, '')}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error('The sample data service is unavailable. Try again shortly.');
  }

  if (!response.ok) {
    throw new Error(
      response.status >= 500
        ? 'The sample data service is having trouble. Try again shortly.'
        : 'We could not complete that request. Check the details and try again.',
    );
  }

  try {
    return await response.json();
  } catch {
    throw new Error('The sample data service returned an unreadable response.');
  }
}

export function getAccounts() {
  return requestJSON('accounts');
}

export function getTransactions() {
  return requestJSON('transactions');
}

export function getCategories() {
  return requestJSON('categories');
}

export function createTransaction(data) {
  return requestJSON('transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
