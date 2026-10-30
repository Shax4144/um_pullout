import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/misc-receipts"

export const miscReceiptApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Misc-Receipts"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchMiscReceipts: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Misc-Receipts"],
      }),
      fetchMiscReceiptById: builder.query({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "GET",
        }),
        providesTags: ["Misc-Receipts"],
      }),
      postMiscReceipt: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Misc-Receipts"],
      }),
      updateMiscReceipt: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Misc-Receipts"],
      }),
      archiveMiscReceipt: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Misc-Receipts"],
      }),
    })
  })

export const {
  useFetchMiscReceiptsQuery,
  useLazyFetchMiscReceiptByIdQuery,
  usePostMiscReceiptMutation,
  useUpdateMiscReceiptMutation,
  useArchiveMiscReceiptMutation,
} = miscReceiptApi