import { IUser } from "src/@types/users";
import { IPagination } from "src/@types/common";

import api from "./baseApi";

const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<{data: IUser[], pagination: IPagination}, {page: number, pageSize: number, search: string | null}>({
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
    getEmails: build.query({
      query: (arg: void) => ({
        url: "admin/download/email-subscriptions",
        method: "GET",
        responseHandler: async (response) => window.location.assign(window.URL.createObjectURL(await response.blob())),
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetEmailsQuery
} = usersApi;
export default usersApi;
