import baseApi from "@/services/api/baseApi";
import type {
  FinancialReport,
  FinancialReportCreatePayload,
  ChartOfAccount,
} from "../types";

export const financialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFinancialReports: builder.query<FinancialReport[], void>({
      query: () => ({
        url: "/admin/financial-reports",
        method: "GET",
      }),
      transformResponse: (response: FinancialReport[] | { ok?: boolean; reports?: FinancialReport[] }) => {
        if (Array.isArray(response)) return response;
        return response.reports || [];
      },
      providesTags: ["Financials"],
    }),

    createFinancialReport: builder.mutation<
      { ok: boolean; id: string; message: string },
      FinancialReportCreatePayload
    >({
      query: (data) => ({
        url: "/admin/financial-reports",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Financials"],
    }),

    getGlobalCOA: builder.query<ChartOfAccount[], void>({
      query: () => ({
        url: "/admin/global-coa",
        method: "GET",
      }),
      transformResponse: (response: ChartOfAccount[] | { ok?: boolean; coa?: ChartOfAccount[] }) => {
        if (Array.isArray(response)) return response;
        return response.coa || [];
      },
      providesTags: ["Financials"],
    }),

    uploadGlobalCOA: builder.mutation<
      { ok: boolean; message: string },
      FormData
    >({
      query: (formData) => ({
        url: "/admin/global-coa/upload",
        method: "POST",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      invalidatesTags: ["Financials"],
    }),
  }),
});

export const {
  useGetFinancialReportsQuery,
  useCreateFinancialReportMutation,
  useGetGlobalCOAQuery,
  useUploadGlobalCOAMutation,
} = financialsApi;
