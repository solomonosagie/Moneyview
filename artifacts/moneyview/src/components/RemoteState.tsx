import type { ReactNode } from 'react';

export function LoadingState({ label = 'Loading data…' }: { label?: string }) {
  return (
    <div className="remote-state" role="status" aria-live="polite">
      <span className="loading-indicator" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="remote-state remote-state-error" role="alert">
      <p>{message}</p>
      <button className="button button-secondary" type="button" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="remote-state remote-state-empty">
      <strong>{title}</strong>
      <p>{description}</p>
      {action}
    </div>
  );
}
