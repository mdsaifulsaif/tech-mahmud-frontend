import { baseApi } from "./baseApi";

export const areaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Areas
    getAllAreas: builder.query({
      query: (params = {}) => ({
        url: "/area",
        params,
      }),
      providesTags: ["Area"],
    }),
  }),
});

export const { useGetAllAreasQuery } = areaApi;
