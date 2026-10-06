import { useSelector } from "react-redux"
import Layout from "./Layout"
import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({ role }) => {
	// const authenticated = window.localStorage.getItem("token")
	// const user = useSelector((state) => state.user)

	// if (!authenticated) return <Navigate to="/" />

	if (role === undefined) return <Layout />

	// const hasPermission = Array.isArray(permission)
	// 	? permission.some((p) => user?.permissions?.includes(p))
	// 	: user?.permissions?.includes(permission)

	// const hasRole = Array.isArray(role)
	// 	? role.includes(user?.role)
	// 	: user?.role === role

	// return hasPermission ? <Layouts /> : <AccessDenied />
	// return hasPermission ? <Layouts /> : <Navigate to="/" />
	// return hasRole ? <Layout /> : <Navigate to="/" />
	return <Layout /> 
}

// export const RequirePermission = ({ permissions, children }) => {
// 	const user = useSelector((state) => state.user)
//   const userPermissions = user?.permissions ?? []
	
//   if (!permissions || permissions.length === 0) {
//     return children
//   }

//   const hasAccess = permissions.some((p) => userPermissions.includes(p))

//   if (!hasAccess)
//     return <Navigate to="/unauthorized" replace />

//   return children
// }
