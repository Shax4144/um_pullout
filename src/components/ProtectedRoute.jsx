
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Layout from "./Layout";
import { saveLastAuthorizedPath } from "../utils/route-access";

const AuthorizedRouteTracker = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    saveLastAuthorizedPath(location.pathname);
  }, [location.pathname]);

  return children;
};

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Layout />;
};

export const RequirePermission = ({ permissions = [], children }) => {
  const user = useSelector((state) => state.user);
  const userPermissions = user?.permissions ?? [];

  const hasAccess =
    permissions.length === 0 ||
    permissions.some((permission) =>
      userPermissions.includes(permission)
    );

  if (!hasAccess) {
    return <Navigate to="/403" replace />;
  }

  return <AuthorizedRouteTracker>{children}</AuthorizedRouteTracker>;
};
