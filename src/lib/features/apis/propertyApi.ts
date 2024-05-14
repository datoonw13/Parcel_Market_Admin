
import { IPagination, ResponseType } from "src/@types/common";
import { IPropertySearch, IPropertyAssessment } from "src/@types/property";

import api from "./baseApi";

const propertyApi = api.injectEndpoints({
  endpoints: (build) => ({
    getPropertiesSearchList: build.query<ResponseType<{properties: IPropertySearch[], pagination: IPagination}>, {page: number, pageSize: number, search: string | null}>({
      query: (arg) => ({
        url: "admin/property/search/result",
        method: "GET",
        params: {
          page:arg.page,
          pageSize: arg.pageSize,
          ... arg.search && {search: arg.search}
        },
      }),
    }),
    getPropertiesAssessments: build.query<ResponseType<{properties: IPropertyAssessment[], pagination: IPagination}>, {page: number, pageSize: number, search: string | null}>({
      query: (arg) => ({
        url: "admin/property/assessments",
        method: "GET",
        params: {
          page:arg.page,
          pageSize: arg.pageSize,
          ... arg.search && {search: arg.search}
        }
      }),
      transformResponse: (res: any) => 
        // res.data.properties = res.data.properties.map((el: any) => calculatePropertyPrice(el, 10))
         res
      
    }),
  }),
});

export const {
  useGetPropertiesSearchListQuery,
  useGetPropertiesAssessmentsQuery
} = propertyApi;
export default propertyApi;
