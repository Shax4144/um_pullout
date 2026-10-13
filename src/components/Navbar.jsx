import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";
import { getRouteTitle } from "./sidebar/navigation";

const Navbar = () => {
  const { pathname } = useLocation();
  const title = getRouteTitle(pathname);
  
  return (
    <header className="shrink-0 bg-background">
      <div className="flex h-12 items-center gap-3">
        <SidebarTrigger
          aria-label="Toggle sidebar"
          className="hover:text-primary border border-border shadow-sm"
        />

        <Separator orientation="vertical" className="h-8 w-0.5 rounded-xl bg-primary" />

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold text-foreground">
            {title}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Notifications, theme switcher, user menu, etc. */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
