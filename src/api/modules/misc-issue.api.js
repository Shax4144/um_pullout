import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/misc-issues"

export const miscIssueApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Misc-Issues"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchMiscIssues: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Misc-Issues"],
      }),
      fetchMiscIssueById: builder.query({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "GET",
        }),
        providesTags: ["Misc-Issues"],
      }),
      postMiscIssue: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Misc-Issues", "StockOnHand"],
      }),
      updateMiscIssue: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Misc-Issues", "StockOnHand"],
      }),
      archiveMiscIssue: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Misc-Issues", "StockOnHand"],
      }),
    })
  })

export const {
  useFetchMiscIssuesQuery,
  useLazyFetchMiscIssueByIdQuery,
  usePostMiscIssueMutation,
  useUpdateMiscIssueMutation,
  useArchiveMiscIssueMutation,
} = miscIssueApi