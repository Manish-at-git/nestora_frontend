import { baseApi } from "@/services/api/baseApi";
import type {
  SubscriptionPlan,
  SubscriptionPlanCreatePayload,
  SubscriptionPlanUpdatePayload,
  SetPlanFeaturesPayload,
} from "../types";

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPlans: builder.query<SubscriptionPlan[], void>({
      query: () => ({
        url: "/admin/subscription-plans",
        method: "GET",
      }),
      transformResponse: (
        res: { ok: boolean; data: SubscriptionPlan[] } | SubscriptionPlan[]
      ) => {
        if (Array.isArray(res)) return res;
        return res?.data || [];
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "SubscriptionPlans" as const,
                id,
              })),
              { type: "SubscriptionPlans", id: "LIST" },
            ]
          : [{ type: "SubscriptionPlans", id: "LIST" }],
    }),

    createSubscriptionPlan: builder.mutation<
      { ok: boolean; id: string },
      SubscriptionPlanCreatePayload
    >({
      query: (data) => ({
        url: "/admin/subscription-plans",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "SubscriptionPlans", id: "LIST" }],
    }),

    updateSubscriptionPlan: builder.mutation<
      { ok: boolean },
      { id: string; data: SubscriptionPlanUpdatePayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/subscription-plans/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SubscriptionPlans", id },
        { type: "SubscriptionPlans", id: "LIST" },
      ],
    }),

    deleteSubscriptionPlan: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({
        url: `/admin/subscription-plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "SubscriptionPlans", id },
        { type: "SubscriptionPlans", id: "LIST" },
      ],
    }),

    setSubscriptionPlanFeatures: builder.mutation<
      { ok: boolean },
      SetPlanFeaturesPayload
    >({
      query: ({ plan_id, feature_ids }) => ({
        url: `/admin/subscription-plans/${plan_id}/features`,
        method: "POST",
        data: { feature_ids },
      }),
      invalidatesTags: (_result, _error, { plan_id }) => [
        { type: "SubscriptionPlans", id: plan_id },
        { type: "SubscriptionPlans", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useSetSubscriptionPlanFeaturesMutation,
} = subscriptionsApi;
