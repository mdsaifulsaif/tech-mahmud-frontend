import { baseApi } from "./baseApi";

export const riderDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Dashboard Overview
    getDashboardOverview: builder.query({
      query: (params = { range: "today" }) => ({
        url: "/rider-dashboard/overview",
        method: "GET",
        params,
      }),
      providesTags: ["Dashboard"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetDashboardOverviewQuery,
} = riderDashboardApi;
