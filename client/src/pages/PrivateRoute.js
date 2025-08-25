import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole) {
    if (Array.isArray(allowedRole)) {
      if (!allowedRole.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
      }
    } else {
        if (role !== allowedRole) {
          return <Navigate to="/unauthorized" replace />;
        }
    }
  }

  return children;
}

export default PrivateRoute;
