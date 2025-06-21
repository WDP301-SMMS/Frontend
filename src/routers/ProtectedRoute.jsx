import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "~/libs/contexts/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { role } = useAuth();

    if (!allowedRoles.includes(role)) return <Navigate to="/*" replace />;

    return <Outlet />;
};

export default ProtectedRoute;
