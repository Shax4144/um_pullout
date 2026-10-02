import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
// import authReducer from "../features/auth/auth.slice"
// import userReducer from "../features/users/users.slice"


import { baseApi } from "../api/baseApi"
// import { authApi } from "../api/authApi"
// import { oneChargingBaseApi } from "../features/dropdown/one-charging-option"


export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // user: userReducer,

    [baseApi.reducerPath]: baseApi.reducer,
    // [authApi.reducerPath]: authApi.reducer, 
		// [oneChargingBaseApi.reducerPath]: oneChargingBaseApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(baseApi.middleware)
      // .concat(authApi.middleware)
      // .concat(oneChargingBaseApi.middleware)
      
})

setupListeners(store.dispatch)
