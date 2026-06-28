import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, action }: PageHeaderProps) {
  return (
    <header className="page-header mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <p className="mb-1 text-sm font-medium text-[var(--color-muted)]">{eyebrow}</p> : null}
        <h1 className="truncate text-3xl font-semibold tracking-normal text-[var(--color-text)]">{title}</h1>
      </div>
      {action}
    </header>
  );
}
