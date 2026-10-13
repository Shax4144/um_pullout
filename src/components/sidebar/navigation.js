import {
  Users,
  ShieldUser,
  LayoutDashboard,
  ChevronDown,
  Package,
  Warehouse,
  RulerDimensionLine,
  Shapes,
  CreditCard,
  IdCard,
  ShelvingUnit,
  PackageCheck,
  FileInput,
  FileOutput,
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react"

export const dashboardItem = {
  label: "Dashboard",
  to: "/dashboard",
  icon: LayoutDashboard
};

export const userManagementItems = [
  {
    label: "User Accounts",
    to: "/user-accounts",
    icon: Users,
  },
  {
    label: "Roles",
    to: "/roles",
    icon: ShieldUser,
  },
];

export const masterlistItems = [
  {
    label: "One RDF Charging",
    to: "/one-charging",
    icon: IdCard,
  },
  {
    label: "Account Titles",
    to: "/account-titles",
    icon: CreditCard,
  },
  {
    label: "Categories",
    to: "/categories",
    icon: Shapes,
  },
  {
    label: "Items",
    to: "/items",
    icon: Package,
  },
  {
    label: "UOM",
    to: "/uom",
    icon: RulerDimensionLine,
  },
  {
    label: "Warehouse",
    to: "warehouse",
    icon: Warehouse,
  }
];

export const moduleItems = [
  {
    label: "Inventory MRP",
    to: "/inventory-mrp",
    icon: ShelvingUnit,
  },
  {
    label: "Receiving",
    to: "/receiving",
    icon: PackageCheck,
  },
  {
    label: "Miscellaneous Receipt",
    to: "/misc-receipt",
    icon: FileInput,
  },
  {
    label: "Miscellaneous Issue",
    to: "/misc-issue",
    icon: FileOutput,
  },
  {
    label: "Move Order",
    to: "/move-order",
    icon: ArrowLeftRight,
  },
  {
    label: "Transfer In",
    to: "/transfer-in",
    icon: ArrowDownToLine,
  },
  {
    label: "Transfer Out",
    to: "/transfer-out",
    icon: ArrowUpFromLine,
  },
];

const navigationItems = [
  dashboardItem,
  ...userManagementItems,
  ...masterlistItems,
  ...moduleItems,
]

export const getRouteTitle = (pathname) => {
  const currentItem = navigationItems.find((item) => item.to === pathname);

  return currentItem?.label.toLocaleUpperCase() ?? "";
}