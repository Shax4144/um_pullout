import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ProtectedRoute, RequirePermission } from "./components/ProtectedRoute";

import { SelectedRowProvider } from "./context/SelectedRowProvider";

import masterlistConfig from "./config/masterlist-routes.config";
import userManagementConfig from "./config/user-management-routes.config";
import modulesConfig from "./config/modules-routes.config";

import { dashboardItem } from "./components/sidebar/navigation";
import ExceptionPage from "./exceptions/ExceptionPage";

import { Toaster } from "@/components/ui/toast";

const Landing = lazy(() => import("./Landing"));
const Dashboard = lazy(() => import("./routes/modules/dashboard/Dashboard"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedRowProvider>
        <Router>
          <Routes>
            {/* Login */}
            <Route path="/" element={<Landing />} />

            {/* Exception pages */}
            <Route path="/401" element={<ExceptionPage code={401} />} />

            <Route path="/403" element={<ExceptionPage code={403} />} />

            <Route path="/404" element={<ExceptionPage code={404} />} />

            {/* All authenticated routes */}
            <Route element={<ProtectedRoute />}>
              {/* Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <RequirePermission permissions={dashboardItem.permissions}>
                    <Dashboard />
                  </RequirePermission>
                }
              />

              {/* Modules */}
              {modulesConfig.map(
                ({ path, component: Component, permissions }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <RequirePermission permissions={permissions}>
                        <Component />
                      </RequirePermission>
                    }
                  />
                ),
              )}

              {/* Masterlist */}
              {masterlistConfig.map(
                ({ path, component: Component, permissions }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <RequirePermission permissions={permissions}>
                        <Component />
                      </RequirePermission>
                    }
                  />
                ),
              )}

              {/* User Management */}
              {userManagementConfig.map(
                ({ path, component: Component, permissions }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <RequirePermission permissions={permissions}>
                        <Component />
                      </RequirePermission>
                    }
                  />
                ),
              )}
            </Route>

            {/* Unknown routes */}
            <Route path="*" element={<ExceptionPage code={404} />} />
          </Routes>
        </Router>

        <Toaster />
      </SelectedRowProvider>
    </QueryClientProvider>
  );
}

export default App;
