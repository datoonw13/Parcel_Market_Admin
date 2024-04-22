import { IUser } from "src/@types/users";
import { IPagination, ResponseType } from "src/@types/common";

import api from "./baseApi";

const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<ResponseType<{users: IUser[], pagination: IPagination}>, {page: number, pageSize: number, search: string | null}>({
      query: (arg) => ({
        url: "admin/users",
        method: "GET",
        params: {
          page:arg.page,
          pageSize: arg.pageSize,
          ... arg.search && {search: arg.search}
        },
      }),
    }),
  }),
});

export const {
  useGetUsersQuery
} = usersApi;
export default usersApi;
