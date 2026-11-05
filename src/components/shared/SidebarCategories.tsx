

// "use client";

// import React from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
// // ⚠️ Assumption: category fetch করার hook টা এই path/name এ আছে ধরে নিয়েছি।
// // আপনার actual redux slice-এ hook-এর নাম/path আলাদা হলে শুধু এই import line টা বদলে দিন।

// const SidebarCategories = () => {
//   const params = useParams();
//   const activeSlug = params?.slug as string;

//   const { data, isLoading, error } = useGetCategoriesQuery(undefined);

//   const categories = data?.data || [];

//   if (isLoading) {
//     return (
//       <div className="p-4 space-y-3">
//         {[...Array(8)].map((_, i) => (
//           <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 text-sm text-gray-400 text-center">
//         ক্যাটাগরি লোড করা যায়নি।
//       </div>
//     );
//   }

//   if (categories.length === 0) {
//     return (
//       <div className="p-4 text-sm text-gray-400 text-center">
//         কোনো ক্যাটাগরি নেই।
//       </div>
//     );
//   }

//   return (
//     <div className="py-3">
//       <h2 className=" py-2 text-sm font-bold text-gray-500 uppercase tracking-wide">
//         ক্যাটাগরি
//       </h2>
//       <nav className="flex flex-col">
//         {categories.map((cat: any) => {
//           const isActive = cat.slug === activeSlug;
//           return (
//             <Link
//               key={cat._id}
//               href={`/${cat.slug}`}
//               className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors border-l-4 ${
//                 isActive
//                   ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold"
//                   : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//               }`}
//             >
//               {cat.iamge ? (
//                 // category-র নিজস্ব icon/thumbnail থাকলে
//                 <img
//                   src={cat.image}
//                   alt={cat.name}
//                   className="w-6 h-6 rounded-md object-cover flex-shrink-0"
//                 />
//               ) : (
//                 <span
//                   className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
//                     isActive ? "bg-[var(--color-primary)]" : "bg-gray-300"
//                   }`}
//                 />
//               )}
//               <span className="truncate">{cat.name}</span>
//             </Link>
//           );
//         })}
//       </nav>
//     </div>
//   );
// };

// export default SidebarCategories;


"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";

const SidebarCategories = () => {
  const pathname = usePathname();
  const activeSlug = pathname?.split("/")[1] || "";

  const { data, isLoading, error } = useGetCategoriesQuery({ limit: 50 });

  const categories = data?.data || [];

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-xs text-gray-400 text-center">
        Failed to load categories.
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-4 text-xs text-gray-400 text-center">
        No categories available.
      </div>
    );
  }

  return (
    <div className="py-3">
      <h2 className="py-2 text-xs font-bold text-gray-500 uppercase tracking-wider px-4">
        Categories
      </h2>
      <nav className="flex flex-col">
        {categories.map((cat: any) => {
          const isActive = cat.slug === activeSlug;

          return (
            <Link
              key={cat._id}
              href={`/cat/${cat.slug}`}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors border-l-4 ${
                isActive
                  ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)] text-[var(--color-primary)] font-semibold"
                  : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="w-7 h-7 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm flex items-center justify-center h-full text-gray-400">🛒</span>
                )}
              </div>
              <span className="truncate">{cat.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default SidebarCategories;