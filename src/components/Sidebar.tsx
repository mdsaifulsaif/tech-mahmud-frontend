"use client";

import Link from "next/link";
import {
  FiGrid,
  FiShoppingBag,
  FiList,
  FiHeart,
  FiShoppingCart,
  FiMapPin,
  FiTag,
  FiSettings,
//   FiHelpCircle,
} from "react-icons/fi";

const menuItems = [
  {
    title: "All Categories",
    href: "/categories",
    icon: FiGrid,
  },
  {
    title: "Fresh Vegetables",
    href: "/cat/fresh-vegetables",
    icon: FiShoppingBag,
  },
  {
    title: "Fresh Fruits",
    href: "/cat/fruits",
    icon: FiShoppingBag,
  },
  {
    title: "Groceries",
    href: "/categories",
    icon: FiList,
  },
  {
    title: "Daily Deals",
    href: "/search?filter=featured",
    icon: FiTag,
  },
  {
    title: "Wishlist",
    href: "/wishlist",
    icon: FiHeart,
  },
  {
    title: "My Orders",
    href: "/orders",
    icon: FiShoppingCart,
  },
  {
    title: "Delivery Area",
    href: "/location",
    icon: FiMapPin,
  },
  {
    title: "Support",
    href: "/support",
    icon: FiSettings,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: FiSettings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[#37651B] mb-6">
          Browse Categories
        </h2>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-[#37651B] hover:text-white transition-all duration-200 group"
              >
                <Icon
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />

                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}