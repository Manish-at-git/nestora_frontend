import { baseApi } from "@/services/api/baseApi";
import type {
  Association,
  AssociationStats,
  AssociationSubscriptionPayload,
} from "../types";

export const associationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAssociations: builder.query<Association[], void>({
      query: () => ({
        url: "/admin/associations",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Associations" as const,
                id,
              })),
              { type: "Associations", id: "LIST" },
            ]
          : [{ type: "Associations", id: "LIST" }],
    }),

    getAssociationStats: builder.query<AssociationStats, string>({
      query: (id) => ({
        url: `/admin/associations/${id}/stats`,
        method: "GET",
      }),
    }),

    updateAssociationSubscription: builder.mutation<
      { ok: boolean },
      { id: string; data: AssociationSubscriptionPayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/associations/${id}/subscription`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Associations", id },
        { type: "Associations", id: "LIST" },
      ],
    }),

    onboardAssociation: builder.mutation<
      { ok: boolean; message?: string },
      FormData
    >({
      query: (formData) => ({
        url: "/admin/associations/onboard",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: [{ type: "Associations", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAssociationsQuery,
  useGetAssociationStatsQuery,
  useUpdateAssociationSubscriptionMutation,
  useOnboardAssociationMutation,
} = associationsApi;
