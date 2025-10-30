    import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, role } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!Array.isArray(role) || !role.includes("admin")) {
    return <Navigate to="/" replace />;
  }
  return children;
}
