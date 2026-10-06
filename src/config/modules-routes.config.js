import { lazy } from "react";

const modulesRoutes = [
  {
    path: "inventory-mrp",
    component: lazy(() => import("../routes/modules/inventory-mrp/InventoryMrp")),
    // permissions: []
  },
  {
    path: "misc-issue",
    component: lazy(() => import("../routes/modules/misc-issue/MiscIssue")),
    // permissions: []
  },
  {
    path: "misc-receipt",
    component: lazy(() => import("../routes/modules/misc-receipt/MiscReceipt")),
    // permissions: []
  },
  {
    path: "move-order",
    component: lazy(() => import("../routes/modules/move-order/MoveOrder")),
    // permissions: []
  },
  {
    path: "receiving",
    component: lazy(() => import("../routes/modules/receiving/Receiving")),
    // permissions: []
  },
  {
    path: "transfer-in",
    component: lazy(() => import("../routes/modules/transfer-in/TransferIn")),
    // permissions: []
  },
  {
    path: "transfer-out",
    component: lazy(() => import("../routes/modules/transfer-out/TransferOut")),
    // permissions: []
  },
  
];

export default modulesRoutes;