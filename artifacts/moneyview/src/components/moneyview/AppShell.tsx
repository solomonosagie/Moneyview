import { type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './AppShell.css';

type PagePath = '/' | '/transactions' | '/add' | '/insights';
type NavigationItem = {
  label: string;
  path: PagePath;
  icon: 'home' | 'activity' | 'add' | 'insights';
  testId: string;
};

type AppShellProps = {
  children: ReactNode;
  pageTitle?: string;
};

const navigation: NavigationItem[] = [
  { label: 'Overview', path: '/', icon: 'home', testId: 'nav-overview' },
  {
    label: 'Transactions',
    path: '/transactions',
    icon: 'activity',
    testId: 'nav-transactions',
  },
  { label: 'Add entry', path: '/add', icon: 'add', testId: 'nav-add-entry' },
  {
    label: 'Insights',
    path: '/insights',
    icon: 'insights',
    testId: 'nav-insights',
  },
];

const pageNames: Record<PagePath, string> = {
  '/': 'Overview',
  '/transactions': 'Transactions',
  '/add': 'Add entry',
  '/insights': 'Insights',
};

function NavigationIcon({ name }: { name: NavigationItem['icon'] }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.7,
  };

  return (
    <svg
      aria-hidden="true"
      className="mv-nav-icon"
      viewBox="0 0 24 24"
      {...common}
    >
      {name === 'home' && (
        <>
          <rect x="4.5" y="4.5" width="6" height="6" rx="1.5" />
          <rect x="13.5" y="4.5" width="6" height="6" rx="1.5" />
          <rect x="4.5" y="13.5" width="6" height="6" rx="1.5" />
          <rect x="13.5" y="13.5" width="6" height="6" rx="1.5" />
        </>
      )}
      {name === 'activity' && (
        <path d="M3.5 12h4l2.4-5.5 4.1 11 2.6-5.5h3.9" />
      )}
      {name === 'add' && (
        <>
          <circle cx="12" cy="12" r="8.25" />
          <path d="M12 8v8M8 12h8" />
        </>
      )}
      {name === 'insights' && (
        <>
          <path d="M4.5 19.5h15" />
          <rect x="6" y="11" width="3.2" height="6.5" rx="1" />
          <rect x="10.5" y="7.5" width="3.2" height="10" rx="1" />
          <rect x="15" y="4.5" width="3.2" height="13" rx="1" />
        </>
      )}
    </svg>
  );
}

function Brand({ testId }: { testId: string }) {
  return (
    <div className="mv-brand" data-testid={testId}>
      <span className="mv-brand-mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="mv-brand-wordmark">MoneyView</span>
    </div>
  );
}

export default function AppShell({ children, pageTitle }: AppShellProps) {
  const location = useLocation();
  const currentPath = (navigation.some((item) => item.path === location.pathname)
    ? location.pathname
    : '/') as PagePath;
  const currentTitle = pageTitle ?? pageNames[currentPath];

  return (
    <div className="mv-shell" data-testid="moneyview-app-shell">
      <a className="mv-skip-link" href="#main-content" data-testid="link-skip-content">
        Skip to content
      </a>

      <aside className="mv-sidebar" aria-label="MoneyView workspace">
        <Brand testId="brand-moneyview-desktop" />
        <p className="mv-section-label">YOUR WORKSPACE</p>
        <nav className="mv-primary-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `mv-nav-link${isActive ? ' mv-nav-link-active' : ''}`
              }
              data-testid={item.testId}
            >
              <NavigationIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

      </aside>

      <div className="mv-main-column">
        <header className="mv-topbar">
          <div className="mv-mobile-brand">
            <Brand testId="brand-moneyview-mobile" />
          </div>
          <div className="mv-page-context">
            <span className="mv-context-title" data-testid="text-current-page">
              {currentTitle}
            </span>
          </div>
        </header>

        <main className="mv-main" id="main-content" tabIndex={-1}>
          {children}
        </main>

      </div>

      <nav className="mv-mobile-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `mv-mobile-nav-link${isActive ? ' mv-mobile-nav-link-active' : ''}`
            }
            data-testid={`${item.testId}-mobile`}
          >
            <NavigationIcon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
