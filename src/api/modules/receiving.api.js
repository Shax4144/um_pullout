import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/stocks"

export const receivingApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Receiving"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchReceiving: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Receiving"],
      }),
      fetchReceivingById: builder.query({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "GET",
        }),
        providesTags: ["Receiving"],
      }),
      postReceiving: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Receiving"],
      }),
      updateReceiving: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Receiving"],
      }),
      archiveReceiving: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Receiving"],
      }),
    })
  })

export const {
  useFetchReceivingQuery,
  useLazyFetchReceivingQuery,
  useLazyFetchReceivingByIdQuery,
  usePostReceivingMutation,
  useUpdateReceivingMutation,
  useArchiveReceivingMutation,
} = receivingApi