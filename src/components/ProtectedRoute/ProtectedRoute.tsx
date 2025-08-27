import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

const ProtectedRoute = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const userRole = useAuthStore((state) => state.role);

  const isAdmin = isLoggedIn && userRole === "admin";

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
