import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, UserCog } from "lucide-react";

import { userManagementItems } from "../navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

const SidebarUserManagementDropdown = ({ open, onOpenChange }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isGroupActive = userManagementItems.some(
    (item) => item.to === pathname,
  );

  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <SidebarGroup className="py-1">
        <CollapsibleTrigger
          className={cn(
            "flex w-full h-12 items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold text-sidebar-foreground/70 transition-[color,background-color] duration-200 ease-out motion-safe:transition-transform motion-safe:hover:translate-x-0.5 hover:bg-sidebar-hover hover:text-sidebar-accent-foreground",
            isGroupActive &&
              "bg-sidebar-accent/60 text-sidebar-accent-foreground",
          )}
        >
          <UserCog className="size-4" />

          <span className="flex-1">User Management</span>

          <ChevronRight
            className={cn(
              "size-4 transition-transform duration-200",
              open && "rotate-90",
            )}
          />
        </CollapsibleTrigger>

        <CollapsibleContent
          className="
            sidebar-collapsible-panel
            h-[var(--collapsible-panel-height)]
            overflow-hidden
            transition-[height,opacity]
            duration-200
            ease-out
            data-[starting-style]:h-0
            data-[starting-style]:opacity-0
            data-[ending-style]:h-0
            data-[ending-style]:opacity-0
          "
        >
          <SidebarGroupContent>
            <SidebarMenu className="mt-1 pl-4 gap-1">
              {userManagementItems.map(({ label, to, icon: Icon }) => (
                <SidebarMenuItem
                  key={to}
                  className="sidebar-collapsible-item"
                >
                  <SidebarMenuButton
                    isActive={pathname === to}
                    onClick={() => navigate(to)}
                    tooltip={label}
                    className="w-full cursor-pointer data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

export default SidebarUserManagementDropdown;