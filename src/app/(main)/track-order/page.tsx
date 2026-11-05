"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  FiSearch,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiShoppingBag,
  FiAlertCircle,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiXCircle,
  FiUser,
  FiArrowRight,
  FiRefreshCw,
  FiAlertTriangle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  useTrackOrderQuery,
  useGetMyOrdersQuery,
  useCancelOrderMutation,
} from "@/redux/api/orderApi";
import { useSocket } from "@/lib/socket";

// Master Status progression steps
const statusSteps = [
  {
    key: "pending",
    label: "Order Placed",
    subLabel: "অর্ডার গৃহীত",
    icon: FiClock,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    subLabel: "নিশ্চিত করা হয়েছে",
    icon: FiCheckCircle,
  },
  {
    key: "assigned",
    label: "Rider Assigned",
    subLabel: "রাইডার নিয়োগপ্রাপ্ত",
    icon: FiUser,
  },
  {
    key: "processing",
    label: "Packing & Ready",
    subLabel: "প্রস্তুতকরণ চলছে",
    icon: FiPackage,
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    subLabel: "ডেলিভারির পথে",
    icon: FiTruck,
  },
  {
    key: "delivered",
    label: "Delivered",
    subLabel: "ডেলিভারি সম্পন্ন",
    icon: FiCheckCircle,
  },
];

