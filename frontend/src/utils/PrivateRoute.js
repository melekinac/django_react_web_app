import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, isAdmin = false }) => {
  const { userInfo } = useAuth();
  if (!userInfo) {
    return <Navigate to="/login" />;
  }
  if (isAdmin && !userInfo.is_admin) {
    return <Navigate to="/home" />;
  }
  return children;
};

export default PrivateRoute;
