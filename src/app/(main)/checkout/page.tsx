// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { useAppDispatch, useAppSelector } from "@/redux";
// import { clearCart, setPlacingOrder } from "@/redux/slices/cartSlice";
// import { useCreateOrderMutation } from "@/redux/api/orderApi";
// import { useGetAllAreasQuery } from "@/redux/api/areaApi";
// import {
//   FiMapPin,
//   FiCreditCard,
//   FiTruck,
//   FiChevronLeft,
//   FiLock,
//   FiClock,
//   FiCalendar,
//   FiTag,
//   FiChevronDown,
//   FiPackage,
//   FiHome,
//   FiBriefcase,
//   FiHeart,
//   FiMoreHorizontal,
// } from "react-icons/fi";
// import Link from "next/link";
// import { toast } from "react-hot-toast";

// interface Area {
//   _id: string;
//   name: string;
//   isActive: boolean;
// }

// ===== Section Header =====
// const SectionHeader = ({
//   icon,
//   title,
//   subtitle,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   subtitle?: string;
// }) => (
//   <div className="flex items-center gap-3 mb-5">
//     <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
//       {icon}
//     </div>
//     <div>
//       <h2 className="text-base font-bold text-[var(--color-text-primary)]">
//         {title}
//       </h2>
//       {subtitle && (
//         <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
//           {subtitle}
//         </p>
//       )}
//     </div>
//   </div>
// );

// // ===== Input Field =====
// const InputField = ({
//   label,
//   required,
//   children,
// }: {
//   label: string;
//   required?: boolean;
//   children: React.ReactNode;
// }) => (
//   <div>
//     <label className="block text-xs font-semibold text-[var(--color-text-muted)] mb-1.5">
//       {label} {required && <span className="text-red-400">*</span>}
//     </label>
//     {children}
//   </div>
// );

// const inputClass =
//   "w-full px-4 py-2.5 bg-[var(--color-surface)] border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] focus:bg-white transition-all text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]";

// const CheckoutPage = () => {
//   const { items, totalPrice } = useAppSelector((state) => state.cart);
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

//   const { data: areasResponse, isLoading: isLoadingAreas } =
//     useGetAllAreasQuery({});
//   const areas: Area[] = (areasResponse?.data || []).filter(
//     (a: Area) => a.isActive,
//   );

//   const [showCoupon, setShowCoupon] = useState(false);
//   const [couponCode, setCouponCode] = useState("");

//   // ✅ Delivery Time state
//   const [orderMode, setOrderMode] = useState<"normal" | "preorder">("normal");
//   const [wantsCustomTime, setWantsCustomTime] = useState(false);
//   const [customTime, setCustomTime] = useState("");

//   const [formData, setFormData] = useState({
//     fullName: (session?.user as any)?.firstName || "",
//     phone: (session?.user as any)?.phone || "",
//     email: "",
//     deliveryType: "local" as "local" | "nationwide",
//     city: "",
//     area: "",
//     district: "",
//     upazila: "",
//     houseNo: "",
//     road: "",
//     flatNo: "",
//     postalCode: "",
//     deliveryNotes: "",
//     label: "home" as "home" | "work" | "partner" | "other",
//     paymentMethod: "cod",
//     specialInstructions: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
//     >,
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const todayStr = new Date().toISOString().split("T")[0];
//   const tomorrowStr = new Date(Date.now() + 86400000)
//     .toISOString()
//     .split("T")[0];

//   useEffect(() => {
//     setCustomTime("");
//     setWantsCustomTime(false);
//   }, [orderMode]);

//   // ✅ Component unmount হওয়ার সময় flag reset করে দিন (safety)
//   useEffect(() => {
//     return () => {
//       dispatch(setPlacingOrder(false));
//     };
//   }, [dispatch]);

//   const estimatedShipping =
//     formData.deliveryType === "local" ? (totalPrice >= 1000 ? 0 : 60) : 120;
//   const grandTotal = totalPrice + estimatedShipping;

