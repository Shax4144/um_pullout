import { baseApi } from "../baseApi";

const BASE_ENDPOINT = "api/inventory-mrp";

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
    }),
  });

export const {
  useFetchInventoryMrpQuery,
  useLazyFetchInventoryMrpQuery,
  useLazyFetchInventoryMrpByIdQuery,
} = inventoryMrpApi;
