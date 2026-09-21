import { Navigate, Outlet } from "react-router-dom";

import { getToken } from "@/auth/session";

export function RotaProtegida(): React.JSX.Element {
  if (!getToken()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
