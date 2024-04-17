import { IUser } from "src/@types/auth";
import { ResponseType } from "src/@types/common";

import api from "./baseApi";

const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<ResponseType<IUser[]>, {page: number, pageSize: number}>({
      query: (arg) => ({
        url: "admin/users",
        method: "GET",
        params: arg,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery
} = usersApi;
export default usersApi;
