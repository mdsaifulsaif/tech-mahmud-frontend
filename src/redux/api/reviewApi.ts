

import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // User: Create review
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews/add-review',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reviews'],
    }),

    // Get all reviews (Public/User)
    getReviews: builder.query({
      query: (params) => ({
        url: '/reviews',
        method: 'GET',
        params,
      }),
      providesTags: ['Reviews'],
    }),

    // Get review by id
    getReviewById: builder.query({
      query: (id) => `/reviews/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Reviews', id }],
    }),

    // For product page (User)
    getProductReviews: builder.query({
      query: ({ productId, ...params }) => ({
        url: `/reviews/${productId}`,
        method: 'GET',
        params,
      }),
      providesTags: (_result, _error, { productId }) => [
        { type: 'Reviews', id: productId },
      ],
    }),
      // ✅ Get Featured Reviews (Public)
    getFeaturedReviews: builder.query({
      query: (params = { limit: 6 }) => ({
        url: '/reviews/featured',
        method: 'GET',
        params,
      }),
      providesTags: ['Reviews'],
    }),

 
  }),
});

export const {
  useCreateReviewMutation,
  useGetReviewByIdQuery,
  useGetProductReviewsQuery,
  useGetFeaturedReviewsQuery,

} = reviewApi;