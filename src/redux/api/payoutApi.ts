// payoutApi.ts
import { baseApi } from './baseApi';

export const payoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============================================
    // RIDER PAYOUT ENDPOINTS
    // ============================================

    // 1. Rider: Request Payout
    requestPayout: builder.mutation({
      query: (body) => ({
        url: '/rider-payout/request',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payout', 'RiderProfile'],
    }),

    // 2. Rider: Get My Payout History
    getMyPayoutHistory: builder.query({
      query: (params = {}) => ({
        url: '/rider-payout/history',
        params,
      }),
      providesTags: ['Payout'],
    }),

    // 3. Rider: Get Monthly Payout Summary
    getMonthlyPayoutSummary: builder.query({
      query: () => '/rider-payout/monthly-summary',
      providesTags: ['Payout'],
    }),

    // ============================================
    // ADMIN PAYOUT ENDPOINTS
    // ============================================

    // 4. Admin: Get All Payout Requests
    getAllPayoutRequests: builder.query({
      query: (params = {}) => ({
        url: '/rider-payout/admin/all',
        params,
      }),
      providesTags: ['Payout'],
    }),

    // 5. Admin: Approve Payout
    approvePayout: builder.mutation({
      query: (payoutId) => ({
        url: `/rider-payout/admin/${payoutId}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Payout', 'RiderProfile'],
    }),

    // 6. Admin: Mark Payout as Paid
    markPayoutAsPaid: builder.mutation({
      query: (payoutId) => ({
        url: `/rider-payout/admin/${payoutId}/paid`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Payout', 'RiderProfile'],
    }),

    // 7. Admin: Reject Payout
    rejectPayout: builder.mutation({
      query: ({ payoutId, body }) => ({
        url: `/rider-payout/admin/${payoutId}/reject`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Payout', 'RiderProfile'],
    }),
  }),
});

// ============================================
// EXPORT HOOKS
// ============================================

export const {
  // Rider Hooks
  useRequestPayoutMutation,
  useGetMyPayoutHistoryQuery,
  useGetMonthlyPayoutSummaryQuery,

  // Admin Hooks
  useGetAllPayoutRequestsQuery,
  useApprovePayoutMutation,
  useMarkPayoutAsPaidMutation,
  useRejectPayoutMutation,
} = payoutApi;