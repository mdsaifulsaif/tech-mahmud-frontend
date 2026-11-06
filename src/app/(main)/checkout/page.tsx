"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FiCheck,
  FiTruck,
  FiCreditCard,
  FiShield,
  FiMapPin,
  FiChevronRight,
  FiLock,
  FiTag,
  FiPackage,
  FiHome,
  FiPhone,
  FiMail,
  FiUser,
  FiFileText,
  FiInfo,
  FiAlertCircle,
  FiArrowRight,
  FiDollarSign,
} from "react-icons/fi";
import { FaMoneyBillWave, FaCreditCard, FaStore } from "react-icons/fa";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@/redux";
import { clearCart, setPlacingOrder } from "@/redux/slices/cartSlice";
import { useCreateOrderMutation } from "@/redux/api/orderApi";
import { useApplyCouponMutation } from "@/redux/api/couponApi";
import { useGetDeliverySettingsQuery } from "@/redux/api/shippingApi";
import AvailableCouponsDrawer from "@/components/cart/AvailableCouponsDrawer";

const BD_DISTRICTS = [
  "Barisal",
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Rangpur",
  "Mymensingh",
  "Sylhet",
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chuadanga",
  "Cumilla",
  "Cox's Bazar",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokathi",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Tangail",
  "Thakurgaon",
];

function CheckoutContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  // 1. Cart Items & Subtotal from Redux
  const { items, totalPrice: subtotal } = useAppSelector((state) => state.cart);

  // 2. Fetch Dynamic Delivery Settings from Admin (Base Location & Rates)
  const { data: deliverySettingsResponse } = useGetDeliverySettingsQuery(undefined);
  const deliverySettings = deliverySettingsResponse?.data || {
    baseLocation: "Barisal",
    insideCharge: 60,
    outsideCharge: 150,
    insideEstimatedDays: "24 - 48 Hours",
    outsideEstimatedDays: "2 - 4 Days",
    isFreeShippingActive: false,
    freeShippingMinAmount: 2000,
    isStorePickupActive: true,
    storePickupAddress: "Tech Mahmud Main Store, Sadar Road, Barisal",
    storePickupCharge: 0,
  };

  const baseLocation = deliverySettings.baseLocation || "Barisal";
  const insideCharge = Number(deliverySettings.insideCharge ?? 60);
  const outsideCharge = Number(deliverySettings.outsideCharge ?? 150);

  // 3. API Mutations
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();
  const [applyCouponMutation, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();

  // 4. Form State (Star Tech Bangladesh Exact Fields)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "pickup">("courier");
  const [deliveryZone, setDeliveryZone] = useState<"local" | "nationwide">("local");
  const [district, setDistrict] = useState("Barisal");
  const [streetAddress, setStreetAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [orderComments, setOrderComments] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online" | "pos">("cod");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // 5. Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);

  // Auto fill user details from session if available
  useEffect(() => {
    if (session?.user) {
      const u: any = session.user;
      if (u.firstName) setFirstName(u.firstName);
      if (u.lastName) setLastName(u.lastName);
      if (u.name && !u.firstName) {
        const parts = u.name.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
      if (u.phone) setPhone(u.phone);
      if (u.email) setEmail(u.email);
    }
  }, [session]);

  // Sync deliveryZone with district selection
  useEffect(() => {
    if (district.toLowerCase() === baseLocation.toLowerCase()) {
      setDeliveryZone("local");
    } else {
      setDeliveryZone("nationwide");
    }
  }, [district, baseLocation]);

  // 6. Calculate Dynamic Shipping Charge
  const shippingCharge = useMemo(() => {
    if (deliveryMethod === "pickup") return 0;

    // Check free shipping condition
    if (
      deliverySettings.isFreeShippingActive &&
      deliverySettings.freeShippingMinAmount > 0 &&
      subtotal >= deliverySettings.freeShippingMinAmount
    ) {
      return 0;
    }

    if (deliveryZone === "local") {
      return insideCharge;
    } else {
      return outsideCharge;
    }
  }, [deliveryMethod, deliveryZone, subtotal, deliverySettings, insideCharge, outsideCharge]);

  const couponDiscount = appliedCoupon?.discountAmount || 0;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCharge);

  // Apply Coupon Handler
  const handleApplyCoupon = async (codeOverride?: string) => {
    const code = (codeOverride || couponCode).trim();
    if (!code) {
      toast.error("Please enter a valid coupon code");
      return;
    }

    try {
      const res = await applyCouponMutation({
        couponCode: code,
        subtotal,
        orderItems: items.map((i: any) => ({
          productID: i.productID || i._id || i.id,
          unitPrice: i.price,
          quantity: i.quantity,
          totalPrice: i.price * i.quantity,
        })),
      }).unwrap();

      const discount = res?.data?.discountAmount || 0;
      setAppliedCoupon({
        code,
        discountAmount: discount,
      });
      toast.success(`Coupon "${code}" applied! Saved ৳${discount} 🎉`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid or expired coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  // Submit Order Handler
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items || items.length === 0) {
      toast.error("Your cart is empty! Add products before checkout.");
      router.push("/");
      return;
    }

    if (!firstName.trim()) {
      toast.error("Please enter your First Name");
      return;
    }
    if (!lastName.trim()) {
      toast.error("Please enter your Last Name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your Phone Number");
      return;
    }

    // BD Phone validation: 11 digits
    const cleanedPhone = phone.replace(/[^0-9]/g, "");
    if (cleanedPhone.length < 11) {
      toast.error("Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX)");
      return;
    }

    if (deliveryMethod === "courier" && !streetAddress.trim()) {
      toast.error("Please enter your delivery street address");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the Terms & Conditions to proceed.");
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const finalDeliveryType = deliveryMethod === "pickup" ? "local" : deliveryZone;

    const orderPayload = {
      items: items.map((item: any) => ({
        productID: item.productID || item._id || item.id,
        variantID: item.variantId || item.variantID || undefined,
        quantity: item.quantity,
        unitPrice: item.price,
        salePrice: item.salePrice,
        selectedAttributes: {
          color: item.color,
          size: item.size,
          storage: item.storage,
        },
      })),
      deliveryType: finalDeliveryType,
      deliveryAddress: {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: cleanedPhone,
        email: email.trim() || undefined,
        address: deliveryMethod === "pickup" ? deliverySettings.storePickupAddress : streetAddress.trim(),
        city: district,
        district: district,
        postalCode: postalCode.trim() || undefined,
        deliveryNotes: orderComments.trim() || undefined,
      },
      paymentMethod: paymentMethod === "online" ? "card" : paymentMethod === "pos" ? "cod" : "cod",
      couponCode: appliedCoupon?.code || undefined,
      specialInstructions: orderComments.trim() || undefined,
      customerName: fullName,
      customerPhone: cleanedPhone,
    };

    try {
      dispatch(setPlacingOrder(true));
      const response = await createOrder(orderPayload).unwrap();
      const createdOrder = response?.data || response;

      dispatch(clearCart());
      toast.success("Congratulations! Your order has been placed successfully! 🛍️");

      router.push(`/checkout/success?orderNumber=${createdOrder?.orderNumber || ""}&total=${grandTotal}`);
    } catch (err: any) {
      dispatch(setPlacingOrder(false));
      toast.error(err?.data?.message || "Failed to place order. Please try again.");
    }
  };

  // If cart is empty
  if (!items || items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            <FiPackage />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your Shopping Cart is Empty</h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-6">
            Looks like you haven't added any products to your cart yet. Explore our latest gadgets and clothing collection!
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-16 pt-4">
      {/* Breadcrumb (Star Tech Style) */}
      <div className="container mb-5">
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#2563EB] transition font-medium">
            Home
          </Link>
          <FiChevronRight className="text-gray-400" size={12} />
          <Link href="/cart" className="hover:text-[#2563EB] transition font-medium">
            Shopping Cart
          </Link>
          <FiChevronRight className="text-gray-400" size={12} />
          <span className="font-bold text-gray-900">Checkout</span>
        </nav>
      </div>

      <div className="container">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Checkout
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
            <FiLock size={12} />
            <span className="font-bold">SSL 256-Bit Encrypted & Secure Checkout</span>
          </div>
        </div>

        <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ============================================================ */}
          {/* LEFT COLUMN: STAR TECH EXACT FORM SECTIONS                   */}
          {/* ============================================================ */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. CUSTOMER INFORMATION */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                <span className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-black text-xs">
                  1
                </span>
                <h2 className="text-base font-bold text-gray-900">
                  Customer Information (গ্রাহকের তথ্য)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-3 text-gray-400" size={15} />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Saiful"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Saif"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Telephone / Mobile <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-3 text-gray-400" size={15} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    E-Mail Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-3 text-gray-400" size={15} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. DELIVERY METHOD (Star Tech Signature) */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                <span className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-black text-xs">
                  2
                </span>
                <h2 className="text-base font-bold text-gray-900">
                  Delivery Method (ডেলিভারি পদ্ধতি)
                </h2>
              </div>

              {/* Courier Delivery vs Store Pickup Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("courier")}
                  className={`p-3.5 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                    deliveryMethod === "courier"
                      ? "border-[#2563EB] bg-blue-50/40 shadow-xs"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <FiTruck className={`mt-0.5 shrink-0 ${deliveryMethod === "courier" ? "text-[#2563EB]" : "text-gray-400"}`} size={20} />
                  <div>
                    <span className="text-sm font-bold text-gray-900 block">Home / Courier Delivery</span>
                    <span className="text-xs text-gray-500">Delivered directly to your doorstep</span>
                  </div>
                </button>

                {deliverySettings.isStorePickupActive && (
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("pickup")}
                    className={`p-3.5 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                      deliveryMethod === "pickup"
                        ? "border-[#2563EB] bg-blue-50/40 shadow-xs"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <FaStore className={`mt-0.5 shrink-0 ${deliveryMethod === "pickup" ? "text-[#2563EB]" : "text-gray-400"}`} size={18} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 block">Store Pickup</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">FREE</span>
                      </div>
                      <span className="text-xs text-gray-500">Collect from our outlet / showroom</span>
                    </div>
                  </button>
                )}
              </div>

              {/* Courier Delivery Zone Selection (Inside Base vs Outside Base) */}
              {deliveryMethod === "courier" && (
                <div className="pt-2 space-y-2.5">
                  <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Select Delivery Zone:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                        deliveryZone === "local"
                          ? "border-[#2563EB] bg-blue-50/60 ring-2 ring-[#2563EB]/20"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50/40"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="deliveryZone"
                          value="local"
                          checked={deliveryZone === "local"}
                          onChange={() => setDeliveryZone("local")}
                          className="mt-1 text-[#2563EB]"
                        />
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                            Inside {baseLocation} (লোকাল)
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {deliverySettings.insideEstimatedDays}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-gray-900">
                        ৳{insideCharge}
                      </span>
                    </label>

                    <label
                      className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                        deliveryZone === "nationwide"
                          ? "border-[#2563EB] bg-blue-50/60 ring-2 ring-[#2563EB]/20"
                          : "border-gray-200 hover:border-gray-300 bg-gray-50/40"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="deliveryZone"
                          value="nationwide"
                          checked={deliveryZone === "nationwide"}
                          onChange={() => setDeliveryZone("nationwide")}
                          className="mt-1 text-[#2563EB]"
                        />
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-gray-900 block">
                            Outside {baseLocation} (দেশজুড়ে)
                          </span>
                          <span className="text-[11px] text-gray-500">
                            {deliverySettings.outsideEstimatedDays}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-gray-900">
                        ৳{outsideCharge}
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Store Pickup Notice */}
              {deliveryMethod === "pickup" && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                  <span className="font-bold block">📍 Pickup Address:</span>
                  <p>{deliverySettings.storePickupAddress}</p>
                  <span className="text-[11px] text-emerald-700 block pt-1">
                    Please bring your order confirmation SMS / email when collecting your item.
                  </span>
                </div>
              )}
            </div>

            {/* 3. DELIVERY ADDRESS (Star Tech Exact Fields) */}
            {deliveryMethod === "courier" && (
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                  <span className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-black text-xs">
                    3
                  </span>
                  <h2 className="text-base font-bold text-gray-900">
                    Delivery Address (ডেলিভারির ঠিকানা)
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Street Address (ঠিকানা: বাড়ি/রোড/এলাকা) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. House #12, Road #4, Rupatali / Dhanmondi"
                      required
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      City / District (জেলা) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                    >
                      {BD_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Post Code (পোস্ট কোড) <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 8200"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Special Delivery Instructions / Comments <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={orderComments}
                      onChange={(e) => setOrderComments(e.target.value)}
                      placeholder="e.g. Please call before arriving or leave with security"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. PAYMENT METHOD (Star Tech Signature) */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
                <span className="w-7 h-7 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-black text-xs">
                  {deliveryMethod === "courier" ? "4" : "3"}
                </span>
                <h2 className="text-base font-bold text-gray-900">
                  Payment Method (পেমেন্ট পদ্ধতি)
                </h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                    paymentMethod === "cod"
                      ? "border-[#2563EB] bg-blue-50/50 ring-2 ring-[#2563EB]/20"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 text-[#2563EB]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-emerald-600" size={16} />
                      <span className="text-sm font-bold text-gray-900">
                        Cash on Delivery (ক্যাশ অন ডেলিভারি)
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      পণ্য হাতে পেয়ে দেখে ক্যাশ টাকা পরিশোধ করুন।
                    </span>
                  </div>
                </label>

                {/* Online Payment (SSLCommerz) */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                    paymentMethod === "online"
                      ? "border-[#2563EB] bg-blue-50/50 ring-2 ring-[#2563EB]/20"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="mt-1 text-[#2563EB]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <FaCreditCard className="text-[#2563EB]" size={16} />
                        <span className="text-sm font-bold text-gray-900">
                          Online Payment (বিকাশ / নগদ / কার্ড)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                        Instant SSLCommerz
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      bKash, Nagad, Rocket, বা Visa / Mastercard কার্ড দিয়ে নিরাপদে পেমেন্ট করুন।
                    </span>
                  </div>
                </label>

                {/* POS on Delivery */}
                <label
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3.5 ${
                    paymentMethod === "pos"
                      ? "border-[#2563EB] bg-blue-50/50 ring-2 ring-[#2563EB]/20"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pos"
                    checked={paymentMethod === "pos"}
                    onChange={() => setPaymentMethod("pos")}
                    className="mt-1 text-[#2563EB]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FiCreditCard className="text-purple-600" size={16} />
                      <span className="text-sm font-bold text-gray-900">
                        POS on Delivery (কার্ড সোয়াইপ)
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      ডেলিভারি গ্রহণের সময় রাইডারের কাছে কার্ড সোয়াইপ করে পেমেন্ট করুন।
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: STAR TECH ORDER OVERVIEW & SUMMARY             */}
          {/* ============================================================ */}
          <div className="lg:col-span-5 space-y-6 sticky top-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/90 shadow-2xs space-y-5">
              <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
                <span>Order Overview ({items.length} items)</span>
                <Link href="/cart" className="text-xs font-semibold text-[#2563EB] hover:underline">
                  Edit Cart
                </Link>
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 no-scrollbar divide-y divide-gray-100">
                {items.map((item: any, idx: number) => {
                  const itemImg = item.image || item.thumbnail || "/img/sbb1.png";
                  return (
                    <div key={idx} className="flex gap-3 pt-3 first:pt-0">
                      <div className="w-14 h-14 rounded-lg bg-gray-50 border border-gray-200/80 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                        <img src={itemImg} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {item.name}
                        </h4>

                        {/* Variant Badges (Clothing Size & Color, Gadget Storage) */}
                        <div className="flex items-center flex-wrap gap-1 mt-1">
                          {item.color && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                              Color: {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-blue-800">
                              Size: {item.size}
                            </span>
                          )}
                          {item.storage && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-800">
                              {item.storage}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-1 text-xs">
                          <span className="text-gray-500">
                            ৳{Number(item.price).toLocaleString()} × {item.quantity}
                          </span>
                          <span className="font-bold text-gray-900">
                            ৳{(Number(item.price) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Code Section */}
              <div className="pt-3 border-t border-gray-100">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <FiTag />
                      <span>{appliedCoupon.code} (-৳{appliedCoupon.discountAmount.toLocaleString()})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-500 hover:underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon Code"
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 uppercase focus:outline-none focus:border-[#2563EB]"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="px-4 py-2 bg-gray-900 hover:bg-[#2563EB] text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
                      >
                        {isApplyingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsCouponDrawerOpen(true)}
                      className="text-[11px] font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                    >
                      <FiTag size={11} /> View available coupons
                    </button>
                  </div>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-3 border-t border-gray-100 space-y-2.5 text-xs text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 text-sm">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>
                    Delivery Charge (
                    {deliveryMethod === "pickup"
                      ? "Store Pickup"
                      : deliveryZone === "local"
                      ? `Inside ${baseLocation}`
                      : `Outside ${baseLocation}`}
                    )
                  </span>
                  <span className="font-bold text-gray-900 text-sm">
                    {shippingCharge === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `৳${shippingCharge.toLocaleString()}`
                    )}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">Total Payable</span>
                  <span className="text-xl sm:text-2xl font-black text-[#2563EB]">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Terms and Conditions Agreement Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600 leading-snug">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 text-[#2563EB] rounded"
                    required
                  />
                  <span>
                    I have read and agree to the{" "}
                    <Link href="/terms" target="_blank" className="text-[#2563EB] font-bold hover:underline">
                      Terms & Conditions
                    </Link>
                    ,{" "}
                    <Link href="/privacy" target="_blank" className="text-[#2563EB] font-bold hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    and Return Policy.
                  </span>
                </label>
              </div>

              {/* Confirm Order Button */}
              <button
                type="submit"
                disabled={isPlacingOrder || !agreeTerms}
                className="w-full py-4 px-6 bg-[#2563EB] hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <FiCheck size={18} />
                    <span>Confirm Order (অর্ডার নিশ্চিত করুন)</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-gray-500 text-center">
                <div className="p-2 rounded-lg bg-gray-50 flex items-center justify-center gap-1.5">
                  <FiShield className="text-emerald-600" />
                  <span>100% Genuine</span>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 flex items-center justify-center gap-1.5">
                  <FiLock className="text-[#2563EB]" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Available Coupons Drawer */}
      <AvailableCouponsDrawer
        isOpen={isCouponDrawerOpen}
        onClose={() => setIsCouponDrawerOpen(false)}
        currentSubtotal={subtotal}
        onApplyCoupon={(code: string) => {
          handleApplyCoupon(code);
          setIsCouponDrawerOpen(false);
        }}
        appliedCouponCode={appliedCoupon?.code}
      />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-9 h-9 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
