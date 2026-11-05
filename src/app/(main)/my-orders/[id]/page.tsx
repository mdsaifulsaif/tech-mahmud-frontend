"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useGetMyOrderByIdQuery, useCancelOrderMutation } from "@/redux/api/orderApi";
import { format } from "date-fns";
import {
  FiArrowLeft,
  FiMapPin,
  FiPhone,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiShoppingBag,
  FiAlertCircle,
  FiCreditCard,
  FiUser,
  FiXCircle,
  FiRefreshCw,
  FiAlertTriangle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useSocket } from "@/lib/socket";

// Status progression steps
const statusSteps = [
  { key: "pending", label: "Order Placed", subLabel: "অর্ডার গৃহীত", icon: FiClock },
  { key: "confirmed", label: "Confirmed", subLabel: "কনফার্মড", icon: FiCheckCircle },
  { key: "assigned", label: "Rider Assigned", subLabel: "রাইডার নিয়োগ", icon: FiUser },
  { key: "processing", label: "Packing & Ready", subLabel: "প্রস্তুতকরণ", icon: FiPackage },
  { key: "out_for_delivery", label: "Out for Delivery", subLabel: "ডেলিভারির পথে", icon: FiTruck },
  { key: "delivered", label: "Delivered", subLabel: "ডেলিভারি সম্পন্ন", icon: FiCheckCircle },
];

