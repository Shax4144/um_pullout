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
          <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto m-2 lg:p-8 lg:pb-safe pb-safe bg-background rounded-xl">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default Layout;
