import { baseApi } from "@/services/api/baseApi";
import type { Account, UserProfile } from "@/types/auth";

export interface LoginResponse {
  token: string;
  account: Account;
  profile?: UserProfile;
}

export interface UserDetailsResponse {
  name: string;
  email: string;
  contact_number: string;
  address: string;
  role?: string;
  association_id?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<{ account: Account; profile: UserProfile }, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth", "UserProfile"],
    }),
    loginCode: builder.mutation<{ already_registered: boolean; ok?: boolean }, { code: string }>({
      query: (body) => ({
        url: "/login-code",
        method: "POST",
        data: body,
      }),
    }),
    requestCode: builder.mutation<
      { ok: boolean; message?: string },
      { name: string; email: string; contact_number: string }
    >({
      query: (body) => ({
        url: "/request-code",
        method: "POST",
        data: body,
      }),
    }),
    getUserDetails: builder.query<UserDetailsResponse, string>({
      query: (code) => ({
        url: `/user-details`,
        method: "GET",
        params: { code },
      }),
    }),
    createAccount: builder.mutation<
      LoginResponse,
      { code: string; email: string; password: string; confirm_password?: string }
    >({
      query: (body) => ({
        url: "/create-account",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Auth", "UserProfile"],
    }),
    updateDetailsRequest: builder.mutation<
      { ok: boolean; message?: string },
      {
        code: string;
        requested_name?: string;
        requested_address?: string;
        requested_email?: string;
        requested_contact?: string;
        note?: string;
      }
    >({
      query: (body) => ({
        url: "/update-details-request",
        method: "POST",
        data: body,
      }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginCodeMutation,
  useRequestCodeMutation,
  useGetUserDetailsQuery,
  useCreateAccountMutation,
  useUpdateDetailsRequestMutation,
} = authApi;
