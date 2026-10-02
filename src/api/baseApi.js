import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import queryString from "query-string";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_REACT_APP_LOCAL_PORT_1,
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json");
    headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);
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

  if (result?.error?.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: [
    
  ],
  baseQuery: baseQueryWithAuthCheck,
  endpoints: () => ({}),
});
