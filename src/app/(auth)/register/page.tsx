"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegisterMutation } from '@/lib/api/queries';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const router = useRouter();
    const [register, { isLoading }] = useRegisterMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        try {
            await register({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phone,
                password: formData.password,
            }).unwrap();

            toast.success('Account created! Enter the 6-digit code we sent to your email.', {
                duration: 5000,
                icon: '📧',
            });

            router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch (err: any) {
            toast.error(err?.message || 'Registration failed. Try again.', {
                duration: 4000
            });
        }
    };

    const handleGoogleRegister = () => {
        signIn("google", { callbackUrl: "/dashboard/user" });
    };

    return (
        <div className="bg-white p-8 rounded-md shadow-2xl shadow-gray-200 border border-gray-100 max-w-lg mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-500 font-medium">Join Tech Mahmud for a better shopping experience</p>
            </div>

            <button
                type="button"
                onClick={handleGoogleRegister}
                className="w-full flex items-center justify-center gap-3 py-3.5 border border-gray-200 rounded-md font-semibold text-gray-700 hover:bg-gray-50 transition-all mb-6"
            >
                <FcGoogle size={20} />
                Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-100" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 px-1">First Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                                <FiUser size={16} />
                            </div>
                            <input
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                                placeholder="John"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                            placeholder="Doe"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                            <FiMail size={16} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Phone Number</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                            <FiPhone size={16} />
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                            placeholder="+880 1XXX-XXXXXX"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                            <FiLock size={16} />
                        </div>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 px-1">Confirm Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors">
                            <FiLock size={16} />
                        </div>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all outline-none"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex items-start gap-2 pt-2">
                    <input
                        id="terms"
                        type="checkbox"
                        required
                        className="mt-1 h-4 w-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)] border-gray-300 rounded cursor-pointer"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-500 font-medium leading-relaxed cursor-pointer">
                        I agree to the <Link href="/terms" className="text-[var(--color-primary)] font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-[var(--color-primary)] font-bold">Privacy Policy</Link>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-md font-bold shadow-xl hover:shadow-gray-200 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed group mt-4"
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            Creating Account...
                        </>
                    ) : (
                        <>
                            Create Account
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                <p className="text-sm text-gray-500 font-medium">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[var(--color-primary)] font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;