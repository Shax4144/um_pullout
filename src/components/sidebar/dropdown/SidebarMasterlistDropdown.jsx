import { useLocation, useNavigate } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { UserRoundCog, ShieldUser } from "lucide-react";

const masterlistItems = [
  {
    label: "Category",
    to: "/categories",
    icon: UserRoundCog,
  },
  {
    label: "Items",
    to: "/items",
    icon: UserRoundCog,
  },
  {
    label: "UOM",
    to: "/uom",
    icon: UserRoundCog,
  },
  {
    label: "Account Titles",
    to: "/account-titles",
    icon: UserRoundCog,
  },
  {
    label: "One RDF Charging",
    to: "/one-charging",
    icon: UserRoundCog,
  },
];

const SidebarMasterlistDropdown = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="cursor-default text-[12px] font-semibold hover:text-accent-foreground">
        Masterlist
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu className="pl-4">
          {masterlistItems.map(({ label, to, icon: Icon }) => (
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

export default SidebarMasterlistDropdown;
