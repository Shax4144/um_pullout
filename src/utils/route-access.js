import { matchPath } from "react-router-dom";

import { dashboardItem } from "@/components/sidebar/navigation";

import masterlistConfig from "@/config/masterlist-routes.config";
import userManagementConfig from "@/config/user-management-routes.config";
import modulesConfig from "@/config/modules-routes.config";

const LAST_AUTHORIZED_PATH_KEY = "lastAuthorizedPath";

const routeDefinitions = [
  {
    path: dashboardItem.to,
    permissions: dashboardItem.permissions,
  },
  ...modulesConfig,
  ...masterlistConfig,
  ...userManagementConfig,
];

const excludedPaths = ["/", "/401", "/403", "/404"];

export const hasRouteAccess = (pathname, userPermissions = []) => {
  const normalizedPath = pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  if (excludedPaths.includes(normalizedPath)) {
    return false;
  }

  const route = routeDefinitions.find(({ path }) => {
    const normalizedRoutePath = path.startsWith("/")
      ? path
      : `/${path}`;

    return matchPath(
      {
        path: normalizedRoutePath,
        end: true,
      },
      normalizedPath,
    );
  });

  if (!route) {
    return false;
  }

  const requiredPermissions = route.permissions ?? [];

  return (
    requiredPermissions.length === 0 ||
    requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    )
  );
};

export const saveLastAuthorizedPath = (pathname) => {
  if (!excludedPaths.includes(pathname)) {
    sessionStorage.setItem(LAST_AUTHORIZED_PATH_KEY, pathname);
  }
};

export const getReturnPath = ({ code, userPermissions = [] }) => {
  // 403 special case:
  // Prefer User Accounts when the user has masterlist permission.
  if (code === 403 && userPermissions.includes("masterlist")) {
    if (hasRouteAccess("/user-accounts", userPermissions)) {
      return "/user-accounts";
    }
  }

  // Otherwise, use the last authorized page.
  const lastPath = sessionStorage.getItem(LAST_AUTHORIZED_PATH_KEY);

  if (lastPath && hasRouteAccess(lastPath, userPermissions)) {
    return lastPath;
  }

  // If there is no valid previous route, find the first accessible route.
  const firstAccessibleRoute = routeDefinitions.find(
    ({ permissions = [] }) =>
      permissions.length === 0 ||
      permissions.some((permission) => userPermissions.includes(permission)),
  );

  return firstAccessibleRoute?.path ?? "/";
};


export const getLoginDestination = (userPermissions = []) => {
  if (
    userPermissions.includes("user-management") &&
    hasRouteAccess("/user-accounts", userPermissions)
  ) {
    return "/user-accounts";
  }

  // if (
  //   userPermissions.includes("inventory") &&
  //   hasRouteAccess("/inventory-mrp", userPermissions)
  // ) {
  //   return "/inventory-mrp";
  // }

  const firstAccessibleRoute = routeDefinitions.find(({ path }) =>
    hasRouteAccess(path, userPermissions)
  );

  return firstAccessibleRoute?.path
    ? `/${firstAccessibleRoute.path.replace(/^\/+/, "")}`
    : "/403";
};
