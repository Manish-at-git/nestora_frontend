import baseApi from "@/services/api/baseApi";
import type { Vendor, VendorCreatePayload, VendorUpdatePayload } from "../types";

export const vendorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query<Vendor[], void>({
      query: () => ({
        url: "/admin/vendors",
        method: "GET",
      }),
      transformResponse: (response: { ok?: boolean; vendors?: Vendor[] } | Vendor[]) => {
        if (Array.isArray(response)) return response;
        return response.vendors || [];
      },
      providesTags: ["Vendors"],
    }),

    createVendor: builder.mutation<{ ok: boolean; id: string; message: string }, VendorCreatePayload>({
      query: (data) => ({
        url: "/admin/vendors",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Vendors"],
    }),

    updateVendor: builder.mutation<
      { ok: boolean; message: string },
      { id: string; data: VendorUpdatePayload }
    >({
      query: ({ id, data }) => ({
        url: `/admin/vendors/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Vendors"],
    }),

    deleteVendor: builder.mutation<{ ok: boolean; message: string }, string>({
      query: (id) => ({
        url: `/admin/vendors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vendors"],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorsApi;
