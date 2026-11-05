// src/redux/api/brandApi.ts
import { baseApi } from "./baseApi";

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Brands (with pagination & search)
    getAllBrands: builder.query({
      query: (args = {}) => ({
        url: "/brands",
        method: "GET",
        params: args, // page, limit, searchTerm ইত্যাদি
      }),
      providesTags: ["Brand"],
    }),

    // Get Single Brand
    getSingleBrand: builder.query({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Brand", id }],
    }),

    // Create Brand
    createBrand: builder.mutation({
      query: (data) => ({
        url: "/brands/admin/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),

    // Update Brand
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brands/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),

    // Delete Brand
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brands/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useGetSingleBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;