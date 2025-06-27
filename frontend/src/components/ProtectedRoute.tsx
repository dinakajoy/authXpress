import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useUser();

  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};
