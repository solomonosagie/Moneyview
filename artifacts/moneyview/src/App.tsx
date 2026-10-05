import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import AppShell from '@/components/moneyview/AppShell';
import { PageHeading } from '@/components/moneyview/PageHeading';
import AddTransactionPage from '@/pages/AddTransactionPage';
import DashboardPage from '@/pages/DashboardPage';
import InsightsPage from '@/pages/InsightsPage';
import TransactionsPage from '@/pages/TransactionsPage';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <TooltipProvider>
        <BrowserRouterWithRoutes />
        <Toaster />
      </TooltipProvider>
    </BrowserRouter>
  );
}

function BrowserRouterWithRoutes() {
  const location = useLocation();

  return (
    <ErrorBoundary resetKey={`${location.pathname}:${location.key}`}>
      <AppShell>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/add" element={<AddTransactionPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route
            path="*"
            element={
              <div className="mv-content">
                <PageHeading
                  eyebrow="PAGE NOT FOUND"
                  title="This page isn’t in the sample workspace"
                  description="Use the navigation to return to your fictional account overview."
                  action={
                    <Link className="button button-primary" to="/">
                      Go to overview
                    </Link>
                  }
                />
              </div>
            }
          />
        </Routes>
      </AppShell>
    </ErrorBoundary>
  );
}

export default App;
