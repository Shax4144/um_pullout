import { baseApi } from "../baseApi";

const BASE_ENDPOINT = "api/users";

export const usersApi = baseApi
  .injectEndpoints({
    endpoints: (builder) => ({
      fetchUserAccounts: builder.query({
        query: (params) => ({
          url: BASE_ENDPOINT,
          method: "GET",
          params,
        }),
        providesTags: ["Users"],
      }),
      postUserAccount: builder.mutation({
        query: (body) => ({
          url: BASE_ENDPOINT,
          method: "POST",
          body,
        }),
        invalidatesTags: ["Users", "PendingUsers"],
      }),
      updateUserAccount: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["Users"],
      }),
      archiveUserAccount: builder.mutation({
        query: (id) => ({
          url: `${BASE_ENDPOINT}/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Users"],
      }),
    }),
  });

export const {
  useFetchUserAccountsQuery,
  useLazyFetchUserAccountsQuery,
  usePostUserAccountMutation,
  useUpdateUserAccountMutation,
  useArchiveUserAccountMutation,
} = usersApi;