//   const labelIcons: Record<string, React.ReactNode> = {
//     home: <FiHome size={13} />,
//     work: <FiBriefcase size={13} />,
//     partner: <FiHeart size={13} />,
//     other: <FiMoreHorizontal size={13} />,
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.fullName || !formData.phone || !formData.city) {
//       toast.error("Please fill in all required fields");
//       return;
//     }
//     if (formData.deliveryType === "local" && !formData.area) {
//       toast.error("Please select your delivery area");
//       return;
//     }
//     if (formData.deliveryType === "nationwide" && !formData.district) {
//       toast.error("Please provide your district");
//       return;
//     }
//     if (formData.deliveryType === "local") {
//       if (orderMode === "preorder" && !customTime) {
//         toast.error("Pre-order এর জন্য ডেলিভারি সময় নির্বাচন করুন");
//         return;
//       }
//       if (orderMode === "normal" && wantsCustomTime && !customTime) {
//         toast.error("অনুগ্রহ করে ডেলিভারি সময় নির্বাচন করুন");
//         return;
//       }
//     }

//     const orderData: any = {
//       items: items.map((item) => ({
//         productID: item.productID,
//         variantID: item.variantID || undefined,
//         quantity: item.quantity,
//       })),
//       deliveryType: formData.deliveryType,
//       deliveryAddress: {
//         name: formData.fullName,
//         phone: formData.phone,
//         email: formData.email || undefined,
//         city: formData.city,
//         area: formData.area,
//         district: formData.district || undefined,
//         upazila: formData.upazila || undefined,
//         houseNo: formData.houseNo || undefined,
//         road: formData.road || undefined,
//         flatNo: formData.flatNo || undefined,
//         postalCode: formData.postalCode || undefined,
//         deliveryNotes: formData.deliveryNotes || undefined,
//         label: formData.label,
//       },
//       paymentMethod: formData.paymentMethod,
//       specialInstructions: formData.specialInstructions || undefined,
//     };

//     if (formData.deliveryType === "local") {
//       if (orderMode === "preorder") {
//         orderData.deliveryDate = tomorrowStr;
//         orderData.deliveryTime = customTime;
//       } else if (wantsCustomTime && customTime) {
//         orderData.deliveryDate = todayStr;
//         orderData.deliveryTime = customTime;
//       }
//     }

//     dispatch(setPlacingOrder(true));
//     try {
//       await createOrder(orderData).unwrap();
//       dispatch(clearCart());
//       toast.success("Order placed successfully! 🛍️", { duration: 5000 });
//       router.push("/checkout/success");
//     } catch (err: any) {
//       toast.error(
//         err?.data?.message || "Failed to place order. Please try again.",
//       );
//     } finally {
//       dispatch(setPlacingOrder(false));
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (status === "unauthenticated") {
//     router.push("/login?redirect=/checkout");
//     return null;
//   }

//   if (!items || items.length === 0) {
//     router.push("/cart");
//     return null;
//   }

//   return (
//     // ✅ pb-28 দেওয়া হলো যাতে mobile floating bar page content কে ঢেকে না ফেলে
//     <div className="min-h-screen bg-[var(--color-surface)] pb-28 md:pb-20">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-6xl">
//         {/* Back */}
//         <Link
//           href="/cart"
//           className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-6 transition-colors group"
//         >
//           <FiChevronLeft
//             size={16}
//             className="group-hover:-translate-x-0.5 transition-transform"
//           />
//           Back to Cart
//         </Link>

//         <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
//           Checkout
//         </h1>

//         {/* ✅ ফর্মে id দেওয়া হলো — এই id দিয়েই FloatingCartButton থেকে ফর্ম submit করা হবে */}
//         <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
//           {/* ===== ROW 1: Customer Info + Order Summary ===== */}
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
//             {/* ── Customer Information ── */}
//             <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//               <SectionHeader
//                 icon={<FiMapPin size={17} />}
//                 title="Customer Information"
//               />

//               <div className="space-y-5">
//                 {/* Contact Information */}
//                 <div>
//                   <p className="text-xs font-bold text-[var(--color-text-primary)] mb-3">
//                     Contact Information
//                   </p>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                     <InputField label="Full Name" required>
//                       <input
//                         type="text"
//                         name="fullName"
//                         required
//                         value={formData.fullName}
//                         onChange={handleChange}
//                         className={inputClass}
//                         placeholder="Your full name"
//                       />
//                     </InputField>
//                     <InputField label="Phone Number" required>
//                       <input
//                         type="tel"
//                         name="phone"
//                         required
//                         value={formData.phone}
//                         onChange={handleChange}
//                         className={inputClass}
//                         placeholder="01XXXXXXXXX"
//                       />
//                     </InputField>
//                     <InputField label="Email">
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className={inputClass}
//                         placeholder="you@email.com"
//                       />
//                     </InputField>
//                   </div>
//                 </div>

//                 {/* Delivery Type */}
//                 <div>
//                   <p className="text-xs font-bold text-[var(--color-text-primary)] mb-3">
//                     Delivery Type
//                   </p>
//                   <div className="grid grid-cols-2 gap-3">
//                     {[
//                       {
//                         value: "local",
//                         label: "Local",
//                         sub: "Barisal city",
//                         icon: <FiMapPin size={16} />,
//                       },
//                       {
//                         value: "nationwide",
//                         label: "Nationwide",
//                         sub: "3 business days",
//                         icon: <FiPackage size={16} />,
//                       },
//                     ].map((opt) => (
//                       <label
//                         key={opt.value}
//                         className={`flex items-center gap-2.5 p-3 border rounded-xl cursor-pointer transition-all ${
//                           formData.deliveryType === opt.value
//                             ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
//                             : "border-gray-200 hover:border-gray-300"
//                         }`}
//                       >
//                         <input
//                           type="radio"
//                           name="deliveryType"
//                           value={opt.value}
//                           checked={formData.deliveryType === opt.value}
//                           onChange={handleChange}
//                           className="sr-only"
//                         />
//                         <div
//                           className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${formData.deliveryType === opt.value ? "bg-[var(--color-primary)] text-white" : "bg-gray-100 text-gray-400"}`}
//                         >
//                           {opt.icon}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-sm font-bold text-[var(--color-text-primary)]">
//                             {opt.label}
//                           </p>
//                           <p className="text-[11px] text-[var(--color-text-muted)]">
//                             {opt.sub}
//                           </p>
//                         </div>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Delivery Address */}
//                 <div>
//                   <div className="flex items-center justify-between mb-3">
//                     <p className="text-xs font-bold text-[var(--color-text-primary)]">
//                       Delivery Address
//                     </p>
//                     <div className="flex gap-1.5">
//                       {(["home", "work", "partner", "other"] as const).map(
//                         (lbl) => (
//                           <button
//                             key={lbl}
//                             type="button"
//                             onClick={() =>
//                               setFormData({ ...formData, label: lbl })
//                             }
//                             title={lbl}
//                             className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
//                               formData.label === lbl
//                                 ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
//                                 : "border-gray-200 text-gray-400 hover:border-gray-300"
//                             }`}
//                           >
//                             {labelIcons[lbl]}
//                           </button>
//                         ),
//                       )}
//                     </div>
//                   </div>

//                   <div className="space-y-3">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                       <InputField label="City" required>
//                         <input
//                           type="text"
//                           name="city"
//                           required
//                           value={formData.city}
//                           onChange={handleChange}
//                           className={inputClass}
//                           placeholder="Dhaka"
//                         />
//                       </InputField>

//                       {formData.deliveryType === "local" ? (
//                         <InputField label="Area" required>
//                           <div className="relative">
//                             <select
//                               name="area"
//                               required
//                               value={formData.area}
//                               onChange={handleChange}
//                               disabled={isLoadingAreas}
//                               className={`${inputClass} appearance-none pr-10 disabled:opacity-60`}
//                             >
//                               <option value="">
//                                 {isLoadingAreas ? "Loading..." : "Select area"}
//                               </option>
//                               {areas.map((area) => (
//                                 <option key={area._id} value={area._id}>
//                                   {area.name}
//                                 </option>
//                               ))}
//                             </select>
//                             <FiChevronDown
//                               size={14}
//                               className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
//                             />
//                           </div>
//                         </InputField>
//                       ) : (
//                         <InputField label="District" required>
//                           <input
//                             type="text"
//                             name="district"
//                             required
//                             value={formData.district}
//                             onChange={handleChange}
//                             className={inputClass}
//                             placeholder="Rangpur"
//                           />
//                         </InputField>
//                       )}
//                     </div>

//                     {formData.deliveryType === "nationwide" && (
//                       <InputField label="Upazila">
//                         <input
//                           type="text"
//                           name="upazila"
//                           value={formData.upazila}
//                           onChange={handleChange}
//                           className={inputClass}
//                           placeholder="Sadar"
//                         />
//                       </InputField>
//                     )}

//                     <div className="grid grid-cols-3 gap-3">
//                       <InputField label="House No">
//                         <input
//                           type="text"
//                           name="houseNo"
//                           value={formData.houseNo}
//                           onChange={handleChange}
//                           className={inputClass}
//                           placeholder="12"
//                         />
//                       </InputField>
//                       <InputField label="Road">
//                         <input
//                           type="text"
//                           name="road"
//                           value={formData.road}
//                           onChange={handleChange}
//                           className={inputClass}
//                           placeholder="5"
//                         />
//                       </InputField>
//                       <InputField label="Flat No">
//                         <input
//                           type="text"
//                           name="flatNo"
//                           value={formData.flatNo}
//                           onChange={handleChange}
//                           className={inputClass}
//                           placeholder="4B"
//                         />
//                       </InputField>
//                     </div>

//                     <InputField label="Additional Notes">
//                       <textarea
//                         name="deliveryNotes"
//                         value={formData.deliveryNotes}
//                         onChange={handleChange}
//                         rows={2}
//                         className={`${inputClass} resize-none`}
//                         placeholder="Enter area, street or house no..."
//                       />
//                     </InputField>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ── Order Summary ── */}
//             <div className="lg:col-span-5">
//               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-6">
//                 <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
//                   <h2 className="text-base font-bold text-[var(--color-text-primary)]">
//                     Order Summary
//                   </h2>
//                   <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-full">
//                     {items.length} item{items.length > 1 ? "s" : ""}
//                   </span>
//                 </div>

//                 <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 mb-5">
//                   {items.map((item) => (
//                     <div key={item.id} className="flex gap-3 items-start">
//                       <div className="w-14 h-14 bg-[var(--color-surface)] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
//                         <img
//                           src={item.image}
//                           alt={item.name}
//                           className="w-full h-full object-contain p-1"
//                         />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-semibold text-[var(--color-text-primary)] line-clamp-2 leading-snug">
//                           {item.name}
//                         </p>
//                         <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
//                           Qty: {item.quantity}
//                         </p>
//                       </div>
//                       <p className="text-sm font-bold text-[var(--color-text-primary)] flex-shrink-0">
//                         ৳{(item.price * item.quantity).toLocaleString()}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Coupon */}
//                 <div className="mb-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowCoupon(!showCoupon)}
//                     className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors w-full"
//                   >
//                     <FiTag size={13} />
//                     {showCoupon ? "Hide coupon" : "Have a coupon code?"}
//                     <FiChevronDown
//                       size={13}
//                       className={`ml-auto transition-transform ${showCoupon ? "rotate-180" : ""}`}
//                     />
//                   </button>

//                   {showCoupon && (
//                     <div className="mt-2.5 flex gap-2">
//                       <input
//                         type="text"
//                         value={couponCode}
//                         onChange={(e) => setCouponCode(e.target.value)}
//                         placeholder="Enter coupon code"
//                         className={`${inputClass} flex-1`}
//                       />
//                       <button
//                         type="button"
//                         className="px-4 py-2.5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex-shrink-0"
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Selected delivery time summary */}
//                 {formData.deliveryType === "local" &&
//                   customTime &&
//                   (orderMode === "preorder" || wantsCustomTime) && (
//                     <div className="mb-4 p-3 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl flex items-center gap-2">
//                       <FiClock
//                         className="text-[var(--color-primary)] flex-shrink-0"
//                         size={15}
//                       />
//                       <div>
//                         <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
//                           {orderMode === "preorder"
//                             ? "Pre-order · আগামীকাল"
//                             : "নির্ধারিত সময় · আজ"}
//                         </p>
//                         <p className="text-xs font-semibold text-[var(--color-text-primary)]">
//                           {customTime}
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                 {/* Pricing breakdown */}
//                 <div className="space-y-2.5 pt-4 border-t border-gray-100">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-[var(--color-text-muted)]">
//                       Subtotal
//                     </span>
//                     <span className="font-semibold text-[var(--color-text-primary)]">
//                       ৳{totalPrice.toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-[var(--color-text-muted)]">
//                       Delivery charge
//                     </span>
//                     <span className="font-semibold text-[var(--color-text-primary)]">
//                       {estimatedShipping === 0 ? (
//                         <span className="text-[var(--color-primary)] font-bold">
//                           FREE
//                         </span>
//                       ) : (
//                         `৳${estimatedShipping}`
//                       )}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-[var(--color-text-muted)]">
//                       Discount
//                     </span>
//                     <span className="font-semibold text-green-600">-৳0</span>
//                   </div>
//                   <div className="flex justify-between items-center pt-3 border-t border-gray-100">
//                     <span className="text-sm font-bold text-[var(--color-text-primary)]">
//                       Total
//                     </span>
//                     <span className="text-xl font-black text-[var(--color-text-primary)]">
//                       ৳{grandTotal.toLocaleString()}
//                     </span>
//                   </div>
//                   <p className="text-[10px] text-[var(--color-text-muted)]">
//                     * Final delivery charge confirmed after review
//                   </p>
//                 </div>

//                 {/* Submit (Desktop / normal in-page button) */}
//                 {/* <button
//                                     type="submit"
//                                     disabled={isPlacingOrder}
//                                     className="mt-5 w-full flex items-center justify-center gap-2.5 py-4 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm tracking-wide hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-[var(--color-primary)]/25 disabled:opacity-60 disabled:cursor-not-allowed"
//                                 >
//                                     {isPlacingOrder ? (
//                                         <>
//                                             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                                             Placing order...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <FiLock size={15} />
//                                             Place Order • ৳{grandTotal.toLocaleString()}
//                                         </>
//                                     )}
//                                 </button> */}

//                 <button
//                   type="submit"
//                   disabled={isPlacingOrder}
//                   className="mt-5 hidden md:block w-full flex items-center justify-center gap-2.5 py-4 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm tracking-wide hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-[var(--color-primary)]/25 disabled:opacity-60 disabled:cursor-not-allowed"
//                 >
//                   {isPlacingOrder ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                       Confirming order...
//                     </>
//                   ) : (
//                     <>
//                       <FiLock size={15} />
//                       Confirm Order • ৳{grandTotal.toLocaleString()}
//                     </>
//                   )}
//                 </button>

//                 <p className="text-[10px] text-[var(--color-text-muted)] text-center mt-3 leading-relaxed">
//                   By placing your order, you agree to our{" "}
//                   <Link
//                     href="/terms"
//                     className="underline hover:text-[var(--color-primary)]"
//                   >
//                     Terms & Conditions
//                   </Link>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ===== ROW 2: Delivery Time (full width, local delivery only) ===== */}
//           {formData.deliveryType === "local" && (
//             <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//               <SectionHeader
//                 icon={<FiTruck size={17} />}
//                 title="Delivery Time"
//                 subtitle="আপনার অর্ডার কখন ডেলিভারি চান?"
//               />

//               {/* Mode tabs */}
//               <div className="flex gap-2 mb-4 border-b border-gray-100">
//                 {(["normal", "preorder"] as const).map((mode) => (
//                   <button
//                     key={mode}
//                     type="button"
//                     onClick={() => setOrderMode(mode)}
//                     className={`px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition-all flex items-center gap-1.5 ${
//                       orderMode === mode
//                         ? "border-[var(--color-primary)] text-[var(--color-primary)]"
//                         : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
//                     }`}
//                   >
//                     {mode === "normal" ? "Normal Order" : "Pre-order"}
//                     {mode === "preorder" && (
//                       <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
//                         Tomorrow
//                       </span>
//                     )}
//                   </button>
//                 ))}
//               </div>

//               {orderMode === "normal" ? (
//                 <div>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm font-semibold text-[var(--color-text-primary)]">
//                         নির্দিষ্ট সময়ে ডেলিভারি চান?
//                       </p>
//                       <p className="text-xs text-[var(--color-text-muted)]">
//                         না দিলে যত দ্রুত সম্ভব ডেলিভারি হবে
//                       </p>
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => setWantsCustomTime(!wantsCustomTime)}
//                       className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${wantsCustomTime ? "bg-[var(--color-primary)]" : "bg-gray-200"}`}
//                     >
//                       <div
//                         className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${wantsCustomTime ? "left-5" : "left-0.5"}`}
//                       />
//                     </button>
//                   </div>

