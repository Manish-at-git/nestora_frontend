import { baseApi } from "@/services/api/baseApi";
import type {
  Committee,
  CommitteeMember,
  HomeownerOption,
  CommitteeMemberFormData,
} from "../types";

export const committeeMembersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCommitteeMembers: builder.query<
      CommitteeMember[],
      { assoc_id?: string | number } | void
    >({
      query: (params) => {
        const assocId = params ? params.assoc_id : undefined;
        return {
          url: "/admin/committee-members",
          method: "GET",
          params: assocId && String(assocId) !== "ALL" ? { assoc_id: assocId } : undefined,
        };
      },
      transformResponse: (response: any) => response?.data || response || [],
      providesTags: ["Committees"],
    }),

    getDirectoryCommitteeMembers: builder.query<
      CommitteeMember[],
      { association_id?: string | number } | void
    >({
      query: (params) => {
        const assocId = params ? params.association_id : undefined;
        return {
          url: assocId && String(assocId) !== "ALL"
            ? `/associations/${assocId}/committee-members`
            : "/associations/me/committee-members",
          method: "GET",
        };
      },
      transformResponse: (response: any) => response?.data || response || [],
      providesTags: ["Committees"],
    }),

    getCommittees: builder.query<
      Committee[],
      { assoc_id?: string | number } | void
    >({
      query: (params) => {
        const assocId = params ? params.assoc_id : undefined;
        return {
          url: "/admin/committees",
          method: "GET",
          params: assocId && String(assocId) !== "ALL" ? { assoc_id: assocId } : undefined,
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

    assignCommitteeMember: builder.mutation<
      { ok: boolean },
      CommitteeMemberFormData
    >({
      query: (body) => ({
        url: "/admin/committee-members",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Committees"],
    }),

    updateCommitteeMember: builder.mutation<
      { ok: boolean },
      { committee_id: string | number; user_id: string | number; data: Partial<CommitteeMemberFormData> }
    >({
      query: ({ committee_id, user_id, data }) => ({
        url: `/admin/committee-members/${committee_id}/${user_id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Committees"],
    }),

    removeCommitteeMember: builder.mutation<
      { ok: boolean },
      { committee_id: string | number; user_id: string | number } | string | number
    >({
      query: (arg) => {
        if (typeof arg === "object" && arg !== null && "committee_id" in arg) {
          return {
            url: `/admin/committee-members/${arg.committee_id}/${arg.user_id}`,
            method: "DELETE",
          };
        }
        return {
          url: `/admin/committee-members/${arg}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Committees"],
    }),
  }),
});

export const {
  useGetAdminCommitteeMembersQuery,
  useGetDirectoryCommitteeMembersQuery,
  useGetCommitteesQuery,
  useLazyGetAssociationHomeownersQuery,
  useAssignCommitteeMemberMutation,
  useUpdateCommitteeMemberMutation,
  useRemoveCommitteeMemberMutation,
} = committeeMembersApi;

