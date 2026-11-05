// src/redux/api/complainApi.ts
import { baseApi } from "./baseApi";

const complainApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Complaint / Feedback
    createComplaint: builder.mutation({
      query: (formData: FormData) => ({
        url: "/complaints",
        method: "POST",
        body: formData,
        // form-data হলে Content-Type set করো না, browser নিজে set করবে
      }),
      invalidatesTags: ["Complaint"],
    }),
  }),
});

export const { useCreateComplaintMutation } = complainApi;