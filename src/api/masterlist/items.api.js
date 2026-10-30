import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/items"

export const itemsApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Items"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchItems: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Items"],
      }),
      fetchItemById: builder.query({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method:"GET",
        }),
        providesTags:["Items"],
      }),
      postItem: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Items"],
      }),
      updateItem: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Items"],
      }),
      archiveItem: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Items"],
      }),
    })
  })

export const {
  useFetchItemsQuery,
  useLazyFetchItemsQuery,
  useLazyFetchItemByIdQuery,
  usePostItemMutation,
  useUpdateItemMutation,
  useArchiveItemMutation,
} = itemsApi