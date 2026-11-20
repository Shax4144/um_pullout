import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import queryString from "query-string";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_REACT_APP_LOCAL_PORT,

  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");

    const token = localStorage.getItem("access_token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      headers.delete("Authorization");
    }

    return headers;
  },

  paramsSerializer: (params) => {
    return queryString.stringify(params, {
      skipNull: true,
      skipEmptyString: true,
    });
  },
});

const baseQueryWithAuthCheck = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const requestUrl = typeof args === "string" ? args : args?.url;

  const isLogoutRequest = requestUrl?.includes("api/logout");

  if (result?.error?.status === 401 && !isLogoutRequest) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("lastAuthorizedPath");

    api.dispatch({ type: "auth/unauthenticate" });

    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithAuthCheck,
  endpoints: () => ({}),
});
