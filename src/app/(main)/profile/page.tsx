'use client';

import React, { useState, useEffect } from 'react';
import { useGetMeQuery, useUpdateProfileMutation } from '@/lib/api/queries';
import { 
  FiUser, 
  FiPhone, 
  FiMapPin, 
  FiCamera, 
  FiSave, 
  FiArrowLeft, 
  FiMail, 
  FiCheckCircle, 
  FiShield, 
  FiCalendar, 
  FiTruck,
  FiActivity
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const ProfilePage = () => {
  const router = useRouter();
  const { data, isLoading, refetch } = useGetMeQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const user = data?.data;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        addressLine: user.shippingAddress?.addressLine || '',
        city: user.shippingAddress?.city || '',
        state: user.shippingAddress?.state || '',
        postalCode: user.shippingAddress?.postalCode || '',
      });
      setPreviewUrl(user.avatar?.url || '');
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      toast.success('Avatar selected! Click Save to apply.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, value.trim());
      }
    });
    if (avatarFile) {
      form.append('avatar', avatarFile);
    }

    try {
      await updateProfile(form).unwrap();
      toast.success('Profile updated successfully! 🎉');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="text-center">
          <div 
            className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin mx-auto"
            style={{ borderTopColor: 'var(--color-primary, #FF5A5A)' }}
          />
          <p className="mt-4 text-sm font-medium text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const role = user?.role || 'user';
  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200/80 shadow-2xs hover:bg-gray-50 hover:border-gray-300 text-gray-700 transition-all cursor-pointer"
              title="Back"
            >
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account Profile</h1>
              <p className="text-xs text-gray-500">Manage and update your personal details</p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => router.push('http://localhost:3000/dashboard')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-primary, #FF5A5A) 12%, transparent)',
                color: 'var(--color-primary, #FF5A5A)'
              }}
            >
              <FiShield size={14} />
              <span>Admin Panel</span>
            </button>
          )}
        </div>

        {/* Profile Container Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
          
          {/* Top Banner with Brand Gradient & Organic Patterns */}
          <div 
            className="relative h-36 sm:h-44 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary, #FF5A5A), color-mix(in srgb, var(--color-primary, #FF5A5A) 70%, black))'
            }}
          >
            {/* Soft decorative background circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-10 left-10 w-40 h-40 rounded-full bg-white/10 blur-lg pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/5 to-black/20 pointer-events-none" />
          </div>

          {/* Profile Identity Bar */}
          <div className="relative px-6 sm:px-8 pb-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20">
              
              {/* Avatar with Camera upload trigger */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white relative">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Profile Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--color-primary, #FF5A5A) 12%, transparent)',
                        color: 'var(--color-primary, #FF5A5A)'
                      }}
                    >
                      <FiUser size={44} />
                    </div>
                  )}
                </div>
                
                <label 
                  htmlFor="avatar-upload"
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-xl bg-white border border-gray-200 shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-700 hover:scale-105 active:scale-95 transition-all"
                  style={{ color: 'var(--color-primary, #FF5A5A)' }}
                  title="Change Avatar"
                >
                  <FiCamera size={16} />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* User Name & Badges */}
              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-1.5">
                    <span>{user?.firstName || 'User'} {user?.lastName || ''}</span>
                    <FiCheckCircle size={18} style={{ color: 'var(--color-primary, #FF5A5A)' }} className="shrink-0" title="Verified Account" />
                  </h2>

                  {/* Role Badge */}
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider self-center sm:self-auto ${
                    isAdmin 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {isAdmin ? <FiShield size={12} /> : <FiUser size={12} />}
                    {role}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs text-gray-500 pt-0.5">
                  <span className="flex items-center gap-1.5 font-medium text-gray-600">
                    <FiMail size={13} className="text-gray-400" />
                    {user?.email || 'No email provided'}
                  </span>
                  
                  {user?.phoneNumber && (
                    <>
                      <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:inline-block" />
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <FiPhone size={13} className="text-gray-400" />
                        {user.phoneNumber}
                      </span>
                    </>
                  )}

                  {user?.createdAt && (
                    <>
                      <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:inline-block" />
                      <span className="flex items-center gap-1.5 text-gray-400">
                        <FiCalendar size={13} />
                        Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {/* Section 1: Personal Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-primary, #FF5A5A) 12%, transparent)',
                    color: 'var(--color-primary, #FF5A5A)'
                  }}
                >
                  <FiUser size={15} />
                </div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">First Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="e.g. Saiful"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Islam"
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Phone Number *</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="e.g. 01711223344"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Email Address (Registered)</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      readOnly
                      disabled
                      value={user?.email || ''}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed outline-none select-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Shipping & Delivery Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-primary, #FF5A5A) 12%, transparent)',
                    color: 'var(--color-primary, #FF5A5A)'
                  }}
                >
                  <FiMapPin size={15} />
                </div>
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Default Delivery Address
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Street / House & Road Address</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleChange}
                    placeholder="e.g. House #12, Road #4, Bangla Bazar"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Barisal"
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">State / Division</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Barisal"
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 8200"
                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-800 outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-gray-400 text-center sm:text-left">
                Keep your profile updated for hassle-free vegetable deliveries.
              </p>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto px-8 py-3 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-60 cursor-pointer hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-primary, #FF5A5A)',
                  boxShadow: '0 10px 25px -5px color-mix(in srgb, var(--color-primary, #FF5A5A) 35%, transparent)'
                }}
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <FiSave size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;