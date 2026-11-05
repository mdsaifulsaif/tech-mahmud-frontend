import { baseApi } from "./baseApi";

export interface IBannerItem {
  _id: string;
  title?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  placement?: "slider" | "side_top" | "side_bottom" | "popup";
  order?: number;
  isActive: boolean;
}

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveBanners: builder.query<{
      success: boolean;
      message: string;
      data: IBannerItem[];
    }, void>({
      query: () => ({
        url: "/banners",
        method: "GET",
      }),
      providesTags: ["Banners" as any],
    }),
  }),
});

export const { useGetActiveBannersQuery } = bannerApi;
