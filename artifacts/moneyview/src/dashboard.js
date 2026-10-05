const profile = {
  fullName: "Ada Okafor",
  asOf: "2026-10-05",
};

const accounts = [
  {
    id: "current",
    name: "Current",
    maskedNumber: "•••• 2048",
    balance: 1246800,
    iconClass: "current-symbol",
  },
  {
    id: "savings",
    name: "Savings",
    maskedNumber: "•••• 6817",
    balance: 3110000,
    iconClass: "savings-symbol",
  },
  {
    id: "card",
    name: "Card",
    maskedNumber: "•••• 1104",
    balance: 400000,
    iconClass: "card-symbol",
  },
];

const transactions = [
  {
    id: "northstar-foods",
    description: "Northstar Foods",
    category: "Groceries",
    date: "2026-10-05",
    direction: "out",
    amount: 28450,
    iconClass: "groceries-icon",
  },
  {
    id: "cityhop",
    description: "CityHop",
    category: "Transport",
    date: "2026-10-05",
    direction: "out",
    amount: 12800,
    iconClass: "transport-icon",
  },
  {
    id: "transfer-bisi",
    description: "Transfer from Bisi",
    category: "Transfer",
    date: "2026-10-04",
    direction: "in",
    amount: 50000,
    iconClass: "transfer-icon",
  },
  {
    id: "harborline-salary",
    description: "Salary — Harborline Studio",
    category: "Income",
    date: "2026-10-03",
    direction: "in",
    amount: 850000,
    iconClass: "income-icon",
  },
  {
    id: "ekopower",
    description: "EkoPower",
    category: "Utilities",
    date: "2026-10-03",
    direction: "out",
    amount: 32000,
    iconClass: "utilities-icon",
  },
];

const numberFormatter = new Intl.NumberFormat("en-NG", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function requireElement(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Dashboard is missing the required element: ${selector}`);
  }

  return element;
}

function cloneTemplate(templateId) {
  const template = document.getElementById(templateId);

  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error(`Dashboard is missing the required template: ${templateId}`);
  }

  const content = template.content.firstElementChild;

  if (!content) {
    throw new Error(`Dashboard template is empty: ${templateId}`);
  }

  return content.cloneNode(true);
}

function setTextWithin(root, selector, value) {
  const element = root.querySelector(selector);

  if (!element) {
    throw new Error(`Dashboard template is missing: ${selector}`);
  }

  element.textContent = value;
  return element;
}

function formatNaira(amount) {
  return `₦${numberFormatter.format(amount)}`;
}

function parseSampleDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid sample date: ${isoDate}`);
  }

  return date;
}

function formatTransactionDate(isoDate) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseSampleDate(isoDate));
}

function formatDashboardDate(isoDate) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseSampleDate(isoDate));
}

function formatWeekday(isoDate) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    timeZone: "UTC",
  }).format(parseSampleDate(isoDate)).toUpperCase();
}

function formatTransactionPeriod() {
  if (transactions.length === 0) {
    return "No recent activity";
  }

  let oldestDate = transactions[0].date;
  let newestDate = transactions[0].date;

  for (const transaction of transactions) {
    if (transaction.date < oldestDate) oldestDate = transaction.date;
    if (transaction.date > newestDate) newestDate = transaction.date;
  }

  const oldest = parseSampleDate(oldestDate);
  const newest = parseSampleDate(newestDate);
  const dayFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    timeZone: "UTC",
  });
  const sameMonthAndYear =
    oldest.getUTCFullYear() === newest.getUTCFullYear() &&
    oldest.getUTCMonth() === newest.getUTCMonth();
  const dayRange =
    dayFormatter.format(oldest) === dayFormatter.format(newest)
      ? dayFormatter.format(oldest)
      : `${dayFormatter.format(oldest)}—${dayFormatter.format(newest)}`;

  if (!sameMonthAndYear) {
    return `${formatTransactionDate(oldestDate)}—${formatTransactionDate(newestDate)}`;
  }

  const month = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    timeZone: "UTC",
  }).format(oldest).toUpperCase();
  const year = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    timeZone: "UTC",
  }).format(oldest);

  return `${dayRange} ${month} / ${year}`;
}

