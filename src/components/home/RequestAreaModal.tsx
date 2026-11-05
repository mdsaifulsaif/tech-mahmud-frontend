"use client";

import React, { useState } from "react";
import { useCreateAreaRequestMutation } from "@/redux/api/areaRequestApi";
import toast from "react-hot-toast";

interface RequestAreaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestAreaModal({ isOpen, onClose }: RequestAreaModalProps) {
  const [createAreaRequest, { isLoading }] = useCreateAreaRequestMutation();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    areaName: "",
    city: "Barishal",
    district: "Barishal",
    notes: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.areaName.trim()) {
      toast.error("Please fill in your name, phone number, and area name");
      return;
    }

    try {
      await createAreaRequest({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        areaName: formData.areaName.trim(),
        city: formData.city.trim() || "Barishal",
        district: formData.district.trim() || "Barishal",
        notes: formData.notes.trim() || undefined,
      }).unwrap();

      setIsSuccess(true);
      toast.success("Area request submitted successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit request. Please try again.");
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      areaName: "",
      city: "Barishal",
      district: "Barishal",
      notes: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/60 to-white">
          <div className="flex items-center gap-3.5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-primary, #5CAF90) 15%, white)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z"
                  stroke="var(--color-primary, #5CAF90)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="9"
                  r="2.5"
                  stroke="var(--color-primary, #5CAF90)"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Request Your Area</h3>
              <p className="text-xs text-gray-500">
                Help us bring fresh vegetables & grocery delivery to your door
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-primary, #FF5A5A) 14%, transparent)",
                color: "var(--color-primary, #FF5A5A)"
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-900">Request Received!</h4>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Thank you, <span className="font-semibold text-gray-900">{formData.name}</span>! We have recorded your interest for{" "}
              <span className="font-semibold" style={{ color: "var(--color-primary, #FF5A5A)" }}>{formData.areaName}</span>. Our team will notify you as soon as our delivery service starts in your area!
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3 rounded-xl font-bold text-white text-sm shadow-md transition-all hover:opacity-95 cursor-pointer"
                style={{ backgroundColor: "var(--color-primary, #FF5A5A)" }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Area Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Area / Neighborhood Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.areaName}
                onChange={(e) => setFormData({ ...formData, areaName: e.target.value })}
                placeholder="e.g. Rupatoli, Kashipur, Amanatganj, Natun Bazar"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
              />
            </div>

            {/* Requester Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Email & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  City / District
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value, district: e.target.value })}
                  placeholder="Barishal"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400"
                />
              </div>
            </div>

            {/* Additional Landmark / Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Nearby Landmark / Notes <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Near BM College main gate, or Road 3"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none placeholder-gray-400"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl font-bold text-white text-sm shadow-md transition-all hover:opacity-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: "var(--color-primary, #FF5A5A)" }}
              >
                {isLoading ? "Submitting..." : "Submit Request →"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
