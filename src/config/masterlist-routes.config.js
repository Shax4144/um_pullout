import { lazy } from "react"

const masterlistConfig = [
  {
		path: "one-charging",
     component: lazy(() => import("../routes/masterlist/one-charging/OneCharging")),
		permissions: ["masterlist"],
  },
  {
		path: "account-titles",
     component: lazy(() => import("../routes/masterlist/account-title/AccountTitle")),
		permissions: ["masterlist"],
  },
	{
		path: "categories",
		component: lazy(
			() => import("../routes/masterlist/category/Category"),
		),
		permissions: ["masterlist"],
	},
	{
		path: "items",
    component: lazy(() => import("../routes/masterlist/item/Item")),
		permissions: ["masterlist"],
  },
  {
		path: "uom",
     component: lazy(() => import("../routes/masterlist/uom/Uom")),
		permissions: ["masterlist"],
  },
  {
    path: "warehouse",
    component: lazy(() => import("../routes/masterlist/warehouse/Warehouse")),
    permissions: ["masterlist"],
  },
]

export default masterlistConfig
