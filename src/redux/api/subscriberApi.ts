import { baseApi } from "./baseApi";

export const subscriberApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribeNewsletter: builder.mutation<
      { success: boolean; message: string; data: any },
      { email: string }
    >({
      query: (body) => ({
        url: "/subscribers/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscribers"],
    }),

    getAllSubscribers: builder.query<
      {
        success: boolean;
        message: string;
        meta: { page: number; limit: number; total: number; totalPage: number };
        data: any[];
      },
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/subscribers",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Subscribers"],
    }),
  }),
});

export const {
  useSubscribeNewsletterMutation,
  useGetAllSubscribersQuery,
} = subscriberApi;
