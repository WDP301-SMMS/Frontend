import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "~/libs/contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { role, loading } = useAuth();
  if (loading) return null;

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

const HandleNavigateAuthRoutes = () => {
  const { isLoggedIn, role, loading } = useAuth();

  if (loading) return null;

  if (!isLoggedIn) {
    return <Outlet />;
  } else {
    console.log("User is logged in with role:", role);
    switch (role?.toLowerCase()) {
      case "admin":
        return <Navigate to="/management/admin" replace />;
      case "manager":
        return <Navigate to="/management/manager" replace />;
      case "nurse":
        return <Navigate to="/management/nurse" replace />;
      case "parent":
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
};

export { ProtectedRoute, HandleNavigateAuthRoutes };