//                   {wantsCustomTime && (
//                     <div className="mt-4 max-w-xs">
//                       <InputField label="Delivery Time (9 AM - 5 PM)" required>
//                         <div className="relative">
//                           <FiClock
//                             size={14}
//                             className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)] pointer-events-none"
//                           />
//                           <input
//                             type="time"
//                             min="09:00"
//                             max="17:00"
//                             value={customTime}
//                             onChange={(e) => setCustomTime(e.target.value)}
//                             required={wantsCustomTime}
//                             className={`${inputClass} pl-9`}
//                           />
//                         </div>
//                       </InputField>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div>
//                   <div className="mb-3 p-3 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl flex items-center gap-2">
//                     <FiCalendar
//                       className="text-[var(--color-primary)] flex-shrink-0"
//                       size={15}
//                     />
//                     <p className="text-sm font-semibold text-[var(--color-text-primary)]">
//                       আগামীকাল,{" "}
//                       {new Date(tomorrowStr).toLocaleDateString("en-BD", {
//                         weekday: "long",
//                         day: "numeric",
//                         month: "short",
//                       })}
//                     </p>
//                   </div>
//                   <div className="max-w-xs">
//                     <InputField label="Delivery Time (9 AM - 5 PM)" required>
//                       <div className="relative">
//                         <FiClock
//                           size={14}
//                           className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)] pointer-events-none"
//                         />
//                         <input
//                           type="time"
//                           min="09:00"
//                           max="17:00"
//                           value={customTime}
//                           onChange={(e) => setCustomTime(e.target.value)}
//                           required
//                           className={`${inputClass} pl-9`}
//                         />
//                       </div>
//                     </InputField>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ===== ROW 3: Payment Method (full width) ===== */}
//           <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//             <SectionHeader
//               icon={<FiCreditCard size={17} />}
//               title="Payment Method"
//               subtitle="How would you like to pay?"
//             />

