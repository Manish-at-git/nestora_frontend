import { baseApi } from "@/services/api/baseApi";
import type {
  Amenity,
  AmenityBooking,
  MonthBookingSlot,
  AmenityCreateInput,
  AmenityBookingInput,
} from "../types";

export const amenitiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAmenities: builder.query<Amenity[], string | number | undefined>({
      query: (associationId) => ({
        url: `/associations/${associationId}/amenities`,
      }),
      providesTags: ["Amenities"],
    }),

    getAdminAmenities: builder.query<Amenity[], string | number | undefined>({
      query: (associationId) => ({
        url: `/admin/associations/${associationId}/amenities`,
      }),
      providesTags: ["Amenities"],
    }),

    createAmenity: builder.mutation<
      { ok: boolean; id: string | number; message: string },
      { associationId: string | number; data: AmenityCreateInput }
    >({
      query: ({ associationId, data }) => ({
        url: `/admin/associations/${associationId}/amenities`,
        method: "POST",
        data: {
          name: data.name,
          charges: data.charges,
          status: data.status !== undefined ? data.status : true,
        },
      }),
      invalidatesTags: ["Amenities"],
    }),

    updateAmenityStatus: builder.mutation<
      { ok: boolean; message: string },
      { associationId: string | number; amenityId: string | number; status: boolean }
    >({
      query: ({ associationId, amenityId, status }) => ({
        url: `/admin/associations/${associationId}/amenities/${amenityId}`,
        method: "PUT",
        data: { status },
      }),
      invalidatesTags: ["Amenities"],
    }),

    getAmenityMonthBookings: builder.query<
      MonthBookingSlot[],
      { amenityId: string | number; month: string }
    >({
      query: ({ amenityId, month }) => ({
        url: `/amenities/${amenityId}/bookings`,
        params: { month },
      }),
      providesTags: ["Amenities"],
    }),

    getMyBookings: builder.query<AmenityBooking[], void>({
      query: () => ({
        url: "/amenities/my-bookings",
      }),
      providesTags: ["Amenities"],
    }),

    getAssociationBookings: builder.query<AmenityBooking[], string | number | undefined>({
      query: (associationId) => ({
        url: `/admin/associations/${associationId || "ALL"}/amenity-bookings`,
      }),
      providesTags: ["Amenities"],
    }),

    bookAmenity: builder.mutation<
      { ok: boolean; booking_id: string | number; message: string },
      { amenityId: string | number; payload: AmenityBookingInput }
    >({
      query: ({ amenityId, payload }) => ({
        url: `/amenities/${amenityId}/book`,
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["Amenities", "Wallet"],
    }),
  }),
});

export const {
  useGetAmenitiesQuery,
  useGetAdminAmenitiesQuery,
  useCreateAmenityMutation,
  useUpdateAmenityStatusMutation,
  useGetAmenityMonthBookingsQuery,
  useLazyGetAmenityMonthBookingsQuery,
  useGetMyBookingsQuery,
  useGetAssociationBookingsQuery,
  useBookAmenityMutation,
} = amenitiesApi;
