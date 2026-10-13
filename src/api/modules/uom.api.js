import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/uoms"

export const UomsApi = baseApi
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchUoms: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Uoms"],
      }),
      postUom: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Uoms"],
      }),
      updateUom: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Uoms"],
      }),
      archiveUom: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Uoms"],
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