import { lazy } from "react"

const userManagementConfig = [
	{
		path: "user-accounts",
		component: lazy(
			() => import("../routes/user-management/user/UserAccount"),
		),
		permissions: ["user-management"]
	},
	{
		path: "roles",
    component: lazy(() => import("../routes/user-management/roles/Roles")),
		permissions: ["user-management"]
	},
]

export default userManagementConfig