//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
//               {[
//                 {
//                   value: "cod",
//                   label: "Cash on Delivery",
//                   sub: "Pay on receive",
//                   icon: "💵",
//                   available: true,
//                 },
//                 {
//                   value: "bkash",
//                   label: "bKash",
//                   sub: "Coming soon",
//                   icon: "📱",
//                   available: false,
//                 },
//                 {
//                   value: "nagad",
//                   label: "Nagad",
//                   sub: "Coming soon",
//                   icon: "💳",
//                   available: false,
//                 },
//                 {
//                   value: "card",
//                   label: "Card",
//                   sub: "Coming soon",
//                   icon: "💳",
//                   available: false,
//                 },
//               ].map((method) => (
//                 <label
//                   key={method.value}
//                   className={`flex flex-col items-center text-center gap-0.5 p-2.5 border rounded-lg transition-all ${
//                     !method.available
//                       ? "opacity-40 cursor-not-allowed border-gray-100 bg-gray-50"
//                       : formData.paymentMethod === method.value
//                         ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 cursor-pointer"
//                         : "border-gray-200 hover:border-gray-300 cursor-pointer"
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="paymentMethod"
//                     value={method.value}
//                     checked={formData.paymentMethod === method.value}
//                     onChange={handleChange}
//                     disabled={!method.available}
//                     className="sr-only"
//                   />
//                   <span className="text-lg leading-none">{method.icon}</span>
//                   <p className="text-xs font-bold text-[var(--color-text-primary)] leading-tight">
//                     {method.label}
//                   </p>
//                   <p className="text-[10px] text-[var(--color-text-muted)] leading-tight">
//                     {method.sub}
//                   </p>
//                 </label>
//               ))}
//             </div>

//             <div className="mt-4">
//               <InputField label="Special Instructions (Optional)">
//                 <textarea
//                   name="specialInstructions"
//                   value={formData.specialInstructions}
//                   onChange={handleChange}
//                   rows={2}
//                   className={`${inputClass} resize-none`}
//                   placeholder="Any special requests for your order..."
//                 />
//               </InputField>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppDispatch, useAppSelector } from "@/redux";
import { clearCart, setPlacingOrder } from "@/redux/slices/cartSlice";
import { useCreateOrderMutation } from "@/redux/api/orderApi";
import { useGetAllAreasQuery } from "@/redux/api/areaApi";
import { useGetShippingPreviewQuery } from "@/redux/api/shippingApi";
import { useApplyCouponMutation } from "@/redux/api/couponApi";
import SmartUpsellNudge from "@/components/cart/SmartUpsellNudge";
import AvailableCouponsDrawer from "@/components/cart/AvailableCouponsDrawer";
import {
  FiMapPin,
  FiCreditCard,
  FiTruck,
  FiChevronLeft,
  FiLock,
  FiClock,
  FiCalendar,
  FiTag,
  FiChevronDown,
  FiPackage,
  FiHome,
  FiBriefcase,
  FiHeart,
  FiMoreHorizontal,
  FiUser,
  FiPhone,
  FiCheck,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Area {
  _id: string;
  name: string;
  isActive: boolean;
}

// ===== Delivery Time Slots =====
const DELIVERY_TIME_SLOTS = [
  { label: "09:00 AM - 11:00 AM", startHour: 9, startMinute: 0 },
  { label: "11:00 AM - 01:00 PM", startHour: 11, startMinute: 0 },
  { label: "02:00 PM - 04:00 PM", startHour: 14, startMinute: 0 },
  { label: "04:00 PM - 06:00 PM", startHour: 16, startMinute: 0 },
];

// ===== Section Header =====
const SectionHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <h2 className="text-[15px] font-bold text-[var(--color-text-primary)] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

// ===== Sub-label (small eyebrow above a field group) =====
const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
    {children}
  </p>
);

