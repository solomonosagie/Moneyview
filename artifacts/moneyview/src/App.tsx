import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  return (
    <main className="moneyview-page">
      <div className="moneyview-frame">
        <header className="moneyview-header" data-testid="header-moneyview">
          <div className="moneyview-brand" data-testid="brand-moneyview">
            <span className="moneyview-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 17.5 10.2 12l3.1 3.1L19 8.5" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.8 8.5H19v4.2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>MoneyView</span>
          </div>
          <span className="header-note" data-testid="text-workspace-type">
            Learning workspace
          </span>
        </header>

        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="hero-kicker" data-testid="text-milestone">
              Milestone 01 · Foundation
            </p>
            <h1 className="hero-title" id="hero-title" data-testid="heading-welcome">
              A clearer view of banking, <span>without the bank login.</span>
            </h1>
            <p className="hero-description" data-testid="text-introduction">
              MoneyView is a safe place to explore how a Nigerian retail banking
              dashboard can present sample account and transaction data. No real
              account is connected.
            </p>
            <div className="ready-line" data-testid="status-workspace-ready">
              <span className="ready-dot" aria-hidden="true" />
              <span>Your MoneyView workspace is ready</span>
            </div>
            <p className="privacy-caption" data-testid="text-no-account-connection">
              Fictional sample experience. Your bank details stay yours.
            </p>
          </div>

          <div className="hero-art" aria-label="Illustration of a private learning workspace" role="img" data-testid="illustration-safe-workspace">
            <div className="art-halo" aria-hidden="true" />
            <div className="art-orbit" aria-hidden="true" />
            <div className="workspace-card">
              <div className="card-topline">
                <span className="mini-brand">MoneyView</span>
                <span className="preview-label">Safe by design</span>
              </div>
              <div className="card-center">
                <span className="seal" aria-hidden="true">
                  <svg viewBox="0 0 32 32" fill="none">
                    <path d="M16 4.5 25 8v6.7c0 6.1-3.8 10.4-9 12.8-5.2-2.4-9-6.7-9-12.8V8l9-3.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                    <path d="m12.2 15.8 2.5 2.5 5.3-5.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h2 className="card-heading">A workspace, not a bank connection</h2>
                <p className="card-subcopy">Explore the idea of a banking dashboard with fictional information.</p>
              </div>
              <div className="card-foot">
                <span className="tiny-lock" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none">
                    <rect x="3.2" y="7" width="9.6" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M5.2 7V5.1a2.8 2.8 0 0 1 5.6 0V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </span>
                <span>Sample data only · No account access</span>
              </div>
            </div>
            <p className="art-caption" data-testid="text-safe-by-design">
              <strong>Private by default</strong>
              A learning space that never asks for banking credentials.
            </p>
          </div>
        </section>

        <footer className="page-foot" data-testid="footer-disclaimer">
          <span><strong>MoneyView</strong> · A fictional learning workspace</span>
          <span>No real accounts. No real financial data.</span>
        </footer>
      </div>
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
