import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/categories"

export const categoriesApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Categories"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchCategories: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Categories"],
      }),
      postCategory: builder.mutation({
        query: (categoryData) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body: categoryData,
        }),
        invalidatesTags: ["Categories"],
      }),
      updateCategory: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Categories"],
      }),
      archiveCategory: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Categories"],
      }),
    })
  })

export const {
  useFetchCategoriesQuery,
  useLazyFetchCategoriesQuery,
  usePostCategoryMutation,
  useUpdateCategoryMutation,
  useArchiveCategoryMutation,
} = categoriesApi