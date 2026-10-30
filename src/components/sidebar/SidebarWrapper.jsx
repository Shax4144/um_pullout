import { useEffect, useState } from "react";
import { useSelector, useDispatch} from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import {
  dashboardItem,
  masterlistItems,
  moduleItems,
  userManagementItems
} from "./navigation";

import SidebarMasterlistDropdown from "../sidebar/dropdown/SidebarMasterlistDropdown";
import SidebarUserManagementDropdown from "../sidebar/dropdown/SidebarUserManagementDropdown";
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
import { Separator } from "@/components/ui/separator"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  LogOut,
  MoreVertical,
  Settings,
} from "lucide-react";

const sidebarSections = [
  { id: "modules", items: moduleItems },
  { id: "masterlist", items: masterlistItems },
  { id: "user-management", items: userManagementItems },
]

const SidebarWrapper = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const user = useSelector((state) => state.user);

  const full_name = [user.first_name, user.last_name].filter(Boolean).join(" ");
  const [openSection, setOpenSection] = useState(null);

  const getInitials = (name) => {
    if (!name) return;
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 3);
  };

  useEffect(() => {
    const matchingSection = sidebarSections.find((section) =>
      section.items.some((item) => item.to === pathname),
    );
  
    setOpenSection(matchingSection?.id ?? null);
  }, [pathname]);

  const hasRole = (role) => {
    return user?.role === role;
  };

  const handleLogout = () => {
    console.log("Logout");

    // Add your actual logout logic here
    // dispatch(logout());

    navigate("/");
  };

  const DashboardIcon = dashboardItem.icon

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
        <SidebarMenu className="pl-2 pr-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                setOpenSection(null);
                navigate(dashboardItem.to);
              }}
              isActive={pathname === dashboardItem.to}
              tooltip={dashboardItem.label}
              className="cursor-pointer"
            >
              <DashboardIcon />
              <span>{dashboardItem.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      
        <SidebarModulesDropdown
          open={openSection === "modules"}
          onOpenChange={(isOpen) =>
            setOpenSection(isOpen ? "modules" : null)
          }
        />
      
        <SidebarMasterlistDropdown
          open={openSection === "masterlist"}
          onOpenChange={(isOpen) =>
            setOpenSection(isOpen ? "masterlist" : null)
          }
        />
      
        <SidebarUserManagementDropdown
          open={openSection === "user-management"}
          onOpenChange={(isOpen) =>
            setOpenSection(isOpen ? "user-management" : null)
          }
        />
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
                  !hover:bg-sidebar-acccent
                  !hover:text-sidebar-accent-foreground
                  aria-expanded:bg-primary/30
                  aria-expanded:text-sidebar-foreground
                "
              />
            }
          >
            {/* User */}
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-sidebar-primary/15 text-sm font-semibold text-sidebar-primary">
                  {getInitials(full_name)}
                </AvatarFallback>
              </Avatar>
            
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-[13px] font-semibold">
                  {getInitials(user.first_name)}. {user.last_name}
                </p>
            
                <p className="truncate text-[11px]">
                  {user.role.toUpperCase()}
                </p>
              </div>
            </div>
            
            <MoreVertical
              className="
                h-4 w-4 shrink-0
                text-sidebar-foreground/60
                transition-colors
                group-hover:text-sidebar-accent-foreground
                group-aria-expanded:text-sidebar-primary
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
              p-2
              shadow-xl
            "
          >
            <div className="flex flex-col">
              {/* =================================================
                  ACCOUNT HEADER
              ================================================= */}
              {/* <div className="flex items-center gap-3 rounded-lg px-3 py-3">
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
              </div>*/}

              {/* Divider */}
              {/* <div className="my-1 h-px bg-border" />*/}

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
                  hover:bg-sidebar-hover
                "
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-teal-500/20">
                    <Settings className="h-4 w-4 text-teal-400" />
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
              <Separator />

              {/* =================================================
                  LOGOUT
              ================================================= */}
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="
                  h-10
                  justify-start
                  gap-3
                  rounded-lg
                  mt-2
                  px-3
                  font-bold
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
