import { baseApi } from "../baseApi";

const BASE_ENDPOINT = "api/transfers";

export const transferApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Transfer"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchTransferItems: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Transfer"],
      }),
      fetchTransferItemById: builder.query({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "GET",
        }),
        providesTags: ["Transfer"],
      }),
      createTranferItem: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Transfer", "StockOnHand"],
      }),
      acceptTranferItem: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}/accept`,
          method: "POST",
        }),
        invalidatesTags: ["Transfer", "StockOnHand"],
      }),
      rejectTranferItem: builder.mutation({
        query: ({ id, reason }) => ({
          url: `${BASE_ENDPOINT}/${id}/reject`,
          method: "POST",
          body: {
            reason,
          },
        }),
        invalidatesTags: ["Transfer", "StockOnHand"],
      }),
      updateTranferItem: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Transfer"],
      }),
      archiveTranferItem: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Transfer"],
      }),
    }),
  });

export const {
  useFetchTransferItemsQuery,
  useLazyFetchTransferItemsQuery,
  useLazyFetchTransferItemByIdQuery,
  useCreateTranferItemMutation,
  useAcceptTranferItemMutation,
  useRejectTranferItemMutation,
  useUpdateTranferItemMutation,
  useArchiveTranferItemMutation,
} = transferApi;
