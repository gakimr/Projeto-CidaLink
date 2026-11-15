import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RotaAdmin({ children }) {
  const { user } = useAuth();

  if (user?.tipo !== "admin") {
    return <Navigate to="/app" replace />;
  }

  return children;
}
