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

export default ProtectedRoute;
