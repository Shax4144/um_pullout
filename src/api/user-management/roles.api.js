import { baseApi } from "../baseApi" 

const BASE_ENDPOINT = "api/roles"

export const rolesApi = baseApi
  .enhanceEndpoints({
    addTagTypes: ["Roles"]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchRoles: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Roles"],
      }),
      fetchRoleById: builder.query({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "GET",
        }),
        providesTags: ["Roles"],
      }),
      postRole: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Roles"],
      }),
      updateRole: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Roles"],
      }),
      archiveRole: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Roles"],
      }),
    })
  })

export const {
  useFetchRolesQuery,
  useLazyFetchRolesQuery,
  useFetchRoleByIdQuery,
  useLazyFetchRoleByIdQuery,
  usePostRoleMutation,
  useUpdateRoleMutation,
  useArchiveRoleMutation,
} = rolesApi