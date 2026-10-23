import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, ClipboardPenLine } from "lucide-react";

import { moduleItems } from "../navigation";

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

const SidebarModulesDropdown = ({ open, onOpenChange }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isGroupActive = moduleItems.some(
    (item) => item.to === pathname,
  );

  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <SidebarGroup className="py-1">
        <CollapsibleTrigger
          className={cn(
            "flex w-full h-12 items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold text-sidebar-foreground/70 transition-[color,background-color] duration-200 ease-out motion-safe:transition-transform motion-safe:hover:translate-x-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            isGroupActive &&
              "bg-primary text-sidebar-foreground",
          )}
        >
          <ClipboardPenLine className="size-6" />

          <span className="flex-1">Inventory</span>

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
              {moduleItems.map(({ label, to, icon: Icon }) => (
                <SidebarMenuItem
                  key={to}
                  className="sidebar-collapsible-item"
                >
                  <SidebarMenuButton
                    isActive={pathname === to}
                    onClick={() => navigate(to)}
                    tooltip={label}
                    className="cursor-pointer"
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

export default SidebarModulesDropdown;