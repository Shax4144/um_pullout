import { createSlice } from "@reduxjs/toolkit"

const user = localStorage.getItem("user")

const initialState = user ? JSON.parse(user) : null

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUserDetails: (_, action) => {
			return action.payload
		},
		clearUserDetails: () => {
			return null
		},
	},
})

export const { setUserDetails, clearUserDetails } = userSlice.actions

export default userSlice.reducer
