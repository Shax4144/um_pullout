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
  icon: LayoutDashboard,
  permissions: ["dashboard"]
};

export const userManagementItems = [
  {
    label: "User Accounts",
    to: "/user-accounts",
    icon: Users,
    permissions: ["user-management"],
  },
  {
    label: "Roles",
    to: "/roles",
    icon: ShieldUser,
    permissions: ["user-management"],
  },
];

export const masterlistItems = [
  {
    label: "One RDF Charging",
    to: "/one-charging",
    icon: IdCard,
    permissions: ["masterlist"],
  },
  {
    label: "Account Titles",
    to: "/account-titles",
    icon: CreditCard,
    permissions: ["masterlist"],
  },
  {
    label: "Categories",
    to: "/categories",
    icon: Shapes,
    permissions: ["masterlist"],
  },
  {
    label: "Items",
    to: "/items",
    icon: Package,
    permissions: ["masterlist"],
  },
  {
    label: "UOM",
    to: "/uom",
    icon: RulerDimensionLine,
    permissions: ["masterlist"],
  },
  {
    label: "Warehouse",
    to: "/warehouse",
    icon: Warehouse,
    permissions: ["masterlist"],
  }
];

export const moduleItems = [
  {
    label: "Inventory MRP",
    to: "/inventory-mrp",
    icon: ShelvingUnit,
    permissions: ["inventory"],
  },
  {
    label: "Receiving",
    to: "/receiving",
    icon: PackageCheck,
    permissions: ["receiving"],
  },
  {
    label: "Miscellaneous Receipt",
    to: "/misc-receipt",
    icon: FileInput,
    permissions: ["receipt"],
  },
  {
    label: "Miscellaneous Issue",
    to: "/misc-issue",
    icon: FileOutput,
    permissions: ["issue"],
  },
  {
    label: "Move Order",
    to: "/move-order",
    icon: ArrowLeftRight,
    permissions: ["move-order"],
  },
  {
    label: "Transfer In",
    to: "/transfer-in",
    icon: ArrowDownToLine,
    permissions: ["transfer-in"],
  },
  {
    label: "Transfer Out",
    to: "/transfer-out",
    icon: ArrowUpFromLine,
    permissions: ["transfer-out"],
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