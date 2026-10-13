import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import authReducer from "./auth/auth.slice"
import userReducer from "./users/users.slice"


import { baseApi } from "../api/baseApi"
import { authApi } from "../api/login/authApi"
import { oneChargingApi } from "../api/one-charging/one-charging-api"


export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,

    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer, 
		[oneChargingApi.reducerPath]: oneChargingApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      .concat(authApi.middleware)
      .concat(oneChargingApi.middleware)
      
})

setupListeners(store.dispatch)
