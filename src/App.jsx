import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { SelectedRowProvider } from "./context/SelectedRowProvider";

const Landing = lazy(() => import("./Landing"));
const Dashboard = lazy(() => import("./routes/modules/dashboard/Dashboard"));

import masterlistConfig from "./config/masterlist-routes.config";
import modulesConfig from "./config/modules-routes.config";
import { Toaster } from "@/components/ui/toast";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedRowProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<ProtectedRoute />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route exact path="/workspace" element={<ProtectedRoute />}>
              {modulesConfig.map(({ path, component: Component }) => (
                <Route key={path} exact path={path} element={<Component />} />
              ))}
            </Route>
            <Route exact path="/masterlist" element={<ProtectedRoute />}>
              {masterlistConfig.map(({ path, component: Component }) => (
                <Route key={path} exact path={path} element={<Component />} />
              ))}
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </SelectedRowProvider>
    </QueryClientProvider>
  );
}

export default App;