function renderAccount(account) {
  const row = cloneTemplate("account-row-template");
  row.setAttribute("data-testid", `account-${account.id}`);

  const symbol = row.querySelector(".account-symbol");
  if (!symbol) {
    throw new Error("Account template is missing its symbol.");
  }
  symbol.classList.add(account.iconClass);

  setTextWithin(row, ".account-copy strong", account.name);
  setTextWithin(row, ".account-copy small", account.maskedNumber);
  const balance = setTextWithin(row, ".account-balance", formatNaira(account.balance));
  balance.setAttribute("data-testid", `value-${account.id}-balance`);

  return row;
}

function renderTransaction(transaction) {
  const row = cloneTemplate("transaction-row-template");
  row.setAttribute("data-testid", `transaction-${transaction.id}`);

  const icon = row.querySelector(".merchant-icon");
  const amountCell = row.querySelector(".transaction-amount");
  const dateCell = row.querySelector(".transaction-date");

  if (!icon || !amountCell || !dateCell) {
    throw new Error("Transaction template is missing a required cell.");
  }

  icon.classList.add(transaction.iconClass);
  setTextWithin(row, ".transaction-copy strong", transaction.description);
  setTextWithin(
    row,
    ".transaction-copy small",
    transaction.direction === "in" ? "Money in" : "Money out",
  );
  setTextWithin(row, ".category-label", transaction.category);

  const date = document.createElement("time");
  date.dateTime = transaction.date;
  date.textContent = formatTransactionDate(transaction.date);
  dateCell.replaceChildren(date);

  const isIncoming = transaction.direction === "in";
  amountCell.classList.add(isIncoming ? "money-in" : "money-out");
  amountCell.setAttribute("data-testid", `amount-${transaction.id}`);
  setTextWithin(amountCell, ".direction-tag", isIncoming ? "IN" : "OUT");
  setTextWithin(
    amountCell,
    "strong",
    `${isIncoming ? "+" : "−"}${formatNaira(transaction.amount)}`,
  );

  return row;
}

function renderDashboard() {
  const firstName = profile.fullName.split(/\s+/)[0];
  requireElement("#greeting-name").textContent = firstName;
  requireElement("#profile-full-name").textContent = profile.fullName;
  requireElement("#profile-initials").textContent = profile.fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((namePart) => namePart[0])
    .join("")
    .toUpperCase();
  requireElement("#ornament-weekday").textContent = formatWeekday(profile.asOf);

  const dashboardDate = requireElement("#dashboard-date");
  dashboardDate.dateTime = profile.asOf;
  dashboardDate.textContent = formatDashboardDate(profile.asOf);

  const balanceDate = requireElement("#balance-as-of");
  balanceDate.dateTime = profile.asOf;
  balanceDate.textContent = formatTransactionDate(profile.asOf);

  const totalBalance = accounts.reduce((total, account) => total + account.balance, 0);
  const balanceHeading = requireElement("#total-balance-heading");
  const [wholeAmount, decimalAmount] = numberFormatter.format(totalBalance).split(".");
  const decimal = document.createElement("span");
  decimal.className = "decimal";
  decimal.textContent = `.${decimalAmount}`;
  balanceHeading.replaceChildren(document.createTextNode(`₦${wholeAmount}`), decimal);
  balanceHeading.setAttribute("aria-label", formatNaira(totalBalance));

  requireElement("#balance-account-count").textContent = String(accounts.length);
  requireElement("#account-count").textContent = String(accounts.length).padStart(2, "0");
  requireElement("#transaction-period").textContent = formatTransactionPeriod();
  requireElement("#account-list").replaceChildren(...accounts.map(renderAccount));
  requireElement("#transaction-list").replaceChildren(...transactions.map(renderTransaction));
}

renderDashboard();
