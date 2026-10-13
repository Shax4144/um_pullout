import { lazy } from "react"

const masterlistConfig = [
  {
		path: "one-charging",
     component: lazy(() => import("../routes/masterlist/one-charging/OneCharging")),
		// permissions: ["Masterlist"]
  },
  {
		path: "account-titles",
     component: lazy(() => import("../routes/masterlist/account-title/AccountTitle")),
		// permissions: ["Masterlist"]
  },
	{
		path: "categories",
		component: lazy(
			() => import("../routes/masterlist/category/Category"),
		),
		// permissions: ["Masterlist"]
	},
	{
		path: "items",
    component: lazy(() => import("../routes/masterlist/item/Item")),
		// permissions: ["Masterlist"]
  },
  {
		path: "uom",
     component: lazy(() => import("../routes/masterlist/uom/Uom")),
		// permissions: ["Masterlist"]
  },
  {
    path: "warehouse",
    component: lazy(() => import("../routes/masterlist/warehouse/Warehouse")),
  },
]

export default masterlistConfig
