// import toast from "react-hot-toast";
import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import SnackbarUtils from 'src/utils/snackbar'

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: async (headers) => {
    headers.set("authorization", `Bearer ${localStorage.getItem("token")}`);
    return headers;
  },
});

export const rtkQueryErrorLogger: Middleware = (_api: MiddlewareAPI) => (next) => (action: any) => {
  if (action.type.includes("rejected")) {
    let errorMessage = "Something went wrong";
    if(action.payload.status === 401) {
      return next(action)
    }
    if (typeof action?.payload?.data?.message === "string") {
      errorMessage = action?.payload?.data?.message;
    }
    if (typeof action?.payload?.data?.message === "object") {
      errorMessage = action?.payload?.data?.message[0];
    }
    SnackbarUtils.error(errorMessage)
  }

  return next(action);
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  endpoints: () => ({}),
});

export default baseApi;
