"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// Helper fetcher
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "API Request Failed");
  }

  return data;
}

/* ==========================================================================
   BANNERS QUERIES (STAR TECH HERO LAYOUT SUPPORT)
   ========================================================================== */
export interface IBannerItem {
  _id: string;
  title?: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  categoryID?: any;
  categorySlug?: string;
  placement?: string;
  slot?: "left" | "right_top" | "right_bottom" | string;
  order?: number;
  isActive: boolean;
}

export const useBannersQuery = (placement?: string) => {
  const url = placement ? `/banners?placement=${placement}` : `/banners`;
  return useQuery<{ success: boolean; data: IBannerItem[] }>({
    queryKey: ["banners", placement || "all"],
    queryFn: () => apiFetch(url),
  });
};

/* ==========================================================================
   CATEGORY & BRAND QUERIES
   ========================================================================== */
export const useCategoriesQuery = (params?: {
  limit?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  status?: string;
}) => {
  const limit = params?.limit || 50;
  const isFeaturedParam = params?.isFeatured !== undefined ? `&isFeatured=${params.isFeatured}` : "";
  const isTrendingParam = params?.isTrending !== undefined ? `&isTrending=${params.isTrending}` : "";
  const statusParam = params?.status ? `&status=${params.status}` : "&status=active";
  return useQuery<any>({
    queryKey: ["categories", limit, params?.isFeatured, params?.isTrending, params?.status],
    queryFn: () =>
      apiFetch(`/categories?isDeleted=false&limit=${limit}${statusParam}${isFeaturedParam}${isTrendingParam}`),
  });
};

export const useCategoryTreeQuery = (status: string = "active") => {
  return useQuery<any>({
    queryKey: ["categories", "tree", status],
    queryFn: () => apiFetch(`/categories/tree?status=${status}`),
    staleTime: 1000 * 60 * 5,
  });
};

export const useBrandsQuery = (params?: { limit?: number }) => {
  const limit = params?.limit || 50;
  return useQuery<any>({
    queryKey: ["brands", limit],
    queryFn: () =>
      apiFetch(`/brands?status=active&isDeleted=false&limit=${limit}`),
  });
};

/* ==========================================================================
   PRODUCT QUERIES
   ========================================================================== */
export interface ProductQueryParams {
  searchTerm?: string;
  category?: string;
  brand?: string;
  productType?: "gadget" | "clothing" | "standard";
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export const useProductsQuery = (params: ProductQueryParams = {}) => {
  const searchParams = new URLSearchParams();
  if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params.category) searchParams.append("category", params.category);
  if (params.brand) searchParams.append("brand", params.brand);
  if (params.productType) searchParams.append("productType", params.productType);
  if (params.minPrice) searchParams.append("minPrice", String(params.minPrice));
  if (params.maxPrice) searchParams.append("maxPrice", String(params.maxPrice));
  if (params.sort) searchParams.append("sort", params.sort);
  if (params.page) searchParams.append("page", String(params.page));
  if (params.limit) searchParams.append("limit", String(params.limit));

  const queryString = searchParams.toString();
  const url = `/products${queryString ? `?${queryString}` : ""}`;

  return useQuery<any>({
    queryKey: ["products", params],
    queryFn: () => apiFetch(url),
    enabled: params.searchTerm !== undefined ? !!params.searchTerm.trim() : true,
  });
};

export const useFeaturedProductsQuery = (limit: number = 12) => {
  return useQuery<any>({
    queryKey: ["products", "featured", limit],
    queryFn: () => apiFetch(`/products/featured?limit=${limit}`),
  });
};

export const useNewCollectionProductsQuery = (limit: number = 12) => {
  return useQuery<any>({
    queryKey: ["products", "new-collection", limit],
    queryFn: () => apiFetch(`/products/new-collection?limit=${limit}`),
  });
};

export const useProductByIdQuery = (id: string) => {
  return useQuery<any>({
    queryKey: ["product", id],
    queryFn: () => apiFetch(`/products/${id}`),
    enabled: !!id,
  });
};

export const useRelatedProductsQuery = (id: string) => {
  return useQuery<any>({
    queryKey: ["products", "related", id],
    queryFn: () => apiFetch(`/products/${id}/related`),
    enabled: !!id,
  });
};

/* ==========================================================================
   REVIEWS QUERIES & MUTATIONS
   ========================================================================== */
export const useProductReviewsQuery = (productId: string) => {
  return useQuery<any>({
    queryKey: ["reviews", "product", productId],
    queryFn: () => apiFetch(`/reviews/product/${productId}`),
    enabled: !!productId,
  });
};

export const useReviewsQuery = (limit: number = 10) => {
  return useQuery<any>({
    queryKey: ["reviews", "featured", limit],
    queryFn: () => apiFetch(`/reviews/featured?limit=${limit}`),
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  return useMutation<any, Error, any>({
    mutationFn: (reviewData: any) =>
      apiFetch(
        "/reviews",
        { method: "POST", body: JSON.stringify(reviewData) },
        token
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", variables.productId],
      });
      queryClient.invalidateQueries({ queryKey: ["reviews", "featured"] });
    },
  });
};

/* ==========================================================================
   ORDER QUERIES & MUTATIONS
   ========================================================================== */
