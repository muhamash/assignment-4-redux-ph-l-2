import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useRedux";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}