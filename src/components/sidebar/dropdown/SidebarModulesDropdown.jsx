import { useLocation, useNavigate } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { ChevronDown } from "lucide-react";

const moduleItems = [
  {
    label: "Inventory MRP",
    to: "/inventory-mrp",
    icon: ChevronDown,
  },
  {
    label: "Receiving",
    to: "/receiving",
    icon: ChevronDown,
  },
  {
    label: "Miscellaneous Receipt",
    to: "/misc-receipt",
    icon: ChevronDown,
  },
  {
    label: "Miscellaneous Issue",
    to: "/misc-issue",
    icon: ChevronDown,
  },
  {
    label: "Move Order",
    to: "/move-order",
    icon: ChevronDown,
  },
  {
    label: "Transfer In",
    to: "/transfer-in",
    icon: ChevronDown,
  },
  {
    label: "Transfer Out",
    to: "/transfer-out",
    icon: ChevronDown,
  },
];

const SidebarModulesDropdown = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="cursor-default text-[12px] font-semibold hover:text-accent-foreground">
        Workspace
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu className="pl-4">
          {moduleItems.map(({ label, to, icon: Icon }) => (
            <SidebarMenuItem key={label}>
              <SidebarMenuButton
                isActive={pathname === to}
                onClick={() => navigate(to)}
                tooltip={label}
                className="w-full hover:cursor-pointer"
              >
                <Icon />
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarModulesDropdown;