// ===== Input Field =====
const InputField = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="block text-xs font-semibold text-[var(--color-text-primary)]/80 mb-1.5">
      {label}{" "}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full px-4 py-3 bg-[var(--color-surface)] border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 focus:bg-white transition-all text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]";

const CheckoutContent = () => {
  const { items, totalPrice } = useAppSelector((state) => state.cart);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();
  const [applyCouponMutation, { isLoading: isApplyingCoupon }] = useApplyCouponMutation();

  const { data: areasResponse, isLoading: isLoadingAreas } =
    useGetAllAreasQuery({});
  const areas: Area[] = (areasResponse?.data || []).filter(
    (a: Area) => a.isActive,
  );

  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountType?: string;
  } | null>(null);
  const [isCouponDrawerOpen, setIsCouponDrawerOpen] = useState(false);
  const [showMobileItems, setShowMobileItems] = useState(false);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }
    const currentUserId =
      (session?.user as any)?.id ||
      (session?.user as any)?._id ||
      undefined;

    try {
      const res: any = await applyCouponMutation({
        code,
        subtotal: totalPrice,
        userID: currentUserId,
        items: items.map((it) => ({
          productID: it.productID || it.id,
          variantID: it.variantID || undefined,
          quantity: it.quantity,
          unitPrice: it.mrp || it.price,
          salePrice: it.price,
          totalPrice: it.price * it.quantity,
          category: it.category,
        })),
      }).unwrap();

      const discount = res?.data?.discountAmount || 0;
      setAppliedCoupon({
        code: res?.data?.code || code,
        discountAmount: discount,
        discountType: res?.data?.discountType,
      });
      setCouponCode(res?.data?.code || code);
      setShowCoupon(true);
      toast.success(res?.message || `Coupon ${code} applied successfully!`);
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Invalid or ineligible coupon code"
      );
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Coupon removed");
  };

  // Auto-apply if coupon param in URL (?coupon=SOBJI50)
  useEffect(() => {
    const couponFromQuery = searchParams?.get("coupon");
    if (couponFromQuery && totalPrice > 0 && !appliedCoupon) {
      setCouponCode(couponFromQuery);
      setShowCoupon(true);
      handleApplyCoupon(couponFromQuery);
    }
  }, [searchParams, totalPrice]);

  // ✅ Delivery Time state
  const [orderMode, setOrderMode] = useState<"normal" | "preorder">("normal");
  const [wantsCustomTime, setWantsCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState("");

  // Delivery Time slot calculation
  const isSlotDisabled = (slot: (typeof DELIVERY_TIME_SLOTS)[0]) => {
    // Pre-order is for next day (tomorrow) -> always allowed
    if (orderMode === "preorder") {
      return false;
    }

    // Normal order is for today -> compare with current time
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const slotStartMinutes = slot.startHour * 60 + slot.startMinute;

    return currentMinutes >= slotStartMinutes;
  };

  const allSlotsDisabled =
    orderMode === "normal" &&
    DELIVERY_TIME_SLOTS.every((slot) => isSlotDisabled(slot));

  useEffect(() => {
    if (wantsCustomTime && customTime) {
      const selected = DELIVERY_TIME_SLOTS.find((s) => s.label === customTime);
      if (selected && isSlotDisabled(selected)) {
        setCustomTime("");
      }
    }
  }, [orderMode, wantsCustomTime]);

  // ✅ Location Verification state (Check if customer orders from outside Barisal)
  const [deviceCoords, setDeviceCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isOutsideLocation, setIsOutsideLocation] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setDeviceCoords({ lat, lng });

          // Barisal Center coordinate
          const barisalLat = 22.7055;
          const barisalLng = 90.3555;
          const R = 6371; // km
          const dLat = ((lat - barisalLat) * Math.PI) / 180;
          const dLng = ((lng - barisalLng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((barisalLat * Math.PI) / 180) *
              Math.cos((lat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distanceKm = R * c;

          // If distance > 25km (e.g., Dhaka/Khulna is >100km away), flag as outside
          if (distanceKm > 25) {
            setIsOutsideLocation(true);
          }
        },
        () => {
          // Geolocation unavailable or ignored — defaults safely to false
        },
        { timeout: 8000, maximumAge: 600000 }
      );
    }
  }, []);

  // ✅ city & email field সরিয়ে দেওয়া হয়েছে — এগুলো ছাড়াই backend order নেবে
  const [formData, setFormData] = useState({
    fullName: (session?.user as any)?.firstName || "",
    phone: (session?.user as any)?.phone || "",
    deliveryType: "local" as "local" | "nationwide",
    area: "",
    district: "",
    upazila: "",
    houseNo: "",
    road: "",
    flatNo: "",
    postalCode: "",
    deliveryNotes: "",
    label: "home" as "home" | "work" | "partner" | "other",
    paymentMethod: "cod",
    specialInstructions: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrowStr = new Date(Date.now() + 86400000)
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    setCustomTime("");
    setWantsCustomTime(false);
  }, [orderMode]);

  // ✅ Component unmount হওয়ার সময় flag reset করে দিন (safety)
  useEffect(() => {
    return () => {
      dispatch(setPlacingOrder(false));
    };
  }, [dispatch]);

  // const estimatedShipping =
  //   formData.deliveryType === "local" ? (totalPrice >= 1000 ? 0 : 60) : 120;
  // const grandTotal = totalPrice + estimatedShipping;

  const { data: shippingPreview, isFetching: isShippingLoading , error: shippingError } =
    useGetShippingPreviewQuery(
      {
        deliveryType: formData.deliveryType,
        subtotal: totalPrice,
      },
      {
        skip: !totalPrice,
      },
    );

  const estimatedShipping = shippingPreview?.data?.shippingCharge ?? 0;
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const grandTotal = Math.max(0, totalPrice + estimatedShipping - couponDiscount);


