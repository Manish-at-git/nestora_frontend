import { baseApi } from "@/services/api/baseApi";
import type { BoardMember, HomeownerOption, BoardMemberFormData } from "../types";

export const boardMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBoardMembers: builder.query<
      BoardMember[],
      { assoc_id?: string | number } | void
    >({
      query: (params) => {
        const assocId = params ? params.assoc_id : undefined;
        return {
          url: "/admin/board-members",
          method: "GET",
          params: assocId ? { assoc_id: assocId } : undefined,
        };
      },
      transformResponse: (response: any) => response?.data || response || [],
      providesTags: ["Committees"],
    }),
    getDirectoryBoardMembers: builder.query<
      BoardMember[],
      { association_id?: string | number } | void
    >({
      query: (params) => {
        const assocId = params ? params.association_id : undefined;
        return {
          url: assocId
            ? `/associations/${assocId}/board-members`
            : "/associations/me/board-members",
          method: "GET",
        };
      },
      transformResponse: (response: any) => response?.data || response || [],
      providesTags: ["Committees"],
    }),
    getAssociationHomeowners: builder.query<
      HomeownerOption[],
      string | number
    >({
      query: (assocId) => ({
        url: `/admin/associations/${assocId}/homeowners`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response || [],
    }),
    addBoardMember: builder.mutation<{ ok: boolean; data?: any }, BoardMemberFormData>({
      query: (body) => ({
        url: "/admin/board-members",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Committees"],
    }),
    endBoardMemberTerm: builder.mutation<{ ok: boolean }, string | number>({
      query: (id) => ({
        url: `/admin/board-members/${id}/end-term`,
        method: "PUT",
      }),
      invalidatesTags: ["Committees"],
    }),
  }),
});

export const {
  useGetAdminBoardMembersQuery,
  useGetDirectoryBoardMembersQuery,
  useLazyGetAssociationHomeownersQuery,
  useAddBoardMemberMutation,
  useEndBoardMemberTermMutation,
} = boardMembersApi;
