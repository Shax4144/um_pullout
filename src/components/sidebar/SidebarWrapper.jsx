import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import SidebarMasterlistDropdown from "../sidebar/dropdown/SidebarMasterlistDropdown";
import SidebarModulesDropdown from "../sidebar/dropdown/SidebarModulesDropdown";
import DarkmodeToggle from "../DarkmodeToggle";

import logo from "../../assets/logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  LayoutDashboard,
  LogOut,
  MoreVertical,
  Settings,
  UserRound,
} from "lucide-react";

const SidebarWrapper = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  const hasRole = (role) => {
    return user?.role === role;
  };

  const handleLogout = () => {
    console.log("Logout");

    // Add your actual logout logic here
    // dispatch(logout());

    navigate("/");
  };

  return (
    <Sidebar>
      {/* =========================================================
          HEADER
      ========================================================= */}
      <SidebarHeader className="flex h-16 flex-row items-center justify-evenly px-4">
        <img src={logo} alt="UM PULL OUT" className="h-10 w-auto" />
      </SidebarHeader>

      {/* =========================================================
          CONTENT
      ========================================================= */}
      <SidebarContent>
        {/* Dashboard */}
        <SidebarMenu className="pl-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/dashboard")}
              isActive={pathname === "/dashboard"}
              tooltip="Dashboard"
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Workspace */}
        <SidebarModulesDropdown />

        {/* Masterlist */}
        <SidebarMasterlistDropdown />
      </SidebarContent>

      {/* =========================================================
          FOOTER / ACCOUNT MENU
      ========================================================= */}
      <SidebarFooter className="p-2">
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                className="
                  group
                  h-auto
                  min-h-12
                  w-full
                  cursor-pointer
                  justify-between
                  rounded-lg
                  border-0
                  p-2
                  text-left
                  transition-colors
                  hover:bg-sidebar-accent
                  data-[state=open]:bg-sidebar-accent
                "
              />
            }
          >
            {/* User */}
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-teal-500/20 text-xs font-semibold text-teal-400">
                  CD
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-sidebar-foreground">
                  CHESTER JOHN, DAROY
                </p>

                <p className="truncate text-[11px] text-sidebar-foreground/60">
                  ADMIN
                </p>
              </div>
            </div>

            {/* Menu indicator */}
            <MoreVertical
              className="
                h-4
                w-4
                shrink-0
                text-sidebar-foreground/50
                transition-colors
                group-hover:text-sidebar-foreground
                group-data-[state=open]:text-sidebar-foreground
              "
            />
          </PopoverTrigger>

          {/* =====================================================
              POPOVER
          ===================================================== */}
          <PopoverContent
            side="top"
            align="end"
            sideOffset={8}
            className="
              w-70
              rounded-xl
              border
              bg-popover
              p-2
              shadow-xl
            "
          >
            <div className="flex flex-col">
              {/* =================================================
                  ACCOUNT HEADER
              ================================================= */}
              <div className="flex items-center gap-3 rounded-lg px-3 py-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="bg-teal-500/20 text-sm font-semibold text-teal-500">
                    CD
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    CHESTER JOHN, DAROY
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    Administrator
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="my-1 h-px bg-border" />

              {/* =================================================
                  APPEARANCE
              ================================================= */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  px-3
                  py-3
                  transition-colors
                  hover:bg-accent
                "
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">Appearance</p>

                    <p className="text-xs text-muted-foreground">Dark mode</p>
                  </div>
                </div>

                <DarkmodeToggle />
              </div>

              {/* =================================================
                  ACCOUNT
              ================================================= */}
              {/* <Button
                variant="ghost"
                className="
                  mt-1
                  h-auto
                  justify-start
                  gap-3
                  rounded-lg
                  px-3
                  py-3
                  font-normal
                  hover:bg-accent
                "
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                  <UserRound className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex flex-col items-start ">
                  <span className="text-sm font-medium hover:text-white">
                    Account
                  </span>

                  <span className="text-xs text-muted-foreground ">
                    Manage your profile
                  </span>
                </div>
              </Button>*/}

              {/* Divider */}
              <div className="my-1 h-px bg-border" />

              {/* =================================================
                  LOGOUT
              ================================================= */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="
                  h-10
                  justify-start
                  gap-3
                  rounded-lg
                  px-3
                  font-bold
                  hover:text-white
                "
              >
                <LogOut />

                <span>Sign out</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarWrapper;
