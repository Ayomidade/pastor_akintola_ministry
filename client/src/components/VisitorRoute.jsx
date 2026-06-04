// src/components/VisitorRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useVisitorAuth } from "../context/VisitorAuthContext.jsx";

export default function VisitorRoute({ children }) {
  const { visitor, loading } = useVisitorAuth();
  const location = useLocation();
  if (loading) return null;
  return visitor ? (
    children
  ) : (
    <Navigate to="/visitor/login" state={{ from: location }} replace />
  );
}
