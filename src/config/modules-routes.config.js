import { lazy } from "react";

const modulesRoutes = [
  {
    path: "inventory-mrp",
    component: lazy(() => import("../routes/modules/inventory-mrp/InventoryMrp")),
    permissions: ["inventory"]
  },
  {
    path: "misc-issue",
    component: lazy(() => import("../routes/modules/misc-issue/MiscIssue")),
    permissions: ["issue"]
  },
  {
    path: "misc-receipt",
    component: lazy(() => import("../routes/modules/misc-receipt/MiscReceipt")),
    permissions: ["receipt"]
  },
  {
    path: "move-order",
    component: lazy(() => import("../routes/modules/move-order/MoveOrder")),
    permissions: ["move-order"]
  },
  {
    path: "receiving",
    component: lazy(() => import("../routes/modules/receiving/Receiving")),
    permissions: ["receiving"]
  },
  {
    path: "transfer-in",
    component: lazy(() => import("../routes/modules/transfer-in/TransferIn")),
    permissions: ["transfer-in"],
  },
  {
    path: "transfer-out",
    component: lazy(() => import("../routes/modules/transfer-out/TransferOut")),
    permissions: ["transfer-out"],
  },
  
];

export default modulesRoutes;