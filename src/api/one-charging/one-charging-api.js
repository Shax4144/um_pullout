import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const oneChargingKey = import.meta.env.VITE_ONE_CHARGING_API_KEY
const oneChargingBaseUrl = import.meta.env.VITE_REACT_APP_ONE_CHARGING_ENDPOINT

export const oneChargingApi = createApi({
	reducerPath: "oneChargingApi",
	baseQuery: fetchBaseQuery({
		baseUrl: oneChargingBaseUrl,
		prepareHeaders: (headers) => {
			headers.set("Accept", "application/json")
			headers.set("API_KEY", oneChargingKey)
			return headers
		},
	}),
	endpoints: (builder) => ({
		fetchOneCharging: builder.query({
			query: (params) => ({
				url: "",
				method: "GET",
				params: { pagination: "none", ...params },
      }),
      transformResponse: (response) => response.data,
		}),
	}),
})

export const {
  useFetchOneChargingQuery,
  useLazyFetchOneChargingQuery
} = oneChargingApi
