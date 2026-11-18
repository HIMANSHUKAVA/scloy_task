import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    if (role === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (role === "User") {
      return <Navigate to="/home" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
