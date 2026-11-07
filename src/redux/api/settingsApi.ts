import { baseApi } from "./baseApi";

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<any, void>({
      query: () => "/settings",
      providesTags: ["StoreSetting"],
    }),
  }),
});

export const { useGetSettingsQuery } = settingsApi;