console.log("shippingPreview:", shippingPreview, "error:", shippingError);

  const labelOptions: {
    value: "home" | "work" | "partner" | "other";
    text: string;
    icon: React.ReactNode;
  }[] = [
    { value: "home", text: "Home", icon: <FiHome size={13} /> },
    { value: "work", text: "Work", icon: <FiBriefcase size={13} /> },
    { value: "partner", text: "Partner", icon: <FiHeart size={13} /> },
    { value: "other", text: "Other", icon: <FiMoreHorizontal size={13} /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ city ও email ছাড়াই validate হচ্ছে — শুধু নাম ও ফোন লাগবে
    if (!formData.fullName || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (formData.deliveryType === "local" && !formData.area) {
      toast.error("Please select your delivery area");
      return;
    }
    if (formData.deliveryType === "nationwide" && !formData.district) {
      toast.error("Please provide your district");
      return;
    }
    // ✅ সময় নির্বাচন সম্পূর্ণ optional — শুধু toggle অন থাকলে ও খালি রাখলে error
    if (formData.deliveryType === "local" && wantsCustomTime && !customTime) {
      toast.error("অনুগ্রহ করে ডেলিভারি সময় নির্বাচন করুন");
      return;
    }

    const orderData: any = {
      items: items.map((item) => ({
        productID: item.productID,
        variantID: item.variantID || undefined,
        quantity: item.quantity,
      })),
      deliveryType: formData.deliveryType,
      deliveryAddress: {
        name: formData.fullName,
        phone: formData.phone,
        area: formData.area,
        district: formData.district || undefined,
        upazila: formData.upazila || undefined,
        houseNo: formData.houseNo || undefined,
        road: formData.road || undefined,
        flatNo: formData.flatNo || undefined,
        postalCode: formData.postalCode || undefined,
        deliveryNotes: formData.deliveryNotes || undefined,
        label: formData.label,
      },
      paymentMethod: formData.paymentMethod,
      specialInstructions: formData.specialInstructions || undefined,
      isOutsideLocation,
      orderPlacedCoords: deviceCoords || undefined,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      couponDiscount: couponDiscount > 0 ? couponDiscount : undefined,
    };

    // ✅ Pre-order হলে সবসময় deliveryDate = tomorrow, কিন্তু deliveryTime শুধু user বেছে নিলেই যাবে
    // ✅ Normal order হলে টগল অন থাকলেই today + time যাবে, নাহলে কিছুই যাবে না (ASAP)
    if (formData.deliveryType === "local") {
      if (orderMode === "preorder") {
        orderData.deliveryDate = tomorrowStr;
        if (wantsCustomTime && customTime) {
          orderData.deliveryTime = customTime;
        }
      } else if (wantsCustomTime && customTime) {
        orderData.deliveryDate = todayStr;
        orderData.deliveryTime = customTime;
      }
    }

    dispatch(setPlacingOrder(true));
    try {
      await createOrder(orderData).unwrap();
      dispatch(clearCart());
      toast.success("Order placed successfully! 🛍️", { duration: 5000 });
      router.push("/checkout/success");
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to place order. Please try again.",
      );
    } finally {
      dispatch(setPlacingOrder(false));
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/checkout");
    } else if (status === "authenticated" && (!items || items.length === 0)) {
      router.push("/cart");
    }
  }, [status, items, router]);

  if (status === "loading" || status === "unauthenticated" || !items || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--color-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    // ✅ pb-28 দেওয়া হলো যাতে mobile floating bar page content কে ঢেকে না ফেলে
    <div className="min-h-screen bg-[var(--color-surface)] pb-28 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 max-w-6xl">
        {/* Back + Secure badge */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors group"
          >
            <FiChevronLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Cart
          </Link>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
            <FiLock size={12} />
            Secure Checkout
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight mb-4 sm:mb-6">
          Checkout
        </h1>

        {/* ✅ Mobile Compact Smart Upsell Nudge (কত কিনলে কত ছাড় / ফ্রি ডেলিভারি লক্ষ্য) */}
        <div className="block lg:hidden mb-4">
          <SmartUpsellNudge
            currentSubtotal={totalPrice}
            onApplyCoupon={(code: string) => handleApplyCoupon(code)}
            onOpenCouponDrawer={() => setIsCouponDrawerOpen(true)}
            appliedCouponCode={appliedCoupon?.code}
            appliedDiscountAmount={appliedCoupon?.discountAmount || 0}
            isFreeShipping={estimatedShipping === 0}
            compact={true}
          />
        </div>

        {/* ✅ ফর্মে id দেওয়া হলো — এই id দিয়েই FloatingCartButton থেকে ফর্ম submit করা হবে */}
        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
          {/* ===== ROW 1: Customer Info + Order Summary ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* ── Customer Information ── */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <SectionHeader
                icon={<FiUser size={17} />}
                title="Customer Information"
                subtitle="Who should we deliver this to?"
              />

              <div className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-3">
                  <InputField label="Full Name" required>
                    <div className="relative">
                      <FiUser
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`}
                        placeholder="Your full name"
                      />
                    </div>
                  </InputField>
                  <InputField label="Phone Number" required>
                    <div className="relative">
                      <FiPhone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`}
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  </InputField>
                </div>

                {/* Delivery Type (Temporarily hidden from initial UI as requested - defaults to local) */}
                {/* 
                <div>
                  <SubLabel>Delivery Type</SubLabel>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: "local",
                        label: "Local",
                        sub: "Barisal city",
                        icon: <FiMapPin size={16} />,
                      },
                      {
                        value: "nationwide",
                        label: "Nationwide",
                        sub: "3 business days",
                        icon: <FiPackage size={16} />,
                      },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`relative flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                          formData.deliveryType === opt.value
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]/20"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryType"
                          value={opt.value}
                          checked={formData.deliveryType === opt.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${formData.deliveryType === opt.value ? "bg-[var(--color-primary)] text-white" : "bg-gray-100 text-gray-400"}`}
                        >
                          {opt.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[var(--color-text-primary)]">
                            {opt.label}
                          </p>
                          <p className="text-[11px] text-[var(--color-text-muted)]">
                            {opt.sub}
                          </p>
                        </div>
                        {formData.deliveryType === opt.value && (
                          <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center">
                            <FiCheck size={10} />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
                */}

                {/* Delivery Address */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <SubLabel>Delivery Address</SubLabel>
                  </div>

                  <div className="space-y-3">
                    {formData.deliveryType === "local" ? (
                      <InputField label="Area" required>
                        <div className="relative">
                          <select
                            name="area"
                            required
                            value={formData.area}
                            onChange={handleChange}
                            disabled={isLoadingAreas}
                            className={`${inputClass} appearance-none pr-10 disabled:opacity-60`}
                          >
                            <option value="">
                              {isLoadingAreas ? "Loading..." : "Select area"}
                            </option>
                            {areas.map((area) => (
                              <option key={area._id} value={area._id}>
                                {area.name}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown
                            size={14}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
                          />
                        </div>
                      </InputField>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <InputField label="District" required>
                          <input
                            type="text"
                            name="district"
                            required
                            value={formData.district}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Rangpur"
                          />
                        </InputField>
                        <InputField label="Upazila">
                          <input
                            type="text"
                            name="upazila"
                            value={formData.upazila}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="Sadar"
                          />
                        </InputField>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-3">
                      <InputField label="House No">
                        <input
                          type="text"
                          name="houseNo"
                          value={formData.houseNo}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="12"
                        />
                      </InputField>
                      <InputField label="Road">
                        <input
                          type="text"
                          name="road"
                          value={formData.road}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="5"
                        />
                      </InputField>
                      <InputField label="Flat No">
                        <input
                          type="text"
                          name="flatNo"
                          value={formData.flatNo}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="4B"
                        />
                      </InputField>
                    </div>

                    <InputField label="Additional Notes">
                      <textarea
                        name="deliveryNotes"
                        value={formData.deliveryNotes}
                        onChange={handleChange}
                        rows={2}
                        className={`${inputClass} resize-none`}
                        placeholder="Landmark, delivery instructions, or special notes..."
                      />
                    </InputField>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Order Summary (Desktop only: hidden on mobile to avoid long scroll) ── */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-6">
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                  <h2 className="text-[15px] font-bold text-[var(--color-text-primary)] tracking-tight">
                    Order Summary
                  </h2>
                  <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-full">
                    {items.length} item{items.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="w-14 h-14 bg-[var(--color-surface)] rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[var(--color-text-primary)] line-clamp-2 leading-snug">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[var(--color-text-primary)] flex-shrink-0">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Smart Upsell Nudge Bar (Compact & Clean like mobile to prevent squishing) */}
                <div className="mb-4">
                  <SmartUpsellNudge
                    compact={true}
                    currentSubtotal={totalPrice}
                    onApplyCoupon={(code: string) => handleApplyCoupon(code)}
                    onOpenCouponDrawer={() => setIsCouponDrawerOpen(true)}
                    appliedCouponCode={appliedCoupon?.code}
                    appliedDiscountAmount={appliedCoupon?.discountAmount || 0}
                    isFreeShipping={estimatedShipping === 0}
                  />
                </div>

                {/* Coupon (Always Visible Input, Clean & Simple like mobile) */}
                <div className="mb-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                      <FiTag size={13} className="text-[var(--color-primary)]" />
                      Coupon Code
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCouponDrawerOpen(true)}
                      className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200/80 transition-all flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                    >
                      <span>🎟️</span>
                      <span>Available Coupons</span>
                    </button>
                  </div>

                  {appliedCoupon ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between shadow-2xs animate-fadeIn">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          ✓
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                            <span className="font-mono tracking-wider">{appliedCoupon.code}</span>
                            <span className="text-[11px] text-emerald-700 font-semibold">
                              (-৳{appliedCoupon.discountAmount.toLocaleString()})
                            </span>
                          </p>
                          <p className="text-[10px] text-emerald-600">কুপন ডিসকাউন্ট সফলভাবে যুক্ত হয়েছে</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-1 transition cursor-pointer"
                      >
                        <FiX size={12} /> Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code"
                          className={`${inputClass} flex-1 uppercase font-mono tracking-wider text-xs py-2`}
                          disabled={isApplyingCoupon}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleApplyCoupon();
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon()}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex-shrink-0 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          {isApplyingCoupon ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Applying...
                            </>
                          ) : (
                            "Apply"
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-[var(--color-text-muted)] flex items-center justify-between">
                        <span>কুপন কোড বড় হাতের অক্ষরে লিখুন</span>
                        <button
                          type="button"
                          onClick={() => setIsCouponDrawerOpen(true)}
                          className="text-[var(--color-primary)] font-semibold hover:underline cursor-pointer"
                        >
                          কুপন তালিকা দেখুন →
                        </button>
                      </p>
                    </div>
                  )}
                </div>

                {/* Selected delivery time summary */}
                {formData.deliveryType === "local" &&
                  customTime &&
                  (orderMode === "preorder" || wantsCustomTime) && (
                    <div className="mb-4 p-3 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl flex items-center gap-2">
                      <FiClock
                        className="text-[var(--color-primary)] flex-shrink-0"
                        size={15}
                      />
                      <div>
                        <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider">
                          {orderMode === "preorder"
                            ? "Pre-order · আগামীকাল"
                            : "নির্ধারিত সময় · আজ"}
                        </p>
                        <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                          {customTime}
                        </p>
                      </div>
                    </div>
                  )}

                {/* Pricing breakdown */}
                <div className="space-y-2.5 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">
                      Subtotal
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      ৳{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">
                      Delivery charge
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {isShippingLoading ? (
                        <span className="inline-block w-10 h-3 bg-gray-100 rounded animate-pulse" />
                      ) : estimatedShipping === 0 ? (
                        <span className="text-[var(--color-primary)] font-bold">
                          FREE
                        </span>
                      ) : (
                        `৳${estimatedShipping}`
                      )}
                    </span>
                  </div>
                  {couponDiscount > 0 ? (
                    <div className="flex justify-between text-sm animate-fadeIn">
                      <span className="text-[var(--color-text-muted)] flex items-center gap-1.5">
                        <span>Coupon Discount</span>
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 uppercase font-mono">
                          {appliedCoupon?.code}
                        </span>
                      </span>
                      <span className="font-semibold text-emerald-600">
                        -৳{couponDiscount.toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-text-muted)]">
                        Discount
                      </span>
                      <span className="font-semibold text-gray-400">৳0</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">
                      Total
                    </span>
                    <span className="text-xl font-black text-[var(--color-text-primary)]">
                      ৳{grandTotal.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--color-text-muted)]">
                    * Final delivery charge confirmed after review
                  </p>
                </div>

                {/* Outside location notice */}
                {isOutsideLocation && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                    <FiAlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                    <div className="space-y-0.5">
                      <p className="font-bold text-amber-900">
                        বরিশাল শহরের বাইরে থেকে অর্ডার করছেন?
                      </p>
                      <p className="text-[11px] text-amber-700 leading-relaxed">
                        অর্ডারের পর আমাদের ডেলিভারি টিম আপনার ডেলিভারি ঠিকানা ও রিসিভার নিশ্চিত করতে ফোনে যোগাযোগ করতে পারে।
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit (Desktop / normal in-page button) */}
                <button
                  type="submit"
                  // disabled={isPlacingOrder}
                  disabled={isPlacingOrder || isShippingLoading}
                  className="mt-5 hidden md:flex w-full items-center justify-center gap-2.5 py-4 bg-[var(--color-primary)] text-white rounded-xl font-bold text-sm tracking-wide hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-[var(--color-primary)]/25 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Confirming order...
                    </>
                  ) : (
                    <>
                      <FiLock size={15} />
                      Confirm Order • ৳{grandTotal.toLocaleString()}
                    </>
                  )}
                </button>

                <p className="text-[10px] text-[var(--color-text-muted)] text-center mt-3 leading-relaxed">
                  By placing your order, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="underline hover:text-[var(--color-primary)]"
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* ===== ROW 2: Delivery Time (full width, local delivery only) ===== */}
          {formData.deliveryType === "local" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <SectionHeader
                icon={<FiTruck size={17} />}
                title="Delivery Time"
                subtitle="আপনার অর্ডার কখন ডেলিভারি চান?"
              />

              {/* Mode tabs */}
              <div className="flex gap-2 mb-4 border-b border-gray-100">
                {(["normal", "preorder"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setOrderMode(mode)}
                    className={`px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition-all flex items-center gap-1.5 ${
                      orderMode === mode
                        ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                        : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {mode === "normal" ? "Normal Order" : "Pre-order"}
                    {mode === "preorder" && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                        Tomorrow
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ✅ Pre-order হলে "আগামীকাল" ব্যাজ দেখাই, তারপর দুই মোডেই একই optional time-toggle */}
              {orderMode === "preorder" && (
                <div className="mb-4 p-3 bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl flex items-center gap-2">
                  <FiCalendar
                    className="text-[var(--color-primary)] flex-shrink-0"
                    size={15}
                  />
                  <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                    আগামীকাল,{" "}
                    {new Date(tomorrowStr).toLocaleDateString("en-BD", {
                      weekday: "long",
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-[#FF5A5A]/25 bg-[#FF5A5A]/5">
                  <div className="flex items-center gap-2.5">
                    <FiClock
                      className="text-[#FF5A5A] shrink-0"
                      size={20}
                    />
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        নির্দিষ্ট সময়ে ডেলিভারি চান?
                      </p>
                      <p className="text-xs text-gray-500">
                        নিচের সুবিধাজনক সময় সিলেক্ট করুন
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !wantsCustomTime;
                      setWantsCustomTime(next);
                      if (!next) setCustomTime("");
                    }}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                      wantsCustomTime ? "bg-[#FF5A5A]" : "bg-gray-200"
                    }`}
                    aria-label="Toggle custom delivery time"
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${
                        wantsCustomTime ? "left-[calc(100%-1.375rem)]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>

                {wantsCustomTime && (
                  <div className="mt-3.5 space-y-2.5">
                    <div className="flex flex-wrap gap-2.5 sm:gap-3">
                      {DELIVERY_TIME_SLOTS.map((slot) => {
                        const disabled = isSlotDisabled(slot);
                        const isSelected = customTime === slot.label;

                        return (
                          <button
                            key={slot.label}
                            type="button"
                            disabled={disabled}
                            onClick={() => setCustomTime(slot.label)}
                            className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                              disabled
                                ? "border-gray-200 bg-gray-100/70 text-gray-400 cursor-not-allowed opacity-50 select-none"
                                : isSelected
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm ring-2 ring-[var(--color-primary)]/20"
                                : "border-gray-200 bg-white text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] cursor-pointer"
                            }`}
                          >
                            {slot.label}
                          </button>
                        );
                      })}
                    </div>

                    {allSlotsDisabled && (
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                        ⚠️ আজকের জন্য নির্দিষ্ট সময়ের সব স্লট শেষ হয়ে গেছে। জরুরি প্রয়োজনে সাধারণ অর্ডার দিন (যত দ্রুত সম্ভব ডেলিভারি হবে) অথবা <strong>Pre-order (আগামীকাল)</strong> সিলেক্ট করে অগ্রিম সময় নির্বাচন করুন।
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== ROW 3: Payment Method (full width, 1 row) ===== */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center shrink-0">
                <FiCreditCard size={18} />
              </div>
              <h2 className="text-[15px] sm:text-base font-bold text-[var(--color-text-primary)] tracking-tight">
                Payment Method
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs sm:text-sm font-semibold shrink-0">
              <div className="w-4 h-4 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shrink-0">
                <FiCheck size={10} strokeWidth={3} />
              </div>
              <span>Cash on Delivery</span>
            </div>
            <input type="hidden" name="paymentMethod" value="cod" />
          </div>

          {/* ===== MOBILE ONLY: 1-Line Clean Coupon Bar & Compact Bill Summary ===== */}
          <div className="block lg:hidden space-y-3">
            {/* 1-Line Clean Coupon Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--color-text-primary)] flex items-center gap-1.5">
                  <FiTag size={13} className="text-[var(--color-primary)]" />
                  Coupon Code
                </span>
                <button
                  type="button"
                  onClick={() => setIsCouponDrawerOpen(true)}
                  className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200/80 transition-all flex items-center gap-1"
                >
                  <span>🎟️</span>
                  <span>Available Coupons</span>
                </button>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-emerald-700 font-semibold truncate text-[11px]">
                      -৳{appliedCoupon.discountAmount.toLocaleString()} saved
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="font-bold text-red-600 hover:text-red-700 text-xs px-1.5"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2 text-xs uppercase font-mono tracking-wider bg-[var(--color-surface)] border border-gray-200 rounded-xl outline-none focus:border-[var(--color-primary)] text-[var(--color-text-primary)]"
                    disabled={isApplyingCoupon}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:opacity-90 transition disabled:opacity-50 shrink-0"
                  >
                    {isApplyingCoupon ? "..." : "Apply"}
                  </button>
                </div>
              )}
            </div>

            {/* Compact Payment Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-[var(--color-text-primary)]">
                  Payment Summary
                </span>
                <button
                  type="button"
                  onClick={() => setShowMobileItems(!showMobileItems)}
                  className="text-[11px] font-semibold text-[var(--color-primary)] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>{items.length} item{items.length > 1 ? "s" : ""}</span>
                  <FiChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${showMobileItems ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {/* Collapsible item preview */}
              {showMobileItems && (
                <div className="space-y-1.5 py-1.5 max-h-40 overflow-y-auto border-b border-gray-100 mb-1.5 text-xs">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="text-[var(--color-text-muted)] truncate max-w-[210px]">
                        {item.quantity}× {item.name}
                      </span>
                      <span className="font-semibold text-[var(--color-text-primary)] shrink-0">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Pricing breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    ৳{totalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-[var(--color-text-muted)]">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {isShippingLoading ? (
                      <span className="inline-block w-8 h-3 bg-gray-100 rounded animate-pulse" />
                    ) : estimatedShipping === 0 ? (
                      <span className="text-[var(--color-primary)] font-bold">FREE</span>
                    ) : (
                      `৳${estimatedShipping}`
                    )}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-gray-100 font-bold text-xs text-[var(--color-text-primary)]">
                  <span className="text-sm">Total Payable</span>
                  <span className="text-base font-black text-[var(--color-text-primary)]">
                    ৳{grandTotal.toLocaleString()}
                  </span>
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
        currentSubtotal={totalPrice}
        onApplyCoupon={(code: string) => {
          handleApplyCoupon(code);
          setIsCouponDrawerOpen(false);
        }}
        appliedCouponCode={appliedCoupon?.code}
      />
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-9 h-9 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
};

export default CheckoutPage;
