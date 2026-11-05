import { baseApi } from './baseApi';

export interface CreateSubscriptionPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  area?: string;
  deliveryInstructions?: string;

  productID: string;
  productName: string;
  productThumbnail?: string;
  variantID?: string;
  variantName?: string;
  quantity: number;

  regularPrice: number;
  discountedPrice: number;
  deliveryFee: number;
  totalPerDelivery: number;

  frequency: 'weekly' | 'monthly' | 'bi-weekly';
  preferredDeliveryDay?: string;
  startDate?: string;
  nextDeliveryDate?: string;

  paymentPreference: 'cod' | 'bkash' | 'nagad';
}

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation<
      { success: boolean; message: string; data: any },
      CreateSubscriptionPayload
    >({
      query: (body) => ({
        url: '/subscriptions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Subscriptions'],
    }),

    getMySubscriptions: builder.query<{ success: boolean; data: any[] }, void>({
      query: () => ({
        url: '/subscriptions/my-subscriptions',
        method: 'GET',
      }),
      providesTags: ['Subscriptions'],
    }),
  }),
});

export const { useCreateSubscriptionMutation, useGetMySubscriptionsQuery } = subscriptionApi;
