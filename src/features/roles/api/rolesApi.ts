import { baseApi } from "@/services/api/baseApi";
import type { Role, RolePayload, EntityOption } from "../types";

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<Role[], void>({
      query: () => ({
        url: "/admin/roles",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Roles" as const, id })),
              { type: "Roles", id: "LIST" },
            ]
          : [{ type: "Roles", id: "LIST" }],
    }),

    getEntitiesForRoles: builder.query<EntityOption[], void>({
      query: () => ({
        url: "/admin/entities",
        method: "GET",
      }),
      providesTags: [{ type: "Entities", id: "LIST" }],
    }),

    createRole: builder.mutation<Role, RolePayload>({
      query: (data) => ({
        url: "/admin/roles",
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Roles", id: "LIST" }],
    }),

    updateRole: builder.mutation<
      { ok: boolean },
      { id: string; data: RolePayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/roles/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Roles", id },
        { type: "Roles", id: "LIST" },
      ],
    }),

    deleteRole: builder.mutation<{ ok: boolean }, string>({
      query: (id) => ({
        url: `/admin/roles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Roles", id },
        { type: "Roles", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRolesQuery,
  useGetEntitiesForRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;
