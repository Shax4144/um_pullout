import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/warehouses"

export const warehousesApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Warehouses"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchWarehouses: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Warehouses"],
      }),
      postWarehouse: builder.mutation({
        query: (categoryData) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body: categoryData,
        }),
        invalidatesTags: ["Warehouses"],
      }),
      updateWarehouse: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Warehouses"],
      }),
      archiveWarehouse: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Warehouses"],
      }),
    })
  })

export const {
  useFetchWarehousesQuery,
  useLazyFetchCategoriesQuery,
  usePostWarehouseMutation,
  useUpdateWarehouseMutation,
  useArchiveWarehouseMutation,
} = warehousesApi