export const useMyOrdersQuery = () => {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  return useQuery<any>({
    queryKey: ["orders", "my-orders"],
    queryFn: () => apiFetch("/order/my-orders", {}, token),
    enabled: !!token,
  });
};

export const useMyOrderByIdQuery = (id: string) => {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  return useQuery<any>({
    queryKey: ["orders", id],
    queryFn: () => apiFetch(`/order/${id}`, {}, token),
    enabled: !!id && !!token,
  });
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  return useMutation<any, Error, any>({
    mutationFn: (orderPayload: any) =>
      apiFetch(
        "/order",
        { method: "POST", body: JSON.stringify(orderPayload) },
        token
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const mutation = useMutation<any, Error, { id: string; reason: string }>({
    mutationFn: ({ id, reason }) =>
      apiFetch(
        `/order/${id}/cancel`,
        { method: "PATCH", body: JSON.stringify({ reason }) },
        token
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["orders", "my-orders"] });
    },
  });

  const trigger = (data: { id: string; reason: string }) => ({
    unwrap: () => mutation.mutateAsync(data),
  });

  return [trigger, { ...mutation, isLoading: mutation.isPending }] as const;
};

/* ==========================================================================
   AUTH QUERIES & MUTATIONS (TANSTACK QUERY)
   ========================================================================== */
export const useRegisterMutation = () => {
  const mutation = useMutation<any, Error, any>({
    mutationFn: (userData: any) =>
      apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
  });

  const trigger = (data: any) => ({
    unwrap: () => mutation.mutateAsync(data),
  });

  return [trigger, { ...mutation, isLoading: mutation.isPending }] as const;
};

export const useVerifyEmailMutation = () => {
  const mutation = useMutation<any, Error, { email: string; code: string }>({
    mutationFn: (data) =>
      apiFetch("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });

  const trigger = (data: { email: string; code: string }) => ({
    unwrap: () => mutation.mutateAsync(data),
  });

  return [trigger, { ...mutation, isLoading: mutation.isPending }] as const;
};

export const useResendVerificationMutation = () => {
  const mutation = useMutation<any, Error, string | { email: string }>({
    mutationFn: (arg) => {
      const email = typeof arg === "string" ? arg : arg.email;
      return apiFetch("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
  });

  const trigger = (arg: string | { email: string }) => ({
    unwrap: () => mutation.mutateAsync(arg),
  });

  return [trigger, { ...mutation, isLoading: mutation.isPending }] as const;
};

export const useForgotPasswordMutation = () => {
  const mutation = useMutation<any, Error, string | { email: string }>({
    mutationFn: (arg) => {
      const email = typeof arg === "string" ? arg : arg.email;
      return apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    },
  });

  const trigger = (arg: string | { email: string }) => ({
    unwrap: () => mutation.mutateAsync(arg),
  });

  return [trigger, { ...mutation, isLoading: mutation.isPending }] as const;
};

export const useResetPasswordMutation = () => {
  const mutation = useMutation<
    any,
    Error,
    { token: string; newPassword?: string; password?: string }
  >({
    mutationFn: ({ token, newPassword, password }) =>
      apiFetch(`/auth/reset-password/${token}`, {
        method: "POST",
        body: JSON.stringify({ newPassword: newPassword || password }),
      }),
  });

  const trigger = (data: {
    token: string;
    newPassword?: string;
    password?: string;
  }) => ({
    unwrap: () => mutation.mutateAsync(data),
  });

  return [trigger, { ...mutation, isLoading: mutation.isPending }] as const;
};

export const useGetMeQuery = (_params?: any) => {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  return useQuery<any>({
    queryKey: ["user", "me"],
    queryFn: () => apiFetch("/auth/get-me", {}, token),
    enabled: !!token,
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session as any)?.accessToken;

  const mutation = useMutation<any, Error, any>({
    mutationFn: (formData) => {
      const isFormData =
        typeof FormData !== "undefined" && formData instanceof FormData;

      return fetch(`${API_BASE_URL}/auth/update-profile`, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(!isFormData ? { "Content-Type": "application/json" } : {}),
        },
        body: isFormData ? formData : JSON.stringify(formData),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Profile update failed");
        return data;
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });

  const trigger = (data: any) => ({
    unwrap: () => mutation.mutateAsync(data),
  });

  return [trigger, { ...mutation, isLoading: mutation.isPending }] as const;
};

export const useSubscribeNewsletterMutation = () => {
  const mutation = useMutation<any, Error, { email: string }>({
    mutationFn: (data) =>
      apiFetch("/subscribers", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });

  const trigger = (data: { email: string }) => ({
    unwrap: () => mutation.mutateAsync(data),
  });

  return [trigger, { ...mutation, isLoading: mutation.isPending }] as const;
};

export const useCreateComplaintMutation = () => {
  const mutation = useMutation<any, Error, FormData>({
    mutationFn: (formData: FormData) =>
      fetch(`${API_BASE_URL}/complaints`, {
        method: "POST",
        body: formData,
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.message || "Failed to submit complaint");
        return data;
      }),
  });

  const trigger = (data: FormData) => ({
    unwrap: () => mutation.mutateAsync(data),
  });

  return [trigger, { ...mutation, isLoading: mutation.isPending }] as const;
};
