import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { clearToken } from "@/auth/session";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/shared/Wordmark";

type AppLayoutProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  cn(
    "relative px-1 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
    isActive
      ? "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-brand-gold"
      : "text-muted-foreground hover:text-foreground",
  );

export function AppLayout({
  title,
  actions,
  children,
}: AppLayoutProps): React.JSX.Element {
  const navigate = useNavigate();

  const sair = (): void => {
    clearToken();
    navigate("/login");
  };

  return (
    <div className="ambient min-h-svh p-3 md:p-4">
      <div className="glass-panel mx-auto flex min-h-[calc(100svh-1.5rem)] max-w-6xl flex-col rounded-md md:min-h-[calc(100svh-2rem)]">
        <nav className="flex items-center justify-between gap-6 border-b px-8 py-5">
          <Wordmark />
          <div className="flex items-center gap-6">
            <NavLink to="/pessoas" className={linkClass}>
              Pessoas
            </NavLink>
            <NavLink to="/contatos" className={linkClass}>
              Contatos
            </NavLink>
            <button
              type="button"
              onClick={sair}
              className="inline-flex items-center gap-2 rounded-md px-1 py-2 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut className="size-4" />
              Sair
            </button>
          </div>
        </nav>

        <header className="flex items-end justify-between gap-4 px-8 pb-6 pt-10">
          <h1 className="font-serif text-4xl font-medium tracking-tight">
            {title}
          </h1>
          <div className="flex items-center gap-3">{actions}</div>
        </header>

        <main className="flex flex-1 flex-col gap-8 px-8 pb-8">{children}</main>
      </div>
    </div>
  );
}
