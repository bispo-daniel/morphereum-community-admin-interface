import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/providers/auth";

interface ProtectedRouteProps {
  element: React.ReactElement;
}

function ProtectedRoute({ element }: ProtectedRouteProps) {
  const { loading, isTokenValid, checkTokenValidity, removeToken } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!loading) {
      const stillValid = checkTokenValidity();

      if (!stillValid) {
        removeToken();
        navigate("/login", { replace: true });
      }
    }
  }, [pathname, loading, checkTokenValidity, removeToken, navigate]);

  if (loading) return null;

  if (!isTokenValid) return null;

  return element;
}

export default ProtectedRoute;
