import { createSelector } from "@reduxjs/toolkit";

import { IUser } from "src/@types/users";
import { ISignIn } from "src/@types/auth";
import { ResponseType } from "src/@types/common";

import api from "./baseApi";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation<ResponseType<{access_token: string, payload: IUser}>, ISignIn>({
      query: (arg) => ({
        url: "admin/auth",
        method: "POST",
        body: arg,
      }),
    }),
    getUser: build.query<ResponseType<IUser>, void>({
      query: (arg) => ({
        url: "admin/user/profile",
        method: "GET",
        body: arg,
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useLazyGetUserQuery
} = authApi;
export default authApi;

export const selectAuthedUser = createSelector(authApi.endpoints.getUser.select(), (res) => res?.data);