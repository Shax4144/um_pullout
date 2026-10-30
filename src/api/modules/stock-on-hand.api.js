import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/stock-on-hand"

export const stockOnHandApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["StockOnHand"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchStockOnHand: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["StockOnHand"],
      }),
    })
  })

export const {
  useFetchStockOnHandQuery,
  useLazyFetchStockOnHandQuery,
} = stockOnHandApi