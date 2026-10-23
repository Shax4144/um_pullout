import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/misc-receipts"

export const miscReceiptApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Misc-Receipt"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchMiscReceipts: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Misc-Receipt"],
      }),
      fetchReceipt: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Misc-Receipt"],
      }),
      postMiscReceipt: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Misc-Receipt"],
      }),
      updateMiscReceipt: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Misc-Receipt"],
      }),
      archiveMiscReceipt: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Misc-Receipt"],
      }),
    })
  })

export const {
  useFetchMiscReceiptsQuery,
  useFetchReceiptQuery,
  useLazyFetchReceiptQuery,
  usePostMiscReceiptMutation,
  useUpdateMiscReceiptMutation,
  useArchiveMiscReceiptMutation,
} = miscReceiptApi