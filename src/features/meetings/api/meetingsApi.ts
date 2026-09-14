import { baseApi } from "@/services/api/baseApi";
import type { Meeting, MeetingFormData, MeetingMinutesFormData } from "../types";

export const meetingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeetings: builder.query<Meeting[], string | number | undefined>({
      query: (associationId) => ({
        url: "/meetings",
        params:
          associationId && associationId !== "ALL"
            ? { association_id: associationId }
            : undefined,
      }),
      transformResponse: (response: { ok: boolean; data: Meeting[] }) =>
        response.data || [],
      providesTags: ["Meetings"],
    }),

    createMeeting: builder.mutation<
      { ok: boolean },
      MeetingFormData
    >({
      query: (formData) => ({
        url: "/meetings",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["Meetings"],
    }),

    updateMeetingDetails: builder.mutation<
      { ok: boolean; message: string },
      { id: string | number } & MeetingFormData
    >({
      query: ({ id, ...formData }) => ({
        url: `/meetings/${id}/details`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["Meetings"],
    }),

    addMeetingMinutes: builder.mutation<
      { ok: boolean; message: string },
      { id: string | number } & MeetingMinutesFormData
    >({
      query: ({ id, ...formData }) => ({
        url: `/meetings/${id}/minutes`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["Meetings"],
    }),

    updateMeetingAttendance: builder.mutation<
      { ok: boolean },
      { id: string | number; status: "Yes" | "No" | "Maybe" | string }
    >({
      query: ({ id, status }) => ({
        url: `/meetings/${id}/attendance`,
        method: "POST",
        data: { status },
      }),
      invalidatesTags: ["Meetings"],
    }),
  }),
});

export const {
  useGetMeetingsQuery,
  useCreateMeetingMutation,
  useUpdateMeetingDetailsMutation,
  useAddMeetingMinutesMutation,
  useUpdateMeetingAttendanceMutation,
} = meetingsApi;
