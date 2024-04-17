import { IUser, ISignIn } from "src/@types/auth";
import { ResponseType } from "src/@types/common";

import api from "./baseApi";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation<ResponseType<{access_token: string, payload: IUser}>, ISignIn>({
      query: (arg) => ({
        url: "auth",
        method: "POST",
        body: arg,
      }),
    }),
  }),
});

export const {
  useSignInMutation
} = authApi;
export default authApi;
