import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (params) => ({
        url: "/products",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }: any) => ({
                type: "Products" as const,
                id: _id,
              })),
              "Products",
            ]
          : ["Products"],
    }),

    // নতুন: slug দিয়ে category wise product fetch
    getProductsByCategorySlug: builder.query({
      query: ({
        slug,
        page = 1,
        limit = 10,
      }: {
        slug: string;
        page?: number;
        limit?: number;
      }) => ({
        url: `/products/category/${slug}`,
        params: { page, limit },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        // slug change hole notun cache, page change hole same cache
        return queryArgs.slug;
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          // notun slug e ashle reset kore new data boshabo
          return newItems;
        }
        // pagination hole purono data er sathe notun data merge (duplicate bad diye)
        const existingIds = new Set(currentCache.data.map((p: any) => p._id));
        const uniqueNew = newItems.data.filter(
          (p: any) => !existingIds.has(p._id),
        );
        currentCache.data.push(...uniqueNew);
        currentCache.meta = newItems.meta;
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return (
          currentArg?.page !== previousArg?.page ||
          currentArg?.slug !== previousArg?.slug
        );
      },
      providesTags: ["Products"],
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    getProductStats: builder.query({
      query: () => "/products/admin/stats",
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products/create-product",
        method: "POST",
        body: data,
        formData: true,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "Products", id },
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
    updateStock: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `/products/${id}/stock`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Products",
        { type: "Products", id },
      ],
    }),
    bulkUpdateStatus: builder.mutation({
      query: (data) => ({
        url: "/products/admin/bulk-status",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    bulkDelete: builder.mutation({
      query: (data) => ({
        url: "/products/admin/bulk-delete",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    getFeaturedProdcut: builder.query({
      query: (params = {}) => ({
        url: "/products/featured",
        params,
      }),
      providesTags: ["Products"],
    }),
    getRelatedProducts: builder.query({
      query: (categoryId: string) => ({
        url: "/products/related-products",
        params: { categoryId },
      }),
      providesTags: ["Products"],
    }),
  
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsByCategorySlugQuery,
  useGetProductByIdQuery,
  useGetProductStatsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateStockMutation,
  useBulkUpdateStatusMutation,
  useBulkDeleteMutation,
  useGetFeaturedProdcutQuery,
  useGetRelatedProductsQuery,
} = productApi;
