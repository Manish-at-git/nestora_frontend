import { baseApi } from "@/services/api/baseApi";
import type {
  EntityType,
  CreateEntityTypePayload,
  UpdateEntityTypePayload,
} from "../types";

export const entityTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEntityTypes: builder.query<EntityType[], void>({
      query: () => ({
        url: "/admin/entity-types",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "EntityTypes" as const, id })),
              { type: "EntityTypes", id: "LIST" },
            ]
          : [{ type: "EntityTypes", id: "LIST" }],
    }),

    createEntityType: builder.mutation<EntityType, CreateEntityTypePayload>({
      query: (data) => ({
        url: "/admin/entity-types",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "EntityTypes", id: "LIST" }],
    }),

    updateEntityType: builder.mutation<
      { ok: boolean },
      { id: string; data: UpdateEntityTypePayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/entity-types/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "EntityTypes", id },
        { type: "EntityTypes", id: "LIST" },
      ],
    }),

    deleteEntityType: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({
        url: `/admin/entity-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "EntityTypes", id: "LIST" }],
    }),
  }),
});

export const {
  useGetEntityTypesQuery,
  useCreateEntityTypeMutation,
  useUpdateEntityTypeMutation,
  useDeleteEntityTypeMutation,
} = entityTypesApi;
