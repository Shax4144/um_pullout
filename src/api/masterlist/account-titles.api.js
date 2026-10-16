import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/account-titles"

export const accountTitlesApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["AccountTitles"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchAccountTitles: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["AccountTitles"],
      }),
      syncAccountTitles: builder.mutation({
        query: () => ({
          url: `${BASE_ENDPOINT}/sync`,
          method: "POST",
        }),
        invalidatesTags: ["AccountTitles"]
      })
    })
  })

export const {
  useFetchAccountTitlesQuery,
  useLazyFetchAccountTitlesQuery,
  useSyncAccountTitlesMutation,
} = accountTitlesApi