import { baseApi } from "@/services/api/baseApi";
import type {
  CreatePreApprovedVisitorPayload,
  CreatePreApprovedVisitorResponse,
  PublicVisitorPassResponse,
  PreApprovedVisitorsResponse,
} from "../types";

export const visitorManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPreApprovedVisitors: builder.query<PreApprovedVisitorsResponse, void>({
      query: () => ({
        url: "/resident/preapproved-visitors",
        method: "GET",
      }),
      providesTags: [{ type: "Visitors", id: "PREAPPROVED_LIST" }],
    }),
    getPublicVisitorPass: builder.query<PublicVisitorPassResponse, string>({
      query: (passCode) => ({
        url: `/public/visitor-passes/${encodeURIComponent(passCode)}`,
        method: "GET",
      }),
    }),
    createPreApprovedVisitor: builder.mutation<
      CreatePreApprovedVisitorResponse,
      CreatePreApprovedVisitorPayload
    >({
      query: (data) => ({
        url: "/resident/preapproved-visitors",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Visitors", id: "PREAPPROVED_LIST" }],
    }),
    cancelPreApprovedVisitor: builder.mutation<{ ok: boolean }, string>({
      query: (passId) => ({
        url: `/resident/preapproved-visitors/${passId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Visitors", id: "PREAPPROVED_LIST" }],
    }),
  }),
});

export const {
  useGetPreApprovedVisitorsQuery,
  useGetPublicVisitorPassQuery,
  useCreatePreApprovedVisitorMutation,
  useCancelPreApprovedVisitorMutation,
} = visitorManagementApi;
