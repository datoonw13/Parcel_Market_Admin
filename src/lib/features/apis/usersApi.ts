import { IUser } from "src/@types/auth";
import { ResponseType } from "src/@types/common";

import api from "./baseApi";

const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<ResponseType<IUser>, void>({
      query: (arg) => ({
        url: "admin/users",
        method: "GET",
        body: arg,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery
} = usersApi;
export default usersApi;
