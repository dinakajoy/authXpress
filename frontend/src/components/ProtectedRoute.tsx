import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
   const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};
