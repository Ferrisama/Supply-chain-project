import React from "react";
import { Navigate } from "react-router-dom";

const withRoleAccess = (allowedRoles, WrappedComponent) => {
  return (props) => {
    const userRole = localStorage.getItem("role");

    if (allowedRoles.includes(userRole)) {
      return <WrappedComponent {...props} />;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  };
};

export default withRoleAccess;
