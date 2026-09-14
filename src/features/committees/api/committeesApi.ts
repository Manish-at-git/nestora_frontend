import { baseApi } from "@/services/api/baseApi";
import type {
  Committee,
  CreateCommitteePayload,
  UpdateCommitteePayload,
} from "../types";

export const committeesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCommittees: builder.query<Committee[], { assoc_id?: string } | void>({
      query: (params) => {
        const queryParams: Record<string, string> = {};
        if (params && params.assoc_id && params.assoc_id !== "ALL") {
          queryParams.assoc_id = params.assoc_id;
        }
        return {
          url: "/admin/committees",
          method: "GET",
          params: queryParams,
        };
      },
      transformResponse: (response: { ok: boolean; data: Committee[] } | Committee[]) => {
        if (Array.isArray(response)) {
          return response;
        }
        return response?.data || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Committees" as const, id })),
              { type: "Committees", id: "LIST" },
            ]
          : [{ type: "Committees", id: "LIST" }],
    }),

    createCommittee: builder.mutation<
      { ok: boolean; data: { id: string } },
      CreateCommitteePayload
    >({
      query: (data) => ({
        url: "/admin/committees",
        method: "POST",
        data,
      }),
      invalidatesTags: [
        { type: "Committees", id: "LIST" },
        { type: "CommitteeMembers" as any, id: "LIST" },
      ],
    }),

    updateCommittee: builder.mutation<
      { ok: boolean },
      { id: string; data: UpdateCommitteePayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/committees/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Committees", id },
        { type: "Committees", id: "LIST" },
        { type: "CommitteeMembers" as any, id: "LIST" },
      ],
    }),

    getAssociationHomeowners: builder.query<
      import("../types").HomeownerOption[],
      string | number
    >({
      query: (assocId) => ({
        url: `/admin/associations/${assocId}/homeowners`,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response || [],
    }),

    deleteCommittee: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({
        url: `/admin/committees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Committees", id: "LIST" },
        { type: "CommitteeMembers" as any, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCommitteesQuery,
  useLazyGetCommitteesQuery,
  useLazyGetAssociationHomeownersQuery,
  useCreateCommitteeMutation,
  useUpdateCommitteeMutation,
  useDeleteCommitteeMutation,
} = committeesApi;
