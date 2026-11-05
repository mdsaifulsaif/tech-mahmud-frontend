// src/components/modals/ComplainModal.tsx
"use client";

import { useState, useRef } from "react";
import { useUI } from "@/context/UIContext";
import { useCreateComplaintMutation } from "@/lib/api/queries";
import { X, Upload, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SUBJECTS = [
  "Product Quality Issue",
  "Delivery Problem",
  "Wrong Item Received",
  "Payment Issue",
  "Customer Service",
  "Other",
];

// Bangladeshi mobile number validation (01XXXXXXXXX)
const isValidBDPhone = (phone: string) => {
  const cleaned = phone.replace(/\s+/g, "");
  return /^01[3-9]\d{8}$/.test(cleaned);
};

export default function ComplainModal() {
  const { isComplainModalOpen: isOpen, closeComplainModal } = useUI();

  const [createComplaint, { isLoading }] =
    useCreateComplaintMutation();

  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // =========================
  // Image Change
  // =========================
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Allowed image types
    if (
      !["image/jpeg", "image/png", "image/jpg"].includes(
        file.type
      )
    ) {
      toast.error("Only JPG/PNG allowed");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // =========================
  // Remove Image
  // =========================
  const removeImage = () => {
    setImage(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================
  // Submit Complaint
  // =========================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!subject || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Phone number required + validation
    if (!phoneNumber.trim()) {
      toast.error("Phone number is required.");
      return;
    }

    if (!isValidBDPhone(phoneNumber)) {
      toast.error(
        "Please enter a valid Bangladeshi phone number (e.g. 017XXXXXXXX)"
      );
      return;
    }

    const formData = new FormData();

    formData.append("phoneNumber", phoneNumber.trim());

    formData.append(
      "text",
      `[${subject}] ${description.trim()}`
    );

    if (image) {
      formData.append("images", image);
    }

    try {
      await createComplaint(formData).unwrap();

      // ✅ Success Toast
      toast.success("Complaint submitted successfully!");

      // Reset
      setSubject("");
      setDescription("");
      setPhoneNumber("");
      setImage(null);
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      closeComplainModal();
    } catch (err: any) {
      // ❌ Error Toast
      toast.error(
        err?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* =========================
          Backdrop
      ========================= */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeComplainModal}
      />

      {/* =========================
          Modal
      ========================= */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* =========================
            Header
        ========================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Complain / Feedback
            </h2>

            <p className="text-sm text-gray-500 mt-0.5">
              We're sorry to hear that! Please let us know the
              details.
            </p>
          </div>

          <button
            type="button"
            onClick={closeComplainModal}
            className="p-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* =========================
            Form Body
        ========================= */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4"
        >
          {/* =========================
              Subject
          ========================= */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Subject{" "}
              <span className="text-red-500">*</span>
            </label>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] bg-white transition"
            >
              <option value="">Select a subject</option>

              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* =========================
              Description
          ========================= */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description{" "}
              <span className="text-red-500">*</span>
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Please describe your issue in detail..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] resize-none transition"
            />
          </div>

          {/* =========================
              Phone Number (Required)
          ========================= */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                // Only allow digits
                const value = e.target.value.replace(/\D/g, "");
                // Max 11 digits
                if (value.length <= 11) {
                  setPhoneNumber(value);
                }
              }}
              required
              placeholder="01XXXXXXXXX"
              maxLength={11}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition"
            />
            <p className="mt-1 text-xs text-gray-400">
              Format: 01XXXXXXXXX (11 digits)
            </p>
          </div>

          {/* =========================
              Attach Image (Optional)
          ========================= */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Attach Image{" "}
              <span className="text-gray-400">(Optional)</span>
            </label>

            {!preview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[var(--color-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_6%,white)] transition"
              >
                <Upload className="w-5 h-5 text-gray-400" />

                <div>
                  <p className="text-sm text-gray-600">
                    Choose File
                  </p>

                  <p className="text-xs text-gray-400">
                    Max size: 5MB (jpg, png)
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded-lg border"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* =========================
              Actions
          ========================= */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeComplainModal}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: "var(--color-primary)" }}
              className="px-5 py-2.5 text-sm font-medium text-white rounded-lg hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              {isLoading && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}