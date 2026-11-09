import { baseApi } from "../baseApi";

const BASE_ENDPOINT = "api/stock-on-hand-summary";

export const inventoryMrpApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["InventoryMrp"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchInventoryMrp: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["InventoryMrp"],
      }),
      fetchInventoryMrpById: builder.query({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "GET",
        }),
        providesTags: ["InventoryMrp"],
      }),
      extractInventoryMrp: builder.mutation({
        query: () => ({
          url: `${BASE_ENDPOINT}/export`,
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          responseHandler: (response) => response.blob(),
        }),
      }),
    }),
  });

export const {
  useFetchInventoryMrpQuery,
  useLazyFetchInventoryMrpQuery,
  useLazyFetchInventoryMrpByIdQuery,
  useExtractInventoryMrpMutation,
} = inventoryMrpApi;
