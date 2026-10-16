import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/charges"

export const oneChargingApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["OneCharging"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchOneCharging: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["OneCharging"],
      }),
      syncOneCharging: builder.mutation({
        query: () => ({
          url: `${BASE_ENDPOINT}/sync`,
          method: "POST",
        }),
        invalidatesTags: ["OneCharging"]
      })
    })
  })

export const {
  useFetchOneChargingQuery,
  useLazyFetchOneChargingQuery,
  useSyncOneChargingMutation,
} = oneChargingApi