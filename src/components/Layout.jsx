import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "./Navbar";
import SidebarWrapper from "./sidebar/SidebarWrapper";

const Layout = () => {
  return (
    <TooltipProvider>
      <SidebarProvider className="h-svh">
        <div className="flex w-full min-h-0 min-w-0 bg-sidebar">
          {/* sidebar wrapper */}
          <SidebarWrapper />

          {/* navbar */}
          {/* <Navbar />*/}

          {/* content container */}
          <main className="flex m-1.5 min-h-0 flex-1 flex-col overflow-hidden pb-safe bg-background rounded-xl lg:p-4 lg:pb-safe">
            {/* navbar */}
            <Navbar />

            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default Layout;
