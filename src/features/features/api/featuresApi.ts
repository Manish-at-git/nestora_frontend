import { baseApi } from "@/services/api/baseApi";
import type { Feature, FeaturePayload } from "../types";

export const featuresApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFeatures: builder.query<Feature[], void>({
      query: () => ({
        url: "/admin/features",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Features" as const, id })),
              { type: "Features", id: "LIST" },
            ]
          : [{ type: "Features", id: "LIST" }],
    }),

    createFeature: builder.mutation<Feature, FeaturePayload>({
      query: (data) => ({
        url: "/admin/features",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Features", id: "LIST" }],
    }),

    updateFeature: builder.mutation<
      { ok: boolean },
      { id: string; data: FeaturePayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/features/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Features", id },
        { type: "Features", id: "LIST" },
      ],
    }),

    deleteFeature: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({
        url: `/admin/features/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Features", id },
        { type: "Features", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFeaturesQuery,
  useCreateFeatureMutation,
  useUpdateFeatureMutation,
  useDeleteFeatureMutation,
} = featuresApi;
