

import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ===== User endpoints =====
        createOrder: builder.mutation({
            query: (data) => ({
                url: '/order/place-order',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Orders'],
        }),
        getMyOrders: builder.query({
            query: (params) => ({
                url: '/order/my-orders',
                method: 'GET',
                params,
            }),
            providesTags: ['Orders'],
        }),
        getMyOrderById: builder.query({
            query: (id) => ({
                url: `/order/my-orders/${id}`,
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),
        cancelOrder: builder.mutation({
            query: (arg: string | { id: string; reason?: string }) => {
                const id = typeof arg === "string" ? arg : arg.id;
                const body = typeof arg === "object" && arg.reason ? { reason: arg.reason } : {};
                return {
                    url: `/order/cancel/${id}`,
                    method: 'PATCH',
                    body,
                };
            },
            invalidatesTags: ['Orders'],
        }),
        trackOrder: builder.query({
            query: ({ orderNumber, phone }: { orderNumber: string; phone?: string }) => ({
                url: `/order/track/${orderNumber}`,
                method: 'GET',
                params: phone ? { phone } : undefined,
            }),
            providesTags: ['Orders'],
        }),

        // ===== Admin endpoints =====
        getAdminOrders: builder.query({
            query: (params) => ({
                url: '/order/admin/all',
                method: 'GET',
                params,
            }),
            providesTags: ['Orders'],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/order/admin/status/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Orders'],
        }),

        // ===== Rider endpoints =====
        getAvailableOrders: builder.query({
            query: (params) => ({
                url: '/order/available-orders', // ✅ /v1 prefix baseApi এর baseUrl এ আগে থেকেই আছে ধরে নিচ্ছি
                method: 'GET',
                params, // ✅ { showAllAreas, page, limit } পাঠানো যাবে
            }),
            providesTags: ['Orders'],
        }),
        getMyAssignedOrders: builder.query({
            query: () => ({
                url: '/order/rider/my-orders',
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),
        acceptOrder: builder.mutation({
            query: (id) => ({
                url: `/order/rider/${id}/accept`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Orders'],
        }),
        rejectOrder: builder.mutation({
            query: (id) => ({
                url: `/order/rider/${id}/reject`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Orders'],
        }),
        markOutForDelivery: builder.mutation({
            query: (id) => ({
                url: `/order/rider/${id}/out-for-delivery`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Orders'],
        }),
        markDelivered: builder.mutation({
            query: (id) => ({
                url: `/order/rider/${id}/delivered`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Orders'],
        }),
        markReturned: builder.mutation({
            query: ({ id, ...body }: { id: string; returnReason?: string; returnCondition?: string; returnNote?: string }) => ({
                url: `/order/rider/${id}/return`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Orders'],
        }),
        getOrderDetails: builder.query({
            query: (id) => ({
                url: `/order/details/${id}`,
                method: 'GET',
            }),
            providesTags: ['Orders'],
        }),
    }),
    overrideExisting: true,
});

export const {
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useGetMyOrderByIdQuery,
    useCancelOrderMutation,
    useTrackOrderQuery,
    useGetAdminOrdersQuery,
    useUpdateOrderStatusMutation,
    useGetAvailableOrdersQuery,
    useGetMyAssignedOrdersQuery,
    useAcceptOrderMutation,
    useRejectOrderMutation,
    useMarkOutForDeliveryMutation,
    useMarkDeliveredMutation,
    useMarkReturnedMutation,
    useGetOrderDetailsQuery,
} = orderApi;