const statusColor: Record<string, string> = {
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

const paymentStatusColor: Record<string, string> = {
  unpaid: "text-amber-600",
  paid: "text-[var(--color-primary)] font-black",
  refunded: "text-blue-600 font-black",
  partially_paid: "text-yellow-600",
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, refetch } = useGetMyOrderByIdQuery(id as string);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const { socket } = useSocket();
  const order = data?.data;

  // Real-time socket updates for this order
  useEffect(() => {
    if (!socket || !order?._id) return;
    const roomName = `order-${order._id}`;
    socket.emit("join-room", roomName);

    const handleStatusUpdate = (payload: any) => {
      console.log("Realtime order status:", payload);
      toast.success(payload?.message || "Order status updated!");
      refetch();
    };

    socket.on("order-status-update", handleStatusUpdate);

    return () => {
      socket.off("order-status-update", handleStatusUpdate);
      socket.emit("leave-room", roomName);
    };
  }, [socket, order?._id, refetch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
          <p className="text-sm text-[var(--color-text-muted)] font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center px-4">
        <div className="bg-white rounded-sm border border-gray-200 p-8 text-center max-w-md w-full shadow-xs">
          <FiAlertCircle size={40} className="text-red-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-gray-900 mb-1">Order not found</h2>
          <p className="text-xs text-gray-500 mb-4">The order you are looking for does not exist or has been removed.</p>
          <Link
            href="/my-orders"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-sm"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Calculate status index
  const getStatusIndex = (currentStatus: string) => {
    if (currentStatus === "shipped") return 3;
    return statusSteps.findIndex((s) => s.key === currentStatus);
  };

  const currentStatusIndex = getStatusIndex(order.status);
  const isTerminal = order.status === "cancelled" || order.status === "returned";
  const isCancellable = order.status === "pending" || order.status === "confirmed";

  const timeline = order.statusTimeline || [];
  const progressPct = isTerminal
    ? 0
    : currentStatusIndex <= 0
    ? 5
    : Math.min(100, Math.round((currentStatusIndex / (statusSteps.length - 1)) * 100));

  const handleCancelSubmit = async () => {
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
    <div className="min-h-screen bg-[var(--color-surface)] pb-24">
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-4">
        {/* ── 1. Header ── */}
        <div className="bg-white rounded-sm border border-gray-200 shadow-xs p-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="w-9 h-9 rounded-sm border border-gray-200 flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors flex-shrink-0 cursor-pointer"
              >
                <FiArrowLeft size={16} className="text-[var(--color-text-secondary)]" />
              </button>
              <div>
                <h1 className="text-base font-bold text-[var(--color-text-primary)]">
                  Order Details
                </h1>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5 font-mono">
                  #{order.orderNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-sm border capitalize ${
                  statusColor[order.status] || "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {order.status.replace(/_/g, " ")}
              </span>

              {isCancellable && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-sm text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel Order
                </button>
              )}

              <Link
                href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}`}
                className="flex items-center gap-1.5 bg-[var(--color-primary)] text-white px-3 py-1.5 rounded-sm text-xs font-bold hover:opacity-90 transition-opacity"
              >
                <FiTruck size={13} />
                Live Tracking
              </Link>
            </div>
          </div>

          {/* Meta Info */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <FiClock size={12} />
              Placed on{" "}
              {order.createdAt
                ? format(new Date(order.createdAt), "dd MMM yyyy, h:mm a")
                : "—"}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="flex items-center gap-1.5">
              <FiPackage size={12} />
              {order.items.length} item{order.items.length > 1 ? "s" : ""}
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span
              className={`flex items-center gap-1.5 font-semibold ${
                paymentStatusColor[order.paymentStatus] || ""
              }`}
            >
              <FiCreditCard size={12} />
              {order.paymentStatus === "paid" ? "✓ Paid" : order.paymentStatus.replace(/_/g, " ")} •{" "}
              {order.paymentMethod?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* ── 2. Track Order Stepper ── */}
        <div className="bg-white rounded-sm border border-gray-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              Order Status Progression
            </h3>
            <span className="text-xs text-[var(--color-text-muted)]">
              Live updates
            </span>
          </div>

          {/* Desktop Progress Stepper */}
          <div className="relative mb-8 hidden md:block">
            {/* Progress line */}
            <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 rounded-sm">
              <div
                className="h-full bg-[var(--color-primary)] rounded-sm transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="relative flex justify-between z-10">
              {statusSteps.map((step, idx) => {
                const isCompleted = !isTerminal && idx <= currentStatusIndex;
                const isActive = !isTerminal && idx === currentStatusIndex;
                const Icon = step.icon;
                const timelineEntry = timeline.find((t: any) => t.status === step.key);

                return (
                  <div key={step.key} className="flex flex-col items-center text-center max-w-[110px]">
                    <div
                      className={`w-10 h-10 rounded-sm flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-2xs"
                          : isActive
                          ? "bg-white text-[var(--color-primary)] border-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/20"
                          : "bg-white text-gray-300 border-gray-200"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <p
                      className={`text-xs font-bold mt-2 leading-tight ${
                        isCompleted || isActive
                          ? "text-[var(--color-text-primary)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                      {step.subLabel}
                    </p>
                    {timelineEntry?.changedAt && (
                      <p className="text-[9px] text-[var(--color-text-muted)] mt-1 font-mono bg-gray-50 px-1 py-0.5 rounded-sm">
                        {format(new Date(timelineEntry.changedAt), "dd MMM, h:mm a")}
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
              const isCompleted = !isTerminal && idx <= currentStatusIndex;
              const isActive = !isTerminal && idx === currentStatusIndex;
              const Icon = step.icon;
              const timelineEntry = timeline.find((t: any) => t.status === step.key);

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
                          isCompleted || isActive
                            ? "text-[var(--color-text-primary)]"
                            : "text-[var(--color-text-muted)]"
                        }`}
                      >
                        {step.label}
                      </p>
                      {timelineEntry?.changedAt && (
                        <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                          {format(new Date(timelineEntry.changedAt), "dd MMM, h:mm a")}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">{step.subLabel}</p>
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
            <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3">
              <FiXCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-700">Order Cancelled</p>
                {order.cancelReason && (
                  <p className="text-xs text-red-600 mt-0.5">
                    <span className="font-semibold">Reason:</span> {order.cancelReason}
                  </p>
                )}
                {order.paymentStatus === "refunded" && (
                  <p className="text-xs text-blue-700 font-semibold bg-blue-50 border border-blue-200 p-2 rounded-sm mt-2">
                    ✓ Refund Processed: এই অর্ডারের টাকা (৳{order.totalAmount}) রিফান্ড হিসেবে প্রসেস করা হয়েছে।
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── 3. Assigned Rider Card (if assigned) ── */}
        {order.assignedRider && (
          <div className="bg-white rounded-sm border border-gray-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FiTruck className="text-[var(--color-primary)]" size={17} />
                Delivery Rider Details
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

        {/* ── 4. Order Items Table ── */}
        <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              Order Items ({order.items.length})
            </h3>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-text-muted)] border-b border-gray-100">
            <div className="col-span-6 sm:col-span-5">Item</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="hidden sm:block col-span-2 text-center">Unit Price</div>
            <div className="col-span-3 sm:col-span-2 text-right">Total</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-2 px-5 py-3 items-center">
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-sm border border-gray-200 overflow-hidden bg-[var(--color-surface)] flex-shrink-0">
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
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[var(--color-text-primary)] truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {item.weightOrVolume && `${item.weightOrVolume} ${item.unit}`}
                    </p>
                  </div>
                </div>
                <div className="col-span-3 text-center text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">
                  {item.quantity} {item.unit || "pcs"}
                </div>
                <div className="hidden sm:block col-span-2 text-center text-xs sm:text-sm text-[var(--color-text-muted)]">
                  ৳{item.salePrice || item.unitPrice}
                </div>
                <div className="col-span-3 sm:col-span-2 text-right text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">
                  ৳{item.totalPrice}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Footer */}
          <div className="p-5 border-t border-gray-100 bg-[var(--color-surface)]">
            <div className="max-w-xs ml-auto space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">
                  Subtotal ({order.items.length} items)
                </span>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  ৳{order.subtotal}
                </span>
              </div>
              {order.couponCode && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)]">
                    Coupon ({order.couponCode})
                  </span>
                  <span className="font-semibold text-emerald-600">
                    -৳{order.couponDiscount || 0}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Delivery Fee</span>
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {order.shippingCharge === 0 ? (
                    <span className="text-[var(--color-primary)] font-bold">Free</span>
                  ) : (
                    `৳${order.shippingCharge}`
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="font-bold text-[var(--color-text-primary)]">Total Paid</span>
                <span className="text-lg font-black text-[var(--color-text-primary)]">
                  ৳{order.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. Delivery Address & Order Summary ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order Summary */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-xs p-5">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">
              Order Summary
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Order Number</span>
                <span className="font-medium text-[var(--color-text-primary)] font-mono">
                  #{order.orderNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Order Date</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {order.createdAt ? format(new Date(order.createdAt), "dd MMM yyyy") : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Items Count</span>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {order.items.length} items
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-[var(--color-text-primary)] font-bold">Total Amount</span>
                <span className="font-bold text-[var(--color-text-primary)]">৳{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-sm border border-gray-200 shadow-xs p-5">
            <h3 className="text-sm font-bold text-[var(--color-text-primary)] mb-4">
              Delivery Address
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">
                  {order.deliveryAddress?.name}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1">
                  <FiPhone size={13} className="text-[var(--color-text-muted)]" />
                  {order.deliveryAddress?.phone}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <FiMapPin size={15} className="text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {[
                    order.deliveryAddress?.houseNo && `House ${order.deliveryAddress.houseNo}`,
                    order.deliveryAddress?.road && `Road ${order.deliveryAddress.road}`,
                    order.deliveryAddress?.block && `Block ${order.deliveryAddress.block}`,
                    order.deliveryAddress?.area?.name || order.deliveryAddress?.area,
                    order.deliveryAddress?.city,
                    order.deliveryAddress?.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              {order.deliveryAddress?.deliveryNotes && (
                <p className="text-xs text-[var(--color-text-muted)] italic border-l-2 border-[var(--color-primary)] pl-3">
                  {order.deliveryAddress.deliveryNotes}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Cancel Modal ── */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-sm border border-gray-200 w-full max-w-md p-6 shadow-xl space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 text-red-600">
                <FiAlertTriangle size={20} />
                <h3 className="font-bold text-base text-gray-900">
                  Cancel Order #{order.orderNumber}?
                </h3>
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
};

export default OrderDetailsPage;