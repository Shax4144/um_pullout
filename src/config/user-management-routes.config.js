import { lazy } from "react"

const userManagementConfig = [
	{
		path: "user-accounts",
		component: lazy(
			() => import("../routes/user-management/user/UserAccount"),
		),
		// permissions: ["Masterlist"]
	},
	{
		path: "roles",
    component: lazy(() => import("../routes/user-management/roles/Roles")),
		// permissions: ["Masterlist"]
	},
]

export default userManagementConfig
