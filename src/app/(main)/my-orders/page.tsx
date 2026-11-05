"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetMyOrdersQuery, useCancelOrderMutation } from "@/redux/api/orderApi";
import { format } from "date-fns";
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiEye,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiMapPin,
  FiCreditCard,
  FiAlertTriangle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const statusTabs = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const MyOrdersPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  // Cancellation modal state
  const [orderToCancel, setOrderToCancel] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const { data, isLoading, isFetching, refetch } = useGetMyOrdersQuery({
    page,
    limit,
    status: activeTab === "all" ? undefined : activeTab,
  });

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const orders = data?.data?.orders || [];
  const totalOrders = data?.data?.total || 0;
  const totalPages = Math.ceil(totalOrders / limit);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      confirmed: "bg-blue-50 text-blue-700 border-blue-200",
      assigned: "bg-indigo-50 text-indigo-700 border-indigo-200",
      processing: "bg-purple-50 text-purple-700 border-purple-200",
      shipped: "bg-purple-50 text-purple-700 border-purple-200",
      out_for_delivery: "bg-orange-50 text-orange-700 border-orange-200",
      delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
      returned: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FiClock size={13} />;
      case "delivered":
        return <FiCheckCircle size={13} />;
      case "cancelled":
        return <FiXCircle size={13} />;
      case "out_for_delivery":
      case "shipped":
        return <FiTruck size={13} />;
      default:
        return <FiPackage size={13} />;
    }
  };

  const getPaymentBadge = (method: string) => {
    const colors: Record<string, string> = {
      cod: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bkash: "bg-pink-50 text-pink-700 border-pink-200",
      nagad: "bg-orange-50 text-orange-700 border-orange-200",
      online: "bg-blue-50 text-blue-700 border-blue-200",
      card: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return colors[method] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const handleCancelSubmit = async () => {
    if (!orderToCancel?._id) return;
    const finalReason = cancelReason === "Other" ? customReason : cancelReason;
    if (!finalReason) {
      toast.error("Please select or enter a cancellation reason");
      return;
    }

    try {
      await cancelOrder({ id: orderToCancel._id, reason: finalReason }).unwrap();
      toast.success("Order cancelled successfully");
      setOrderToCancel(null);
      setCancelReason("");
      setCustomReason("");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to cancel order");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">My Orders</h1>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-sm p-5 border border-gray-200 animate-pulse">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded-sm" />
                    <div className="h-5 w-24 bg-gray-200 rounded-sm" />
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-sm" />
                </div>
                <div className="flex gap-3 mt-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-sm" />
                  <div className="w-14 h-14 bg-gray-200 rounded-sm" />
                  <div className="w-14 h-14 bg-gray-200 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface)] py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
              My Orders
            </h1>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              মোট {totalOrders} টি অর্ডার পাওয়া গেছে
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/track-order"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--color-primary)] text-white rounded-sm text-xs font-bold hover:opacity-95 shadow-xs transition-all"
            >
              <FiTruck size={14} />
              Track Any Order
            </Link>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-gray-200 rounded-sm text-xs font-bold text-[var(--color-text-secondary)] hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-xs cursor-pointer"
            >
              <FiRefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-sm p-1.5 border border-gray-200 shadow-xs mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setPage(1);
                }}
                className={`px-4 py-2 text-xs font-bold rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-[var(--color-primary)] text-white shadow-xs"
                    : "text-[var(--color-text-secondary)] hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-sm p-12 text-center border border-gray-200 shadow-xs">
            <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-base font-bold text-[var(--color-text-primary)]">
              No Orders Found
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              {activeTab === "all"
                ? "You haven't placed any orders yet."
                : `No orders in '${activeTab}' status.`}
            </p>
            {activeTab !== "all" && (
              <button
                onClick={() => setActiveTab("all")}
                className="mt-4 px-5 py-2 bg-[var(--color-primary)] text-white rounded-sm text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                View All Orders
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord: any) => {
              const isCancellable = ord.status === "pending" || ord.status === "confirmed";

              return (
                <div
                  key={ord._id}
                  className="bg-white rounded-sm p-5 border border-gray-200 shadow-xs hover:border-gray-300 transition-all"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/my-orders/${ord._id}`}
                          className="font-black text-sm text-[var(--color-primary)] hover:underline font-mono"
                        >
                          #{ord.orderNumber || ord._id?.slice(-8)?.toUpperCase()}
                        </Link>
                        <span className="text-xs text-[var(--color-text-muted)]">
                          {ord.createdAt
                            ? format(new Date(ord.createdAt), "dd MMM yyyy, h:mm a")
                            : "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-sm font-bold border flex items-center gap-1.5 capitalize ${getStatusColor(
                            ord.status
                          )}`}
                        >
                          {getStatusIcon(ord.status)}
                          {ord.status?.replace(/_/g, " ") || "Pending"}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-sm font-bold border ${getPaymentBadge(
                            ord.paymentMethod
                          )}`}
                        >
                          <span className="flex items-center gap-1">
                            <FiCreditCard size={12} />
                            {ord.paymentMethod?.toUpperCase() || "COD"} •{" "}
                            <span
                              className={
                                ord.paymentStatus === "paid"
                                  ? "text-emerald-700 font-black"
                                  : ord.paymentStatus === "refunded"
                                  ? "text-blue-700 font-black"
                                  : "text-amber-700 font-black"
                              }
                            >
                              {ord.paymentStatus}
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-[var(--color-text-muted)]">Total Amount</p>
                      <p className="text-base font-black text-[var(--color-text-primary)]">
                        ৳{ord.totalAmount}
                      </p>
                    </div>
                  </div>

                  {/* Order Items Previews */}
                  <div className="flex gap-2 my-4 overflow-x-auto pb-1">
                    {ord.items?.slice(0, 4).map((item: any, i: number) => (
                      <div
                        key={i}
                        className="w-14 h-14 rounded-sm border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0 relative group"
                        title={item.productName}
                      >
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <FiPackage size={18} />
                          </div>
                        )}
                      </div>
                    ))}
                    {ord.items?.length > 4 && (
                      <div className="w-14 h-14 rounded-sm border border-gray-200 bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                        +{ord.items.length - 4}
                      </div>
                    )}
                  </div>

                  {/* Order Footer & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                      <span className="flex items-center gap-1">
                        <FiMapPin size={13} />
                        {ord.deliveryAddress?.city || "Local"}
                      </span>
                      <span>•</span>
                      <span>{ord.items?.length || 0} items</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {isCancellable && (
                        <button
                          onClick={() => setOrderToCancel(ord)}
                          className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-sm text-xs font-bold transition-colors cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )}

                      <Link
                        href={`/track-order?orderNumber=${encodeURIComponent(
                          ord.orderNumber || ord._id
                        )}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-sm text-xs font-bold transition-colors"
                      >
                        <FiTruck size={13} />
                        Track
                      </Link>

                      <Link
                        href={`/my-orders/${ord._id}`}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--color-primary)] text-white rounded-sm text-xs font-bold hover:opacity-90 transition-opacity"
                      >
                        <FiEye size={13} />
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-gray-600 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-sm border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {orderToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-sm border border-gray-200 w-full max-w-md p-6 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-red-600">
                <FiAlertTriangle size={20} />
                <h3 className="font-bold text-base text-gray-900">
                  Cancel Order #{orderToCancel.orderNumber}?
                </h3>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Are you sure you want to cancel this order?
                {orderToCancel.paymentStatus === "paid" && (
                  <span className="block mt-1 font-semibold text-blue-600">
                    • Your paid amount of ৳{orderToCancel.totalAmount} will be marked for full refund.
                  </span>
                )}
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Select Reason for Cancellation:
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    "Changed my mind",
                    "Ordered wrong product",
                    "Found better price elsewhere",
                    "Delivery time is too long",
                    "Need to change delivery address",
                    "Other",
                  ].map((r) => (
                    <label
                      key={r}
                      className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-sm"
                    >
                      <input
                        type="radio"
                        name="cancelReason"
                        checked={cancelReason === r}
                        onChange={() => setCancelReason(r)}
                        className="text-[var(--color-primary)] focus:ring-0"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>

                {cancelReason === "Other" && (
                  <textarea
                    rows={2}
                    placeholder="Please specify reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full mt-2 p-2 border border-gray-200 rounded-sm text-xs outline-none focus:border-[var(--color-primary)]"
                  />
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setOrderToCancel(null)}
                  disabled={isCancelling}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-sm text-xs font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleCancelSubmit}
                  disabled={isCancelling}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-sm text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCancelling ? "Cancelling..." : "Confirm Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;