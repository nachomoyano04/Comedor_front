import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../services/AuthProvider";

export const RequireRole = ({ allowedRoles, children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  const tieneAcceso = user.roles?.some((r) => allowedRoles.includes(r));

  if (!tieneAcceso) {
    return <Navigate to={"/forbidden"} replace />;
  }

  return children;
};
