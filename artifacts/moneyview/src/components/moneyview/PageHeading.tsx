import type { ReactNode } from 'react';

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mv-page-heading">
      <div>
        <p className="mv-page-eyebrow">{eyebrow}</p>
        <h1 className="mv-page-title">{title}</h1>
        <p className="mv-page-description">{description}</p>
      </div>
      {action ? <div className="mv-page-heading-action">{action}</div> : null}
    </div>
  );
}
