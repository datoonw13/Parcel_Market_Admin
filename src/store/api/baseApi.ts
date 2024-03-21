import type { Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FetchArgs, BaseQueryFn, FetchBaseQueryError } from '@reduxjs/toolkit/query';

const getTokensFromLocalStorage = () => {
  const access_token = localStorage.getItem('access_token');
  const refresh_token = localStorage.getItem('refresh_token');
  return access_token && refresh_token ? { access_token, refresh_token } : null;
};

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_BACKEND_API_KEY}`,
  prepareHeaders: async (headers, arg) => {
    headers.set(
      'authorization',
      `Bearer ${
        arg.endpoint === 'checkToken'
          ? getTokensFromLocalStorage()?.refresh_token
          : getTokensFromLocalStorage()?.access_token
      }`,
    );
    try {
      const selectedClinic = JSON.parse(localStorage.getItem('selectedClinic') || '') as any;
      if (selectedClinic) {
        headers.set('Activeentityid', selectedClinic?.clinicId);
      }
    } catch (error) { /* empty */ }
    return headers;
  },
});

const refreshBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.REACT_APP_BACKEND_API_KEY}`,
  prepareHeaders: async (headers) => {
    headers.set('authorization', `Bearer ${localStorage.getItem('refresh_token')}`);
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (typeof args !== 'string' && args.url.includes('refresh-token') && result?.error) {
    // Logoout
    return result;
  }
  // Refresh token flow
  if (typeof args !== 'string' && !args.url.includes('auth') && result?.error?.status === 401) {
    // TODO: set refrtehs token url
    const refreshResult = await refreshBaseQuery(
      {
        url: 'API.httpUrls.refreshToken',
        method: 'POST',
        body: { refresh_token: getTokensFromLocalStorage()?.refresh_token },
      },
      api,
      extraOptions,
    );
    const res = refreshResult?.data as any;
    if (refreshResult.error) {
      // Logoout
      return refreshResult;
    }
    if (res?.access_token) {
      localStorage.setItem('access_token', res.access_token);
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Logoout
      return result;
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithRefreshToken,
  endpoints: () => ({}),
});

export default baseApi;


export const rtkQueryErrorLogger: Middleware = (_api: MiddlewareAPI) => (next) => (action: any) => {
  if (action.type.includes('fulfilled') && action?.payload?.message) {
    // toast.success(action?.payload?.message);
    // TODO: show error
  }
  if (action.type.includes('rejected') && action?.payload?.data?.message) {
    // TODO: show unauthorized error message
    // if (!toast.isActive('unauthorized')) {
    //   toast.error(action?.payload?.data?.message, {
    //     toastId: 'unauthorized',
    //   });
    // }
  }
  return next(action);
};