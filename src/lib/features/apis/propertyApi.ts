import { IPropertySearch } from "src/@types/property";
import { IPagination, ResponseType } from "src/@types/common";

import api from "./baseApi";

const propertyApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPropertiesSearchList: build.query<ResponseType<{properties: IPropertySearch[], pagination: IPagination}>, {page: number, pageSize: number}>({
      query: (arg) => ({
        url: "admin/property/search/result",
        method: "GET",
        params: arg,
      }),
    }),
  }),
});

export const {
  useGetPropertiesSearchListQuery
} = propertyApi;
export default propertyApi;