const statusColorMap: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  assigned: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  processing: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  shipped: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  out_for_delivery: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  delivered: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  returned: { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" },
};

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialOrderParam = searchParams.get("orderNumber") || searchParams.get("id") || "";
  const initialPhoneParam = searchParams.get("phone") || "";

  const [orderInput, setOrderInput] = useState(initialOrderParam);
  const [phoneInput, setPhoneInput] = useState(initialPhoneParam);
  const [activeOrderQuery, setActiveOrderQuery] = useState(initialOrderParam);

  // Cancellation modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const { socket } = useSocket();

  // Query order tracking
  const {
    data: trackData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useTrackOrderQuery(
    { orderNumber: activeOrderQuery, phone: phoneInput || undefined },
    { skip: !activeOrderQuery }
  );

  // Fetch logged in user orders for quick select
  const { data: myOrdersData } = useGetMyOrdersQuery({ page: 1, limit: 5 });
  const recentOrders = myOrdersData?.data?.orders || [];

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const order = trackData?.data;

  // Listen to socket live updates for this order
  useEffect(() => {
    if (!socket || !order?._id) return;
    const roomName = `order-${order._id}`;
    socket.emit("join-room", roomName);

    const handleUpdate = (payload: any) => {
      console.log("Realtime order status update:", payload);
      toast.success(payload?.message || "Order status updated!");
      refetch();
    };

    socket.on("order-status-update", handleUpdate);

    return () => {
      socket.off("order-status-update", handleUpdate);
      socket.emit("leave-room", roomName);
    };
  }, [socket, order?._id, refetch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) {
      toast.error("Please enter your Order Number or Order ID");
      return;
    }
    setActiveOrderQuery(orderInput.trim());
    router.replace(`/track-order?orderNumber=${encodeURIComponent(orderInput.trim())}`);
  };

  const handleQuickSelect = (ordNum: string) => {
    setOrderInput(ordNum);
    setActiveOrderQuery(ordNum);
    router.replace(`/track-order?orderNumber=${encodeURIComponent(ordNum)}`);
  };

  // Determine current active status index
  const getStatusIndex = (currentStatus: string) => {
    if (currentStatus === "shipped") return 3; // map shipped to processing / packing
    return statusSteps.findIndex((s) => s.key === currentStatus);
  };

  const currentIdx = order ? getStatusIndex(order.status) : -1;
  const isTerminal = order?.status === "cancelled" || order?.status === "returned";
  const isCancellable = order && (order.status === "pending" || order.status === "confirmed");

  const progressPercentage = isTerminal
    ? 0
    : currentIdx <= 0
    ? 5
    : Math.min(100, Math.round((currentIdx / (statusSteps.length - 1)) * 100));

  const handleCancelSubmit = async () => {
    if (!order?._id) return;
    const finalReason = cancelReason === "Other" ? customReason : cancelReason;
    if (!finalReason) {
      toast.error("Please select or enter a cancellation reason");
      return;
    }

    try {
      await cancelOrder({ id: order._id, reason: finalReason }).unwrap();
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to cancel order");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Page Title */}
        <div className="mb-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Track Order
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                লাইভ অর্ডার ট্র্যাকিং — আপনার অর্ডারের বর্তমান অবস্থা দেখুন
              </p>
            </div>
            {order && (
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors w-fit self-end sm:self-auto shadow-xs"
              >
                <FiRefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* Search Bar Card */}
        <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-xs mb-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                type="text"
                placeholder="Enter Order Number (e.g. ORD-12345 or Order ID)..."
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[var(--color-primary)] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || isFetching}
              className="px-6 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-sm text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer shadow-xs"
            >
              {isLoading || isFetching ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiTruck size={16} />
              )}
              Track Now
            </button>
          </form>

          {/* Quick Select for Logged-in User */}
          {recentOrders.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Recent Orders:
              </p>
              <div className="flex flex-wrap gap-2">
                {recentOrders.map((rec: any) => (
                  <button
                    key={rec._id}
                    onClick={() => handleQuickSelect(rec.orderNumber || rec._id)}
                    className={`px-3 py-1 text-xs rounded-sm border font-medium transition-all ${
                      activeOrderQuery === (rec.orderNumber || rec._id)
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    #{rec.orderNumber || rec._id.slice(-6)} • ৳{rec.totalAmount}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-sm border border-gray-200 p-12 text-center shadow-xs">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-gray-600">Loading order tracking details...</p>
          </div>
        )}

        {/* Error / Not Found State */}
        {error && !isLoading && (
          <div className="bg-white rounded-sm border border-red-200 p-8 text-center shadow-xs mb-6">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
              <FiAlertCircle size={28} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Order Not Found</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
              {((error as any)?.data?.message) || "We couldn't find an order matching that number. Please verify your order number and try again."}
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/my-orders"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-sm text-xs font-semibold transition-colors"
              >
                View My Orders
              </Link>
            </div>
          </div>
        )}

        {/* Order Details Body */}
        {order && (
          <div className="space-y-6">
            {/* 1. Header Summary Card */}
            <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-xs">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">Order</span>
                    <span className="text-base font-black text-gray-900 font-mono">
                      #{order.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Placed on{" "}
                    {order.createdAt
                      ? format(new Date(order.createdAt), "dd MMM yyyy, h:mm a")
                      : "—"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold border capitalize ${
                      statusColorMap[order.status]?.bg || "bg-gray-100"
                    } ${statusColorMap[order.status]?.text || "text-gray-700"} ${
                      statusColorMap[order.status]?.border || "border-gray-200"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    {order.status.replace(/_/g, " ")}
                  </span>

                  {/* Cancel Button if eligible */}
                  {isCancellable && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-sm text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Meta */}
              <div className="pt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block">Total Amount</span>
                  <span className="text-sm font-black text-gray-900">৳{order.totalAmount}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Payment</span>
                  <span className="font-bold text-gray-800 uppercase">
                    {order.paymentMethod} •{" "}
                    <span
                      className={
                        order.paymentStatus === "paid"
                          ? "text-emerald-600 font-black"
                          : order.paymentStatus === "refunded"
                          ? "text-blue-600 font-black"
                          : "text-amber-600 font-black"
                      }
                    >
                      {order.paymentStatus}
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Delivery Type</span>
                  <span className="font-bold text-gray-800 capitalize">{order.deliveryType}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Estimated Time</span>
                  <span className="font-bold text-gray-800">
                    {order.deliveryTime ||
                      (order.estimatedDelivery
                        ? format(new Date(order.estimatedDelivery), "dd MMM")
                        : "Same Day")}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Step-by-Step Stepper Card */}
            <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-xs">
              <h2 className="text-sm font-bold text-gray-900 mb-6 flex items-center justify-between">
                <span>Delivery Status Timeline</span>
                <span className="text-xs text-gray-400 font-normal">
                  Real-time updates
                </span>
              </h2>

              {/* Progress Bar (Desktop & Tablet) */}
              <div className="relative mb-8 hidden md:block">
                <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 rounded-sm">
                  <div
                    className="h-full bg-[var(--color-primary)] transition-all duration-700 rounded-sm"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="relative flex justify-between z-10">
                  {statusSteps.map((step, idx) => {
                    const isCompleted = !isTerminal && idx <= currentIdx;
                    const isActive = !isTerminal && idx === currentIdx;
                    const Icon = step.icon;

                    const timelineEntry = (order.statusTimeline || []).find(
                      (t: any) => t.status === step.key
                    );

                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center text-center max-w-[110px]"
                      >
                        <div
                          className={`w-10 h-10 rounded-sm flex items-center justify-center border-2 transition-all ${
                            isCompleted
                              ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xs"
                              : isActive
                              ? "bg-white text-[var(--color-primary)] border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/20"
                              : "bg-white text-gray-300 border-gray-200"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <p
                          className={`text-xs font-bold mt-2 leading-tight ${
                            isCompleted || isActive ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {step.subLabel}
                        </p>
                        {timelineEntry?.changedAt && (
                          <p className="text-[9px] font-mono text-gray-500 mt-1 bg-gray-50 px-1.5 py-0.5 rounded-sm">
                            {format(new Date(timelineEntry.changedAt), "hh:mm a")}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Vertical Stepper */}
              <div className="block md:hidden space-y-4 relative pl-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {statusSteps.map((step, idx) => {
                  const isCompleted = !isTerminal && idx <= currentIdx;
                  const isActive = !isTerminal && idx === currentIdx;
                  const Icon = step.icon;
                  const timelineEntry = (order.statusTimeline || []).find(
                    (t: any) => t.status === step.key
                  );

                  return (
                    <div key={step.key} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 top-0.5 w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold border ${
                          isCompleted
                            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                            : isActive
                            ? "bg-white text-[var(--color-primary)] border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30"
                            : "bg-white text-gray-300 border-gray-200"
                        }`}
                      >
                        <Icon size={12} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-xs font-bold ${
                              isCompleted || isActive ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          {timelineEntry?.changedAt && (
                            <span className="text-[10px] font-mono text-gray-400">
                              {format(new Date(timelineEntry.changedAt), "dd MMM, hh:mm a")}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400">{step.subLabel}</p>
                        {timelineEntry?.note && (
                          <p className="text-[11px] text-gray-600 mt-0.5 bg-gray-50 p-1.5 rounded-sm border border-gray-100">
                            {timelineEntry.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cancelled Banner */}
              {order.status === "cancelled" && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3">
                  <FiXCircle size={22} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-red-800">Order Cancelled</h3>
                    {order.cancelReason && (
                      <p className="text-xs text-red-700">
                        <span className="font-semibold">Reason:</span> {order.cancelReason}
                      </p>
                    )}
                    {order.paymentStatus === "refunded" && (
                      <p className="text-xs text-blue-700 font-semibold bg-blue-50 border border-blue-200 p-2 rounded-sm mt-1">
                        ✓ Refund Processed: এই অর্ডারের টাকা (৳{order.totalAmount}) রিফান্ড হিসেবে প্রসেস করা হয়েছে।
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Assigned Rider Card (if assigned) */}
            {order.assignedRider && (
              <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <FiTruck className="text-[var(--color-primary)]" size={17} />
                    Delivery Rider Information
                  </h3>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-sm font-bold">
                    Assigned 🛵
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white border border-gray-200 rounded-sm flex items-center justify-center font-bold text-lg text-[var(--color-primary)] shadow-2xs">
                      {order.assignedRider.fullName?.charAt(0) || "R"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">
                        {order.assignedRider.fullName}
                      </h4>
                      <p className="text-xs text-gray-500 capitalize">
                        Vehicle: {order.assignedRider.vehicleType || "Delivery Bike"}
                        {order.assignedRider.vehicleNumber && ` (${order.assignedRider.vehicleNumber})`}
                      </p>
                    </div>
                  </div>

                  {order.assignedRider.phone && (
                    <a
                      href={`tel:${order.assignedRider.phone}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-bold rounded-sm transition-all shadow-xs"
                    >
                      <FiPhone size={14} />
                      Call Rider ({order.assignedRider.phone})
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 4. Delivery Address & Items Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiMapPin className="text-[var(--color-primary)]" size={16} />
                  Delivery Address
                </h3>
                <div className="text-xs space-y-1.5 text-gray-600">
                  <p className="font-bold text-gray-900 text-sm">
                    {order.deliveryAddress?.name}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <FiPhone size={12} className="text-gray-400" />
                    {order.deliveryAddress?.phone}
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    {[
                      order.deliveryAddress?.houseNo && `House ${order.deliveryAddress.houseNo}`,
                      order.deliveryAddress?.road && `Road ${order.deliveryAddress.road}`,
                      order.deliveryAddress?.block && `Block ${order.deliveryAddress.block}`,
                      order.deliveryAddress?.area?.name || order.deliveryAddress?.area,
                      order.deliveryAddress?.city,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {order.deliveryAddress?.deliveryNotes && (
                    <p className="text-gray-500 italic mt-2 border-l-2 border-[var(--color-primary)] pl-2">
                      Note: {order.deliveryAddress.deliveryNotes}
                    </p>
                  )}
                </div>
              </div>

              {/* Bill Summary */}
              <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiCreditCard className="text-[var(--color-primary)]" size={16} />
                  Order Financials
                </h3>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({order.items?.length || 0} items)</span>
                    <span className="font-semibold text-gray-900">৳{order.subtotal}</span>
                  </div>
                  {order.couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({order.couponCode || "Coupon"})</span>
                      <span className="font-semibold">-৳{order.couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-gray-900">৳{order.shippingCharge}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between text-sm">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-black text-[var(--color-primary)]">৳{order.totalAmount}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex justify-between items-center text-[11px]">
                    <span className="text-gray-500">Payment Status</span>
                    <span className="font-bold capitalize">{order.paymentStatus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Items List */}
            <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-gray-100 font-bold text-sm text-gray-900">
                Order Items ({order.items?.length || 0})
              </div>
              <div className="divide-y divide-gray-100">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-sm border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0 relative">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FiPackage size={18} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Qty: {item.quantity} {item.unit || "pcs"} • ৳{item.salePrice || item.unitPrice} each
                        </p>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-900 flex-shrink-0">
                      ৳{item.totalPrice}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Cancellation Modal ── */}
        {showCancelModal && order && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-sm border border-gray-200 w-full max-w-md p-6 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-red-600">
                <FiAlertTriangle size={20} />
                <h3 className="font-bold text-base text-gray-900">Cancel Order #{order.orderNumber}?</h3>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Are you sure you want to cancel this order? Once cancelled, items will be released back to stock.
                {order.paymentStatus === "paid" && (
                  <span className="block mt-1 font-semibold text-blue-600">
                    • Your paid amount of ৳{order.totalAmount} will be marked for refund.
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
                    <label key={r} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-gray-50 rounded-sm">
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
                  onClick={() => setShowCancelModal(false)}
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
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
