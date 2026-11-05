"use client";

import React from 'react';
import { FiTrash2, FiShoppingBag, FiInfo, FiChevronsRight } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/redux';
import {
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    closeMiniCart
} from '@/redux/slices/cartSlice';
import Link from 'next/link';
import Image from 'next/image';

const MiniCart = () => {
    const dispatch = useAppDispatch();
    const { items, totalPrice, isMiniCartOpen } = useAppSelector(state => state.cart);

    if (!isMiniCartOpen) return null;

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className="md:hidden fixed inset-0 bg-black/40 z-40"
                onClick={() => dispatch(closeMiniCart())}
            />

            {/* ✅ Desktop: top-0 right-0, Mobile: bottom sheet */}
            <div className="
                fixed z-50 flex flex-col shadow-2xl bg-white

                top-0 right-0 h-screen w-[340px]

                max-md:top-auto max-md:bottom-0 max-md:left-0 max-md:right-0
                max-md:h-[85vh] max-md:w-full max-md:rounded-t-2xl
            ">

                {/* Top bar */}
                <div className="px-4 py-2 text-xs font-medium text-center bg-gray-800 text-white max-md:rounded-t-2xl">
                    Delivery charge not included
                </div>

                {/* Header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <FiShoppingBag size={18} className="text-[var(--color-primary)]" />
                        <div>
                            <p className="font-bold text-sm text-gray-800">
                                {items.length} Items
                            </p>
                            <p className="text-xs flex items-center gap-1 text-[var(--color-primary)]">
                                Shipping Fee: ৳0
                                <FiInfo size={12} />
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => dispatch(closeMiniCart())}
                        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-500"
                        aria-label="Collapse cart"
                    >
                        <FiChevronsRight size={20} />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                            <FiShoppingBag size={40} />
                            <p className="text-sm">Your cart is empty</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50">

                                {/* Image */}
                                <div className="w-14 h-14 flex-shrink-0 rounded-md overflow-hidden border border-gray-100 bg-gray-50">
                                    {item.thumbnail ? (
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.name}
                                            width={56}
                                            height={56}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiShoppingBag size={20} className="text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm leading-snug line-clamp-2 text-gray-700 mb-2">
                                        {item.name}
                                    </p>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <span className="text-sm font-bold text-[var(--color-primary)]">
                                            ৳{item.price}
                                        </span>
                                        {item.mrp && item.mrp > item.price && (
                                            <span className="text-xs line-through text-gray-400">
                                                ৳{item.mrp}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-gray-200 rounded-full text-xs">
                                            <button
                                                onClick={() => dispatch(decreaseQuantity(item.id))}
                                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                                            >−</button>
                                            <span className="px-2 font-semibold text-gray-800 min-w-[20px] text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => dispatch(increaseQuantity(item.id))}
                                                className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                                            >+</button>
                                        </div>
                                        <button
                                            onClick={() => dispatch(removeFromCart(item.id))}
                                            className="text-red-400 hover:text-red-600 transition-colors"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100">
                    <button className="w-full py-2.5 text-xs flex items-center justify-center gap-1 text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-100">
                        ⌃ Enter special code
                    </button>
                    <Link
                        href="/checkout"
                        onClick={() => dispatch(closeMiniCart())}
                        className="w-full py-3.5 font-bold text-sm uppercase tracking-wide flex items-center justify-between px-5 bg-gradient-to-r from-[#FF5A5A] to-[#FF8B5A] text-white hover:opacity-95 shadow-lg transition-all"
                    >
                        <span>Proceed to Checkout</span>
                        <span className="font-mono text-base font-black">৳{totalPrice.toLocaleString()}</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default MiniCart;