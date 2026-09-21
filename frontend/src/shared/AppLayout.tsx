import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { clearToken } from "@/auth/session";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/shared/Wordmark";

const linkClass = ({ isActive }: { isActive: boolean }): string =>
  cn(
    "relative px-1 py-2 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
    isActive
      ? "text-foreground after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-foreground"
      : "text-muted-foreground hover:text-foreground",
  );

export function AppLayout(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const sair = (): void => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <div className="ambient min-h-svh sm:p-3 md:p-4">
      <div className="glass-panel mx-auto flex min-h-svh max-w-6xl flex-col sm:min-h-[calc(100svh-1.5rem)] sm:rounded-md md:min-h-[calc(100svh-2rem)]">
        <nav className="flex items-center justify-between gap-4 border-b px-4 py-4 md:px-8 md:py-5">
          <Wordmark />
          <div className="flex items-center gap-4 md:gap-6">
            <NavLink to="/pessoas" className={linkClass}>
              Pessoas
            </NavLink>
            <NavLink to="/contatos" className={linkClass}>
              Contatos
            </NavLink>
            <button
              type="button"
              onClick={sair}
              aria-label="Sair"
              className="inline-flex items-center gap-2 rounded-md px-1 py-2 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </nav>

        <div
          key={location.pathname}
          className="content-in flex flex-1 flex-col"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
