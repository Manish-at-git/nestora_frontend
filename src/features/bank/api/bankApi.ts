import baseApi from "@/services/api/baseApi";
import type {
  BankAccount,
  BankAccountCreatePayload,
  BankAccountUpdatePayload,
} from "../types";

export const bankApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBankAccounts: builder.query<BankAccount[], { associationId?: string } | void>({
      query: (params) => ({
        url: "/admin/bank-accounts",
        method: "GET",
        params: params?.associationId ? { association_id: params.associationId } : undefined,
      }),
      transformResponse: (response: BankAccount[] | { ok?: boolean; bank_accounts?: BankAccount[] }) => {
        if (Array.isArray(response)) return response;
        return response.bank_accounts || [];
      },
      providesTags: ["Bank"],
    }),

    createBankAccount: builder.mutation<
      { ok: boolean; id: string; message: string },
      BankAccountCreatePayload
    >({
      query: (data) => ({
        url: "/admin/bank-accounts",
        method: "POST",
        data,
      }),
      invalidatesTags: ["Bank"],
    }),

    updateBankAccount: builder.mutation<
      { ok: boolean; message: string },
      { accountId: string; data: BankAccountUpdatePayload }
    >({
      query: ({ accountId, data }) => ({
        url: `/admin/bank-accounts/${accountId}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["Bank"],
    }),

    deleteBankAccount: builder.mutation<
      { ok: boolean; message: string },
      string
    >({
      query: (accountId) => ({
        url: `/admin/bank-accounts/${accountId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bank"],
    }),
  }),
});

export const {
  useGetBankAccountsQuery,
  useCreateBankAccountMutation,
  useUpdateBankAccountMutation,
  useDeleteBankAccountMutation,
} = bankApi;
