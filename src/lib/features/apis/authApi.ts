import api from "./baseApi";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation<any, any>({
      query: (arg) => ({
        url: "user/auth",
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
