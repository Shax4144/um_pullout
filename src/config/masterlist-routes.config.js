import { lazy } from "react"

const masterlistConfig = [
	{
		path: "user-accounts",
		component: lazy(
			() => import("../routes/masterlist/user/UserAccount"),
		),
		// permissions: ["Masterlist"]
	},
	{
		path: "roles",
    component: lazy(() => import("../routes/masterlist/roles/Roles")),
		// permissions: ["Masterlist"]
	},
]

export default masterlistConfig
