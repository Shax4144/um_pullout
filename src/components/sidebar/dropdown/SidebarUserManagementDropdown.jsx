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

const userManagementItems = [
  {
    label: "User Accounts",
    to: "/user-accounts",
    icon: UserRoundCog,
  },
  {
    label: "Roles",
    to: "/roles",
    icon: ShieldUser,
  },
];

const SidebarUserManagementDropdown = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="cursor-default text-[12px] font-semibold hover:text-accent-foreground">
        User Management
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu className="pl-4">
          {userManagementItems.map(({ label, to, icon: Icon }) => (
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

export default SidebarUserManagementDropdown;
