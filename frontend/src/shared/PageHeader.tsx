import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  count?: number;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  count,
  actions,
}: PageHeaderProps): React.JSX.Element {
  return (
    <header className="flex items-end justify-between gap-4 px-8 pb-6 pt-10">
      <div className="flex items-baseline gap-3">
        <h1 className="font-serif text-4xl font-medium tracking-tight">
          {title}
        </h1>
        {count !== undefined && (
          <span className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
            {count}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">{actions}</div>
    </header>
  );
}
