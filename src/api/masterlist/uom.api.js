import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/units-of-measurement"

export const UomsApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["UnitOfMeasures"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchUoms: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["UnitOfMeasures"],
      }),
      postUom: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["UnitOfMeasures"],
      }),
      updateUom: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["UnitOfMeasures"],
      }),
      archiveUom: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["UnitOfMeasures"],
      }),
    })
  })

export const {
  useFetchUomsQuery,
  useLazyFetchUomsQuery,
  usePostUomMutation,
  useUpdateUomMutation,
  useArchiveUomMutation,
} = UomsApi