import { baseApi } from "./baseApi";

export interface CreateAreaRequestPayload {
  name: string;
  phone: string;
  email?: string;
  areaName: string;
  city?: string;
  district?: string;
  notes?: string;
}

export const areaRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAreaRequest: builder.mutation<
      { success: boolean; message: string; data: any },
      CreateAreaRequestPayload
    >({
      query: (body) => ({
        url: "/area-requests",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AreaRequests"],
    }),
  }),
});

export const { useCreateAreaRequestMutation } = areaRequestApi;
