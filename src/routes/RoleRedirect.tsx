import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoginPage } from "@/features/auth";

export const RoleRedirect: React.FC = () => {
  const { account, checking } = useAuth();

  if (checking) return null;
  if (!account) return <LoginPage />;

  switch (account.role?.toLowerCase()) {
    case "super admin":
      return <Navigate to="/super-admin" replace />;
    case "admin":
      return <Navigate to="/admin" replace />;
    case "security":
      return <Navigate to="/security" replace />;
    case "accountant":
      return <Navigate to="/financials" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default RoleRedirect;
