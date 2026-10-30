import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/move-orders"

export const moveOrdersApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["MoveOrders"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchMoveOrders: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["MoveOrders"],
      }),
      fetchMoveOrderById: builder.query({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "GET",
        }),
        providesTags: ["MoveOrders"],
      }),
      postMoveOrder: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["MoveOrders", "StockOnHand"],
      }),
      updateMoveOrder: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["MoveOrders", "StockOnHand"],
      }),
      archiveMoveOrder: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["MoveOrders", "StockOnHand"],
      }),
    })
  })

export const {
  useFetchMoveOrdersQuery,
  useFetchMoveOrderByIdQuery,
  useLazyFetchMoveOrderByIdQuery,
  usePostMoveOrderMutation,
  useUpdateMoveOrderMutation,
  useArchiveMoveOrderMutation,
} = moveOrdersApi