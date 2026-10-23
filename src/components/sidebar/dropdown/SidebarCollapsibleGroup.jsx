// SidebarCollapsibleGroup.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

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

const SidebarCollapsibleGroup = ({
  label,
  icon: GroupIcon,
  items,
  open,
  onOpenChange,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isGroupActive = items.some((item) => item.to === pathname);

  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <SidebarGroup className="py-1">
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-[12px] font-semibold text-sidebar-foreground/70 transition-[background-color,color] hover:bg-sidebar-hover hover:text-sidebar-accent-foreground",
            isGroupActive &&
              "bg-sidebar-primary text-sidebar-accent-foreground",
          )}
        >
          <GroupIcon className="size-6" />

          <span className="flex-1">{label}</span>

          <ChevronRight
            className={cn(
              "size-4 transition-transform duration-200",
              open && "rotate-90",
            )}
          />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu className="mt-1 pl-4">
              {items.map(({ label: itemLabel, to, icon: ItemIcon }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton
                    isActive={pathname === to}
                    onClick={() => navigate(to)}
                    tooltip={itemLabel}
                    className="w-full cursor-pointer data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                  >
                    <ItemIcon />
                    <span>{itemLabel}</span>
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

export default SidebarCollapsibleGroup;